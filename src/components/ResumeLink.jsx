import { profile } from '../content.js';

/* Every "Resume" button. Until the PDF is added (see content.js) the button stays visible but does nothing. */
export default function ResumeLink({ className, children }) {
  const { href, placeholder } = profile.resume;
  if (placeholder) {
    return (
      <a className={className} href="#" title="Resume coming soon" aria-disabled="true" data-resume onClick={e => e.preventDefault()}>
        {children}
      </a>
    );
  }
  return <a className={className} href={href} download data-resume>{children}</a>;
}
