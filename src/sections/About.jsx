import { profile } from '../content.js';
import ResumeLink from '../components/ResumeLink.jsx';
import ScrollScene from '../components/ScrollScene.jsx';
import SectionHead from '../components/SectionHead.jsx';
import { Code, JsonLine, Kanban, Settings, Top } from '../components/Screens.jsx';

const KANBAN = [
  ['Design', '#f0abfc', ['Screen flows', 'Empty and error states']],
  ['Build UI', '#7c9cff', ['React components', 'Forms and validation']],
  ['Build API', '#5eead4', ['REST endpoints', 'DB schema + migrations']],
  ['Test', '#f59e0b', ['Playwright API tests', 'UI tests']],
  ['Ship', '#22c55e', ['CI pipeline', 'Deploy + demo account']],
];
const shortLoc = profile.location.replace(/, India$/, '');
const openTo = profile.openTo.toLowerCase();

const aboutJson = [
  '{',
  <JsonLine key="n" k="name" v={`"${profile.name}"`} />,
  <JsonLine key="r" k="role" v={`"${profile.role}"`} />,
  <JsonLine key="e" k="experience" v={`"${profile.years} years"`} />,
  <JsonLine key="l" k="location" v={`"${profile.location}"`} />,
  <JsonLine key="f" k="frontend" v='["React 19", "Tailwind CSS 4"]' />,
  <JsonLine key="b" k="backend" v='["Java", "Python", "Node.js"]' />,
  <JsonLine key="d" k="databases" v='["MySQL", "MongoDB"]' />,
  <JsonLine key="t" k="tests" v='"Playwright"' />,
  <JsonLine key="o" k="openTo" v={`"${profile.openTo}"`} comma={false} />,
  '}',
];

const steps = [
  {
    rail: 'Who I am', c: '#7c9cff',
    screen: <><Top file="about.json" extra="profile" /><Code lines={aboutJson} aside={<div className="photo pp" style={{ '--k': 3 }}><i>P</i></div>} /></>,
    info: <>
      <span className="kind">Who I am</span><h3>Hi, I&apos;m {profile.name}</h3><p>{profile.bio[0]}</p>
      <ul><li>Full stack developer, {profile.years} years</li><li>Based in {profile.location}</li><li>Open to {openTo}</li></ul>
      <div className="meta"><ResumeLink className="btn pri">View resume</ResumeLink></div>
    </>,
  },
  {
    rail: 'How I work', c: '#5eead4',
    screen: <><Top file="my-workflow" extra="board" /><Kanban cols={KANBAN} /></>,
    info: <>
      <span className="kind">How I work</span><h3>From planning to production</h3><p>{profile.bio[1]}</p>
      <ul><li>Front ends in React with Tailwind CSS</li><li>APIs in Node.js, Spring Boot or FastAPI</li><li>Data in MySQL or MongoDB</li><li>Playwright tests and CI before anything ships</li></ul>
    </>,
  },
  {
    rail: "What I'm looking for", c: '#f0abfc',
    screen: <><Top file="status" extra="settings" /><Settings rows={[
      ['Open to work', <span key="t" className="tog" />], ['Role', 'Full stack · Backend'], ['Experience', profile.years + ' years'],
      ['Location', shortLoc], ['Work mode', profile.workMode.join(' · ')], ['Notice period', profile.notice],
    ]} /></>,
    info: <>
      <span className="kind">What I&apos;m looking for</span><h3>My next role</h3><p>{profile.bio[2]}</p>
      <ul><li>Location: {profile.location}</li><li>Work: {profile.workMode.join(' · ')}</li><li>Notice period: {profile.notice}</li></ul>
      <div className="meta"><a className="btn pri" href="#contact">Contact me</a></div>
    </>,
  },
];

export default function About() {
  return (
    <section className="scene-sec" id="about" data-bg="about">
      <div className="sec-line" aria-hidden="true" />
      <SectionHead eyebrow="About" text="A developer who" grad="ships." sub="Who I am, what I've built and how I work. Keep scrolling." />
      <ScrollScene id="swAbout" staticId="stAbout" steps={steps} />
      <div style={{ height: 110 }} />
    </section>
  );
}
