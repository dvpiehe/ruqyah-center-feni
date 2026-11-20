const fs = require('fs');

let content = fs.readFileSync('./views/admin.html', 'utf8');

const targetModalStart = content.indexOf('<div id="newSessionModal"');
const marker = 'MODAL 7: FOLLOW-UP';
const targetModalEnd = content.lastIndexOf('<!-- ==============================================================', content.indexOf(marker));

if (targetModalStart === -1 || targetModalEnd === -1) {
  console.error('Could not find newSessionModal boundaries in admin.html', { targetModalStart, targetModalEnd });
  process.exit(1);
}

const newModalHtml = `<div id="newSessionModal" class="modal-overlay">
    <div class="modal-container" style="max-width: 850px;">
      <div class="modal-header">
        <h3 style="margin: 0; color: var(--primary);" data-i18n="session_modal_title">রুকইয়াহ তিলাওয়াত ও ডায়াগনস্টিক সেশন রেকর্ড</h3>
        <button class="modal-close" onclick="closeModal('newSessionModal')">✕</button>
      </div>
      <div class="modal-body">
        <form id="newSessionForm">
          <input type="hidden" id="editingSessionId" value="">
          
          <div style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 0.75rem; margin-bottom: 1rem;">
            <div class="form-group">
              <label class="form-label" data-i18n="session_select_patient">রোগী নির্বাচন করুন *</label>
              <select id="newSessionPatientSelect" class="form-control" required></select>
            </div>
            <div class="form-group">
              <label class="form-label" data-i18n="session_date">সেশনের তারিখ *</label>
              <input type="date" id="newSessionDate" class="form-control" required>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1rem;">
            <div class="form-group">
              <label class="form-label" data-i18n="session_raqi_name">চিকিৎসক / রাক্বী:</label>
              <input type="text" id="newSessionRaqiName" class="form-control" value="মুহাম্মদুল্লাহ মিয়া">
            </div>
            <div class="form-group">
              <label class="form-label" data-i18n="session_medical_history">ডাক্তারি হিস্ট্রি যাচাই:</label>
              <input type="text" id="newSessionMedicalHistory" class="form-control" data-i18n-placeholder="session_medical_history_ph" placeholder="যেমন: ইসিজি নরমাল, শারীরিক কোনো প্যাথলজি নেই">
            </div>
          </div>

          <!-- Section 1: Patient's Main Symptoms -->
          <div class="card" style="margin-bottom: 1.25rem; border-left: 4px solid var(--primary);">
            <h4 style="color: var(--primary); margin-bottom: 0.4rem;" data-i18n="session_main_symptoms_heading">রোগীর প্রধান উপসর্গসমূহ:</h4>
            <div class="form-group" style="margin-bottom: 0;">
              <textarea id="newSessionMainSymptoms" class="form-control" rows="2" data-i18n-placeholder="session_main_symptoms_ph" placeholder="রোগীর প্রধান প্রধান উপসর্গ ও লক্ষণসমূহ লিখুন..."></textarea>
            </div>
          </div>

          <!-- Section 2: Patient's Physical Condition During Recitation -->
          <div class="card" style="margin-bottom: 1.25rem; border-left: 4px solid var(--accent-gold);">
            <h4 style="color: var(--accent-gold); margin-bottom: 0.4rem;" data-i18n="session_physical_condition_heading">তেলাওয়াত চলাকালীন রোগীর শারীরিক অবস্থা</h4>
            <div class="chip-group" id="sessionReactionsChipGroup">
              <label class="chip-label"><input type="checkbox" name="observed_reactions" value="Trembling / involuntary shivering in limbs"><span data-i18n="session_react_trembling">অঙ্গপ্রত্যঙ্গে কাঁপুনি বা কম্পন</span></label>
              <label class="chip-label"><input type="checkbox" name="observed_reactions" value="Deep repeated yawning"><span data-i18n="session_react_yawning">বারবার গভীর হাই তোলা</span></label>
              <label class="chip-label"><input type="checkbox" name="observed_reactions" value="Profuse cold sweating"><span data-i18n="session_react_sweating">শরীর ঠান্ডা হয়ে ঘাম বের হওয়া</span></label>
              <label class="chip-label"><input type="checkbox" name="observed_reactions" value="Sudden weeping / tears without grief"><span data-i18n="session_react_weeping">অকারণে হঠাৎ কান্না বা অশ্রুপাত</span></label>
              <label class="chip-label"><input type="checkbox" name="observed_reactions" value="Nausea / urge to vomit"><span data-i18n="session_react_nausea">বমি বমি ভাব বা বমির তীব্র বেগ</span></label>
              <label class="chip-label"><input type="checkbox" name="observed_reactions" value="Vocal alteration / involuntary speech"><span data-i18n="session_react_vocal">কণ্ঠস্বরের পরিবর্তন বা অনৈচ্ছিক কথা</span></label>
              <label class="chip-label"><input type="checkbox" name="observed_reactions" value="Rapid heart palpitations"><span data-i18n="session_react_palpitations">হৃদস্পন্দন দ্রুত হওয়া বা ধড়ফড়</span></label>
              <label class="chip-label"><input type="checkbox" name="observed_reactions" value="Temporary numbness or paralysis in hands/feet"><span data-i18n="session_react_numbness">হাত-পায়ে অবশ ভাব বা অসাড়তা</span></label>
              <label class="chip-label"><input type="checkbox" name="observed_reactions" value="Calmness / no adverse physical reaction"><span data-i18n="session_react_calmness">স্বাভাবিক বা কোনো অস্বাভাবিক প্রতিক্রিয়া নেই</span></label>
            </div>
            <div class="form-group" style="margin-top: 0.85rem; margin-bottom: 0;">
              <label class="form-label" data-i18n="session_physical_obs_label">অতিরিক্ত পর্যবেক্ষণ ও মন্তব্য (ঐচ্ছিক):</label>
              <textarea id="newSessionPhysicalObservations" class="form-control" rows="2" data-i18n-placeholder="session_physical_obs_ph" placeholder="তেলাওয়াতকালে রোগীর অন্যান্য বিশেষ শারীরিক লক্ষণ বা পর্যবেক্ষণ লিখুন..."></textarea>
            </div>
          </div>

          <!-- Section 3: Raqi's Preliminary Diagnosis -->
          <div class="card" style="margin-bottom: 1.25rem; border-left: 4px solid var(--primary-light);">
            <h4 style="color: var(--primary); margin-bottom: 0.4rem;" data-i18n="session_manual_diagnosis_heading">রাকীর প্রাথমিক ডায়াগনোসিস</h4>
            <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.75rem;" data-i18n="session_manual_diagnosis_sub">
              রাক্বী নিজে পর্যবেক্ষণ অনুযায়ী এক বা একাধিক ডায়াগনোসিস নির্বাচন করবেন (স্বয়ংক্রিয় নয়):
            </p>
            <div class="chip-group" id="sessionManualDiagnosisGroup">
              <label class="chip-label"><input type="checkbox" name="manual_diagnosis" value="আইন (Ayn)"><span data-i18n="diag_opt_ayn">আইন (Ayn)</span></label>
              <label class="chip-label"><input type="checkbox" name="manual_diagnosis" value="হাসাদ (Hasad)"><span data-i18n="diag_opt_hasad">হাসাদ (Hasad)</span></label>
              <label class="chip-label"><input type="checkbox" name="manual_diagnosis" value="সেহের (Sihr)"><span data-i18n="diag_opt_sihr">সেহের (Sihr)</span></label>
              <label class="chip-label"><input type="checkbox" name="manual_diagnosis" value="জ্বিনের প্রভাব (Jinn Influence)"><span data-i18n="diag_opt_jinn">জ্বিনের প্রভাব (Jinn Influence)</span></label>
              <label class="chip-label"><input type="checkbox" name="manual_diagnosis" value="আইন + হাসাদ"><span data-i18n="diag_opt_ayn_hasad">আইন + হাসাদ</span></label>
              <label class="chip-label"><input type="checkbox" name="manual_diagnosis" value="আইন + সেহের"><span data-i18n="diag_opt_ayn_sihr">আইন + সেহের</span></label>
              <label class="chip-label"><input type="checkbox" name="manual_diagnosis" value="হাসাদ + সেহের"><span data-i18n="diag_opt_hasad_sihr">হাসাদ + সেহের</span></label>
              <label class="chip-label"><input type="checkbox" name="manual_diagnosis" value="জ্বিন + সেহের"><span data-i18n="diag_opt_jinn_sihr">জ্বিন + সেহের</span></label>
              <label class="chip-label"><input type="checkbox" name="manual_diagnosis" value="একাধিক সমস্যা (Multiple)"><span data-i18n="diag_opt_multiple">একাধিক সমস্যা (Multiple)</span></label>
              <label class="chip-label"><input type="checkbox" name="manual_diagnosis" value="নরমাল / নির্দিষ্ট কোনো লক্ষণ শনাক্ত হয়নি (Normal)"><span data-i18n="diag_opt_normal">নরমাল / নির্দিষ্ট কোনো লক্ষণ শনাক্ত হয়নি (Normal)</span></label>
              <label class="chip-label"><input type="checkbox" name="manual_diagnosis" value="অন্যান্য (Other)"><span data-i18n="diag_opt_other">অন্যান্য (Other)</span></label>
            </div>
          </div>

          <!-- Section 4: Prescribed Amal -->
          <div class="card" style="margin-bottom: 1.25rem;">
            <h4 style="color: var(--primary); margin-bottom: 0.4rem;" data-i18n="session_prescribed_amal_heading">প্রেসক্রাইবকৃত আমল</h4>
            <div class="form-group" style="margin-bottom: 0;">
              <textarea id="newSessionPrescribedAmal" class="form-control" rows="4" data-i18n-placeholder="session_prescribed_amal_ph" placeholder="রোগীর জন্য নির্দিষ্ট প্রেসক্রাইবকৃত আমল, দোয়া ও নিয়মাবলী এখানে লিখুন..."></textarea>
            </div>
          </div>

          <!-- Section 5: Raqi's Comments -->
          <div class="card" style="margin-bottom: 1.25rem;">
            <h4 style="color: var(--primary); margin-bottom: 0.4rem;" data-i18n="session_raqi_comments_heading">রাকীর মন্তব্য</h4>
            <div class="form-group" style="margin-bottom: 0;">
              <textarea id="newSessionRaqiComments" class="form-control" rows="3" data-i18n-placeholder="session_raqi_comments_ph" placeholder="রোগীর অবস্থা, ক্লিনিক্যাল পর্যবেক্ষণ ও ব্যক্তিগত মন্তব্য লিখুন..."></textarea>
            </div>
          </div>

          <!-- Section 6: Special Advice -->
          <div class="card" style="margin-bottom: 1.25rem;">
            <h4 style="color: var(--primary); margin-bottom: 0.4rem;" data-i18n="session_special_advice_heading">বিশেষ নসিহত</h4>
            <div class="form-group" style="margin-bottom: 0;">
              <textarea id="newSessionSpecialAdvice" class="form-control" rows="3" data-i18n-placeholder="session_special_advice_ph" placeholder="রোগী ও পরিবারের জন্য বিশেষ নসিহত, নির্দেশনা ও সতর্কতা লিখুন..."></textarea>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr; gap: 0.75rem; margin-bottom: 1rem;">
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label" data-i18n="session_followup_label">পরবর্তী ফলো-আপের তারিখ (ঐচ্ছিক):</label>
              <input type="date" id="newSessionFollowupDate" class="form-control">
            </div>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 0.5rem;">
            <button type="button" class="btn btn-secondary" onclick="closeModal('newSessionModal')" data-i18n="session_btn_cancel">বাতিল</button>
            <button type="submit" class="btn btn-primary" id="btnSaveSession" data-i18n="session_btn_save">💾 সেশন সংরক্ষণ ও রিপোর্ট তৈরি করুন</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  `;

content = content.substring(0, targetModalStart) + newModalHtml + content.substring(targetModalEnd);
fs.writeFileSync('./views/admin.html', content, 'utf8');
console.log('Successfully updated newSessionModal in admin.html');
