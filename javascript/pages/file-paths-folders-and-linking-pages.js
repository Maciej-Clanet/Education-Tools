import { initCodePreviews } from "../core/code-preview.js"
import { initLessonPage } from "../core/lesson-shell.js"

const lessonConfig = {
  lessonId: "file-paths-folders-and-linking-pages",
  defaultContext: "web-development",
  contexts: {
    "web-development": {
      label: "Web Development",
      backHref: "../resources/web-development.html#html-basics",
      backLabel: "Back to Web Development resources",
      previous: {
        title: "Parent and child relationships in HTML",
        href: "parent-child-relationships-in-html.html",
        description:
          "The previous lesson covered nesting, indentation, parent and child relationships, and grouping with div.",
        status: "Live",
      },
      next: {
        title: "Forms 1: Inputs, labels, and submitting data",
        href: "forms-1-inputs-labels-and-submitting-data.html",
        description:
          "Next, start HTML forms with input, processing, output, labels, id, name, required fields, and submit.",
        status: "Live",
      },
    },
  },
  quiz: {
    storageKey: "lesson-file-paths-folders-and-linking-pages-quiz",
    passScore: 9,
  },
}

const treeData = {
  name: "animal-site",
  path: "",
  type: "folder",
  children: [
    { name: "index.html", path: "index.html", type: "file" },
    {
      name: "images",
      path: "images",
      type: "folder",
      children: [
        { name: "logo.png", path: "images/logo.png", type: "file" },
        { name: "panda.jpg", path: "images/panda.jpg", type: "file" },
      ],
    },
    {
      name: "pages",
      path: "pages",
      type: "folder",
      children: [
        { name: "pandas.html", path: "pages/pandas.html", type: "file" },
        { name: "contact.html", path: "pages/contact.html", type: "file" },
        {
          name: "team",
          path: "pages/team",
          type: "folder",
          children: [
            {
              name: "keepers.html",
              path: "pages/team/keepers.html",
              type: "file",
            },
          ],
        },
      ],
    },
    {
      name: "facts",
      path: "facts",
      type: "folder",
      children: [
        { name: "red-pandas.html", path: "facts/red-pandas.html", type: "file" },
      ],
    },
  ],
}

const selectableFiles = [
  "index.html",
  "images/logo.png",
  "images/panda.jpg",
  "pages/pandas.html",
  "pages/contact.html",
  "pages/team/keepers.html",
  "facts/red-pandas.html",
]

const explorerExamples = [
  {
    current: "index.html",
    target: "images/panda.jpg",
  },
  {
    current: "pages/pandas.html",
    target: "images/panda.jpg",
  },
  {
    current: "pages/contact.html",
    target: "pages/pandas.html",
  },
  {
    current: "facts/red-pandas.html",
    target: "pages/contact.html",
  },
  {
    current: "pages/team/keepers.html",
    target: "images/logo.png",
  },
]

const challenges = [
  {
    level: "Level 1: same folder",
    current: "pages/contact.html",
    target: "pages/pandas.html",
    prompt: "Link from the contact page to the pandas page beside it.",
  },
  {
    level: "Level 2: go into one folder",
    current: "index.html",
    target: "images/panda.jpg",
    prompt: "Find an image from the home page.",
  },
  {
    level: "Level 3: go into nested folders",
    current: "index.html",
    target: "pages/team/keepers.html",
    prompt: "Link from the home page to a page inside a nested folder.",
  },
  {
    level: "Level 4: go up with ../",
    current: "pages/pandas.html",
    target: "index.html",
    prompt: "Link from a page inside pages back to the home page.",
  },
  {
    level: "Level 5: go up, then into another folder",
    current: "pages/pandas.html",
    target: "images/logo.png",
    prompt: "Find the logo image from a page inside the pages folder.",
  },
  {
    level: "Level 6: link between HTML pages in different folders",
    current: "facts/red-pandas.html",
    target: "pages/contact.html",
    prompt: "Link from a facts page to the contact page.",
  },
  {
    level: "Level 7: go up twice",
    current: "pages/team/keepers.html",
    target: "images/panda.jpg",
    prompt: "Find an image from a page inside a nested team folder.",
  },
]

function parts(path) {
  return path ? path.split("/").filter(Boolean) : []
}

function folderOf(filePath) {
  const fileParts = parts(filePath)
  fileParts.pop()
  return fileParts
}

function relativePath(fromFile, targetFile) {
  const fromParts = folderOf(fromFile)
  const targetParts = parts(targetFile)
  let shared = 0

  while (
    shared < fromParts.length &&
    shared < targetParts.length &&
    fromParts[shared] === targetParts[shared]
  ) {
    shared += 1
  }

  const upSteps = Array.from({ length: fromParts.length - shared }, () => "..")
  const downSteps = targetParts.slice(shared)

  return [...upSteps, ...downSteps].join("/") || targetParts.at(-1) || ""
}

function parentFolders(path) {
  const pathParts = parts(path)
  const folders = []

  pathParts.slice(0, -1).forEach((_, index) => {
    folders.push(pathParts.slice(0, index + 1).join("/"))
  })

  return folders
}

function routeNodes(current, target) {
  return new Set(["", current, target, ...parentFolders(current), ...parentFolders(target)])
}

function describeStart(current) {
  const folder = folderOf(current).join("/")
  return folder ? `${folder}/` : "animal-site/"
}

function routeSteps(current, target) {
  const fromParts = folderOf(current)
  const targetParts = parts(target)
  let shared = 0

  while (
    shared < fromParts.length &&
    shared < targetParts.length &&
    fromParts[shared] === targetParts[shared]
  ) {
    shared += 1
  }

  const steps = [`Start from ${current}. Ask: where am I starting from?`]

  for (let index = fromParts.length - 1; index >= shared; index -= 1) {
    steps.push(`Go up/out of ${fromParts.slice(0, index + 1).join("/")}/.`)
  }

  targetParts.slice(shared, -1).forEach((folderName, index) => {
    const folderPath = targetParts.slice(0, shared + index + 1).join("/")
    steps.push(`Go into ${folderPath}/.`)
  })

  steps.push(`Find ${targetParts.at(-1)}.`)
  return steps
}

function pathExists(path) {
  return path === "" || selectableFiles.includes(path) || findFolder(path)
}

function findFolder(folderPath, node = treeData) {
  if (folderPath === "") {
    return treeData
  }

  if (node.type !== "folder") {
    return null
  }

  for (const child of node.children ?? []) {
    if (child.path === folderPath && child.type === "folder") {
      return child
    }

    const found = findFolder(folderPath, child)

    if (found) {
      return found
    }
  }

  return null
}

function renderTreeNode(node, context, depth = 0) {
  const wrapper = document.createElement("div")
  wrapper.className = "path-tree__row"
  wrapper.style.setProperty("--tree-depth", String(depth))

  const item = document.createElement("span")
  item.className = `path-tree__item path-tree__item--${node.type}`
  item.dataset.treePath = node.path

  if (context.route.has(node.path)) {
    item.classList.add("is-route")
  }

  if (node.path === context.current) {
    item.classList.add("is-current")
  }

  if (node.path === context.target) {
    item.classList.add("is-target")
  }

  if (node.path && node.path === context.lookup) {
    item.classList.add("is-lookup")
  }

  const icon = document.createElement("span")
  icon.className = "path-tree__icon"
  icon.textContent = node.type === "folder" ? "/" : "file"

  const name = document.createElement("span")
  name.className = "path-tree__name"
  name.textContent = node.path === "" ? `${node.name}/` : node.name

  item.append(icon, name)

  const labels = []

  if (node.path === context.current) {
    labels.push("Current file")
  }

  if (node.path === context.target) {
    labels.push("Target file")
  }

  if (node.path && node.path === context.lookup) {
    labels.push("Browser looks here")
  }

  if (labels.length) {
    const badge = document.createElement("span")
    badge.className = "path-tree__badge"
    badge.textContent = labels.join(" and ")
    item.append(badge)
  }

  wrapper.append(item)

  if (node.children?.length) {
    const children = document.createElement("div")
    children.className = "path-tree__children"
    node.children.forEach((child) => {
      children.append(renderTreeNode(child, context, depth + 1))
    })
    wrapper.append(children)
  }

  return wrapper
}

function renderFolderTree(container, current, target, lookup = "") {
  const route = routeNodes(current, target)
  container.replaceChildren(
    renderTreeNode(treeData, {
      current,
      target,
      lookup,
      route,
    })
  )
}

function populateSelect(select, files) {
  files.forEach((file) => {
    const option = document.createElement("option")
    option.value = file
    option.textContent = file
    select.append(option)
  })
}

function renderSteps(list, steps) {
  list.replaceChildren(
    ...steps.map((step) => {
      const item = document.createElement("li")
      item.textContent = step
      return item
    })
  )
}

function initPathExplorer() {
  const explorer = document.querySelector("[data-path-explorer]")

  if (!explorer) {
    return
  }

  const currentSelect = explorer.querySelector("[data-path-current]")
  const targetSelect = explorer.querySelector("[data-path-target]")
  const tree = explorer.querySelector("[data-folder-tree]")
  const output = explorer.querySelector("[data-generated-path]")
  const startOutput = explorer.querySelector("[data-start-folder]")
  const routeList = explorer.querySelector("[data-route-steps]")
  const routeText = explorer.querySelector("[data-route-text]")

  populateSelect(currentSelect, selectableFiles.filter((file) => file.endsWith(".html")))
  populateSelect(targetSelect, selectableFiles)

  currentSelect.value = explorerExamples[1].current
  targetSelect.value = explorerExamples[1].target

  function update() {
    const current = currentSelect.value
    const target = targetSelect.value
    const path = relativePath(current, target)
    const steps = routeSteps(current, target)

    output.textContent = path
    startOutput.textContent = describeStart(current)
    renderFolderTree(tree, current, target)
    renderSteps(routeList, steps)
    routeText.textContent = `From ${current} to ${target}, the relative path is ${path}. ${steps.join(" ")}`
  }

  currentSelect.addEventListener("change", update)
  targetSelect.addEventListener("change", update)
  update()
}

function resolveSubmittedPath(current, submitted) {
  const value = submitted.trim()

  if (!value) {
    return { kind: "empty", resolved: "", outsideProject: false }
  }

  if (/^[a-zA-Z]:\\/.test(value)) {
    return { kind: "local", resolved: value, outsideProject: true }
  }

  if (/^https?:\/\//i.test(value)) {
    return { kind: "external", resolved: value, outsideProject: true }
  }

  const startsAtRoot = value.startsWith("/")
  const baseParts = startsAtRoot ? [] : folderOf(current)
  const pathParts = value.split("/")

  for (const part of pathParts) {
    if (!part || part === ".") {
      continue
    }

    if (part === "..") {
      if (baseParts.length === 0) {
        return {
          kind: "relative",
          resolved: value,
          outsideProject: true,
        }
      }

      baseParts.pop()
      continue
    }

    baseParts.push(part)
  }

  return {
    kind: startsAtRoot ? "root-relative" : "relative",
    resolved: baseParts.join("/"),
    outsideProject: false,
  }
}

function feedbackForMistake(challenge, submitted, resolvedResult, expected) {
  const value = submitted.trim()

  if (!value) {
    return "Type a path first. Start by asking where the current HTML file is."
  }

  if (value.includes("\\")) {
    return "This uses a backslash. Website paths normally use /, such as images/panda.jpg."
  }

  if (resolvedResult.kind === "local") {
    return "This points to a place on one computer, not to a file inside the website project."
  }

  if (resolvedResult.kind === "external") {
    return "This is a complete web address. This challenge is asking for a path inside the animal-site project."
  }

  if (resolvedResult.kind === "root-relative") {
    return `That starts from the website root. It may reach ${resolvedResult.resolved}, but this challenge is practising normal relative paths. Try ${expected}.`
  }

  if (resolvedResult.outsideProject) {
    return "That path goes up too many folder levels and leaves the animal-site project."
  }

  if (resolvedResult.resolved === challenge.target) {
    return `That reaches the target, but the expected relative path here is ${expected}.`
  }

  if (!pathExists(resolvedResult.resolved)) {
    return `The browser would look for ${resolvedResult.resolved || "the current folder"}, but that file is not in the project tree.`
  }

  return `That path reaches ${resolvedResult.resolved}, but the target is ${challenge.target}.`
}

function initPathChallenge() {
  const activity = document.querySelector("[data-path-challenge]")

  if (!activity) {
    return
  }

  const level = activity.querySelector("[data-challenge-level]")
  const prompt = activity.querySelector("[data-challenge-prompt]")
  const currentOutput = activity.querySelector("[data-challenge-current]")
  const targetOutput = activity.querySelector("[data-challenge-target]")
  const expectedOutput = activity.querySelector("[data-challenge-expected]")
  const tree = activity.querySelector("[data-folder-tree]")
  const form = activity.querySelector("[data-challenge-form]")
  const input = activity.querySelector("[data-path-answer]")
  const feedback = activity.querySelector("[data-challenge-feedback]")
  const debug = activity.querySelector("[data-debug-output]")
  const routeList = activity.querySelector("[data-challenge-route]")
  const previousButton = activity.querySelector("[data-action='previous-challenge']")
  const nextButton = activity.querySelector("[data-action='next-challenge']")
  let activeIndex = 0

  function renderChallenge(lookup = "") {
    const challenge = challenges[activeIndex]
    const expected = relativePath(challenge.current, challenge.target)

    level.textContent = challenge.level
    prompt.textContent = challenge.prompt
    currentOutput.textContent = challenge.current
    targetOutput.textContent = challenge.target
    expectedOutput.textContent = ""
    debug.textContent = "Check a path to see where the browser would look."
    feedback.textContent = "Build the path, then check it."
    input.value = ""
    renderFolderTree(tree, challenge.current, challenge.target, lookup)
    renderSteps(routeList, routeSteps(challenge.current, challenge.target))
    previousButton.disabled = activeIndex === 0
    nextButton.disabled = activeIndex === challenges.length - 1
  }

  function checkAnswer() {
    const challenge = challenges[activeIndex]
    const expected = relativePath(challenge.current, challenge.target)
    const submitted = input.value.trim()
    const resolvedResult = resolveSubmittedPath(challenge.current, submitted)
    const isExact = submitted === expected

    if (isExact) {
      feedback.textContent = `Correct. ${expected} starts from ${challenge.current} and reaches ${challenge.target}.`
      debug.textContent = "Route traced: " + routeSteps(challenge.current, challenge.target).join(" ")
      expectedOutput.textContent = expected
      renderFolderTree(tree, challenge.current, challenge.target)
      activity.classList.add("is-correct")
      activity.classList.remove("is-incorrect")
      return
    }

    const lookup =
      !resolvedResult.outsideProject &&
      resolvedResult.kind !== "external" &&
      resolvedResult.kind !== "local"
        ? resolvedResult.resolved
        : ""

    feedback.textContent = feedbackForMistake(
      challenge,
      submitted,
      resolvedResult,
      expected
    )
    debug.textContent =
      resolvedResult.kind === "empty"
        ? "No path entered yet."
        : `Browser looks here: ${resolvedResult.resolved}. Target: ${challenge.target}.`
    expectedOutput.textContent = expected
    renderFolderTree(tree, challenge.current, challenge.target, lookup)
    activity.classList.add("is-incorrect")
    activity.classList.remove("is-correct")
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault()
    checkAnswer()
  })

  previousButton.addEventListener("click", () => {
    activeIndex = Math.max(activeIndex - 1, 0)
    renderChallenge()
  })

  nextButton.addEventListener("click", () => {
    activeIndex = Math.min(activeIndex + 1, challenges.length - 1)
    renderChallenge()
  })

  renderChallenge()
}

initLessonPage(lessonConfig)
initCodePreviews()
initPathExplorer()
initPathChallenge()
