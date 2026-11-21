import { expect, test } from '@playwright/test';
import { hasMouse, open } from './helpers.js';

test.describe('with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('everything is visible and still, as stacked blocks', async ({ page }) => {
    const errors = await open(page);
    await expect(page.locator('html')).toHaveClass(/\brm\b/);
    await expect(page.locator('#swWork')).toBeHidden();
    await expect(page.locator('#stWork')).toBeVisible();
    const hidden = await page.evaluate(() => [...document.querySelectorAll('[data-reveal]')].filter(e => getComputedStyle(e).opacity === '0').length);
    expect(hidden).toBe(0);
    await page.evaluate(() => scrollTo(0, innerHeight * 2));
    await page.waitForTimeout(200);
    expect(await page.evaluate(() => document.getElementById('scene').style.transform)).toBe('');
    expect(await page.locator('.fold').count()).toBe(0);
    /* the typed hero line stands still on its first phrase */
    await expect(page.locator('.hello .tw')).toHaveText('I build web apps people use');
    await page.waitForTimeout(1500);
    await expect(page.locator('.hello .tw')).toHaveText('I build web apps people use');
    expect(errors).toEqual([]);
  });
});

test('the page has one h1, named landmarks, and alt text on every image', async ({ page }) => {
  await open(page);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('main#main')).toHaveCount(1);
  await expect(page.getByRole('navigation', { name: 'Sections' })).toHaveCount(1);
  expect(await page.locator('img:not([alt])').count()).toBe(0);
  const unnamed = await page.evaluate(() => [...document.querySelectorAll('button, a')].filter(e => !(e.getAttribute('aria-label') || e.textContent.trim())).length);
  expect(unnamed).toBe(0);
});

test('Tab moves through the page with a visible focus ring', async ({ page }, info) => {
  test.skip(!hasMouse(info.project.name), 'keyboard check on computer screens');
  await open(page);
  const bad = [];
  for (let i = 0; i < 30; i++) {
    await page.keyboard.press('Tab');
    const r = await page.evaluate(() => {
      const e = document.activeElement; if (!e || e === document.body) return null;
      const cs = getComputedStyle(e), b = e.getBoundingClientRect();
      return { what: (e.getAttribute('aria-label') || e.textContent).trim().slice(0, 30), ring: cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0, inView: b.bottom > 0 && b.top < innerHeight };
    });
    if (r && (!r.ring || !r.inView)) bad.push(r);
  }
  expect(bad).toEqual([]);
});
