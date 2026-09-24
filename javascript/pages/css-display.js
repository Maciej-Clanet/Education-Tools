import { initLessonPage } from '../core/lesson-shell.js'
import { initLiveCodeExamples } from '../core/live-code-example.js?v=20260904-9'
import { initDebugLabs } from '../core/debug-lab.js'
import { initPairedScenarios } from '../core/paired-scenarios.js'
import { initDisplayExplorers } from '../core/display-explorer.js'
import { displayChoices, displayReasons, displayScenarioConfigs } from '../data/css-display-scenarios.js'

const lessonConfig = {
  lessonId: 'css-display', defaultContext: 'web-development',
  contexts: { 'web-development': {
    label: 'Web Development', backHref: '../resources/web-development.html#css-basics', backLabel: 'Back to Web Development resources',
    previous: { title: 'CSS Sizing', href: 'css-sizing.html', description: 'Explore sizes, parent references and min/max limits.', status: 'Live' },
    next: { title: 'Flexbox Basics', href: 'flexbox-basics.html', description: 'Arrange a parent’s children using direction, alignment and gap.', status: 'Live' },
  } },
  quiz: { storageKey: 'lesson-css-display-quiz', version: 1, totalQuestions: 10, passScore: 8 },
  examPractice: { storageKey: 'lesson-css-display-exam-practice' },
}
const liveExamples = [{
  id: 'display-navigation', title: 'Same HTML, different flow', defaultSplit: 45,
  instructions: [{ type: 'ol', items: [
    'Predict how the three cards will arrange with block, then change display to inline in common.css. Does width: 120px still size them?',
    'Change to inline-block. Try width: 150px and height: 80px. Resize the preview with its divider and observe wrapping.',
    'Change .menu-link to inline-block and give it width: 120px. The HTML links keep their meaning while their layout changes.',
  ] }],
  sources: [{ id: 'css', type: 'css', label: 'common.css', code: `.card {
  display: block;
  width: 120px;
  height: 60px;
}
.menu-link {
  display: inline;
}` }, { id: 'html', type: 'html', label: 'index.html', code: `<nav class="navigation">
  <a class="menu-link" href="index.html">Home</a>
  <a class="menu-link" href="products.html">Products</a>
  <a class="menu-link" href="contact.html">Contact</a>
</nav>
<div class="cards">
  <div class="card">One</div>
  <div class="card">Two</div>
  <div class="card">Three</div>
</div>` }],
  scaffold: { css: `body { margin: 16px; font: 18px/1.6 sans-serif; color: #163f3c; }
.cards { outline: 2px dashed #384d4a; margin-top: 24px; }
.card { background: #dceeea; outline: 2px solid #216e70; outline-offset: -2px; }
.menu-link { color: #14556c; text-decoration: underline; background: #f6ecce; }` },
}]
const debugTasks = [{
  id: 'display-link-width', mode: 'find-and-fix', title: 'Sized navigation links, on the same line',
  goal: 'Make each text link 150px wide and able to sit beside the others when space allows.',
  files: [{ name: 'common.css', language: 'CSS', lines: ['.menu-link {', ['  display: ', { text: 'inline', regionId: 'display-value', label: 'display value' }, ';'], '  width: 150px;', '}'] }],
  issues: [{ id: 'sized-inline', regionId: 'display-value', correctRepairId: 'inline-block', foundFeedback: 'The display value controls whether this text link accepts width.', repairFeedback: 'Each link can now use its width and join a line beside other links.', hints: ['Which behaviour combines joining a line with block-like sizing?'] }],
  repairOptions: [{ id: 'inline-block', label: 'inline-block', replacement: 'inline-block' }, { id: 'block', label: 'block', replacement: 'block' }, { id: 'none', label: 'none', replacement: 'none' }],
  preview: {
    broken: { title: 'Before: inline text links', html: '<div class="dd-preview"><a class="dd-item dd-inline dd-debug-inline" href="#debugging">Home</a> <a class="dd-item dd-inline dd-debug-inline" href="#debugging">Products</a> <a class="dd-item dd-inline dd-debug-inline" href="#debugging">Contact</a></div>' },
    fixed: { title: 'After: inline-block links, each 150px wide', html: '<div class="dd-preview dd-debug-links"><a href="#debugging">Home</a> <a href="#debugging">Products</a> <a href="#debugging">Contact</a></div>' },
  },
  explanation: 'Normal inline text links do not use width like block boxes. Inline-block preserves inline participation and enables the requested width.',
}]

initLessonPage(lessonConfig)
initDisplayExplorers()
document.querySelectorAll('[data-paired-scenario]').forEach(card => {
  for (const [type, choices] of [['type', displayChoices], ['reason', displayReasons]]) {
    for (const [value, label] of Object.entries(choices)) card.querySelector(`[data-choice="${type}"]`).add(new Option(label, value))
  }
})
initPairedScenarios(displayScenarioConfigs)
initLiveCodeExamples(liveExamples)
initDebugLabs(debugTasks, { storageKey: 'lesson-css-display-debug-labs', version: 1 })
