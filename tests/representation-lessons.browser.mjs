// Use an isolated profile: this test replaces storage on its local test origin.
// Local setup and results: docs/text_and_image_representation_improvement_plan.md.
import assert from 'node:assert/strict'
import { mkdirSync, writeFileSync } from 'node:fs'
import { createBrowserSession } from './helpers/browser-session.mjs'

process.env.FLEXBOX_TEST_ORIGIN ||= 'http://127.0.0.1:8765'
process.env.FLEXBOX_CDP_ORIGIN ||= 'http://127.0.0.1:9229'
process.env.FLEXBOX_SCREENSHOTS ||= '.raid-checks/representation'
const lessons = [
  { id: 'character-sets-ascii-and-unicode', total: 8, exams: 3, version: 4, retiredDrafts: {'exam-practice-v3':'Earlier codebook answer.','exam-storage-v3':'Earlier byte-count answer.'} },
  { id: 'bitmap-image-storage', total: 10, exams: 3, version: 4, retiredDrafts: {'decode-v3':'Earlier pixel-decoding answer.','interpretation-v3':'Earlier reconstruction explanation.','allocation-v3':'Earlier calculation answer.','representation-v3':'Earlier representation choice.'} },
  { id: 'resolution-bit-depth-and-image-compression', total: 12, exams: 5, version: 3 },
].filter(lesson => !process.env.REP_LESSONS || process.env.REP_LESSONS.split(',').includes(lesson.id))
const report = []
const failures = []
const ready = 'document.querySelector("[data-teacher-opener-slide]") && document.querySelector("[data-role=lesson-sequence]").children.length > 0'
for (const lesson of lessons) {
  const s = await createBrowserSession({ lessonPath: `/pages/topics/${lesson.id}.html`, readyExpression: ready })
  const frame = () => s.ev('new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))')
  const click = async selector => { await s.click(selector); await frame() }
  try {
    await s.send('Runtime.enable'); await s.send('Log.enable'); await s.send('Page.enable')
    await s.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
    await s.send('Emulation.setDeviceMetricsOverride', { width: 1366, height: 768, deviceScaleFactor: 1, mobile: false })
    await s.load()
    // Exercise the old-answer migration using real localStorage and real reloads.
    await s.ev(`(() => {
      localStorage.removeItem('education-tools:${lesson.id}-teacher-mode');
      localStorage.removeItem('education-tools:lesson-${lesson.id}-quiz-v${lesson.version}');
      const progress = JSON.parse(localStorage.getItem('education-tools:lesson-progress:v1') || '{}');
      delete progress[${JSON.stringify(lesson.id)}];
      localStorage.setItem('education-tools:lesson-progress:v1', JSON.stringify(progress));
      localStorage.setItem('education-tools:lesson-${lesson.id}-quiz', JSON.stringify({answers:{q1:'a',q2:'a',q3:'a',q4:'a',q5:'a'},lastScore:5}));
      if (${lesson.version} === 4) localStorage.setItem('education-tools:lesson-${lesson.id}-quiz-v3', JSON.stringify({answers:{q1:'0',q2:'0',q3:'0'},lastScore:10,bestScore:10}));
      const drafts={'retired-prompt':'Earlier saved work must survive the new lesson.'};
      Object.assign(drafts,${JSON.stringify(lesson.retiredDrafts ?? {})});
      localStorage.setItem('education-tools:lesson-${lesson.id}-exam-practice', JSON.stringify(drafts));
    })()`)
    await s.load()
    assert.equal(await s.ev('document.querySelectorAll("[data-question]").length'), lesson.total)
    assert.equal(await s.ev('document.querySelectorAll("[data-exam-response]").length'), lesson.exams)
    assert.equal(await s.ev('document.querySelector("[data-exam-response]").value'), '', 'A retired prompt must not restore under the replacement question')
    assert.equal(await s.ev('document.querySelectorAll("[data-question] input:checked").length'), 0, 'Old quiz must not restore as current')
    assert.deepEqual(await s.ev(`(() => {const ids=[...document.querySelectorAll('[id]')].map(e=>e.id);return ids.filter((id,i)=>ids.indexOf(id)!==i)})()`), [])
    assert.deepEqual(await s.ev(`[...document.querySelectorAll('a[href^="#"]')].map(e=>e.getAttribute('href').slice(1)).filter(id=>id&&!document.getElementById(id))`), [])
    await s.ev('Promise.all([...document.images].map(i=>{i.loading="eager";return i.decode()}))')
    await s.ev(`for(const q of document.querySelectorAll('[data-question]'))q.querySelector('input[value="'+q.dataset.answer+'"]').click();document.querySelector('#lesson-quiz').requestSubmit();const r=document.querySelector('[data-exam-response]');r.value='A saved explanation linking the representation to the example.';r.dispatchEvent(new Event('input',{bubbles:true}));`)
    assert.match(await s.text('[data-role=quiz-result]'), new RegExp(String(lesson.total)))
    await s.load()
    assert.equal(await s.ev('document.querySelectorAll("[data-question] input:checked").length'), lesson.total)
    assert.match(await s.ev('document.querySelector("[data-exam-response]").value'), /saved explanation/)
    assert.equal(await s.ev(`JSON.parse(localStorage.getItem('education-tools:lesson-${lesson.id}-exam-practice'))['retired-prompt']`), 'Earlier saved work must survive the new lesson.')
    for (const [key, value] of Object.entries(lesson.retiredDrafts ?? {})) {
      assert.equal(await s.ev(`JSON.parse(localStorage.getItem('education-tools:lesson-${lesson.id}-exam-practice'))[${JSON.stringify(key)}]`), value)
    }
    const progress = await s.ev(`JSON.parse(localStorage.getItem('education-tools:lesson-progress:v1'))[${JSON.stringify(lesson.id)}]`)
    assert.equal(progress.quizVersion, lesson.version); assert.equal(progress.correct, lesson.total)
    assert.equal(await s.ev(`JSON.parse(localStorage.getItem('education-tools:lesson-${lesson.id}-quiz')).lastScore`), 5)
    if (lesson.version === 4) assert.equal(await s.ev(`JSON.parse(localStorage.getItem('education-tools:lesson-${lesson.id}-quiz-v3')).lastScore`), 10)
    await click('[data-action=reset-quiz]')
    assert.equal(await s.ev('document.querySelectorAll("[data-question] input:checked").length'), 0)
    // Finish the new quiz again so the unit hub can be checked across all three pages.
    await s.ev(`for(const q of document.querySelectorAll('[data-question]'))q.querySelector('input[value="'+q.dataset.answer+'"]').click();document.querySelector('#lesson-quiz').requestSubmit();`)
    await click('[data-action=toggle-teacher-mode]')
    const totalSlides = Number((await s.text('[data-role=slide-status]')).match(/of (\d+)/)[1])
    for (const height of [768, 900]) {
      await s.send('Emulation.setDeviceMetricsOverride', { width: 1366, height, deviceScaleFactor: 1, mobile: false })
      for (let i=1;i<totalSlides;i++) await click('[data-action=prev-slide]')
      for (let index=1;index<=totalSlides;index++) {
        await frame()
        const box = await s.ev(`(() => {
          const el=document.getElementById(decodeURIComponent(location.hash.slice(1)));
          return {id:el.id,title:el.querySelector('h2')?.textContent,h:el.clientHeight,sh:el.scrollHeight,w:el.clientWidth,sw:el.scrollWidth};
        })()`)
        report.push({ lesson: lesson.id, index, height, ...box })
        if (box.sw > box.w + 2) failures.push(`${lesson.id} ${height}px slide ${index} ${box.id}: horizontal overflow ${box.sw}/${box.w}`)
        if (box.id !== 'quiz' && box.sh > box.h + 2) failures.push(`${lesson.id} ${height}px slide ${index} ${box.id}: vertical overflow ${box.sh}/${box.h}`)
        if (height === 768) await s.screenshot(`${lesson.id}-${String(index).padStart(2,'0')}`)
        if (index<totalSlides) await click('[data-action=next-slide]')
      }
    }
    await click('[data-action=exit-teacher-mode]')
    for (const width of [390, 320]) {
      await s.send('Emulation.setDeviceMetricsOverride', { width, height: 844, deviceScaleFactor: 1, mobile: true })
      await frame()
      const overflow = await s.ev('document.documentElement.scrollWidth-innerWidth')
      if (overflow > 1) failures.push(`${lesson.id} ${width}px student view: ${overflow}px horizontal overflow`)
      await s.ev('scrollTo(0,0)'); await s.screenshot(`${lesson.id}-mobile-${width}`)
    }
    await s.send('Emulation.setScriptExecutionDisabled', { value: true })
    await s.load(`/pages/topics/${lesson.id}.html`, 'true')
    assert.ok(await s.ev('[...document.querySelectorAll("[data-walkthrough-step]")].every(e=>!e.hidden)'), 'All static stages readable without JS')
    assert.ok(await s.ev('[...document.querySelectorAll("[data-teacher-only]")].every(e=>getComputedStyle(e).display==="none")'))
    if (await s.ev('document.documentElement.scrollWidth>innerWidth+1')) failures.push(`${lesson.id}: no-JS mobile overflow`)
    assert.deepEqual(s.errors.filter(e=>!e.includes('favicon.ico')), [])
    console.log(`PASS ${lesson.id}: ${totalSlides} slides, quiz ${lesson.total}/${lesson.total}, saved drafts, old saves isolated, assets and static fallback`)
  } finally { await s.close() }
}
if (lessons.length === 3) {
  const s = await createBrowserSession({lessonPath:'/pages/units/btec-level-3-unit-2.html',readyExpression:'document.querySelector("[data-topic-progress=C3]").textContent.includes("correct")'})
  try {
    await s.send('Page.enable'); await s.load()
    assert.match(await s.text('[data-topic-progress=C2]'), /8\/8 correct/)
    assert.match(await s.text('[data-topic-progress=C3]'), /22\/22 correct/)
    // Missing aggregate summaries use the new raw keys, never the old 5-question answers.
    await s.ev(`(() => {
      const lessons=${JSON.stringify(lessons)};
      const progress=JSON.parse(localStorage.getItem('education-tools:lesson-progress:v1')||'{}');
      for(const lesson of lessons){delete progress[lesson.id];localStorage.removeItem('education-tools:lesson-'+lesson.id+'-quiz-v'+lesson.version)}
      localStorage.setItem('education-tools:lesson-progress:v1',JSON.stringify(progress));
    })()`)
    await s.load()
    assert.match(await s.text('[data-topic-progress=C2]'), /0\/8 correct/)
    assert.match(await s.text('[data-topic-progress=C3]'), /0\/22 correct/)
    console.log('PASS Unit 2: new aggregate totals and old-score fallback isolation')
  } finally { await s.close() }
}
mkdirSync(process.env.FLEXBOX_SCREENSHOTS,{recursive:true})
writeFileSync(`${process.env.FLEXBOX_SCREENSHOTS}/layout.json`, JSON.stringify({report,failures},null,2))
assert.deepEqual(failures, [], 'Classroom and mobile layout issues')
console.log('PASS: classroom layouts at 1366x768/900 and student layouts at 390/320px')
