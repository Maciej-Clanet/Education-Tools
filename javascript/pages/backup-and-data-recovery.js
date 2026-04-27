import { initLessonPage } from "../core/lesson-shell.js"

const lessonConfig = {
  lessonId: "backup-and-data-recovery",
  defaultContext: "btec-level-3-unit-2",
  contexts: {
    "btec-level-3-unit-2": {
      label: "BTEC Level 3 Computing Unit 2",
      backHref: "../units/btec-level-3-unit-2.html#section-a",
      backLabel: "Back to Unit 2 content",
      previous: {
        title: "Data across multiple systems",
        description: "Previous in A3 Data processing.",
        status: "Live",
        href: "../topics/data-across-multiple-systems.html",
      },
      next: {
        title: "Stored program architecture: Von Neumann and Harvard",
        description: "Next in B1 Approaches to computer architecture.",
        status: "Live",
        href: "../topics/stored-program-architecture-von-neumann-and-harvard.html",
      },
    },
  },
  quiz: {
    storageKey: "lesson-backup-and-data-recovery-quiz",
    passScore: 4,
  },
  examPractice: {
    storageKey: "lesson-backup-and-data-recovery-exam-practice",
  },
}

initLessonPage(lessonConfig)
