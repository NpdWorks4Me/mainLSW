const fs = require('fs');
const path = require('path');

const reportPath = path.join(__dirname, '../public_html/deploy-report.json');
const data = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

// Filter out admin entries
const originalCount = data.files.length;
data.files = data.files.filter(f => {
  return !f.path.includes('admin/') && !f.path.includes('AdminPage');
});

const removedCount = originalCount - data.files.length;

fs.writeFileSync(reportPath, JSON.stringify(data, null, 2));
console.log(`✓ Cleaned deploy-report.json: removed ${removedCount} admin entries, ${data.files.length} entries remain`);
