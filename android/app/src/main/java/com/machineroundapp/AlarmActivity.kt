package com.machineroundapp

import android.app.AlarmManager
import android.app.KeyguardManager
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Intent
import android.media.Ringtone
import android.media.RingtoneManager
import android.os.Build
import android.os.Bundle
import android.view.WindowManager
import android.widget.Button
import android.widget.TextView
import androidx.annotation.RequiresApi
import androidx.appcompat.app.AppCompatActivity


class AlarmActivity : AppCompatActivity() {

    private lateinit var ringtone: Ringtone

    @RequiresApi(Build.VERSION_CODES.O)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Turn screen on and show over lock screen
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
            setShowWhenLocked(true)  // modern way
            setTurnScreenOn(true)    // modern way
        } else {
            window.addFlags(
                WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED or
                        WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON
            )
        }

        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)

        // Unlock keyguard so activity shows over lock screen
        val keyguardManager = getSystemService(KeyguardManager::class.java)
        keyguardManager.requestDismissKeyguard(this, null)

        setContentView(R.layout.activity_alarm)

        val title = intent.getStringExtra("title") ?: "Alarm"
        val body = intent.getStringExtra("body") ?: "You have an alarm"
        findViewById<TextView>(R.id.tvTitle).text = title
        findViewById<TextView>(R.id.tvBody).text = body


        playAlarmSound()

        findViewById<Button>(R.id.btnDismiss).setOnClickListener {
            dismissAlarm()
        }

        findViewById<Button>(R.id.btnSnooze).setOnClickListener {
            snoozeAlarm(title, body)
        }
    }

    private fun snoozeAlarm(title: String, body: String) {
        // Stop current sound
        if (::ringtone.isInitialized && ringtone.isPlaying) ringtone.stop()

        // Cancel current notification
        getSystemService(NotificationManager::class.java).cancel(999)

        // Reschedule alarm 5 minutes later
        val alarmManager = getSystemService(AlarmManager::class.java)
        val triggerTime = System.currentTimeMillis() + (5 * 60 * 1000) // 5 min

        val intent = Intent(this, AlarmReceiver::class.java).apply {
            putExtra("title", title)
            putExtra("body", body)
        }

        val pendingIntent = PendingIntent.getBroadcast(
            this, 0, intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            if (alarmManager.canScheduleExactAlarms()) {
                alarmManager.setExactAndAllowWhileIdle(
                    AlarmManager.RTC_WAKEUP, triggerTime, pendingIntent
                )
            }
        } else {
            alarmManager.setExactAndAllowWhileIdle(
                AlarmManager.RTC_WAKEUP, triggerTime, pendingIntent
            )
        }

        finish()
    }


    private fun playAlarmSound() {
        val alarmUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM)
        ringtone = RingtoneManager.getRingtone(this, alarmUri)
        ringtone.play()
    }

    private fun dismissAlarm() {
        if (::ringtone.isInitialized && ringtone.isPlaying) ringtone.stop()
        getSystemService(NotificationManager::class.java).cancel(999)
        finish()
    }

    override fun onDestroy() {
        super.onDestroy()
        if (::ringtone.isInitialized && ringtone.isPlaying) ringtone.stop()
    }
}