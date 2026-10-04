// Run against an isolated local profile: this check seeds this lesson's saved work.
import assert from 'node:assert/strict'
import { mkdirSync, writeFileSync } from 'node:fs'
import { createBrowserSession } from './helpers/browser-session.mjs'

process.env.FLEXBOX_TEST_ORIGIN ||= 'http://127.0.0.1:8765'
process.env.FLEXBOX_CDP_ORIGIN ||= 'http://127.0.0.1:9229'
process.env.FLEXBOX_SCREENSHOTS ||= '.raid-checks/stacks-and-queues'
const path = '/pages/topics/stacks-and-queues.html'
const ready = 'document.querySelector("[data-teacher-opener-slide]") && document.querySelectorAll("[data-sx-ready]").length === 2 && document.querySelectorAll("[data-walkthrough-ready]").length === 3'
const s = await createBrowserSession({ lessonPath: path, readyExpression: ready })
const report = []
const failures = []
const slideIds = []
const oldQuiz = JSON.stringify({ answers: { q1: 'a', q2: 'b', q3: 'a', q4: 'b', q5: 'a' }, lastScore: 5, bestScore: 5 })
const oldSimulator = JSON.stringify({ stack: ['saved stack'], queue: ['saved queue'], activeMode: 'queue' })
const oldDrafts = { 'question-1': 'Earlier stack answer must survive.', 'question-2': 'Earlier queue answer must survive.' }
const keys = {
  quiz: 'education-tools:lesson-stacks-and-queues-quiz-v2',
  oldQuiz: 'education-tools:lesson-stacks-and-queues-quiz',
  drafts: 'education-tools:stacks-and-queues-exam-practice',
  simulator: 'education-tools:lesson-stacks-and-queues-simulator',
  progress: 'education-tools:lesson-progress:v1',
}
const frame = () => s.ev('new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))')
const click = async selector => { await s.click(selector); await frame() }
const storage = key => s.ev(`localStorage.getItem(${JSON.stringify(key)})`)
const progress = async () => JSON.parse(await storage(keys.progress))['stacks-and-queues']
const checkLegacy = async () => {
  assert.equal(await storage(keys.oldQuiz), oldQuiz, 'Old raw quiz must remain byte-for-byte intact')
  assert.equal(await storage(keys.simulator), oldSimulator, 'Legacy simulator state must remain untouched')
  const drafts = JSON.parse(await storage(keys.drafts))
  for (const [id, value] of Object.entries(oldDrafts)) assert.equal(drafts[id], value, `Retired ${id} draft survives`)
}
const currentSlide = async () => Number((await s.text('[data-role=slide-status]')).match(/Slide (\d+)/)[1])
const goto = async id => {
  const target = slideIds.indexOf(id) + 1
  assert.ok(target > 0, `Known teaching slide: ${id}`)
  let current = await currentSlide()
  while (current !== target) {
    await click(`[data-action=${current < target ? 'next-slide' : 'prev-slide'}]`)
    current = await currentSlide()
  }
  assert.equal(await s.ev('location.hash'), `#${id}`)
}
const fit = async (label, capture = false) => {
  const box = await s.ev(`(() => {
    const e = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    return {id:e.id,title:e.querySelector('h2')?.textContent,h:e.clientHeight,sh:e.scrollHeight,w:e.clientWidth,sw:e.scrollWidth,height:innerHeight};
  })()`)
  report.push({ label, ...box })
  const errors = []
  if (box.sw > box.w + 2) errors.push(`${label} ${box.id}: horizontal overflow ${box.sw}/${box.w}`)
  if (box.id !== 'quiz' && box.sh > box.h + 2) errors.push(`${label} ${box.id}: vertical overflow ${box.sh}/${box.h}`)
  failures.push(...errors)
  if (capture || errors.length) await s.screenshot(label)
  return box
}
const checkPageWidth = async label => {
  const overflow = await s.ev('document.documentElement.scrollWidth-innerWidth')
  if (overflow > 1) {
    failures.push(`${label}: ${overflow}px page overflow`)
    await s.screenshot(label)
  }
}
const checkAnswers = async correct => {
  await s.ev(`(() => {const questions=[...document.querySelectorAll('[data-question]')];questions.forEach((q,index)=>{
    const answers=[...q.querySelectorAll('input')];
    answers.find(input=>index<${correct}?input.value===q.dataset.answer:input.value!==q.dataset.answer).click();
  });document.querySelector('#lesson-quiz').requestSubmit();})()`)
}
const explorerState = kind => s.ev(`(() => {
  const host=document.querySelector('[data-structure-explorer="${kind}"]');
  const slots=[...host.querySelectorAll('.sx-occupied')].sort((a,b)=>Number(a.dataset.sxSlot)-Number(b.dataset.sxSlot));
  return {items:slots.map(e=>e.querySelector('.sx-item').textContent), count:Number(host.querySelector('[data-sx-count]').textContent),
    returned:host.querySelector('[data-sx-result]').textContent,status:host.querySelector('[data-sx-status]').textContent,
    description:host.querySelector('[data-sx-diagram]').getAttribute('aria-label')};
})()`)

try {
  await s.send('Runtime.enable'); await s.send('Log.enable'); await s.send('Page.enable')
  await s.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
  await s.send('Emulation.setDeviceMetricsOverride', { width: 1366, height: 768, deviceScaleFactor: 1, mobile: false })
  await s.load()
  await s.ev(`(() => {
    localStorage.removeItem('education-tools:stacks-and-queues-teacher-mode');
    localStorage.removeItem(${JSON.stringify(keys.quiz)});
    const progress=JSON.parse(localStorage.getItem(${JSON.stringify(keys.progress)})||'{}');
    progress['stacks-and-queues']={quizVersion:1,totalQuestions:5,correct:5,answered:5,checked:true,passed:true};
    localStorage.setItem(${JSON.stringify(keys.progress)},JSON.stringify(progress));
    localStorage.setItem(${JSON.stringify(keys.oldQuiz)},${JSON.stringify(oldQuiz)});
    localStorage.setItem(${JSON.stringify(keys.simulator)},${JSON.stringify(oldSimulator)});
    localStorage.setItem(${JSON.stringify(keys.drafts)},${JSON.stringify(JSON.stringify(oldDrafts))});
  })()`)
  await s.load()
  assert.equal(await s.ev('document.querySelectorAll("[data-question]").length'), 10)
  assert.deepEqual(await s.ev('[...document.querySelectorAll("[data-exam-response]")].map(e=>e.dataset.examResponse)'), ['undo-stack-v2','call-stack-v2','scan-queue-v2'])
  assert.ok(await s.ev('[...document.querySelectorAll("[data-exam-response]")].every(e=>e.value==="")'), 'Old drafts do not populate new prompts')
  assert.equal(await s.ev('document.querySelectorAll("[data-question] input:checked").length'), 0, 'Old raw quiz does not populate v2')
  assert.deepEqual(await s.ev('(()=>{const ids=[...document.querySelectorAll("[id]")].map(e=>e.id);return ids.filter((id,i)=>ids.indexOf(id)!==i)})()'), [])
  assert.deepEqual(await s.ev('[...document.querySelectorAll(\'a[href^="#"]\')].map(e=>e.getAttribute("href").slice(1)).filter(id=>id&&!document.getElementById(id))'), [])
  assert.equal(await s.ev('document.querySelector("#simulation").closest("[data-lesson-section]").id'), 'stack-operations', 'Legacy simulator link reaches the new stack explorer')
  const brokenAssets = await s.ev(`(async()=>{
    const urls=[...document.querySelectorAll('link[rel=stylesheet][href],script[src],img[src]')].map(e=>e.href||e.src).filter(url=>new URL(url).origin===location.origin);
    const results=await Promise.all(urls.map(async url=>({url,status:(await fetch(url)).status})));
    await Promise.all([...document.images].map(image=>{image.loading='eager';return image.decode()}));
    return results.filter(result=>result.status!==200);
  })()`)
  assert.deepEqual(brokenAssets, [])
  await checkLegacy()
  for (const correct of [7,8,10]) {
    await checkAnswers(correct)
    const result=await progress()
    assert.equal(result.quizVersion,2); assert.equal(result.totalQuestions,10); assert.equal(result.correct,correct)
    assert.equal(result.passed,correct>=8,'Pass threshold is eight')
  }
  await s.ev(`document.querySelectorAll('[data-exam-response]').forEach((response,index)=>{
    response.value='New explanation '+(index+1)+' connects the structure rule to the scenario.';
    response.dispatchEvent(new Event('input',{bubbles:true}));
  })`)
  await s.load()
  assert.equal(await s.ev('document.querySelectorAll("[data-question] input:checked").length'),10)
  assert.ok(await s.ev('[...document.querySelectorAll("[data-exam-response]")].every(e=>e.value.startsWith("New explanation"))'))
  await checkLegacy()
  await click('[data-action=reset-quiz]')
  assert.equal(await s.ev('document.querySelectorAll("[data-question] input:checked").length'),0)
  await checkLegacy(); await checkAnswers(10)
  console.log('PASS assessment migration: v2 quiz10/pass8, new written drafts save, old quiz/drafts/simulator untouched.')

  await click('[data-action=toggle-teacher-mode]')
  const totalSlides=Number((await s.text('[data-role=slide-status]')).match(/of (\d+)/)[1])
  assert.equal(totalSlides,26)
  for (const height of [768,900]) {
    await s.send('Emulation.setDeviceMetricsOverride',{width:1366,height,deviceScaleFactor:1,mobile:false})
    while(await currentSlide()>1)await click('[data-action=prev-slide]')
    for(let index=1;index<=totalSlides;index++){
      const box=await fit(`slide-${String(index).padStart(2,'0')}-${height}`,height===768)
      if(height===768)slideIds.push(box.id)
      if(index<totalSlides)await click('[data-action=next-slide]')
    }
  }
  console.log(`Baseline slides checked: ${failures.length} layout failures.`,failures)

  await s.send('Emulation.setDeviceMetricsOverride',{width:1366,height:768,deviceScaleFactor:1,mobile:false})
  for(const id of ['undo','call-stack','file-scanning']){
    await goto(id)
    const prefix=`#${id} [data-lesson-walkthrough]`
    assert.equal(await s.ev(`document.querySelectorAll('${prefix} [data-walkthrough-step]').length`),5)
    await click(`${prefix} [data-walkthrough-reset]`)
    for(let step=1;step<=5;step++){
      assert.deepEqual(await s.ev(`[...document.querySelectorAll('${prefix} [data-walkthrough-step]')].filter(e=>!e.hidden).map(e=>e.dataset.exampleStep)`),[String(step)])
      assert.match(await s.text(`${prefix} [data-walkthrough-status]`),new RegExp(`Step ${step} of 5`))
      await fit(`${id}-step-${step}`,true)
      if(step<5)await click(`${prefix} [data-walkthrough-next]`)
    }
    await s.ev(`document.querySelector('${prefix} [data-walkthrough-next]').focus()`)
    await click(`${prefix} [data-walkthrough-next]`)
    assert.equal(await s.ev(`document.activeElement===document.querySelector('${prefix} [data-walkthrough-next]')`),true)
    assert.equal(await s.ev(`document.querySelector('${prefix} [data-walkthrough-next]').getAttribute('aria-disabled')`),'true')
    await click(`${prefix} [data-walkthrough-prev]`);assert.match(await s.text(`${prefix} [data-walkthrough-status]`),/Step 4 of 5/)
    await click(`${prefix} [data-walkthrough-reset]`);assert.match(await s.text(`${prefix} [data-walkthrough-status]`),/Step 1 of 5/)
  }

  for(const kind of ['stack','queue']){
    const id=`${kind}-operations`,prefix=`[data-structure-explorer="${kind}"]`
    const add=kind==='stack'?'push':'enqueue',remove=kind==='stack'?'pop':'dequeue'
    const act=operation=>click(`${prefix} [data-sx-operation="${operation}"]`)
    await goto(id);await act('reset')
    assert.ok(await s.ev(`[...document.querySelectorAll('${prefix} button')].every(e=>e.getBoundingClientRect().height>=44&&e.getBoundingClientRect().width>=44)`))
    assert.deepEqual((await explorerState(kind)).items,['A','B','C'])
    await s.ev(`document.querySelector('${prefix} [data-sx-operation=peek]').focus()`)
    await act('peek')
    let current=await explorerState(kind)
    assert.equal(current.returned,kind==='stack'?'C':'A');assert.deepEqual(current.items,['A','B','C'])
    assert.equal(await s.ev(`document.activeElement===document.querySelector('${prefix} [data-sx-operation=peek]')`),true)
    await fit(`${kind}-peek`)
    // Inspect a short teaching motion in the same evaluation that starts it.
    const moves=await s.ev(`(()=>{document.querySelector('${prefix} [data-sx-operation="${add}"]').click();return document.querySelector('${prefix}').getAnimations({subtree:true}).some(a=>a.playState==='running')})()`)
    assert.equal(moves,true,'User-triggered addition still moves under reduced motion')
    assert.deepEqual((await explorerState(kind)).items,['A','B','C','D'])
    const removalMoves=await s.ev(`(()=>{document.querySelector('${prefix} [data-sx-operation="${remove}"]').click();return [...document.querySelectorAll('.structure-explorer-flight')].some(e=>e.getAnimations().some(a=>a.playState==='running'))})()`)
    assert.equal(removalMoves,true,'Returned item travels to the output')
    assert.equal((await explorerState(kind)).returned,kind==='stack'?'D':'A')
    assert.equal(await s.ev('location.hash'),`#${id}`,'Explorer operations do not advance the slide')
    for(let i=0;i<3;i++)await act(remove)
    await act(remove);assert.equal((await explorerState(kind)).count,0);assert.match((await explorerState(kind)).status,/Empty/)
    assert.equal((await explorerState(kind)).returned,'—')
    await act('peek');assert.equal((await explorerState(kind)).count,0)
    await fit(`${kind}-empty`,true)
    for(const item of ['A','B','C','D','E']){await s.input(`${prefix} [data-sx-input]`,item,'input');await act(add)}
    await s.input(`${prefix} [data-sx-input]`,'F','input');await act(add)
    assert.deepEqual((await explorerState(kind)).items,['A','B','C','D','E']);assert.match((await explorerState(kind)).status,/Full/)
    await fit(`${kind}-full`,true)
    await act('reset');assert.equal((await explorerState(kind)).returned,'—')
    await s.input(`${prefix} [data-sx-input]`,'','input');await act(add);assert.equal((await explorerState(kind)).count,3)
    await s.input(`${prefix} [data-sx-input]`,'ABCDEFGHIJKLM','input');await act(add);assert.equal((await explorerState(kind)).count,3)
    await s.input(`${prefix} [data-sx-input]`,'<img src=x>','input');await act(add)
    assert.equal(await s.ev(`document.querySelectorAll('${prefix} img').length`),0,'Custom label is text, never HTML')
    await act('reset')
    // Real Enter submits the input's own form and preserves input focus and slide.
    await s.send('Page.bringToFront')
    await s.ev(`document.querySelector('${prefix} [data-sx-input]').focus()`)
    await s.send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,text:'\r'})
    await s.send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13})
    await frame();assert.deepEqual((await explorerState(kind)).items,['A','B','C','D'])
    assert.equal(await s.ev('location.hash'),`#${id}`)
    assert.equal(await s.ev(`document.activeElement===document.querySelector('${prefix} [data-sx-input]')`),true)
    await act('reset');for(let i=0;i<2;i++)await act(remove)
    assert.match((await explorerState(kind)).description,kind==='queue'?/Front: C\. Rear: C/:/Top: A/)
    await fit(`${kind}-singleton`)
    await act(remove);await s.input(`${prefix} [data-sx-input]`,'ABCDEFGHIJKL','input')
    for(let i=0;i<5;i++)await act(add)
    await act('peek');await fit(`${kind}-long-label`,true)
    await act('reset');assert.deepEqual((await explorerState(kind)).items,['A','B','C'])
  }
  await s.ev('new Promise(resolve=>setTimeout(resolve,350))')
  assert.equal(await s.ev('document.querySelectorAll(".structure-explorer-flight").length'),0,'Finite motion cleans up after operations')
  await checkLegacy()
  console.log(`PASS all15 walkthrough states and explorer operations; ${failures.length} layout failures so far.`)

  await click('[data-action=exit-teacher-mode]')
  for(const width of [390,320]){
    await s.send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:true});await frame()
    await checkPageWidth(`mobile-${width}`)
    await s.ev('scrollTo(0,0)');await s.screenshot(`mobile-${width}`)
    for(const id of ['undo','call-stack','file-scanning']){
      await click(`#${id} [data-walkthrough-reset]`)
      for(let step=1;step<=5;step++){
        await checkPageWidth(`${id}-step-${step}-mobile-${width}`)
        if(step<5)await click(`#${id} [data-walkthrough-next]`)
      }
      await click(`#${id} [data-walkthrough-reset]`)
    }
    for(const kind of ['stack','queue']){
      const prefix=`[data-structure-explorer="${kind}"]`,add=kind==='stack'?'push':'enqueue'
      await s.input(`${prefix} [data-sx-input]`,'ABCDEFGHIJKL','input')
      await click(`${prefix} [data-sx-operation="${add}"]`);await click(`${prefix} [data-sx-operation=peek]`)
      await checkPageWidth(`${kind}-long-label-mobile-${width}`)
      await s.ev(`document.querySelector('${prefix}').scrollIntoView()`);await s.screenshot(`${kind}-mobile-${width}`)
      await click(`${prefix} [data-sx-operation=reset]`)
    }
  }
  await s.load()
  assert.deepEqual((await explorerState('stack')).items,['A','B','C'])
  assert.deepEqual((await explorerState('queue')).items,['A','B','C'])
  await checkLegacy()
  await s.send('Emulation.setScriptExecutionDisabled',{value:true})
  await s.load(path,'true')
  assert.equal(await s.ev('document.querySelectorAll("[data-walkthrough-step]").length'),15)
  assert.ok(await s.ev('[...document.querySelectorAll("[data-walkthrough-step]")].every(e=>!e.hidden)'))
  assert.ok(await s.ev('[...document.querySelectorAll("[data-walkthrough-controls], [data-sx-controls]")].every(e=>e.hidden)'))
  assert.equal(await s.ev('document.querySelectorAll(".structure-explorer .sx-occupied").length'),6)
  await checkPageWidth('no-js-mobile-320')
  await s.ev('document.querySelector("#undo").scrollIntoView()');await s.screenshot('no-js-undo')
  await s.send('Emulation.setScriptExecutionDisabled',{value:false})
  assert.deepEqual(s.errors.filter(error=>!error.includes('favicon.ico')),[])

  // Hub fallback must use v2 raw answers even when no aggregate summary exists.
  await s.load('/pages/units/btec-level-3-unit-2.html','document.querySelector("[data-topic-progress=D1]").textContent.includes("correct")')
  await s.ev(`(() => {
    const p=JSON.parse(localStorage.getItem(${JSON.stringify(keys.progress)})||'{}');delete p['stacks-and-queues'];delete p['arrays-lists-and-data-types'];
    localStorage.setItem(${JSON.stringify(keys.progress)},JSON.stringify(p));
    localStorage.removeItem('education-tools:lesson-arrays-lists-and-data-types-quiz');
  })()`)
  await s.load('/pages/units/btec-level-3-unit-2.html','document.querySelector("[data-topic-progress=D1]").textContent.includes("correct")')
  assert.match(await s.text('[data-topic-progress=D1]'),/10\/15 correct/,'Hub reads new raw quiz answers after aggregate removal')
  await s.ev(`localStorage.removeItem(${JSON.stringify(keys.quiz)})`)
  await s.load('/pages/units/btec-level-3-unit-2.html','document.querySelector("[data-topic-progress=D1]").textContent.includes("correct")')
  assert.match(await s.text('[data-topic-progress=D1]'),/0\/15 correct/,'Old raw v1 answers are not treated as current')
  await checkLegacy()
  console.log('PASS static fallback, mobile states, assets, unique IDs, valid anchors, temporary explorer state and D1 migration.')
} finally {
  mkdirSync(process.env.FLEXBOX_SCREENSHOTS,{recursive:true})
  writeFileSync(`${process.env.FLEXBOX_SCREENSHOTS}/layout.json`,JSON.stringify({report,failures},null,2))
  await s.close()
}
assert.deepEqual(failures,[],'Classroom or mobile layout failures')
console.log('PASS stacks and queues:26slides,15walkthrough states, explorer operations, quiz/draft migration and responsive layouts.')
