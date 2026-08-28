import { initCodePreviews } from "../core/code-preview.js"
import { initLessonPage } from "../core/lesson-shell.js"

const lessonConfig = {
  lessonId: "parent-child-relationships-in-html",
  defaultContext: "web-development",
  contexts: {
    "web-development": {
      label: "Web Development",
      backHref: "../resources/web-development.html#html-basics",
      backLabel: "Back to Web Development resources",
      previous: {
        title: "Images, alt text, and useful page sections",
        href: "images-alt-text-and-useful-page-sections.html",
        description:
          "The previous lesson covered images, void elements, and useful semantic containers.",
        status: "Live",
      },
      next: {
        title: "File paths, folders, and linking pages",
        href: "file-paths-folders-and-linking-pages.html",
        description:
          "Learn how paths tell the browser where to find images, resources, and other HTML pages.",
        status: "Live",
      },
    },
  },
  quiz: {
    storageKey: "lesson-parent-child-relationships-in-html-quiz-v2",
    passScore: 8,
    version: 2,
  },
  examPractice: {
    storageKey: "lesson-parent-child-relationships-in-html-practice",
  },
}

const nodeData = {
  header: {
    label: "header",
    parent: null,
    children: ["logo", "nav"],
  },
  logo: {
    label: "img",
    parent: "header",
    children: [],
  },
  nav: {
    label: "nav",
    parent: "header",
    children: ["home", "about", "contact"],
  },
  home: {
    label: "Home link",
    parent: "nav",
    children: [],
  },
  about: {
    label: "About link",
    parent: "nav",
    children: [],
  },
  contact: {
    label: "Contact link",
    parent: "nav",
    children: [],
  },
}

function collectDescendants(nodeId) {
  return nodeData[nodeId].children.flatMap((childId) => [
    childId,
    ...collectDescendants(childId),
  ])
}

function getSiblings(nodeId) {
  const parentId = nodeData[nodeId].parent

  if (!parentId) {
    return []
  }

  return nodeData[parentId].children.filter((childId) => childId !== nodeId)
}

function labelsFor(nodeIds) {
  return nodeIds.length
    ? nodeIds.map((nodeId) => nodeData[nodeId].label).join(", ")
    : "None"
}

function initNestingExplorer() {
  const explorer = document.querySelector("[data-nesting-explorer]")

  if (!explorer) {
    return
  }

  const visualNodes = Array.from(explorer.querySelectorAll("[data-node-id]"))
  const selectorButtons = Array.from(
    explorer.querySelectorAll("[data-select-node]")
  )
  const reports = new Map(
    Array.from(explorer.querySelectorAll("[data-report]")).map((element) => [
      element.dataset.report,
      element,
    ])
  )

  function selectNode(nodeId) {
    const selected = nodeData[nodeId]

    if (!selected) {
      return
    }

    const children = selected.children
    const siblings = getSiblings(nodeId)
    const descendants = collectDescendants(nodeId)

    visualNodes.forEach((node) => {
      const visualId = node.dataset.nodeId
      const relationLabel = node.querySelector(":scope > [data-node-relation]")
      let relationship = ""

      node.classList.remove(
        "is-selected",
        "is-parent",
        "is-child",
        "is-sibling",
        "is-descendant"
      )

      if (visualId === nodeId) {
        node.classList.add("is-selected")
        relationship = "Selected"
      } else if (visualId === selected.parent) {
        node.classList.add("is-parent")
        relationship = "Parent"
      } else if (children.includes(visualId)) {
        node.classList.add("is-child")
        relationship = "Direct child"
      } else if (siblings.includes(visualId)) {
        node.classList.add("is-sibling")
        relationship = "Sibling"
      } else if (descendants.includes(visualId)) {
        node.classList.add("is-descendant")
        relationship = "Descendant"
      }

      if (relationLabel) {
        relationLabel.textContent = relationship
      }
    })

    selectorButtons.forEach((button) => {
      button.setAttribute(
        "aria-pressed",
        button.dataset.selectNode === nodeId ? "true" : "false"
      )
    })

    reports.get("selected").textContent = selected.label
    reports.get("parent").textContent = selected.parent
      ? nodeData[selected.parent].label
      : "None — this is the outermost element"
    reports.get("children").textContent = labelsFor(children)
    reports.get("siblings").textContent = labelsFor(siblings)
    reports.get("descendants").textContent = labelsFor(descendants)
  }

  selectorButtons.forEach((button) => {
    button.addEventListener("click", () => selectNode(button.dataset.selectNode))
  })

  selectNode("nav")
}

function initParentMovement() {
  const demo = document.querySelector("[data-parent-move-demo]")

  if (!demo) {
    return
  }

  const slider = demo.querySelector("[data-parent-gap]")
  const output = demo.querySelector("[data-parent-gap-output]")
  const status = demo.querySelector("[data-parent-move-status]")
  const stage = demo.querySelector("[data-parent-stage]")

  function update() {
    const amount = Number(slider.value)
    stage.style.setProperty("--parent-shift", `${amount}px`)
    output.value = `${amount} pixels`
    output.textContent = `${amount} pixels`
    status.textContent = `Parent B is ${amount} pixels farther across; its heading, paragraph, and button moved with it.`
  }

  slider.addEventListener("input", update)
  update()
}

function initHeaderLayout() {
  const demo = document.querySelector("[data-header-layout-demo]")

  if (!demo) {
    return
  }

  const button = demo.querySelector("[data-arrange-header]")
  const header = demo.querySelector("[data-demo-header]")
  const status = demo.querySelector("[data-header-layout-status]")
  let rowLayout = false

  button.addEventListener("click", () => {
    rowLayout = !rowLayout
    header.classList.toggle("is-row-layout", rowLayout)
    button.setAttribute("aria-pressed", String(rowLayout))
    button.textContent = rowLayout
      ? "Return header children to a stack"
      : "Arrange header children in a row"
    status.textContent = rowLayout
      ? "The image and nav moved beside each other. The links stayed grouped in their own vertical nav layout."
      : "The image and nav are stacked. The links remain grouped inside nav."
  })
}

function initClosingActivity() {
  const activity = document.querySelector("[data-closing-activity]")

  if (!activity) {
    return
  }

  const buttons = Array.from(activity.querySelectorAll("[data-closing-choice]"))
  const feedback = activity.querySelector("[data-closing-feedback]")

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const isCorrect = button.dataset.closingChoice === "p"

      buttons.forEach((option) => {
        option.classList.remove("is-correct", "is-incorrect")
        option.removeAttribute("aria-current")
      })

      button.classList.add(isCorrect ? "is-correct" : "is-incorrect")
      button.setAttribute("aria-current", "true")
      feedback.textContent = isCorrect
        ? "Correct. The paragraph opened most recently, so </p> comes next. After that: </section>, then </article>."
        : "Not yet. That would close an outer element while the paragraph is still open. Close </p> first."
    })
  })
}

initLessonPage(lessonConfig)
initCodePreviews()
initNestingExplorer()
initParentMovement()
initHeaderLayout()
initClosingActivity()
