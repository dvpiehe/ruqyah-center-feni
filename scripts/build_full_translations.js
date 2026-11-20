const fs = require('fs');
const path = require('path');

const existing = JSON.parse(fs.readFileSync(path.join(__dirname, 'existing_translations.json'), 'utf8'));

const extraBn = {
  // Navigation & Topbar extras
  topbar_schedule: 'শনি-বৃহস্পতি: ০৯:০০ - ২০:০০',
  nav_brand_title: 'রুকইয়াহ সাপোর্ট অ্যান্ড হিজামা সেন্টার',
  nav_brand_sub: 'ফেনী শাখা',

  // Hero Section extras
  hero_title_accent: 'কুরআন ও সহীহ সুন্নাহ ভিত্তিক নির্ভরযোগ্য চিকিৎসা',
  hero_cta_explore: 'সেবাসমূহ জানুন',
  
  // Schedule Card extras
  schedule_card_break_time: 'দুপুর ০১:০০ – ০২:০০ (যোহর ও মধ্যাহ্নভোজ)',
  schedule_card_raqi_title: 'প্রধান রাক্বী ও তিব্বে নববী গবেষক:',
  schedule_card_raqi_name: 'মুহাম্মদুল্লাহ মিয়াহ',
  schedule_card_raqi_role: 'কনসালট্যান্ট রাক্বী ও সুন্নাহ মেডিসিন বিশেষজ্ঞ',

  // FAQ Section
  faq_tag: 'সাধারণ জিজ্ঞাসা',
  faq_title: 'রুকইয়াহ ও হিজামা সম্পর্কিত সাধারণ প্রশ্নোত্তর',
  faq_desc: 'চিকিৎসা পদ্ধতি, অ্যাপয়েন্টমেন্ট শিডিউলিং ও শরয়ী দিকনির্দেশনা সম্পর্কিত স্পষ্ট উত্তর।',
  faq_q1: 'প্রাথমিক রুকইয়াহ সেশনে কী কী করা হয়?',
  faq_a1: 'রাক্বী রোগীর কাছ থেকে বিস্তারিত সমস্যা শুনেন, লক্ষণ ও পূর্বের চিকিৎসার ইতিহাস নেন। এরপর পবিত্র কুরআন ও সহীহ হাদিস বর্ণিত দোয়াসমূহ পাঠ করেন এবং শারীরিক প্রতিক্রিয়া পর্যবেক্ষণ করেন। পরিশেষে ব্যবস্থাপত্র ও প্রয়োজনীয় নির্দেশনা দেওয়া হয়।',
  faq_q2: 'আপনারা কি সুস্থতার শতভাগ গ্যারান্টি দেন?',
  faq_a2: 'না, কোনো সহীহ আক্বীদার মুসলিম শতভাগ শেফার নিশ্চয়তা দিতে পারে না। শেফা দেওয়ার একমাত্র মালিক মহান আল্লাহ। রুকইয়াহ হলো আরোগ্য লাভের একটি শরয়ী মাধ্যম মাত্র। যারা ১০০% গ্যারান্টি দাবি করে তারা শরীয়ত বিরোধী কাজ করে।',
  faq_q3: 'মহিলাদের হিজামার জন্য কি নারী থেরাপিস্ট আছেন?',
  faq_a3: 'হ্যাঁ, মা-বোনদের হিজামার জন্য অভিজ্ঞ ও প্রশিক্ষণপ্রাপ্ত নারী থেরাপিস্ট নিয়োজিত রয়েছেন এবং সম্পূর্ণ পর্দাযুক্ত পৃথক কক্ষের ব্যবস্থা রয়েছে। রুকইয়াহ সেশনের ক্ষেত্রে নারী রোগীর সাথে প্রাপ্তবয়স্ক মাহরাম থাকা বাধ্যতামূলক।',
  faq_q4: 'অনলাইন বুকিং কীভাবে কাজ করে?',
  faq_a4: 'ক্যালেন্ডার থেকে আপনার পছন্দের তারিখ ও সময় নির্বাচন করে রোগীর বিবরণ দিন। বুকিং নিশ্চিত হওয়ার সাথে সাথে স্লটটি অন্যদের তালিকা থেকে স্বয়ংক্রিয়ভাবে বন্ধ হয়ে যাবে এবং আপনি বুকিং আইডি ও রেফারেন্স পাবেন।',
  faq_q5: 'হিজামার পূর্বে কী প্রস্তুতি নিতে হবে?',
  faq_a5: 'হিজামার অন্তত ২.৫ থেকে ৩ ঘণ্টা পূর্বে ভারী খাবার পরিহার করুন; খেজুর বা হালকা পানীয় নেওয়া যায়। প্রচুর পানি পান করুন এবং শরীর পরিচ্ছন্ন করে আসুন। রক্ত পাতলা করার ওষুধ খেলে থেরাপিস্টকে আগেই জানান।',

  // Location / Contact Box on Home
  location_tag: 'আমাদের অবস্থান',
  location_title: 'মহিপাল, ফেনীতে সরাসরি আসুন',
  location_desc: 'সহজ যাতায়াত ও নিভৃত শান্ত পরিবেশে আমাদের সেবা কেন্দ্র।',
  location_address_val: 'ভুঁইয়া ম্যানশন, আদর্শ হাউজিং সোসাইটি, মহিপাল, ফেনী, বাংলাদেশ।',
  location_phone_val: '০১৭৫৮-৩৫৪৯২০ (কল ও হোয়াটসঅ্যাপ)',
  location_map_btn: 'গুগল ম্যাপে লোকেশন দেখুন',

  // About Page
  about_hero_tag: 'আমাদের লক্ষ্য ও আদর্শ',
  about_hero_title: 'রুকইয়াহ সাপোর্ট অ্যান্ড হিজামা সেন্টার সম্পর্কে',
  about_hero_desc: 'পবিত্র কুরআন ও সহীহ সুন্নাহর বিশুদ্ধ নির্দেশনায় আত্মিক ও শারীরিক রোগমুক্তি সেবায় নিবেদিত ফেনী শাখার পরিচিতি।',
  about_who_tag: 'আমাদের প্রতিষ্ঠান',
  about_who_title: 'আমরা কারা ও কেন এই উদ্যোগ?',
  about_who_desc1: 'রুকইয়াহ সাপোর্ট অ্যান্ড হিজামা সেন্টার (ফেনী শাখা) শিরক, কুসংস্কার ও ভণ্ড চিকিৎসার বিপরীতে তাওহীদের বিশুদ্ধ ভিত্তি নিয়ে প্রতিষ্ঠিত একটি নির্ভরযোগ্য চিকিৎসা কেন্দ্র।',
  about_who_desc2: 'এখানে প্রতিটি রোগীকে গভীর যত্ন ও আমানতদারিতার সাথে মূল্যায়ন করা হয়। কোনো প্রকার ভুয়া অলৌকিক দাবি বা অহেতুক খরচ ব্যতিরেকে সুন্নাহসম্মত উপায়ে রুকইয়াহ শারঈয়্যাহ ও ক্লিনিক্যাল হিজামা পরিচালনা করা হয়।',
  about_principles_title: 'আমাদের মূল নীতিমালা ও বৈশিষ্ট্য',
  about_pr1_title: 'তাওহীদের নিখাদ বিশুদ্ধতা',
  about_pr1_desc: 'তাবিজ, কবচ, গণকগিরি, জিন হাজির করে অবাস্তব দাবি ইত্যাদি সম্পূর্ণ পরিহার করে নিখাদ কুরআনী চিকিৎসা।',
  about_pr2_title: 'পূর্ণ গোপনীয়তা ও ১ ঘণ্টার আলাদা সময়',
  about_pr2_desc: 'প্রতিটি রোগীর জন্য ১ ঘণ্টার নির্ধারিত নিভৃত স্লট। রোগীর ব্যক্তিগত ও পারিবারিক গোপনীয়তা কঠোরভাবে রক্ষা করা হয়।',
  about_pr3_title: 'হাসপাতাল মানের স্বাস্থ্যবিধি',
  about_pr3_desc: 'হিজামার ক্ষেত্রে শতভাগ ওয়ান-টাইম ডিসপোজেবল কাপ, জীবাণুমুক্ত সার্জিক্যাল ব্লেড ও অ্যান্টিসেপটিক ব্যবহার।',
  about_pr4_title: 'শেফা কেবল আল্লাহর পক্ষ থেকে',
  about_pr4_desc: 'আমরা কোনো মিথ্যে গ্যারান্টি বা জাদুকরী সুস্থতার দাবি করি না; আরোগ্য একমাত্র মহান আল্লাহর হাতে।',
  about_raqi_title: 'প্রধান রাক্বীর পরিচিতি',
  about_raqi_name: 'মুহাম্মদুল্লাহ মিয়াহ',
  about_raqi_role: 'কনসালট্যান্ট রাক্বী ও তিব্বে নববী প্র্যাকটিশনার',
  about_raqi_bio: 'দীর্ঘদিন যাবত সহীহ সুন্নাহর আলোকে রুকইয়াহ শারঈয়্যাহ ও কাপিং থেরাপি পরিচালনা করে আসছেন। কুরআন তিলাওয়াত, মাসনূন দোয়া ও শরয়ী মাসআলায় সুগভীর অভিজ্ঞতার অধিকারী।',

  // Policies Page
  policies_badge: 'ক্লিনিক্যাল নিয়মাবলী ও শিষ্টাচার',
  policies_main_title: 'ক্লিনিকের নিয়ম, নীতিমালা ও নির্দেশনা',
  policies_main_desc: 'শৃঙ্খলা, শালীনতা ও চিকিৎসার সর্বোচ্চ সুফল নিশ্চিত করতে ক্লিনিকে আগমনের পূর্বে নিচের নীতিমালাগুলো জেনে নিন।',
  policies_p1_title: '১. অ্যাপয়েন্টমেন্ট সংক্রান্ত শর্তাবলী',
  policies_p1_desc: 'ব্যক্তিগত ১ ঘণ্টার সময় বরাদ্দের জন্য পূর্বেই অনলাইন বা ফোনের মাধ্যমে বুকিং করা বাধ্যতামূলক। জরুরি কেস ব্যতিরেকে পূর্ব অনুমতি ছাড়া সরাসরি এসে অপেক্ষা করা নিরুৎসাহিত করা হয়।',
  policies_p2_title: '২. বাতিল ও সময় পরিবর্তন নীতি',
  policies_p2_desc: 'অনিবার্য কারণে আসতে না পারলে অন্তত ১২ ঘণ্টা পূর্বে টেলিফোন বা হোয়াটসঅ্যাপের মাধ্যমে অবহিত করতে হবে, যাতে অন্য একজন প্রয়োজনগ্রস্ত রোগী সুযোগ পান।',
  policies_p3_title: '৩. নারী রোগীদের ক্ষেত্রে মাহরামের উপস্থিতি',
  policies_p3_desc: 'শরয়ী বিধান অনুসারে নারী রোগীদের ক্ষেত্রে প্রাপ্তবয়স্ক মাহরাম (স্বামী, পিতা, ভাই বা প্রাপ্তবয়স্ক ছেলে) সাথে থাকা বাধ্যতামূলক। মাহরাম ছাড়া কোনো নারী রোগীর রুকইয়াহ করা হয় না।',
  policies_p4_title: '৪. হিজামা স্বাস্থ্যবিধি ও পূর্বপ্রস্তুতি',
  policies_p4_desc: 'হিজামার পূর্বে খালি পেটে বা হালকা খাবার খেয়ে আসবেন। রক্ত তরলীকরণ ওষুধ, ডায়াবেটিস বা গুরুতর শারীরিক অসুস্থতা থাকলে থেরাপিস্টকে আগেই জানান।',
  policies_p5_title: '৫. আমানতদারিতা ও গোপনীয়তা',
  policies_p5_desc: 'রোগীর সকল ডায়াগনোসিস, লক্ষণ ও পারিবারিক তথ্য সম্পূর্ণ গোপন রাখা হয়। কোনো তৃতীয় পক্ষের কাছে তথ্য প্রকাশ করা হয় না।',

  // Contact Page
  contact_badge: 'আমরা আপনার সহযোগিতায় প্রস্তুত',
  contact_main_title: 'যোগাযোগ ও ক্লিনিকের অবস্থান',
  contact_main_desc: 'মহিপাল, ফেনীতে আমাদের ক্লিনিকে সরাসরি আসুন অথবা টেলিফোন ও হোয়াটসঅ্যাপে যোগাযোগ করুন।',
  contact_desk_title: 'ফেনী শাখা ক্লিনিক্যাল ডেস্ক',
  contact_hours_title: 'সেবার সময়সূচী:',
  contact_hours_val: 'শনিবার থেকে বৃহস্পতিবার: সকাল ০৯:০০ – রাত ০৮:০০ (বিরতি: দুপুর ০১:০০ – ০২:০০)',
  contact_friday_val: 'শুক্রবার: সাধারণ বুকিং বন্ধ / পূর্ব অনুমতি সাপেক্ষে বিশেষ কেস',
  contact_form_title: 'আমাদের সরাসরি বার্তা পাঠান',
  contact_form_desc: 'যেকোনো জিজ্ঞাসা, পরামর্শ বা সহায়তার জন্য নিচের ফর্মটি পূরণ করে পাঠান।',
  contact_send_btn: 'বার্তা পাঠান',

  // Lookup Page
  lookup_badge: 'বুকিং স্ট্যাটাস অনুসন্ধান',
  lookup_main_title: 'আপনার বুকিংয়ের তথ্য ও স্ট্যাটাস যাচাই করুন',
  lookup_main_desc: 'আপনার অ্যাপয়েন্টমেন্ট রেফারেন্স আইডি (যেমন: APT-XXXXXX) অথবা বুকিংয়ে ব্যবহৃত মোবাইল নম্বর দিয়ে খুঁজুন।',
  lookup_input_placeholder: 'APT-XXXXXX অথবা ০১XXXXXXXXX লিখুন',
  lookup_search_btn: 'অনুসন্ধান করুন',
  lookup_loading: 'তথ্য অনুসন্ধান করা হচ্ছে...',

  // Articles Page
  articles_hero_badge: 'কুরআন ও সুন্নাহ ভিত্তিক আরোগ্য বিবরণী',
  articles_hero_title: 'রোগীর কেস হিস্ট্রি ও শিক্ষণীয় প্রবন্ধসমূহ',
  articles_hero_desc: 'বাস্তব অভিজ্ঞতার আলোকে বিভিন্ন রূহানি ও শারীরিক জটিলতার শারঈ ডায়াগনোসিস এবং রাসুলুল্লাহ ﷺ এর নির্দেশিত সুন্নাহ চিকিৎসা পদ্ধতির বাস্তব ফলাফল।',
  articles_disclaimer_title: 'ধর্মীয় সতর্কতা ও রোগীর গোপনীয়তা রক্ষা নীতি:',
  articles_disclaimer_desc: 'আরোগ্য (শিফা) কেবল মহান আল্লাহ তা\'আলার পক্ষ থেকে অবতীর্ণ হয়। রুকইয়াহ ও হিজামা হলো কুরআন ও সুন্নাহ নির্দেশিত বৈধ উপায় মাত্র। সকল কেস স্টাডিতে রোগীর পরিচয় ও ব্যক্তিগত তথ্য সম্পূর্ণ গোপন রাখা হয়েছে।',
  articles_filter_all: 'সকল কেস স্টাডি',
  articles_filter_sihr: 'সিহর ও যাদু',
  articles_filter_jinn: 'জিনের আসর ও দুঃস্বপ্ন',
  articles_filter_hasad: 'বদনজর ও হাসাদ',
  articles_search_placeholder: '🔍 বিষয় বা লক্ষণ খুঁজুন...',
  articles_read_more: 'বিস্তারিত পড়ুন →',
  articles_loading: 'কেস হিস্ট্রি ও প্রবন্ধসমূহ লোড হচ্ছে...',
  articles_empty: 'এই ক্যাটাগরিতে কোনো কেস হিস্ট্রি পাওয়া যায়নি।',

  // Admin Dashboard Metrics
  admin_metrics_total_patients: 'মোট নিবন্ধিত রোগী',
  admin_metrics_today_appts: 'আজকের অ্যাপয়েন্টমেন্ট',
  admin_metrics_upcoming_appts: 'আসন্ন অ্যাপয়েন্টমেন্ট',
  admin_metrics_pending_appts: 'অপেক্ষমান বুকিং',
  admin_metrics_completed_appts: 'সম্পন্ন অ্যাপয়েন্টমেন্ট',
  admin_metrics_cancelled_appts: 'বাতিলকৃত অ্যাপয়েন্টমেন্ট',
  admin_metrics_ruqyah_sessions: 'মোট রুকইয়াহ সেশন',
  admin_metrics_hijama_sessions: 'মোট হিজামা সেশন',

  // Admin Table Headers & Controls
  admin_today_schedule_title: 'আজকের রোগী সময়সূচী',
  admin_followup_reminders_title: 'ফলো-আপ রিমাইন্ডার',
  admin_view_all: 'সব দেখুন',
  admin_th_timeslot: 'সময়সূচী',
  admin_th_patient: 'রোগী ও ফোন',
  admin_th_service: 'সেবা',
  admin_th_status: 'স্ট্যাটাস',
  admin_th_fee: 'ফি / খরচ',
  admin_th_notes: 'নোটস',
  admin_th_action: 'অ্যাকশন',
  admin_th_apt_id: 'অ্যাপয়েন্টমেন্ট আইডি',
  admin_th_date_time: 'তারিখ ও সময়',
  admin_th_age_gender: 'বয়স / লিঙ্গ',
  admin_th_sessions_count: 'মোট সেশন',
  admin_th_session_id: 'সেশন আইডি',
  admin_th_raqi: 'রাক্বী',
  admin_th_assessment: 'পর্যবেক্ষণ ও ডায়াগনোসিস',
  admin_th_next_followup: 'পরবর্তী ফলো-আপ',
  admin_th_progression: 'অগ্রগতি / অবস্থা',
  admin_th_article_title: 'আর্টিকেল শিরোনাম',
  admin_th_category: 'ক্যাটাগরি',
  admin_th_author: 'লেখক',
  admin_th_published: 'প্রকাশের তারিখ',
  admin_th_price: 'নির্ধারিত মূল্য',
  admin_th_discount_price: 'ডিসকাউন্ট মূল্য',

  // Admin Buttons & Modals
  admin_btn_filter: 'ফিল্টার করুন',
  admin_btn_manage: 'পরিচালনা',
  admin_btn_view_dossier: 'রোগীর ফাইল',
  admin_btn_add_session: 'সেশন রেকর্ড',
  admin_btn_add_followup: 'ফলো-আপ যোগ',
  admin_btn_edit: 'সম্পাদনা',
  admin_btn_delete: 'মুছে ফেলুন',
  admin_btn_save: 'সংরক্ষণ করুন',
  admin_btn_cancel: 'বাতিল',
  admin_btn_close: 'বন্ধ করুন',
  admin_btn_toggle_active: 'সক্রিয় করুন',
  admin_btn_toggle_inactive: 'নিষ্ক্রিয় করুন',
  admin_btn_new_article: '+ নতুন কেস হিস্ট্রি / আর্টিকেল',
  admin_btn_new_symptom: '+ নতুন উপসর্গ যোগ করুন',
  admin_btn_change_password: 'পাসওয়ার্ড পরিবর্তন',

  // Admin Modal Titles
  admin_modal_register_patient: 'নতুন রোগী নিবন্ধন',
  admin_modal_patient_history: 'রোগীর পূর্ণাঙ্গ হিস্ট্রি ও পূর্ববর্তী চিকিৎসা',
  admin_modal_record_session: 'রুকইয়াহ সেশন রেকর্ড করুন',
  admin_modal_add_followup: 'ফলো-আপ যুক্ত করুন',
  admin_modal_change_password: 'অ্যাডমিন পাসওয়ার্ড পরিবর্তন',
  admin_modal_close_date: 'পুরো দিন বন্ধ ঘোষণা করুন',
  admin_modal_block_slot: 'নির্দিষ্ট সময় স্লট ব্লক করুন',
  admin_modal_add_article: 'নতুন কেস হিস্ট্রি / আর্টিকেল যোগ করুন',
  admin_modal_edit_article: 'কেস হিস্ট্রি / আর্টিকেল সম্পাদনা',
  admin_modal_add_symptom: 'নতুন উপসর্গ যোগ করুন',
  admin_modal_edit_symptom: 'উপসর্গ সম্পাদনা করুন',

  // Calendar Controls
  admin_cal_title: 'ইন্টারঅ্যাক্টিভ ক্লিনিক ক্যালেন্ডার',
  admin_cal_sub: 'ভিজ্যুয়াল শিডিউল ওভারভিউ। স্লট ব্লক বা দিন বন্ধ করতে তারিখে ক্লিক করুন।',
  admin_cal_prev: '◀ পূর্ববর্তী মাস',
  admin_cal_next: 'পরবর্তী মাস ▶',
  admin_cal_sat: 'শনি',
  admin_cal_sun: 'রবি',
  admin_cal_mon: 'সোম',
  admin_cal_tue: 'মঙ্গল',
  admin_cal_wed: 'বুধ',
  admin_cal_thu: 'বৃহঃ',
  admin_cal_fri: 'শুক্র',

  // Status Badges
  status_pending: 'অপেক্ষমান (Pending)',
  status_confirmed: 'নিশ্চিতকৃত (Confirmed)',
  status_completed: 'সম্পন্ন (Completed)',
  status_cancelled: 'বাতিল (Cancelled)',
  status_rescheduled: 'পুনঃনির্ধারিত (Rescheduled)',
  status_noshow: 'অনুপস্থিত (No Show)',
  status_active: 'সক্রিয় (Active)',
  status_inactive: 'নিষ্ক্রিয় (Inactive)',

  // Reports Hub
  admin_reports_title: 'পিডিএফ রিপোর্ট ও ক্লিনিক্যাল রেকর্ড হাব',
  admin_reports_sub: 'রোগীর পূর্ণাঙ্গ হিস্ট্রি, ৯-ক্যাটাগরি ডায়াগনোসিস এবং রুকইয়াহ সেশনের দ্বৈত-ভাষিক (বাংলা ও ইংরেজি) প্রিন্ট ও ডাউনলোড।',
  admin_reports_btn_bn: '📥 বাংলা PDF রিপোর্ট',
  admin_reports_btn_en: '📥 English PDF Report',
  admin_reports_btn_print: '🖨 প্রিন্ট / প্রিভিউ',

  // Common UI labels
  lbl_ruqyah_fee: '২,০৫০ টাকা',
  lbl_hijama_fee: 'পরামর্শের মাধ্যমে নির্ধারণ করা হবে',
  lbl_loading: 'লোড হচ্ছে...',
  lbl_no_records: 'কোনো তথ্য পাওয়া যায়নি।'
};

const extraEn = {
  // Navigation & Topbar extras
  topbar_schedule: 'Sat-Thu: 09:00 - 20:00',
  nav_brand_title: 'Ruqyah Support & Cupping Center',
  nav_brand_sub: 'Feni Branch',

  // Hero Section extras
  hero_title_accent: 'Authentic Treatment based on the Qur\'an and Sunnah',
  hero_cta_explore: 'Explore Services',

  // Schedule Card extras
  schedule_card_break_time: '01:00 PM – 02:00 PM (Zuhr & Lunch)',
  schedule_card_raqi_title: 'Lead Raqi & Prophetic Medicine Specialist:',
  schedule_card_raqi_name: 'Muhammadullah Miah',
  schedule_card_raqi_role: 'Consultant Raqi & Sunnah Medicine Specialist',

  // FAQ Section
  faq_tag: 'Frequently Asked Questions',
  faq_title: 'Common Questions About Ruqyah & Hijama',
  faq_desc: 'Clear, authentic answers regarding spiritual healing, appointment bookings, and cupping guidelines.',
  faq_q1: 'What happens during an initial Ruqyah session?',
  faq_a1: 'The Raqi takes a structured clinical history, recites designated verses of the Holy Qur\'an and authentic supplications, observes physical reactions, and prescribes an individualized home routine.',
  faq_q2: 'Do you guarantee that I will be cured?',
  faq_a2: 'No authentic Muslim practitioner can guarantee healing. Cure is in the hands of Allah alone. Ruqyah is an authentic prophetic means (Sabab). Claiming 100% guaranteed cure is contrary to Islamic principles.',
  faq_q3: 'Are female cupping therapists available for women?',
  faq_a3: 'Yes. We have dedicated trained female Hijama therapists for sisters in private, dignified rooms. For Ruqyah recitation sessions, female patients must be accompanied by an adult Mahram at all times.',
  faq_q4: 'How does the online appointment booking work?',
  faq_a4: 'Select your preferred date, pick any available 1-hour time slot, and submit patient contact details. That slot is immediately reserved and removed from the public schedule.',
  faq_q5: 'How should I prepare for Sunnah Hijama (Cupping)?',
  faq_a5: 'Do not eat heavy meals for 2.5 to 3 hours before cupping; drink plenty of water and arrive in a clean state. Inform the therapist if you take blood-thinning medications.',

  // Location / Contact Box on Home
  location_tag: 'Clinic Location',
  location_title: 'Visit Our Center in Mohipal, Feni',
  location_desc: 'Easily accessible, quiet and private clinical environment.',
  location_address_val: 'Bhuya Mansion, Adarsha Housing Society, Mohipal, Feni, Bangladesh.',
  location_phone_val: '01758-354920 (Call & WhatsApp)',
  location_map_btn: 'View on Google Maps',

  // About Page
  about_hero_tag: 'OUR MISSION & ETHOS',
  about_hero_title: 'About Ruqyah Support & Cupping Center',
  about_hero_desc: 'Dedicated to reviving authentic prophetic medicine through pure Qur\'anic recitation and certified cupping therapy in Feni, Bangladesh.',
  about_who_tag: 'Our Organization',
  about_who_title: 'Who We Are & Our Ethos',
  about_who_desc1: 'Ruqyah Support & Cupping Center (Feni Branch) was established to provide an uncompromised authentic alternative to superstitious healers and illicit talisman vendors.',
  about_who_desc2: 'Every patient is evaluated with profound care and clinical honesty, free from fraudulent claims or hidden charges, according to authentic Sunnah principles.',
  about_principles_title: 'Our Core Principles & Standards',
  about_pr1_title: 'Purity of Monotheism (Tawheed)',
  about_pr1_desc: 'Strict rejection of amulets, fortune-telling, and superstitious rituals; strictly pure Qur\'anic healing.',
  about_pr2_title: 'Privacy & 1-Hour Private Slots',
  about_pr2_desc: 'Dedicated 1-hour private slots with absolute confidentiality of patient records and personal matters.',
  about_pr3_title: 'Hospital-Grade Hygiene',
  about_pr3_desc: 'Single-use surgical disposables and strict clinical hygiene for cupping therapy.',
  about_pr4_title: 'Healing is from Allah Alone',
  about_pr4_desc: 'We never claim guaranteed cures; healing is exclusively in the hands of Allah SWT.',
  about_raqi_title: 'Lead Practitioner Profile',
  about_raqi_name: 'Muhammadullah Miah',
  about_raqi_role: 'Consultant Raqi & Sunnah Medicine Specialist',
  about_raqi_bio: 'Extensive clinical experience in Shariah Ruqyah and Hijama therapy, grounded in sound Quranic recitation, authentic supplications, and compassionate care.',

  // Policies Page
  policies_badge: 'CLINICAL STANDARDS & ETIQUETTE',
  policies_main_title: 'Rules, Policies & Patient Guidelines',
  policies_main_desc: 'To maintain order, dignity, and spiritual efficacy, please familiarize yourself with our clinical policies prior to visiting.',
  policies_p1_title: '1. Appointment Requirements',
  policies_p1_desc: 'Due to individualized 1-hour sessions, pre-booking an appointment is mandatory. Unscheduled walk-ins are not accommodated except in verified acute emergencies.',
  policies_p2_title: '2. Cancellation & Rescheduling',
  policies_p2_desc: 'If unable to attend, please notify the clinic at least 12 hours in advance via phone or WhatsApp so another patient may take the slot.',
  policies_p3_title: '3. Mahram Requirement for Female Patients',
  policies_p3_desc: 'In accordance with Islamic law, female patients must be accompanied by an adult Mahram (husband, father, brother, or adult son) at all times.',
  policies_p4_title: '4. Hijama Hygiene & Precautions',
  policies_p4_desc: 'Arrive with a light stomach (fast 2.5-3 hours). Disclose any blood-thinning medications or serious chronic illnesses beforehand.',
  policies_p5_title: '5. Patient Confidentiality',
  policies_p5_desc: 'All patient diagnoses, records, and personal histories are kept strictly confidential and never disclosed to third parties.',

  // Contact Page
  contact_badge: 'WE ARE HERE TO HELP',
  contact_main_title: 'Contact & Clinic Location',
  contact_main_desc: 'Visit our center at Mohipal, Feni or connect with our support desk via telephone and WhatsApp.',
  contact_desk_title: 'FENI BRANCH CLINICAL DESK',
  contact_hours_title: 'Consultation Hours:',
  contact_hours_val: 'Saturday to Thursday: 09:00 AM – 08:00 PM (Break: 01:00 PM – 02:00 PM)',
  contact_friday_val: 'Friday: Closed for regular bookings / Prior emergency appointment only',
  contact_form_title: 'Send Us a Direct Message',
  contact_form_desc: 'Fill in the form below for any queries, advice, or assistance.',
  contact_send_btn: 'Send Message',

  // Lookup Page
  lookup_badge: 'APPOINTMENT STATUS LOOKUP',
  lookup_main_title: 'Check Your Appointment Details & Status',
  lookup_main_desc: 'Enter your Appointment Reference ID (e.g. APT-XXXXXX) or registered patient phone number to retrieve status.',
  lookup_input_placeholder: 'Enter APT-XXXXXX or 01XXXXXXXXX',
  lookup_search_btn: 'Search Booking',
  lookup_loading: 'Searching booking records...',

  // Articles Page
  articles_hero_badge: 'EVIDENCE-BASED RECOVERY STORIES',
  articles_hero_title: 'Patient Case Studies & Instructive Articles',
  articles_hero_desc: 'Clinical Ruqyah diagnoses and positive outcomes under Prophetic medicine guidelines based on authentic cases.',
  articles_disclaimer_title: 'Religious Notice & Patient Privacy Policy:',
  articles_disclaimer_desc: 'Healing (Shifa) descends exclusively from Allah SWT. All published case studies preserve absolute anonymity and patient confidentiality.',
  articles_filter_all: 'All Case Studies',
  articles_filter_sihr: 'Black Magic (Sihr)',
  articles_filter_jinn: 'Jinn Affliction & Nightmares',
  articles_filter_hasad: 'Evil Eye & Hasad',
  articles_search_placeholder: '🔍 Search by topic or symptom...',
  articles_read_more: 'Read Full Case →',
  articles_loading: 'Loading case studies & articles...',
  articles_empty: 'No case studies found in this category.',

  // Admin Dashboard Metrics
  admin_metrics_total_patients: 'Total Patients',
  admin_metrics_today_appts: 'Today\'s Appointments',
  admin_metrics_upcoming_appts: 'Upcoming Appts',
  admin_metrics_pending_appts: 'Pending Confirmation',
  admin_metrics_completed_appts: 'Completed Appts',
  admin_metrics_cancelled_appts: 'Cancelled Appts',
  admin_metrics_ruqyah_sessions: 'Total Ruqyah Sessions',
  admin_metrics_hijama_sessions: 'Total Hijama Sessions',

  // Admin Table Headers & Controls
  admin_today_schedule_title: 'Today\'s Patient Schedule',
  admin_followup_reminders_title: 'Follow-up Reminders',
  admin_view_all: 'View All',
  admin_th_timeslot: 'Time Slot',
  admin_th_patient: 'Patient & Phone',
  admin_th_service: 'Service',
  admin_th_status: 'Status',
  admin_th_fee: 'Fee / Price',
  admin_th_notes: 'Notes',
  admin_th_action: 'Action',
  admin_th_apt_id: 'Appointment ID',
  admin_th_date_time: 'Date & Time',
  admin_th_age_gender: 'Age / Gender',
  admin_th_sessions_count: 'Total Sessions',
  admin_th_session_id: 'Session ID',
  admin_th_raqi: 'Conducting Raqi',
  admin_th_assessment: 'Clinical Assessment',
  admin_th_next_followup: 'Next Follow-up',
  admin_th_progression: 'Progression / Status',
  admin_th_article_title: 'Article Title',
  admin_th_category: 'Category',
  admin_th_author: 'Author',
  admin_th_published: 'Published Date',
  admin_th_price: 'Base Price',
  admin_th_discount_price: 'Discount Price',

  // Admin Buttons & Modals
  admin_btn_filter: 'Filter',
  admin_btn_manage: 'Manage',
  admin_btn_view_dossier: 'View Dossier',
  admin_btn_add_session: 'Record Session',
  admin_btn_add_followup: 'Add Follow-up',
  admin_btn_edit: 'Edit',
  admin_btn_delete: 'Delete',
  admin_btn_save: 'Save Changes',
  admin_btn_cancel: 'Cancel',
  admin_btn_close: 'Close',
  admin_btn_toggle_active: 'Activate',
  admin_btn_toggle_inactive: 'Deactivate',
  admin_btn_new_article: '+ New Case Study / Article',
  admin_btn_new_symptom: '+ Add New Symptom',
  admin_btn_change_password: 'Change Password',

  // Admin Modal Titles
  admin_modal_register_patient: 'Register New Patient',
  admin_modal_patient_history: 'Patient Full Clinical History',
  admin_modal_record_session: 'Record Ruqyah Session',
  admin_modal_add_followup: 'Schedule Patient Follow-up',
  admin_modal_change_password: 'Change Administrator Password',
  admin_modal_close_date: 'Close an Entire Date',
  admin_modal_block_slot: 'Block Specific Time Slot',
  admin_modal_add_article: 'Add New Case Study / Article',
  admin_modal_edit_article: 'Edit Case Study / Article',
  admin_modal_add_symptom: 'Add New Symptom',
  admin_modal_edit_symptom: 'Edit Symptom Details',

  // Calendar Controls
  admin_cal_title: 'Interactive Clinic Calendar',
  admin_cal_sub: 'Visual schedule overview. Click on any date to inspect, block slots, or close days.',
  admin_cal_prev: '◀ Previous Month',
  admin_cal_next: 'Next Month ▶',
  admin_cal_sat: 'Sat',
  admin_cal_sun: 'Sun',
  admin_cal_mon: 'Mon',
  admin_cal_tue: 'Tue',
  admin_cal_wed: 'Wed',
  admin_cal_thu: 'Thu',
  admin_cal_fri: 'Fri',

  // Status Badges
  status_pending: 'Pending',
  status_confirmed: 'Confirmed',
  status_completed: 'Completed',
  status_cancelled: 'Cancelled',
  status_rescheduled: 'Rescheduled',
  status_noshow: 'No Show',
  status_active: 'Active',
  status_inactive: 'Inactive',

  // Reports Hub
  admin_reports_title: 'PDF Reports & Clinical Records Hub',
  admin_reports_sub: 'Bilingual (Bengali & English) printable and downloadable reports for patient histories, 9-category diagnoses, and Ruqyah session reports.',
  admin_reports_btn_bn: '📥 Bengali PDF Report',
  admin_reports_btn_en: '📥 English PDF Report',
  admin_reports_btn_print: '🖨 Print / Preview',

  // Common UI labels
  lbl_ruqyah_fee: '2,050 BDT',
  lbl_hijama_fee: 'Determined after consultation',
  lbl_loading: 'Loading...',
  lbl_no_records: 'No matching records found.'
};

const fullBn = { ...existing.bn, ...extraBn };
const fullEn = { ...existing.en, ...extraEn };

const outputJs = `/**
 * Centralized Client-Side Localization Engine (Bangla Default + English Switcher)
 * Ruqyah Support & Cupping Center – Feni Branch
 */

const translations = {
  bn: ${JSON.stringify(fullBn, null, 2)},
  en: ${JSON.stringify(fullEn, null, 2)}
};

/**
 * Gets the active language code. Defaults to 'bn' (Bangla).
 */
function getCurrentLang() {
  return localStorage.getItem('ruqyah_lang') || 'bn';
}

/**
 * Returns translated string for a key in the active language.
 */
function t(key) {
  const lang = getCurrentLang();
  if (translations[lang] && translations[lang][key] !== undefined) {
    return translations[lang][key];
  }
  // Fallback to Bangla, then English
  if (translations.bn[key] !== undefined) return translations.bn[key];
  if (translations.en[key] !== undefined) return translations.en[key];
  return key;
}

/**
 * Sets active language, saves to localStorage, and updates DOM.
 */
function setLanguage(lang) {
  if (lang !== 'bn' && lang !== 'en') lang = 'bn';
  localStorage.setItem('ruqyah_lang', lang);
  document.documentElement.lang = lang;
  applyTranslations();
  updateSwitcherUI();
  
  // Dispatch custom event for any view-specific listeners
  window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
}

/**
 * Applies translations to all elements with data-i18n attributes.
 */
function applyTranslations() {
  const lang = getCurrentLang();
  const dict = translations[lang] || translations.bn;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key] !== undefined) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        if (el.hasAttribute('placeholder')) {
          el.setAttribute('placeholder', dict[key]);
        }
      } else {
        el.innerHTML = dict[key];
      }
    }
  });

  // Handle placeholders explicitly if marked with data-i18n-placeholder
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (dict[key] !== undefined) {
      el.setAttribute('placeholder', dict[key]);
    }
  });
}

/**
 * Updates visual state of language switcher buttons.
 */
function updateSwitcherUI() {
  const current = getCurrentLang();
  document.querySelectorAll('.lang-btn-bn, .lang-switcher-btn.lang-btn-bn').forEach(btn => {
    btn.classList.toggle('active', current === 'bn');
    btn.style.fontWeight = current === 'bn' ? '700' : '400';
  });
  document.querySelectorAll('.lang-btn-en, .lang-switcher-btn.lang-btn-en').forEach(btn => {
    btn.classList.toggle('active', current === 'en');
    btn.style.fontWeight = current === 'en' ? '700' : '400';
  });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  // Ensure default is Bangla
  if (!localStorage.getItem('ruqyah_lang')) {
    localStorage.setItem('ruqyah_lang', 'bn');
  }
  document.documentElement.lang = getCurrentLang();
  applyTranslations();
  updateSwitcherUI();
});
`;

fs.writeFileSync(path.join(__dirname, '../public/js/translations.js'), outputJs, 'utf8');
console.log('Successfully generated full translations.js with', Object.keys(fullBn).length, 'keys!');
