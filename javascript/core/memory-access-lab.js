import { memoryWorkloads, scheduleMemoryAccess, nextMemoryLabState } from './memory-access-model.js'
function node(tag, className, text) {
  const el = document.createElement(tag)
  if (className) el.className = className
  if (text !== undefined) el.textContent = text
  return el
}
function tokens(list) {
  const el = node('div', 'memory-tokens')
  if (!list.length) el.append(node('span', '', 'None'))
  list.forEach(id => el.append(node('span', `memory-token memory-token--${id[0] === 'I' ? 'instruction' : 'data'}`, id)))
  return el
}
export function initMemoryAccessLabs(root = document) {
  root.querySelectorAll('[data-memory-lab]').forEach(host => {
    if (host.dataset.memoryReady) return
    host.dataset.memoryReady = 'true'
    let state = { workload: 'balanced', slot: 0 }
    const selector = host.querySelector('[data-memory-workload]')
    const boards = host.querySelector('[data-memory-models]')
    const step = host.querySelector('[data-memory-step]')
    const finish = host.querySelector('[data-memory-finish]')
    function render() {
      const workload = memoryWorkloads[state.workload]
      const total = workload.instructions + workload.data
      const summary = []
      boards.replaceChildren()
      for (const architecture of ['von', 'harvard']) {
        const schedule = scheduleMemoryAccess(workload, architecture)
        const passed = schedule.slice(0, state.slot)
        const completed = passed.flat()
        const remaining = ['I', 'D'].flatMap((prefix, index) => Array.from({ length: index === 0 ? workload.instructions : workload.data }, (_, i) => `${prefix}${i + 1}`)).filter(id => !completed.includes(id))
        const title = architecture === 'von' ? 'Von Neumann' : 'Harvard'
        const board = node('article', 'memory-board')
        board.dataset.memoryBoard = architecture
        board.append(node('h3', '', title), node('p', 'memory-route', architecture === 'von' ? 'CPU ↔ shared path ↔ instruction/data memory' : 'CPU ↔ instruction path ↔ instruction memory\nCPU ↔ data path ↔ data memory'))
        const current = state.slot ? schedule[state.slot - 1] ?? [] : []
        board.append(node('h4', '', state.slot ? `Transferred in slot ${state.slot}` : 'Ready to start'), tokens(current))
        board.append(node('h4', '', 'Still waiting'), tokens(remaining))
        board.append(node('p', 'memory-count', `${completed.length}/${total} requests transferred${remaining.length ? '' : ` · Complete in ${schedule.length} slots`}.`))
        if (passed.length) {
          const history = node('ol', 'memory-history')
          passed.forEach((transfers, index) => history.append(node('li', '', `Slot ${index + 1}: ${transfers.join(' + ')}`)))
          board.append(history)
        }
        boards.append(board)
        summary.push(`${title}: ${completed.length} of ${total}${remaining.length ? '' : `, complete in ${schedule.length} slots`}`)
      }
      step.disabled = finish.disabled = state.slot === total
      host.querySelector('[data-memory-status]').textContent = `${state.slot ? `After slot ${state.slot}.` : 'Ready. I = instruction fetch; D = data transfer.'} ${summary.join('. ')}. ${state.slot === total ? 'Compare transfer opportunities, not execution speed.' : ''}`
    }
    selector.addEventListener('change', () => { state = nextMemoryLabState(state, { type: 'workload', value: selector.value }); render() })
    for (const [selector, type] of [['[data-memory-step]', 'step'], ['[data-memory-finish]', 'finish'], ['[data-memory-reset]', 'reset']]) {
      host.querySelector(selector).addEventListener('click', () => { state = nextMemoryLabState(state, { type }); render() })
    }
    render()
  })
}
