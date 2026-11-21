/* The device shells. Each screen has a back face (the P logo) seen half-way through the 360° turn between steps. */

export const Back = () => <div className="back" aria-hidden="true"><i>P</i></div>;

/* A monitor showing one of the small re-created UIs (sized to the screen with container units). */
export function Monitor({ children, className = '' }) {
  return (
    <div className={'monitor ' + className}>
      <div className="bez"><div className="screen sx"><div className="face">{children}</div></div><Back /></div>
      <div className="neck" /><div className="base" />
    </div>
  );
}

/* A strip of screenshots that slides to show one at a time. */
export function Strip({ images, at = 0, alt }) {
  return (
    <div className="strip" style={{ transform: `translateX(-${at * 100}%)` }}>
      {images.map(src => <img key={src} src={src} alt={alt} />)}
    </div>
  );
}

export function Laptop({ children, className = '' }) {
  return (
    <div className={'laptop ' + className}>
      <div className="lid"><div className="screen">{children}</div><Back /></div>
      <div className="deck" />
    </div>
  );
}

export function ScreenshotMonitor({ children, className = '' }) {
  return (
    <div className={'monitor ' + className}>
      <div className="bez"><div className="screen">{children}</div><Back /></div>
      <div className="neck" /><div className="base" />
    </div>
  );
}
