const fs = require('fs');
const path = require('path');

const viewsDir = path.join(__dirname, '../views');

// 1. Update index.html
let indexHtml = fs.readFileSync(path.join(viewsDir, 'index.html'), 'utf8');

// Hero section replacement
const oldHero = `<span class="badge badge-gold" style="margin-bottom: 1.25rem; font-size: 0.85rem; padding: 0.35rem 1rem;">
          BISMILLAHIR RAHMANIR RAHIM • FENI BRANCH
        </span>
        <h1 class="hero-headline">
          Seeking Shariah-Based Ruqyah Support?
        </h1>
        <p class="hero-subheadline">
          Ruqyah Shariah and Sunnah Cupping Services Based on the Qur'an and Authentic Sunnah. Private, hygienic, and dignified Islamic healthcare under the guidance of <strong>Raqi Muhammadullah Miah</strong>.
        </p>

        <div class="hero-highlights">
          <div class="hero-highlight-item">
            <span>✓</span> 100% Qur'an & Authentic Sunnah
          </div>
          <div class="hero-highlight-item">
            <span>✓</span> Dedicated 1-Hour Private Slot
          </div>
          <div class="hero-highlight-item">
            <span>✓</span> Male & Female Therapists
          </div>
          <div class="hero-highlight-item">
            <span>✓</span> No Amulets or Superstition
          </div>
        </div>

        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
          <a href="/book" class="btn btn-accent btn-lg">
            🗓 Book Appointment Online
          </a>
          <a href="https://wa.me/8801758354920?text=Assalamu%20Alaikum.%20I%20would%20like%20to%20inquire%20about%20Ruqyah%20and%20Cupping%20services%20in%20Feni." 
             target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-lg">
            💬 WhatsApp Consultation
          </a>
        </div>
      </div>

      <!-- Quick Clinic Badge Card -->
      <div class="hero-card">
        <span class="badge badge-primary" style="margin-bottom: 0.75rem;">CLINIC NOTICE & SCHEDULE</span>
        <h3 style="font-size: 1.35rem; margin-bottom: 0.75rem; color: var(--primary);">
          Feni Branch Consultation Hours
        </h3>
        <p style="font-size: 0.9rem; color: var(--text-body); margin-bottom: 1.25rem;">
          Saturday to Thursday: <strong>09:00 AM – 08:00 PM</strong><br>
          <span style="color: var(--accent-gold); font-weight: 600;">Daily Break: 01:00 PM – 02:00 PM (Zuhr & Lunch)</span><br>
          Friday: Closed for public bookings / By prior special arrangement only.
        </p>
        
        <div style="border-top: 1px solid var(--border-light); padding-top: 1rem; margin-bottom: 1.25rem;">
          <div style="font-size: 0.85rem; color: var(--text-muted);">Lead Practitioner:</div>
          <strong style="color: var(--text-main); font-size: 1.05rem;">Muhammadullah Miah</strong>
          <div style="font-size: 0.8rem; color: var(--primary);">Consultant Raqi & Sunnah Medicine Specialist</div>
        </div>

        <a href="/book" class="btn btn-primary" style="width: 100%;">
          Check Available Slots Today
        </a>`;

const newHero = `<span class="badge badge-gold" style="margin-bottom: 1.25rem; font-size: 0.85rem; padding: 0.35rem 1rem;" data-i18n="hero_bismillah">
          বিসমিল্লাহির রাহমানির রাহিম • ফেনী শাখা
        </span>
        <h1 class="hero-headline" data-i18n="hero_headline">
          শরীয়াহ সম্মত নির্ভরযোগ্য রুকইয়াহ সেবা খুঁজছেন?
        </h1>
        <p class="hero-subheadline" data-i18n="hero_subheadline">
          কুরআন ও সহীহ সুন্নাহর আলোকে রুকইয়াহ শারঈয়্যাহ ও সুন্নাতী হিজামা কাপিং থেরাপি। অভিজ্ঞ রাক্বী মুহাম্মদুল্লাহ মিয়াহর তত্ত্বাবধানে সম্পূর্ণ ব্যক্তিগত, নিরাপদ ও স্বাস্থ্যসম্মত পরিবেশ।
        </p>

        <div class="hero-highlights">
          <div class="hero-highlight-item" data-i18n="hero_badge1">
            ✓ ১০০% কুরআন ও সহীহ সুন্নাহ ভিত্তিক
          </div>
          <div class="hero-highlight-item" data-i18n="hero_badge2">
            ✓ ১ ঘণ্টার নির্ধারিত প্রাইভেট স্লট
          </div>
          <div class="hero-highlight-item" data-i18n="hero_badge3">
            ✓ পুরুষ ও মহিলা আলাদা থেরাপিস্ট
          </div>
          <div class="hero-highlight-item" data-i18n="hero_badge4">
            ✓ তাবিজ, শিরক ও কুসংস্কারমুক্ত
          </div>
        </div>

        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
          <a href="/book" class="btn btn-accent btn-lg" data-i18n="hero_cta_book">
            🗓 অনলাইনে অ্যাপয়েন্টমেন্ট নিন
          </a>
          <a href="https://wa.me/8801758354920?text=Assalamu%20Alaikum.%20I%20would%20like%20to%20inquire%20about%20Ruqyah%20and%20Cupping%20services%20in%20Feni." 
             target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-lg" data-i18n="hero_cta_wa">
            💬 হোয়াটসঅ্যাপে পরামর্শ নিন
          </a>
        </div>
      </div>

      <!-- Quick Clinic Badge Card -->
      <div class="hero-card">
        <span class="badge badge-primary" style="margin-bottom: 0.75rem;" data-i18n="schedule_card_badge">ক্লিনিক নোটিশ ও সময়সূচী</span>
        <h3 style="font-size: 1.35rem; margin-bottom: 0.75rem; color: var(--primary);" data-i18n="schedule_card_title">
          পরামর্শ ও সেবার সময়সূচী
        </h3>
        <p style="font-size: 0.9rem; color: var(--text-body); margin-bottom: 1.25rem;">
          <span data-i18n="schedule_card_days">শনিবার থেকে বৃহস্পতিবার: সকাল ০৯:০০ – রাত ০৮:০০</span><br>
          <span style="color: var(--accent-gold); font-weight: 600;" data-i18n="schedule_card_break">দৈনিক বিরতি: দুপুর ০১:০০ – ০২:০০ (যোহর ও মধ্যাহ্নভোজ)</span><br>
          <span data-i18n="schedule_card_friday">শুক্রবার: সাধারণ বুকিং বন্ধ / পূর্ব অনুমতি সাপেক্ষে বিশেষ কেস</span>
        </p>
        
        <div style="border-top: 1px solid var(--border-light); padding-top: 1rem; margin-bottom: 1.25rem;">
          <div style="font-size: 0.85rem; color: var(--text-muted);" data-i18n="schedule_card_raqi_title">প্রধান রাক্বী ও তিব্বে নববী গবেষক:</div>
          <strong style="color: var(--text-main); font-size: 1.05rem;" data-i18n="lead_raqi">মুহাম্মদুল্লাহ মিয়াহ</strong>
          <div style="font-size: 0.8rem; color: var(--primary);" data-i18n="lead_raqi_title">কনসালট্যান্ট রাক্বী ও সুন্নাহ মেডিসিন প্র্যাকটিশনার</div>
        </div>

        <a href="/book" class="btn btn-primary" style="width: 100%;" data-i18n="schedule_check_btn">
          আজকের খালি স্লট দেখুন
        </a>`;

if (indexHtml.includes(oldHero)) {
  indexHtml = indexHtml.replace(oldHero, newHero);
  console.log('Updated index.html hero section!');
}

// Intro section replacement
const oldIntro = `<div class="section-tag">Authentic Prophetic Medicine</div>
        <h2 class="section-title">What is Ruqyah Shariah?</h2>
        <p class="section-description">
          Ruqyah Shariah is the practice of seeking cure (Shifa) through the recitation of the Holy Qur'an and authentic supplications transmitted from the Prophet Muhammad (Peace and blessings be upon him).
        </p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem;">
        <div class="card" style="border-top: 4px solid var(--primary-light);">
          <div style="font-size: 2rem; margin-bottom: 0.75rem;">📖</div>
          <h3 class="card-title">Pure Qur'anic Recitation</h3>
          <p style="color: var(--text-muted); font-size: 0.95rem;">
            Treatment strictly consists of recited verses from the Qur'an—such as Surah Al-Fatihah, Ayat al-Kursi, Surah Al-Baqarah, and the Mu'awwidhatayn—accompanied by authentic Prophetic Duas.
          </p>
        </div>

        <div class="card" style="border-top: 4px solid var(--primary-light);">
          <div style="font-size: 2rem; margin-bottom: 0.75rem;">🛡️</div>
          <h3 class="card-title">Strict Rejection of Shirk & Bid'ah</h3>
          <p style="color: var(--text-muted); font-size: 0.95rem;">
            We strictly forbid and reject amulets (taweez), numerological magic squares, calling upon unseen entities, or superstitious rituals. Our clinic operates purely on pristine Islamic monotheism (Tawheed).
          </p>
        </div>

        <div class="card" style="border-top: 4px solid var(--primary-light);">
          <div style="font-size: 2rem; margin-bottom: 0.75rem;">🤲</div>
          <h3 class="card-title">Allah is the Sole Curer (Ash-Shafi)</h3>
          <p style="color: var(--text-muted); font-size: 0.95rem;">
            Ruqyah is an authorized spiritual means (Sabab). We never guarantee instant cure or claim miraculous powers. The Raqi is merely a humble practitioner praying for your healing.
          </p>`;

const newIntro = `<div class="section-tag" data-i18n="intro_tag">সহীহ তিব্বে নববী</div>
        <h2 class="section-title" data-i18n="intro_title">রুকইয়াহ শারঈয়্যাহ কী ও কেন?</h2>
        <p class="section-description" data-i18n="intro_desc">
          পবিত্র কুরআনুল কারীমের নির্দিষ্ট আয়াত ও রাসূলুল্লাহ (সাল্লাল্লাহু আলাইহি ওয়া সাল্লাম) থেকে বর্ণিত সহীহ দোয়াসমূহের মাধ্যমে মহান আল্লাহর কাছে শেফা প্রার্থনা করার নামই রুকইয়াহ।
        </p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem;">
        <div class="card" style="border-top: 4px solid var(--primary-light);">
          <div style="font-size: 2rem; margin-bottom: 0.75rem;">📖</div>
          <h3 class="card-title" data-i18n="intro_c1_title">কুরআনের আয়াত দ্বারা ঝাড়ফুঁক</h3>
          <p style="color: var(--text-muted); font-size: 0.95rem;" data-i18n="intro_c1_desc">
            সূরা আল-ফাতিহা, আয়াতুল কুরসী, সূরা আল-বাকারাহ ও মুআউওয়াযাতাইনসহ সুন্নাহ বর্ণিত দোয়ার মাধ্যমে চিকিৎসা প্রদান করা হয়।
          </p>
        </div>

        <div class="card" style="border-top: 4px solid var(--primary-light);">
          <div style="font-size: 2rem; margin-bottom: 0.75rem;">🛡️</div>
          <h3 class="card-title" data-i18n="intro_c2_title">শিরক ও বিদআত মুক্ত পূর্ণ তাওহীদ</h3>
          <p style="color: var(--text-muted); font-size: 0.95rem;" data-i18n="intro_c2_desc">
            আমরা কোনো প্রকার তাবিজ, কবচ, কুফরি কালাম বা গণকগিরি সম্পূর্ণ প্রত্যাখ্যান করি। আমাদের চিকিৎসা নিখাদ তাওহীদের ওপর প্রতিষ্ঠিত।
          </p>
        </div>

        <div class="card" style="border-top: 4px solid var(--primary-light);">
          <div style="font-size: 2rem; margin-bottom: 0.75rem;">🤲</div>
          <h3 class="card-title" data-i18n="intro_c3_title">শেফা দানকারী একমাত্র আল্লাহ (আশ-শাফী)</h3>
          <p style="color: var(--text-muted); font-size: 0.95rem;" data-i18n="intro_c3_desc">
            রুকইয়াহ কেবল একটি শরয়ী ও আত্মিক উপায় (সবব)। কোনো মানুষ বা রাক্বী নিজে শেফা দেওয়ার ক্ষমতা রাখে না। আরোগ্য আসে একমাত্র আল্লাহর পক্ষ থেকে।
          </p>`;

if (indexHtml.includes(oldIntro)) {
  indexHtml = indexHtml.replace(oldIntro, newIntro);
  console.log('Updated index.html intro section!');
}

// Why choose us replacement
const oldWhy = `<div class="section-tag">Quality & Sincerity</div>
          <h2 style="font-size: 2.25rem; margin-bottom: 1.25rem;">Why Choose Ruqyah Support & Cupping Center?</h2>
          <p style="color: var(--text-body); font-size: 1.05rem; margin-bottom: 1.5rem;">
            In an era where spiritual healing is often misused or conflated with dubious practices, our Feni branch stands as a beacon of Shariah integrity, clinical cleanliness, and genuine pastoral care.
          </p>

          <div style="display: flex; flex-direction: column; gap: 1.25rem;">
            <div style="display: flex; gap: 1rem;">
              <div style="font-size: 1.5rem; color: var(--primary);">✓</div>
              <div>
                <strong style="font-size: 1.05rem; color: var(--text-main);">Experienced & Trusted Raqi</strong>
                <p style="font-size: 0.9rem; color: var(--text-muted); margin: 0.25rem 0 0;">
                  Guided by Muhammadullah Miah, with years of clinical observation and profound grounding in Quranic recitation and Islamic jurisprudence.
                </p>
              </div>
            </div>

            <div style="display: flex; gap: 1rem;">
              <div style="font-size: 1.5rem; color: var(--primary);">✓</div>
              <div>
                <strong style="font-size: 1.05rem; color: var(--text-main);">Strict 1-on-1 Patient Confidentiality</strong>
                <p style="font-size: 0.9rem; color: var(--text-muted); margin: 0.25rem 0 0;">
                  Every patient receives a dedicated 1-hour appointment slot. Your private records, symptoms, and family matters remain strictly confidential.
                </p>
              </div>
            </div>

            <div style="display: flex; gap: 1rem;">
              <div style="font-size: 1.5rem; color: var(--primary);">✓</div>
              <div>
                <strong style="font-size: 1.05rem; color: var(--text-main);">Hospital-Grade Hygiene for Hijama</strong>
                <p style="font-size: 0.9rem; color: var(--text-muted); margin: 0.25rem 0 0;">
                  Strict single-use surgical blades, sealed sterile suction cups, antiseptics, and dedicated treatment beds for both men and women.
                </p>
              </div>
            </div>

            <div style="display: flex; gap: 1rem;">
              <div style="font-size: 1.5rem; color: var(--primary);">✓</div>
              <div>
                <strong style="font-size: 1.05rem; color: var(--text-main);">No Guaranteed Cure Claims</strong>
                <p style="font-size: 0.9rem; color: var(--text-muted); margin: 0.25rem 0 0;">
                  We maintain complete religious honesty: Shifa is granted exclusively by Allah SWT. We provide authentic means and sincere Duas.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <!-- Guidance / Preparation Callout -->
          <div class="card" style="background-color: var(--primary-subtle); border: 2px solid var(--primary-border); padding: 2.25rem;">
            <h3 style="color: var(--primary); margin-bottom: 1rem;">
              📋 Patient Guidance Before Your Visit
            </h3>
            <p style="font-size: 0.95rem; color: var(--text-body); margin-bottom: 1.25rem;">
              To ensure the greatest benefit and spiritual receptivity from your Ruqyah session, please observe the following Sunnah etiquette:
            </p>
            <ul style="padding-left: 1.25rem; font-size: 0.9rem; color: var(--text-body); line-height: 1.8;">
              <li><strong>Sincere Repentance (Tawbah):</strong> Turn your heart towards Allah and seek forgiveness for past shortcomings.</li>
              <li><strong>Perform Wudu:</strong> Attend your session in a state of physical and spiritual purity.</li>
              <li><strong>Remove All Amulets:</strong> Discard or bring any Taweez, black threads, or talismans to be safely destroyed.</li>
              <li><strong>Modest Islamic Dress:</strong> Wear loose, modest clothing covering the Awrah.</li>
              <li><strong>Mahram Requirement for Women:</strong> Female patients MUST be accompanied by an adult Mahram.</li>
              <li><strong>Previous Medical Reports:</strong> Bring your medical and diagnostic test results for thorough evaluation.</li>
            </ul>

            <div style="margin-top: 1.75rem;">
              <a href="/policies" class="btn btn-primary" style="width: 100%;">Read Full Patient Guidelines & Policies</a>
            </div>`;

const newWhy = `<div class="section-tag" data-i18n="why_tag">সততা ও আন্তরিকতা</div>
          <h2 style="font-size: 2.25rem; margin-bottom: 1.25rem;" data-i18n="why_title">কেন আমাদের সেন্টারে আসবেন?</h2>
          <p style="color: var(--text-body); font-size: 1.05rem; margin-bottom: 1.5rem;" data-i18n="why_desc">
            ভণ্ড কবিরাজ ও শিরকি চিকিৎসার বিপরীতে কুরআন ও সুন্নাহর বিশুদ্ধ আলোকবর্তিকা হিসেবে আমাদের এই কেন্দ্র পরিচালিত।
          </p>

          <div style="display: flex; flex-direction: column; gap: 1.25rem;">
            <div style="display: flex; gap: 1rem;">
              <div style="font-size: 1.5rem; color: var(--primary);">✓</div>
              <div>
                <strong style="font-size: 1.05rem; color: var(--text-main);" data-i18n="why_p1_title">অভিজ্ঞ ও আস্থাশীল রাক্বী</strong>
                <p style="font-size: 0.9rem; color: var(--text-muted); margin: 0.25rem 0 0;" data-i18n="why_p1_desc">
                  সুন্নাহ চিকিৎসায় দীর্ঘ অভিজ্ঞতা এবং গভীর শরয়ী জ্ঞানসম্পন্ন রাক্বী মুহাম্মদুল্লাহ মিয়াহর প্রত্যক্ষ তত্ত্বাবধান।
                </p>
              </div>
            </div>

            <div style="display: flex; gap: 1rem;">
              <div style="font-size: 1.5rem; color: var(--primary);">✓</div>
              <div>
                <strong style="font-size: 1.05rem; color: var(--text-main);" data-i18n="why_p2_title">সম্পূর্ণ গোপনীয়তা ও ১ ঘণ্টার আলাদা সময়</strong>
                <p style="font-size: 0.9rem; color: var(--text-muted); margin: 0.25rem 0 0;" data-i18n="why_p2_desc">
                  প্রতিজন রোগী ও পরিবারকে ১ ঘণ্টার নির্ধারিত নিভৃত সময় দেওয়া হয় যাতে খোলামেলা আলোচনা ও চিকিৎসা সম্ভব হয়।
                </p>
              </div>
            </div>

            <div style="display: flex; gap: 1rem;">
              <div style="font-size: 1.5rem; color: var(--primary);">✓</div>
              <div>
                <strong style="font-size: 1.05rem; color: var(--text-main);" data-i18n="why_p3_title">হাসপাতাল মানের পরিষ্কার-পরিচ্ছন্নতা</strong>
                <p style="font-size: 0.9rem; color: var(--text-muted); margin: 0.25rem 0 0;" data-i18n="why_p3_desc">
                  হিজামার ক্ষেত্রে সর্বোচ্চ স্বাস্থ্যবিধি ও ওয়ান-টাইম সরঞ্জাম নিশ্চিত করা হয়।
                </p>
              </div>
            </div>

            <div style="display: flex; gap: 1rem;">
              <div style="font-size: 1.5rem; color: var(--primary);">✓</div>
              <div>
                <strong style="font-size: 1.05rem; color: var(--text-main);" data-i18n="why_p4_title">ভুয়া ও বিভ্রান্তিকর গ্যারান্টিমুক্ত</strong>
                <p style="font-size: 0.9rem; color: var(--text-muted); margin: 0.25rem 0 0;" data-i18n="why_p4_desc">
                  আমরা কোনো কুসংস্কার বা অবৈজ্ঞানিক দাবি করি না; আল্লাহর ওপর পূর্ণ ভরসা রেখে খাঁটি সুন্নাত অনুযায়ী সেবা দিই।
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <!-- Guidance / Preparation Callout -->
          <div class="card" style="background-color: var(--primary-subtle); border: 2px solid var(--primary-border); padding: 2.25rem;">
            <h3 style="color: var(--primary); margin-bottom: 1rem;" data-i18n="guidance_title">
              📋 সাক্ষাতের পূর্বে রোগীর প্রস্তুতি ও করণীয়
            </h3>
            <p style="font-size: 0.95rem; color: var(--text-body); margin-bottom: 1.25rem;" data-i18n="guidance_p">
              রুকইয়াহ ও হিজামার সর্বোচ্চ বরকত ও শেফা লাভের জন্য নিচের সুন্নাতসমূহ মেনে চলুন:
            </p>
            <ul style="padding-left: 1.25rem; font-size: 0.9rem; color: var(--text-body); line-height: 1.8;">
              <li data-i18n="guidance_1">খাঁটি তাওবাহ ও আল্লাহর ওপর পূর্ণ তাওয়াক্কুল রাখা।</li>
              <li data-i18n="guidance_2">সাক্ষাতের পূর্বে অযু করে পবিত্র অবস্থায় আসা।</li>
              <li data-i18n="guidance_3">শরীরে বা ঘরে থাকা সব ধরনের তাবিজ-কবচ খুলে নিয়ে আসা (যা সুন্নাহ অনুযায়ী ধ্বংস করা হবে)।</li>
              <li data-i18n="guidance_4">শালীন ও ঢিলেঢালা পোশাক পরিধান করা।</li>
              <li data-i18n="guidance_5">নারী রোগীদের ক্ষেত্রে প্রাপ্তবয়স্ক মাহরাম (স্বামী, পিতা, ভাই বা ছেলে) থাকা বাধ্যতামূলক।</li>
              <li data-i18n="guidance_6">পূর্ববর্তী যেকোনো ডাক্তারি রিপোর্ট ও প্রেসক্রিপশন সাথে আনা।</li>
            </ul>

            <div style="margin-top: 1.75rem;">
              <a href="/policies" class="btn btn-primary" style="width: 100%;" data-i18n="guidance_btn">সম্পূর্ণ নিয়মাবলী ও শর্তাবলী পড়ুন</a>
            </div>`;

if (indexHtml.includes(oldWhy)) {
  indexHtml = indexHtml.replace(oldWhy, newWhy);
  console.log('Updated index.html why choose us section!');
}

// FAQ Section replacement
const oldFaq = `<div class="section-tag">Frequently Asked Questions</div>
        <h2 class="section-title">Common Questions About Ruqyah & Hijama</h2>
        <p class="section-description">
          Find clear, authentic answers regarding spiritual healing, appointment bookings, and cupping guidelines.
        </p>
      </div>

      <div class="faq-list">
        <div class="faq-item">
          <button class="faq-question">
            <span>What happens during an initial Ruqyah session?</span>
            <span class="faq-icon">+</span>
          </button>
          <div class="faq-answer">
            The Raqi begins by taking a structured clinical history (duration, symptoms, sleep disturbance, medical tests). Next, the Raqi recites designated verses of the Holy Qur'an and authentic prophetic Duas while observing physical reactions. Finally, the Raqi provides an objective assessment and prescribes a home routine (such as drinking recited water, Sidr leaf baths, and morning/evening Adhkar).
          </div>
        </div>

        <div class="faq-item">
          <button class="faq-question">
            <span>Do you guarantee that I will be cured?</span>
            <span class="faq-icon">+</span>
          </button>
          <div class="faq-answer">
            No authentic Muslim practitioner can guarantee Shifa (healing). Cure is in the hands of Allah (Subhanahu wa Ta'ala) alone. Ruqyah is an authentic prophetic means (Sabab). Anyone claiming 100% guaranteed cure is acting contrary to Islamic principles.
          </div>
        </div>

        <div class="faq-item">
          <button class="faq-question">
            <span>Are female cupping therapists available for women?</span>
            <span class="faq-icon">+</span>
          </button>
          <div class="faq-answer">
            Yes. We have dedicated, trained female Hijama therapists for sisters in private, dignified rooms. For Ruqyah recitation sessions, female patients must be accompanied by an adult Mahram (husband, brother, father, adult son) at all times.
          </div>
        </div>

        <div class="faq-item">
          <button class="faq-question">
            <span>How does the online appointment booking work?</span>
            <span class="faq-icon">+</span>
          </button>
          <div class="faq-answer">
            You select your preferred date, pick any available 1-hour time slot, and provide your contact information. Once booked, that time slot is immediately reserved and removed from the public schedule so no other patient can take it. You will receive an instant Reference ID and WhatsApp confirmation slip.
          </div>
        </div>

        <div class="faq-item">
          <button class="faq-question">
            <span>How should I prepare for Sunnah Hijama (Cupping)?</span>
            <span class="faq-icon">+</span>
          </button>
          <div class="faq-answer">
            Do not eat heavy meals for 2.5 to 3 hours before cupping; a light beverage or dates is fine. Drink plenty of water to stay hydrated. Ensure you bathe before coming, and let the therapist know if you are taking blood-thinning medications or have diabetes.
          </div>
        </div>`;

const newFaq = `<div class="section-tag" data-i18n="faq_tag">সাধারণ জিজ্ঞাসা</div>
        <h2 class="section-title" data-i18n="faq_title">রুকইয়াহ ও হিজামা সম্পর্কিত সাধারণ প্রশ্নোত্তর</h2>
        <p class="section-description" data-i18n="faq_desc">
          চিকিৎসা পদ্ধতি, অ্যাপয়েন্টমেন্ট শিডিউলিং ও শরয়ী দিকনির্দেশনা সম্পর্কিত স্পষ্ট উত্তর।
        </p>
      </div>

      <div class="faq-list">
        <div class="faq-item">
          <button class="faq-question">
            <span data-i18n="faq_q1">প্রাথমিক রুকইয়াহ সেশনে কী কী করা হয়?</span>
            <span class="faq-icon">+</span>
          </button>
          <div class="faq-answer" data-i18n="faq_a1">
            রাক্বী রোগীর কাছ থেকে বিস্তারিত সমস্যা শুনেন, লক্ষণ ও পূর্বের চিকিৎসার ইতিহাস নেন। এরপর পবিত্র কুরআন ও সহীহ হাদিস বর্ণিত দোয়াসমূহ পাঠ করেন এবং শারীরিক প্রতিক্রিয়া পর্যবেক্ষণ করেন। পরিশেষে ব্যবস্থাপত্র ও প্রয়োজনীয় নির্দেশনা দেওয়া হয়।
          </div>
        </div>

        <div class="faq-item">
          <button class="faq-question">
            <span data-i18n="faq_q2">আপনারা কি সুস্থতার শতভাগ গ্যারান্টি দেন?</span>
            <span class="faq-icon">+</span>
          </button>
          <div class="faq-answer" data-i18n="faq_a2">
            না, কোনো সহীহ আক্বীদার মুসলিম শতভাগ শেফার নিশ্চয়তা দিতে পারে না। শেফা দেওয়ার একমাত্র মালিক মহান আল্লাহ। রুকইয়াহ হলো আরোগ্য লাভের একটি শরয়ী মাধ্যম মাত্র। যারা ১০০% গ্যারান্টি দাবি করে তারা শরীয়ত বিরোধী কাজ করে।
          </div>
        </div>

        <div class="faq-item">
          <button class="faq-question">
            <span data-i18n="faq_q3">মহিলাদের হিজামার জন্য কি নারী থেরাপিস্ট আছেন?</span>
            <span class="faq-icon">+</span>
          </button>
          <div class="faq-answer" data-i18n="faq_a3">
            হ্যাঁ, মা-বোনদের হিজামার জন্য অভিজ্ঞ ও প্রশিক্ষণপ্রাপ্ত নারী থেরাপিস্ট নিয়োজিত রয়েছেন এবং সম্পূর্ণ পর্দাযুক্ত পৃথক কক্ষের ব্যবস্থা রয়েছে। রুকইয়াহ সেশনের ক্ষেত্রে নারী রোগীর সাথে প্রাপ্তবয়স্ক মাহরাম থাকা বাধ্যতামূলক।
          </div>
        </div>

        <div class="faq-item">
          <button class="faq-question">
            <span data-i18n="faq_q4">অনলাইন বুকিং কীভাবে কাজ করে?</span>
            <span class="faq-icon">+</span>
          </button>
          <div class="faq-answer" data-i18n="faq_a4">
            ক্যালেন্ডার থেকে আপনার পছন্দের তারিখ ও সময় নির্বাচন করে রোগীর বিবরণ দিন। বুকিং নিশ্চিত হওয়ার সাথে সাথে স্লটটি অন্যদের তালিকা থেকে স্বয়ংক্রিয়ভাবে বন্ধ হয়ে যাবে এবং আপনি বুকিং আইডি ও রেফারেন্স পাবেন।
          </div>
        </div>

        <div class="faq-item">
          <button class="faq-question">
            <span data-i18n="faq_q5">হিজামার পূর্বে কী প্রস্তুতি নিতে হবে?</span>
            <span class="faq-icon">+</span>
          </button>
          <div class="faq-answer" data-i18n="faq_a5">
            হিজামার অন্তত ২.৫ থেকে ৩ ঘণ্টা পূর্বে ভারী খাবার পরিহার করুন; খেজুর বা হালকা পানীয় নেওয়া যায়। প্রচুর পানি পান করুন এবং শরীর পরিচ্ছন্ন করে আসুন। রক্ত পাতলা করার ওষুধ খেলে থেরাপিস্টকে আগেই জানান।
          </div>
        </div>`;

if (indexHtml.includes(oldFaq)) {
  indexHtml = indexHtml.replace(oldFaq, newFaq);
  console.log('Updated index.html FAQ section!');
}

// Location and Footer replacements
const oldLoc = `<span class="badge badge-gold" style="margin-bottom: 0.75rem;">VISIT US IN FENI</span>
          <h2 style="color: #FFFFFF; font-size: 2rem; margin-bottom: 1rem;">
            Ruqyah Support & Cupping Center – Feni Branch
          </h2>
          <p style="color: #E2E8F0; font-size: 1.05rem; margin-bottom: 1.5rem;">
            Centrally located near Mohipal, Feni. Easily accessible by bus, CNG, and private transport from anywhere in Feni, Noakhali, Comilla, and Chittagong.
          </p>

          <div style="font-size: 0.95rem; line-height: 1.8;">
            <p style="margin: 0;">📍 <strong>Address:</strong> Bhuya Mansion, Adarsha Housing Society, Mohipal, Feni, Bangladesh.</p>
            <p style="margin: 0;">📞 <strong>Direct Phone:</strong> 01758-354920</p>
            <p style="margin: 0;">💬 <strong>WhatsApp:</strong> +8801758354920</p>
            <p style="margin: 0;">🕒 <strong>Hours:</strong> Saturday – Thursday: 09:00 AM – 08:00 PM (Break: 1–2 PM)</p>
          </div>
        </div>

        <div style="text-align: center; background: rgba(255, 255, 255, 0.1); border-radius: var(--radius-md); padding: 2rem;">
          <h3 style="color: #FFFFFF; margin-bottom: 0.75rem;">Ready to Schedule Your Appointment?</h3>
          <p style="color: #E2E8F0; font-size: 0.95rem; margin-bottom: 1.5rem;">
            Appointments are strictly required to ensure zero waiting time and private 1-on-1 care.
          </p>
          <a href="/book" class="btn btn-accent btn-lg" style="width: 100%; margin-bottom: 0.75rem;">
            Book 1-Hour Dedicated Appointment
          </a>
          <a href="https://wa.me/8801758354920" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp" style="width: 100%;">
            Contact on WhatsApp (01758-354920)
          </a>`;

const newLoc = `<span class="badge badge-gold" style="margin-bottom: 0.75rem;" data-i18n="location_tag">আমাদের অবস্থান</span>
          <h2 style="color: #FFFFFF; font-size: 2rem; margin-bottom: 1rem;" data-i18n="location_title">
            মহিপাল, ফেনীতে সরাসরি আসুন
          </h2>
          <p style="color: #E2E8F0; font-size: 1.05rem; margin-bottom: 1.5rem;" data-i18n="location_desc">
            সহজ যাতায়াত ও নিভৃত শান্ত পরিবেশে আমাদের সেবা কেন্দ্র।
          </p>

          <div style="font-size: 0.95rem; line-height: 1.8;">
            <p style="margin: 0;">📍 <strong data-i18n="location_address_val">ভুঁইয়া ম্যানশন, আদর্শ হাউজিং সোসাইটি, মহিপাল, ফেনী, বাংলাদেশ।</strong></p>
            <p style="margin: 0;">📞 <strong>ফোন / হোয়াটসঅ্যাপ:</strong> <span data-i18n="phone">০১৭৫৮-৩৫৪৯২০</span></p>
            <p style="margin: 0;">🕒 <strong data-i18n="schedule_card_days">শনিবার থেকে বৃহস্পতিবার: সকাল ০৯:০০ – রাত ০৮:০০</strong></p>
          </div>
        </div>

        <div style="text-align: center; background: rgba(255, 255, 255, 0.1); border-radius: var(--radius-md); padding: 2rem;">
          <h3 style="color: #FFFFFF; margin-bottom: 0.75rem;" data-i18n="booking_title">১ ঘণ্টার নির্ধারিত অ্যাপয়েন্টমেন্ট বুকিং</h3>
          <p style="color: #E2E8F0; font-size: 0.95rem; margin-bottom: 1.5rem;" data-i18n="booking_subtitle">
            রুকইয়াহ সাপোর্ট অ্যান্ড হিজামা সেন্টার – ফেনী শাখা। স্বয়ংক্রিয় অনলাইন বুকিং সিস্টেম।
          </p>
          <a href="/book" class="btn btn-accent btn-lg" style="width: 100%; margin-bottom: 0.75rem;" data-i18n="hero_cta_book">
            অনলাইনে অ্যাপয়েন্টমেন্ট নিন
          </a>
          <a href="https://wa.me/8801758354920" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp" style="width: 100%;" data-i18n="hero_cta_wa">
            হোয়াটসঅ্যাপে পরামর্শ নিন
          </a>`;

if (indexHtml.includes(oldLoc)) {
  indexHtml = indexHtml.replace(oldLoc, newLoc);
  console.log('Updated index.html location section!');
}

fs.writeFileSync(path.join(viewsDir, 'index.html'), indexHtml, 'utf8');
console.log('Successfully saved updated index.html!');
