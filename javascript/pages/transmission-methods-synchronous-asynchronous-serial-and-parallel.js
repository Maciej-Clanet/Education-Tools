import { initLessonPage } from "../core/lesson-shell.js"

const lessonConfig = {
  lessonId:
    "transmission-methods-synchronous-asynchronous-serial-and-parallel",
  defaultContext: "btec-level-3-unit-2",
  contexts: {
    "btec-level-3-unit-2": {
      label: "BTEC Level 3 Computing Unit 2",
      backHref: "../units/btec-level-3-unit-2.html#section-e",
      backLabel: "Back to Unit 2 content",
      previous: {
        title: "Communication channels and connection methods",
        description: "Previous in E1 Transmitting data.",
        status: "Live",
        href: "../topics/communication-channels-and-connection-methods.html",
      },
      next: {
        title: "Packet data, packet switching, and protocols",
        description: "Next in E1 Transmitting data.",
        status: "Live",
        href: "../topics/packet-data-packet-switching-and-protocols.html",
      },
    },
  },
  quiz: {
    storageKey:
      "lesson-transmission-methods-synchronous-asynchronous-serial-and-parallel-quiz",
    passScore: 4,
  },
  examPractice: {
    storageKey:
      "lesson-transmission-methods-synchronous-asynchronous-serial-and-parallel-exam-practice",
  },
}

initLessonPage(lessonConfig)
