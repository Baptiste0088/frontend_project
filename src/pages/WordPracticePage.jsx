import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { wordActivities, practiceUrl } from '../lib/wordPractice';
import { addAgendaRow, cleanDocument, learnerDraftKey, placeCursor, readDraft } from '../lib/wordDocument';
import noticeTemplate from '../data/word-notice-template.json';
import './word-practice.css';

const normalise = text => text.replace(/\s+/g,' ').trim().toLowerCase();

function checkExercise(number, editor, name, zoom) {
  const text = normalise(editor.textContent);
  const list = [...editor.querySelectorAll('ul li')].map(item => normalise(item.textContent));
  const rows = [...editor.querySelectorAll('table tr')].map(row => [...row.cells].map(c => normalise(c.textContent)).join(' '));
  const has = words => text.includes(normalise(words));
  const boldTime = [...editor.querySelectorAll('b,strong,[style]')].some(el =>
    (el.matches('b,strong') || el.style.fontWeight === 'bold') && el.textContent.includes('14:00'));
  const blueTitle = [...editor.querySelectorAll('h1,h1 *,[style],font[color]')].some(el =>
    /digital skills club meeting/i.test(el.textContent) && (el.style.color === 'rgb(23, 75, 113)' || el.getAttribute('color')?.toLowerCase() === '#174b71'));
  switch (number) {
    case 1: return [[has('We meet in Room C.'),'The note says “We meet in Room C.”'], [/first word note/i.test(name),'The document is named First Word Note.']];
    case 2: return [[zoom === 110,'The view is set to 110%.'],[has('We meet in Room C.') && !has('Bring a pen.'),'The original meeting sentence is back after Undo.']];
    case 3: return [[/digital skills club notice/i.test(name),'Your copy has its own document name.'],[has('Friday at 14:00') && (has('Room B') || has('Room C')),'Meeting details have replaced both placeholders.']];
    case 4: return [[has('Digital Skills Club meeting'),'The title names the club.'],[has('Join us to practise editing and saving a file.') && has('Room C'),'The invitation and room have been updated.']];
    case 5: return [[[...editor.querySelectorAll('h2')].some(h => normalise(h.textContent)==='what to bring'),'“What to bring” uses Heading 2.'],[boldTime,'The meeting time is bold.'],[blueTitle,'The meeting title uses Dark blue.']];
    case 6: return ['notebook','pen','folder'].map((item,i)=>[list[i]===item,'Bullet '+(i+1)+' reads '+item+'.']);
    case 7: return ['14:00 welcome','14:10 word practice','14:25 questions'].map(row=>[rows.includes(row),'The agenda contains '+row+'.']);
    default: return [[!/\[[^\]]+\]/.test(editor.textContent),'All bracketed placeholders have been filled.'],[has('Room C') && has('Friday at 14:00'),'The meeting details are correct.'],[['notebook','pen','folder'].every(item=>list.includes(item)),'All three supplies are bulleted.'],[rows.includes('14:25 questions'),'The agenda ends with questions at 14:25.']];
  }
}

export default function WordPracticePage() {
  const [params,setParams]=useSearchParams();
  const n=Number(params.get('lesson'));
  const lesson=Number.isInteger(n) && n>=1 && n<=wordActivities.length ? n : 1;
  const embedded=params.get('embedded')==='1';
  const isNote=lesson<=2;
  const draftKey=learnerDraftKey(isNote);
  const go=to=>{
    if (to>=1 && to<=wordActivities.length) setParams({lesson:String(to),...(embedded?{embedded:'1'}:{})});
  };
  return <LessonWorkspace key={draftKey} {...{lesson,embedded,isNote,draftKey,go}} />;
}

function ToolButton({label,onClick,children}) {
  return <button type="button" aria-label={label} title={label} onMouseDown={event=>event.preventDefault()} onClick={onClick}>{children}</button>;
}

function LessonWorkspace({lesson,embedded,isNote,draftKey,go}) {
  const exercise=wordActivities[lesson-1];
  const [initial]=useState(()=>readDraft(draftKey,{name:isNote?'Untitled note':'Club meeting notice',html:isNote?'<p><br></p>':noticeTemplate.html}));
  const editor=useRef(null);
  const savedSelection=useRef(null);
  const nameRef=useRef(initial.name);
  const [name,setName]=useState(initial.name);
  const [status,setStatus]=useState('Your personal practice copy');
  const [words,setWords]=useState(()=>new DOMParser().parseFromString(initial.html,'text/html').body.textContent.trim().split(/\s+/).filter(Boolean).length);
  const [zoom,setZoom]=useState(100);
  const [checks,setChecks]=useState(null);
  const [exporting,setExporting]=useState(false);
  const updateCount=()=>setWords((editor.current?.innerText.match(/\S+/g)||[]).length);

  useEffect(()=>{
    editor.current.innerHTML=initial.html;
    const frame=requestAnimationFrame(updateCount);
    return ()=>cancelAnimationFrame(frame);
  },[initial]);

  function save(newName=nameRef.current) {
    if (!editor.current) return;
    updateCount();
    setChecks(null);
    try {
      const html=cleanDocument(editor.current.innerHTML);
      if (html.length>=250000) throw new Error('too large');
      localStorage.setItem(draftKey,JSON.stringify({name:newName,html}));
      setStatus('Saved in this browser');
    } catch { setStatus('Use Download .docx to keep this copy. Browser storage is unavailable or full.'); }
  }
  function rename(value) {
    nameRef.current=value;
    setName(value);
    save(value);
  }
  function remember() {
    const selection=window.getSelection();
    if (selection.rangeCount && editor.current.contains(selection.anchorNode) && editor.current.contains(selection.focusNode)) {
      savedSelection.current=selection.getRangeAt(0).cloneRange();
    }
  }
  function focusSelection() {
    const range=savedSelection.current;
    editor.current.focus();
    if (range && editor.current.contains(range.commonAncestorContainer)) {
      const selection=window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
  function format(command,value) {
    focusSelection();
    document.execCommand(command,false,value);
    remember();
    save();
  }
  function selectedCell() {
    const node=window.getSelection().anchorNode;
    const cell=(node?.nodeType===1?node:node?.parentElement)?.closest('th,td');
    return cell && editor.current.contains(cell) ? cell : null;
  }
  function addRow() {
    focusSelection();
    if (addAgendaRow(editor.current,selectedCell())) { remember(); save(); }
  }
  function onKey(event) {
    if ((event.ctrlKey||event.metaKey) && event.key.toLowerCase()==='s') {
      event.preventDefault();save();return;
    }
    if (event.key!=='Tab') return;
    const cell=selectedCell();
    if (!cell) return;
    const cells=[...cell.closest('table').querySelectorAll('th,td')];
    const target=cells[cells.indexOf(cell)+(event.shiftKey?-1:1)];
    if (target) { event.preventDefault();placeCursor(target);remember(); }
    else if (!event.shiftKey) { event.preventDefault();addRow(); }
  }
  async function download() {
    setExporting(true);
    try {
      const {downloadPracticeDocument}=await import('../lib/exportWordDocument');
      await downloadPracticeDocument(editor.current,nameRef.current);
      setStatus('Word copy downloaded');
    } catch { setStatus('The download did not finish. Please try again.'); }
    finally { setExporting(false); }
  }
  return <main className={'word-lab'+(embedded?' word-lab-embedded':'')}>
    {!embedded && <header className="wl-mast"><a href="/#practice">Global Coding Academy</a><span>Beginner ICT · Microsoft Word</span></header>}
    <div className="wl-layout">
      {!embedded && <aside className="wl-lessons"><h2>Word lessons</h2><nav aria-label="Word practice lessons">{wordActivities.map((item,i)=><a key={item.title} href={practiceUrl(i+1)} aria-current={lesson===i+1?'page':undefined} onClick={e=>{if(!e.ctrlKey&&!e.metaKey&&!e.shiftKey&&!e.altKey){e.preventDefault();go(i+1);}}}><span>{i+1}</span>{item.title}</a>)}</nav></aside>}
      <section className="wl-work">
        <div className="wl-exercise"><p className="wl-kicker">Practice {lesson} of {wordActivities.length}</p>
          <h1>{exercise.title}</h1>{!embedded&&<p>{exercise.goal}</p>}
          <ol>{exercise.steps.map(s=><li key={s}>{s}</li>)}</ol>
        </div>
        <section className="wl-desk" aria-label="Online document editor">
          <div className="wl-file"><label>Document name<input aria-label="Document name" value={name} maxLength={100} onChange={e=>rename(e.target.value)}/></label>
            <div className="wl-file-actions"><button type="button" onClick={()=>save()}>Save</button><button type="button" onClick={download} disabled={exporting}>{exporting?'Downloading…':'Download .docx'}</button><button type="button" onClick={()=>window.print()}>Print / PDF</button></div>
          </div>
          <div className="wl-toolbar" role="toolbar" aria-label="Document formatting">
            <ToolButton label="Undo" onClick={()=>format('undo')}>Undo</ToolButton>
            <ToolButton label="Redo" onClick={()=>format('redo')}>Redo</ToolButton>
            <select aria-label="Paragraph style" value="" onChange={e=>format('formatBlock',e.target.value)}><option value="" disabled>Paragraph style</option><option value="p">Normal</option><option value="h1">Title</option><option value="h2">Heading 2</option></select>
            <ToolButton label="Bold" onClick={()=>format('bold')}><b>B</b></ToolButton>
            <ToolButton label="Italic" onClick={()=>format('italic')}><i>I</i></ToolButton>
            <select aria-label="Font colour" value="" onChange={e=>format('foreColor',e.target.value)}><option value="" disabled>Font colour</option><option value="#174b71">Dark blue</option><option value="#146657">Green</option><option value="#17212b">Black</option></select>
            <ToolButton label="Bullets" onClick={()=>format('insertUnorderedList')}>• Bullets</ToolButton>
            {!isNote&&<ToolButton label="Add table row" onClick={addRow}>+ Add row</ToolButton>}
          </div>
          <div className="wl-sheet-scroll"><article className="wl-paper" ref={editor} role="textbox" aria-label="Practice document" aria-multiline="true" contentEditable suppressContentEditableWarning spellCheck
            style={{'--document-size':(16*zoom/100)+'px'}} onInput={()=>save()} onKeyDown={onKey} onKeyUp={remember} onMouseUp={remember} onBlur={remember}
            onPaste={e=>{e.preventDefault();document.execCommand('insertText',false,e.clipboardData.getData('text/plain'));}}
            onDrop={e=>e.preventDefault()} /></div>
          <div className="wl-status"><span role="status">{status}</span><span>{words} {words===1?'word':'words'}</span><label>Zoom <select aria-label="Document zoom" value={zoom} onChange={e=>setZoom(Number(e.target.value))}>{[90,100,110,125].map(z=><option key={z} value={z}>{z}%</option>)}</select></label></div>
        </section>
        <div className="wl-review"><button type="button" onClick={()=>setChecks({lesson,items:checkExercise(lesson,editor.current,name,zoom)})}>Check my work</button>{!embedded&&lesson<wordActivities.length&&<button type="button" onClick={()=>go(lesson+1)}>Next exercise →</button>}</div>
        {checks?.lesson===lesson&&<section className="wl-checks" aria-live="polite"><h2>Practice feedback</h2><ul>{checks.items.map(([ok,message])=><li key={message}><strong className={ok?'wl-done':'wl-try'}>{ok?'Done':'To practise'}</strong> {message}</li>)}</ul></section>}
        <p className="wl-storage">Your draft stays in this browser on this device. Download a Word copy to take it with you.</p>
        {lesson===3&&<p className="wl-originals">Original practice files <a href="/word-practice-files/club-meeting-notice.dotx" download>Word template (.dotx)</a> <a href="/word-practice-files/club-meeting-notice.docx" download>Starter document (.docx)</a></p>}
      </section>
    </div>
  </main>;
}
