/* Shared helpers for the Playwright specs. */

export const SCENES = ['swAbout', 'swExp', 'swWork', 'swCerts', 'swEdu', 'swContact'];
/* sizes where the scroll scenes are pinned (the landscape phone gets stacked blocks instead) */
export const isPinned = name => name !== 'landscape';
export const hasMouse = name => name === 'desktop' || name === 'laptop';

/* Open the page, collect errors, and turn off smooth scrolling so scrollTo lands at once. */
export async function open(page) {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  /* the live demos and other sites are never loaded by the tests */
  const self = process.env.BASE_URL ? new URL(process.env.BASE_URL).hostname : 'localhost';
  await page.context().route(
    u => u.hostname !== self && /(\.vercel\.app|github\.com|linkedin\.com|wa\.me|guvi\.in)$/.test(u.hostname),
    r => r.fulfill({ status: 200, contentType: 'text/html', body: '<title>stub</title>' }),
  );
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });
  return errors;
}

/* Scroll to step i of a pinned scene (the middle of that step) and let the frame settle. */
export async function toStep(page, id, i, wait = 400) {
  await page.evaluate(([id, i]) => {
    const s = document.getElementById(id), n = s.querySelectorAll('.rail button').length;
    scrollTo(0, s.getBoundingClientRect().top + scrollY + (s.offsetHeight - innerHeight) * (i + 0.5) / n);
  }, [id, i]);
  await page.waitForTimeout(wait);
}

export const stepCount = (page, id) => page.evaluate(id => document.querySelectorAll(`#${id} .rail button`).length, id);

/* Finish the panel's rise animation at once so measurements are final. */
export const settleAnimations = page => page.addStyleTag({ content: '.pinfo .anim>*,.ap,.pp{animation:none!important}' });
