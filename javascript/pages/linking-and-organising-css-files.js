import { initCodePreviews } from "../core/code-preview.js"
import { initLessonPage } from "../core/lesson-shell.js"

const lessonConfig = {
  lessonId: "linking-and-organising-css-files",
  defaultContext: "web-development",
  contexts: {
    "web-development": {
      label: "Web Development",
      backHref: "../resources/web-development.html#css-basics",
      backLabel: "Back to Web Development resources",
      previous: {
        title: "Forms 2: Choices, larger inputs, and grouping",
        href: "forms-2-choices-larger-inputs-and-grouping.html",
        description:
          "The final HTML Basics lesson covered choices, larger form controls, grouping, and submitted values.",
        status: "Live",
      },
      next: {
        title: "CSS selectors",
        href: "css-selectors.html",
        description:
          "Next, learn how CSS selects the HTML elements that should receive styling.",
        status: "Live",
      },
    },
  },
  quiz: {
    storageKey: "lesson-linking-and-organising-css-files-quiz",
    passScore: 9,
    version: 1,
  },
  examPractice: {
    storageKey: "lesson-linking-and-organising-css-files-practice",
  },
}

const pageCssMap = {
  home: {
    label: "Home page",
    filename: "index.html",
    loads: ["common.css", "home.css"],
  },
  sales: {
    label: "Sales page",
    filename: "sales.html",
    loads: ["common.css", "sales.css"],
  },
  gallery: {
    label: "Gallery page",
    filename: "gallery.html",
    loads: ["common.css", "gallery.css", "gallery-grid.css"],
  },
}

const allCssFiles = [
  "common.css",
  "home.css",
  "sales.css",
  "gallery.css",
  "gallery-grid.css",
]

const debuggerScenarios = [
  {
    title: "Same-folder stylesheet",
    tree: "website/\n|-- index.html  [CURRENT]\n`-- styles.css  [TARGET]",
    current: "index.html",
    target: "styles.css",
    link: '<link rel="stylesheet" href="styles.css">',
    lookup: "website/styles.css",
    prompt: "Is this link correct?",
    answer: "correct",
    feedback:
      "Correct. Both files are in the same folder, so the filename alone reaches styles.css.",
  },
  {
    title: "CSS inside a subfolder",
    tree: "website/\n|-- index.html  [CURRENT]\n`-- css/\n    `-- common.css  [TARGET]",
    current: "index.html",
    target: "css/common.css",
    link: '<link rel="stylesheet" href="common.css">',
    lookup: "website/common.css (not found)",
    prompt: "What is wrong with this link?",
    answer: "path",
    feedback:
      'The path misses the css folder. Use href="css/common.css" from index.html.',
  },
  {
    title: "Nested page needs to go up",
    tree: "website/\n|-- css/\n|   `-- common.css  [TARGET]\n`-- pages/\n    `-- sales.html  [CURRENT]",
    current: "pages/sales.html",
    target: "css/common.css",
    link: '<link rel="stylesheet" href="css/common.css">',
    lookup: "website/pages/css/common.css (not found)",
    prompt: "What is wrong with this link?",
    answer: "path",
    feedback:
      'The path starts inside pages. Use href="../css/common.css" to go up, then into css.',
  },
  {
    title: "Filename must match",
    tree: "website/\n|-- index.html  [CURRENT]\n`-- css/\n    `-- common.css  [TARGET]",
    current: "index.html",
    target: "css/common.css",
    link: '<link rel="stylesheet" href="css/commons.css">',
    lookup: "website/css/commons.css (not found)",
    prompt: "What is wrong with this link?",
    answer: "path",
    feedback:
      'The filename does not match. The real file is common.css, so use href="css/common.css".',
  },
  {
    title: "Relationship value",
    tree: "website/\n|-- index.html  [CURRENT]\n`-- css/\n    `-- common.css  [TARGET]",
    current: "index.html",
    target: "css/common.css",
    link: '<link rel="style" href="css/common.css">',
    lookup: "website/css/common.css",
    prompt: "The path reaches the file. What is still wrong?",
    answer: "rel",
    feedback:
      'The rel value must be stylesheet. Use rel="stylesheet" so the browser understands the relationship.',
  },
  {
    title: "Two useful stylesheets",
    tree: "website/\n|-- index.html  [CURRENT]\n`-- css/\n    |-- common.css  [TARGET]\n    `-- home.css  [TARGET]",
    current: "index.html",
    target: "css/common.css and css/home.css",
    link:
      '<link rel="stylesheet" href="css/common.css">\n<link rel="stylesheet" href="css/home.css">',
    lookup: "website/css/common.css and website/css/home.css",
    prompt: "Are these two links valid together?",
    answer: "correct",
    feedback:
      "Correct. One HTML page can link multiple stylesheets, and both paths reach real files.",
  },
]

const diagnosisLabels = {
  correct: "The link is correct",
  path: "The path or filename is wrong",
  rel: 'The rel value is wrong',
}

function joinList(items) {
  if (items.length <= 1) {
    return items[0] ?? "none"
  }

  return `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`
}

function initCssLoadExplorer() {
  const explorer = document.querySelector("[data-css-load-explorer]")

  if (!explorer) {
    return
  }

  const buttons = Array.from(explorer.querySelectorAll("[data-page-choice]"))
  const fileCards = Array.from(explorer.querySelectorAll("[data-css-file]"))
  const pageOutput = explorer.querySelector("[data-selected-page]")
  const filenameOutput = explorer.querySelector("[data-selected-filename]")
  const summary = explorer.querySelector("[data-css-load-summary]")

  function selectPage(pageId) {
    const page = pageCssMap[pageId] ?? pageCssMap.home
    const notLoaded = allCssFiles.filter((file) => !page.loads.includes(file))

    buttons.forEach((button) => {
      const selected = button.dataset.pageChoice === pageId
      button.classList.toggle("is-selected", selected)
      button.setAttribute("aria-pressed", String(selected))
    })

    fileCards.forEach((card) => {
      const loaded = page.loads.includes(card.dataset.cssFile)
      card.classList.toggle("is-loaded", loaded)
      card.classList.toggle("is-not-loaded", !loaded)
      card.querySelector("[data-load-state]").textContent = loaded
        ? "LOADED"
        : "NOT LOADED"
    })

    pageOutput.textContent = page.label
    filenameOutput.textContent = page.filename
    summary.textContent = `${page.label} loads ${joinList(page.loads)}. It does not load ${joinList(notLoaded)}.`
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => selectPage(button.dataset.pageChoice))
  })

  selectPage("home")
}

function initCssLinkDebugger() {
  const debuggerTool = document.querySelector("[data-css-link-debugger]")

  if (!debuggerTool) {
    return
  }

  const count = debuggerTool.querySelector("[data-debug-count]")
  const title = debuggerTool.querySelector("[data-debug-title]")
  const tree = debuggerTool.querySelector("[data-debug-tree]")
  const current = debuggerTool.querySelector("[data-debug-current]")
  const target = debuggerTool.querySelector("[data-debug-target]")
  const link = debuggerTool.querySelector("[data-debug-link]")
  const lookup = debuggerTool.querySelector("[data-debug-lookup]")
  const prompt = debuggerTool.querySelector("[data-debug-prompt]")
  const options = debuggerTool.querySelector("[data-debug-options]")
  const feedback = debuggerTool.querySelector("[data-debug-feedback]")
  const next = debuggerTool.querySelector("[data-debug-next]")
  let index = 0

  function renderScenario() {
    const scenario = debuggerScenarios[index]

    count.textContent = `Scenario ${index + 1} of ${debuggerScenarios.length}`
    title.textContent = scenario.title
    tree.textContent = scenario.tree
    current.textContent = scenario.current
    target.textContent = scenario.target
    link.textContent = scenario.link
    lookup.textContent = scenario.lookup
    prompt.textContent = scenario.prompt
    feedback.textContent = "Choose the best diagnosis."
    debuggerTool.classList.remove("is-correct", "is-incorrect")

    const buttons = Object.entries(diagnosisLabels).map(([value, label]) => {
      const button = document.createElement("button")
      button.type = "button"
      button.dataset.debugChoice = value
      button.textContent = label
      button.setAttribute("aria-pressed", "false")
      return button
    })

    options.replaceChildren(...buttons)
  }

  options.addEventListener("click", (event) => {
    const button = event.target.closest("[data-debug-choice]")

    if (!button) {
      return
    }

    const scenario = debuggerScenarios[index]
    const correct = button.dataset.debugChoice === scenario.answer

    Array.from(options.querySelectorAll("[data-debug-choice]")).forEach(
      (choice) => {
        const selected = choice === button
        const isAnswer = choice.dataset.debugChoice === scenario.answer
        choice.classList.toggle("is-selected", selected)
        choice.classList.toggle("is-correct", isAnswer)
        choice.classList.toggle("is-incorrect", selected && !correct)
        choice.setAttribute("aria-pressed", String(selected))
      }
    )

    debuggerTool.classList.toggle("is-correct", correct)
    debuggerTool.classList.toggle("is-incorrect", !correct)
    feedback.textContent = correct
      ? scenario.feedback
      : `Not quite. ${scenario.feedback}`
  })

  next.addEventListener("click", () => {
    index = (index + 1) % debuggerScenarios.length
    renderScenario()
  })

  renderScenario()
}

initLessonPage(lessonConfig)
initCodePreviews()
initCssLoadExplorer()
initCssLinkDebugger()
