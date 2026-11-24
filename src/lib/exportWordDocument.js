import { Document, HeadingLevel, Packer, Paragraph, Table, TableCell, TableRow, TextRun, WidthType } from 'docx';

function asHex(value) {
  if (!value) return undefined;
  const match = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/.exec(value);
  if (match) return match.slice(1).map(n => Number(n).toString(16).padStart(2,'0')).join('');
  return /^#[0-9a-f]{6}$/i.test(value) ? value.slice(1) : undefined;
}

function inlineRuns(node, format = {}) {
  if (node.nodeType === Node.TEXT_NODE) return [new TextRun({...format, text: node.textContent})];
  if (node.nodeName === 'BR') return [new TextRun({...format, break: 1})];
  const next = {...format};
  if (['B','STRONG'].includes(node.nodeName) || node.style?.fontWeight === 'bold') next.bold = true;
  if (['EM','I'].includes(node.nodeName) || node.style?.fontStyle === 'italic') next.italics = true;
  if (node.nodeName === 'U') next.underline = {};
  const colour = asHex(node.style?.color);
  if (colour) next.color = colour;
  return [...node.childNodes].flatMap(child => inlineRuns(child, next));
}

function convertBlock(node) {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent.trim() ? [new Paragraph({children:inlineRuns(node)})] : [];
  if (node.nodeName === 'TABLE') {
    const rows = [...node.rows].map(row => new TableRow({children:[...row.cells].map(cell =>
      new TableCell({children:[new Paragraph({children:inlineRuns(cell, {bold:cell.tagName === 'TH'})})]})
    )}));
    return [new Table({rows, width:{size:100,type:WidthType.PERCENTAGE}})];
  }
  if (node.nodeName === 'UL' || node.nodeName === 'OL') {
    return [...node.children].map((item,i) => new Paragraph(node.nodeName === 'UL'
      ? {bullet:{level:0},children:inlineRuns(item)}
      : {children:[new TextRun((i+1)+'. '),...inlineRuns(item)]}));
  }
  if (node.nodeName === 'DIV' && node.querySelector('h1,h2,h3,p,ul,ol,table,div')) {
    return [...node.childNodes].flatMap(convertBlock);
  }
  const headings = {H1:HeadingLevel.TITLE,H2:HeadingLevel.HEADING_2,H3:HeadingLevel.HEADING_3};
  return [new Paragraph({heading:headings[node.nodeName],children:inlineRuns(node)})];
}

export async function downloadPracticeDocument(editor, name) {
  const children = [...editor.childNodes].flatMap(convertBlock);
  const doc = new Document({creator:'Global Coding Academy',title:name,sections:[{children}]});
  const url = URL.createObjectURL(await Packer.toBlob(doc));
  const anchor = document.createElement('a');
  anchor.href = url;
  const base = [...name.trim().replace(/\.docx$/i,'')].map(char =>
    char.charCodeAt(0)<32 || '<>:"/\\|?*'.includes(char) ? '-' : char
  ).join('');
  anchor.download = (base || 'Word practice') + '.docx';
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 30000);
}
