import { initLessonPage } from "../core/lesson-shell.js"
import { initCodeSnippets } from "../core/code-snippets.js"

initLessonPage({
  lessonId: "adding-mongodb-to-fastapi",
  defaultContext: "web-development",
  contexts: {
    "web-development": {
      label: "Web Development",
      backHref: "../resources/web-development.html#fastapi-backend",
      backLabel: "Back to FastAPI Backend",
      previous: {
        title: "Starting a FastAPI backend",
        href: "starting-a-fastapi-backend.html",
      },
    },
  },
})
initCodeSnippets()
