import { useEffect, useLayoutEffect, useRef, useSyncExternalStore } from 'react';
import { getActive, subscribeActive } from '../motion/active.js';
import Icon from './Icon.jsx';
import ResumeLink from './ResumeLink.jsx';

const LINKS = [
  ['about', 'About', 'About'], ['experience', 'Experience', 'Exp'], ['projects', 'Projects', 'Projects'],
  ['skills', 'Skills', 'Skills'], ['contact', 'Contact', 'Contact'],
];

/* A floating dock pill (top on computers, a bottom tab bar on phones and tablets). A highlight in the current
   section's colours slides to the link of the section you are in. */
export default function Nav() {
  const active = useSyncExternalStore(subscribeActive, getActive, () => 'hero');
  const navRef = useRef(null), indRef = useRef(null);

  const moveInd = () => {
    const a = navRef.current?.querySelector('a.l.on'), ind = indRef.current;
    if (!ind) return;
    if (!a) { ind.style.opacity = 0; return; }
    ind.style.opacity = 1; ind.style.left = a.offsetLeft + 'px'; ind.style.width = a.offsetWidth + 'px';
  };
  useLayoutEffect(moveInd, [active]);
  useEffect(() => {
    addEventListener('resize', moveInd);
    document.fonts?.ready.then(moveInd);
    return () => removeEventListener('resize', moveInd);
  }, []);

  return (
    <>
      <div className="topbar">
        <a className="brand" href="#top" aria-label="Pavithiran, back to top"><i>P</i><span>Pavithiran</span></a>
        <ResumeLink className="cv"><Icon name="download" />Resume</ResumeLink>
      </div>
      <nav className="nav" aria-label="Sections" ref={navRef}>
        <a className="me" href="#top" aria-label="Pavithiran, back to top"><i>P</i><span>Pavithiran</span></a>
        <span className="ind" aria-hidden="true" ref={indRef} />
        {LINKS.map(([id, label, short]) => (
          <a key={id} className={'l' + (active === id ? ' on' : '')} href={'#' + id} aria-label={label} aria-current={active === id ? 'true' : undefined}>
            <Icon name={id} /><span className="t">{label}</span><span className="ts" aria-hidden="true">{short}</span>
          </a>
        ))}
        <ResumeLink className="cv"><Icon name="download" />Resume</ResumeLink>
      </nav>
    </>
  );
}
