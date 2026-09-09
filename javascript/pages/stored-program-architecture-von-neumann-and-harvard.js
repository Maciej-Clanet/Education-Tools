import { initLessonPage } from "../core/lesson-shell.js"

import { initArchitectureVisualisers } from "../core/architecture-visualiser.js"
import { initPairedScenarios } from "../core/paired-scenarios.js"
import { architectureScenarios } from "../data/architecture-scenarios.js"

const lessonConfig = {
  lessonId: "stored-program-architecture-von-neumann-and-harvard",
  defaultContext: "btec-level-3-unit-2",
  contexts: {
    "btec-level-3-unit-2": {
      label: "BTEC Level 3 Computing Unit 2",
      backHref: "../units/btec-level-3-unit-2.html#section-b",
      backLabel: "Back to Unit 2 content",
      previous: {
        title: "Backup and data recovery",
        description: "Previous in A3 Data processing.",
        status: "Live",
        href: "../topics/backup-and-data-recovery.html",
      },
      next: {
        title: "Cluster computing, UMA, and NUMA",
        description: "Next in B1 Approaches to computer architecture.",
        status: "Live",
        href: "../topics/cluster-computing-uma-and-numa.html",
      },
    },
  },
  quiz: {
    storageKey: "lesson-stored-program-architecture-von-neumann-and-harvard-quiz-v3",
    version: 3,
    totalQuestions: 12,
    passScore: 9,
  },
  examPractice: {
    storageKey:
      "lesson-stored-program-architecture-von-neumann-and-harvard-exam-practice",
  },
}

initArchitectureVisualisers()
initPairedScenarios(architectureScenarios)
initLessonPage(lessonConfig)
