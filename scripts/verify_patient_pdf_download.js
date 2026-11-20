const http = require('http');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const app = require('../server');
const db = require('../database/db');
const { JWT_SECRET } = require('../config/constants');

async function testDownload() {
  const server = app.listen(0);
  const port = server.address().port;

  // Generate valid admin token
  const adminUser = db.prepare('SELECT id, username, name, email, role FROM administrators LIMIT 1').get();
  const token = jwt.sign(
    { id: adminUser.id, username: adminUser.username, role: adminUser.role, name: adminUser.name },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  const patient = db.prepare('SELECT patient_id, full_name FROM patients LIMIT 1').get();
  console.log(`Testing download for patient: ${patient.full_name} (${patient.patient_id})`);

  function downloadPdf(lang) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: '127.0.0.1',
        port: port,
        path: `/api/admin/reports/patient/${patient.patient_id}/pdf?lang=${lang}`,
        method: 'GET',
        headers: {
          'Cookie': `ruqyah_admin_token=${token}`
        }
      };

      const req = http.request(options, (res) => {
        const chunks = [];
        res.on('data', chunk => chunks.push(chunk));
        res.on('end', () => {
          const buffer = Buffer.concat(chunks);
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            buffer: buffer
          });
        });
      });

      req.on('error', reject);
      req.end();
    });
  }

  // 1. Download Bengali PDF
  console.log('Downloading Bengali PDF: /api/admin/reports/patient/.../pdf?lang=bn');
  const bnRes = await downloadPdf('bn');
  console.log('BN Status Code:', bnRes.statusCode);
  console.log('BN Content-Type:', bnRes.headers['content-type']);
  console.log('BN Content-Disposition:', bnRes.headers['content-disposition']);
  console.log('BN Buffer Size:', bnRes.buffer.length, 'bytes');

  if (bnRes.statusCode !== 200 || bnRes.headers['content-type'] !== 'application/pdf') {
    throw new Error('Failed to download Bengali PDF');
  }
  fs.writeFileSync('scratch/downloaded_patient_profile_bn.pdf', bnRes.buffer);
  console.log('Saved scratch/downloaded_patient_profile_bn.pdf');

  // 2. Download English PDF
  console.log('Downloading English PDF: /api/admin/reports/patient/.../pdf?lang=en');
  const enRes = await downloadPdf('en');
  console.log('EN Status Code:', enRes.statusCode);
  console.log('EN Content-Type:', enRes.headers['content-type']);
  console.log('EN Content-Disposition:', enRes.headers['content-disposition']);
  console.log('EN Buffer Size:', enRes.buffer.length, 'bytes');

  if (enRes.statusCode !== 200 || enRes.headers['content-type'] !== 'application/pdf') {
    throw new Error('Failed to download English PDF');
  }
  fs.writeFileSync('scratch/downloaded_patient_profile_en.pdf', enRes.buffer);
  console.log('Saved scratch/downloaded_patient_profile_en.pdf');

  // Verify PDF header
  const bnHeader = bnRes.buffer.slice(0, 8).toString('latin1');
  const enHeader = enRes.buffer.slice(0, 8).toString('latin1');
  console.log('BN Magic Header:', bnHeader);
  console.log('EN Magic Header:', enHeader);

  if (!bnHeader.startsWith('%PDF-1.') || !enHeader.startsWith('%PDF-1.')) {
    throw new Error('Invalid PDF format');
  }

  server.close();
  console.log('ALL DOWNLOAD VERIFICATION TESTS PASSED SUCCESSFULLY!');
}

testDownload().catch(err => {
  console.error('Download test error:', err);
  process.exit(1);
});
