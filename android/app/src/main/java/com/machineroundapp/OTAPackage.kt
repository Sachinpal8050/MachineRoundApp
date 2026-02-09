package com.machineroundapp

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class OTAPackage : ReactPackage {
    override fun createNativeModules(reactContext: ReactApplicationContext) =
        listOf(OTAModule(reactContext))

    override fun createViewManagers(reactContext: ReactApplicationContext):
            List<ViewManager<*, *>> = emptyList()
}