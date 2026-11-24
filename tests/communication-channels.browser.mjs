// Use an isolated local browser profile; setup is in docs/testing.md.
import assert from 'node:assert/strict'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { createBrowserSession } from './helpers/browser-session.mjs'
import { communicationScenarios } from '../javascript/data/communication-scenarios.js'

process.env.FLEXBOX_SCREENSHOTS ||= '.raid-checks/communication'
const slug = 'communication-channels-and-connection-methods'
const path = `/pages/topics/${slug}.html`
const html = readFileSync(path.slice(1), 'utf8')
const links = [...html.matchAll(/(?:href|src)="([^"#?]+)(?:[?#][^"]*)?"/g)].map(m => m[1]).filter(href => !/^https?:/.test(href))
assert.deepEqual(links.filter(href => !existsSync(resolve(dirname(path.slice(1)), href))), [])
const s = await createBrowserSession({ lessonPath: path, readyExpression: 'document.body.dataset.communicationReady' })
const keys = {
  quiz: `education-tools:lesson-${slug}-quiz`,
  drafts: `education-tools:lesson-${slug}-exam-practice`,
  practice: 'education-tools:lesson-communication-matching-v1',
  legacy: 'education-tools:lesson-communication-scenario-tool',
}
const draft = { 'question-1': 'My existing office explanation', 'question-2': 'My existing warehouse explanation', retired: 'Keep this old answer' }
const legacy = { scenario: 'warehouse' }
const quiz = { answers: { q1: 'a', q2: 'c', q3: 'b', q4: 'a', q5: 'b' }, bestScore: 5, lastScore: 5 }
const report = [], failures = [], slides = []
const frame = () => s.ev('new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))')
const click = async selector => { await s.click(selector); await frame() }
const storage = key => s.ev(`JSON.parse(localStorage.getItem(${JSON.stringify(key)}))`)
const current = async () => Number((await s.text('[data-role=slide-status]')).match(/Slide (\d+)/)[1])
const goto = async id => {
  const target = slides.indexOf(id) + 1
  assert.ok(target > 0, id)
  while (await current() !== target) await click(`[data-action=${await current() < target ? 'next-slide' : 'prev-slide'}]`)
}
const fit = async label => {
  const box = await s.ev(`(()=>{const e=document.getElementById(location.hash.slice(1));return {id:e.id,w:e.clientWidth,sw:e.scrollWidth,h:e.clientHeight,sh:e.scrollHeight}})()`)
  report.push({ label, ...box })
  if (box.sw > box.w + 2 || (!['quiz', 'exam-practice'].includes(box.id) && box.sh > box.h + 2)) failures.push({ label, ...box })
  await s.screenshot(label)
  return box.id
}
const pressSpace = async selector => {
  await s.ev(`document.querySelector(${JSON.stringify(selector)}).focus()`)
  await s.send('Input.dispatchKeyEvent', { type: 'keyDown', key: ' ', code: 'Space', windowsVirtualKeyCode: 32 })
  await s.send('Input.dispatchKeyEvent', { type: 'keyUp', key: ' ', code: 'Space', windowsVirtualKeyCode: 32 })
  await frame()
}
try {
  await s.send('Runtime.enable'); await s.send('Log.enable'); await s.send('Page.enable')
  await s.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
  await s.send('Emulation.setDeviceMetricsOverride', { width: 1366, height: 768, deviceScaleFactor: 1, mobile: false })
  await s.load()
  await s.ev(`localStorage.removeItem('education-tools:${slug}-teacher-mode');localStorage.removeItem('${keys.practice}')`)
  for (const [key, value] of [[keys.quiz, quiz], [keys.drafts, draft], [keys.legacy, legacy]]) {
    await s.ev(`localStorage.setItem(${JSON.stringify(key)},${JSON.stringify(JSON.stringify(value))})`)
  }
  await s.load()
  assert.equal(await s.ev('document.querySelectorAll("[data-question] input:checked").length'), 5)
  assert.deepEqual(await s.ev('[...document.querySelectorAll("[data-exam-response]")].map(e=>e.value)'), [draft['question-1'], draft['question-2']])
  const audit = await s.ev(`(()=>{const ids=[...document.querySelectorAll('[id]')].map(e=>e.id);return {duplicates:ids.filter((id,i)=>ids.indexOf(id)!==i),missing:[...document.querySelectorAll('[data-section-link]')].filter(a=>!document.querySelector(a.hash)).map(a=>a.hash)}})()`)
  assert.deepEqual(audit, { duplicates: [], missing: [] })
  for (const id of ['overview', 'direction', 'arrangement', 'connection-methods', 'scenario-chooser', 'selection', 'justify-link', 'mistakes', 'quiz', 'exam-practice']) assert.ok(await s.ev(`!!document.getElementById('${id}')`))
  await click('[data-action=toggle-teacher-mode]')
  assert.equal(await s.ev('location.hash'), '#overview--opener')
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
  assert.equal(await s.ev('[...document.querySelectorAll(".cc-photo img")].filter(e=>e.complete&&e.naturalWidth>0).length'), 6)
  await s.send('Emulation.setDeviceMetricsOverride', { width: 1366, height: 768, deviceScaleFactor: 1, mobile: false })
  for (const id of ['direction', 'half-duplex', 'full-duplex']) {
    await goto(id)
    const host = `#${id} [data-teaching-animation]`
    await s.waitFor(`!document.querySelector('${host}').classList.contains('teaching-animation-paused')`)
    const before = await s.ev(`document.querySelector('${host} .cc-dot').getAnimations()[0].currentTime`)
    await s.ev('new Promise(r=>setTimeout(r,100))')
    assert.ok(await s.ev(`document.querySelector('${host} .cc-dot').getAnimations()[0].currentTime`) > before, 'Teaching motion runs with reduced motion enabled')
    await pressSpace(`${host} button`)
    assert.equal(await s.ev(`getComputedStyle(document.querySelector('${host} .cc-dot')).animationPlayState`), 'paused')
    assert.equal(await s.ev('location.hash'), `#${id}`)
    if (id === 'half-duplex') {
      // Inspect both halves of the cycle and its turnaround pauses.
      for (const time of [500, 2000, 2800, 3500, 5000, 5800]) {
        await s.ev(`document.querySelector('${host}').getAnimations({subtree:true}).forEach(a=>a.currentTime=${time})`)
        const visible = await s.ev(`[...document.querySelectorAll('${host} .cc-dot')].map(e=>Number(getComputedStyle(e).opacity)>.9)`)
        assert.ok(visible.filter(Boolean).length <= 1, 'Half-duplex never sends both ways at once')
        if (time < 2700) assert.deepEqual(visible, [true, false])
        if (time >= 3000 && time < 5700) assert.deepEqual(visible, [false, true])
      }
    }
    await pressSpace(`${host} button`)
    await click('[data-action=next-slide]')
    await s.waitFor(`document.querySelector('${host}').classList.contains('teaching-animation-paused')`)
  }
  await goto('multi-drop')
  for (const meter of [2, 3, 1]) {
    await pressSpace(`[data-meter="${meter}"]`)
    assert.equal(await s.ev('document.querySelectorAll("[data-meter][aria-pressed=true]").length'), 1)
    assert.match(await s.text('[data-bus-status]'), new RegExp(`Only Meter ${meter} replies`))
    assert.equal(await s.ev('location.hash'), '#multi-drop')
  }
  for (const [group, section] of [['channels', 'channel-practice'], ['methods', 'scenario-chooser']]) {
    await goto(section)
    const root = `[data-practice=${group}]`
    const questions = Object.entries(communicationScenarios).filter(([id]) => id.startsWith(group + '-'))
    await click(`${root} [data-practice-prev]`)
    assert.match(await s.text(`${root} [data-practice-progress]`), /^Task 1 /)
    for (const [i, [id, config]] of questions.entries()) {
      const card = `[data-paired-scenario=${id}]`
      assert.equal(await s.ev(`document.querySelector('${card}').hidden`), false)
      await click(`${card} [data-check-pair]`)
      assert.match(await s.text(`${card} [data-pair-feedback]`), /Choose both/)
      const [type, reason] = config.acceptedPairs[0]
      await s.input(`${card} [data-choice=type]`, type)
      const wrong = await s.ev(`[...document.querySelector('${card} [data-choice=reason]').options].find(o=>o.value&&o.value!==${JSON.stringify(reason)}).value`)
      await s.input(`${card} [data-choice=reason]`, wrong)
      await click(`${card} [data-check-pair]`)
      assert.match(await s.text(`${card} [data-pair-feedback]`), /^Not quite/)
      await s.input(`${card} [data-choice=reason]`, reason)
      assert.equal(await s.text(`${card} [data-pair-feedback]`), '')
      await click(`${card} [data-check-pair]`)
      assert.match(await s.text(`${card} [data-pair-feedback]`), /^Correct/)
      await fit(`${id}-feedback`)
      await pressSpace(`${root} [data-practice-next]`)
      assert.equal(await s.ev('location.hash'), `#${section}`)
      assert.match(await s.text(`${root} [data-practice-progress]`), new RegExp(`Task ${Math.min(i + 2, questions.length)} of`))
      assert.equal(await s.ev('document.activeElement.hasAttribute("data-practice-next")'), true)
    }
  }
  const savedPractice = await storage(keys.practice)
  await goto('selection')
  for (const key of ['mobility', 'capacity', 'distance', 'reliability', 'security', 'cost']) {
    await pressSpace(`[data-factor=${key}]`)
    assert.equal(await s.ev('document.querySelectorAll("[data-factor-panel]:not([hidden])").length'), 1)
    assert.equal(await s.ev(`document.querySelector('[data-factor-panel=${key}]').hidden`), false)
    await fit(`factor-${key}`)
  }
  await goto('justify-link')
  for (let i = 1; i <= 3; i++) {
    assert.match(await s.text('[data-walkthrough-status]'), new RegExp(`Step ${i} of 3`))
    assert.equal(await s.ev('document.querySelectorAll("[data-walkthrough-step]:not([hidden]) .is-complete").length'), i - 1)
    await fit(`justify-${i}`); await pressSpace('[data-walkthrough-next]')
  }
  assert.match(await s.text('[data-walkthrough-status]'), /Step 3 of 3/)
  await click('[data-walkthrough-reset]'); await click('[data-walkthrough-prev]')
  assert.match(await s.text('[data-walkthrough-status]'), /Step 1 of 3/)
  await click('[data-action=exit-teacher-mode]'); await s.load()
  assert.deepEqual(await storage(keys.practice), savedPractice)
  assert.equal(await s.ev('document.querySelector("#methods-field-type").value'), 'cellular')
  assert.equal(await s.ev('document.querySelector("#channels-alerts-reason").value'), 'multi')
  await click('[data-paired-scenario=methods-field] [data-reset-pair]')
  const resetPractice = await storage(keys.practice)
  assert.deepEqual(resetPractice.methods.answers['methods-field'], { type: '', reason: '' })
  assert.deepEqual(resetPractice.channels, savedPractice.channels)
  assert.deepEqual(resetPractice.methods.answers['methods-desks'], savedPractice.methods.answers['methods-desks'])
  for (const width of [390, 320]) {
    await s.send('Emulation.setDeviceMetricsOverride', { width, height: 844, deviceScaleFactor: 1, mobile: true })
    assert.ok(await s.ev('document.documentElement.scrollWidth<=innerWidth+1'), `Page width at ${width}px`)
    for (const id of ['overview', 'half-duplex', 'multi-drop', 'ethernet', 'scenario-chooser', 'selection', 'justify-link']) {
      await s.ev(`document.getElementById('${id}').scrollIntoView()`); await frame(); await s.screenshot(`${id}-${width}`)
    }
  }
  await s.ev('document.querySelector("[data-factor=distance]").scrollIntoView({block:"center"})'); await frame()
  const point = await s.ev('(()=>{const r=document.querySelector("[data-factor=distance]").getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()')
  await s.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [point] })
  await s.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
  await s.waitFor('document.querySelector("[data-factor=distance]").getAttribute("aria-pressed")==="true"')
  await s.input('[data-exam-response=question-1]', 'My updated office answer', 'input'); await s.load()
  assert.equal(await s.ev('document.querySelector("[data-exam-response=question-1]").value'), 'My updated office answer')
  assert.equal((await storage(keys.drafts)).retired, draft.retired)
  assert.deepEqual(await storage(keys.legacy), legacy)
  assert.equal((await storage(keys.quiz)).bestScore, 5)
  await s.send('Emulation.setEmulatedMedia', { media: 'print' })
  assert.equal(await s.ev('[...document.querySelectorAll("[data-practice-card]")].filter(e=>getComputedStyle(e).display!=="none").length'), 11)
  assert.equal(await s.ev('[...document.querySelectorAll("[data-factor-panel]")].filter(e=>getComputedStyle(e).display!=="none").length'), 6)
  assert.equal(await s.ev('[...document.querySelectorAll("[data-walkthrough-step]")].filter(e=>getComputedStyle(e).display!=="none").length'), 3)
  assert.equal(await s.ev('getComputedStyle(document.querySelector(".cc-static-answer")).display'), 'block')
  await s.send('Emulation.setEmulatedMedia', { media: '' })
  await s.send('Emulation.setScriptExecutionDisabled', { value: true }); await s.send('Page.reload')
  await new Promise(r => setTimeout(r, 500))
  assert.equal(await s.ev('document.querySelectorAll("[data-practice-card]:not([hidden])").length'), 11)
  assert.equal(await s.ev('document.querySelector("[data-practice-controls]").hidden'), true)
  assert.equal(await s.ev('getComputedStyle(document.querySelector(".cc-dot")).display'), 'none')
  assert.equal(await s.ev('getComputedStyle(document.querySelector(".cc-static-answer")).display'), 'block')
  await s.send('Emulation.setScriptExecutionDisabled', { value: false })
  assert.deepEqual(s.errors.filter(e => !e.includes('/favicon.ico')), [])
} finally {
  mkdirSync(process.env.FLEXBOX_SCREENSHOTS, { recursive: true })
  writeFileSync(`${process.env.FLEXBOX_SCREENSHOTS}/report.json`, JSON.stringify({ report, failures, errors: s.errors }, null, 2))
  await s.close()
}
assert.deepEqual(failures, [], 'Teaching slides and all activity states fit')
console.log('PASS: slide layouts, direction animations, shared bus, all 11 matching tasks, factors, explanation steps, keyboard/touch, mobile, print/no-JS and preserved learner work.')
