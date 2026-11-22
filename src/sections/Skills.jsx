import { skillNotes, skills, usedIn } from '../content.js';
import { fine, reduced } from '../lib/util.js';
import Icon from '../components/Icon.jsx';
import Logo from '../components/Logo.jsx';
import { H2 } from '../components/SectionHead.jsx';

const GROUP_COLOR = { Languages: '#fbbf24', Frontend: '#38bdf8', Backend: '#22c55e', Database: '#a78bfa', 'Cloud & Architecture': '#60a5fa', Testing: '#f59e0b', 'DevOps & Tools': '#f472b6' };

/* mouse screens: tiles near the pointer grow a little, like a dock */
const magnify = e => {
  if (!fine || reduced) return;
  [...e.currentTarget.children].forEach(t => {
    const r = t.getBoundingClientRect(), d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2)), k = Math.max(0, 1 - d / 150);
    t.style.transform = `scale(${1 + k * 0.22}) translateY(${-k * 6}px)`;
  });
};
/* soft hyphens (shown only when the word has to break) so long names fit the narrow phone tiles */
const breakable = n => n.replace('Microservices', 'Micro­services').replace('Transactions', 'Trans­actions')
  .replace('Authentication', 'Authen­tication').replace('Authorization', 'Author­ization');
const settle = e => [...e.currentTarget.children].forEach(t => { t.style.transform = ''; });

/* One row per group; each tile is a logo, the skill, and how many of the 8 apps use it (or where I use it instead). */
export default function Skills() {
  return (
    <section id="skills" data-bg="skills">
      <div className="sec-line" aria-hidden="true" />
      <div className="wrap">
        <div data-reveal style={{ textAlign: 'center' }}>
          <span className="eyebrow">Skills</span>
          <H2 text="What I" grad="work with." />
          <p className="sub" style={{ margin: '0 auto' }}>Grouped by area. Each icon shows how many of my 8 apps use it, or that I use it at work.</p>
        </div>
        <div className="dockwrap" data-reveal style={{ display: 'grid' }}>
          {skills.map((g, gi) => (
            <div key={g.group} className="sg" style={{ '--gc': GROUP_COLOR[g.group], '--d': `${gi * 90}ms` }}>
              <h3><i><Icon name={g.group} /></i><span>{g.group}<small>{g.items.length} skills</small></span></h3>
              <ul className="sg-strip" aria-label={g.group} onMouseMove={magnify} onMouseLeave={settle}>
                {g.items.map((n, k) => {
                  const u = (usedIn[n] || []).length;
                  return (
                    <li key={n} className="sk" style={{ '--d': `${gi * 90 + k * 35 + 150}ms` }}>
                      <Logo name={n} size={34} /><b>{breakable(n)}</b>{u ? <small>{u}/8 apps</small> : skillNotes[n] ? <small>{skillNotes[n]}</small> : null}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
