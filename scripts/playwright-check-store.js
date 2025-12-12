const { chromium } = require('playwright');

(async function main(){
  const url = process.argv[2] || 'http://localhost:3000/store/';
  const browser = await chromium.launch();
  const page = await browser.newPage();
  let consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      consoleErrors.push(`${msg.type().toUpperCase()}: ${msg.text()}`)
    } else {
      // For debugging: uncomment if needed
      // console.log(`${msg.type()}: ${msg.text()}`)
    }
  });
  try {
    await page.goto(url, { waitUntil: 'networkidle' });
    // Give time for hydration to happen
    await page.waitForTimeout(1200);
    if (consoleErrors.length > 0) {
      console.error('Console errors/warnings found:\n' + consoleErrors.join('\n'));
      process.exit(2);
    } else {
      console.log('No console errors or warnings detected for ' + url);
      process.exit(0);
    }
  } catch (err) {
    console.error('Failed to load page or encountered error:', err.message);
    process.exit(3);
  } finally {
    await browser.close();
  }
})();
