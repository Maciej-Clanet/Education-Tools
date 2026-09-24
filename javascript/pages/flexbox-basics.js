import { initLessonPage } from '../core/lesson-shell.js'
import { initLiveCodeExamples } from '../core/live-code-example.js?v=20260904-9'
import { initFlexExplorers } from '../core/flex-explorer.js'
import { flexboxExamples } from '../data/flexbox-examples.js'

const lessonConfig = {
  lessonId: 'flexbox-basics', defaultContext: 'web-development',
  contexts: { 'web-development': {
    label: 'Web Development', backHref: '../resources/web-development.html#css-basics', backLabel: 'Back to Web Development resources',
    previous: { title: 'CSS Display', href: 'css-display.html', description: 'Review block, inline and inline-block behaviour.', status: 'Live' },
    next: { title: 'Flexbox: Wrapping and Children', href: 'flexbox-wrapping-and-children.html', description: 'Explore wrapping, child sizing, the flex shorthand and align-self.', status: 'Live' },
  } },
  quiz: { storageKey: 'lesson-flexbox-basics-quiz', version: 1, totalQuestions: 10, passScore: 8 },
  examPractice: { storageKey: 'lesson-flexbox-basics-exam-practice' },
}

const liveExamples = [{
  id: 'flex-toolbar', title: 'Arrange the toolbar’s children', defaultSplit: 50,
  instructions: [{ type: 'ol', items: [
    'Select Try it. Change gap from 0 to 16px. Notice where the space appears.',
    'Change justify-content to center. Explain which way the group moves.',
    'Change align-items to center. Explain why the parent’s height matters.',
    'Predict the result, then change flex-direction to column. Name the new main and cross axes.',
  ] }],
  sources: [{ id: 'css', type: 'css', label: 'common.css', code: `.toolbar {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 0;
  height: 240px;
}` }, { id: 'html', type: 'html', label: 'index.html', code: `<div class="toolbar">
  <button type="button">Save</button>
  <button type="button">Edit</button>
  <button type="button">Share</button>
</div>` }],
  scaffold: { css: `body { margin: 12px; color: #163d49; font: 16px/1.5 sans-serif; }
.toolbar { border: 2px solid #496572; background: #f2f7f8; }
button { min-width: 56px; min-height: 44px; padding: 4px; border: 2px solid #216476; border-radius: 6px; background: #d8eff2; color: #163d49; font: inherit; }` },
}]

initLessonPage(lessonConfig)
initFlexExplorers(flexboxExamples)
initLiveCodeExamples(liveExamples)
