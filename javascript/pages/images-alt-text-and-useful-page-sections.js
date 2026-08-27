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
        title: "Parent and child relationships in HTML",
        href: "parent-child-relationships-in-html.html",
        description:
          "Build a clear mental model of nesting, direct children, siblings, descendants, and closing order.",
        status: "Live",
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
