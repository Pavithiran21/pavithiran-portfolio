import { expect, test } from '@playwright/test';
import { projects } from '../src/content.js';
import { hasMouse, isPinned, open, toStep } from './helpers.js';

test('all eight apps have their problem, a live demo and the GitHub code', async ({ page }) => {
  await open(page);
  /* the stacked blocks hold every app at once, whichever layout is showing */
  const cards = page.locator('#stWork .show');
  await expect(cards).toHaveCount(8);
  for (const [i, p] of projects.entries()) {
    const card = cards.nth(i);
    await expect(card.locator('h3')).toHaveText(p.name);
    await expect(card.locator('.prob')).toContainText(p.problem);
    await expect(card.locator('a', { hasText: 'Open live demo' })).toHaveAttribute('href', p.live);
    await expect(card.locator('a', { hasText: 'GitHub' })).toHaveAttribute('href', `https://github.com/Pavithiran21/${p.repo}`);
    await expect(card.locator('.t')).toHaveText(`✓ ${p.tests} Playwright tests`);
  }
});

test('scrolling through Projects shows each app in turn', async ({ page }, info) => {
  test.skip(!isPinned(info.project.name), 'this size shows stacked blocks instead');
  await open(page);
  for (const [i, p] of projects.entries()) {
    await toStep(page, 'swWork', i);
    await expect(page.locator('#swWork .pinfo h3')).toHaveText(p.name);
    await expect(page.locator('#swWork .count b')).toHaveText(String(i + 1).padStart(2, '0'));
  }
});

test('the rail jumps to an app', async ({ page }, info) => {
  test.skip(!hasMouse(info.project.name), 'the rail shows on wide screens only');
  await open(page);
  await toStep(page, 'swWork', 0);
  await page.locator('#swWork .rail button', { hasText: 'Resumify' }).click();
  await expect(page.locator('#swWork .pinfo h3')).toHaveText('Resumify');
});

test('clicking the laptop opens that app’s live demo', async ({ page }, info) => {
  test.skip(!isPinned(info.project.name), 'this size shows stacked blocks instead');
  await open(page);
  await toStep(page, 'swWork', 2, 600);
  const popup = page.waitForEvent('popup');
  await page.locator('#swWork .rigw .laptop').click();
  expect((await popup).url()).toBe(projects[2].live);
});

test('the hero devices jump to the same app in Projects', async ({ page }, info) => {
  test.skip(!isPinned(info.project.name), 'this size shows stacked blocks instead');
  await open(page);
  await page.locator('#dots button').nth(4).click();
  /* the hero rotates every 3.8 s (no hover pause on touch screens), so read the app on screen and click in the same instant */
  const shown = await page.evaluate(() => { const name = document.getElementById('nowName').textContent; document.getElementById('scene').click(); return name; });
  await expect(page.locator('#swWork .pinfo h3')).toHaveText(shown);
});

test('screenshots open full size, step with the arrow keys and close with Esc', async ({ page }, info) => {
  await open(page);
  let zoom;
  if (isPinned(info.project.name)) {
    await toStep(page, 'swWork', 0, 600);
    zoom = page.locator('#swWork .pinfo .zoom');
  } else {
    zoom = page.locator('#stWork .show').first().locator('.zoom');
    await zoom.scrollIntoViewIfNeeded();
  }
  await zoom.click();
  const dialog = page.getByRole('dialog', { name: 'Screenshot, full size' });
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('figcaption')).toContainText('Billsy');
  const [first, firstNum] = [await dialog.locator('figcaption span').textContent(), await dialog.locator('figcaption small').textContent()];
  expect(firstNum).toMatch(/^[123] \/ 3$/);
  await page.keyboard.press('ArrowRight');
  await expect(dialog.locator('figcaption span')).not.toHaveText(first);
  await expect(dialog.locator('figcaption small')).not.toHaveText(firstNum);
  const img = await dialog.locator('img').boundingBox(), vp = page.viewportSize();
  expect(img.x).toBeGreaterThanOrEqual(0);
  expect(img.x + img.width).toBeLessThanOrEqual(vp.width + 1);
  expect(img.y + img.height).toBeLessThanOrEqual(vp.height + 1);
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(zoom).toBeFocused();
});
