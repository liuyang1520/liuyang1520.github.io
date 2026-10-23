import { test, expect } from '@playwright/test';

const articles = [
  '/jquery-1-nothing-new.html',
  '/posts/development/2016/03/25/ios-development-keyboard-dismiss/',
  '/posts/application/2016/03/11/bloomberg-interview-question-adding-number-game/',
  '/posts/research/2016/02/17/type-1-font-for-matplotlab/',
];

test('pages render without errors, overflow, or broken internal links', async ({ page, request }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  const links = new Set<string>();
  for (const path of ['/', '/blog/', '/projects/', '/resume/', '/about/', ...articles]) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('nav a[href="/skills/"]')).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    for (const href of await page.locator('a[href^="/"]').evaluateAll(elements => elements.map(element => element.getAttribute('href')!))) links.add(href);
    for (const src of await page.locator('img[src^="/"], script[src^="/"], link[href^="/"]').evaluateAll(elements => elements.map(element => element.getAttribute('src') ?? element.getAttribute('href')!))) links.add(src);
  }
  for (const link of links) expect((await request.get(link)).status(), link).toBe(200);
  expect(errors).toEqual([]);
});

test('all four original articles preserve their URLs and code blocks', async ({ page }) => {
  await page.goto('/blog/');
  await expect(page.locator('.post-item')).toHaveCount(4);
  for (const path of articles) {
    await page.goto('/blog/');
    await page.locator(`.post-link[href="${path}"]`).click();
    expect(new URL(page.url()).pathname).toBe(path);
    await expect(page.locator('.prose pre').first()).toBeVisible();
    expect(await page.locator('.prose').innerText()).not.toContain('{%');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://liuyang1520.github.io${path}`);
  }
});

test('writing search supports topics, empty results, and clearing', async ({ page }) => {
  await page.goto('/blog/');
  const input = page.getByRole('searchbox');
  await input.fill('Python');
  await expect(page.locator('.post-item:visible')).toHaveCount(2);
  await input.fill('not-a-real-topic');
  await expect(page.getByText('No notes found.')).toBeVisible();
  await expect(page.locator('.year-group:visible')).toHaveCount(0);
  await page.getByRole('button', { name: 'Clear search' }).click();
  await expect(page.locator('.post-item:visible')).toHaveCount(4);
  await input.fill('jQuErY');
  await expect(page.locator('.post-item:visible')).toHaveCount(1);
});

test('project filters show the correct projects and source links', async ({ page }) => {
  await page.goto('/projects/');
  await expect(page.locator('.project-item:visible')).toHaveCount(11);
  await page.getByRole('button', { name: 'Developer tools', exact: true }).click();
  await expect(page.locator('.project-item:visible')).toHaveCount(2);
  await expect(page.getByRole('button', { name: 'Developer tools', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Games', exact: true }).click();
  await expect(page.locator('.project-item:visible')).toHaveCount(2);
  await page.getByRole('button', { name: 'Apps', exact: true }).click();
  await expect(page.locator('.project-item:visible')).toHaveCount(7);
  await expect(page.getByRole('link', { name: 'Kotoba source on GitHub' })).toHaveAttribute('href', 'https://github.com/liuyang1520/kotoba');
  await page.getByRole('button', { name: 'All projects', exact: true }).click();
  await expect(page.locator('.project-item:visible')).toHaveCount(11);
  for (const [name, url] of [
    ['Nimue', 'https://nimue.quest'],
    ['DouJiao', 'https://doujiao.cloud.run/'],
    ['vatlas', 'https://vatlas.cloud.run/'],
    ['Simple Hotkeys', 'https://github.com/liuyang1520/simple-hotkeys'],
    ['Kotoba', 'https://liuyang1520.github.io/kotoba/'],
    ['Road Test Sim', 'https://inquisitive-llama-29e477.netlify.app/'],
  ]) {
    await expect(page.getByRole('heading', { name, exact: true }).getByRole('link')).toHaveAttribute('href', url);
  }
  for (const name of ['Reddit MCP', 'Canadian Real Estate MCP', 'Tower of the Sorcerer']) {
    await expect(page.getByRole('heading', { name, exact: true })).toHaveCount(0);
  }
});

test('theme follows system initially, then remembers the selected theme', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('button', { name: 'Switch to light theme' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.getByRole('navigation').getByRole('link', { name: 'Projects' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.getByRole('button', { name: 'Switch to dark theme' }).click();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('resume shows public roles and logos without exposing personal files', async ({ page, request }) => {
  await page.goto('/resume/');
  await expect(page.locator('.company-name')).toHaveText(['Amplitude', 'Salesforce', 'Amazon', 'Cisco Systems', 'Splice Software']);
  await expect(page.locator('.company-title')).toHaveText(['Staff Engineer', 'Senior MTS', 'SDE II', 'Software Engineer II', 'Developer']);
  for (const logo of await page.locator('.company-icon img').all()) {
    await logo.scrollIntoViewIfNeeded();
    await expect.poll(() => logo.evaluate(image => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  }
  await expect(page.locator('a[download], .resume-download')).toHaveCount(0);
  await expect(page.getByText('Want the full story?')).toHaveCount(0);
  for (const path of ['/Marvin_Liu_Resume.pdf', '/images/author.jpg', '/images/YangLiu_Resume_Web.pdf', '/private/legacy-images/YangLiu_Resume_Web.pdf', '/.env', '/.git/config', '/src/data/profile.ts']) {
    expect((await request.get(path)).status(), path).toBe(404);
  }
});

test('RSS, sitemap and not-found page work', async ({ page, request }) => {
  const feed = await request.get('/feed.xml');
  expect(feed.status()).toBe(200);
  const xml = await feed.text();
  expect((xml.match(/<item>/g) ?? []).length).toBe(4);
  expect(xml).toContain('https://liuyang1520.github.io/jquery-1-nothing-new.html');
  expect((await request.get('/sitemap-index.xml')).status()).toBe(200);
  expect((await request.get('/social-card.png')).status()).toBe(200);
  const response = await page.goto('/this-page-does-not-exist/');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found.');
  await page.getByRole('link', { name: 'Back home' }).click();
  await expect(page).toHaveURL('/');
  expect((await request.get('/skills/')).status()).toBe(404);
});

test('writing and projects remain usable without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  const page = await context.newPage();
  await page.goto('/blog/');
  await expect(page.locator('.post-item:visible')).toHaveCount(4);
  await expect(page.getByRole('searchbox')).toBeHidden();
  await page.goto('/projects/');
  await expect(page.locator('.project-item:visible')).toHaveCount(11);
  await expect(page.locator('.project-filters')).toBeHidden();
  await context.close();
});
