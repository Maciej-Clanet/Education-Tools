import { subtractionSteps, divisionSteps } from "../core/binary-arithmetic-model.js"

const binary = value => value.toString(2)
const element = (tag, className, text) => {
  const node = document.createElement(tag)
  node.className = className
  if (text !== undefined) node.textContent = text
  return node
}

function bitTable(labels, width) {
  const table = element("table", "ba-table ba-demo-table")
  const head = table.createTHead().insertRow()
  const corner = document.createElement("th")
  corner.scope = "col"
  corner.innerHTML = 'Place value <small>(denary)</small>'
  head.append(corner)
  for (let i = 0; i < width; i += 1) {
    const cell = element("th", "", 2 ** (width - 1 - i))
    cell.scope = "col"
    head.append(cell)
  }
  const body = table.createTBody()
  const rows = {}
  labels.forEach(([key, label]) => {
    const row = body.insertRow()
    const heading = element("th", "", label)
    heading.scope = "row"
    row.append(heading)
    rows[key] = Array.from({length:width}, () => row.insertCell())
  })
  return {table, rows}
}

export function initArithmeticDemos(root = document) {
  root.querySelectorAll("[data-arithmetic-demo]").forEach(demo => {
    const subtraction = demo.dataset.arithmeticDemo === "subtraction"
    const first = Number(demo.dataset.first)
    const second = Number(demo.dataset.second)
    const width = subtraction ? 4 : binary(first).length
    const steps = subtraction ? subtractionSteps(first, second, width) : divisionSteps(first, second)
    const bits = binary(first).padStart(width, "0").split("")
    const bottom = binary(second).padStart(width, "0").split("")
    const tool = element("div", "ba-demo")
    tool.dataset.noSlideAdvance = ""
    const summary = element("p", "ba-demo-intro", subtraction
      ? `${bits.join("")} − ${bottom.join("")}. Work from right to left. Borrow when the top value is too small.`
      : `${binary(first)} ÷ ${binary(second)}. Work from left to right. Bring down one bit, then decide whether to subtract.`)
    const {table, rows} = bitTable(subtraction
      ? [["original","Original"],["top","New top"],["bottom","Subtract"],["answer","Answer"]]
      : [["answer","Answer"],["original","Number to divide"]], width)
    const stage = element("div", "ba-demo-stage")
    stage.append(table)
    const work = element("div", "ba-division-work")
    let current, remainder, calculation
    if (!subtraction) {
      const group = element("div", "ba-work-box")
      group.append(element("span", "", "Current group"))
      current = element("code", "ba-current-group", "—")
      group.append(current)
      const calculationBox = element("div", "ba-work-box ba-calculation")
      calculationBox.append(element("span", "", `Can we subtract ${binary(second)}?`))
      calculation = element("strong", "", "Bring down the first bit.")
      calculationBox.append(calculation)
      const left = element("div", "ba-work-box")
      left.append(element("span", "", "Left over"))
      remainder = element("code", "", "0")
      left.append(remainder)
      work.append(group, calculationBox, left)
      stage.append(work)
    }
    const explanation = element("p", "ba-demo-explanation")
    explanation.setAttribute("aria-live", "polite")
    explanation.setAttribute("aria-atomic", "true")
    const controls = element("div", "ba-demo-controls")
    const previous = element("button", "lesson-secondary-action", "Previous step")
    const next = element("button", "primary-link", "Next step")
    const reset = element("button", "lesson-secondary-action", "Start again")
    const status = element("span", "ba-demo-status")
    for (const button of [previous, next, reset]) button.type = "button"
    previous.dataset.demoAction = "previous"
    next.dataset.demoAction = "next"
    reset.dataset.demoAction = "reset"
    controls.append(previous, next, reset, status)
    const note = element("p", "ba-demo-note", subtraction
      ? "The place values are in denary. The working digits are binary: 10 means two in that column."
      : `All working is binary. If the current group is smaller than ${binary(second)}, write 0 and keep the group. Otherwise, write 1 and subtract ${binary(second)}.`)
    tool.append(summary, stage, explanation, controls, note)
    demo.prepend(tool)
    demo.classList.add("is-ready")
    let index = 0
    let animation = null
    let moving = null
    let revision = 0

    function render() {
      const step = steps[index]
      tool.dataset.step = index
      tool.dataset.phase = step.phase
      rows.original.forEach((cell, i) => { cell.textContent = bits[i] })
      Object.values(rows).flat().forEach(cell => cell.classList.remove("ba-active-cell", "ba-exchange-cell"))
      const set = (cells, values) => cells.forEach((cell, i) => { cell.textContent = values[i] || "·" })
      if (subtraction) {
        set(rows.top, step.top)
        set(rows.bottom, bottom)
        set(rows.answer, step.answer)
        if (step.column !== null) [rows.top, rows.bottom, rows.answer].forEach(cells => cells[step.column].classList.add("ba-active-cell"))
        const place = 2 ** (width - 1 - step.column)
        if (step.phase === "start") explanation.textContent = "Start at the 1s column on the right. Compare the top and bottom digits."
        if (step.phase === "check") explanation.textContent = step.needsBorrow
          ? `${place}s column: 0 − 1 needs a borrow. Look left for a column that has a 1. Move its value one column at a time.`
          : `${place}s column: ${step.top[step.column]} − ${bottom[step.column]}. The top value is large enough. No borrow is needed.`
        if (step.phase === "borrow") {
          const fromPlace = 2 ** (width - 1 - step.from)
          const toPlace = fromPlace / 2
          rows.top[step.from].classList.add("ba-exchange-cell")
          rows.top[step.to].classList.add("ba-exchange-cell")
          explanation.textContent = `Move one ${fromPlace} to the ${toPlace}s column. One ${fromPlace} becomes two ${toPlace}s, written 10. The ${fromPlace}s column now has ${step.top[step.from]}.`
        }
        if (step.phase === "subtract") explanation.textContent = `${place}s column: ${step.top[step.column]} − ${bottom[step.column]} = ${step.answer[step.column]}. Write ${step.answer[step.column]} in the answer row.`
        if (step.phase === "done") explanation.textContent = `${bits.join("")} − ${bottom.join("")} = ${step.answer.join("")}. In denary: ${first} − ${second} = ${first - second}.`
      } else {
        set(rows.answer, step.quotient)
        current.replaceChildren()
        remainder.textContent = binary(step.remainder)
        if (step.column !== null) {
          rows.original[step.column].classList.add("ba-active-cell")
          rows.answer[step.column].classList.add("ba-active-cell")
        }
        if (step.phase === "start") {
          current.textContent = "—"
          calculation.textContent = "Bring down the first bit."
          explanation.textContent = `The number we divide by is ${binary(second)}. Start with no remainder. Choose Next step to bring down the first bit.`
        }
        if (step.phase === "bring" || step.phase === "decide") {
          // Appending a bit is a place shift, not addition: 10 followed by 1 is 101.
          if (step.column > 0) current.append(document.createTextNode(binary(step.before)))
          current.append(element("span", "ba-brought-bit", step.bit))
          const full = `${step.column > 0 ? binary(step.before) : ""}${step.bit}`
          if (step.phase === "bring") {
            calculation.textContent = `${full} is ${step.current < second ? "smaller than" : step.current === second ? "equal to" : "larger than"} ${binary(second)}.`
            explanation.textContent = step.column === 0
              ? `Bring down the first bit: ${step.bit}. The current group is ${step.bit}. Next, decide whether to subtract ${binary(second)}.`
              : `Bring down ${step.bit}. Put it to the right of the leftover ${binary(step.before)} to make ${full}. Next, decide whether to subtract ${binary(second)}.`
          } else {
            calculation.textContent = step.quotientBit === "1" ? `${full} − ${binary(second)} = ${binary(step.remainder)}` : `Keep ${binary(step.remainder)}. Do not subtract.`
            explanation.textContent = step.quotientBit === "1"
              ? `Write 1 in the answer. Subtract ${binary(second)} from ${full}. Keep the leftover ${binary(step.remainder)} for the next bit.`
              : `${full} is too small to subtract ${binary(second)}. Write 0 in the answer. Keep ${binary(step.remainder)} for the next bit.`
          }
        }
        if (step.phase === "done") {
          current.textContent = "Finished"
          calculation.textContent = `Answer: ${binary(Math.floor(first / second))}`
          explanation.textContent = `${binary(first)} ÷ ${binary(second)} = ${binary(Math.floor(first / second))}, remainder ${binary(step.remainder)}. You can leave off zeros at the start of the answer.`
        }
      }
      previous.setAttribute("aria-disabled", String(index === 0))
      next.setAttribute("aria-disabled", String(index === steps.length - 1))
      reset.setAttribute("aria-disabled", String(index === 0))
      status.textContent = `Step ${index + 1} of ${steps.length}`
    }

    function cancelMovement() {
      revision += 1
      animation?.cancel()
      moving?.remove()
      animation = null
      moving = null
      tool.removeAttribute("aria-busy")
    }

    function travel(source, destination, label, finish) {
      const token = element("span", "ba-moving-token", label)
      token.setAttribute("aria-hidden", "true")
      const bounds = stage.getBoundingClientRect()
      const from = source.getBoundingClientRect()
      const to = destination.getBoundingClientRect()
      token.style.left = `${from.left + from.width / 2 - bounds.left}px`
      token.style.top = `${from.top + from.height / 2 - bounds.top}px`
      stage.append(token)
      moving = token
      const x = to.left + to.width / 2 - from.left - from.width / 2
      const y = to.top + to.height / 2 - from.top - from.height / 2
      tool.setAttribute("aria-busy", "true")
      const thisRevision = revision
      // This brief, requested motion teaches the transfer, including with reduced motion.
      animation = token.animate([
        {transform:"translate(-50%, -50%)", offset:0},
        {transform:`translate(calc(-50% + ${x / 2}px), calc(-50% + ${y / 2 - 24}px))`, offset:.5},
        {transform:`translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`, offset:1},
      ], {duration:1100, easing:"ease-in-out", fill:"forwards"})
      animation.finished.then(() => {
        if (revision !== thisRevision) return
        cancelMovement()
        finish()
      }).catch(() => {})
    }

    function show(requested, animate = false) {
      const old = steps[index]
      cancelMovement()
      index = Math.max(0, Math.min(steps.length - 1, requested))
      render()
      const step = steps[index]
      if (animate && step.phase === "borrow") {
        rows.top[step.from].textContent = old.top[step.from]
        rows.top[step.to].textContent = old.top[step.to]
        travel(rows.top[step.from], rows.top[step.to], `1 × ${2 ** (width - 1 - step.from)}`, render)
      } else if (animate && step.phase === "bring") {
        const target = current.querySelector(".ba-brought-bit")
        target.style.opacity = "0"
        travel(rows.original[step.column], target, step.bit, render)
      }
    }
    previous.addEventListener("click", () => show(index - 1))
    next.addEventListener("click", () => { if (!animation && index < steps.length - 1) show(index + 1, true) })
    reset.addEventListener("click", () => show(0))
    document.addEventListener("visibilitychange", () => { if (document.hidden) { cancelMovement(); render() } })
    render()
  })
}
