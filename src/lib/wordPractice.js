export const wordChapterId = '574e24e4-d916-4e10-8efd-5cdbd20b6c4e';

export const wordActivities = [
  {
    title: 'What is Microsoft Word?',
    goal: 'A word processor lets you write, edit and format documents. Try all three with a short meeting note.',
    steps: ['In the document, type “We meet in Room B.”', 'Replace the B with C. Select the words “Room C” and choose Bold.', 'Name the document First Word Note and choose Save.'],
  },
  {
    title: 'Find the parts of the Word window',
    goal: 'Find the document name at the top, the formatting tools in the toolbar, the insertion point on the page, and the word count below.',
    steps: ['Place the insertion point after your sentence and type “ Bring a pen.”', 'Choose Undo to restore the sentence you started with.', 'Change the zoom to 110% and find the word count. Zoom changes the view while the words stay the same.'],
  },
  {
    title: 'Start a document from a Word template',
    goal: 'A template gives you a reusable layout. This is your own editable copy of the club meeting notice, with its original sections and agenda table.',
    steps: ['Name this document Digital Skills Club Notice.', 'Replace [Day and time] with Friday at 14:00 and [Meeting place] with Room B.', 'Choose Save. The next lessons use this same notice.'],
  },
  {
    title: 'Type, select and correct text',
    goal: 'Click to place the insertion point. Drag over words to select them. Typing replaces your selection.',
    steps: ['Change “Club meeting notice” on the page to “Digital Skills Club meeting”.', 'Replace [Write an invitation.] with “Join us to practise editing and saving a file.”', 'Change Room B to Room C and save.'],
  },
  {
    title: 'Format titles and paragraphs',
    goal: 'A paragraph style formats a whole paragraph. Bold and font colour apply to selected words.',
    steps: ['Click in the “What to bring” paragraph and choose Heading 2 from Paragraph style.', 'Select only 14:00 in Meeting details and choose Bold.', 'Select the meeting title on the page and choose Dark blue from Font colour.'],
  },
  {
    title: 'Build a bulleted supply list',
    goal: 'Each list item begins as a separate paragraph. A bulleted list groups items without numbering them.',
    steps: ['Replace [First item] with Notebook and [Second item] with Pen.', 'Select both paragraphs and choose Bullets.', 'At the end of Pen press Enter, type Folder, and save.'],
  },
  {
    title: 'Fill in and extend an agenda table',
    goal: 'A cell belongs to one row and one column. Use the left column for times and the right column for activities.',
    steps: ['Replace the first row of placeholders with 14:00 and Welcome.', 'In the next row, enter 14:10 and Word practice. Tab moves between cells.', 'Use Add row to add 14:25 and Questions. Save your notice.'],
  },
  {
    title: 'Check the page and export a PDF',
    goal: 'Keep an editable Word copy for future changes and use a PDF for a fixed reading or printing layout.',
    steps: ['Check for Room C, three bulleted supplies, and the final agenda item at 14:25. Replace all remaining bracketed placeholders.', 'Choose Save, then Download .docx to export your edited notice.', 'Choose Print / PDF. In print preview check the page and choose the PDF destination to save a PDF.'],
  },
];

export function wordPracticeNumber(block) {
  if (block?.type !== 'code' || typeof block.code !== 'string') return null;
  const firstLine = block.code.split('\n', 1)[0];
  const match = /^# Word practice ([1-8])$/.exec(firstLine);
  return match ? Number(match[1]) : null;
}

export function practiceUrl(number, embedded = false) {
  return '/word-practice?lesson=' + number + (embedded ? '&embedded=1' : '');
}
