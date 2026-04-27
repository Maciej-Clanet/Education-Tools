import { initLessonPage } from "../core/lesson-shell.js"

const lessonConfig = {
  lessonId: "resolution-bit-depth-and-image-compression",
  defaultContext: "btec-level-3-unit-2",
  contexts: {
    "btec-level-3-unit-2": {
      label: "BTEC Level 3 Computing Unit 2",
      backHref: "../units/btec-level-3-unit-2.html#section-c",
      backLabel: "Back to Unit 2 content",
      previous: {
        title: "Bitmap image storage",
        description: "Previous in C3 Image representation.",
        status: "Live",
        href: "../topics/bitmap-image-storage.html",
      },
      next: {
        title: "Stacks and queues",
        description: "Next in D1 Data structures.",
        status: "Live",
        href: "../topics/stacks-and-queues.html",
      },
    },
  },
  quiz: {
    storageKey: "lesson-resolution-bit-depth-and-image-compression-quiz",
    passScore: 4,
  },
  examPractice: {
    storageKey: "lesson-resolution-bit-depth-and-image-compression-exam-practice",
  },
}

initLessonPage(lessonConfig)
