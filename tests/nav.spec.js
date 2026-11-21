import { expect, test } from '@playwright/test';
import { open } from './helpers.js';

const LINKS = ['about', 'experience', 'projects', 'skills', 'contact'];

test('each nav link takes you to its section and marks it as current', async ({ page }) => {
  await open(page);
  const nav = page.getByRole('navigation', { name: 'Sections' });
  await expect(nav).toBeVisible();
  for (const id of LINKS) {
    const link = nav.locator(`a.l[href="#${id}"]`);
    await link.click();
    await expect(link).toHaveAttribute('aria-current', 'true');
    const top = await page.evaluate(id => document.getElementById(id).getBoundingClientRect().top, id);
    expect(Math.abs(top), `${id} should start at the top of the screen`).toBeLessThan(5);
    /* the sliding highlight ends up under the current link (it glides there in about half a second) */
    await expect.poll(async () => {
      const [ind, a] = await Promise.all([nav.locator('.ind').boundingBox(), link.boundingBox()]);
      return Math.abs(ind.x - a.x);
    }).toBeLessThan(2);
  }
});

test('the nav and the resume button stay on screen and tappable', async ({ page }) => {
  await open(page);
  const nav = page.getByRole('navigation', { name: 'Sections' });
  const box = await nav.boundingBox();
  const vp = page.viewportSize();
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(vp.width);
  expect(box.y + box.height).toBeLessThanOrEqual(vp.height);
  for (const id of LINKS) {
    const b = await nav.locator(`a.l[href="#${id}"]`).boundingBox();
    expect(b.height, `${id} tap target`).toBeGreaterThanOrEqual(40);
  }
  /* one Resume button is always visible: in the pill on computers, in the top bar on phones and tablets */
  await expect(page.locator('a.cv:visible')).toHaveCount(1);
});

test('the brand link goes back to the top', async ({ page }) => {
  await open(page);
  await page.evaluate(() => scrollTo(0, document.getElementById('skills').offsetTop));
  await page.locator('a.me:visible, a.brand:visible').first().click();
  await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(5);
});
