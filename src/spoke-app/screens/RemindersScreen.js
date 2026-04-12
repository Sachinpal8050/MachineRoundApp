import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  StyleSheet,
  Animated,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';

import {theme} from '../theme';
import {fetchReminders} from '../api';

const MONO = Platform.OS === 'ios' ? 'Courier New' : 'monospace';

// ── helpers ───────────────────────────────────────────────────────

function formatScheduled(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  const now = new Date();
  const diffMs = d - now;
  const diffMin = Math.round(diffMs / 60000);

  if (diffMin < 0 && diffMin > -60) return `${Math.abs(diffMin)}m ago`;
  if (diffMin < 0) return 'overdue';
  if (diffMin < 60) return `in ${diffMin}m`;
  if (diffMin < 1440) {
    const h = Math.floor(diffMin / 60);
    const m = diffMin % 60;
    return `in ${h}h${m > 0 ? ` ${m}m` : ''}`;
  }
  return d.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function isOverdue(iso) {
  return new Date(iso) < new Date();
}

// ── priority pill ─────────────────────────────────────────────────

const PriorityPill = ({priority}) => {
  const colors = {
    urgent: {
      bg: 'rgba(239,68,68,0.12)',
      text: '#EF4444',
      border: 'rgba(239,68,68,0.3)',
    },
    normal: {
      bg: 'rgba(245,158,11,0.1)',
      text: '#F59E0B',
      border: 'rgba(245,158,11,0.25)',
    },
    low: {
      bg: 'rgba(107,114,128,0.1)',
      text: '#6B7280',
      border: 'rgba(107,114,128,0.25)',
    },
  };
  const c = colors[priority] || colors.normal;
  return (
    <View style={[styles.pill, {backgroundColor: c.bg, borderColor: c.border}]}>
      <Text style={[styles.pillText, {color: c.text}]}>{priority}</Text>
    </View>
  );
};

const CategoryDot = ({category}) => {
  const colors = {
    work: '#3B82F6',
    personal: '#8B5CF6',
    health: '#22C55E',
    finance: '#F59E0B',
    other: '#6B7280',
  };
  return (
    <View
      style={[
        styles.catDot,
        {backgroundColor: colors[category] || colors.other},
      ]}
    />
  );
};

// ── reminder card ─────────────────────────────────────────────────

const ReminderCard = ({item, index}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;
  const overdue = isOverdue(item.scheduled_at);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 280,
        delay: index * 55,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 280,
        delay: index * 55,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.card,
        overdue && styles.cardOverdue,
        {opacity: fadeAnim, transform: [{translateY: slideAnim}]},
      ]}>
      {/* Left accent bar */}
      <View
        style={[
          styles.cardAccent,
          {backgroundColor: overdue ? theme.danger : theme.accent},
        ]}
      />

      <View style={styles.cardBody}>
        {/* Top row */}
        <View style={styles.cardTop}>
          <CategoryDot category={item.category} />
          <Text style={styles.cardId} numberOfLines={1}>
            #{item.id}
          </Text>
          <PriorityPill priority={item.priority} />
          {item.warn_early_mins > 0 && (
            <View style={styles.warnBadge}>
              <Text style={styles.warnText}>
                ⚡ {item.warn_early_mins}m early
              </Text>
            </View>
          )}
        </View>

        {/* Task text */}
        <Text style={styles.cardTask}>{item.task}</Text>

        {/* Bottom row */}
        <View style={styles.cardBottom}>
          <View style={styles.timeRow}>
            <Text
              style={[
                styles.relativeTime,
                overdue && styles.relativeTimeOverdue,
              ]}>
              {formatScheduled(item.scheduled_at)}
            </Text>
            <Text style={styles.absoluteTime}>
              {new Date(item.scheduled_at).toLocaleString('en-IN', {
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })}
            </Text>
          </View>
          {item.category && (
            <Text style={styles.categoryLabel}>{item.category}</Text>
          )}
        </View>
      </View>
    </Animated.View>
  );
};

// ── empty state ───────────────────────────────────────────────────

const EmptyState = () => (
  <View style={styles.emptyState}>
    <Text style={styles.emptyIcon}>◎</Text>
    <Text style={styles.emptyTitle}>All clear</Text>
    <Text style={styles.emptySub}>
      No pending reminders. Go to Chat to add one.
    </Text>
  </View>
);

// ── summary header ────────────────────────────────────────────────

const SummaryBar = ({total, urgent, overdue}) => (
  <View style={styles.summary}>
    <View style={styles.summaryItem}>
      <Text style={styles.summaryNum}>{total}</Text>
      <Text style={styles.summaryLabel}>pending</Text>
    </View>
    <View style={styles.summaryDivider} />
    <View style={styles.summaryItem}>
      <Text style={[styles.summaryNum, urgent > 0 && {color: theme.danger}]}>
        {urgent}
      </Text>
      <Text style={styles.summaryLabel}>urgent</Text>
    </View>
    <View style={styles.summaryDivider} />
    <View style={styles.summaryItem}>
      <Text style={[styles.summaryNum, overdue > 0 && {color: theme.danger}]}>
        {overdue}
      </Text>
      <Text style={styles.summaryLabel}>overdue</Text>
    </View>
  </View>
);

// ── main screen ───────────────────────────────────────────────────

export default function RemindersScreen({isFocused = false}) {
  const [reminders, setReminders] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchReminders();
      setReminders(data);
      setLastUpdated(new Date());
    } catch (e) {
      setError(e.message);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  // Reload whenever the tab becomes visible
  useEffect(() => {
    if (isFocused) load();
  }, [isFocused, load]);

  const stats = {
    total: reminders.length,
    urgent: reminders.filter(r => r.priority === 'urgent').length,
    overdue: reminders.filter(r => isOverdue(r.scheduled_at)).length,
  };

  return (
    <SafeAreaView style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Queue</Text>
          <Text style={styles.headerSub}>
            {lastUpdated
              ? `updated ${lastUpdated.toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })}`
              : 'loading...'}
          </Text>
        </View>
        <TouchableOpacity onPress={load} style={styles.refreshBtn}>
          <Text style={styles.refreshBtnText}>↻ refresh</Text>
        </TouchableOpacity>
      </View>

      {/* Summary bar */}
      {reminders.length > 0 && (
        <SummaryBar
          total={stats.total}
          urgent={stats.urgent}
          overdue={stats.overdue}
        />
      )}

      {/* Error state */}
      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>
            ⚠ Could not connect to server. Make sure Spoke is running.
          </Text>
        </View>
      )}

      {/* List */}
      <FlatList
        data={reminders}
        keyExtractor={item => String(item.id)}
        style={styles.list}
        contentContainerStyle={[
          styles.listContent,
          reminders.length === 0 && styles.listContentEmpty,
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.accent}
            colors={[theme.accent]}
          />
        }
        ListEmptyComponent={!error ? <EmptyState /> : null}
        renderItem={({item, index}) => (
          <ReminderCard item={item} index={index} />
        )}
      />
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
    marginTop: 1,
  },
  refreshBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: theme.border,
  },
  refreshBtnText: {
    fontSize: 12,
    color: theme.textMuted,
    fontFamily: MONO,
  },

  // Summary
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    backgroundColor: theme.surface,
  },
  summaryItem: {
    alignItems: 'center',
    gap: 2,
  },
  summaryNum: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.accent,
    fontFamily: MONO,
  },
  summaryLabel: {
    fontSize: 10,
    color: theme.textMuted,
    fontFamily: MONO,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  summaryDivider: {
    width: 1,
    height: 28,
    backgroundColor: theme.border,
  },

  // Error banner
  errorBanner: {
    margin: 16,
    padding: 12,
    backgroundColor: theme.dangerDim,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.25)',
  },
  errorText: {
    fontSize: 13,
    color: theme.danger,
    lineHeight: 18,
  },

  // List
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    gap: 10,
  },
  listContentEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
  },

  // Card
  card: {
    flexDirection: 'row',
    backgroundColor: theme.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.border,
    overflow: 'hidden',
  },
  cardOverdue: {
    borderColor: 'rgba(239,68,68,0.3)',
  },
  cardAccent: {
    width: 3,
    backgroundColor: theme.accent,
  },
  cardBody: {
    flex: 1,
    padding: 14,
    gap: 8,
  },

  // Card top row
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardId: {
    fontSize: 11,
    color: theme.textMuted,
    fontFamily: MONO,
    flex: 1,
  },

  // Task text
  cardTask: {
    fontSize: 15,
    color: theme.text,
    fontWeight: '500',
    lineHeight: 21,
  },

  // Card bottom
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeRow: {
    gap: 3,
  },
  relativeTime: {
    fontSize: 13,
    color: theme.accent,
    fontWeight: '600',
    fontFamily: MONO,
  },
  relativeTimeOverdue: {
    color: theme.danger,
  },
  absoluteTime: {
    fontSize: 11,
    color: theme.textMuted,
    fontFamily: MONO,
  },
  categoryLabel: {
    fontSize: 11,
    color: theme.textMuted,
    fontFamily: MONO,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },

  // Pills
  pill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
    borderWidth: 1,
  },
  pillText: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: MONO,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },

  // Category dot
  catDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },

  // Warn badge
  warnBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 5,
    backgroundColor: 'rgba(245,158,11,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.2)',
  },
  warnText: {
    fontSize: 10,
    color: theme.accent,
    fontFamily: MONO,
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    color: theme.textMuted,
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.textSub,
  },
  emptySub: {
    fontSize: 14,
    color: theme.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 32,
  },
});
