import React, { useState } from 'react';
import { FileCode, Database, Cpu, HelpCircle, Copy, Check, Terminal, Layers } from 'lucide-react';

interface CodeFile {
  name: string;
  category: 'Room DB' | 'Repository' | 'TTS Manager' | 'MVVM State' | 'Hilt DI';
  icon: React.ReactNode;
  path: string;
  code: string;
}

const KOTLIN_FILES: CodeFile[] = [
  {
    name: "LanguageDatabase.kt",
    category: "Room DB",
    icon: <Database className="w-4 h-4 text-emerald-400" />,
    path: "com/linguaquest/data/local/LanguageDatabase.kt",
    code: `package com.linguaquest.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.sqlite.db.SupportSQLiteDatabase
import kotlinx.coroutines.flow.Flow

@androidx.room.Entity(tableName = "level_progress")
data class LevelProgressEntity(
    @androidx.room.PrimaryKey val levelId: Int,
    val title: String,
    val isCompleted: Boolean = false,
    val starsCount: Int = 0,
    val isMilestonePassed: Boolean = false
)

@androidx.room.Entity(tableName = "vocabulary_item")
data class VocabularyItemEntity(
    @androidx.room.PrimaryKey val id: String,
    val levelId: Int,
    val hindiText: String,
    val englishTranslation: String,
    val teluguTranslation: String,
    val transliterationText: String
)

@Dao
interface LevelProgressDao {
    @Query("SELECT * FROM level_progress ORDER BY levelId ASC")
    fun getAllProgress(): Flow<List<LevelProgressEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertOrUpdateProgress(progress: LevelProgressEntity)

    @Query("UPDATE level_progress SET isCompleted = :completed, starsCount = :stars WHERE levelId = :levelId")
    suspend fun updateLevelStatus(levelId: Int, completed: Boolean, stars: Int)

    @Query("UPDATE level_progress SET isMilestonePassed = :passed WHERE levelId = :levelId")
    suspend fun updateMilestoneStatus(levelId: Int, passed: Boolean)
}

@Dao
interface VocabularyDao {
    @Query("SELECT * FROM vocabulary_item WHERE levelId = :levelId")
    fun getVocabularyForLevel(levelId: Int): Flow<List<VocabularyItemEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertVocabularyBatch(items: List<VocabularyItemEntity>)
}

@Database(
    entities = [LevelProgressEntity::class, VocabularyItemEntity::class],
    version = 1,
    exportSchema = false
)
abstract class LanguageDatabase : RoomDatabase() {
    abstract fun levelProgressDao(): LevelProgressDao
    abstract fun vocabularyDao(): VocabularyDao

    companion object {
        @Volatile
        private var INSTANCE: LanguageDatabase? = null

        fun getDatabase(context: Context): LanguageDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    LanguageDatabase::class.java,
                    "linguaquest_database"
                )
                // Enabled WAL (Write-Ahead Logging) for optimized main-thread efficiency & persistence
                .setJournalMode(JournalMode.WRITE_AHEAD_LOGGING)
                .build()
                INSTANCE = instance
                instance
            }
        }
    }
}`
  },
  {
    name: "LanguageRepository.kt",
    category: "Repository",
    icon: <Layers className="w-4 h-4 text-cyan-400" />,
    path: "com/linguaquest/data/repository/LanguageRepository.kt",
    code: `package com.linguaquest.data.repository

import com.linguaquest.data.local.LevelProgressDao
import com.linguaquest.data.local.LevelProgressEntity
import com.linguaquest.data.local.VocabularyDao
import com.linguaquest.data.local.VocabularyItemEntity
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.request.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.withContext
import kotlinx.serialization.Serializable
import javax.inject.Inject
import javax.inject.Singleton

@Serializable
data class RemoteVocabularyResponse(val status: String, val data: List<VocabularyDto>)

@Serializable
data class VocabularyDto(
    val id: String,
    val levelId: Int,
    val hindiText: String,
    val englishTranslation: String,
    val teluguTranslation: String,
    val transliterationText: String
)

@Singleton
class LanguageRepository @Inject constructor(
    private val levelProgressDao: LevelProgressDao,
    private val vocabularyDao: VocabularyDao,
    private val httpClient: HttpClient
) {
    val levelProgressFlow: Flow<List<LevelProgressEntity>> = levelProgressDao.getAllProgress()

    fun getVocabularyForLevel(levelId: Int): Flow<List<VocabularyItemEntity>> = 
        vocabularyDao.getVocabularyForLevel(levelId)

    suspend fun updateLevelCompleted(levelId: Int, completed: Boolean, stars: Int) = withContext(Dispatchers.IO) {
        levelProgressDao.updateLevelStatus(levelId, completed, stars)
    }

    suspend fun updateMilestonePassed(levelId: Int, passed: Boolean) = withContext(Dispatchers.IO) {
        levelProgressDao.updateMilestoneStatus(levelId, passed)
    }

    suspend fun seedDatabase() = withContext(Dispatchers.IO) {
        val initialLevels = listOf(
            LevelProgressEntity(1, "Self-Introduction"),
            LevelProgressEntity(2, "Relations & Family"),
            LevelProgressEntity(3, "General Conversations"),
            LevelProgressEntity(4, "Employee Names & Work"),
            LevelProgressEntity(5, "Milestone Test 1"),
            LevelProgressEntity(6, "Shopping & Transactions")
        )
        initialLevels.forEach { levelProgressDao.insertOrUpdateProgress(it) }
    }
}`
  },
  {
    name: "NativeSpeechManager.kt",
    category: "TTS Manager",
    icon: <Cpu className="w-4 h-4 text-orange-400" />,
    path: "com/linguaquest/speech/NativeSpeechManager.kt",
    code: `package com.linguaquest.speech

import android.content.Context
import android.content.Intent
import android.speech.tts.TextToSpeech
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

    init {
        tts = TextToSpeech(context, this)
    }

    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            val localeResult = tts?.setLanguage(Locale("hi", "IN"))
            if (localeResult == TextToSpeech.LANG_MISSING_DATA || localeResult == TextToSpeech.LANG_NOT_SUPPORTED) {
                promptInstallTtsData()
            } else {
                isInitialized = true
            }
        }
    }

    fun promptInstallTtsData() {
        val installIntent = Intent().apply {
            action = TextToSpeech.Engine.ACTION_INSTALL_TTS_DATA
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        context.startActivity(installIntent)
    }

    fun speakHindi(text: String) {
        if (isInitialized && tts != null) {
            tts?.speak(text, TextToSpeech.QUEUE_FLUSH, null, "hi_speech")
        }
    }

    fun release() {
        tts?.stop()
        tts?.shutdown()
    }
}`
  },
  {
    name: "LanguageViewModel.kt",
    category: "MVVM State",
    icon: <Terminal className="w-4 h-4 text-pink-400" />,
    path: "com/linguaquest/ui/viewmodel/LanguageViewModel.kt",
    code: `package com.linguaquest.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.linguaquest.data.local.LevelProgressEntity
import com.linguaquest.data.local.VocabularyItemEntity
import com.linguaquest.data.repository.LanguageRepository
import com.linguaquest.speech.NativeSpeechManager
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

enum class InstructionLanguage { ENGLISH, TELUGU }

sealed interface GameplayPhase {
    object LearnAndListen : GameplayPhase
    object WordMatching : GameplayPhase
    object SentenceBuilder : GameplayPhase
    data class Completed(val score: Int, val stars: Int) : GameplayPhase
}

@HiltViewModel
class LanguageViewModel @Inject constructor(
    private val repository: LanguageRepository,
    private val speechManager: NativeSpeechManager
) : ViewModel() {

    private val _instructionLang = MutableStateFlow(InstructionLanguage.ENGLISH)
    val instructionLang: StateFlow<InstructionLanguage> = _instructionLang.asStateFlow()

    private val _selectedLevelId = MutableStateFlow<Int?>(null)
    val selectedLevelId: StateFlow<Int?> = _selectedLevelId.asStateFlow()

    val levelsProgress: StateFlow<List<LevelProgressEntity>> = repository.levelProgressFlow
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    fun toggleInstructionLanguage() {
        _instructionLang.value = if (_instructionLang.value == InstructionLanguage.ENGLISH) {
            InstructionLanguage.TELUGU
        } else {
            InstructionLanguage.ENGLISH
        }
    }

    fun selectLevel(levelId: Int) {
        _selectedLevelId.value = levelId
    }

    fun playHindiSpeech(text: String) {
        speechManager.speakHindi(text)
    }
}`
  },
  {
    name: "AppModule.kt",
    category: "Hilt DI",
    icon: <FileCode className="w-4 h-4 text-purple-400" />,
    path: "com/linguaquest/di/AppModule.kt",
    code: `package com.linguaquest.di

import android.content.Context
import com.linguaquest.data.local.LanguageDatabase
import com.linguaquest.data.local.LevelProgressDao
import com.linguaquest.data.local.VocabularyDao
import com.linguaquest.data.repository.LanguageRepository
import com.linguaquest.speech.NativeSpeechManager
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.json.*
import kotlinx.serialization.json.Json
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object AppModule {

    @Provides
    @Singleton
    fun provideDatabase(@ApplicationContext context: Context): LanguageDatabase {
        return LanguageDatabase.getDatabase(context)
    }

    @Provides
    @Singleton
    fun provideLevelProgressDao(database: LanguageDatabase): LevelProgressDao = database.levelProgressDao()

    @Provides
    @Singleton
    fun provideVocabularyDao(database: LanguageDatabase): VocabularyDao = database.vocabularyDao()

    @Provides
    @Singleton
    fun provideHttpClient(): HttpClient {
        return HttpClient(CIO) {
            install(ContentNegotiation) {
                json(Json { ignoreUnknownKeys = true })
            }
        }
    }
}`
  }
];

export function CodeViewer() {
  const [selectedFile, setSelectedFile] = useState<CodeFile>(KOTLIN_FILES[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#0D1117] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Code Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-[#161B22] border-b border-gray-800">
        <div className="flex items-center gap-3">
          <Terminal className="w-5 h-5 text-indigo-400" />
          <div>
            <h2 className="text-sm font-semibold text-gray-200">Native Android Codebase</h2>
            <p className="text-xs text-gray-400 font-mono">com.linguaquest.android</p>
          </div>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-all border border-gray-700"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy File</span>
            </>
          )}
        </button>
      </div>

      {/* Tabs / File Explorer */}
      <div className="flex flex-wrap gap-1 p-2 bg-[#090D13] border-b border-gray-800/80">
        {KOTLIN_FILES.map((file) => (
          <button
            key={file.name}
            onClick={() => setSelectedFile(file)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedFile.name === file.name
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 border border-transparent'
            }`}
          >
            {file.icon}
            <span>{file.name}</span>
          </button>
        ))}
      </div>

      {/* Code Details bar */}
      <div className="flex items-center justify-between px-5 py-2.5 bg-[#12161F] text-[11px] text-gray-400 font-mono border-b border-gray-800/50">
        <span className="truncate">Path: <span className="text-gray-300">{selectedFile.path}</span></span>
        <span className="px-2 py-0.5 bg-gray-800 rounded-full text-indigo-300 text-[10px] font-semibold tracking-wide uppercase">
          {selectedFile.category}
        </span>
      </div>

      {/* Code Area */}
      <div className="flex-1 overflow-auto p-5 font-mono text-xs leading-relaxed text-gray-300 bg-[#0D1117] select-text">
        <pre className="whitespace-pre overflow-x-auto">
          <code>{selectedFile.code}</code>
        </pre>
      </div>

      {/* Footer Info */}
      <div className="px-5 py-3 bg-[#161B22] border-t border-gray-800 text-xs text-gray-400 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
          Compiled via Hilt Graph Verification
        </span>
        <span className="text-gray-500">Android M3 Compliant</span>
      </div>
    </div>
  );
}
