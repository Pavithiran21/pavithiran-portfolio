import { useEffect, useRef } from 'react';
import { reduced } from '../lib/util.js';

const LINK = 140;

/* The background: nodes drift, link up when close, and packets of light hop along the links.
   Kept light so it never slows the page: no reaction to the mouse, at most 55 nodes, about 30 frames a second,
   paused while you scroll or click and while the tab is hidden. Colours follow the current section (--b1, --b2). */
export default function NetBackground() {
  const ref = useRef(null);

  useEffect(() => {
    const net = ref.current, cx = net.getContext('2d'), root = document.documentElement;
    let W = 0, H = 0, nodes = [], packets = [], fr = 0, c1 = '', c2 = '', raf = 0, rt = 0, busyUntil = 0, tick = 0;

    const build = () => {
      const dpr = Math.min(1.5, devicePixelRatio || 1);
      W = innerWidth; H = innerHeight;
      net.width = W * dpr; net.height = H * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.max(24, Math.min(55, Math.round(W * H / 22000)));
      nodes = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5, r: 1 + Math.random() * 1.6 }));
      packets = Array.from({ length: n > 40 ? 6 : 4 }, () => ({ a: 0, b: 0, t: 1 }));
    };
    const near = (a, max) => { const o = []; nodes.forEach((m, k) => { if (m !== nodes[a]) { const d = Math.hypot(m.x - nodes[a].x, m.y - nodes[a].y); if (d < max) o.push(k); } }); return o; };
    const hop = pk => {
      let from = pk.t >= 1 && nodes[pk.b] ? pk.b : Math.floor(Math.random() * nodes.length);
      let o = near(from, LINK);
      if (!o.length) { from = Math.floor(Math.random() * nodes.length); o = near(from, LINK); }
      if (!o.length) { pk.t = 1; return; }
      pk.a = from; pk.b = o[Math.floor(Math.random() * o.length)]; pk.t = 0;
    };
    const draw = move => {
      if (fr++ % 10 === 0 || !c1) { const cs = getComputedStyle(root); c1 = cs.getPropertyValue('--b1').trim(); c2 = cs.getPropertyValue('--b2').trim(); }
      cx.clearRect(0, 0, W, H);
      if (move) nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < -20) n.x = W + 20; if (n.x > W + 20) n.x = -20; if (n.y < -20) n.y = H + 20; if (n.y > H + 20) n.y = -20;
      });
      cx.strokeStyle = c1; cx.lineWidth = 1;
      for (let a = 0; a < nodes.length; a++) for (let b = a + 1; b < nodes.length; b++) {
        const d = Math.hypot(nodes[a].x - nodes[b].x, nodes[a].y - nodes[b].y);
        if (d < LINK) { cx.globalAlpha = (1 - d / LINK) * 0.5; cx.beginPath(); cx.moveTo(nodes[a].x, nodes[a].y); cx.lineTo(nodes[b].x, nodes[b].y); cx.stroke(); }
      }
      cx.fillStyle = c2;
      nodes.forEach(n => { cx.globalAlpha = 0.85; cx.beginPath(); cx.arc(n.x, n.y, n.r, 0, 7); cx.fill(); });
      packets.forEach(pk => {
        if (pk.t >= 1) hop(pk);
        const A = nodes[pk.a], B = nodes[pk.b]; if (!A || !B || pk.t >= 1) return;
        if (Math.hypot(A.x - B.x, A.y - B.y) > LINK) { pk.t = 1; return; }
        if (move) pk.t += 0.03;
        const x = A.x + (B.x - A.x) * pk.t, y = A.y + (B.y - A.y) * pk.t;
        /* the glow is a soft larger dot: the same look as shadowBlur at a fraction of the cost */
        cx.fillStyle = c2; cx.globalAlpha = 0.3; cx.beginPath(); cx.arc(x, y, 7, 0, 7); cx.fill();
        cx.fillStyle = '#fff'; cx.globalAlpha = 1; cx.beginPath(); cx.arc(x, y, 2.4, 0, 7); cx.fill(); cx.fillStyle = c2;
      });
      cx.globalAlpha = 1;
    };

    build();
    const hold = () => { busyUntil = performance.now() + 160; };
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (document.hidden || performance.now() < busyUntil || tick++ % 2) return;
      draw(true);
    };
    const onResize = () => { clearTimeout(rt); rt = setTimeout(() => { build(); if (reduced) draw(false); }, 200); };
    if (reduced) draw(false);
    else {
      addEventListener('scroll', hold, { passive: true });
      addEventListener('pointerdown', hold, { passive: true });
      raf = requestAnimationFrame(loop);
    }
    addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf); clearTimeout(rt);
      removeEventListener('scroll', hold); removeEventListener('pointerdown', hold); removeEventListener('resize', onResize);
    };
  }, []);

  return <div className="bg" aria-hidden="true"><canvas id="net" ref={ref} /></div>;
}
