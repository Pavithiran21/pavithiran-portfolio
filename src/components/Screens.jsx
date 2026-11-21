/* Small re-created UIs shown on the monitor in the scroll scenes (about.json, a task board, a profile...).
   Lines appear one after another: .ap fades up, .pp pops in, each delayed by --k. */

export const Ap = ({ k, children, className = 'ap' }) => <div className={className} style={{ '--k': k }}>{children}</div>;

export function Top({ file, extra = '' }) {
  return <div className="u-top"><i /><i /><i /><b>{file}</b><em>{extra}</em></div>;
}

/* A code editor: one line per entry; the last line has a blinking caret. */
export function Code({ lines, aside, one = false }) {
  return (
    <div className={'u-ed' + (one ? ' one' : '')}>
      <div className="u-code">
        {lines.map((l, i) => <div key={i} className={'ap' + (i === lines.length - 1 ? ' last' : '')} style={{ '--k': i }}>{l === '' ? ' ' : l}</div>)}
      </div>
      {aside}
    </div>
  );
}

/* `  "key": value,` with the key and value coloured like an editor. */
export function JsonLine({ k, v, comma = true }) {
  return <>{'  '}<span className="f">&quot;{k}&quot;</span>: <span className="s">{v}</span>{comma ? ',' : ''}</>;
}

export function Kanban({ cols }) {
  return (
    <div className="u-kan">
      {cols.map(([h, kc, cards], k) => (
        <div key={h} className="col ap" style={{ '--k': k, '--kc': kc }}>
          <h5><i />{h}</h5>
          {cards.map((t, j) => <div key={t} className="card pp" style={{ '--k': k + j + 1 }}>{t}</div>)}
        </div>
      ))}
    </div>
  );
}

export function Settings({ rows }) {
  return (
    <div className="u-set">
      {rows.map(([a, b], k) => <Ap key={a} k={k}><div className="row"><b>{a}</b><span>{b}</span></div></Ap>)}
    </div>
  );
}

const PhoneIcon = () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25c1.1.37 2.3.57 3.6.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z" /></svg>;
const ChatIcon = () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 3h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-5 4V5a2 2 0 0 1 1-2z" /></svg>;
const CodeIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m8 7-5 5 5 5M16 7l5 5-5 5" /></svg>;
const OutIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M9 7h8v8" /></svg>;

export function Mail({ to, subject, body }) {
  return (
    <div className="u-mail">
      <Ap k={0}><div className="mrow"><b>To</b><span>{to}</span></div></Ap>
      <Ap k={1}><div className="mrow"><b>Subject</b><span>{subject}</span></div></Ap>
      <div className="mbody">{body.map((l, k) => <Ap key={l} k={k + 2}>{l}</Ap>)}</div>
      <span className="send">Send ↗</span>
    </div>
  );
}

/* A contact card: avatar, name, a line, a number, and two round action buttons. */
export function ContactCard({ line, num, actions }) {
  const icons = { call: <PhoneIcon />, chat: <ChatIcon />, code: <CodeIcon />, out: <OutIcon /> };
  return (
    <div className="u-call">
      <div className="card pp" style={{ '--k': 0 }}>
        <div className="av pp" style={{ '--k': 1 }}>P</div>
        <Ap k={2}><h4>Pavithiran</h4></Ap>
        <Ap k={3}><p>{line}</p></Ap>
        <Ap k={4}><div className="num">{num}</div></Ap>
        <Ap k={5}><div className="acts">{actions.map(([ic, label]) => <span key={label}><i>{icons[ic]}</i>{label}</span>)}</div></Ap>
      </div>
    </div>
  );
}

export function Profile({ line, loc, chips }) {
  return (
    <div className="u-prof">
      <div className="cover" />
      <div className="av pp" style={{ '--k': 1 }}>P</div>
      <div className="who">
        <Ap k={2}><h4>Pavithiran</h4></Ap>
        <Ap k={3}><p>{line}</p></Ap>
        <Ap k={4}><p className="loc">{loc}</p></Ap>
        <Ap k={5}><div className="btns"><span>Connect</span><span>Message</span></div></Ap>
        <Ap k={6}><div className="chips">{chips.map(s => <span key={s}>{s}</span>)}</div></Ap>
      </div>
    </div>
  );
}

/* A certificate (or a course still in progress) on paper. */
export function Certificate({ c, seal, kind, title, lines, footLeft, footRight }) {
  return (
    <div className="u-cert">
      <div className="paper pp" style={{ '--k': 0, '--c': c }}>
        <div className="seal pp" style={{ '--k': 1 }}>{seal}</div>
        <Ap k={2}><small>{kind}</small></Ap>
        <Ap k={3}><h4>{title}</h4></Ap>
        {lines.map((l, i) => <Ap key={l} k={4 + i}><p>{l}</p></Ap>)}
        <Ap k={6}><div className="foot"><span>{footLeft}</span><span className="vf">{footRight}</span></div></Ap>
      </div>
    </div>
  );
}
