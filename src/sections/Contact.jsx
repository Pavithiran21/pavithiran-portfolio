import { profile } from '../content.js';
import { telHref } from '../lib/util.js';
import ScrollScene from '../components/ScrollScene.jsx';
import SectionHead from '../components/SectionHead.jsx';
import { ContactCard, Mail, Profile, Top } from '../components/Screens.jsx';

const ghHandle = profile.github.replace('https://', '');
const line = `Full stack developer · ${profile.years} years`;

const steps = [
  {
    rail: 'Email', c: '#5eead4',
    screen: <><Top file="New message" extra="mail" /><Mail to={profile.email} subject="Full stack / backend developer role" body={['Hi Pavithiran,', 'I saw your portfolio.', 'We are hiring a developer. Can we talk this week?', '— your name']} /></>,
    info: <>
      <span className="kind">Email</span><h3>Email me</h3><p>The fastest way to reach me about a role.</p>
      <ul><li>{profile.email}</li><li>Open to {profile.openTo.toLowerCase()}</li></ul>
      <div className="meta"><a className="btn pri" href={`mailto:${profile.email}?subject=${encodeURIComponent('Developer role')}`}>Email me</a></div>
    </>,
  },
  {
    rail: 'Call & WhatsApp', c: '#22c55e',
    screen: <><Top file="Contact" extra="phone" /><ContactCard line={line} num={profile.phone} actions={[['call', 'Call'], ['chat', 'WhatsApp']]} /></>,
    info: <>
      <span className="kind">Call &amp; WhatsApp</span><h3>Call or message me</h3><p>For a quick chat about a role, call me or message me on WhatsApp.</p>
      <ul><li>Call: {profile.phone}</li><li>WhatsApp: {profile.whatsapp.text}</li></ul>
      <div className="meta">
        <a className="btn pri" href={telHref(profile.phone)}>Call me</a>
        <a className="btn sec" href={profile.whatsapp.href} target="_blank" rel="noopener">WhatsApp me ↗</a>
      </div>
    </>,
  },
  {
    rail: 'LinkedIn', c: '#7c9cff',
    screen: <><Top file="LinkedIn profile" extra="linkedin" /><Profile line={line} loc={`${profile.location.replace(/, India$/, '')} · open to full stack & backend roles`} chips={['React', 'Node.js', 'Spring Boot', 'FastAPI', 'MySQL', 'MongoDB', 'Playwright']} /></>,
    info: <>
      <span className="kind">LinkedIn</span><h3>Connect with me</h3><p>My work history and recommendations live on LinkedIn.</p>
      <ul><li>{profile.linkedin.text}</li></ul>
      <div className="meta"><a className="btn pri" href={profile.linkedin.href} target="_blank" rel="noopener">Open LinkedIn ↗</a></div>
    </>,
  },
  {
    rail: 'GitHub', c: '#a78bfa',
    screen: <><Top file={ghHandle} extra="profile" /><ContactCard line="@Pavithiran21 · full-stack projects with tests and CI" num={ghHandle} actions={[['code', 'Code'], ['out', 'Profile']]} /></>,
    info: <>
      <span className="kind">GitHub</span><h3>See my code</h3><p>The source of every project, with its tests and CI pipeline.</p>
      <ul><li>{ghHandle}</li><li>Public full-stack projects</li></ul>
      <div className="meta"><a className="btn pri" href={profile.github} target="_blank" rel="noopener">Open GitHub ↗</a></div>
    </>,
  },
];

export default function Contact() {
  return (
    <section className="scene-sec" id="contact" data-bg="contact">
      <div className="sec-line" aria-hidden="true" />
      <SectionHead eyebrow="Contact" text="Let's build your" grad="next app." sub="Email, mobile, LinkedIn or GitHub: pick the way that suits you." />
      <ScrollScene id="swContact" staticId="stContact" steps={steps} />
      <div style={{ height: 80 }} />
    </section>
  );
}
