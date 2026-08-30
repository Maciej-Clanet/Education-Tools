import { readStorage, writeStorage } from "./storage.js"

const VALID_MODES = new Set(["find", "repair", "find-and-fix"])

function createElement(tagName, className = "", text = "") {
  const element = document.createElement(tagName)

  if (className) {
    element.className = className
  }

  if (text) {
    element.textContent = text
  }

  return element
}

function getModeLabel(mode) {
  if (mode === "find") {
    return "Find the bug"
  }

  if (mode === "repair") {
    return "Choose the repair"
  }

  return "Find and fix"
}

function getIssueRegionIds(issue) {
  if (Array.isArray(issue.regionIds)) {
    return issue.regionIds
  }

  return issue.regionId ? [issue.regionId] : []
}

function getRepairOptions(task, issue) {
  return issue.repairOptions ?? task.repairOptions ?? []
}

function getCorrectRepair(task, issue) {
  return getRepairOptions(task, issue).find(
    (option) => option.id === issue.correctRepairId
  )
}

function getCurrentIssue(task, state) {
  if (state.currentIssueId) {
    const current = task.issues.find(
      (issue) => issue.id === state.currentIssueId
    )

    if (current && !state.solvedIssueIds.has(current.id)) {
      return current
    }
  }

  return task.issues.find((issue) => !state.solvedIssueIds.has(issue.id)) ?? null
}

function buildProcess(state, task) {
  const list = createElement("ol", "debug-lab__process")
  const issue = getCurrentIssue(task, state)
  const isComplete = state.solvedIssueIds.size === task.issues.length
  const locateNeeded = task.mode !== "repair"
  const repairNeeded = task.mode !== "find"
  const steps = [
    { label: "Observe", state: "done" },
    {
      label: "Locate",
      state:
        !locateNeeded || state.locatedIssueId || isComplete
          ? "done"
          : "current",
    },
    {
      label: "Repair",
      state: !repairNeeded
        ? "skipped"
        : isComplete
          ? "done"
          : state.locatedIssueId || task.mode === "repair"
            ? "current"
            : "waiting",
    },
    {
      label: "Test",
      state: isComplete
        ? "done"
        : state.selectedRepairId && issue
          ? "current"
          : "waiting",
    },
    { label: "Understand", state: isComplete ? "done" : "waiting" },
  ]

  steps.forEach((step) => {
    const item = createElement("li", `debug-lab__process-step is-${step.state}`)
    item.textContent = step.label
    item.dataset.stepState = step.state
    list.append(item)
  })

  return list
}

function getRegionReplacement(task, state, regionId) {
  const solvedIssue = task.issues.find(
    (issue) =>
      state.solvedIssueIds.has(issue.id) &&
      getIssueRegionIds(issue).includes(regionId)
  )

  return solvedIssue ? getCorrectRepair(task, solvedIssue)?.replacement : null
}

function createRegion(segment, task, state) {
  const replacement = getRegionReplacement(task, state, segment.regionId)

  if (replacement !== null && replacement !== undefined) {
    const repaired = createElement(
      "span",
      "debug-lab__region debug-lab__region--repaired",
      replacement
    )
    repaired.setAttribute("aria-label", `${segment.label}. Repaired.`)
    return repaired
  }

  const button = createElement(
    "button",
    "debug-lab__region",
    segment.text
  )
  const isSelected = state.selectedRegionId === segment.regionId
  const isLocated = state.locatedIssueId
    ? getIssueRegionIds(
        task.issues.find((issue) => issue.id === state.locatedIssueId) ?? {}
      ).includes(segment.regionId)
    : false

  button.type = "button"
  button.dataset.debugRegion = segment.regionId
  button.dataset.regionLabel = segment.label
  button.setAttribute("aria-label", `Select code region: ${segment.label}`)
  button.setAttribute("aria-pressed", String(isSelected || isLocated))
  button.classList.toggle("is-selected", isSelected)
  button.classList.toggle("is-located", isLocated)
  button.disabled = Boolean(isLocated) || task.mode === "repair"

  return button
}

function buildFiles(task, state) {
  const files = createElement("div", "debug-lab__files")

  task.files.forEach((file) => {
    const panel = createElement("article", "debug-lab__file")
    const heading = createElement("div", "debug-lab__file-heading")
    const name = createElement("strong", "", file.name)
    const language = createElement(
      "span",
      "debug-lab__language",
      file.language ?? "Code"
    )
    const pre = createElement("pre", "debug-lab__code")
    const code = document.createElement("code")

    heading.append(name, language)

    file.lines.forEach((line, lineIndex) => {
      const row = createElement("span", "debug-lab__code-line")
      const number = createElement(
        "span",
        "debug-lab__line-number",
        String(lineIndex + 1)
      )
      const content = createElement("span", "debug-lab__line-content")

      number.setAttribute("aria-hidden", "true")

      if (typeof line === "string") {
        content.textContent = line || " "
      } else {
        line.forEach((segment) => {
          if (typeof segment === "string") {
            content.append(document.createTextNode(segment))
          } else if (segment.regionId) {
            content.append(createRegion(segment, task, state))
          } else {
            content.append(document.createTextNode(segment.text ?? ""))
          }
        })
      }

      row.append(number, content)
      code.append(row)
    })

    pre.append(code)
    panel.append(heading, pre)
    files.append(panel)
  })

  return files
}

function buildPreviewState(previewState) {
  const content = createElement("div", "debug-lab__preview-content")

  if (previewState?.html) {
    content.innerHTML = previewState.html
  } else if (previewState?.expected !== undefined) {
    const comparison = createElement("dl", "debug-lab__result-comparison")
    const expectedRow = document.createElement("div")
    const actualRow = document.createElement("div")
    expectedRow.append(
      createElement("dt", "", "Expected"),
      createElement("dd", "", String(previewState.expected))
    )
    actualRow.append(
      createElement("dt", "", "Actual"),
      createElement("dd", "", String(previewState.actual))
    )
    comparison.append(expectedRow, actualRow)
    content.append(comparison)
  } else {
    content.textContent = previewState?.description ?? "No preview supplied."
  }

  return content
}

function buildPreview(task, state) {
  if (!task.preview) {
    return null
  }

  const complete = state.solvedIssueIds.size === task.issues.length
  const previewState = complete ? task.preview.fixed : task.preview.broken
  const panel = createElement(
    "article",
    `debug-lab__preview ${complete ? "is-fixed" : "is-broken"}`
  )
  const heading = createElement("div", "debug-lab__preview-heading")
  const status = createElement(
    "span",
    "debug-lab__preview-state",
    complete ? "FIXED" : "BROKEN"
  )
  const title = createElement(
    "strong",
    "",
    previewState?.title ?? "Result preview"
  )

  heading.append(status, title)
  panel.append(heading, buildPreviewState(previewState))
  panel.setAttribute("aria-live", "polite")
  panel.setAttribute("aria-atomic", "true")

  return panel
}

function buildRepairPanel(task, state, issue) {
  if (!issue || task.mode === "find") {
    return null
  }

  const panel = createElement("fieldset", "debug-lab__repair-panel")
  const legend = createElement(
    "legend",
    "",
    issue.repairPrompt ?? "Choose a repair"
  )
  const options = createElement("div", "debug-lab__repair-options")

  getRepairOptions(task, issue).forEach((option) => {
    const button = createElement("button", "debug-lab__repair-option")
    const code = createElement("code", "", option.label)
    const description = createElement("span", "", option.description ?? "")
    const selected = state.selectedRepairId === option.id

    button.type = "button"
    button.dataset.debugRepair = option.id
    button.setAttribute("aria-pressed", String(selected))
    button.classList.toggle("is-selected", selected)
    button.append(code)

    if (option.description) {
      button.append(description)
    }

    options.append(button)
  })

  panel.append(legend, options)
  return panel
}

function buildInterpretation(task) {
  if (!task.interpretation) {
    return null
  }

  const panel = createElement("aside", "debug-lab__interpretation")
  panel.append(
    createElement(
      "strong",
      "",
      task.interpretation.title ?? "What the browser or computer sees"
    )
  )

  if (task.interpretation.text) {
    panel.append(createElement("p", "", task.interpretation.text))
  }

  if (task.interpretation.items?.length) {
    const list = document.createElement("ul")
    task.interpretation.items.forEach((item) => {
      const entry = document.createElement("li")
      const code = createElement("code", "", item)
      entry.append(code)
      list.append(entry)
    })
    panel.append(list)
  }

  return panel
}

function buildCompletion(task) {
  const panel = createElement("section", "debug-lab__understanding")
  panel.tabIndex = -1
  panel.append(
    createElement("p", "debug-lab__complete-label", "UNDERSTAND"),
    createElement("h4", "", task.explanationTitle ?? "Why the repair works"),
    createElement("p", "", task.explanation)
  )

  const interpretation = buildInterpretation(task)

  if (interpretation) {
    panel.append(interpretation)
  }

  return panel
}

function initDebugLab(root, task, persistedState, saveState) {
  task.mode = VALID_MODES.has(task.mode) ? task.mode : "find-and-fix"
  task.issues = task.issues ?? []

  const state = {
    solvedIssueIds: new Set(
      (persistedState?.solvedIssueIds ?? []).filter((id) =>
        task.issues.some((issue) => issue.id === id)
      )
    ),
    selectedRegionId: null,
    locatedIssueId: null,
    selectedRepairId: null,
    hintIndex: -1,
    status: "Examine the code and follow the debugging steps.",
    statusKind: "neutral",
  }
  const announcer = createElement("p", "sr-only")
  announcer.setAttribute("role", "status")
  announcer.setAttribute("aria-live", "polite")
  announcer.setAttribute("aria-atomic", "true")
  root.after(announcer)

  if (task.mode === "repair") {
    state.locatedIssueId = getCurrentIssue(task, state)?.id ?? null
  }

  function persist() {
    saveState(task.id, {
      solvedIssueIds: Array.from(state.solvedIssueIds),
    })
  }

  function resetTransientState() {
    state.selectedRegionId = null
    state.selectedRepairId = null
    state.hintIndex = -1
    state.locatedIssueId =
      task.mode === "repair" ? getCurrentIssue(task, state)?.id ?? null : null
  }

  function setStatus(message, kind = "neutral") {
    state.status = message
    state.statusKind = kind
    announcer.textContent = ""
    window.requestAnimationFrame(() => {
      announcer.textContent = message
    })
  }

  function focusControl(selector) {
    root.querySelector(selector)?.focus()
  }

  function focusNextStep() {
    if (state.solvedIssueIds.size === task.issues.length) {
      focusControl(".debug-lab__understanding")
      return
    }

    if (task.mode === "repair" || state.locatedIssueId) {
      focusControl("[data-debug-repair]")
      return
    }

    focusControl("[data-debug-region]:not(:disabled)")
  }

  function solveIssue(issue, message) {
    state.solvedIssueIds.add(issue.id)
    resetTransientState()

    if (state.solvedIssueIds.size === task.issues.length) {
      setStatus(
        message ?? "Repair tested successfully. The expected result now appears.",
        "success"
      )
    } else {
      setStatus(
        `${message ?? "Repair tested successfully."} Continue with the next problem.`,
        "success"
      )
    }

    persist()
  }

  function checkLocation() {
    if (!state.selectedRegionId) {
      setStatus("Select a code region before checking its location.", "warning")
      render()
      focusControl("[data-debug-action='check-location']")
      return
    }

    const issue = task.issues.find(
      (candidate) =>
        !state.solvedIssueIds.has(candidate.id) &&
        getIssueRegionIds(candidate).includes(state.selectedRegionId)
    )

    if (!issue) {
      setStatus(
        task.incorrectLocationFeedback ??
          "That region does not explain the problem. Compare the code with the expected behaviour and try again.",
        "error"
      )
      render()
      focusControl(
        `[data-debug-region="${CSS.escape(state.selectedRegionId)}"]`
      )
      return
    }

    state.locatedIssueId = issue.id
    state.selectedRepairId = null
    state.hintIndex = -1

    if (task.mode === "find") {
      solveIssue(
        issue,
        issue.foundFeedback ?? "You located the problem correctly."
      )
    } else {
      setStatus(
        issue.foundFeedback ??
          "You located the problem. Now choose the repair that matches the goal.",
        "success"
      )
    }

    render()
    focusNextStep()
  }

  function applyRepair() {
    const issue = getCurrentIssue(task, state)

    if (!issue || !state.selectedRepairId) {
      setStatus("Choose a repair before testing it.", "warning")
      render()
      focusControl("[data-debug-repair]")
      return
    }

    if (state.selectedRepairId !== issue.correctRepairId) {
      setStatus(
        issue.incorrectRepairFeedback ??
          "That repair does not produce the expected result. Re-read the HTML and selector, then try another option.",
        "error"
      )
      render()
      focusControl(
        `[data-debug-repair="${CSS.escape(state.selectedRepairId)}"]`
      )
      return
    }

    solveIssue(
      issue,
      issue.repairFeedback ??
        "Repair applied and tested. The expected result now appears."
    )
    render()
    focusNextStep()
  }

  function showHint() {
    const issue = getCurrentIssue(task, state)
    const hints = issue?.hints ?? task.hints ?? []

    if (!hints.length) {
      setStatus("No extra hint is available for this task.", "neutral")
      render()
      focusControl("[data-debug-action='hint']")
      return
    }

    state.hintIndex = Math.min(state.hintIndex + 1, hints.length - 1)
    setStatus(
      `Hint ${state.hintIndex + 1} of ${hints.length}: ${hints[state.hintIndex]}`,
      "hint"
    )
    render()
    focusControl("[data-debug-action='hint']")
  }

  function showSolution() {
    const issue = getCurrentIssue(task, state)

    if (!issue) {
      return
    }

    solveIssue(
      issue,
      issue.solutionFeedback ??
        "Solution shown. Compare the repaired code with the original, then read why it works."
    )
    render()
    focusNextStep()
  }

  function resetTask() {
    state.solvedIssueIds.clear()
    resetTransientState()
    setStatus("Task reset. Examine the code and try the debugging steps again.")
    persist()
    render()
    focusNextStep()
  }

  function render() {
    const complete = state.solvedIssueIds.size === task.issues.length
    const issue = getCurrentIssue(task, state)
    const shell = createElement(
      "article",
      `debug-lab ${complete ? "is-complete" : "is-in-progress"}`
    )
    const header = createElement("header", "debug-lab__header")
    const headingGroup = document.createElement("div")
    const mode = createElement(
      "p",
      "debug-lab__mode",
      `DEBUG LAB · ${getModeLabel(task.mode).toUpperCase()}`
    )
    const title = createElement("h3", "", task.title)
    const count = createElement(
      "p",
      "debug-lab__count",
      `${task.mode === "find" ? "Problems found" : "Problems repaired"}: ${state.solvedIssueIds.size} / ${task.issues.length}`
    )
    const goal = createElement("section", "debug-lab__goal")
    const goalLabel = createElement("strong", "", "Expected behaviour")
    const goalText = createElement("p", "", task.goal)
    const workArea = createElement("div", "debug-lab__workspace")
    const codeArea = createElement("div", "debug-lab__code-area")
    const sideArea = createElement("div", "debug-lab__side-area")
    const selectionStatus = createElement("p", "debug-lab__selection-status")
    const feedback = createElement(
      "p",
      `debug-lab__feedback is-${state.statusKind}`,
      state.status
    )
    const actions = createElement("div", "debug-lab__actions")
    const hintButton = createElement("button", "lesson-secondary-action", "Hint")
    const solutionButton = createElement(
      "button",
      "lesson-secondary-action",
      "Show solution"
    )
    const resetButton = createElement(
      "button",
      "lesson-secondary-action",
      "Reset task"
    )

    shell.dataset.debugLabTask = task.id
    shell.dataset.noSlideAdvance = ""
    headingGroup.append(mode, title)
    header.append(headingGroup, count)
    goal.append(goalLabel, goalText)
    codeArea.append(buildFiles(task, state))

    if (task.mode !== "repair" && !complete && !state.locatedIssueId) {
      const checkButton = createElement(
        "button",
        "debug-lab__primary-action",
        "Check location"
      )
      checkButton.type = "button"
      checkButton.dataset.debugAction = "check-location"
      codeArea.append(checkButton)
    }

    if (state.selectedRegionId) {
      const regionButton = shell.querySelector(
        `[data-debug-region="${CSS.escape(state.selectedRegionId)}"]`
      )
      selectionStatus.textContent = `Selected region: ${regionButton?.dataset.regionLabel ?? state.selectedRegionId}`
    } else if (state.locatedIssueId && !complete) {
      selectionStatus.textContent = "Problem region located. Choose a repair."
    } else {
      selectionStatus.textContent =
        task.mode === "repair"
          ? "The problem region is identified for you."
          : "No code region selected yet."
    }

    codeArea.append(selectionStatus)

    const preview = buildPreview(task, state)
    if (preview) {
      sideArea.append(preview)
    }

    const repairPanel = buildRepairPanel(task, state, issue)
    if (repairPanel && (task.mode === "repair" || state.locatedIssueId)) {
      sideArea.append(repairPanel)

      const applyButton = createElement(
        "button",
        "debug-lab__primary-action",
        issue.applyLabel ?? "Apply and test repair"
      )
      applyButton.type = "button"
      applyButton.dataset.debugAction = "apply-repair"
      sideArea.append(applyButton)
    }

    workArea.append(codeArea, sideArea)
    hintButton.type = "button"
    hintButton.dataset.debugAction = "hint"
    solutionButton.type = "button"
    solutionButton.dataset.debugAction = "solution"
    resetButton.type = "button"
    resetButton.dataset.debugAction = "reset"

    if (!complete) {
      actions.append(hintButton, solutionButton)
    }
    actions.append(resetButton)

    shell.append(header, buildProcess(state, task), goal, workArea, feedback)

    if (complete) {
      shell.append(buildCompletion(task))
    }

    shell.append(actions)
    root.replaceChildren(shell)
  }

  root.addEventListener("click", (event) => {
    const region = event.target.closest("[data-debug-region]")
    const repair = event.target.closest("[data-debug-repair]")
    const action = event.target.closest("[data-debug-action]")

    if (region && !region.disabled) {
      state.selectedRegionId = region.dataset.debugRegion
      setStatus("Region selected. Check the location when you are ready.")
      render()
      root.querySelector(
        `[data-debug-region="${CSS.escape(state.selectedRegionId)}"]`
      )?.focus()
      return
    }

    if (repair) {
      state.selectedRepairId = repair.dataset.debugRepair
      setStatus("Repair selected. Apply and test it when you are ready.")
      render()
      root.querySelector(
        `[data-debug-repair="${CSS.escape(state.selectedRepairId)}"]`
      )?.focus()
      return
    }

    if (!action) {
      return
    }

    const handlers = {
      "check-location": checkLocation,
      "apply-repair": applyRepair,
      hint: showHint,
      solution: showSolution,
      reset: resetTask,
    }

    handlers[action.dataset.debugAction]?.()
  })

  render()
}

export function initDebugLabs(tasks, options = {}) {
  const taskMap = new Map(tasks.map((task) => [task.id, task]))
  const storageKey = options.storageKey ?? "debug-lab-progress"
  const version = Number(options.version ?? 1)
  const saved = readStorage(storageKey, {})
  const progress =
    saved.version === version && saved.tasks && typeof saved.tasks === "object"
      ? saved
      : { version, tasks: {} }

  function saveTaskState(taskId, taskState) {
    progress.tasks[taskId] = taskState
    writeStorage(storageKey, progress)
  }

  document.querySelectorAll("[data-debug-lab-id]").forEach((root) => {
    const task = taskMap.get(root.dataset.debugLabId)

    if (!task) {
      root.textContent = "This debugging task could not be loaded."
      return
    }

    initDebugLab(root, task, progress.tasks[task.id], saveTaskState)
  })
}
