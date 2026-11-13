import { initLessonPage } from "../core/lesson-shell.js"
import { initBooleanDemos } from "./boolean-logic-demos.js"
import { initLiveCodeExamples } from "../core/live-code-example.js"
import { initBooleanPractice } from "./boolean-logic-practice.js"

const lessonConfig = {
  lessonId: "boolean-logic",
  defaultContext: "btec-level-3-unit-2",
  contexts: {
    "btec-level-3-unit-2": {
      label: "BTEC Level 3 Computing Unit 2",
      backHref: "../units/btec-level-3-unit-2.html#section-f",
      backLabel: "Back to Unit 2 content",
      previous: {
        title: "Error correction with ARQ and FEC",
        description: "Previous in E3 Error correction.",
        status: "Live",
        href: "../topics/error-correction-with-arq-and-fec.html",
      },
      next: {
        title: "Flow charts and system diagrams",
        description: "Next in F2 Flow charts and system diagrams.",
        status: "Live",
        href: "../topics/flow-charts-and-system-diagrams.html",
      },
    },
  },
  quiz: {
    storageKey: "lesson-boolean-logic-quiz-v3",
    passScore: 6,
    version: 3,
  },
  examPractice: {
    storageKey: "lesson-boolean-logic-exam-practice",
  },
}

const recapCode = [{
  id: "boolean-recap-code",
  title: "Boolean recap",
  executionMode: "javascript",
  defaultSplit: 67,
  sources: [{
    id: "javascript", type: "javascript", label: "JavaScript",
    code: `// Boolean values are true or false.
// console.log displays a value.
console.log(true);
console.log(false);

// A comparison gives a Boolean value.
console.log(20 >= 18); // true
console.log(16 >= 18); // false

// Use the result to make a decision.
// Allow entry if the age check is true.
// Change 16 to 19, then select Run.`,
  }],
  execution: { timeoutMs: 3000, network: { mode: "disabled" } },
}]

initLessonPage(lessonConfig)
initBooleanDemos()
initBooleanPractice()
initLiveCodeExamples(recapCode)
document.querySelector('#boolean-recap')?.setAttribute('data-code-ready', 'true')
