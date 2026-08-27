import { initCodePreviews } from "../core/code-preview.js"
import { initLessonPage } from "../core/lesson-shell.js"

const lessonConfig = {
  lessonId: "html-document-structure",
  defaultContext: "web-development",
  contexts: {
    "web-development": {
      label: "Web Development",
      backHref: "../resources/web-development.html#html-basics",
      backLabel: "Back to Web Development resources",
      previous: {
        title: "What is HTML?",
        href: "what-is-html.html",
        description:
          "The previous lesson introduced HTML, tags, elements, and the basic page parts.",
        status: "Live",
      },
      next: {
        title: "Headings, paragraphs, lists, and links",
        href: "headings-paragraphs-lists-and-links.html",
        description:
          "Learn the common text tags students use for paragraphs, headings, links, and lists.",
        status: "Live",
      },
    },
  },
  quiz: {
    storageKey: "lesson-html-document-structure-quiz",
    passScore: 5,
  },
}

initLessonPage(lessonConfig)
initCodePreviews()
