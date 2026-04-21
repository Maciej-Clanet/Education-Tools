import { initLessonPage } from "../core/lesson-shell.js"

const lessonConfig = {
  lessonId: "pipelining-multi-processing-and-multi-threading",
  defaultContext: "btec-level-3-unit-2",
  contexts: {
    "btec-level-3-unit-2": {
      label: "BTEC Level 3 Computing Unit 2",
      backHref: "../units/btec-level-3-unit-2.html#section-b",
      backLabel: "Back to Unit 2 content",
      previous: {
        title: "CPU performance, instruction sets, and cache",
        description: "Previous in B2 The concepts of microarchitecture.",
        status: "Live",
        href: "../topics/cpu-performance-instruction-sets-and-cache.html",
      },
      next: {
        title: "CPU architecture for different systems",
        description: "Next in B2 The concepts of microarchitecture.",
        status: "Live",
        href: "../topics/cpu-architecture-for-different-systems.html",
      },
    },
  },
  quiz: {
    storageKey: "lesson-pipelining-multi-processing-and-multi-threading-quiz",
    passScore: 4,
  },
  examPractice: {
    storageKey: "lesson-pipelining-multi-processing-and-multi-threading-exam-practice",
  },
}

initLessonPage(lessonConfig)
