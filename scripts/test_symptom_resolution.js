const db = require('../database/db');

function resolvePatientSymptoms(patientId, diagnosis, history) {
  let categoriesMap = new Map();

  // 1. Process from diagnosis if exists
  if (diagnosis) {
    let symIds = [];
    if (diagnosis.selected_symptom_ids) {
      try {
        const parsed = JSON.parse(diagnosis.selected_symptom_ids);
        if (Array.isArray(parsed)) symIds = parsed.map(Number).filter(Boolean);
      } catch (e) {}
    }

    if (symIds.length > 0) {
      const placeholders = symIds.map(() => '?').join(',');
      const rows = db.prepare(`
        SELECT 
          s.id as symptom_id, s.category_id, s.symptom_bn, s.symptom_en, s.sort_order as symptom_sort,
          c.id as cat_id, c.code as category_code, c.name_bn as category_name_bn, c.name_en as category_name_en, c.sort_order as category_sort
        FROM diagnosis_symptoms s
        JOIN diagnosis_categories c ON s.category_id = c.id
        WHERE s.id IN (${placeholders})
        ORDER BY c.sort_order ASC, s.sort_order ASC
      `).all(...symIds);

      for (const row of rows) {
        if (!categoriesMap.has(row.category_id)) {
          categoriesMap.set(row.category_id, {
            category_id: row.category_id,
            category_code: row.category_code,
            name_bn: row.category_name_bn,
            name_en: row.category_name_en,
            sort_order: row.category_sort,
            symptoms: []
          });
        }
        categoriesMap.get(row.category_id).symptoms.push({
          id: row.symptom_id,
          name_bn: row.symptom_bn,
          name_en: row.symptom_en
        });
      }
    }

    // Also check selected_symptoms_json for any symptoms
    if (diagnosis.selected_symptoms_json) {
      try {
        const parsedJson = JSON.parse(diagnosis.selected_symptoms_json);
        if (Array.isArray(parsedJson)) {
          for (const cat of parsedJson) {
            const catId = cat.category_id || cat.id;
            if (!categoriesMap.has(catId)) {
              categoriesMap.set(catId, {
                category_id: catId,
                category_code: cat.category_code || '',
                name_bn: cat.category_name_bn || cat.name_bn || '',
                name_en: cat.category_name_en || cat.name_en || '',
                sort_order: cat.sort_order || 99,
                symptoms: []
              });
            }
            const existingSymIds = new Set(categoriesMap.get(catId).symptoms.map(s => s.id));
            for (const s of (cat.symptoms || [])) {
              if (s.id && existingSymIds.has(s.id)) continue;
              categoriesMap.get(catId).symptoms.push({
                id: s.id || null,
                name_bn: s.symptom_bn || s.name_bn || '',
                name_en: s.symptom_en || s.name_en || ''
              });
            }
          }
        }
      } catch (e) {}
    }
  }

  // 2. If categoriesMap is still empty, or to supplement from history
  if (history) {
    const parseList = (str) => {
      if (!str) return [];
      try {
        const p = JSON.parse(str);
        return Array.isArray(p) ? p : [String(str)];
      } catch {
        return [String(str)];
      }
    };

    const histCatMap = [
      { key: 'main_symptoms', catId: 1, name_bn: 'প্রধান সমস্যা ও অভিযোগ', name_en: 'Main Complaints & Presenting Symptoms' },
      { key: 'physical_symptoms', catId: 2, name_bn: 'শারীরিক অসুস্থতা ও রোগের অস্বাভাবিকতা', name_en: 'Physical Symptoms & Health Complaints' },
      { key: 'sleep_problems', catId: 3, name_bn: 'ঘুমের সমস্যা', name_en: 'Sleep-Related Problems' },
      { key: 'dream_problems', catId: 4, name_bn: 'স্বপ্নে ভীতিকর বিষয় ও দুঃস্বপ্ন', name_en: 'Bad Dreams & Nightmare Patterns' },
      { key: 'worship_problems', catId: 5, name_bn: 'ইবাদত ও দ্বীনি আমলের অবস্থা', name_en: 'Religious Practice & Spiritual State' }
    ];

    for (const hCat of histCatMap) {
      const items = parseList(history[hCat.key]);
      if (items.length > 0) {
        if (!categoriesMap.has(hCat.catId)) {
          categoriesMap.set(hCat.catId, {
            category_id: hCat.catId,
            category_code: hCat.key,
            name_bn: hCat.name_bn,
            name_en: hCat.name_en,
            sort_order: hCat.catId,
            symptoms: []
          });
        }
        const existingSymNames = new Set(categoriesMap.get(hCat.catId).symptoms.map(s => s.name_bn || s.name_en));
        for (const item of items) {
          if (!existingSymNames.has(item)) {
            // Check if matches DB symptom
            const dbMatch = db.prepare('SELECT symptom_bn, symptom_en FROM diagnosis_symptoms WHERE symptom_bn = ? OR symptom_en = ?').get(item, item);
            categoriesMap.get(hCat.catId).symptoms.push({
              id: null,
              name_bn: dbMatch ? dbMatch.symptom_bn : item,
              name_en: dbMatch ? dbMatch.symptom_en : item
            });
          }
        }
      }
    }
  }

  // Filter out any categories with 0 symptoms
  const activeCategories = Array.from(categoriesMap.values()).filter(c => c.symptoms && c.symptoms.length > 0);
  activeCategories.sort((a, b) => a.sort_order - b.sort_order);

  return activeCategories;
}

const p = db.prepare('SELECT * FROM patients WHERE patient_id = ?').get('RSCC-P-1125');
const d = db.prepare('SELECT * FROM patient_diagnoses WHERE patient_id = ?').get('RSCC-P-1125');
const h = db.prepare('SELECT * FROM patient_histories WHERE patient_id = ?').get('RSCC-P-1125');

const res = resolvePatientSymptoms('RSCC-P-1125', d, h);
console.log('Resolved categories count:', res.length);
for (const cat of res) {
  console.log(`\nCategory: ${cat.name_bn} / ${cat.name_en} (${cat.symptoms.length} symptoms)`);
  for (const s of cat.symptoms) {
    console.log(`  - [BN]: ${s.name_bn}`);
    console.log(`    [EN]: ${s.name_en}`);
  }
}
