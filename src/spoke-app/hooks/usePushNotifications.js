import {useEffect} from 'react';
import {Alert, Platform, PermissionsAndroid} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {BASE_URL} from '../api';

// ── register token with Spoke server ─────────────────────────────

async function registerToken(token) {
  try {
    await fetch(`${BASE_URL}/register-token`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({token}),
    });
    console.log('[spoke] token registered with server');
  } catch (e) {
    console.warn('[spoke] could not register token:', e.message);
  }
}

// ── request permission ────────────────────────────────────────────

async function requestNotificationPermission() {
  // ── Android ──────────────────────────────────────────────────
  if (Platform.OS === 'android') {
    // POST_NOTIFICATIONS is only required on Android 13+ (API 33+)
    if (Platform.Version >= 33) {
      const status = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        {
          title: 'Allow Notifications',
          message: 'Spoke needs permission to send you reminder notifications.',
          buttonPositive: 'Allow',
          buttonNegative: 'Deny',
        },
      );

      if (status === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      }

      if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        Alert.alert(
          'Notifications Blocked',
          'You permanently denied notifications. Enable them in Settings → Apps → Spoke → Notifications.',
          [{text: 'OK'}],
        );
      }

      return false;
    }

    // Android 12 and below — permission is auto-granted, no prompt needed
    return true;
  }

  // ── iOS ───────────────────────────────────────────────────────
  if (Platform.OS === 'ios') {
    const authStatus = await messaging().requestPermission();
    const granted =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!granted) {
      Alert.alert(
        'Notifications Disabled',
        'Enable notifications in Settings → Spoke → Notifications to receive reminders.',
        [{text: 'OK'}],
      );
    }

    return granted;
  }

  return false;
}

// ── hook ──────────────────────────────────────────────────────────

export default function usePushNotifications() {
  useEffect(() => {
    const setup = async () => {
      const granted = await requestNotificationPermission();
      if (!granted) return;

      // get current token and register with server
      const token = await messaging().getToken();
      await registerToken(token);
    };

    setup();

    // auto re-register if Firebase rotates the token
    const unsubRefresh = messaging().onTokenRefresh(async newToken => {
      console.log('[spoke] FCM token refreshed');
      await registerToken(newToken);
    });

    // foreground notifications (app is open)
    const unsubForeground = messaging().onMessage(async remoteMessage => {
      const {title, body} = remoteMessage.notification ?? {};
      Alert.alert(title ?? 'Reminder', body ?? '');
    });

    // user tapped notification while app was in background
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        '[spoke] opened from background:',
        remoteMessage.notification,
      );
    });

    // user tapped notification when app was fully closed
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            '[spoke] opened from quit state:',
            remoteMessage.notification,
          );
        }
      });

    return () => {
      unsubRefresh();
      unsubForeground();
    };
  }, []);
}
