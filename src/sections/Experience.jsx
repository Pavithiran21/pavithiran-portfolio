import { experience } from '../content.js';
import { slug } from '../lib/util.js';
import ScrollScene from '../components/ScrollScene.jsx';
import SectionHead from '../components/SectionHead.jsx';
import { Code, Top } from '../components/Screens.jsx';

const COLORS = ['#f59e0b', '#8b5cf6', '#22d3a6', '#7c9cff'];

/* One step per role, newest first; the rail is drawn as a timeline (one company, so it names the role). */
const steps = experience.map((j, k) => ({
  rail: j.title, sub: j.when, c: COLORS[k % COLORS.length],
  screen: <>
    <Top file={`experience/${slug(j.org)}/${slug(j.title)}.md`} extra="markdown" />
    <Code one lines={[
      <><span className="k"># </span>{j.title}</>,
      <><span className="f">**</span>{j.org}<span className="f">**</span> · {j.when}</>,
      '',
      ...j.points.map(x => <><span className="k">- </span>{x}</>),
    ]} />
  </>,
  info: <>
    <span className="kind">{j.when}</span><h3>{j.title}</h3><p>{j.org}</p>
    <ul>{j.points.map(x => <li key={x}>{x}</li>)}</ul>
  </>,
}));

export default function Experience() {
  return (
    <section className="scene-sec" id="experience" data-bg="experience">
      <div className="sec-line" aria-hidden="true" />
      <SectionHead eyebrow="Experience" text="Where I've" grad="worked." sub="A timeline of my roles and what each one delivered." />
      <ScrollScene id="swExp" staticId="stExp" steps={steps} cls="timeline" />
      <div style={{ height: 110 }} />
    </section>
  );
}
