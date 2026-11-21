import { certifications } from '../content.js';
import { slug } from '../lib/util.js';
import ScrollScene from '../components/ScrollScene.jsx';
import SectionHead from '../components/SectionHead.jsx';
import { Certificate, Top } from '../components/Screens.jsx';

const COLORS = ['#22c55e', '#14b8a6', '#7c9cff'];

const steps = certifications.map((x, k) => {
  if (x.status === 'in-progress') {
    /* a course still running: only what is known, no issuer, ID or verify link */
    const c = '#f59e0b';
    return {
      rail: x.name, sub: 'In progress', c,
      screen: <>
        <Top file={`learning/${slug(x.name)}.md`} extra="in progress" />
        <Certificate c={c} seal="…" kind="Course in progress" title={x.name} lines={['Pavithiran', x.year]} footLeft="Status: in progress" footRight="Certificate on completion" />
      </>,
      info: <>
        <span className="kind"><span className="inprog">In progress</span> {x.year}</span><h3>{x.name}</h3><p>A course I&apos;m taking now.</p>
        <ul><li>{x.year}</li><li>Certificate added when I finish</li></ul>
      </>,
    };
  }
  const c = COLORS[k % COLORS.length];
  return {
    rail: x.name, sub: 'Completed', c,
    screen: <>
      <Top file={`certificates/certificate-${k + 1}.pdf`} extra="preview" />
      <Certificate c={c} seal="✓" kind="Certificate of completion" title={x.name} lines={['Awarded to Pavithiran', `${x.issuer} · ${x.year}`]} footLeft={`ID: ${x.id}`} footRight="Verify ↗" />
    </>,
    info: <>
      <span className="kind">{x.issuer} · {x.year}</span><h3>{x.name}</h3>
      <ul><li>Issued by {x.issuer}</li><li>Dates: {x.year}</li><li>Credential ID: {x.id}</li></ul>
      <div className="meta"><a className="btn pri" href={x.url} target="_blank" rel="noopener">Verify ↗</a></div>
    </>,
  };
});

export default function Achievements() {
  return (
    <section className="scene-sec" id="achievements" data-bg="achievements">
      <div className="sec-line" aria-hidden="true" />
      <SectionHead eyebrow="Achievements" text="Certifications" grad="& learning." sub="Certificates I’ve earned, and what I’m learning now." />
      <ScrollScene id="swCerts" staticId="stCerts" steps={steps} />
      <div style={{ height: 110 }} />
    </section>
  );
}
