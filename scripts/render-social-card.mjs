import { readFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';

const logo = await readFile(new URL('../public/favicon.svg', import.meta.url), 'utf8');
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.setContent(`<!doctype html><html lang="en"><meta charset="utf-8"><title>Marvin Liu</title>
    <style>
      * { box-sizing: border-box; }
      body { margin: 0; background: #f8f9f6; color: #282e28; font-family: Arial, sans-serif; }
      main { width: 1200px; height: 630px; padding: 76px 84px; display: flex; flex-direction: column; }
      svg { width: 72px; height: 72px; }
      h1 { font-size: 84px; line-height: 1.1; letter-spacing: -4px; margin: 60px 0 22px; }
      p { margin: 0; font-size: 30px; color: #62685f; }
      footer { margin-top: auto; padding-top: 26px; border-top: 1px solid #e2e6dc; font-size: 20px; color: #62685f; }
    </style><main>${logo}<h1>Marvin Liu<span style="color:#527044">.</span></h1>
    <p>Writing &amp; projects</p><footer>liuyang1520.github.io</footer></main></html>`);
  await page.screenshot({ path: new URL('../public/social-card.png', import.meta.url).pathname });
} finally {
  await browser.close();
}
