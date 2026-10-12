import { initLessonPage } from '../core/lesson-shell.js'
import { initLessonWalkthroughs } from '../core/lesson-walkthrough.js'
import { initPairedScenarios } from '../core/paired-scenarios.js'
import { initImageQualityTools } from '../core/image-quality-tools.js'
import { imageQualityScenarios } from '../data/image-quality-model.js'
import { imageCompressionAssets } from '../data/image-compression-assets.js'

const lessonConfig = {
  lessonId: 'resolution-bit-depth-and-image-compression',
  defaultContext: 'btec-level-3-unit-2',
  contexts: {
    'btec-level-3-unit-2': {
      label: 'BTEC Level 3 Computing Unit 2',
      backHref: '../units/btec-level-3-unit-2.html#section-c',
      backLabel: 'Back to Unit 2 content',
      previous: { title: 'Image storage: bitmap and vector images', description: 'Previous in C3 Image representation.', status: 'Live', href: '../topics/bitmap-image-storage.html' },
      next: { title: 'Stacks and queues', description: 'Next in D1 Data structures.', status: 'Live', href: '../topics/stacks-and-queues.html' },
    },
  },
  quiz: { storageKey: 'lesson-resolution-bit-depth-and-image-compression-quiz-v3', passScore: 9, version: 3 },
  examPractice: { storageKey: 'lesson-resolution-bit-depth-and-image-compression-exam-practice' },
}

initLessonPage(lessonConfig)
initLessonWalkthroughs()
initPairedScenarios(imageQualityScenarios)
initImageQualityTools(imageCompressionAssets)
