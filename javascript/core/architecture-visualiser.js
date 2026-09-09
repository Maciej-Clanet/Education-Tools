import { nextKernelState } from './kernel-visualiser.js'
import { architectureFrames } from '../data/architecture-frames.js'

export function getArchitectureFrames(kind, mode) {
  return kind === 'compare' ? architectureFrames.compare[mode] : architectureFrames[kind]
}

export function nextArchitectureState(state, action, kind) {
  if (action === 'von' || action === 'harvard') return { mode: action, index: 0 }
  const frames = getArchitectureFrames(kind, state.mode)
  const next = nextKernelState({ index: state.index, playing: false }, action, frames.length)
  return { mode: state.mode, index: next.index }
}

export function initArchitectureVisualisers(root = document) {
  root.querySelectorAll('[data-architecture-demo]').forEach(host => {
    if (host.dataset.architectureReady) return
    host.dataset.architectureReady = 'true'
    const kind = host.dataset.architectureDemo
    let state = { mode: kind === 'concurrent' ? 'harvard' : 'von', index: 0 }
    const diagram = host.querySelector('[data-machine]')
    function render() {
      const frames = getArchitectureFrames(kind, state.mode)
      const frame = frames[state.index]
      diagram.dataset.mode = frame.mode
      diagram.dataset.focus = frame.focus
      diagram.dataset.transfer = frame.transfer
      diagram.querySelector('[data-machine-signal]').textContent = frame.signal
      diagram.querySelector('[data-machine-transfer-label]').textContent = frame.signal
      diagram.querySelector('[data-machine-working]').textContent = frame.working
      diagram.querySelector('[data-machine-output]').textContent = frame.output
      diagram.querySelector('svg').setAttribute('aria-label', frame.description)
      host.querySelector('[data-architecture-status]').textContent = `View ${state.index + 1} of ${frames.length}. ${frame.description}`
      host.querySelector('[data-architecture-action="previous"]').disabled = state.index === 0
      host.querySelector('[data-architecture-action="step"]').disabled = state.index === frames.length - 1
      host.querySelectorAll('[data-architecture-mode]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.architectureMode === state.mode)))
    }
    host.querySelectorAll('[data-architecture-action], [data-architecture-mode]').forEach(button => button.addEventListener('click', () => {
      state = nextArchitectureState(state, button.dataset.architectureAction ?? button.dataset.architectureMode, kind)
      render()
    }))
    render()
  })
}
