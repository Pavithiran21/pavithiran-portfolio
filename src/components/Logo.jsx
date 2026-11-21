import { badges, logos } from '../content.js';

/* Black logos are inverted and dark ones brightened so they read on the dark page. */
const INVERT = ['express', 'vercel', 'github'];
const BRIGHTEN = ['mysql', 'java', 'jest'];

/* A tech logo, or a short text badge for tech that has no logo file (Render, Flyway, Leaflet, TanStack Query, Groq). */
export default function Logo({ name, size = 28 }) {
  const file = logos[name];
  if (file) {
    const cls = 'logo' + (INVERT.includes(file) ? ' inv' : '') + (BRIGHTEN.includes(file) ? ' dim' : '');
    return <img className={cls} src={`/logos/${file}.svg`} width={size} height={size} alt={name} title={name} />;
  }
  const short = badges[name] || name.replace(/[^A-Za-z ]/g, '').split(' ').filter(Boolean).map(w => w[0]).join('').slice(0, 3).toUpperCase();
  return (
    <span className="logo logo-txt" style={{ width: size, height: size, fontSize: Math.round(size * 0.38) }} title={name} role="img" aria-label={name}>
      {short}
    </span>
  );
}
