// Static-first examples. Enhance with initLessonWalkthroughs; every step is
// readable when JavaScript is unavailable. These renderers do not run a program.
const escape = value => String(value).replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[character]))

export function renderStructureWalkthrough(label, steps, renderStep) {
  return `<div class="structure-example" data-lesson-walkthrough data-no-slide-advance aria-label="${escape(label)}">
${steps.map((step, index) => `<div class="sx-step" data-walkthrough-step="${escape(step.title)}" data-example-step="${index + 1}">
<h3 class="sx-step-title"><span>${index + 1}</span> ${escape(step.title)}</h3>
${renderStep(step, index)}
<p class="sx-explanation">${step.explanation}</p>
</div>`).join('\n')}
<div data-walkthrough-controls hidden>
<p data-walkthrough-status role="status" aria-live="polite" aria-atomic="true"></p>
<div class="quiz-actions"><button type="button" class="lesson-secondary-action" data-walkthrough-prev>Previous</button><button type="button" class="primary-link" data-walkthrough-next>Next step</button><button type="button" class="lesson-secondary-action" data-walkthrough-reset>Restart</button></div>
</div></div>`
}

const editActions = [
  { id: 'title', label: 'Add the title', number: 1 },
  { id: 'line', label: 'Add the meeting line', number: 2 },
  { id: 'highlight', label: 'Highlight the time', number: 3 },
]

export const undoHistorySteps = [
  {
    title: 'Edit 1: add a title', line: false, highlight: false, history: ['title'],
    operation: 'PUSH edit 1', direction: 'push',
    explanation: 'The document gains a title. The undo history stores enough information to reverse that edit.',
  },
  {
    title: 'Edit 2: add a meeting line', line: true, highlight: false, history: ['title', 'line'],
    operation: 'PUSH edit 2', direction: 'push',
    explanation: 'The new edit goes on top. Edit 1 stays underneath it.',
  },
  {
    title: 'Edit 3: highlight the time', line: true, highlight: true, history: ['title', 'line', 'highlight'],
    operation: 'PUSH edit 3', direction: 'push',
    explanation: 'The latest action changes formatting. It is now the first action that Undo will reverse.',
  },
  {
    title: 'Undo: reverse the highlight', line: true, highlight: false, history: ['title', 'line'],
    operation: 'POP edit 3 → reverse it', direction: 'undo',
    explanation: 'Undo removes the highlight, leaving the text in place. Edit 2 is now on top.',
  },
  {
    title: 'Undo again: reverse the added line', line: false, highlight: false, history: ['title'],
    operation: 'POP edit 2 → reverse it', direction: 'undo',
    explanation: 'Undo reverses the next most recent edit. The original title remains: last in, first out.',
  },
]

function renderUndo(step) {
  const history = [...step.history].reverse().map((id, index) => {
    const action = editActions.find(item => item.id === id)
    return `<li class="sx-history-item ${index === 0 ? 'sx-top' : ''}"><span class="sx-item-number">${action.number}</span><span>${action.label}</span>${index === 0 ? '<b class="sx-tag">TOP</b>' : ''}</li>`
  }).join('')
  return `<div class="sx-undo-layout">
<article class="sx-document"><p class="sx-label">Document now</p><div class="sx-paper"><p class="sx-document-title">Museum visit</p>${step.line ? `<p class="sx-document-line">Meet at ${step.highlight ? '<mark>10:00</mark>' : '<span>10:00</span>'}.</p>` : '<p class="sx-document-empty" aria-hidden="true">&nbsp;</p>'}</div></article>
<div class="sx-transfer"><span class="sx-transfer-arrow" aria-hidden="true">${step.direction === 'push' ? '→' : '←'}</span><strong>${step.operation}</strong></div>
<article class="sx-history"><p class="sx-label">Undo history · stack</p><ol class="sx-stack" aria-label="Undo history, top first">${history}</ol><p class="sx-base-label">Earlier edits below</p></article>
</div>`
}

export const undoHistoryExample = renderStructureWalkthrough('A document and its undo history', undoHistorySteps, renderUndo)

const frames = {
  main: { name: 'main()', returnTo: 'Program entry' },
  checkLogin: { name: 'checkLogin()', returnTo: 'Return to main()' },
  verifyPassword: { name: 'verifyPassword()', returnTo: 'Return to checkLogin()' },
}

export const functionCallSteps = [
  {
    title: 'main() starts the login process', stack: ['main'], active: 'main', operation: 'RUN main()',
    activity: 'About to call checkLogin().', resume: 'The login check has not started yet.',
    explanation: 'A stack frame records information for one active function call. main() starts at the top.',
  },
  {
    title: 'main() calls checkLogin()', stack: ['main', 'checkLogin'], active: 'checkLogin', operation: 'CALL → PUSH a frame',
    activity: 'About to call verifyPassword().', resume: 'main() waits for checkLogin() to return.',
    explanation: 'The new call goes on top. Its frame remembers where to resume main() after this call.',
  },
  {
    title: 'checkLogin() calls verifyPassword()', stack: ['main', 'checkLogin', 'verifyPassword'], active: 'verifyPassword', operation: 'CALL → PUSH a frame',
    activity: 'Checks the supplied password.', resume: 'checkLogin() waits for this result.',
    explanation: 'verifyPassword() is running. The two earlier calls remain below it, waiting to continue.',
  },
  {
    title: 'verifyPassword() returns first', stack: ['main', 'checkLogin'], active: 'checkLogin', operation: 'RETURN → POP a frame',
    activity: 'Receives the password-check result.', resume: 'Resumes just after its call to verifyPassword().',
    explanation: 'The top frame is removed. Execution returns to checkLogin(), the function that made that call.',
  },
  {
    title: 'checkLogin() returns to main()', stack: ['main'], active: 'main', operation: 'RETURN → POP a frame',
    activity: 'Displays the login outcome.', resume: 'Resumes just after its call to checkLogin().',
    explanation: 'Calls return in reverse order. main() continues after the functions it called have finished.',
  },
]

function renderCalls(step) {
  return `<div class="sx-call-layout">
<article class="sx-running"><p class="sx-label">Running now</p><code class="sx-current-function">${frames[step.active].name}</code><p class="sx-current-activity">${step.activity}</p><p class="sx-resume">${step.resume}</p></article>
<article class="sx-call-stack"><p class="sx-label">Call stack</p><p class="sx-operation">${step.operation}</p><ol class="sx-stack" aria-label="Call stack, top first">${[...step.stack].reverse().map((id, index) => `<li class="sx-call-frame ${index === 0 ? 'sx-top' : ''}"><div><code>${frames[id].name}</code><b class="sx-tag">${index === 0 ? 'TOP · running' : 'waiting'}</b></div><span>${frames[id].returnTo}</span></li>`).join('')}</ol></article>
</div>`
}

export const functionCallsExample = renderStructureWalkthrough('Nested function calls and returns', functionCallSteps, renderCalls)

const scanFiles = { A: 'report.pdf', B: 'notes.txt', C: 'photo.jpg', D: 'archive.zip' }

export const fileScanningSteps = [
  {
    title: 'File A arrives', queued: ['A'], processing: null, completed: [], added: ['A'],
    explanation: 'A joins the waiting queue. It is both the front and rear because it is the only queued file.',
  },
  {
    title: 'B arrives, then C', queued: ['A', 'B', 'C'], processing: null, completed: [], added: ['B', 'C'],
    explanation: 'New files join the rear. A has waited longest, so it stays at the front.',
  },
  {
    title: 'The worker takes A', queued: ['B', 'C'], processing: 'A', completed: [], added: [],
    explanation: 'A leaves the front and starts scanning. A is now being processed; it is no longer waiting in the queue.',
  },
  {
    title: 'D joins while A is scanning', queued: ['B', 'C', 'D'], processing: 'A', completed: [], added: ['D'],
    explanation: 'D joins the rear behind C. Arrivals can continue while the one worker processes A.',
  },
  {
    title: 'A finishes; the worker takes B', queued: ['C', 'D'], processing: 'B', completed: ['A'], added: [],
    explanation: 'B was next at the front. It starts before C and D: first in, first out.',
  },
]

function fileCard(id, extra = '') {
  return `<span class="sx-file ${extra}"><b>${id}</b><span>${scanFiles[id]}</span></span>`
}

function renderScanning(step) {
  return `<div class="sx-scan-layout">
<article class="sx-worker"><p class="sx-label">One scanning worker</p>${step.processing ? `<p class="sx-worker-state">Scanning now</p>${fileCard(step.processing, 'sx-file-processing')}` : '<p class="sx-worker-state">Ready to start</p><div class="sx-worker-empty">No file yet</div>'}<p class="sx-completed">Completed: <strong>${step.completed.length ? step.completed.join(', ') : 'none'}</strong></p></article>
<div class="sx-queue-transfer" aria-hidden="true"><span>←</span></div>
<article class="sx-waiting"><p class="sx-label">Waiting queue</p><ol class="sx-file-queue" aria-label="Waiting files, front to rear">${step.queued.map((id, index) => `<li><span class="sx-queue-position">${step.queued.length === 1 ? 'FRONT + REAR' : index === 0 ? 'FRONT' : index === step.queued.length - 1 ? 'REAR' : '&nbsp;'}</span>${fileCard(id, step.added.includes(id) ? 'sx-file-new' : '')}${step.added.includes(id) ? '<span class="sx-arrival">just joined</span>' : '<span class="sx-arrival">waiting</span>'}</li>`).join('')}</ol><p class="sx-queue-count">${step.queued.length} waiting · ${step.processing ? '1' : '0'} being processed</p></article>
</div>`
}

export const fileScanningQueueExample = renderStructureWalkthrough('A FIFO file-scanning service with one worker', fileScanningSteps, renderScanning)

export const structureExampleNotes = {
  undo: 'This simple example treats each shown edit as one action. Real editors can group edits and store undo information in different ways.',
  calls: 'Debuggers show a stack trace to help locate a problem in the chain of calls.',
  queue: 'One worker is shown. With several workers, FIFO controls the order taken, but files may finish out of order.',
}
