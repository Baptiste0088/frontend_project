const allowedTags = new Set('P DIV BR H1 H2 H3 B STRONG I EM U UL OL LI TABLE THEAD TBODY TR TH TD SPAN FONT'.split(' '));
const forbiddenTags = new Set(['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'TEMPLATE', 'SVG', 'MATH', 'FORM']);
const colourPattern = /^(?:#[0-9a-f]{3,8}|rgba?\([\d\s.,%]+\))$/i;

export function cleanDocument(html) {
  const source = new DOMParser().parseFromString(html, 'text/html');
  const output = document.createElement('div');
  function copy(node, parent) {
    if (node.nodeType === Node.TEXT_NODE) {
      parent.append(document.createTextNode(node.textContent));
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE || forbiddenTags.has(node.tagName)) return;
    let target = parent;
    if (allowedTags.has(node.tagName)) {
      target = document.createElement(node.tagName === 'FONT' ? 'span' : node.tagName.toLowerCase());
      const colour = node.style.color || node.getAttribute('color') || '';
      if (colourPattern.test(colour)) target.style.color = colour;
      if (['bold','700'].includes(node.style.fontWeight)) target.style.fontWeight = 'bold';
      if (node.style.fontStyle === 'italic') target.style.fontStyle = 'italic';
      if (node.tagName === 'P' && node.className === 'category') target.className = 'category';
      parent.append(target);
    }
    for (const child of node.childNodes) copy(child, target);
  }
  for (const child of source.body.childNodes) copy(child, output);
  return output.innerHTML || '<p><br></p>';
}

export function learnerDraftKey(isNote) {
  function readAccount(key) {
    try { return JSON.parse(localStorage.getItem(key) || '{}') || {}; }
    catch { return {}; }
  }
  const user = readAccount('gcaUser');
  const enrolled = readAccount('gcaEnrollment');
  const owner = user.id || enrolled.user_id || enrolled.id || user.username || enrolled.student_id_number || 'guest';
  return 'gca:word-practice:v1:' + encodeURIComponent(owner) + ':' + (isNote ? 'first-note' : 'club-notice');
}

export function readDraft(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    if (typeof value?.html === 'string' && value.html.length < 250000 && typeof value.name === 'string') {
      return {html: cleanDocument(value.html), name: value.name.slice(0, 100)};
    }
  } catch { /* Private browsing can disable storage. */ }
  return fallback;
}

export function addAgendaRow(editor, currentCell) {
  const table = currentCell?.closest('table') || editor.querySelector('table');
  if (!table || !editor.contains(table)) return false;
  const row = table.insertRow();
  const count = table.rows[0].cells.length || 2;
  for (let i = 0; i < count; i++) row.insertCell().append(document.createElement('br'));
  placeCursor(row.cells[0]);
  return true;
}

export function placeCursor(element) {
  const range = document.createRange();
  range.selectNodeContents(element);
  range.collapse(true);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
}
