import { nextKernelState } from './kernel-visualiser.js'
import { architectureFrames } from '../data/architecture-frames.js'

export const getArchitectureFrames = kind => architectureFrames[kind]

export function nextArchitectureState(state, action, kind) {
  const frames = getArchitectureFrames(kind)
  if (action === 'play' && state.index === frames.length - 1) return { index: 0, playing: true }
  return nextKernelState(state, action, frames.length)
}

// Labelled transfers are teaching content: OS reduced motion does not disable them.
export function initArchitectureVisualisers(root = document) {
  const players = []
  root.querySelectorAll('[data-architecture-demo]').forEach(host => {
    if (host.dataset.architectureReady) return
    const kind = host.dataset.architectureDemo, frames = getArchitectureFrames(kind)
    if (!frames || !host.querySelector('[data-architecture-controls]')) return
    host.dataset.architectureReady = 'true'
    let state = { index: 0, playing: false }, timer = null
    const play = host.querySelector('[data-architecture-action="play"]')
    function clearFlights() {
      host.querySelectorAll('.arch-flight').forEach(item => { item.getAnimations().forEach(animation => animation.cancel()); item.remove() })
    }
    function render(animate = false) {
      clearFlights()
      const frame = frames[state.index]
      host.dataset.architectureIndex = String(state.index)
      host.dataset.architecturePlaying = String(state.playing)
      for (const field of ['instruction', 'working', 'output']) {
        const target = host.querySelector(`[data-machine-${field}]`)
        if (target) target.textContent = frame[field]
      }
      host.querySelector('[data-architecture-status]').textContent = `${state.index + 1} of ${frames.length} · ${frame.title}`
      host.querySelector('[data-architecture-description]').textContent = frame.description
      host.querySelectorAll('[data-memory-item]').forEach(item => item.classList.toggle('is-active', frame.active.includes(item.dataset.memoryItem)))
      host.querySelectorAll('[data-request-kind]').forEach(item => {
        const status = frame.requests[item.dataset.requestKind]
        item.textContent = status
        item.dataset.waiting = String(status === 'Waiting')
      })
      host.querySelector('.arch-processor').classList.toggle('is-calculating', frame.active.includes('alu'))
      host.querySelector('[data-architecture-action="previous"]').setAttribute('aria-disabled', String(state.index === 0))
      host.querySelector('[data-architecture-action="step"]').setAttribute('aria-disabled', String(state.index === frames.length - 1))
      play.textContent = state.playing ? 'Pause' : state.index === frames.length - 1 ? 'Replay' : 'Play'
      play.setAttribute('aria-pressed', String(state.playing))
      if (animate) for (const transfer of frame.transfers) {
        const lane = host.querySelector(`[data-transfer-lane="${transfer.lane}"]`)
        const flight = document.createElement('span')
        flight.className = `arch-flight arch-${transfer.kind}`
        flight.setAttribute('aria-hidden', 'true')
        const label = document.createElement('small'); label.textContent = transfer.kind === 'instruction' ? 'Instruction' : 'Data'
        const value = document.createElement('b'); value.textContent = transfer.text
        flight.append(label, value); lane.append(flight)
        const vertical = getComputedStyle(lane).getPropertyValue('--travel-axis').trim() === 'y'
        const distance = Math.max(0, vertical ? lane.clientHeight - flight.offsetTop - flight.offsetHeight : lane.clientWidth - flight.offsetLeft - flight.offsetWidth)
        const transform = vertical ? `translateY(${distance}px)` : `translateX(${distance}px)`
        flight.animate([{ transform: 'translate(0, 0)', opacity: 1 }, { transform, opacity: 1 }], { duration: 1100, easing: 'ease-in-out', fill: 'forwards' })
      }
    }
    function dispatch(action) {
      clearTimeout(timer); timer = null
      state = nextArchitectureState(state, action, kind)
      render(['step', 'tick', 'previous'].includes(action))
      if (state.playing) timer = setTimeout(() => dispatch('tick'), 2400)
    }
    function pause() {
      clearTimeout(timer); timer = null
      state = { ...state, playing: false }
      // Pause an in-flight demonstration in place; manual stepping renders a new frame.
      host.querySelectorAll('.arch-flight').forEach(item => item.getAnimations().forEach(animation => animation.pause()))
      host.dataset.architecturePlaying = 'false'
      play.textContent = state.index === frames.length - 1 ? 'Replay' : 'Play'
      play.setAttribute('aria-pressed', 'false')
    }
    host.querySelectorAll('[data-architecture-action]').forEach(button => button.addEventListener('click', () => {
      const action = button.dataset.architectureAction
      if (button.getAttribute('aria-disabled') === 'true') return
      if (action === 'play' && state.playing) { pause(); return }
      if (action === 'play') {
        host.querySelectorAll('.arch-flight').forEach(item => item.getAnimations().forEach(animation => animation.play()))
        if (state.index < frames.length - 1) {
          state = { ...state, playing: true }
          host.dataset.architecturePlaying = 'true'; play.textContent = 'Pause'; play.setAttribute('aria-pressed', 'true')
          clearTimeout(timer); timer = setTimeout(() => dispatch('tick'), 2400); return
        }
      }
      dispatch(action)
    }))
    host.querySelector('[data-architecture-controls]').hidden = false
    host.querySelector('[data-architecture-transcript]').hidden = true
    players.push({ host, pause })
    render()
  })
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (!entry.isIntersecting) players.find(player => player.host === entry.target)?.pause() }))
  players.forEach(player => observer.observe(player.host))
  document.addEventListener('visibilitychange', () => { if (document.hidden) players.forEach(player => player.pause()) })
  window.addEventListener('pagehide', () => players.forEach(player => player.pause()))
}
