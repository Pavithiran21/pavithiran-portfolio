import { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { onScrollFrame } from '../motion/engine.js';
import { clamp01, pad, reduced } from '../lib/util.js';
import { Monitor } from './Devices.jsx';

/* Share of each step's scroll used for half of the device's turn. */
export const Z = 0.2;

/* A sticky 3D scroll scene: a rail of steps on the left, a device in the middle that makes one full 360° turn
   between steps (the content swaps half-way, while its back faces you), and an info panel on the right.
   Short screens and reduced motion get the same steps as stacked blocks instead (CSS shows one or the other).

   steps:        [{ rail, sub?, c (accent colour), screen (JSX on the monitor), info (JSX in the panel) }]
   per:          scroll distance per step, in vh
   device:       (at) => JSX, a custom device for the pinned stage (default: a monitor showing steps[at].screen)
   renderStatic: (step, k) => JSX, a custom stacked block (default: monitor + info)
   onFrame:      (i, f) => void, called every scroll frame with the step and how far through it you are (0..1)
   ref:          exposes jump(i), which scrolls to step i */
export default function ScrollScene({ id, staticId, steps, per = 40, cls, device, renderStatic, onFrame, onStageClick, stageHint, ref }) {
  const n = steps.length;
  const [at, setAt] = useState(0);
  const atRef = useRef(0);
  const hostRef = useRef(null), staticRef = useRef(null), rigwRef = useRef(null), pinfoRef = useRef(null), railRef = useRef(null);
  const onFrameRef = useRef(onFrame);
  useEffect(() => { onFrameRef.current = onFrame; });

  const jump = i => {
    const host = hostRef.current;
    const behavior = reduced ? 'auto' : 'smooth';
    if (!host.offsetParent) { staticRef.current.children[i]?.scrollIntoView({ behavior, block: 'center' }); return; }
    const span = host.offsetHeight - innerHeight;
    scrollTo({ top: host.getBoundingClientRect().top + scrollY + span * (i + 0.5) / n, behavior });
  };
  useImperativeHandle(ref, () => ({ jump, current: () => atRef.current }));

  useEffect(() => {
    if (reduced) return undefined;
    return onScrollFrame(() => {
      const host = hostRef.current;
      if (!host || !host.offsetParent) return;
      const top = host.getBoundingClientRect().top + scrollY, span = host.offsetHeight - innerHeight, raw = (scrollY - top) / span;
      if (raw < -1.6 || raw > 1.3) return;
      const t = Math.min(n, Math.max(0, raw * n)), i = Math.min(n - 1, Math.floor(t)), f = t - i;
      if (i !== atRef.current) { atRef.current = i; setAt(i); }
      onFrameRef.current?.(i, f);
      /* full turn: the end of a step spins 0 -> -180°, the start of the next carries on 180 -> 0°.
         The slow pan eases to 0 at each boundary so nothing jumps while the back is showing. */
      let turn = 0, pan = -10 + 20 * clamp01((f - Z) / (1 - 2 * Z));
      if (f < Z && i > 0) { turn = (1 - f / Z) * 180; pan = -10 * (f / Z); }
      if (f > 1 - Z && i < n - 1) { const g = (f - (1 - Z)) / Z; turn = -g * 180; pan = 10 * (1 - g); }
      /* starts slowly, is fastest while the back passes, settles slowly */
      turn = Math.sign(turn) * 180 * (Math.abs(turn) / 180) ** 2;
      const enter = clamp01(1 + (scrollY - top) / innerHeight);
      const rigw = rigwRef.current;
      rigw.style.transform = `translateZ(${(enter - 1) * 300}px) rotateX(${8 + (1 - enter) * 26}deg) rotateY(${pan + turn}deg)`;
      rigw.style.opacity = Math.max(0.15, enter);
      const fly = Math.min(1, Math.abs(turn) / 90);
      const fl = rigw.querySelector('.float');
      if (fl) { fl.style.transform = `translateZ(${130 + fly * 120}px) translateX(${fly * 160}px) rotateY(${-turn * 0.6}deg)`; fl.style.opacity = 1 - fly; }
      pinfoRef.current.style.opacity = 1 - fly * 0.8;
      railRef.current.querySelectorAll('.bar').forEach((b, j) => { b.style.transform = `scaleX(${j < i ? 1 : j === i ? f : 0})`; });
    }, 10);
  }, [n]);

  const step = steps[at];
  return (
    <>
      <div className={'sw' + (cls ? ' ' + cls : '')} id={id} ref={hostRef} style={{ height: `calc(${n} * ${per}vh + 100vh)` }}>
        <div className="pin">
          <div className="wrap pinwrap">
            <nav className="rail" aria-label="Jump to a step" ref={railRef}>
              {steps.map((s, i) => (
                <button key={i} type="button" className={i === at ? 'on' : ''} style={{ '--c': s.c }} onClick={() => jump(i)}>
                  <b>{pad(i + 1)}</b><span>{s.rail}</span>{s.sub ? <small>{s.sub}</small> : null}<i className="bar" />
                </button>
              ))}
            </nav>
            <div className="stage3d" style={{ '--c': step.c }}>
              <div className="glow" style={{ '--c': step.c }} />
              <div className={'rigw' + (onStageClick ? ' go' : '')} ref={rigwRef} onClick={onStageClick ? () => onStageClick(atRef.current) : undefined}>
                {device ? device(at) : <Monitor><div key={at} style={{ display: 'contents' }}>{step.screen}</div></Monitor>}
                {stageHint ? <span className="hint" aria-hidden="true" style={{ '--c': step.c }}>{stageHint(at)}</span> : null}
              </div>
              <div className="count"><b>{pad(at + 1)}</b> / {pad(n)}</div>
            </div>
            <div className="pinfo" aria-live="polite" ref={pinfoRef} style={{ '--c': step.c }}>
              <div className="anim" key={at}>{step.info}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="wrap static" id={staticId} ref={staticRef}>
        {steps.map((s, k) => (renderStatic ? renderStatic(s, k) : (
          <article key={k} className="show" style={{ '--c': s.c }} data-reveal>
            <div className="stage"><div className="glow" style={{ '--c': s.c }} /><Monitor>{s.screen}</Monitor></div>
            <div className="info">{s.info}</div>
          </article>
        )))}
      </div>
    </>
  );
}
