// Use an isolated browser profile; setup and origin overrides: docs/testing.md.
import assert from 'node:assert/strict'
import { createBrowserSession } from './helpers/browser-session.mjs'

const lessonPath = '/pages/topics/units-of-digital-data.html?context=btec-level-3-unit-2'
const s = await createBrowserSession({
  lessonPath,
  readyExpression: 'document.querySelectorAll(".practice-task-card").length === 12',
})
const store = key => s.ev(`JSON.parse(localStorage.getItem('education-tools:${key}'))`)
const frame = () => s.ev('new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))')
const answerQuiz = () => s.ev(`for (const q of document.querySelectorAll('[data-question]')) q.querySelector('input[value="'+q.dataset.answer+'"]').click(); document.querySelector('#lesson-quiz').requestSubmit()`)
const slideBox = () => s.ev(`(() => {
  const e = document.getElementById(location.hash.slice(1));
  return { id:e.id, width:e.clientWidth, scrollWidth:e.scrollWidth, height:e.clientHeight, scrollHeight:e.scrollHeight };
})()`)
const checkFit = async label => {
  await frame()
  const box = await slideBox()
  assert.ok(box.scrollWidth <= box.width + 2, `${label}: horizontal overflow in ${box.id}`)
  if (box.id !== 'quiz') assert.ok(box.scrollHeight <= box.height + 2, `${label}: vertical overflow in ${box.id}`)
}

try {
  await s.send('Page.enable')
  await s.send('Runtime.enable')
  await s.send('Log.enable')
  await s.send('Emulation.setDeviceMetricsOverride', { width:1366, height:768, deviceScaleFactor:1, mobile:false })
  await s.send('Emulation.setEmulatedMedia', { features:[{ name:'prefers-reduced-motion', value:'reduce' }] })
  await s.load()
  await s.ev(`localStorage.clear();
    for (const suffix of ['', '-v4', '-v5']) {
      localStorage.setItem('education-tools:lesson-units-of-digital-data-quiz'+suffix, JSON.stringify({answers:{q1:'a'},lastScore:5,bestScore:5}));
    }
    localStorage.setItem('education-tools:lesson-progress:v1', JSON.stringify({'units-of-digital-data':{quizVersion:5,correct:5,answered:5,checked:true}}));
    localStorage.setItem('education-tools:lesson-units-of-digital-data-exam-practice', JSON.stringify({'question-1':'Original explanation','question-4-byte-prefix-v2':'Retired calculation'}));
    localStorage.setItem('education-tools:lesson-units-of-digital-data-practice', JSON.stringify({tasks:{1:{inputValue:'2',status:'correct',message:'Saved correct answer'}}}));`)
  await s.load('/pages/units/btec-level-3-unit-2.html', 'document.querySelector("[data-quiz-state]")')
  assert.equal(await s.ev(`document.querySelector('a[href*="topics/units-of-digital-data.html"]').closest('.lesson-item').dataset.quizState`), 'stale')
  await s.load()
  assert.equal(await s.ev('document.querySelectorAll("[data-question] input:checked").length'), 0)
  assert.equal(await s.ev('document.querySelector("[data-exam-response]").value'), '')
  assert.equal(await s.ev('document.querySelector("#practice-task-1").value'), '2')
  assert.match(await s.text('[data-role=practice-progress]'), /1 \/ 12/)
  assert.deepEqual(await s.ev(`(() => {const ids=[...document.querySelectorAll('[id]')].map(e=>e.id);return ids.filter((id,i)=>ids.indexOf(id)!==i)})()`), [])
  assert.deepEqual(await s.ev(`[...document.querySelectorAll('a[href^="#"]')].map(e=>e.hash.slice(1)).filter(id=>id&&!document.getElementById(id))`), [])
  await s.ev('Promise.all([...document.images].map(image => image.decode()))')

  // A correct final time does not pass if the intermediate rate is wrong.
  await s.input('[data-rate-answer]', '40', 'input')
  await s.input('[data-time-answer]', '120', 'input')
  await s.ev('document.querySelector("[data-transfer-task]").requestSubmit()')
  assert.match(await s.text('.du-task-feedback'), /Try again/)
  await s.input('[data-rate-answer]', '5', 'input')
  assert.equal(await s.text('.du-task-feedback'), '')
  await s.ev('document.querySelector("[data-transfer-task]").requestSubmit()')
  assert.match(await s.text('.du-task-feedback'), /Correct.*5 MB\/s.*120 seconds/)
  await s.ev(`for (const [index, [rate, seconds]] of [[5,120],[15,100],[25,36],[6,60]].entries()) {
    const form=document.querySelectorAll('[data-transfer-task]')[index];
    for (const [selector,value] of [['[data-rate-answer]',rate],['[data-time-answer]',seconds]]) {
      const input=form.querySelector(selector); input.value=value; input.dispatchEvent(new Event('input',{bubbles:true}));
    }
    form.requestSubmit();
  }`)
  assert.equal(await s.ev('document.querySelectorAll("[data-transfer-task].is-correct").length'), 4)
  await answerQuiz()
  assert.match(await s.text('[data-role=quiz-result]'), /8\/8/)
  await s.load()
  assert.equal(await s.ev('document.querySelectorAll("[data-question] input:checked").length'), 8)
  assert.equal(await s.ev('document.querySelector("[data-rate-answer]").value'), '5')
  assert.equal(await s.ev('document.querySelector("[data-time-answer]").value'), '120')
  const drafts = await store('lesson-units-of-digital-data-exam-practice')
  assert.equal(drafts['question-1'], 'Original explanation')
  assert.equal(drafts['question-4-byte-prefix-v2'], 'Retired calculation')
  assert.equal(drafts['transfer-4-seconds-v1'], '60')
  for (const suffix of ['', '-v4', '-v5']) assert.equal((await store('lesson-units-of-digital-data-quiz'+suffix)).lastScore, 5)
  const progress = (await store('lesson-progress:v1'))['units-of-digital-data']
  assert.equal(progress.quizVersion, 6)
  assert.equal(progress.totalQuestions, 8)
  assert.equal(progress.correct, 8)
  await s.click('[data-action=reset-quiz]')
  assert.equal(await store('lesson-units-of-digital-data-quiz-v6'), null)
  assert.equal((await store('lesson-units-of-digital-data-exam-practice'))['transfer-1-rate-v1'], '5')
  await answerQuiz()
  await s.click('[data-action=reset-practice]')
  assert.equal(await store('lesson-units-of-digital-data-practice'), null)
  assert.equal((await store('lesson-units-of-digital-data-quiz-v6')).lastScore, 8)
  assert.equal((await store('lesson-units-of-digital-data-exam-practice'))['question-1'], 'Original explanation')
  await s.input('#practice-task-2', '3000', 'input')
  await s.ev(`document.querySelector('form[data-task-id="2"]').requestSubmit()`)
  assert.match(await s.text('[data-role=practice-progress]'), /1 \/ 12/)
  await s.load()
  assert.equal(await s.ev('document.querySelector("#practice-task-2").value'), '3000')

  await s.load('/pages/units/btec-level-3-unit-2.html', 'document.querySelector("[data-quiz-state]")')
  assert.match(await s.ev(`document.querySelector('a[href*="topics/units-of-digital-data.html"]').closest('.lesson-item').querySelector('[data-role=lesson-progress]').title`), /8\/8/)
  await s.load(lessonPath+'#bits-to-bytes')
  assert.equal(await s.ev('location.hash'), '#same-prefix')
  await s.load(lessonPath+'#bits-and-bytes')
  await s.click('[data-action=toggle-teacher-mode]')
  assert.match(await s.text('[data-role=slide-status]'), /1 of 12/)
  for (const [width,height] of [[1366,768],[1920,1080]]) {
    await s.send('Emulation.setDeviceMetricsOverride', {width,height,deviceScaleFactor:1,mobile:false})
    for (let i=0;i<12;i++) await s.click('[data-action=prev-slide]')
    for (let i=1;i<=12;i++) {
      await checkFit(`${width}×${height} slide ${i}`)
      if (width===1366) await s.screenshot(`units-${String(i).padStart(2,'0')}`)
      if (i<12) await s.click('[data-action=next-slide]')
    }
  }
  await s.send('Emulation.setDeviceMetricsOverride', {width:1366,height:768,deviceScaleFactor:1,mobile:false})
  for (let i=0;i<12;i++) await s.click('[data-action=prev-slide]')
  await s.send('Input.dispatchKeyEvent', {type:'keyDown',key:'ArrowRight',code:'ArrowRight',windowsVirtualKeyCode:39})
  await s.send('Input.dispatchKeyEvent', {type:'keyUp',key:'ArrowRight',code:'ArrowRight',windowsVirtualKeyCode:39})
  assert.equal(await s.ev('location.hash'), '#bit-patterns')
  for (let i=0;i<3;i++) await s.click('[data-pattern-next]')
  assert.match(await s.text('[data-pattern-label]'), /8 bits.*256/)
  assert.equal(await s.ev('location.hash'), '#bit-patterns', 'Tool clicks must not advance the slide')
  await checkFit('Eight-bit pattern state')
  await s.click('[data-pattern-reset]')
  assert.match(await s.text('[data-pattern-label]'), /1 bit.*2 possible/)
  for (let i=0;i<4;i++) await s.click('[data-action=next-slide]')
  assert.equal(await s.ev('location.hash'), '#conversion-stepper')
  await s.ev('document.querySelector(".du-convert-form").requestSubmit()')
  while (!await s.ev('document.querySelector("[data-convert-action=step]").disabled')) {
    await checkFit('Conversion stepper')
    await s.click('[data-convert-action=step]')
  }
  assert.match(await s.text('[data-convert-expression]'), /4 GiB/)
  await checkFit('Stepper result')
  await s.screenshot('units-stepper-result')
  await s.input('[data-convert-base]', '1000', 'input')
  await s.input('[data-convert-from]', 'TB', 'input')
  await s.input('[data-convert-to]', 'B', 'input')
  await s.input('[data-convert-value]', '1', 'input')
  await s.ev('document.querySelector(".du-convert-form").requestSubmit()')
  while (!await s.ev('document.querySelector("[data-convert-action=step]").disabled')) {
    await checkFit('Four-step decimal conversion')
    await s.click('[data-convert-action=step]')
  }
  assert.match(await s.text('[data-convert-expression]'), /1,000,000,000,000 B/)
  await checkFit('Four-step result and shortcut')
  await s.click('[data-convert-action=reset]')
  assert.equal(await s.ev('document.querySelector("[data-convert-board]").hidden'), true)
  assert.equal((await store('lesson-units-of-digital-data-exam-practice'))['transfer-1-seconds-v1'], '120')
  await s.click('[data-action=next-slide]')
  assert.equal(await s.ev(`[...document.querySelectorAll('.practice-task-card')].filter(e=>e.getBoundingClientRect().height>0).length`), 12)
  await s.click('[data-action=exit-teacher-mode]')

  for (const width of [390,320]) {
    await s.send('Emulation.setDeviceMetricsOverride', {width,height:844,deviceScaleFactor:1,mobile:true})
    await s.load(); await frame()
    assert.ok(await s.ev('document.documentElement.scrollWidth <= innerWidth+2'), `${width}px student width`)
    await s.ev('document.querySelector("#two-systems").scrollIntoView()')
    await s.screenshot(`units-mobile-${width}`)
  }
  await s.send('Emulation.setScriptExecutionDisabled', {value:true})
  await s.send('Page.navigate', {url:s.origin+lessonPath})
  await s.waitFor('document.readyState === "complete"')
  assert.equal(await s.ev('document.querySelectorAll(".practice-task-card").length'), 0)
  assert.equal(await s.ev('document.querySelectorAll(".du-static-tasks li").length'), 12)
  assert.equal(await s.ev('document.querySelectorAll("#transfer-time .du-transfer-steps li").length'), 2)
  assert.equal(await s.ev('document.querySelectorAll("#transfer-time details").length'), 0)
  assert.deepEqual(s.errors.filter(error => !error.includes('favicon.ico')), [])
  console.log('Units lesson: scoring, task feedback, persistence, reset isolation, legacy drafts, unit progress, navigation, reduced-motion controls, slide fit, mobile layout and static content passed.')
} finally {
  await s.send('Emulation.setScriptExecutionDisabled', {value:false})
  await s.close()
}
