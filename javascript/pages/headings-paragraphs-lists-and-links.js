import { initCodePreviews } from "../core/code-preview.js"
import { initLessonPage } from "../core/lesson-shell.js"

const lessonConfig = {
  lessonId: "headings-paragraphs-lists-and-links",
  defaultContext: "web-development",
  contexts: {
    "web-development": {
      label: "Web Development",
      backHref: "../resources/web-development.html#html-basics",
      backLabel: "Back to Web Development resources",
      previous: {
        title: "HTML document structure",
        href: "html-document-structure.html",
        description:
          "The previous lesson covered the document skeleton, body landmarks, divs, and common layouts.",
        status: "Live",
      },
      next: {
        title: "Images, alt text, and useful page sections",
        description:
          "Next planned HTML basics lesson on images and clearer page sections.",
        status: "Planned",
      },
    },
  },
  quiz: {
    storageKey: "lesson-headings-paragraphs-lists-and-links-quiz",
    passScore: 7,
  },
  examPractice: {
    storageKey: "lesson-headings-paragraphs-lists-and-links-task",
  },
}

initLessonPage(lessonConfig)
initCodePreviews()
