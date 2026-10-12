// A deliberately tiny teaching code, not an ASCII or Unicode encoding.
export const CHARACTER_TRANSMISSION_KEY = Object.freeze({ h: '00', e: '01', l: '10', o: '11' })
export const CHARACTER_TRANSMISSION_MESSAGE = 'hello'
const TRAVEL_MS = 1600
const ARRIVAL_HOLD_MS = 400

export function characterTransmissionSteps(message = CHARACTER_TRANSMISSION_MESSAGE) {
  return [...message].map((character, index) => {
    const code = CHARACTER_TRANSMISSION_KEY[character]
    if (!code) throw new RangeError('The teaching key only contains h, e, l and o.')
    return { index, character, code }
  })
}

export function initCharacterTransmissions(root = document) {
  root.querySelectorAll('[data-character-transmission]').forEach(host => {
    if (host.dataset.transmissionReady) return
    const steps = characterTransmissionSteps()
    const sender = [...host.querySelectorAll('[data-transmission-source]')]
    const receiver = [...host.querySelectorAll('[data-transmission-letter]')]
    const codes = [...host.querySelectorAll('[data-transmission-code]')]
    const controls = host.querySelector('[data-transmission-controls]')
    const playButton = host.querySelector('[data-transmission-play]')
    const nextButton = host.querySelector('[data-transmission-next]')
    const restartButton = host.querySelector('[data-transmission-restart]')
    const packet = host.querySelector('[data-transmission-packet]')
    const status = host.querySelector('[data-transmission-status]')
    const count = host.querySelector('[data-transmission-count]')
    const receiverWord = host.querySelector('[data-transmission-receiver]')
    if (sender.length !== steps.length || receiver.length !== steps.length || codes.length !== steps.length || !controls || !playButton || !nextButton || !restartButton || !packet || !status || !count || !receiverWord) return

    let completed = 0
    let cursor = 0
    let elapsed = 0
    let playing = false
    let frameId = 0
    let previousTime = null
    let inView = true
    const initialStatus = 'Ready: the sender has hello. No characters have arrived yet.'

    function positionPacket() {
      packet.style.left = `${Math.min(1, elapsed / TRAVEL_MS) * 100}%`
    }

    function render(message) {
      const complete = completed === steps.length
      sender.forEach((letter, index) => {
        letter.classList.toggle('is-sent', index < completed)
        letter.classList.toggle('is-current', !complete && index === cursor && (playing || elapsed > 0))
      })
      receiver.forEach((letter, index) => {
        letter.textContent = index < completed ? steps[index].character : '·'
        letter.classList.toggle('has-arrived', index < completed)
        letter.classList.toggle('just-arrived', index === completed - 1)
      })
      codes.forEach((code, index) => {
        code.classList.toggle('has-arrived', index < completed)
        code.classList.toggle('is-current', !complete && index === cursor && (playing || elapsed > 0))
        code.setAttribute('aria-label', `Character ${index + 1}: ${steps[index].code}${index < completed ? ', received' : ', waiting'}`)
      })
      receiverWord.setAttribute('aria-label', completed ? `Received: ${steps.slice(0, completed).map(step => step.character).join('')}. ${completed} of 5 characters.` : 'Receiver: no characters received yet.')
      packet.textContent = steps[Math.min(cursor, steps.length - 1)].code
      packet.hidden = complete || (!playing && elapsed === 0)
      count.textContent = `${completed} / ${steps.length} received`
      playButton.textContent = playing ? 'Pause' : complete ? 'Play again' : elapsed > 0 ? 'Resume' : 'Play'
      playButton.setAttribute('aria-pressed', String(playing))
      nextButton.setAttribute('aria-disabled', String(complete))
      positionPacket()
      if (message) status.textContent = message
    }

    function stop(message) {
      playing = false
      cancelAnimationFrame(frameId)
      frameId = 0
      previousTime = null
      render(message)
    }

    function reset() {
      stop()
      completed = 0
      cursor = 0
      elapsed = 0
      render(initialStatus)
    }

    function announceArrival() {
      const step = steps[completed - 1]
      const final = completed === steps.length
      render(final
        ? 'Message received: hello. The receiver used the shared key to turn 00 01 10 10 11 back into letters.'
        : `${step.code} arrived and became ${step.character}. ${completed} of ${steps.length} characters received.`)
    }

    function tick(time) {
      if (!playing) return
      if (document.hidden || !inView) { stop('Paused while the diagram is out of view. Resume to continue.'); return }
      if (previousTime === null) previousTime = time
      elapsed += Math.min(100, Math.max(0, time - previousTime))
      previousTime = time
      positionPacket()
      if (elapsed >= TRAVEL_MS && completed === cursor) {
        completed = cursor + 1
        announceArrival()
        if (completed === steps.length) { stop(); return }
      }
      if (elapsed >= TRAVEL_MS + ARRIVAL_HOLD_MS) {
        cursor = completed
        elapsed = 0
        render(`Sending character ${cursor + 1}: ${steps[cursor].character} becomes ${steps[cursor].code}.`)
      }
      frameId = requestAnimationFrame(tick)
    }

    playButton.addEventListener('click', () => {
      if (playing) { stop('Paused. The received letters and the code in transit are held in place.'); return }
      if (completed === steps.length) reset()
      if (document.hidden || !inView) { render('Bring the diagram into view, then press Play.'); return }
      playing = true
      previousTime = null
      render(`Sending character ${cursor + 1}: ${steps[cursor].character} becomes ${steps[cursor].code}.`)
      frameId = requestAnimationFrame(tick)
    })
    nextButton.addEventListener('click', () => {
      if (completed === steps.length) return
      stop()
      completed += 1
      cursor = Math.min(completed, steps.length - 1)
      elapsed = 0
      announceArrival()
    })
    restartButton.addEventListener('click', reset)

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        inView = entries[0].isIntersecting && entries[0].intersectionRatio > 0
        if (!inView && playing) stop('Paused while the diagram is out of view. Resume to continue.')
      }, { threshold: [0, .05] })
      observer.observe(host)
    }
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && playing) stop('Paused while this tab is hidden. Resume to continue.')
    })
    window.addEventListener('pagehide', () => { if (playing) stop() })
    host.dataset.transmissionReady = 'true'
    controls.hidden = false
    reset()
  })
}
