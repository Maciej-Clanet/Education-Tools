import { memoryRoute } from './scaling-activities.js'

export function initialMemoryExplorerState() {
  return { architecture: 'uma', view: 'physical', count: 2, processor: 0, task: 0, data: 0, accessed: false }
}
export function nextMemoryExplorerState(state, action) {
  const { type, value } = action
  if (type === 'reset') return initialMemoryExplorerState()
  if (type === 'architecture' && ['uma', 'numa'].includes(value)) return { ...state, architecture: value, accessed: false }
  if (type === 'view' && ['physical', 'logical'].includes(value)) return { ...state, view: value }
  if (type === 'count' && [2, 4, 8].includes(value)) return { ...state, count: value, processor: Math.min(state.processor, value - 1), accessed: false }
  if (type === 'processor' && Number.isInteger(value) && value >= 0 && value < state.count) return { ...state, processor: value, accessed: false }
  if (['task', 'data'].includes(type) && [0, 1].includes(value)) return { ...state, [type]: value, accessed: false }
  if (type === 'access') return { ...state, accessed: true }
  if (type === 'near' && state.architecture === 'numa') return { ...state, task: state.data, accessed: true }
  return state
}
export function memoryExplorerResult(state) {
  if (!state.accessed) return { kind: 'ready', path: '', description: state.architecture === 'uma'
    ? 'UMA · uniform main-memory access. Choose a unit, then Access memory.'
    : 'NUMA · choose where the task runs and where its data is stored, then Access memory.' }
  if (state.architecture === 'uma') {
    const x = state.view === 'physical' ? 259 + state.processor * 42 : 85 + state.processor * 88
    return { kind: 'uniform', path: state.view === 'physical' ? `M${x} 151V194H400V264H280` : `M${x} 143V215H400V270`,
      description: `Unit ${String.fromCharCode(65 + state.processor)} → memory system → shared RAM. UNIFORM access relationship; no local/remote NUMA distinction.` }
  }
  // Reuse the established local/remote model; the new drawings number regions 0/1.
  const { local } = memoryRoute(state.task === 0 ? 'A' : 'B', state.data === 0 ? 'A' : 'B')
  let path
  if (state.view === 'physical') path = `M${state.task === 0 ? 250 : 550} 170H${state.data === 0 ? 112 : 688}`
  else {
    const from = state.task === 0 ? 190 : 610, to = state.data === 0 ? 190 : 610
    path = local ? `M${from} 155V250` : `M${from} 155V185H${to}V250`
  }
  return { kind: local ? 'local' : 'remote', path,
    description: `Socket ${state.task} → ${local ? '' : 'internal interconnect → '}RAM ${state.data}. ${local ? 'LOCAL: directly attached memory; generally lower latency.' : 'REMOTE: other node’s memory remains accessible; generally higher latency.'}` }
}
export function initSharedMemoryExplorers(root = document) {
  root.querySelectorAll('[data-memory-explorer]').forEach(host => {
    if (host.dataset.explorerReady) return
    host.dataset.explorerReady = 'true'
    let state = initialMemoryExplorerState()
    const query = selector => host.querySelector(selector)
    const processor = query('[data-explorer-processor]')
    function render() {
      const result = memoryExplorerResult(state), uma = state.architecture === 'uma'
      host.dataset.architecture = state.architecture
      host.dataset.access = result.kind
      host.querySelectorAll('[name=explorer-architecture]').forEach(input => { input.checked = input.value === state.architecture })
      host.querySelectorAll('[name=explorer-view]').forEach(input => { input.checked = input.value === state.view })
      query('[data-uma-controls]').hidden = !uma
      query('[data-numa-controls]').hidden = uma
      query('[data-explorer-pressure]').hidden = !uma
      query('[data-explorer-count]').value = String(state.count)
      if (processor.options.length !== state.count) {
        processor.replaceChildren(...Array.from({ length: state.count }, (_, i) => new Option(String.fromCharCode(65 + i), String(i))))
      }
      processor.value = String(state.processor)
      query('[data-explorer-task]').value = String(state.task)
      query('[data-explorer-data]').value = String(state.data)
      host.querySelectorAll('[data-explorer-diagram]').forEach(diagram => {
        const active = diagram.dataset.explorerDiagram === `${state.architecture}-${state.view}`
        diagram.hidden = !active
        diagram.querySelectorAll('[data-core]').forEach(core => { core.style.display = Number(core.dataset.core) < state.count ? '' : 'none' })
        diagram.querySelector('[data-explorer-route]').setAttribute('d', active ? result.path : '')
        // A view change retains the chosen access but redraws its physical/logical path.
        if (active) diagram.querySelector('svg').setAttribute('aria-label', `${state.architecture.toUpperCase()}, ${state.view} view. ${result.description}`)
      })
      const tokens = query('[data-pressure-units]')
      tokens.replaceChildren(...Array.from({ length: state.count }, () => {
        const request = document.createElement('span'); request.textContent = '↓'; return request
      }))
      query('[data-pressure-copy]').textContent = `${state.count} potential simultaneous requests → shared bandwidth. ${state.count > 2 ? 'More demand can increase contention.' : 'Uniform access ≠ unlimited bandwidth.'}`
      query('[data-explorer-status]').textContent = result.description
      query('[data-explorer-caption]').textContent = uma
        ? (state.view === 'physical' ? 'Physical picture: units are cores in one CPU package, sharing the main-memory access model.' : 'Logical picture: equivalent relationships, not literal wire lengths or measured timings.')
        : (state.view === 'physical' ? 'Physical picture: DIMM banks attach through channels/controllers associated with socket regions. One socket ≈ one node here.' : 'Logical picture: two locality regions in ONE computer; both can address the overall shared memory.')
    }
    function dispatch(type, value) { state = nextMemoryExplorerState(state, { type, value }); render() }
    for (const type of ['architecture', 'view']) host.querySelectorAll(`[name=explorer-${type}]`).forEach(input => input.addEventListener('change', () => dispatch(type, input.value)))
    for (const type of ['count', 'processor', 'task', 'data']) query(`[data-explorer-${type}]`).addEventListener('change', event => dispatch(type, Number(event.target.value)))
    for (const [selector, type] of [['access', 'access'], ['near', 'near'], ['reset', 'reset']]) query(`[data-explorer-${selector}]`).addEventListener('click', () => dispatch(type))
    render()
  })
}
