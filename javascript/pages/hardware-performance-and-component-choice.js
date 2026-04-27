import { initLessonPage } from "../core/lesson-shell.js"

const lessonConfig = {
  lessonId: "hardware-performance-and-component-choice",
  defaultContext: "btec-level-3-unit-2",
  contexts: {
    "btec-level-3-unit-2": {
      label: "BTEC Level 3 Computing Unit 2",
      backHref: "../units/btec-level-3-unit-2.html#section-a",
      backLabel: "Back to Unit 2 content",
      previous: {
        title: "Input, output, and storage devices",
        description: "Previous in A1 Computer hardware in a computer system.",
        status: "Live",
        href: "../topics/input-output-and-storage-devices.html",
      },
      next: {
        title: "RAID and NAS storage systems",
        description: "Next in A1 Computer hardware in a computer system.",
        status: "Live",
        href: "../topics/raid-and-nas-storage-systems.html",
      },
    },
  },
  quiz: {
    storageKey: "lesson-hardware-performance-and-component-choice-quiz",
    passScore: 4,
  },
  examPractice: {
    storageKey: "lesson-hardware-performance-and-component-choice-exam-practice",
  },
}

initLessonPage(lessonConfig)
