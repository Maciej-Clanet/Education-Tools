import { initLessonPage } from "../core/lesson-shell.js"
import { initCodeSnippets } from "../core/code-snippets.js"

initLessonPage({
  lessonId: "starting-a-react-project",
  defaultContext: "web-development",
  contexts: {
    "web-development": {
      label: "Web Development",
      backHref: "../resources/web-development.html#react-frontend",
      backLabel: "Back to React Frontend",
    },
  },
})
initCodeSnippets()
