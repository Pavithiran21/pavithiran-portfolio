import { expect, test } from '@playwright/test';
import { SCENES, isPinned, open, settleAnimations, stepCount, toStep } from './helpers.js';

test('nothing sticks out sideways anywhere on the page', async ({ page }) => {
  await open(page);
  const wide = await page.evaluate(async () => {
    const out = [];
    for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight / 2) {
      scrollTo(0, y); await new Promise(r => setTimeout(r, 40));
      if (document.documentElement.scrollWidth > innerWidth + 1) out.push(Math.round(y));
    }
    return out;
  });
  expect(wide, 'scroll positions with a sideways scrollbar').toEqual([]);
});

test('every step of every pinned scene fits its panel', async ({ page }, info) => {
  test.setTimeout(180_000);
  test.skip(!isPinned(info.project.name), 'this size shows stacked blocks instead');
  await open(page);
  await settleAnimations(page);
  const over = [];
  for (const id of SCENES) {
    const n = await stepCount(page, id);
    for (let i = 0; i < n; i++) {
      await toStep(page, id, i, 250);
      const r = await page.evaluate(id => {
        const p = document.querySelector(`#${id} .pinfo`), b = p.getBoundingClientRect();
        return { fits: p.scrollHeight <= p.clientHeight + 2, inside: b.top >= 0 && b.bottom <= innerHeight + 1 && b.left >= 0 && b.right <= innerWidth + 1 };
      }, id);
      if (!r.fits || !r.inside) over.push(`${id} step ${i + 1}: ${JSON.stringify(r)}`);
    }
  }
  expect(over).toEqual([]);
});

/* Every line of reading text (not the little app UIs drawn on the devices) is at least 12px, is not cut short
   with "…" or a line clamp, and sits inside the screen. Checked at every pinned step and every stacked block. */
test('all reading text is whole, inside the screen and at least 12px', async ({ page }, info) => {
  test.setTimeout(240_000);
  await open(page);
  await settleAnimations(page);
  const check = () => page.evaluate(() => {
    const bad = [];
    const skip = '.face,.screen,.strip,.u-top,.back,.browser,.monitor,.laptop,.hint,canvas,dialog,[aria-hidden="true"],.skip,.timeline .rail b';
    for (const el of document.querySelectorAll('main *, .nav *, .topbar *')) {
      if (el.closest(skip)) continue;
      if (![...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) continue;
      const r = el.getBoundingClientRect();
      if (!r.width || r.top < 0 || r.bottom > innerHeight) continue;
      let op = 1, hidden = false;
      for (let e = el; e && e !== document.documentElement; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden') hidden = true; op *= +cs.opacity; }
      if (hidden || op < 0.35) continue;
      const cs = getComputedStyle(el), text = el.textContent.trim().slice(0, 40);
      if (parseFloat(cs.fontSize) < 12) bad.push(`tiny ${cs.fontSize}: ${text}`);
      if (cs.textOverflow === 'ellipsis' && el.scrollWidth > el.clientWidth + 1) bad.push(`cut: ${text}`);
      if (cs.webkitLineClamp && cs.webkitLineClamp !== 'none' && el.scrollHeight > el.clientHeight + 1) bad.push(`clamped: ${text}`);
      if (r.left < -1 || r.right > innerWidth + 1) bad.push(`off screen: ${text}`);
    }
    return bad;
  });
  const problems = new Set();
  const add = async label => (await check()).forEach(b => problems.add(`${label}: ${b}`));
  await add('hero');
  if (isPinned(info.project.name)) {
    for (const id of SCENES) {
      const n = await stepCount(page, id);
      for (let i = 0; i < n; i++) { await toStep(page, id, i, 250); await add(`${id} ${i + 1}`); }
    }
  } else {
    const blocks = await page.locator('.static .show').count();
    for (let i = 0; i < blocks; i++) { await page.locator('.static .show').nth(i).scrollIntoViewIfNeeded(); await page.waitForTimeout(150); await add(`block ${i + 1}`); }
  }
  await page.locator('#skills .sg').last().scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);
  await add('skills');
  expect([...problems]).toEqual([]);
});

test('every skill name fits inside its tile', async ({ page }) => {
  await open(page);
  await page.evaluate(() => document.querySelector('.dockwrap').classList.add('in'));
  await page.waitForTimeout(900);
  const over = await page.evaluate(() => [...document.querySelectorAll('.sk b')].filter(b => {
    const r = b.getBoundingClientRect(), t = b.closest('.sk').getBoundingClientRect();
    return b.scrollWidth > b.clientWidth + 1 || r.left < t.left - 1 || r.right > t.right + 1;
  }).map(b => b.textContent));
  expect(over).toEqual([]);
  await expect(page.locator('.sg')).toHaveCount(7);
});
