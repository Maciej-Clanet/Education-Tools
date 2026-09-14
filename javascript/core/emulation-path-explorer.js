import { nextKernelState } from './kernel-visualiser.js'
import { emulationExamples } from '../data/emulation-examples.js'

export function nextEmulationPathState(state, action) {
  if (action.type === 'example' && Object.hasOwn(emulationExamples, action.value)) return { ...state, example: action.value, index: 0 }
  if (action.type === 'view' && ['native', 'emulated'].includes(action.value)) return { ...state, view: action.value, index: 0 }
  const frames = emulationExamples[state.example][state.view]
  const next = nextKernelState({ index: state.index, playing: false }, action.type, frames.length)
  return { ...state, index: next.index }
}
export function initEmulationPathExplorers(root = document) {
  root.querySelectorAll('[data-emulation-path]').forEach((host, instance) => {
    if (host.dataset.emulationReady) return
    host.dataset.emulationReady = 'true'
    let state = { example: 'retro', view: 'emulated', index: 0 }
    const query = selector => host.querySelector(selector)
    const modeInputs = [...host.querySelectorAll('[name=emulation-view]')]
    modeInputs.forEach(input => { input.name = `emulation-view-${instance}` })
    function render() {
      const example = emulationExamples[state.example], frames = example[state.view]
      host.dataset.view = state.view
      query('[data-emulation-example]').value = state.example
      modeInputs.forEach(input => { input.checked = input.value === state.view })
      query('[data-emulation-context]').textContent = example.context[state.view]
      query('[data-emulation-stages]').replaceChildren(...frames.map(([role, label], index) => {
        const stage = document.createElement('li')
        const title = document.createElement('strong'), detail = document.createElement('span')
        title.textContent = role; detail.textContent = label
        stage.append(title, detail)
        if (index === state.index) { stage.setAttribute('aria-current', 'step'); stage.dataset.active = '' }
        stage.dataset.stage = String(index)
        return stage
      }))
      const [role, label, description] = frames[state.index]
      query('[data-emulation-stage-title]').textContent = `${role}: ${label}`
      query('[data-emulation-description]').textContent = description
      const announcement = document.createElement('span')
      announcement.className = 'sr-only'
      announcement.textContent = ` ${description}`
      query('[data-emulation-status]').replaceChildren(`Stage ${state.index + 1} of ${frames.length}. ${role}.`, announcement)
      query('[data-emulation-action=previous]').disabled = state.index === 0
      query('[data-emulation-action=step]').disabled = state.index === frames.length - 1
    }
    function dispatch(action) { state = nextEmulationPathState(state, action); render() }
    query('[data-emulation-example]').addEventListener('change', event => dispatch({ type: 'example', value: event.target.value }))
    modeInputs.forEach(input => input.addEventListener('change', () => dispatch({ type: 'view', value: input.value })))
    host.querySelectorAll('[data-emulation-action]').forEach(button => button.addEventListener('click', () => dispatch({ type: button.dataset.emulationAction })))
    render()
  })
}
