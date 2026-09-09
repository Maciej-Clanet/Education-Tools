import { initLessonPage } from "../core/lesson-shell.js"

import { initProcessingTools } from "../core/processing-tools.js"
import { weatherRecords } from "../data/weather-records.js"
import { initPairedScenarios } from "../core/paired-scenarios.js"
import { dataProcessingScenarios } from "../data/data-processing-scenarios.js"

const lessonConfig = {
  lessonId: "collecting-and-processing-data",
  defaultContext: "btec-level-3-unit-2",
  contexts: {
    "btec-level-3-unit-2": {
      label: "BTEC Level 3 Computing Unit 2",
      backHref: "../units/btec-level-3-unit-2.html#section-a",
      backLabel: "Back to Unit 2 content",
      previous: {
        title: "Utility, application, and open source software",
        description: "Previous in A2 Computer software in a computer system.",
        status: "Live",
        href: "../topics/utility-application-and-open-source-software.html",
      },
      next: {
        title: "Data across multiple systems",
        description: "Next in A3 Data processing.",
        status: "Live",
        href: "../topics/data-across-multiple-systems.html",
      },
    },
  },
  quiz: {
    storageKey: "lesson-collecting-and-processing-data-quiz-v2",
    version: 2,
    totalQuestions: 14,
    passScore: 10,
  },
  examPractice: {
    storageKey: "lesson-collecting-and-processing-data-exam-practice",
  },
}

initProcessingTools(weatherRecords)
initPairedScenarios(dataProcessingScenarios)
initLessonPage(lessonConfig)
