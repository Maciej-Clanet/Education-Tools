// Isolated browser only: see docs/testing.md. This seeds test learner storage.
import assert from 'node:assert/strict'
import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { createBrowserSession } from './helpers/browser-session.mjs'
import { buildPacketJourney, PACKET_CASES } from '../javascript/data/packet-journey-model.js'
import { packetScenarios } from '../javascript/data/packet-scenarios.js'

const slug = 'packet-data-packet-switching-and-protocols'
const path = `/pages/topics/${slug}.html`
const html = readFileSync(path.slice(1), 'utf8')
const links = [...html.matchAll(/(?:href|src)="([^"#?]+)(?:[?#][^"]*)?"/g)].map(m => m[1]).filter(x => !/^https?:/.test(x))
assert.deepEqual(links.filter(x => !existsSync(resolve(dirname(path.slice(1)), x))), [])
process.env.FLEXBOX_SCREENSHOTS ||= '.raid-checks/packets'
const s = await createBrowserSession({ lessonPath: path, readyExpression: 'document.body.dataset.packetLessonReady' })
const keys = { quiz: `education-tools:lesson-${slug}-quiz`, drafts: `education-tools:lesson-${slug}-exam-practice`, old: 'education-tools:lesson-packet-switching-simulator', journey: 'education-tools:lesson-packet-journey-v1' }
const quiz = { answers: { q1: 'b', q2: 'a', q3: 'c', q4: 'b', q5: 'a' }, lastScore: 5, bestScore: 5 }
const drafts = { 'question-1': 'Existing packet answer', 'question-2': 'Existing network answer', retired: 'Keep this retired answer' }
const legacy = { message: 'A saved learner message.', packetSize: 4, packets: [{ id: 1, payload: 'A sa' }], routeMode: 'adaptive' }
const slides = [], report = [], failures = []
const frame = () => s.ev('new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))')
const click = async x => { await s.click(x); await frame() }
const current = async () => Number((await s.text('[data-role=slide-status]')).match(/Slide (\d+)/)[1])
const goto = async id => {
  const n = slides.indexOf(id) + 1
  assert.ok(n > 0, id)
  while (await current() !== n) await click(`[data-action=${await current() < n ? 'next-slide' : 'prev-slide'}]`)
}
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

try {
  await s.send('Runtime.enable'); await s.send('Log.enable')
  await s.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
  await s.send('Emulation.setDeviceMetricsOverride', { width: 1366, height: 768, deviceScaleFactor: 1, mobile: false })
  await s.load()
  await s.ev(`localStorage.removeItem('education-tools:${slug}-teacher-mode');localStorage.removeItem('${keys.journey}')`)
  for (const [k, v] of [[keys.quiz, quiz], [keys.drafts, drafts], [keys.old, legacy]]) await s.ev(`localStorage.setItem(${JSON.stringify(k)},${JSON.stringify(JSON.stringify(v))})`)
  await s.load()
  assert.equal(await s.ev('document.querySelectorAll("[data-question] input:checked").length'), 5)
  assert.equal(await s.ev('document.querySelector("[data-exam-response=question-1]").value'), drafts['question-1'])
  assert.equal(await s.ev('document.querySelector("[data-packet-message]").value'), legacy.message)
  const audit = await s.ev(`(()=>{const ids=[...document.querySelectorAll('[id]')].map(e=>e.id);return {duplicates:ids.filter((id,i)=>ids.indexOf(id)!==i),missing:[...document.querySelectorAll('[data-section-link]')].filter(a=>!document.querySelector(a.hash)).map(a=>a.hash)}})()`)
  assert.deepEqual(audit, { duplicates: [], missing: [] })
  for (const id of ['overview', 'packets', 'simulator', 'switching', 'protocols', 'mistakes', 'quiz', 'exam-practice']) assert.equal(await s.ev(`!!document.getElementById('${id}')`), true)
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
  for (const id of ['split', 'route-change', 'arrival-order', 'protocols', 'missing']) {
    await goto(id)
    const root = `#${id}`
    const total = await s.ev(`document.querySelectorAll('${root} [data-walkthrough-step]').length`)
    await click(`${root} [data-walkthrough-prev]`)
    for (let i = 0; i < total; i++) {
      assert.match(await s.text(`${root} [data-walkthrough-status]`), new RegExp(`Step ${i + 1} of ${total}`))
      assert.equal(await s.ev(`document.querySelectorAll('${root} [data-walkthrough-step]:not([hidden])').length`), 1)
      await fit(`${id}-step-${i + 1}`)
      await keyboard(`${root} [data-walkthrough-next]`)
      assert.equal(await s.ev('location.hash'), '#' + id)
      assert.equal(await s.ev(`document.activeElement.matches('${root} [data-walkthrough-next]')`), true)
    }
    assert.match(await s.text(`${root} [data-walkthrough-status]`), new RegExp(`Step ${total} of ${total}`))
    await click(`${root} [data-walkthrough-reset]`)
    assert.match(await s.text(`${root} [data-walkthrough-status]`), /Step 1 /)
  }
  await goto('field-roles')
  for (const key of ['source', 'destination', 'sequence', 'payload', 'check']) {
    await keyboard(`[data-packet-field=${key}]`)
    assert.deepEqual(await s.ev(`[...document.querySelectorAll('[data-field-panel]:not([hidden])')].map(e=>e.dataset.fieldPanel)`), [key])
    assert.equal(await s.ev(`document.querySelector('[data-packet-field=${key}]').getAttribute('aria-pressed')`), 'true')
    await fit(`field-${key}`)
  }
  await goto('routes')
  const host = '#routes [data-teaching-animation]'
  const mover = `${host} .pk-traveller--upper`
  await s.waitFor(`!document.querySelector('${host}').classList.contains('teaching-animation-paused')`)
  const before = await s.ev(`document.querySelector('${mover}').getAnimations()[0].currentTime`)
  await s.ev('new Promise(r=>setTimeout(r,150))')
  assert.ok(await s.ev(`document.querySelector('${mover}').getAnimations()[0].currentTime`) > before)
  await keyboard(`${host} button`)
  assert.equal(await s.ev(`getComputedStyle(document.querySelector('${mover}')).animationPlayState`), 'paused')
  const positions = []
  for (const t of [1500, 3000, 4500]) {
    await s.ev(`document.querySelector('${mover}').getAnimations()[0].currentTime=${t}`); await frame()
    positions.push(await s.ev(`(()=>{const r=document.querySelector('${mover}').getBoundingClientRect();return {x:r.x,y:r.y}})()`))
  }
  assert.ok(positions[0].x < positions[1].x && positions[1].x < positions[2].x)
  assert.ok(positions[1].y < positions[0].y && positions[1].y < positions[2].y)
  await keyboard(`${host} button`); await click('[data-action=next-slide]')
  await s.waitFor(`document.querySelector('${host}').classList.contains('teaching-animation-paused')`)

  await goto('simulator')
  for (const message of ['Meet at the gate at four.', 'A'.repeat(120), '\u754C'.repeat(120), '\u{1F30D}'.repeat(60)]) {
    await s.input('[data-packet-message]', message, 'input')
    for (const scenario of PACKET_CASES) {
      await s.input('[data-packet-case]', scenario)
      const journey = buildPacketJourney(message, scenario)
      await click('[data-journey-prev]')
      for (const [i, model] of journey.frames.entries()) {
        assert.equal(await s.text('[data-journey-step]'), `Step ${i + 1} of ${journey.frames.length}`)
        const received = await s.ev(`[...document.querySelectorAll('[data-journey-received] .pk-piece:not(.is-missing)')].map(e=>e.querySelector('span').textContent)`)
        assert.deepEqual(received, journey.packets.filter(p => model.received.includes(p.id)).map(p => p.payload))
        assert.equal(await s.text('[data-journey-message]'), model.complete ? `Rebuilt message: ${message}` : 'The message is not complete yet.')
        if (['loss', 'damage'].includes(scenario) && i === journey.frames.length - 2) assert.equal(await s.text('[data-journey-next]'), 'Resend missing data')
        await fit(`sim-${message.codePointAt(0)}-${message.length}-${scenario}-${i}`, i === journey.frames.length - 1 || i === 2)
        await keyboard('[data-journey-next]')
        assert.equal(await s.ev('location.hash'), '#simulator')
      }
      assert.equal(await s.ev('document.querySelector("[data-journey-next]").getAttribute("aria-disabled")'), 'true')
      await click('[data-journey-prev]'); assert.match(await s.text('[data-journey-step]'), new RegExp(`Step ${journey.frames.length - 1} `))
      await click('[data-journey-reset]'); assert.match(await s.text('[data-journey-step]'), /Step 1 /)
    }
  }
  await s.input('[data-packet-message]', '', 'input')
  await click('[data-journey-next]')
  assert.match(await s.text('[data-journey-status]'), /Enter a message/)
  assert.equal(await s.ev('document.querySelector("[data-packet-message]").getAttribute("aria-invalid")'), 'true')
  const custom = '<img src=x> \u{1F30D} caf\u00E9'
  await s.input('[data-packet-message]', custom, 'input')
  for (let i = 0; i < 8; i++) await click('[data-journey-next]')
  assert.equal(await s.text('[data-journey-message]'), `Rebuilt message: ${custom}`)
  assert.equal(await s.ev('document.querySelectorAll("[data-journey-received] img").length'), 0)
  await s.input('[data-packet-message]', 'My saved message.', 'input')
  await s.input('[data-packet-case]', 'reorder')

  await goto('rebuild-task')
  await click('[data-check-order]'); assert.match(await s.text('[data-order-feedback]'), /all three/)
  for (const id of [1, 2, 3]) await s.input(`[data-order-slot="${id}"]`, 3)
  await click('[data-check-order]')
  assert.match(await s.text('[data-order-feedback]'), /Use each packet once/)
  assert.equal(await s.ev('document.querySelectorAll("[data-order-slot].is-incorrect").length'), 2)
  for (const id of [1, 2, 3]) await s.input(`[data-order-slot="${id}"]`, id)
  await click('[data-check-order]')
  assert.match(await s.text('[data-order-feedback]'), /^Correct/)
  assert.equal(await s.ev('document.querySelectorAll("[data-order-slot].is-correct").length'), 3)
  await fit('order-correct')
  await click('[data-reset-order]')
  assert.equal(await s.text('[data-order-feedback]'), '')
  assert.equal((await storage(keys.journey)).message, 'My saved message.')

  for (const [id, config] of Object.entries(packetScenarios)) {
    await goto(id)
    const root = `#${id}`
    await click(`${root} [data-check-pair]`); assert.match(await s.text(`${root} [data-pair-feedback]`), /Choose an action/)
    const [action, reason] = config.acceptedPairs[0]
    await s.input(`${root} [data-choice=type]`, action)
    await s.input(`${root} [data-choice=reason]`, 'none'); await click(`${root} [data-check-pair]`)
    assert.match(await s.text(`${root} [data-pair-feedback]`), /Reconsider/)
    await s.input(`${root} [data-choice=reason]`, reason); await click(`${root} [data-check-pair]`)
    assert.match(await s.text(`${root} [data-pair-feedback]`), /Suitable choice/)
    await s.input(`${root} textarea`, 'My reason for ' + id, 'input'); await fit(`${id}-feedback`)
    await click(`${root} [data-reset-pair]`)
    assert.equal(await s.ev(`document.querySelector('${root} textarea').value`), 'My reason for ' + id)
  }
  await click('[data-action=exit-teacher-mode]'); await s.load()
  assert.equal(await s.ev('document.querySelector("#file-judgement-draft").value'), 'My reason for file-judgement')
  assert.equal(await s.ev('document.querySelector("#call-judgement-draft").value'), 'My reason for call-judgement')
  assert.equal(await s.ev('document.querySelector("[data-exam-response=question-2]").value'), drafts['question-2'])
  assert.equal((await storage(keys.drafts)).retired, drafts.retired)
  assert.equal((await storage(keys.quiz)).bestScore, 5)
  assert.deepEqual(await storage(keys.old), legacy)
  assert.equal(await s.ev('document.querySelector("[data-packet-message]").value'), 'My saved message.')
  assert.equal(await s.ev('document.querySelector("[data-packet-case]").value'), 'reorder')
  assert.match(await s.text('[data-journey-step]'), /^Step 1 /)

  for (const width of [390, 320]) {
    await s.send('Emulation.setDeviceMetricsOverride', { width, height: 844, deviceScaleFactor: 1, mobile: true })
    assert.ok(await s.ev('document.documentElement.scrollWidth<=innerWidth+1'), `Page fits ${width}`)
    for (const id of ['overview', 'split', 'packets', 'field-roles', 'switching', 'routes', 'protocols', 'simulator', 'rebuild-task', 'file-judgement']) {
      await s.ev(`document.getElementById('${id}').scrollIntoView()`); await frame(); await s.screenshot(`${id}-${width}`)
    }
  }
  await s.ev('document.querySelector("#split [data-walkthrough-next]").scrollIntoView({block:"center"})'); await frame()
  const pt = await s.ev('(()=>{const r=document.querySelector("#split [data-walkthrough-next]").getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()')
  await s.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [pt] }); await s.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
  await s.waitFor('document.querySelector("#split [data-walkthrough-status]").textContent.startsWith("Step 2")')
  await s.send('Emulation.setEmulatedMedia', { media: 'print' })
  assert.equal(await s.ev('[...document.querySelectorAll("[data-walkthrough-step], [data-field-panel]")].filter(e=>getComputedStyle(e).display==="none").length'), 0)
  assert.equal(await s.ev('getComputedStyle(document.querySelector(".teaching-animation-control")).display'), 'none')
  await s.send('Emulation.setEmulatedMedia', { media: '' })
  await s.send('Emulation.setScriptExecutionDisabled', { value: true }); await s.send('Page.reload'); await new Promise(r => setTimeout(r, 500))
  assert.equal(await s.ev('document.querySelectorAll("[data-walkthrough-step][hidden], [data-field-panel][hidden]").length'), 0)
  assert.equal(await s.ev('getComputedStyle(document.querySelector(".pk-traveller")).animationName'), 'none')
  assert.equal(await s.ev('document.querySelector("[data-simulator-controls]").hidden'), true)
  assert.equal(await s.ev('document.querySelectorAll("[data-journey-received] .pk-piece").length'), 3)
  await s.send('Emulation.setScriptExecutionDisabled', { value: false })
  assert.deepEqual(s.errors.filter(e => !e.includes('/favicon.ico')), [])
} finally {
  mkdirSync(process.env.FLEXBOX_SCREENSHOTS, { recursive: true })
  writeFileSync(`${process.env.FLEXBOX_SCREENSHOTS}/report.json`, JSON.stringify({ report, failures, errors: s.errors }, null, 2))
  await s.close()
}
assert.deepEqual(failures, [], 'All teaching states fit')
console.log('PASS: slides and walkthroughs, packet fields, all journey cases, reassembly and scenario tasks, retained learner work, keyboard/touch, mobile, reduced motion and static/print views.')
