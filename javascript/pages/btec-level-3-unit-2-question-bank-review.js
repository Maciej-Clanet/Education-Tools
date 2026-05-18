import { unit2ExamPracticeConfig } from "../data/exam-practice/unit-2-practice.js?v=unit2-bank-review-20260518"

function stripHtml(value) {
  const wrapper = document.createElement("div")

  wrapper.innerHTML = value ?? ""
  return wrapper.textContent.replace(/\s+/g, " ").trim()
}

function getGroupMarks(group) {
  return group.totalMarks ?? group.parts.reduce((total, part) => total + part.marks, 0)
}

function getGroupAvailabilityLabel(group) {
  if (group.sourceType === "predefined") {
    return "Predefined paper"
  }

  return group.customEligible === false ? "Fixed only" : "Custom eligible"
}

function getAllParts(groups) {
  return groups.flatMap((group) => group.parts)
}

function getTopicMap(config) {
  return new Map(config.topics.map((topic) => [topic.id, topic]))
}

function getTopicLabel(topicMap, topicId) {
  const topic = topicMap.get(topicId)

  return topic ? `${topic.sectionId}: ${topic.title}` : topicId
}

function getQuestionSources(config) {
  const customGroups = config.questionBank.groups.map((group) => ({
    ...group,
    sourceType: "custom",
    sourceId: `${config.unitId}:bank:${config.questionBank.version}`,
    sourceLabel: "Custom question bank",
    unitId: config.unitId,
    unitTitle: config.unitTitle,
  }))
  const predefinedGroups = config.predefinedPapers.flatMap((paper) =>
    paper.exam.groups.map((group) => ({
      ...group,
      sourceType: "predefined",
      sourceId: `${config.unitId}:paper:${paper.id}`,
      sourceLabel: paper.title,
      unitId: paper.exam.unitId ?? config.unitId,
      unitTitle: config.unitTitle,
    }))
  )

  return [...customGroups, ...predefinedGroups]
}

function getCustomTopicAvailability(config) {
  const availability = new Map(
    config.topics.map((topic) => [topic.id, { groups: 0, groupIds: [], marks: 0 }])
  )

  config.questionBank.groups.forEach((group) => {
    if (group.customEligible === false) {
      return
    }

    group.topicIds.forEach((topicId) => {
      const current = availability.get(topicId)

      if (!current) {
        return
      }

      current.groups += 1
      current.groupIds.push(group.id)
      current.marks += getGroupMarks(group)
    })
  })

  return availability
}

function getMetadataIssues(group, part) {
  const issues = []

  if (!group.topicIds?.length && !part.topicIds?.length) {
    issues.push("No topic IDs")
  }

  if (!part.commandWord) {
    issues.push("No command word")
  }

  if (!part.ao) {
    issues.push("No AO")
  }

  if (!part.rubric) {
    issues.push("No rubric")
  }

  if (!part.rubric?.modelAnswer) {
    issues.push("No model answer")
  }

  if (!part.rubric?.aiCriteria) {
    issues.push("No AI criteria")
  }

  return issues
}

function createPill(text, tone = "") {
  const pill = document.createElement("span")

  pill.className = tone ? `review-pill review-pill--${tone}` : "review-pill"
  pill.textContent = text
  return pill
}

function renderSummary(container, config, groups) {
  const customGroups = groups.filter((group) => group.sourceType === "custom")
  const predefinedGroups = groups.filter((group) => group.sourceType === "predefined")
  const parts = getAllParts(groups)
  const availability = getCustomTopicAvailability(config)
  const coveredTopics = Array.from(availability.values()).filter(
    (topic) => topic.groups > 0
  ).length
  const issueCount = groups.reduce(
    (total, group) =>
      total +
      group.parts.reduce(
        (partTotal, part) => partTotal + getMetadataIssues(group, part).length,
        0
      ),
    0
  )
  const cards = [
    ["Unit", config.unitId],
    ["Bank version", `v${config.questionBank.version}`],
    ["Custom groups", String(customGroups.length)],
    ["Predefined groups", String(predefinedGroups.length)],
    ["Question parts", String(parts.length)],
    ["Custom coverage", `${coveredTopics}/${config.topics.length} topics`],
    ["Metadata checks", issueCount === 0 ? "No gaps found" : `${issueCount} gaps`],
  ]

  container.replaceChildren()
  cards.forEach(([label, value]) => {
    const card = document.createElement("article")

    card.className = "exam-meta-card"
    card.innerHTML = `<strong>${label}</strong><span>${value}</span>`
    container.append(card)
  })
}

function renderTopicFilter(select, config, groups) {
  const customAvailability = getCustomTopicAvailability(config)
  const unknownTopicIds = new Set()

  groups.forEach((group) => {
    const groupTopicIds = [
      ...new Set([
        ...(group.topicIds ?? []),
        ...group.parts.flatMap((part) => part.topicIds ?? []),
      ]),
    ].filter(Boolean)

    groupTopicIds.forEach((topicId) => {
      if (!customAvailability.has(topicId)) {
        unknownTopicIds.add(topicId)
      }
    })
  })

  select.replaceChildren()
  select.append(new Option("All topics", ""))

  config.topics.forEach((topic) => {
    const availability = customAvailability.get(topic.id) ?? {
      groups: 0,
      groupIds: [],
      marks: 0,
    }
    const label = `${topic.sectionId}: ${topic.title} (${availability.groups} custom group${
      availability.groups === 1 ? "" : "s"
    }, ${availability.marks} marks)`
    const option = new Option(label, topic.id)

    option.title = availability.groupIds.join(", ")
    option.dataset.groupIds = availability.groupIds.join(" ")
    select.append(option)
  })

  unknownTopicIds.forEach((topicId) => {
    select.append(new Option(`Unmapped: ${topicId}`, topicId))
  })
}

function renderSourceFilter(select, groups) {
  const sources = new Map()

  groups.forEach((group) => {
    sources.set(`${group.sourceType}:${group.sourceId}`, group.sourceLabel)
  })

  select.replaceChildren()
  select.append(new Option("All sources", ""))
  Array.from(sources.entries()).forEach(([value, label]) => {
    select.append(new Option(label, value))
  })
}

function renderResponseMeta(response) {
  if (!response) {
    return "No response shape"
  }

  const details = Object.entries(response)
    .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.length : value}`)
    .join("; ")

  return details || response.type
}

function renderTerms(termSets = []) {
  const list = document.createElement("ul")

  list.className = "review-term-list"
  termSets.forEach((termSet) => {
    const item = document.createElement("li")

    item.textContent = Array.isArray(termSet) ? termSet.join(" + ") : String(termSet)
    list.append(item)
  })

  return list
}

function renderRubric(rubric) {
  const wrapper = document.createElement("div")

  wrapper.className = "review-rubric"

  if (!rubric) {
    wrapper.append(createPill("No rubric", "warning"))
    return wrapper
  }

  const header = document.createElement("div")

  header.className = "review-rubric-header"
  header.append(
    createPill(`Type: ${rubric.type}`),
    createPill(`Max: ${rubric.maxMarks ?? "unset"}`)
  )
  wrapper.append(header)

  if (rubric.points?.length) {
    const points = document.createElement("ol")

    points.className = "review-mark-points"
    rubric.points.forEach((point) => {
      const item = document.createElement("li")
      const label = document.createElement("strong")

      label.textContent = point.label
      item.append(label)

      if (point.terms?.length) {
        item.append(renderTerms(point.terms))
      }

      points.append(item)
    })
    wrapper.append(points)
  }

  if (rubric.levelBands?.length) {
    const levels = document.createElement("p")

    levels.className = "review-rubric-line"
    levels.textContent = `Level bands: ${rubric.levelBands.join(", ")}`
    wrapper.append(levels)
  }

  if (rubric.requiredNumbers?.length) {
    const numbers = document.createElement("p")

    numbers.className = "review-rubric-line"
    numbers.textContent = `Required numbers: ${rubric.requiredNumbers.join(", ")}`
    wrapper.append(numbers)
  }

  ;[
    ["Topic terms", rubric.topicTerms],
    ["Context terms", rubric.contextTerms],
  ].forEach(([label, terms]) => {
    if (!terms?.length) {
      return
    }

    const line = document.createElement("p")

    line.className = "review-rubric-line"
    line.innerHTML = `<strong>${label}:</strong> ${terms.join(", ")}`
    wrapper.append(line)
  })

  if (rubric.answers) {
    const answers = document.createElement("pre")

    answers.className = "review-json"
    answers.textContent = JSON.stringify(rubric.answers, null, 2)
    wrapper.append(answers)
  }

  ;[
    ["Model answer", rubric.modelAnswer],
    ["AI criteria", rubric.aiCriteria],
    ["Examiner tip", rubric.examinerTip],
  ].forEach(([label, value]) => {
    if (!value) {
      return
    }

    const line = document.createElement("p")

    line.className = "review-rubric-line"
    line.innerHTML = `<strong>${label}:</strong> ${value}`
    wrapper.append(line)
  })

  return wrapper
}

function renderPart(part, group, topicMap) {
  const article = document.createElement("article")
  const issues = getMetadataIssues(group, part)
  const topicIds = part.topicIds?.length ? part.topicIds : group.topicIds ?? []

  article.className = "review-part"
  article.innerHTML = `
    <header class="review-part-header">
      <div>
        <p class="eyebrow">${part.label ?? part.id}</p>
        <h3>${part.id}</h3>
      </div>
      <span class="exam-mark-pill">${part.marks} mark${part.marks === 1 ? "" : "s"}</span>
    </header>
    <div class="review-prompt">${part.promptHtml ?? ""}</div>
  `

  const meta = document.createElement("div")

  meta.className = "review-meta-grid"
  ;[
    ["Part ID", part.id],
    ["Command word", part.commandWord ?? "Not set"],
    ["AO", part.ao ?? "Not set"],
    ["Response", renderResponseMeta(part.response)],
  ].forEach(([label, value]) => {
    const item = document.createElement("p")

    item.innerHTML = `<strong>${label}</strong><span>${value}</span>`
    meta.append(item)
  })
  article.append(meta)

  const topicList = document.createElement("div")

  topicList.className = "review-pill-row"
  topicIds.forEach((topicId) => topicList.append(createPill(getTopicLabel(topicMap, topicId))))
  if (issues.length) {
    issues.forEach((issue) => topicList.append(createPill(issue, "warning")))
  } else {
    topicList.append(createPill("Metadata complete", "ok"))
  }
  article.append(topicList, renderRubric(part.rubric))

  return article
}

function renderGroup(group, topicMap) {
  const section = document.createElement("section")
  const groupTopics = group.topicIds ?? []

  section.className = "review-group panel"
  section.dataset.searchText = [
    group.id,
    group.title,
    group.sourceLabel,
    group.unitId,
    stripHtml(group.scenarioHtml),
    ...groupTopics.map((topicId) => getTopicLabel(topicMap, topicId)),
    ...group.parts.flatMap((part) => [
      part.id,
      part.label,
      part.commandWord,
      part.ao,
      stripHtml(part.promptHtml),
      part.rubric?.modelAnswer,
      part.rubric?.aiCriteria,
      part.rubric?.examinerTip,
    ]),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
  section.dataset.source = `${group.sourceType}:${group.sourceId}`
  section.dataset.topicIds = [
    ...new Set([...groupTopics, ...group.parts.flatMap((part) => part.topicIds ?? [])]),
  ].join(" ")

  const header = document.createElement("header")

  header.className = "review-group-header"
  header.innerHTML = `
    <div>
      <p class="eyebrow">${group.sourceLabel}</p>
      <h2>${group.title} <span>${group.id}</span></h2>
    </div>
  `
  const meta = document.createElement("div")

  meta.className = "review-pill-row"
  meta.append(
    createPill(group.unitId),
    createPill(`${getGroupMarks(group)} marks`),
    createPill(`${group.parts.length} part${group.parts.length === 1 ? "" : "s"}`),
    createPill(getGroupAvailabilityLabel(group))
  )
  header.append(meta)

  const topics = document.createElement("div")

  topics.className = "review-pill-row"
  groupTopics.forEach((topicId) => topics.append(createPill(getTopicLabel(topicMap, topicId))))

  const scenario = document.createElement("div")

  scenario.className = "exam-scenario review-scenario"
  scenario.innerHTML = group.scenarioHtml ?? "<p>No scenario text.</p>"

  const parts = document.createElement("div")

  parts.className = "review-part-list"
  group.parts.forEach((part) => parts.append(renderPart(part, group, topicMap)))
  section.append(header, topics, scenario, parts)

  return section
}

function filterGroups(groups, controls) {
  const query = controls.search.value.trim().toLowerCase()
  const topicId = controls.topic.value
  const source = controls.source.value

  return groups.filter((group) => {
    const matchesQuery = !query || group.element.dataset.searchText.includes(query)
    const groupTopicIds = group.element.dataset.topicIds.split(" ").filter(Boolean)
    const matchesTopic = !topicId || groupTopicIds.includes(topicId)
    const matchesSource = !source || group.element.dataset.source === source

    return matchesQuery && matchesTopic && matchesSource
  })
}

function updateVisibleGroups(groups, controls, list) {
  const visible = new Set(filterGroups(groups, controls).map((group) => group.element))
  let visibleCount = 0

  groups.forEach((group) => {
    const isVisible = visible.has(group.element)

    group.element.hidden = !isVisible
    visibleCount += isVisible ? 1 : 0
  })

  if (visibleCount === 0) {
    list.dataset.empty = "true"
  } else {
    delete list.dataset.empty
  }
}

function initReviewPage() {
  const config = unit2ExamPracticeConfig
  const groups = getQuestionSources(config)
  const topicMap = getTopicMap(config)
  const summary = document.querySelector("[data-role='review-summary']")
  const list = document.querySelector("[data-role='question-review-list']")
  const controls = {
    search: document.querySelector("[data-role='review-search']"),
    topic: document.querySelector("[data-role='review-topic-filter']"),
    source: document.querySelector("[data-role='review-source-filter']"),
  }

  if (!summary || !list || !controls.search || !controls.topic || !controls.source) {
    return
  }

  renderSummary(summary, config, groups)
  renderTopicFilter(controls.topic, config, groups)
  renderSourceFilter(controls.source, groups)

  const renderedGroups = groups.map((group) => {
    const element = renderGroup(group, topicMap)

    list.append(element)
    return { group, element }
  })

  Object.values(controls).forEach((control) => {
    control.addEventListener("input", () => updateVisibleGroups(renderedGroups, controls, list))
  })
}

initReviewPage()
