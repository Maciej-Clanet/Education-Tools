import { initPastExam } from "./past-exam.js"
import { readStorage, writeStorage } from "./storage.js"

function cloneData(value) {
  return JSON.parse(JSON.stringify(value))
}

function formatDuration(minutes) {
  if (minutes < 60) {
    return `${minutes} minutes`
  }

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  const hourLabel = `${hours} hour${hours === 1 ? "" : "s"}`

  return remainingMinutes === 0
    ? hourLabel
    : `${hourLabel} ${remainingMinutes} minutes`
}

function getGroupMarks(group) {
  return group.totalMarks ?? group.parts.reduce((total, part) => total + part.marks, 0)
}

function getTopicAvailability(config) {
  const availability = new Map()

  config.questionBank.groups.forEach((group) => {
    if (group.customEligible === false) {
      return
    }

    group.topicIds.forEach((topicId) => {
      const current = availability.get(topicId) ?? { groups: 0, marks: 0 }

      current.groups += 1
      current.marks += getGroupMarks(group)
      availability.set(topicId, current)
    })
  })

  return availability
}

function getTargetMarks(config, topicCount) {
  if (topicCount <= 2) {
    return 20
  }

  if (topicCount <= 5) {
    return 40
  }

  return config.totalMarks
}

function getDurationFromMarks(config, marks) {
  const rawMinutes = (marks / config.totalMarks) * config.durationMinutes

  return Math.max(10, Math.round(rawMinutes / 5) * 5)
}

function getGeneratedKey(config, generatedId) {
  return `exam-practice-generated:${config.unitId}:v${config.questionBank.version}:${generatedId}`
}

function getRecentGroupsKey(config) {
  return `exam-practice-recent-groups:${config.unitId}:v${config.questionBank.version}`
}

function getGeneratedIndexKey(config) {
  return `exam-practice-generated-index:${config.unitId}:v${config.questionBank.version}`
}

function getAttemptsKey(exam) {
  return `past-exam-attempts:${exam.id}:v${exam.version ?? 1}`
}

function getDraftKey(exam) {
  return `past-exam-draft:${exam.id}:v${exam.version ?? 1}`
}

function getStoredGeneratedPapers(config) {
  const storedIndex = readStorage(getGeneratedIndexKey(config), [])
  const generatedPrefix = `exam-practice-generated:${config.unitId}:v${config.questionBank.version}:`
  const scanned = []

  try {
    const storage = window.localStorage

    Array.from({ length: storage.length }, (_, index) => storage.key(index)).forEach(
      (storageKey) => {
        const key = String(storageKey)

        if (!key.includes(generatedPrefix)) {
          return
        }

        try {
          const generated = JSON.parse(storage.getItem(key))

          if (generated?.id) {
            scanned.push(generated)
          }
        } catch (error) {
          console.warn(`Unable to read generated paper key "${key}".`, error)
        }
      }
    )
  } catch (error) {
    console.warn("Unable to scan generated practice papers.", error)
  }

  const byId = new Map()

  ;[...storedIndex, ...scanned].forEach((generated) => {
    if (generated?.id) {
      byId.set(generated.id, generated)
    }
  })

  return Array.from(byId.values()).sort((first, second) =>
    String(second.createdAt ?? "").localeCompare(String(first.createdAt ?? ""))
  )
}

function updateGeneratedIndex(config, generated) {
  const existing = getStoredGeneratedPapers(config).filter(
    (item) => item.id !== generated.id
  )

  writeStorage(getGeneratedIndexKey(config), [generated, ...existing].slice(0, 20))
}

function createGeneratedId() {
  const randomValue =
    window.crypto?.getRandomValues?.(new Uint32Array(1))[0]?.toString(36) ??
    Math.random().toString(36).slice(2)

  return `${Date.now().toString(36)}-${randomValue}`
}

function shuffle(items) {
  const shuffled = items.slice()

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    const item = shuffled[index]

    shuffled[index] = shuffled[swapIndex]
    shuffled[swapIndex] = item
  }

  return shuffled
}

function getGroupsForTopics(config, topicIds) {
  const selectedTopics = new Set(topicIds)

  return config.questionBank.groups.filter(
    (group) =>
      group.customEligible !== false &&
      group.topicIds.some((topicId) => selectedTopics.has(topicId))
  )
}

function buildCustomSelection(config, topicIds) {
  const candidates = getGroupsForTopics(config, topicIds)
  const targetMarks = getTargetMarks(config, topicIds.length)
  const recentGroupIds = readStorage(getRecentGroupsKey(config), [])
  const recentSet = new Set(recentGroupIds)
  const freshCandidates = candidates.filter((group) => !recentSet.has(group.id))
  const fallbackCandidates = candidates.filter((group) => recentSet.has(group.id))
  const orderedCandidates = [
    ...shuffle(freshCandidates),
    ...shuffle(fallbackCandidates),
  ]
  const selectedGroups = []
  let totalMarks = 0

  orderedCandidates.forEach((group) => {
    if (totalMarks >= targetMarks && selectedGroups.length > 0) {
      return
    }

    selectedGroups.push(group)
    totalMarks += getGroupMarks(group)
  })

  if (totalMarks < config.questionBank.minCustomMarks) {
    throw new Error("Choose at least one topic with available practice questions.")
  }

  const generated = {
    id: createGeneratedId(),
    type: "custom",
    unitId: config.unitId,
    version: config.questionBank.version,
    topicIds,
    groupIds: selectedGroups.map((group) => group.id),
    targetMarks,
    totalMarks,
    durationMinutes: getDurationFromMarks(config, totalMarks),
    createdAt: new Date().toISOString(),
  }

  writeStorage(getGeneratedKey(config, generated.id), generated)
  updateGeneratedIndex(config, generated)
  writeStorage(
    getRecentGroupsKey(config),
    [...generated.groupIds, ...recentGroupIds]
      .filter((groupId, index, groupIds) => groupIds.indexOf(groupId) === index)
      .slice(0, 12)
  )

  return generated
}

function getTopicTitle(config, topicId) {
  return config.topics.find((topic) => topic.id === topicId)?.title ?? topicId
}

function relabelCustomGroups(groups) {
  return groups.map((group, groupIndex) => {
    const groupNumber = groupIndex + 1
    const clonedGroup = cloneData(group)

    clonedGroup.title = `Question ${groupNumber}`
    clonedGroup.parts = clonedGroup.parts.map((part, partIndex) => ({
      ...part,
      label: `${groupNumber}(${String.fromCharCode(97 + partIndex)})`,
    }))

    return clonedGroup
  })
}

function buildGeneratedExam(config, generated) {
  const groupsById = new Map(
    config.questionBank.groups.map((group) => [group.id, group])
  )
  const groups = generated.groupIds
    .map((groupId) => groupsById.get(groupId))
    .filter(Boolean)
  const topicNames = generated.topicIds.map((topicId) => getTopicTitle(config, topicId))

  return {
    id: `${config.unitId}-custom-${generated.id}`,
    unitId: config.unitId,
    title: `${config.unitTitle} - Custom practice paper`,
    shortTitle: "Custom practice paper",
    qualification: config.qualification,
    paperReference: "Custom practice",
    dateLabel: "Generated practice",
    durationMinutes: generated.durationMinutes,
    totalMarks: generated.totalMarks,
    version: generated.version,
    markingModeLabel: "Teacher feedback workflow",
    generatedFrom: {
      topicIds: generated.topicIds,
      topicNames,
      targetMarks: generated.targetMarks,
      groupIds: generated.groupIds,
    },
    groups: relabelCustomGroups(groups),
  }
}

function buildPredefinedExam(paper) {
  return {
    ...cloneData(paper.exam),
    id: paper.exam.id,
    title: paper.title,
    shortTitle: paper.shortTitle ?? paper.exam.shortTitle,
    durationMinutes: paper.durationMinutes,
    totalMarks: paper.totalMarks,
    unlockPassword: undefined,
  }
}

function getPaperFromUrl(config, params) {
  const paperId = params.get("paper")

  if (!paperId) {
    return null
  }

  if (paperId === "custom") {
    const generatedId = params.get("customId")
    const generated = generatedId
      ? readStorage(getGeneratedKey(config, generatedId), null)
      : null

    if (!generated) {
      throw new Error("That generated paper is no longer saved on this device.")
    }

    return buildGeneratedExam(config, generated)
  }

  const predefinedPaper = config.predefinedPapers.find((paper) => paper.id === paperId)

  if (!predefinedPaper) {
    throw new Error("That practice paper could not be found.")
  }

  return buildPredefinedExam(predefinedPaper)
}

function createPracticeUrl(params) {
  const url = new URL(window.location.href)

  url.search = params.toString()
  url.hash = ""

  return url.toString()
}

function renderPredefinedPapers(container, config) {
  container.replaceChildren()

  config.predefinedPapers.forEach((paper) => {
    const card = document.createElement("article")
    const linkParams = new URLSearchParams({ paper: paper.id })

    card.className = "practice-option-card"
    card.innerHTML = `
      <div class="practice-card-top">
        <span>${paper.totalMarks} marks</span>
        <span>${formatDuration(paper.durationMinutes)}</span>
      </div>
      <h3>${paper.title}</h3>
      <p>${paper.description}</p>
      <a class="primary-link" href="${createPracticeUrl(linkParams)}">Open full paper</a>
    `
    container.append(card)
  })
}

function formatShortDate(value) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return "Saved paper"
  }

  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function renderSavedCustomPapers(section, container, config) {
  const generatedPapers = getStoredGeneratedPapers(config)

  container.replaceChildren()
  section.hidden = generatedPapers.length === 0

  generatedPapers.forEach((generated) => {
    const exam = buildGeneratedExam(config, generated)
    const attempts = readStorage(getAttemptsKey(exam), [])
    const draft = readStorage(getDraftKey(exam), null)
    const card = document.createElement("article")
    const params = new URLSearchParams({
      paper: "custom",
      customId: generated.id,
    })
    const topicNames = generated.topicIds
      .map((topicId) => getTopicTitle(config, topicId))
      .slice(0, 3)
    const extraTopicCount = Math.max(generated.topicIds.length - topicNames.length, 0)
    const topicSummary =
      topicNames.length === 0
        ? "Custom topic paper"
        : `${topicNames.join(", ")}${extraTopicCount ? `, +${extraTopicCount} more` : ""}`
    const attemptLabel =
      attempts.length === 0
        ? draft
          ? "Draft saved"
          : "No attempts yet"
        : `${attempts.length} attempt${attempts.length === 1 ? "" : "s"} saved`

    card.className = "saved-paper-card"
    card.innerHTML = `
      <div class="practice-card-top">
        <span>${generated.totalMarks} marks</span>
        <span>${formatDuration(generated.durationMinutes)}</span>
      </div>
      <h4>${attemptLabel}</h4>
      <p>${topicSummary}</p>
      <small>Created ${formatShortDate(generated.createdAt)}</small>
      <div class="saved-paper-actions">
        <a class="primary-link" href="${createPracticeUrl(params)}">Open paper</a>
      </div>
    `

    container.append(card)
  })
}

function renderTopicPicker(container, config, onChange) {
  const availability = getTopicAvailability(config)
  const sections = new Map()

  config.topics.forEach((topic) => {
    const section = sections.get(topic.sectionId) ?? {
      id: topic.sectionId,
      title: topic.sectionTitle,
      topics: [],
    }

    section.topics.push(topic)
    sections.set(topic.sectionId, section)
  })

  container.replaceChildren()

  sections.forEach((section) => {
    const sectionElement = document.createElement("section")
    const heading = document.createElement("h3")
    const grid = document.createElement("div")

    sectionElement.className = "topic-picker-section"
    heading.textContent = `${section.id}. ${section.title}`
    grid.className = "topic-picker-grid"

    section.topics.forEach((topic) => {
      const available = availability.get(topic.id) ?? { groups: 0, marks: 0 }
      const label = document.createElement("label")
      const checkbox = document.createElement("input")
      const title = document.createElement("span")
      const meta = document.createElement("small")

      label.className = "topic-picker-card"
      checkbox.type = "checkbox"
      checkbox.value = topic.id
      checkbox.disabled = available.groups === 0
      checkbox.addEventListener("change", onChange)
      title.textContent = topic.title
      meta.textContent =
        available.groups > 0
          ? `${available.groups} group${available.groups === 1 ? "" : "s"} available`
          : "Practice coming soon"

      label.append(checkbox, title, meta)
      grid.append(label)
    })

    sectionElement.append(heading, grid)
    container.append(sectionElement)
  })
}

function getSelectedTopicIds(container) {
  return Array.from(container.querySelectorAll("input[type='checkbox']:checked")).map(
    (input) => input.value
  )
}

function updateCustomSummary(config, topicList, summary, buildButton) {
  const topicIds = getSelectedTopicIds(topicList)
  const candidates = getGroupsForTopics(config, topicIds)
  const availableMarks = candidates.reduce(
    (total, group) => total + getGroupMarks(group),
    0
  )
  const targetMarks = topicIds.length ? getTargetMarks(config, topicIds.length) : 0

  buildButton.disabled = topicIds.length === 0 || availableMarks === 0

  if (topicIds.length === 0) {
    summary.textContent = "Choose one or more available topics to build a paper."
    return
  }

  if (availableMarks === 0) {
    summary.textContent =
      "The starter bank does not have practice questions for that topic selection yet."
    return
  }

  if (availableMarks < targetMarks) {
    summary.textContent = `This will make a shorter ${availableMarks}-mark paper because the starter bank has fewer questions for those topics.`
    return
  }

  summary.textContent = `This selection will aim for about ${targetMarks} marks from ${candidates.length} available question groups.`
}

function renderChooser(config, elements, message = "") {
  elements.chooser.hidden = false
  elements.examApp.hidden = true
  elements.choiceGrid.hidden = false
  elements.topicBuilder.hidden = true
  renderPredefinedPapers(elements.predefinedList, config)
  renderSavedCustomPapers(elements.savedCustomSection, elements.savedCustomList, config)
  renderTopicPicker(elements.topicList, config, () =>
    updateCustomSummary(config, elements.topicList, elements.customSummary, elements.buildCustom)
  )
  updateCustomSummary(config, elements.topicList, elements.customSummary, elements.buildCustom)

  elements.status.textContent = message
  elements.status.hidden = !message

  elements.showTopicBuilder.addEventListener("click", () => {
    elements.choiceGrid.hidden = true
    elements.savedCustomSection.hidden = true
    elements.topicBuilder.hidden = false
  })

  elements.hideTopicBuilder.addEventListener("click", () => {
    elements.topicBuilder.hidden = true
    elements.choiceGrid.hidden = false
    renderSavedCustomPapers(elements.savedCustomSection, elements.savedCustomList, config)
  })

  elements.buildCustom.addEventListener("click", () => {
    try {
      const topicIds = getSelectedTopicIds(elements.topicList)
      const generated = buildCustomSelection(config, topicIds)
      const params = new URLSearchParams({
        paper: "custom",
        customId: generated.id,
      })

      window.location.href = createPracticeUrl(params)
    } catch (error) {
      elements.status.textContent =
        error instanceof Error
          ? error.message
          : "That custom paper could not be built."
      elements.status.hidden = false
    }
  })
}

function updateSelectedPaperView(elements, exam) {
  const subtitle =
    exam.generatedFrom?.topicNames?.length > 0
      ? `Built from ${exam.generatedFrom.topicNames.length} selected topic${exam.generatedFrom.topicNames.length === 1 ? "" : "s"}.`
      : "Predefined full-paper practice."

  if (elements.selectedPaperTitle) {
    elements.selectedPaperTitle.textContent = exam.shortTitle ?? exam.title
  }

  if (elements.selectedPaperMeta) {
    elements.selectedPaperMeta.textContent = `${exam.totalMarks} marks - ${formatDuration(exam.durationMinutes)}. ${subtitle}`
  }

  if (elements.timer) {
    const hours = Math.floor(exam.durationMinutes / 60)
    const minutes = exam.durationMinutes % 60

    elements.timer.textContent = `${String(hours).padStart(2, "0")}:${String(
      minutes
    ).padStart(2, "0")}:00`
  }
}

export function initExamPracticePage(config) {
  const elements = {
    chooser: document.querySelector("[data-role='exam-practice-chooser']"),
    choiceGrid: document.querySelector("[data-role='practice-choice-grid']"),
    predefinedList: document.querySelector("[data-role='predefined-paper-list']"),
    savedCustomSection: document.querySelector("[data-role='saved-custom-section']"),
    savedCustomList: document.querySelector("[data-role='saved-custom-papers']"),
    topicBuilder: document.querySelector("[data-role='custom-topic-builder']"),
    topicList: document.querySelector("[data-role='custom-topic-list']"),
    customSummary: document.querySelector("[data-role='custom-paper-summary']"),
    status: document.querySelector("[data-role='exam-practice-status']"),
    showTopicBuilder: document.querySelector("[data-action='show-topic-builder']"),
    hideTopicBuilder: document.querySelector("[data-action='hide-topic-builder']"),
    buildCustom: document.querySelector("[data-action='build-custom-paper']"),
    examApp: document.querySelector("[data-role='exam-app']"),
    selectedPaperTitle: document.querySelector("[data-role='selected-paper-title']"),
    selectedPaperMeta: document.querySelector("[data-role='selected-paper-meta']"),
    timer: document.querySelector("[data-role='exam-timer']"),
  }

  if (
    !elements.chooser ||
    !elements.choiceGrid ||
    !elements.predefinedList ||
    !elements.savedCustomSection ||
    !elements.savedCustomList ||
    !elements.topicBuilder ||
    !elements.topicList ||
    !elements.customSummary ||
    !elements.status ||
    !elements.showTopicBuilder ||
    !elements.hideTopicBuilder ||
    !elements.buildCustom ||
    !elements.examApp
  ) {
    return
  }

  const params = new URLSearchParams(window.location.search)

  try {
    const exam = getPaperFromUrl(config, params)

    if (!exam) {
      renderChooser(config, elements)
      return
    }

    elements.chooser.hidden = true
    updateSelectedPaperView(elements, exam)
    initPastExam(exam, { requiresUnlock: false })
  } catch (error) {
    renderChooser(
      config,
      elements,
      error instanceof Error
        ? error.message
        : "That practice paper could not be opened."
    )
  }
}
