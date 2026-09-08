import { initLessonPage } from "../core/lesson-shell.js"
import { initKernelVisualisers, initKernelScenarios } from "../core/kernel-visualiser.js"
import { kernelSequences } from "../data/kernel-visualiser-data.js"

const lessonConfig = {
  lessonId: "kernel-functions-and-system-management",
  defaultContext: "btec-level-3-unit-2",
  contexts: {
    "btec-level-3-unit-2": {
      label: "BTEC Level 3 Computing Unit 2",
      backHref: "../units/btec-level-3-unit-2.html#section-a",
      backLabel: "Back to Unit 2 content",
      previous: {
        title: "Operating system types",
        description: "Previous in A2 Computer software in a computer system.",
        status: "Live",
        href: "../topics/operating-system-types.html",
      },
      next: {
        title: "User interfaces and software choice",
        description: "Next in A2 Computer software in a computer system.",
        status: "Live",
        href: "../topics/user-interfaces-and-software-choice.html",
      },
    },
  },
  quiz: {
    storageKey: "lesson-kernel-functions-and-system-management-quiz-v2",
    version: 2,
    totalQuestions: 16,
    passScore: 12,
  },
  examPractice: {
    storageKey: "lesson-kernel-functions-and-system-management-exam-practice",
  },
}

// Keep bookmarks to the consolidated activity working in either lesson mode.
if (window.location.hash === '#interrupt-lab') {
  history.replaceState(null, '', '#interrupt-sequence')
}

initKernelVisualisers(kernelSequences)
initKernelScenarios()
initLessonPage(lessonConfig)
