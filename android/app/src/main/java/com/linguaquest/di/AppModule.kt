package com.linguaquest.di

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
    fun provideLevelProgressDao(database: LanguageDatabase): LevelProgressDao {
        return database.levelProgressDao()
    }

    @Provides
    @Singleton
    fun provideVocabularyDao(database: LanguageDatabase): VocabularyDao {
        return database.vocabularyDao()
    }

    @Provides
    @Singleton
    fun provideHttpClient(): HttpClient {
        return HttpClient(CIO) {
            install(ContentNegotiation) {
                json(Json {
                    ignoreUnknownKeys = true
                    prettyPrint = true
                    isLenient = true
                })
            }
        }
    }

    @Provides
    @Singleton
    fun provideNativeSpeechManager(@ApplicationContext context: Context): NativeSpeechManager {
        return NativeSpeechManager(context)
    }

    @Provides
    @Singleton
    fun provideRepository(
        levelProgressDao: LevelProgressDao,
        vocabularyDao: VocabularyDao,
        httpClient: HttpClient
    ): LanguageRepository {
        return LanguageRepository(levelProgressDao, vocabularyDao, httpClient)
    }
}
