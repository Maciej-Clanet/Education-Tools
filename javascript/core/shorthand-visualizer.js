const DEFAULT_POSITIONS = [
  { id: "top-left", label: "top-left", order: "first" },
  { id: "top-right", label: "top-right", order: "second" },
  { id: "bottom-right", label: "bottom-right", order: "third" },
  { id: "bottom-left", label: "bottom-left", order: "fourth" },
]

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

function initShorthandVisualizer(root, config) {
  const positions = (config.positions ?? DEFAULT_POSITIONS).slice(0, 4)
  const values = (config.values ?? []).slice(0, 4).map(String)

  if (positions.length !== 4 || values.length !== 4) {
    root.textContent = "This shorthand visualiser needs four values and four positions."
    return
  }

  const shell = createElement("article", "shorthand-visualizer")
  const heading = createElement("div", "shorthand-visualizer__heading")
  const eyebrow = createElement("p", "eyebrow", config.eyebrow ?? "FOUR-VALUE SHORTHAND")
  const title = createElement("h3", "", config.title ?? "Start at the top-left and move clockwise")
  const description = createElement("p", "", config.description ?? "Select a value to reveal the position it controls.")
  const expression = createElement("div", "shorthand-visualizer__expression")
  const property = createElement("code", "shorthand-visualizer__property", `${config.property ?? "property"}:`)
  const controls = createElement("div", "shorthand-visualizer__values")
  const semicolon = createElement("code", "shorthand-visualizer__property", ";")
  const stage = createElement("div", "shorthand-visualizer__stage")
  const preview = createElement("div", "shorthand-visualizer__preview")
  const centre = createElement("strong", "", config.previewLabel ?? "Element")
  const report = createElement("p", "shorthand-visualizer__report")
  const textList = createElement("ol", "shorthand-visualizer__text-list")
  const buttons = []
  const markers = []
  let selectedIndex = 0

  heading.append(eyebrow, title, description)
  expression.append(property, controls, semicolon)
  expression.setAttribute("aria-label", `${config.property ?? "property"}: ${values.join(" ")};`)
  controls.setAttribute("role", "group")
  controls.setAttribute("aria-label", "Choose a shorthand value")

  positions.forEach((position, index) => {
    const button = createElement("button", "shorthand-visualizer__value", values[index])
    const marker = createElement("div", `shorthand-visualizer__marker shorthand-visualizer__marker--${position.id}`)
    const markerValue = createElement("strong", "", values[index])
    const markerLabel = createElement("span", "", position.label)
    const listItem = document.createElement("li")
    const listValue = createElement("strong", "", `${position.order}: ${values[index]}`)
    const listPosition = createElement("span", "", position.label)

    button.type = "button"
    button.dataset.valueIndex = String(index)
    button.setAttribute("aria-pressed", "false")
    button.setAttribute("aria-label", `${values[index]}, ${position.order} value, ${position.label}`)
    marker.dataset.positionIndex = String(index)
    marker.append(markerValue, markerLabel)
    listItem.append(listValue, listPosition)
    controls.append(button)
    stage.append(marker)
    textList.append(listItem)
    buttons.push(button)
    markers.push(marker)
  })

  preview.append(centre)
  stage.append(preview)
  shell.dataset.noSlideAdvance = ""
  shell.append(heading, expression, stage, report, textList)
  root.replaceChildren(shell)

  if (config.previewKind === "border-radius") {
    preview.style.borderRadius = values.join(" ")
  }

  function selectValue(index, announce = false) {
    selectedIndex = (index + values.length) % values.length

    buttons.forEach((button, buttonIndex) => {
      const selected = buttonIndex === selectedIndex
      button.classList.toggle("is-selected", selected)
      button.setAttribute("aria-pressed", String(selected))
    })

    markers.forEach((marker, markerIndex) => {
      marker.classList.toggle("is-selected", markerIndex === selectedIndex)
    })

    preview.dataset.activePosition = positions[selectedIndex].id

    if (announce) {
      report.setAttribute("aria-live", "polite")
    } else {
      report.removeAttribute("aria-live")
    }

    report.textContent = `${values[selectedIndex]} is the ${positions[selectedIndex].order} value. It controls the ${positions[selectedIndex].label} position.`
  }

  controls.addEventListener("click", (event) => {
    const button = event.target.closest("[data-value-index]")

    if (button) {
      selectValue(Number(button.dataset.valueIndex), true)
    }
  })

  controls.addEventListener("mouseover", (event) => {
    const button = event.target.closest("[data-value-index]")

    if (button) {
      selectValue(Number(button.dataset.valueIndex))
    }
  })

  controls.addEventListener("focusin", (event) => {
    const button = event.target.closest("[data-value-index]")

    if (button) {
      selectValue(Number(button.dataset.valueIndex), true)
    }
  })

  controls.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
      return
    }

    event.preventDefault()
    let nextIndex = selectedIndex

    if (event.key === "ArrowLeft") {
      nextIndex -= 1
    } else if (event.key === "ArrowRight") {
      nextIndex += 1
    } else if (event.key === "Home") {
      nextIndex = 0
    } else if (event.key === "End") {
      nextIndex = values.length - 1
    }

    selectValue(nextIndex, true)
    buttons[selectedIndex].focus()
  })

  selectValue(0)
}

export function initShorthandVisualizers(configs) {
  const configMap = new Map(configs.map((config) => [config.id, config]))

  document.querySelectorAll("[data-shorthand-visualizer-id]").forEach((root) => {
    const config = configMap.get(root.dataset.shorthandVisualizerId)

    if (!config) {
      root.textContent = "This shorthand visualiser could not be loaded."
      return
    }

    initShorthandVisualizer(root, config)
  })
}
