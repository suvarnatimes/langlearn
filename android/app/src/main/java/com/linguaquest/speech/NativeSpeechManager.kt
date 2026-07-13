package com.linguaquest.speech

import android.content.Context
import android.content.Intent
import android.speech.tts.TextToSpeech
import android.speech.tts.UtteranceProgressListener
import android.util.Log
import java.util.Locale
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class NativeSpeechManager @Inject constructor(
    private val context: Context
) : TextToSpeech.OnInitListener {

    private var tts: TextToSpeech? = null
    private var isInitialized = false
    private var isHindiVoiceInstalled = false

    init {
        // Initialize the Native Android TextToSpeech engine
        tts = TextToSpeech(context, this)
    }

    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            val localeResult = tts?.setLanguage(Locale("hi", "IN"))
            if (localeResult == TextToSpeech.LANG_MISSING_DATA || localeResult == TextToSpeech.LANG_NOT_SUPPORTED) {
                Log.e("NativeSpeechManager", "Hindi language is not supported or resources are missing.")
                isHindiVoiceInstalled = false
                // Trigger Wi-Fi high-fidelity Hindi voice download intent
                promptInstallTtsData()
            } else {
                isInitialized = true
                isHindiVoiceInstalled = true
                checkHighFidelityVoiceQuality()
            }
        } else {
            Log.e("NativeSpeechManager", "TextToSpeech Initialization failed!")
        }
    }

    private fun checkHighFidelityVoiceQuality() {
        tts?.let { engine ->
            val voices = engine.voices
            val hindiVoiceAvailable = voices.any { voice ->
                voice.locale.language == "hi" && !voice.isNetworkConnectionRequired
            }
            if (!hindiVoiceAvailable) {
                Log.w("NativeSpeechManager", "No high-fidelity offline Hindi voice detected. Invoking downloader.")
                promptInstallTtsData()
            }
        }
    }

    /**
     * Requirement: If high-fidelity Hindi voice resources are missing,
     * invoke the system ACTION_INSTALL_TTS_DATA intent to download them over Wi-Fi.
     */
    fun promptInstallTtsData() {
        try {
            val installIntent = Intent().apply {
                action = TextToSpeech.Engine.ACTION_INSTALL_TTS_DATA
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            context.startActivity(installIntent)
        } catch (e: Exception) {
            Log.e("NativeSpeechManager", "Failed to launch TTS download intent", e)
        }
    }

    fun speakHindi(text: String, utteranceId: String = "hi_speech") {
        if (isInitialized && tts != null) {
            tts?.speak(text, TextToSpeech.QUEUE_FLUSH, null, utteranceId)
        } else {
            Log.w("NativeSpeechManager", "Speech manager not ready. Re-initializing...")
            tts = TextToSpeech(context, this)
        }
    }

    fun stopSpeech() {
        tts?.stop()
    }

    fun setSpeechRate(rate: Float) {
        tts?.setSpeechRate(rate)
    }

    fun release() {
        tts?.stop()
        tts?.shutdown()
        tts = null
        isInitialized = false
    }
}
