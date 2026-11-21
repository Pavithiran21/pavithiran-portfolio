import { useEffect, useRef } from 'react';
import { startEngine } from './motion/engine.js';
import { initPageMotion } from './motion/page.js';
import Footer from './components/Footer.jsx';
import { LightboxProvider } from './components/Lightbox.jsx';
import Nav from './components/Nav.jsx';
import NetBackground from './components/NetBackground.jsx';
import About from './sections/About.jsx';
import Achievements from './sections/Achievements.jsx';
import Contact from './sections/Contact.jsx';
import Education from './sections/Education.jsx';
import Experience from './sections/Experience.jsx';
import Hero from './sections/Hero.jsx';
import Projects from './sections/Projects.jsx';
import Skills from './sections/Skills.jsx';

export default function App() {
  const workRef = useRef(null);

  /* child effects (each scroll scene registering its job) run first, then the page-wide motion and the loop */
  useEffect(() => {
    const stopPage = initPageMotion();
    const stopEngine = startEngine();
    return () => { stopEngine(); stopPage(); };
  }, []);

  return (
    <LightboxProvider>
      <a className="skip" href="#main">Skip to content</a>
      <NetBackground />
      <div className="prog" aria-hidden="true"><i id="prog" /></div>
      <Nav />
      <main id="main">
        {/* a click on the hero devices jumps to that app in Projects */}
        <Hero onPick={i => workRef.current?.jump(i)} />
        <About />
        <Experience />
        <Projects sceneRef={workRef} />
        <Skills />
        <Achievements />
        <Education />
        <Contact />
        <Footer />
      </main>
    </LightboxProvider>
  );
}
