export interface VerbConjugation {
  presentMasculine: string;
  presentFeminine: string;
  pastMasculine: string;
  pastFeminine: string;
  futureMasculine: string;
  futureFeminine: string;
}

export interface VerbItem {
  infinitive: string;
  devanagari: string;
  root: string;
  englishMeaning: string;
  teluguMeaning: string;
  transliteration: string;
  conjugations: VerbConjugation;
  examples: {
    hindi: string;
    english: string;
    telugu: string;
    transliteration: string;
    explanation: string;
  }[];
}

export interface TenseItem {
  id: string;
  name: string;
  teluguName: string;
  formula: string;
  explanation: string;
  teluguExplanation: string;
  examples: {
    hindi: string;
    english: string;
    telugu: string;
    transliteration: string;
    gender: 'Masculine' | 'Feminine' | 'Neutral';
  }[];
}

export interface ConjunctionItem {
  word: string;
  devanagari: string;
  englishMeaning: string;
  teluguMeaning: string;
  transliteration: string;
  explanation: string;
  teluguExplanation: string;
  examples: {
    hindi: string;
    english: string;
    telugu: string;
    transliteration: string;
  }[];
}

export const HINDI_VERBS: VerbItem[] = [
  {
    infinitive: "Bolna",
    devanagari: "बोलना",
    root: "Bol",
    englishMeaning: "To speak / talk",
    teluguMeaning: "Matladuta",
    transliteration: "बोलना",
    conjugations: {
      presentMasculine: "Bolta hoon / Bolte hain",
      presentFeminine: "Bolti hoon / Bolti hain",
      pastMasculine: "Bola / Bole",
      pastFeminine: "Boli / Bolin",
      futureMasculine: "Boloonga / Bolenge",
      futureFeminine: "Boloongi / Bolengi"
    },
    examples: [
      {
        hindi: "Main Hindi bolta hoon.",
        english: "I speak Hindi. (Male)",
        telugu: "Nenu Hindi matladutanu.",
        transliteration: "मैं हिंदी बोलता हूँ।",
        explanation: "Verb root 'Bol' + 'ta' (masculine singular aspect) + auxiliary 'hoon' (am)."
      },
      {
        hindi: "Main Hindi bolti hoon.",
        english: "I speak Hindi. (Female)",
        telugu: "Nenu Hindi matladutanu.",
        transliteration: "मैं हिंदी बोलती हूँ।",
        explanation: "Verb root 'Bol' + 'ti' (feminine singular aspect) + auxiliary 'hoon' (am)."
      }
    ]
  },
  {
    infinitive: "Khana",
    devanagari: "खाना",
    root: "Kha",
    englishMeaning: "To eat",
    teluguMeaning: "Thinu",
    transliteration: "खाना",
    conjugations: {
      presentMasculine: "Khata hoon / Khate hain",
      presentFeminine: "Khati hoon / Khati hain",
      pastMasculine: "Khaya / Khaye",
      pastFeminine: "Khayi / Khayin",
      futureMasculine: "Khayunga / Khayenge",
      futureFeminine: "Khayungi / Khayengi"
    },
    examples: [
      {
        hindi: "Rahul aam khata hai.",
        english: "Rahul eats mango.",
        telugu: "Rahul mamidipandu thintunnadu.",
        transliteration: "राहुल आम खाता है।",
        explanation: "Rahul is singular masculine, so we use 'khata' + 'hai'."
      },
      {
        hindi: "Sita roti khati hai.",
        english: "Sita eats roti.",
        telugu: "Sita roti thintundhi.",
        transliteration: "सीता रोटी खाती है।",
        explanation: "Sita is singular feminine, so we use 'khati' + 'hai'."
      }
    ]
  },
  {
    infinitive: "Peena",
    devanagari: "पीना",
    root: "Pee",
    englishMeaning: "To drink",
    teluguMeaning: "Thagu",
    transliteration: "पीना",
    conjugations: {
      presentMasculine: "Peeta hoon / Peete hain",
      presentFeminine: "Peeti hoon / Peeti hain",
      pastMasculine: "Piya / Piye",
      pastFeminine: "Piyi / Piyin",
      futureMasculine: "Piyoonga / Piyenge",
      futureFeminine: "Piyoongi / Piyengi"
    },
    examples: [
      {
        hindi: "Main paani peeta hoon.",
        english: "I drink water. (Male)",
        telugu: "Nenu neeru thaguthunnanu.",
        transliteration: "मैं पानी पीता हूँ।",
        explanation: "Subject 'Main' + object 'paani' + verb 'peeta hoon'."
      },
      {
        hindi: "Aap chai peete hain.",
        english: "You drink tea. (Polite/Plural)",
        telugu: "Meeru teaneer thagutharu.",
        transliteration: "आप चाय पीते हैं।",
        explanation: "With polite/plural subject 'Aap', we use 'peete' + 'hain'."
      }
    ]
  },
  {
    infinitive: "Likhna",
    devanagari: "लिखना",
    root: "Likh",
    englishMeaning: "To write",
    teluguMeaning: "Rayu",
    transliteration: "लिखना",
    conjugations: {
      presentMasculine: "Likhta hoon / Likhte hain",
      presentFeminine: "Likhti hoon / Likhti hain",
      pastMasculine: "Likha / Likhe",
      pastFeminine: "Likhi / Likhin",
      futureMasculine: "Likhoonga / Likhenge",
      futureFeminine: "Likhoongi / Likhengi"
    },
    examples: [
      {
        hindi: "Vah kitaab likhta hai.",
        english: "He writes a book.",
        telugu: "Aayana pusthakam rasthunnadu.",
        transliteration: "वह किताब लिखता है।",
        explanation: "'Vah' (He) is masculine, so 'likhta hai'."
      },
      {
        hindi: "Main patra likhti hoon.",
        english: "I write a letter. (Female)",
        telugu: "Nenu lekha rasthunnanu.",
        transliteration: "मैं पत्र लिखती हूँ।",
        explanation: "'Main' (I) with feminine aspect uses 'likhti hoon'."
      }
    ]
  },
  {
    infinitive: "Padhna",
    devanagari: "पढ़ना",
    root: "Padh",
    englishMeaning: "To read / study",
    teluguMeaning: "Chadhuvu",
    transliteration: "पढ़ना",
    conjugations: {
      presentMasculine: "Padhta hoon / Padhte hain",
      presentFeminine: "Padhti hoon / Padhti hain",
      pastMasculine: "Padha / Padhe",
      pastFeminine: "Padhi / Padhin",
      futureMasculine: "Padhoonga / Padhenge",
      futureFeminine: "Padhoongi / Padhengi"
    },
    examples: [
      {
        hindi: "Larka paath padhta hai.",
        english: "The boy reads the lesson.",
        telugu: "Babu paatam chadhuvuthunnadu.",
        transliteration: "लड़का पाठ पढ़ता है।",
        explanation: "Singular masculine noun 'Larka' triggers 'padhta hai'."
      },
      {
        hindi: "Larki kahani padhti hai.",
        english: "The girl reads a story.",
        telugu: "Papa katha chadhuvuthundhi.",
        transliteration: "लड़की कहानी पढ़ती है।",
        explanation: "Singular feminine noun 'Larki' triggers 'padhti hai'."
      }
    ]
  },
  {
    infinitive: "Jana",
    devanagari: "जाना",
    root: "Ja",
    englishMeaning: "To go",
    teluguMeaning: "Vellu",
    transliteration: "जाना",
    conjugations: {
      presentMasculine: "Jata hoon / Jate hain",
      presentFeminine: "Jati hoon / Jati hain",
      pastMasculine: "Gaya / Gaye",
      pastFeminine: "Gayi / Gayin",
      futureMasculine: "Jaoonga / Jayenge",
      futureFeminine: "Jaoongi / Jayengi"
    },
    examples: [
      {
        hindi: "Main ghar jata hoon.",
        english: "I go home. (Male)",
        telugu: "Nenu intiki velthunnanu.",
        transliteration: "मैं घर जाता हूँ।",
        explanation: "'Main' + destination 'ghar' + 'jata hoon' (Present Habitual)."
      },
      {
        hindi: "Vah school gayi.",
        english: "She went to school. (Past Simple)",
        telugu: "Aame school-ki vellindhi.",
        transliteration: "वह स्कूल गयी।",
        explanation: "Irregular past conjugation of 'Jana' is 'gaya' (M) and 'gayi' (F)."
      }
    ]
  },
  {
    infinitive: "Karna",
    devanagari: "करना",
    root: "Kar",
    englishMeaning: "To do",
    teluguMeaning: "Cheyu",
    transliteration: "करना",
    conjugations: {
      presentMasculine: "Karta hoon / Karte hain",
      presentFeminine: "Karti hoon / Karti hain",
      pastMasculine: "Kiya / Kiye",
      pastFeminine: "Kiyi / Kiyin",
      futureMasculine: "Karoonga / Karenge",
      futureFeminine: "Karoongi / Karengi"
    },
    examples: [
      {
        hindi: "Main kaam karta hoon.",
        english: "I do work. / I work. (Male)",
        telugu: "Nenu pani chestunnanu.",
        transliteration: "मैं काम करता हूँ।",
        explanation: "Verb root 'Kar' + 'ta' + helper 'hoon'."
      },
      {
        hindi: "Aap kya karte hain?",
        english: "What do you do? (Polite/Plural)",
        telugu: "Meeru emi chestharu?",
        transliteration: "आप क्या करते हैं?",
        explanation: "Polite pronoun 'Aap' triggers 'karte hain'."
      }
    ]
  }
];

export const HINDI_TENSES: TenseItem[] = [
  {
    id: "present_simple",
    name: "Present Simple / Habitual",
    teluguName: "సాధారణ వర్తమాన కాలం",
    formula: "Subject + Object + [Verb Root + ta/te/ti] + hoon/hai/hain",
    explanation: "Used to describe facts, routines, or habitual actions. Suffixes change according to subject gender and count: Masculine Singular (-ta), Plural/Polite (-te), Feminine (-ti).",
    teluguExplanation: "నిత్యసత్యాలు, అలవాట్లు మరియు క్రమబద్ధమైన పనులను తెలపడానికి ఉపయోగపడుతుంది. పురుష ఏకవచనానికి (-ta), బహువచనానికి/గౌరవార్థకానికి (-te), స్త్రీలింగానికి (-ti) జోడిస్తాము.",
    examples: [
      {
        hindi: "Main dukan mein kaam karta hoon.",
        english: "I work in the shop. (Male Subject)",
        telugu: "Nenu dukanamlo pani chesthanu.",
        transliteration: "मैं दुकान में काम करता हूँ।",
        gender: "Masculine"
      },
      {
        hindi: "Main dukan mein kaam karti hoon.",
        english: "I work in the shop. (Female Subject)",
        telugu: "Nenu dukanamlo pani chesthanu.",
        transliteration: "मैं दुकान में काम करती हूँ।",
        gender: "Feminine"
      },
      {
        hindi: "Suraj purv se ugta hai.",
        english: "The sun rises in the east.",
        telugu: "Suryudu thoorpuna udhayisthadu.",
        transliteration: "सूरज पूर्व से उगता है।",
        gender: "Neutral"
      }
    ]
  },
  {
    id: "present_continuous",
    name: "Present Continuous",
    teluguName: "తక్షణ వర్తమాన కాలం",
    formula: "Subject + Object + Verb Root + raha/rahe/rahi + hoon/hai/hain",
    explanation: "Used for actions happening right now at the moment of speaking. Equivalent to English '-ing'. Suffixes: Masculine Singular (-raha), Plural/Polite (-rahe), Feminine (-rahi).",
    teluguExplanation: "ఇప్పుడే జరుగుతున్న పనుల గురించి చెప్పడానికి ఉపయోగిస్తాము. ఇంగ్లీష్ లో '-ing' లాంటిది. పురుష ఏకవచనానికి (-raha), బహువచనానికి (-rahe), స్త్రీలింగానికి (-rahi) చేర్చాలి.",
    examples: [
      {
        hindi: "Main paani pee raha hoon.",
        english: "I am drinking water. (Male Subject)",
        telugu: "Nenu neeru thaguthunnanu.",
        transliteration: "मैं पानी पी रहा हूँ।",
        gender: "Masculine"
      },
      {
        hindi: "Main paani pee rahi hoon.",
        english: "I am drinking water. (Female Subject)",
        telugu: "Nenu neeru thaguthunnanu.",
        transliteration: "मैं पानी पी रही हूँ।",
        gender: "Feminine"
      },
      {
        hindi: "Bacche baahar khel rahe hain.",
        english: "Children are playing outside. (Plural)",
        telugu: "Pillalu baita aaduthunnaru.",
        transliteration: "बच्चे बाहर खेल रहे हैं।",
        gender: "Neutral"
      }
    ]
  },
  {
    id: "past_simple",
    name: "Past Simple",
    teluguName: "భూత కాలం",
    formula: "Subject + Object + [Verb Root + a/e/i] (No auxiliary helper)",
    explanation: "Describes completed actions in the past. Note that verbs like 'Jana' (to go) have irregular forms ('gaya' for M, 'gayi' for F). Verb endings match the gender and number of the subject (or object in transitive cases with 'ne').",
    teluguExplanation: "గతంలో పూర్తయిన పనుల గురించి తెలపడానికి ఉపయోగిస్తారు. 'Jana' (వెళ్లు) వంటి క్రియలు గత కాలంలో 'gaya/gayi' గా మారుతాయి.",
    examples: [
      {
        hindi: "Rahul kal ghar gaya.",
        english: "Rahul went home yesterday.",
        telugu: "Rahul ninna intiki velladu.",
        transliteration: "राहुल कल घर गया।",
        gender: "Masculine"
      },
      {
        hindi: "Sita kal ghar gayi.",
        english: "Sita went home yesterday.",
        telugu: "Sita ninna intiki vellindhi.",
        transliteration: "सीता कल घर गयी।",
        gender: "Feminine"
      },
      {
        hindi: "Maine ek patra likha.",
        english: "I wrote a letter.",
        telugu: "Nenu oka lekha rasanu.",
        transliteration: "मैंने एक पत्र लिखा।",
        gender: "Neutral"
      }
    ]
  },
  {
    id: "future_simple",
    name: "Future Simple",
    teluguName: "భవిష్యత్ కాలం",
    formula: "Subject + Object + Verb Root + suffix (-oonga/ege/enge/eongi)",
    explanation: "Used to describe future plans or predictions. Pronouns yield specific suffixes: Main (-oonga for M, -oongi for F), Aap/Hum (-enge for M, -engi for F), Vah (-ega for M, -egi for F).",
    teluguExplanation: "భవిష్యత్తు ప్రణాళికలు లేదా అంచనాలను తెలపడానికి ఉపయోగిస్తాము. కర్తను బట్టి చివర ప్రత్యయాలు మారుతాయి.",
    examples: [
      {
        hindi: "Main kal dukan jaoonga.",
        english: "I will go to the shop tomorrow. (Male)",
        telugu: "Nenu repu dukanam velluthanu.",
        transliteration: "मैं कल दुकान जाऊँगा।",
        gender: "Masculine"
      },
      {
        hindi: "Main kal dukan jaoongi.",
        english: "I will go to the shop tomorrow. (Female)",
        telugu: "Nenu repu dukanam velluthanu.",
        transliteration: "मैं कल दुकान जाऊँगी।",
        gender: "Feminine"
      },
      {
        hindi: "Hum gaana gaayenge.",
        english: "We will sing a song.",
        telugu: "Memu paata paadutham.",
        transliteration: "हम गाना गाएंगे।",
        gender: "Neutral"
      }
    ]
  }
];

export const HINDI_CONJUNCTIONS: ConjunctionItem[] = [
  {
    word: "Aur",
    devanagari: "और",
    englishMeaning: "and",
    teluguMeaning: "mariyu",
    transliteration: "और",
    explanation: "Used to join two words, phrases, or clauses of equal grammatical rank. It is highly similar to Telugu 'mariyu' and operates in identical syntactic slots.",
    teluguExplanation: "రెండు పదాలు లేదా వాక్యాలను కలపడానికి వాడుతారు. ఇది తెలుగులోని 'మరియు' లాంటిదే.",
    examples: [
      {
        hindi: "Mujhe chai aur samosa chahiye.",
        english: "I want tea and samosa.",
        telugu: "Naku tea mariyu samosa kaavaali.",
        transliteration: "मुझे चाय और समोसा चाहिए।"
      },
      {
        hindi: "Rahul aur Sita bhai-behen hain.",
        english: "Rahul and Sita are brother and sister.",
        telugu: "Rahul mariyu Sita anna-chellalu.",
        transliteration: "राहुल और सीता भाई-बहन हैं।"
      }
    ]
  },
  {
    word: "Lekin / Par",
    devanagari: "लेकिन / पर",
    englishMeaning: "but",
    teluguMeaning: "kaani",
    transliteration: "लेकिन / पर",
    explanation: "Connects contrasting ideas or clauses. 'Par' is more colloquial and shorter, while 'Lekin' is standard and extremely common in dialogue.",
    teluguExplanation: "రెండు భిన్నమైన అభిప్రాయాలు లేదా వాక్యాలను కలపడానికి ఉపయోగిస్తారు. తెలుగులో 'కాని' అని అర్థం వస్తుంది.",
    examples: [
      {
        hindi: "Main aana chahta hoon, lekin samay nahi hai.",
        english: "I want to come, but I have no time.",
        telugu: "Nenu raavalani anukuntunnanu, kaani samayam ledu.",
        transliteration: "मैं आना चाहता हूँ, लेकिन समय नहीं है।"
      },
      {
        hindi: "Yeh khana swadisht hai par mehenga hai.",
        english: "This food is delicious but expensive.",
        telugu: "Ee bhojanam ruchiga undhi kaani priyamainadhi.",
        transliteration: "यह खाना स्वादिष्ट है पर महँगा है।"
      }
    ]
  },
  {
    word: "Ya",
    devanagari: "या",
    englishMeaning: "or",
    teluguMeaning: "ledha",
    transliteration: "या",
    explanation: "Used to connect choices, alternatives, or possibilities. Matches Telugu 'ledha' completely.",
    teluguExplanation: "రెండు ఎంపికల మధ్య నిర్ణయం తెలపడానికి వాడుతారు. తెలుగులో 'లేదా' అని అర్థం.",
    examples: [
      {
        hindi: "Kya aap chai peeyenge ya coffee?",
        english: "Will you drink tea or coffee?",
        telugu: "Meeru tea thaguthara ledha coffee?",
        transliteration: "क्या आप चाय पिएंगे या कॉफ़ी?"
      },
      {
        hindi: "Aaj kal ya parso mudiye.",
        english: "Turn today or tomorrow.",
        telugu: "Eeroju ledha repu thiragandi.",
        transliteration: "आज कल या परसों मुड़िए।"
      }
    ]
  },
  {
    word: "Kyunki",
    devanagari: "क्योंकि",
    englishMeaning: "because",
    teluguMeaning: "endhukante",
    transliteration: "क्योंकि",
    explanation: "Introduces a clause giving the reason for something. Equivalent to Telugu 'endhukante'. Places the reason right after the connection.",
    teluguExplanation: "ఏదైనా జరగడానికి కారణాన్ని వివరించేటప్పుడు వాడుతారు. తెలుగులో 'ఎందుకంటే' అని అర్థం.",
    examples: [
      {
        hindi: "Main school nahi gaya kyunki main bimar tha.",
        english: "I did not go to school because I was sick.",
        telugu: "Nenu school-ki vellaledu endhukante naku jwaram vachindhi.",
        transliteration: "मैं स्कूल नहीं गया क्योंकि मैं बीमार था।"
      },
      {
        hindi: "Vah khush hai kyunki uske paas naya shauk hai.",
        english: "She is happy because she has a new hobby.",
        telugu: "Aame santhoshanga undhi endhukante aameku kotha vyaapakam undhi.",
        transliteration: "वह खुश है क्योंकि उसके पास नया शौक है।"
      }
    ]
  },
  {
    word: "Isliye",
    devanagari: "इसलिए",
    englishMeaning: "so / therefore",
    teluguMeaning: "andhuvalla",
    transliteration: "इसलिए",
    explanation: "Links a cause to an effect. Indicates 'hence' or 'consequently'. Corresponds beautifully to Telugu 'andhuvalla' or 'kabatti'.",
    teluguExplanation: "ఒక కారణం వల్ల వచ్చిన ఫలితాన్ని తెలపడానికి ఉపయోగిస్తాము. తెలుగులో 'అందువల్ల/కాబట్టి' అని వస్తుంది.",
    examples: [
      {
        hindi: "Aaj garmi hai isliye main ghar par hoon.",
        english: "It is hot today, so I am at home.",
        telugu: "Eeroju vediga undhi andhuvalla nenu intlo unnanu.",
        transliteration: "आज गर्मी है इसलिए मैं घर पर हूँ।"
      },
      {
        hindi: "Mujhe sangeet pasand hai isliye main gaata hoon.",
        english: "I like music, therefore I sing.",
        telugu: "Naku sangeetham ishtam kabatti nenu paaduthanu.",
        transliteration: "मुझे संगीत पसंद है इसलिए मैं गाता हूँ।"
      }
    ]
  },
  {
    word: "Agar ... to",
    devanagari: "अगर ... तो",
    englishMeaning: "if ... then",
    teluguMeaning: "oka vela ... aithe",
    transliteration: "अगर ... तो",
    explanation: "A correlative conjunction structure used to form conditional sentences. 'Agar' is placed before the condition and 'to' introduces the result clause.",
    teluguExplanation: "నిబంధనలతో కూడిన వాక్యాలను కలపడానికి వాడుతారు. 'ఒకవేళ ... అయితే' అని అర్థం.",
    examples: [
      {
        hindi: "Agar aap chahte hain to main madad karoonga.",
        english: "If you want, then I will help.",
        telugu: "Oka vela meeku sahaayam kaavalante nenu chesthanu.",
        transliteration: "अगर आप चाहते हैं तो मैं मदद करूँगा।"
      },
      {
        hindi: "Agar kal barish hogi to hum nahi jayenge.",
        english: "If it rains tomorrow, (then) we will not go.",
        telugu: "Oka vela repu varsham kuristhe memu vellamu.",
        transliteration: "अगर कल बारिश होगी तो हम नहीं जाएंगे।"
      }
    ]
  }
];

export interface CustomTestQuestion {
  id: string;
  type: 'multiple_choice' | 'conjugation' | 'conjunction_fill' | 'sentence_arrange';
  levelGroup: 'Beginner' | 'Intermediate' | 'Advanced';
  prompt: string;
  hindiTargetText?: string;
  audioText: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  teluguExplanation: string;
}

export const DYNAMIC_TESTS_POOL: CustomTestQuestion[] = [
  // BEGINNER
  {
    id: "beg_1",
    type: "multiple_choice",
    levelGroup: "Beginner",
    prompt: "Translate: 'My name is Rahul.'",
    audioText: "Mera naam Rahul hai.",
    options: ["Mera naam Rahul hai.", "Aapka naam kya hai?", "Main America se hoon.", "Yeh mera parivar hai."],
    correctAnswer: "Mera naam Rahul hai.",
    explanation: "'Mera' (My) + 'naam' (name) + 'Rahul' + auxiliary 'hai' (is).",
    teluguExplanation: "'Mera' (నా) + 'naam' (పేరు) + 'Rahul' + 'hai' (అవును)."
  },
  {
    id: "beg_2",
    type: "sentence_arrange",
    levelGroup: "Beginner",
    prompt: "Arrange in S-O-V order: 'What is your name?'",
    hindiTargetText: "Aapka naam kya hai?",
    audioText: "Aapka naam kya hai?",
    options: ["hai", "Aapka", "naam", "kya"],
    correctAnswer: "Aapka,naam,kya,hai",
    explanation: "Subject-possessive ('Aapka') + Object/noun ('naam') + interrogative ('kya') + verb ('hai').",
    teluguExplanation: "మీ పేరు ఏమిటి? వరుస క్రమం: 'Aapka' 'naam' 'kya' 'hai'."
  },
  {
    id: "beg_3",
    type: "multiple_choice",
    levelGroup: "Beginner",
    prompt: "Choose the correct translation for Mother:",
    audioText: "Mata",
    options: ["Pita", "Mata", "Bhai", "Behen"],
    correctAnswer: "Mata",
    explanation: "'Mata' or 'Maa' translates to Mother. 'Pita' is Father, 'Bhai' is Brother, and 'Behen' is Sister.",
    teluguExplanation: "'Mata' అంటే అమ్మ అని అర్థం. 'Pita' అంటే నాన్న."
  },
  {
    id: "beg_4",
    type: "multiple_choice",
    levelGroup: "Beginner",
    prompt: "Polite greeting: 'See you again' is translated as:",
    audioText: "Phir milenge",
    options: ["Dhanyavaad", "Namaste", "Haan", "Phir milenge"],
    correctAnswer: "Phir milenge",
    explanation: "'Phir milenge' literally translates to 'See you again' or 'We'll meet again'.",
    teluguExplanation: "'Phir milenge' అంటే మళ్ళీ కలుద్దాం."
  },
  {
    id: "beg_5",
    type: "multiple_choice",
    levelGroup: "Beginner",
    prompt: "How do you say 'I work' in masculine form?",
    audioText: "Main kaam karta hoon.",
    options: ["Main kaam karta hoon.", "Main kaam karti hoon.", "Vah kaam karta hai.", "Aap kaam karte hain."],
    correctAnswer: "Main kaam karta hoon.",
    explanation: "For masculine singular 'I', the verb suffix is 'karta' followed by 'hoon'.",
    teluguExplanation: "పురుష ఏకవచన రూపంలో 'కానిస్తాను' చెప్పడానికి 'karta hoon' వాడుతాము."
  },

  // INTERMEDIATE
  {
    id: "int_1",
    type: "conjunction_fill",
    levelGroup: "Intermediate",
    prompt: "Fill in the blank: 'Mujhe chai ____ samosa chahiye.' (I want tea and samosa.)",
    audioText: "Mujhe chai aur samosa chahiye.",
    options: ["lekin", "aur", "ya", "kyunki"],
    correctAnswer: "aur",
    explanation: "'Aur' is used for addition ('and'). Hence, tea AND samosa.",
    teluguExplanation: "'Aur' అంటే 'మరియు' అని అర్థం. టీ మరియు సమోసా."
  },
  {
    id: "int_2",
    type: "multiple_choice",
    levelGroup: "Intermediate",
    prompt: "Translate: 'This is very expensive.'",
    audioText: "Yeh bohot mehenga hai.",
    options: ["Iska daam kya hai?", "Yeh bohot mehenga hai.", "Mujhe yeh chahiye.", "Roti garam hai."],
    correctAnswer: "Yeh bohot mehenga hai.",
    explanation: "'Yeh' (This) + 'bohot' (very) + 'mehenga' (expensive) + 'hai' (is).",
    teluguExplanation: "'Yeh' (ఇది) + 'bohot' (చాలా) + 'mehenga' (ప్రియం/ఖరీదు) + 'hai' (అవును)."
  },
  {
    id: "int_3",
    type: "multiple_choice",
    levelGroup: "Intermediate",
    prompt: "In Hindi, what gender is the word 'Roti' (bread)?",
    audioText: "Roti garam hai.",
    options: ["Masculine", "Feminine", "Neutral/None"],
    correctAnswer: "Feminine",
    explanation: "'Roti' is grammatically Feminine, which is why we say 'Roti garam hai' or 'Roti khati hai' (not khata).",
    teluguExplanation: "హిందీలో 'Roti' స్త్రీలింగ పదం, అందుకే క్రియలు 'khati/garam' గా ఉంటాయి."
  },
  {
    id: "int_4",
    type: "multiple_choice",
    levelGroup: "Intermediate",
    prompt: "How do you say: 'Where is the railway station?'",
    audioText: "Railway station kahaan hai?",
    options: ["Railway station kahaan hai?", "Railway station kab aayegi?", "Dahine mudiye.", "Baayein mudiye."],
    correctAnswer: "Railway station kahaan hai?",
    explanation: "'Kahaan' means 'Where' in Hindi. 'Railway station kahaan hai?' fits perfectly.",
    teluguExplanation: "'Kahaan' అంటే 'ఎక్కడ' అని అర్థం. రైల్వే స్టేషన్ ఎక్కడ ఉంది?"
  },
  {
    id: "int_5",
    type: "conjunction_fill",
    levelGroup: "Intermediate",
    prompt: "Fill in the blank: 'Kya aap chai peeyenge ____ coffee?' (Will you drink tea or coffee?)",
    audioText: "Kya aap chai peeyenge ya coffee?",
    options: ["aur", "lekin", "ya", "isliye"],
    correctAnswer: "ya",
    explanation: "'Ya' means 'or' and is used to connect alternatives.",
    teluguExplanation: "'Ya' అంటే 'లేదా' అని అర్థం. టీ లేదా కాఫీ."
  },

  // ADVANCED
  {
    id: "adv_1",
    type: "conjugation",
    levelGroup: "Advanced",
    prompt: "Complete the continuous verb form for a female subject: 'Main paani pee _____ hoon.' (I am drinking water.)",
    audioText: "Main paani pee rahi hoon.",
    options: ["raha", "rahe", "rahi", "ta"],
    correctAnswer: "rahi",
    explanation: "Present continuous feminine uses 'rahi' + 'hoon'. Masculine uses 'raha'.",
    teluguExplanation: "స్త్రీలింగ వర్తమాన కాలంలో 'త్రాగుతున్నాను' అని చెప్పడానికి 'rahi' వాడతాము."
  },
  {
    id: "adv_2",
    type: "multiple_choice",
    levelGroup: "Advanced",
    prompt: "Translate: 'My head is hurting.' (Emergency/Health)",
    audioText: "Mera sir dard kar raha hai.",
    options: ["Doctor ko jaldi bulao.", "Mera sir dard kar raha hai.", "Aushadhalay kahaan hai?", "Yeh ek aapaatkal hai."],
    correctAnswer: "Mera sir dard kar raha hai.",
    explanation: "'Mera sir' (My head) + 'dard' (pain) + 'kar raha hai' (is doing/hurting).",
    teluguExplanation: "నా తల నొప్పిగా ఉంది అని చెప్పడానికి 'Mera sir dard kar raha hai' అంటాము."
  },
  {
    id: "adv_3",
    type: "conjunction_fill",
    levelGroup: "Advanced",
    prompt: "Fill in the blank: 'Main school nahi gaya _____ main bimar tha.' (I didn't go to school because I was sick.)",
    audioText: "Main school nahi gaya kyunki main bimar tha.",
    options: ["isliye", "kyunki", "lekin", "agar"],
    correctAnswer: "kyunki",
    explanation: "'Kyunki' is used to provide reasons ('because').",
    teluguExplanation: "'Kyunki' అంటే 'ఎందుకంటే' అని అర్థం."
  },
  {
    id: "adv_4",
    type: "conjugation",
    levelGroup: "Advanced",
    prompt: "Identify the correct future tense for: 'We will sing a song.'",
    audioText: "Hum gaana gaayenge.",
    options: ["Hum gaana gaati hai.", "Hum gaana gaayenge.", "Hum gaana gaata hoon.", "Hum gaana gaaye."],
    correctAnswer: "Hum gaana gaayenge.",
    explanation: "Subject 'Hum' (We) triggers future masculine plural suffix '-enge', making 'gaayenge'.",
    teluguExplanation: "భవిష్యత్తు కాలంలో 'memu paata paadutham' చెప్పడానికి 'gaayenge' వాడతాము."
  },
  {
    id: "adv_5",
    type: "conjugation",
    levelGroup: "Advanced",
    prompt: "What is the oblique case of 'Kamra' (room) when followed by the postposition 'mein' (in)?",
    audioText: "Kamre mein",
    options: ["Kamra mein", "Kamre mein", "Kamron mein", "Kamri mein"],
    correctAnswer: "Kamre mein",
    explanation: "Masculine nouns ending in '-a' change to '-e' in oblique case before a postposition. Hence, 'Kamre mein'.",
    teluguExplanation: "పోస్ట్ పొజిషన్ 'mein' కి ముందు 'Kamra' రూపం 'Kamre' గా మారుతుంది."
  }
];
