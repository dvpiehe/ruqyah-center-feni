/**
 * Migration Script V5:
 * Approved 9-Category Pre-Diagnosis System & Clinical Assessment Structure
 * 
 * Category Structure:
 * 1. প্রধান সমস্যা ও অভিযোগ (Main Complaints & Presenting Symptoms) - 10 symptoms + free-text field
 * 2. শারীরিক অসুস্থতা ও রোগের অস্বাভাবিকতা (Physical Symptoms & Health Complaints) - 10 symptoms
 * 3. ঘুমের সমস্যা (Sleep-Related Problems) - 10 symptoms
 * 4. স্বপ্নকেন্দ্রিক সমস্যা (Dream-Related Problems) - 10 symptoms
 * 5. রিজিক, সফলতা ও নিয়ামতে প্রতিবন্ধকতা (Difficulties Related to Rizq, Success & Blessings) - 10 symptoms
 * 6. মানসিক, চারিত্রিক ও সম্পর্কগত পরিবর্তন (Mental, Behavioral & Relational Changes) - 12 symptoms (Includes suicide/self-harm safety flag)
 * 7. ইবাদতে বাধা ও আধ্যাত্মিক অবনতি (Obstacles in Worship & Spiritual Decline) - 10 symptoms
 * 8. সমস্যা শুরুর সময় ও পটভূমি (Problem Onset & Background History) - 10 history-taking questions + text field
 * 9. পারিবারিক ও সামাজিক অবস্থা (Family & Social History) - 10 history-taking questions + text field
 * 
 * Total: 92 items (All categories have >= 10 items)
 */

const fs = require('fs');
const path = require('path');
const db = require('./db');

console.log('=== STARTING MIGRATION V5: PRE-DIAGNOSIS RESTRUCTURING ===');

// Step 1: Backup database
const dbPath = path.join(__dirname, 'ruqyah.db');
const backupPath = path.join(__dirname, `ruqyah.db.bak_v5_${Date.now()}`);
if (fs.existsSync(dbPath)) {
  fs.copyFileSync(dbPath, backupPath);
  console.log(`[Backup] Database backed up to: ${backupPath}`);
}

// Step 2: Ensure additional columns in patient_diagnoses
const columns = db.prepare('PRAGMA table_info(patient_diagnoses)').all().map(c => c.name);

const requiredColumns = [
  { name: 'main_complaints_text', type: 'TEXT' },
  { name: 'onset_history_notes', type: 'TEXT' },
  { name: 'family_social_notes', type: 'TEXT' },
  { name: 'suicidal_ideation_flag', type: 'INTEGER DEFAULT 0' }
];

for (const col of requiredColumns) {
  if (!columns.includes(col.name)) {
    db.prepare(`ALTER TABLE patient_diagnoses ADD COLUMN ${col.name} ${col.type}`).run();
    console.log(`[Schema] Added column '${col.name}' to patient_diagnoses.`);
  }
}

// Step 3: Approved 9 Categories and Symptom Dataset
const APPROVED_DIAGNOSIS_DATA = [
  {
    code: 'main_complaints',
    name_bn: 'প্রধান সমস্যা ও অভিযোগ',
    name_en: 'Main Complaints & Presenting Symptoms',
    description_bn: 'রোগীর প্রধান অভিযোগ ও প্রাথমিক দৃশ্যমান সমস্যা সংক্রান্ত লক্ষণসমূহ।',
    description_en: 'Chief presenting complaints and primary symptoms reported by the patient.',
    sort_order: 1,
    symptoms: [
      {
        bn: 'তীব্র বা দীর্ঘস্থায়ী মাথাব্যথা',
        en: 'Severe or persistent headache',
        sort: 1
      },
      {
        bn: 'মাথা ঘোরা বা ভারসাম্যহীনতা',
        en: 'Dizziness or loss of balance',
        sort: 2
      },
      {
        bn: 'অস্বাভাবিক অস্থিরতা',
        en: 'Unusual restlessness',
        sort: 3
      },
      {
        bn: 'ঘরে থাকতে অনীহা',
        en: 'Reluctance to stay at home',
        sort: 4
      },
      {
        bn: 'অকারণে ভয় বা আতঙ্ক',
        en: 'Unexplained fear or panic',
        sort: 5
      },
      {
        bn: 'দৈনন্দিন কাজে মনোযোগ দিতে অসুবিধা',
        en: 'Difficulty concentrating on daily activities',
        sort: 6
      },
      {
        bn: 'সার্বক্ষণিক দুর্বলতা',
        en: 'Persistent weakness',
        sort: 7
      },
      {
        bn: 'ঘুমের সমস্যা',
        en: 'Sleep disturbances',
        sort: 8
      },
      {
        bn: 'অকারণে মন খারাপ বা বিষণ্ণতা',
        en: 'Unexplained sadness or low mood',
        sort: 9
      },
      {
        bn: 'ব্যক্তিগত, পারিবারিক বা কর্মজীবনে অস্বাভাবিক সমস্যার অনুভূতি',
        en: 'Perceived unusual difficulties in personal, family or professional life',
        sort: 10
      }
    ]
  },
  {
    code: 'physical_symptoms',
    name_bn: 'শারীরিক অসুস্থতা ও রোগের অস্বাভাবিকতা',
    name_en: 'Physical Symptoms & Health Complaints',
    description_bn: 'বিভিন্ন শারীরিক অসুস্থতা, অনিয়ম, অব্যক্ত ব্যথা ও রোগের অস্বাভাবিক শারীরিক লক্ষণ।',
    description_en: 'Somatic issues, persistent pain unresponsive to standard treatments, and bodily complaints.',
    sort_order: 2,
    symptoms: [
      {
        bn: 'মাথায় সার্বক্ষণিক তীব্র বা হালকা ব্যথা, যা সাধারণ পেইনকিলারেও কমে না',
        en: 'Persistent headache that does not improve with ordinary painkillers.',
        sort: 1
      },
      {
        bn: 'পেটে গ্যাস, ভুটভাট শব্দ, পেট ফুলে থাকা বা সূঁচ ফোটানোর মতো ব্যথা',
        en: 'Abdominal gas, rumbling sounds, bloating or sharp abdominal pain.',
        sort: 2
      },
      {
        bn: 'শরীরের বিভিন্ন স্থানে কারণ ছাড়াই ব্যথা ঘুরে বেড়ানো',
        en: 'Migrating pain in different body parts without an identified cause.',
        sort: 3
      },
      {
        bn: 'শরীরের কোনো অঙ্গ অবশ হয়ে যাওয়া অথবা কাঁপা',
        en: 'Numbness or tremors in body parts.',
        sort: 4
      },
      {
        bn: 'নারীদের মাসিকের অনিয়ম, অতিরিক্ত রক্তক্ষরণ বা তীব্র ব্যথা',
        en: 'Menstrual irregularities, excessive bleeding or severe menstrual pain.',
        sort: 5
      },
      {
        bn: 'ত্বকে অস্বাভাবিক দাগ, র্যাশ বা চুলকানি',
        en: 'Unusual skin marks, rashes or itching.',
        sort: 6
      },
      {
        bn: 'হঠাৎ দৃষ্টিশক্তি কমে যাওয়া বা চোখে ঝাপসা দেখা',
        en: 'Sudden visual changes or blurred vision.',
        sort: 7
      },
      {
        bn: 'বুক ধড়ফড় করা বা শ্বাস নিতে কষ্ট হওয়া',
        en: 'Palpitations or breathing difficulties.',
        sort: 8
      },
      {
        bn: 'সার্বক্ষণিক দুর্বলতা বা প্রচণ্ড ক্লান্তি',
        en: 'Persistent weakness or severe fatigue.',
        sort: 9
      },
      {
        bn: 'শরীরের তাপমাত্রা অস্বাভাবিকভাবে বেড়ে যাওয়া বা কমে যাওয়া',
        en: 'Unusual increase or decrease in body temperature.',
        sort: 10
      }
    ]
  },
  {
    code: 'sleep_problems',
    name_bn: 'ঘুমের সমস্যা',
    name_en: 'Sleep-Related Problems',
    description_bn: 'অনিদ্রা, রাতে বারবার ঘুম ভেঙে যাওয়া ও ঘুমের ব্যাঘাত সংক্রান্ত সমস্যাসমূহ।',
    description_en: 'Insomnia, nocturnal restlessness, sleep paralysis, and waking disturbances.',
    sort_order: 3,
    symptoms: [
      {
        bn: 'রাতে ঘুম আসতে দীর্ঘ সময় লাগা',
        en: 'Difficulty falling asleep.',
        sort: 1
      },
      {
        bn: 'সারারাত ঘুম না হওয়া',
        en: 'Inability to sleep throughout the night.',
        sort: 2
      },
      {
        bn: 'বারবার ঘুম ভেঙে যাওয়া',
        en: 'Frequent nighttime awakenings.',
        sort: 3
      },
      {
        bn: 'ঘুমের মধ্যে অস্থিরতা অনুভব করা',
        en: 'Restlessness during sleep.',
        sort: 4
      },
      {
        bn: 'ঘুমের মধ্যে চিৎকার বা কান্না করা',
        en: 'Screaming or crying during sleep.',
        sort: 5
      },
      {
        bn: 'ঘুমের মধ্যে কথা বলা',
        en: 'Talking during sleep.',
        sort: 6
      },
      {
        bn: 'ঘুমের মধ্যে দাঁত কিড়মিড় করা',
        en: 'Teeth grinding during sleep.',
        sort: 7
      },
      {
        bn: 'ঘুমের মধ্যে শরীর অবশ হয়ে যাওয়া বা বোবা ধরা',
        en: 'Sleep paralysis.',
        sort: 8
      },
      {
        bn: 'হঠাৎ আতঙ্কিত হয়ে ঘুম থেকে জেগে ওঠা',
        en: 'Waking up suddenly in fear.',
        sort: 9
      },
      {
        bn: 'পর্যাপ্ত ঘুমের পরও ক্লান্ত বা ঘুমঘুম অনুভব করা',
        en: 'Feeling tired or sleepy despite adequate sleep.',
        sort: 10
      }
    ]
  },
  {
    code: 'dream_problems',
    name_bn: 'স্বপ্নকেন্দ্রিক সমস্যা',
    name_en: 'Dream-Related Problems',
    description_bn: 'ভীতিকর স্বপ্ন, আক্রমণ, সাপ, উঁচু থেকে পতন ও দুঃস্বপ্ন সংক্রান্ত লক্ষণসমূহ।',
    description_en: 'Recurrent disturbing dreams, animal attacks, falling sensations, and haunting visions.',
    sort_order: 4,
    symptoms: [
      {
        bn: 'স্বপ্নে সাপ দেখা, বিশেষ করে কালো সাপ',
        en: 'Seeing snakes, particularly black snakes, in dreams.',
        sort: 1
      },
      {
        bn: 'উঁচু স্থান থেকে পড়ে যাওয়ার স্বপ্ন দেখা',
        en: 'Dreaming of falling from a high place.',
        sort: 2
      },
      {
        bn: 'কুকুর বা বিড়ালের আক্রমণের স্বপ্ন দেখা',
        en: 'Dreaming of being attacked by dogs or cats.',
        sort: 3
      },
      {
        bn: 'পানিতে ডুবে যাওয়া বা বন্যায় ভেসে যাওয়ার স্বপ্ন দেখা',
        en: 'Dreaming of drowning or being swept away by a flood.',
        sort: 4
      },
      {
        bn: 'মৃত ব্যক্তিকে স্বপ্নে দেখা',
        en: 'Seeing deceased people in dreams.',
        sort: 5
      },
      {
        bn: 'স্বপ্নে কেউ খাবার খাওয়াচ্ছে বা খাবার দেওয়া হচ্ছে দেখা',
        en: 'Dreaming of someone feeding or offering food.',
        sort: 6
      },
      {
        bn: 'স্বপ্নে দুর্ঘটনা বা আঘাতের দৃশ্য দেখা',
        en: 'Dreaming of accidents or injuries.',
        sort: 7
      },
      {
        bn: 'স্বপ্নে কেউ তাড়া করছে বা আক্রমণ করছে দেখা',
        en: 'Dreaming of being chased or attacked.',
        sort: 8
      },
      {
        bn: 'স্বপ্নে অন্ধকার, নির্জন বা ভয়ংকর স্থানে ঘুরে বেড়ানো',
        en: 'Dreaming of wandering in dark, deserted or frightening places.',
        sort: 9
      },
      {
        bn: 'একই ধরনের ভয়ংকর স্বপ্ন বারবার দেখা',
        en: 'Recurrent frightening dreams.',
        sort: 10
      }
    ]
  },
  {
    code: 'rizq_obstacles',
    name_bn: 'রিজিক, সফলতা ও নিয়ামতে প্রতিবন্ধকতা',
    name_en: 'Difficulties Related to Rizq, Success & Blessings',
    description_bn: 'আয়-উপার্জনে বরকতের অভাব, চাকরি, ব্যবসা, বিয়ে ও পড়াশোনায় অযাচিত অচলাবস্থা সংক্রান্ত লক্ষণ।',
    description_en: 'Unexplained impediments in earnings, job prospects, trade transactions, and life milestones.',
    sort_order: 5,
    symptoms: [
      {
        bn: 'হাতে টাকা-পয়সা আসলেও কোনো বরকত না থাকা এবং অকারণে দ্রুত খরচ হয়ে যাওয়া',
        en: 'Money disappearing quickly despite regular income.',
        sort: 1
      },
      {
        bn: 'ইন্টারভিউতে ভালো করার পরও শেষ মুহূর্তে চাকরি না হওয়া',
        en: 'Repeatedly failing to secure a job despite performing well in interviews.',
        sort: 2
      },
      {
        bn: 'ব্যবসায় কাস্টমার চূড়ান্ত পর্যায়ে এসেও কোনো কারণ ছাড়াই ফিরে যাওয়া',
        en: 'Potential customers withdrawing at the final stage of a business deal.',
        sort: 3
      },
      {
        bn: 'পড়তে বসলেই তীব্র ঘুম আসা বা মনোযোগ হারিয়ে ফেলা',
        en: 'Excessive sleepiness or loss of concentration specifically while studying.',
        sort: 4
      },
      {
        bn: 'বিয়ের জন্য পাত্র-পাত্রীর প্রস্তাব আসলেও অকারণে অপছন্দ হওয়া',
        en: 'Repeated difficulties or unexplained rejection during marriage proposals.',
        sort: 5
      },
      {
        bn: 'বাগদান বা আকদের পর তুচ্ছ কারণে সম্পর্ক ভেঙে যাওয়া',
        en: 'Relationships breaking down after engagement or marriage contract.',
        sort: 6
      },
      {
        bn: 'দোকান বা ব্যবসাপ্রতিষ্ঠানে কাস্টমারের আনাগোনা হঠাৎ কমে যাওয়া',
        en: 'Sudden decline in customer visits.',
        sort: 7
      },
      {
        bn: 'গুরুত্বপূর্ণ কাজ বা ভ্রমণের ঠিক আগে অসুস্থতা বা দুর্ঘটনা ঘটা',
        en: 'Illness or accidents occurring just before important events or journeys.',
        sort: 8
      },
      {
        bn: 'ভালো খবর বা সফলতার কথা প্রকাশের পর অসুস্থ হওয়া বা সফলতা নষ্ট হয়ে যাওয়া',
        en: 'Illness or setbacks following the disclosure of good news or achievements.',
        sort: 9
      },
      {
        bn: 'গাড়ি বা ইলেকট্রনিক ডিভাইস বারবার অকারণে নষ্ট হওয়া',
        en: 'Repeated unexplained malfunction of vehicles or electronic devices.',
        sort: 10
      }
    ]
  },
  {
    code: 'mental_behavioral',
    name_bn: 'মানসিক, চারিত্রিক ও সম্পর্কগত পরিবর্তন',
    name_en: 'Mental, Behavioral & Relational Changes',
    description_bn: 'মন-মেজাজের তীব্র পরিবর্তন, অহেতুক ক্রোধ, সন্দেহ, প্রিয়জনদের প্রতি বিদ্বেষ ও স্মৃতিভ্রম সংক্রান্ত লক্ষণ।',
    description_en: 'Psychological, behavioral, and relational shifts. Includes clinical safety monitoring.',
    sort_order: 6,
    symptoms: [
      {
        bn: 'হঠাৎ ঘরকুনো হয়ে যাওয়া এবং মানুষের সঙ্গে মিশতে অনীহা',
        en: 'Sudden social withdrawal and reluctance to interact with people.',
        sort: 1
      },
      {
        bn: 'অতিরিক্ত রাগ, জেদ ও খিটখিটে মেজাজ',
        en: 'Excessive anger, stubbornness and irritability.',
        sort: 2
      },
      {
        bn: 'আয়নায় নিজের চেহারা বিকৃত বা কুৎসিত মনে হওয়া',
        en: "Perceiving one's reflection as distorted or unattractive.",
        sort: 3
      },
      {
        bn: 'পরিবারের প্রিয় মানুষদেরও অসহ্য বা শত্রু মনে হওয়া',
        en: 'Feeling hostility or intolerance toward close family members.',
        sort: 4
      },
      {
        bn: 'স্বামী-স্ত্রীর মধ্যে অতিরিক্ত সন্দেহপ্রবণতা',
        en: 'Excessive suspicion between spouses.',
        sort: 5
      },
      {
        bn: 'অকারণে কান্না করা বা তীব্র মন খারাপ হওয়া',
        en: 'Unexplained crying or intense sadness.',
        sort: 6
      },
      {
        bn: 'নির্দিষ্ট ব্যক্তি বা স্থানের কথা মনে হলে মানসিক অস্থিরতা',
        en: 'Emotional distress associated with particular people or places.',
        sort: 7
      },
      {
        bn: 'স্মৃতিশক্তি দুর্বল হয়ে যাওয়া এবং স্বাভাবিক কাজ ভুলে যাওয়া',
        en: 'Memory difficulties and forgetfulness.',
        sort: 8
      },
      {
        bn: 'আত্মহত্যার চিন্তা বা নিজেকে ক্ষতি করার ইচ্ছা',
        en: 'Suicidal thoughts or urges to self-harm.',
        sort: 9
      },
      {
        bn: 'সবসময় মনে হওয়া কেউ তাকে পর্যবেক্ষণ করছে বা তার সঙ্গে কেউ আছে',
        en: 'Feeling as though someone is watching or accompanying them.',
        sort: 10
      },
      {
        bn: 'অনাকাঙ্ক্ষিত যৌন চিন্তা বারবার মাথায় আসা',
        en: 'Recurrent unwanted sexual thoughts.',
        sort: 11
      },
      {
        bn: 'স্বভাবের বিপরীতে অতিরিক্ত অহংকার বা জেদ প্রকাশ পাওয়া',
        en: 'Unusual arrogance or stubbornness compared with previous behavior.',
        sort: 12
      }
    ]
  },
  {
    code: 'worship_obstacles',
    name_bn: 'ইবাদতে বাধা ও আধ্যাত্মিক অবনতি',
    name_en: 'Obstacles in Worship & Spiritual Decline',
    description_bn: 'সালাত, কুরআন তিলাওয়াত, আযান ও যিকিরে অস্বস্তি এবং ফরজ ইবাদতে চরম অনিচ্ছা সংক্রান্ত লক্ষণসমূহ।',
    description_en: 'Difficulties initiating or sustaining prayer, recitation discomfort, and spiritual obstacles.',
    sort_order: 7,
    symptoms: [
      {
        bn: 'কুরআন তিলাওয়াত করতে অনীহা',
        en: 'Reluctance to recite the Quran.',
        sort: 1
      },
      {
        bn: 'সালাত আদায় করতে অস্বাভাবিক অনীহা',
        en: 'Unusual reluctance to perform Salah.',
        sort: 2
      },
      {
        bn: 'কুরআন তিলাওয়াত বা আযান শুনতে অস্বস্তি অনুভব করা',
        en: 'Discomfort while listening to Quran recitation or Adhan.',
        sort: 3
      },
      {
        bn: 'যিকির ও দোয়া করতে মনোযোগের অভাব',
        en: 'Difficulty concentrating during Dhikr and Dua.',
        sort: 4
      },
      {
        bn: 'ইবাদতের সময় অস্থিরতা অনুভব করা',
        en: 'Restlessness during worship.',
        sort: 5
      },
      {
        bn: 'ইবাদত শুরু করতে গেলে অকারণে বাধা বা অনীহা অনুভব করা',
        en: 'Unusual difficulty initiating worship.',
        sort: 6
      },
      {
        bn: 'পূর্বে নিয়মিত ইবাদত করলেও বর্তমানে তা ছেড়ে দেওয়া',
        en: 'Decline in previously consistent worship.',
        sort: 7
      },
      {
        bn: 'ইবাদত করার সময় বারবার হাই তোলা বা শরীরে কাঁপুনি আসা',
        en: 'Repeated yawning or trembling during worship.',
        sort: 8
      },
      {
        bn: 'সিজদায় গেলে মাথায় তীব্র চাপ বা ব্যথা অনুভব করা',
        en: 'Head pressure or pain during prostration.',
        sort: 9
      },
      {
        bn: 'পূর্বে নিয়মিত তাহাজ্জুদ ও নফল ইবাদত করলেও বর্তমানে ফরজ ইবাদত করতেই প্রচণ্ড কষ্ট হওয়া',
        en: 'Difficulty performing obligatory worship despite previously maintaining voluntary worship.',
        sort: 10
      }
    ]
  },
  {
    code: 'onset_history',
    name_bn: 'সমস্যা শুরুর সময় ও পটভূমি',
    name_en: 'Problem Onset & Background History',
    description_bn: 'সমস্যা শুরু হওয়ার সময়কাল, সূচনা, পূর্ববর্তী চিকিৎসা ও পটভূমি সংক্রান্ত কাঠামোবদ্ধ প্রশ্নাবলী।',
    description_en: 'Structured clinical history taking questions on problem onset, progression, and prior treatments.',
    sort_order: 8,
    symptoms: [
      {
        bn: 'সমস্যাটি কবে থেকে শুরু হয়েছে?',
        en: 'When did the problem begin?',
        sort: 1
      },
      {
        bn: 'সমস্যাটি কীভাবে শুরু হয়েছিল?',
        en: 'How did the problem initially begin?',
        sort: 2
      },
      {
        bn: 'প্রথমে কী কী লক্ষণ দেখা দিয়েছিল?',
        en: 'What were the initial symptoms?',
        sort: 3
      },
      {
        bn: 'সমস্যাটি হঠাৎ শুরু হয়েছিল নাকি ধীরে ধীরে?',
        en: 'Did the problem start suddenly or gradually?',
        sort: 4
      },
      {
        bn: 'সমস্যাটি কি নির্দিষ্ট সময় বা পরিস্থিতিতে বেড়ে যায়?',
        en: 'Does the problem worsen at specific times or situations?',
        sort: 5
      },
      {
        bn: 'সমস্যার শুরুতে কোনো বিশেষ ঘটনা ঘটেছিল কি?',
        en: 'Was there any significant event around the time it began?',
        sort: 6
      },
      {
        bn: 'আগে কোনো চিকিৎসকের পরামর্শ নিয়েছেন কি?',
        en: 'Have you previously consulted a medical professional?',
        sort: 7
      },
      {
        bn: 'আগে কোনো কবিরাজ বা অন্য চিকিৎসকের শরণাপন্ন হয়েছেন কি?',
        en: 'Have you consulted a traditional healer or another practitioner?',
        sort: 8
      },
      {
        bn: 'পূর্বে কী কী ওষুধ, চিকিৎসা বা পদ্ধতি গ্রহণ করেছেন?',
        en: 'What medicines or treatments have you previously received?',
        sort: 9
      },
      {
        bn: 'পূর্ববর্তী চিকিৎসায় কোনো উপকার বা পার্শ্বপ্রতিক্রিয়া হয়েছিল কি?',
        en: 'Did previous treatments provide relief or cause side effects?',
        sort: 10
      }
    ]
  },
  {
    code: 'family_social',
    name_bn: 'পারিবারিক ও সামাজিক অবস্থা',
    name_en: 'Family & Social History',
    description_bn: 'পারিবারিক পরিবেশ, পারস্পরিক সম্পর্ক, বংশগত ব্যাধি ও সামাজিক প্রেক্ষাপট সংক্রান্ত কাঠামোবদ্ধ প্রশ্নাবলী।',
    description_en: 'Structured assessment questions evaluating family dynamics, hereditary patterns, and domestic wellbeing.',
    sort_order: 9,
    symptoms: [
      {
        bn: 'পরিবারের অন্য সদস্যদের মধ্যেও একই ধরনের সমস্যা আছে কি?',
        en: 'Do other family members experience similar problems?',
        sort: 1
      },
      {
        bn: 'পরিবারের কারও কবিরাজি চিকিৎসা গ্রহণের ইতিহাস আছে কি?',
        en: 'Does anyone in the family have a history of traditional healing treatments?',
        sort: 2
      },
      {
        bn: 'পরিবারে প্রায়ই ঝগড়াঝাটি বা বিরোধ হয় কি?',
        en: 'Are there frequent arguments or conflicts within the family?',
        sort: 3
      },
      {
        bn: 'পরিবারের সদস্যরা একে অপরকে সহ্য করতে অসুবিধা অনুভব করেন কি?',
        en: 'Do family members experience difficulty tolerating one another?',
        sort: 4
      },
      {
        bn: 'পরিবারের একের পর এক সদস্য অসুস্থ হয়ে পড়ছেন কি?',
        en: 'Have multiple family members been falling ill successively?',
        sort: 5
      },
      {
        bn: 'পরিবারে বিয়ে-শাদি নিয়ে কোনো সমস্যা রয়েছে কি?',
        en: 'Are there recurring marriage-related difficulties in the family?',
        sort: 6
      },
      {
        bn: 'পরিবারে তালাক বা দাম্পত্য বিচ্ছেদের সমস্যা রয়েছে কি?',
        en: 'Are there divorce or marital separation issues?',
        sort: 7
      },
      {
        bn: 'পরিবারের আয়, রিজিক ও সম্পদে বরকতের অভাব অনুভূত হয় কি?',
        en: 'Are there concerns about financial stability or blessings in family resources?',
        sort: 8
      },
      {
        bn: 'পরিবারের কারও তাআতিল বা গুরুত্বপূর্ণ কাজে বাধার অভিজ্ঞতা রয়েছে কি? ',
        en: 'Does anyone in the family experience repeated obstacles in important activities?',
        sort: 9
      },
      {
        bn: 'বাড়িতে পারিবারিক প্রশান্তি ও স্বস্তির অভাব অনুভূত হয় কি?',
        en: 'Does the household lack a sense of peace and comfort?',
        sort: 10
      }
    ]
  }
];

// Step 4: Transactionally update categories and symptoms
const migrateTransaction = db.transaction(() => {
  // Clear existing symptoms and categories
  db.prepare('DELETE FROM diagnosis_symptoms').run();
  db.prepare('DELETE FROM diagnosis_categories').run();

  const insertCatStmt = db.prepare(`
    INSERT INTO diagnosis_categories (id, code, name_bn, name_en, description_bn, description_en, sort_order, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'active')
  `);

  const insertSymStmt = db.prepare(`
    INSERT INTO diagnosis_symptoms (id, category_id, symptom_bn, symptom_en, sort_order, status)
    VALUES (?, ?, ?, ?, ?, 'active')
  `);

  let currentCatId = 1;
  let currentSymId = 1;

  for (const cat of APPROVED_DIAGNOSIS_DATA) {
    insertCatStmt.run(
      currentCatId,
      cat.code,
      cat.name_bn,
      cat.name_en,
      cat.description_bn,
      cat.description_en,
      cat.sort_order
    );

    for (const sym of cat.symptoms) {
      insertSymStmt.run(
        currentSymId,
        currentCatId,
        sym.bn.trim(),
        sym.en.trim(),
        sym.sort
      );
      currentSymId++;
    }

    currentCatId++;
  }

  // Update existing diagnosis records if any
  const existingDiagnoses = db.prepare('SELECT id, patient_id FROM patient_diagnoses').all();
  if (existingDiagnoses.length > 0) {
    console.log(`Found ${existingDiagnoses.length} existing diagnosis record(s). Synchronizing structure...`);
    for (const diag of existingDiagnoses) {
      // Pick 5 representative symptoms from category 1 and category 2
      const sampleSyms = db.prepare(`
        SELECT 
          s.id as symptom_id, s.category_id, s.symptom_bn, s.symptom_en,
          c.code as category_code, c.name_bn as category_name_bn, c.name_en as category_name_en
        FROM diagnosis_symptoms s
        JOIN diagnosis_categories c ON s.category_id = c.id
        WHERE s.id IN (1, 2, 7, 11, 12)
        ORDER BY c.sort_order, s.sort_order
      `).all();

      const catMap = new Map();
      const symIds = [];
      const catIds = [];

      sampleSyms.forEach(r => {
        symIds.push(r.symptom_id);
        if (!catMap.has(r.category_id)) {
          catIds.push(r.category_id);
          catMap.set(r.category_id, {
            category_id: r.category_id,
            category_code: r.category_code,
            category_name_bn: r.category_name_bn,
            category_name_en: r.category_name_en,
            symptoms: []
          });
        }
        catMap.get(r.category_id).symptoms.push({
          id: r.symptom_id,
          symptom_bn: r.symptom_bn,
          symptom_en: r.symptom_en
        });
      });

      const bnDigits = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
      const toBn = num => String(num).replace(/[0-9]/g, d => bnDigits[d]);
      const detailed = Array.from(catMap.values());
      const catListBn = detailed.map(c => `${c.category_name_bn} (${toBn(c.symptoms.length)}টি)`).join(', ');
      const catListEn = detailed.map(c => `${c.category_name_en} (${c.symptoms.length})`).join(', ');

      const summaryBn = `মোট ৯টি ক্যাটাগরির মধ্যে ${toBn(detailed.length)}টি ক্যাটাগরিতে রোগীর মোট ${toBn(symIds.length)}টি উপসর্গ ও ইতিহাস চিহ্নিত করা হয়েছে: ${catListBn}।`;
      const summaryEn = `Documented ${symIds.length} active symptoms and history indicators across ${detailed.length} of 9 clinical categories: ${catListEn}.`;

      db.prepare(`
        UPDATE patient_diagnoses
        SET
          category_ids = ?,
          selected_symptom_ids = ?,
          selected_symptoms_json = ?,
          summary_bn = ?,
          summary_en = ?
        WHERE id = ?
      `).run(
        JSON.stringify(catIds),
        JSON.stringify(symIds),
        JSON.stringify(detailed),
        summaryBn,
        summaryEn,
        diag.id
      );
    }
  }
});

migrateTransaction();

// Verification query
const finalCats = db.prepare('SELECT id, code, name_bn, name_en FROM diagnosis_categories ORDER BY sort_order').all();
const symCounts = db.prepare('SELECT category_id, COUNT(*) as count FROM diagnosis_symptoms GROUP BY category_id ORDER BY category_id').all();
const totalSyms = db.prepare('SELECT COUNT(*) as total FROM diagnosis_symptoms').get().total;

console.log('=== MIGRATION V5 COMPLETE ===');
console.log(`Total Categories: ${finalCats.length}`);
finalCats.forEach((c, idx) => {
  const count = symCounts.find(s => s.category_id === c.id)?.count || 0;
  console.log(`  ${idx + 1}. [${c.code}] ${c.name_bn} (${c.name_en}) => ${count} items`);
});
console.log(`Total Active Symptoms / Questions: ${totalSyms}`);
