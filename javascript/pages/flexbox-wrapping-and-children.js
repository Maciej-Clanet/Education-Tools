import { initLessonPage } from '../core/lesson-shell.js'
import { initFlexExplorers } from '../core/flex-explorer.js'
import { flexboxChildExamples } from '../data/flexbox-child-examples.js'
import { initLiveCodeExamples } from '../core/live-code-example.js?v=20260904-9'

const lessonConfig = {
  lessonId: 'flexbox-wrapping-and-children', defaultContext: 'web-development',
  contexts: { 'web-development': {
    label: 'Web Development', backHref: '../resources/web-development.html#css-basics', backLabel: 'Back to Web Development resources',
    previous: { title: 'Flexbox Basics', href: 'flexbox-basics.html', description: 'Review direction, the two axes, alignment and gap.', status: 'Live' },
    next: { title: 'More CSS lessons', description: 'Continue exploring CSS as new lessons become available.', status: 'Planned' },
  } },
  quiz: { storageKey: 'lesson-flexbox-wrapping-and-children-quiz', version: 1, totalQuestions: 12, passScore: 10 },
  examPractice: { storageKey: 'lesson-flexbox-wrapping-and-children-exam-practice' },
}

const examples = [{
  id: 'flex-cards', title: 'Let cards wrap, grow and arrange their own contents', defaultSplit: 50,
  instructions: [{ type: 'ol', items: [
    'Select Try it. Change the parent’s flex-wrap from nowrap to wrap. Use the preview divider to make the available space narrower.',
    'Change the cards from flex: none to flex: auto. Watch each line use its spare space.',
    'The featured card’s A and B blocks still stack. Add display: flex inside .featured to give those two children their own row.',
    'Add gap: 8px inside .featured. Explain why the gap on .cards does not create that inner gap.',
  ] }],
  sources: [{ id: 'css', type: 'css', label: 'common.css', code: `.cards {
  display: flex;
  flex-wrap: nowrap;
  gap: 12px;
}
.card {
  width: 140px;
  min-width: 110px;
  flex: none;
}
.featured {
  /* Arrange A and B here. */
}` }, { id: 'html', type: 'html', label: 'index.html', code: `<div class="cards">
  <div class="card">Card 1</div>
  <div class="card featured">
    <div>A</div>
    <div>B</div>
  </div>
  <div class="card">Card 3</div>
  <div class="card">Card 4</div>
</div>` }],
  scaffold: { css: `body { margin: 12px; font: 16px/1.5 sans-serif; color: #163d49; }
.cards { border: 2px solid #496572; background: #f2f7f8; }
.card { box-sizing: border-box; padding: 10px; border: 2px solid #216476; background: #d8eff2; }
.featured { background: #f9ebbc; border-color: #88601a; }
.featured > div { padding: 4px; border: 1px dashed currentColor; }` },
}]

initLessonPage(lessonConfig)
initFlexExplorers(flexboxChildExamples)
initLiveCodeExamples(examples)
