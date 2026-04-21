import { initLessonPage } from "../core/lesson-shell.js"

const lessonConfig = {
  lessonId: "cpu-architecture-for-different-systems",
  defaultContext: "btec-level-3-unit-2",
  contexts: {
    "btec-level-3-unit-2": {
      label: "BTEC Level 3 Computing Unit 2",
      backHref: "../units/btec-level-3-unit-2.html#section-b",
      backLabel: "Back to Unit 2 content",
      previous: {
        title: "Pipelining, multi-processing, and multi-threading",
        description: "Previous in B2 The concepts of microarchitecture.",
        status: "Live",
        href: "../topics/pipelining-multi-processing-and-multi-threading.html",
      },
      next: {
        title: "Registers and their functions",
        description: "Next in B3 Registers and register handling.",
        status: "Live",
        href: "../topics/registers-and-their-functions.html",
      },
    },
  },
  quiz: {
    storageKey: "lesson-cpu-architecture-for-different-systems-quiz",
    passScore: 4,
  },
  examPractice: {
    storageKey: "lesson-cpu-architecture-for-different-systems-exam-practice",
  },
}

initLessonPage(lessonConfig)
