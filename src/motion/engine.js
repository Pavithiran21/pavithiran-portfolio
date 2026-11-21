/* One scroll loop for the whole page. Everything that moves with the scroll registers a job here, and the jobs
   run once per animation frame in a fixed order (the same order as the design):
   progress bar 0, scroll scenes 10, section fold 20, active section 30, stacked blocks 40, hero exit 50.
   Jobs write transforms straight onto DOM nodes, so nothing re-renders while you scroll. */

const jobs = [];
let ticking = false;
let started = false;

export function onScrollFrame(fn, order = 25) {
  const job = { fn, order };
  jobs.push(job);
  jobs.sort((a, b) => a.order - b.order);
  return () => {
    const i = jobs.indexOf(job);
    if (i >= 0) jobs.splice(i, 1);
  };
}

export function runFrame() {
  ticking = false;
  for (const j of jobs) j.fn();
}

const request = () => {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(runFrame);
  }
};

export function startEngine() {
  if (started) return () => {};
  started = true;
  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', runFrame);
  runFrame();
  return () => {
    removeEventListener('scroll', request);
    removeEventListener('resize', runFrame);
    started = false;
  };
}
