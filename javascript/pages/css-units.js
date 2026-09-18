import { initLessonPage } from '../core/lesson-shell.js'
import { initLiveCodeExamples } from '../core/live-code-example.js?v=20260904-9'
import { initDebugLabs } from '../core/debug-lab.js'
import { initPairedScenarios } from '../core/paired-scenarios.js'
import { initUnitReferenceVisuals } from '../core/css-unit-references.js'
import { unitScenarios, unitScenarioConfigs } from '../data/css-unit-scenarios.js'

const lessonConfig = {
  lessonId: 'css-units', defaultContext: 'web-development',
  contexts: { 'web-development': {
    label: 'Web Development', backHref: '../resources/web-development.html#css-basics', backLabel: 'Back to Web Development resources',
    previous: { title: 'Colours, backgrounds, and borders', href: 'colours-backgrounds-and-borders.html', description: 'Use colours and borders to style visible elements.', status: 'Live' },
    next: { title: 'CSS Sizing', href: 'css-sizing.html', description: 'Use width, height and minimum/maximum sizes to control elements.', status: 'Live' },
  } },
  quiz: { storageKey: 'lesson-css-units-quiz', version: 1, totalQuestions: 10, passScore: 8 },
  examPractice: { storageKey: 'lesson-css-units-exam-practice' },
}

const liveExamples = [{
  id: 'units-width-experiment', title: 'Same page, different width references',
  instructions: [{ type: 'ol', items: [
    'Predict which boxes change if the container becomes narrower.',
    'In common.css, change .box-b from 50% to 80%. Then change the container width from 70% to 45%.',
    'Use the code/preview divider on a wide screen to resize the preview. Compare the fixed 200px box with the two relative widths.',
  ] }],
  defaultSplit: 45,
  sources: [{ id: 'html', type: 'html', label: 'index.html', code: `<div class="container">
  <p>Parent container</p>
  <div class="box box-a">A: 200px</div>
  <div class="box box-b">B: percentage width</div>
  <div class="box box-c">C: viewport width</div>
</div>` }, { id: 'css', type: 'css', label: 'common.css', code: `.container {
  width: 70%;
}
.box-a {
  width: 200px;
}
.box-b {
  width: 50%;
}
.box-c {
  width: 50vw;
}` }],
  scaffold: { css: `body { margin: 12px; font-family: sans-serif; }
.container { outline: 3px dashed #576779; background: #edf1f5; }
.box { min-height: 48px; margin: 12px 0; background: #145f68; color: white; font-size: 14px; }
.box-b { background: #705412; }
.box-c { background: #455b94; }` },
}]

const debugTasks = [{
  id: 'units-parent-width', mode: 'find-and-fix', title: 'The panel follows the wrong reference',
  goal: 'Make the panel half the width of its containing block, not half the viewport.',
  files: [{ name: 'common.css', language: 'CSS', lines: ['.panel {', ['  width: ', { text: '50vw', regionId: 'width-reference', label: 'width value and unit' }, ';'], '}'] }],
  issues: [{ id: 'parent-reference', regionId: 'width-reference', correctRepairId: 'percent', foundFeedback: 'The width value chooses the reference.', repairFeedback: 'The width now responds to the containing block.', hints: ['Which unit responds to the containing block when used for width?'] }],
  repairOptions: [{ id: 'percent', label: '50%', replacement: '50%' }, { id: 'pixels', label: '50px', replacement: '50px' }, { id: 'height', label: '50vh', replacement: '50vh' }],
  preview: { broken: { title: 'Reference', description: '800px viewport → panel width 400px; containing block is only 400px wide.' }, fixed: { title: 'Reference', description: '400px containing block → panel width 200px. It occupies half its containing block.' } },
  explanation: 'For this width, 50% uses the containing block. 50vw uses half the viewport width.',
}, {
  id: 'units-missing-unit', mode: 'find-and-fix', title: 'A length declaration is ignored', goal: 'Give the badge a predictable width of 50 CSS pixels.',
  files: [{ name: 'common.css', language: 'CSS', lines: ['.badge {', ['  width: ', { text: '50', regionId: 'missing-unit', label: 'unitless width value' }, ';'], '}'] }],
  issues: [{ id: 'length-unit', regionId: 'missing-unit', correctRepairId: 'px', foundFeedback: 'This non-zero length needs a unit.', repairFeedback: 'The length now has the requested CSS pixel unit.', hints: ['The requested reference is CSS pixels.'] }],
  repairOptions: [{ id: 'px', label: '50px', replacement: '50px' }, { id: 'quoted', label: '"50px"', replacement: '"50px"' }, { id: 'percent', label: '50%', replacement: '50%' }],
  explanation: 'width: 50px is a valid length. Bare width: 50 is invalid; zero is a special case that can omit a length unit.',
}]

// The existing paired-scenario component handles feedback, checking and reset.
function mountUnitScenarios() {
  const reasons = { pixel: 'A CSS pixel length', container: 'The containing block width', root: 'The root font size', local: 'The element’s own text size', height: 'The viewport height', width: 'The viewport width' }
  document.querySelectorAll('[data-paired-scenario]').forEach(card => {
    const scenario = unitScenarios[card.dataset.pairedScenario]
    card.querySelector('[data-scenario-prompt]').textContent = scenario.prompt
    for (const [selector, options] of [['type', Object.fromEntries(['px', '%', 'rem', 'em', 'vw', 'vh'].map(unit => [unit, unit]))], ['reason', reasons]]) {
      const select = card.querySelector(`[data-choice="${selector}"]`)
      for (const [value, label] of Object.entries(options)) select.add(new Option(label, value))
    }
  })
}

initLessonPage(lessonConfig)
initUnitReferenceVisuals()
mountUnitScenarios()
initPairedScenarios(unitScenarioConfigs)
initLiveCodeExamples(liveExamples)
initDebugLabs(debugTasks, { storageKey: 'lesson-css-units-debug-labs', version: 1 })
