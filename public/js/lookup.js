/**
 * Ruqyah Support & Cupping Center - Appointment Status Lookup Script
 */

document.addEventListener('DOMContentLoaded', () => {
  const lookupForm = document.getElementById('lookupForm');
  const lookupInput = document.getElementById('lookupInput');
  const lookupResults = document.getElementById('lookupResults');
  const lookupLoading = document.getElementById('lookupLoading');

  // Check if URL has query parameter 'q'
  const urlParams = new URLSearchParams(window.location.search);
  const q = urlParams.get('q');
  if (q && lookupInput) {
    lookupInput.value = q;
    performLookup(q);
  }

  if (lookupForm) {
    lookupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = lookupInput?.value?.trim();
      if (!val) {
        showToast('Please enter an Appointment ID or Mobile Number.', 'error');
        return;
      }
      performLookup(val);
    });
  }

  async function performLookup(query) {
    if (!lookupResults) return;
    if (lookupLoading) lookupLoading.style.display = 'block';
    lookupResults.innerHTML = '';

    try {
      const res = await fetch(`/api/public/lookup?q=${encodeURIComponent(query)}`);
      const data = await res.json();

      if (lookupLoading) lookupLoading.style.display = 'none';

      if (!data.success || !data.data || data.data.length === 0) {
        lookupResults.innerHTML = `
          <div class="card" style="text-align: center; padding: 3rem 1.5rem;">
            <div style="font-size: 2.5rem; margin-bottom: 0.75rem;">🔍</div>
            <h3 style="color: var(--text-main); margin-bottom: 0.5rem;">No Appointments Found</h3>
            <p style="color: var(--text-muted); max-width: 480px; margin: 0 auto 1.5rem;">
              We could not find any active appointments matching "<strong>${query}</strong>". Please double check your Appointment ID or mobile phone number.
            </p>
            <a href="/book" class="btn btn-primary">Book New Appointment</a>
          </div>
        `;
        return;
      }

      // Render cards
      let html = `<h3 style="margin-bottom: 1.25rem;">Found ${data.data.length} Appointment Record(s)</h3>`;
      data.data.forEach(apt => {
        let badgeClass = 'badge-status-pending';
        if (apt.status === 'Confirmed') badgeClass = 'badge-status-confirmed';
        if (apt.status === 'Completed') badgeClass = 'badge-status-completed';
        if (apt.status === 'Cancelled') badgeClass = 'badge-status-cancelled';
        if (apt.status === 'Rescheduled') badgeClass = 'badge-status-rescheduled';

        const waText = encodeURIComponent(`Assalamu Alaikum. Inquiring regarding Appointment ID ${apt.appointment_id} for ${apt.patient_name} on ${apt.appointment_date} at ${apt.time_slot}.`);
        const waLink = `https://wa.me/8801758354920?text=${waText}`;

        const isBn = typeof getCurrentLang === 'function' ? getCurrentLang() === 'bn' : true;
        const feeText = (apt.service_type === 'hijama' || (apt.service_name && apt.service_name.includes('হিজামা')))
          ? (isBn ? 'খরচ পরামর্শের মাধ্যমে নির্ধারণ করা হবে।' : 'Determined after consultation')
          : (isBn ? '২,০৫০ টাকা' : 'BDT 2,050');

        html += `
          <div class="card" style="margin-bottom: 1.5rem; border-left: 4px solid var(--primary-light);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 1rem; border-bottom: 1px solid var(--border-light); padding-bottom: 0.75rem;">
              <div>
                <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">${isBn ? 'অ্যাপয়েন্টমেন্ট আইডি' : 'APPOINTMENT ID'}</span>
                <div style="font-size: 1.35rem; font-weight: 800; color: var(--primary);">${apt.appointment_id}</div>
              </div>
              <div>
                <span class="badge ${badgeClass}" style="font-size: 0.9rem; padding: 0.35rem 0.85rem;">${apt.status}</span>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 1.25rem;">
              <div>
                <div style="font-size: 0.8rem; color: var(--text-muted);">${isBn ? 'রোগীর নাম' : 'Patient Name'}</div>
                <div style="font-weight: 700;">${apt.patient_name}</div>
              </div>
              <div>
                <div style="font-size: 0.8rem; color: var(--text-muted);">${isBn ? 'অ্যাপয়েন্টমেন্টের তারিখ' : 'Appointment Date'}</div>
                <div style="font-weight: 700; color: var(--primary);">${apt.appointment_date}</div>
              </div>
              <div>
                <div style="font-size: 0.8rem; color: var(--text-muted);">${isBn ? 'নির্ধারিত সময়সূচী' : 'Time Slot'}</div>
                <div style="font-weight: 700; color: var(--primary);">${apt.time_slot}</div>
              </div>
              <div>
                <div style="font-size: 0.8rem; color: var(--text-muted);">${isBn ? 'নির্বাচিত সেবা' : 'Service'}</div>
                <div style="font-weight: 600;">${apt.service_name}</div>
              </div>
              <div>
                <div style="font-size: 0.8rem; color: var(--text-muted);">${isBn ? 'ফি / খরচ' : 'Service Fee'}</div>
                <div style="font-weight: 700; color: var(--primary);">${feeText}</div>
              </div>
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 0.75rem; flex-wrap: wrap;">
              <a href="${waLink}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-sm">
                ${isBn ? 'হোয়াটসঅ্যাপে যোগাযোগ' : 'WhatsApp Clinic Desk'}
              </a>
              <button onclick="window.print()" class="btn btn-secondary btn-sm">
                ${isBn ? '🖨 প্রিন্ট স্লিপ' : 'Print Slip'}
              </button>
            </div>
          </div>
        `;
      });

      lookupResults.innerHTML = html;

    } catch (err) {
      if (lookupLoading) lookupLoading.style.display = 'none';
      lookupResults.innerHTML = `<div class="card" style="color: #991B1B; background-color: #FEE2E2;">Connection error. Please try again.</div>`;
    }
  }
});
