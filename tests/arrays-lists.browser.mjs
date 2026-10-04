// Uses an isolated local browser profile: seeds only this lesson's saved work.
import assert from 'node:assert/strict'
import { mkdirSync, writeFileSync } from 'node:fs'
import { createBrowserSession } from './helpers/browser-session.mjs'

process.env.FLEXBOX_TEST_ORIGIN ||= 'http://127.0.0.1:8765'
process.env.FLEXBOX_CDP_ORIGIN ||= 'http://127.0.0.1:9229'
process.env.FLEXBOX_SCREENSHOTS ||= '.raid-checks/arrays-lists'
const path = '/pages/topics/arrays-lists-and-data-types.html'
const ready = 'document.querySelector("[data-array-ready]") && document.querySelectorAll("[data-walkthrough-ready]").length===4 && document.querySelector("[data-teacher-opener-slide]")'
const s = await createBrowserSession({ lessonPath: path, readyExpression: ready })
const report = [], failures = [], slideIds = []
const base = 'education-tools:lesson-arrays-lists-and-data-types-'
const keys = { quiz: base + 'quiz-v2', old: base + 'quiz', drafts: base + 'exam-practice', progress: 'education-tools:lesson-progress:v1' }
const oldQuiz = JSON.stringify({ answers: { q1: 'a', q2: 'b' }, bestScore: 5, lastScore: 5 })
const oldDrafts = { 'question-1': 'Earlier array answer', 'question-2': 'Earlier list answer' }
const frame = () => s.ev('new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))')
const click = async selector => { await s.click(selector); await frame() }
const storage = key => s.ev(`localStorage.getItem(${JSON.stringify(key)})`)
const legacy = async () => {
  assert.equal(await storage(keys.old), oldQuiz)
  const drafts = JSON.parse(await storage(keys.drafts))
  for (const [id, text] of Object.entries(oldDrafts)) assert.equal(drafts[id], text)
}
const current = async () => Number((await s.text('[data-role=slide-status]')).match(/Slide (\d+)/)[1])
const goto = async id => {
  const target = slideIds.indexOf(id) + 1
  assert.ok(target > 0)
  while (await current() !== target) await click(`[data-action=${await current() < target ? 'next-slide' : 'prev-slide'}]`)
}
const fit = async (label, capture = false) => {
  const box = await s.ev(`(()=>{const e=document.getElementById(location.hash.slice(1));return {id:e.id,w:e.clientWidth,sw:e.scrollWidth,h:e.clientHeight,sh:e.scrollHeight}})()`)
  report.push({ label, ...box })
  if (box.sw > box.w + 2 || (box.id !== 'quiz' && box.sh > box.h + 2)) failures.push({ label, ...box })
  if (capture) await s.screenshot(label)
  return box.id
}
const pageWidth = async label => {
  const overflow = await s.ev('document.documentElement.scrollWidth-innerWidth')
  if (overflow > 1) failures.push({ label, overflow })
}
const values = () => s.ev('[...document.querySelectorAll("[data-array-value]")].map(e=>Number(e.textContent))')
const quiz = async count => s.ev(`(()=>{
  [...document.querySelectorAll('[data-question]')].forEach((q,i)=>[...q.querySelectorAll('input')].find(e=>i<${count}?e.value===q.dataset.answer:e.value!==q.dataset.answer).click());
  document.querySelector('#lesson-quiz').requestSubmit();
})()`)

try {
  await s.send('Runtime.enable'); await s.send('Log.enable'); await s.send('Page.enable')
  await s.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
  await s.send('Emulation.setDeviceMetricsOverride', { width: 1366, height: 768, deviceScaleFactor: 1, mobile: false })
  await s.load()
  await s.ev(`(()=>{
    localStorage.removeItem('education-tools:arrays-lists-and-data-types-teacher-mode');
    localStorage.removeItem(${JSON.stringify(keys.quiz)});
    localStorage.setItem(${JSON.stringify(keys.old)},${JSON.stringify(oldQuiz)});
    localStorage.setItem(${JSON.stringify(keys.drafts)},${JSON.stringify(JSON.stringify(oldDrafts))});
    const p=JSON.parse(localStorage.getItem(${JSON.stringify(keys.progress)})||'{}');
    p['arrays-lists-and-data-types']={quizVersion:1,totalQuestions:5,correct:5,answered:5,checked:true,passed:true};
    localStorage.setItem(${JSON.stringify(keys.progress)},JSON.stringify(p));
  })()`)
  await s.load()
  assert.equal(await s.ev('document.querySelectorAll("[data-question]").length'), 10)
  assert.equal(await s.ev('document.querySelectorAll("[data-question] input:checked").length'), 0)
  assert.deepEqual(await s.ev('[...document.querySelectorAll("[data-exam-response]")].map(e=>e.dataset.examResponse)'), ['hourly-array-v2', 'growing-results-v2', 'linked-insertion-v2'])
  assert.ok(await s.ev('[...document.querySelectorAll("[data-exam-response]")].every(e=>e.value==="")'))
  assert.deepEqual(await s.ev('(()=>{const ids=[...document.querySelectorAll("[id]")].map(e=>e.id);return ids.filter((id,i)=>ids.indexOf(id)!==i)})()'), [])
  assert.deepEqual(await s.ev('[...document.querySelectorAll(\'a[href^="#"]\')].map(e=>e.getAttribute("href").slice(1)).filter(id=>id&&!document.getElementById(id))'), [])
  assert.deepEqual(await s.ev(`(async()=>{
    const urls=[...document.querySelectorAll('link[rel=stylesheet][href],script[src]')].map(e=>e.href||e.src);
    return (await Promise.all(urls.map(async url=>({url,status:(await fetch(url)).status})))).filter(r=>r.status!==200);
  })()`), [])
  await legacy()
  for (const correct of [7, 8, 10]) {
    await quiz(correct)
    const progress = JSON.parse(await storage(keys.progress))['arrays-lists-and-data-types']
    assert.equal(progress.quizVersion, 2); assert.equal(progress.totalQuestions, 10)
    assert.equal(progress.correct, correct); assert.equal(progress.passed, correct >= 8)
  }
  await s.ev(`document.querySelectorAll('[data-exam-response]').forEach((e,i)=>{e.value='New response '+i;e.dispatchEvent(new Event('input',{bubbles:true}))})`)
  await s.load()
  assert.equal(await s.ev('document.querySelectorAll("[data-question] input:checked").length'), 10)
  assert.ok(await s.ev('[...document.querySelectorAll("[data-exam-response]")].every(e=>e.value.startsWith("New response"))'))
  await legacy(); await click('[data-action=reset-quiz]')
  assert.equal(await s.ev('document.querySelectorAll("[data-question] input:checked").length'), 0)
  await legacy(); await quiz(10)

  await click('[data-action=toggle-teacher-mode]')
  assert.match(await s.text('[data-role=slide-status]'), /of 21/)
  for (const height of [768, 900]) {
    await s.send('Emulation.setDeviceMetricsOverride', { width: 1366, height, deviceScaleFactor: 1, mobile: false })
    while (await current() > 1) await click('[data-action=prev-slide]')
    for (let i = 1; i <= 21; i++) {
      const id = await fit(`slide-${i}-${height}`, height === 768)
      if (height === 768) slideIds.push(id)
      if (i < 21) await click('[data-action=next-slide]')
    }
  }
  await s.send('Emulation.setDeviceMetricsOverride', { width: 1366, height: 768, deviceScaleFactor: 1, mobile: false })
  for (const id of ['list', 'dynamic-list', 'linked-list', 'insertion']) {
    await goto(id)
    for (let step = 1; step <= 3; step++) {
      assert.equal(await s.ev(`document.querySelectorAll('#${id} [data-walkthrough-step]:not([hidden])').length`), 1)
      await fit(`${id}-step-${step}`, true)
      await click(`#${id} [data-walkthrough-next]`)
      assert.equal(await s.ev('location.hash'), '#' + id)
    }
    assert.equal(await s.ev(`document.querySelector('#${id} [data-walkthrough-next]').getAttribute('aria-disabled')`), 'true')
    await click(`#${id} [data-walkthrough-prev]`)
    assert.match(await s.text(`#${id} [data-walkthrough-status]`), /Step 2 of 3/)
    await click(`#${id} [data-walkthrough-reset]`)
    assert.match(await s.text(`#${id} [data-walkthrough-status]`), /Step 1 of 3/)
  }
  await goto('array-explorer')
  assert.deepEqual(await values(), [3, 8, 2, 12, 5, 4])
  for (let index = 0; index < 6; index++) {
    await click(`[data-array-index="${index}"]`)
    assert.equal(await s.ev('document.querySelectorAll("[data-array-index][aria-pressed=true]").length'), 1)
    assert.match(await s.text('[data-array-output]'), new RegExp(`\\[${index}\\]`))
    assert.equal(await s.text('[data-array-selected]'), String(index))
  }
  await click('[data-array-index="3"]')
  await s.input('[data-array-input]', '17', 'input')
  // Enter belongs to the form and must not advance Teacher Slides.
  await s.send('Page.bringToFront'); await s.ev('document.querySelector("[data-array-input]").focus()')
  await s.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, text: '\r' })
  await s.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 })
  await frame()
  assert.deepEqual(await values(), [3, 8, 2, 17, 5, 4])
  assert.equal(await s.ev('location.hash'), '#array-explorer')
  assert.match(await s.text('[data-array-status]'), /still contains 6/)
  for (const bad of ['', '-1', '2.5', '10000', '<img>']) {
    await s.input('[data-array-input]', bad, 'input'); await click('[data-array-controls] [type=submit]')
    assert.deepEqual(await values(), [3, 8, 2, 17, 5, 4])
    assert.match(await s.text('[data-array-status]'), /whole-number/)
  }
  for (const count of ['0', '9999']) {
    await s.input('[data-array-input]', count, 'input'); await click('[data-array-controls] [type=submit]')
    assert.equal((await values())[3], Number(count)); await fit('array-count-' + count, true)
  }
  await click('[data-array-restore]'); assert.deepEqual(await values(), [3, 8, 2, 12, 5, 4])
  await goto('mistakes')
  for (let i = 1; i <= 4; i++) {
    await click(`.al-check:nth-child(${i}) summary`); await fit('mistake-' + i)
    await click(`.al-check:nth-child(${i}) summary`)
  }
  await click('[data-action=exit-teacher-mode]')
  for (const width of [390, 320]) {
    await s.send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: true })
    await frame(); await pageWidth('mobile-' + width)
    for (const id of ['array-explorer', 'typed-collections', 'list', 'dynamic-list', 'linked-list', 'insertion', 'compare']) {
      await s.ev(`document.getElementById('${id}').scrollIntoView()`); await s.screenshot(`${id}-mobile-${width}`)
    }
    for (const id of ['list', 'dynamic-list', 'linked-list', 'insertion']) {
      for (let step = 1; step <= 3; step++) {
        await pageWidth(`${id}-${step}-mobile-${width}`)
        await click(`#${id} [data-walkthrough-next]`)
      }
      await click(`#${id} [data-walkthrough-reset]`)
    }
  }
  await s.load(); assert.deepEqual(await values(), [3, 8, 2, 12, 5, 4]); await legacy()
  await s.send('Emulation.setScriptExecutionDisabled', { value: true }); await s.load(path, 'true')
  assert.equal(await s.ev('document.querySelectorAll("[data-walkthrough-step]").length'), 12)
  assert.ok(await s.ev('[...document.querySelectorAll("[data-walkthrough-step]")].every(e=>!e.hidden)'))
  assert.ok(await s.ev('[...document.querySelectorAll("[data-walkthrough-controls],[data-array-controls]")].every(e=>e.hidden)'))
  assert.deepEqual(await values(), [3, 8, 2, 12, 5, 4]); await pageWidth('no-js-320')
  await s.send('Emulation.setScriptExecutionDisabled', { value: false })

  // Verify only the new raw quiz is counted if the aggregate summary is absent.
  // Temporarily stash unrelated stack state in this isolated test profile.
  const stackKey = 'education-tools:lesson-stacks-and-queues-quiz-v2'
  const stackSave = await storage(stackKey)
  const progressSave = await storage(keys.progress)
  try {
    await s.ev(`localStorage.removeItem(${JSON.stringify(keys.progress)});localStorage.removeItem(${JSON.stringify(stackKey)})`)
    await s.load('/pages/units/btec-level-3-unit-2.html', 'document.querySelector("[data-topic-progress=D1]").textContent.includes("correct")')
    assert.match(await s.text('[data-topic-progress=D1]'), /10\/20 correct/)
    await s.ev(`localStorage.removeItem(${JSON.stringify(keys.quiz)})`)
    await s.load('/pages/units/btec-level-3-unit-2.html', 'document.querySelector("[data-topic-progress=D1]").textContent.includes("correct")')
    assert.match(await s.text('[data-topic-progress=D1]'), /0\/20 correct/)
    await legacy()
  } finally {
    if (stackSave !== null) await s.ev(`localStorage.setItem(${JSON.stringify(stackKey)},${JSON.stringify(stackSave)})`)
    if (progressSave !== null) await s.ev(`localStorage.setItem(${JSON.stringify(keys.progress)},${JSON.stringify(progressSave)})`)
  }
  assert.deepEqual(s.errors.filter(e => !e.includes('favicon.ico')), [])
} finally {
  mkdirSync(process.env.FLEXBOX_SCREENSHOTS, { recursive: true })
  writeFileSync(`${process.env.FLEXBOX_SCREENSHOTS}/layout.json`, JSON.stringify({ report, failures }, null, 2))
  await s.close()
}
assert.deepEqual(failures, [], 'Teacher Slides or mobile overflow')
console.log('PASS: 21 slides, 12 sequence states, array operations, mobile/static fallback, quiz and draft migration, D1 total20.')
