import { useEffect, useRef, useState } from 'react';
import { profile, projects } from '../content.js';
import { fine, reduced, stackOf } from '../lib/util.js';
import Icon from '../components/Icon.jsx';
import Logo from '../components/Logo.jsx';
import ResumeLink from '../components/ResumeLink.jsx';
import Typewriter from '../components/Typewriter.jsx';

const N = projects.length;
const pick = (p, k) => p.images[k % p.images.length];
const totalTests = projects.reduce((a, p) => a + p.tests, 0);

/* Hero: the name, the role, the two buttons, real numbers, and three devices showing a different app every few
   seconds. The devices tilt with the mouse (sway on touch screens); a click jumps to that app in Projects. */
export default function Hero({ onPick }) {
  const [cur, setCur] = useState(0);
  const pausedRef = useRef(false), sceneRef = useRef(null), rigRef = useRef(null);
  const [timerKey, setTimerKey] = useState(0);
  const p = projects[cur], st = stackOf(p);

  useEffect(() => {
    if (reduced) return undefined;
    const id = setInterval(() => { if (!pausedRef.current && !document.hidden) setCur(c => (c + 1) % N); }, 3800);
    return () => clearInterval(id);
  }, [timerKey]);

  const onMove = e => {
    if (!fine || reduced) return;
    const r = sceneRef.current.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    rigRef.current.style.transform = `rotateY(${-12 + x * 16}deg) rotateX(${5 - y * 10}deg)`;
  };

  return (
    <section className="hero" id="top" data-bg="hero">
      <div className="wrap">
        <div>
          <p className="hello">Software developer · <Typewriter phrases={profile.typed} /></p>
          {/* each letter rises in once on load; screen readers get the whole name */}
          <h1 aria-label={profile.name}>
            {[...profile.name].map((ch, i) => <span key={i} className="ch" aria-hidden="true" style={{ '--i': i }}>{ch}</span>)}
          </h1>
          <p className="role">{profile.role} · <span>{profile.years} years</span></p>
          <p className="lead">{profile.tagline}</p>
          <div className="ctas">
            <ResumeLink className="btn pri">Download resume <Icon name="download" /></ResumeLink>
            <a className="btn sec" href="#contact">Contact me</a>
          </div>
          {/* every number is counted from content.js (all 8 repos have a GitHub Actions ci.yml) */}
          <ul className="proof" id="proof" aria-label="At a glance">
            <li><b>{N}</b>live apps</li>
            <li><b>{totalTests}</b>Playwright tests</li>
            <li><b>{N}/{N}</b>repos with CI</li>
          </ul>
          <div className="now" id="now" style={{ '--c': p.accent }}>
            <div><div className="lbl">now showing</div><b id="nowName">{p.name}</b> <small id="nowKind">· {p.kind}</small></div>
            <div className="dots" id="dots">
              {projects.map((q, i) => (
                <button key={q.name} type="button" aria-label={`Show ${q.name}`} className={i === cur ? 'on' : ''} style={{ '--c': p.accent }}
                  onClick={() => { setCur(i); setTimerKey(k => k + 1); }} />
              ))}
            </div>
          </div>
        </div>
        <div className="scene" id="scene" ref={sceneRef} aria-label="My apps running on a monitor, a laptop and in a browser"
          onMouseEnter={() => { pausedRef.current = true; }}
          onMouseLeave={() => { pausedRef.current = false; rigRef.current.style.transform = ''; }}
          onMouseMove={onMove} onClick={() => onPick(cur)}>
          <div className="glow" id="heroGlow" style={{ '--c': p.accent }} />
          <div className="rig" id="rig" ref={rigRef}>
            <div className="monitor"><div className="bez"><div className="screen"><div className="strip" style={{ transform: `translateX(-${cur * 100}%)` }}>{projects.map(q => <img key={q.name} src={pick(q, 0)} alt="" />)}</div></div></div><div className="neck" /><div className="base" /></div>
            <div className="laptop"><div className="lid"><div className="screen"><div className="strip" style={{ transform: `translateX(-${cur * 100}%)` }}>{projects.map(q => <img key={q.name} src={pick(q, 1)} alt="" />)}</div></div></div><div className="deck" /></div>
            <div className="browser"><div className="bar"><i /><i /><i /><span id="url">{p.live.replace('https://', '')}</span></div><div className="screen"><div className="strip" style={{ transform: `translateX(-${cur * 100}%)` }}>{projects.map(q => <img key={q.name} src={pick(q, 2)} alt="" />)}</div></div></div>
            {st.map((name, j) => <div key={`${cur}-${j}`} className={`badge b${j + 1} pop`}><Logo name={name} size={22} />{name}</div>)}
          </div>
          <span className="hint" id="heroHint" aria-hidden="true" style={{ '--c': p.accent }}>See {p.name} ↓</span>
        </div>
      </div>
    </section>
  );
}
