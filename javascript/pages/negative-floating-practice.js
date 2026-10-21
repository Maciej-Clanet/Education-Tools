import { readStorage, writeStorage } from '../core/storage.js'
import { fractionTask, nextFractionTask, checkFractionAnswer } from '../core/negative-floating-model.js'

const storageKey = 'lesson-negative-floating-fraction-practice-v1'

export function initFractionPractice(root = document) {
  const host = root.querySelector('[data-fraction-practice]')
  if (!host) return
  const form = host.querySelector('form')
  const input = host.querySelector('[data-fraction-answer]')
  const feedback = host.querySelector('[data-fraction-feedback]')
  const saved = readStorage(storageKey,null)
  let task
  try { task = fractionTask(saved?.numerator) } catch { task = fractionTask(21) }
  let answer = saved?.numerator === task.numerator && typeof saved.answer === 'string' ? saved.answer : ''
  let checked = saved?.numerator === task.numerator && saved?.checked === true
  const save = () => writeStorage(storageKey,{numerator:task.numerator,answer,checked})
  function renderFeedback() {
    const result = checked ? checkFractionAnswer(task,answer) : null
    feedback.textContent = result?.message ?? 'Add the place values with a 1. Then select Check answer.'
    feedback.className = 'practice-feedback'
    feedback.classList.toggle('is-correct',result?.correct === true)
    feedback.classList.toggle('is-incorrect',result?.correct === false)
  }
  function render() {
    host.querySelector('[data-fraction-question]').textContent = task.binary
    host.querySelectorAll('[data-fraction-bit]').forEach((cell,index) => { cell.textContent = task.bits[index] })
    input.value = answer
    renderFeedback()
  }
  form.addEventListener('submit',event => {
    event.preventDefault()
    answer = input.value
    checked = true
    save(); renderFeedback()
  })
  input.addEventListener('input',() => {
    answer = input.value
    checked = false
    save(); renderFeedback()
  })
  host.querySelector('[data-fraction-new]').addEventListener('click',() => {
    task = nextFractionTask(task.numerator)
    answer = ''; checked = false
    save(); render(); input.focus()
  })
  host.querySelectorAll('[data-fraction-js]').forEach(control => { control.hidden = false })
  render()
}
