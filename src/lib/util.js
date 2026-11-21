import { profile } from '../content.js';

const mq = q => typeof window !== 'undefined' && window.matchMedia(q).matches;
/* Read once at start-up, like the design: the page is built for one motion setting per visit. */
export const reduced = mq('(prefers-reduced-motion: reduce)');
/* A mouse (or trackpad) that can hover: hero tilt and the Skills dock magnify only run there. */
export const fine = mq('(hover: hover) and (pointer: fine)');

export const pad = n => String(n).padStart(2, '0');
export const clamp01 = x => Math.min(1, Math.max(0, x));
export const slug = t => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const repoUrl = p => `${profile.github}/${p.repo}`;
export const telHref = t => 'tel:' + t.replace(/[^+\d]/g, '');

/* The React UI, the API logos and the database of one project. */
export const stackOf = p => ['React', ...(p.api === 'Express' ? ['Node.js', 'Express'] : p.api === 'Spring Boot' ? ['Spring Boot', 'Java'] : ['FastAPI', 'Python']), p.db];

/* Screen name from the image file name: /img/billsy-invoice-pdf.png -> "Invoice PDF". */
export const capOf = src => {
  const s = src.split('/').pop().replace(/\.\w+$/, '').split('-').slice(1).map(w => (w === 'pdf' ? 'PDF' : w)).join(' ');
  return s.charAt(0).toUpperCase() + s.slice(1);
};
