import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ActivityIndicator,
  Pressable,
  Vibration,
  SafeAreaView,
} from 'react-native';
import { theme } from '../theme';
import { sendChat } from '../api';

// ── helpers ───────────────────────────────────────────────────────

const MONO = Platform.OS === 'ios' ? 'Courier New' : 'monospace';

function formatTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function shortTime(date) {
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

// ── sub-components ────────────────────────────────────────────────

const BlinkingCursor = () => {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0, duration: 500, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  return <Animated.Text style={[styles.cursor, { opacity }]}>▋</Animated.Text>;
};

const ActionBadge = ({ result }) => {
  if (!result) return null;

  const badges = [];

  if (result.saved) {
    badges.push(
      <View key="saved" style={[styles.badge, styles.badgeSuccess]}>
        <Text style={styles.badgeText}>✓ Reminder saved</Text>
        {result.reminder_id && (
          <Text style={styles.badgeId}>#{result.reminder_id}</Text>
        )}
      </View>
    );
  }

  if (result.deleted_count > 0) {
    badges.push(
      <View key="deleted" style={[styles.badge, styles.badgeDanger]}>
        <Text style={styles.badgeText}>
          ✕ Deleted {result.deleted_count} reminder{result.deleted_count > 1 ? 's' : ''}
          {result.keyword ? ` matching "${result.keyword}"` : ''}
        </Text>
      </View>
    );
  }

  if (result.duplicate_blocked && result.conflict) {
    badges.push(
      <View key="conflict" style={[styles.badge, styles.badgeWarning]}>
        <Text style={styles.badgeText}>⚠ Duplicate blocked</Text>
        <Text style={styles.badgeConflict}>
          #{result.conflict.id} · {result.conflict.task}
        </Text>
        <Text style={styles.badgeTime}>{formatTime(result.conflict.scheduled_at)}</Text>
      </View>
    );
  }

  return badges.length > 0 ? <View style={styles.badgeContainer}>{badges}</View> : null;
};

const TypingDots = () => {
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animate = (dot, delay) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: 1, duration: 350, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0.3, duration: 350, useNativeDriver: true }),
        ])
      ).start();

    animate(dot1, 0);
    animate(dot2, 150);
    animate(dot3, 300);
  }, []);

  return (
    <View style={styles.typingContainer}>
      <View style={styles.typingBubble}>
        {[dot1, dot2, dot3].map((dot, i) => (
          <Animated.View key={i} style={[styles.typingDot, { opacity: dot }]} />
        ))}
      </View>
    </View>
  );
};

// ── message bubble ────────────────────────────────────────────────

const MessageBubble = ({ message, isStreaming }) => {
  const isUser = message.role === 'user';
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 220, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 220, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.messageRow,
        isUser ? styles.messageRowUser : styles.messageRowBot,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      {!isUser && (
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>S</Text>
        </View>
      )}
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleBot]}>
        <View style={styles.bubbleContent}>
          <Text style={[styles.bubbleText, isUser && styles.bubbleTextUser]}>
            {message.content}
          </Text>
          {isStreaming && <BlinkingCursor />}
        </View>

        {/* Action badges for bot messages */}
        {!isUser && message.result && <ActionBadge result={message.result} />}

        <Text style={[styles.timestamp, isUser && styles.timestampUser]}>
          {shortTime(message.createdAt || new Date())}
        </Text>
      </View>
    </Animated.View>
  );
};

// ── quick prompts ─────────────────────────────────────────────────

const QUICK_PROMPTS = [
  'Remind me to standup at 9:45am',
  "What's on my schedule today?",
  'Delete all pending reminders',
  'Remind me urgently at EOD',
];

// ── main screen ───────────────────────────────────────────────────

export default function ChatScreen() {
  const [messages, setMessages] = useState([
    {
      id: '__welcome__',
      role: 'assistant',
      content: "Hey Sachin. What do you need to remember?",
      createdAt: new Date(),
      result: null,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingId, setStreamingId] = useState(null);
  const [showQuick, setShowQuick] = useState(true);

  const flatListRef = useRef(null);
  const abortRef = useRef(null);
  const inputRef = useRef(null);

  // Build OpenAI-style history for the API (exclude welcome message)
  const apiHistory = useMemo(
    () =>
      messages
        .filter(m => m.id !== '__welcome__')
        .map(m => ({ role: m.role, content: m.content })),
    [messages]
  );

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 60);
  }, []);

  const send = useCallback(
    async (text) => {
      const userText = (text || input).trim();
      if (!userText || isLoading) return;

      setInput('');
      setShowQuick(false);
      setIsLoading(true);

      Vibration.vibrate(8);

      const userMsg = {
        id: `u_${Date.now()}`,
        role: 'user',
        content: userText,
        createdAt: new Date(),
      };

      const botMsgId = `b_${Date.now()}`;
      const botMsg = {
        id: botMsgId,
        role: 'assistant',
        content: '',
        createdAt: new Date(),
        result: null,
      };

      setMessages(prev => [...prev, userMsg, botMsg]);
      setStreamingId(botMsgId);
      scrollToBottom();

      // Cancel previous request if any
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const newHistory = [
        ...apiHistory,
        { role: 'user', content: userText },
      ];

      await sendChat(newHistory, userText, {
        signal: controller.signal,

        onChunk: (chunk, accumulated) => {
          setMessages(prev =>
            prev.map(m =>
              m.id === botMsgId ? { ...m, content: accumulated } : m
            )
          );
          scrollToBottom();
        },

        onDone: (result) => {
          setMessages(prev =>
            prev.map(m =>
              m.id === botMsgId
                ? { ...m, content: result.reply || m.content, result }
                : m
            )
          );
          setStreamingId(null);
          setIsLoading(false);
          if (result.saved || result.deleted_count > 0) {
            Vibration.vibrate([0, 40, 60, 40]);
          }
          scrollToBottom();
        },

        onError: (err) => {
          setMessages(prev =>
            prev.map(m =>
              m.id === botMsgId
                ? {
                    ...m,
                    content: `Connection error. Make sure the Spoke server is running.\n\n${err.message}`,
                  }
                : m
            )
          );
          setStreamingId(null);
          setIsLoading(false);
        },
      });
    },
    [input, isLoading, apiHistory, scrollToBottom]
  );

  const handleQuickPrompt = (prompt) => {
    setInput(prompt);
    inputRef.current?.focus();
  };

  const clearChat = () => {
    setMessages([
      {
        id: '__welcome__',
        role: 'assistant',
        content: "Chat cleared. What do you need?",
        createdAt: new Date(),
        result: null,
      },
    ]);
    setShowQuick(true);
  };

  return (
    <SafeAreaView style={styles.root}>
      {/* ── header ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoMark}>
            <Text style={styles.logoText}>⬡</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>Spoke</Text>
            <Text style={styles.headerSub}>personal reminder assistant</Text>
          </View>
        </View>
        <TouchableOpacity onPress={clearChat} style={styles.clearBtn}>
          <Text style={styles.clearBtnText}>clear</Text>
        </TouchableOpacity>
      </View>

      {/* ── messages ── */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={m => m.id}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={scrollToBottom}
          renderItem={({ item }) => (
            <MessageBubble
              message={item}
              isStreaming={streamingId === item.id}
            />
          )}
          ListFooterComponent={
            isLoading && streamingId === null ? <TypingDots /> : null
          }
        />

        {/* ── quick prompts ── */}
        {showQuick && (
          <View style={styles.quickContainer}>
            <Text style={styles.quickLabel}>try asking</Text>
            <View style={styles.quickGrid}>
              {QUICK_PROMPTS.map((p, i) => (
                <Pressable
                  key={i}
                  style={({ pressed }) => [
                    styles.quickChip,
                    pressed && styles.quickChipPressed,
                  ]}
                  onPress={() => handleQuickPrompt(p)}
                >
                  <Text style={styles.quickChipText}>{p}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* ── input bar ── */}
        <View style={styles.inputBar}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Add a reminder..."
            placeholderTextColor={theme.textMuted}
            multiline
            maxLength={300}
            returnKeyType="send"
            onSubmitEditing={() => send()}
            blurOnSubmit={false}
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!input.trim() || isLoading) && styles.sendBtnDisabled]}
            onPress={() => send()}
            disabled={!input.trim() || isLoading}
            activeOpacity={0.75}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={theme.bg} />
            ) : (
              <Text style={styles.sendBtnText}>↑</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ── styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.bg,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    backgroundColor: theme.surface,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoMark: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: theme.accentDim,
    borderWidth: 1,
    borderColor: theme.accentBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 18,
    color: theme.accent,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: theme.text,
    letterSpacing: 0.3,
  },
  headerSub: {
    fontSize: 11,
    color: theme.textMuted,
    fontFamily: MONO,
    letterSpacing: 0.5,
  },
  clearBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: theme.border,
  },
  clearBtnText: {
    fontSize: 12,
    color: theme.textMuted,
    fontFamily: MONO,
    letterSpacing: 0.5,
  },

  // List
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 4,
  },

  // Message rows
  messageRow: {
    flexDirection: 'row',
    marginVertical: 4,
    gap: 8,
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  messageRowBot: {
    justifyContent: 'flex-start',
  },

  // Avatar
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: theme.accentDim,
    borderWidth: 1,
    borderColor: theme.accentBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    flexShrink: 0,
  },
  avatarText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.accent,
  },

  // Bubbles
  bubble: {
    maxWidth: '82%',
    borderRadius: 14,
    padding: 12,
    gap: 6,
  },
  bubbleUser: {
    backgroundColor: theme.accent,
    borderBottomRightRadius: 4,
  },
  bubbleBot: {
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.border,
    borderBottomLeftRadius: 4,
  },
  bubbleContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
  },
  bubbleText: {
    fontSize: 15,
    color: theme.text,
    lineHeight: 22,
    flexShrink: 1,
  },
  bubbleTextUser: {
    color: theme.bg,
  },
  cursor: {
    fontSize: 15,
    color: theme.accent,
    marginLeft: 1,
  },
  timestamp: {
    fontSize: 10,
    color: theme.textMuted,
    fontFamily: MONO,
    marginTop: 2,
  },
  timestampUser: {
    color: 'rgba(0,0,0,0.4)',
    textAlign: 'right',
  },

  // Action badges
  badgeContainer: {
    gap: 6,
    marginTop: 4,
  },
  badge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
    gap: 2,
  },
  badgeSuccess: {
    backgroundColor: theme.successDim,
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.25)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badgeDanger: {
    backgroundColor: theme.dangerDim,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.25)',
  },
  badgeWarning: {
    backgroundColor: theme.warningDim,
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.25)',
  },
  badgeText: {
    fontSize: 12,
    color: theme.text,
    fontWeight: '600',
  },
  badgeId: {
    fontSize: 11,
    color: theme.textSub,
    fontFamily: MONO,
  },
  badgeConflict: {
    fontSize: 12,
    color: theme.textSub,
  },
  badgeTime: {
    fontSize: 11,
    color: theme.textMuted,
    fontFamily: MONO,
  },

  // Typing indicator
  typingContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 14,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.accent,
  },

  // Quick prompts
  quickContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
    gap: 8,
  },
  quickLabel: {
    fontSize: 10,
    color: theme.textMuted,
    fontFamily: MONO,
    letterSpacing: 1,
    textTransform: 'uppercase',
    paddingLeft: 2,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.border,
  },
  quickChipPressed: {
    backgroundColor: theme.accentDim,
    borderColor: theme.accentBorder,
  },
  quickChipText: {
    fontSize: 13,
    color: theme.textSub,
  },

  // Input bar
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: theme.border,
    backgroundColor: theme.surface,
  },
  input: {
    flex: 1,
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: theme.text,
    maxHeight: 120,
    lineHeight: 20,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: theme.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    opacity: 0.35,
  },
  sendBtnText: {
    fontSize: 20,
    color: theme.bg,
    fontWeight: '700',
    lineHeight: 24,
  },
});