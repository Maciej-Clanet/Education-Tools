import { initLessonPage } from '../core/lesson-shell.js'
import { initLessonWalkthroughs } from '../core/lesson-walkthrough.js'
import { initStructureExplorers } from '../core/structure-explorer.js'

const lessonConfig = {
  lessonId: 'stacks-and-queues',
  defaultContext: 'btec-level-3-unit-2',
  contexts: {
    'btec-level-3-unit-2': {
      label: 'BTEC Level 3 Computing Unit 2',
      backHref: '../units/btec-level-3-unit-2.html#section-d',
      backLabel: 'Back to Unit 2 content',
      previous: {
        title: 'Resolution, bit depth, and image compression',
        description: 'Previous in C3 Image representation.',
        status: 'Live',
        href: '../topics/resolution-bit-depth-and-image-compression.html',
      },
      next: {
        title: 'Arrays, lists, and data types',
        description: 'Next in D1 Data structures.',
        status: 'Live',
        href: '../topics/arrays-lists-and-data-types.html',
      },
    },
  },
  quiz: { storageKey: 'lesson-stacks-and-queues-quiz-v2', passScore: 8, version: 2 },
  examPractice: { storageKey: 'stacks-and-queues-exam-practice' },
}

initLessonPage(lessonConfig)
initLessonWalkthroughs()
initStructureExplorers()

// Keep all examples readable without JavaScript; selection is temporary.
document.querySelectorAll('[data-software-features]').forEach(host => {
  const choices = [...host.querySelectorAll('[data-feature-choice]')]
  const panels = [...host.querySelectorAll('[data-feature-panel]')]
  function select(id, announce = true) {
    choices.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.featureChoice === id)))
    panels.forEach(panel => { panel.hidden = panel.dataset.featurePanel !== id })
    host.dataset.selectedFeature = id
    if (announce) host.querySelector('[data-feature-status]').textContent = `${panels.find(panel => panel.dataset.featurePanel === id).querySelector('h3').textContent} example shown.`
  }
  choices.forEach(button => button.addEventListener('click', () => select(button.dataset.featureChoice)))
  select(choices[0].dataset.featureChoice, false)
  host.querySelector('[data-feature-controls]').hidden = false
})
