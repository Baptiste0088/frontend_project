import { useEffect, useMemo, useRef, useState } from 'react';
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

const wordTabs = ['Home', 'Insert', 'Design', 'Layout', 'References', 'Mailings', 'Review', 'View', 'Acrobat'];

function WordRibbon({ activeTab, onTab, run, zoom, setZoom, onSave }) {
  const home = <div className="oc-word-groups">
    <div className="oc-word-group oc-clipboard"><button type="button" className="oc-large-tool" onClick={() => run('paste')}>▣<span>Paste</span></button><div><button type="button" onClick={() => run('cut')}>✂ Cut</button><button type="button" onClick={() => run('copy')}>▤ Copy</button><button type="button" onClick={() => run('removeFormat')}>▥ Format Painter</button></div><small>Clipboard</small></div>
    <div className="oc-word-group"><div className="oc-font-line"><select aria-label="Font family" defaultValue="Calibri" onChange={(event) => run('fontName', event.target.value)}><option>Calibri</option><option>Arial</option><option>Times New Roman</option><option>Century Schoolbook</option><option>Georgia</option></select><select aria-label="Font size" defaultValue="3" onChange={(event) => run('fontSize', event.target.value)}><option value="2">10</option><option value="3">11</option><option value="4">14</option><option value="5">18</option><option value="6">24</option><option value="7">36</option></select><button type="button" onClick={() => run('increaseFontSize')}>A↑</button><button type="button" onClick={() => run('decreaseFontSize')}>A↓</button></div><div className="oc-font-line"><button type="button" className="strong" onClick={() => run('bold')}>B</button><button type="button" className="italic" onClick={() => run('italic')}>I</button><button type="button" className="underline" onClick={() => run('underline')}>U</button><button type="button" onClick={() => run('strikeThrough')}>abc</button><label title="Highlight color">▰<input type="color" defaultValue="#fff200" onChange={(event) => run('hiliteColor', event.target.value)} /></label><label title="Font color">A<input type="color" defaultValue="#000000" onChange={(event) => run('foreColor', event.target.value)} /></label><button type="button" onClick={() => run('removeFormat')}>A⌫</button></div><small>Font</small></div>
    <div className="oc-word-group"><div className="oc-paragraph-line"><button type="button" onClick={() => run('insertUnorderedList')}>• List</button><button type="button" onClick={() => run('insertOrderedList')}>1. List</button><button type="button" onClick={() => run('outdent')}>⇤</button><button type="button" onClick={() => run('indent')}>⇥</button><button type="button" onClick={() => run('formatBlock', 'blockquote')}>¶</button></div><div className="oc-paragraph-line"><button type="button" onClick={() => run('justifyLeft')}>≡</button><button type="button" onClick={() => run('justifyCenter')}>≣</button><button type="button" onClick={() => run('justifyRight')}>≡→</button><button type="button" onClick={() => run('justifyFull')}>▤</button><button type="button" onClick={() => run('formatBlock', 'p')}>↕</button></div><small>Paragraph</small></div>
    <div className="oc-word-group oc-styles"><button type="button" onClick={() => run('formatBlock', 'p')}>Normal</button><button type="button" onClick={() => run('formatBlock', 'h1')}>Heading 1</button><button type="button" onClick={() => run('formatBlock', 'h2')}>Heading 2</button><button type="button" onClick={() => run('formatBlock', 'h3')}>Title</button><small>Styles</small></div>
    <div className="oc-word-group oc-editing"><button type="button" onClick={() => run('find')}>⌕ Find</button><button type="button" onClick={() => run('replace')}>↔ Replace</button><button type="button" onClick={() => run('selectAll')}>▾ Select</button><small>Editing</small></div>
    <div className="oc-word-group oc-adobe"><button type="button" onClick={() => run('print')}><strong>⌘</strong><span>Create<br />a PDF</span></button><small>Adobe Acrobat</small></div>
  </div>;
  const secondary = {
    File: [['Save document', 'save'], ['New document', 'newDocument'], ['Print', 'print']],
    Insert: [['Page break', 'pageBreak'], ['Table', 'table'], ['Link', 'createLink'], ['Picture', 'image'], ['Date & time', 'date'], ['Symbol', 'symbol']],
    Design: [['Title style', 'title'], ['Heading style', 'heading'], ['Blue theme', 'blueTheme'], ['Clear formatting', 'removeFormat']],
    Layout: [['Normal margins', 'normalMargins'], ['Narrow margins', 'narrowMargins'], ['Portrait', 'portrait'], ['Landscape', 'landscape']],
    References: [['Table of contents', 'toc'], ['Footnote', 'footnote'], ['Citation', 'citation']],
    Mailings: [['Greeting line', 'greeting'], ['Address block', 'address'], ['Merge field', 'merge']],
    Review: [['Word count', 'wordCount'], ['Spelling', 'spelling'], ['Select all', 'selectAll'], ['Clear formatting', 'removeFormat']],
    View: [['Print layout', 'printView'], ['Web layout', 'webView'], ['100% zoom', 'zoom100']],
    Acrobat: [['Create a PDF', 'print'], ['Export document', 'save']],
  };
  return <div className="oc-ribbon oc-word-ribbon">
    <div className="oc-ribbon-tabs"><button type="button" className="oc-file-tab" onClick={() => onTab('File')}>File</button>{wordTabs.map((tab) => <button type="button" key={tab} onClick={() => onTab(tab)} className={activeTab === tab ? 'active' : ''}>{tab}</button>)}<span className="oc-tell-me">Tell me what you want to do…</span></div>
    {activeTab === 'Home' ? home : <div className="oc-secondary-tools">{(secondary[activeTab] || secondary.Insert).map(([label, command]) => <button type="button" key={command} onClick={() => command === 'zoom100' ? setZoom(100) : command === 'save' ? onSave() : run(command)}><strong>{label.slice(0, 1)}</strong><span>{label}</span></button>)}{activeTab === 'View' && <label className="oc-ribbon-zoom">Zoom <input type="range" min="70" max="150" value={zoom} onChange={(event) => setZoom(Number(event.target.value))} /></label>}</div>}
  </div>;
}

function WordWorkspace({ editorRef, onInput, zoom, paperMode }) {
  return <section className="oc-word-workspace" aria-label="Word editor">
    <article ref={editorRef} className={`oc-paper ${paperMode}`} style={{ zoom: `${zoom}%` }} contentEditable suppressContentEditableWarning spellCheck="true" onInput={onInput}>
      <p><br /></p>
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
  const [wordTab, setWordTab] = useState('Home');
  const [wordCount, setWordCount] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [paperMode, setPaperMode] = useState('portrait');
  const [fileName] = useState('Document2 [Compatibility Mode]');
  const wordEditorRef = useRef(null);
  const currentApp = apps.find((app) => app.id === active) || apps[0];
  useEffect(() => {
    if (!wordEditorRef.current) return;
    const stored = localStorage.getItem('gca:office-compiler:word:v2');
    if (stored) wordEditorRef.current.innerHTML = stored;
    setWordCount(wordEditorRef.current.innerText.trim().split(/\s+/).filter(Boolean).length);
  }, [active]);
  const updateWordState = () => {
    const editor = wordEditorRef.current;
    if (!editor) return;
    localStorage.setItem('gca:office-compiler:word:v2', editor.innerHTML);
    setWordCount(editor.innerText.trim().split(/\s+/).filter(Boolean).length);
  };
  const runWordCommand = async (command, value = null) => {
    const editor = wordEditorRef.current;
    if (!editor) return;
    editor.focus();
    if (command === 'find') { document.execCommand('findString', false, window.getSelection()?.toString() || ''); return; }
    if (command === 'replace') { document.execCommand('selectAll'); return; }
    if (command === 'pageBreak') value = '<div class="oc-page-break"><span>Page break</span></div><p><br></p>';
    if (command === 'table') value = '<table><tbody><tr><td>Heading 1</td><td>Heading 2</td></tr><tr><td>Data</td><td>Data</td></tr></tbody></table><p><br></p>';
    if (command === 'date') value = `<p>${new Date().toLocaleDateString()}</p>`;
    if (command === 'symbol') value = '©';
    if (command === 'footnote') value = '<sup>1</sup>';
    if (command === 'citation') value = '(Author, Year)';
    if (command === 'greeting') value = 'Dear «First_Name»,';
    if (command === 'address') value = '«Address_Block»';
    if (command === 'merge') value = '«Merge_Field»';
    if (command === 'toc') value = '<h2>Table of contents</h2><p>1. Introduction ................................ 1</p>';
    if (['pageBreak', 'table', 'date', 'toc'].includes(command)) command = 'insertHTML';
    if (['symbol', 'footnote', 'citation', 'greeting', 'address', 'merge'].includes(command)) command = 'insertText';
    if (command === 'title') { command = 'formatBlock'; value = 'h1'; }
    if (command === 'heading') { command = 'formatBlock'; value = 'h2'; }
    if (command === 'blueTheme') { document.execCommand('foreColor', false, '#2f5597'); updateWordState(); return; }
    if (command === 'normalMargins') { setPaperMode('portrait'); return; }
    if (command === 'narrowMargins') { setPaperMode('narrow'); return; }
    if (command === 'portrait') { setPaperMode('portrait'); return; }
    if (command === 'landscape') { setPaperMode('landscape'); return; }
    if (command === 'wordCount') { window.alert(`${wordCount} words`); return; }
    if (command === 'spelling') { editor.setAttribute('spellcheck', 'true'); editor.focus(); return; }
    if (command === 'printView') { setPaperMode('portrait'); return; }
    if (command === 'webView') { setPaperMode('web'); return; }
    if (command === 'image') { document.execCommand('insertText', false, '[Picture]'); updateWordState(); return; }
    if (command === 'createLink') { document.execCommand('createLink', false, 'https://'); updateWordState(); return; }
    if (command === 'newDocument') { editor.innerHTML = '<p><br></p>'; updateWordState(); return; }
    if (command === 'print') { window.print(); return; }
    if (command === 'paste') {
      try { document.execCommand('insertText', false, await navigator.clipboard.readText()); } catch { editor.focus(); }
      updateWordState();
      return;
    }
    if (['copy', 'cut'].includes(command)) { document.execCommand(command); updateWordState(); return; }
    document.execCommand(command, false, value);
    updateWordState();
  };
  const saveWord = async () => {
    updateWordState();
    if (wordEditorRef.current) {
      const { downloadPracticeDocument } = await import('../lib/exportWordDocument');
      await downloadPracticeDocument(wordEditorRef.current, fileName);
    }
  };
  return <main className={`office-compiler ${active === 'word' ? 'word-mode' : ''}`} style={{ '--app-color': currentApp.color }}>
    {active === 'word' ? <header className="oc-titlebar oc-word-titlebar"><div className="oc-word-title-left"><a href="/" className="oc-back" aria-label="Back to learning">‹</a><select className="oc-office-launcher" value={active} onChange={(event) => setActive(event.target.value)} aria-label="Office application"><option value="word">W</option><option value="excel">X</option><option value="powerpoint">P</option></select><div className="oc-quick-access"><button type="button" onClick={saveWord} title="Save">▣</button><button type="button" onClick={() => runWordCommand('undo')} title="Undo">↶</button><button type="button" onClick={() => runWordCommand('redo')} title="Redo">↷</button><button type="button" title="Repeat">↻</button><button type="button" title="Customize toolbar">⌄</button></div></div><strong className="oc-word-window-title">{fileName} - Word</strong><div className="oc-word-title-right"><button type="button" className="oc-share">♙ Share</button><div className="oc-window-actions"><button type="button">−</button><button type="button">□</button><button type="button">×</button></div></div></header> : <header className="oc-titlebar"><a href="/" className="oc-back" aria-label="Back to learning">‹</a><span className="oc-app-badge">{currentApp.badge}</span><strong>{currentApp.label} practice</strong><span className="oc-file-name">Practice file</span><div className="oc-window-actions"><button type="button">−</button><button type="button">□</button><button type="button">×</button></div></header>}
    {active !== 'word' && <AppSwitcher active={active} onChange={setActive} />}
    {active === 'word' ? <WordRibbon activeTab={wordTab} onTab={setWordTab} run={runWordCommand} zoom={zoom} setZoom={setZoom} onSave={saveWord} /> : <Ribbon active={active} />}
    <div className="oc-workspace">{active === 'word' && <WordWorkspace editorRef={wordEditorRef} onInput={updateWordState} zoom={zoom} paperMode={paperMode} />}{active === 'excel' && <ExcelWorkspace />}{active === 'powerpoint' && <PowerPointWorkspace />}</div>
    <footer className="oc-statusbar">{active === 'word' ? <><span>Page 1 of 1</span><span>{wordCount} words</span><span>English (United Kingdom)</span><span className="oc-view-buttons">▤ ▣ ▥</span><label>− <input type="range" min="70" max="150" value={zoom} onChange={(event) => setZoom(Number(event.target.value))} /> ＋ {zoom}%</label></> : <><span>Ready</span><span>{currentApp.label} learning workspace</span><span>100%</span></>}</footer>
  </main>;
}
