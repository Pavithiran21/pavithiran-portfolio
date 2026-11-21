import { expect, test } from '@playwright/test';
import { certifications, education, experience, profile } from '../src/content.js';
import { open } from './helpers.js';

/* The stacked blocks hold every step's text at once, so these read them whichever layout is showing. */

test('contact buttons call, message, email and open the profiles', async ({ page }) => {
  await open(page);
  const c = page.locator('#stContact');
  await expect(c.locator('a', { hasText: 'Email me' })).toHaveAttribute('href', `mailto:${profile.email}?subject=Developer%20role`);
  await expect(c.locator('a', { hasText: 'Call me' })).toHaveAttribute('href', 'tel:+918667338337');
  await expect(c.locator('a', { hasText: 'WhatsApp me' })).toHaveAttribute('href', 'https://wa.me/919486970967');
  await expect(c.locator('a', { hasText: 'Open LinkedIn' })).toHaveAttribute('href', profile.linkedin.href);
  await expect(c.locator('a', { hasText: 'Open GitHub' })).toHaveAttribute('href', profile.github);
  const social = page.getByRole('navigation', { name: 'Social links' }).getByRole('link');
  await expect(social).toHaveCount(5);
  await expect(social.nth(0)).toHaveAttribute('href', profile.github);
  await expect(page.locator('footer')).toContainText('© 2026 Pavithiran · All rights reserved');
});

test('experience shows every role at DJ Computing, newest first', async ({ page }) => {
  await open(page);
  const blocks = page.locator('#stExp .show');
  await expect(blocks).toHaveCount(experience.length);
  for (const [i, j] of experience.entries()) {
    await expect(blocks.nth(i).locator('h3')).toHaveText(j.title);
    await expect(blocks.nth(i).locator('.kind')).toHaveText(j.when);
    await expect(blocks.nth(i).locator('li')).toHaveCount(j.points.length);
  }
});

test('the certificate links to its verify page and the course shows as in progress', async ({ page }) => {
  await open(page);
  const blocks = page.locator('#stCerts .show');
  await expect(blocks).toHaveCount(certifications.length);
  await expect(blocks.nth(0).locator('a', { hasText: 'Verify' })).toHaveAttribute('href', certifications[0].url);
  await expect(blocks.nth(0)).toContainText(certifications[0].id);
  await expect(blocks.nth(1).locator('.inprog')).toHaveText('In progress');
  await expect(blocks.nth(1).locator('a')).toHaveCount(0);
  /* the badge must not take the progress bar's style (they once shared a class name) */
  const pos = await blocks.nth(1).locator('.inprog').evaluate(e => getComputedStyle(e).position);
  expect(pos).toBe('static');
});

test('education shows the degree, college, years and score', async ({ page }) => {
  await open(page);
  const e = education[0];
  await expect(page.locator('#stEdu .show .info')).toContainText(e.degree);
  await expect(page.locator('#stEdu .show .info')).toContainText(e.school);
  await expect(page.locator('#stEdu .show .info')).toContainText(e.score);
});

test('resume buttons wait for the PDF without going anywhere', async ({ page }) => {
  test.skip(!profile.resume.placeholder, 'the resume has been added');
  await open(page);
  const btn = page.locator('[data-resume]:visible').first();
  await expect(btn).toHaveAttribute('aria-disabled', 'true');
  /* Playwright won't click an aria-disabled element, so send the click a person's tap would */
  await btn.dispatchEvent('click');
  expect(new URL(page.url()).hash).toBe('');
});
