import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { cleanDocument } from '../lib/wordDocument';
import './office-practice.css';

const runtime = '/compiler/runtime/9.3.0.133-24e34b4f401d86dfb31def637358e2fa/vendor';
const exercises = [
  { id: 'document', app: 'word', kind: 'word', ext: 'docx', title: 'Blank document', url: '/compiler/templates/blank.docx' },
  { id: 'workbook', app: 'excel', kind: 'cell', ext: 'xlsx', title: 'Blank spreadsheet', url: '/compiler/templates/blank.xlsx' },
  { id: 'presentation', app: 'powerpoint', kind: 'slide', ext: 'pptx', title: 'Blank presentation', url: '/compiler/templates/blank.pptx' },
  { id: 'club-notice', app: 'word', kind: 'word', ext: 'docx', title: 'Club meeting notice', url: '/word-practice-files/club-meeting-notice.docx' },
  { id: 'budget', app: 'excel', kind: 'cell', ext: 'xlsx', title: 'Project budget', url: '/compiler/templates/project-budget.xlsx' },
  { id: 'project-brief', app: 'powerpoint', kind: 'slide', ext: 'pptx', title: 'Project brief', url: '/compiler/templates/project-brief.pptx' },
];

let loadingAPI;
function loadEditor() {
  if (window.DocsAPI?.DocEditor) return Promise.resolve(window.DocsAPI);
  if (!loadingAPI) loadingAPI = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = runtime + '/web-apps/apps/api/documents/api.js';
    script.onload = () => window.DocsAPI?.DocEditor ? resolve(window.DocsAPI) : reject(new Error());
    script.onerror = () => { script.remove(); reject(new Error()); };
    document.head.append(script);
  }).catch(error => { loadingAPI = null; throw error; });
  return loadingAPI;
}

function previousDraft() {
  try { return localStorage.getItem('gca:office-compiler:word:v2'); } catch { return null; }
}

export default function OfficeCompilerPage() {
  const [params] = useSearchParams();
  const initial = exercises.find(item => item.id === params.get('template'))
    || exercises.find(item => item.app === params.get('app')) || exercises[0];
  const [practice, setPractice] = useState(initial);
  const [status, setStatus] = useState('opening');
  const [message, setMessage] = useState('');
  const [draft] = useState(previousDraft);
  const stage = useRef(null);
  const fileInput = useRef(null);
  const session = useRef(null);
  const dirty = useRef(false);
  const saving = useRef(false);
  const saveTimer = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    const host = stage.current;
    const mount = document.createElement('div');
    mount.id = 'office-' + crypto.randomUUID();
    host.replaceChildren(mount);
    let editor;
    let fileUrl;
    const openingTimer = setTimeout(() => {
      setStatus('error');
      setMessage('The editor is taking longer to open. You can retry or choose another file.');
    }, 120000);
    const frame = () => host.querySelector('iframe')?.contentWindow;
    const listenForSave = event => {
      if (event.origin !== location.origin || !frame() || event.source !== frame()) return;
      const data = event.data;
      if (data?.type !== 'onlyoffice-file-stream' || !(data.buffer instanceof ArrayBuffer) || !data.buffer.byteLength) return;
      const url = URL.createObjectURL(new Blob([data.buffer], { type: 'application/octet-stream' }));
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = data.fileName || practice.title + '.' + practice.ext;
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
      setTimeout(() => URL.revokeObjectURL(url), 30000);
      saving.current = false;
      clearTimeout(saveTimer.current);
      dirty.current = false;
      setStatus('ready');
      setMessage('Copy downloaded');
    };
    const leave = event => {
      if (dirty.current) { event.preventDefault(); event.returnValue = ''; }
    };
    window.addEventListener('message', listenForSave);
    window.addEventListener('beforeunload', leave);
    async function open() {
      try {
        const api = await loadEditor();
        if (signal.aborted) return;
        let file = practice.file;
        if (!file) {
          const response = await fetch(practice.url, { signal });
          if (!response.ok) throw new Error();
          file = await response.blob();
        }
        if (signal.aborted) return;
        fileUrl = URL.createObjectURL(file);
        editor = new api.DocEditor(mount.id, {
          width: '100%', height: '100%',
          // This browser build includes local file conversion in its full editor on all screen sizes.
          type: 'desktop',
          documentType: practice.kind,
          document: { fileType: practice.ext, title: practice.file?.name || practice.title + '.' + practice.ext,
            url: fileUrl, key: mount.id, permissions: { edit: true, download: true, print: true } },
          editorConfig: { mode: 'edit', lang: 'en', user: { id: 'practice', name: 'Learner' },
            customization: { autosave: false } },
          events: {
            onAppReady() { if (!signal.aborted && frame()) frame().OO_FILE_STREAM_ONLY = true; },
            onDocumentReady() {
              if (signal.aborted) return;
              clearTimeout(openingTimer);
              if (frame()) frame().OO_FILE_STREAM_ONLY = true;
              setMessage('');
              setStatus('ready');
            },
            onDocumentStateChange(event) {
              if (!signal.aborted && event.data) { dirty.current = true; setMessage(''); }
            },
            onError() {
              if (signal.aborted) return;
              clearTimeout(openingTimer);
              clearTimeout(saveTimer.current);
              saving.current = false;
              setStatus('error');
              setMessage('ONLYOFFICE could not complete the operation. Try opening the file again.');
            },
          },
        });
        session.current = editor;
      } catch {
        if (!signal.aborted) { setStatus('error'); setMessage('The practice editor could not open this file.'); }
      }
    }
    open();
    return () => {
      controller.abort();
      clearTimeout(openingTimer);
      clearTimeout(saveTimer.current);
      window.removeEventListener('message', listenForSave);
      window.removeEventListener('beforeunload', leave);
      editor?.destroyEditor();
      session.current = null;
      if (fileUrl) URL.revokeObjectURL(fileUrl);
    };
  }, [practice]);

  function changeFile(next) {
    if (saving.current || (dirty.current && !confirm('Open another practice file and discard unsaved edits?'))) return;
    dirty.current = false;
    setMessage('');
    setStatus('opening');
    setPractice({ ...next });
  }

  function openLocal(event) {
    const file = event.target.files[0];
    event.target.value = '';
    if (!file) return;
    const type = exercises.find(item => item.ext === file.name.split('.').pop().toLowerCase());
    if (type) changeFile({ ...type, id: 'local', title: file.name, file });
    else setMessage('Choose a DOCX, XLSX or PPTX file.');
  }

  async function downloadOldDraft() {
    try {
      const { downloadPracticeDocument } = await import('../lib/exportWordDocument');
      const content = document.createElement('div');
      content.innerHTML = cleanDocument(draft);
      await downloadPracticeDocument(content, 'Academy Word draft');
    } catch { setMessage('Your previous draft could not be downloaded. Please try again.'); }
  }

  function downloadCopy() {
    if (status !== 'ready' || saving.current) return;
    try {
      saving.current = true;
      setStatus('saving');
      setMessage('Preparing download…');
      session.current.downloadAs(practice.ext);
      saveTimer.current = setTimeout(() => {
        saving.current = false;
        setStatus('ready');
        setMessage('The download has not finished. Your file is still open.');
      }, 60000);
    } catch {
      saving.current = false;
      setStatus('ready');
      setMessage('Download failed. Please try again.');
    }
  }

  return <main className="office-practice" aria-label="ONLYOFFICE practice space">
    <header>
      <a href="/" className="office-academy">Global Coding Academy</a>
      <select aria-label="Practice file" value={practice.id} disabled={status === 'saving'}
        onChange={event => changeFile(exercises.find(item => item.id === event.target.value))}>
        <optgroup label="New file">{exercises.slice(0, 3).map(item => <option key={item.id} value={item.id}>{item.title}</option>)}</optgroup>
        <optgroup label="Practice templates">{exercises.slice(3).map(item => <option key={item.id} value={item.id}>{item.title}</option>)}</optgroup>
        {practice.file && <option value="local">{practice.file.name}</option>}
      </select>
      <input type="file" accept=".docx,.xlsx,.pptx" hidden ref={fileInput} onChange={openLocal} />
      <button type="button" disabled={status === 'saving'} onClick={() => fileInput.current.click()}>Open file</button>
      <button type="button" disabled={status !== 'ready'} onClick={downloadCopy}>Download copy</button>
      {draft && <button type="button" onClick={downloadOldDraft}>Previous Word draft</button>}
      <span role="status">{status === 'opening' ? 'Opening ONLYOFFICE…' : message}</span>
      {status === 'error' && <button type="button" onClick={() => changeFile(practice)}>Retry</button>}
    </header>
    <section className="office-stage" aria-label="Office editor" ref={stage} />
  </main>;
}
