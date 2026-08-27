import { initCodePreviews } from "../core/code-preview.js"
import { initLessonPage } from "../core/lesson-shell.js"

const lessonConfig = {
  lessonId: "images-alt-text-and-useful-page-sections",
  defaultContext: "web-development",
  contexts: {
    "web-development": {
      label: "Web Development",
      backHref: "../resources/web-development.html#html-basics",
      backLabel: "Back to Web Development resources",
      previous: {
        title: "Headings, paragraphs, lists, and links",
        href: "headings-paragraphs-lists-and-links.html",
        description:
          "The previous lesson covered common HTML tags for text, links, and lists.",
        status: "Live",
      },
      next: {
        title: "HTML practice project",
        description:
          "Next planned HTML basics lesson for combining these tags into a small page.",
        status: "Planned",
      },
    },
  },
  quiz: {
    storageKey: "lesson-images-alt-text-and-useful-page-sections-quiz",
    passScore: 6,
  },
}

initLessonPage(lessonConfig)
initCodePreviews()
