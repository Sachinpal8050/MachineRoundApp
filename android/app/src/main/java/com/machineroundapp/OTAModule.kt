package com.machineroundapp

import com.facebook.react.bridge.*
import java.io.File
import java.io.FileInputStream
import java.io.FileOutputStream
import java.net.HttpURLConnection
import java.net.URL
import java.util.zip.ZipInputStream


class OTAModule(private val reactContext: ReactApplicationContext): ReactContextBaseJavaModule(reactContext)  {

    override fun getName(): String = "OTAModule"

    @ReactMethod
    fun downloadZip(appId: String, version: String, promise: Promise){
//        Thread {
            try{
                val url =
                    URL("http://192.168.1.15:8000/api/v1/upload/download?appId=65f1a9c8e1234abc90123456&currentVersion=1")
                val connection = url.openConnection() as HttpURLConnection
                connection.requestMethod = "GET"
                connection.connectTimeout = 15000
                connection.readTimeout = 15000
                connection.setRequestProperty("Accept", "application/zip")
                connection.connect()
                if(connection.responseCode != HttpURLConnection.HTTP_OK){
                    promise.reject(
                        "HTTP_ERROR",
                        "Code: ${connection.responseCode}"
                    )
//                    return@Thread
                }

                val zipFile = File(reactContext.filesDir, "bundle.zip")
                connection.inputStream.use {
                    input-> FileOutputStream(zipFile).use { output-> input.copyTo(output) }
                }
                val extractDir = File(reactContext.filesDir, "bundle")
                unzip(zipFile, extractDir)
                promise.resolve(extractDir.absolutePath)
            }catch(e: Exception){
                promise.reject("DOWNLOAD_FAILED", e.message)
            }
//        }
    }

    private fun unzip(zipFile: File, targetDir: File) {
        if (!targetDir.exists()) targetDir.mkdirs()
        ZipInputStream(FileInputStream(zipFile)).use { zis ->
            var entry = zis.nextEntry
            while (entry != null) {
                val newFile = File(targetDir, entry.name)

                if (entry.isDirectory) {
                    newFile.mkdirs()
                } else {
                    newFile.parentFile?.mkdirs()
                    FileOutputStream(newFile).use { fos ->
                        zis.copyTo(fos)
                    }
                }
                zis.closeEntry()
                entry = zis.nextEntry
            }
        }
    }
}