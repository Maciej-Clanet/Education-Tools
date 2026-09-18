import { initLessonPage } from '../core/lesson-shell.js'
import { initLiveCodeExamples } from '../core/live-code-example.js?v=20260904-9'
import { initDebugLabs } from '../core/debug-lab.js'
import { initPairedScenarios } from '../core/paired-scenarios.js'
import { initSizeExplorers } from '../core/size-explorer.js'
import { sizingRules, sizingReasons, sizingScenarioConfigs } from '../data/css-sizing-scenarios.js'

const lessonConfig = {
  lessonId: 'css-sizing', defaultContext: 'web-development',
  contexts: { 'web-development': {
    label: 'Web Development', backHref: '../resources/web-development.html#css-basics', backLabel: 'Back to Web Development resources',
    previous: { title: 'CSS Units', href: 'css-units.html', description: 'Choose units by the reference they follow.', status: 'Live' },
    next: { title: 'More CSS lessons', description: 'Continue exploring CSS as new lessons become available.', status: 'Planned' },
  } },
  quiz: { storageKey: 'lesson-css-sizing-quiz', version: 1, totalQuestions: 10, passScore: 8 },
  examPractice: { storageKey: 'lesson-css-sizing-exam-practice' },
}

// Locked illustration, embedded as a data URL because the shared preview blocks network images.
const backpack = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 160"><rect width="420" height="160" fill="#e6efea"/><path d="M190 35V23Q210 8 230 23V35" fill="none" stroke="#254c48" stroke-width="8"/><rect x="157" y="29" width="106" height="112" rx="24" fill="#216e70"/><rect x="171" y="75" width="78" height="51" rx="10" fill="#e6b84c"/><path d="M182 87H238M172 48H248" stroke="#254c48" stroke-width="4"/></svg>`
const liveExamples = [{
  id: 'sizing-product', title: 'A product illustration that escapes its card', defaultSplit: 45,
  instructions: [{ type: 'ol', items: [
    'Compare the 450px child with its 300px parent. Why does it overflow?',
    'In common.css, change the product-image width to 100%. Change the parent width to 250px, then 400px.',
    'Make the product-card flexible: use width: 90% and max-width: 400px. Resize the preview with its divider to see the limit.',
  ] }],
  sources: [{ id: 'css', type: 'css', label: 'common.css', code: `.product-card {
  width: 300px;
}
.product-image {
  width: 450px;
}` }, { id: 'html', type: 'html', label: 'index.html', code: `<div class="product-card">
  <div class="product-image" role="img"
       aria-label="A teal hiking backpack"></div>
  <h2>Trail backpack</h2>
  <p>A small pack for a day outdoors.</p>
  <p>£19.99</p>
</div>` }],
  scaffold: { css: `body { margin: 16px; font-family: sans-serif; color: #233c38; }
.product-card { outline: 3px dashed #576779; background: #fffaf0; }
.product-image { height: 150px; background: #e6efea url("data:image/svg+xml,${encodeURIComponent(backpack)}") center / contain no-repeat; }
h2 { font-size: 22px; } p { font-size: 16px; }` },
}]
const debugTasks = [{
  id: 'sizing-ceiling', mode: 'find-and-fix', title: 'The article stays too wide',
  goal: 'Let the article shrink to 90% of its parent, while keeping an 800px upper limit.',
  files: [{ name: 'common.css', language: 'CSS', lines: ['.article {', '  width: 90%;', ['  ', { text: 'min-width', regionId: 'wrong-boundary', label: 'minimum width property' }, ': 800px;'], '}'] }],
  issues: [{ id: 'ceiling', regionId: 'wrong-boundary', correctRepairId: 'max', foundFeedback: 'This property sets a floor instead of a ceiling.', repairFeedback: 'The article can now shrink, and stops growing at 800px.', hints: ['Does this intention need a lower or upper limit?'] }],
  repairOptions: [{ id: 'max', label: 'max-width', replacement: 'max-width' }, { id: 'height', label: 'max-height', replacement: 'max-height' }, { id: 'width', label: 'width', replacement: 'width' }],
  preview: { broken: { title: '400px parent', description: '90% requests 360px, but the 800px minimum causes 400px overflow.' }, fixed: { title: '400px parent', description: '360px is below the 800px maximum, so the article fits.' } },
  explanation: 'max-width is the ceiling; min-width is the floor. They serve different intentions.',
}]

initLessonPage(lessonConfig)
initSizeExplorers()
document.querySelectorAll('[data-paired-scenario]').forEach(card => {
  for (const [type, options] of [['type', sizingRules], ['reason', sizingReasons]]) {
    const select = card.querySelector(`[data-choice="${type}"]`)
    for (const [value, text] of Object.entries(options)) select.add(new Option(text, value))
  }
})
initPairedScenarios(sizingScenarioConfigs)
initLiveCodeExamples(liveExamples)
initDebugLabs(debugTasks, { storageKey: 'lesson-css-sizing-debug-labs', version: 1 })
