const fs = require('fs');

const path = './public/js/admin.js';
let content = fs.readFileSync(path, 'utf8');

// 1. Update tab label and header from 9 to 10 categories
content = content.replace('🩺 ৯টি ক্যাটাগরির বিস্তারিত ডায়াগনোসিস', '🩺 ১০টি ক্যাটাগরির বিস্তারিত ডায়াগনোসিস');
content = content.replace('৯টি ক্যাটাগরির বিস্তারিত প্রাক-ডায়াগনোসিস ফরম', '১০টি ক্যাটাগরির বিস্তারিত প্রাক-ডায়াগনোসিস ফরম');
content = content.replace('Select observed clinical symptoms across all 9 categories', 'Select observed clinical symptoms across all 10 categories');
content = content.replace('all 9 categories (English Translation View)', 'all 10 categories (English Translation View)');
content = content.replace('The 9 Diagnosis Categories (Each having at least 10 symptoms)', 'The 10 Diagnosis Categories (Category 1: Free-text Main Symptoms, Categories 2-10: Selectable Symptoms)');

// 2. Update category mapping in openPatientModal
// Specifically, Category 1 (patient_main_symptoms or catIdx === 0) must render ONLY heading and one empty textarea
const oldCatMapStart = "${categories.map((cat, catIdx) => {";
const oldCatMapIdx = content.indexOf(oldCatMapStart);

if (oldCatMapIdx === -1) {
  console.error('Could not find categories.map in admin.js');
  process.exit(1);
}

// Find the end of this map expression
const oldCatMapEnd = content.indexOf(".join('')}", oldCatMapIdx) + 10;

const newCatMap = `\${categories.map((cat, catIdx) => {
            const syms = cat.symptoms || [];
            const isBnCat = (currentDossierLang || (typeof getCurrentLang === 'function' ? getCurrentLang() : 'bn')) === 'bn';
            const primaryCatName = isBnCat ? cat.name_bn : (cat.name_en || cat.name_bn);
            const secondaryCatName = isBnCat ? cat.name_en : cat.name_bn;
            const catDesc = isBnCat ? (cat.description_bn || cat.description_en || '') : (cat.description_en || cat.description_bn || '');

            // REQUIREMENT 7: Category 1 (রোগীর প্রধান উপসর্গসমূহ / Patient's Main Symptoms)
            // Must contain ONLY: A category heading and ONE empty textarea for manually writing patient's main symptoms.
            // No checkboxes, no subcategories, no extra fields.
            if (cat.code === 'patient_main_symptoms' || catIdx === 0) {
              return \`
                <div class="card" style="border-left: 4px solid var(--primary); padding: 1.25rem; border-radius: var(--radius-md); box-shadow: var(--shadow-sm); background: #FFFFFF;">
                  <div style="margin-bottom: 0.75rem; border-bottom: 1px solid var(--border-light); padding-bottom: 0.5rem;">
                    <h4 style="color: var(--primary); margin: 0 0 0.2rem 0; font-size: 1.1rem;">
                      \${catIdx + 1}. \${primaryCatName}
                    </h4>
                    <div style="font-size: 0.85rem; color: var(--text-muted); font-weight: 500;">
                      \${secondaryCatName}
                    </div>
                  </div>
                  <div>
                    <textarea id="diagMainComplaintsText" class="form-control" rows="4" placeholder="\${isBnCat ? 'রোগীর প্রধান প্রধান উপসর্গ ও লক্ষণসমূহ এখানে লিখুন...' : 'Enter patient\\'s main symptoms and chief complaints here...'}" style="width: 100%; border: 1.5px solid var(--primary-border); border-radius: 6px; padding: 0.75rem; font-size: 0.92rem;">\${diagnosis?.main_complaints_text || ''}</textarea>
                  </div>
                </div>
              \`;
            }

            // Categories 2 to 10: Standard Selectable Symptom Grids
            return \`
              <div class="card" style="border-left: 4px solid var(--primary); padding: 1.25rem; border-radius: var(--radius-md); box-shadow: var(--shadow-sm); background: #FFFFFF;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem; border-bottom: 1px solid var(--border-light); padding-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
                  <div>
                    <h4 style="color: var(--primary); margin: 0 0 0.2rem 0; font-size: 1.1rem;">
                      \${catIdx + 1}. \${primaryCatName}
                    </h4>
                    <div style="font-size: 0.85rem; color: var(--text-muted); font-weight: 500;">
                      \${secondaryCatName}
                    </div>
                    <div style="font-size: 0.8rem; color: var(--text-main); margin-top: 0.25rem;">
                      \${catDesc}
                    </div>
                  </div>
                  <div style="display: flex; gap: 0.35rem;">
                    <button type="button" class="btn btn-xs btn-outline-primary" onclick="toggleCategoryAll(\${cat.id}, true)" style="font-size: 0.75rem;">
                      ✓ \${isBn ? 'সব নির্বাচন' : 'Select All'}
                    </button>
                    <button type="button" class="btn btn-xs btn-secondary" onclick="toggleCategoryAll(\${cat.id}, false)" style="font-size: 0.75rem;">
                      ✕ \${isBn ? 'সব বাতিল' : 'Clear All'}
                    </button>
                  </div>
                </div>

                <!-- Checkboxes Grid -->
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 0.6rem;">
                  \${syms.map((s, sIdx) => {
                    const isChecked = savedSymptomIds.includes(s.id);
                    const isSuicide = (s.symptom_bn && s.symptom_bn.includes('আত্মহত্যা')) || (s.symptom_en && s.symptom_en.toLowerCase().includes('suicid'));
                    const primarySym = isBnCat ? s.symptom_bn : (s.symptom_en || s.symptom_bn);
                    const secondarySym = isBnCat ? s.symptom_en : s.symptom_bn;
                    return \`
                      <label style="display: flex; align-items: flex-start; gap: 0.6rem; padding: 0.6rem 0.75rem; border: \${isSuicide ? '1.5px solid #FCA5A5' : '1px solid var(--border-light)'}; border-radius: 6px; background: \${isChecked ? (isSuicide ? '#FEF2F2' : '#F0FDF4') : '#FAFAFA'}; cursor: pointer; transition: all 0.15s ease;">
                        <input type="checkbox" class="diag-symptom-cb" 
                          data-cat-id="\${cat.id}" 
                          data-cat-name-bn="\${cat.name_bn}" 
                          data-cat-name-en="\${cat.name_en}"
                          data-sym-bn="\${s.symptom_bn}" 
                          data-sym-en="\${s.symptom_en}"
                          data-is-suicide="\${isSuicide ? '1' : '0'}"
                          value="\${s.id}" 
                          \${isChecked ? 'checked' : ''} 
                          onchange="onDiagnosisCheckboxChange(this)" 
                          style="margin-top: 3px; accent-color: \${isSuicide ? '#DC2626' : 'var(--primary)'}; width: 17px; height: 17px; cursor: pointer;">
                        <div style="flex: 1;">
                          <div style="font-size: 0.85rem; font-weight: 600; color: \${isSuicide ? '#991B1B' : 'var(--text-main)'}; line-height: 1.4;">
                            \${sIdx + 1}. \${primarySym}
                            \${isSuicide ? '<span class="badge badge-danger" style="font-size: 0.7rem; margin-left: 4px; vertical-align: middle;">⚠️ জরুরি বিবেচনা</span>' : ''}
                          </div>
                          <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">
                            \${secondarySym}
                          </div>
                        </div>
                      </label>
                    \`;
                  }).join('')}
                </div>

                \${cat.code === 'onset_history' ? \`
                  <!-- Problem Onset History Notes -->
                  <div style="margin-top: 0.85rem; padding-top: 0.75rem; border-top: 1px dashed var(--border-light);">
                    <label style="font-size: 0.85rem; font-weight: 700; color: #064E3B; display: block; margin-bottom: 0.35rem;">
                      📝 সমস্যা শুরুর সময় ও পটভূমির বিবরণ (ঐচ্ছিক নোটস):
                    </label>
                    <textarea id="diagOnsetHistoryNotes" class="form-control" rows="2" placeholder="সমস্যা কবে কীভাবে শুরু হয়েছিল... \">\${diagnosis?.onset_history_notes || ''}</textarea>
                  </div>
                \` : ''}

                \${cat.code === 'family_social' ? \`
                  <!-- Family & Social History Notes -->
                  <div style="margin-top: 0.85rem; padding-top: 0.75rem; border-top: 1px dashed var(--border-light);">
                    <label style="font-size: 0.85rem; font-weight: 700; color: #064E3B; display: block; margin-bottom: 0.35rem;">
                      👨‍👩‍👧‍👦 পারিবারিক ও সামাজিক পটভূমির বিবরণ (ঐচ্ছিক নোটস):
                    </label>
                    <textarea id="diagFamilySocialNotes" class="form-control" rows="2" placeholder="পারিবারিক কোনো বিশেষ সমস্যা বা সামাজিক পরিবেশের বিবরণ... \">\${diagnosis?.family_social_notes || ''}</textarea>
                  </div>
                \` : ''}
              </div>
            \`;
          }).join('')}`;

content = content.substring(0, oldCatMapIdx) + newCatMap + content.substring(oldCatMapEnd);

// 3. Update newSessionForm submit handler and openNewSessionForPatient / openSessionModal
const submitHandlerStart = content.indexOf("// Handle Record Session Form Submit");
const submitHandlerEnd = content.indexOf("// ==========================================================================\n// 7. FOLLOW-UP MANAGEMENT", submitHandlerStart);

if (submitHandlerStart === -1 || submitHandlerEnd === -1) {
  console.error('Could not find submitHandler block in admin.js');
  process.exit(1);
}

const newSubmitAndReopenHandlers = `// Reopen / Edit Session in Modal
async function openSessionModal(sessionId) {
  try {
    const res = await fetch(\`/api/admin/sessions/\${sessionId}\`);
    const data = await res.json();
    if (!data.success || !data.data) {
      showToast('Could not load session details.', 'error');
      return;
    }
    const s = data.data;

    // Set Patient in select
    const patientSelect = document.getElementById('newSessionPatientSelect');
    if (patientSelect) {
      patientSelect.innerHTML = '<option value="">-- Choose Patient --</option>';
      allPatientsCache.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.patient_id;
        opt.textContent = \`\${p.full_name} (\${p.patient_id})\`;
        if (p.patient_id === s.patient_id) opt.selected = true;
        patientSelect.appendChild(opt);
      });
      patientSelect.value = s.patient_id;
    }

    document.getElementById('editingSessionId').value = s.session_id || s.id;
    document.getElementById('newSessionDate').value = s.session_date;
    document.getElementById('newSessionRaqiName').value = s.raqi_name || 'মুহাম্মদুল্লাহ মিয়া';
    document.getElementById('newSessionMedicalHistory').value = s.medical_history_checked || '';
    document.getElementById('newSessionMainSymptoms').value = s.patient_main_symptoms || s.reported_symptoms || '';
    document.getElementById('newSessionPhysicalObservations').value = s.physical_observations || s.raqi_observations || '';
    document.getElementById('newSessionPrescribedAmal').value = s.prescribed_amal || (typeof s.prescribed_remedies === 'string' && !s.prescribed_remedies.startsWith('[') ? s.prescribed_remedies : '') || '';
    document.getElementById('newSessionRaqiComments').value = s.raqi_comments || s.professional_assessment || '';
    document.getElementById('newSessionSpecialAdvice').value = s.special_advice || s.recommendations || '';
    document.getElementById('newSessionFollowupDate').value = s.next_followup_date || '';

    // Observed Reactions Checkboxes
    let reactions = [];
    try {
      reactions = JSON.parse(s.observed_reactions || '[]');
    } catch {
      reactions = s.observed_reactions ? [s.observed_reactions] : [];
    }
    document.querySelectorAll('#newSessionModal input[name="observed_reactions"]').forEach(cb => {
      cb.checked = reactions.includes(cb.value);
    });

    // Manual Diagnosis Checkboxes
    let diags = [];
    try {
      diags = JSON.parse(s.manual_diagnosis || '[]');
    } catch {
      diags = s.manual_diagnosis ? [s.manual_diagnosis] : (s.assessment_category ? s.assessment_category.split(',').map(d => d.trim()) : []);
    }
    document.querySelectorAll('#newSessionModal input[name="manual_diagnosis"]').forEach(cb => {
      cb.checked = diags.includes(cb.value) || (s.assessment_category && s.assessment_category.includes(cb.value));
    });

    openModal('newSessionModal');
  } catch (err) {
    showToast('Failed to open session for editing.', 'error');
  }
}

function openNewSessionForPatient(patientId = '') {
  document.getElementById('newSessionForm')?.reset();
  const editingIdInput = document.getElementById('editingSessionId');
  if (editingIdInput) editingIdInput.value = '';

  document.querySelectorAll('#newSessionModal input[type="checkbox"]').forEach(cb => cb.checked = false);

  const patientSelect = document.getElementById('newSessionPatientSelect');
  if (patientSelect) {
    patientSelect.innerHTML = '<option value="">-- Choose Patient --</option>';
    allPatientsCache.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.patient_id;
      opt.textContent = \`\${p.full_name} (\${p.patient_id})\`;
      if (p.patient_id === patientId) opt.selected = true;
      patientSelect.appendChild(opt);
    });
    if (patientId) patientSelect.value = patientId;
  }

  const sessionDateInput = document.getElementById('newSessionDate');
  if (sessionDateInput) {
    sessionDateInput.value = new Date().toISOString().split('T')[0];
  }

  openModal('newSessionModal');
}

// Handle Record Session Form Submit
document.getElementById('newSessionForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const getCheckedValues = (name) => {
    const checked = document.querySelectorAll(\`input[name="\${name}"]:checked\`);
    return Array.from(checked).map(c => c.value);
  };

  const editingId = document.getElementById('editingSessionId')?.value;
  const manualDiagnosisList = getCheckedValues('manual_diagnosis');

  const mainSymptomsText = document.getElementById('newSessionMainSymptoms')?.value?.trim() || '';
  const physicalObsText = document.getElementById('newSessionPhysicalObservations')?.value?.trim() || '';
  const prescribedAmalText = document.getElementById('newSessionPrescribedAmal')?.value?.trim() || '';
  const raqiCommentsText = document.getElementById('newSessionRaqiComments')?.value?.trim() || '';
  const specialAdviceText = document.getElementById('newSessionSpecialAdvice')?.value?.trim() || '';

  const payload = {
    patient_id: document.getElementById('newSessionPatientSelect')?.value,
    session_date: document.getElementById('newSessionDate')?.value,
    raqi_name: document.getElementById('newSessionRaqiName')?.value || 'মুহাম্মদুল্লাহ মিয়া',
    medical_history_checked: document.getElementById('newSessionMedicalHistory')?.value?.trim(),
    patient_main_symptoms: mainSymptomsText,
    reported_symptoms: mainSymptomsText,
    observed_reactions: getCheckedValues('observed_reactions'),
    physical_observations: physicalObsText,
    raqi_observations: physicalObsText,
    manual_diagnosis: manualDiagnosisList,
    assessment_category: manualDiagnosisList.length > 0 ? manualDiagnosisList.join(', ') : 'Spiritual Affliction Evaluated',
    prescribed_amal: prescribedAmalText,
    prescribed_remedies: prescribedAmalText,
    raqi_comments: raqiCommentsText,
    professional_assessment: raqiCommentsText,
    special_advice: specialAdviceText,
    recommendations: specialAdviceText,
    next_followup_date: document.getElementById('newSessionFollowupDate')?.value || null
  };

  if (!payload.patient_id || !payload.session_date) {
    showToast('Please select Patient and Session Date.', 'error');
    return;
  }

  if (manualDiagnosisList.length === 0) {
    showToast('অনুগ্রহ করে রাকির প্রাথমিক ডায়াগনোসিস থেকে অন্তত একটি অপশন নির্বাচন করুন।', 'error');
    return;
  }

  try {
    const url = editingId ? \`/api/admin/sessions/\${editingId}\` : '/api/admin/sessions';
    const method = editingId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.success) {
      showToast(data.message || 'সেশন সফলভাবে সংরক্ষিত হয়েছে।', 'success');
      closeModal('newSessionModal');
      document.getElementById('newSessionForm')?.reset();
      const editingIdInput = document.getElementById('editingSessionId');
      if (editingIdInput) editingIdInput.value = '';
      loadSessionsList();
      loadDashboardData();
    } else {
      showToast(data.error || 'সেশন সংরক্ষণ ব্যর্থ হয়েছে।', 'error');
    }
  } catch (err) {
    showToast('Failed to save session.', 'error');
  }
});
`;

content = content.substring(0, submitHandlerStart) + newSubmitAndReopenHandlers + '\n' + content.substring(submitHandlerEnd);

// 4. Update loadSessionsList to include Edit / View button
const oldSessionBtnRow = `<a href="/reports/view/session/\${s.session_id}" target="_blank" class="btn btn-outline-secondary btn-xs">
                \${isBn ? 'দেখুন' : 'View'}
              </a>`;
const newSessionBtnRow = `<button type="button" class="btn btn-outline-primary btn-xs" onclick="openSessionModal('\${s.session_id}')">
                \${isBn ? 'এডিট / বিবরণী' : 'Edit / Details'}
              </button>
              <a href="/reports/view/session/\${s.session_id}" target="_blank" class="btn btn-outline-secondary btn-xs">
                \${isBn ? 'প্রিন্ট' : 'Print'}
              </a>`;

if (content.includes(oldSessionBtnRow)) {
  content = content.replace(oldSessionBtnRow, newSessionBtnRow);
}

// 5. Update renderDossierSessions to include Edit button
const oldDossierBtnRow = `<a href="/reports/view/session/\${s.session_id}" target="_blank" class="btn btn-outline-secondary btn-sm">
              Print
            </a>`;
const newDossierBtnRow = `<button type="button" class="btn btn-outline-primary btn-sm" onclick="openSessionModal('\${s.session_id}')">
              ✏️ \${(typeof getCurrentLang === 'function' && getCurrentLang() === 'bn') ? 'এডিট / খুলুন' : 'Edit / Details'}
            </button>
            <a href="/reports/view/session/\${s.session_id}" target="_blank" class="btn btn-outline-secondary btn-sm">
              Print
            </a>`;

if (content.includes(oldDossierBtnRow)) {
  content = content.replace(oldDossierBtnRow, newDossierBtnRow);
}

fs.writeFileSync(path, content, 'utf8');
console.log('Successfully updated public/js/admin.js');
