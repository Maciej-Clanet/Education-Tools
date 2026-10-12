import { initLessonPage } from "../core/lesson-shell.js"
import { initLessonWalkthroughs } from "../core/lesson-walkthrough.js"
import { initCodeSnippets } from "../core/code-snippets.js"

initLessonPage({
  lessonId: "what-is-a-backend",
  defaultContext: "web-development",
  contexts: {
    "web-development": {
      label: "Web Development",
      backHref: "../resources/web-development.html#fastapi-backend",
      backLabel: "Back to FastAPI Backend",
      next: {
        title: "Starting a FastAPI backend",
        href: "starting-a-fastapi-backend.html",
      },
    },
  },
  quiz: {
    storageKey: "lesson-what-is-a-backend-quiz",
    version: 1,
    passScore: 6,
  },
  examPractice: { storageKey: "lesson-what-is-a-backend-exam-practice" },
})
initLessonWalkthroughs()
initCodeSnippets()
