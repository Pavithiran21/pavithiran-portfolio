import { profile } from '../content.js';
import { telHref } from '../lib/util.js';
import Icon from './Icon.jsx';

const SOCIAL = [
  { label: 'GitHub', icon: 'github', href: profile.github, ext: true },
  { label: 'LinkedIn', icon: 'linkedin', href: profile.linkedin.href, ext: true },
  { label: 'Email', icon: 'contact', href: 'mailto:' + profile.email },
  { label: 'Call', icon: 'mobile', href: telHref(profile.phone) },
  { label: 'WhatsApp', icon: 'whatsapp', href: profile.whatsapp.href, ext: true },
];

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <span>© 2026 {profile.name} · All rights reserved</span>
        <nav className="social" id="social" aria-label="Social links">
          {SOCIAL.map(s => (
            <a key={s.label} href={s.href} aria-label={s.label} {...(s.ext ? { target: '_blank', rel: 'noopener' } : {})}><Icon name={s.icon} /></a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
