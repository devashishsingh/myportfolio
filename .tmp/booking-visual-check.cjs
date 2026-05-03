const { chromium, devices } = require('playwright');
const fs = require('fs');

(async () => {
  const base = 'http://localhost:3000';
  const out = [];

  async function runDesktop() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Book a Session' }).first().click();
    await page.waitForTimeout(400);
    const btn = page.getByRole('button', { name: 'Request Session' }).first();
    const hasRequest = await btn.count().then(c => c > 0);
    const modal = page.locator('text=Mentorship Conversation').first();
    const hasModalTitle = await modal.count().then(c => c > 0);
    const modalBox = await page.locator('text=Mentorship Conversation').first().boundingBox();
    await page.screenshot({ path: '.tmp/booking-modal-desktop.png', fullPage: true });
    out.push({ view: 'desktop', hasRequest, hasModalTitle, modalVisible: !!modalBox });
    await browser.close();
  }

  async function runMobile() {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ ...devices['iPhone 13'] });
    const page = await context.newPage();
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Book a Session' }).first().click();
    await page.waitForTimeout(450);
    const hasRequest = await page.getByRole('button', { name: 'Request Session' }).count().then(c => c > 0);
    const hasCancel = await page.getByRole('button', { name: 'Cancel' }).count().then(c => c > 0);
    const modalTitle = page.locator('text=Mentorship Conversation').first();
    const hasModalTitle = await modalTitle.count().then(c => c > 0);
    await page.screenshot({ path: '.tmp/booking-modal-mobile.png', fullPage: true });
    out.push({ view: 'mobile', hasRequest, hasCancel, hasModalTitle });
    await browser.close();
  }

  await runDesktop();
  await runMobile();
  fs.writeFileSync('.tmp/booking-visual-check.json', JSON.stringify(out, null, 2));
  console.log(JSON.stringify(out, null, 2));
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
