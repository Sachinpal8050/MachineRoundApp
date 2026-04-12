import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import ChatScreen from './screens/ChatScreen';
import RemindersScreen from './screens/RemindersScreen';
import {theme} from './theme';
import usePushNotifications from './hooks/usePushNotifications';

const MONO = Platform.OS === 'ios' ? 'Courier New' : 'monospace';

const TABS = [
  {key: 'chat', label: 'Chat', icon: '◎'},
  {key: 'reminders', label: 'Queue', icon: '≡'},
];

function TabBar({active, onPress}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.tabBar, {paddingBottom: insets.bottom || 8}]}>
      {TABS.map(tab => {
        const focused = active === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tabItem}
            onPress={() => onPress(tab.key)}
            activeOpacity={0.7}>
            <Text style={[styles.tabIcon, focused && styles.tabIconActive]}>
              {tab.icon}
            </Text>
            <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function AppInner() {
  const [activeTab, setActiveTab] = useState('chat');
  usePushNotifications();
  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={theme.bg} />

      <View style={[styles.screen, activeTab !== 'chat' && styles.hidden]}>
        <ChatScreen />
      </View>
      <View style={[styles.screen, activeTab !== 'reminders' && styles.hidden]}>
        <RemindersScreen isFocused={activeTab === 'reminders'} />
      </View>

      <TabBar active={activeTab} onPress={setActiveTab} />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppInner />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.bg,
  },
  screen: {
    flex: 1,
  },
  hidden: {
    display: 'none',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: theme.surface,
    borderTopWidth: 1,
    borderTopColor: theme.border,
    paddingTop: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
    paddingBottom: 2,
  },
  tabIcon: {
    fontSize: 20,
    color: theme.textMuted,
  },
  tabIconActive: {
    color: theme.accent,
  },
  tabLabel: {
    fontSize: 10,
    color: theme.textMuted,
    fontFamily: MONO,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  tabLabelActive: {
    color: theme.accent,
  },
});
