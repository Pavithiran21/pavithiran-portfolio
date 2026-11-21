import { clamp01, reduced } from '../lib/util.js';
import { setActive } from './active.js';
import { onScrollFrame } from './engine.js';

const easeIO = t => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

/* Page-wide motion, set up once after the page has rendered. Returns a clean-up function. */
export function initPageMotion() {
  const root = document.documentElement;
  const offs = [];
  const secs = [...document.querySelectorAll('section[data-bg]')];

  /* progress bar along the top */
  const prog = document.getElementById('prog');
  offs.push(onScrollFrame(() => {
    const max = root.scrollHeight - innerHeight;
    prog.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
  }, 0));

  /* 3D fold between sections: while a section's bottom climbs from the bottom of the screen to 20% from the top,
     its visible block (the sticky stage, or the whole Skills block) tilts back and sinks, and the next section's
     heading stands up from lying back. */
  const folds = secs.filter(s => s.dataset.bg !== 'hero').map((s, k, all) => ({
    s, last: k === all.length - 1, head: s.querySelector('.head'), pin: s.querySelector('.pin'),
    stat: s.querySelector('.static'), block: s.querySelector('.sw') ? null : s.querySelector(':scope > .wrap'),
  }));
  const setFold = (el, tf, op) => {
    if (!el) return;
    if (tf) { el.classList.add('fold'); el.style.transform = tf; el.style.opacity = op; }
    else if (el.classList.contains('fold')) { el.classList.remove('fold'); el.style.transform = ''; el.style.opacity = ''; }
  };
  if (!reduced) offs.push(onScrollFrame(() => {
    const H = innerHeight, D = Math.min(1400, Math.max(900, innerWidth * 0.8));
    folds.forEach(f => {
      const r = f.s.getBoundingClientRect();
      const tin = easeIO(clamp01((H - r.top) / (H * 0.8)));
      const tout = f.last || r.bottom < 0 ? 0 : easeIO(clamp01((H - r.bottom) / (H * 0.8)));
      const up = tin > 0 ? 1 - tin : 0;
      /* one transform from both movements, so a short section (Skills) can still be standing up as it starts to fold */
      const tf = (u, o) => (u > 0.001 || o > 0.001 ? `perspective(${D}px) translateZ(${-o * 260}px) translateY(${u * 140 - o * 40}px) rotateX(${u * 48 + o * 42}deg) scale(${1 - u * 0.1})` : '');
      const outEl = f.block || (f.pin && f.pin.offsetParent ? f.pin : f.stat);
      const inEl = f.block || f.head;
      if (inEl === outEl) setFold(inEl, tf(up, tout), (0.2 + 0.8 * (1 - up)) * (1 - tout * 0.8));
      else { setFold(inEl, tf(up, 0), 0.2 + 0.8 * (1 - up)); setFold(outEl, tf(0, tout), 1 - tout * 0.8); }
    });
  }, 20));

  /* the active section is the last one whose top has passed 35% down the screen (works for short sections too) */
  offs.push(onScrollFrame(() => {
    let k = 'hero';
    const line = innerHeight * 0.35;
    secs.forEach(s => { if (s.getBoundingClientRect().top <= line) k = s.dataset.bg; });
    setActive(k);
  }, 30));

  /* stacked blocks (landscape phones): each device does a half spin from its back (the P logo) to facing you
     as it rises to 30% up the screen, then tilts gently away */
  const blockDevs = [...document.querySelectorAll('.static .show .stage > .laptop, .static .show .stage > .monitor')];
  if (!reduced) offs.push(onScrollFrame(() => {
    const H = innerHeight;
    blockDevs.forEach(d => {
      if (!d.offsetParent) { if (d.style.transform) d.style.transform = ''; return; }
      const r = d.getBoundingClientRect();
      if (r.bottom < -50 || r.top > H + 50) return;
      const c = Math.max(-1, Math.min(1, ((r.top + r.height / 2) / H - 0.5) * 2));
      const side = d.closest('.show').matches(':nth-child(even)') ? -1 : 1;
      const t = Math.max(0, (c - 0.3) / 0.7);
      const ry = c > 0 ? 180 * t * t * side : c * 24 * side;
      d.style.transform = `rotateY(${ry}deg) rotateX(${c > 0 ? c * 8 : c * 4}deg) translateZ(${-Math.abs(c) * 40}px)`;
    });
  }, 40));

  /* hero exit: the devices tilt back and the text lifts away as you scroll down */
  const scene = document.getElementById('scene'), heroCopy = document.querySelector('.hero .wrap > div');
  if (!reduced) offs.push(onScrollFrame(() => {
    const k = clamp01(scrollY / (innerHeight * 0.9));
    scene.style.transform = k ? `perspective(1400px) translateY(${k * 90}px) rotateX(${k * 18}deg) scale(${1 - k * 0.1})` : '';
    scene.style.opacity = k ? 1 - k * 0.6 : '';
    heroCopy.style.transform = k ? `translateY(${k * -50}px)` : '';
    heroCopy.style.opacity = k ? 1 - k * 0.8 : '';
  }, 50));

  /* entrances: [data-reveal] blocks get .in as they come into view; sections get .seen for the line sweep */
  const reveals = document.querySelectorAll('[data-reveal]');
  let io = null, sio = null;
  if (reduced || !('IntersectionObserver' in window)) reveals.forEach(e => e.classList.add('in'));
  else {
    io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => io.observe(el));
  }
  if ('IntersectionObserver' in window) {
    sio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('seen'); sio.unobserve(e.target); } }), { threshold: 0.02 });
    secs.forEach(x => sio.observe(x));
  }

  return () => {
    offs.forEach(off => off());
    io?.disconnect();
    sio?.disconnect();
  };
}
