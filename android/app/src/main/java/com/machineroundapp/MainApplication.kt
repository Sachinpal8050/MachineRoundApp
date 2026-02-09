package com.machineroundapp

import android.app.Application
import android.util.Log
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.load
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.react.flipper.ReactNativeFlipper
import com.facebook.soloader.SoLoader
import java.io.File

class MainApplication : Application(), ReactApplication {

  override val reactNativeHost: ReactNativeHost =
      object : DefaultReactNativeHost(this) {
        override fun getPackages(): List<ReactPackage> {
          val packages = PackageList(this).packages
          packages.add(OTAPackage())
          return packages
        }

        override fun getJSMainModuleName(): String = "index"

        override fun getJSBundleFile(): String? {
          Log.d("OTA", "Loading OTA called")
          val bundleFile = File(
            applicationContext.filesDir,
            "bundle/index.android.bundle"
          )

          Log.d("OTA", "Loading OTA called. Path = ${bundleFile.absolutePath}")

          return if (bundleFile.exists()) {
            Log.d("OTA", "Loading OTA bundle")

            bundleFile.absolutePath   // 🔥 OTA bundle
          } else {
            Log.d("OTA", "Loading embedded bundle")

            super.getJSBundleFile()   // 📦 Default embedded bundle
          }
        }

        override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

        override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
        override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
      }

  override val reactHost: ReactHost
    get() = getDefaultReactHost(this.applicationContext, reactNativeHost)

  override fun onCreate() {
    super.onCreate()
    SoLoader.init(this, false)
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      // If you opted-in for the New Architecture, we load the native entry point for this app.
      load()
    }
    ReactNativeFlipper.initializeFlipper(this, reactNativeHost.reactInstanceManager)
  }
}
