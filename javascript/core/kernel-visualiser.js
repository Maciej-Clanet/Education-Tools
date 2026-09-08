// Small deterministic sequence player; content stays in the calling lesson's data.
export function nextKernelState(state, action, total) {
  const last = Math.max(0, total - 1)
  switch (action) {
    case 'reset': return { index: 0, playing: false }
    case 'previous': return { index: Math.max(0, state.index - 1), playing: false }
    case 'step': return { index: Math.min(last, state.index + 1), playing: false }
    case 'play': return { index: state.index, playing: state.index < last }
    case 'pause': return { ...state, playing: false }
    case 'tick': {
      if (!state.playing) return state
      const index = Math.min(last, state.index + 1)
      return { index, playing: index < last }
    }
    default: return state
  }
}

export function evaluateMechanisms(selected, expected) {
  const choices = new Set(selected)
  const required = new Set(expected)
  const missing = [...required].filter(value => !choices.has(value))
  const extra = [...choices].filter(value => !required.has(value))
  return { correct: missing.length === 0 && extra.length === 0, missing, extra }
}

function element(tag, className, text) {
  const node = document.createElement(tag)
  node.className = className
  if (text !== undefined) node.textContent = text
  return node
}

export function initKernelVisualisers(configs, root = document) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  const players = []
  root.querySelectorAll('[data-kernel-visualiser]').forEach((host, instance) => {
    if (host.dataset.kernelReady) return
    const config = configs[host.dataset.kernelVisualiser]
    if (!config?.frames?.length) return
    host.dataset.kernelReady = 'true'
    let state = { index: 0, playing: false }
    let timer = null
    const shell = element('div', 'kernel-visualiser')
    shell.setAttribute('role', 'group')
    shell.setAttribute('aria-label', config.title)
    const heading = element('h3', 'kv-heading', config.title)
    const controls = element('div', 'kv-controls')
    const buttons = {}
    for (const [action, label] of [['play', 'Play'], ['previous', 'Previous'], ['step', 'Step'], ['reset', 'Reset']]) {
      const button = element('button', '', label)
      button.type = 'button'
      button.dataset.kvAction = action
      button.setAttribute('aria-label', `${label}: ${config.title}`)
      buttons[action] = button
      controls.append(button)
      button.addEventListener('click', () => dispatch(action === 'play' && state.playing ? 'pause' : action))
    }
    if (config.trigger) {
      const trigger = element('button', 'kv-trigger', config.trigger)
      trigger.type = 'button'
      trigger.dataset.kvAction = 'interrupt'
      trigger.addEventListener('click', () => { dispatch('reset'); dispatch('step') })
      controls.prepend(trigger)
    }
    const report = element('div', 'kv-report')
    report.setAttribute('aria-live', 'polite')
    report.setAttribute('aria-atomic', 'true')
    const status = element('strong', 'kv-status')
    const detail = element('p', 'kv-detail')
    report.append(status, detail)
    const board = element('div', 'kv-board')
    const nodeViews = new Map()
    for (const layer of [...new Set(config.nodes.map(node => node.layer))]) {
      const group = element('div', 'kv-layer')
      group.dataset.layer = layer
      group.append(element('strong', 'kv-layer-name', layer))
      const nodes = element('div', 'kv-nodes')
      for (const node of config.nodes.filter(node => node.layer === layer)) {
        const view = element('div', 'kv-node')
        view.append(element('strong', '', node.label), element('span', 'kv-node-status', ''))
        nodes.append(view)
        nodeViews.set(node.id, view)
      }
      group.append(nodes)
      board.append(group)
    }
    const resources = element('div', 'kv-resources')
    const ramBlocks = []
    const timeline = []
    if (config.ram) {
      const panel = element('div', 'kv-resource')
      panel.append(element('strong', '', 'RAM ownership · illustrative blocks'))
      const memory = element('div', 'kv-ram')
      for (let i = 0; i < 12; i++) {
        const block = element('span', '')
        memory.append(block); ramBlocks.push(block)
      }
      panel.append(memory); resources.append(panel)
    }
    if (config.timeline) {
      const panel = element('div', 'kv-resource')
      panel.append(element('strong', '', 'CPU time → one core · illustrative slices'))
      const strip = element('ol', 'kv-timeline')
      config.timeline.forEach(label => {
        const slice = element('li', '', label)
        slice.dataset.owner = label
        strip.append(slice); timeline.push(slice)
      })
      panel.append(strip); resources.append(panel)
    }
    const motionNote = element('p', 'kv-model-note')
    const modelNote = element('p', 'kv-model-note', 'Conceptual model: highlights show the current focus, not every operation happening in a real OS.')
    shell.append(heading, controls, report, board, resources, motionNote, modelNote)
    host.querySelector('[data-kernel-mount]').replaceChildren(shell)

    function render() {
      const frame = config.frames[state.index]
      host.dataset.kvIndex = String(state.index)
      host.dataset.kvPlaying = String(state.playing)
      status.textContent = `${state.index + 1} / ${config.frames.length} — ${frame.title}`
      detail.textContent = frame.detail
      for (const [id, view] of nodeViews) {
        const active = frame.active.includes(id)
        view.classList.toggle('is-active', active)
        view.querySelector('.kv-node-status').textContent = active ? '● Current focus' : '○ In this model'
      }
      ramBlocks.forEach((block, index) => {
        const owner = frame.ram?.[index] ?? (index < 2 ? 'Kernel' : 'Free')
        block.textContent = owner
        block.dataset.owner = owner
      })
      timeline.forEach((slice, index) => {
        const active = index === frame.slice
        slice.classList.toggle('is-active', active)
        if (active) slice.setAttribute('aria-current', 'step')
        else slice.removeAttribute('aria-current')
      })
      buttons.previous.disabled = state.index === 0
      buttons.step.disabled = state.index === config.frames.length - 1
      buttons.play.disabled = reducedMotion.matches || state.index === config.frames.length - 1
      buttons.play.textContent = state.playing ? 'Pause' : 'Play'
      buttons.play.setAttribute('aria-label', `${state.playing ? 'Pause' : 'Play'}: ${config.title}`)
      buttons.play.setAttribute('aria-pressed', String(state.playing))
      motionNote.textContent = reducedMotion.matches ? 'Reduced motion is on: use Step and Previous at your own pace.' : 'Play advances slowly and stops at the end. Step and Previous pause playback.'
    }
    function dispatch(action) {
      if (action === 'play' && reducedMotion.matches) return
      clearTimeout(timer)
      state = nextKernelState(state, action, config.frames.length)
      render()
      if (state.playing) timer = setTimeout(() => dispatch('tick'), 2600)
    }
    const pause = () => { if (state.playing) dispatch('pause') }
    players.push({ host, pause })
    reducedMotion.addEventListener('change', () => { pause(); render() })
    render()
  })
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) players.find(player => player.host === entry.target)?.pause()
    })
  })
  players.forEach(player => observer.observe(player.host))
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) players.forEach(player => player.pause())
  })
  window.addEventListener('pagehide', () => players.forEach(player => player.pause()))
}

export function initKernelScenarios(root = document) {
  root.querySelectorAll('[data-kernel-scenario]').forEach(card => {
    const inputs = [...card.querySelectorAll('input[type="checkbox"]')]
    const feedback = card.querySelector('[data-mechanism-feedback]')
    const labels = new Map(inputs.map(input => [input.value, input.parentElement.textContent.trim()]))
    const clearFeedback = () => { feedback.textContent = ''; delete card.dataset.correct }
    card.querySelector('[data-check-mechanisms]').addEventListener('click', () => {
      const selected = inputs.filter(input => input.checked).map(input => input.value)
      if (!selected.length) { feedback.textContent = 'Choose at least one mechanism before checking.'; return }
      const result = evaluateMechanisms(selected, card.dataset.expected.split(','))
      card.dataset.correct = String(result.correct)
      feedback.textContent = result.correct ? `Correct. ${card.dataset.explanation}` :
        `${result.missing.length ? `Still needed: ${result.missing.map(id => labels.get(id)).join(', ')}. ` : ''}${result.extra.length ? `Not one of the requested roles: ${result.extra.map(id => labels.get(id)).join(', ')}. ` : ''}${card.dataset.explanation}`
    })
    inputs.forEach(input => input.addEventListener('change', clearFeedback))
    card.querySelector('[data-reset-mechanisms]').addEventListener('click', () => {
      inputs.forEach(input => { input.checked = false }); clearFeedback()
    })
  })
}
