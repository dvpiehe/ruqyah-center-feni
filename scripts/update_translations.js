const fs = require('fs');

const path = './public/js/translations.js';
let content = fs.readFileSync(path, 'utf8');

const newBnKeys = {
  "session_main_symptoms_heading": "রোগীর প্রধান উপসর্গসমূহ:",
  "session_main_symptoms_ph": "রোগীর প্রধান প্রধান উপসর্গ ও লক্ষণসমূহ লিখুন...",
  "session_physical_condition_heading": "তেলাওয়াত চলাকালীন রোগীর শারীরিক অবস্থা",
  "session_physical_obs_label": "অতিরিক্ত পর্যবেক্ষণ ও মন্তব্য (ঐচ্ছিক):",
  "session_physical_obs_ph": "তেলাওয়াতকালে রোগীর অন্যান্য বিশেষ শারীরিক লক্ষণ বা পর্যবেক্ষণ লিখুন...",
  "session_manual_diagnosis_heading": "রাকীর প্রাথমিক ডায়াগনোসিস",
  "session_manual_diagnosis_sub": "রাক্বী নিজে পর্যবেক্ষণ অনুযায়ী এক বা একাধিক ডায়াগনোসিস নির্বাচন করবেন (স্বয়ংক্রিয় নয়):",
  "diag_opt_ayn": "আইন (Ayn)",
  "diag_opt_hasad": "হাসাদ (Hasad)",
  "diag_opt_sihr": "সেহের (Sihr)",
  "diag_opt_jinn": "জ্বিনের প্রভাব (Jinn Influence)",
  "diag_opt_ayn_hasad": "আইন + হাসাদ",
  "diag_opt_ayn_sihr": "আইন + সেহের",
  "diag_opt_hasad_sihr": "হাসাদ + সেহের",
  "diag_opt_jinn_sihr": "জ্বিন + সেহের",
  "diag_opt_multiple": "একাধিক সমস্যা (Multiple)",
  "diag_opt_normal": "নরমাল / নির্দিষ্ট কোনো লক্ষণ শনাক্ত হয়নি (Normal)",
  "diag_opt_other": "অন্যান্য (Other)",
  "session_prescribed_amal_heading": "প্রেসক্রাইবকৃত আমল",
  "session_prescribed_amal_ph": "রোগীর জন্য নির্দিষ্ট প্রেসক্রাইবকৃত আমল, দোয়া ও নিয়মাবলী এখানে লিখুন...",
  "session_raqi_comments_heading": "রাকীর মন্তব্য",
  "session_raqi_comments_ph": "রোগীর অবস্থা, ক্লিনিক্যাল পর্যবেক্ষণ ও ব্যক্তিগত মন্তব্য লিখুন...",
  "session_special_advice_heading": "বিশেষ নসিহত",
  "session_special_advice_ph": "রোগী ও পরিবারের জন্য বিশেষ নসিহত, নির্দেশনা ও সতর্কতা লিখুন...",
  "dossier_tab_diagnosis_10": "🩺 ১০টি ক্যাটাগরির বিস্তারিত ডায়াগনোসিস",
  "dossier_title_diagnosis_10": "১০টি ক্যাটাগরির বিস্তারিত প্রাক-ডায়াগনোসিস ফরম"
};

const newEnKeys = {
  "session_main_symptoms_heading": "Patient's Main Symptoms:",
  "session_main_symptoms_ph": "Enter primary presenting symptoms and complaints...",
  "session_physical_condition_heading": "Patient's Physical Condition During Recitation",
  "session_physical_obs_label": "Additional Physical Observations (Optional):",
  "session_physical_obs_ph": "Enter other physical signs or reactions observed during recitation...",
  "session_manual_diagnosis_heading": "Raqi's Preliminary Diagnosis",
  "session_manual_diagnosis_sub": "The Raqi manually selects the suspected diagnosis based on clinical discernment (never automated):",
  "diag_opt_ayn": "Ayn (Evil Eye)",
  "diag_opt_hasad": "Hasad (Envy / Malice)",
  "diag_opt_sihr": "Sihr (Magic / Sorcery)",
  "diag_opt_jinn": "Jinn Influence (Possession / Touch)",
  "diag_opt_ayn_hasad": "Ayn + Hasad",
  "diag_opt_ayn_sihr": "Ayn + Sihr",
  "diag_opt_hasad_sihr": "Hasad + Sihr",
  "diag_opt_jinn_sihr": "Jinn + Sihr",
  "diag_opt_multiple": "Multiple Afflictions",
  "diag_opt_normal": "Normal / No Specific Symptoms Detected",
  "diag_opt_other": "Other",
  "session_prescribed_amal_heading": "Prescribed Amal",
  "session_prescribed_amal_ph": "Enter prescribed Amal, supplications, and instructions for the patient here...",
  "session_raqi_comments_heading": "Raqi's Comments",
  "session_raqi_comments_ph": "Enter personal clinical observations and comments regarding the patient...",
  "session_special_advice_heading": "Special Advice",
  "session_special_advice_ph": "Enter special advice, spiritual counsel, and guidance for patient and family...",
  "dossier_tab_diagnosis_10": "🩺 10-Category Clinical Diagnosis",
  "dossier_title_diagnosis_10": "10-Category Clinical Pre-Diagnosis Assessment"
};

// Insert into bn block
const bnMarker = '"session_btn_save": "💾 সেশন সংরক্ষণ ও রিপোর্ট তৈরি করুন",';
let bnInsert = '\n';
for (const [k, v] of Object.entries(newBnKeys)) {
  bnInsert += `  "${k}": "${v.replace(/"/g, '\\"')}",\n`;
}

if (content.includes(bnMarker)) {
  content = content.replace(bnMarker, bnMarker + bnInsert);
} else {
  console.warn('Could not find bnMarker');
}

// Insert into en block
const enMarker = '"session_btn_save": "💾 Save Session & Generate Report",';
let enInsert = '\n';
for (const [k, v] of Object.entries(newEnKeys)) {
  enInsert += `  "${k}": "${v.replace(/"/g, '\\"')}",\n`;
}

if (content.includes(enMarker)) {
  content = content.replace(enMarker, enMarker + enInsert);
} else {
  console.warn('Could not find enMarker');
}

fs.writeFileSync(path, content, 'utf8');
console.log('Successfully updated translations.js');
