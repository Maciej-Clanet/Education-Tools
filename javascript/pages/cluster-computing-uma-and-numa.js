import { initLessonPage } from "../core/lesson-shell.js"

const lessonConfig = {
  lessonId: "cluster-computing-uma-and-numa",
  defaultContext: "btec-level-3-unit-2",
  contexts: {
    "btec-level-3-unit-2": {
      label: "BTEC Level 3 Computing Unit 2",
      backHref: "../units/btec-level-3-unit-2.html#section-b",
      backLabel: "Back to Unit 2 content",
      previous: {
        title: "Stored program architecture: Von Neumann and Harvard",
        description: "Previous in B1 Approaches to computer architecture.",
        status: "Live",
        href: "../topics/stored-program-architecture-von-neumann-and-harvard.html",
      },
      next: {
        title: "Emulation",
        description: "Next in B1 Approaches to computer architecture.",
        status: "Live",
        href: "../topics/emulation-in-computer-systems.html",
      },
    },
  },
  quiz: {
    storageKey: "lesson-cluster-computing-uma-and-numa-quiz",
    passScore: 4,
  },
  examPractice: {
    storageKey: "lesson-cluster-computing-uma-and-numa-exam-practice",
  },
}

initLessonPage(lessonConfig)
