const fs = require('fs');
const path = require('path');

const adminPath = path.join(__dirname, '../views/admin.html');
let html = fs.readFileSync(adminPath, 'utf8');

// Metric cards replacement
html = html.replace(
  /<div class="metric-label">Total Patients<\/div>/g,
  '<div class="metric-label" data-i18n="admin_metrics_total_patients">মোট নিবন্ধিত রোগী</div>'
);
html = html.replace(
  /<div class="metric-label">Today's Appointments<\/div>/g,
  '<div class="metric-label" data-i18n="admin_metrics_today_appts">আজকের অ্যাপয়েন্টমেন্ট</div>'
);
html = html.replace(
  /<div class="metric-label">Upcoming Appts<\/div>/g,
  '<div class="metric-label" data-i18n="admin_metrics_upcoming_appts">আসন্ন অ্যাপয়েন্টমেন্ট</div>'
);
html = html.replace(
  /<div class="metric-label">Pending Confirmation<\/div>/g,
  '<div class="metric-label" data-i18n="admin_metrics_pending_appts">অপেক্ষমান বুকিং</div>'
);
html = html.replace(
  /<div class="metric-label">Completed Appts<\/div>/g,
  '<div class="metric-label" data-i18n="admin_metrics_completed_appts">সম্পন্ন অ্যাপয়েন্টমেন্ট</div>'
);
html = html.replace(
  /<div class="metric-label">Cancelled Appts<\/div>/g,
  '<div class="metric-label" data-i18n="admin_metrics_cancelled_appts">বাতিলকৃত অ্যাপয়েন্টমেন্ট</div>'
);
html = html.replace(
  /<div class="metric-label">Total Ruqyah Sessions<\/div>/g,
  '<div class="metric-label" data-i18n="admin_metrics_ruqyah_sessions">মোট রুকইয়াহ সেশন</div>'
);
html = html.replace(
  /<div class="metric-label">Total Hijama Sessions<\/div>/g,
  '<div class="metric-label" data-i18n="admin_metrics_hijama_sessions">মোট হিজামা সেশন</div>'
);

// Tab 1 Today's Schedule Card Header
html = html.replace(
  /<h3 style="color: var\(--primary\); font-size: 1.15rem; margin: 0;">Today's Patient Schedule<\/h3>\s*<button class="btn btn-outline-primary btn-sm" onclick="switchTab\('appointments'\)">View All<\/button>/,
  '<h3 style="color: var(--primary); font-size: 1.15rem; margin: 0;" data-i18n="admin_today_schedule_title">আজকের রোগী সময়সূচী</h3>\n                <button class="btn btn-outline-primary btn-sm" onclick="switchTab(\'appointments\')" data-i18n="admin_view_all">সব দেখুন</button>'
);

// Tab 1 Follow-up Reminders Card Header
html = html.replace(
  /<h3 style="color: var\(--primary\); font-size: 1.15rem; margin: 0;">Follow-up Reminders<\/h3>\s*<button class="btn btn-outline-primary btn-sm" onclick="switchTab\('followups'\)">View All<\/button>/,
  '<h3 style="color: var(--primary); font-size: 1.15rem; margin: 0;" data-i18n="admin_followup_reminders_title">ফলো-আপ রিমাইন্ডার</h3>\n                <button class="btn btn-outline-primary btn-sm" onclick="switchTab(\'followups\')" data-i18n="admin_view_all">সব দেখুন</button>'
);

// Tab 1 Table headers
html = html.replace(
  /<th>Time Slot<\/th>\s*<th>Patient<\/th>\s*<th>Service<\/th>\s*<th>Status<\/th>\s*<th>Notes<\/th>\s*<th>Action<\/th>/,
  '<th data-i18n="admin_th_timeslot">সময়সূচী</th>\n                      <th data-i18n="admin_th_patient">রোগী ও ফোন</th>\n                      <th data-i18n="admin_th_service">সেবা</th>\n                      <th data-i18n="admin_th_status">স্ট্যাটাস</th>\n                      <th data-i18n="admin_th_notes">নোটস</th>\n                      <th data-i18n="admin_th_action">অ্যাকশন</th>'
);

// Tab 2 Appointment Management Header
html = html.replace(
  /<h1 style="font-size: 1.5rem; color: var\(--text-main\); margin: 0;">Appointment Management<\/h1>\s*<p style="color: var\(--text-muted\); font-size: 0.85rem; margin: 0;">Search, confirm, reschedule, and update patient appointments.<\/p>/,
  '<h1 style="font-size: 1.5rem; color: var(--text-main); margin: 0;" data-i18n="admin_nav_appointments">অ্যাপয়েন্টমেন্টসমূহ</h1>\n              <p style="color: var(--text-muted); font-size: 0.85rem; margin: 0;">অ্যাপয়েন্টমেন্ট অনুসন্ধান, নিশ্চিতকরণ, সময় পরিবর্তন এবং হালনাগাদ করুন।</p>'
);

// Tab 2 Book direct button
html = html.replace(
  /<button class="btn btn-primary btn-sm" onclick="openDirectBookingModal\(\)">\+ Book Walk-in \/ Phone Call<\/button>/,
  '<button class="btn btn-primary btn-sm" onclick="openDirectBookingModal()">+ সরাসরি / ফোনে বুকিং</button>'
);

// Tab 2 Filter labels
html = html.replace(
  /<label class="form-label" style="font-size: 0.8rem;">Search Patient \/ Phone \/ ID:<\/label>/,
  '<label class="form-label" style="font-size: 0.8rem;">রোগী / ফোন / আইডি দিয়ে খুঁজুন:</label>'
);
html = html.replace(
  /placeholder="Search by name, phone, or APT-\.\.\."/,
  'placeholder="নাম, ফোন বা APT-... দিয়ে খুঁজুন"'
);
html = html.replace(
  /<label class="form-label" style="font-size: 0.8rem;">Filter by Date:<\/label>/,
  '<label class="form-label" style="font-size: 0.8rem;">তারিখ অনুযায়ী ফিল্টার:</label>'
);
html = html.replace(
  /<label class="form-label" style="font-size: 0.8rem;">Filter by Status:<\/label>/,
  '<label class="form-label" style="font-size: 0.8rem;">স্ট্যাটাস অনুযায়ী ফিল্টার:</label>'
);
html = html.replace(
  /<button class="btn btn-primary" onclick="loadAppointmentsList\(\)" style="width: 100%;">Filter Appointments<\/button>/,
  '<button class="btn btn-primary" onclick="loadAppointmentsList()" style="width: 100%;" data-i18n="admin_btn_filter">ফিল্টার করুন</button>'
);

// Tab 2 Status options
html = html.replace(
  /<option value="">All Statuses<\/option>\s*<option value="Pending">Pending<\/option>\s*<option value="Confirmed">Confirmed<\/option>\s*<option value="Completed">Completed<\/option>\s*<option value="Cancelled">Cancelled<\/option>\s*<option value="Rescheduled">Rescheduled<\/option>\s*<option value="No Show">No Show<\/option>/,
  '<option value="">সকল স্ট্যাটাস (All Statuses)</option>\n                  <option value="Pending">অপেক্ষমান (Pending)</option>\n                  <option value="Confirmed">নিশ্চিতকৃত (Confirmed)</option>\n                  <option value="Completed">সম্পন্ন (Completed)</option>\n                  <option value="Cancelled">বাতিল (Cancelled)</option>\n                  <option value="Rescheduled">পুনঃনির্ধারিত (Rescheduled)</option>\n                  <option value="No Show">অনুপস্থিত (No Show)</option>'
);

// Tab 2 Appointments Table Headers
html = html.replace(
  /<th>অ্যাপয়েন্টমেন্ট ও আইডি<\/th>\s*<th>রোগী ও ফোন<\/th>\s*<th>তারিখ ও সময়<\/th>\s*<th>নির্বাচিত সেবা<\/th>\s*<th>ফি \/ খরচ<\/th>\s*<th>স্ট্যাটাস<\/th>\s*<th>অ্যাকশন<\/th>/,
  '<th data-i18n="admin_th_apt_id">অ্যাপয়েন্টমেন্ট ও আইডি</th>\n                  <th data-i18n="admin_th_patient">রোগী ও ফোন</th>\n                  <th data-i18n="admin_th_date_time">তারিখ ও সময়</th>\n                  <th data-i18n="admin_th_service">নির্বাচিত সেবা</th>\n                  <th data-i18n="admin_th_fee">ফি / খরচ</th>\n                  <th data-i18n="admin_th_status">স্ট্যাটাস</th>\n                  <th data-i18n="admin_th_action">অ্যাকশন</th>'
);

// Tab 3 Calendar controls
html = html.replace(
  /<h1 style="font-size: 1.5rem; color: var\(--text-main\); margin: 0;">Interactive Clinic Calendar<\/h1>\s*<p style="color: var\(--text-muted\); font-size: 0.85rem; margin: 0;">Visual schedule overview\. Click on any date to inspect, block slots, or close days\.<\/p>/,
  '<h1 style="font-size: 1.5rem; color: var(--text-main); margin: 0;" data-i18n="admin_cal_title">ইন্টারঅ্যাক্টিভ ক্লিনিক ক্যালেন্ডার</h1>\n              <p style="color: var(--text-muted); font-size: 0.85rem; margin: 0;" data-i18n="admin_cal_sub">ভিজ্যুয়াল শিডিউল ওভারভিউ। স্লট ব্লক বা দিন বন্ধ করতে তারিখে ক্লিক করুন।</p>'
);
html = html.replace(
  /<button class="btn btn-secondary btn-sm" onclick="prevCalendarMonth\(\)">◀ Previous Month<\/button>/,
  '<button class="btn btn-secondary btn-sm" onclick="prevCalendarMonth()" data-i18n="admin_cal_prev">◀ পূর্ববর্তী মাস</button>'
);
html = html.replace(
  /<button class="btn btn-secondary btn-sm" onclick="nextCalendarMonth\(\)">Next Month ▶<\/button>/,
  '<button class="btn btn-secondary btn-sm" onclick="nextCalendarMonth()" data-i18n="admin_cal_next">পরবর্তী মাস ▶</button>'
);

// Tab 4 Availability Header & Forms
html = html.replace(
  /<h1 style="font-size: 1.5rem; color: var\(--text-main\); margin: 0;">Manage Clinic Availability<\/h1>\s*<p style="color: var\(--text-muted\); font-size: 0.85rem; margin: 0;">\s*Full administrative control over booking availability\. Close entire dates, block individual hourly slots, and manage regular weekly holidays\.\s*<\/p>/,
  '<h1 style="font-size: 1.5rem; color: var(--text-main); margin: 0;" data-i18n="admin_nav_availability">সময়সূচি ও প্রাপ্যতা</h1>\n            <p style="color: var(--text-muted); font-size: 0.85rem; margin: 0;">ক্লিনিকের খালি ও বন্ধ সময় প্রশাসনিকভাবে নির্ধারণ করুন। পুরো দিন বন্ধ বা নির্দিষ্ট স্লট ব্লক করুন।</p>'
);
html = html.replace(
  /<h3 style="color: var\(--primary\); font-size: 1.15rem; margin-bottom: 0.5rem;">Close an Entire Date<\/h3>\s*<p style="font-size: 0.85rem; color: var\(--text-muted\); margin-bottom: 1rem;">\s*When a date is closed, no patient can book any slot on that date, and it appears unavailable on the public booking calendar\.\s*<\/p>/,
  '<h3 style="color: var(--primary); font-size: 1.15rem; margin-bottom: 0.5rem;">পুরো দিন বন্ধ ঘোষণা করুন</h3>\n              <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">দিন বন্ধ ঘোষণা করলে রোগীরা ওই তারিখে কোনো স্লট বুক করতে পারবেন না এবং ক্যালেন্ডারে বন্ধ দেখাবে।</p>'
);
html = html.replace(
  /<label class="form-label">Date to Close:<\/label>/,
  '<label class="form-label">বন্ধের তারিখ:</label>'
);
html = html.replace(
  /<label class="form-label">Reason for Closing \(Optional\):<\/label>/,
  '<label class="form-label">বন্ধের কারণ (ঐচ্ছিক):</label>'
);
html = html.replace(
  /placeholder="e\.g\. Raqi Traveling \/ Seminar \/ Public Holiday"/,
  'placeholder="যেমন: রাক্বী সফররত / সেমিনার / সরকারি ছুটি"'
);
html = html.replace(
  /Close This Entire Day\s*<\/button>/,
  'এই পুরো দিনটি বন্ধ করুন</button>'
);

// Tab 4 Block Slot Form
html = html.replace(
  /<h3 style="color: var\(--primary\); font-size: 1.15rem; margin-bottom: 0.5rem;">Block Specific Time Slot<\/h3>\s*<p style="font-size: 0.85rem; color: var\(--text-muted\); margin-bottom: 1rem;">\s*Block individual slots \(e\.g\. 10:00 AM – 11:00 AM\) on a specific date while keeping other slots available to patients\.\s*<\/p>/,
  '<h3 style="color: var(--primary); font-size: 1.15rem; margin-bottom: 0.5rem;">নির্দিষ্ট সময় স্লট ব্লক করুন</h3>\n              <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">অন্যান্য স্লট চালু রেখে নির্দিষ্ট তারিখের কেবল একটি স্লট ব্লক করুন।</p>'
);
html = html.replace(
  /<label class="form-label">Time Slot to Block:<\/label>/,
  '<label class="form-label">ব্লক করার সময় স্লট:</label>'
);
html = html.replace(
  /<option value="">-- Choose Slot to Block --<\/option>/,
  '<option value="">-- ব্লক করার সময় স্লট নির্বাচন করুন --</option>'
);
html = html.replace(
  /Block This Specific Slot\s*<\/button>/,
  'এই নির্দিষ্ট স্লটটি ব্লক করুন</button>'
);

// Tab 5 Patient CRM Headers
html = html.replace(
  /<h1 style="font-size: 1.5rem; color: var\(--text-main\); margin: 0;">Patient CRM & Clinical Records<\/h1>\s*<p style="color: var\(--text-muted\); font-size: 0.85rem; margin: 0;">Comprehensive patient database, clinical histories, and visit records\.<\/p>/,
  '<h1 style="font-size: 1.5rem; color: var(--text-main); margin: 0;" data-i18n="admin_nav_patients">রোগী ব্যবস্থাপনা (CRM)</h1>\n              <p style="color: var(--text-muted); font-size: 0.85rem; margin: 0;">রোগীদের বিস্তারিত ডাটাবেজ, ক্লিনিক্যাল হিস্ট্রি ও পূর্ববর্তী ভিজিট রেকর্ড।</p>'
);
html = html.replace(
  /placeholder="Search patients by name, phone, or PID-\.\.\."/,
  'placeholder="রোগীর নাম, ফোন অথবা PID-... দিয়ে খুঁজুন"'
);
html = html.replace(
  /<th>Patient ID & Name<\/th>\s*<th>Contact & Location<\/th>\s*<th>Age & Gender<\/th>\s*<th>Total Visits<\/th>\s*<th>Registered Date<\/th>\s*<th>Action<\/th>/,
  '<th data-i18n="admin_th_patient">রোগী আইডি ও নাম</th>\n                  <th>মোবাইল ও ঠিকানা</th>\n                  <th data-i18n="admin_th_age_gender">বয়স / লিঙ্গ</th>\n                  <th data-i18n="admin_th_sessions_count">মোট সেশন</th>\n                  <th data-i18n="admin_th_date_time">নিবন্ধন তারিখ</th>\n                  <th data-i18n="admin_th_action">অ্যাকশন</th>'
);

// Tab 6 Ruqyah Sessions Headers
html = html.replace(
  /<h1 style="font-size: 1.5rem; color: var\(--text-main\); margin: 0;">Ruqyah Clinical Sessions<\/h1>\s*<p style="color: var\(--text-muted\); font-size: 0.85rem; margin: 0;">Detailed records of recited verses, observable reactions, and clinical assessments\.<\/p>/,
  '<h1 style="font-size: 1.5rem; color: var(--text-main); margin: 0;" data-i18n="admin_nav_sessions">রুকইয়াহ সেশনসমূহ</h1>\n              <p style="color: var(--text-muted); font-size: 0.85rem; margin: 0;">পঠিত আয়াত, শারীরিক প্রতিক্রিয়া এবং রাক্বীর পর্যবেক্ষণ ও ব্যবস্থাপত্র।</p>'
);
html = html.replace(
  /<th>Session ID<\/th>\s*<th>Patient Info<\/th>\s*<th>Date<\/th>\s*<th>Conducting Raqi<\/th>\s*<th>Assessment & Reactions<\/th>\s*<th>Action<\/th>/,
  '<th data-i18n="admin_th_session_id">সেশন আইডি</th>\n                  <th data-i18n="admin_th_patient">রোগীর তথ্য</th>\n                  <th data-i18n="admin_th_date_time">সেশনের তারিখ</th>\n                  <th data-i18n="admin_th_raqi">চিকিৎসক / রাক্বী</th>\n                  <th data-i18n="admin_th_assessment">পর্যবেক্ষণ ও ডায়াগনোসিস</th>\n                  <th data-i18n="admin_th_action">অ্যাকশন</th>'
);

// Tab 7 Follow-up Tracker Headers
html = html.replace(
  /<h1 style="font-size: 1.5rem; color: var\(--text-main\); margin: 0;">Patient Follow-up Tracker<\/h1>\s*<p style="color: var\(--text-muted\); font-size: 0.85rem; margin: 0;">Monitor patient recovery progression and schedule subsequent evaluation visits\.<\/p>/,
  '<h1 style="font-size: 1.5rem; color: var(--text-main); margin: 0;" data-i18n="admin_nav_followups">ফলো-আপ ট্র্যাকার</h1>\n              <p style="color: var(--text-muted); font-size: 0.85rem; margin: 0;">রোগীর আরোগ্য অগ্রগতি ও পরবর্তী সেশনের সময়সূচী ব্যবস্থাপনা।</p>'
);
html = html.replace(
  /<th>Patient<\/th>\s*<th>Last Session<\/th>\s*<th>Next Follow-up<\/th>\s*<th>Progression & Status<\/th>\s*<th>Status<\/th>\s*<th>Action<\/th>/,
  '<th data-i18n="admin_th_patient">রোগীর নাম ও আইডি</th>\n                  <th>সর্বশেষ সেশন</th>\n                  <th data-i18n="admin_th_next_followup">পরবর্তী সাক্ষাতের তারিখ</th>\n                  <th data-i18n="admin_th_progression">শারীরিক ও রূহানি অবস্থা</th>\n                  <th data-i18n="admin_th_status">স্ট্যাটাস</th>\n                  <th data-i18n="admin_th_action">অ্যাকশন</th>'
);

// Tab 8 Pricing & Services Headers
html = html.replace(
  /<h1 style="font-size: 1.5rem; color: var\(--text-main\); margin: 0;">Pricing & Services Management<\/h1>\s*<p style="color: var\(--text-muted\); font-size: 0.85rem; margin: 0;">Manage active clinic services and established fee structures\.<\/p>/,
  '<h1 style="font-size: 1.5rem; color: var(--text-main); margin: 0;" data-i18n="admin_nav_pricing">সেবামূল্য ও চার্জ</h1>\n            <p style="color: var(--text-muted); font-size: 0.85rem; margin: 0;">ক্লিনিকের সক্রিয় সেবাসমূহ ও নির্ধারিত মূল্য তালিকা।</p>'
);
html = html.replace(
  /<th>Service Code<\/th>\s*<th>Service Name<\/th>\s*<th>Category<\/th>\s*<th>Duration<\/th>\s*<th>Fee \(BDT\)<\/th>\s*<th>Status<\/th>\s*<th>Action<\/th>/,
  '<th>সেবার কোড</th>\n                <th data-i18n="admin_th_service">সেবার নাম ও বিবরণ</th>\n                <th data-i18n="admin_th_category">ক্যাটাগরি</th>\n                <th>সময়কাল</th>\n                <th data-i18n="admin_th_fee">নির্ধারিত ফি</th>\n                <th data-i18n="admin_th_status">স্ট্যাটাস</th>\n                <th data-i18n="admin_th_action">অ্যাকশন</th>'
);

// Tab 9 Reports Hub
html = html.replace(
  /<h1 style="font-size: 1.5rem; color: var\(--text-main\); margin: 0;">PDF Clinical Reports & Dossiers<\/h1>\s*<p style="color: var\(--text-muted\); font-size: 0.85rem; margin: 0;">\s*Generate official clinical reports for patient records, referral, or patient keepsakes\. Includes Patient History Dossier and Session Progress Reports\.\s*<\/p>/,
  '<h1 style="font-size: 1.5rem; color: var(--text-main); margin: 0;" data-i18n="admin_reports_title">পিডিএফ রিপোর্ট ও ক্লিনিক্যাল রেকর্ড হাব</h1>\n            <p style="color: var(--text-muted); font-size: 0.85rem; margin: 0;" data-i18n="admin_reports_sub">রোগীর পূর্ণাঙ্গ হিস্ট্রি, ৯-ক্যাটাগরি ডায়াগনোসিস এবং রুকইয়াহ সেশনের দ্বৈত-ভাষিক (বাংলা ও ইংরেজি) প্রিন্ট ও ডাউনলোড।</p>'
);

// Tab 11 Articles Headers
html = html.replace(
  /<th>Title<\/th>\s*<th>Category<\/th>\s*<th>Author<\/th>\s*<th>Status<\/th>\s*<th>Published<\/th>\s*<th>Actions<\/th>/,
  '<th data-i18n="admin_th_article_title">শিরোনাম</th>\n                  <th data-i18n="admin_th_category">ক্যাটাগরি</th>\n                  <th data-i18n="admin_th_author">লেখক</th>\n                  <th data-i18n="admin_th_status">স্ট্যাটাস</th>\n                  <th data-i18n="admin_th_published">প্রকাশের তারিখ</th>\n                  <th data-i18n="admin_th_action">অ্যাকশন</th>'
);

// Tab 12 Clinic Settings Headers
html = html.replace(
  /<h1 style="font-size: 1.5rem; color: var\(--text-main\); margin: 0;">Clinic Settings & Configuration<\/h1>\s*<p style="color: var\(--text-muted\); font-size: 0.85rem; margin: 0;">\s*Update clinic profile, operational hours, contact phone numbers, and emergency instructions\.\s*<\/p>/,
  '<h1 style="font-size: 1.5rem; color: var(--text-main); margin: 0;" data-i18n="admin_nav_settings">ক্লিনিক সেটিংস</h1>\n            <p style="color: var(--text-muted); font-size: 0.85rem; margin: 0;">প্রতিষ্ঠানের নাম, শাখা, যোগাযোগের তথ্য ও অ্যাডমিন পাসওয়ার্ড পরিবর্তন।</p>'
);

fs.writeFileSync(adminPath, html, 'utf8');
console.log('Successfully updated views/admin.html with comprehensive bilingual markup!');
