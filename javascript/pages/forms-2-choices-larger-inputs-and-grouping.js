import { initCodePreviews } from "../core/code-preview.js"
import { initLessonPage } from "../core/lesson-shell.js"

const lessonConfig = {
  lessonId: "forms-2-choices-larger-inputs-and-grouping",
  defaultContext: "web-development",
  contexts: {
    "web-development": {
      label: "Web Development",
      backHref: "../resources/web-development.html#html-basics",
      backLabel: "Back to Web Development resources",
      previous: {
        title: "Forms 1: Inputs, labels, and submitting data",
        href: "forms-1-inputs-labels-and-submitting-data.html",
        description:
          "The previous lesson covered forms, inputs, labels, id, name, required fields, submit, and NAME -> VALUE data.",
        status: "Live",
      },
      next: {
        title: "HTML form practice project",
        description:
          "Next, combine the HTML basics lessons into a small accessible form page.",
        status: "Planned",
      },
    },
  },
  quiz: {
    storageKey: "lesson-forms-2-choices-larger-inputs-and-grouping-quiz",
    passScore: 12,
  },
}

const controlPracticeScenarios = [
  {
    prompt: "Enter your full name",
    answer: "text",
    feedback:
      "A short text input is a good fit because the user types a short answer.",
  },
  {
    prompt: "Tell us about your experience on the course",
    answer: "textarea",
    feedback:
      "A textarea is better for a longer written answer that may need several lines.",
  },
  {
    prompt: "Choose exactly one payment method",
    answer: "radio",
    feedback:
      "Radio buttons fit a small group where only one option should be selected.",
  },
  {
    prompt: "Choose any dietary requirements that apply",
    answer: "checkbox",
    feedback:
      "Checkboxes fit zero, one, or many choices.",
  },
  {
    prompt: "Choose your country from a long list",
    answer: "select",
    feedback:
      "A select can save space when the list is long and straightforward.",
  },
]

const controlPracticeLabels = {
  text: "Text input",
  textarea: "Textarea",
  radio: "Radio buttons",
  checkbox: "Checkboxes",
  select: "Select",
}

function renderDataRows(container, entries) {
  container.replaceChildren()

  if (entries.length === 0) {
    const empty = document.createElement("p")
    empty.className = "form-data-empty"
    empty.textContent = "No named values were collected."
    container.append(empty)
    return
  }

  entries.forEach(([name, value]) => {
    const row = document.createElement("div")
    row.className = "form-data-row"

    const nameElement = document.createElement("code")
    nameElement.textContent = name

    const arrow = document.createElement("span")
    arrow.textContent = "->"

    const valueElement = document.createElement("span")
    valueElement.textContent = value || "(empty value)"

    row.append(nameElement, arrow, valueElement)
    container.append(row)
  })
}

function getFormEntries(form) {
  return Array.from(new FormData(form).entries())
}

function initStaticFormPreviews() {
  document.addEventListener("submit", (event) => {
    if (event.target.matches("[data-static-form-preview]")) {
      event.preventDefault()
    }
  })
}

function initRadioNameDemo() {
  const demo = document.querySelector("[data-radio-name-demo]")

  if (!demo) {
    return
  }

  const form = demo.querySelector("form")
  const radios = Array.from(demo.querySelectorAll("input[type='radio']"))
  const buttons = Array.from(demo.querySelectorAll("[data-radio-name-mode]"))
  const code = demo.querySelector("[data-radio-name-code]")
  const output = demo.querySelector("[data-radio-name-output]")
  const status = demo.querySelector("[data-radio-name-status]")

  function setMode(mode) {
    const sharedMode = mode === "shared"

    if (sharedMode) {
      radios[0].name = "deliveryMethod"
      radios[1].name = "deliveryMethod"

      if (radios.every((radio) => radio.checked)) {
        radios[1].checked = false
      }
    } else {
      radios[0].name = "delivery"
      radios[1].name = "collection"
    }

    demo.dataset.radioNameState = mode

    buttons.forEach((button) => {
      const selected = button.dataset.radioNameMode === mode
      button.classList.toggle("is-selected", selected)
      button.setAttribute("aria-pressed", String(selected))
    })

    code.textContent = sharedMode
      ? 'name="deliveryMethod"\nname="deliveryMethod"'
      : 'name="delivery"\nname="collection"'

    renderDataRows(output, getFormEntries(form))

    status.textContent = sharedMode
      ? "Same name means the browser treats these as one group, so choosing one replaces the other."
      : "Different names means the browser treats them as separate radio groups, so both can be selected at once."
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => setMode(button.dataset.radioNameMode))
  })

  radios.forEach((radio) => {
    radio.addEventListener("change", () => {
      renderDataRows(output, getFormEntries(form))
    })
  })

  form.addEventListener("submit", (event) => event.preventDefault())
  setMode("shared")
}

function initChoiceModeDemo() {
  const demo = document.querySelector("[data-choice-mode-demo]")

  if (!demo) {
    return
  }

  const form = demo.querySelector("form")
  const buttons = Array.from(demo.querySelectorAll("[data-choice-mode]"))
  const question = demo.querySelector("[data-choice-question]")
  const controls = demo.querySelector("[data-choice-controls]")
  const output = demo.querySelector("[data-choice-output]")
  const status = demo.querySelector("[data-choice-status]")
  const code = demo.querySelector("[data-choice-code]")

  const modes = {
    one: {
      question: "Choose ONE delivery speed",
      name: "deliverySpeed",
      type: "radio",
      code: 'type="radio"\nname="deliverySpeed"',
      status:
        "Radio buttons are for one choice from a group. Try choosing another option.",
      options: [
        ["standard", "Standard"],
        ["nextDay", "Next day"],
        ["collection", "Collection"],
      ],
      checked: ["standard"],
    },
    any: {
      question: "Choose ANY toppings",
      name: "topping",
      type: "checkbox",
      code: 'type="checkbox"\nname="topping"',
      status:
        "Checkboxes are for zero, one, or many choices. Tick and untick a few options.",
      options: [
        ["cheese", "Cheese"],
        ["mushrooms", "Mushrooms"],
        ["peppers", "Peppers"],
      ],
      checked: ["cheese", "mushrooms"],
    },
  }

  function renderMode(mode) {
    const config = modes[mode] ?? modes.one

    demo.dataset.choiceState = mode
    question.textContent = config.question
    code.textContent = config.code
    status.textContent = config.status

    const rows = config.options.map(([value, label], index) => {
      const id = `choice-mode-${mode}-${value}`
      const wrapper = document.createElement("label")
      wrapper.className = "option-row"
      wrapper.htmlFor = id

      const input = document.createElement("input")
      input.id = id
      input.name = config.name
      input.type = config.type
      input.value = value
      input.checked = config.checked.includes(value)

      const text = document.createElement("span")
      text.textContent = label

      wrapper.append(input, text)
      return wrapper
    })

    controls.replaceChildren(...rows)

    buttons.forEach((button) => {
      const selected = button.dataset.choiceMode === mode
      button.classList.toggle("is-selected", selected)
      button.setAttribute("aria-pressed", String(selected))
    })

    renderDataRows(output, getFormEntries(form))
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => renderMode(button.dataset.choiceMode))
  })

  form.addEventListener("change", () => {
    renderDataRows(output, getFormEntries(form))
  })
  form.addEventListener("submit", (event) => event.preventDefault())

  renderMode("one")
}

function initCheckedSelectedDemo() {
  const demo = document.querySelector("[data-checked-selected-demo]")

  if (!demo) {
    return
  }

  const form = demo.querySelector("form")
  const output = demo.querySelector("[data-checked-selected-output]")

  function update() {
    renderDataRows(output, getFormEntries(form))
  }

  form.addEventListener("change", update)
  form.addEventListener("submit", (event) => event.preventDefault())
  update()
}

function initTextareaDemo() {
  const demo = document.querySelector("[data-textarea-demo]")

  if (!demo) {
    return
  }

  const textarea = demo.querySelector("[data-textarea-control]")
  const output = demo.querySelector("[data-textarea-output]")
  const status = demo.querySelector("[data-textarea-status]")

  function update() {
    const value = textarea.value.trim()
    output.textContent = value || "(empty message)"
    status.textContent = value
      ? "That text is the textarea value. The textarea still needs both an opening and closing tag."
      : "Placeholder text is only a hint. It is not the submitted value."
  }

  textarea.addEventListener("input", update)
  update()
}

function initSelectValueDemo() {
  const demo = document.querySelector("[data-select-value-demo]")

  if (!demo) {
    return
  }

  const select = demo.querySelector("select")
  const visible = demo.querySelector("[data-selected-visible]")
  const output = demo.querySelector("[data-selected-value-output]")
  const code = demo.querySelector("[data-selected-option-code]")

  function update() {
    const option = select.selectedOptions[0]
    visible.textContent = option.textContent
    code.textContent = `<option value="${option.value}">${option.textContent}</option>`
    renderDataRows(output, [[select.name, option.value]])
  }

  select.addEventListener("change", update)
  update()
}

function initFormDataInspector() {
  const inspector = document.querySelector("[data-form-data-inspector]")

  if (!inspector) {
    return
  }

  const form = inspector.querySelector("form")
  const output = inspector.querySelector("[data-inspector-output]")
  const status = inspector.querySelector("[data-inspector-status]")

  function update() {
    const entries = getFormEntries(form)
    renderDataRows(output, entries)

    const extraCount = entries.filter(([name]) => name === "extra").length
    status.textContent =
      extraCount === 0
        ? "No extras are checked, so no extra values are included."
        : `${extraCount} checked extra option${extraCount === 1 ? "" : "s"} contribute name/value data. Unchecked extras are omitted.`
  }

  form.addEventListener("input", update)
  form.addEventListener("change", update)
  form.addEventListener("submit", (event) => {
    event.preventDefault()
    update()
  })

  update()
}

function initControlPractice() {
  const practice = document.querySelector("[data-control-practice]")

  if (!practice) {
    return
  }

  const prompt = practice.querySelector("[data-practice-prompt]")
  const count = practice.querySelector("[data-practice-count]")
  const buttons = Array.from(practice.querySelectorAll("[data-practice-choice]"))
  const feedback = practice.querySelector("[data-practice-feedback]")
  const next = practice.querySelector("[data-practice-next]")
  let index = 0

  function renderScenario() {
    const scenario = controlPracticeScenarios[index]

    prompt.textContent = scenario.prompt
    count.textContent = `Scenario ${index + 1} of ${controlPracticeScenarios.length}`
    feedback.textContent = "Choose the control that best matches the kind of information being collected."

    buttons.forEach((button) => {
      button.classList.remove("is-selected", "is-correct", "is-incorrect")
      button.disabled = false
      button.setAttribute("aria-pressed", "false")
    })
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const scenario = controlPracticeScenarios[index]
      const selected = button.dataset.practiceChoice
      const correct = selected === scenario.answer

      buttons.forEach((choiceButton) => {
        const isSelected = choiceButton === button
        const isAnswer = choiceButton.dataset.practiceChoice === scenario.answer
        choiceButton.classList.toggle("is-selected", isSelected)
        choiceButton.classList.toggle("is-correct", isAnswer)
        choiceButton.classList.toggle("is-incorrect", isSelected && !correct)
        choiceButton.setAttribute("aria-pressed", String(isSelected))
      })

      feedback.textContent = correct
        ? `Correct. ${scenario.feedback}`
        : `Not this time. ${controlPracticeLabels[scenario.answer]} is a better fit. ${scenario.feedback}`
    })
  })

  next.addEventListener("click", () => {
    index = (index + 1) % controlPracticeScenarios.length
    renderScenario()
  })

  renderScenario()
}

initLessonPage(lessonConfig)
initCodePreviews()
initStaticFormPreviews()
initRadioNameDemo()
initChoiceModeDemo()
initCheckedSelectedDemo()
initTextareaDemo()
initSelectValueDemo()
initFormDataInspector()
initControlPractice()
