import { initLessonPage } from "../core/lesson-shell.js"

const lessonConfig = {
  lessonId: "data-across-multiple-systems",
  defaultContext: "btec-level-3-unit-2",
  contexts: {
    "btec-level-3-unit-2": {
      label: "BTEC Level 3 Computing Unit 2",
      backHref: "../units/btec-level-3-unit-2.html#section-a",
      backLabel: "Back to Unit 2 content",
      previous: {
        title: "Collecting and processing data",
        description: "Previous in A3 Data processing.",
        status: "Live",
        href: "../topics/collecting-and-processing-data.html",
      },
      next: {
        title: "Backup and data recovery",
        description: "Next in A3 Data processing.",
        status: "Live",
        href: "../topics/backup-and-data-recovery.html",
      },
    },
  },
  quiz: {
    storageKey: "lesson-data-across-multiple-systems-quiz",
    passScore: 4,
  },
  examPractice: {
    storageKey: "lesson-data-across-multiple-systems-exam-practice",
  },
}

initLessonPage(lessonConfig)
