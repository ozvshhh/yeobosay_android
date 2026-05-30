package com.yeobosay.app.voice

import android.content.Context
import android.media.AudioAttributes
import android.media.AudioFocusRequest
import android.media.AudioManager
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.speech.tts.TextToSpeech
import android.speech.tts.UtteranceProgressListener
import android.util.Log
import java.util.Locale

class GreetingSpeaker(
    context: Context,
) {
    private val appContext = context.applicationContext
    private val mainHandler = Handler(Looper.getMainLooper())
    private val audioManager = appContext.getSystemService(Context.AUDIO_SERVICE) as AudioManager
    private val audioAttributes = AudioAttributes.Builder()
        .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
        .setUsage(AudioAttributes.USAGE_MEDIA)
        .build()
    private var textToSpeech: TextToSpeech? = null
    private var isReady = false
    private var pendingGreeting: PendingGreeting? = null
    private var onComplete: (() -> Unit)? = null
    private var audioFocusRequest: AudioFocusRequest? = null

    init {
        textToSpeech = TextToSpeech(appContext) { status ->
            mainHandler.post {
                handleTextToSpeechInitialized(status)
            }
        }
    }

    fun speak(text: String, onComplete: () -> Unit = {}) {
        mainHandler.post {
            stopOnMain(invokeCallback = false)
            if (!isReady) {
                pendingGreeting = PendingGreeting(text, onComplete)
                return@post
            }

            this.onComplete = onComplete
            requestAudioFocus()
            val params = Bundle().apply {
                putFloat(TextToSpeech.Engine.KEY_PARAM_VOLUME, 1.0f)
            }
            val result = textToSpeech?.speak(
                text,
                TextToSpeech.QUEUE_FLUSH,
                params,
                GREETING_UTTERANCE_ID,
            ) ?: TextToSpeech.ERROR

            if (result == TextToSpeech.ERROR) {
                Log.w(TAG, "Failed to start greeting TTS.")
                finishPlayback()
            }
        }
    }

    fun stop(invokeCallback: Boolean = true) {
        mainHandler.post {
            stopOnMain(invokeCallback)
        }
    }

    fun shutdown() {
        mainHandler.post {
            pendingGreeting = null
            onComplete = null
            textToSpeech?.stop()
            textToSpeech?.shutdown()
            textToSpeech = null
            isReady = false
            abandonAudioFocus()
        }
    }

    private fun handleTextToSpeechInitialized(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            val engine = textToSpeech ?: return
            val languageResult = engine.setLanguage(Locale.KOREA)
            if (
                languageResult == TextToSpeech.LANG_MISSING_DATA ||
                languageResult == TextToSpeech.LANG_NOT_SUPPORTED
            ) {
                Log.w(TAG, "Korean TTS language is not available on this device.")
            }

            engine.setAudioAttributes(audioAttributes)
            engine.setSpeechRate(0.88f)
            engine.setPitch(0.95f)
            engine.setOnUtteranceProgressListener(
                object : UtteranceProgressListener() {
                    override fun onStart(utteranceId: String?) = Unit

                    override fun onDone(utteranceId: String?) {
                        mainHandler.post { finishPlayback() }
                    }

                    @Deprecated("Deprecated in Java")
                    override fun onError(utteranceId: String?) {
                        mainHandler.post {
                            Log.w(TAG, "Greeting TTS playback failed.")
                            finishPlayback()
                        }
                    }
                },
            )
            isReady = true
            pendingGreeting?.let {
                pendingGreeting = null
                speak(it.text, it.onComplete)
            }
        } else {
            Log.w(TAG, "TTS initialization failed: $status")
            pendingGreeting?.onComplete?.invoke()
            pendingGreeting = null
        }
    }

    private fun requestAudioFocus() {
        val request = AudioFocusRequest.Builder(AudioManager.AUDIOFOCUS_GAIN_TRANSIENT)
            .setAudioAttributes(audioAttributes)
            .setOnAudioFocusChangeListener { }
            .build()
        audioFocusRequest = request
        audioManager.requestAudioFocus(request)
    }

    private fun abandonAudioFocus() {
        audioFocusRequest?.let { audioManager.abandonAudioFocusRequest(it) }
        audioFocusRequest = null
    }

    private fun stopOnMain(invokeCallback: Boolean) {
        pendingGreeting = null
        textToSpeech?.stop()
        abandonAudioFocus()
        if (invokeCallback) finishPlayback()
    }

    private fun finishPlayback() {
        abandonAudioFocus()
        val callback = onComplete
        onComplete = null
        callback?.invoke()
    }

    private data class PendingGreeting(
        val text: String,
        val onComplete: () -> Unit,
    )

    private companion object {
        const val GREETING_UTTERANCE_ID = "yeobosay-greeting"
        const val TAG = "GreetingSpeaker"
    }
}
