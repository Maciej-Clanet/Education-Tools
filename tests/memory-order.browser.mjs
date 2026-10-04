// Isolated local Chrome only. Set FLEXBOX_TEST_ORIGIN / FLEXBOX_CDP_ORIGIN
// using docs/testing.md. Screenshots/reports go to the ignored .raid-checks folder.
import assert from 'node:assert/strict'
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { createBrowserSession } from './helpers/browser-session.mjs'

process.env.FLEXBOX_SCREENSHOTS ||= '.raid-checks/memory-order'
const slug = 'multi-dimensional-arrays-and-memory-order'
const path = `/pages/topics/${slug}.html`
const file = path.slice(1), html = readFileSync(file,'utf8')
const links = [...html.matchAll(/(?:href|src)="([^"#?]+)(?:[?#][^"]*)?"/g)].map(m=>m[1]).filter(href=>!/^https?:/.test(href))
assert.deepEqual(links.filter(href=>!existsSync(resolve(dirname(file),href))),[])
assert.ok(!html.includes('more than two indexes'))
const s = await createBrowserSession({lessonPath:path,readyExpression:'document.querySelector("[data-memory-order-ready]")'})
const prefix = `education-tools:lesson-${slug}-`
const keys = {old:prefix+'quiz',quiz:prefix+'quiz-v2',drafts:prefix+'exam-practice',progress:'education-tools:lesson-progress:v1'}
const legacy = {answers:{q1:'b',q2:'a',q3:'c',q4:'b',q5:'a'},lastScore:5,bestScore:5}
const drafts = {'question-1':'My booking explanation','question-2':'My memory sequence answer','retired-prompt':'Keep this earlier draft'}
const failures=[], report=[], slides=[]
const frame=()=>s.ev('new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))')
const click=async selector=>{await s.click(selector);await frame()}
const storage=key=>s.ev(`JSON.parse(localStorage.getItem(${JSON.stringify(key)}))`)
const current=async()=>Number((await s.text('[data-role=slide-status]')).match(/Slide (\d+)/)[1])
const goto=async id=>{
  const target=slides.indexOf(id)+1;assert.ok(target>0)
  while(await current()!==target) await click(`[data-action=${await current()<target?'next-slide':'prev-slide'}]`)
}
const fit=async label=>{
  const box=await s.ev(`(()=>{const e=document.getElementById(location.hash.slice(1));return {id:e.id,w:e.clientWidth,sw:e.scrollWidth,h:e.clientHeight,sh:e.scrollHeight}})()`)
  report.push({label,...box})
  if(box.sw>box.w+2 || (!['quiz','exam-practice'].includes(box.id)&&box.sh>box.h+2))failures.push({label,...box})
  await s.screenshot(label);return box.id
}
const order=mode=>click(`[data-memory-order-mode="${mode}"]`)
const step=()=>s.ev('Number(document.querySelector("#memory-order-step").value)')
const fill=()=>s.ev('[...document.querySelectorAll(".memory-order-slot.is-filled .memory-order-slot__value")].map(e=>Number(e.textContent))')
const grid=()=>s.ev('[...document.querySelectorAll(".memory-order-grid__value")].map(e=>Number(e.textContent))')

try {
  await s.send('Runtime.enable');await s.send('Log.enable');await s.send('Page.enable')
  await s.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]})
  await s.send('Emulation.setDeviceMetricsOverride',{width:1366,height:768,deviceScaleFactor:1,mobile:false})
  await s.load()
  await s.ev(`(()=>{
    localStorage.removeItem('education-tools:${slug}-teacher-mode');
    localStorage.removeItem(${JSON.stringify(keys.quiz)});
    localStorage.setItem(${JSON.stringify(keys.old)},${JSON.stringify(JSON.stringify(legacy))});
    localStorage.setItem(${JSON.stringify(keys.drafts)},${JSON.stringify(JSON.stringify(drafts))});
    const p=JSON.parse(localStorage.getItem(${JSON.stringify(keys.progress)})||'{}');
    p['${slug}']={quizVersion:1,totalQuestions:5,answered:5,correct:5,checked:true,passed:true};
    localStorage.setItem(${JSON.stringify(keys.progress)},JSON.stringify(p));
  })()`)
  await s.load()
  assert.equal(await s.ev('document.querySelectorAll("[data-question] input:checked").length'),0)
  assert.deepEqual(await s.ev('[...document.querySelectorAll("[data-exam-response]")].map(e=>e.value)'),[drafts['question-1'],drafts['question-2']])
  assert.equal(await step(),0)
  const audit=await s.ev(`(()=>{const ids=[...document.querySelectorAll('[id]')].map(e=>e.id);return {duplicates:ids.filter((id,i)=>ids.indexOf(id)!==i),missing:[...document.querySelectorAll('[data-section-link]')].filter(a=>!document.querySelector(a.hash)).map(a=>a.hash)}})()`)
  assert.deepEqual(audit,{duplicates:[],missing:[]})
  for(const id of ['overview','multi-dimensional','memory-order','compare','mistakes','quiz','exam-practice'])assert.ok(await s.ev(`!!document.getElementById('${id}')`))
  await click('[data-action=toggle-teacher-mode]')
  assert.equal(await s.ev('location.hash'),'#overview--opener')
  const count=Number((await s.text('[data-role=slide-status]')).match(/of (\d+)/)[1])
  for(const [width,height]of [[1366,768],[1920,1080]]){
    await s.send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false})
    while(await current()>1)await click('[data-action=prev-slide]')
    for(let i=1;i<=count;i++){
      const id=await fit(`slide-${i}-${width}`);if(width===1366)slides.push(id)
      if(i<count)await click('[data-action=next-slide]')
    }
  }
  await s.send('Emulation.setDeviceMetricsOverride',{width:1366,height:768,deviceScaleFactor:1,mobile:false})
  await goto('memory-visualiser')
  for(const [mode,sequence]of [['row-major',[11,12,13,21,22,23]],['column-major',[11,21,12,22,13,23]]]){
    await order(mode);await click('[data-memory-step=reset]')
    for(let i=0;i<=6;i++){
      assert.equal(await step(),i);assert.deepEqual(await fill(),sequence.slice(0,i));assert.deepEqual(await grid(),[11,12,13,21,22,23])
      if(i>0){
        assert.equal(await s.ev('Number(document.querySelector(".memory-order-grid__cell.is-current .memory-order-grid__value").textContent)'),sequence[i-1])
        assert.match(await s.text('[data-role=memory-order-status]'),new RegExp(`memory slot ${i}`))
      }
      await fit(`${mode}-step-${i}`)
      if(i<6)await click('[data-memory-step=next]')
      assert.equal(await s.ev('location.hash'),'#memory-visualiser')
    }
    await click('[data-memory-step=next]');assert.equal(await step(),6)
    await click('[data-memory-step=previous]');assert.equal(await step(),5)
  }
  await order('row-major');assert.equal(await step(),5)
  await click('[data-memory-step=reset]');await click('[data-memory-step=previous]');assert.equal(await step(),0)
  await s.send('Page.bringToFront')
  await s.ev('document.querySelector("#memory-order-step").focus()')
  await s.send('Input.dispatchKeyEvent',{type:'keyDown',key:'ArrowRight',code:'ArrowRight',windowsVirtualKeyCode:39})
  await s.send('Input.dispatchKeyEvent',{type:'keyUp',key:'ArrowRight',code:'ArrowRight',windowsVirtualKeyCode:39})
  assert.equal(await step(),1);assert.equal(await s.ev('location.hash'),'#memory-visualiser')
  assert.equal(await s.ev('document.activeElement.id'),'memory-order-step')
  await s.ev('document.querySelector("[data-memory-step=next]").focus()')
  await s.send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,text:'\r'})
  await s.send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13})
  assert.equal(await step(),2);assert.equal(await s.ev('document.activeElement.dataset.memoryStep'),'next')
  await click('[data-action=next-slide]');await click('[data-action=prev-slide]');assert.equal(await step(),2)

  await click('[data-action=exit-teacher-mode]')
  for(const width of [390,320]){
    await s.send('Emulation.setDeviceMetricsOverride',{width,height:844,deviceScaleFactor:1,mobile:true})
    assert.ok(await s.ev('document.documentElement.scrollWidth<=innerWidth+1'),`Page width at ${width}px`)
    for(const id of ['one-dimensional','two-dimensional','multi-dimensional','row-major','column-major','memory-visualiser','software-exchange']){
      await s.ev(`document.getElementById('${id}').scrollIntoView()`);await frame();await s.screenshot(`${id}-${width}`)
    }
    const boxes=await s.ev('[...document.querySelectorAll(".memory-order-grid__cell")].map(e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y}})')
    assert.equal(boxes[0].y,boxes[2].y);assert.equal(boxes[3].y,boxes[5].y);assert.ok(boxes[3].y>boxes[0].y)
    assert.ok(boxes[0].x<boxes[1].x&&boxes[1].x<boxes[2].x)
    assert.ok(await s.ev('(()=>{const e=document.querySelector(".memory-order-track");e.scrollLeft=e.scrollWidth;return e.scrollLeft>0&&e.scrollLeft+e.clientWidth>=e.scrollWidth-1})()'))
  }
  await s.ev('document.querySelector("[data-memory-step=next]").scrollIntoView({block:"center"})');await frame()
  const point=await s.ev('(()=>{const r=document.querySelector("[data-memory-step=next]").getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()')
  await s.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[point]});await s.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]})
  await s.waitFor('document.querySelector("#memory-order-step").value==="3"')
  await s.ev(`(()=>{document.querySelectorAll('[data-question]').forEach(q=>q.querySelector('input[value="'+q.dataset.answer+'"]').click());document.querySelector('#lesson-quiz').requestSubmit()})()`)
  assert.equal((await storage(keys.quiz)).lastScore,5)
  assert.equal((await storage(keys.progress))[slug].quizVersion,2)
  await s.input('[data-exam-response=question-1]','An updated booking answer.','input')
  await s.load()
  assert.equal(await s.ev('document.querySelectorAll("[data-question] input:checked").length'),5)
  assert.equal(await s.ev('document.querySelector("[data-exam-response=question-1]").value'),'An updated booking answer.')
  assert.deepEqual(await storage(keys.old),legacy)
  assert.equal((await storage(keys.drafts))['retired-prompt'],drafts['retired-prompt'])
  assert.equal(await step(),0)
  await s.send('Emulation.setEmulatedMedia',{media:'print'})
  assert.equal(await s.ev('getComputedStyle(document.querySelector(".mo-static-layout")).display'),'block')
  assert.equal(await s.ev('getComputedStyle(document.querySelector("[data-memory-order-controls]")).display'),'none')
  await s.send('Emulation.setEmulatedMedia',{media:''})
  await s.send('Emulation.setScriptExecutionDisabled',{value:true});await s.send('Page.reload')
  await new Promise(r=>setTimeout(r,500))
  assert.equal(await s.ev('document.querySelector("[data-memory-order-controls]").hidden'),true)
  assert.equal(await s.ev('document.querySelectorAll(".memory-order-grid__value").length'),6)
  assert.match(await s.text('.mo-static-layout'),/Column-major: 11, 21, 12, 22, 13, 23/)
  await s.send('Emulation.setScriptExecutionDisabled',{value:false})

  // The legacy fallback must count the new raw quiz only, never the old answers.
  // This profile is created for this lesson test, with no learner's other state.
  await s.ev(`localStorage.removeItem(${JSON.stringify(keys.progress)});localStorage.removeItem('education-tools:lesson-matrices-and-arrays-quiz')`)
  await s.load('/pages/units/btec-level-3-unit-2.html','document.querySelector("[data-topic-progress=D2]").textContent.includes("correct")')
  assert.match(await s.text('[data-topic-progress=D2]'),/5\/10 correct/)
  await s.ev(`localStorage.removeItem(${JSON.stringify(keys.quiz)})`)
  await s.load('/pages/units/btec-level-3-unit-2.html','document.querySelector("[data-topic-progress=D2]").textContent.includes("correct")')
  assert.match(await s.text('[data-topic-progress=D2]'),/0\/10 correct/)
  assert.deepEqual(await storage(keys.old),legacy)
  await s.load();await click('[data-action=reset-quiz]')
  assert.equal((await storage(keys.drafts))['question-2'],drafts['question-2'])
  assert.equal((await storage(keys.drafts))['retired-prompt'],drafts['retired-prompt'])
  assert.deepEqual(s.errors.filter(e=>!e.includes('/favicon.ico')),[])
}finally{
  mkdirSync(process.env.FLEXBOX_SCREENSHOTS,{recursive:true})
  writeFileSync(`${process.env.FLEXBOX_SCREENSHOTS}/report.json`,JSON.stringify({report,failures,errors:s.errors},null,2))
  await s.close()
}
assert.deepEqual(failures,[],'Teaching slides fit without overflow')
console.log('PASS: all slides, both memory orders at every step, keyboard/touch, mobile grid geometry, print/no-JS, quiz migration, retained drafts and D2 progress.')
