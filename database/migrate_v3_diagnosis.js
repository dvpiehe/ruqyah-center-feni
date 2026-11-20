/**
 * Migration Script V3:
 * 1. Creates `diagnosis_categories` table (id, code, name_bn, name_en, description_bn, description_en, sort_order, status, created_at)
 * 2. Creates `diagnosis_symptoms` table (id, category_id, symptom_bn, symptom_en, sort_order, status, created_at)
 * 3. Creates `patient_diagnoses` table (id, patient_id, appointment_id, session_id, category_ids, selected_symptom_ids, selected_symptoms_json, summary_bn, summary_en, notes, raqi_name, diagnosis_date, created_at, updated_at)
 * 4. Seeds exactly the 9 authentic Ruqyah & Spiritual Diagnosis categories
 * 5. Seeds exactly 10 symptoms per category (90 symptoms total)
 * 6. Completely idempotent so it can be safely re-run without duplicate entries
 */

const db = require('./db');

const DIAGNOSIS_DATA = [
  {
    code: 'jinn_mass',
    name_bn: 'মাসস / জ্বিনঘটিত সমস্যা',
    name_en: 'Jinn Possession & Demonic Touch (Mass)',
    description_bn: 'শরীরে জ্বিনের কুপ্রভাব, স্পর্শ বা দখল সংক্রান্ত শারীরিক ও আধ্যাত্মিক লক্ষণসমূহ।',
    description_en: 'Spiritual and physical manifestations of demonic touch or presence.',
    sort_order: 1,
    symptoms: [
      {
        bn: 'হঠাৎ শরীরের কোনো অঙ্গ অবশ, অনুভূতিহীন বা অচল অনুভূত হওয়া',
        en: 'Sudden numbness, loss of sensation, or localized paralysis in limbs',
        sort: 1
      },
      {
        bn: 'অনিচ্ছাকৃত শরীর কাঁপা, খিঁচুনি বা পেশীর অনিয়ন্ত্রিত নড়াচড়া',
        en: 'Involuntary tremors, spasms, or uncontrollable muscle twitching',
        sort: 2
      },
      {
        bn: 'কণ্ঠস্বর, বাচনভঙ্গি বা কথা বলার ধরনে অদ্ভুত ও আকস্মিক পরিবর্তন',
        en: 'Abrupt and eerie alteration in voice, speech pattern, or tone',
        sort: 3
      },
      {
        bn: 'চোখ লাল হওয়া এবং চাহনিতে হিংস্রতা ও অস্বাভাবিক ক্রোধ প্রকাশ পাওয়া',
        en: 'Reddening of the eyes accompanied by an uncharacteristically fierce gaze',
        sort: 4
      },
      {
        bn: 'বুকে বা কাঁধের ওপর প্রচণ্ড অদৃশ্য ভারী বোঝা চেপে থাকার অনুভূতি',
        en: 'Severe invisible weight or suffocating pressure on the chest or shoulders',
        sort: 5
      },
      {
        bn: 'আশেপাশে কেউ না থাকা সত্ত্বেও কারো উপস্থিতি বা চলাফেরার শব্দ টের পাওয়া',
        en: 'Feeling an unseen presence, phantom whispers, or following footsteps',
        sort: 6
      },
      {
        bn: 'কোনো যৌক্তিক কারণ ছাড়াই আকস্মিক তীব্র ভীতি ও প্যানিক অ্যাটাক হওয়া',
        en: 'Unprovoked extreme terror, irrational dread, and recurring panic attacks',
        sort: 7
      },
      {
        bn: 'নিজের ইচ্ছার বিরুদ্ধে অদ্ভুত শারীরিক অঙ্গভঙ্গি বা অঙ্গচালনা করা',
        en: 'Erratic physical movements or gestures occurring without conscious volition',
        sort: 8
      },
      {
        bn: 'আলো পরিহার করে অন্ধকার ও নির্জন স্থানে দীর্ঘক্ষণ একা বসে থাকার তীব্র টান',
        en: 'Compulsive urge to avoid bright light and sit isolated in pitch dark rooms',
        sort: 9
      },
      {
        bn: 'শরীরে বা কাপড়ে সাবান-সুগন্ধি ব্যবহারের পরও অদ্ভুত গন্ধের উদ্রেক হওয়া',
        en: 'Unexplained unpleasant or sulfurous odor emanating persistently from the body',
        sort: 10
      }
    ]
  },
  {
    code: 'sihr_magic',
    name_bn: 'সিহর / জাদু সংক্রান্ত লক্ষণ',
    name_en: 'Black Magic & Sorcery (Sihr)',
    description_bn: 'বিভিন্ন প্রকার কুফরি জাদু, জাদু খাওয়ানো, ছিটানো বা বন্ধ্যাত্ব/বিচ্ছেদ জাদুর লক্ষণ।',
    description_en: 'Manifestations of consumed, buried, or targeted sorcery and witchcraft.',
    sort_order: 2,
    symptoms: [
      {
        bn: 'দীর্ঘস্থায়ী পেটে তীব্র ব্যথা, জ্বালাপোড়া ও আধুনিক চিকিৎসায় রোগ নির্ণয় না হওয়া',
        en: 'Chronic burning abdominal pain that defies standard medical diagnostics',
        sort: 1
      },
      {
        bn: 'ঘনঘন বমি বমি ভাব অথবা হলুদ-সবুজাভ অম্লীয় জল ও ফেনাযুক্ত বমি হওয়া',
        en: 'Frequent nausea and recurrent vomiting of acidic yellowish-green bile',
        sort: 2
      },
      {
        bn: 'বিয়ে, পড়াশোনা বা ব্যবসায় সবকিছু ঠিক থাকা সত্ত্বেও শেষ মুহূর্তে আকস্মিক অচলাবস্থা',
        en: 'Repeated inexplicable deadlocks in marriage proposals, career, or education',
        sort: 3
      },
      {
        bn: 'কুরআন তিলাওয়াত বা রুকইয়াহ শুনলে দম আটকে আসা, তীব্র অস্থিরতা ও শ্বাসকষ্ট',
        en: 'Acute chest tightness, suffocation, and distress when hearing the Quran',
        sort: 4
      },
      {
        bn: 'শরীরে সুঁই বা কাঁটা ফোটার মতো তীব্র জ্বালা-যন্ত্রণা ও অস্থির অনুভূতি',
        en: 'Sensation of sharp pins, needles, or searing burns prickling the body',
        sort: 5
      },
      {
        bn: 'শরীরের এক অংশ থেকে অন্য অংশে চলমান বা স্থান পরিবর্তনকারী ব্যথা',
        en: 'Wandering bodily pain that continuously shifts locations across limbs',
        sort: 6
      },
      {
        bn: 'স্বপ্নে কবরস্থান, শ্মশান, ময়লা-আবর্জনা বা মৃত মানুষের সাথে চলাফেরা দেখা',
        en: 'Recurrent dreams of graveyards, sewage, carcasses, or interacting with the dead',
        sort: 7
      },
      {
        bn: 'মাথার ওপর অবিরাম ভারী লোহার টুপির মতো চাপ এবং সার্বক্ষণিক মানসিক বিহ্বলতা',
        en: 'Constant leaden pressure across the skull paired with disorienting brain fog',
        sort: 8
      },
      {
        bn: 'আচরণ ও মেজাজে প্রচণ্ড খিটখিটে ভাব এবং কারণ ছাড়াই পরিবারের ওপর মারমুখী হওয়া',
        en: 'Sudden explosive aggression and violent emotional outbursts against family',
        sort: 9
      },
      {
        bn: 'ঘরের কোণে বা আসবাবের আড়ালে রহস্যজনক তাবিজ, চুল, গিঁট বা অদ্ভুত দাগ পাওয়া',
        en: 'Discovering concealed knots, stitched talismans, mysterious hair, or stains in home',
        sort: 10
      }
    ]
  },
  {
    code: 'ayn_hasad',
    name_bn: 'আইন ও হাসাদ / বদনজর ও হিংসা',
    name_en: 'Evil Eye & Destructive Jealousy (Ayn & Hasad)',
    description_bn: 'মানুষ বা জ্বিনের কুদৃষ্টি ও ঈর্ষার কারণে স্বাস্থ্য, সৌন্দর্য ও সাফল্যের ক্ষতি।',
    description_en: 'Harm inflicted by malevolent gazes, envious admiration, or evil eye.',
    sort_order: 3,
    symptoms: [
      {
        bn: 'কুরআন তিলাওয়াত বা দুআ পাঠের সময় অবিরত হাই ওঠা ও চোখ দিয়ে অশ্রু ঝরা',
        en: 'Excessive compulsive yawning and spontaneous tearing during Quran recitation',
        sort: 1
      },
      {
        bn: 'ত্বক ও চেহারার স্বাভাবিক লাবণ্য ও উজ্জ্বলতা হঠাৎ ফ্যাকাশে, কালচে বা বিবর্ণ হয়ে যাওয়া',
        en: 'Sudden dullness, ashen pallor, or loss of natural facial radiance',
        sort: 2
      },
      {
        bn: 'পর্যাপ্ত বিশ্রামের পরও শরীর ভেঙে পড়া এবং সার্বক্ষণিক নিঃশেষিত ক্লান্তি লাগা',
        en: 'Debilitating lethargy and chronic drained energy despite adequate sleep',
        sort: 3
      },
      {
        bn: 'হঠাৎ কারণ ছাড়াই হৃৎস্পন্দন বেড়ে যাওয়া, বুক ধড়ফড় করা ও অজানা বুকচাপা ভয়',
        en: 'Sudden racing heartbeat, intense palpitations, and anxious sinking dread',
        sort: 4
      },
      {
        bn: 'মাথার পেছনে, ঘাড়ের রগ ও দুই কাঁধে প্রচণ্ড টান ধরা ও ভারী অনুভূতি থাকা',
        en: 'Tight constricting ache in occiput, nape of neck, and across both shoulder blades',
        sort: 5
      },
      {
        bn: 'মেধাবী ছাত্র বা সফল কর্মজীবীর পড়ালেখা ও কাজকর্মে আকস্মিক চরম অনীহা ও অকর্মণ্যতা',
        en: 'Sharp sudden plunge in motivation, focus, and performance at school or work',
        sort: 6
      },
      {
        bn: 'শরীরে কোনো আঘাত ছাড়াই হঠাৎ নীলচে, কালচে বা রক্তবর্ণ দাগ (Bruises) ফুটে ওঠা',
        en: 'Unexplained purplish or dark bruises surfacing on arms, thighs, or torso',
        sort: 7
      },
      {
        bn: 'অতিরিক্ত ঘুম হওয়া অথবা রাতভর চোখ বন্ধ করেও এক মুহূর্ত ঘুম না আসা',
        en: 'Excessive abnormal hypersomnia alternating with severe refractory insomnia',
        sort: 8
      },
      {
        bn: 'হাত ও পায়ের পাতা হঠাৎ বরফের মতো শীতল ও অসাড় হয়ে যাওয়া',
        en: 'Extremities abruptly turning icy cold, clammy, and uncomfortably numb',
        sort: 9
      },
      {
        bn: 'বাইরের মানুষের সঙ্গে দেখা হলে বা নিজের প্রশংসা শুনলেই অস্বস্তি ও মাথা ঘোরানো',
        en: 'Dizziness and claustrophobic discomfort when praised or in public social circles',
        sort: 10
      }
    ]
  },
  {
    code: 'waswas_doubts',
    name_bn: 'ওয়াসওয়াসা ও মানসিক অস্থিরতা',
    name_en: 'Waswas & Obsessive Doubts (Spiritual OCD)',
    description_bn: 'শয়তানি কুমন্ত্রণা, পবিত্রতা, নামাজ ও আকিদা সংক্রান্ত অনিচ্ছাকৃত মানসিক বিভ্রান্তি।',
    description_en: 'Whisperings, intrusive blasphemous thoughts, and ritual purification loops.',
    sort_order: 4,
    symptoms: [
      {
        bn: 'অযু, পবিত্রতা ও গোসল শুদ্ধ হয়েছে কিনা এ নিয়ে ঘণ্টার পর ঘণ্টা সময় অপচয় করা',
        en: 'Spending agonizing excessive time in repetitive Wudu and obsessive purification',
        sort: 1
      },
      {
        bn: 'নামাজে কত রাকাত পড়া হলো তা নিয়ে অবিরাম সংশয় এবং বারবার নামাজ শুরু করা',
        en: 'Perpetual uncertainty over Rak\'ah count leading to chronic prayer restarts',
        sort: 2
      },
      {
        bn: 'নিজের অনিচ্ছায় আল্লাহ, কুরআন ও রাসুল (সাঃ) সম্পর্কে কষ্টদায়ক কুচিন্তা আসা',
        en: 'Involuntary tormenting intrusive blasphemous whispers against sacred tenets',
        sort: 3
      },
      {
        bn: 'নামাজ বা আমলের নিয়ত ঠিকমতো অন্তরে এসেছে কিনা তা নিয়ে তীব্র মানসিক যন্ত্রণা',
        en: 'Crippling inner turmoil over whether intentions (Niyyah) were pure and valid',
        sort: 4
      },
      {
        bn: 'শরীরে বা পোশাকে অপবিত্রতা লেগে রয়েছে এমন কাল্পনিক সন্দেহে বারবার কাপড় বদলানো',
        en: 'Baseless obsessive conviction of physical impurity prompting compulsive washings',
        sort: 5
      },
      {
        bn: 'পরিবার, সন্তান বা নিজের ওপর অচিরেই মহাবিপদ নেমে আসবে এমন অমূলক চরম শঙ্কা',
        en: 'Irrational persistent catastrophizing that severe tragedy will strike loved ones',
        sort: 6
      },
      {
        bn: 'মুখে কোনো কথা ফসকে গিয়ে তালাক বা কুফরি বাক্য হয়ে গেল কিনা এমন অযৌক্তিক ভয়',
        en: 'Persistent obsessive paranoia regarding accidental utterances of divorce or oaths',
        sort: 7
      },
      {
        bn: 'দরজার তালা, চুলা বা জিনিসপত্র বারবার ঘুরে ঘুরে পরীক্ষা করার মানসিক বাধ্যবাধকতা',
        en: 'Compulsive urges to repeatedly verify door locks, switches, and household items',
        sort: 8
      },
      {
        bn: 'অন্তরের গভীরে স্থায়ী একাকিত্ব, শূন্যতা ও আশাহীন হতাশার অনুভূতি বাসা বাঁধা',
        en: 'Deep-seated chronic existential hollowness, inner alienation, and bleak despair',
        sort: 9
      },
      {
        bn: 'যেকোনো ভালো আমল বা তওবা করতে গেলেই মাথায় তীব্র দ্বিধাদ্বন্দ্ব ও পিছুটান তৈরি হওয়া',
        en: 'Acute cognitive paralysis and hesitation whenever intending good deeds or Tawbah',
        sort: 10
      }
    ]
  },
  {
    code: 'sleep_terrors',
    name_bn: 'ঘুম ও দুঃস্বপ্ন সংক্রান্ত ব্যাধি',
    name_en: 'Sleep Disturbances & Night Terrors',
    description_bn: 'বোবায় ধরা, আক্রমণাত্মক জন্তু-জানোয়ারের স্বপ্ন, নিদ্রাহীনতা ও রাতের আতঙ্ক।',
    description_en: 'Sleep paralysis, predatory nightmares, night terrors, and fractured sleep.',
    sort_order: 5,
    symptoms: [
      {
        bn: 'বোবায় ধরা বা স্লিপ প্যারালাইসিস: জাগ্রত অবস্থায়ও নড়াচড়া ও চিৎকার করতে না পারা',
        en: 'Sleep paralysis (Kabus): feeling fully conscious yet completely immobilized and mute',
        sort: 1
      },
      {
        bn: 'কালো কুকুর, বিষাক্ত সাপ, কাঁকড়াবিছা বা হিংস্র পশুর আক্রমণের ভীতিকর স্বপ্ন দেখা',
        en: 'Nightmares of attacking black hounds, vipers, scorpions, or charging predators',
        sort: 2
      },
      {
        bn: 'স্বপ্নে উঁচু পাহাড়, ছাদ বা আকাশ থেকে গভীর অতল খাদে পড়ে যাওয়ার অনুভূতি',
        en: 'Recurrent sensations of violently falling from high towers or cliffs into voids',
        sort: 3
      },
      {
        bn: 'স্বপ্নে পানির খরস্রোতে ডুবে যাওয়া, সাগরে ভেসে যাওয়া বা আগুনে আটকা পড়ার দৃশ্য',
        en: 'Distressing dreams of drowning in raging floods, tidal waves, or trapped in fires',
        sort: 4
      },
      {
        bn: 'ঘুমের মধ্যে সজোরে দাঁত কিড়মিড় করা, গোঙানো, আর্তনাদ বা কান্নাকাটি করা',
        en: 'Loud teeth grinding (bruxism), groaning, moaning, or weeping in deep sleep',
        sort: 5
      },
      {
        bn: 'ঘুমন্ত অবস্থায় হঠাৎ ভীষণ চমকে ওঠা, বুক ধড়ফড় করে চোখ খুলে যাওয়া ও ভয় পাওয়া',
        en: 'Sudden violent jolting awake accompanied by tachycardia and gasping fright',
        sort: 6
      },
      {
        bn: 'অস্বাভাবিক ঘনঘন কামোদ্দীপক ও ভীতিপ্রদ স্বপ্ন এবং স্বপ্নদোষের আধিক্য থাকা',
        en: 'Excessive erotic nocturnal dreams involving unseen entities and frequent wet dreams',
        sort: 7
      },
      {
        bn: 'রাতভর বিছানায় ছটফট করা এবং ফজরের সময় চরম অবসাদগ্রস্ত ও বিধ্বস্ত হয়ে ওঠা',
        en: 'Restless tossing and turning all night, waking completely unrefreshed and battered',
        sort: 8
      },
      {
        bn: 'ঘুমের ঘোরে বিছানা ছেড়ে হাঁটা (Sleepwalking) বা অস্পষ্ট ও অর্থহীন কথা বলা',
        en: 'Sleepwalking (somnambulism) or muttering erratic words while entirely unconscious',
        sort: 9
      },
      {
        bn: 'বিছানায় শুতে গেলেই হাত-পায়ে অদৃশ্য পোকা বা পিঁপড়া হাঁটার মতো অস্বস্তিকর অনুভূতি',
        en: 'Crawling, tingling sensation like ants creeping over skin when trying to sleep',
        sort: 10
      }
    ]
  },
  {
    code: 'somatic_physical',
    name_bn: 'অব্যক্ত শারীরিক ও জৈবিক লক্ষণ',
    name_en: 'Unexplained Somatic & Physical Ailments',
    description_bn: 'সকল মেডিকেল টেস্ট স্বাভাবিক থাকা সত্ত্বেও দীর্ঘস্থায়ী শারীরিক ভোগান্তি।',
    description_en: 'Chronic physical complaints with normal lab and clinical investigations.',
    sort_order: 6,
    symptoms: [
      {
        bn: 'আধুনিক সমস্ত প্যাথলজি ও রেডিওলজি টেস্ট স্বাভাবিক অথচ রোগী তীব্র অসুস্থ ও শয্যাশায়ী',
        en: 'All pathological tests completely normal yet patient is severely incapacitated',
        sort: 1
      },
      {
        bn: 'প্রচলিত ব্যথানাশক ওষুধে কোনো উপশম না হওয়া একপেশে বা মাথার পেছন অংশের মাইগ্রেন',
        en: 'Severe persistent hemicrania or occipital migraines completely immune to analgesics',
        sort: 2
      },
      {
        bn: 'মেরুদণ্ডের নিচের অংশ ও কোমরে স্থায়ী তীব্র চিনচিনে ব্যথা যা কোনো আঘাতে হয়নি',
        en: 'Chronic deep aching in the lumbar spine and lower back devoid of physical trauma',
        sort: 3
      },
      {
        bn: 'কোনো সংক্রমণ বা পরিপাকতন্ত্রের ত্রুটি ছাড়াই পেট অস্বাভাবিক ফুলে থাকা ও গ্যাস্ট্রিক',
        en: 'Severe gastrointestinal bloating and abdominal distension without medical cause',
        sort: 4
      },
      {
        bn: 'মহিলাদের ক্ষেত্রে ঋতুস্রাবের চরম অনিয়ম, মাত্রাতিরিক্ত রক্তপাত বা তলপেটে দীর্ঘস্থায়ী ব্যথা',
        en: 'Severe menstrual dysregulation, menorrhagia, or chronic unyielding pelvic cramps',
        sort: 5
      },
      {
        bn: 'চোখের চারিপাশে স্থায়ী কালচে দাগ, চোখের দৃষ্টি ঝাপসা হওয়া ও চোখের সামনে মাছি ওড়া',
        en: 'Chronic dark periorbital hollows, blurred sight, or phantom floaters before eyes',
        sort: 6
      },
      {
        bn: 'গলায় কিছু আটকে থাকার অনুভূতি (Globus) ও খাবার গিলতে তীব্র অস্বস্তি ও বাধার ভাব',
        en: 'Constant sensation of a lump in the throat (globus) and dysphagic obstruction',
        sort: 7
      },
      {
        bn: 'কানের ভেতরে সার্বক্ষণিক ভোঁ-ভোঁ, ঘণ্টার ধ্বনি বা উচ্চ তীক্ষ্ণ শিষের মতো আওয়াজ শোনা',
        en: 'Unremitting tinnitus, phantom buzzing, or piercing whistles inside the ears',
        sort: 8
      },
      {
        bn: 'হাত ও পায়ের তালু থেকে অবিরত মাত্রাতিরিক্ত ঘাম ঝরা অথবা আগুনের মতো তীব্র জ্বালাপোড়া',
        en: 'Profuse sweating or burning heat flaring persistently in the palms and soles',
        sort: 9
      },
      {
        bn: 'খাদ্যাভ্যাস অপরিবর্তিত থাকা সত্ত্বেও দ্রুত ওজন হ্রাস পাওয়া অথবা শরীর আকস্মিক ফোলা',
        en: 'Rapid unexplainable weight loss or sudden bodily puffiness and edema',
        sort: 10
      }
    ]
  },
  {
    code: 'worship_aversion',
    name_bn: 'ইবাদত ও দ্বীনি আমল বিমুখতা',
    name_en: 'Aversion to Worship & Quranic Recitation',
    description_bn: 'নামাজ, আযান, জিকির ও কুরআনের তিলাওয়াতের প্রতি অন্তরে অনীহা, বিরক্তি বা বাধা।',
    description_en: 'Spiritual heaviness, irritation, or obstruction when engaging in worship.',
    sort_order: 7,
    symptoms: [
      {
        bn: 'মসজিদের আযানের আওয়াজ কানে এলে অন্তরে তীব্র অস্বস্তি, বিরক্তি বা রাগ জন্ম নেওয়া',
        en: 'Visceral annoyance, agitation, or rage triggered upon hearing the Adhan',
        sort: 1
      },
      {
        bn: 'কুরআন তিলাওয়াত শুনলে মেজাজ বিগড়ে যাওয়া, কান্না পাওয়া বা স্থান ত্যাগ করার তাগিদ',
        en: 'Sudden restlessness, weeping, or impulse to escape whenever the Quran is recited',
        sort: 2
      },
      {
        bn: 'নামাজে দাঁড়ানোর সাথে সাথেই তীব্র তন্দ্রাচ্ছন্নতা, ক্লান্তিবোধ ও শরীর ভারি হয়ে পড়া',
        en: 'Crushing lethargy, heaviness, and uncontrollable drowsiness the moment Salah begins',
        sort: 3
      },
      {
        bn: 'কুরআন স্পর্শ করতে গেলে বা পড়তে বসলে হাত-পা অবশ হওয়া ও পৃষ্ঠা বন্ধ করার ইচ্ছা',
        en: 'Numbness in hands and aversion to holding or reading from the Mushaf',
        sort: 4
      },
      {
        bn: 'জিকির বা দুআ করার সময় অনবরত হাই ওঠা, মুখ হাঁ হয়ে থাকা ও জিহ্বা জড়িয়ে যাওয়া',
        en: 'Non-stop yawning, jaw stiffness, and sluggish tongue while reciting Dhikr or Dua',
        sort: 5
      },
      {
        bn: 'মসজিদ, দ্বীনি মাহফিল বা পরহেজগার নেককার ব্যক্তিদের সান্নিধ্য ইচ্ছাকৃতভাবে এড়িয়ে চলা',
        en: 'Conscious avoidance of congregational mosques, Islamic circles, and pious people',
        sort: 6
      },
      {
        bn: 'ঘরে সূরা আল-বাকারা তিলাওয়াত চালালে ঘরে তীব্র দমবন্ধ পরিবেশ ও অশান্তি বোধ করা',
        en: 'Severe domestic claustrophobia and agitation whenever Surah Al-Baqarah is played',
        sort: 7
      },
      {
        bn: 'নামাজে সেজদায় গেলে মাথা ঘুরে যাওয়া, অন্ধকার দেখা বা জ্ঞান হারানোর উপক্রম হওয়া',
        en: 'Severe dizziness, head rush, or near-syncope sensations when descending into Sujud',
        sort: 8
      },
      {
        bn: 'গুনাহের কাজ, অশ্লীলতা বা হারাম বস্তুর প্রতি অন্তরে অনিয়ন্ত্রিত ও প্রবল আসক্তি জন্ম নেওয়া',
        en: 'Intense compulsive urges drawing toward sins, obscenity, and prohibited actions',
        sort: 9
      },
      {
        bn: 'ইসলামিক ও দ্বীনি আলোচনার কথা ওঠামাত্রই অহেতুক কড়া তর্ক ও অবাধ্যতামূলক প্রতিক্রিয়া',
        en: 'Belligerent skepticism, argumentation, and hostility during any Islamic discussion',
        sort: 10
      }
    ]
  },
  {
    code: 'marital_family',
    name_bn: 'পারিবারিক ও বৈবাহিক অশান্তি',
    name_en: 'Marital Discord & Family Affliction',
    description_bn: 'দাম্পত্য সম্পর্কে অহেতুক ঘৃণা, বিচ্ছেদ প্রবণতা, ঘরে কলহ ও অস্বাভাবিক শত্রুতা।',
    description_en: 'Inexplicable marital hatred, sexual blockages, and domestic chaos.',
    sort_order: 8,
    symptoms: [
      {
        bn: 'কোনো বাস্তব কারণ ছাড়াই স্বামী-স্ত্রীর পরস্পরের প্রতি হঠাৎ তীব্র ঘৃণা ও বিরক্তি জন্ম নেওয়া',
        en: 'Inexplicable mutual revulsion and disdain erupting between married partners',
        sort: 1
      },
      {
        bn: 'বাইরে মন মেজাজ প্রফুল্ল থাকলেও নিজ ঘরে পা রাখামাত্রই মন বিষাদগ্রস্ত ও খিটখিটে হওয়া',
        en: 'Feeling cheerful outdoors but instantly depressed and irritable upon entering home',
        sort: 2
      },
      {
        bn: 'অতি সামান্য বা তুচ্ছ বিষয়কে কেন্দ্র করে তুলকালাম ঝগড়া, ভাঙচুর ও চিৎকার-চেঁচামেচি',
        en: 'Disproportionate explosive screaming, domestic destruction, and fighting over trifles',
        sort: 3
      },
      {
        bn: 'জীবনসঙ্গীর চেহারাকে কুৎসিত, ভীতিকর, বিকৃত বা অপ্রীতিকর মনে হওয়া',
        en: 'Perceiving the partner\'s face as repulsive, frightening, or horribly distorted',
        sort: 4
      },
      {
        bn: 'বৈবাহিক শারীরিক মিলনের প্রতি অনীহা অথবা মিলনের চেষ্টাকালে তীব্র ব্যথা ও শারীরিক বাধা',
        en: 'Total aversion to intimacy, or acute physical pain and vaginismus-like blockage',
        sort: 5
      },
      {
        bn: 'জীবনসঙ্গীর বিরুদ্ধে পরকীয়া বা প্রতারণার অমূলক সন্দেহ ও সার্বক্ষণিক মানসিক অবিশ্বাস',
        en: 'Groundless delusional suspicions and obsessive accusations of marital infidelity',
        sort: 6
      },
      {
        bn: 'বিয়ের কথাবার্তা পাকাপাকি হওয়ার মুখে কোনো যৌক্তিক কারণ ছাড়াই বারবার সম্বন্ধ ভেঙে যাওয়া',
        en: 'Marriage proposals persistently falling apart at the final stage for trivial causes',
        sort: 7
      },
      {
        bn: 'কোমলমতি নিষ্পাপ সন্তানদের প্রতি মাত্রাতিরিক্ত কঠোরতা, ক্রোধ ও নির্মম মারমুখী হওয়া',
        en: 'Irrational outbursts of rage, verbal cruelty, and harshness towards one\'s children',
        sort: 8
      },
      {
        bn: 'একই ছাদের নিচে বাস করেও পরিবারের সদস্যদের মধ্যে দীর্ঘ নীরবতা ও স্থায়ী দূরত্বের দেয়াল',
        en: 'Chilling silence, bitter estrangement, and cold distance between family members',
        sort: 9
      },
      {
        bn: 'ঘরে প্রশান্তি ও শান্তির ছায়ামাত্র না থাকা এবং প্রতিনিয়ত শোক ও উত্তেজনার আবহ বিরাজ করা',
        en: 'Total absence of peace (Sakinah), replaced by pervasive grief, gloom, and friction',
        sort: 10
      }
    ]
  },
  {
    code: 'financial_blockage',
    name_bn: 'রিজিক, কর্মক্ষেত্র ও বরকতের অচলাবস্থা',
    name_en: 'Blockage in Livelihood, Career & Barakah',
    description_bn: 'অর্থনৈতিক ক্ষতি, উপার্জনে বরকতহীনতা, কাজের প্রতি জড়তা ও রহস্যজনক লোকসান।',
    description_en: 'Severe economic blockage, loss of business fortune, and vanished blessings.',
    sort_order: 9,
    symptoms: [
      {
        bn: 'চাকরি বা বড় ব্যবসায়িক চুক্তির চূড়ান্ত পর্যায়ে পৌঁছে অপ্রত্যাশিতভাবে হাতছাড়া হয়ে যাওয়া',
        en: 'Lucrative career appointments or contracts abruptly collapsing at final signatures',
        sort: 1
      },
      {
        bn: 'উপার্জন হওয়া সত্ত্বেও বরকত শূন্য থাকা এবং অর্থ আসার সাথে সাথেই রহস্যজনকভাবে ফুরিয়ে যাওয়া',
        en: 'Total lack of Barakah; substantial income vanishing into thin air with zero savings',
        sort: 1
      },
      {
        bn: 'কর্মস্থলে গিয়ে কোনো কাজে মন বসাতে না পারা এবং পরিচিত সাধারণ বিষয়েও জটিল ভুল করা',
        en: 'Severe brain fog and catastrophic blunders at work in routine, familiar tasks',
        sort: 3
      },
      {
        bn: 'বিশ্বস্ত গ্রাহক ও দীর্ঘদিনের ব্যবসায়িক অংশীদারদের বিনা কারণে একযোগে সরে যাওয়া',
        en: 'Longstanding clients and partners suddenly severing ties without any dispute',
        sort: 4
      },
      {
        bn: 'হঠাৎ করে রমরমা ব্যবসায় চরম ধস নামা এবং বিক্রয় আশ্চর্যজনকভাবে বন্ধ হয়ে যাওয়া',
        en: 'Abrupt catastrophic plunge in shop footfall and commercial sales overnight',
        sort: 5
      },
      {
        bn: 'টাকা-পয়সা বা মূল্যবান অলঙ্কার আলমারিতে তালাবদ্ধ থাকা সত্ত্বেও রহস্যজনকভাবে উধাও হওয়া',
        en: 'Locked cash or precious jewelry vanishing mysteriously from secure wardrobes',
        sort: 6
      },
      {
        bn: 'সামনে নিশ্চিত কাজের সুযোগ থাকা সত্ত্বেও অদ্ভুত আলসেমি ও বিছানা ছাড়তে তীব্র বাধা',
        en: 'Crippling paralysis of will, unable to leave bed despite golden business opportunities',
        sort: 7
      },
      {
        bn: 'অফিস বা দোকানে প্রবেশ করামাত্রই বুকে প্রচণ্ড চাপ, বিষাদ ও সেখান থেকে পালিয়ে আসার অনুভূতি',
        en: 'Acute chest tightness, suffocating depression, and urge to flee the workplace',
        sort: 8
      },
      {
        bn: 'যেকোনো আর্থিক অংশীদারিত্বে প্রতারিত হওয়া এবং দেনা-পাওনা নিয়ে চরম আইনি জটিলতা',
        en: 'Invariable betrayal in partnerships leading to crushing disputes and liabilities',
        sort: 9
      },
      {
        bn: 'নতুন কোনো প্রকল্প বা ব্যবসা শুরু করলেই অপ্রত্যাশিত দুর্যোগ এসে আর্থিক ক্ষতি সাধন করা',
        en: 'Freak calamities and accidents repeatedly striking whenever initiating new ventures',
        sort: 10
      }
    ]
  }
];

function runMigration() {
  console.log('Running Database Migration V3 (Diagnosis Categories & Symptoms)...');

  // 1. Create diagnosis_categories table
  db.exec(`
    CREATE TABLE IF NOT EXISTS diagnosis_categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      name_bn TEXT NOT NULL,
      name_en TEXT NOT NULL,
      description_bn TEXT,
      description_en TEXT,
      sort_order INTEGER DEFAULT 0,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('Verified table: diagnosis_categories');

  // 2. Create diagnosis_symptoms table
  db.exec(`
    CREATE TABLE IF NOT EXISTS diagnosis_symptoms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER NOT NULL REFERENCES diagnosis_categories(id) ON DELETE CASCADE,
      symptom_bn TEXT NOT NULL,
      symptom_en TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('Verified table: diagnosis_symptoms');

  // 3. Create patient_diagnoses table
  db.exec(`
    CREATE TABLE IF NOT EXISTS patient_diagnoses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id TEXT NOT NULL REFERENCES patients(patient_id) ON DELETE CASCADE,
      appointment_id INTEGER REFERENCES appointments(id),
      session_id INTEGER REFERENCES ruqyah_sessions(id),
      category_ids TEXT,
      selected_symptom_ids TEXT,
      selected_symptoms_json TEXT,
      summary_bn TEXT,
      summary_en TEXT,
      notes TEXT,
      raqi_name TEXT DEFAULT 'মুহাম্মদুল্লাহ মিয়াহ',
      diagnosis_date DATE DEFAULT (DATE('now')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('Verified table: patient_diagnoses');

  // 4. Seed Categories and Symptoms
  const insertCatStmt = db.prepare(`
    INSERT INTO diagnosis_categories (code, name_bn, name_en, description_bn, description_en, sort_order, status)
    VALUES (?, ?, ?, ?, ?, ?, 'active')
  `);
  const updateCatStmt = db.prepare(`
    UPDATE diagnosis_categories
    SET name_bn = ?, name_en = ?, description_bn = ?, description_en = ?, sort_order = ?, status = 'active'
    WHERE code = ?
  `);
  const findCatStmt = db.prepare(`SELECT id FROM diagnosis_categories WHERE code = ?`);

  const insertSymStmt = db.prepare(`
    INSERT INTO diagnosis_symptoms (category_id, symptom_bn, symptom_en, sort_order, status)
    VALUES (?, ?, ?, ?, 'active')
  `);
  const deleteSymsForCatStmt = db.prepare(`
    DELETE FROM diagnosis_symptoms WHERE category_id = ?
  `);

  const tx = db.transaction(() => {
    let catCount = 0;
    let symCount = 0;

    for (const cat of DIAGNOSIS_DATA) {
      let existingCat = findCatStmt.get(cat.code);
      let catId;

      if (!existingCat) {
        const info = insertCatStmt.run(cat.code, cat.name_bn, cat.name_en, cat.description_bn, cat.description_en, cat.sort_order);
        catId = info.lastInsertRowid;
      } else {
        catId = existingCat.id;
        updateCatStmt.run(cat.name_bn, cat.name_en, cat.description_bn, cat.description_en, cat.sort_order, cat.code);
      }
      catCount++;

      // Refresh symptoms for this category to ensure exactly 10 active symptoms
      deleteSymsForCatStmt.run(catId);

      for (const s of cat.symptoms) {
        insertSymStmt.run(catId, s.bn, s.en, s.sort);
        symCount++;
      }
    }

    return { catCount, symCount };
  });

  const res = tx();
  console.log(`Seeded ${res.catCount} categories and exactly ${res.symCount} symptoms into the database.`);

  // Verify counts in DB
  const totalCats = db.prepare("SELECT count(*) as count FROM diagnosis_categories WHERE status = 'active'").get().count;
  const totalSyms = db.prepare("SELECT count(*) as count FROM diagnosis_symptoms WHERE status = 'active'").get().count;
  console.log(`VERIFICATION: Active Categories in DB: ${totalCats} (Target: 9)`);
  console.log(`VERIFICATION: Active Symptoms in DB: ${totalSyms} (Target: 90)`);

  const breakdown = db.prepare(`
    SELECT c.name_bn, c.code, count(s.id) as sym_count 
    FROM diagnosis_categories c 
    LEFT JOIN diagnosis_symptoms s ON c.id = s.category_id AND s.status = 'active'
    GROUP BY c.id
    ORDER BY c.sort_order
  `).all();

  console.log('Category Breakdown:');
  breakdown.forEach((b, idx) => {
    console.log(`  ${idx + 1}. [${b.code}] ${b.name_bn} => ${b.sym_count} symptoms`);
  });
}

if (require.main === module) {
  runMigration();
}

module.exports = { runMigration, DIAGNOSIS_DATA };
