import { initCodePreviews } from "../core/code-preview.js"
import { initLessonPage } from "../core/lesson-shell.js"

const lessonConfig = {
  lessonId: "forms-1-inputs-labels-and-submitting-data",
  defaultContext: "web-development",
  contexts: {
    "web-development": {
      label: "Web Development",
      backHref: "../resources/web-development.html#html-basics",
      backLabel: "Back to Web Development resources",
      previous: {
        title: "File paths, folders, and linking pages",
        href: "file-paths-folders-and-linking-pages.html",
        description:
          "The previous lesson covered project folders, relative paths, src, href, and linking HTML pages together.",
        status: "Live",
      },
      next: {
        title: "Forms 2: Choices, larger inputs, and grouping",
        href: "forms-2-choices-larger-inputs-and-grouping.html",
        description:
          "Next, choose the right form controls for radio groups, checkboxes, textareas, selects, and grouped questions.",
        status: "Live",
      },
    },
  },
  quiz: {
    storageKey: "lesson-forms-1-inputs-labels-and-submitting-data-quiz",
    passScore: 10,
  },
}

const typeDetails = {
  text: {
    label: "Short text",
    example: "Alex",
    code: '<input id="first-name" name="firstName" type="text">',
    note: "Text is for ordinary short text such as a name.",
  },
  email: {
    label: "Email address",
    example: "alex@example.com",
    code: '<input id="email" name="email" type="email">',
    note:
      "Email tells the browser this field expects an email address. The browser may help with validation or keyboard layout.",
  },
  password: {
    label: "Password",
    example: "secret",
    code: '<input id="password" name="password" type="password">',
    note:
      "Password hides the characters on screen. That masking does not store or encrypt the password by itself.",
  },
  number: {
    label: "Quantity",
    example: "3",
    code: '<input id="quantity" name="quantity" type="number">',
    note:
      "Number is for suitable quantities. A value containing digits, such as a phone number, is not always a quantity.",
  },
}

const anatomyParts = {
  form: {
    title: "<form>",
    text: "Groups the controls that collect input from the user.",
  },
  label: {
    title: "<label>",
    text: "Tells the user what information the connected input expects.",
  },
  for: {
    title: 'for="email"',
    text: "Connects this label to the element with the matching id.",
  },
  id: {
    title: 'id="email"',
    text: "Identifies this one input element on the page.",
  },
  name: {
    title: 'name="email"',
    text: "Identifies what this value should be called when the form is submitted.",
  },
  type: {
    title: 'type="email"',
    text: "Tells the browser what kind of input this control expects.",
  },
  required: {
    title: "required",
    text: "Asks the browser not to submit the form while this field is empty.",
  },
  submit: {
    title: 'button type="submit"',
    text: "Tells the form the user wants to submit the entered information.",
  },
}

function initInputOutputDemo() {
  const demo = document.querySelector("[data-ipo-demo]")

  if (!demo) {
    return
  }

  const input = demo.querySelector("[data-ipo-input]")
  const processing = demo.querySelector("[data-ipo-processing]")
  const output = demo.querySelector("[data-ipo-output]")

  function update() {
    const name = input.value.trim() || "student"
    processing.textContent = `Take the input value "${name}" and build a greeting.`
    output.textContent = `Hello, ${name}!`
  }

  input.addEventListener("input", update)
  update()
}

function initLabelFocusDemo() {
  const demo = document.querySelector("[data-label-focus-demo]")

  if (!demo) {
    return
  }

  const input = demo.querySelector("#label-focus-name")
  const status = demo.querySelector("[data-label-focus-status]")

  input.addEventListener("focus", () => {
    status.textContent =
      'The input is focused. The label worked because for="label-focus-name" matches id="label-focus-name".'
  })

  input.addEventListener("blur", () => {
    status.textContent = "Click the visible Name label or tab to the input."
  })
}

function initPlaceholderDemo() {
  const demo = document.querySelector("[data-placeholder-demo]")

  if (!demo) {
    return
  }

  const badInput = demo.querySelector("[data-placeholder-bad]")
  const betterInput = demo.querySelector("[data-placeholder-better]")
  const status = demo.querySelector("[data-placeholder-status]")

  function update() {
    const badHasValue = badInput.value.trim() !== ""
    const betterHasValue = betterInput.value.trim() !== ""

    status.textContent = badHasValue
      ? "In the first box, the hint disappears once text is typed. The second box still has a visible label."
      : betterHasValue
        ? "The labelled field still tells the user what the field is for after typing begins."
        : "Type in either box. Placeholder text is only a hint; it is not the label."
  }

  badInput.addEventListener("input", update)
  betterInput.addEventListener("input", update)
  update()
}

function initInputTypeDemo() {
  const demo = document.querySelector("[data-input-type-demo]")

  if (!demo) {
    return
  }

  const select = demo.querySelector("[data-input-type-select]")
  const label = demo.querySelector("[data-input-type-label]")
  const input = demo.querySelector("[data-input-type-control]")
  const code = demo.querySelector("[data-input-type-code]")
  const note = demo.querySelector("[data-input-type-note]")

  function update() {
    const detail = typeDetails[select.value] ?? typeDetails.text

    label.textContent = detail.label
    input.type = select.value
    input.value = detail.example
    input.name = select.value
    input.placeholder = detail.example
    code.textContent = detail.code
    note.textContent = detail.note
  }

  select.addEventListener("change", update)
  update()
}

function initValidationDemo() {
  const demo = document.querySelector("[data-validation-demo]")

  if (!demo) {
    return
  }

  const form = demo.querySelector("form")
  const email = demo.querySelector("#validation-email")
  const status = demo.querySelector("[data-validation-status]")

  function updateInvalidMessage() {
    status.textContent =
      email.validity.valueMissing
        ? "The browser stops the submit because the required email field is empty."
        : "The browser stops the submit because this does not look like an email address."
  }

  email.addEventListener("invalid", updateInvalidMessage)

  form.addEventListener("submit", (event) => {
    event.preventDefault()

    if (!form.checkValidity()) {
      updateInvalidMessage()
      email.reportValidity?.()
      return
    }

    status.textContent =
      "The browser accepts the value. This static teaching page is simulating what could happen after submission."
  })

  email.addEventListener("input", () => {
    status.textContent =
      "Try submitting an empty value, an invalid email, and then a sensible email address."
  })
}

function initStaticFormPreviews() {
  document.addEventListener("submit", (event) => {
    if (event.target.matches("[data-static-form-preview]")) {
      event.preventDefault()
    }
  })
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

function initFormDataDemo() {
  const demo = document.querySelector("[data-form-data-demo]")

  if (!demo) {
    return
  }

  const form = demo.querySelector("form")
  const nameInput = demo.querySelector("#data-student-name")
  const nameAttributeInput = demo.querySelector("#data-name-attribute")
  const nameCode = demo.querySelector("[data-name-code]")
  const output = demo.querySelector("[data-form-data-output]")
  const status = demo.querySelector("[data-form-data-status]")

  function updateNameAttribute() {
    const nextName = nameAttributeInput.value.trim()

    if (nextName) {
      nameInput.name = nextName
      nameCode.textContent = `name="${nextName}"`
      return
    }

    nameInput.removeAttribute("name")
    nameCode.textContent = "no name attribute"
  }

  function showCollectedData() {
    updateNameAttribute()

    const entries = Array.from(new FormData(form).entries())
    renderDataRows(output, entries)

    const hasStudentName = nameInput.hasAttribute("name")
    status.textContent = hasStudentName
      ? "The output uses each input's name as the label for its submitted value. The nickname field is omitted because it has no name."
      : "The first input was omitted because its name attribute is blank. The nickname field is also omitted because it has no name."
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault()
    showCollectedData()
  })

  nameAttributeInput.addEventListener("input", () => {
    updateNameAttribute()
    status.textContent =
      "Change the name attribute, then submit again to see the submitted data label change."
  })

  updateNameAttribute()
  showCollectedData()
}

function initFormAnatomy() {
  const explorer = document.querySelector("[data-form-anatomy]")

  if (!explorer) {
    return
  }

  const buttons = Array.from(explorer.querySelectorAll("[data-anatomy-part]"))
  const highlights = Array.from(explorer.querySelectorAll("[data-anatomy-target]"))
  const title = explorer.querySelector("[data-anatomy-title]")
  const text = explorer.querySelector("[data-anatomy-text]")

  function selectPart(part) {
    const detail = anatomyParts[part] ?? anatomyParts.form

    buttons.forEach((button) => {
      const isSelected = button.dataset.anatomyPart === part
      button.classList.toggle("is-selected", isSelected)
      button.setAttribute("aria-pressed", String(isSelected))
    })

    highlights.forEach((highlight) => {
      highlight.classList.toggle("is-selected", highlight.dataset.anatomyTarget === part)
    })

    title.textContent = detail.title
    text.textContent = detail.text
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => selectPart(button.dataset.anatomyPart))
  })

  selectPart("form")
}

initLessonPage(lessonConfig)
initCodePreviews()
initStaticFormPreviews()
initInputOutputDemo()
initLabelFocusDemo()
initPlaceholderDemo()
initInputTypeDemo()
initValidationDemo()
initFormDataDemo()
initFormAnatomy()
