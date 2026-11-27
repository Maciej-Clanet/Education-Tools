// A teaching model: all bits have the same travel delay. Only sending rate changes.
export const COMPARISON_BITS = '1011'
export const COMPARISON_TRAVEL_TIME = 0.5
export const COMPARISON_RATES = [1, 2, 4, 8]

export function comparisonFrame(rate = 1, requestedTime = 0) {
  const serialRate = COMPARISON_RATES.includes(Number(rate)) ? Number(rate) : 1
  const finish = { serial: COMPARISON_BITS.length / serialRate + COMPARISON_TRAVEL_TIME, parallel: 1 + COMPARISON_TRAVEL_TIME }
  const duration = Math.max(finish.serial, finish.parallel)
  const time = Math.max(0, Math.min(duration, Number.isFinite(Number(requestedTime)) ? Number(requestedTime) : 0))
  const paths = {}
  for (const kind of ['serial', 'parallel']) {
    paths[kind] = [...COMPARISON_BITS].map((value, index) => {
      const sentAt = kind === 'serial' ? (index + 1) / serialRate : 1
      const arrivedAt = sentAt + COMPARISON_TRAVEL_TIME
      return { value, index, sentAt, arrivedAt, received: time + 1e-8 >= arrivedAt,
        travelling: time >= sentAt && time < arrivedAt,
        progress: Math.max(0, Math.min(1, (time - sentAt) / COMPARISON_TRAVEL_TIME)) }
    })
  }
  return { serialRate, time, duration, finish, paths,
    first: finish.serial < finish.parallel ? 'serial' : finish.serial > finish.parallel ? 'parallel' : 'tie' }
}

export function initTransmissionComparison(root = document) {
  root.querySelectorAll('[data-transmission-comparison]').forEach(host => {
    if (host.dataset.comparisonReady) return
    const rateControl = host.querySelector('[data-tc-rate]')
    const play = host.querySelector('[data-tc-play]')
    const reset = host.querySelector('[data-tc-reset]')
    const scrub = host.querySelector('[data-tc-time]')
    const clock = host.querySelector('[data-tc-clock]')
    const summary = host.querySelector('[data-tc-summary]')
    if (!rateControl || !play || !reset || !scrub || !clock || !summary) return
    let rate = 1, time = 0, playing = false, raf = null, lastTime = null
    const views = Object.fromEntries(['serial', 'parallel'].map(kind => [kind, {
      movers: [...host.querySelectorAll(`[data-tc-panel="${kind}"] [data-tc-bit]`)],
      received: [...host.querySelectorAll(`[data-tc-panel="${kind}"] [data-tc-received]`)],
      count: host.querySelector(`[data-tc-panel="${kind}"] [data-tc-count]`),
      result: host.querySelector(`[data-tc-panel="${kind}"] [data-tc-finish]`)
    }]))
    const number = value => Number(value.toFixed(2)).toString()

    function render(announce = false) {
      const frame = comparisonFrame(rate, time)
      time = frame.time
      host.dataset.comparisonTime = time.toFixed(3)
      host.dataset.comparisonPlaying = String(playing)
      play.textContent = playing ? 'Pause' : time >= frame.duration ? 'Replay' : 'Play'
      play.setAttribute('aria-pressed', String(playing))
      scrub.max = String(frame.duration)
      scrub.value = String(time)
      scrub.setAttribute('aria-valuetext', `${number(time)} of ${number(frame.duration)} time units`)
      clock.textContent = `${time.toFixed(2)} / ${number(frame.duration)} units`
      for (const kind of ['serial', 'parallel']) {
        const view = views[kind], bits = frame.paths[kind]
        bits.forEach((bit, i) => {
          const mover = view.movers[i]
          mover.style.visibility = bit.travelling ? 'visible' : 'hidden'
          // Travel distance and duration stay equal for serial and parallel.
          mover.setAttribute('transform', `translate(${40 + 350 * bit.progress} ${kind === 'serial' ? 83 : 35 + i * 32})`)
          view.received[i].textContent = bit.received ? bit.value : '\u00b7'
          view.received[i].classList.toggle('is-received', bit.received)
          view.received[i].setAttribute('aria-label', `Bit ${i + 1}: ${bit.received ? bit.value : 'waiting'}`)
        })
        const count = bits.filter(bit => bit.received).length
        view.count.textContent = `${count} / 4 received`
        view.result.textContent = count === 4 ? `Finished at ${number(frame.finish[kind])} units` : 'Not complete yet'
        view.result.classList.toggle('is-complete', count === 4)
      }
      const completed = frame.paths.serial.every(b => b.received) || frame.paths.parallel.every(b => b.received)
      const message = completed
        ? frame.first === 'tie' ? 'Both finish together: serial sends each bit four times as often.'
          : frame.first === 'serial' ? 'Serial’s higher bit rate makes it finish first, even with one data path.'
            : 'Parallel finishes first. Four paths carry bits at the same time.'
        : time === 0 ? 'Both send the same four bits: 1 0 1 1. Press Play or move the time control.'
          : 'Follow the bits. Each received bit stays in its box.'
      // Do not announce every animation frame. Announce only a changed outcome or a manual action.
      if (summary.textContent !== message || announce) summary.textContent = message
    }
    function stop() {
      playing = false
      if (raf !== null) cancelAnimationFrame(raf)
      raf = null; lastTime = null
    }
    function tick(now) {
      if (!playing) return
      if (lastTime !== null) time += Math.min(100, now - lastTime) / 1700
      lastTime = now
      const frame = comparisonFrame(rate, time)
      time = frame.time
      if (time >= frame.duration) stop()
      render()
      if (playing) raf = requestAnimationFrame(tick)
    }
    play.addEventListener('click', () => {
      if (playing) stop()
      else {
        if (time >= comparisonFrame(rate).duration) time = 0
        playing = true; lastTime = null; raf = requestAnimationFrame(tick)
      }
      render(true)
    })
    reset.addEventListener('click', () => { stop(); time = 0; render(true) })
    scrub.addEventListener('input', () => { stop(); time = Number(scrub.value); render(true) })
    rateControl.addEventListener('change', () => { stop(); rate = Number(rateControl.value); time = 0; render(true) })
    const pause = () => { if (playing) { stop(); render() } }
    new IntersectionObserver(entries => { if (!entries[0].isIntersecting) pause() }).observe(host)
    document.addEventListener('visibilitychange', () => { if (document.hidden) pause() })
    window.addEventListener('pagehide', pause)
    host.querySelector('[data-tc-controls]').hidden = false
    host.dataset.comparisonReady = 'true'
    rateControl.value = '1'
    render()
  })
}
