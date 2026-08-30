import { initCodePreviews } from "../core/code-preview.js"
import { initDebugLabs } from "../core/debug-lab.js"
import { initLessonPage } from "../core/lesson-shell.js"

const lessonConfig = {
  lessonId: "css-selectors",
  defaultContext: "web-development",
  contexts: {
    "web-development": {
      label: "Web Development",
      backHref: "../resources/web-development.html#css-basics",
      backLabel: "Back to Web Development resources",
      previous: {
        title: "Linking and organising CSS files",
        href: "linking-and-organising-css-files.html",
        description:
          "The previous lesson connected HTML pages to external stylesheets and organised CSS files.",
        status: "Live",
      },
      next: {
        title: "CSS declarations and text styling",
        description:
          "Next, learn how declarations change text using carefully chosen CSS properties and values.",
        status: "Planned",
      },
    },
  },
  quiz: {
    storageKey: "lesson-css-selectors-quiz",
    passScore: 12,
    version: 1,
  },
}

const selectorMatches = {
  ".card": {
    ids: ["panda-card", "otter-card"],
    summary: ".card matches both animal cards because both elements have the card class.",
  },
  ".featured": {
    ids: ["panda-card"],
    summary: ".featured matches the Red Panda card. That element also matches .card.",
  },
  ".intro": {
    ids: ["intro-paragraph"],
    summary: ".intro matches the paragraph carrying the intro class.",
  },
  p: {
    ids: ["intro-paragraph", "panda-copy", "otter-copy"],
    summary: "p matches all three paragraph elements in this example.",
  },
  h2: {
    ids: ["panda-heading", "otter-heading"],
    summary: "h2 matches both second-level headings in this example.",
  },
  "#animal-title": {
    ids: ["animal-title"],
    summary: "#animal-title matches the one element with id=\"animal-title\".",
  },
}

function region(text, regionId, label) {
  return { text, regionId, label }
}

const debugTasks = [
  {
    id: "dot-inside-html-class",
    mode: "find-and-fix",
    title: "The warning style does not appear",
    goal: "The paragraph should receive the supplied warning styling.",
    files: [
      {
        name: "index.html",
        language: "HTML",
        lines: [
          [region("<p", "html-tag", "opening paragraph tag"), " ", region('class=".warning"', "html-class-dot", "HTML class attribute with dot"), ">"],
          "  Danger!",
          "</p>",
        ],
      },
      {
        name: "common.css",
        language: "CSS",
        lines: [
          [region(".warning", "css-warning-selector", "CSS warning selector"), " {"],
          "  /* supplied warning styling */",
          "}",
        ],
      },
    ],
    issues: [
      {
        id: "html-class-value",
        regionId: "html-class-dot",
        correctRepairId: "plain-class-value",
        foundFeedback: "You found the mismatched HTML class value. Now choose its repair.",
        repairFeedback: "Repair applied. The HTML class now matches the CSS class selector.",
        hints: [
          "Compare the characters inside class=\"...\" with the CSS selector.",
          "The dot belongs before a class name in CSS, not inside the HTML class value.",
        ],
      },
    ],
    repairOptions: [
      { id: "plain-class-value", label: 'class="warning"', replacement: 'class="warning"' },
      { id: "id-value", label: 'id="warning"', replacement: 'id="warning"' },
      { id: "hash-class-value", label: 'class="#warning"', replacement: 'class="#warning"' },
      { id: "trailing-dot", label: 'class="warning."', replacement: 'class="warning."' },
    ],
    preview: {
      broken: {
        title: "Warning paragraph",
        html: '<p class="debug-preview-warning is-plain"><span>Not styled</span> Danger!</p>',
      },
      fixed: {
        title: "Warning paragraph",
        html: '<p class="debug-preview-warning is-styled"><span>Warning style applied</span> Danger!</p>',
      },
    },
    explanation:
      "HTML stores the class name as warning. The CSS selector adds the dot when it asks for elements with that class: .warning.",
  },
  {
    id: "missing-css-dot",
    mode: "find-and-fix",
    title: "CSS is looking for the wrong kind of thing",
    goal: "The warning paragraph should match the supplied CSS rule.",
    files: [
      {
        name: "index.html",
        language: "HTML",
        lines: [
          ['<p ', region('class="warning"', "warning-class", "HTML warning class"), ">Danger!</p>"],
        ],
      },
      {
        name: "common.css",
        language: "CSS",
        lines: [
          [region("warning", "missing-dot", "CSS selector without a dot"), " {"],
          "  /* supplied warning styling */",
          "}",
        ],
      },
    ],
    issues: [
      {
        id: "css-class-prefix",
        regionId: "missing-dot",
        correctRepairId: "add-dot",
        foundFeedback: "You located the selector that does not match the HTML class.",
        repairFeedback: "Repair applied. CSS now asks for elements with the warning class.",
        hints: [
          "The HTML uses a class. What symbol begins a class selector in CSS?",
        ],
      },
    ],
    repairOptions: [
      { id: "add-dot", label: ".warning", replacement: ".warning" },
      { id: "add-hash", label: "#warning", replacement: "#warning" },
      { id: "add-ending-dot", label: "warning.", replacement: "warning." },
      { id: "paragraph", label: "p", replacement: "p" },
    ],
    preview: {
      broken: {
        title: "Browser result",
        html: '<p class="debug-preview-warning is-plain"><span>No match</span> Danger!</p>',
      },
      fixed: {
        title: "Browser result",
        html: '<p class="debug-preview-warning is-styled"><span>Matched by .warning</span> Danger!</p>',
      },
    },
    interpretation: {
      title: "What the browser sees",
      text: "Without the dot, warning is an element selector. CSS looks for a <warning> HTML element, but this page contains a <p> with a warning class.",
    },
    explanation:
      "A dot tells CSS that warning is a class name. The repaired .warning selector matches class=\"warning\" in the HTML.",
  },
  {
    id: "id-class-mismatch",
    mode: "find-and-fix",
    title: "The hero section is not selected",
    goal: "The one section identified as hero should receive the supplied hero styling.",
    files: [
      {
        name: "index.html",
        language: "HTML",
        lines: [
          ["<section ", region('id="hero"', "hero-id", "hero ID attribute"), ">"],
          "  <h1>Welcome</h1>",
          "</section>",
        ],
      },
      {
        name: "home.css",
        language: "CSS",
        lines: [
          [region(".hero", "hero-class-selector", "class selector dot hero"), " {"],
          "  /* supplied hero styling */",
          "}",
        ],
      },
    ],
    issues: [
      {
        id: "hero-selector-kind",
        regionId: "hero-class-selector",
        correctRepairId: "hero-id-selector",
        foundFeedback: "You found the selector whose prefix does not match the HTML attribute.",
        repairFeedback: "Repair applied. The ID selector now matches id=\"hero\".",
        hints: ["HTML uses an ID here. An ID selector begins with a hash."],
      },
    ],
    repairOptions: [
      { id: "hero-id-selector", label: "#hero", replacement: "#hero" },
      { id: "hero-element", label: "hero", replacement: "hero" },
      { id: "section-class", label: ".section", replacement: ".section" },
      { id: "hero-dot-hash", label: ".#hero", replacement: ".#hero" },
    ],
    preview: {
      broken: {
        title: "Hero section",
        html: '<div class="debug-preview-hero is-plain"><span>No selector match</span><strong>Welcome</strong></div>',
      },
      fixed: {
        title: "Hero section",
        html: '<div class="debug-preview-hero is-styled"><span>Matched by #hero</span><strong>Welcome</strong></div>',
      },
    },
    explanation:
      "The HTML uses id=\"hero\", so the matching simple selector is #hero. A dot would look for class=\"hero\" instead.",
  },
  {
    id: "multiple-class-meaning",
    mode: "repair",
    title: "Interpret a space inside class",
    goal: "Explain class=\"product card\" the way the browser interprets it.",
    files: [
      {
        name: "products.html",
        language: "HTML",
        lines: [
          ["<div ", region('class="product card"', "two-class-value", "class value product space card"), ">"],
          "  Red Panda",
          "</div>",
        ],
      },
    ],
    issues: [
      {
        id: "class-interpretation",
        regionId: "two-class-value",
        correctRepairId: "two-classes",
        repairPrompt: "Choose the correct interpretation",
        applyLabel: "Check interpretation",
        repairFeedback: "Correct. The space separates two class names.",
        incorrectRepairFeedback:
          "Not quite. Focus on what spaces do inside an HTML class value.",
        hints: ["Spaces separate class names inside class=\"...\"."],
      },
    ],
    repairOptions: [
      { id: "two-classes", label: "Two classes: product and card", replacement: 'class="product card"' },
      { id: "one-class", label: "One class: product card", replacement: 'class="product card"' },
      { id: "element-and-class", label: "An element named product and a class named card", replacement: 'class="product card"' },
    ],
    preview: {
      broken: {
        title: "Student's interpretation",
        html: '<div class="debug-class-reading"><span>One class?</span><strong>product card</strong></div>',
      },
      fixed: {
        title: "Browser interpretation",
        html: '<div class="debug-class-reading is-correct"><span>Class 1</span><strong>product</strong><span>Class 2</span><strong>card</strong></div>',
      },
    },
    interpretation: {
      title: "What the browser sees",
      text: "The element belongs to two separate class groups:",
      items: ["product", "card"],
    },
    explanation:
      "Spaces inside class=\"...\" separate class names. Both .product and .card can match this element and contribute styling.",
  },
  {
    id: "repeated-ids",
    mode: "find-and-fix",
    title: "Three cards reuse one ID",
    goal: "All three items need the same reusable styling role without repeating an ID.",
    files: [
      {
        name: "products.html",
        language: "HTML",
        lines: [
          ["<div ", region('id="card"', "repeated-card-id", "repeated card ID"), ">Red Panda</div>"],
          ["<div ", region('id="card"', "repeated-card-id", "repeated card ID"), ">Otter</div>"],
          ["<div ", region('id="card"', "repeated-card-id", "repeated card ID"), ">Snow Leopard</div>"],
        ],
      },
      {
        name: "products.css",
        language: "CSS",
        lines: [
          [region("#card", "card-id-selector", "card ID selector"), " {"],
          "  /* supplied card styling */",
          "}",
        ],
      },
    ],
    issues: [
      {
        id: "shared-role-needs-class",
        regionId: "repeated-card-id",
        correctRepairId: "use-card-class",
        foundFeedback: "You found the ID repeated across several elements.",
        repairFeedback: "The HTML now gives every item the reusable card class. One connected CSS problem remains.",
        hints: [
          "An ID should identify one element. Which HTML attribute is designed to be reused?",
        ],
        repairOptions: [
          { id: "use-card-class", label: 'class="card"', replacement: 'class="card"' },
          { id: "keep-id", label: 'id="card"', replacement: 'id="card"' },
          { id: "dot-in-html", label: 'class=".card"', replacement: 'class=".card"' },
          { id: "hash-in-html", label: 'id="#card"', replacement: 'id="#card"' },
        ],
      },
      {
        id: "selector-must-match-class",
        regionId: "card-id-selector",
        correctRepairId: "use-card-selector",
        foundFeedback: "You found the selector that still asks for an ID.",
        repairFeedback: "The CSS now uses .card, so it matches the reusable class on all three items.",
        hints: [
          "The repaired HTML uses class=\"card\". Which prefix selects a class?",
        ],
        repairOptions: [
          { id: "use-card-selector", label: ".card", replacement: ".card" },
          { id: "keep-card-id-selector", label: "#card", replacement: "#card" },
          { id: "use-card-element", label: "card", replacement: "card" },
        ],
      },
    ],
    preview: {
      broken: {
        title: "Page structure",
        html: '<div class="debug-id-list is-broken"><span>Duplicate ID: card</span><span>Duplicate ID: card</span><span>Duplicate ID: card</span></div>',
      },
      fixed: {
        title: "Reusable styling role",
        html: '<div class="debug-id-list is-fixed"><span>Class: card</span><span>Class: card</span><span>Class: card</span></div>',
      },
    },
    interpretation: {
      title: "What the browser sees",
      text: "Before the repair, three elements claim the same unique identifier. After the repair, all three can correctly share one reusable class.",
    },
    explanation:
      "IDs should be unique on a page. When several elements share the same styling role, class=\"card\" and the .card selector are usually the better choice.",
  },
]

function initMultipleClassDemo() {
  const demo = document.querySelector("[data-multiple-class-demo]")

  if (!demo) {
    return
  }

  const buttons = Array.from(demo.querySelectorAll("[data-class-toggle]"))
  const preview = demo.querySelector("[data-class-preview]")
  const code = demo.querySelector("[data-class-code]")
  const status = demo.querySelector("[data-class-status]")
  const active = new Set(["card", "featured"])

  function update() {
    const classNames = ["card", "featured"].filter((name) => active.has(name))

    buttons.forEach((button) => {
      const enabled = active.has(button.dataset.classToggle)
      button.setAttribute("aria-pressed", String(enabled))
      button.classList.toggle("is-active", enabled)
    })

    preview.classList.toggle("has-card-class", active.has("card"))
    preview.classList.toggle("has-featured-class", active.has("featured"))
    code.textContent = `<div${classNames.length ? ` class="${classNames.join(" ")}"` : ""}>`

    if (classNames.length === 2) {
      status.textContent = "Both classes apply: card supplies the card treatment and featured adds emphasis."
    } else if (classNames.length === 1) {
      status.textContent = `Only the ${classNames[0]} class is currently applied.`
    } else {
      status.textContent = "No classes are applied, so the element uses the plain starting appearance."
    }
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const className = button.dataset.classToggle

      if (active.has(className)) {
        active.delete(className)
      } else {
        active.add(className)
      }

      update()
    })
  })

  update()
}

function initSelectorExplorer() {
  const explorer = document.querySelector("[data-selector-explorer]")

  if (!explorer) {
    return
  }

  const buttons = Array.from(explorer.querySelectorAll("[data-selector-choice]"))
  const elements = Array.from(explorer.querySelectorAll("[data-example-element]"))
  const summary = explorer.querySelector("[data-selector-summary]")
  const count = explorer.querySelector("[data-selector-count]")

  function select(selector) {
    const match = selectorMatches[selector]

    if (!match) {
      return
    }

    buttons.forEach((button) => {
      const selected = button.dataset.selectorChoice === selector
      button.classList.toggle("is-active", selected)
      button.setAttribute("aria-pressed", String(selected))
    })

    elements.forEach((element) => {
      const matched = match.ids.includes(element.dataset.exampleElement)
      const label = element.querySelector(":scope > [data-match-label]")
      element.classList.toggle("is-selector-match", matched)
      element.setAttribute("aria-current", matched ? "true" : "false")

      if (label) {
        label.textContent = matched ? "MATCH" : ""
      }
    })

    count.textContent = `${match.ids.length} element${match.ids.length === 1 ? "" : "s"} matched`
    summary.textContent = match.summary
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => select(button.dataset.selectorChoice))
  })

  select(".card")
}

initLessonPage(lessonConfig)
initCodePreviews()
initDebugLabs(debugTasks, {
  storageKey: "lesson-css-selectors-debug-labs",
  version: 1,
})
initMultipleClassDemo()
initSelectorExplorer()
