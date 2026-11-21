import { useState } from 'react';
import { projects } from '../content.js';
import { capOf, repoUrl, stackOf } from '../lib/util.js';
import Icon from '../components/Icon.jsx';
import Logo from '../components/Logo.jsx';
import ScrollScene, { Z } from '../components/ScrollScene.jsx';
import SectionHead from '../components/SectionHead.jsx';
import { Laptop, ScreenshotMonitor, Strip } from '../components/Devices.jsx';
import { useLightbox } from '../components/lightbox-context.js';

/* The info panel for one app. `shot` is the screenshot on screen; its caption is the "view full size" button. */
function ProjectInfo({ p, k, shot }) {
  const openLightbox = useLightbox();
  return <>
    <span className="kind">{p.kind}</span><h3>{p.name}</h3>
    <p className="prob"><b>Problem</b>{p.problem}</p>
    <p className="sum">{p.summary}</p>
    <ul>{p.hard.map(h => <li key={h}>{h}</li>)}</ul>
    <div className="stackrow">{stackOf(p).map(n => <span key={n}><Logo name={n} size={20} />{n}</span>)}</div>
    <div className="meta">
      <a className="btn pri" href={p.live} target="_blank" rel="noopener">Open live demo</a>
      <a className="btn sec" href={repoUrl(p)} target="_blank" rel="noopener">GitHub ↗</a>
      <span className="t">✓ {p.tests} Playwright tests</span>
      <button className="zoom" type="button" aria-label={`View ${p.name} screen full size`} onClick={e => openLightbox(k, shot, e.currentTarget)}>
        <Icon name="zoom" width={2.2} /><span>{capOf(p.images[shot])}</span>
      </button>
    </div>
    <div className="hostrow">
      <p className="hostnote">Free hosting: the first load can take up to a minute.</p>
      <div className="shots" aria-hidden="true">{p.images.map((src, j) => <i key={src} className={j === shot ? 'on' : ''} />)}</div>
    </div>
  </>;
}

/* Stacked block (short screens, reduced motion): the device with thumbnails under it; tapping the device opens
   the screenshot full size. */
function StaticProject({ p, k }) {
  const [j, setJ] = useState(0);
  const openLightbox = useLightbox();
  const alt = `${p.name} screenshot`;
  const device = k % 2
    ? <ScreenshotMonitor className="dev"><Strip images={p.images} at={j} alt={alt} /></ScreenshotMonitor>
    : <Laptop className="dev"><Strip images={p.images} at={j} alt={alt} /></Laptop>;
  return (
    <article className="show" style={{ '--c': p.accent }} data-reveal>
      <div className="stage" style={{ cursor: 'zoom-in' }} onClick={e => { if (!e.target.closest('.thumbs')) openLightbox(k, j, e.currentTarget); }}>
        <div className="glow" style={{ '--c': p.accent }} />
        {device}
        <div className="thumbs">
          {p.images.map((src, i) => (
            <button key={src} type="button" className={i === j ? 'on' : ''} aria-label={`${p.name} screen ${i + 1}`}
              onMouseEnter={() => setJ(i)} onFocus={() => setJ(i)} onClick={() => setJ(i)}><img src={src} alt="" /></button>
          ))}
        </div>
      </div>
      <div className="info"><ProjectInfo p={p} k={k} shot={j} /></div>
    </article>
  );
}

export default function Projects({ sceneRef }) {
  const [shot, setShot] = useState(0);
  const [stepAt, setStepAt] = useState(0);

  /* while you scroll through an app's step, its screenshots slide past one after another */
  const onFrame = (i, f) => {
    const n = projects[i].images.length;
    const k = Math.min(n - 1, Math.max(0, Math.floor((f - Z) / (1 - 2 * Z - 0.02) * n)));
    if (i !== stepAt) setStepAt(i);
    if (k !== shot || i !== stepAt) setShot(k);
  };

  const steps = projects.map((p, k) => ({
    rail: p.name, c: p.accent,
    info: <ProjectInfo p={p} k={k} shot={k === stepAt ? shot : 0} />,
  }));

  /* the pinned device: a laptop with the app's screenshots and a browser window floating beside it */
  const device = at => {
    const p = projects[at], s = at === stepAt ? shot : 0;
    return <>
      <Laptop><Strip key={p.name} images={p.images} at={s} alt={`${p.name} screenshot`} /></Laptop>
      <div className="browser float">
        <div className="bar"><i /><i /><i /><span className="url">{p.live.replace('https://', '')}</span></div>
        <div className="screen"><img className="img2" alt="" src={p.images[(s + 1) % p.images.length]} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top left' }} /></div>
      </div>
    </>;
  };

  return (
    <section className="scene-sec" id="projects" data-bg="projects">
      <div className="sec-line" aria-hidden="true" />
      <SectionHead eyebrow="Projects" text="Eight real apps," grad="running live." sub="Each one: the problem, the stack, a live demo and the code. Keep scrolling: each app turns onto the screen in turn." />
      <ScrollScene ref={sceneRef} id="swWork" staticId="stWork" steps={steps} per={42} device={device} onFrame={onFrame}
        onStageClick={i => window.open(projects[i].live, '_blank', 'noopener')}
        stageHint={i => `Open ${projects[i].name} live demo ↗`}
        renderStatic={(s, k) => <StaticProject key={k} p={projects[k]} k={k} />} />
      <div style={{ height: 110 }} />
    </section>
  );
}
