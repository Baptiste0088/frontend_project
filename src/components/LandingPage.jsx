import { useEffect, useMemo, useRef, useState } from 'react';
import logo from '../assets/logo.jpeg';

const levels = [
  { id: 1, name: 'Foundations', brief: 'Personal welcome card: practise headings, paragraphs, colors, and one button.', result: 'A centered card displays your greeting and introduction. Clicking the button shows a success message beneath it.', concepts: ['HTML structure', 'CSS colors', 'Click events'], steps: ['Edit the welcome text in HTML.', 'Change the card colors in CSS.', 'Run the code and click the button.'] },
  { id: 2, name: 'Core Skills', brief: 'Counter app: practise variables, buttons, events, and updating the page.', result: 'The score starts at 0. Add increases it, Subtract decreases it, and Reset always returns the score to 0.', concepts: ['Variables', 'Functions', 'DOM updates'], steps: ['Study the score element and buttons.', 'Change how much each click adds.', 'Run and test Add, Subtract, and Reset.'] },
  { id: 3, name: 'Web Builder', brief: 'Quiz app: practise layouts, choices, conditions, and feedback.', result: 'The page presents one question with three choices. A correct choice shows green feedback; a wrong choice asks the learner to try again.', concepts: ['Data attributes', 'Conditions', 'User feedback'], steps: ['Change the question and choices.', 'Mark one answer as correct.', 'Run and test every answer.'] },
  { id: 4, name: 'Application Skills', brief: 'Task manager: practise forms, arrays, dynamic lists, and delete actions.', result: 'Learners can add tasks, see each task in the list, delete any task, and watch the task total update immediately.', concepts: ['Forms', 'Dynamic elements', 'Event handling'], steps: ['Add a task with the form.', 'Study how JavaScript creates a list item.', 'Delete tasks and watch the count update.'] },
  { id: 5, name: 'Advanced Practice', brief: 'Expense dashboard: practise structured data, calculations, and reusable rendering.', result: 'The dashboard starts with RWF 8,000, accepts new expenses, removes existing ones, and recalculates the total after every change.', concepts: ['Objects and arrays', 'Reduce calculations', 'Reusable rendering'], steps: ['Review the starter expense data.', 'Add and remove expenses.', 'Change the render function or dashboard design.'] },
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

const levelStarterCode = {
  1: starterCode,
  2: {
    html: `<main class="counter-card">
  <p class="eyebrow">LEVEL 2 PRACTICE</p>
  <h1>Score Counter</h1>
  <strong id="score">0</strong>
  <div class="actions">
    <button id="minus">− Subtract</button>
    <button id="add">+ Add</button>
  </div>
  <button id="reset" class="reset">Reset score</button>
</main>`,
    css: `body {
  margin: 0; min-height: 100vh; display: grid; place-items: center;
  font-family: Arial, sans-serif; background: #ecfdf5; color: #16352a;
}
.counter-card { width: min(380px, 82vw); padding: 32px; text-align: center; background: white; border-radius: 20px; box-shadow: 0 18px 45px #04785722; }
.eyebrow { color: #059669; font-size: 12px; font-weight: bold; }
#score { display: block; margin: 22px 0; font-size: 64px; }
.actions { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
button { border: 0; border-radius: 9px; padding: 12px; background: #059669; color: white; font-weight: bold; cursor: pointer; }
.reset { margin-top: 10px; width: 100%; background: #e5e7eb; color: #334155; }`,
    javascript: `let score = 0;
const scoreText = document.querySelector('#score');

function showScore() {
  scoreText.textContent = score;
}

document.querySelector('#add').addEventListener('click', () => { score += 1; showScore(); });
document.querySelector('#minus').addEventListener('click', () => { score -= 1; showScore(); });
document.querySelector('#reset').addEventListener('click', () => { score = 0; showScore(); });`,
  },
  3: {
    html: `<main class="quiz-card">
  <span>LEVEL 3 · QUICK QUIZ</span>
  <h1>Which language styles a web page?</h1>
  <div class="answers">
    <button data-answer="wrong">HTML</button>
    <button data-answer="correct">CSS</button>
    <button data-answer="wrong">JavaScript</button>
  </div>
  <p id="feedback">Choose one answer.</p>
</main>`,
    css: `body { margin: 0; min-height: 100vh; display: grid; place-items: center; font-family: Arial, sans-serif; background: linear-gradient(135deg, #312e81, #7c3aed); color: #1e1b4b; }
.quiz-card { width: min(520px, 82vw); padding: 34px; border-radius: 22px; background: white; box-shadow: 0 20px 50px #1e1b4b55; }
span { color: #7c3aed; font-size: 12px; font-weight: bold; }
h1 { font-size: 26px; line-height: 1.25; }
.answers { display: grid; gap: 10px; }
button { padding: 13px; border: 1px solid #ddd6fe; border-radius: 10px; background: #f5f3ff; color: #4c1d95; font-weight: bold; cursor: pointer; }
button:hover { background: #ede9fe; }
#feedback { min-height: 24px; font-weight: bold; }
.correct { color: #047857; } .wrong { color: #dc2626; }`,
    javascript: `const feedback = document.querySelector('#feedback');

document.querySelectorAll('[data-answer]').forEach((button) => {
  button.addEventListener('click', () => {
    const isCorrect = button.dataset.answer === 'correct';
    feedback.textContent = isCorrect ? 'Correct! CSS controls the design.' : 'Try again. Think about colors and layout.';
    feedback.className = isCorrect ? 'correct' : 'wrong';
  });
});`,
  },
  4: {
    html: `<main class="task-app">
  <header><div><small>LEVEL 4 PROJECT</small><h1>My Task Manager</h1></div><strong id="count">2 tasks</strong></header>
  <form id="taskForm">
    <input id="taskInput" placeholder="Enter a new task" required />
    <button>Add task</button>
  </form>
  <ul id="taskList">
    <li><span>Complete HTML practice</span><button>Delete</button></li>
    <li><span>Build a small project</span><button>Delete</button></li>
  </ul>
</main>`,
    css: `body { margin: 0; min-height: 100vh; display: grid; place-items: center; font-family: Arial, sans-serif; background: #f1f5f9; color: #0f172a; }
.task-app { width: min(620px, 88vw); padding: 28px; border-radius: 18px; background: white; box-shadow: 0 18px 50px #0f172a18; }
header { display: flex; align-items: center; justify-content: space-between; } small { color: #2563eb; font-weight: bold; } h1 { margin: 4px 0 18px; }
header strong { color: #64748b; font-size: 13px; }
form { display: grid; grid-template-columns: 1fr auto; gap: 8px; }
input, button { border-radius: 8px; padding: 11px; font: inherit; } input { border: 1px solid #cbd5e1; } button { border: 0; background: #2563eb; color: white; font-weight: bold; cursor: pointer; }
ul { padding: 0; list-style: none; } li { display: flex; justify-content: space-between; align-items: center; margin-top: 8px; padding: 11px; border: 1px solid #e2e8f0; border-radius: 8px; } li button { padding: 7px 9px; background: #fee2e2; color: #b91c1c; }`,
    javascript: `const form = document.querySelector('#taskForm');
const input = document.querySelector('#taskInput');
const list = document.querySelector('#taskList');
const count = document.querySelector('#count');

function updateCount() { const total = list.children.length; count.textContent = total + (total === 1 ? ' task' : ' tasks'); }
function connectDelete(button) { button.addEventListener('click', () => { button.closest('li').remove(); updateCount(); }); }
document.querySelectorAll('li button').forEach(connectDelete);

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const item = document.createElement('li');
  const text = document.createElement('span');
  const remove = document.createElement('button');
  text.textContent = input.value; remove.textContent = 'Delete';
  item.append(text, remove); list.append(item); connectDelete(remove);
  input.value = ''; updateCount();
});`,
  },
  5: {
    html: `<main class="dashboard">
  <header><div><small>LEVEL 5 PROJECT</small><h1>Expense Dashboard</h1></div><div class="total"><span>Total</span><strong id="total">RWF 0</strong></div></header>
  <form id="expenseForm">
    <input id="name" placeholder="Expense name" required />
    <input id="amount" type="number" min="1" placeholder="Amount (RWF)" required />
    <button>Add expense</button>
  </form>
  <div id="expenses" class="expenses"></div>
</main>`,
    css: `body { margin: 0; min-height: 100vh; display: grid; place-items: center; font-family: Arial, sans-serif; background: #071d35; color: #0f172a; }
.dashboard { width: min(720px, 90vw); padding: 30px; border-radius: 20px; background: #f8fafc; }
header { display: flex; justify-content: space-between; align-items: center; gap: 20px; } small { color: #0284c7; font-weight: bold; } h1 { margin: 5px 0 20px; }
.total { text-align: right; } .total span { display: block; color: #64748b; font-size: 12px; } .total strong { color: #047857; font-size: 20px; }
form { display: grid; grid-template-columns: 1fr 1fr auto; gap: 8px; }
input, button { padding: 11px; border-radius: 8px; font: inherit; } input { min-width: 0; border: 1px solid #cbd5e1; } button { border: 0; background: #0284c7; color: white; font-weight: bold; cursor: pointer; }
.expenses { margin-top: 18px; display: grid; gap: 8px; } .expense { display: grid; grid-template-columns: 1fr auto auto; align-items: center; gap: 12px; padding: 12px; background: white; border: 1px solid #e2e8f0; border-radius: 9px; }
.expense button { padding: 6px 8px; background: #fee2e2; color: #b91c1c; }
@media (max-width: 600px) { form { grid-template-columns: 1fr; } }`,
    javascript: `let expenses = [
  { name: 'Internet bundle', amount: 5000 },
  { name: 'Transport', amount: 3000 }
];

const container = document.querySelector('#expenses');
const totalText = document.querySelector('#total');

function render() {
  container.replaceChildren();
  expenses.forEach((expense, index) => {
    const row = document.createElement('div'); row.className = 'expense';
    const name = document.createElement('strong'); name.textContent = expense.name;
    const amount = document.createElement('span'); amount.textContent = 'RWF ' + expense.amount.toLocaleString();
    const remove = document.createElement('button'); remove.textContent = 'Remove';
    remove.addEventListener('click', () => { expenses.splice(index, 1); render(); });
    row.append(name, amount, remove); container.append(row);
  });
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  totalText.textContent = 'RWF ' + total.toLocaleString();
}

document.querySelector('#expenseForm').addEventListener('submit', (event) => {
  event.preventDefault();
  expenses.push({ name: document.querySelector('#name').value, amount: Number(document.querySelector('#amount').value) });
  event.target.reset(); render();
});

render();`,
  },
};

const languageMeta = {
  html: { label: 'HTML', detail: 'Structure', filename: 'index.html' },
  css: { label: 'CSS', detail: 'Design', filename: 'style.css' },
  javascript: { label: 'JavaScript', detail: 'Interaction', filename: 'script.js' },
};

function buildDocument(code) {
  const escapedScript = code.javascript.replace(/<\/script/gi, '<\\/script');
  const errorBridge = `window.addEventListener('error', function (event) { window.parent.postMessage({ source: 'gca-preview', message: event.message, line: event.lineno }, '*'); }); window.addEventListener('unhandledrejection', function (event) { window.parent.postMessage({ source: 'gca-preview', message: String(event.reason) }, '*'); });`;
  return `<!doctype html><html><head><meta charset="UTF-8"><style>${code.css}</style></head><body>${code.html}<script>${errorBridge}</script><script>${escapedScript}</script></body></html>`;
}

function validateCode(code) {
  const errors = [];
  const tagLikeLine = /^\s*(main|section|header|footer|div|form|input|button|h[1-6]|p|span|ul|li)\b[^<>]*>/i;

  code.html.split('\n').forEach((line, index) => {
    if (tagLikeLine.test(line)) {
      errors.push(`HTML line ${index + 1}: This looks like a tag but is missing "<" at the beginning.`);
    }
  });

  const voidTags = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
  const openTags = [];
  const tagPattern = /<\/?([a-z][\w-]*)\b[^>]*>/gi;
  let tagMatch;
  while ((tagMatch = tagPattern.exec(code.html))) {
    const tag = tagMatch[1].toLowerCase();
    const token = tagMatch[0];
    const line = code.html.slice(0, tagMatch.index).split('\n').length;
    if (token.startsWith('</')) {
      const expected = openTags.pop();
      if (expected?.tag !== tag) {
        errors.push(`HTML line ${line}: Closing </${tag}> does not match ${expected ? `<${expected.tag}>` : 'an opening tag'}.`);
        break;
      }
    } else if (!token.endsWith('/>') && !voidTags.has(tag)) {
      openTags.push({ tag, line });
    }
  }
  if (openTags.length > 0) {
    const unclosed = openTags.at(-1);
    errors.push(`HTML line ${unclosed.line}: Missing closing tag for <${unclosed.tag}>.`);
  }

  const openBraces = (code.css.match(/{/g) || []).length;
  const closeBraces = (code.css.match(/}/g) || []).length;
  if (openBraces !== closeBraces) {
    const line = code.css.split('\n').length;
    errors.push(`CSS line ${line}: ${openBraces > closeBraces ? 'Missing a closing "}".' : 'There is an extra closing "}".'}`);
  }

  try {
    new Function(code.javascript);
  } catch (error) {
    const stackLine = error.stack?.match(/<anonymous>:(\d+):\d+/)?.[1];
    const line = stackLine ? Math.max(1, Number(stackLine) - 2) : 1;
    errors.push(`JavaScript line ${line}: ${error.message}`);
  }

  return errors;
}

export default function LandingPage() {
  const previewContainerRef = useRef(null);
  const lineNumbersRef = useRef(null);
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [activeLanguage, setActiveLanguage] = useState('html');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showMobileTools, setShowMobileTools] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [errors, setErrors] = useState([]);
  const [codeByLevel, setCodeByLevel] = useState(() =>
    Object.fromEntries(Object.entries(levelStarterCode).map(([id, code]) => [id, { ...code }]))
  );
  const [previewByLevel, setPreviewByLevel] = useState(() =>
    Object.fromEntries(Object.entries(levelStarterCode).map(([id, code]) => [id, { ...code }]))
  );
  const [runCount, setRunCount] = useState(0);

  const activeLevel = levels.find((level) => level.id === selectedLevel);
  const code = codeByLevel[selectedLevel];
  const previewCode = previewByLevel[selectedLevel];
  const preview = useMemo(() => buildDocument(previewCode), [previewCode]);
  const editorLines = code[activeLanguage].split('\n');
  const activeErrorLines = errors.flatMap((error) => {
    const language = languageMeta[activeLanguage].label;
    const line = error.match(new RegExp(`^${language}(?: runtime error on)? line (\\d+)`, 'i'))?.[1];
    return line ? [Number(line)] : [];
  });

  useEffect(() => {
    const updateFullscreenState = () => {
      setIsFullscreen(document.fullscreenElement === previewContainerRef.current);
    };

    document.addEventListener('fullscreenchange', updateFullscreenState);
    return () => document.removeEventListener('fullscreenchange', updateFullscreenState);
  }, []);

  useEffect(() => {
    const receivePreviewError = (event) => {
      if (event.data?.source !== 'gca-preview') return;
      const line = event.data.line ? ` on line ${event.data.line}` : '';
      setErrors([`JavaScript runtime error${line}: ${event.data.message}`]);
    };

    window.addEventListener('message', receivePreviewError);
    return () => window.removeEventListener('message', receivePreviewError);
  }, []);

  const runCode = () => {
    const codeErrors = validateCode(code);
    setErrors(codeErrors);
    if (codeErrors.length > 0) return;
    setPreviewByLevel((current) => ({ ...current, [selectedLevel]: { ...code } }));
    setRunCount((count) => count + 1);
  };

  const resetCode = () => {
    const starter = { ...levelStarterCode[selectedLevel] };
    setCodeByLevel((current) => ({ ...current, [selectedLevel]: starter }));
    setPreviewByLevel((current) => ({ ...current, [selectedLevel]: starter }));
    setErrors([]);
    setRunCount((count) => count + 1);
  };

  const selectLevel = (levelId) => {
    setSelectedLevel(levelId);
    setErrors([]);
    setShowExplanation(false);
  };

  const viewFullscreen = () => {
    previewContainerRef.current?.requestFullscreen?.();
  };

  const closeFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen?.();
  };

  return (
    <div className="h-[100svh] bg-[#e9eef5] p-1.5 text-xs text-slate-900 sm:p-2">
      <main id="practice" className="mx-auto flex h-full max-w-[1800px] flex-col overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm">
        <section id="levels" className="flex flex-col gap-2 border-b border-slate-200 bg-white p-2 text-left lg:flex-row lg:items-center">
          <div className="flex items-center justify-between lg:block">
            <div className="flex shrink-0 items-center gap-2 pr-2">
              <img src={logo} alt="Global Coding Academy" className="h-8 w-8 rounded-full object-cover" />
              <div>
                <h1 className="text-sm font-black leading-tight text-[#071d35]">Coding Practice</h1>
                <p className="text-[10px] text-slate-500">Select your level</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowMobileTools((open) => !open)}
              className="inline-grid h-9 w-9 place-items-center rounded-lg bg-[#071d35] text-lg font-black leading-none text-white lg:hidden"
              aria-expanded={showMobileTools}
              aria-controls="mobile-practice-tools"
              aria-label={showMobileTools ? 'Close practice tools' : 'Open practice tools'}
            >
              {showMobileTools ? '×' : '☰'}
            </button>
          </div>

          <div id="mobile-practice-tools" className={`${showMobileTools ? 'grid' : 'hidden'} flex-1 grid-cols-2 gap-1.5 sm:grid-cols-5 lg:grid`}>
            {levels.map((level) => {
              const selected = selectedLevel === level.id;
              return (
                <button
                  type="button"
                  key={level.id}
                  onClick={() => selectLevel(level.id)}
                  title={level.name}
                  className={`min-w-0 rounded-lg border px-2 py-1.5 text-center transition ${selected ? 'border-[#0066cc] bg-[#0066cc] text-white' : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-blue-300 hover:bg-blue-50'}`}
                >
                  <span className="block text-[10px] font-black uppercase">Level {level.id}</span>
                  <span className="hidden truncate text-[10px] font-semibold sm:block">{level.name}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className={`${showMobileTools ? 'flex' : 'hidden'} flex-col gap-2 border-b border-slate-200 bg-slate-50 px-2 py-1.5 text-left sm:flex-row sm:items-center sm:justify-between lg:flex`}>
          <p className="min-w-0 truncate text-[11px] text-slate-600">
            <strong className="text-[#0066cc]">Level {activeLevel.id} challenge:</strong> {activeLevel.brief}
          </p>
          <div className="flex shrink-0 flex-wrap gap-1">
            <button
              type="button"
              onClick={() => setShowExplanation(true)}
              className="rounded-md border border-blue-200 bg-blue-50 px-3 py-1.5 text-[11px] font-extrabold text-blue-700 hover:bg-blue-100"
            >
              ? View explanation
            </button>
            {Object.entries(languageMeta).map(([key, language]) => (
              <button
                type="button"
                key={key}
                onClick={() => setActiveLanguage(key)}
                className={`rounded-md px-3 py-1.5 text-[11px] font-extrabold transition ${activeLanguage === key ? 'bg-[#071d35] text-white' : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-100'}`}
              >
                <span>{language.label}</span>
                <span className="ml-1 hidden font-normal opacity-70 md:inline">· {language.filename}</span>
              </button>
            ))}
          </div>
        </section>

        {errors.length > 0 && (
          <section className="flex items-start justify-between gap-3 border-b border-red-300 bg-red-50 px-3 py-2 text-left text-[11px] text-red-800" role="alert" aria-live="assertive">
            <div>
              <p className="font-black">Code error — fix the following before running:</p>
              <ul className="mt-1 list-disc pl-5 font-semibold">
                {errors.map((error) => <li key={error}>{error}</li>)}
              </ul>
            </div>
            <button type="button" onClick={() => setErrors([])} className="shrink-0 rounded-md border border-red-300 bg-white px-2.5 py-1 font-black text-red-700 hover:bg-red-100" aria-label="Close error message">
              × Close
            </button>
          </section>
        )}

        <section className="grid min-h-0 flex-1 overflow-auto bg-white lg:grid-cols-[minmax(340px,42%)_minmax(0,58%)] lg:overflow-hidden">
          <div className="flex min-h-[430px] flex-col bg-[#07131f] text-left lg:min-h-0">
            <div className="flex h-10 shrink-0 items-center justify-between border-b border-slate-700 px-3">
              <p className="font-bold text-white">{languageMeta[activeLanguage].filename} <span className="font-normal text-slate-400">· {languageMeta[activeLanguage].label} {languageMeta[activeLanguage].detail}</span></p>
              <button type="button" onClick={resetCode} className="rounded border border-slate-600 px-2 py-1 text-[10px] font-bold text-slate-300 hover:bg-slate-800">Reset</button>
            </div>
            <div className="flex min-h-0 flex-1 overflow-hidden bg-[#07131f]">
              <div ref={lineNumbersRef} className="w-11 shrink-0 select-none overflow-hidden border-r border-slate-700 bg-[#091827] py-3 text-right font-mono text-[12px] leading-5 text-slate-500" aria-hidden="true">
                {editorLines.map((_, index) => {
                  const lineNumber = index + 1;
                  const hasError = activeErrorLines.includes(lineNumber);
                  return <span key={lineNumber} className={`block h-5 pr-2 ${hasError ? 'bg-red-500/20 font-bold text-red-400' : ''}`}>{lineNumber}</span>;
                })}
              </div>
              <textarea
                value={code[activeLanguage]}
                onChange={(event) => setCodeByLevel((current) => ({
                  ...current,
                  [selectedLevel]: { ...current[selectedLevel], [activeLanguage]: event.target.value },
                }))}
                onScroll={(event) => {
                  if (lineNumbersRef.current) lineNumbersRef.current.scrollTop = event.currentTarget.scrollTop;
                }}
                className="min-h-0 min-w-0 flex-1 resize-none bg-[#07131f] px-3 py-3 font-mono text-[12px] leading-5 text-slate-100 outline-none"
                aria-label={`${languageMeta[activeLanguage].label} code editor`}
                spellCheck="false"
              />
            </div>
            <div className="flex h-11 shrink-0 items-center border-t border-slate-700 bg-[#0a1928] px-2">
              <button type="button" onClick={runCode} className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-[#ffd700] px-4 py-2 text-[11px] font-black text-[#071d35] hover:bg-yellow-300 active:scale-95">
                <span aria-hidden="true">▶</span> Run code
              </button>
            </div>
          </div>

          <div className="flex min-h-[430px] flex-col border-t border-slate-200 bg-slate-100 text-left lg:min-h-0 lg:border-l lg:border-t-0">
            <div className="flex h-10 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-3">
              <p className="font-bold text-[#071d35]">Live result</p>
              <div className="flex items-center gap-2">
                <div className="hidden items-center gap-1.5 text-[10px] font-bold text-emerald-700 sm:flex"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Browser preview</div>
                <button type="button" onClick={viewFullscreen} className="rounded-md bg-[#071d35] px-2.5 py-1.5 text-[10px] font-bold text-white hover:bg-[#123b62]" aria-label="View result in full screen">
                  ⛶ Full screen
                </button>
              </div>
            </div>
            <div ref={previewContainerRef} className="relative min-h-0 flex-1 overflow-hidden bg-white">
              {isFullscreen && (
                <button
                  type="button"
                  onClick={closeFullscreen}
                  className="absolute right-3 top-3 z-10 rounded-lg bg-red-600 px-4 py-2 text-xs font-black text-white shadow-lg hover:bg-red-700"
                  aria-label="Close full screen"
                >
                  × Close full screen
                </button>
              )}
              <iframe
                key={`${selectedLevel}-${runCount}`}
                title="Code result preview"
                srcDoc={preview}
                sandbox="allow-scripts"
                allowFullScreen
                className="block h-full min-h-[390px] w-full border-0 bg-white lg:min-h-0"
              />
            </div>
          </div>
        </section>

        {showExplanation && (
          <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#071d35]/70 p-3 backdrop-blur-sm sm:items-center" role="dialog" aria-modal="true" aria-labelledby="explanation-title">
            <section className="max-h-[calc(100svh-1.5rem)] w-full max-w-xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-2xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-[#0066cc]">Level {activeLevel.id} explanation</p>
                  <h2 id="explanation-title" className="mt-1 text-xl font-black text-[#071d35]">{activeLevel.name}</h2>
                </div>
                <button type="button" onClick={() => setShowExplanation(false)} className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-black text-slate-700 hover:bg-slate-200" aria-label="Close explanation">× Close</button>
              </div>

              <p className="mt-4 rounded-lg bg-blue-50 p-3 text-sm font-semibold leading-5 text-slate-700">{activeLevel.brief}</p>

              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                <h3 className="text-[10px] font-black uppercase tracking-wider text-emerald-700">Target result</h3>
                <p className="mt-1 text-xs font-semibold leading-5 text-emerald-950">{activeLevel.result}</p>
              </div>

              <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-600">Run it locally</h3>
                <p className="mt-1 text-[11px] leading-5 text-slate-700">
                  Create one folder with <code className="font-bold text-[#0066cc]">index.html</code>, <code className="font-bold text-[#0066cc]">style.css</code>, and <code className="font-bold text-[#0066cc]">script.js</code>. Paste each editor tab into its matching file. Add <code className="font-bold">&lt;link rel="stylesheet" href="style.css"&gt;</code> inside <code>&lt;head&gt;</code> and <code className="font-bold">&lt;script src="script.js"&gt;&lt;/script&gt;</code> before <code>&lt;/body&gt;</code>. Double-click <code className="font-bold">index.html</code> to run it.
                </p>
              </div>

              <h3 className="mt-4 text-xs font-black uppercase tracking-wider text-slate-500">What you will practise</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {activeLevel.concepts.map((concept) => <span key={concept} className="rounded-full bg-[#071d35] px-3 py-1.5 text-[11px] font-bold text-white">{concept}</span>)}
              </div>

              <h3 className="mt-4 text-xs font-black uppercase tracking-wider text-slate-500">How to complete it</h3>
              <ol className="mt-2 grid gap-2">
                {activeLevel.steps.map((step, index) => (
                  <li key={step} className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#ffd700] font-black text-[#071d35]">{index + 1}</span>{step}
                  </li>
                ))}
              </ol>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
