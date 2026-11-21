import { expect, test } from '@playwright/test';
import { isPinned, open } from './helpers.js';

const angle = t => Math.abs(+((/rotateY\(([-\d.]+)deg/.exec(t || '') || [0, 0])[1]));

test('the hero devices sit in 3D and tilt back as you scroll away', async ({ page }) => {
  await open(page);
  const rig = await page.evaluate(() => getComputedStyle(document.getElementById('rig')).transform);
  expect(rig).toMatch(/^matrix3d/);
  await page.evaluate(() => scrollTo(0, innerHeight * 0.5));
  await expect.poll(() => page.evaluate(() => document.getElementById('scene').style.transform)).toMatch(/rotateX/);
});

test('between two apps the device makes a full turn and shows its back', async ({ page }, info) => {
  test.skip(!isPinned(info.project.name), 'this size shows stacked blocks instead');
  await open(page);
  /* scrub across the boundary between the first and second app */
  const { max, back } = await page.evaluate(async () => {
    const s = document.getElementById('swWork'), top = s.getBoundingClientRect().top + scrollY, span = s.offsetHeight - innerHeight, n = 8;
    const rigw = s.querySelector('.rigw'), bk = s.querySelector('.rigw .back');
    let max = 0, back = false;
    for (let k = 0.75; k <= 1.25; k += 0.0025) {
      scrollTo(0, top + span * k / n);
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
      const a = Math.abs(+((/rotateY\(([-\d.]+)deg/.exec(rigw.style.transform) || [0, 0])[1]));
      max = Math.max(max, a);
      if (a > 120) back = back || bk.getBoundingClientRect().width > 20;
    }
    return { max, back };
  });
  expect(max).toBeGreaterThan(150); /* the peak is 180°; frame sampling on a busy machine can land a few degrees short */
  expect(back).toBe(true);
});

test('sections fold away in 3D as the next one arrives', async ({ page }) => {
  await open(page);
  const folded = await page.evaluate(async () => {
    const pr = document.getElementById('projects'), bottom = pr.getBoundingClientRect().bottom + scrollY;
    scrollTo(0, bottom - innerHeight * 0.6);
    await new Promise(r => setTimeout(r, 200));
    return document.querySelectorAll('.fold').length;
  });
  expect(folded).toBeGreaterThan(0);
});

test('stacked blocks turn from their back to face you on short screens', async ({ page }, info) => {
  test.skip(info.project.name !== 'landscape', 'only short screens show stacked blocks');
  await open(page);
  const dev = page.locator('#stWork .show').nth(1).locator('.stage > .monitor, .stage > .laptop');
  let max = 0;
  for (let k = 1.1; k >= 0.3; k -= 0.05) {
    await page.evaluate(([sel, k]) => {
      const d = document.querySelectorAll('#stWork .show')[1].querySelector(sel);
      scrollTo(0, d.getBoundingClientRect().top + scrollY - innerHeight * k);
    }, ['.stage > .monitor, .stage > .laptop', k]);
    await page.waitForTimeout(60);
    max = Math.max(max, angle(await dev.evaluate(d => d.style.transform)));
  }
  expect(max).toBeGreaterThan(150);
});

test('the background network is drawing', async ({ page }) => {
  await open(page);
  await page.waitForTimeout(600);
  const lit = await page.evaluate(() => {
    const c = document.getElementById('net'), d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
    let n = 0; for (let i = 3; i < d.length; i += 400) if (d[i] > 0) n++;
    return n;
  });
  expect(lit).toBeGreaterThan(0);
});
