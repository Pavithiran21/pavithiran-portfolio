import { useEffect, useState } from 'react';
import { reduced } from '../lib/util.js';

/* Types each phrase, holds it, deletes it, and moves to the next. Screen readers get all the phrases at once
   (the moving text is hidden from them); reduced motion shows the first phrase, still. */
export default function Typewriter({ phrases, typeMs = 55, deleteMs = 28, holdMs = 2200 }) {
  const [state, setState] = useState({ i: 0, n: reduced ? phrases[0].length : 0, del: false });

  useEffect(() => {
    if (reduced) return undefined;
    const { i, n, del } = state, full = phrases[i];
    let wait = del ? deleteMs : typeMs, next;
    if (!del && n < full.length) next = { i, n: n + 1, del };
    else if (!del) { next = { i, n, del: true }; wait = holdMs; }
    else if (n > 0) next = { i, n: n - 1, del };
    else { next = { i: (i + 1) % phrases.length, n: 0, del: false }; wait = 350; }
    const t = setTimeout(() => setState(next), wait);
    return () => clearTimeout(t);
  }, [state, phrases, typeMs, deleteMs, holdMs]);

  return (
    <>
      <span className="sr-only">{phrases.join('. ')}</span>
      <b className="tw" aria-hidden="true">{phrases[state.i].slice(0, state.n)}</b>
    </>
  );
}
