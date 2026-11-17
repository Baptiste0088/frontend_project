import { useMemo, useState } from 'react';
import logo from '../assets/logo.jpeg';
import SiteHeader from './SiteHeader';

const levels = [
  { id: 1, name: 'Foundations', brief: 'Create a clear heading and a short introduction.' },
  { id: 2, name: 'Core Skills', brief: 'Add a styled button and organize content with sections.' },
  { id: 3, name: 'Web Builder', brief: 'Build a responsive card and add a simple interaction.' },
  { id: 4, name: 'Application Skills', brief: 'Create a small interactive interface with reusable styles.' },
  { id: 5, name: 'Advanced Practice', brief: 'Plan and build a polished mini-project independently.' },
];

const starterCode = {
  html: `<main class="welcome-card">
  <span class="level-tag">My first project</span>
  <h1>Hello, Rwanda! 🇷🇼</h1>
  <p>I am learning to build for the web with Global Coding Academy.</p>
  <button id="welcomeButton">Click me</button>
  <p id="message"></p>
</main>`,
  css: `body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  font-family: Arial, sans-serif;
  background: linear-gradient(135deg, #e8f3ff, #ffffff);
  color: #12304a;
}

.welcome-card {
  width: min(520px, 82vw);
  padding: 40px;
  border-radius: 24px;
  background: white;
  box-shadow: 0 20px 50px rgba(0, 51, 102, 0.15);
  text-align: center;
}

.level-tag {
  color: #0066cc;
  font-weight: bold;
}

button {
  border: 0;
  border-radius: 10px;
  padding: 12px 20px;
  background: #ffd700;
  color: #003366;
  font-weight: bold;
  cursor: pointer;
}`,
  javascript: `const button = document.querySelector('#welcomeButton');
const message = document.querySelector('#message');

button.addEventListener('click', () => {
  message.textContent = 'Excellent — your JavaScript is working!';
});`,
};

const languageMeta = {
  html: { label: 'HTML', detail: 'Structure' },
  css: { label: 'CSS', detail: 'Design' },
  javascript: { label: 'JavaScript', detail: 'Interaction' },
};

function buildDocument(code) {
  const escapedScript = code.javascript.replace(/<\/script/gi, '<\\/script');
  return `<!doctype html><html><head><meta charset="UTF-8"><style>${code.css}</style></head><body>${code.html}<script>${escapedScript}</script></body></html>`;
}

export default function LandingPage() {
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [activeLanguage, setActiveLanguage] = useState('html');
  const [code, setCode] = useState(starterCode);
  const [previewCode, setPreviewCode] = useState(starterCode);
  const [runCount, setRunCount] = useState(0);

  const activeLevel = levels.find((level) => level.id === selectedLevel);
  const preview = useMemo(() => buildDocument(previewCode), [previewCode]);

  const runCode = () => {
    setPreviewCode({ ...code });
    setRunCount((count) => count + 1);
  };

  const resetCode = () => {
    setCode(starterCode);
    setPreviewCode(starterCode);
    setRunCount((count) => count + 1);
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-900">
      <SiteHeader
        activePage="home"
        links={[
          { label: 'Practice', href: '#practice' },
          { label: 'Levels', href: '#levels' },
          { label: 'About', to: '/about' },
          { label: 'Contact', href: '#contact' },
        ]}
      />

      <header className="relative overflow-hidden bg-[#071d35] px-5 pb-16 pt-14 text-white sm:px-8 lg:pb-20 lg:pt-20">
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_75%_25%,#1d9bf0_0,transparent_34%),radial-gradient(circle_at_12%_85%,#ffd700_0,transparent_24%)]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_.95fr]">
          <div className="text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-300/25 bg-blue-300/10 px-4 py-2 text-sm font-semibold text-blue-100">
              <span className="h-2 w-2 rounded-full bg-[#ffd700]" />
              Learn by building — directly in your browser
            </div>
            <h1 className="max-w-3xl text-4xl font-black leading-[1.08] sm:text-5xl lg:text-6xl">
              Write code. Run it. <span className="text-[#ffd700]">See it come alive.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Start coding with Global Coding Academy. Choose your learning level, practise web languages, and see your result instantly—no account or backend needed.
            </p>
            <a href="#practice" className="mt-8 inline-flex items-center gap-3 rounded-xl bg-[#ffd700] px-7 py-4 font-extrabold text-[#071d35] shadow-lg shadow-yellow-500/15 transition hover:-translate-y-0.5 hover:bg-yellow-300">
              Start coding now <span aria-hidden="true">↓</span>
            </a>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur">
            <div className="mb-4 flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-400" /><span className="h-3 w-3 rounded-full bg-yellow-400" /><span className="h-3 w-3 rounded-full bg-green-400" />
              <span className="ml-2 text-xs text-slate-400">your-first-project.html</span>
            </div>
            <pre className="overflow-hidden rounded-2xl bg-[#03101f] p-6 text-left text-sm leading-7 text-blue-100"><code><span className="text-blue-400">&lt;h1&gt;</span>Hello, coder!<span className="text-blue-400">&lt;/h1&gt;</span>{'\n'}<span className="text-purple-400">&lt;button&gt;</span>Build the future<span className="text-purple-400">&lt;/button&gt;</span>{'\n'}<span className="text-slate-500">// Your journey starts here.</span></code></pre>
          </div>
        </div>
      </header>

      <main id="practice" className="mx-auto max-w-[1500px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <section id="levels" className="mb-8 text-left">
          <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-[#0066cc]">Choose your learning level</p>
          <div className="mt-3 flex flex-col justify-between gap-3 lg:flex-row lg:items-end">
            <div>
              <h2 className="text-3xl font-black text-[#071d35] sm:text-4xl">A practical path from Level 1 to Level 5</h2>
              <p className="mt-2 text-slate-600">Inspired by Rwanda’s five Basic TVET levels and organized for progressive coding practice.</p>
            </div>
            <span className="w-fit rounded-lg bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700">Practice pathway · Not an official qualification</span>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {levels.map((level) => {
              const selected = selectedLevel === level.id;
              return (
                <button
                  type="button"
                  key={level.id}
                  onClick={() => setSelectedLevel(level.id)}
                  className={`rounded-2xl border p-4 text-left transition ${selected ? 'border-[#0066cc] bg-[#0066cc] text-white shadow-lg shadow-blue-900/15' : 'border-slate-200 bg-white text-slate-700 hover:-translate-y-0.5 hover:border-blue-300'}`}
                >
                  <span className={`text-xs font-black uppercase tracking-wider ${selected ? 'text-blue-100' : 'text-[#0066cc]'}`}>Level {level.id}</span>
                  <span className="mt-1 block font-extrabold">{level.name}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mb-5 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-[#0066cc]">Level {activeLevel.id} challenge</p>
            <p className="mt-1 font-bold text-[#071d35]">{activeLevel.brief}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(languageMeta).map(([key, language]) => (
              <button
                type="button"
                key={key}
                onClick={() => setActiveLanguage(key)}
                className={`rounded-xl px-4 py-3 text-sm font-extrabold transition ${activeLanguage === key ? 'bg-[#071d35] text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                {language.label}
              </button>
            ))}
          </div>
        </section>

        <section className="grid min-h-[640px] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5 lg:grid-cols-2">
          <div className="flex min-h-[580px] flex-col bg-[#07131f] text-left">
            <div className="flex items-center justify-between border-b border-slate-700 px-5 py-4">
              <div>
                <p className="font-extrabold text-white">{languageMeta[activeLanguage].label} editor</p>
                <p className="text-xs text-slate-400">{languageMeta[activeLanguage].detail} · Edit the code below</p>
              </div>
              <button type="button" onClick={resetCode} className="rounded-lg border border-slate-600 px-3 py-2 text-xs font-bold text-slate-300 hover:bg-slate-800">Reset</button>
            </div>
            <textarea
              value={code[activeLanguage]}
              onChange={(event) => setCode((current) => ({ ...current, [activeLanguage]: event.target.value }))}
              className="min-h-[440px] flex-1 resize-none bg-[#07131f] p-6 font-mono text-[14px] leading-7 text-slate-100 outline-none sm:text-[15px]"
              aria-label={`${languageMeta[activeLanguage].label} code editor`}
              spellCheck="false"
            />
            <div className="flex items-center justify-between border-t border-slate-700 bg-[#0a1928] px-5 py-4">
              <span className="hidden text-xs text-slate-400 sm:inline">Your code stays in this browser session.</span>
              <button type="button" onClick={runCode} className="ml-auto inline-flex items-center gap-2 rounded-xl bg-[#ffd700] px-6 py-3 font-black text-[#071d35] transition hover:bg-yellow-300 active:scale-95">
                <span aria-hidden="true">▶</span> Run code
              </button>
            </div>
          </div>

          <div className="flex min-h-[580px] flex-col bg-slate-100 text-left">
            <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
              <div>
                <p className="font-extrabold text-[#071d35]">Live result</p>
                <p className="text-xs text-slate-500">Your output appears here after you run it</p>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Browser preview</div>
            </div>
            <div className="flex-1 p-3 sm:p-5">
              <iframe
                key={runCount}
                title="Code result preview"
                srcDoc={preview}
                sandbox="allow-scripts"
                className="h-full min-h-[490px] w-full rounded-xl border border-slate-200 bg-white shadow-inner"
              />
            </div>
          </div>
        </section>
      </main>

      <footer id="contact" className="bg-[#071d35] px-6 py-10 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
          <div className="flex items-center gap-3"><img src={logo} alt="Global Coding Academy" className="h-11 w-11 rounded-full object-cover" /><div><p className="font-extrabold">Global Coding Academy Ltd</p><p className="text-sm text-slate-400">Learn. Practise. Build.</p></div></div>
          <p className="text-sm text-slate-400">Frontend practice lab · Built for learners in Rwanda and beyond</p>
        </div>
      </footer>
    </div>
  );
}
