package com.linguaquest.data.local

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
                // 1. Tech Stack requirement: WAL (Write-Ahead Logging) enabled for offline performance and lightweight data persistence.
                .setJournalMode(JournalMode.WRITE_AHEAD_LOGGING)
                .addCallback(object : RoomDatabase.Callback() {
                    override fun onCreate(db: SupportSQLiteDatabase) {
                        super.onCreate(db)
                        // Trigger seeding in an external scope if required
                    }
                })
                .build()
                INSTANCE = instance
                instance
            }
        }
    }
}
