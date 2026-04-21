import { initLessonPage } from "../core/lesson-shell.js"

const lessonConfig = {
  lessonId: "instruction-cycle",
  defaultContext: "btec-level-3-unit-2",
  contexts: {
    "btec-level-3-unit-2": {
      label: "BTEC Level 3 Computing Unit 2",
      backHref: "../units/btec-level-3-unit-2.html#section-b",
      backLabel: "Back to Unit 2 content",
      previous: {
        title: "Cluster computing, UMA, NUMA, and emulation",
        description: "Previous in B1 Approaches to computer architecture. This lesson is still planned.",
        status: "Planned",
      },
      next: {
        title: "CPU performance, instruction sets, and cache",
        description: "Next in B2 The concepts of microarchitecture.",
        status: "Live",
        href: "../topics/cpu-performance-instruction-sets-and-cache.html",
      },
    },
  },
  quiz: {
    storageKey: "lesson-instruction-cycle-quiz",
    passScore: 4,
  },
  examPractice: {
    storageKey: "lesson-instruction-cycle-exam-practice",
  },
}

initLessonPage(lessonConfig)
