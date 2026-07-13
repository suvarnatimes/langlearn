import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Volume2, Check, X, RotateCcw, Lock, Star, ChevronRight, 
  ArrowLeft, HelpCircle, Sparkles, Award, AlertCircle, Settings,
  ShieldCheck, Wifi, Battery, Play, Languages, RefreshCw, Layers, BookOpen,
  Search, Trophy
} from 'lucide-react';
import { LEVELS, Level, VocabularyItem, MatchPair, SentenceBuilder } from '../data/courses';
import { 
  HINDI_VERBS, HINDI_TENSES, HINDI_CONJUNCTIONS, DYNAMIC_TESTS_POOL, 
  VerbItem, TenseItem, ConjunctionItem, CustomTestQuestion 
} from '../data/encyclopedia';

// TTS support checking and execution
export function speakHindiText(text: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      resolve(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    
    // Try to lock high-fidelity Hindi voice
    const voices = window.speechSynthesis.getVoices();
    const hiVoice = voices.find(v => v.lang.startsWith('hi'));
    if (hiVoice) {
      utterance.voice = hiVoice;
    }
    
    utterance.onend = () => resolve(true);
    utterance.onerror = () => resolve(false);
    window.speechSynthesis.speak(utterance);
  });
}

export function AndroidEmulator() {
  // Application settings and progression states (Backed by LocalStorage)
  const [useTelugu, setUseTelugu] = useState<boolean>(() => {
    const saved = localStorage.getItem('lq_use_telugu');
    return saved ? JSON.parse(saved) : false;
  });

  // Main UI Navigation tab state
  const [mainTab, setMainTab] = useState<'pathway' | 'encyclopedia' | 'practice'>('pathway');

  // Encyclopedia states
  const [encyclopediaTab, setEncyclopediaTab] = useState<'verbs' | 'tenses' | 'conjunctions'>('verbs');
  const [selectedVerb, setSelectedVerb] = useState<VerbItem | null>(null);
  const [selectedTense, setSelectedTense] = useState<TenseItem | null>(null);
  const [selectedConjunction, setSelectedConjunction] = useState<ConjunctionItem | null>(null);
  const [verbSearch, setVerbSearch] = useState<string>('');

  // Practice Lab (Randomized Test Page) states
  const [practiceLevel, setPracticeLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [practiceCount, setPracticeCount] = useState<number>(5);
  const [practiceActive, setPracticeActive] = useState<boolean>(false);
  const [practiceQuestions, setPracticeQuestions] = useState<CustomTestQuestion[]>([]);
  const [practiceIndex, setPracticeIndex] = useState<number>(0);
  const [practiceScore, setPracticeScore] = useState<number>(0);
  const [practiceCheckResult, setPracticeCheckResult] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [practiceSelectedOption, setPracticeSelectedOption] = useState<string | null>(null);
  const [practiceSentenceChips, setPracticeSentenceChips] = useState<string[]>([]);
  const [practiceAvailableChips, setPracticeAvailableChips] = useState<string[]>([]);
  const [practiceFinished, setPracticeFinished] = useState<boolean>(false);

  const [completedLevels, setCompletedLevels] = useState<number[]>(() => {
    const saved = localStorage.getItem('lq_completed_levels');
    return saved ? JSON.parse(saved) : [1]; // Start with level 1 completed or empty. Let's start empty.
  });

  const [levelStars, setLevelStars] = useState<Record<number, number>>(() => {
    const saved = localStorage.getItem('lq_level_stars');
    return saved ? JSON.parse(saved) : {};
  });

  const [isMilestonePassed, setIsMilestonePassed] = useState<boolean>(() => {
    const saved = localStorage.getItem('lq_milestone_passed');
    return saved ? JSON.parse(saved) : false;
  });

  const [isMilestone2Passed, setIsMilestone2Passed] = useState<boolean>(() => {
    const saved = localStorage.getItem('lq_milestone2_passed');
    return saved ? JSON.parse(saved) : false;
  });

  const [isGraduated, setIsGraduated] = useState<boolean>(() => {
    const saved = localStorage.getItem('lq_graduated');
    return saved ? JSON.parse(saved) : false;
  });

  const [isMilestone3Passed, setIsMilestone3Passed] = useState<boolean>(() => {
    const saved = localStorage.getItem('lq_milestone3_passed');
    return saved ? JSON.parse(saved) : false;
  });

  const [isNotesOpen, setIsNotesOpen] = useState<boolean>(false);

  // Linguistic Mentor Chat states
  const [isLinguistChatOpen, setIsLinguistChatOpen] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'model'; text: string }[]>([
    {
      role: 'model',
      text: "Namaste! I am Dr. Vyas, your Linguistic Expert Mentor. Ask me anything about Hindi syntax, phonetics, grammatical gender, postpositions, or comparative grammar for English & Telugu speakers!"
    }
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);

  const [currentLevel, setCurrentLevel] = useState<Level | null>(null);
  const [gamePhase, setGamePhase] = useState<'learn' | 'match' | 'sentence' | 'completed'>('learn');
  const [phaseIndex, setPhaseIndex] = useState<number>(0); // 0: Learn, 1: Match, 2: Sentence

  // Active time state for top status bar
  const [currentTime, setCurrentTime] = useState('');
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  // Save states to local storage on changes
  useEffect(() => {
    localStorage.setItem('lq_use_telugu', JSON.stringify(useTelugu));
  }, [useTelugu]);

  useEffect(() => {
    localStorage.setItem('lq_completed_levels', JSON.stringify(completedLevels));
  }, [completedLevels]);

  useEffect(() => {
    localStorage.setItem('lq_level_stars', JSON.stringify(levelStars));
  }, [levelStars]);

  useEffect(() => {
    localStorage.setItem('lq_milestone_passed', JSON.stringify(isMilestonePassed));
  }, [isMilestonePassed]);

  useEffect(() => {
    localStorage.setItem('lq_milestone2_passed', JSON.stringify(isMilestone2Passed));
  }, [isMilestone2Passed]);

  useEffect(() => {
    localStorage.setItem('lq_graduated', JSON.stringify(isGraduated));
  }, [isGraduated]);

  useEffect(() => {
    localStorage.setItem('lq_milestone3_passed', JSON.stringify(isMilestone3Passed));
  }, [isMilestone3Passed]);

  // TTS status indicator
  const [ttsQualityCheck, setTtsQualityCheck] = useState<'checking' | 'loaded' | 'download_needed'>('checking');
  useEffect(() => {
    const checkVoices = () => {
      if (!('speechSynthesis' in window)) {
        setTtsQualityCheck('download_needed');
        return;
      }
      const voices = window.speechSynthesis.getVoices();
      const hasHindi = voices.some(v => v.lang.startsWith('hi'));
      setTtsQualityCheck(hasHindi ? 'loaded' : 'download_needed');
    };
    
    checkVoices();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = checkVoices;
    }
  }, []);

  // --- GAMEPLAY STATES ---
  // Voice readback playing animation state
  const [playingWordId, setPlayingWordId] = useState<string | null>(null);

  // Phase 2: Matching Game state
  interface ActiveCard {
    id: string; // item.id + _hi or _trans
    text: string;
    isHindi: boolean;
    matchId: string; // original id
    isSelected: boolean;
    isMatched: boolean;
    isError: boolean;
  }
  const [matchCards, setMatchCards] = useState<ActiveCard[]>([]);
  const [selectedMatchCard, setSelectedMatchCard] = useState<ActiveCard | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [shakeCardIds, setShakeCardIds] = useState<string[]>([]);

  // Phase 3: Sentence Builder state
  const [activeSentenceBuilder, setActiveSentenceBuilder] = useState<SentenceBuilder | null>(null);
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [availableChips, setAvailableChips] = useState<string[]>([]);
  const [sentenceError, setSentenceError] = useState<boolean>(false);
  const [sentenceSuccess, setSentenceSuccess] = useState<boolean>(false);

  // Milestone Test (Level 5 & 10) state
  interface MilestoneQuestion {
    type: 'match' | 'sentence';
    prompt: string;
    answerOptions?: string[]; // For quick select
    correctAnswer?: string;
    sentenceBuilder?: SentenceBuilder;
    matchingPairs?: MatchPair[];
  }
  const [activeMilestoneId, setActiveMilestoneId] = useState<number>(5);
  const [milestoneActive, setMilestoneActive] = useState<boolean>(false);
  const [milestoneQuestions, setMilestoneQuestions] = useState<MilestoneQuestion[]>([]);
  const [milestoneIndex, setMilestoneIndex] = useState<number>(0);
  const [milestoneScore, setMilestoneScore] = useState<number>(0);
  const [milestoneFinished, setMilestoneFinished] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [milestoneSentenceChips, setMilestoneSentenceChips] = useState<string[]>([]);
  const [milestoneAvailableChips, setMilestoneAvailableChips] = useState<string[]>([]);
  const [milestoneCheckResult, setMilestoneCheckResult] = useState<'idle' | 'correct' | 'incorrect'>('idle');

  // Trigger TTS
  const handlePlayTTS = async (text: string, id: string) => {
    setPlayingWordId(id);
    await speakHindiText(text);
    setPlayingWordId(null);
  };

  const handleSendLinguistMessage = async () => {
    if (!chatInput.trim() || isChatLoading) return;
    
    const userMsg = chatInput.trim();
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/linguist-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMsg,
          levelContext: currentLevel ? `${currentLevel.title} (${currentLevel.subtitle})` : "Progression Pathway",
          chatHistory: chatHistory.slice(-6),
          useTelugu: useTelugu
        })
      });

      const data = await response.json();
      if (data.text) {
        setChatHistory(prev => [...prev, { role: 'model', text: data.text }]);
      } else if (data.error) {
        setChatHistory(prev => [...prev, { role: 'model', text: `Sorry, Dr. Vyas is currently summarizing some manuscripts. Error: ${data.error}` }]);
      }
    } catch (err) {
      setChatHistory(prev => [...prev, { role: 'model', text: "Sorry, I had trouble connecting to my linguistic research database. Please ensure the server is online!" }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Launch a standard level
  const handleSelectLevel = (level: Level) => {
    if (level.vocabulary.length === 0) {
      launchMilestoneTest(level.id);
      return;
    }
    
    setCurrentLevel(level);
    setGamePhase('learn');
    setPhaseIndex(0);
    setPlayingWordId(null);
    setSentenceSuccess(false);
    setSentenceError(false);
    setSelectedChips([]);
  };

  // Initialize Word Match Game
  const startMatchGame = () => {
    if (!currentLevel) return;
    const cards: ActiveCard[] = [];
    // Select up to 4 words
    const pairs = currentLevel.matchingPairs.slice(0, 4);
    
    pairs.forEach(pair => {
      // Hindi item
      cards.push({
        id: `${pair.id}_hi`,
        text: pair.hindi,
        isHindi: true,
        matchId: pair.id,
        isSelected: false,
        isMatched: false,
        isError: false
      });
      // Translation item
      cards.push({
        id: `${pair.id}_trans`,
        text: useTelugu ? pair.telugu : pair.english,
        isHindi: false,
        matchId: pair.id,
        isSelected: false,
        isMatched: false,
        isError: false
      });
    });

    setMatchCards(shuffleArray(cards));
    setSelectedMatchCard(null);
    setMatchedIds([]);
    setShakeCardIds([]);
    setGamePhase('match');
    setPhaseIndex(1);
  };

  // Handle Match card taps
  const handleMatchCardTap = (card: ActiveCard) => {
    if (card.isMatched || matchedIds.includes(card.matchId)) return;

    // Reset error flags
    setMatchCards(prev => prev.map(c => ({ ...c, isError: false })));
    setShakeCardIds([]);

    if (!selectedMatchCard) {
      // First card selection
      setSelectedMatchCard(card);
      setMatchCards(prev => prev.map(c => c.id === card.id ? { ...c, isSelected: true } : c));
    } else {
      // Second card selection
      if (selectedMatchCard.id === card.id) {
        // Tapped same card - deselect
        setSelectedMatchCard(null);
        setMatchCards(prev => prev.map(c => ({ ...c, isSelected: false })));
        return;
      }

      // Check for matching pair
      if (selectedMatchCard.isHindi !== card.isHindi && selectedMatchCard.matchId === card.matchId) {
        // Correct match!
        const matchId = card.matchId;
        setMatchedIds(prev => [...prev, matchId]);
        setMatchCards(prev => prev.map(c => 
          c.matchId === matchId ? { ...c, isMatched: true, isSelected: false } : c
        ));
        setSelectedMatchCard(null);

        // Check if all matched
        const updatedMatchedIds = [...matchedIds, matchId];
        if (updatedMatchedIds.length === 4) {
          setTimeout(() => {
            startSentenceBuilderGame();
          }, 800);
        }
      } else {
        // Incorrect pair!
        const id1 = selectedMatchCard.id;
        const id2 = card.id;
        setShakeCardIds([id1, id2]);
        setMatchCards(prev => prev.map(c => 
          c.id === id1 || c.id === id2 ? { ...c, isError: true, isSelected: false } : c
        ));
        setSelectedMatchCard(null);

        // Clear error highlights after 800ms
        setTimeout(() => {
          setMatchCards(prev => prev.map(c => 
            c.id === id1 || c.id === id2 ? { ...c, isError: false } : c
          ));
          setShakeCardIds([]);
        }, 800);
      }
    }
  };

  // Initialize Sentence Builder Game
  const startSentenceBuilderGame = () => {
    if (!currentLevel || currentLevel.sentenceBuilders.length === 0) {
      // Fallback if no builders
      handleCompleteLevel(3);
      return;
    }
    const builder = currentLevel.sentenceBuilders[0]; // grab first one
    setActiveSentenceBuilder(builder);
    setSelectedChips([]);
    setAvailableChips(shuffleArray([...builder.hindiWords]));
    setSentenceSuccess(false);
    setSentenceError(false);
    setGamePhase('sentence');
    setPhaseIndex(2);
  };

  // Add chip to construct
  const handleSelectChip = (word: string) => {
    setSelectedChips(prev => [...prev, word]);
    setAvailableChips(prev => {
      const idx = prev.indexOf(word);
      if (idx > -1) {
        const copy = [...prev];
        copy.splice(idx, 1);
        return copy;
      }
      return prev;
    });
    setSentenceError(false);
  };

  // Return chip to options tray
  const handleDeselectChip = (word: string) => {
    setAvailableChips(prev => [...prev, word]);
    setSelectedChips(prev => {
      const idx = prev.indexOf(word);
      if (idx > -1) {
        const copy = [...prev];
        copy.splice(idx, 1);
        return copy;
      }
      return prev;
    });
    setSentenceError(false);
  };

  // Check sentence builder construction
  const handleCheckSentence = () => {
    if (!activeSentenceBuilder) return;
    
    const correct = activeSentenceBuilder.correctSequence;
    const isCorrect = selectedChips.length === correct.length && 
                      selectedChips.every((val, index) => val === correct[index]);

    if (isCorrect) {
      setSentenceSuccess(true);
      setSentenceError(false);
      speakHindiText(correct.join(" "));
    } else {
      setSentenceError(true);
      setSentenceSuccess(false);
    }
  };

  // Mark standard level complete
  const handleCompleteLevel = (stars: number) => {
    if (!currentLevel) return;
    const levelId = currentLevel.id;
    
    if (!completedLevels.includes(levelId)) {
      setCompletedLevels(prev => [...prev, levelId]);
    }
    
    setLevelStars(prev => ({
      ...prev,
      [levelId]: Math.max(prev[levelId] || 0, stars)
    }));

    setGamePhase('completed');
  };

  // RESET GAMEPLAY BACK TO PROGRESSION MAP
  const handleBackToMap = () => {
    setCurrentLevel(null);
    setMilestoneActive(false);
    setMilestoneFinished(false);
    setPracticeActive(false);
    setPracticeFinished(false);
    setGamePhase('learn');
    setPhaseIndex(0);
  };

  // --- MILESTONE TEST MECHANICS ---
  // Generate 10 randomized milestone questions based on levels 1-4 or 6-9 data
  const launchMilestoneTest = (milestoneId: number = 5) => {
    setActiveMilestoneId(milestoneId);
    const questions: MilestoneQuestion[] = [];
    
    // Select range based on milestone
    let minLvl = 1;
    let maxLvl = 4;
    if (milestoneId === 5) {
      minLvl = 1;
      maxLvl = 4;
    } else if (milestoneId === 10) {
      minLvl = 6;
      maxLvl = 9;
    } else if (milestoneId === 13) {
      minLvl = 11;
      maxLvl = 12;
    }

    // Add 5 word matching translations
    const vocabularyPool: { item: VocabularyItem; levelId: number }[] = [];
    LEVELS.filter(l => l.id >= minLvl && l.id <= maxLvl).forEach(lvl => {
      lvl.vocabulary.forEach(v => {
        vocabularyPool.push({ item: v, levelId: lvl.id });
      });
    });

    const shuffledVocab = shuffleArray([...vocabularyPool]);
    
    // Create 5 word translate questions
    for (let i = 0; i < 5; i++) {
      if (!shuffledVocab[i]) break;
      const { item } = shuffledVocab[i];
      const targetText = useTelugu ? item.telugu : item.english;
      
      // Make options pool
      const options = [targetText];
      while (options.length < 4) {
        if (vocabularyPool.length < 2) {
          // Fallback if pool is too small
          options.push("Alternative Match 1", "Alternative Match 2", "Alternative Match 3");
          break;
        }
        const randomItem = vocabularyPool[Math.floor(Math.random() * vocabularyPool.length)].item;
        const randomText = useTelugu ? randomItem.telugu : randomItem.english;
        if (!options.includes(randomText)) {
          options.push(randomText);
        }
      }

      questions.push({
        type: 'match',
        prompt: `Translate this Hindi sentence:\n"${item.hindi}"`,
        answerOptions: shuffleArray(options),
        correctAnswer: targetText
      });
    }

    // Add 5 sentence building exercises
    const builderPool: SentenceBuilder[] = [];
    LEVELS.filter(l => l.id >= minLvl && l.id <= maxLvl).forEach(lvl => {
      lvl.sentenceBuilders.forEach(sb => {
        builderPool.push(sb);
      });
    });

    const shuffledBuilders = shuffleArray([...builderPool]);
    for (let i = 0; i < 5; i++) {
      if (!shuffledBuilders[i]) break;
      questions.push({
        type: 'sentence',
        prompt: useTelugu ? shuffledBuilders[i].teluguTarget : shuffledBuilders[i].englishTarget,
        sentenceBuilder: shuffledBuilders[i]
      });
    }

    setMilestoneQuestions(shuffleArray(questions));
    setMilestoneIndex(0);
    setMilestoneScore(0);
    setMilestoneActive(true);
    setMilestoneFinished(false);
    setSelectedOption(null);
    setMilestoneCheckResult('idle');
    
    // Set up first sentence builder if relevant
    const firstQ = questions[0];
    if (firstQ && firstQ.type === 'sentence' && firstQ.sentenceBuilder) {
      setMilestoneSentenceChips([]);
      setMilestoneAvailableChips(shuffleArray([...firstQ.sentenceBuilder.hindiWords]));
    }
  };

  const handleMilestoneOptionSelect = (option: string) => {
    if (milestoneCheckResult !== 'idle') return;
    setSelectedOption(option);
  };

  const handleCheckMilestoneAnswer = () => {
    const currentQ = milestoneQuestions[milestoneIndex];
    if (!currentQ) return;

    if (currentQ.type === 'match') {
      if (!selectedOption) return;
      if (selectedOption === currentQ.correctAnswer) {
        setMilestoneScore(prev => prev + 1);
        setMilestoneCheckResult('correct');
      } else {
        setMilestoneCheckResult('incorrect');
      }
    } else if (currentQ.type === 'sentence' && currentQ.sentenceBuilder) {
      const correct = currentQ.sentenceBuilder.correctSequence;
      const isCorrect = milestoneSentenceChips.length === correct.length && 
                        milestoneSentenceChips.every((val, index) => val === correct[index]);

      if (isCorrect) {
        setMilestoneScore(prev => prev + 1);
        setMilestoneCheckResult('correct');
        speakHindiText(correct.join(" "));
      } else {
        setMilestoneCheckResult('incorrect');
      }
    }
  };

  const handleNextMilestoneQuestion = () => {
    if (milestoneIndex + 1 < milestoneQuestions.length) {
      const nextIdx = milestoneIndex + 1;
      setMilestoneIndex(nextIdx);
      setSelectedOption(null);
      setMilestoneCheckResult('idle');

      const nextQ = milestoneQuestions[nextIdx];
      if (nextQ && nextQ.type === 'sentence' && nextQ.sentenceBuilder) {
        setMilestoneSentenceChips([]);
        setMilestoneAvailableChips(shuffleArray([...nextQ.sentenceBuilder.hindiWords]));
      }
    } else {
      // Finished the test
      setMilestoneFinished(true);
      const passed = milestoneScore >= 8;
      if (passed) {
        if (activeMilestoneId === 5) {
          setIsMilestonePassed(true);
          if (!completedLevels.includes(5)) {
            setCompletedLevels(prev => [...prev, 5]);
          }
        } else if (activeMilestoneId === 10) {
          setIsMilestone2Passed(true);
          if (!completedLevels.includes(10)) {
            setCompletedLevels(prev => [...prev, 10]);
          }
        } else if (activeMilestoneId === 13) {
          setIsMilestone3Passed(true);
          setIsGraduated(true);
          if (!completedLevels.includes(13)) {
            setCompletedLevels(prev => [...prev, 13]);
          }
        }
      }
    }
  };

  const handleSelectMilestoneChip = (word: string) => {
    if (milestoneCheckResult !== 'idle') return;
    setMilestoneSentenceChips(prev => [...prev, word]);
    setMilestoneAvailableChips(prev => {
      const idx = prev.indexOf(word);
      if (idx > -1) {
        const copy = [...prev];
        copy.splice(idx, 1);
        return copy;
      }
      return prev;
    });
  };

  const handleDeselectMilestoneChip = (word: string) => {
    if (milestoneCheckResult !== 'idle') return;
    setMilestoneAvailableChips(prev => [...prev, word]);
    setMilestoneSentenceChips(prev => {
      const idx = prev.indexOf(word);
      if (idx > -1) {
        const copy = [...prev];
        copy.splice(idx, 1);
        return copy;
      }
      return prev;
    });
  };

  const handleResetAppProgress = () => {
    if (window.confirm("Reset all learning milestones and progress stats?")) {
      setCompletedLevels([]);
      setLevelStars({});
      setIsMilestonePassed(false);
      setIsMilestone2Passed(false);
      setIsMilestone3Passed(false);
      setIsGraduated(false);
      handleBackToMap();
    }
  };

  // --- PRACTICE LAB (RANDOM TEST) MECHANICS ---
  const launchPracticeTest = () => {
    const pool = DYNAMIC_TESTS_POOL.filter(q => q.levelGroup === practiceLevel);
    if (pool.length === 0) {
      alert("No questions found for this level!");
      return;
    }
    const shuffled = shuffleArray([...pool]);
    const sliced = shuffled.slice(0, Math.min(practiceCount, shuffled.length));

    setPracticeQuestions(sliced);
    setPracticeIndex(0);
    setPracticeScore(0);
    setPracticeCheckResult('idle');
    setPracticeSelectedOption(null);
    setPracticeFinished(false);
    setPracticeActive(true);

    const firstQ = sliced[0];
    if (firstQ && firstQ.type === 'sentence_arrange') {
      setPracticeSentenceChips([]);
      setPracticeAvailableChips(shuffleArray([...firstQ.options]));
    }
  };

  const handlePracticeOptionSelect = (option: string) => {
    if (practiceCheckResult !== 'idle') return;
    setPracticeSelectedOption(option);
  };

  const handleCheckPracticeAnswer = () => {
    const currentQ = practiceQuestions[practiceIndex];
    if (!currentQ) return;

    if (currentQ.type === 'sentence_arrange') {
      const isCorrect = practiceSentenceChips.join(",") === currentQ.correctAnswer;
      if (isCorrect) {
        setPracticeScore(prev => prev + 1);
        setPracticeCheckResult('correct');
        speakHindiText(currentQ.audioText);
      } else {
        setPracticeCheckResult('incorrect');
      }
    } else {
      if (!practiceSelectedOption) return;
      if (practiceSelectedOption === currentQ.correctAnswer) {
        setPracticeScore(prev => prev + 1);
        setPracticeCheckResult('correct');
        speakHindiText(currentQ.audioText);
      } else {
        setPracticeCheckResult('incorrect');
      }
    }
  };

  const handleNextPracticeQuestion = () => {
    if (practiceIndex + 1 < practiceQuestions.length) {
      const nextIdx = practiceIndex + 1;
      setPracticeIndex(nextIdx);
      setPracticeSelectedOption(null);
      setPracticeCheckResult('idle');

      const nextQ = practiceQuestions[nextIdx];
      if (nextQ && nextQ.type === 'sentence_arrange') {
        setPracticeSentenceChips([]);
        setPracticeAvailableChips(shuffleArray([...nextQ.options]));
      }
    } else {
      setPracticeFinished(true);
    }
  };

  const handleSelectPracticeChip = (word: string) => {
    if (practiceCheckResult !== 'idle') return;
    setPracticeSentenceChips(prev => [...prev, word]);
    setPracticeAvailableChips(prev => {
      const idx = prev.indexOf(word);
      if (idx > -1) {
        const copy = [...prev];
        copy.splice(idx, 1);
        return copy;
      }
      return prev;
    });
  };

  const handleDeselectPracticeChip = (word: string) => {
    if (practiceCheckResult !== 'idle') return;
    setPracticeAvailableChips(prev => [...prev, word]);
    setPracticeSentenceChips(prev => {
      const idx = prev.indexOf(word);
      if (idx > -1) {
        const copy = [...prev];
        copy.splice(idx, 1);
        return copy;
      }
      return prev;
    });
  };

  // Winding map coordinates for visual layout
  const mapAlignments = [
    "items-start pl-16", 
    "items-end pr-16", 
    "items-center", 
    "items-start pl-12", 
    "items-center", 
    "items-end pr-16",
    "items-start pl-16",
    "items-end pr-16",
    "items-center",
    "items-start pl-12",
    "items-center",
    "items-end pr-16",
    "items-start pl-16",
    "items-end pr-16",
    "items-center"
  ];

  return (
    <div className="w-[390px] h-[780px] bg-slate-900 rounded-[50px] border-[10px] border-slate-950 shadow-2xl relative overflow-hidden flex flex-col font-sans select-none">
      
      {/* Front camera notch */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-slate-950 rounded-b-2xl z-50 flex items-center justify-center">
        <span className="w-2.5 h-2.5 bg-slate-800 rounded-full mr-2"></span>
        <span className="w-16 h-1 bg-slate-800 rounded-full"></span>
      </div>

      {/* Android Top System Bar */}
      <div className="bg-purple-950 text-white/95 text-[11px] font-medium px-6 pt-7 pb-2 flex items-center justify-between z-40">
        <span>{currentTime || "12:00"}</span>
        <div className="flex items-center gap-2 text-white/80">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <Wifi className="w-3.5 h-3.5" />
          <Battery className="w-4 h-4 text-emerald-400 fill-emerald-400" />
        </div>
      </div>

      {/* App Main Header */}
      <div className="bg-purple-900 text-white px-5 py-3 flex items-center justify-between shadow-md z-30">
        <div className="flex items-center gap-2">
          {!(currentLevel || milestoneActive || practiceActive || selectedVerb || selectedTense || selectedConjunction) ? (
            <div className="flex items-center gap-2">
              <span className="p-1 bg-indigo-500 rounded-lg shadow-inner">
                <Sparkles className="w-4 h-4 text-white animate-bounce" />
              </span>
              <h1 id="app-title-linguaquest" className="text-base font-bold tracking-tight">LinguaQuest</h1>
            </div>
          ) : (
            <button 
              onClick={() => {
                if (selectedVerb) {
                  setSelectedVerb(null);
                } else if (selectedTense) {
                  setSelectedTense(null);
                } else if (selectedConjunction) {
                  setSelectedConjunction(null);
                } else {
                  handleBackToMap();
                }
              }}
              className="p-1 hover:bg-white/10 rounded-full transition-all animate-none"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
          )}
        </div>

        {/* Dynamic header items */}
        {!(currentLevel || milestoneActive || practiceActive) ? (
          <div className="flex items-center gap-3">
            {/* Dr. Vyas Linguistic Mentor Button */}
            <button
              onClick={() => setIsLinguistChatOpen(!isLinguistChatOpen)}
              className={`p-1.5 rounded-xl border flex items-center justify-center transition-all ${
                isLinguistChatOpen 
                  ? 'bg-amber-500 text-slate-950 border-amber-400 animate-pulse' 
                  : 'bg-purple-950/60 hover:bg-purple-800 text-purple-200 border-purple-800/80'
              }`}
              title="Linguistic Mentor Dr. Vyas"
            >
              <Languages className="w-3.5 h-3.5" />
            </button>

            {/* Instruction Toggle: EN / Telugu */}
            <div className="flex items-center gap-1.5 bg-purple-950/60 p-1 rounded-full border border-purple-800/80">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-all ${!useTelugu ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}>
                EN
              </span>
              <button 
                onClick={() => setUseTelugu(!useTelugu)}
                className="w-8 h-4.5 bg-purple-800 rounded-full relative p-0.5 transition-colors focus:outline-none"
              >
                <div className={`w-3.5 h-3.5 bg-white rounded-full transition-transform shadow ${useTelugu ? 'translate-x-3.5' : 'translate-x-0'}`} />
              </button>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-all ${useTelugu ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}>
                తెలుగు
              </span>
            </div>
            
            {/* Reset button */}
            <button 
              onClick={handleResetAppProgress} 
              title="Reset progress"
              className="p-1 hover:bg-white/10 rounded-full"
            >
              <RefreshCw className="w-3.5 h-3.5 text-purple-300" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            {/* Dr. Vyas Linguistic Mentor Button */}
            <button
              onClick={() => setIsLinguistChatOpen(!isLinguistChatOpen)}
              className={`p-1.5 rounded-xl border flex items-center justify-center transition-all ${
                isLinguistChatOpen 
                  ? 'bg-amber-500 text-slate-950 border-amber-400 animate-pulse' 
                  : 'bg-purple-950/60 hover:bg-purple-800 text-purple-200 border-purple-800/80'
              }`}
              title="Linguistic Mentor Dr. Vyas"
            >
              <Languages className="w-3.5 h-3.5" />
            </button>
            <div className="text-xs font-semibold text-purple-200">
              {useTelugu ? "తెలుగు బోధన" : "English Mode"}
            </div>
          </div>
        )}
      </div>

      {/* Dynamic App Area */}
      <div className="flex-1 bg-gradient-to-b from-purple-950 to-indigo-950 overflow-y-auto px-4 py-5 relative">
        <AnimatePresence mode="wait">
          
          {/* SCREEN 1: PROGRESSION PATHWAY MAP */}
          {!currentLevel && !milestoneActive && !practiceActive && mainTab === 'pathway' && (
            <motion.div
              key="map-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center h-full pb-8"
            >
              {/* Info Notification Area */}
              <div className="w-full bg-indigo-950/80 border border-indigo-800/80 rounded-2xl p-3.5 mb-4 text-[11px] text-indigo-200 flex items-start gap-3 shadow-lg animate-pulse">
                <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block mb-0.5">Curriculum Map (13 Levels)</span>
                  Pass Level 5 Milestone to unlock levels 6-9. Pass Level 10 Milestone to unlock levels 11-12. Clear Level 13 Graduation Exam to receive the Bhasha Pravina Title!
                </div>
              </div>

              {/* Path Node Column */}
              <div className="relative flex flex-col gap-8 w-full items-center py-4">
                
                {LEVELS.map((lvl, index) => {
                  const isCompleted = completedLevels.includes(lvl.id);
                  const stars = levelStars[lvl.id] || 0;
                  const isMilestone = lvl.vocabulary.length === 0;
                  const isLevelLocked = 
                    (lvl.id >= 6 && lvl.id <= 10 && !isMilestonePassed) ||
                    (lvl.id >= 11 && !isMilestone2Passed);
                  const alignment = mapAlignments[index] || "items-center";

                  return (
                    <div 
                      key={lvl.id} 
                      className={`flex flex-col ${alignment} w-full relative z-10`}
                    >
                      {/* Active level node connector lines */}
                      {index < LEVELS.length - 1 && (
                        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-0.5 h-10 border-l-2 border-dashed border-indigo-700/60 -z-10"></div>
                      )}

                      {/* Interactive circular card node */}
                      <button
                        onClick={() => {
                          if (isLevelLocked) {
                            if (lvl.id >= 11) {
                              alert("This level is locked! You must pass the Level 10 Milestone Test with 80%+ first to unlock Levels 11-12.");
                            } else {
                              alert("This level is locked! You must pass the Level 5 Milestone Test with 80%+ first to unlock Levels 6-9.");
                            }
                            return;
                          }
                          handleSelectLevel(lvl);
                        }}
                        className={`group relative flex flex-col items-center justify-center w-16 h-16 rounded-full transition-all duration-300 shadow-xl ${
                          isMilestone 
                            ? 'bg-amber-500 hover:bg-amber-400 border-4 border-amber-300 ring-4 ring-amber-500/20 w-18 h-18 text-slate-900'
                            : isLevelLocked
                              ? 'bg-slate-800 border-4 border-slate-700 text-slate-500 cursor-not-allowed'
                              : isCompleted
                                ? 'bg-emerald-600 hover:bg-emerald-500 border-4 border-emerald-400 text-white'
                                : 'bg-indigo-600 hover:bg-indigo-500 border-4 border-indigo-400 text-white'
                        }`}
                      >
                        {isMilestone ? (
                           <Award className="w-8 h-8 animate-pulse text-amber-950" />
                        ) : isLevelLocked ? (
                          <Lock className="w-5 h-5" />
                        ) : (
                          <span className="text-lg font-bold">{lvl.id}</span>
                        )}

                        {/* Completed Level Badge Indicator */}
                        {isCompleted && !isMilestone && (
                          <span className="absolute -top-1 -right-1 bg-amber-400 border border-amber-200 text-amber-950 p-1 rounded-full shadow-lg">
                            <Star className="w-3 h-3 fill-amber-500" />
                          </span>
                        )}
                        
                        {/* Interactive hover scale */}
                        <div className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </button>

                      {/* Level Title and subtitle card text */}
                      <div className="mt-2 text-center max-w-[140px]">
                        <h4 className="text-[11px] font-bold text-white leading-tight">
                          {lvl.title}
                        </h4>
                        <p className="text-[9px] text-indigo-300 truncate">
                          {lvl.subtitle}
                        </p>
                        
                        {/* Rating Star stars rendering */}
                        {stars > 0 && (
                          <div className="flex items-center justify-center gap-0.5 mt-1">
                            {[...Array(3)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-2.5 h-2.5 ${i < stars ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`} 
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Important Notes & Study Guide Trigger */}
              <div className="w-full mt-6 px-1">
                <button
                  onClick={() => setIsNotesOpen(true)}
                  className="w-full bg-gradient-to-r from-amber-500/20 to-indigo-500/20 hover:from-amber-500/30 hover:to-indigo-500/30 border border-amber-500/40 hover:border-amber-400/60 text-amber-200 py-3 px-4 rounded-2xl flex items-center justify-between transition-all duration-300 shadow-lg cursor-pointer group animate-pulse"
                >
                  <div className="flex items-center gap-3 text-left">
                    <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-xl group-hover:scale-105 transition-all">
                      <BookOpen className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <span className="text-[11.5px] font-bold text-white block">📖 Study Guide & Imp Notes</span>
                      <span className="text-[9.5px] text-indigo-300 block">Grammatical gender, SOV, postpositions & tips</span>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-amber-400/80 group-hover:translate-x-0.5 transition-all" />
                </button>
              </div>

              {/* Status footer inside Map screen */}
              <div className="mt-4 text-center text-[10px] text-indigo-400 font-mono">
                TTS Voice: <span className={ttsQualityCheck === 'loaded' ? "text-emerald-400" : "text-amber-400"}>
                  {ttsQualityCheck === 'loaded' ? "hi_IN High Quality" : "System standard check"}
                </span>
              </div>
            </motion.div>
          )}

          {/* SCREEN 1.5: THE ENCYCLOPEDIA SCREEN */}
          {!currentLevel && !milestoneActive && !practiceActive && mainTab === 'encyclopedia' && (
            <motion.div
              key="encyclopedia-screen"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col h-full pb-8 text-white"
            >
              {/* Category Sub-Tabs Selector */}
              <div className="flex bg-slate-900/80 p-1 rounded-xl border border-indigo-950 mb-4 items-center justify-between shadow-inner">
                <button
                  onClick={() => {
                    setEncyclopediaTab('verbs');
                    setSelectedVerb(null);
                  }}
                  className={`flex-1 text-center py-2 text-[10px] font-bold rounded-lg transition-all ${
                    encyclopediaTab === 'verbs' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-indigo-200'
                  }`}
                >
                  Verbs (क्रिया)
                </button>
                <button
                  onClick={() => {
                    setEncyclopediaTab('tenses');
                    setSelectedTense(null);
                  }}
                  className={`flex-1 text-center py-2 text-[10px] font-bold rounded-lg transition-all ${
                    encyclopediaTab === 'tenses' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-indigo-200'
                  }`}
                >
                  Tenses (काल)
                </button>
                <button
                  onClick={() => {
                    setEncyclopediaTab('conjunctions');
                    setSelectedConjunction(null);
                  }}
                  className={`flex-1 text-center py-2 text-[10px] font-bold rounded-lg transition-all ${
                    encyclopediaTab === 'conjunctions' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-indigo-200'
                  }`}
                >
                  Conjunctions
                </button>
              </div>

              {/* VIEW 1: VERBS ENGINE */}
              {encyclopediaTab === 'verbs' && (
                <div className="flex flex-col flex-1">
                  {!selectedVerb ? (
                    <div className="space-y-4">
                      {/* Search bar inside Verbs list */}
                      <div className="relative">
                        <input
                          type="text"
                          value={verbSearch}
                          onChange={(e) => setVerbSearch(e.target.value)}
                          placeholder="Search verbs (e.g. eat, speak)..."
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 pl-9 text-[11px] text-white focus:outline-none focus:border-indigo-500 placeholder-slate-500"
                        />
                        <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                      </div>

                      <div className="space-y-2 max-h-[440px] overflow-y-auto pr-1">
                        {HINDI_VERBS.filter(verb => 
                          verb.infinitive.toLowerCase().includes(verbSearch.toLowerCase()) || 
                          verb.englishMeaning.toLowerCase().includes(verbSearch.toLowerCase()) ||
                          verb.devanagari.includes(verbSearch)
                        ).map((verb) => (
                          <div
                            key={verb.infinitive}
                            onClick={() => setSelectedVerb(verb)}
                            className="bg-slate-900/90 border border-indigo-950 hover:border-indigo-800/80 rounded-xl p-3 flex items-center justify-between cursor-pointer transition-all hover:bg-slate-850 shadow-md group"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-amber-300 group-hover:text-amber-200 transition-colors">
                                  {verb.devanagari}
                                </span>
                                <span className="text-[10px] font-mono text-gray-400">({verb.infinitive})</span>
                              </div>
                              <div className="text-[11px] text-gray-300 font-medium mt-1">
                                <span className="text-slate-400 text-[10px]">EN:</span> {verb.englishMeaning}
                              </div>
                              <div className="text-[11px] text-indigo-300 font-medium">
                                <span className="text-slate-400 text-[10px]">TE:</span> {verb.teluguMeaning}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPlayingWordId(verb.infinitive);
                                  speakHindiText(verb.devanagari).then(() => setPlayingWordId(null));
                                }}
                                className="p-1.5 bg-slate-800 hover:bg-indigo-600 rounded-lg text-indigo-300 hover:text-white transition-all"
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                              </button>
                              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-0.5 transition-all" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* VERB DETAIL CARD VIEW */
                    <div className="bg-slate-900/95 border border-indigo-900/40 rounded-2xl p-4 shadow-xl space-y-4 max-h-[490px] overflow-y-auto">
                      <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-base font-bold text-amber-300">{selectedVerb.devanagari}</h2>
                            <span className="text-[11px] font-mono text-gray-400">({selectedVerb.infinitive})</span>
                          </div>
                          <p className="text-xs text-white/90 mt-1 font-medium">
                            {useTelugu ? `తెలుగు అర్థం: ${selectedVerb.teluguMeaning}` : `To Eat / Drink: ${selectedVerb.englishMeaning}`}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setPlayingWordId(selectedVerb.infinitive);
                            speakHindiText(selectedVerb.devanagari).then(() => setPlayingWordId(null));
                          }}
                          className="p-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white shadow"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Conjugation matrix */}
                      <div>
                        <h4 className="text-[10px] uppercase font-bold tracking-wider text-amber-400 mb-2">Conjugations (रूपांतरण)</h4>
                        <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800 text-[11px] space-y-2.5">
                          <div className="grid grid-cols-3 font-bold text-indigo-300 border-b border-slate-800 pb-1 text-center">
                            <span>Tense</span>
                            <span>Masculine (M)</span>
                            <span>Feminine (F)</span>
                          </div>
                          <div className="grid grid-cols-3 border-b border-slate-900 pb-1">
                            <span className="font-semibold text-slate-400">Present</span>
                            <span className="text-center">{selectedVerb.conjugations.presentMasculine.split(" / ")[0]}</span>
                            <span className="text-center">{selectedVerb.conjugations.presentFeminine.split(" / ")[0]}</span>
                          </div>
                          <div className="grid grid-cols-3 border-b border-slate-900 pb-1">
                            <span className="font-semibold text-slate-400">Past</span>
                            <span className="text-center text-emerald-400">{selectedVerb.conjugations.pastMasculine.split(" / ")[0]}</span>
                            <span className="text-center text-emerald-400">{selectedVerb.conjugations.pastFeminine.split(" / ")[0]}</span>
                          </div>
                          <div className="grid grid-cols-3">
                            <span className="font-semibold text-slate-400">Future</span>
                            <span className="text-center text-amber-300">{selectedVerb.conjugations.futureMasculine.split(" / ")[0]}</span>
                            <span className="text-center text-amber-300">{selectedVerb.conjugations.futureFeminine.split(" / ")[0]}</span>
                          </div>
                        </div>
                      </div>

                      {/* Examples inside Verb detail */}
                      <div>
                        <h4 className="text-[10px] uppercase font-bold tracking-wider text-amber-400 mb-2">Real-world Examples</h4>
                        <div className="space-y-3">
                          {selectedVerb.examples.map((example, i) => (
                            <div key={i} className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
                              <div className="flex justify-between items-start gap-2">
                                <div className="space-y-1 flex-1">
                                  <p className="text-xs font-bold text-white leading-relaxed">{example.hindi}</p>
                                  <p className="text-[10px] text-gray-400 italic font-mono">{example.transliteration}</p>
                                  <p className="text-[11px] text-indigo-200">
                                    <span className="text-slate-400 font-bold text-[9px] mr-1">EN:</span> {example.english}
                                  </p>
                                  <p className="text-[11px] text-indigo-300">
                                    <span className="text-slate-400 font-bold text-[9px] mr-1">TE:</span> {example.telugu}
                                  </p>
                                </div>
                                <button
                                  onClick={() => {
                                    setPlayingWordId(example.hindi);
                                    speakHindiText(example.hindi).then(() => setPlayingWordId(null));
                                  }}
                                  className="p-1.5 bg-slate-800 hover:bg-indigo-600 rounded-lg text-indigo-300 hover:text-white transition-all flex-shrink-0"
                                >
                                  <Volume2 className="w-3 h-3" />
                                </button>
                              </div>
                              <div className="mt-2 pt-2 border-t border-slate-800/50 text-[10px] text-amber-200/80 leading-relaxed font-sans">
                                💡 <span className="font-bold text-white">Grammar:</span> {example.explanation}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* VIEW 2: TENSES ENGINE */}
              {encyclopediaTab === 'tenses' && (
                <div className="flex flex-col flex-1">
                  {!selectedTense ? (
                    <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
                      {HINDI_TENSES.map((tense) => (
                        <div
                          key={tense.id}
                          onClick={() => setSelectedTense(tense)}
                          className="bg-slate-900/90 border border-indigo-950 hover:border-indigo-800/80 rounded-xl p-3.5 cursor-pointer transition-all hover:bg-slate-850 shadow-md group"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-xs font-bold text-amber-300 group-hover:text-amber-200 transition-colors">
                                {tense.name}
                              </h3>
                              <p className="text-[10px] text-indigo-300 font-medium mt-0.5">{tense.teluguName}</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-0.5 transition-all" />
                          </div>
                          <div className="bg-slate-950/70 p-1.5 rounded-lg border border-slate-800 text-[9.5px] font-mono text-indigo-200 mt-2 truncate">
                            {tense.formula}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* TENSE DETAIL CARD VIEW */
                    <div className="bg-slate-900/95 border border-indigo-900/40 rounded-2xl p-4 shadow-xl space-y-4 max-h-[490px] overflow-y-auto">
                      <div className="border-b border-slate-800 pb-3">
                        <h2 className="text-sm font-bold text-amber-300">{selectedTense.name}</h2>
                        <p className="text-[11.5px] text-indigo-300 font-medium">{selectedTense.teluguName}</p>
                      </div>

                      {/* Grammar Formula Container */}
                      <div>
                        <h4 className="text-[10px] uppercase font-bold tracking-wider text-amber-400 mb-1.5">Grammar Formula</h4>
                        <div className="bg-slate-950/90 rounded-xl p-3 border border-indigo-950 text-[10.5px] font-mono text-indigo-200 text-center leading-relaxed">
                          {selectedTense.formula}
                        </div>
                      </div>

                      {/* Linguistic explanation based on selected language */}
                      <div>
                        <h4 className="text-[10px] uppercase font-bold tracking-wider text-amber-400 mb-1.5">Linguistic Summary</h4>
                        <p className="text-xs text-indigo-100 leading-relaxed bg-indigo-950/30 p-3 rounded-xl border border-indigo-900/30">
                          {useTelugu ? selectedTense.teluguExplanation : selectedTense.explanation}
                        </p>
                      </div>

                      {/* Examples inside Tense */}
                      <div>
                        <h4 className="text-[10px] uppercase font-bold tracking-wider text-amber-400 mb-2">Practice Sentences</h4>
                        <div className="space-y-3.5">
                          {selectedTense.examples.map((example, i) => (
                            <div key={i} className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/60 relative">
                              <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-slate-800 text-slate-400 text-[8px] rounded-md font-bold uppercase tracking-wider">
                                {example.gender}
                              </span>
                              <div className="space-y-1 pr-14">
                                <p className="text-xs font-bold text-white leading-relaxed">{example.hindi}</p>
                                <p className="text-[10px] text-gray-400 italic font-mono">{example.transliteration}</p>
                                <p className="text-[11px] text-indigo-200">
                                  <span className="text-slate-400 font-bold text-[9px] mr-1">EN:</span> {example.english}
                                </p>
                                <p className="text-[11px] text-indigo-300">
                                  <span className="text-slate-400 font-bold text-[9px] mr-1">TE:</span> {example.telugu}
                                </p>
                              </div>
                              <button
                                onClick={() => {
                                  setPlayingWordId(example.hindi);
                                  speakHindiText(example.hindi).then(() => setPlayingWordId(null));
                                }}
                                className="absolute bottom-3 right-3 p-1.5 bg-slate-800 hover:bg-indigo-600 rounded-lg text-indigo-300 hover:text-white transition-all flex-shrink-0"
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* VIEW 3: CONJUNCTIONS ENGINE */}
              {encyclopediaTab === 'conjunctions' && (
                <div className="flex flex-col flex-1">
                  {!selectedConjunction ? (
                    <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
                      {HINDI_CONJUNCTIONS.map((conj) => (
                        <div
                          key={conj.word}
                          onClick={() => setSelectedConjunction(conj)}
                          className="bg-slate-900/90 border border-indigo-950 hover:border-indigo-800/80 rounded-xl p-3.5 cursor-pointer transition-all hover:bg-slate-850 shadow-md group"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-baseline gap-2">
                                <span className="text-sm font-bold text-amber-300 group-hover:text-amber-200 transition-colors">
                                  {conj.devanagari}
                                </span>
                                <span className="text-[10.5px] font-mono text-gray-400">({conj.word})</span>
                              </div>
                              <p className="text-[11px] text-gray-300 font-medium mt-1">
                                Means: <span className="text-white font-bold">{conj.englishMeaning}</span> / {conj.teluguMeaning}
                              </p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-0.5 transition-all" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* CONJUNCTION DETAIL VIEW */
                    <div className="bg-slate-900/95 border border-indigo-900/40 rounded-2xl p-4 shadow-xl space-y-4 max-h-[490px] overflow-y-auto">
                      <div className="border-b border-slate-800 pb-3 flex justify-between items-start">
                        <div>
                          <div className="flex items-baseline gap-2">
                            <h2 className="text-base font-bold text-amber-300">{selectedConjunction.devanagari}</h2>
                            <span className="text-xs font-mono text-gray-400">({selectedConjunction.word})</span>
                          </div>
                          <p className="text-xs text-white/90 mt-1">
                            {useTelugu ? `తెలుగు అర్థం: ${selectedConjunction.teluguMeaning}` : `English translation: ${selectedConjunction.englishMeaning}`}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setPlayingWordId(selectedConjunction.word);
                            speakHindiText(selectedConjunction.devanagari).then(() => setPlayingWordId(null));
                          }}
                          className="p-1.5 bg-slate-800 hover:bg-indigo-600 rounded-lg text-indigo-300 hover:text-white transition-all flex-shrink-0"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Placement grammar summary */}
                      <div>
                        <h4 className="text-[10px] uppercase font-bold tracking-wider text-amber-400 mb-1.5">How to combine sentences</h4>
                        <p className="text-xs text-indigo-100 leading-relaxed bg-indigo-950/30 p-3 rounded-xl border border-indigo-900/30">
                          {useTelugu ? selectedConjunction.teluguExplanation : selectedConjunction.explanation}
                        </p>
                      </div>

                      {/* Examples inside Conjunction detail */}
                      <div>
                        <h4 className="text-[10px] uppercase font-bold tracking-wider text-amber-400 mb-2">Dual-Clause Examples</h4>
                        <div className="space-y-3.5">
                          {selectedConjunction.examples.map((example, i) => (
                            <div key={i} className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/60 relative">
                              <div className="space-y-1 pr-12">
                                <p className="text-xs font-bold text-white leading-relaxed">{example.hindi}</p>
                                <p className="text-[10px] text-gray-400 italic font-mono">{example.transliteration}</p>
                                <p className="text-[11px] text-indigo-200">
                                  <span className="text-slate-400 font-bold text-[9px] mr-1">EN:</span> {example.english}
                                </p>
                                <p className="text-[11px] text-indigo-300">
                                  <span className="text-slate-400 font-bold text-[9px] mr-1">TE:</span> {example.telugu}
                                </p>
                              </div>
                              <button
                                onClick={() => {
                                  setPlayingWordId(example.hindi);
                                  speakHindiText(example.hindi).then(() => setPlayingWordId(null));
                                }}
                                className="absolute bottom-3 right-3 p-1.5 bg-slate-800 hover:bg-indigo-600 rounded-lg text-indigo-300 hover:text-white transition-all flex-shrink-0"
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* SCREEN 1.6: THE PRACTICE LAB / RANDOM CUSTOMIZED TEST SCREEN */}
          {!currentLevel && !milestoneActive && (practiceActive || mainTab === 'practice') && (
            <motion.div
              key="practice-screen"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="flex flex-col h-full pb-8 text-white"
            >
              {/* STAGE A: PRACTICE SETUP INTERFACE */}
              {!practiceActive && (
                <div className="space-y-4">
                  <div className="bg-slate-900/90 border border-indigo-950 rounded-2xl p-4 shadow-xl">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Trophy className="w-4.5 h-4.5 text-amber-400" />
                      <h2 className="text-sm font-bold text-white">Practice Laboratory (परीक्षणशाला)</h2>
                    </div>
                    <p className="text-[11px] text-indigo-300 leading-relaxed">
                      Generate randomized tests to challenge tenses, verbs, vocabulary, and grammar order matching your preferred learning speed.
                    </p>
                  </div>

                  {/* Level segment selector */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Target Skill Level</label>
                    <div className="grid grid-cols-3 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-900">
                      {(['Beginner', 'Intermediate', 'Advanced'] as const).map((level) => (
                        <button
                          key={level}
                          onClick={() => setPracticeLevel(level)}
                          className={`text-center py-2 text-[10.5px] font-bold rounded-lg transition-all ${
                            practiceLevel === level ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Question count selector */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Question Count</label>
                    <div className="grid grid-cols-2 gap-3">
                      {[5, 10].map((num) => (
                        <button
                          key={num}
                          onClick={() => setPracticeCount(num)}
                          className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                            practiceCount === num 
                              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md' 
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {num} Questions
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Syllabus / tested items card */}
                  <div className="bg-slate-900/40 p-3 rounded-2xl border border-slate-850 text-[10px] leading-relaxed text-indigo-200/90 space-y-1">
                    <span className="font-bold text-white block">Syllabus Coverage:</span>
                    {practiceLevel === 'Beginner' && (
                      <p>• Greetings, self-introductions, basic vocabulary (family, foods), standard subject-object sentence ordering.</p>
                    )}
                    {practiceLevel === 'Intermediate' && (
                      <p>• Dynamic directions, travel phrases, common nouns (Roti, Chai), basic conjunction connecting words (aur, ya).</p>
                    )}
                    {practiceLevel === 'Advanced' && (
                      <p>• Advanced continuous verb conjugation (raha/rahi/rahe), conditional triggers, past/future tense aspects, oblique case conversions.</p>
                    )}
                  </div>

                  {/* Action trigger button */}
                  <button
                    onClick={launchPracticeTest}
                    className="w-full bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all text-xs flex items-center justify-center gap-2 mt-4"
                  >
                    <span>Synthesize Session</span>
                    <Sparkles className="w-4 h-4 animate-spin-slow" />
                  </button>
                </div>
              )}

              {/* STAGE B: ACTIVE TEST PRESENTATION */}
              {practiceActive && !practiceFinished && (
                <div className="flex flex-col flex-1 justify-between">
                  {/* Test progress bar */}
                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1.5 items-center">
                      <span className="uppercase">Question {practiceIndex + 1} of {practiceQuestions.length}</span>
                      <span className="text-indigo-300">Score: {practiceScore} / {practiceQuestions.length}</span>
                    </div>
                    <div className="w-full bg-indigo-950 h-1.5 rounded-full mb-4 overflow-hidden border border-indigo-900/40">
                      <div 
                        className="bg-amber-400 h-full transition-all duration-300"
                        style={{ width: `${((practiceIndex) / practiceQuestions.length) * 100}%` }}
                      ></div>
                    </div>

                    {/* Active Question Panel */}
                    {practiceQuestions[practiceIndex] && (() => {
                      const q = practiceQuestions[practiceIndex];
                      return (
                        <div className="space-y-4">
                          <div className="bg-slate-900/95 border border-indigo-950 rounded-2xl p-4 shadow-lg text-center relative">
                            <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-slate-850 text-slate-400 text-[8px] rounded font-mono font-bold uppercase">
                              {q.type.replace("_", " ")}
                            </span>
                            <span className="text-[10px] text-amber-400 uppercase font-mono tracking-wider block mb-1">Challenge Prompt:</span>
                            <p className="text-sm font-bold text-white leading-relaxed">{q.prompt}</p>
                          </div>

                          {/* QUESTION RENDER: MULTIPLE CHOICE or CONJUGATION or CONJUNCTION FILL */}
                          {(q.type === 'multiple_choice' || q.type === 'conjugation' || q.type === 'conjunction_fill') && (
                            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                              {q.options.map((opt) => {
                                const isSelected = practiceSelectedOption === opt;
                                const isCorrectAnswer = opt === q.correctAnswer;
                                
                                let optionStyle = "bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-850";
                                if (isSelected) {
                                  optionStyle = "bg-indigo-600/30 border-indigo-400 text-white shadow-md ring-1 ring-indigo-400/40";
                                }
                                if (practiceCheckResult !== 'idle') {
                                  if (isCorrectAnswer) {
                                    optionStyle = "bg-emerald-950 border-emerald-500 text-emerald-100 ring-2 ring-emerald-500/20";
                                  } else if (isSelected) {
                                    optionStyle = "bg-rose-950 border-rose-500 text-rose-100 ring-2 ring-rose-500/20";
                                  } else {
                                    optionStyle = "bg-slate-900/50 border-slate-900/50 text-slate-500 pointer-events-none";
                                  }
                                }

                                return (
                                  <button
                                    key={opt}
                                    disabled={practiceCheckResult !== 'idle'}
                                    onClick={() => handlePracticeOptionSelect(opt)}
                                    className={`w-full py-2.5 px-4 rounded-xl border text-xs text-left font-medium transition-all duration-200 flex items-center justify-between ${optionStyle}`}
                                  >
                                    <span>{opt}</span>
                                    {practiceCheckResult !== 'idle' && isCorrectAnswer && (
                                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                                    )}
                                    {practiceCheckResult !== 'idle' && isSelected && !isCorrectAnswer && (
                                      <X className="w-3.5 h-3.5 text-rose-400" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          )}

                          {/* QUESTION RENDER: SENTENCE ARRANGE */}
                          {q.type === 'sentence_arrange' && (
                            <div className="space-y-3">
                              {/* Selected active assembly line */}
                              <div className="min-h-16 bg-slate-950/70 border-2 border-dashed border-indigo-950 rounded-xl p-2.5 flex flex-wrap gap-1.5 items-center justify-center">
                                {practiceSentenceChips.length === 0 ? (
                                  <span className="text-[10px] text-slate-500 font-medium">Tap vocabulary words to order sentence</span>
                                ) : (
                                  practiceSentenceChips.map((word, i) => (
                                    <button
                                      key={i}
                                      disabled={practiceCheckResult !== 'idle'}
                                      onClick={() => handleDeselectPracticeChip(word)}
                                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-2.5 py-1 rounded-lg text-[11px] shadow border border-indigo-500 flex items-center gap-1 transition-all"
                                    >
                                      {word}
                                    </button>
                                  ))
                                )}
                              </div>

                              {/* Available pool chips */}
                              <div className="flex flex-wrap gap-1.5 items-center justify-center bg-slate-900/30 p-2.5 rounded-xl min-h-14 border border-slate-900">
                                {practiceAvailableChips.map((word, i) => (
                                  <button
                                    key={i}
                                    disabled={practiceCheckResult !== 'idle'}
                                    onClick={() => handleSelectPracticeChip(word)}
                                    className="bg-slate-850 border border-slate-700 hover:bg-slate-700 text-indigo-200 font-medium px-2.5 py-1 rounded-lg text-[11px] transition-all shadow-sm"
                                  >
                                    {word}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Explanation feedback panel */}
                          {practiceCheckResult !== 'idle' && (
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`p-3 rounded-xl border text-[11px] leading-relaxed shadow-md ${
                                practiceCheckResult === 'correct' 
                                  ? 'bg-emerald-950/70 border-emerald-900 text-emerald-100' 
                                  : 'bg-rose-950/70 border-rose-900 text-rose-100'
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-1.5">
                                {practiceCheckResult === 'correct' ? (
                                  <>
                                    <Check className="w-4.5 h-4.5 text-emerald-400 flex-shrink-0" />
                                    <span className="font-bold text-white">Correct Explanation (व्याख्या):</span>
                                  </>
                                ) : (
                                  <>
                                    <X className="w-4.5 h-4.5 text-rose-400 flex-shrink-0" />
                                    <span className="font-bold text-white">Grammatical Analysis (त्रुटि):</span>
                                  </>
                                )}
                              </div>
                              <p className="text-[10.5px] leading-relaxed text-indigo-100">
                                {useTelugu ? q.teluguExplanation : q.explanation}
                              </p>
                              <div className="mt-2 pt-2 border-t border-slate-800/40 flex items-center justify-between text-[10px] text-gray-300">
                                <span>Correct target: <span className="font-bold font-mono text-white">{q.correctAnswer.replace(/,/g, " ")}</span></span>
                                <button
                                  onClick={() => speakHindiText(q.audioText)}
                                  className="p-1 bg-slate-800 hover:bg-slate-700 rounded text-amber-400 flex items-center gap-1"
                                >
                                  <Volume2 className="w-3 h-3" />
                                  <span>Hear</span>
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Verification / action button */}
                  <div className="mt-4">
                    {practiceCheckResult === 'idle' ? (
                      <button
                        onClick={handleCheckPracticeAnswer}
                        disabled={(practiceSentenceChips.length === 0 && practiceQuestions[practiceIndex]?.type === 'sentence_arrange') || (practiceSelectedOption === null && practiceQuestions[practiceIndex]?.type !== 'sentence_arrange')}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl shadow-md transition-all text-xs disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Verify Answer
                      </button>
                    ) : (
                      <button
                        onClick={handleNextPracticeQuestion}
                        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-2.5 rounded-xl shadow-md transition-all text-xs flex items-center justify-center gap-1.5"
                      >
                        <span>{practiceIndex + 1 === practiceQuestions.length ? "Finish Session" : "Continue"}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* STAGE C: PRACTICE COMPLETED CELEBRATION */}
              {practiceActive && practiceFinished && (
                <div className="flex flex-col flex-1 justify-between text-center items-center py-6">
                  <div className="space-y-4">
                    <div className="relative inline-block">
                      <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-full animate-bounce">
                        <Trophy className="w-12 h-12 text-amber-400" />
                      </div>
                      <div className="absolute -top-1 -right-1 bg-indigo-600 p-1.5 rounded-full text-white text-[9px] font-bold">
                        100XP
                      </div>
                    </div>

                    <div>
                      <h2 className="text-base font-bold text-white">Practice Complete! (सत्र समाप्त!)</h2>
                      <p className="text-[10.5px] text-indigo-300 mt-1 max-w-[280px]">
                        Excellent dedication! Challenge yourself on more advanced topics to continuous expansion.
                      </p>
                    </div>

                    {/* Performance badge matrix */}
                    <div className="bg-slate-900/90 border border-indigo-950 rounded-2xl p-4 shadow-xl space-y-3">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Completed Level:</span>
                        <span className="text-xs font-bold text-white">{practiceLevel} Drill</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Interactive Score:</span>
                        <span className="text-sm font-bold text-amber-300">
                          {practiceScore} / {practiceQuestions.length} Correct ({Math.round((practiceScore / practiceQuestions.length) * 100)}%)
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Assigned Title Badge:</span>
                        <span className="inline-block bg-indigo-950 text-indigo-200 border border-indigo-800 text-[10px] font-bold px-3 py-1 rounded-full mt-1.5 shadow-sm">
                          {practiceScore === practiceQuestions.length ? "🏅 Vyaakaran Acharya" : practiceScore >= practiceQuestions.length * 0.8 ? "🥇 Bhasha Mitra" : "🥈 Prarambhik"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="w-full space-y-2 mt-4">
                    <button
                      onClick={launchPracticeTest}
                      className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl shadow transition-all text-xs flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Retake Session</span>
                    </button>
                    <button
                      onClick={handleBackToMap}
                      className="w-full bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-medium py-2.5 rounded-xl transition-all text-xs"
                    >
                      Return to Map Pathway
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* SCREEN 2: GAMEPLAY PLAY LEVEL SCREEN */}
          {currentLevel && (
            <motion.div
              key="gameplay-screen"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex flex-col h-full"
            >
              {/* Back to progression path navigation button */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
                  Level {currentLevel.id}: {currentLevel.title}
                </span>
                
                {/* Stepper indicators */}
                <div className="flex items-center gap-1.5 bg-indigo-950/60 px-2.5 py-1 rounded-full text-[10px] text-indigo-300 font-bold">
                  <span className={gamePhase === 'learn' ? 'text-white' : ''}>Learn</span>
                  <ChevronRight className="w-2.5 h-2.5" />
                  <span className={gamePhase === 'match' ? 'text-white' : ''}>Match</span>
                  <ChevronRight className="w-2.5 h-2.5" />
                  <span className={gamePhase === 'sentence' ? 'text-white' : ''}>Build</span>
                </div>
              </div>

              {/* Progress bar inside Level Game */}
              <div className="w-full bg-indigo-950 h-1.5 rounded-full mb-4 overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full transition-all duration-500"
                  style={{ width: `${(phaseIndex + 1) * 33.3}%` }}
                ></div>
              </div>

              {/* LEVEL PHASES INTERACTIVE ENGINE */}
              <div className="flex-1 flex flex-col justify-between">
                
                {/* PHASE 1: LEARN & LISTEN */}
                {gamePhase === 'learn' && (
                  <div className="flex flex-col flex-1 justify-between">
                    <div className="space-y-3 overflow-y-auto max-h-[380px] pr-1">
                      <h3 className="text-xs font-bold text-white/90 uppercase tracking-wider mb-2">
                        Phase 1: Listen & Memorize
                      </h3>
                      
                      {currentLevel.vocabulary.map((vocab) => (
                        <div 
                          key={vocab.id}
                          className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex items-start justify-between gap-3 shadow transition-all hover:bg-slate-800/80"
                        >
                          <div className="flex-1">
                            {/* Hindi original text and phonetic spelling */}
                            <div className="flex items-baseline gap-2">
                              <span className="text-sm font-bold text-amber-300">{vocab.hindi}</span>
                            </div>
                            <div className="text-[11px] text-gray-400 italic mb-1 font-mono">
                              {vocab.transliteration}
                            </div>
                            
                            {/* Translated target text based on active instruction language */}
                            <div className="text-xs text-white font-medium">
                              {useTelugu ? vocab.telugu : vocab.english}
                            </div>
                          </div>

                          {/* Sound execution Speaker Button */}
                          <button
                            onClick={() => handlePlayTTS(vocab.hindi, vocab.id)}
                            className={`p-2 rounded-lg transition-all ${
                              playingWordId === vocab.id 
                                ? 'bg-indigo-600 text-white scale-95 animate-ping' 
                                : 'bg-slate-800 hover:bg-slate-700 text-indigo-300'
                            }`}
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={startMatchGame}
                      className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-xl shadow-lg transition-all text-xs flex items-center justify-center gap-2 mt-4"
                    >
                      <span>Proceed to Word Matching</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* PHASE 2: WORD MATCHING GAME */}
                {gamePhase === 'match' && (
                  <div className="flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-white/90 uppercase tracking-wider mb-1">
                        Phase 2: Tap & Pair words
                      </h3>
                      <p className="text-[11px] text-indigo-300 mb-4">
                        Match the corresponding Hindi phrases with their translated meanings.
                      </p>

                      {/* Matching grid array */}
                      <div className="grid grid-cols-2 gap-2 max-h-[360px] overflow-y-auto">
                        {matchCards.map((card) => {
                          const isSelected = selectedMatchCard?.id === card.id;
                          const isCardMatched = card.isMatched;
                          const isShaking = shakeCardIds.includes(card.id);

                          return (
                            <button
                              key={card.id}
                              disabled={isCardMatched}
                              onClick={() => handleMatchCardTap(card)}
                              className={`h-16 rounded-xl border p-2 text-[11px] font-medium transition-all flex items-center justify-center text-center ${
                                isCardMatched
                                  ? 'opacity-0 scale-75 cursor-default pointer-events-none'
                                  : isShaking
                                    ? 'bg-rose-950 border-rose-500 text-rose-200 animate-shake'
                                    : isSelected
                                      ? 'bg-indigo-600 border-indigo-400 text-white ring-2 ring-indigo-400/40 shadow-indigo-500/20'
                                      : 'bg-slate-900 border-slate-800 hover:bg-slate-800/80 text-gray-200'
                              }`}
                              style={{
                                animation: isShaking ? 'shake 0.4s ease-in-out' : 'none'
                              }}
                            >
                              <span>{card.text}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="text-center text-[10px] text-indigo-400 mt-4">
                      Matched: {matchedIds.length} / 4 pairs
                    </div>
                  </div>
                )}

                {/* PHASE 3: SENTENCE BUILDER GAME */}
                {gamePhase === 'sentence' && (
                  <div className="flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-white/90 uppercase tracking-wider mb-1">
                        Phase 3: Sentence Builder
                      </h3>
                      <p className="text-[11px] text-indigo-300 mb-4">
                        Assemble the correct Hindi translation sequence for the phrase shown below:
                      </p>

                      {/* Targeted translation text in selected instructions */}
                      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 mb-4 text-center">
                        <span className="text-[10px] text-amber-400 uppercase font-mono tracking-wider block mb-1">
                          Translate Target:
                        </span>
                        <p className="text-sm font-bold text-white leading-relaxed">
                          {useTelugu ? activeSentenceBuilder?.teluguTarget : activeSentenceBuilder?.englishTarget}
                        </p>
                      </div>

                      {/* Selected Built Words slot */}
                      <div className="min-h-16 bg-slate-900/60 border-2 border-dashed border-slate-800 rounded-xl p-2.5 mb-4 flex flex-wrap gap-2 items-center justify-center">
                        {selectedChips.length === 0 ? (
                          <span className="text-[11px] text-slate-500 font-medium">Tap word chips to construct sentence</span>
                        ) : (
                          selectedChips.map((word, i) => (
                            <button
                              key={i}
                              onClick={() => handleDeselectChip(word)}
                              className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-3 py-1.5 rounded-lg text-xs shadow-md border border-indigo-500 flex items-center gap-1"
                            >
                              <span>{word}</span>
                            </button>
                          ))
                        )}
                      </div>

                      {/* Scattered Words Options Tray */}
                      <div className="flex flex-wrap gap-2 items-center justify-center mb-4 bg-slate-900/30 p-2 rounded-xl min-h-16 border border-slate-900">
                        {availableChips.map((word, i) => (
                          <button
                            key={i}
                            onClick={() => handleSelectChip(word)}
                            className="bg-slate-850 border border-slate-700 hover:bg-slate-700 text-indigo-200 font-medium px-3 py-1.5 rounded-lg text-xs transition-all shadow-sm"
                          >
                            {word}
                          </button>
                        ))}
                      </div>

                      {/* Error feedback card */}
                      {sentenceError && (
                        <div className="bg-rose-950/40 border border-rose-900 text-rose-200 text-[11px] p-2 rounded-lg flex items-center gap-2 mb-3">
                          <X className="w-4 h-4 text-rose-500 flex-shrink-0" />
                          <span>Incorrect word arrangement. Try rearrange sequence!</span>
                        </div>
                      )}

                      {/* Success feedback card */}
                      {sentenceSuccess && (
                        <div className="bg-emerald-950/60 border border-emerald-900 text-emerald-200 text-[11px] p-2 rounded-lg flex items-center gap-2 mb-3">
                          <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          <span>Perfect Hindi translation match! Well done!</span>
                        </div>
                      )}
                    </div>

                    <div>
                      {sentenceSuccess ? (
                        <button
                          onClick={() => handleCompleteLevel(3)}
                          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded-xl shadow-lg transition-all text-xs flex items-center justify-center gap-2"
                        >
                          <span>Complete Level & Claim Stars</span>
                          <Star className="w-4 h-4 text-amber-300 fill-amber-300 animate-spin" />
                        </button>
                      ) : (
                        <button
                          onClick={handleCheckSentence}
                          disabled={selectedChips.length === 0}
                          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl shadow-lg transition-all text-xs"
                        >
                          Check Answer Sequence
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* PHASE 4: COMPLETED SUMMARY STATUS */}
                {gamePhase === 'completed' && (
                  <div className="flex flex-col flex-1 justify-center items-center text-center py-6">
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="p-4 bg-emerald-500/20 rounded-full border border-emerald-500/30 mb-4"
                    >
                      <Award className="w-12 h-12 text-emerald-400 animate-bounce" />
                    </motion.div>
                    
                    <h2 className="text-lg font-bold text-white mb-2">Level Completed!</h2>
                    <p className="text-xs text-indigo-300 max-w-[240px] mb-6">
                      Great job! You have fully verified Phase 1, Phase 2, and Phase 3 of {currentLevel.title}.
                    </p>

                    {/* Stars achieved */}
                    <div className="flex items-center gap-1.5 mb-6">
                      {[...Array(3)].map((_, i) => (
                        <Star key={i} className="w-8 h-8 text-amber-400 fill-amber-400" />
                      ))}
                    </div>

                    <button
                      onClick={handleBackToMap}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded-xl shadow-lg transition-all text-xs"
                    >
                      Return to Progression Map
                    </button>
                  </div>
                )}

              </div>
            </motion.div>
          )}

          {/* SCREEN 3: LEVEL 5 MILESTONE TEST INTERACTIVE BOARD */}
          {milestoneActive && (
            <motion.div
              key="milestone-screen"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="flex flex-col h-full"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  Level 5: Milestone Test
                </span>
                
                {/* Score and count trackers */}
                <span className="text-[10px] font-mono font-bold text-white bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
                  Question {milestoneIndex + 1} of 10
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-indigo-950 h-1.5 rounded-full mb-5 overflow-hidden">
                <div 
                  className="bg-amber-500 h-full transition-all duration-300"
                  style={{ width: `${((milestoneIndex + 1) / 10) * 100}%` }}
                ></div>
              </div>

              {!milestoneFinished ? (
                <div className="flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    {/* Prompt container */}
                    <div className="bg-indigo-900/60 border border-indigo-800 rounded-xl p-4 text-center">
                      <span className="text-[9px] uppercase font-bold tracking-wider text-amber-400 block mb-1">
                        Prompt Instruction (No Hints Enabled)
                      </span>
                      <p className="text-sm font-bold text-white whitespace-pre-line leading-relaxed">
                        {milestoneQuestions[milestoneIndex]?.prompt}
                      </p>
                    </div>

                    {/* QUESTION TYPE 1: MULTIPLE CHOICE TRANSLATION */}
                    {milestoneQuestions[milestoneIndex]?.type === 'match' && (
                      <div className="space-y-2">
                        {milestoneQuestions[milestoneIndex]?.answerOptions?.map((option, i) => {
                          const isSelected = selectedOption === option;
                          const isChecking = milestoneCheckResult !== 'idle';
                          
                          let cardStyle = 'bg-slate-900 border-slate-800 text-white hover:bg-slate-850';
                          if (isSelected) cardStyle = 'bg-indigo-650 border-indigo-400 text-white ring-2 ring-indigo-400/30';
                          
                          if (isChecking) {
                            if (option === milestoneQuestions[milestoneIndex].correctAnswer) {
                              cardStyle = 'bg-emerald-900 border-emerald-500 text-emerald-100';
                            } else if (isSelected) {
                              cardStyle = 'bg-rose-950 border-rose-500 text-rose-100';
                            }
                          }

                          return (
                            <button
                              key={i}
                              disabled={isChecking}
                              onClick={() => handleMilestoneOptionSelect(option)}
                              className={`w-full text-left p-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-between ${cardStyle}`}
                            >
                              <span>{option}</span>
                              {isChecking && option === milestoneQuestions[milestoneIndex].correctAnswer && (
                                <Check className="w-4 h-4 text-emerald-400" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* QUESTION TYPE 2: SENTENCE BUILDER */}
                    {milestoneQuestions[milestoneIndex]?.type === 'sentence' && (
                      <div className="space-y-3">
                        {/* Sentence Construct box */}
                        <div className="min-h-16 bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 flex flex-wrap gap-2 items-center justify-center">
                          {milestoneSentenceChips.length === 0 ? (
                            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Arrange words sequence</span>
                          ) : (
                            milestoneSentenceChips.map((word, i) => (
                              <button
                                key={i}
                                disabled={milestoneCheckResult !== 'idle'}
                                onClick={() => handleDeselectMilestoneChip(word)}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-2.5 py-1.5 rounded-lg text-xs shadow-sm border border-indigo-500"
                              >
                                {word}
                              </button>
                            ))
                          )}
                        </div>

                        {/* Available Chips tray */}
                        <div className="flex flex-wrap gap-2 items-center justify-center p-2 bg-slate-900/40 rounded-xl border border-slate-900/60 min-h-12">
                          {milestoneAvailableChips.map((word, i) => (
                            <button
                              key={i}
                              disabled={milestoneCheckResult !== 'idle'}
                              onClick={() => handleSelectMilestoneChip(word)}
                              className="bg-slate-850 border border-slate-750 text-indigo-200 font-semibold px-2.5 py-1.5 rounded-lg text-xs"
                            >
                              {word}
                            </button>
                          ))}
                        </div>

                        {/* Status feedback boxes */}
                        {milestoneCheckResult === 'correct' && (
                          <div className="bg-emerald-950/60 border border-emerald-900 text-emerald-200 text-[10px] p-2 rounded-lg flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Correct answer sequence matched!</span>
                          </div>
                        )}
                        {milestoneCheckResult === 'incorrect' && (
                          <div className="bg-rose-950/60 border border-rose-900 text-rose-200 text-[10px] p-2 rounded-lg flex items-center gap-1.5">
                            <X className="w-3.5 h-3.5 text-rose-500" />
                            <span>Incorrect sequence! Correct order is: {milestoneQuestions[milestoneIndex].sentenceBuilder?.correctSequence.join(" ")}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-6">
                    {milestoneCheckResult === 'idle' ? (
                      <button
                        onClick={handleCheckMilestoneAnswer}
                        disabled={
                          (milestoneQuestions[milestoneIndex]?.type === 'match' && !selectedOption) ||
                          (milestoneQuestions[milestoneIndex]?.type === 'sentence' && milestoneSentenceChips.length === 0)
                        }
                        className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-xl shadow-lg transition-all text-xs"
                      >
                        Submit Answer
                      </button>
                    ) : (
                      <button
                        onClick={handleNextMilestoneQuestion}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-xl shadow-lg transition-all text-xs flex items-center justify-center gap-1.5"
                      >
                        <span>Next Question</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* MILESTONE COMPLETED RESULTS PANEL */
                <div className="flex-1 flex flex-col justify-center items-center text-center py-4">
                  {milestoneScore >= 8 ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-emerald-500/20 rounded-full border border-emerald-500/30 inline-block animate-bounce animate-pulse">
                        <Award className="w-12 h-12 text-amber-400" />
                      </div>
                      <h2 className="text-lg font-bold text-white">
                        {activeMilestoneId === 13 ? "🏆 LinguaQuest Graduate!" : "Milestone Test Passed!"}
                      </h2>
                      
                      {/* Celebration confetti simulation */}
                      <div className="bg-indigo-950 p-4 border border-indigo-800 rounded-2xl shadow-2xl relative overflow-hidden">
                        <span className="text-[10px] text-indigo-400 uppercase font-mono block mb-1">Certificate of Achievement</span>
                        <span className="text-3xl font-extrabold text-emerald-400 font-mono">{milestoneScore * 10}%</span>
                        <p className="text-[11.5px] text-indigo-200 mt-2 leading-relaxed">
                          {activeMilestoneId === 13 ? (
                            <>
                              <span className="font-bold text-amber-300">Bhasha Pravina Achieved!</span><br />
                              Incredible work! You scored {milestoneScore * 10}% on the final comprehensive test. You have officially graduated from LinguaQuest Hindi! Dr. Vyas awards you the title of Master of Language!
                            </>
                          ) : activeMilestoneId === 10 ? (
                            "Excellent! You scored " + (milestoneScore * 10) + "% on the Intermediate Milestone. Level 11 (Emergency & Health) has been officially unlocked! You can now explore advanced topics."
                          ) : (
                            "Excellent! You correctly answered " + milestoneScore + " out of 10 questions. Level 6 (Shopping & Transactions) has been officially unlocked!"
                          )}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-4 bg-rose-500/20 rounded-full border border-rose-500/30 inline-block">
                        <X className="w-12 h-12 text-rose-500" />
                      </div>
                      <h2 className="text-lg font-bold text-white">Milestone Test Failed</h2>
                      
                      <div className="bg-indigo-950 p-4 border border-indigo-800 rounded-2xl">
                        <span className="text-[10px] text-indigo-400 uppercase font-mono block mb-1">Required score: 80%</span>
                        <span className="text-3xl font-extrabold text-rose-400 font-mono">{milestoneScore * 10}%</span>
                        <p className="text-[11px] text-indigo-200 mt-2">
                          {activeMilestoneId === 13 ? (
                            "You answered " + milestoneScore + " out of 10 correctly. Take some time to review Levels 11-12 with Dr. Vyas, then try again to achieve graduation!"
                          ) : activeMilestoneId === 10 ? (
                            "You answered " + milestoneScore + " out of 10 correctly. Take some time to review Levels 6-9, then try again to unlock Level 11."
                          ) : (
                            "You answered " + milestoneScore + " out of 10 correctly. Take some time to review Levels 1-4, then try again to unlock Level 6."
                          )}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="w-full space-y-2 mt-6">
                    {milestoneScore < 8 && (
                      <button
                        onClick={() => launchMilestoneTest(activeMilestoneId)}
                        className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-xl shadow-lg transition-all text-xs cursor-pointer"
                      >
                        Retry Milestone Test
                      </button>
                    )}
                    <button
                      onClick={handleBackToMap}
                      className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-xl shadow-lg transition-all text-xs cursor-pointer"
                    >
                      Return to Map Dashboard
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>

        {/* SCREEN: LINGUISTIC MENTOR DR. VYAS CHAT PANEL */}
        {isLinguistChatOpen && (
          <motion.div
            key="linguist-chat-screen"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="absolute inset-x-2 bottom-2 top-2 bg-slate-950/95 border border-indigo-500/30 rounded-3xl p-4 z-50 flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Header inside chat */}
            <div className="flex items-center justify-between border-b border-indigo-900/50 pb-2.5 mb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center animate-pulse">
                  <Languages className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-[11px] font-bold text-white tracking-wide">Dr. Vyas (Linguist)</h3>
                  <p className="text-[8.5px] text-amber-400 font-mono font-medium">Linguistic Advisor & Coach</p>
                </div>
              </div>
              <button
                onClick={() => setIsLinguistChatOpen(false)}
                className="text-[10px] text-gray-400 hover:text-white px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg transition-all cursor-pointer"
              >
                Minimize
              </button>
            </div>

            {/* Chat history list */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-[11px] scrollbar-thin scrollbar-thumb-slate-800">
              {chatHistory.map((chat, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${chat.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[90%] rounded-2xl px-3 py-2 leading-relaxed shadow-md ${
                      chat.role === 'user'
                        ? 'bg-indigo-600 text-white rounded-tr-none'
                        : 'bg-slate-900 border border-slate-800 text-indigo-100 rounded-tl-none font-sans whitespace-pre-line'
                    }`}
                  >
                    {chat.text}
                  </div>
                  {chat.role === 'model' && (
                    <button
                      onClick={() => handlePlayTTS(chat.text, `chat_${idx}`)}
                      className="text-[9px] text-indigo-400 flex items-center gap-1 mt-1 pl-1 hover:text-indigo-300 transition-all self-start cursor-pointer"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>Speak Explanation</span>
                    </button>
                  )}
                </div>
              ))}
              {isChatLoading && (
                <div className="flex items-center gap-2 text-[10px] text-amber-400 animate-pulse bg-slate-900/40 p-2 rounded-xl border border-indigo-950/40">
                  <RefreshCw className="w-3 h-3 animate-spin text-amber-500" />
                  <span>Dr. Vyas is composing grammatical insights...</span>
                </div>
              )}
            </div>

            {/* Quick Prompts tray */}
            <div className="mt-2.5 flex flex-wrap gap-1 items-center justify-start max-h-16 overflow-y-auto">
              <button
                onClick={() => {
                  setChatInput("Why is Hindi SOV while English is SVO?");
                }}
                className="text-[8.5px] bg-slate-900 hover:bg-slate-800 text-indigo-300 px-2 py-1 rounded-md border border-slate-800 cursor-pointer"
              >
                💡 Hindi SOV vs English SVO
              </button>
              <button
                onClick={() => {
                  setChatInput("How are Hindi grammatical gender markers similar to Telugu verb suffixes?");
                }}
                className="text-[8.5px] bg-slate-900 hover:bg-slate-800 text-indigo-300 px-2 py-1 rounded-md border border-slate-800 cursor-pointer"
              >
                💡 Hindi vs Telugu Suffixes
              </button>
              <button
                onClick={() => {
                  setChatInput("Explain how direct and oblique cases work with postpositions.");
                }}
                className="text-[8.5px] bg-slate-900 hover:bg-slate-800 text-indigo-300 px-2 py-1 rounded-md border border-slate-800 cursor-pointer"
              >
                💡 Postpositions & Cases
              </button>
            </div>

            {/* Chat Input controls */}
            <div className="mt-2.5 pt-2.5 border-t border-slate-900 flex gap-2">
              <input
                type="text"
                placeholder="Ask about gender, postpositions, Telugu parallels..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendLinguistMessage();
                }}
                className="flex-1 bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                onClick={handleSendLinguistMessage}
                disabled={isChatLoading || !chatInput.trim()}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Ask
              </button>
            </div>
          </motion.div>
        )}

        {/* SCREEN: IMPORTANT NOTES & STUDY GUIDE OVERLAY */}
        {isNotesOpen && (
          <motion.div
            key="important-notes-screen"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="absolute inset-x-2 bottom-2 top-2 bg-slate-950/98 border border-amber-500/40 rounded-3xl p-4 z-50 flex flex-col shadow-2xl overflow-hidden animate-none"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-indigo-900/60 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white tracking-wide">Linguistic Study Guide</h3>
                  <p className="text-[8.5px] text-amber-400 font-mono font-medium">Important Notes & Grammatical Rules</p>
                </div>
              </div>
              <button
                onClick={() => setIsNotesOpen(false)}
                className="text-[10px] text-white hover:bg-rose-600 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl transition-all cursor-pointer font-bold"
              >
                Close Notes
              </button>
            </div>

            {/* Content Scroll Area */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-[11px] text-indigo-100 leading-relaxed">
              
              {/* Note 1 */}
              <div className="bg-slate-900/80 border border-indigo-900/40 rounded-xl p-3">
                <h4 className="text-amber-300 font-bold mb-1.5 flex items-center gap-1.5">
                  <span className="text-[10px] px-1.5 py-0.5 bg-amber-500/10 border border-amber-500/30 rounded text-amber-400 font-mono">RULE 1</span>
                  SOV Word Order vs SVO
                </h4>
                <p className="text-gray-300 mb-1">
                  English uses <span className="text-white font-bold">Subject-Verb-Object (SVO)</span>, whereas Hindi utilizes <span className="text-emerald-400 font-bold">Subject-Object-Verb (SOV)</span> word order. This aligns perfectly with Telugu syntax!
                </p>
                <div className="bg-slate-950 p-2 rounded-lg font-mono text-[9px] text-indigo-200 mt-2 space-y-2">
                  <div className="flex justify-between items-center bg-slate-900/60 p-1 px-2 rounded border border-slate-900">
                    <div><span className="text-amber-400">English (SVO):</span> I drink water.</div>
                  </div>
                  <div className="flex justify-between items-center bg-slate-900/60 p-1 px-2 rounded border border-slate-900">
                    <div><span className="text-emerald-400">Hindi (SOV):</span> Main pani peeta hoon.</div>
                    <button 
                      onClick={() => speakHindiText("Main pani peeta hoon")}
                      className="p-1 text-amber-400 hover:text-amber-300 transition-all cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex justify-between items-center bg-slate-900/60 p-1 px-2 rounded border border-slate-900">
                    <div><span className="text-indigo-400">Telugu (SOV):</span> Nenu neeru thaguthunnanu.</div>
                  </div>
                </div>
              </div>

              {/* Note 2 */}
              <div className="bg-slate-900/80 border border-indigo-900/40 rounded-xl p-3">
                <h4 className="text-amber-300 font-bold mb-1.5 flex items-center gap-1.5">
                  <span className="text-[10px] px-1.5 py-0.5 bg-amber-500/10 border border-amber-500/30 rounded text-amber-400 font-mono">RULE 2</span>
                  Grammatical Gender Markers
                </h4>
                <p className="text-gray-300 mb-1">
                  In Hindi, <span className="text-white font-bold">every single noun</span> is classified as either masculine or feminine. Verb endings and adjectives adjust to match this gender.
                </p>
                <ul className="list-disc pl-4 space-y-1 text-gray-300 text-[10px] mt-1.5">
                  <li><span className="text-blue-300">Masculine ending:</span> Usually ends in <span className="font-mono text-white">"-a"</span> (e.g., Samosa). Verb helper: <span className="font-mono text-white">"karta hoon"</span> (I do, male).</li>
                  <li><span className="text-pink-300">Feminine ending:</span> Usually ends in <span className="font-mono text-white">"-ee"</span> (e.g., Chai, Roti, Gadi). Verb helper: <span className="font-mono text-white">"karti hoon"</span> (I do, female) or <span className="font-mono text-white">"gaati hai"</span> (she sings).</li>
                </ul>
              </div>

              {/* Note 3 */}
              <div className="bg-slate-900/80 border border-indigo-900/40 rounded-xl p-3">
                <h4 className="text-amber-300 font-bold mb-1.5 flex items-center gap-1.5">
                  <span className="text-[10px] px-1.5 py-0.5 bg-amber-500/10 border border-amber-500/30 rounded text-amber-400 font-mono">RULE 3</span>
                  Postpositions instead of Prepositions
                </h4>
                <p className="text-gray-300 mb-1.5">
                  While English places indicators <span className="text-white font-bold">before</span> nouns (e.g., <span className="italic">"from America"</span>), Hindi (and Telugu!) places them <span className="text-emerald-400 font-bold">after the noun</span> as postpositions (e.g., <span className="italic">"America se"</span>).
                </p>
                <div className="grid grid-cols-3 gap-1 bg-slate-950 p-2 rounded-lg font-mono text-[9px] text-center border border-indigo-950">
                  <div className="text-amber-400">English</div>
                  <div className="text-emerald-400">Hindi</div>
                  <div className="text-indigo-400">Telugu</div>
                  <div className="border-t border-slate-900 pt-1">from America</div>
                  <div className="border-t border-slate-900 pt-1 text-emerald-300 flex items-center justify-center gap-1">
                    <span>America se</span>
                    <button onClick={() => speakHindiText("America se")} className="text-amber-400 cursor-pointer">
                      <Volume2 className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="border-t border-slate-900 pt-1 text-indigo-300">America nundi</div>
                  <div>to/for Rahul</div>
                  <div className="text-emerald-300 flex items-center justify-center gap-1">
                    <span>Rahul ko</span>
                    <button onClick={() => speakHindiText("Rahul ko")} className="text-amber-400 cursor-pointer">
                      <Volume2 className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="text-indigo-300 font-mono">Rahul ki</div>
                </div>
              </div>

              {/* Note 4 */}
              <div className="bg-slate-900/80 border border-indigo-900/40 rounded-xl p-3">
                <h4 className="text-amber-300 font-bold mb-1.5 flex items-center gap-1.5">
                  <span className="text-[10px] px-1.5 py-0.5 bg-amber-500/10 border border-amber-500/30 rounded text-amber-400 font-mono">RULE 4</span>
                  Direct vs Oblique Cases
                </h4>
                <p className="text-gray-300">
                  When a postposition (like <span className="text-white">se, ko, mein, ka</span>) follows a masculine noun ending in <span className="text-white">"-a"</span>, that noun changes its ending to <span className="text-amber-400 font-bold">"-e"</span> (this is called the Oblique case!).
                </p>
                <p className="text-[10px] text-indigo-300 mt-1">
                  Example: <span className="italic">"Kamra"</span> (room) becomes <span className="text-emerald-400 font-semibold font-mono">"kamre mein"</span> (in the room). <span className="italic">"Larka"</span> (boy) becomes <span className="text-emerald-400 font-semibold font-mono">"larke ko"</span> (to the boy).
                </p>
              </div>

              {/* Note 5 */}
              <div className="bg-slate-900/80 border border-indigo-900/40 rounded-xl p-3">
                <h4 className="text-amber-300 font-bold mb-1.5 flex items-center gap-1.5">
                  <span className="text-[10px] px-1.5 py-0.5 bg-amber-500/10 border border-amber-500/30 rounded text-amber-400 font-mono">RULE 5</span>
                  Linguistic Pronunciation Guide
                </h4>
                <ul className="list-disc pl-4 space-y-1.5 text-gray-300 text-[10.5px]">
                  <li><span className="text-emerald-400 font-bold">Aspirated Consonants:</span> Keep a puff of air ready when pronouncing letters like <span className="text-white font-semibold">kh, gh, th, dh, ph</span>. Pronouncing <span className="italic">"Dhanyavaad"</span> with a deep aspirated "Dha" distinguishes it from standard sound waves!</li>
                  <li><span className="text-amber-400 font-bold">Nasalization:</span> Words like <span className="text-white font-semibold">"haan"</span> (yes), <span className="text-white font-semibold">"hoon"</span> (am), or <span className="text-white font-semibold">"hain"</span> (are) require soft nasal resonance.</li>
                  <li><span className="text-indigo-400 font-bold">Flapped 'R':</span> The Hindi retroflex flapped sound in <span className="text-white font-semibold">"Larki"</span> or <span className="text-white font-semibold">"Gadi"</span> is spoken by curling the tongue tip backwards and flipping it forward quickly against the roof of the mouth.</li>
                </ul>
              </div>

              {/* Quick Level Vocabulary Index */}
              <div className="bg-slate-900/80 border border-amber-500/20 rounded-xl p-3 text-indigo-100">
                <h4 className="text-amber-300 font-bold mb-2 flex items-center gap-1.5">
                  📖 Interactive Vocabulary Cheat Sheet
                </h4>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  <div className="border-b border-slate-950 pb-1.5">
                    <span className="text-indigo-300 font-semibold text-[10px] uppercase">Relations & Polite Greetings</span>
                    <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-400 mt-1">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => speakHindiText("Mata")} className="text-amber-400 hover:scale-110 cursor-pointer p-0.5 rounded bg-slate-800"><Volume2 className="w-3 h-3" /></button>
                        <span>Mata (माँ) - Mother</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => speakHindiText("Pita")} className="text-amber-400 hover:scale-110 cursor-pointer p-0.5 rounded bg-slate-800"><Volume2 className="w-3 h-3" /></button>
                        <span>Pita (पापा) - Father</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => speakHindiText("Bhai")} className="text-amber-400 hover:scale-110 cursor-pointer p-0.5 rounded bg-slate-800"><Volume2 className="w-3 h-3" /></button>
                        <span>Bhai (भाई) - Brother</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => speakHindiText("Behen")} className="text-amber-400 hover:scale-110 cursor-pointer p-0.5 rounded bg-slate-800"><Volume2 className="w-3 h-3" /></button>
                        <span>Behen (बहन) - Sister</span>
                      </div>
                      <div className="flex items-center gap-1.5 col-span-2">
                        <button onClick={() => speakHindiText("Dhanyavaad")} className="text-amber-400 hover:scale-110 cursor-pointer p-0.5 rounded bg-slate-800"><Volume2 className="w-3 h-3" /></button>
                        <span>Dhanyavaad - Thank you (Dhanayavaadalu)</span>
                      </div>
                    </div>
                  </div>
                  <div className="border-b border-slate-950 pb-1.5">
                    <span className="text-indigo-300 font-semibold text-[10px] uppercase">Daily Conversations & Transactions</span>
                    <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-400 mt-1">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => speakHindiText("Dukaan")} className="text-amber-400 hover:scale-110 cursor-pointer p-0.5 rounded bg-slate-800"><Volume2 className="w-3 h-3" /></button>
                        <span>Dukaan - Shop</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => speakHindiText("Rupaye")} className="text-amber-400 hover:scale-110 cursor-pointer p-0.5 rounded bg-slate-800"><Volume2 className="w-3 h-3" /></button>
                        <span>Rupaye - Rupees</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[9px]">
                        <button onClick={() => speakHindiText("Mehenga")} className="text-amber-400 hover:scale-110 cursor-pointer p-0.5 rounded bg-slate-800"><Volume2 className="w-3 h-3" /></button>
                        <span>Mehenga - Expensive</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => speakHindiText("Chahiye")} className="text-amber-400 hover:scale-110 cursor-pointer p-0.5 rounded bg-slate-800"><Volume2 className="w-3 h-3" /></button>
                        <span>Chahiye - Want (Kaavaali)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => speakHindiText("Pani")} className="text-amber-400 hover:scale-110 cursor-pointer p-0.5 rounded bg-slate-800"><Volume2 className="w-3 h-3" /></button>
                        <span>Pani - Water (Neeru)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => speakHindiText("Khana")} className="text-amber-400 hover:scale-110 cursor-pointer p-0.5 rounded bg-slate-800"><Volume2 className="w-3 h-3" /></button>
                        <span>Khana - Food / To eat</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <span className="text-indigo-300 font-semibold text-[10px] uppercase">Advanced Travel, Emergency & Leisure</span>
                    <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-400 mt-1">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => speakHindiText("Kahaan")} className="text-amber-400 hover:scale-110 cursor-pointer p-0.5 rounded bg-slate-800"><Volume2 className="w-3 h-3" /></button>
                        <span>Kahaan - Where</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => speakHindiText("Madad")} className="text-amber-400 hover:scale-110 cursor-pointer p-0.5 rounded bg-slate-800"><Volume2 className="w-3 h-3" /></button>
                        <span>Madad - Help (Sahaayam)</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[9px]">
                        <button onClick={() => speakHindiText("Aapaatkal")} className="text-amber-400 hover:scale-110 cursor-pointer p-0.5 rounded bg-slate-800"><Volume2 className="w-3 h-3" /></button>
                        <span>Aapaatkal - Emergency</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => speakHindiText("Shauk")} className="text-amber-400 hover:scale-110 cursor-pointer p-0.5 rounded bg-slate-800"><Volume2 className="w-3 h-3" /></button>
                        <span>Shauk - Hobby</span>
                      </div>
                      <div className="flex items-center gap-1.5 col-span-2">
                        <button onClick={() => speakHindiText("Sangeet")} className="text-amber-400 hover:scale-110 cursor-pointer p-0.5 rounded bg-slate-800"><Volume2 className="w-3 h-3" /></button>
                        <span>Sangeet - Music (Sangeetham)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Quick action button inside study guide */}
            <div className="mt-3 text-center">
              <p className="text-[9px] text-amber-500/80 italic mb-2">Need custom drills? Ask Dr. Vyas using the live mentor chat!</p>
              <button
                onClick={() => {
                  setIsNotesOpen(false);
                  setIsLinguistChatOpen(true);
                }}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-xl text-xs shadow-lg transition-all cursor-pointer"
              >
                Open Dr. Vyas Live Chat
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Interactive Tab Navigation Bar */}
      {!currentLevel && !milestoneActive && !practiceActive && (
        <div className="bg-[#0c0f1d] border-t border-indigo-950/60 px-6 py-2.5 flex items-center justify-between z-30 shadow-2xl">
          <button
            onClick={() => {
              setMainTab('pathway');
              setPlayingWordId(null);
            }}
            className={`flex flex-col items-center gap-1 transition-all ${
              mainTab === 'pathway' ? 'text-amber-400 scale-105' : 'text-slate-400 hover:text-indigo-200'
            }`}
          >
            <Layers className="w-4.5 h-4.5" />
            <span className="text-[9px] font-bold tracking-wider uppercase">Pathway</span>
          </button>
          
          <button
            onClick={() => {
              setMainTab('encyclopedia');
              setPlayingWordId(null);
            }}
            className={`flex flex-col items-center gap-1 transition-all ${
              mainTab === 'encyclopedia' ? 'text-amber-400 scale-105' : 'text-slate-400 hover:text-indigo-200'
            }`}
          >
            <BookOpen className="w-4.5 h-4.5" />
            <span className="text-[9px] font-bold tracking-wider uppercase">Encyclopedia</span>
          </button>

          <button
            onClick={() => {
              setMainTab('practice');
              setPlayingWordId(null);
            }}
            className={`flex flex-col items-center gap-1 transition-all ${
              mainTab === 'practice' ? 'text-amber-400 scale-105' : 'text-slate-400 hover:text-indigo-200'
            }`}
          >
            <Sparkles className="w-4.5 h-4.5" />
            <span className="text-[9px] font-bold tracking-wider uppercase">Practice Lab</span>
          </button>
        </div>
      )}

      {/* Android Bottom Navigation Pill */}
      <div className="bg-indigo-950 pt-2 pb-5 flex justify-center items-center z-40 border-t border-indigo-900/40">
        <button 
          onClick={handleBackToMap}
          className="w-28 h-1 bg-white/30 rounded-full hover:bg-white/50 transition-all focus:outline-none"
        ></button>
      </div>

      {/* Keyframe shaking CSS injection */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          15%, 45%, 75% { transform: translateX(-6px); }
          30%, 60%, 90% { transform: translateX(6px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
}

// Utility shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
