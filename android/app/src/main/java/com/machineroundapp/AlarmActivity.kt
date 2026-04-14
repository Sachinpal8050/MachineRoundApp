package com.machineroundapp

import android.app.KeyguardManager
import android.app.NotificationManager
import android.media.Ringtone
import android.media.RingtoneManager
import android.os.Build
import android.os.Bundle
import android.view.WindowManager
import android.widget.Button
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

        playAlarmSound()

        findViewById<Button>(R.id.btnDismiss).setOnClickListener {
            dismissAlarm()
        }
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