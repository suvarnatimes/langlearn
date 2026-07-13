package com.linguaquest.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.linguaquest.data.local.LevelProgressEntity
import com.linguaquest.data.local.VocabularyItemEntity
import com.linguaquest.data.repository.LanguageRepository
import com.linguaquest.speech.NativeSpeechManager
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import javax.inject.Inject

enum class InstructionLanguage {
    ENGLISH,
    TELUGU
}

sealed interface GameplayPhase {
    object LearnAndListen : GameplayPhase
    object WordMatching : GameplayPhase
    object SentenceBuilder : GameplayPhase
    data class Completed(val score: Int, val stars: Int) : GameplayPhase
}

data class MatchingCard(
    val id: String,
    val text: String,
    val isHindi: Boolean,
    val originalId: String,
    var isSelected: Boolean = false,
    var isMatched: Boolean = false,
    var isError: Boolean = false
)

@HiltViewModel
class LanguageViewModel @Inject constructor(
    private val repository: LanguageRepository,
    private val speechManager: NativeSpeechManager
) : ViewModel() {

    // 1. Core Reactive States
    private val _instructionLang = MutableStateFlow(InstructionLanguage.ENGLISH)
    val instructionLang: StateFlow<InstructionLanguage> = _instructionLang.asStateFlow()

    private val _selectedLevelId = MutableStateFlow<Int?>(null)
    val selectedLevelId: StateFlow<Int?> = _selectedLevelId.asStateFlow()

    private val _currentPhase = MutableStateFlow<GameplayPhase>(GameplayPhase.LearnAndListen)
    val currentPhase: StateFlow<GameplayPhase> = _currentPhase.asStateFlow()

    // Combined game progression maps directly from Room flow
    val levelsProgress: StateFlow<List<LevelProgressEntity>> = repository.levelProgressFlow
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    // Active Level Vocabulary state
    private val _activeVocabulary = MutableStateFlow<List<VocabularyItemEntity>>(emptyList())
    val activeVocabulary: StateFlow<List<VocabularyItemEntity>> = _activeVocabulary.asStateFlow()

    // Word Match state
    private val _matchingCards = MutableStateFlow<List<MatchingCard>>(emptyList())
    val matchingCards: StateFlow<List<MatchingCard>> = _matchingCards.asStateFlow()

    // Hilt module setup trigger
    init {
        viewModelScope.launch {
            repository.seedDatabase()
            repository.syncWithRemoteServer()
        }
    }

    fun toggleInstructionLanguage() {
        _instructionLang.value = if (_instructionLang.value == InstructionLanguage.ENGLISH) {
            InstructionLanguage.TELUGU
        } else {
            InstructionLanguage.ENGLISH
        }
    }

    fun selectLevel(levelId: Int) {
        _selectedLevelId.value = levelId
        _currentPhase.value = GameplayPhase.LearnAndListen
        
        viewModelScope.launch {
            repository.getVocabularyForLevel(levelId).collect { list ->
                _activeVocabulary.value = list
                prepareMatchingGame(list)
            }
        }
    }

    fun playHindiSpeech(text: String) {
        speechManager.speakHindi(text)
    }

    private fun prepareMatchingGame(list: List<VocabularyItemEntity>) {
        if (list.isEmpty()) return
        val cards = mutableListOf<MatchingCard>()
        
        // Take up to 4 items for matching
        val targetList = list.take(4)
        targetList.forEach { item ->
            // Hindi Card
            cards.add(
                MatchingCard(
                    id = "${item.id}_hi",
                    text = item.hindiText,
                    isHindi = true,
                    originalId = item.id
                )
            )
            // Translated Card
            val translationText = if (_instructionLang.value == InstructionLanguage.ENGLISH) {
                item.englishTranslation
            } else {
                item.teluguTranslation
            }
            cards.add(
                MatchingCard(
                    id = "${item.id}_trans",
                    text = translationText,
                    isHindi = false,
                    originalId = item.id
                )
            )
        }
        _matchingCards.value = cards.shuffled()
    }

    fun handleCardSelected(selectedCardId: String) {
        val currentCards = _matchingCards.value.map { it.copy() }
        val selectedCard = currentCards.find { it.id == selectedCardId } ?: return
        
        if (selectedCard.isMatched) return

        // Clear previous error flashes
        currentCards.forEach { if (it.isError) it.isError = false }

        val alreadySelected = currentCards.filter { it.isSelected }

        if (alreadySelected.isEmpty()) {
            selectedCard.isSelected = true
            _matchingCards.value = currentCards
        } else if (alreadySelected.size == 1) {
            val firstCard = alreadySelected[0]
            if (firstCard.id == selectedCardId) {
                // Tapped same card, unselect it
                selectedCard.isSelected = false
                _matchingCards.value = currentCards
                return
            }

            // Check if match
            if (firstCard.isHindi != selectedCard.isHindi && firstCard.originalId == selectedCard.originalId) {
                // Correct match
                currentCards.forEach { card ->
                    if (card.id == firstCard.id || card.id == selectedCard.id) {
                        card.isSelected = false
                        card.isMatched = true
                    }
                }
                _matchingCards.value = currentCards
                checkMatchingGameCompletion(currentCards)
            } else {
                // Incorrect match: flash error red and unselect
                currentCards.forEach { card ->
                    if (card.id == firstCard.id || card.id == selectedCard.id) {
                        card.isSelected = false
                        card.isError = true
                    }
                }
                _matchingCards.value = currentCards
            }
        }
    }

    private fun checkMatchingGameCompletion(cards: List<MatchingCard>) {
        if (cards.all { it.isMatched }) {
            // Proceed to Phase 3 Sentence Builder
            viewModelScope.launch {
                _currentPhase.value = GameplayPhase.SentenceBuilder
            }
        }
    }

    fun completeLevel(levelId: Int, starsCount: Int) {
        viewModelScope.launch {
            repository.updateLevelCompleted(levelId, completed = true, stars = starsCount)
            // If it is level 5, passing marks unlock level 6 milestone
            if (levelId == 5) {
                repository.updateMilestonePassed(5, passed = true)
            }
            _currentPhase.value = GameplayPhase.Completed(score = 100, stars = starsCount)
        }
    }

    fun resetGameplay() {
        _selectedLevelId.value = null
        _currentPhase.value = GameplayPhase.LearnAndListen
    }
}
