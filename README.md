# Ruqyah Support & Cupping Center – Feni Branch
## Complete Website, Online Appointment Booking & Patient Management System

A production-ready Islamic healthcare web application and clinical management system built for **Ruqyah Support & Cupping Center (Feni Branch)** under the leadership of **Raqi Muhammadullah Miah**.

---

### Key Features Implemented

#### 1. Public Healthcare Website
- **Modern & Dignified Islamic Healthcare UI:** Clean light medical aesthetic with forest green (`#064E3B`), emerald (`#047857`, `#10B981`), and warm gold (`#D97706`) accents. Highly accessible layout tailored for elderly and distressed visitors.
- **Pages Included:**
  - **Home (`/`):** Hero section with headline *"Seeking Shariah-Based Ruqyah Support?"*, introduction to prophetic medicine, main services, patient guidance, accordion FAQ, and direct WhatsApp contact.
  - **About Us (`/about`):** Organization introduction, professional profile of **Muhammadullah Miah**, treatment philosophy based on pure Tawheed, and commitment to the Qur'an and authentic Sunnah.
  - **Ruqyah Services (`/services#ruqyah`):** Explanations for Diagnosis, Initial Treatment, Follow-up Sessions, Family/Home Visits, and Online Consultations. Explicit medical and Shariah disclaimer (no guaranteed cure claims).
  - **Sunnah Hijama Services (`/services#hijama`):** Full body cupping, back cupping, head cupping (Sunnah Al-Yafookh), separate male and female therapist suites, and 100% sterile single-use disposable cups.
  - **Rules & Policies (`/policies`):** Pre-booking requirements, patient responsibilities (destroying amulets/taweez before arriving), cancellation/rescheduling policies, patient confidentiality, and mandatory Mahram accompaniment guidelines for sisters.
  - **Contact & Location (`/contact`):** Physical address (*Bhuya Mansion, Adarsha Housing Society, Mohipal, Feni*), telephone/WhatsApp (`01758-354920`), interactive Google Maps integration, and live inquiry form.
  - **Appointment Status Lookup (`/lookup`):** Patients can search by Appointment ID (`APT-...`) or mobile number to verify booking status and print confirmation slips.

#### 2. Advanced Real-Time Appointment Booking System
- **Strict 1-Hour Dedicated Slots:** 10 standard slots per day (09:00 AM to 08:00 PM BST) with a mandatory break from 01:00 PM to 02:00 PM.
- **Real-Time Slot Disappearance (Mandatory PRD Requirement):**
  - Once a slot is booked, it immediately disappears from the available slots shown to subsequent visitors.
  - Full concurrency protection via atomic database transactions (`BEGIN IMMEDIATE`) prevents double booking even under simultaneous requests.
- **Confirmation Slip:** Generates unique reference ID (`APT-YYYYMMDD-XXXX`), downloadable/printable slip, and click-to-chat WhatsApp button pre-filled with booking details.

#### 3. Administrator Date Closure & Availability System
- **Manage Clinic Availability Panel:**
  - Close an entire date or range of dates with custom reasons (e.g., *"Raqi Traveling"*).
  - Reopen previously closed dates with one click.
  - Block specific hourly slots on a particular date while leaving other slots open.
  - Reopen blocked slots.
  - Configurable regular weekly holidays (default: Friday).

#### 4. Patient CRM (10-Category Structured Medical & Spiritual History)
- Unique Patient IDs (`RSCC-P-1001`, `RSCC-P-1002`, ...).
- Structured 10-category diagnostic history form with interactive checkboxes and detailed notes:
  1. Main Symptoms (chest heaviness, sudden anger, constant exhaustion, aversion to family)
  2. Physical Symptoms (stomach burning, upper back tension, migraines unresponsive to painkillers)
  3. Sleep Problems (insomnia, sleep paralysis / Kaboos, night terrors)
  4. Dream-Related Problems (black dogs, snakes, falling, graveyards, drowning)
  5. Worship & Religious Activity (aversion to Adhan/Quran, severe Waswas in Salah, sudden drowsiness)
  6. Family History & Background
  7. Financial & Family Situation (sudden business blockage, livelihood stress)
  8. Previous Clinical Medical History (doctor visits, normal MRI/ECG reports)
  9. Duration of Problems (less than 1 month up to 3+ years)
  10. Additional Clinical Notes (previous taweez/amulets burned, occult exposure)

#### 5. Ruqyah Diagnosis & Session Management
- Record recitation protocols (Surah Al-Fatihah, Ayat al-Kursi, Al-Baqarah 102/284-286, Al-A'raf, Yunus, Ta-Ha, As-Saffat, Mu'awwidhatayn).
- Authentic Prophetic Duas (*"Adhhibil-ba'sa Rabban-naas..."*, *"Bismillahi arqeeka..."*).
- Observed physical reactions tracking (trembling, deep yawns, cold sweating, weeping, nausea).
- **Raqi Professional Assessment (Manual Diagnostic Control):** System strictly distinguishes between patient-reported symptoms and professional clinical diagnosis (Sihr, Hasad/Evil Eye, Mass, or Medical/Psychological referral).
- Prescribed Sunnah remedies (Ruqyah water drinking, Sidr leaf baths, recited olive oil massage, Kalonji, Ajwa dates, Adhkar routines).

#### 6. Automated Follow-up Management
- Track progression over time (*Significantly Improved*, *Mildly Improved*, *Unchanged*, *Worsened*, *New Symptoms*).
- Upcoming follow-up reminders surfaced prominently on the dashboard.

#### 7. PDF Report Generation
- **Report Type 1: Patient History Report PDF:** Formal clinical report with clinic letterhead, patient demographics, and full 10-category diagnostic findings.
- **Report Type 2: Ruqyah Session Report PDF:** Full session dossier with recitation verses, observed physical reactions, Raqi professional assessment, prescribed remedies, and official seal placeholder.
- Downloadable directly as pure vector PDF-1.4 files (`/api/admin/reports/.../pdf`) and printable via dedicated browser print views (`/reports/view/...`).

#### 8. Dynamic Pricing Management (No Hardcoded Prices)
- Complete administrative CRUD for services and packages.
- Price updates, promotional discounts, and active/inactive toggles instantly reflect on the public website and booking forms without code modifications.

---

### Technology Stack & Architecture
- **Runtime:** Node.js v24
- **Web Framework:** Express.js 4.x
- **Database Engine:** SQLite (WAL mode, foreign key enforcement via `better-sqlite3`)
- **Authentication:** JWT with HttpOnly, SameSite=Strict cookies & bcrypt password hashing
- **PDF Engine:** Pure Node.js standard-compliant PDF-1.4 stream generator (zero external native dependencies)
- **Styling:** Custom responsive healthcare CSS with print-optimized stylesheets (`@media print`)

---

### Starting the Application

```bash
cd "C:\Users\karim\.gemini\antigravity\scratch\ruqyah-center-feni"

# Start the server
npm start
```

Default local URLs:
- **Public Website:** `http://localhost:5000/`
- **Online Booking:** `http://localhost:5000/book`
- **Status Lookup:** `http://localhost:5000/lookup`
- **Admin Portal:** `http://localhost:5000/admin`
- **Default Administrator Credentials:**
  - Username: `admin`
  - Password: `Admin@12345`

---

### Running the System Verification Test Suite

```bash
npm test
```
The test suite executes 22 end-to-end integration tests verifying availability rules, concurrency locks, appointment booking, day closure, slot blocking, patient CRM, 10-category history, Ruqyah sessions, follow-ups, PDF generation, dynamic pricing, and security barriers. All 22 tests pass with 100% compliance.
