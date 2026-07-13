package com.linguaquest.data.repository

import com.linguaquest.data.local.LevelProgressDao
import com.linguaquest.data.local.LevelProgressEntity
import com.linguaquest.data.local.VocabularyDao
import com.linguaquest.data.local.VocabularyItemEntity
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.request.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.json.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.withContext
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import javax.inject.Inject
import javax.inject.Singleton

@Serializable
data class RemoteVocabularyResponse(
    val status: String,
    val data: List<VocabularyDto>
)

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
    private val httpClient: HttpClient // Injected Ktor client
) {
    val levelProgressFlow: Flow<List<LevelProgressEntity>> = levelProgressDao.getAllProgress()

    fun getVocabularyForLevel(levelId: Int): Flow<List<VocabularyItemEntity>> {
        return vocabularyDao.getVocabularyForLevel(levelId)
    }

    suspend fun updateLevelCompleted(levelId: Int, completed: Boolean, stars: Int) = withContext(Dispatchers.IO) {
        levelProgressDao.updateLevelStatus(levelId, completed, stars)
    }

    suspend fun updateMilestonePassed(levelId: Int, passed: Boolean) = withContext(Dispatchers.IO) {
        levelProgressDao.updateMilestoneStatus(levelId, passed)
    }

    suspend fun seedDatabase() = withContext(Dispatchers.IO) {
        // Pre-populate database with Level Progress items
        val initialLevels = listOf(
            LevelProgressEntity(1, "Self-Introduction", isCompleted = false, starsCount = 0),
            LevelProgressEntity(2, "Relations & Family", isCompleted = false, starsCount = 0),
            LevelProgressEntity(3, "General Conversations", isCompleted = false, starsCount = 0),
            LevelProgressEntity(4, "Employee Names & Work", isCompleted = false, starsCount = 0),
            LevelProgressEntity(5, "Milestone Test 1", isCompleted = false, starsCount = 0),
            LevelProgressEntity(6, "Shopping & Transactions", isCompleted = false, starsCount = 0)
        )
        for (level in initialLevels) {
            levelProgressDao.insertOrUpdateProgress(level)
        }

        val seedVocab = listOf(
            VocabularyItemEntity("v1_1", 1, "Mera naam Rahul hai.", "My name is Rahul.", "Naa peru Rahul.", "मेरा नाम राहुल है।"),
            VocabularyItemEntity("v1_2", 1, "Aapka naam kya hai?", "What is your name?", "Mee peru emiti?", "आपका नाम क्या है?"),
            VocabularyItemEntity("v1_3", 1, "Main America se hoon.", "I am from America.", "Nenu America nundi vachanu.", "मैं अमेरिका से हूँ।"),
            VocabularyItemEntity("v1_4", 1, "Aap kaise hain?", "How are you?", "Meeru ela unnaru?", "आप कैसे हैं?"),
            VocabularyItemEntity("v1_5", 1, "Main theek hoon.", "I am fine.", "Nenu baagunnanu.", "मैं ठीक हूँ।"),
            
            VocabularyItemEntity("v2_1", 2, "Mata", "Mother", "Amma", "माता (माँ)"),
            VocabularyItemEntity("v2_2", 2, "Pita", "Father", "Nanna", "पिता (पापा)"),
            VocabularyItemEntity("v2_3", 2, "Bhai", "Brother", "Thammudu / Anna", "भाई"),
            VocabularyItemEntity("v2_4", 2, "Behen", "Sister", "Chelli / Akka", "बहन"),
            VocabularyItemEntity("v2_5", 2, "Yeh mera parivar hai.", "This is my family.", "Idhi naa kutumbam.", "यह मेरा परिवार है।"),

            VocabularyItemEntity("v3_1", 3, "Namaste", "Hello / Greetings", "Namaskaram", "नमस्ते"),
            VocabularyItemEntity("v3_2", 3, "Dhanyavaad", "Thank you", "Dhanayavaadalu", "धन्यवाद"),
            VocabularyItemEntity("v3_3", 3, "Haan", "Yes", "Avunu", "हाँ"),
            VocabularyItemEntity("v3_4", 3, "Nahi", "No", "Ledu / Kaadu", "नहीं"),
            VocabularyItemEntity("v3_5", 3, "Phir milenge", "See you again", "Malli kaluddham", "फिर मिलेंगे")
        )
        vocabularyDao.insertVocabularyBatch(seedVocab)
    }

    // Tech Stack requirement: Ktor Client with reflection-free Kotlinx Serialization
    suspend fun syncWithRemoteServer() = withContext(Dispatchers.IO) {
        try {
            val response: RemoteVocabularyResponse = httpClient.get("https://api.linguaquest.com/hindi/vocabulary").body()
            if (response.status == "success") {
                val entities = response.data.map { dto ->
                    VocabularyItemEntity(
                        id = dto.id,
                        levelId = dto.levelId,
                        hindiText = dto.hindiText,
                        englishTranslation = dto.englishTranslation,
                        teluguTranslation = dto.teluguTranslation,
                        transliterationText = dto.transliterationText
                    )
                }
                vocabularyDao.insertVocabularyBatch(entities)
            }
        } catch (e: Exception) {
            e.printStackTrace()
            // Gracefully handle network offline, retaining fully seeded local WAL SQLite database
        }
    }
}
