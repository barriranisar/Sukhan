export const moods = ["Late-Night Thoughts", "Quiet Heartbreak", "Existential", "Rebellion & Hope", "Longing & Love", "Nostalgia", "Motivation", "Burnout & Healing"];

export type Word = {
  word: string;
  roman: string;
  meaningEnglish: string;
  meaningUrdu: string;
  pronunciation: string;
  context?: string | undefined;
};

export type Couplet = {
  id: number;
  poet: string;
  era: string;
  mood: string[];
  tashreeh: string;
  english: string;
  audioTitle: string;
  reciterName: string;
  len: string;
  audioUrl?: string;
  words: Word[][];
  verseNastaliq: string[];
  verseRoman: string[];
  urdu: string[];
  roman: string[];
};

type W = [ur: string, roman: string, en: string, urMeaning: string, context?: string];

const mk = (c: Omit<Couplet, "words" | "verseNastaliq" | "verseRoman" | "urdu" | "roman"> & { lines: W[][] }): Couplet => {
  const words = c.lines.map((l) =>
    l.map(([word, roman, meaningEnglish, meaningUrdu, context]) => ({ word, roman, meaningEnglish, meaningUrdu, pronunciation: roman, context })),
  );
  const urdu = words.map((l) => l.map((w) => w.word).join(" "));
  const roman = words.map((l) => l.map((w) => w.roman).join(" "));
  const { lines: _l, ...rest } = c;
  return { ...rest, words, verseNastaliq: urdu, verseRoman: roman, urdu, roman };
};

const raw: Couplet[] = [
  mk({
    id: 1,
    poet: "Mirza Ghalib",
    era: "1797–1869 · Mughal Delhi",
    mood: ["Existential", "Late-Night Thoughts"],
    english: "A thousand desires, each worth dying for — many were fulfilled, yet still too few.",
    tashreeh: "We want so many things, and each one feels like everything. Even after getting many of them, the heart says it wasn't enough.",
    audioTitle: "Hazaron Khwahishen",
    reciterName: "Zia Mohyeddin",
    len: "0:14",
    audioUrl: "/audio/1 Hazaron Khuwaishein Esi _Mirza Ghalib.mp3",
    lines: [
      [
        ["ہزاروں", "hazāroñ", "Thousands", "Bohat saare, ginti se bahar", "Sets the scale — the desires are countless."],
        ["خواہشیں", "khvāhisheñ", "Desires, wishes", "Dil ki chaahatein", "The heart's many longings."],
        ["ایسی", "aisī", "Such, of this kind", "Is tarah ki"],
        ["کہ", "ki", "That, so that", "Ke — baat ko aage jorta hai"],
        ["ہر", "har", "Every, each", "Har ek"],
        ["خواہش", "khvāhish", "Desire, wish", "Chaahat, armaan"],
        ["پہ", "pe", "On, upon", "Par"],
        ["دم", "dam", "Breath, life", "Saans, jaan", "From the idiom 'dam nikalna' — to breathe one's last."],
        ["نکلے", "nikle", "Leaves, comes out", "Bahar aaye", "With 'dam': each wish is worth dying for."],
      ],
      [
        ["بہت", "bahut", "Many, a lot", "Kaafi zyada"],
        ["نکلے", "nikle", "Were fulfilled", "Poore hue", "Same verb as line one, now meaning 'fulfilled'."],
        ["مرے", "mire", "My", "Mere"],
        ["ارمان", "armān", "Hopes, longings", "Dil ke khwaab"],
        ["لیکن", "lekin", "But", "Magar"],
        ["پھر", "phir", "Then, still", "Uske baad bhi"],
        ["بھی", "bhī", "Even, also", "Bhi"],
        ["کم", "kam", "Too few", "Na-kaafi"],
        ["نکلے", "nikle", "Turned out", "Saabit hue", "Third meaning: they 'turned out' to be too few."],
      ],
    ],
  }),
  mk({
    id: 2,
    poet: "Faiz Ahmed Faiz",
    era: "1911–1984 · Progressive Movement",
    mood: ["Rebellion & Hope", "Longing & Love"],
    english: "Let the spring breeze blow and fill the flowers with colour — come, so the garden's business may carry on.",
    tashreeh: "Without you, even spring feels stuck. Come back, and life — and hope — can start moving again.",
    audioTitle: "Gulon Mein Rang Bhare",
    reciterName: "Mehdi Hassan",
    len: "0:09",
    audioUrl: "/audio/2 Gulon Mein Rang Bhare _Faiz Ahmed.mp3",
    lines: [
      [
        ["گلوں", "guloñ", "Flowers", "Phoolon"],
        ["میں", "meñ", "In", "Andar"],
        ["رنگ", "rang", "Colour", "Rang"],
        ["بھرے", "bhare", "May fill", "Bhar de"],
        ["بادِ", "bād-e", "Breeze of", "Hawa", "Persian 'bād' — wind."],
        ["نوبہار", "naubahār", "New spring", "Naya mausam-e-bahar", "Spring as a symbol of new hope."],
        ["چلے", "chale", "May blow", "Chale"],
      ],
      [
        ["چلے", "chale", "Come", "Aa jao", "Same verb, now an invitation."],
        ["بھی", "bhī", "Even, now", "Bhi"],
        ["آؤ", "āo", "Come", "Aao"],
        ["کہ", "ki", "So that", "Taa-ke"],
        ["گلشن", "gulshan", "Garden", "Bagh", "The garden can mean the world or the homeland."],
        ["کا", "kā", "Of", "Ka"],
        ["کاروبار", "kārobār", "Business, workings", "Kaam kaaj"],
        ["چلے", "chale", "May carry on", "Jaari rahe", "Third sense: to keep running."],
      ],
    ],
  }),
  mk({
    id: 3,
    poet: "Jaun Elia",
    era: "1931–2002 · Modern Karachi",
    mood: ["Quiet Heartbreak", "Late-Night Thoughts"],
    english: "Why be formal about saying it — whoever is happy, I envy them.",
    tashreeh: "No point pretending to be polite: when you're hurting, other people's happiness stings a little.",
    audioTitle: "Kya Takalluf Karein",
    reciterName: "Sukhan Studio",
    len: "0:07",
    audioUrl: "/audio/3 Kya Takaluf Karein _Juan Elia.mp3",
    lines: [
      [
        ["کیا", "kyā", "Why, what", "Kyun"],
        ["تکلف", "takalluf", "Formality", "Banawat, lehaaz", "Polite hesitation — Jaun refuses it."],
        ["کریں", "kareñ", "Should we do", "Karein"],
        ["یہ", "ye", "This", "Yeh"],
        ["کہنے", "kahne", "Saying", "Bolne"],
        ["میں", "meñ", "In", "Mein"],
      ],
      [
        ["جو", "jo", "Whoever", "Jo"],
        ["بھی", "bhī", "Ever", "Bhi"],
        ["خوش", "khush", "Happy", "Khush"],
        ["ہے", "hai", "Is", "Hai"],
        ["ہم", "ham", "I / we", "Hum"],
        ["اس", "us", "Him / that one", "Us"],
        ["سے", "se", "From, of", "Se"],
        ["جلتے", "jalte", "Envy (burn)", "Hasad karte", "Literally 'burn' — the idiom for jealousy."],
        ["ہیں", "haiñ", "Are", "Hain"],
      ],
    ],
  }),
  mk({
    id: 4,
    poet: "Parveen Shakir",
    era: "1952–1994 · Modern Pakistan",
    mood: ["Nostalgia", "Longing & Love"],
    english: "He is a fragrance — he'll scatter in the winds. The problem is the flower: where will the flower go?",
    tashreeh: "The one who leaves moves on easily, like a scent in the air. The one left behind is stuck, with nowhere to go.",
    audioTitle: "Woh To Khushboo Hai",
    reciterName: "Sukhan Studio",
    len: "0:14",
    audioUrl: "/audio/4 Woh toh Khushbo Hai_Parveen Shakir.mp3",
    lines: [
      [
        ["وہ", "vo", "He / she", "Woh"],
        ["تو", "to", "Indeed", "To"],
        ["خوشبو", "khushbū", "Fragrance", "Mehak", "The one who leaves — free and weightless."],
        ["ہے", "hai", "Is", "Hai"],
        ["ہواؤں", "havāoñ", "Winds", "Hawayein"],
        ["میں", "meñ", "In", "Andar"],
        ["بکھر", "bikhar", "Scatter", "Phail jaana"],
        ["جائے", "jāe", "Will go", "Jaaye"],
        ["گا", "gā", "(future)", "Ga"],
      ],
      [
        ["مسئلہ", "mas'ala", "Problem", "Mushkil"],
        ["پھول", "phūl", "Flower", "Gul", "The one left behind, rooted in place."],
        ["کا", "kā", "Of", "Ka"],
        ["ہے", "hai", "Is", "Hai"],
        ["پھول", "phūl", "Flower", "Gul"],
        ["کدھر", "kidhar", "Where", "Kahan"],
        ["جائے", "jāe", "Will go", "Jaaye"],
        ["گا", "gā", "(future)", "Ga"],
      ],
    ],
  }),
  mk({
    id: 5,
    poet: "Allama Iqbal",
    era: "1877–1938 · Lahore",
    mood: ["Motivation", "Rebellion & Hope"],
    english: "Beyond the stars there are still more worlds; love still has more tests to face.",
    tashreeh: "Don't stop at what you've reached. There is always more to explore and more challenges to grow through.",
    audioTitle: "Sitaron Se Aage",
    reciterName: "Sukhan Studio",
    len: "0:09",
    audioUrl: "/audio/5 Sitaron Say Age _Alama Iqbal.mp3",
    lines: [
      [
        ["ستاروں", "sitāroñ", "Stars", "Taare"],
        ["سے", "se", "From, than", "Se"],
        ["آگے", "āge", "Beyond", "Paar", "Pushes the horizon past the sky itself."],
        ["جہاں", "jahāñ", "Worlds", "Duniyaein"],
        ["اور", "aur", "More", "Mazeed"],
        ["بھی", "bhī", "Also", "Bhi"],
        ["ہیں", "haiñ", "Are", "Hain"],
      ],
      [
        ["ابھی", "abhī", "Still, yet", "Abhi tak"],
        ["عشق", "ishq", "Love, passion", "Mohabbat, junoon", "For Iqbal, 'ishq' is driving passion."],
        ["کے", "ke", "Of", "Ke"],
        ["امتحاں", "imtihāñ", "Tests, trials", "Aazmaish"],
        ["اور", "aur", "More", "Mazeed"],
        ["بھی", "bhī", "Also", "Bhi"],
        ["ہیں", "haiñ", "Are", "Hain"],
      ],
    ],
  }),
  mk({
    id: 6,
    poet: "Ahmad Faraz",
    era: "1931–2008 · Modern Pakistan",
    mood: ["Longing & Love", "Quiet Heartbreak"],
    english: "Let it be resentment, then — come, even if only to hurt my heart. Come, even if only to leave me again.",
    tashreeh: "I miss you so much that I'd take you back even angry, even if you only came to leave again.",
    audioTitle: "Ranjish Hi Sahi",
    reciterName: "Mehdi Hassan",
    len: "0:10",
    audioUrl: "/audio/6 Ranjish Hi Sahi _Ahmad Faraz copy.mp3",
    lines: [
      [
        ["رنجش", "ranjish", "Resentment", "Narazgi"],
        ["ہی", "hī", "Even, only", "Hi"],
        ["سہی", "sahī", "So be it", "Chalo yehi sahi", "'Even if it's resentment, fine.'"],
        ["دل", "dil", "Heart", "Dil"],
        ["ہی", "hī", "Only", "Hi"],
        ["دکھانے", "dukhāne", "To hurt", "Takleef dena"],
        ["کے", "ke", "For", "Ke"],
        ["لیے", "liye", "For", "Liye"],
        ["آ", "ā", "Come", "Aa jao", "The plea that repeats through the ghazal."],
      ],
      [
        ["آ", "ā", "Come", "Aa"],
        ["پھر", "phir", "Again", "Dobara"],
        ["سے", "se", "(again)", "Se"],
        ["مجھے", "mujhe", "Me", "Mujhe"],
        ["چھوڑ", "chhoR", "Leave", "Chhorna"],
        ["کے", "ke", "Having", "Kar"],
        ["جانے", "jāne", "To go", "Jaana"],
        ["کے", "ke", "For", "Ke"],
        ["لیے", "liye", "For", "Liye"],
        ["آ", "ā", "Come", "Aa"],
      ],
    ],
  }),
  mk({
    id: 7,
    poet: "Nasir Kazmi",
    era: "1925–1972 · Lahore",
    mood: ["Late-Night Thoughts", "Nostalgia"],
    english: "A wave of feeling has just risen in my heart — some fresh breeze has just blown.",
    tashreeh: "Sometimes, late at night, a sudden feeling stirs inside you — like a cool new wind after a long still day.",
    audioTitle: "Dil Mein Ek Lehr",
    reciterName: "Ghulam Ali",
    len: "0:07",
    audioUrl: "/audio/7 Dil Mein Ek Lehr _Nasir Kazmi.mp3",
    lines: [
      [
        ["دل", "dil", "Heart", "Dil"],
        ["میں", "meñ", "In", "Andar"],
        ["اک", "ik", "A, one", "Ek"],
        ["لہر", "lahar", "Wave", "Mauj", "A sudden surge of feeling or memory."],
        ["سی", "sī", "Like, a kind of", "Jaisi"],
        ["اٹھی", "uThī", "Rose", "Uthi"],
        ["ہے", "hai", "Has", "Hai"],
        ["ابھی", "abhī", "Just now", "Abhi"],
      ],
      [
        ["کوئی", "koī", "Some", "Koi"],
        ["تازہ", "tāza", "Fresh", "Naya"],
        ["ہوا", "havā", "Breeze, wind", "Hawa", "Fresh air — change or a returning memory."],
        ["چلی", "chalī", "Blew", "Chali"],
        ["ہے", "hai", "Has", "Hai"],
        ["ابھی", "abhī", "Just now", "Abhi"],
      ],
    ],
  }),
  mk({
    id: 8,
    poet: "Mir Taqi Mir",
    era: "1723–1810 · Classical Delhi",
    mood: ["Quiet Heartbreak", "Existential"],
    english: "Every leaf, every bush knows my condition — only the flower doesn't; the whole garden knows.",
    tashreeh: "Everyone around can see how much I'm hurting. The only one who doesn't notice is the one I love.",
    audioTitle: "Patta Patta Boota Boota",
    reciterName: "Mehdi Hassan",
    len: "0:11",
    audioUrl: "/audio/8 Patta Patta Boota _Mir Taqi Mir.mp3",
    lines: [
      [
        ["پتا", "pattā", "Leaf", "Patta"],
        ["پتا", "pattā", "Leaf", "Patta", "Repeated: every single leaf."],
        ["بوٹا", "būTā", "Bush, plant", "Paudha"],
        ["بوٹا", "būTā", "Bush", "Paudha", "Repeated: every single plant."],
        ["حال", "hāl", "Condition, state", "Haalat"],
        ["ہمارا", "hamārā", "My / our", "Mera"],
        ["جانے", "jāne", "Knows", "Jaanta"],
        ["ہے", "hai", "Is", "Hai"],
      ],
      [
        ["جانے", "jāne", "Knows", "Jaane"],
        ["نہ", "na", "Not", "Nahin"],
        ["جانے", "jāne", "Knows", "Jaane", "'Jāne na jāne' — whether or not."],
        ["گل", "gul", "Flower (the beloved)", "Phool — yahan mehboob"],
        ["ہی", "hī", "Only", "Hi"],
        ["نہ", "na", "Not", "Nahin"],
        ["جانے", "jāne", "Knows", "Jaane"],
        ["باغ", "bāgh", "Garden", "Bagheecha"],
        ["تو", "to", "Indeed", "To"],
        ["سارا", "sārā", "Whole", "Poora"],
        ["جانے", "jāne", "Knows", "Jaane"],
        ["ہے", "hai", "Is", "Hai"],
      ],
    ],
  }),
  ...extra(),
];

function extra(): Couplet[] {
  const S = "Sukhan Studio";
  return [
    mk({ id: 9, poet: "Mir Taqi Mir", era: "1723–1810 · Classical Delhi", mood: ["Longing & Love"], english: "This is only love's beginning — why weep? Wait and see what happens ahead.", tashreeh: "This is only the beginning of love, why do you lament? Wait and see what greater trials unfold ahead.", audioTitle: "Ibtida-e-Ishq", reciterName: S, len: "0:10",audioUrl: "/audio/9 Ibtida-e-Ishq _Mir Taqi Mir.mp3", lines: [
      [["ابتداۓ", "ibtidā-e", "Beginning of", "Shuruaat", "The very first stage."], ["عشق", "ishq", "Love", "Mohabbat"], ["ہے", "hai", "Is", "Hai"], ["روتا", "rotā", "Weeping", "Rona"], ["ہے", "hai", "Is", "Hai"], ["کیا", "kyā", "Why", "Kyun"]],
      [["آگے", "āge", "Ahead", "Aage"], ["آگے", "āge", "Ahead", "Aage", "Repeated: further and further on."], ["دیکھیے", "dekhiye", "Watch, see", "Dekhiye"], ["ہوتا", "hotā", "Happens", "Hota"], ["ہے", "hai", "Is", "Hai"], ["کیا", "kyā", "What", "Kya"]],
    ] }),
    mk({ id: 10, poet: "Mirza Ghalib", era: "1797–1869 · Mughal Delhi", mood: ["Existential"], english: "O naive heart, what has happened to you? What, after all, is the cure for this pain?", tashreeh: "O naive heart, what has afflicted you? What indeed is the remedy for this profound sorrow?", audioTitle: "Dil-e-Nadaan", reciterName: S, len: "0:07",audioUrl: "/audio/10 Dile Nadaan _Mirza Ghalib.mp3", lines: [
      [["دلِ", "dil-e", "Heart (O)", "Dil"], ["ناداں", "nādāñ", "Naive, foolish", "Bhola, na-samajh"], ["تجھے", "tujhe", "To you", "Tujhe"], ["ہوا", "huā", "Happened", "Hua"], ["کیا", "kyā", "What", "Kya"], ["ہے", "hai", "Is", "Hai"]],
      [["آخر", "āḳhir", "After all", "Aakhir"], ["اس", "is", "This", "Is"], ["درد", "dard", "Pain", "Takleef"], ["کی", "kī", "Of", "Ki"], ["دوا", "davā", "Cure, remedy", "Ilaaj"], ["کیا", "kyā", "What", "Kya"], ["ہے", "hai", "Is", "Hai"]],
    ] }),
    mk({ id: 11, poet: "Allama Iqbal", era: "1877–1938 · Lahore", mood: ["Rebellion & Hope", "Motivation"], english: "Raise your selfhood so high that before every decree of fate, God Himself asks: tell me, what is your wish?", tashreeh: "Elevate your selfhood so high that before writing destiny, God Himself asks what your desire is.", audioTitle: "Khudi Ko Kar Buland", reciterName: S, len: "0:19",audioUrl: "/audio/11 Khudi Ko kr Boland _Allama Iqbal.mp3", lines: [
      [["خودی", "ḳhudī", "Selfhood", "Apni pehchaan", "Iqbal's key idea: self-respect and inner strength."], ["کو", "ko", "(object)", "Ko"], ["کر", "kar", "Make", "Kar"], ["بلند", "buland", "Lofty, high", "Ooncha"], ["اتنا", "itnā", "So much", "Itna"], ["کہ", "ki", "That", "Ke"], ["ہر", "har", "Every", "Har"], ["تقدیر", "taqdīr", "Destiny", "Qismat"], ["سے", "se", "From", "Se"], ["پہلے", "pahle", "Before", "Pehle"]],
      [["خدا", "ḳhudā", "God", "Allah"], ["بندے", "bande", "Servant, person", "Insaan"], ["سے", "se", "From", "Se"], ["خود", "ḳhud", "Himself", "Khud"], ["پوچھے", "pūchhe", "Asks", "Poochhe"], ["بتا", "batā", "Tell", "Bata"], ["تیری", "terī", "Your", "Teri"], ["رضا", "razā", "Will, wish", "Marzi"], ["کیا", "kyā", "What", "Kya"], ["ہے", "hai", "Is", "Hai"]],
    ] }),
    mk({ id: 12, poet: "Momin Khan Momin", era: "1800–1852 · Delhi", mood: ["Longing & Love"], english: "You are with me, as it were, when no one else is.", tashreeh: "It feels as though you are beside me in presence, whenever no one else is around.", audioTitle: "Tum Mere Paas", reciterName: S, len: "0:06",audioUrl: "/audio/12 Tum Mere Pass_Momin Khan.mp3",  lines: [
      [["تم", "tum", "You", "Tum"], ["مرے", "mire", "My", "Mere"], ["پاس", "pās", "Near", "Qareeb"], ["ہوتے", "hote", "Are", "Hote"], ["ہو", "ho", "Are", "Ho"], ["گویا", "goyā", "As if", "Jaise", "Presence felt in imagination."]],
      [["جب", "jab", "When", "Jab"], ["کوئی", "koī", "Anyone", "Koi"], ["دوسرا", "dūsrā", "Another", "Doosra"], ["نہیں", "nahīñ", "Not", "Nahin"], ["ہوتا", "hotā", "Is", "Hota"]],
    ] }),
    mk({ id: 13, poet: "Bahadur Shah Zafar", era: "1775–1862 · Last Mughal", mood: ["Quiet Heartbreak"], english: "I am no one's light of the eye, no one's peace of heart; I am a handful of dust of no use to anyone.", tashreeh: "I am neither the light of someone's eye nor the peace of any heart; I am merely a handful of helpless dust.", audioTitle: "Na Kisi Ki Aankh Ka Noor", reciterName: S, len: "0:09",audioUrl: "/audio/13 Na Kisi ki Ankh _Bahadur Shah.mp3", lines: [
      [["نہ", "na", "Neither", "Na"], ["کسی", "kisī", "Anyone's", "Kisi"], ["کی", "kī", "Of", "Ki"], ["آنکھ", "āñkh", "Eye", "Aankh"], ["کا", "kā", "Of", "Ka"], ["نور", "nūr", "Light", "Roshni", "'Light of the eye' — someone dearly loved."], ["ہوں", "hūñ", "Am", "Hoon"], ["نہ", "na", "Nor", "Na"], ["کسی", "kisī", "Anyone's", "Kisi"], ["کے", "ke", "Of", "Ke"], ["دل", "dil", "Heart", "Dil"], ["کا", "kā", "Of", "Ka"], ["قرار", "qarār", "Peace", "Sukoon"], ["ہوں", "hūñ", "Am", "Hoon"]],
      [["جو", "jo", "Who", "Jo"], ["کسی", "kisī", "Anyone", "Kisi"], ["کے", "ke", "Of", "Ke"], ["کام", "kām", "Use", "Kaam"], ["نہ", "na", "Not", "Na"], ["آ", "ā", "Come", "Aa"], ["سکے", "sake", "Could", "Sake"], ["میں", "maiñ", "I", "Main"], ["وہ", "vo", "That", "Woh"], ["ایک", "ek", "One", "Ek"], ["مشتِ", "musht-e", "Handful of", "Mutthi bhar"], ["غبار", "ġhubār", "Dust", "Dhool"]],
    ] }),
    mk({ id: 14, poet: "Khwaja Mir Dard", era: "1721–1785 · Delhi Sufi", mood: ["Existential"], english: "How could earth and sky contain Your vastness? Only my heart is where You can fit.", tashreeh: "Neither the earth nor skies could contain Your vastness; it is only the human heart where the Divine resides.", audioTitle: "Arz-o-Sama", reciterName: S, len: "0:10",audioUrl: "/audio/14 Arz-o-Sama _Khwaja Mir Dard.mp3", lines: [
      [["ارض", "arz", "Earth", "Zameen"], ["و", "o", "And", "Aur"], ["سما", "samā", "Sky", "Aasmaan"], ["کہاں", "kahāñ", "How, where", "Kahan"], ["تیری", "terī", "Your", "Teri"], ["وسعت", "vus'at", "Vastness", "Phailaao"], ["کو", "ko", "(object)", "Ko"], ["پا", "pā", "Grasp", "Paa"], ["سکے", "sake", "Could", "Sake"]],
      [["میرا", "merā", "My", "Mera"], ["ہی", "hī", "Only", "Hi"], ["دل", "dil", "Heart", "Dil"], ["ہے", "hai", "Is", "Hai"], ["وہ", "vo", "That", "Woh"], ["جہاں", "jahāñ", "Where", "Jahan"], ["تو", "tū", "You", "Tu"], ["سما", "samā", "Fit, be contained", "Sama jana", "Wordplay: same spelling as 'sky' in line one."], ["سکے", "sake", "Could", "Sake"]],
    ] }),
    mk({ id: 15, poet: "Faiz Ahmed Faiz", era: "1911–1984 · Progressive Movement", mood: ["Rebellion & Hope"], english: "We will keep nurturing the tablet and pen; we will keep writing what the heart endures.", tashreeh: "We shall keep nurturing the slate and pen, continuing to write whatever the heart endures.", audioTitle: "Lauh-o-Qalam", reciterName: S, len: "0:07",audioUrl: "/audio/15 Hum Parvaresh Lauh-o-Qalam _Faiz Ahmed Faiz.mp3", lines: [
      [["ہم", "ham", "We", "Hum"], ["پرورشِ", "parvarish-e", "Nurturing of", "Paalna"], ["لوح", "lauh", "Tablet, slate", "Takhti"], ["و", "o", "And", "Aur"], ["قلم", "qalam", "Pen", "Qalam", "Writing as resistance."], ["کرتے", "karte", "Doing", "Karte"], ["رہیں", "raheñ", "Keep", "Rahein"], ["گے", "ge", "(will)", "Ge"]],
      [["جو", "jo", "Whatever", "Jo"], ["دل", "dil", "Heart", "Dil"], ["پہ", "pe", "On", "Par"], ["گزرتی", "guzartī", "Passes, befalls", "Beet'ti"], ["ہے", "hai", "Is", "Hai"], ["رقم", "raqam", "Writing", "Likhna"], ["کرتے", "karte", "Doing", "Karte"], ["رہیں", "raheñ", "Keep", "Rahein"], ["گے", "ge", "(will)", "Ge"]],
    ] }),
    mk({ id: 16, poet: "Jaun Elia", era: "1931–2002 · Modern Karachi", mood: ["Late-Night Thoughts", "Burnout & Healing"], english: "Heartless despair — will the days just pass like this? If we merely stay alive, we will die.", tashreeh: "In this state of despair, will days simply pass away? If we merely survive without living, we will perish inside.", audioTitle: "Be-Dili", reciterName: S, len: "0:08",audioUrl: "/audio/16 Be-Dili _Jaun Elia.mp3", lines: [
      [["بے", "be", "Without", "Baghair"], ["دلی", "dilī", "Heart, spirit", "Dil", "'Be-dili' — listless despair."], ["کیا", "kyā", "Will", "Kya"], ["یوں", "yūñ", "Like this", "Aise"], ["ہی", "hī", "Just", "Hi"], ["دن", "din", "Days", "Din"], ["گزر", "guzar", "Pass", "Guzar"], ["جائیں", "jāeñ", "Go", "Jaayein"], ["گے", "ge", "(will)", "Ge"]],
      [["صرف", "sirf", "Only", "Sirf"], ["زندہ", "zinda", "Alive", "Zinda"], ["رہے", "rahe", "Stayed", "Rahe"], ["ہم", "ham", "We", "Hum"], ["تو", "to", "Then", "To"], ["مر", "mar", "Die", "Mar"], ["جائیں", "jāeñ", "Go", "Jaayein"], ["گے", "ge", "(will)", "Ge"]],
    ] }),
    mk({ id: 17, poet: "Ahmad Faraz", era: "1931–2008 · Modern Pakistan", mood: ["Longing & Love"], english: "I hear people gaze at her to their heart's fill — so let us stay a few days in her city and see.", tashreeh: "I hear people gaze at them in utter admiration; let us pause and stay in their city for a few days to see.", audioTitle: "Suna Hai Log", reciterName: S, len: "0:09",audioUrl: "/audio/17 Suna Hai Log _Ahmed Faraz.mp3", lines: [
      [["سنا", "sunā", "Heard", "Suna"], ["ہے", "hai", "Is", "Hai"], ["لوگ", "log", "People", "Log"], ["اسے", "use", "Her / him", "Use"], ["آنکھ", "āñkh", "Eye", "Aankh"], ["بھر", "bhar", "Fill", "Bhar", "'Aankh bhar ke' — gazing deeply."], ["کے", "ke", "Having", "Ke"], ["دیکھتے", "dekhte", "See", "Dekhte"], ["ہیں", "haiñ", "Are", "Hain"]],
      [["سو", "so", "So", "To"], ["اس", "us", "Her / his", "Us"], ["کے", "ke", "Of", "Ke"], ["شہر", "shahr", "City", "Shehar"], ["میں", "meñ", "In", "Mein"], ["کچھ", "kuchh", "A few", "Kuchh"], ["دن", "din", "Days", "Din"], ["ٹھہر", "ṭhahar", "Stay", "Ruk"], ["کے", "ke", "Having", "Ke"], ["دیکھتے", "dekhte", "See", "Dekhte"], ["ہیں", "haiñ", "Are", "Hain"]],
    ] }),
    mk({ id: 18, poet: "Parveen Shakir", era: "1952–1994 · Modern Pakistan", mood: ["Longing & Love"], english: "Word of our acquaintance spread lane to lane — he welcomed me like a fragrance.", tashreeh: "The tale of our acquaintance spread through every street; they welcomed me as gently as a fragrance.", audioTitle: "Koo-ba-Koo", reciterName: S, len: "0:07",audioUrl: "/audio/18 Ko Ba Ko _Parveen Shakir.mp3", lines: [
      [["کو", "kū", "Lane", "Gali"], ["بہ", "ba", "To", "Ba"], ["کو", "kū", "Lane", "Gali", "'Koo-ba-koo' — street to street."], ["پھیل", "phail", "Spread", "Phail"], ["گئی", "gaī", "Went", "Gayi"], ["بات", "bāt", "Talk, word", "Baat"], ["شناسائی", "shanāsāī", "Acquaintance", "Jaan pehchaan"], ["کی", "kī", "Of", "Ki"]],
      [["اس", "us", "He / she", "Us"], ["نے", "ne", "(did)", "Ne"], ["خوشبو", "ḳhushbū", "Fragrance", "Mehak"], ["کی", "kī", "Of", "Ki"], ["طرح", "tarah", "Like", "Tarah"], ["میری", "merī", "My", "Meri"], ["پذیرائی", "pazīrāī", "Welcome", "Khush-aamdeed"], ["کی", "kī", "Did", "Ki"]],
    ] }),
    mk({ id: 19, poet: "Atish Lakhnavi", era: "1778–1847 · Lucknow", mood: ["Longing & Love"], english: "My wish was to set you face to face with the rose — then the restless nightingale and I would talk.", tashreeh: "It was our longing to bring you face-to-face with the rose, while the restless nightingale and I engaged in conversation.", audioTitle: "Ye Aarzu Thi", reciterName: S, len: "0:10",audioUrl: "/audio/19 Ye Aarzu Thi _atish lakhnavi.mp3", lines: [
      [["یہ", "ye", "This", "Yeh"], ["آرزو", "ārzū", "Desire", "Khwahish"], ["تھی", "thī", "Was", "Thi"], ["تجھے", "tujhe", "You", "Tujhe"], ["گل", "gul", "Rose", "Phool"], ["کے", "ke", "Of", "Ke"], ["رو", "rū", "Face", "Chehra"], ["بہ", "ba", "To", "Ba"], ["رو", "rū", "Face", "Chehra", "'Ru-ba-ru' — face to face."], ["کرتے", "karte", "Make", "Karte"]],
      [["ہم", "ham", "I / we", "Hum"], ["اور", "aur", "And", "Aur"], ["بلبلِ", "bulbul-e", "Nightingale", "Bulbul"], ["بے", "be", "Without", "Baghair"], ["تاب", "tāb", "Patience", "Sabr", "'Be-taab' — restless."], ["گفتگو", "guftagū", "Conversation", "Baat cheet"], ["کرتے", "karte", "Would do", "Karte"]],
    ] }),
    mk({ id: 20, poet: "Ibrahim Zauq", era: "1790–1854 · Mughal Delhi", mood: ["Existential"], english: "Life brought us, we came; death took us, we went. We came not by our choice, nor leave by our choice.", tashreeh: "Life brought us into existence and we came; death carried us away and we left. Neither our arrival nor our departure was by our own choice.", audioTitle: "Laai Hayat", reciterName: S, len: "0:04",audioUrl: "/audio/20 Lai Hayat Aye _Ibrahim Zuaq.mp3", lines: [
      [["لائی", "lāī", "Brought", "Laayi"], ["حیات", "hayāt", "Life", "Zindagi"], ["آئے", "āe", "We came", "Aaye"], ["قضا", "qazā", "Death, fate", "Maut"], ["لے", "le", "Took", "Le"], ["چلی", "chalī", "Went", "Chali"], ["چلے", "chale", "We left", "Chale"]],
      [["اپنی", "apnī", "Our own", "Apni"], ["خوشی", "ḳhushī", "Will, choice", "Marzi", "Here 'khushi' means free will, not happiness."], ["نہ", "na", "Not", "Na"], ["آئے", "āe", "Came", "Aaye"], ["نہ", "na", "Nor", "Na"], ["اپنی", "apnī", "Our own", "Apni"], ["خوشی", "ḳhushī", "Will, choice", "Marzi"], ["چلے", "chale", "Left", "Chale"]],
    ] }),
  ];
}

export const coupletsData: Couplet[] = [...raw].sort((a, b) => a.id - b.id);

export const getCouplet = (id?: number) => coupletsData.find((c) => c.id === id) ?? coupletsData[0]!;

export const coupletSearch = (s: Record<string, unknown>): { id?: number } => {
  const id = Number(s["id"]);
  return Number.isFinite(id) && id > 0 ? { id } : {};
};

export type PoetProfile = {
  id: string;
  name: string;
  urduName: string;
  era: string;
  bio: string;
  themes: string[];
};

export const poetsData: Record<string, PoetProfile> = {
  "Mirza Ghalib": {
    id: "mirza-ghalib",
    name: "Mirza Ghalib",
    urduName: "مرزا اسد اللہ خاں غالب",
    era: "1797–1869 · Mughal Delhi",
    bio: "Ghalib is the rebellious philosopher of Urdu poetry who questioned everything with a mischievous smirk. He walked the crumbling lanes of Mughal Delhi, turning heartbreak, empty pockets, and existential doubt into sublime art. Rather than wallowing in sadness, he laughed at human weakness and teased destiny itself. His couplets feel startlingly modern because he embraced doubt as the truest form of belief. Reading Ghalib is like sitting with a brilliant, witty friend over tea late into the night.",
    themes: ["Existentialism", "Irony & Wit", "Human Fragility", "Mysticism", "Mughal Delhi"],
  },
  "Faiz Ahmed Faiz": {
    id: "faiz-ahmed-faiz",
    name: "Faiz Ahmed Faiz",
    urduName: "فیض احمد فیض",
    era: "1911–1984 · Progressive Movement",
    bio: "Faiz made revolution sound as tender and heartbreaking as a secret confession of love. He stood fearlessly against tyrants and spent years in prison and exile, yet his poetry never turned bitter or harsh. Instead, he blended romantic nostalgia with a deep hunger for justice, human dignity, and freedom. In his verses, the pain of missing someone feels identical to the ache of a broken nation. He taught generations that speaking truth to power is the highest act of romantic devotion.",
    themes: ["Rebellion & Hope", "Revolution", "Dignity", "Longing & Love", "Exile"],
  },
  "Jaun Elia": {
    id: "jaun-elia",
    name: "Jaun Elia",
    urduName: "جون ایلیا",
    era: "1931–2002 · Modern Karachi",
    bio: "Jaun Elia is the ultimate patron saint of modern late-night heartache and raw emotional honesty. He shattered the polite manners of classical poetry, speaking with unfiltered anger, self-deprecation, and devastating tenderness. His verses sound like late-night thoughts whispered into the dark when you cannot sleep. He refused to pretend he was happy, calling out the quiet pretenses of society and romance alike. Reading Jaun feels like looking into a mirror that refuses to flatter you.",
    themes: ["Existential Despair", "Nihilism", "Late-Night Melancholy", "Alienation", "Raw Grief"],
  },
  "Parveen Shakir": {
    id: "parveen-shakir",
    name: "Parveen Shakir",
    urduName: "پروین شاکر",
    era: "1952–1994 · Modern Pakistan",
    bio: "Parveen Shakir brought the scent of fresh rain and young, honest affection into modern Urdu verse. She was among the very first women to write openly about desire, jealousy, and the vulnerability of falling in love from a woman's own heart. Her words carry the lightness of a blooming flower alongside the sharp sting of being misunderstood. She balanced emotional warmth with a fierce, dignified independence. To read Parveen is to feel a gentle breeze on an overcast afternoon, carrying memories you thought you had forgotten.",
    themes: ["Feminine Voice", "Longing & Fragrance", "Emotional Independence", "Gentle Melancholy"],
  },
  "Allama Iqbal": {
    id: "allama-iqbal",
    name: "Allama Iqbal",
    urduName: "علامہ محمد اقبال",
    era: "1877–1938 · Lahore & Sialkot",
    bio: "Iqbal is the visionary poet whose words sound like an urgent thunderclap awakening the sleeping soul. He hated self-pity and urged every human being to discover 'Khudi'—the fearless fire of selfhood and dignity inside. Rather than mourning what is lost, his couplets challenge the stars and push horizons past the sky. He believed our struggles are not punishments, but wings designed to help us fly higher. Reading Iqbal fills your chest with purpose, grit, and the courage to rewrite your own destiny.",
    themes: ["Khudi (Selfhood)", "Cosmic Destiny", "Spiritual Awakening", "Courage & Motivation"],
  },
  "Ahmad Faraz": {
    id: "ahmad-faraz",
    name: "Ahmad Faraz",
    urduName: "احمد فراز",
    era: "1931–2008 · Modern Pakistan",
    bio: "Ahmad Faraz is perhaps the most universally beloved romantic voice of modern South Asia. His couplets roll off the tongue with effortless musicality, turning even bitter goodbyes into sweet, memorable melodies. Yet beneath his soft romantic charm was an iron spine that openly defied military dictators and paid the price in exile. He captured the dignity of unrequited love like no other—never pleading, always gracious even in tearful parting. If love had an official voice in Urdu, it would sound like Faraz.",
    themes: ["Romantic Longing", "Dignified Heartbreak", "Defiance", "Musicality"],
  },
  "Nasir Kazmi": {
    id: "nasir-kazmi",
    name: "Nasir Kazmi",
    urduName: "ناصر کاظمی",
    era: "1925–1972 · Lahore",
    bio: "Nasir Kazmi is the quiet poet of solitary twilights, foggy mornings, and late-night strolls. Carrying the lingering ache of displacement after Partition, he built entire worlds using simple words like wind, shadows, and courtyards. His verses do not shout; they linger like a cool breeze through an open window at 2 AM. He finds a strange, comforting beauty in being alone with one's thoughts. Reading Nasir is like sitting in an empty room, listening to rain fall softly on the roof.",
    themes: ["Nocturnal Solitude", "Displacement & Memory", "Quiet Longing", "Urban Melancholy"],
  },
  "Mir Taqi Mir": {
    id: "mir-taqi-mir",
    name: "Mir Taqi Mir",
    urduName: "میر تقی میر",
    era: "1723–1810 · Classical Delhi",
    bio: "Known as 'Khuda-e-Sukhan' (the God of Poetry), Mir is the supreme craftsman of sorrow and pure, unfiltered feeling. He lived through the tragic burning and looting of Delhi, pouring the ashes of his beloved city and his own bruised heart into verse. His language is astonishingly simple, yet every couplet hits with the force of an unhealed wound. He believed suffering is not a flaw in life, but the secret ink from which genuine beauty is born. Even the proud Ghalib bowed his head in reverence before Mir's genius.",
    themes: ["Supreme Pathos", "Sublime Simplicity", "Civilisational Ruin", "Unrequited Love"],
  },
  "Momin Khan Momin": {
    id: "momin-khan-momin",
    name: "Momin Khan Momin",
    urduName: "مومن خان مومن",
    era: "1800–1852 · Delhi",
    bio: "Momin was the master of romantic suspense, private glances, and whispered secrets. A handsome aristocrat, chess master, and astrologer, he wrote ghazals filled with clever double meanings and delicate emotional tension. His verses capture those breathless moments when two people are together in a crowded room and say everything without uttering a word. Even Ghalib famously offered to trade his entire poetic collection for just one of Momin’s couplets. He understood that in love, what is left unsaid is often the most unforgettable.",
    themes: ["Subtle Romance", "Psychological Intimacy", "Witty Conceits", "Unspoken Affection"],
  },
  "Bahadur Shah Zafar": {
    id: "bahadur-shah-zafar",
    name: "Bahadur Shah Zafar",
    urduName: "بہادر شاہ ظفر",
    era: "1775–1862 · Last Mughal Emperor",
    bio: "Zafar was the last Mughal Emperor of India, whose poetry became the moving eulogy of a fallen empire. Stripped of his crown and exiled by colonial rulers to a lonely cell in Burma, he poured his grief into verses of haunting beauty. He wrote of dust, fading lights, and the heartbreak of knowing he would never be buried in his homeland. His poems strip away royal illusions to reveal a tender, fragile human soul in surrender to fate. In his sorrow, millions recognized the shared tragedy of a lost golden age.",
    themes: ["Imperial Elegies", "Helplessness & Dust", "Exile & Longing", "Spiritual Resignation"],
  },
  "Khwaja Mir Dard": {
    id: "khwaja-mir-dard",
    name: "Khwaja Mir Dard",
    urduName: "خواجہ میر درد",
    era: "1721–1785 · Delhi Sufi",
    bio: "Khwaja Mir Dard is the serene mystic whose poetry feels like a quiet sanctuary in a noisy, turbulent world. While armies fought and empires collapsed around him, he sat peacefully in his Delhi shrine, composing verses of divine longing and inner stillness. He taught that the endless universe cannot contain the Divine, but the humble human heart holds space for it easily. His lines carry a meditative rhythm that slows down your breathing and clears the mind. Reading Dard brings a deep, steady peace to a restless soul.",
    themes: ["Sufi Mysticism", "Divine Communion", "Inner Sanctuary", "Transcendence"],
  },
  "Atish Lakhnavi": {
    id: "atish-lakhnavi",
    name: "Atish Lakhnavi",
    urduName: "خواجہ حیدر علی آتش",
    era: "1778–1847 · Lucknow School",
    bio: "Atish brought royal swagger, pride, and dazzling colour to the courts and literary gardens of Lucknow. He walked with a sword at his hip and wrote couplets that practically dance with vibrant rhythm and confident self-respect. His verses celebrate lush roses, restless nightingales, and the intoxicating thrill of facing the beloved eye to eye. He firmly believed that a poet should bow to no king and beg no favors from destiny. His words are an invitation to live boldly, love passionately, and keep your head held high.",
    themes: ["Lucknow Elegance", "Musical Cadence", "Pride & Chivalry", "Lush Romance"],
  },
  "Ibrahim Zauq": {
    id: "ibrahim-zauq",
    name: "Ibrahim Zauq",
    urduName: "شیخ محمد ابراہیم ذوق",
    era: "1790–1854 · Mughal Delhi",
    bio: "Zauq was the legendary court poet and teacher to the Mughal Emperor, revered for his flawless command over language and flow. He turned spoken Urdu idioms into polished gems, making philosophical wisdom sound as effortless as everyday speech. His couplets gently remind us of life's passing nature—that we arrive without choosing to, and depart when our time is up. Alongside his philosophical poise was an infectious love for the living pulse of Delhi. His poetry remains a masterclass in balance, elegance, and timeless grace.",
    themes: ["Idiomatic Mastery", "Courtly Eloquence", "Fate & Mortality", "Philosophical Resignation"],
  },
};

export const getPoetProfile = (poetName: string): PoetProfile => {
  const normalized = poetName.trim().toLowerCase();
  for (const [key, profile] of Object.entries(poetsData)) {
    if (key.toLowerCase() === normalized || profile.name.toLowerCase() === normalized) {
      return profile;
    }
  }
  // Fallback for any unknown or variant name
  return {
    id: poetName.toLowerCase().replace(/\s+/g, "-"),
    name: poetName,
    urduName: poetName,
    era: "Urdu Master",
    bio: `${poetName} is a celebrated voice in Urdu literature whose couplets continue to enchant readers across generations.`,
    themes: ["Classical Ghazal", "Reflection", "Urdu Poetry"],
  };
};

export const getCoupletsByPoet = (poetName: string): Couplet[] => {
  const normalized = poetName.trim().toLowerCase();
  return coupletsData.filter((c) => c.poet.trim().toLowerCase() === normalized);
};

export const getAllPoets = (): (PoetProfile & { coupletCount: number })[] => {
  return Object.values(poetsData).map((profile) => ({
    ...profile,
    coupletCount: getCoupletsByPoet(profile.name).length,
  }));
};
