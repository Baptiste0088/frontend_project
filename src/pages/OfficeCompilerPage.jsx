import { useMemo, useState } from 'react';
import './office-compiler.css';

const apps = [
  { id: 'word', label: 'Word', badge: 'W', color: '#185abd' },
  { id: 'excel', label: 'Excel', badge: 'X', color: '#107c41' },
  { id: 'powerpoint', label: 'PowerPoint', badge: 'P', color: '#c43e1c' },
];

const ribbonTools = {
  word: ['Paste', 'Calibri', '11', 'Bold', 'Italic', 'Underline', 'Text color', 'Bullets', 'Align'],
  excel: ['Paste', 'Arial', '11', 'Bold', 'Borders', 'Currency', 'Percent', 'Sort', 'Filter'],
  powerpoint: ['New slide', 'Layout', 'Arial', '24', 'Bold', 'Shapes', 'Design', 'Transitions'],
};

function AppSwitcher({ active, onChange }) {
  return <nav className="oc-app-switcher" aria-label="Office applications">
    {apps.map((app) => <button key={app.id} type="button" onClick={() => onChange(app.id)} aria-pressed={active === app.id} style={{ '--app-color': app.color }}><span>{app.badge}</span>{app.label}</button>)}
  </nav>;
}

function Ribbon({ active }) {
  return <div className="oc-ribbon">
    <div className="oc-ribbon-tabs"><button className="active">Home</button><button>Insert</button><button>Layout</button><button>Review</button><button>View</button></div>
    <div className="oc-ribbon-tools">{ribbonTools[active].map((tool) => <button key={tool} type="button" className={tool === 'Bold' ? 'strong' : ''}>{tool}</button>)}</div>
  </div>;
}

function WordWorkspace() {
  return <section className="oc-word-workspace" aria-label="Word editor">
    <div className="oc-ruler"><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span></div>
    <article className="oc-paper" contentEditable suppressContentEditableWarning spellCheck="true">
      <h1>My practice document</h1>
      <p>Start typing here. Use the ribbon to practise creating and formatting a professional Microsoft Word document.</p>
      <h2>Learning task</h2>
      <p>Write one paragraph, add a title, make important words bold, and create a short bulleted list.</p>
    </article>
  </section>;
}

function ExcelWorkspace() {
  const rows = 12;
  const columns = 8;
  const [selected, setSelected] = useState('A1');
  const letters = useMemo(() => Array.from({ length: columns }, (_, index) => String.fromCharCode(65 + index)), []);
  return <section className="oc-excel-workspace" aria-label="Excel editor">
    <div className="oc-formula"><strong>{selected}</strong><span>fx</span><input aria-label="Formula" placeholder="Enter a value or formula" /></div>
    <div className="oc-sheet" style={{ '--columns': columns }}>
      <div className="oc-corner" />{letters.map((letter) => <div className="oc-column" key={letter}>{letter}</div>)}
      {Array.from({ length: rows }, (_, row) => <div className="oc-sheet-row" key={row}>
        <div className="oc-row-number">{row + 1}</div>
        {letters.map((letter) => { const cell = `${letter}${row + 1}`; return <div key={cell} className={selected === cell ? 'selected' : ''} contentEditable suppressContentEditableWarning onFocus={() => setSelected(cell)} />; })}
      </div>)}
    </div>
    <div className="oc-sheet-tabs"><button type="button">＋</button><button type="button" className="active">Sheet1</button></div>
  </section>;
}

function PowerPointWorkspace() {
  const [slides, setSlides] = useState([{ id: 1, title: 'Presentation title', body: 'Click to add a subtitle' }]);
  const [activeSlide, setActiveSlide] = useState(1);
  const slide = slides.find((item) => item.id === activeSlide) || slides[0];
  const addSlide = () => {
    const next = { id: Date.now(), title: 'New slide', body: 'Click to add text' };
    setSlides((current) => [...current, next]);
    setActiveSlide(next.id);
  };
  const updateSlide = (field, value) => setSlides((current) => current.map((item) => item.id === slide.id ? { ...item, [field]: value } : item));
  return <section className="oc-powerpoint-workspace" aria-label="PowerPoint editor">
    <aside className="oc-slide-list"><button type="button" className="oc-new-slide" onClick={addSlide}>＋ New slide</button>{slides.map((item, index) => <button type="button" key={item.id} onClick={() => setActiveSlide(item.id)} className={item.id === activeSlide ? 'active' : ''}><span>{index + 1}</span><div><strong>{item.title}</strong><small>{item.body}</small></div></button>)}</aside>
    <div className="oc-slide-stage"><div className="oc-slide"><input value={slide.title} onChange={(event) => updateSlide('title', event.target.value)} aria-label="Slide title" /><textarea value={slide.body} onChange={(event) => updateSlide('body', event.target.value)} aria-label="Slide text" /></div><div className="oc-notes">Click to add speaker notes</div></div>
  </section>;
}

export default function OfficeCompilerPage() {
  const [active, setActive] = useState('word');
  const currentApp = apps.find((app) => app.id === active) || apps[0];
  return <main className="office-compiler" style={{ '--app-color': currentApp.color }}>
    <header className="oc-titlebar"><a href="/" className="oc-back" aria-label="Back to learning">‹</a><span className="oc-app-badge">{currentApp.badge}</span><strong>{currentApp.label} practice</strong><span className="oc-file-name">Practice file</span><div className="oc-window-actions"><button type="button">−</button><button type="button">□</button><button type="button">×</button></div></header>
    <AppSwitcher active={active} onChange={setActive} />
    <Ribbon active={active} />
    <div className="oc-workspace">{active === 'word' && <WordWorkspace />}{active === 'excel' && <ExcelWorkspace />}{active === 'powerpoint' && <PowerPointWorkspace />}</div>
    <footer className="oc-statusbar"><span>Ready</span><span>{currentApp.label} learning workspace</span><span>100%</span></footer>
  </main>;
}
