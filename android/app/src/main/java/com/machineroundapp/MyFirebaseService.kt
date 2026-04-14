package com.machineroundapp

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import android.util.Log
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage

class MyFirebaseService : FirebaseMessagingService() {

    override fun onMessageReceived(message: RemoteMessage) {
        super.onMessageReceived(message)
        Log.d("FCM", "Message received — scheduling alarm in 2 seconds")

        val title = message.data["title"] ?: "Alarm"
        val body = message.data["body"] ?: "You have an alarm"
        // Schedule alarm 2 seconds from now
        scheduleAlarm(this, title, body)
    }

    private fun scheduleAlarm(context: Context, title: String, body: String) {
        val alarmManager = context.getSystemService(AlarmManager::class.java)
        val triggerTime = System.currentTimeMillis() + 10 // 2 seconds

        val intent = Intent(context, AlarmReceiver::class.java).apply {
            putExtra("title", title)  // ← pass here
            putExtra("body", body)    // ← pass here
        }
        val pendingIntent = PendingIntent.getBroadcast(
            context, 0, intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            if (alarmManager.canScheduleExactAlarms()) {
                alarmManager.setExactAndAllowWhileIdle(
                    AlarmManager.RTC_WAKEUP,
                    triggerTime,
                    pendingIntent
                )
                Log.d("FCM", "Alarm scheduled for 2 seconds later ✅")
            } else {
                Log.e("FCM", "Cannot schedule exact alarms — permission missing")
            }
        } else {
            alarmManager.setExactAndAllowWhileIdle(
                AlarmManager.RTC_WAKEUP,
                triggerTime,
                pendingIntent
            )
        }
    }

    override fun onNewToken(token: String) {
        super.onNewToken(token)
        Log.d("FCM", "New token: $token")
    }
}