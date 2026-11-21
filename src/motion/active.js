/* The section you are in. The nav subscribes to it (useSyncExternalStore), and each change tints the page:
   the background glow and the progress bar take that section's two colours. */

export const PALETTE = {
  hero: ['#5b6cff', '#14d3c2'], about: ['#7c9cff', '#f0abfc'], experience: ['#f59e0b', '#8b5cf6'], projects: ['#8b5cf6', '#ec4899'],
  skills: ['#14b8a6', '#3b82f6'], achievements: ['#22c55e', '#14b8a6'], education: ['#38bdf8', '#a78bfa'], contact: ['#22d3ee', '#6366f1'],
};

let active = 'hero';
const listeners = new Set();

export const subscribeActive = fn => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};
export const getActive = () => active;

export function setActive(key) {
  if (key === active) return;
  active = key;
  const root = document.documentElement;
  (PALETTE[key] || PALETTE.hero).forEach((c, i) => root.style.setProperty('--b' + (i + 1), c));
  listeners.forEach(fn => fn());
}
