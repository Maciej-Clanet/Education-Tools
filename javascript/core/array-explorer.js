import { updateArrayValue } from './array-model.js'

export function initArrayExplorers(root = document) {
  root.querySelectorAll('[data-array-explorer]').forEach(host => {
    if (host.dataset.arrayReady) return
    const cells = [...host.querySelectorAll('[data-array-index]')]
    const input = host.querySelector('[data-array-input]')
    const form = host.querySelector('[data-array-controls]')
    const output = host.querySelector('[data-array-output]')
    const status = host.querySelector('[data-array-status]')
    if (!cells.length || !input || !form || !output || !status) return
    const original = cells.map(cell => Number(cell.dataset.value))
    let values = [...original]
    const initialSelection = Math.max(0, cells.findIndex(cell => cell.getAttribute('aria-pressed') === 'true'))
    let selected = initialSelection
    const render = () => {
      cells.forEach((cell, index) => {
        cell.setAttribute('aria-pressed', String(index === selected))
        cell.querySelector('[data-array-value]').textContent = values[index]
        cell.setAttribute('aria-label', `Index ${index}, ${index + 8}:00, count ${values[index]}`)
        cell.style.setProperty('--array-level', `${Math.max(4, values[index] / Math.max(1, ...values) * 100)}%`)
      })
      output.textContent = `failedLogins[${selected}] → ${values[selected]}`
      host.querySelector('.al-readout > span').textContent = `Read element ${selected + 1} of ${values.length}`
      host.querySelector('[data-array-selected]').textContent = selected
      input.value = values[selected]
    }
    cells.forEach((cell, index) => {
      cell.disabled = false
      cell.addEventListener('click', () => {
        selected = index
        render()
        status.textContent = `Read index ${index}: ${values[index]} failed logins during the hour starting ${index + 8}:00. The value stays in the array.`
      })
    })
    form.addEventListener('submit', event => {
      event.preventDefault()
      const result = updateArrayValue(values, selected, input.value)
      if (!result.ok) { status.textContent = result.message; return }
      values = result.values
      render()
      status.textContent = `Updated index ${selected} from ${result.previous} to ${result.value}. The array still contains ${values.length} elements.`
    })
    host.querySelector('[data-array-restore]').addEventListener('click', () => {
      values = [...original]
      selected = initialSelection
      render()
      status.textContent = 'Original counts restored. Select a slot to read its value.'
    })
    form.hidden = false
    host.dataset.arrayReady = 'true'
    render()
  })
}
