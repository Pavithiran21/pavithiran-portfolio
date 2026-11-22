/* Everything the page says about Pavithiran, in one place.
   Numbers come from the eight project repos (Playwright tests recounted 20 Nov 2026).
   The resume is public/Pavithiran_Ramaraj_Resume.pdf: replace that file (same name) to update it. Every Resume button opens it
   in a new tab. Keep the experience bullets below word for word the same as the resume. */

export const profile = {
  name: 'Pavithiran',
  fullName: 'Pavithiran Ramaraj',
  role: 'Full-stack developer',
  years: '2.5+',
  /* typed one after another in the hero's first line (the first one is shown still for reduced motion) */
  typed: ['I build web apps people use', 'I build secure, scalable APIs', 'I ship every app with tests and CI'],
  tagline: 'I build full-stack products that stay correct when it matters: money to the paisa, no double bookings, AI that has to prove what it says.',
  location: 'Erode, Tamil Nadu, India',
  workMode: ['Remote', 'Hybrid', 'Open to relocate'],
  notice: '30 days',
  openTo: 'Full stack and backend roles',
  email: 'pavithiran.dev21@gmail.com',
  phone: '+91 86673 38337',
  whatsapp: { text: '+91 94869 70967', href: 'https://wa.me/919486970967' },
  github: 'https://github.com/Pavithiran21',
  linkedin: { href: 'https://www.linkedin.com/in/pavithiran-ramaraj/', text: 'linkedin.com/in/pavithiran-ramaraj' },
  resume: { href: '/Pavithiran_Ramaraj_Resume.pdf', placeholder: false },
  /* The owner's own words, one paragraph per About step (Who I am / How I work / What I'm looking for). */
  bio: [
    "I'm a Full Stack Developer with 2.5 years of experience, currently working as a Backend Developer at a startup. My specialty is building secure, scalable APIs using Java, Python and Node.js, with hands-on experience implementing JWT authentication and role-based access control for an enterprise client project.",
    "Working at a startup, I take full ownership of features from planning to production, with a focus on clean, maintainable code that my team can build on. Beyond my day-to-day role, I've built full stack applications end to end, which you can explore in my Projects section. AI-assisted development helps me deliver faster, and I review and test every line of code before it ships.",
    "I'm open to full stack and backend roles where I can bring secure, well-built solutions to a growing product. Feel free to reach out.",
  ],
};

/* One company, newest role first. Word for word the same as the resume (public/Pavithiran_Ramaraj_Resume.pdf). */
export const experience = [
  { when: 'Jun 2026 – Present', title: 'Associate Software Developer', org: 'DJ Computing', points: [
    'Build secure, scalable REST APIs and microservices for production systems on AWS and Azure.',
    'Implemented JWT authentication and role-based access control (RBAC) for an enterprise client project.',
    'Own features from planning to production, writing clean, maintainable code the team builds on.',
    'Use AI-assisted development to ship faster, reviewing and testing every change before release.',
  ] },
  { when: 'Nov 2024 – May 2026', title: 'Junior Software Developer', org: 'DJ Computing', points: [
    "Built and maintained 40+ REST API endpoints used across the company's product.",
    'Implemented input validation, error handling, and logging across API endpoints to improve reliability.',
    'Debugged and fixed 100+ production bugs, writing Jest unit test cases to prevent regressions.',
    'Collaborated with product and QA teams to plan, estimate, and deliver features in Agile sprints.',
    'Participated in code reviews to maintain code quality and consistency.',
  ] },
  { when: 'May 2024 – Oct 2024', title: 'Junior Software Developer Intern', org: 'DJ Computing', points: [
    'Developed first production API endpoints under senior developer review.',
    'Fixed bugs and delivered small features across the application.',
    "Adopted the team's Git workflow and code review practices on a shared production codebase.",
  ] },
];

export const certifications = [
  { name: 'Zen Class Full Stack Developer Program', issuer: 'GUVI Geek Networks', year: 'Apr – Oct 2021', id: '4A469d6QDeL5411478', url: 'https://www.guvi.in/certificate?id=4A469d6QDeL5411478' },
  { status: 'in-progress', name: 'Gen AI-powered Data Science with Machine Learning', year: 'Started Jul 2026' },
];

export const education = [
  { degree: 'B.E. Mechanical Engineering', school: 'K.S.R. College of Engineering', when: '2015 – 2019', score: '73.46%', place: 'Tiruchengode, Namakkal' },
];

export const skills = [
  { group: 'Languages', items: ['JavaScript', 'Java 21', 'Python', 'SQL', 'HTML & CSS'] },
  { group: 'Frontend', items: ['React 19', 'Redux Toolkit', 'RTK Query', 'TanStack Query', 'Tailwind CSS 4', 'Leaflet'] },
  { group: 'Backend', items: ['Node.js', 'Express 5', 'Spring Boot 4', 'FastAPI', 'REST APIs', 'JWT Authentication', 'Authorization (RBAC)', 'LLM integration (Groq)'] },
  { group: 'Database', items: ['MySQL 8.4', 'MongoDB', 'Knex', 'Flyway', 'Transactions & locking'] },
  { group: 'Cloud & Architecture', items: ['AWS', 'Azure', 'Microservices', 'Agile / Scrum'] },
  { group: 'Testing', items: ['Jest', 'Playwright'] },
  { group: 'DevOps & Tools', items: ['Docker', 'GitHub Actions', 'Git', 'GitHub', 'Vercel', 'Render'] },
];

/* What each skill tile says under its name when none of the 8 apps uses it: where I use it instead. */
export const skillNotes = {
  'AWS': 'At work', 'Azure': 'At work', 'Microservices': 'At work', 'Agile / Scrum': 'At work', 'Jest': 'Unit tests',
};

const ALL8 = ['Billsy', 'ScamSentry', 'DeskHive', 'FoodLoop', 'Resumify', 'SubPulse', 'GigVault', 'WeatherPing'];
/* Which of the eight apps use each skill (shown as "N/8 apps" on the Skills tiles). */
export const usedIn = {
  'JavaScript': ALL8, 'HTML & CSS': ALL8, 'Git': ALL8, 'GitHub': ALL8, 'React 19': ALL8, 'Tailwind CSS 4': ALL8, 'Playwright': ALL8,
  'Docker': ALL8, 'GitHub Actions': ALL8, 'Vercel': ALL8, 'Render': ALL8,
  /* every backend signs JWT access tokens (jsonwebtoken, jjwt, PyJWT); these four check roles before acting (others have one role) */
  'REST APIs': ALL8, 'JWT Authentication': ALL8, 'Authorization (RBAC)': ['Billsy', 'ScamSentry', 'DeskHive', 'FoodLoop'],
  'Java 21': ['DeskHive', 'FoodLoop', 'SubPulse'], 'Spring Boot 4': ['DeskHive', 'FoodLoop', 'SubPulse'], 'Flyway': ['DeskHive', 'FoodLoop', 'SubPulse'],
  'Python': ['Resumify', 'GigVault'], 'FastAPI': ['Resumify', 'GigVault'],
  'Node.js': ['Billsy', 'ScamSentry', 'WeatherPing'], 'Express 5': ['Billsy', 'ScamSentry', 'WeatherPing'],
  'SQL': ['Billsy', 'DeskHive', 'FoodLoop', 'SubPulse'], 'MySQL 8.4': ['Billsy', 'DeskHive', 'FoodLoop', 'SubPulse'],
  'MongoDB': ['ScamSentry', 'Resumify', 'GigVault', 'WeatherPing'],
  'TanStack Query': ['ScamSentry', 'DeskHive', 'FoodLoop', 'Resumify', 'SubPulse', 'GigVault', 'WeatherPing'],
  'Redux Toolkit': ['Billsy'], 'RTK Query': ['Billsy'], 'Knex': ['Billsy'], 'Leaflet': ['FoodLoop'],
  'LLM integration (Groq)': ['ScamSentry', 'Resumify'],
};

export const projects = [
  {
    name: 'Billsy', repo: 'Billsy', accent: '#f5a524', kind: 'GST billing', api: 'Express', db: 'MySQL',
    problem: 'Small businesses need GST invoices where the tax halves always add up and invoice numbers never skip.',
    summary: 'Owners issue GST-correct invoices with emailed PDFs, track payments and credit notes, and hand the accountant clean GST reports.',
    hard: ['Money to the paisa: DECIMAL + decimal.js, SGST = GST − CGST so halves always add up', 'Gap-free invoice numbers under SELECT … FOR UPDATE, even with 10 issued at once'],
    live: 'https://billsy-gst.vercel.app/demo', tests: 33,
    images: ['/img/billsy-dashboard.jpg', '/img/billsy-invoice.jpg', '/img/billsy-invoice-pdf.png'],
  },
  {
    name: 'ScamSentry', repo: 'ScamSentry', accent: '#22d3a6', kind: 'AI scam checker', api: 'Express', db: 'MongoDB',
    problem: 'People get scam messages by SMS, WhatsApp and email and need a clear verdict they can trust, even when the message tries to trick the AI.',
    summary: 'A clear verdict with the red flags found, a check on every link and plain advice. Works without signing in; moderators review disputed verdicts.',
    hard: ['An AI you can’t talk out of a verdict: rules run first, the stricter answer wins', 'Hostile input cleaned before the model sees it (NFKC, bidi strip, lookalike domains)'],
    live: 'https://scam-sentry-teal.vercel.app/demo', tests: 25,
    images: ['/img/scamsentry-check.jpg', '/img/scamsentry-report.jpg', '/img/scamsentry-review.jpg'],
  },
  {
    name: 'DeskHive', repo: 'DeskHive', accent: '#8b7bff', kind: 'Desk booking', api: 'Spring Boot', db: 'MySQL',
    problem: 'Hybrid offices need desks and rooms booked without double bookings or seats held by no-shows.',
    summary: 'Employees book, change, check in and cancel; admins set offices, floors and rules. No-shows release themselves, and every booking lands in your calendar.',
    hard: ['No double booking: 20 people click at once, 1 booking and 19 × 409', 'Jobs that act exactly once; .ics invites that move instead of duplicating'],
    live: 'https://desk-hive-five.vercel.app/demo', tests: 16,
    images: ['/img/deskhive-seat-map.jpg', '/img/deskhive-find-a-space.jpg', '/img/deskhive-occupancy.jpg'],
  },
  {
    name: 'FoodLoop', repo: 'FoodLoop', accent: '#7bd85a', kind: 'Surplus-food marketplace', api: 'Spring Boot', db: 'MySQL',
    problem: 'Restaurants throw away good surplus food because people nearby can’t find and claim it in time.',
    summary: 'Find food by distance on a list or an OpenStreetMap map, claim it, and move the claim to collected before the pick-up window closes.',
    hard: ['Ten receivers claim at once: one 201, nine 409s', 'A map that rounds every spot to ~1 km, never the donor’s door'],
    live: 'https://food-loop-orcin.vercel.app/demo', tests: 11,
    images: ['/img/foodloop-find-food-map.jpg', '/img/foodloop-find-food-list.jpg', '/img/foodloop-donor-board.jpg'],
  },
  {
    name: 'Resumify', repo: 'Resumify', accent: '#ff6b9a', kind: 'AI resume matcher', api: 'FastAPI', db: 'MongoDB',
    problem: 'Job seekers can’t see why a resume matches a job, and an AI score that changes on every run can’t be trusted.',
    summary: 'Scores a resume against a job, lists matched and missing skills with the line that proves each, and suggests what to improve.',
    hard: ['The score is computed, never generated: same inputs, same score', 'The AI must quote the resume, and every quote is checked'],
    live: 'https://resumify-iota-nine.vercel.app/demo', tests: 18,
    images: ['/img/resumify-match.jpg', '/img/resumify-compare.jpg'],
  },
  {
    name: 'SubPulse', repo: 'SubPulse', accent: '#38bdf8', kind: 'Subscription tracker', api: 'Spring Boot', db: 'MySQL',
    problem: 'Subscriptions renew quietly and charge you before you remember to cancel.',
    summary: 'Monthly and yearly spend at a glance, and an email a few days before each renewal, on the days you choose.',
    hard: ['Month-end dates that don’t drift (31 Jan → 28 Feb → 31 Mar)', 'One reminder per renewal even if the job runs three times at once'],
    live: 'https://sub-pulse-omega.vercel.app', tests: 59,
    images: ['/img/subpulse-calendar.jpg', '/img/subpulse-month-end-dates.jpg'],
  },
  {
    name: 'GigVault', repo: 'GigVault', accent: '#fbbf24', kind: 'Freelancer earnings', api: 'FastAPI', db: 'MongoDB',
    problem: 'Freelancers lose track of who still owes them, especially when clients pay in parts.',
    summary: 'Clients, gigs and every payment, partial ones included. Always shows who still owes you what.',
    hard: ['Exact money end to end: ten payments of 0.10 make exactly 1.00', 'A gig can never be overpaid, even with payments at the same moment'],
    live: 'https://gig-vault-kappa.vercel.app', tests: 62,
    images: ['/img/gigvault-earnings.jpg', '/img/gigvault-gig-payments.jpg'],
  },
  {
    name: 'WeatherPing', repo: 'WeatherPing', accent: '#60a5fa', kind: 'Weather alerts', api: 'Express', db: 'MongoDB',
    problem: 'Generic forecasts don’t warn you about the weather that matters to you, at your place and time.',
    summary: 'Describe the weather that matters ("rain over 60% between 7 and 9 am at home") and get one email when the forecast says it will happen.',
    hard: ['One email per rule per event, even when evaluator runs overlap', '"7 to 9 am" means the user’s own 7 to 9 am'],
    live: 'https://weather-ping.vercel.app', tests: 54,
    images: ['/img/weatherping-dashboard.png', '/img/weatherping-alerts.png'],
  },
];

/* Skill -> logo file in public/logos (from devicon v2.16.0, MIT). Skills without one get a short text badge. */
export const logos = {
  'React': 'react', 'React 19': 'react', 'Tailwind CSS 4': 'tailwindcss', 'Redux Toolkit': 'redux', 'RTK Query': 'redux',
  'Node.js': 'nodejs', 'Express': 'express', 'Express 5': 'express', 'Java 21': 'java', 'Java': 'java', 'Spring Boot': 'spring', 'Spring Boot 4': 'spring',
  'Python': 'python', 'FastAPI': 'fastapi', 'MySQL': 'mysql', 'MySQL 8.4': 'mysql', 'MongoDB': 'mongodb', 'Knex': 'knexjs',
  'Playwright': 'playwright', 'Docker': 'docker', 'GitHub Actions': 'githubactions', 'Vercel': 'vercel', 'Git': 'git', 'GitHub': 'github',
  'JavaScript': 'javascript', 'HTML & CSS': 'html5', 'AWS': 'aws', 'Azure': 'azure', 'Jest': 'jest',
};
export const badges = {
  'Microservices': 'MS', 'Agile / Scrum': 'AG', 'SQL': 'SQL', 'TanStack Query': 'TQ', 'Leaflet': 'LF', 'LLM integration (Groq)': 'AI', 'Flyway': 'FW', 'Render': 'R', 'Transactions & locking': 'TX',
  'REST APIs': 'API', 'JWT Authentication': 'JWT', 'Authorization (RBAC)': 'RBAC',
};
