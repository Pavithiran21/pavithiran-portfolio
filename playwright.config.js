import { defineConfig, devices } from '@playwright/test';

/* The suite runs against the production build (vite preview), on six screen sizes.
   BASE_URL=https://... runs it against a deployed copy instead. */
const PORT = 4180;
const baseURL = process.env.BASE_URL || `http://localhost:${PORT}`;
const chrome = devices['Desktop Chrome'];

export default defineConfig({
  testDir: 'tests',
  timeout: 60_000,
  expect: { timeout: 8_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : [['list']],
  use: { baseURL, trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  webServer: process.env.BASE_URL ? undefined : {
    command: `npm run build && npx vite preview --port ${PORT} --strictPort`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    { name: 'desktop', use: { ...chrome, viewport: { width: 1920, height: 1080 } } },
    { name: 'laptop', use: { ...chrome, viewport: { width: 1280, height: 720 } } },
    { name: 'tablet', use: { ...chrome, viewport: { width: 820, height: 1180 }, hasTouch: true } },
    { name: 'phone', use: { ...chrome, viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
    { name: 'small-phone', use: { ...chrome, viewport: { width: 320, height: 568 }, isMobile: true, hasTouch: true } },
    { name: 'landscape', use: { ...chrome, viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true } },
  ],
});
