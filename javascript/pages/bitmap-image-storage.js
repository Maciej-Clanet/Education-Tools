import { initLessonPage } from "../core/lesson-shell.js"
import { initLessonWalkthroughs } from "../core/lesson-walkthrough.js"
import { initPairedScenarios } from "../core/paired-scenarios.js"
import { initBitDepthGradients } from "../core/bit-depth-gradient.js"
import { initBitmapExplorers } from "../core/bitmap-explorer.js"
import { bitmapScenarios } from "../data/bitmap-image-model.js"

const lessonConfig = {
  lessonId: "bitmap-image-storage",
  defaultContext: "btec-level-3-unit-2",
  contexts: {
    "btec-level-3-unit-2": {
      label: "BTEC Level 3 Computing Unit 2",
      backHref: "../units/btec-level-3-unit-2.html#section-c",
      backLabel: "Back to Unit 2 content",
      previous: {
        title: "Character sets, ASCII, and Unicode",
        description: "Previous in C2 Text representation.",
        status: "Live",
        href: "../topics/character-sets-ascii-and-unicode.html",
      },
      next: {
        title: "Resolution, bit depth, and image compression",
        description: "Next in C3 Image representation.",
        status: "Live",
        href: "../topics/resolution-bit-depth-and-image-compression.html",
      },
    },
  },
  quiz: {
    storageKey: "lesson-bitmap-image-storage-quiz-v4",
    passScore: 8,
    version: 4,
  },
  examPractice: {
    storageKey: "lesson-bitmap-image-storage-exam-practice",
  },
}

initLessonPage(lessonConfig)
initLessonWalkthroughs()
initPairedScenarios(bitmapScenarios)
initBitmapExplorers()
initBitDepthGradients()
