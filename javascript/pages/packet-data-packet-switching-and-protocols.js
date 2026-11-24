import { initLessonPage } from "../core/lesson-shell.js"

const lessonConfig = {
  lessonId: "packet-data-packet-switching-and-protocols",
  defaultContext: "btec-level-3-unit-2",
  contexts: {
    "btec-level-3-unit-2": {
      label: "BTEC Level 3 Computing Unit 2",
      backHref: "../units/btec-level-3-unit-2.html#section-e",
      backLabel: "Back to Unit 2 content",
      previous: {
        title:
          "Transmission methods: synchronous, asynchronous, serial, and parallel",
        description: "Previous in E1 Transmitting data.",
        status: "Live",
        href: "../topics/transmission-methods-synchronous-asynchronous-serial-and-parallel.html",
      },
      next: {
        title: "Encryption and data compression",
        description: "Next in E1 Transmitting data.",
        status: "Live",
        href: "../topics/encryption-and-data-compression.html",
      },
    },
  },
  quiz: {
    storageKey: "lesson-packet-data-packet-switching-and-protocols-quiz",
    passScore: 4,
    version: 2,
  },
  examPractice: {
    storageKey:
      "lesson-packet-data-packet-switching-and-protocols-exam-practice",
  },
}

import { initLessonWalkthroughs } from "../core/lesson-walkthrough.js"
import { initTeachingAnimations } from "../core/teaching-animation.js"
import { initPairedScenarios } from "../core/paired-scenarios.js"
import { packetScenarios } from "../data/packet-scenarios.js"
import { initPacketActivities } from "../core/packet-activities.js"

initLessonPage(lessonConfig)
initLessonWalkthroughs()
initTeachingAnimations()
initPairedScenarios(packetScenarios)
initPacketActivities()
document.body.dataset.packetLessonReady = "true"
