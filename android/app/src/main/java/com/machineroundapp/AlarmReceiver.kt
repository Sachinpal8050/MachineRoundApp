package com.machineroundapp

import android.app.AlarmManager
import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.media.RingtoneManager
import android.os.Build
import android.util.Log
import androidx.annotation.RequiresApi
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import androidx.media3.common.AudioAttributes

class AlarmReceiver : BroadcastReceiver() {

    companion object {
        const val CHANNEL_ID = "ALARM_CHANNEL_V3"
        const val NOTIFICATION_ID = 999
        const val ACTION_DISMISS = "ACTION_DISMISS_ALARM"
        const val ACTION_SNOOZE = "ACTION_SNOOZE"
    }

    @RequiresApi(Build.VERSION_CODES.O)
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == ACTION_DISMISS) {
            context.getSystemService(NotificationManager::class.java)
                .cancel(NOTIFICATION_ID)
            return
        }

        if (intent.action == ACTION_SNOOZE){
            val title = intent.getStringExtra("title") ?: ""
            val body = intent.getStringExtra("body") ?: ""

            // Cancel current notification
            val manager = NotificationManagerCompat.from(context)
            manager.cancel(NOTIFICATION_ID)

            // Schedule snooze (5 min)
//            val triggerTime = System.currentTimeMillis() + 5 * 60 * 1000
            val triggerTime = System.currentTimeMillis() + 10 * 1000

            val alarmIntent = Intent(context, AlarmReceiver::class.java).apply {
                putExtra("title", title)
                putExtra("body", body)
            }

            val pendingIntent = PendingIntent.getBroadcast(
                context,
                System.currentTimeMillis().toInt(),
                alarmIntent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )

            val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager

            alarmManager.setExactAndAllowWhileIdle(
                AlarmManager.RTC_WAKEUP,
                triggerTime,
                pendingIntent
            )
            return;
        }
        // Read data passed from FirebaseService
        val title = intent.getStringExtra("title") ?: "Alarm"
        val body = intent.getStringExtra("body") ?: "You have an alarm"


        createNotificationChannel(context)
        showFullScreenAlarm(context, title, body)
    }

    private fun showFullScreenAlarm(context: Context, title: String, body: String) {

        // This is what auto launches AlarmActivity like a real alarm app
        val fullScreenIntent = Intent(context, AlarmActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or
                    Intent.FLAG_ACTIVITY_CLEAR_TASK or
                    Intent.FLAG_ACTIVITY_NO_USER_ACTION
            putExtra("title", title)  // ← pass to activity
            putExtra("body", body)    // ← pass to activity
        }

        val fullScreenPendingIntent = PendingIntent.getActivity(
            context, 0, fullScreenIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        // Dismiss action
        val dismissIntent = Intent(context, AlarmReceiver::class.java).apply {
            action = ACTION_DISMISS
        }
        val dismissPendingIntent = PendingIntent.getBroadcast(
            context, 1, dismissIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val snoozeIntent = Intent(context, AlarmReceiver::class.java).apply {
            action = ACTION_SNOOZE
            putExtra("title", title)
            putExtra("body", body)
        }

        val snoozePendingIntent = PendingIntent.getBroadcast(
            context,
            1,
            snoozeIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val notification = NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_launcher_foreground)
            .setContentTitle(title)   // ← show FCM title here
            .setContentText(body)     // ← show FCM body here
            .setPriority(NotificationCompat.PRIORITY_MAX)
            .setCategory(NotificationCompat.CATEGORY_ALARM)
            .setFullScreenIntent(fullScreenPendingIntent, true) // ← THIS is the magic
            .setOngoing(true)
            .setAutoCancel(false)
            .addAction(0, "Dismiss", dismissPendingIntent)
            .addAction(1, "Snooze 5m", snoozePendingIntent)
            .build()

        context.getSystemService(NotificationManager::class.java)
            .notify(NOTIFICATION_ID, notification)
    }

    @RequiresApi(Build.VERSION_CODES.O)
    private fun createNotificationChannel(context: Context) {
        val alarmSound = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM)
        val audioAttributes = android.media.AudioAttributes.Builder()
            .setUsage(android.media.AudioAttributes.USAGE_ALARM)
            .setContentType(android.media.AudioAttributes.CONTENT_TYPE_SONIFICATION)
            .build()

        val channel = NotificationChannel(
            CHANNEL_ID, "Alarm Channel",
            NotificationManager.IMPORTANCE_HIGH
        ).apply {
            lockscreenVisibility = Notification.VISIBILITY_PUBLIC
            enableVibration(true)
            vibrationPattern = longArrayOf(0, 500, 200, 500)
            setSound(alarmSound, audioAttributes)
            setBypassDnd(true)
        }

        context.getSystemService(NotificationManager::class.java)
            .createNotificationChannel(channel)
    }
}