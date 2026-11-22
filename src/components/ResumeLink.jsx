import { profile } from '../content.js';

/* Every "Resume" button. It opens the PDF in a new tab (read first, save from the browser's viewer).
   With placeholder: true in content.js the button stays visible but does nothing. */
export default function ResumeLink({ className, children }) {
  const { href, placeholder } = profile.resume;
  if (placeholder) {
    return (
      <a className={className} href="#" title="Resume coming soon" aria-disabled="true" data-resume onClick={e => e.preventDefault()}>
        {children}
      </a>
    );
  }
  return (
    <a className={className} href={href} target="_blank" rel="noopener" data-resume
      title="Opens the PDF in a new tab">
      {children}<span className="sr-only"> (PDF, opens in a new tab)</span>
    </a>
  );
}
