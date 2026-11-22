import { useEffect, useState } from 'react';
import logo from '../assets/logo.jpeg';
import EnrollmentGate from './EnrollmentGate';
import { API_BASE_URL } from '../lib/api';

const levels = [
  { id: 1, name: 'Foundations', brief: 'Personal welcome card: practise headings, paragraphs, colors, and one button.', result: 'A centered card displays your greeting and introduction. Clicking the button shows a success message beneath it.', concepts: ['HTML structure', 'CSS colors', 'Click events'], steps: ['Edit the welcome text in HTML.', 'Change the card colors in CSS.', 'Run the code and click the button.'] },
  { id: 2, name: 'Core Skills', brief: 'Counter app: practise variables, buttons, events, and updating the page.', result: 'The score starts at 0. Add increases it, Subtract decreases it, and Reset always returns the score to 0.', concepts: ['Variables', 'Functions', 'DOM updates'], steps: ['Study the score element and buttons.', 'Change how much each click adds.', 'Run and test Add, Subtract, and Reset.'] },
  { id: 3, name: 'Web Builder', brief: 'Quiz app: practise layouts, choices, conditions, and feedback.', result: 'The page presents one question with three choices. A correct choice shows green feedback; a wrong choice asks the learner to try again.', concepts: ['Data attributes', 'Conditions', 'User feedback'], steps: ['Change the question and choices.', 'Mark one answer as correct.', 'Run and test every answer.'] },
  { id: 4, name: 'Application Skills', brief: 'Task manager: practise forms, arrays, dynamic lists, and delete actions.', result: 'Learners can add tasks, see each task in the list, delete any task, and watch the task total update immediately.', concepts: ['Forms', 'Dynamic elements', 'Event handling'], steps: ['Add a task with the form.', 'Study how JavaScript creates a list item.', 'Delete tasks and watch the count update.'] },
  { id: 5, name: 'Advanced Practice', brief: 'Expense dashboard: practise structured data, calculations, and reusable rendering.', result: 'The dashboard starts with RWF 8,000, accepts new expenses, removes existing ones, and recalculates the total after every change.', concepts: ['Objects and arrays', 'Reduce calculations', 'Reusable rendering'], steps: ['Review the starter expense data.', 'Add and remove expenses.', 'Change the render function or dashboard design.'] },
];

const rtqfCurriculum = {
  3: {
    focus: 'Foundation and Front-End Web Development',
    languages: [
      { name: 'HTML', trades: ['SWD', 'MMP'], module: 'Website Development · SWDWD301' },
      { name: 'CSS', trades: ['SWD', 'MMP'], module: 'Website Development and UI/UX styling · SWDWD301' },
      { name: 'JavaScript', trades: ['SWD', 'MMP'], module: 'JavaScript Fundamentals and Vue.js · SWDJF301' },
    ],
  },
  4: {
    focus: 'Backend Systems, Databases, OOP and Embedded Systems',
    languages: [
      { name: 'JavaScript', trades: ['SWD'], module: 'Backend Application Development with Node.js · SWDBD401' },
      { name: 'PHP', trades: ['SWD', 'NIT'], module: 'PHP, Laravel MVC and IoT web applications · NITIW401' },
      { name: 'SQL', trades: ['SWD', 'NIT'], module: 'MySQL Database Management · NITDB401' },
      { name: 'C', trades: ['CSA', 'NIT'], module: 'C Programming and Embedded Firmware · GENCP401' },
      { name: 'C++', trades: ['CSA', 'NIT'], module: 'C++ Fundamentals and Microcontroller Implementation' },
    ],
  },
  5: {
    focus: 'Advanced Frameworks, Mobile, AI, Kernel and Blockchain',
    languages: [
      { name: 'JavaScript', trades: ['SWD'], module: 'React and Next.js Frontend Development · SWDFA501' },
      { name: 'SQL', trades: ['SWD'], module: 'Advanced Database Administration and Backend Integration' },
      { name: 'Dart', trades: ['SWD'], module: 'Flutter Mobile Application Development · SWDMA501' },
      { name: 'Python', trades: ['SWD', 'NIT'], module: 'Python, Machine Learning and Network Automation · GENPP501' },
      { name: 'C', trades: ['SWD', 'CSA'], module: 'C Programming and Hobby Kernel Development · GENCC501' },
      { name: 'C++', trades: ['CSA'], module: 'Hobby Kernel Development and Hardware Optimisation · CSAHK501' },
      { name: 'Assembly', trades: ['CSA'], module: 'NASM Hobby Kernel Development · CSAHK501' },
      { name: 'Solidity', trades: ['SWD'], module: 'Blockchain and Smart Contracts · SWDBF501' },
    ],
  },
};

const ictLearningPaths = [
  {
    id: 'word',
    category: 'office',
    name: 'Microsoft Word',
    badge: 'W',
    color: 'bg-blue-700',
    focus: 'Create clean, professional documents.',
    topics: ['Type and format documents', 'Use tables, pictures, and page layouts', 'Create a CV, letter, and report'],
    practice: 'Prepare a professional job application with a cover letter and CV.',
  },
  {
    id: 'excel',
    category: 'office',
    name: 'Microsoft Excel',
    badge: 'X',
    color: 'bg-emerald-700',
    focus: 'Organize information and calculate results.',
    topics: ['Enter and format spreadsheet data', 'Use formulas, totals, and functions', 'Build useful charts and reports'],
    practice: 'Build a monthly budget that calculates totals and displays a chart.',
  },
  {
    id: 'powerpoint',
    category: 'office',
    name: 'Microsoft PowerPoint',
    badge: 'P',
    color: 'bg-orange-600',
    focus: 'Present ideas clearly and confidently.',
    topics: ['Design clear presentation slides', 'Add images, charts, and transitions', 'Prepare and deliver a presentation'],
    practice: 'Design and present a five-slide business or school project.',
  },
  {
    id: 'web',
    category: 'coding',
    name: 'HTML & CSS',
    badge: '</>',
    color: 'bg-cyan-700',
    focus: 'Build and style useful web pages.',
    topics: ['Create pages with semantic HTML', 'Style layouts with CSS', 'Make pages work on phones and computers'],
    practice: 'Build a responsive personal portfolio website.',
  },
  {
    id: 'javascript',
    category: 'coding',
    name: 'JavaScript',
    badge: 'JS',
    color: 'bg-amber-500',
    focus: 'Add logic and interaction to websites.',
    topics: ['Use variables, conditions, and functions', 'Handle buttons, forms, and events', 'Build interactive browser projects'],
    practice: 'Create and test an interactive quiz application.',
  },
  {
    id: 'python',
    category: 'coding',
    name: 'Python',
    badge: 'Py',
    color: 'bg-indigo-700',
    focus: 'Learn programming and automation clearly.',
    topics: ['Write programs with input and output', 'Use conditions, loops, and functions', 'Solve practical problems with code'],
    practice: 'Build a marks and attendance calculator.',
  },
  {
    id: 'c',
    category: 'coding',
    name: 'C Programming',
    badge: 'C',
    color: 'bg-slate-700',
    focus: 'Understand core programming concepts.',
    topics: ['Compile and run C programs', 'Work with variables and user input', 'Organize solutions with functions'],
    practice: 'Create a small command-line management program.',
  },
];

function curriculumTradeKey(enrollment) {
  const value = `${enrollment?.trade_code || ''} ${enrollment?.trade_name || ''}`.toLowerCase();
  if (value.includes('swd') || value.includes('software')) return 'SWD';
  if (value.includes('csa') || value.includes('computer system')) return 'CSA';
  if (value.includes('nit') || value.includes('network')) return 'NIT';
  if (value.includes('mmp') || value.includes('multimedia')) return 'MMP';
  return 'ALL';
}

function publishedPageHeading(page) {
  const headings = (page.published_blocks || []).flatMap((block) => {
    if (block.type !== 'rich_text' || !block.content) return [];
    const documentNode = new DOMParser().parseFromString(block.content, 'text/html');
    return [...documentNode.querySelectorAll('h1, h2, h3, h4, h5, h6')]
      .map((heading) => heading.textContent.trim())
      .filter(Boolean);
  });
  return headings[0] || '';
}

const _starterCode = {
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

const _levelStarterCode = {
  1: _starterCode,
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

const _languageMeta = {
  html: { label: 'HTML', detail: 'Structure', filename: 'index.html' },
  css: { label: 'CSS', detail: 'Design', filename: 'style.css' },
  javascript: { label: 'JavaScript', detail: 'Interaction', filename: 'script.js' },
};

function _buildDocument(code) {
  const escapedScript = code.javascript.replace(/<\/script/gi, '<\\/script');
  const errorBridge = `window.addEventListener('error', function (event) { window.parent.postMessage({ source: 'gca-preview', message: event.message, line: event.lineno }, '*'); }); window.addEventListener('unhandledrejection', function (event) { window.parent.postMessage({ source: 'gca-preview', message: String(event.reason) }, '*'); });`;
  return `<!doctype html><html><head><meta charset="UTF-8"><style>${code.css}</style></head><body>${code.html}<script>${errorBridge}</script><script>${escapedScript}</script></body></html>`;
}

function _validateCode(code) {
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
  const [profileUser, setProfileUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('gcaUser');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });
  const [enrollment, setEnrollment] = useState(() => {
    try {
      const storedEnrollment = localStorage.getItem('gcaEnrollment');
      return storedEnrollment ? JSON.parse(storedEnrollment) : null;
    } catch {
      return null;
    }
  });
  const [showEnrollment, setShowEnrollment] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [selectedLearningPath, setSelectedLearningPath] = useState('word');
  const [packageLanguages, setPackageLanguages] = useState([]);
  const [packageChapters, setPackageChapters] = useState({});
  const [packagePages, setPackagePages] = useState({});
  const [selectedPackageLanguage, setSelectedPackageLanguage] = useState('');
  const [expandedChapter, setExpandedChapter] = useState('');
  const [selectedPackagePage, setSelectedPackagePage] = useState('');
  const [packageLoading, setPackageLoading] = useState(true);
  const [packageError, setPackageError] = useState('');
  const [_selectedLevel, setSelectedLevel] = useState(1);
  const [selectedLesson, setSelectedLesson] = useState({ levelId: 1, type: 'overview', index: 0 });
  const [_expandedTocLevel, setExpandedTocLevel] = useState(1);
  const darkMode = false;
  const [curriculumLanguage] = useState('HTML');
  const selectedRtqfLevel = Number(String(enrollment?.level_name || '').match(/\d+/)?.[0]);
  const rtqfLevel = rtqfCurriculum[selectedRtqfLevel] ? selectedRtqfLevel : 3;
  const curriculumTrade = curriculumTradeKey(enrollment);

  const matchingCurriculumLanguages = rtqfCurriculum[rtqfLevel].languages.filter((language) => curriculumTrade === 'ALL' || language.trades.includes(curriculumTrade));
  const curriculumLanguages = matchingCurriculumLanguages.length ? matchingCurriculumLanguages : rtqfCurriculum[rtqfLevel].languages;
  const selectedCurriculumLanguage = curriculumLanguages.find((language) => language.name === curriculumLanguage) || curriculumLanguages[0];
  const selectedLearningCourse = ictLearningPaths.find((course) => course.id === selectedLearningPath) || ictLearningPaths[0];
  const activeLevel = levels.find((level) => level.id === selectedLesson.levelId) || levels[0];
  const activeConcept = activeLevel.concepts[selectedLesson.index];
  const activeStep = activeLevel.steps[selectedLesson.index];
  const lessonPages = levels.flatMap((level) => [
    { levelId: level.id, type: 'overview', index: 0, label: `Level ${level.id}: ${level.name}` },
    ...level.concepts.map((concept, index) => ({ levelId: level.id, type: 'concept', index, label: concept })),
    ...level.steps.map((step, index) => ({ levelId: level.id, type: 'step', index, label: `Step ${index + 1}` })),
  ]);
  const currentPageIndex = lessonPages.findIndex((page) => (
    page.levelId === selectedLesson.levelId && page.type === selectedLesson.type && page.index === selectedLesson.index
  ));
  const previousPage = currentPageIndex > 0 ? lessonPages[currentPageIndex - 1] : null;
  const nextPage = currentPageIndex < lessonPages.length - 1 ? lessonPages[currentPageIndex + 1] : null;
  const totalLessonItems = levels.reduce((total, level) => total + 1 + level.concepts.length + level.steps.length, 0);
  const completedPreviousItems = levels
    .filter((level) => level.id < selectedLesson.levelId)
    .reduce((total, level) => total + 1 + level.concepts.length + level.steps.length, 0);
  const currentItemPosition = selectedLesson.type === 'overview'
    ? 1
    : selectedLesson.type === 'concept'
      ? 2 + selectedLesson.index
      : 2 + activeLevel.concepts.length + selectedLesson.index;
  const progressPercentage = Math.round(((completedPreviousItems + currentItemPosition) / totalLessonItems) * 100);
  const accountName = [profileUser?.first_name, profileUser?.last_name].filter(Boolean).join(' ') || profileUser?.name || profileUser?.username || '';
  const fullName = enrollment?.full_name || 'Sample learner';
  const occupation = enrollment?.occupation_name || 'Choose occupation';
  const enrolledLevel = enrollment?.level_name || 'Choose level';
  const enrolledTrade = enrollment?.trade_name || 'Choose trade';
  const displayedProgress = enrollment ? progressPercentage : 0;
  const profileImage = profileUser?.profile_image || profileUser?.profileImage || profileUser?.avatar_url || logo;
  const selectedLanguageChapters = packageChapters[selectedPackageLanguage] || [];
  const publishedLessonPages = selectedLanguageChapters.flatMap((chapter) => (
    (packagePages[chapter.id] || []).map((page) => ({ ...page, heading: publishedPageHeading(page) }))
  ));
  const activePackagePage = Object.values(packagePages).flat().find((page) => page.id === selectedPackagePage);
  const activePackagePageIndex = publishedLessonPages.findIndex((page) => page.id === selectedPackagePage);
  const previousPackagePage = activePackagePageIndex > 0 ? publishedLessonPages[activePackagePageIndex - 1] : null;
  const nextPackagePage = activePackagePageIndex >= 0 && activePackagePageIndex < publishedLessonPages.length - 1 ? publishedLessonPages[activePackagePageIndex + 1] : null;

  useEffect(() => {
    if (!enrollment?.trade_id) return;
    let cancelled = false;
    fetch(`${API_BASE_URL}/api/trades/${enrollment.trade_id}/languages`)
      .then(async (response) => {
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload.message || 'Unable to load languages.');
        const languages = payload.languages || [];
        const languageResults = await Promise.all(languages.map(async (language) => {
          const chapterResponse = await fetch(`${API_BASE_URL}/api/languages/${language.id}/chapters`);
          const chapterPayload = await chapterResponse.json().catch(() => ({}));
          if (!chapterResponse.ok) throw new Error(chapterPayload.message || `Unable to load ${language.name} chapters.`);
          const chapters = chapterPayload.chapters || [];
          const pageEntries = await Promise.all(chapters.map(async (chapter) => {
            const pageResponse = await fetch(`${API_BASE_URL}/api/chapters/${chapter.id}/pages`);
            const pagePayload = await pageResponse.json().catch(() => ({}));
            if (!pageResponse.ok) throw new Error(pagePayload.message || `Unable to load ${chapter.name} pages.`);
            return [chapter.id, (pagePayload.pages || []).filter((page) => page.is_published)];
          }));
          return { languageId: language.id, chapters, pageEntries };
        }));
        if (!cancelled) {
          setPackageLanguages(languages);
          setPackageChapters(Object.fromEntries(languageResults.map((result) => [result.languageId, result.chapters])));
          setPackagePages(Object.fromEntries(languageResults.flatMap((result) => result.pageEntries)));
          setSelectedPackageLanguage(languages[0]?.id || '');
          setExpandedChapter(languageResults[0]?.chapters[0]?.id || '');
          setSelectedPackagePage(languageResults[0]?.pageEntries.flatMap((entry) => entry[1])[0]?.id || '');
        }
      })
      .catch((requestError) => { if (!cancelled) setPackageError(requestError.message); })
      .finally(() => { if (!cancelled) setPackageLoading(false); });
    return () => { cancelled = true; };
  }, [enrollment?.trade_id]);

  const _selectLevel = (levelId) => {
    if (!enrollment) { setShowEnrollment(true); return; }
    setSelectedLevel(levelId);
    setExpandedTocLevel(levelId);
    setSelectedLesson({ levelId, type: 'overview', index: 0 });
  };

  const selectLessonItem = (levelId, type, index) => {
    if (!enrollment) { setShowEnrollment(true); return; }
    setSelectedLevel(levelId);
    setExpandedTocLevel(levelId);
    setSelectedLesson({ levelId, type, index });
  };

  const selectStudentLanguage = (languageId) => {
    const chapters = packageChapters[languageId] || [];
    setSelectedPackageLanguage(languageId);
    setExpandedChapter(chapters[0]?.id || '');
    setSelectedPackagePage(chapters.flatMap((chapter) => packagePages[chapter.id] || [])[0]?.id || '');
  };

  const selectPublishedPage = (page) => {
    setSelectedPackagePage(page.id);
    setExpandedChapter(page.chapter_id);
    setShowMobileSidebar(false);
  };

  const openCodeRunner = (block) => {
    const runId = block.id;
    localStorage.setItem(`gcaCodeRun:${runId}`, JSON.stringify({ language: block.language, code: block.code }));
    window.open(`/code-runner?run=${encodeURIComponent(runId)}`, '_blank', 'noopener');
  };

  const signOut = () => {
    localStorage.removeItem('gcaAuthToken');
    localStorage.removeItem('gcaUser');
    localStorage.removeItem('gcaEnrollment');
    setProfileUser(null);
    setEnrollment(null);
    setShowProfileMenu(false);
    setShowAccount(false);
  };

  return (
    <div className={`h-[100svh] w-full overflow-hidden text-xs ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900'}`}>
      {showEnrollment && !enrollment && (
        <EnrollmentGate
          initialName={accountName}
          onClose={() => setShowEnrollment(false)}
          onEnrolled={(savedEnrollment) => { setEnrollment(savedEnrollment); setShowEnrollment(false); }}
        />
      )}
      {showAccount && enrollment && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-[#082f55]/65 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="My account">
          <section className="relative w-full max-w-md rounded-2xl bg-white p-7 text-left text-slate-900 shadow-2xl">
            <button type="button" onClick={() => setShowAccount(false)} className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-xl text-slate-600" aria-label="Close account">×</button>
            <img src={profileImage} alt="Profile" className="h-16 w-16 rounded-full object-cover" />
            <h2 className="mt-4 text-2xl font-black text-[#082f55]">{fullName}</h2>
            <dl className="mt-6 grid gap-4 text-sm">
              <div><dt className="text-xs font-bold uppercase text-slate-500">Username</dt><dd className="mt-1 font-bold">{profileUser?.username || enrollment.login_username || enrollment.student_id_number || 'Student account'}</dd></div>
              <div><dt className="text-xs font-bold uppercase text-slate-500">Occupation</dt><dd className="mt-1 font-bold">{occupation}</dd></div>
              <div><dt className="text-xs font-bold uppercase text-slate-500">Level</dt><dd className="mt-1 font-bold">{enrolledLevel}</dd></div>
              <div><dt className="text-xs font-bold uppercase text-slate-500">Trade</dt><dd className="mt-1 font-bold">{enrolledTrade}</dd></div>
            </dl>
          </section>
        </div>
      )}
      <main id="practice" className="flex h-full w-full flex-col overflow-hidden">
        <section className={`practice-header border-b px-3 py-2 text-left ${darkMode ? 'border-slate-700 bg-slate-950 text-white' : 'border-slate-300 bg-white text-slate-900'}`}>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="brand-block flex min-w-0 items-center gap-3">
              <img src={logo} alt="Global Coding Academy logo" className="brand-logo h-11 w-11 shrink-0 rounded-full object-cover" />
              <div className="brand-copy min-w-0">
                <p className="brand-name">Global Coding Academy</p>
                <p className="brand-slogan"><span aria-hidden="true" />Code Today. Build Tomorrow.</p>
              </div>
            </div>
            <button type="button" onClick={() => setShowMobileSidebar(true)} className="flex items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 font-black text-[#082f55] md:hidden" aria-expanded={showMobileSidebar} aria-controls="learning-sidebar"><span aria-hidden="true">☰</span> Lessons</button>
            <div className="profile-meta flex flex-wrap items-stretch gap-2 lg:justify-end">
              {!enrollment && <div className="office-invite flex min-w-0 items-center gap-3 rounded-xl bg-[#082f55] px-3 py-2 text-white shadow-sm sm:px-4">
                <div className="min-w-0"><strong className="block truncate text-sm">Enroll in practical ICT</strong><span className="block truncate text-[11px] text-blue-100">Microsoft Office, programming languages &amp; coding projects</span></div>
                <button type="button" onClick={() => setShowEnrollment(true)} className="shrink-0 rounded-lg bg-[#ffd700] px-4 py-2 font-black text-[#082f55] hover:bg-[#f5ca00]">Enroll</button>
              </div>}
              {enrollment && <>
              <div className="profile-meta-card progress-card hidden sm:block">
                <span>Progress</span>
                <strong>{displayedProgress}%</strong>
                <span className="progress-track" aria-hidden="true">
                  <span style={{ width: `${displayedProgress}%` }} />
                </span>
              </div>
              <div className="profile-meta-card hidden sm:block">
                <span>Occupation</span>
                <strong>{occupation}</strong>
              </div>
              <div className="profile-meta-card hidden sm:block">
                <span>Level</span>
                <strong>{enrolledLevel}</strong>
              </div>
              <div className="profile-meta-card trade-card hidden sm:block">
                <span>Trade</span>
                <strong>{enrolledTrade}</strong>
              </div>
              <div className="profile-card relative flex items-center gap-2">
                <div className="min-w-0 text-right">
                  <strong className="block max-w-40 truncate" title={fullName}>{fullName}</strong>
                </div>
                {enrollment ? <button type="button" onClick={() => setShowProfileMenu((current) => !current)} className="rounded-full" aria-expanded={showProfileMenu} aria-label="Open profile menu"><img src={profileImage} alt={`${fullName} profile`} className="h-8 w-8 rounded-full object-cover" /></button> : <img src={profileImage} alt={`${fullName} profile`} className="h-8 w-8 rounded-full object-cover" />}
                {showProfileMenu && enrollment && <div className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-44 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 text-left shadow-xl">
                  <button type="button" onClick={() => { setShowAccount(true); setShowProfileMenu(false); }} className="block w-full px-4 py-2.5 text-left text-sm font-bold text-[#082f55] hover:bg-slate-100">My account</button>
                  <button type="button" onClick={signOut} className="block w-full border-t border-slate-100 px-4 py-2.5 text-left text-sm font-bold text-red-600 hover:bg-red-50">Sign out</button>
                </div>}
              </div>
              </>}
            </div>
          </div>
          {enrollment && <div className="mt-2">
            <div className="language-row flex min-w-0 items-center gap-2 overflow-x-auto px-2 py-1">
              <span className="shrink-0 text-[9px] font-bold uppercase tracking-wider text-slate-400">Language</span>
              <div className="flex min-w-0 flex-1 items-center gap-1.5">
                {enrollment && packageLoading && <span className="text-[11px] text-slate-500">Loading…</span>}
                {packageLanguages.map((language) => {
                  const selected = selectedPackageLanguage === language.id;
                  return (
                    <button
                      type="button"
                      key={language.id || language.name}
                      onClick={() => selectStudentLanguage(language.id)}
                      aria-pressed={selected}
                      className={`shrink-0 rounded px-2.5 py-1 text-[11px] font-bold transition ${selected ? (darkMode ? 'bg-white text-slate-950' : 'bg-slate-900 text-white') : (darkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100')}`}
                    >
                      {language.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>}
        </section>

        <section className={`flex min-h-0 flex-1 overflow-hidden ${darkMode ? 'bg-slate-950' : 'bg-white'}`}>
          {showMobileSidebar && <button type="button" className="fixed inset-0 z-40 bg-slate-950/55 md:hidden" onClick={() => setShowMobileSidebar(false)} aria-label="Close lesson menu" />}
          <aside id="learning-sidebar" className={`practice-sidebar fixed inset-y-0 left-0 z-50 flex h-full w-[min(85vw,300px)] shrink-0 flex-col overflow-y-auto border-r text-left shadow-2xl transition-transform duration-200 md:static md:z-auto md:w-[260px] md:translate-x-0 md:shadow-none ${showMobileSidebar ? 'translate-x-0' : '-translate-x-full'} ${darkMode ? 'border-slate-700 bg-slate-900 text-white' : 'border-slate-300 bg-slate-50 text-slate-900'}`}>
            <div className="flex items-center justify-between border-b border-slate-200 bg-white px-3 py-3 md:hidden"><strong className="text-[#082f55]">Learning menu</strong><button type="button" onClick={() => setShowMobileSidebar(false)} className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-lg text-slate-600" aria-label="Close lesson menu">×</button></div>
            {enrollment && <div className={`border-b px-3 py-3 ${darkMode ? 'border-slate-700' : 'border-slate-300'}`}>
              <p className={`text-[10px] font-black uppercase tracking-[0.14em] ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>My Package</p>
            </div>}

            <nav className="flex-1 overflow-y-auto py-2" aria-label="Lesson table of contents">
              {enrollment && packageLoading && <p className="px-3 py-4 text-slate-500">Loading your languages…</p>}
              {enrollment && packageError && <p className="mx-3 my-3 rounded bg-red-50 px-3 py-2 text-red-700">{packageError}</p>}
              {enrollment && !packageLoading && !packageError && packageLanguages.length === 0 && <p className="px-3 py-4 text-slate-500">No languages have been added to your trade yet.</p>}
              {enrollment && !packageLoading && packageLanguages.length > 0 && selectedLanguageChapters.length === 0 && <p className="px-3 py-4 text-slate-500">No chapters have been added to this language yet.</p>}
              {enrollment && selectedLanguageChapters.map((chapter, chapterIndex) => {
                const expanded = expandedChapter === chapter.id;
                const publishedPages = packagePages[chapter.id] || [];
                return (
                  <div key={chapter.id} className={`border-b ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                    <button
                      type="button"
                      onClick={() => setExpandedChapter(expanded ? '' : chapter.id)}
                      className={`flex w-full items-center gap-2 px-3 py-3 text-left font-bold transition ${darkMode ? 'text-white hover:bg-slate-800' : 'text-[#082f55] hover:bg-slate-100'}`}
                      aria-expanded={expanded}
                    >
                      <span className="shrink-0 text-slate-400">{chapterIndex + 1}.</span>
                      <span className="min-w-0 flex-1 truncate" title={chapter.name}>{chapter.name}</span>
                      <span className="shrink-0 rounded bg-slate-200 px-1.5 py-0.5 text-[10px] text-slate-700">{publishedPages.length}</span>
                      <span aria-hidden="true">{expanded ? '▾' : '▸'}</span>
                    </button>
                    {expanded && <div className={darkMode ? 'bg-slate-950' : 'bg-white'}>
                      {publishedPages.length === 0
                        ? <p className="px-8 py-3 text-[11px] text-slate-500">No published pages</p>
                        : publishedPages.map((page) => {
                          const heading = publishedPageHeading(page);
                          return heading ? <button type="button" key={page.id} onClick={() => selectPublishedPage(page)} className={`flex w-full items-start border-t px-8 py-2.5 text-left text-[11px] ${selectedPackagePage === page.id ? 'bg-slate-900 text-white' : (darkMode ? 'border-slate-800 text-slate-300 hover:bg-slate-800' : 'border-slate-100 text-slate-700 hover:bg-slate-100')}`}><span className="mr-2 text-slate-400">›</span><span>{heading}</span></button> : null;
                        })}
                    </div>}
                  </div>
                );
              })}
              {!enrollment && <div>
                <div className="border-b border-blue-100 px-3 py-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-blue-700">Choose what to learn</p>
                  <p className="mt-1 text-[11px] leading-4 text-slate-500">Office skills and programming in one ICT program.</p>
                </div>
                <div className="bg-white p-2">
                  {[['office', 'Microsoft Office'], ['coding', 'Programming & coding']].map(([category, label]) => <div key={category} className="mb-2 last:mb-0"><p className="px-2 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-slate-400">{label}</p><div className="grid gap-1">{ictLearningPaths.filter((course) => course.category === category).map((course) => <button type="button" key={course.id} onClick={() => { setSelectedLearningPath(course.id); setShowMobileSidebar(false); }} aria-pressed={selectedLearningPath === course.id} className="learning-track-button flex items-center gap-2.5 p-2.5 text-left">
                    <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[11px] font-black text-white ${course.color}`}>{course.badge}</span>
                    <span className="min-w-0"><strong className="block text-xs">{course.name}</strong><span className="block truncate text-[9px] leading-4 text-slate-500">{course.focus}</span></span>
                  </button>)}</div></div>)}
                </div>
                <div className="m-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-[11px] leading-5 text-slate-700"><strong className="text-[#082f55]">Learn by doing:</strong> complete real office tasks and coding projects.</div>
              </div>}
            </nav>

          </aside>
          <article className={`lesson-content min-w-0 flex-1 bg-white p-4 text-left text-black sm:p-6 ${enrollment ? 'overflow-y-auto' : 'overflow-y-auto md:overflow-hidden'}`} aria-label="Lesson content">
            <div className={`mx-auto max-w-4xl ${!enrollment ? 'h-full min-h-0' : ''}`}>
              {!enrollment && (
                <section className="guest-learning-page grid h-full min-h-0 gap-4 lg:grid-cols-[1.05fr_0.95fr]">
                  <div className="flex min-h-0 flex-col justify-between overflow-hidden rounded-2xl bg-[#082f55] p-6 text-white shadow-lg sm:p-8">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ffd700]">Practical ICT, Office and programming</p>
                      <h1 className="mt-3 max-w-xl text-3xl font-black leading-tight sm:text-4xl">Build digital skills and learn to code.</h1>
                      <p className="mt-4 max-w-xl text-sm leading-6 text-blue-100 sm:text-base">Learn Word, Excel, PowerPoint, web development, JavaScript, Python, and C through guided lessons and practical projects.</p>
                    </div>
                    <div className="mt-5 flex flex-wrap items-center gap-3"><button type="button" onClick={() => setShowEnrollment(true)} className="rounded-lg bg-[#ffd700] px-6 py-3 font-black text-[#082f55] hover:bg-[#f5ca00]">Enroll in ICT</button><span className="text-xs font-bold text-blue-100">Beginner-friendly · Learn by doing</span></div>
                  </div>
                  <div className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-blue-100 bg-white p-5 shadow-sm sm:p-6">
                    <div className="flex items-center gap-3 border-b border-slate-200 pb-4"><span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl text-lg font-black text-white ${selectedLearningCourse.color}`}>{selectedLearningCourse.badge}</span><div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-blue-600">Selected learning path</p><h2 className="text-xl font-black text-[#082f55]">{selectedLearningCourse.name}</h2></div></div>
                    <div className="mt-4 min-h-0 flex-1"><h3 className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">What you will learn</h3><ul className="mt-3 grid gap-2 text-sm font-bold text-slate-700">{selectedLearningCourse.topics.map((topic) => <li key={topic} className="flex items-start gap-2 rounded-lg bg-blue-50/70 px-3 py-2"><span className="text-emerald-600">✓</span><span>{topic}</span></li>)}</ul></div>
                    <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4"><p className="text-[10px] font-black uppercase tracking-[0.12em] text-amber-700">Practice project</p><p className="mt-1 text-sm font-bold leading-5 text-slate-700">{selectedLearningCourse.practice}</p></div>
                  </div>
                </section>
              )}
              {enrollment && activePackagePage && (
                <section>
                  <div className="space-y-5">
                    {(activePackagePage.published_blocks || []).map((block) => block.type === 'rich_text'
                      ? <div key={block.id} className="chapter-rich-text" style={{ lineHeight: activePackagePage.line_spacing || 1.5 }} dangerouslySetInnerHTML={{ __html: block.content }} />
                      : <div key={block.id} className="overflow-hidden rounded-lg border border-slate-800 bg-slate-950 text-slate-100"><div className="flex items-center justify-between gap-3 border-b border-slate-700 px-4 py-2"><span className="text-[10px] font-bold uppercase text-slate-400">{block.language}</span><button type="button" onClick={() => openCodeRunner(block)} className="rounded bg-[#ffd700] px-3 py-1.5 text-[11px] font-black text-[#082f55] hover:bg-[#f5ca00]">▶ Run code ↗</button></div><pre className="overflow-x-auto p-4 text-sm"><code>{block.code}</code></pre>{block.output && <pre className="border-t border-slate-700 bg-black/30 p-4 text-xs text-emerald-300">{block.output}</pre>}</div>)}
                  </div>
                  <nav className="mt-10 flex items-center justify-between gap-3 border-t border-slate-300 pt-5" aria-label="Published lesson pagination">
                    <button type="button" disabled={!previousPackagePage} onClick={() => previousPackagePage && selectPublishedPage(previousPackagePage)} className={`rounded-lg border px-4 py-2.5 text-left font-bold ${previousPackagePage ? 'border-[#082f55] bg-[#082f55] text-white hover:bg-[#0b416f]' : 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400'}`}>← {previousPackagePage ? (previousPackagePage.heading ? `Previous: ${previousPackagePage.heading}` : 'Previous page') : 'Previous'}</button>
                    <button type="button" disabled={!nextPackagePage} onClick={() => nextPackagePage && selectPublishedPage(nextPackagePage)} className={`ml-auto rounded-lg border px-4 py-2.5 text-right font-bold ${nextPackagePage ? 'border-[#082f55] bg-[#082f55] text-white hover:bg-[#0b416f]' : 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400'}`}>{nextPackagePage ? (nextPackagePage.heading ? `Next: ${nextPackagePage.heading}` : 'Next page') : 'Next'} →</button>
                  </nav>
                </section>
              )}
              {enrollment && !packageLoading && !activePackagePage && <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 text-slate-600">Select a published page from the left sidebar. If none appears, this language has no published lesson pages yet.</div>}
              <div className="sample-lesson-document hidden">
              <p className={`text-[10px] font-black uppercase tracking-[0.16em] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Level {activeLevel.id} · {selectedCurriculumLanguage.name}
              </p>

              {selectedLesson.type === 'overview' && (
                <>
                  <h1 className={`mt-2 text-2xl font-black ${darkMode ? 'text-white' : 'text-slate-950'}`}>{activeLevel.name}</h1>
                  <ul className="mt-6 list-disc space-y-5 pl-5 text-sm font-bold leading-6">
                    <li>
                      Course overview
                      <ul className={`mt-2 list-circle space-y-2 pl-5 font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        <li>{activeLevel.brief}</li>
                        <li>{activeLevel.result}</li>
                      </ul>
                    </li>
                    <li>
                      Topics
                      <ul className={`mt-2 list-disc space-y-1.5 pl-5 font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        {activeLevel.concepts.map((concept) => <li key={concept}>{concept}</li>)}
                      </ul>
                    </li>
                    <li>
                      Lesson steps
                      <ol className={`mt-2 list-decimal space-y-1.5 pl-5 font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        {activeLevel.steps.map((step) => <li key={step}>{step}</li>)}
                      </ol>
                    </li>
                  </ul>
                </>
              )}

              {selectedLesson.type === 'concept' && (
                <>
                  <h1 className={`mt-2 text-2xl font-black ${darkMode ? 'text-white' : 'text-slate-950'}`}>{activeConcept}</h1>
                  <ul className="mt-6 list-disc space-y-4 pl-5 text-sm font-bold leading-6">
                    <li>
                      About this topic
                      <ul className={`mt-2 list-disc space-y-2 pl-5 font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        <li>This topic is part of {activeLevel.name}.</li>
                        <li>{activeLevel.brief}</li>
                      </ul>
                    </li>
                    <li>
                      Learning goal
                      <ul className={`mt-2 list-disc pl-5 font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        <li>Understand {activeConcept.toLowerCase()} and use it to complete the Level {activeLevel.id} learning result.</li>
                      </ul>
                    </li>
                  </ul>
                </>
              )}

              {selectedLesson.type === 'step' && (
                <>
                  <h1 className={`mt-2 text-2xl font-black ${darkMode ? 'text-white' : 'text-slate-950'}`}>Step {selectedLesson.index + 1}</h1>
                  <ul className="mt-6 list-disc space-y-4 pl-5 text-sm font-bold leading-6">
                    <li>
                      Task
                      <ul className={`mt-2 list-disc pl-5 font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        <li>{activeStep}</li>
                      </ul>
                    </li>
                    <li>
                      Expected result
                      <ul className={`mt-2 list-disc pl-5 font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        <li>{activeLevel.result}</li>
                      </ul>
                    </li>
                  </ul>
                </>
              )}

              <nav className={`lesson-navigation mt-10 flex items-center justify-between gap-3 border-t pt-5 ${darkMode ? 'border-slate-700' : 'border-slate-300'}`} aria-label="Lesson pagination">
                <button
                  type="button"
                  disabled={!previousPage}
                  onClick={() => previousPage && selectLessonItem(previousPage.levelId, previousPage.type, previousPage.index)}
                  className={`rounded border px-4 py-2 ${previousPage ? 'border-slate-900 bg-slate-900 text-white hover:bg-slate-800' : 'cursor-not-allowed border-slate-300 bg-slate-200 text-slate-500 opacity-50'}`}
                >
                  Previous{previousPage ? `: ${previousPage.label}` : ''}
                </button>
                <button
                  type="button"
                  disabled={!nextPage}
                  onClick={() => nextPage && selectLessonItem(nextPage.levelId, nextPage.type, nextPage.index)}
                  className={`rounded border px-4 py-2 text-right ${nextPage ? 'border-slate-900 bg-slate-900 text-white hover:bg-slate-800' : 'cursor-not-allowed border-slate-300 bg-slate-200 text-slate-500 opacity-50'}`}
                >
                  Next{nextPage ? `: ${nextPage.label}` : ''}
                </button>
              </nav>
              </div>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
