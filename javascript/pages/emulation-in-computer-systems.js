import { initLessonPage } from "../core/lesson-shell.js"

const lessonConfig = {
  lessonId: "emulation-in-computer-systems",
  defaultContext: "btec-level-3-unit-2",
  contexts: {
    "btec-level-3-unit-2": {
      label: "BTEC Level 3 Computing Unit 2",
      backHref: "../units/btec-level-3-unit-2.html#section-b",
      backLabel: "Back to Unit 2 content",
      previous: {
        title: "Cluster computing, UMA, and NUMA",
        description: "Previous in B1 Approaches to computer architecture.",
        status: "Live",
        href: "../topics/cluster-computing-uma-and-numa.html",
      },
      next: {
        title: "The instruction cycle",
        description: "Next in B2 The concepts of microarchitecture.",
        status: "Live",
        href: "../topics/instruction-cycle.html",
      },
    },
  },
  quiz: {
    storageKey: "lesson-emulation-in-computer-systems-quiz",
    passScore: 4,
  },
  examPractice: {
    storageKey: "lesson-emulation-in-computer-systems-exam-practice",
  },
}

initLessonPage(lessonConfig)
