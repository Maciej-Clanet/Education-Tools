import { initLessonPage } from "../core/lesson-shell.js"

const lessonConfig = {
  lessonId: "character-sets-ascii-and-unicode",
  defaultContext: "btec-level-3-unit-2",
  contexts: {
    "btec-level-3-unit-2": {
      label: "BTEC Level 3 Computing Unit 2",
      backHref: "../units/btec-level-3-unit-2.html#section-c",
      backLabel: "Back to Unit 2 content",
      previous: {
        title: "Negative and floating point representation",
        description: "Previous in C1 Number systems.",
        status: "Live",
        href: "../topics/negative-and-floating-point-representation.html",
      },
      next: {
        title: "Bitmap image storage",
        description: "Next in C3 Image representation.",
        status: "Live",
        href: "../topics/bitmap-image-storage.html",
      },
    },
  },
  quiz: {
    storageKey: "lesson-character-sets-ascii-and-unicode-quiz",
    passScore: 4,
  },
  examPractice: {
    storageKey: "lesson-character-sets-ascii-and-unicode-exam-practice",
  },
}

initLessonPage(lessonConfig)
