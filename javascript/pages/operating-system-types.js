import { initLessonPage } from "../core/lesson-shell.js"

const lessonConfig = {
  lessonId: "operating-system-types",
  defaultContext: "btec-level-3-unit-2",
  contexts: {
    "btec-level-3-unit-2": {
      label: "BTEC Level 3 Computing Unit 2",
      backHref: "../units/btec-level-3-unit-2.html#section-a",
      backLabel: "Back to Unit 2 content",
      previous: {
        title: "RAID and NAS storage systems",
        description: "Previous in A1 Computer hardware in a computer system.",
        status: "Live",
        href: "../topics/raid-and-nas-storage-systems.html",
      },
      next: {
        title: "Kernel functions and system management",
        description: "Next in A2 Computer software in a computer system.",
        status: "Live",
        href: "../topics/kernel-functions-and-system-management.html",
      },
    },
  },
  quiz: {
    storageKey: "lesson-operating-system-types-quiz",
    passScore: 6,
  },
  examPractice: {
    storageKey: "lesson-operating-system-types-exam-practice",
  },
}

initLessonPage(lessonConfig)
