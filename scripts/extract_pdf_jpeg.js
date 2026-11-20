const fs = require('fs');

const pdfBuf = fs.readFileSync('test_bn_output.pdf');
const startMarker = Buffer.from('/Filter /DCTDecode /Length ');
const startIdx = pdfBuf.indexOf(startMarker);
if (startIdx !== -1) {
  const streamMarker = Buffer.from('stream\n');
  const streamIdx = pdfBuf.indexOf(streamMarker, startIdx);
  const endMarker = Buffer.from('\nendstream');
  const endIdx = pdfBuf.indexOf(endMarker, streamIdx);
  
  const jpegBuf = pdfBuf.slice(streamIdx + streamMarker.length, endIdx);
  fs.writeFileSync('test_bn_page.jpg', jpegBuf);
  console.log('Extracted JPEG size:', jpegBuf.length);
} else {
  console.log('Marker not found');
}
