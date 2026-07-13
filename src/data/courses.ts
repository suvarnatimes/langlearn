export interface VocabularyItem {
  id: string;
  hindi: string;
  english: string;
  telugu: string;
  transliteration: string;
}

export interface MatchPair {
  id: string;
  hindi: string;
  english: string;
  telugu: string;
}

export interface SentenceBuilder {
  id: string;
  englishTarget: string;
  teluguTarget: string;
  hindiWords: string[]; // Shuffled or pieces
  correctSequence: string[]; // Correct order
}

export interface Level {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  vocabulary: VocabularyItem[];
  matchingPairs: MatchPair[];
  sentenceBuilders: SentenceBuilder[];
}

export const LEVELS: Level[] = [
  {
    id: 1,
    title: "Self-Introduction",
    subtitle: "Mera Naam...",
    description: "Learn how to introduce yourself, ask someone's name, and state where you are from in Hindi.",
    vocabulary: [
      {
        id: "v1_1",
        hindi: "Mera naam Rahul hai.",
        english: "My name is Rahul.",
        telugu: "Naa peru Rahul.",
        transliteration: "मेरा नाम राहुल है।"
      },
      {
        id: "v1_2",
        hindi: "Aapka naam kya hai?",
        english: "What is your name?",
        telugu: "Mee peru emiti?",
        transliteration: "आपका नाम क्या है?"
      },
      {
        id: "v1_3",
        hindi: "Main America se hoon.",
        english: "I am from America.",
        telugu: "Nenu America nundi vachanu.",
        transliteration: "मैं अमेरिका से हूँ।"
      },
      {
        id: "v1_4",
        hindi: "Aap kaise hain?",
        english: "How are you?",
        telugu: "Meeru ela unnaru?",
        transliteration: "आप कैसे हैं?"
      },
      {
        id: "v1_5",
        hindi: "Main theek hoon.",
        english: "I am fine.",
        telugu: "Nenu baagunnanu.",
        transliteration: "मैं ठीक हूँ।"
      }
    ],
    matchingPairs: [
      { id: "m1_1", hindi: "Mera naam", english: "My name", telugu: "Naa peru" },
      { id: "m1_2", hindi: "Aapka naam", english: "Your name", telugu: "Mee peru" },
      { id: "m1_3", hindi: "Kya hai?", english: "What is?", telugu: "Emiti?" },
      { id: "m1_4", hindi: "Main", english: "I", telugu: "Nenu" }
    ],
    sentenceBuilders: [
      {
        id: "s1_1",
        englishTarget: "What is your name?",
        teluguTarget: "Mee peru emiti?",
        hindiWords: ["naam", "hai", "Aapka", "kya"],
        correctSequence: ["Aapka", "naam", "kya", "hai"]
      },
      {
        id: "s1_2",
        englishTarget: "My name is Rahul.",
        teluguTarget: "Naa peru Rahul.",
        hindiWords: ["naam", "Rahul", "Mera", "hai"],
        correctSequence: ["Mera", "naam", "Rahul", "hai"]
      }
    ]
  },
  {
    id: 2,
    title: "Relations & Family",
    subtitle: "Parivar",
    description: "Learn terms for family members including father, mother, brother, sister, and introducing your family.",
    vocabulary: [
      {
        id: "v2_1",
        hindi: "Mata",
        english: "Mother",
        telugu: "Amma",
        transliteration: "माता (माँ)"
      },
      {
        id: "v2_2",
        hindi: "Pita",
        english: "Father",
        telugu: "Nanna",
        transliteration: "पिता (पापा)"
      },
      {
        id: "v2_3",
        hindi: "Bhai",
        english: "Brother",
        telugu: "Thammudu / Anna",
        transliteration: "भाई"
      },
      {
        id: "v2_4",
        hindi: "Behen",
        english: "Sister",
        telugu: "Chelli / Akka",
        transliteration: "बहन"
      },
      {
        id: "v2_5",
        hindi: "Yeh mera parivar hai.",
        english: "This is my family.",
        telugu: "Idhi naa kutumbam.",
        transliteration: "यह मेरा परिवार है।"
      }
    ],
    matchingPairs: [
      { id: "m2_1", hindi: "Mata", english: "Mother", telugu: "Amma" },
      { id: "m2_2", hindi: "Pita", english: "Father", telugu: "Nanna" },
      { id: "m2_3", hindi: "Bhai", english: "Brother", telugu: "Sodharudu" },
      { id: "m2_4", hindi: "Behen", english: "Sister", telugu: "Sodhari" }
    ],
    sentenceBuilders: [
      {
        id: "s2_1",
        englishTarget: "This is my family.",
        teluguTarget: "Idhi naa kutumbam.",
        hindiWords: ["parivar", "hai", "Yeh", "mera"],
        correctSequence: ["Yeh", "mera", "parivar", "hai"]
      }
    ]
  },
  {
    id: 3,
    title: "General Conversations",
    subtitle: "Namaste",
    description: "Learn essential daily greetings and polite phrases like thank you, yes, no, and goodbye.",
    vocabulary: [
      {
        id: "v3_1",
        hindi: "Namaste",
        english: "Hello / Greetings",
        telugu: "Namaskaram",
        transliteration: "नमस्ते"
      },
      {
        id: "v3_2",
        hindi: "Dhanyavaad",
        english: "Thank you",
        telugu: "Dhanayavaadalu",
        transliteration: "धन्यवाद"
      },
      {
        id: "v3_3",
        hindi: "Haan",
        english: "Yes",
        telugu: "Avunu",
        transliteration: "हाँ"
      },
      {
        id: "v3_4",
        hindi: "Nahi",
        english: "No",
        telugu: "Ledu / Kaadu",
        transliteration: "नहीं"
      },
      {
        id: "v3_5",
        hindi: "Phir milenge",
        english: "See you again",
        telugu: "Malli kaluddham",
        transliteration: "फिर मिलेंगे"
      }
    ],
    matchingPairs: [
      { id: "m3_1", hindi: "Namaste", english: "Hello", telugu: "Namaskaram" },
      { id: "m3_2", hindi: "Dhanyavaad", english: "Thank you", telugu: "Dhanayavaadalu" },
      { id: "m3_3", hindi: "Haan", english: "Yes", telugu: "Avunu" },
      { id: "m3_4", hindi: "Nahi", english: "No", telugu: "Ledu" }
    ],
    sentenceBuilders: [
      {
        id: "s3_1",
        englishTarget: "Thank you, see you again.",
        teluguTarget: "Dhanayavaadalu, malli kaluddham.",
        hindiWords: ["milenge", "Dhanyavaad", "phir", ","],
        correctSequence: ["Dhanyavaad", ",", "phir", "milenge"]
      }
    ]
  },
  {
    id: 4,
    title: "Employee Names & Work",
    subtitle: "Kaam Aur Pesha",
    description: "Learn terms for various occupations (doctor, teacher, engineer) and expressing what work you do.",
    vocabulary: [
      {
        id: "v4_1",
        hindi: "Chikitshak",
        english: "Doctor",
        telugu: "Vaidyudu",
        transliteration: "चिकित्सक"
      },
      {
        id: "v4_2",
        hindi: "Shikshak",
        english: "Teacher",
        telugu: "Upaadhyaayudu",
        transliteration: "शिक्षक"
      },
      {
        id: "v4_3",
        hindi: "Abhiyanta",
        english: "Engineer",
        telugu: "Abhiyanta",
        transliteration: "अभियंता"
      },
      {
        id: "v4_4",
        hindi: "Main kaam karta hoon.",
        english: "I work.",
        telugu: "Nenu pani chestunnanu.",
        transliteration: "मैं काम करता हूँ।"
      },
      {
        id: "v4_5",
        hindi: "Vah ek shikshak hai.",
        english: "He/She is a teacher.",
        telugu: "Aayana oka upaadhyaayudu.",
        transliteration: "वह एक शिक्षक है।"
      }
    ],
    matchingPairs: [
      { id: "m4_1", hindi: "Chikitshak", english: "Doctor", telugu: "Vaidyudu" },
      { id: "m4_2", hindi: "Shikshak", english: "Teacher", telugu: "Upaadhyaayudu" },
      { id: "m4_3", hindi: "Abhiyanta", english: "Engineer", telugu: "Abhiyanta" },
      { id: "m4_4", hindi: "Kaam", english: "Work", telugu: "Pani" }
    ],
    sentenceBuilders: [
      {
        id: "s4_1",
        englishTarget: "He is a teacher.",
        teluguTarget: "Aayana oka upaadhyaayudu.",
        hindiWords: ["ek", "shikshak", "hai", "Vah"],
        correctSequence: ["Vah", "ek", "shikshak", "hai"]
      },
      {
        id: "s4_2",
        englishTarget: "I work.",
        teluguTarget: "Nenu pani chestunnanu.",
        hindiWords: ["kaam", "hoon", "Main", "karta"],
        correctSequence: ["Main", "kaam", "karta", "hoon"]
      }
    ]
  },
  {
    id: 5,
    title: "Milestone Test 1",
    subtitle: "Milestone Test (L1-L4)",
    description: "Evaluates your translation, listening, matching, and sentence-building skills across Levels 1 to 4. Scoring 80%+ unlocks Level 6.",
    vocabulary: [],
    matchingPairs: [],
    sentenceBuilders: []
  },
  {
    id: 6,
    title: "Shopping & Transactions",
    subtitle: "Khareedaari",
    description: "Learn currencies, how to ask for prices, express that something is expensive, and request what you want.",
    vocabulary: [
      {
        id: "v6_1",
        hindi: "Iska daam kya hai?",
        english: "What is the price of this?",
        telugu: "Dheeniki dhara entha?",
        transliteration: "इसका दाम क्या है?"
      },
      {
        id: "v6_2",
        hindi: "Yeh bohot mehenga hai.",
        english: "This is very expensive.",
        telugu: "Idhi chaala priyamainadhi.",
        transliteration: "यह बहुत महँगा है।"
      },
      {
        id: "v6_3",
        hindi: "Rupaye",
        english: "Rupees",
        telugu: "Rupaayalu",
        transliteration: "रुपये"
      },
      {
        id: "v6_4",
        hindi: "Mujhe yeh chahiye.",
        english: "I want this.",
        telugu: "Naku idhi kaavaali.",
        transliteration: "मुझे यह चाहिए।"
      },
      {
        id: "v6_5",
        hindi: "Dukaan",
        english: "Shop",
        telugu: "दुकान",
        transliteration: "दुकान"
      }
    ],
    matchingPairs: [
      { id: "m6_1", hindi: "Daam", english: "Price / Value", telugu: "Dhara" },
      { id: "m6_2", hindi: "Mehenga", english: "Expensive", telugu: "Priyamainadhi" },
      { id: "m6_3", hindi: "Dukaan", english: "Shop", telugu: "Dukaanam" },
      { id: "m6_4", hindi: "Mujhe chahiye", english: "I want", telugu: "Naku kaavaali" }
    ],
    sentenceBuilders: [
      {
        id: "s6_1",
        englishTarget: "I want this.",
        teluguTarget: "Naku idhi kaavaali.",
        hindiWords: ["chahiye", "Yeh", "Mujhe", "."],
        correctSequence: ["Mujhe", "Yeh", "chahiye", "."]
      },
      {
        id: "s6_2",
        englishTarget: "What is the price of this?",
        teluguTarget: "Dheeniki dhara entha?",
        hindiWords: ["kya", "daam", "Iska", "hai"],
        correctSequence: ["Iska", "daam", "kya", "hai"]
      }
    ]
  },
  {
    id: 7,
    title: "Food & Dining",
    subtitle: "Khana Aur Peena",
    description: "Learn names of foods, beverages, and adjectives to describe taste. Explore Hindi's gendered nouns for meals.",
    vocabulary: [
      {
        id: "v7_1",
        hindi: "Mujhe chai chahiye.",
        english: "I want tea.",
        telugu: "Naku teaneer kaavaali.",
        transliteration: "मुझे चाय चाहिए।"
      },
      {
        id: "v7_2",
        hindi: "Samosa swadisht hai.",
        english: "Samosa is delicious.",
        telugu: "Samosa ruchiga undhi.",
        transliteration: "समोसा स्वादिष्ट है।"
      },
      {
        id: "v7_3",
        hindi: "Kya aap pani peeyenge?",
        english: "Will you drink water?",
        telugu: "Meeru neeru thaguthara?",
        transliteration: "क्या आप पानी पिएंगे?"
      },
      {
        id: "v7_4",
        hindi: "Roti garam hai.",
        english: "The roti is hot.",
        telugu: "Roti vediga undhi.",
        transliteration: "रोटी गर्म है।"
      },
      {
        id: "v7_5",
        hindi: "Khana bohot acha hai.",
        english: "The food is very good.",
        telugu: "Bhojanam chaala baagundhi.",
        transliteration: "खाना बहुत अच्छा है।"
      }
    ],
    matchingPairs: [
      { id: "m7_1", hindi: "Khana", english: "Food", telugu: "Bhojanam" },
      { id: "m7_2", hindi: "Swadisht", english: "Delicious", telugu: "Ruchiga" },
      { id: "m7_3", hindi: "Pani", english: "Water", telugu: "Neeru" },
      { id: "m7_4", hindi: "Garam", english: "Hot", telugu: "Vediga" }
    ],
    sentenceBuilders: [
      {
        id: "s7_1",
        englishTarget: "Samosa is delicious.",
        teluguTarget: "Samosa ruchiga undhi.",
        hindiWords: ["hai", "swadisht", "Samosa"],
        correctSequence: ["Samosa", "swadisht", "hai"]
      },
      {
        id: "s7_2",
        englishTarget: "I want tea.",
        teluguTarget: "Naku teaneer kaavaali.",
        hindiWords: ["chahiye", "Mujhe", "chai"],
        correctSequence: ["Mujhe", "chai", "chahiye"]
      }
    ]
  },
  {
    id: 8,
    title: "Time & Weather",
    subtitle: "Samay Aur Mausam",
    description: "Learn how to state the current time, discuss seasons, and describe hot or cold weather conditions.",
    vocabulary: [
      {
        id: "v8_1",
        hindi: "Abhi teen baje hain.",
        english: "It is three o'clock now.",
        telugu: "Ippudu moodu gantalu aindhi.",
        transliteration: "अभी तीन बजे हैं।"
      },
      {
        id: "v8_2",
        hindi: "Aaj bohot garmi hai.",
        english: "It is very hot today.",
        telugu: "Eeroju chaala vediga undhi.",
        transliteration: "आज बहुत गर्मी है।"
      },
      {
        id: "v8_3",
        hindi: "Mera janamdin kal hai.",
        english: "My birthday is tomorrow.",
        telugu: "Naa puttinaroju repu.",
        transliteration: "मेरा जन्मदिन कल है।"
      },
      {
        id: "v8_4",
        hindi: "Mausam acha hai.",
        english: "The weather is good.",
        telugu: "Vaathaavaranam baagundhi.",
        transliteration: "मौसम अच्छा है।"
      },
      {
        id: "v8_5",
        hindi: "Yeh tees hai.",
        english: "This is thirty.",
        telugu: "Idhi muppai.",
        transliteration: "यह तीस है।"
      }
    ],
    matchingPairs: [
      { id: "m8_1", hindi: "Garmi", english: "Heat / Hot", telugu: "Vediga" },
      { id: "m8_2", hindi: "Kal", english: "Tomorrow / Yesterday", telugu: "Repu / Ninna" },
      { id: "m8_3", hindi: "Samay", english: "Time", telugu: "Samayam" },
      { id: "m8_4", hindi: "Mausam", english: "Weather", telugu: "Vaathaavaranam" }
    ],
    sentenceBuilders: [
      {
        id: "s8_1",
        englishTarget: "It is very hot today.",
        teluguTarget: "Eeroju chaala vediga undhi.",
        hindiWords: ["garmi", "hai", "Aaj", "bohot"],
        correctSequence: ["Aaj", "bohot", "garmi", "hai"]
      },
      {
        id: "s8_2",
        englishTarget: "My birthday is tomorrow.",
        teluguTarget: "Naa puttinaroju repu.",
        hindiWords: ["kal", "janamdin", "hai", "Mera"],
        correctSequence: ["Mera", "janamdin", "kal", "hai"]
      }
    ]
  },
  {
    id: 9,
    title: "Travel & Directions",
    subtitle: "Yatra Aur Dishayen",
    description: "Navigate cities with vocabulary for directions, ordering tickets, and asking about local arrival times.",
    vocabulary: [
      {
        id: "v9_1",
        hindi: "Railway station kahaan hai?",
        english: "Where is the railway station?",
        telugu: "Railway station ekkada undhi?",
        transliteration: "रेलवे स्टेशन कहाँ है?"
      },
      {
        id: "v9_2",
        hindi: "Baayein mudiye.",
        english: "Turn left.",
        telugu: "Edama vaipu thiragandi.",
        transliteration: "बाएँ मुड़िए।"
      },
      {
        id: "v9_3",
        hindi: "Dahine mudiye.",
        english: "Turn right.",
        telugu: "Kudi vaipu thiragandi.",
        transliteration: "दाएँ मुड़िए।"
      },
      {
        id: "v9_4",
        hindi: "Mujhe ticket chahiye.",
        english: "I want a ticket.",
        telugu: "Naku ticket kaavaali.",
        transliteration: "मुझे टिकट चाहिए।"
      },
      {
        id: "v9_5",
        hindi: "Gadi kab aayegi?",
        english: "When will the train arrive?",
        telugu: "Train eppudu vasthundhi?",
        transliteration: "गाड़ी कब आएगी?"
      }
    ],
    matchingPairs: [
      { id: "m9_1", hindi: "Kahaan", english: "Where", telugu: "Ekkada" },
      { id: "m9_2", hindi: "Baayein", english: "Left", telugu: "Edama" },
      { id: "m9_3", hindi: "Dahine", english: "Right", telugu: "Kudi" },
      { id: "m9_4", hindi: "Gadi", english: "Train", telugu: "Train" }
    ],
    sentenceBuilders: [
      {
        id: "s9_1",
        englishTarget: "Where is the railway station?",
        teluguTarget: "Railway station ekkada undhi?",
        hindiWords: ["hai", "kahaan", "Railway", "station"],
        correctSequence: ["Railway", "station", "kahaan", "hai"]
      },
      {
        id: "s9_2",
        englishTarget: "Turn left.",
        teluguTarget: "Edama vaipu thiragandi.",
        hindiWords: ["mudiye", "Baayein"],
        correctSequence: ["Baayein", "mudiye"]
      }
    ]
  },
  {
    id: 10,
    title: "Milestone Test 2",
    subtitle: "Milestone Test (L6-L9)",
    description: "Evaluates your translation, listening, matching, and sentence-building skills across Levels 6 to 9. Pass with 80%+ to unlock Advanced levels!",
    vocabulary: [],
    matchingPairs: [],
    sentenceBuilders: []
  },
  {
    id: 11,
    title: "Emergency & Health",
    subtitle: "Aapaatkal Aur Swasthya",
    description: "Equip yourself with life-saving phrases for medical situations, describing symptoms, and calling for emergency assistance.",
    vocabulary: [
      {
        id: "v11_1",
        hindi: "Mujhe madad chahiye!",
        english: "I need help!",
        telugu: "Naku sahaayam kaavaali!",
        transliteration: "मुझे मदद चाहिए!"
      },
      {
        id: "v11_2",
        hindi: "Doctor ko jaldi bulao.",
        english: "Call the doctor quickly.",
        telugu: "Doctor ni thondaraga pilvandi.",
        transliteration: "डॉक्टर को जल्दी बुलाओ।"
      },
      {
        id: "v11_3",
        hindi: "Mera sir dard kar raha hai.",
        english: "My head is hurting.",
        telugu: "Naa thala noppiga undhi.",
        transliteration: "मेरा सिर दर्द कर रहा है।"
      },
      {
        id: "v11_4",
        hindi: "Aushadhalay kahaan hai?",
        english: "Where is the pharmacy?",
        telugu: "Aushadhalayam ekkada undhi?",
        transliteration: "औषधालय कहाँ है?"
      },
      {
        id: "v11_5",
        hindi: "Yeh ek aapaatkal hai.",
        english: "This is an emergency.",
        telugu: "Idhi oka thondara paristheethi.",
        transliteration: "यह एक आपातकाल है।"
      }
    ],
    matchingPairs: [
      { id: "m11_1", hindi: "Madad", english: "Help", telugu: "Sahaayam" },
      { id: "m11_2", hindi: "Aapaatkal", english: "Emergency", telugu: "Paristheethi" },
      { id: "m11_3", hindi: "Bulao", english: "Call / Summon", telugu: "Pilvandi" },
      { id: "m11_4", hindi: "Sir dard", english: "Headache", telugu: "Thala noppi" }
    ],
    sentenceBuilders: [
      {
        id: "s11_1",
        englishTarget: "I need help.",
        teluguTarget: "Naku sahaayam kaavaali.",
        hindiWords: ["chahiye", "madad", "Mujhe", "!"],
        correctSequence: ["Mujhe", "madad", "chahiye", "!"]
      },
      {
        id: "s11_2",
        englishTarget: "Where is the pharmacy?",
        teluguTarget: "Aushadhalayam ekkada undhi?",
        hindiWords: ["Aushadhalay", "kahaan", "hai", "?"],
        correctSequence: ["Aushadhalay", "kahaan", "hai", "?"]
      }
    ]
  },
  {
    id: 12,
    title: "Hobbies & Leisure",
    subtitle: "Shauk Aur Manoranjan",
    description: "Learn how to discuss your free time, favorite books, music hobbies, and describe pleasant creative activities.",
    vocabulary: [
      {
        id: "v12_1",
        hindi: "Mera shauk sangeet hai.",
        english: "My hobby is music.",
        telugu: "Naa vyaapakam sangeetham.",
        transliteration: "मेरा शौक संगीत है।"
      },
      {
        id: "v12_2",
        hindi: "Mujhe kitaab padhna pasand hai.",
        english: "I like reading books.",
        telugu: "Naku pusthakaalu chadhavaadam ishtam.",
        transliteration: "मुझे किताब पढ़ना पसंद है।"
      },
      {
        id: "v12_3",
        hindi: "Kya aap khelte hain?",
        english: "Do you play?",
        telugu: "Meeru aaduthara?",
        transliteration: "क्या आप खेलते हैं?"
      },
      {
        id: "v12_4",
        hindi: "Vah gaana gaati hai.",
        english: "She sings a song.",
        telugu: "Aame paata paaduthundhi.",
        transliteration: "वह गाना गाती है।"
      },
      {
        id: "v12_5",
        hindi: "Sangeet madhur hai.",
        english: "The music is sweet/pleasant.",
        telugu: "Sangeetham madhuramga undhi.",
        transliteration: "संगीत मधुर है।"
      }
    ],
    matchingPairs: [
      { id: "m12_1", hindi: "Shauk", english: "Hobby", telugu: "Vyaapakam" },
      { id: "m12_2", hindi: "Kitaab", english: "Book", telugu: "Pusthakam" },
      { id: "m12_3", hindi: "Sangeet", english: "Music", telugu: "Sangeetham" },
      { id: "m12_4", hindi: "Pasand", english: "Like / Preference", telugu: "Ishtam" }
    ],
    sentenceBuilders: [
      {
        id: "s12_1",
        englishTarget: "My hobby is music.",
        teluguTarget: "Naa vyaapakam sangeetham.",
        hindiWords: ["shauk", "sangeet", "hai", "Mera"],
        correctSequence: ["Mera", "shauk", "sangeet", "hai"]
      },
      {
        id: "s12_2",
        englishTarget: "I like reading books.",
        teluguTarget: "Naku pusthakaalu chadhavaadam ishtam.",
        hindiWords: ["pasand", "padhna", "kitaab", "Mujhe", "hai"],
        correctSequence: ["Mujhe", "kitaab", "padhna", "pasand", "hai"]
      }
    ]
  },
  {
    id: 13,
    title: "Graduation Exam",
    subtitle: "Comprehensive Final Test",
    description: "Evaluates advanced grammar, travel and health syntax. Pass this final test with 80%+ to achieve the Bhasha Pravina Title!",
    vocabulary: [],
    matchingPairs: [],
    sentenceBuilders: []
  }
];
