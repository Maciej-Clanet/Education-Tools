// Isolated browser only: see docs/testing.md. No learner browser/storage.
import assert from 'node:assert/strict'
import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { createBrowserSession } from './helpers/browser-session.mjs'
import { transmissionScenarios } from '../javascript/data/transmission-scenarios.js'
import { signalReads, TIMING_BITS } from '../javascript/core/transmission-timing.js'
import { comparisonFrame } from '../javascript/core/transmission-comparison.js'

const slug = 'transmission-methods-synchronous-asynchronous-serial-and-parallel'
const path = `/pages/topics/${slug}.html`
const html = readFileSync(path.slice(1), 'utf8')
const links = [...html.matchAll(/(?:href|src)="([^"#?]+)(?:[?#][^"]*)?"/g)].map(m => m[1]).filter(x => !/^https?:/.test(x))
assert.deepEqual(links.filter(x => !existsSync(resolve(dirname(path.slice(1)), x))), [])
process.env.FLEXBOX_SCREENSHOTS ||= '.raid-checks/transmission'
const s = await createBrowserSession({ lessonPath: path, readyExpression: 'document.body.dataset.transmissionReady && document.querySelectorAll("[data-time-ready]").length === 4 && document.querySelector("[data-comparison-ready]")' })
const keys = { quiz: `education-tools:lesson-${slug}-quiz`, drafts: `education-tools:lesson-${slug}-exam-practice`, old: 'education-tools:lesson-transmission-method-viewer' }
const quiz = { answers: { q1: 'b', q2: 'a', q3: 'c', q4: 'b', q5: 'a' }, lastScore: 5, bestScore: 5 }
const drafts = { 'question-1': 'Existing video answer', 'question-2': 'Existing machine answer', retired: 'Keep this retired answer' }
const slides = [], report = [], failures = []
const frame = () => s.ev('new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))')
const click = async x => { await s.click(x); await frame() }
const current = async () => Number((await s.text('[data-role=slide-status]')).match(/Slide (\d+)/)[1])
const goto = async id => { const n = slides.indexOf(id) + 1; assert.ok(n > 0, id); while (await current() !== n) await click(`[data-action=${await current() < n ? 'next-slide' : 'prev-slide'}]`) }
const fit = async (label, capture = true) => {
  const b = await s.ev(`(()=>{const e=document.getElementById(location.hash.slice(1));return {id:e.id,w:e.clientWidth,sw:e.scrollWidth,h:e.clientHeight,sh:e.scrollHeight}})()`)
  report.push({ label, ...b })
  if (b.sw > b.w + 2 || (!['quiz', 'exam-practice'].includes(b.id) && b.sh > b.h + 2)) failures.push({ label, ...b })
  if (capture) await s.screenshot(label)
  return b.id
}
const storage = key => s.ev(`JSON.parse(localStorage.getItem(${JSON.stringify(key)}))`)
const keyboard = async selector => {
  await s.ev(`document.querySelector(${JSON.stringify(selector)}).focus()`)
  for (const type of ['keyDown', 'keyUp']) await s.send('Input.dispatchKeyEvent', { type, key: ' ', code: 'Space', windowsVirtualKeyCode: 32 })
  await frame()
}
const setCheck = async (selector, checked) => {
  await s.ev(`(()=>{const e=document.querySelector(${JSON.stringify(selector)});e.checked=${checked};e.dispatchEvent(new Event('change',{bubbles:true}))})()`)
  await frame()
}
const range = async (selector, value) => { await s.input(selector, value, 'input'); await frame() }

try {
  await s.send('Runtime.enable'); await s.send('Log.enable'); await s.send('Page.enable'); await s.send('Page.bringToFront')
  await s.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
  await s.send('Emulation.setDeviceMetricsOverride', { width: 1366, height: 768, deviceScaleFactor: 1, mobile: false })
  await s.load()
  await s.ev(`localStorage.removeItem('education-tools:${slug}-teacher-mode')`)
  for (const [k, v] of [[keys.quiz, quiz], [keys.drafts, drafts], [keys.old, { mode: 'parallel' }]]) await s.ev(`localStorage.setItem(${JSON.stringify(k)},${JSON.stringify(JSON.stringify(v))})`)
  await s.load()
  assert.equal(await s.ev('document.querySelectorAll("[data-question] input:checked").length'), 5)
  assert.equal(await s.ev('document.querySelector("[data-exam-response=question-1]").value'), drafts['question-1'])
  const audit = await s.ev(`(()=>{const ids=[...document.querySelectorAll('[id]')].map(e=>e.id);return {duplicates:ids.filter((id,i)=>ids.indexOf(id)!==i),missing:[...document.querySelectorAll('[data-section-link]')].filter(a=>!document.querySelector(a.hash)).map(a=>a.hash)}})()`)
  assert.deepEqual(audit, { duplicates: [], missing: [] })
  for (const id of ['parallel', 'viewer', 'combine']) assert.equal(await s.ev(`!!document.getElementById('${id}')`), true, `Legacy anchor ${id}`)
  await click('[data-action=toggle-teacher-mode]')
  const count = Number((await s.text('[data-role=slide-status]')).match(/of (\d+)/)[1])
  for (const [width, height] of [[1366, 768], [1920, 1080]]) {
    await s.send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false })
    while (await current() > 1) await click('[data-action=prev-slide]')
    for (let i = 1; i <= count; i++) {
      const id = await fit(`slide-${i}-${width}`)
      if (width === 1366) slides.push(id)
      if (i < count) await click('[data-action=next-slide]')
    }
  }
  await s.send('Emulation.setDeviceMetricsOverride', { width: 1366, height: 768, deviceScaleFactor: 1, mobile: false })

  await goto('data-paths')
  const comparison = '[data-transmission-comparison]'
  for (const rate of [1, 2, 4, 8]) {
    await s.input('[data-tc-rate]', rate)
    assert.equal(await s.ev(`document.querySelector('${comparison}').dataset.comparisonTime`), '0.000')
    const model = comparisonFrame(rate, 99)
    for (const time of [...new Set([0, .5, 1, 1.5, model.finish.serial, model.duration])].sort((a, b) => a - b)) {
      await range('[data-tc-time]', time)
      const expected = comparisonFrame(rate, time)
      for (const kind of ['serial', 'parallel']) {
        const bits = await s.ev(`[...document.querySelectorAll('[data-tc-panel=${kind}] [data-tc-received]')].map(e=>e.textContent)`)
        assert.deepEqual(bits, expected.paths[kind].map(b => b.received ? b.value : '\u00b7'))
        assert.equal(await s.text(`[data-tc-panel=${kind}] [data-tc-count]`), `${expected.paths[kind].filter(b => b.received).length} / 4 received`)
      }
    }
    assert.match(await s.text('[data-tc-summary]'), rate === 4 ? /Both finish together/ : rate === 8 ? /higher bit rate makes it finish first/ : /Parallel finishes first/)
    await fit(`comparison-rate-${rate}`)
  }
  // Rate changes sending cadence, while the same in-flight fraction gives the same x position.
  const positions = []
  for (const rate of [1, 4]) {
    await s.input('[data-tc-rate]', rate)
    await range('[data-tc-time]', 1 / rate + .25)
    positions.push(await s.ev('document.querySelector("[data-tc-panel=serial] [data-tc-bit]").getAttribute("transform")'))
  }
  assert.equal(positions[0], positions[1])

  await goto('timing')
  assert.equal(await s.ev('document.querySelector("[data-show-times]").checked'), false)
  assert.equal(await s.ev('document.querySelectorAll("#timing [data-wave-grid] .tt-read-dot").length'), 0)
  for (const period of [1, 2, .5]) {
    await s.input('[data-read-period]', period)
    assert.equal(await s.text('#timing [data-wave-output]'), '\u2014')
    const readings = signalReads(period)
    for (const [i, read] of readings.entries()) {
      await keyboard('#timing [data-time-next]')
      assert.equal(await s.text('#timing [data-wave-output]'), readings.slice(0, i + 1).map(r => r.bit).join(''))
      assert.equal(Number(await s.ev('document.querySelector("#timing [data-wave-tool]").dataset.time')), read.time)
      assert.equal(await s.ev('location.hash'), '#timing')
      assert.equal(await s.ev('document.activeElement.matches("#timing [data-time-next]")'), true)
    }
    await fit(`timing-period-${period}`)
    if (period === 2) {
      assert.equal(await s.text('#timing [data-wave-output]'), '110?')
      assert.match(await s.text('#timing [data-wave-status]'), /not reliable/)
    }
    await keyboard('#timing [data-time-next]'); await keyboard('#timing [data-time-next]')
    assert.equal(await s.ev('document.querySelector("#timing [data-wave-tool]").dataset.time'), '8.000')
  }
  await s.input('[data-read-period]', 1)
  await range('#timing [data-time-range]', 3.4)
  assert.equal(await s.text('#timing [data-wave-output]'), '111')
  await range('#timing [data-time-range]', 3.5)
  assert.equal(await s.text('#timing [data-wave-output]'), '1111')

  await goto('synchronous')
  for (let i = 1; i <= 8; i++) {
    await keyboard('#synchronous [data-time-next]')
    assert.equal(await s.text('#synchronous [data-wave-output]'), TIMING_BITS.slice(0, i))
    assert.equal(await s.ev('document.querySelectorAll("#synchronous [data-wave-grid] .tt-read-dot.is-read").length'), i)
  }
  await fit('synchronous-eight-reads')

  await goto('start-stop')
  for (const time of [0, 1, 1.5, 2]) {
    await range('#start-stop [data-time-range]', time)
    assert.equal(await s.text('#start-stop [data-wave-output]'), '\u2014', 'Start and idle never enter the data')
  }
  for (let i = 1; i <= 8; i++) {
    await range('#start-stop [data-time-range]', i + 1.5)
    assert.equal(await s.text('#start-stop [data-wave-output]'), TIMING_BITS.slice(0, i))
  }
  for (const time of [10, 10.5, 11, 12]) {
    await range('#start-stop [data-time-range]', time)
    assert.equal(await s.text('#start-stop [data-wave-output]'), TIMING_BITS, 'Stop and idle never enter the data')
  }
  assert.match(await s.text('#start-stop [data-wave-status]'), /Stop bit is 1/)
  await fit('asynchronous-complete')

  await goto('skew')
  await setCheck('[data-long-path]', true); await setCheck('[data-read-later]', false)
  await range('#skew [data-time-range]', 1.25)
  assert.equal(await s.text('[data-skew-output]'), '1010')
  await fit('skew-early-read')
  await range('#skew [data-time-range]', 1.8)
  assert.equal(await s.ev('[...document.querySelectorAll("[data-skew-value]")].map(e=>e.textContent).join("")'), '1011')
  assert.equal(await s.text('[data-skew-output]'), '1010', 'Arrival does not change the earlier stored result')
  await fit('skew-after-arrival')
  await setCheck('[data-read-later]', true)
  await range('#skew [data-time-range]', 2)
  assert.equal(await s.text('[data-skew-output]'), '1011')
  await fit('skew-later-read')
  await setCheck('[data-long-path]', false); await setCheck('[data-read-later]', false)
  await range('#skew [data-time-range]', 1.25)
  assert.equal(await s.text('[data-skew-output]'), '1011')
  await fit('skew-matched-paths')

  // Play/Pause stays useful with OS reduced motion, and all players stop offscreen.
  for (const [id, host, play, reset, timeKey, playingKey] of [
    ['data-paths', comparison, '[data-tc-play]', '[data-tc-reset]', 'comparisonTime', 'comparisonPlaying'],
    ...[['timing', 'timing'], ['synchronous', 'sync'], ['start-stop', 'async']].map(([id, kind]) => [id, `[data-wave-tool=${kind}]`, `#${id} [data-time-play]`, `#${id} [data-time-reset]`, 'time', 'timePlaying']),
    ['skew', '[data-skew-tool]', '#skew [data-time-play]', '#skew [data-time-reset]', 'time', 'timePlaying'],
  ]) {
    await goto(id); await click(reset); await keyboard(play)
    await s.waitFor(`Number(document.querySelector('${host}').dataset.${timeKey}) > .05`)
    assert.equal(await s.ev(`document.querySelector('${host}').dataset.${playingKey}`), 'true')
    await keyboard(play)
    const paused = await s.ev(`document.querySelector('${host}').dataset.${timeKey}`)
    await s.ev('new Promise(r=>setTimeout(r,120))')
    assert.equal(await s.ev(`document.querySelector('${host}').dataset.${timeKey}`), paused)
    assert.equal(await s.ev('location.hash'), '#' + id)
    await keyboard(play); await click('[data-action=next-slide]')
    await s.waitFor(`document.querySelector('${host}').dataset.${playingKey} === 'false'`)
  }

  await goto('selection')
  const steps = await s.ev('document.querySelectorAll("#selection [data-walkthrough-step]").length')
  for (let i = 0; i < steps; i++) {
    assert.match(await s.text('#selection [data-walkthrough-status]'), new RegExp(`Step ${i + 1} of ${steps}`))
    await fit(`selection-step-${i + 1}`); await keyboard('#selection [data-walkthrough-next]')
  }
  await click('#selection [data-walkthrough-reset]')
  for (const [id, config] of Object.entries(transmissionScenarios)) {
    await goto(id)
    const root = `#${id}`
    await click(`${root} [data-check-pair]`); assert.match(await s.text(`${root} [data-pair-feedback]`), /Choose a method/)
    const [method, reason] = config.acceptedPairs[0]
    await s.input(`${root} [data-choice=type]`, method)
    const wrong = await s.ev(`[...document.querySelector('${root} [data-choice=reason]').options].find(o=>o.value&&o.value!=='${reason}').value`)
    await s.input(`${root} [data-choice=reason]`, wrong); await click(`${root} [data-check-pair]`)
    assert.match(await s.text(`${root} [data-pair-feedback]`), /Reconsider/)
    await s.input(`${root} [data-choice=reason]`, reason); await click(`${root} [data-check-pair]`)
    assert.match(await s.text(`${root} [data-pair-feedback]`), /Suitable choice/)
    await s.input(`${root} textarea`, 'My reason for ' + id, 'input'); await fit(`${id}-feedback`)
    await click(`${root} [data-reset-pair]`)
    assert.equal(await s.ev(`document.querySelector('${root} textarea').value`), 'My reason for ' + id)
  }
  await click('[data-action=exit-teacher-mode]'); await s.load()
  assert.equal(await s.ev('document.querySelector("#path-choice-draft").value'), 'My reason for path-choice')
  assert.equal(await s.ev('document.querySelector("#timing-choice-draft").value'), 'My reason for timing-choice')
  assert.equal(await s.ev('document.querySelector("[data-exam-response=question-2]").value'), drafts['question-2'])
  assert.equal((await storage(keys.drafts)).retired, drafts.retired)
  assert.equal((await storage(keys.quiz)).bestScore, 5)
  assert.deepEqual(await storage(keys.old), { mode: 'parallel' })
  for (const width of [390, 320]) {
    await s.send('Emulation.setDeviceMetricsOverride', { width, height: 844, deviceScaleFactor: 1, mobile: true })
    assert.ok(await s.ev('document.documentElement.scrollWidth<=innerWidth+1'), `Page fits ${width}`)
    for (const id of ['overview', 'two-questions', 'data-paths', 'skew', 'timing', 'clock', 'synchronous', 'asynchronous', 'start-stop', 'overhead', 'path-choice']) {
      await s.ev(`document.getElementById('${id}').scrollIntoView()`); await frame(); await s.screenshot(`${id}-${width}`)
    }
  }
  await s.ev('document.querySelector("#timing [data-time-next]").scrollIntoView({block:"center"})'); await frame()
  const pt = await s.ev('(()=>{const r=document.querySelector("#timing [data-time-next]").getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()')
  await s.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [pt] }); await s.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
  await s.waitFor('document.querySelector("#timing [data-wave-output]").textContent === "1"')
  assert.equal(await s.ev('document.querySelector("[data-show-times]").checked'), true)
  // Print must use the complete authored explanations even after a different live state.
  await s.input('[data-read-period]', 2); await range('#timing [data-time-range]', 8)
  await range('#synchronous [data-time-range]', 2.5)
  await range('#start-stop [data-time-range]', 2.5)
  await setCheck('[data-long-path]', false); await setCheck('[data-read-later]', true)
  await range('#skew [data-time-range]', 2)
  assert.equal(await s.text('#timing [data-wave-output]'), '110?')
  assert.equal(await s.text('[data-skew-output]'), '1011')
  assert.equal(await s.ev('[...document.querySelectorAll("[data-wave-print], .tt-print-skew")].every(e=>getComputedStyle(e).display==="none")'), true)
  assert.deepEqual(await s.ev('[...document.querySelectorAll("[data-wave-print]")].map(e=>[...e.querySelectorAll(".tt-read-digit")].map(d=>d.textContent).join(""))'), [TIMING_BITS, TIMING_BITS, TIMING_BITS])
  assert.equal(await s.ev('document.querySelectorAll("[data-wave-grid]").length'), 3)
  assert.equal(await s.ev('document.querySelectorAll("[data-skew-value]").length'), 4)
  await s.send('Emulation.setEmulatedMedia', { media: 'print' })
  assert.equal(await s.ev('[...document.querySelectorAll("[data-walkthrough-step], [data-time-static], .tc-static")].filter(e=>getComputedStyle(e).display==="none").length'), 0)
  assert.equal(await s.ev('[...document.querySelectorAll("[data-time-controls], [data-tc-controls]")].filter(e=>getComputedStyle(e).display!=="none").length'), 0)
  assert.equal(await s.ev('[...document.querySelectorAll("[data-wave-print], .tt-print-skew")].filter(e=>getComputedStyle(e).display!=="none").length'), 4)
  assert.equal(await s.ev('[...document.querySelectorAll("[data-wave-grid], .tt-live-skew")].every(e=>getComputedStyle(e).display==="none")'), true)
  assert.equal(await s.ev('[...document.querySelectorAll(".tt-print-skew text[x=\\"830\\"]")].map(e=>e.textContent).join("")'), '1010')
  assert.match(await s.ev('document.querySelectorAll(".tt-print-skew .tt-skew-path")[3].getAttribute("d")'), /V178/)
  assert.equal(await s.ev('[...document.querySelectorAll(".tt-print-skew *")].some(e=>[...e.attributes].some(a=>a.name.startsWith("data-skew-")))'), false)
  await s.send('Emulation.setEmulatedMedia', { media: '' })
  await s.send('Emulation.setScriptExecutionDisabled', { value: true }); await s.send('Page.reload'); await new Promise(r => setTimeout(r, 500))
  assert.equal(await s.ev('document.querySelectorAll("[data-walkthrough-step][hidden]").length'), 0)
  assert.equal(await s.ev('[...document.querySelectorAll("[data-time-controls], [data-tc-controls], [data-walkthrough-controls]")].every(e=>e.hidden)'), true)
  assert.equal(await s.ev('document.querySelectorAll("[data-time-ready], [data-comparison-ready]").length'), 0)
  assert.deepEqual(await s.ev('[...document.querySelectorAll("[data-wave-output]")].map(e=>e.textContent)'), [TIMING_BITS, TIMING_BITS, TIMING_BITS])
  assert.equal(await s.ev('[...document.querySelectorAll("[data-time-static]")].every(e=>getComputedStyle(e).display!=="none")'), true)
  await s.send('Emulation.setScriptExecutionDisabled', { value: false })
  assert.deepEqual(s.errors.filter(e => !e.includes('/favicon.ico')), [])
} finally {
  mkdirSync(process.env.FLEXBOX_SCREENSHOTS, { recursive: true })
  writeFileSync(`${process.env.FLEXBOX_SCREENSHOTS}/report.json`, JSON.stringify({ report, failures, errors: s.errors }, null, 2))
  await s.close()
}
assert.deepEqual(failures, [], 'All teaching states fit')
console.log('PASS: all slides, rate comparison, signal sampling, synchronous/asynchronous reads, skew consequences, scenarios and saved work, keyboard/touch, reduced motion, mobile and static/print views.')
