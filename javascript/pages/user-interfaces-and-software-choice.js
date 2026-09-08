import { initLessonPage } from "../core/lesson-shell.js"
import { initSimulatedTerminals } from "../core/simulated-terminal.js"
import { initPairedScenarios } from "../core/paired-scenarios.js"
import { interfaceTerminals, interfaceScenarios } from "../data/user-interface-activities.js"

const lessonConfig = {
  lessonId: "user-interfaces-and-software-choice",
  defaultContext: "btec-level-3-unit-2",
  contexts: {
    "btec-level-3-unit-2": {
      label: "BTEC Level 3 Computing Unit 2",
      backHref: "../units/btec-level-3-unit-2.html#section-a",
      backLabel: "Back to Unit 2 content",
      previous: {
        title: "Kernel functions and system management",
        description: "Previous in A2 Computer software in a computer system.",
        status: "Live",
        href: "../topics/kernel-functions-and-system-management.html",
      },
      next: {
        title: "Utility, application, and open source software",
        description: "Next in A2 Computer software in a computer system.",
        status: "Live",
        href: "../topics/utility-application-and-open-source-software.html",
      },
    },
  },
  quiz: {
    storageKey: "lesson-user-interfaces-and-software-choice-quiz-v2",
    version: 2,
    totalQuestions: 12,
    passScore: 9,
  },
  examPractice: {
    storageKey: "lesson-user-interfaces-and-software-choice-exam-practice",
  },
}

// Preserve old topic bookmarks after the curriculum split.
const previousSections = { '#software-choice': '#interface-suitability', '#performance-use': '#interface-suitability' }
if (previousSections[location.hash]) history.replaceState(null, '', previousSections[location.hash])
initSimulatedTerminals(interfaceTerminals)
initPairedScenarios(interfaceScenarios)
initLessonPage(lessonConfig)
