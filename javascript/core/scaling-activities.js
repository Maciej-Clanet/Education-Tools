// Small deterministic teaching models. No clocks, benchmarks or simulated processes.
export function distributeWork(nodes, total = 12) {
  if (![1, 2, 4].includes(nodes)) throw new RangeError('Choose 1, 2 or 4 nodes')
  const allocations = Array.from({ length: nodes }, () => [])
  for (let i = 1; i <= total; i++) allocations[(i - 1) % nodes].push(i)
  return allocations
}
export function memoryRoute(cpu, ram) {
  if (!['A', 'B'].includes(cpu) || !['A', 'B'].includes(ram)) throw new RangeError('Choose region A or B')
  const local = cpu === ram
  return { local, stops: [`CPU ${cpu}`, ...(local ? [] : ['Interconnect']), `RAM ${ram}`] }
}
export const architectureAnswers = {
  cluster: ['cluster'], uma: ['uma'], numa: ['numa'], overlap: ['cluster', 'numa'],
}
export function classifyArchitecture(scenario, labels) {
  const expected = architectureAnswers[scenario]
  return Boolean(expected && new Set(labels).size === expected.length && expected.every(label => labels.includes(label)))
}
function el(tag, cls, text) {
  const element = document.createElement(tag)
  if (cls) element.className = cls
  if (text !== undefined) element.textContent = text
  return element
}
export function initScalingActivities(root = document) {
  root.querySelectorAll('[data-cluster-lab]').forEach(host => {
    const count = host.querySelector('[data-node-count]')
    const pool = host.querySelector('[data-task-pool]')
    const board = host.querySelector('[data-node-board]')
    let distributed = false
    function render() {
      const allocations = distributeWork(Number(count.value))
      pool.replaceChildren(el('strong', '', distributed ? 'All 12 work units allocated ↓' : 'Waiting work units'))
      if (!distributed) for (let i = 1; i <= 12; i++) pool.append(el('span', 'arch-task', `Task ${i}`))
      board.replaceChildren()
      allocations.forEach((tasks, i) => {
        const node = el('div', 'arch-computer')
        node.append(el('strong', '', `Node ${String.fromCharCode(65 + i)} · separate computer`))
        const parts = el('div', 'arch-parts')
        parts.append(el('span', 'arch-cpu', 'CPU'), el('span', 'arch-ram', 'RAM'))
        node.append(parts)
        const units = el('div', 'arch-task-pool')
        if (distributed) tasks.forEach(task => units.append(el('span', 'arch-task', `Task ${task}`)))
        node.append(units, el('b', '', `${distributed ? tasks.length : 0} tasks allocated`))
        board.append(node)
      })
      host.querySelector('[data-cluster-status]').textContent = distributed
        ? `12 independent units across ${count.value} node(s): ${allocations[0].length} each. This is allocation, not a speedup prediction.`
        : `${count.value} node(s) ready. 12 independent work units waiting.`
    }
    count.addEventListener('change', () => { distributed = false; render() })
    host.querySelector('[data-distribute]').addEventListener('click', () => { distributed = true; render() })
    host.querySelector('[data-cluster-reset]').addEventListener('click', () => { count.value = '1'; distributed = false; render() })
    render()
  })
  root.querySelectorAll('[data-numa-lab]').forEach(host => {
    const cpu = host.querySelector('[data-task-cpu]'), ram = host.querySelector('[data-data-ram]')
    const diagram = host.querySelector('.arch-numa'), route = host.querySelector('[data-memory-route]')
    const status = host.querySelector('[data-numa-status]')
    function clear() {
      diagram.dataset.route = ''
      diagram.querySelector('svg').setAttribute('aria-label', 'Two processor regions in one shared-memory system, connected by an interconnect. No access route selected.')
      route.replaceChildren()
      status.textContent = `Task on CPU ${cpu.value}; data in RAM ${ram.value}. Choose Access memory to trace the route.`
    }
    function access() {
      const result = memoryRoute(cpu.value, ram.value)
      diagram.dataset.route = result.local ? 'local' : 'remote'
      diagram.dataset.cpu = cpu.value
      diagram.dataset.ram = ram.value
      const from = cpu.value === 'A' ? 180 : 620, to = ram.value === 'A' ? 180 : 620
      diagram.querySelector('[data-active-route]').setAttribute('d', result.local ? `M${from} 112 V195` : `M${from} 112 V145 H${to} V195`)
      diagram.querySelector('svg').setAttribute('aria-label', `${result.local ? 'Local' : 'Remote'} access: ${result.stops.join(' to ')}. One shared-memory system.`)
      route.replaceChildren(...result.stops.map(stop => el('li', '', stop)))
      status.textContent = result.local ? 'LOCAL ACCESS · short direct route; generally lower latency than remote access.' : 'REMOTE ACCESS · crosses the interconnect; generally higher latency than local access.'
    }
    for (const select of [cpu, ram]) select.addEventListener('change', clear)
    host.querySelector('[data-access]').addEventListener('click', access)
    host.querySelector('[data-locality]').addEventListener('click', () => { cpu.value = ram.value; access() })
    host.querySelector('[data-numa-reset]').addEventListener('click', () => { cpu.value = ram.value = 'A'; clear() })
    clear()
  })
  root.querySelectorAll('[data-uma-growth]').forEach(host => {
    const select = host.querySelector('[data-processor-count]')
    select.addEventListener('change', () => {
      const row = host.querySelector('.arch-processors')
      row.replaceChildren()
      for (let i = 1; i <= Number(select.value); i++) {
        const processor = el('div')
        const arrow = el('span', 'arch-stem', '↓'); arrow.setAttribute('aria-hidden', 'true')
        processor.append(el('span', 'arch-cpu', `CPU ${i}`), arrow)
        row.append(processor)
      }
      host.querySelector('[data-uma-status]').textContent = `${select.value} processors can request shared memory. More simultaneous demand can increase contention; no measured timing is shown.`
    })
  })
  root.querySelectorAll('[data-architecture-classifier]').forEach(host => {
    const select = host.querySelector('[data-classifier-scenario]')
    const boxes = [...host.querySelectorAll('input[type=checkbox]')]
    const status = host.querySelector('[data-classifier-status]')
    const reasons = {
      cluster: 'Cluster: separate computers, each with CPU and RAM, cooperate over the network.',
      uma: 'UMA: processors inside one system share memory with a uniform access relationship.',
      numa: 'NUMA: one shared-memory system has processor regions with nearby and remote RAM.',
      overlap: 'Cluster + NUMA: separate servers cooperate over the network; inside each server, local and remote memory differ.',
    }
    function clear() {
      boxes.forEach(box => { box.checked = false })
      host.querySelectorAll('[data-classifier-diagram]').forEach(view => { view.hidden = view.dataset.classifierDiagram !== select.value })
      status.textContent = 'Select every applicable label, then check.'
    }
    select.addEventListener('change', clear)
    boxes.forEach(box => box.addEventListener('change', () => { status.textContent = 'Selection changed. Check your labels again.' }))
    host.querySelector('[data-classifier-check]').addEventListener('click', () => {
      const selected = boxes.filter(box => box.checked).map(box => box.value)
      status.textContent = !selected.length ? 'Select at least one label first.' : `${classifyArchitecture(select.value, selected) ? 'Correct.' : 'Not quite.'} ${reasons[select.value]}`
    })
    host.querySelector('[data-classifier-reset]').addEventListener('click', () => { select.value = 'cluster'; clear() })
    clear()
  })
}
