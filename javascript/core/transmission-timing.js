export const TIMING_BITS = '11110001'
export function signalReads(period = 1, time = 8) {
  return Array.from({ length: Math.round(8 / period) }, (_, i) => ({
    time: (i + .5) * period,
    bit: [4, 7].includes((i + .5) * period) ? '?' : TIMING_BITS[Math.min(7, Math.floor((i + .5) * period))],
  })).filter(read => read.time <= time + .00001)
}
export function skewState(time, longer = true, readLater = false) {
  const bits = '1011', arrivals = [1, 1, 1, longer ? 1.8 : 1]
  const at = t => [...bits].map((bit, i) => t >= arrivals[i] ? bit : '0').join('')
  const readTime = readLater ? 2 : 1.25
  return { arrivals, current: at(time), stored: time >= readTime ? at(readTime) : null, readTime }
}

const svgNS = 'http://www.w3.org/2000/svg'
function svg(tag, attrs = {}, text = '') {
  const el = document.createElementNS(svgNS, tag)
  for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, value)
  el.textContent = text
  return el
}
// One bounded timeline for these related demonstrations. No learner state is saved.
function player(host, end, points, render, beforePlay = () => {}) {
  const play = host.querySelector('[data-time-play]'), next = host.querySelector('[data-time-next]')
  const reset = host.querySelector('[data-time-reset]'), range = host.querySelector('[data-time-range]')
  let time = 0, running = false, frame = 0, last = 0
  range.max = end
  function draw() {
    host.dataset.timePlaying = String(running)
    host.dataset.time = time.toFixed(3)
    play.textContent = running ? 'Pause' : time >= end ? 'Replay' : 'Play'
    play.setAttribute('aria-pressed', String(running))
    next.setAttribute('aria-disabled', String(time >= end))
    reset.setAttribute('aria-disabled', String(time === 0))
    range.value = time
    host.querySelector('[data-time-clock]').textContent = time.toFixed(2)
    render(time)
  }
  function stop() { running = false; cancelAnimationFrame(frame); frame = 0; draw() }
  function tick(now) {
    if (!running) return
    time = Math.min(end, time + Math.min(100, now - last) / 1000)
    last = now
    if (time >= end) running = false
    draw()
    if (running) frame = requestAnimationFrame(tick)
  }
  play.addEventListener('click', () => {
    if (running) { stop(); return }
    beforePlay()
    if (time >= end) time = 0
    running = true; last = performance.now(); draw(); frame = requestAnimationFrame(tick)
  })
  next.addEventListener('click', () => { stop(); beforePlay(); time = points().find(p => p > time + .00001) ?? end; draw() })
  reset.addEventListener('click', () => { stop(); time = 0; draw() })
  range.addEventListener('input', () => { const requested = Number(range.value); stop(); beforePlay(); time = requested; draw() })
  new IntersectionObserver(entries => { if (!entries[0].isIntersecting && running) stop() }).observe(host)
  document.addEventListener('visibilitychange', () => { if (document.hidden && running) stop() })
  window.addEventListener('pagehide', stop)
  host.querySelector('[data-time-controls]').hidden = false
  host.dataset.timeReady = 'true'
  draw()
  return { restart() { stop(); time = 0; draw() }, refresh: draw }
}

function initWave(host) {
  const kind = host.dataset.waveTool
  const isAsync = kind === 'async', end = isAsync ? 12 : 8
  const grid = host.querySelector('[data-wave-grid]'), cursor = host.querySelector('[data-wave-cursor]')
  const printGrid = grid.cloneNode(true)
  printGrid.removeAttribute('data-wave-grid')
  printGrid.setAttribute('data-wave-print', '')
  grid.before(printGrid)
  const output = host.querySelector('[data-wave-output]'), status = host.querySelector('[data-wave-status]')
  const periodSelect = host.querySelector('[data-read-period]'), reveal = host.querySelector('[data-show-times]')
  const x = time => 100 + time / end * 800
  let lastGrid = '', lastOutput = '', controller
  const period = () => Number(periodSelect?.value || 1)
  function points() {
    if (isAsync) return [1, 1.5, ...Array.from({ length: 8 }, (_, i) => i + 2.5), 10.5, 12]
    return [...signalReads(period()).map(r => r.time), 8]
  }
  function render(time) {
    const all = isAsync ? [...TIMING_BITS].map((bit, i) => ({ time: i + 2.5, bit })) : signalReads(period())
    const reads = all.filter(r => r.time <= time + .00001)
    const show = !reveal || reveal.checked
    const gridKey = `${period()}-${reads.length}-${show}`
    if (gridKey !== lastGrid) {
      lastGrid = gridKey
      const items = []
      if (show) {
        if (!isAsync) for (let t = 0; t <= end; t += period()) items.push(svg('line', { x1: x(t), x2: x(t), y1: 20, y2: kind === 'sync' ? 170 : 120, class: 'tt-boundary' }))
        all.forEach((read, i) => {
          const active = i < reads.length
          items.push(svg('line', { x1: x(read.time), x2: x(read.time), y1: 22, y2: kind === 'sync' ? 170 : 118, class: `tt-read-line ${active ? 'is-read' : ''}` }))
          items.push(svg('circle', { cx: x(read.time), cy: read.bit === '?' ? 71 : read.bit === '1' ? 42 : 100, r: 6, class: `tt-read-dot ${active ? 'is-read' : ''}` }))
          items.push(svg('text', { x: x(read.time), y: kind === 'sync' ? 202 : 152, 'text-anchor': 'middle', class: 'tt-read-digit' }, active ? read.bit : '·'))
        })
      }
      grid.replaceChildren(...items)
    }
    cursor.setAttribute('x1', x(time)); cursor.setAttribute('x2', x(time))
    const text = reads.length ? reads.map(r => r.bit).join('') : '—'
    if (lastOutput !== text) { output.textContent = text; lastOutput = text }
    let description
    if (isAsync) description = time < 1 ? 'Idle: the line is 1. Wait for a start.' : time < 2 ? 'Start bit: the fall to 0 aligns the receiver’s read times.' : time < 10 ? `Data: ${reads.length} of 8 bits read. Read once in each bit time.` : time < 10.5 ? 'The data is complete. The receiver now checks the stop bit.' : 'Stop bit is 1. The unit is complete; the line can stay idle.'
    else if (!show) description = 'The signal has three runs. That does not tell us how many bits it contains.'
    else if (kind === 'sync') description = `${reads.length} of 8 bits read. Each marked rising clock edge tells the receiver when to read.`
    else description = reads.some(r => r.bit === '?') ? 'A ? marks a read on a signal change. That value is not reliable.' : `${reads.length} reads so far. ${period() === 1 ? 'One read per time unit gives the original 8 bits.' : 'The signal has not changed. This read interval gives a different result.'}`
    if (status.textContent !== description) status.textContent = description
    if (isAsync) host.querySelectorAll('[data-frame-part]').forEach(el => {
      const [start, finish] = el.dataset.framePart.split(',').map(Number)
      el.classList.toggle('is-active', time >= start && time < finish)
    })
  }
  controller = player(host, end, points, render, () => { if (reveal) reveal.checked = true })
  periodSelect?.addEventListener('change', () => { reveal.checked = true; controller.restart() })
  reveal?.addEventListener('change', () => controller.refresh())
}

function initSkew(host) {
  const longer = host.querySelector('[data-long-path]'), later = host.querySelector('[data-read-later]')
  const paths = [...host.querySelectorAll('[data-skew-path]')], dots = [...host.querySelectorAll('[data-skew-token]')]
  const values = [...host.querySelectorAll('[data-skew-value]')]
  const liveFigure = host.querySelector('.tt-skew-svg')
  const printFigure = liveFigure.cloneNode(true)
  printFigure.classList.add('tt-print-skew')
  printFigure.querySelectorAll('*').forEach(el => {
    for (const attr of [...el.attributes]) if (attr.name.startsWith('data-skew-')) el.removeAttribute(attr.name)
  })
  liveFigure.classList.add('tt-live-skew')
  liveFigure.after(printFigure)
  const output = host.querySelector('[data-skew-output]'), status = host.querySelector('[data-skew-status]')
  const longPath = 'M170 208H280V178H400V238H520V178H640V208H790', shortPath = 'M170 208H790'
  let controller
  function render(time) {
    paths[3].setAttribute('d', longer.checked ? longPath : shortPath)
    paths[3].classList.toggle('tt-delayed', longer.checked)
    const state = skewState(time, longer.checked, later.checked)
    paths.forEach((path, i) => {
      const point = path.getPointAtLength(path.getTotalLength() * Math.min(1, time / state.arrivals[i]))
      dots[i].setAttribute('transform', `translate(${point.x} ${point.y})`)
      dots[i].style.visibility = time > 0 && time < state.arrivals[i] ? 'visible' : 'hidden'
      values[i].textContent = state.current[i]
      values[i].classList.toggle('tt-wrong', !!state.stored && state.current[i] !== '1011'[i])
    })
    output.textContent = state.stored ?? '— — — —'
    output.classList.toggle('tt-wrong', !!state.stored && state.stored !== '1011')
    const description = !state.stored ? `Sender sends 1011 together. The receiver will read at time ${state.readTime}.` : state.stored === '1011' ? 'Stored 1011: every new value was ready when the receiver read.' : 'Stored 1010: path 4 still held its old 0 at the read time. Later arrival does not change that stored result.'
    if (status.textContent !== description) status.textContent = description
    host.querySelector('[data-skew-live-label]').textContent = 'Values at receiver now'
  }
  controller = player(host, 2.2, () => [1, skewState(0, longer.checked, later.checked).readTime, 1.8, 2.2].sort((a,b) => a-b), render)
  longer.addEventListener('change', () => controller.restart())
  later.addEventListener('change', () => controller.restart())
}

export function initTransmissionTiming(root = document) {
  root.querySelectorAll('[data-wave-tool]:not([data-time-ready])').forEach(initWave)
  root.querySelectorAll('[data-skew-tool]:not([data-time-ready])').forEach(initSkew)
}
