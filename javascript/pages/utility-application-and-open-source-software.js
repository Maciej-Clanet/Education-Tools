import { initLessonPage } from "../core/lesson-shell.js"

const lessonConfig = {
  lessonId: "utility-application-and-open-source-software",
  defaultContext: "btec-level-3-unit-2",
  contexts: {
    "btec-level-3-unit-2": {
      label: "BTEC Level 3 Computing Unit 2",
      backHref: "../units/btec-level-3-unit-2.html#section-a",
      backLabel: "Back to Unit 2 content",
      previous: {
        title: "User interfaces and software choice",
        description: "Previous in A2 Computer software in a computer system.",
        status: "Live",
        href: "../topics/user-interfaces-and-software-choice.html",
      },
      next: {
        title: "Collecting and processing data",
        description: "Next in A3 Data processing.",
        status: "Live",
        href: "../topics/collecting-and-processing-data.html",
      },
    },
  },
  quiz: {
    storageKey: "lesson-utility-application-and-open-source-software-quiz",
    passScore: 4,
  },
  examPractice: {
    storageKey:
      "lesson-utility-application-and-open-source-software-exam-practice",
  },
}

initLessonPage(lessonConfig)
