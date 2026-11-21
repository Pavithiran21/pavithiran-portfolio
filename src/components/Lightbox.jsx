import { useEffect, useRef, useState } from 'react';
import { projects } from '../content.js';
import { capOf } from '../lib/util.js';
import { LightboxContext } from './lightbox-context.js';

/* A project's screenshots full size: arrows or ← → step through them, Esc or a click outside closes,
   and focus goes back to the button that opened it. */
export function LightboxProvider({ children }) {
  const dialogRef = useRef(null), closeRef = useRef(null), fromRef = useRef(null);
  const [view, setView] = useState(null); /* { p, j } */

  const open = (p, j, from) => { fromRef.current = from || null; setView({ p, j }); };
  const step = d => setView(v => ({ p: v.p, j: (v.j + d + projects[v.p].images.length) % projects[v.p].images.length }));

  useEffect(() => {
    const dlg = dialogRef.current;
    if (view && !dlg.open) { document.documentElement.classList.add('lb-open'); dlg.showModal(); closeRef.current.focus(); }
  }, [view]);

  const onClose = () => {
    document.documentElement.classList.remove('lb-open');
    setView(null);
    const from = fromRef.current;
    if (from && from.isConnected) from.focus({ preventScroll: true });
  };

  const p = view ? projects[view.p] : null;
  const n = p ? p.images.length : 0;
  return (
    <LightboxContext value={open}>
      {children}
      <dialog className="lb" id="lb" aria-label="Screenshot, full size" ref={dialogRef} onClose={onClose}
        onClick={e => { if (e.target === e.currentTarget || e.target.tagName === 'FIGURE') dialogRef.current.close(); }}
        onKeyDown={e => { if (!view) return; if (e.key === 'ArrowLeft') step(-1); if (e.key === 'ArrowRight') step(1); }}>
        <figure>
          {p ? <img id="lbImg" src={p.images[view.j]} alt={`${p.name}: ${capOf(p.images[view.j])}`} /> : null}
          <figcaption>
            <b>{p?.name}</b><span>{p ? capOf(p.images[view.j]) : ''}</span><small>{p ? `${view.j + 1} / ${n}` : ''}</small>
            <a className="btn pri" href={p?.live} target="_blank" rel="noopener">Open live demo ↗</a>
          </figcaption>
        </figure>
        <button className="lbx" type="button" aria-label="Close" ref={closeRef} onClick={() => dialogRef.current.close()}>×</button>
        <button className="lbp" type="button" aria-label="Previous screen" hidden={n < 2} onClick={() => step(-1)}>‹</button>
        <button className="lbn" type="button" aria-label="Next screen" hidden={n < 2} onClick={() => step(1)}>›</button>
      </dialog>
    </LightboxContext>
  );
}
