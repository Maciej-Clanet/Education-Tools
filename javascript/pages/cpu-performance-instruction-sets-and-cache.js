import { initLessonPage } from "../core/lesson-shell.js"

const lessonConfig = {
  lessonId: "cpu-performance-instruction-sets-and-cache",
  defaultContext: "btec-level-3-unit-2",
  contexts: {
    "btec-level-3-unit-2": {
      label: "BTEC Level 3 Computing Unit 2",
      backHref: "../units/btec-level-3-unit-2.html#section-b",
      backLabel: "Back to Unit 2 content",
      previous: {
        title: "The instruction cycle",
        description: "Previous in B2 The concepts of microarchitecture.",
        status: "Live",
        href: "../topics/instruction-cycle.html",
      },
      next: {
        title: "Pipelining, multi-processing, and multi-threading",
        description: "Next in B2 The concepts of microarchitecture.",
        status: "Live",
        href: "../topics/pipelining-multi-processing-and-multi-threading.html",
      },
    },
  },
  quiz: {
    storageKey: "lesson-cpu-performance-instruction-sets-and-cache-quiz",
    passScore: 4,
  },
  examPractice: {
    storageKey: "lesson-cpu-performance-instruction-sets-and-cache-exam-practice",
  },
}

initLessonPage(lessonConfig)
