import { initLessonPage } from "../core/lesson-shell.js"

const lessonConfig = {
  lessonId: "negative-and-floating-point-representation",
  defaultContext: "btec-level-3-unit-2",
  contexts: {
    "btec-level-3-unit-2": {
      label: "BTEC Level 3 Computing Unit 2",
      backHref: "../units/btec-level-3-unit-2.html#section-c",
      backLabel: "Back to Unit 2 content",
      previous: {
        title: "Binary arithmetic",
        description: "Previous in C1 Number systems.",
        status: "Live",
        href: "../topics/binary-arithmetic.html",
      },
      next: {
        title: "Character sets, ASCII, and Unicode",
        description: "Next in C2 Text representation.",
        status: "Live",
        href: "../topics/character-sets-ascii-and-unicode.html",
      },
    },
  },
  quiz: {
    storageKey: "lesson-negative-and-floating-point-representation-quiz",
    passScore: 4,
  },
  examPractice: {
    storageKey: "lesson-negative-and-floating-point-representation-exam-practice",
  },
}

initLessonPage(lessonConfig)
