const db = require('./db');

console.log('Running Migration v4: Articles, Case Studies, and Clinic Logo Settings...');

// 1. Add logo_url column to clinic_settings if not exists
const tableInfo = db.prepare("PRAGMA table_info(clinic_settings)").all();
const hasLogoUrl = tableInfo.some(col => col.name === 'logo_url');
if (!hasLogoUrl) {
  db.prepare("ALTER TABLE clinic_settings ADD COLUMN logo_url TEXT DEFAULT '/images/logo.png'").run();
  console.log('Added logo_url column to clinic_settings table.');
}

// 2. Create articles table
db.exec(`
  CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title_bn TEXT NOT NULL,
    title_en TEXT NOT NULL,
    slug_bn TEXT NOT NULL UNIQUE,
    slug_en TEXT NOT NULL UNIQUE,
    category_bn TEXT DEFAULT 'কেস স্টাডি ও আরোগ্য বিবরণ',
    category_en TEXT DEFAULT 'Case Study & Healing Record',
    excerpt_bn TEXT NOT NULL,
    excerpt_en TEXT NOT NULL,
    content_bn TEXT NOT NULL,
    content_en TEXT NOT NULL,
    featured_image TEXT DEFAULT '/images/articles/default-case.jpg',
    status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published')),
    author_name TEXT DEFAULT 'মুহাম্মদুল্লাহ মিয়াহ (Muhammadullah Miah)',
    published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
  CREATE INDEX IF NOT EXISTS idx_articles_slug_bn ON articles(slug_bn);
  CREATE INDEX IF NOT EXISTS idx_articles_slug_en ON articles(slug_en);
`);

console.log('Articles table verified/created.');

// 3. Seed educational anonymized case studies if empty
const count = db.prepare('SELECT COUNT(*) as count FROM articles').get().count;

if (count === 0) {
  const insertStmt = db.prepare(`
    INSERT INTO articles (
      title_bn, title_en, slug_bn, slug_en, category_bn, category_en,
      excerpt_bn, excerpt_en, content_bn, content_en, featured_image,
      status, author_name, published_at
    ) VALUES (
      @title_bn, @title_en, @slug_bn, @slug_en, @category_bn, @category_en,
      @excerpt_bn, @excerpt_en, @content_bn, @content_en, @featured_image,
      @status, @author_name, CURRENT_TIMESTAMP
    )
  `);

  const cases = [
    {
      title_bn: 'কেস স্টাডি ০১: পেটের তীব্র দীর্ঘস্থায়ী সমস্যা ও সিহরের প্রভাব থেকে আরোগ্য লাভের বিবরণ',
      title_en: 'Case Study 01: Recovery from Chronic Stomach Distress and Ingested Sihr via Shariah Ruqyah',
      slug_bn: 'case-01-stomach-sihr-recovery',
      slug_en: 'case-01-stomach-sihr-recovery-en',
      category_bn: 'সিহর ও রুকইয়াহ চিকিৎসা',
      category_en: 'Sihr & Ruqyah Treatment',
      excerpt_bn: '৩২ বছর বয়সী এক ভাই দীর্ঘ ৩ বছর ধরে পেটের তীব্র জ্বালাপোড়া ও বমি ভাব নিয়ে বহু মেডিকেল বিশেষজ্ঞ দেখানোর পরও রোগ নির্ণয় হয়নি। রুকইয়াহ ডায়াগনোসিসে সিহরুল মাকুল (খাওয়ানো যাদু) শনাক্ত হওয়ার পর ৩টি সেশনে আল্লাহর অনুগ্রহে পূর্ণ সুস্থতা লাভ করেন।',
      excerpt_en: 'A 32-year-old male suffered from severe unexplainable abdominal burning, nausea, and weight loss for 3 years despite comprehensive medical checkups. Upon Shariah diagnosis, ingested Sihr was confirmed, and by Allah\'s mercy, full recovery was attained after 3 clinical Ruqyah sessions.',
      content_bn: `
### রোগীর সংক্ষিপ্ত পটভূমি ও প্রাথমিক উপস্থাপন
* **বয়স ও পরিচয়:** ৩২ বছর বয়সী পুরুষ, বেসরকারি চাকরিজীবী (রোগীর গোপনীয়তা রক্ষার্থে পরিচয় অজ্ঞাত রাখা হয়েছে)।
* **প্রধান অভিযোগ:** দীর্ঘ ৩ বছর ধরে তলপেট ও পাকস্থলীতে তীব্র জ্বালাপোড়া, খাওয়ার পর ক্রমাগত বমি বমি ভাব, ওজন হ্রাস এবং রাতের বেলা হঠাৎ শ্বাসকষ্ট।
* **পূর্ববর্তী চিকিৎসা ইতিহাস:** দেশের শীর্ষস্থানীয় গ্যাস্ট্রোএন্টারোলজি বিশেষজ্ঞগণের তত্ত্বাবধানে একাধিক এন্ডোস্কোপি, আল্ট্রাসনোগ্রাম ও রক্ত পরীক্ষা সম্পন্ন হয়েছে; কিন্তু ক্লিনিক্যালি কোনো আলসার বা বড় ধরনের শারীরিক অসংগতি ধরা পড়েনি।

---

### শারঈ ডায়াগনোসিস ও প্রাথমিক পর্যবেক্ষণ
ফেনী শাখায় প্রাথমিক ডায়াগনোসিসের সময় রুকইয়াহর বিশেষ আয়াতসমূহ (সূরা আল-আ'রাফ ১১৭-১২২, সূরা ইউনুস ৮১-৮২, সূরা ত্ব-হা ৬৯) তিলাওয়াতকালে রোগীর মধ্যে নিম্নোক্ত আলামত প্রকাশ পায়:
1. পেট শক্ত হয়ে ফুলে ওঠা এবং নাভির আশেপাশে তীব্র মোচড়ানো ব্যথা।
2. ক্রমাগত ঢেকুর ওঠা এবং অনবরত চোখে পানি আসা।
3. শরীর অস্বাভাবিক ভারী হয়ে যাওয়া এবং হাত-পায়ের তালুতে প্রচণ্ড গরম অনুভূত হওয়া।

**ডায়াগনোসিস সিদ্ধান্ত:** এটি 'সিহরুল মাকুল ও মাশরুব' (খাবারের মাধ্যমে প্রবেশ করানো যাদু) এবং এর প্রতিক্রিয়ায় তৈরি হওয়া ক্ষতিকর রূহানি প্রভাবের সুনির্দিষ্ট লক্ষণ।

---

### প্রদত্ত রুকইয়াহ শারঈয়্যাহ ও সুন্নাহ প্রেসক্রিপশন
রোগীকে ৩টি নিবিড় রুকইয়াহ সেশন এবং ৪ সপ্তাহের একটি পূর্ণাঙ্গ সুন্নাহ চিকিৎসা প্রটোকল প্রদান করা হয়:
* **প্রথম সেশন (ক্লিনিক্যাল রুকইয়াহ):** দীর্ঘ তিলাওয়াত এবং দম করা পানি পান করানো হয়। তিলাওয়াতের একপর্যায়ে রোগী বমির মাধ্যমে কালচে রঙের বিষাক্ত তরল ও শ্লেষ্মা নির্গমন করেন, যা তাৎক্ষণিক পেটের চাপ কমিয়ে দেয়।
* **সুন্নাহ প্রেসক্রিপশন:**
  1. প্রতিদিন ভোরে খালি পেটে রুকইয়াহ করা জমজম পানি ও আজওয়া খেজুর (৭টি) গ্রহণ।
  2. খাঁটি জলপাই তেল (জয়তুন) ও কালোজিরা তেল শরীরে মালিশ করা।
  3. স্যানা মাক্কি (সোনামুখী পাতা) দিয়ে সপ্তাহে একবার পেট পরিশোধন (ইস্তিফরাগ)।
  4. পিঠের বিশেষ পয়েন্টে সুন্নাহ মোতাবেক ড্রাই ও ওয়েট হিজামা (রক্তমোক্ষণ) সম্পাদন।

---

### ফলাফল ও ফলোআপ
* **৩ সপ্তাহ পর:** পেটের জ্বালাপোড়া ও বমি ভাব সম্পূর্ণ দূর হয়েছে। ক্ষুধা স্বাভাবিক হয়েছে এবং শারীরিক দুর্বলতা হ্রাস পেয়েছে।
* **৬ সপ্তাহ পর (চূড়ান্ত ফলোআপ):** রোগী নিয়মিত নামাজ ও কুরআনি আমল অব্যাহত রেখেছেন। রুকইয়াহ তিলাওয়াত পুনরাবৃত্তি করার সময় আর কোনো অস্বাভাবিক শারীরিক বা মানসিক প্রতিক্রিয়া দেখা যায়নি। আলহামদুলিল্লাহ, তিনি সম্পূর্ণ সুস্থ জীবনযাপন করছেন।

> **বিশেষ ধর্মীয় সতর্কতা ও ডিসক্লেইমার:**  
> আরোগ্য ও শিফা একমাত্র আল্লাহ সুবহানাহু ওয়া তা'আলার পক্ষ থেকে অবতীর্ণ হয়। কোনো রাকি বা চিকিৎসা নিজে থেকে শিফা দিতে পারে না। রুকইয়াহ ও হিজামা হলো কুরআন ও সহীহ সুন্নাহ নির্দেশিত বৈধ উপায় ও চিকিৎসা মাত্র।
      `,
      content_en: `
### Patient Background & Initial Presentation
* **Profile:** 32-year-old male, private sector employee (identity strictly anonymized for clinical confidentiality).
* **Chief Complaints:** Severe burning sensation in the lower abdomen and stomach for 3 years, persistent post-meal nausea, unprovoked weight loss, and sudden nocturnal breathlessness.
* **Prior Medical Background:** Underwent multiple endoscopies, ultrasonograms, and comprehensive blood panels under leading gastroenterologists; all conventional clinical tests showed no structural pathology or ulceration.

---

### Shariah Diagnosis & Clinical Assessment
During the initial diagnostic recitation at our Feni Branch, specific verses exposing Sihr (Surah Al-A'raf 117-122, Surah Yunus 81-82, Surah Ta-Ha 69) were recited. The following clinical reactions were manifested:
1. Marked abdominal rigidity and acute cramping localized around the navel.
2. Involuntary deep belching and involuntary continuous lacrimation (tearing).
3. Sensation of overwhelming heaviness and burning heat in the palms and soles.

**Diagnostic Impression:** Classical manifestations of 'Sihr Al-Ma'kul wa Al-Mashrub' (Ingested/Food-borne Sorcery) accompanied by associated spiritual affliction.

---

### Administered Ruqyah & Sunnah Remedial Protocol
The patient was prescribed 3 intensive clinic Ruqyah sessions alongside a 4-week structured Sunnah recovery plan:
* **Session Protocol:** Extended direct recitation with ruqyah-recited water administration. During recitation, the patient vomited dark, viscous fluids, providing immediate abdominal decompression.
* **Home Regimen & Sunnah Remedies:**
  1. Daily morning intake of Ruqyah-recited Zamzam water and 7 Ajwa dates on an empty stomach.
  2. Whole-body application of recited cold-pressed Olive Oil (Zayt) and Black Seed Oil (Habbat al-Barakah).
  3. Controlled digestive cleansing (Istifragh) using Senna leaves under clinical guidance.
  4. Wet cupping (Hijama) on Sunnah points (Al-Kahil and upper back) to eliminate toxic stagnations.

---

### Treatment Outcome & Follow-up
* **After 3 Weeks:** Abdominal distress, burning, and nausea completely subsided. Appetite normalized and energy levels rebounded.
* **After 6 Weeks (Final Clinical Review):** Patient maintained consistent five daily prayers, Adhkar, and Qur'anic recitation. Re-testing with Ruqyah verses produced zero abnormal physical or spiritual reactions. Alhamdulillah, full recovery was documented.

> **Important Shariah Disclaimer:**  
> True healing (Shifa) belongs exclusively to Allah Subhanahu wa Ta'ala. No Raqi or treatment can guarantee a cure independently. Ruqyah and Hijama are authentic prophetic means and lawful remedies based upon the Qur'an and authentic Sunnah.
      `,
      featured_image: '/images/articles/default-case.jpg',
      status: 'published',
      author_name: 'মুহাম্মদুল্লাহ মিয়াহ (Muhammadullah Miah)'
    },
    {
      title_bn: 'কেস স্টাডি ০২: রাতের ভয়ংকর দুঃস্বপ্ন, স্লিপ প্যারালাইসিস ও জিনের উপদ্রব থেকে মুক্তি',
      title_en: 'Case Study 02: Liberation from Night Terrors, Sleep Paralysis, and Involuntary Jinn Disturbance',
      slug_bn: 'case-02-nightmares-sleep-paralysis',
      slug_en: 'case-02-nightmares-sleep-paralysis-en',
      category_bn: 'জিনের আসর ও নিদ্রাজনিত সমস্যা',
      category_en: 'Jinn Affliction & Sleep Disorders',
      excerpt_bn: '২৪ বছর বয়সী এক শিক্ষার্থী দীর্ঘ কয়েকমাস যাবত রাতে বিকট চেহারার কালো অবয়ব দেখা, শরীর অবশ হয়ে যাওয়া (বোবায় ধরা) এবং তীব্র ভীতির শিকার হচ্ছিলেন। শারঈ রুকইয়াহ এবং সহীহ মাসনূন আমল অনুসরণের মাধ্যমে স্থায়ী স্বস্তি লাভ করেন।',
      excerpt_en: 'A 24-year-old student endured terrifying nocturnal visions, severe sleep paralysis, and intense dread every night for months. Through Shariah-based Ruqyah and consistent adherence to authentic Sunnah bedtime Adhkar, tranquility and deep restful sleep were restored.',
      content_bn: `
### রোগীর পটভূমি ও উপসর্গ
* **বয়স ও পরিচয়:** ২৪ বছর বয়সী তরুণী, বিশ্ববিদ্যালয় শিক্ষার্থী (পরিচয় সম্পূর্ণ গোপন রাখা হয়েছে)।
* **প্রধান অভিযোগ:** ঘুমানোর পর থেকেই দম বন্ধ হয়ে আসা, বুকে প্রচণ্ড চাপ অনুভব করা, চোখ খুলতে না পারা এবং রুমের কোনায় কালো ছায়া বা ভীতিকর মানবাকৃতি প্রত্যক্ষ করা।
* **মানসিক অবস্থা:** ঘুমানোর ভয়ে সারা রাত জেগে থাকা, একা রুমে অবস্থান করতে ভয় পাওয়া এবং পড়াশোনায় চরম অমনোযোগিতা।

---

### শারঈ ডায়াগনোসিস
রোগীর অভিভাবকসহ উপস্থিতিতে সূরা আল-বাকারাহ, আয়াতুল কুরসী, এবং সূরা আস-সাফফাতের প্রথম দশ আয়াত তিলাওয়াত করা হয়।
* তিলাওয়াতকালে রোগীর শ্বাস-প্রশ্বাস অত্যন্ত দ্রুত হয়ে যায়, আঙুল অবশ হতে থাকে এবং হৃদস্পন্দন অস্বাভাবিক বৃদ্ধি পায়।
* **ডায়াগনোসিস:** রাতে ঘুমের ব্যাঘাত সৃষ্টিকারী জিনজাতীয় রূহানি শক্তির আছর (আল-মাস আল-জিন্নী) যা প্রধানত দুর্বল মানসিক অবস্থা ও তাহরাত/অজু ছাড়া ঘুমানোর অসতর্কতার সুযোগে বৃদ্ধি পেয়েছিল।

---

### চিকিৎসা পদ্ধতি ও প্রেসক্রিপশন
1. **ক্লিনিক্যাল রুকইয়াহ সেশন:** সরাসরি রুকইয়াহ শারঈয়্যাহ প্রদান এবং সুরক্ষামূলক মাসনূন দোয়ার শিক্ষা।
2. **বিছানার পবিত্রতা ও সুন্নাহ ঘুমের আদব:**
   - অজু অবস্থায় ডান কাত হয়ে শয়ন করা।
   - সূরা আল-ফাতিহা, আয়াতুল কুরসী ও শেষ তিন কুল (ইখলাস, ফালাক, নাস) পড়ে দুই হাতে ফুঁ দিয়ে সারা শরীরে ৩ বার মাসেহ করা।
   - সূরা বাকারার শেষ দুই আয়াত নিয়মিত তিলাওয়াত।
3. **বাসস্থানের রুকইয়াহ স্প্রে:** রুকইয়াহ করা পানি ও লবণ মিশ্রিত করে শোবার ঘরের কোণাগুলোতে স্প্রে করা (টয়লেট বাদে)।
4. **হিজামা:** মাথার রুকইয়াহ ও সাইনাস সংশ্লিষ্ট পয়েন্টে ড্রাই ও কাপিং থেরাপি।

---

### ফলাফল
প্রথম সপ্তাহের পর থেকেই রাতের দুঃস্বপ্ন ও বোবায় ধরার তীব্রতা ৭০% হ্রাস পায়। দ্বিতীয় সপ্তাহের মধ্যে রোগী সম্পূর্ণ ভয়মুক্ত হয়ে একাকী গভীর ও প্রশান্তিময় ঘুমে সক্ষম হন। পড়াশোনায় মনোযোগ ফিরে এসেছে এবং তিনি নিয়মিত সালাত ও কুরআন তিলাওয়াত বজায় রেখেছেন।

> **বিশেষ ধর্মীয় সতর্কতা:** শিফা কেবল আল্লাহর হাতে। রুকইয়াহ শারঈয়্যাহ কুসংস্কারমুক্ত এবং কুরআন ও সুন্নাহর নির্ভেজাল আলোয় পরিচালিত পথ।
      `,
      content_en: `
### Patient Background & Clinical Presentation
* **Profile:** 24-year-old female university student (anonymized for patient confidentiality).
* **Chief Complaints:** Suffocating sensation upon falling asleep, extreme chest compression, inability to move or scream (sleep paralysis), and recurring visual hallucinations of dark humanoid shadows in the bedroom.
* **Psychological Impact:** Severe insomnia, morbid fear of retiring to bed, inability to remain alone in a room, and cognitive decline in academic performance.

---

### Shariah Clinical Assessment
In the presence of the patient's legal guardian, targeted protective verses were recited: Surah Al-Baqarah, Ayat al-Kursi, and the opening verses of Surah As-Saffat.
* During recitation, the patient displayed accelerated respiration, digital numbness in the hands, and acute tachycardia.
* **Diagnosis:** Jinn affliction manifesting as nocturnal terrors (Al-Mass), compounded by irregular spiritual hygiene and unshielded sleep states.

---

### Prescribed Protocol & Treatment Path
1. **Clinical Ruqyah Sessions:** Consecutive direct Ruqyah recitations and personalized spiritual counseling.
2. **Bedtime Sunnah Adhkar & Sleep Protocol:**
   - Retiring to bed in a state of complete Wudhu (ritual purity).
   - Reciting the Mu'awwidhat (Surah Al-Ikhlas, Al-Falaq, An-Nas), blowing into cupped hands, and wiping the entire body thrice.
   - Recitation of the concluding two verses of Surah Al-Baqarah before sleeping.
3. **Home Purification:** Mist-spraying corners of the living quarters (excluding bathrooms) with Ruqyah-recited water infused with sea salt.
4. **Sunnah Cupping (Hijama):** Non-invasive Dry cupping on key neurological and cervical zones.

---

### Clinical Outcome
Night terrors and sleep paralysis episodes decreased by 70% within the first week. By week two, the patient reported uninterrupted, peaceful nocturnal sleep with complete alleviation of dread. Full academic functionality was regained, supported by steadfast daily prayers and Adhkar.

> **Important Shariah Disclaimer:** True healing is solely from Allah. Shariah Ruqyah remains an unadulterated prophetic means rooted in the Qur'an and Sunnah.
      `,
      featured_image: '/images/articles/default-case.jpg',
      status: 'published',
      author_name: 'মুহাম্মদুল্লাহ মিয়াহ (Muhammadullah Miah)'
    },
    {
      title_bn: 'কেস স্টাডি ০৩: তীব্র শারীরিক ক্লান্তি, অনিদ্রা ও বদনজরের প্রভাবে ব্যবসায়িক অচলাবস্থা থেকে পরিত্রাণ',
      title_en: 'Case Study 03: Alleviating Severe Physical Exhaustion, Insomnia, and Evil Eye (Ayn) Obstacles',
      slug_bn: 'case-03-evil-eye-ayn-recovery',
      slug_en: 'case-03-evil-eye-ayn-recovery-en',
      category_bn: 'বদনজর ও হাসাদ চিকিৎসা',
      category_en: 'Evil Eye (Ayn) & Hasad Treatment',
      excerpt_bn: '৪০ বছর বয়সী সফল এক ব্যবসায়ী হঠাৎ করে কাজে চরম অনীহা, মেরুদণ্ড ও কাঁধে অসহ্য ভার এবং ব্যবসায় বড় ধরনের ক্ষতির মুখোমুখি হন। বদনজর ও হাসাদের শারঈ রুকইয়াহ এবং হিজামার সমন্বয়ে শারীরিক ও মানসিক শক্তি ফিরে পান।',
      excerpt_en: 'A 40-year-old entrepreneur suddenly experienced profound lethargy, heavy crushing sensations on the shoulders and spine, accompanied by inexplicable setbacks in business. Shariah Ruqyah for Evil Eye (Ayn) and Hijama restored his vigor and clarity.',
      content_bn: `
### রোগীর পটভূমি ও অভিযোগ
* **বয়স ও পরিচয়:** ৪০ বছর বয়সী পুরুষ, স্থানীয় ব্যবসায়ী (পরিচয় সুরক্ষিত)।
* **প্রধান অভিযোগ:** বিগত ৬ মাস ধরে কোনো স্পষ্ট কারণ ছাড়াই শরীর নিঃশেষিত মনে হওয়া, সকালে বিছানা থেকে উঠতে চরম কষ্ট, কাঁধ ও পিঠে যেন ভারী বোঝা চেপে থাকা এবং সব ধরনের কাজে অনীহা।
* **ব্যবসায়িক প্রেক্ষাপট:** সফল ব্যবসা সম্প্রসারণের পরপরই গ্রাহক সংখ্যা অপ্রত্যাশিতভাবে হ্রাস পাওয়া এবং গুরুত্বপূর্ণ লেনদেনে হঠাৎ ভুল সিদ্ধান্ত নেওয়ার পুনরাবৃত্তি।

---

### শারঈ ডায়াগনোসিস
বদনজর ও হিংসা (আইন ও হাসাদ) সম্পর্কিত আয়াতসমূহ (সূরা ইউসুফ, সূরা আল-ফালাক, সূরা আল-কালাম ৫১-৫২) তিলাওয়াতকালে:
* রোগী ঘন ঘন হাই তুলতে থাকেন (অস্বাভাবিক লম্বা ও আওয়াজসহ হাই)।
* পিঠের মাঝখানে এবং কাঁধের সংযোগস্থলে তীব্র অবশ ভাব অনুভূত হয়।
* শরীর দিয়ে অতিরিক্ত ঘাম নির্গত হয়।

**ডায়াগনোসিস:** তীব্র বদনজর (আইন আল-হাসাদ) যা রোগীর কর্মোদ্যম ও শারীরিক স্নায়বিক শক্তিকে অবরুদ্ধ করেছিল।

---

### সুন্নাহ অনুযায়ী চিকিৎসা প্রটোকল
1. **রুকইয়াহ গোসল (ঘুসল শারঈ):** রুকইয়াহ করা পানিতে বরই পাতা (সদর পাতা) গুঁড়ো করে মিশিয়ে পরপর ৭ দিন গোসল।
2. **রুকইয়াহ তেলের ব্যবহার:** কালোজিরা তেল ও জলপাই তেলের মিশ্রণে রুকইয়াহ ফুঁক দিয়ে প্রতিদিন রাতে কাঁধ ও মেরুদণ্ডে ম্যাসাজ।
3. **হিজামা (কাপিং থেরাপি):**
   - কাঁধের মূল পয়েন্ট (আল-কাহিল), মাথার পেছনভাগ (আল-আখদা'আইন) এবং পিঠের মাঝের পয়েন্টগুলোতে ব্লাড কাপিং।
   - রক্তমোক্ষণের পরপরই রোগী কাঁধের ভারী ভাব তাৎক্ষণিকভাবে অপসৃত হওয়ার কথা জানান।
4. **সকাল-সন্ধ্যার মাসনূন আজকার:** বিশেষ করে 'বিসমিল্লাহিল্লাজি লা ইয়াদুররু মা'আসমিহি...' এবং 'আউজু বিকালিমাাতিল্লাহিত তা-ম্মাাতি...' পাঠের নিয়মিত তাগিদ।

---

### ফলাফল
৩টি সেশন এবং হিজামার পর রোগীর পিঠ ও ঘাড়ের দীর্ঘদিনের ভারী ভাব সম্পূর্ণরূপে সেরে যায়। কাজের প্রতি উদ্যম ও ইতিবাচক মানসিকতা ফিরে এসেছে। আল্লাহর রহমতে ব্যবসায়ের অচলাবস্থা কেটেছে এবং স্বাভাবিক বাণিজ্যিক কার্যক্রম সফলভাবে অব্যাহত রয়েছে।

> **বিশেষ ধর্মীয় শিক্ষা:** রাসুলুল্লাহ ﷺ বলেছেন: "বদনজর সত্য। তাকদীরকে যদি কোনো কিছু অতিক্রম করতে পারত, তবে বদনজরই তা অতিক্রম করত।" (সহীহ মুসলিম)। আল্লাহই একমাত্র রক্ষাকর্তা।
      `,
      content_en: `
### Patient Background & Case Presentation
* **Profile:** 40-year-old male entrepreneur (anonymized for privacy).
* **Chief Complaints:** Sudden debilitating fatigue lasting 6 months, extreme difficulty rising from bed, sensation of a crushing weight across shoulders and spine, and a total loss of commercial motivation.
* **Context:** Following the high-profile launch of an expanded business branch, customer engagement plummeted inexplicably, accompanied by uncharacteristic cognitive blunders during business negotiations.

---

### Shariah Clinical Diagnosis
Recitation focused on verses countering the Evil Eye and Malicious Envy (Surah Yusuf, Surah Al-Falaq, Surah Al-Qalam 51-52).
* The patient manifested continuous, deep yawning (characteristic involuntary gaping yawns).
* Developed sudden acute numbness and tingling between the scapular blades.
* Profuse cold perspiration across the forehead and torso.

**Diagnosis:** Severe 'Ayn & Hasad' (Evil Eye and Envy) that impaired neurological stamina and spiritual resilience.

---

### Applied Sunnah Remedial Protocol
1. **Therapeutic Ruqyah Ghusl:** Consecutive 7-day bathing regimen utilizing water recited with Ruqyah verses and crushed green Sidr (lote tree) leaves.
2. **Topical Application:** Evening application of Ruqyah-recited Virgin Olive Oil combined with cold-pressed Nigella Sativa (Black Seed) oil onto cervical and thoracic spine.
3. **Targeted Wet Cupping (Hijama):**
   - Application to prime Sunnah points: Al-Kahil (upper thoracic spine) and Al-Akhda'ain (posterior cervical).
   - Significant dark stagnation was released; the patient expressed immediate lightened sensation on the shoulders post-procedure.
4. **Adhkar Preservation:** Strict daily commitment to authentic morning and evening Prophetic supplications for protection.

---

### Clinical Outcome & Follow-up
Following 3 weeks of protocol and targeted cupping, the pervasive muscular tension and spinal weight disappeared entirely. The patient's entrepreneurial drive, mental agility, and vitality were comprehensively re-established. Commercial operations normalized smoothly by the grace of Allah.

> **Prophetic Reflection:** The Prophet Muhammad ﷺ affirmed: "The Evil Eye is real. If anything could precede the Divine Decree, it would be the Evil Eye." (Sahih Muslim). Allah alone is the Preserver and Healer.
      `,
      featured_image: '/images/articles/default-case.jpg',
      status: 'published',
      author_name: 'মুহাম্মদুল্লাহ মিয়াহ (Muhammadullah Miah)'
    }
  ];

  for (const c of cases) {
    insertStmt.run(c);
  }
  console.log(`Seeded ${cases.length} educational case histories.`);
} else {
  console.log(`Articles table already contains ${count} articles.`);
}

console.log('Migration v4 completed successfully.');
