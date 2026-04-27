import { initLessonPage } from "../core/lesson-shell.js"

const lessonConfig = {
  lessonId: "input-output-and-storage-devices",
  defaultContext: "btec-level-3-unit-2",
  contexts: {
    "btec-level-3-unit-2": {
      label: "BTEC Level 3 Computing Unit 2",
      backHref: "../units/btec-level-3-unit-2.html#section-a",
      backLabel: "Back to Unit 2 content",
      previous: {
        title: "Computer system types and internal components",
        description: "Previous in A1 Computer hardware in a computer system.",
        status: "Live",
        href: "../topics/computer-system-types-and-internal-components.html",
      },
      next: {
        title: "Hardware performance and component choice",
        description: "Next in A1 Computer hardware in a computer system.",
        status: "Live",
        href: "../topics/hardware-performance-and-component-choice.html",
      },
    },
  },
  quiz: {
    storageKey: "lesson-input-output-and-storage-devices-quiz",
    passScore: 6,
  },
  examPractice: {
    storageKey: "lesson-input-output-and-storage-devices-exam-practice",
  },
}

initLessonPage(lessonConfig)
