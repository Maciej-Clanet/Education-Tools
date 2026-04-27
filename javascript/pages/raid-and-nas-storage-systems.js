import { initLessonPage } from "../core/lesson-shell.js"

const lessonConfig = {
  lessonId: "raid-and-nas-storage-systems",
  defaultContext: "btec-level-3-unit-2",
  contexts: {
    "btec-level-3-unit-2": {
      label: "BTEC Level 3 Computing Unit 2",
      backHref: "../units/btec-level-3-unit-2.html#section-a",
      backLabel: "Back to Unit 2 content",
      previous: {
        title: "Hardware performance and component choice",
        description: "Previous in A1 Computer hardware in a computer system.",
        status: "Live",
        href: "../topics/hardware-performance-and-component-choice.html",
      },
      next: {
        title: "Operating system types",
        description: "Next in A2 Computer software in a computer system.",
        status: "Live",
        href: "../topics/operating-system-types.html",
      },
    },
  },
  quiz: {
    storageKey: "lesson-raid-and-nas-storage-systems-quiz",
    passScore: 4,
  },
  examPractice: {
    storageKey: "lesson-raid-and-nas-storage-systems-exam-practice",
  },
}

initLessonPage(lessonConfig)
