import { Fragment } from 'react';

/* A section heading whose words rise one by one when it comes into view; the last words take the gradient. */
export function H2({ text, grad }) {
  const words = [...text.split(/\s+/).map(w => [w, false]), ...grad.split(/\s+/).map(w => [w, true])];
  return (
    <h2 className="h2">
      {words.map(([w, g], n) => (
        <Fragment key={n}>{n ? ' ' : ''}<span className="w"><span className={'wi' + (g ? ' g' : '')} style={{ '--w': n }}>{w}</span></span></Fragment>
      ))}
    </h2>
  );
}

export default function SectionHead({ eyebrow, text, grad, sub }) {
  return (
    <div className="wrap head">
      <div data-reveal>
        <span className="eyebrow">{eyebrow}</span>
        <H2 text={text} grad={grad} />
        <p className="sub">{sub}</p>
      </div>
    </div>
  );
}
