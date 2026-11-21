import { education } from '../content.js';
import ScrollScene from '../components/ScrollScene.jsx';
import SectionHead from '../components/SectionHead.jsx';
import { Code, JsonLine, Top } from '../components/Screens.jsx';

const steps = education.map((x, k) => {
  const rows = [['degree', x.degree], ['college', x.school], ['years', x.when], ['score', x.score], ['city', x.place]];
  return {
    rail: x.degree, sub: x.when, c: ['#38bdf8', '#a78bfa'][k % 2],
    screen: <>
      <Top file="education.json" extra="profile" />
      <Code one lines={['{', ...rows.map(([key, val], i) => <JsonLine key={key} k={key} v={`"${val}"`} comma={i < rows.length - 1} />), '}']} />
    </>,
    info: <>
      <span className="kind">{x.when}</span><h3>{x.degree}</h3><p>{x.school} · {x.place}</p>
      <ul><li>Years: {x.when}</li><li>Score: {x.score}</li></ul>
    </>,
  };
});

export default function Education() {
  return (
    <section className="scene-sec" id="education" data-bg="education">
      <div className="sec-line" aria-hidden="true" />
      <SectionHead eyebrow="Education" text="Where I" grad="studied." sub="My degree and college." />
      <ScrollScene id="swEdu" staticId="stEdu" steps={steps} />
      <div style={{ height: 110 }} />
    </section>
  );
}
