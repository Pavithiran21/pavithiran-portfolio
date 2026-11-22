import { expect, test } from '@playwright/test';
import { profile, projects } from '../src/content.js';
import { open } from './helpers.js';

test('loads with no errors, the right title and share tags', async ({ page }) => {
  const errors = await open(page);
  await expect(page).toHaveTitle(`${profile.fullName} | Full Stack Developer`);
  expect(profile.fullName).toBe('Pavithiran Ramaraj'); /* the name on the resume and LinkedIn */
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /full stack developer/i);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /\/og\.png$/);
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', '/favicon.svg');
  await page.waitForTimeout(500);
  expect(errors).toEqual([]);
});

test('hero shows the name, the role and real numbers', async ({ page }) => {
  await open(page);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(profile.name);
  await expect(page.locator('.hero .role')).toHaveText(`Full-stack developer · ${profile.years} years`);
  const tests = projects.reduce((a, p) => a + p.tests, 0);
  expect(tests).toBe(278);
  await expect(page.locator('#proof')).toHaveText(`8live apps${tests}Playwright tests8/8repos with CI`);
  await expect(page.getByRole('link', { name: /Contact me/ }).first()).toHaveAttribute('href', '#contact');
});

test('the first hero line types each phrase in turn, and never moves the name below it', async ({ page }) => {
  await open(page);
  /* the layout position (offsetTop), so the one-time entrance animation doesn't count as movement */
  const h1Top = () => page.evaluate(() => document.querySelector('.hero h1').offsetTop);
  const start = await h1Top();
  const tw = page.locator('.hello .tw');
  /* wait for a phrase to be fully typed, then for the next full phrase (typing speed depends on the machine) */
  await expect.poll(() => tw.textContent(), { timeout: 10_000 }).toMatch(new RegExp(`^(${profile.typed.join('|')})$`));
  const first = await tw.textContent();
  await expect.poll(() => tw.textContent(), { timeout: 15_000 }).toMatch(new RegExp(`^(${profile.typed.filter(t => t !== first).join('|')})$`));
  expect(await h1Top()).toBe(start);
  /* screen readers get every phrase at once */
  await expect(page.locator('.hello .sr-only')).toHaveText(profile.typed.join('. '));
});

test('each project says its free-hosted demo can take a minute to wake', async ({ page }) => {
  await open(page);
  await expect(page.locator('#stWork .hostnote')).toHaveCount(projects.length);
  await expect(page.locator('#stWork .hostnote').first()).toHaveText('Free hosting: the first load can take up to a minute.');
});

test('the hero devices step through all eight apps', async ({ page }) => {
  await open(page);
  const dots = page.locator('#dots button');
  await expect(dots).toHaveCount(8);
  for (const [i, p] of projects.entries()) {
    await dots.nth(i).click();
    await expect(page.locator('#nowName')).toHaveText(p.name);
    await expect(page.locator('#url')).toHaveText(p.live.replace('https://', ''));
  }
});

test('every image and logo loads', async ({ page }) => {
  await open(page);
  /* scroll through so every image is laid out, then check each one decoded */
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight) { scrollTo(0, y); await new Promise(r => setTimeout(r, 30)); }
  });
  const broken = await page.evaluate(async () => {
    const imgs = [...document.images];
    await Promise.all(imgs.map(i => (i.complete ? null : new Promise(r => { i.onload = i.onerror = r; }))));
    return imgs.filter(i => !i.naturalWidth).map(i => i.getAttribute('src'));
  });
  expect(broken).toEqual([]);
});
