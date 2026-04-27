import { initLessonPage } from "../core/lesson-shell.js"

const lessonConfig = {
  lessonId: "computer-system-types-and-internal-components",
  defaultContext: "btec-level-3-unit-2",
  contexts: {
    "btec-level-3-unit-2": {
      label: "BTEC Level 3 Computing Unit 2",
      backHref: "../units/btec-level-3-unit-2.html#section-a",
      backLabel: "Back to Unit 2 content",
      previous: {
        title: "Start of the A1 lesson sequence",
        description:
          "Use the unit hub if you want to jump to a different Unit 2 topic.",
        status: "Start",
      },
      next: {
        title: "Input, output, and storage devices",
        description: "Next in A1 Computer hardware in a computer system.",
        status: "Live",
        href: "../topics/input-output-and-storage-devices.html",
      },
    },
  },
  quiz: {
    storageKey: "lesson-computer-system-types-and-internal-components-quiz",
    passScore: 4,
  },
  examPractice: {
    storageKey:
      "lesson-computer-system-types-and-internal-components-exam-practice",
  },
}

initLessonPage(lessonConfig)
