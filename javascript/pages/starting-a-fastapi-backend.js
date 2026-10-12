import { initLessonPage } from "../core/lesson-shell.js"
import { initCodeSnippets } from "../core/code-snippets.js"

initLessonPage({
  lessonId: "starting-a-fastapi-backend",
  defaultContext: "web-development",
  contexts: {
    "web-development": {
      label: "Web Development",
      backHref: "../resources/web-development.html#fastapi-backend",
      backLabel: "Back to FastAPI Backend",
      previous: {
        title: "What is a backend?",
        href: "what-is-a-backend.html",
      },
    },
  },
})
initCodeSnippets()
