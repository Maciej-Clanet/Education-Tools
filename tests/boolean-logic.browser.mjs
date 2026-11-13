// This suite writes learner storage. Use an isolated Chrome profile and local origin.
import assert from 'node:assert/strict'
import { mkdirSync, writeFileSync } from 'node:fs'
import { createBrowserSession } from './helpers/browser-session.mjs'
import { getTask, evaluate } from '../javascript/core/boolean-logic-model.js'

process.env.FLEXBOX_TEST_ORIGIN ||= 'http://127.0.0.1:8765'
process.env.FLEXBOX_CDP_ORIGIN ||= 'http://127.0.0.1:9248'
process.env.FLEXBOX_SCREENSHOTS ||= '.raid-checks/boolean-logic-v3'
const path = '/pages/topics/boolean-logic.html?context=btec-level-3-unit-2'
const prefix = 'education-tools:lesson-boolean-logic'
const practiceKey = `${prefix}-practice-v1`
const progressKey = 'education-tools:lesson-progress:v1'
const s = await createBrowserSession({ lessonPath:path, readyExpression:'document.querySelectorAll("[data-boolean-table][data-enhanced]").length===6 && document.querySelector("#boolean-recap .live-code__editor") && document.querySelector("[data-teacher-opener-slide]")' })
const frame = () => s.ev('new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))')
const click = async selector => { await s.click(selector); await frame() }
const show = async selector => { await s.ev(`document.querySelector(${JSON.stringify(selector)}).scrollIntoView({block:'center'})`); await frame() }
const read = key => s.ev(`JSON.parse(localStorage.getItem(${JSON.stringify(key)}))`)
const fillGenerated = async wrong => {
  const task = getTask(await s.ev('document.querySelector("[data-boolean-practice]").dataset.taskId'))
  const values=task.rows.flatMap((inputs,row)=>task.columns.map((column,col)=>({row,column:column.id,value:String(evaluate(column.node,inputs) ^ Number(wrong && row===0 && col===0))})))
  await s.ev(`(()=>{for(const a of ${JSON.stringify(values)}){const e=document.querySelector('[data-practice-answer][data-row="'+a.row+'"][data-column="'+a.column+'"]');e.value=a.value;e.dispatchEvent(new Event('change',{bubbles:true}))}})()`)
  return task
}
const failures=[], layouts=[]
try {
  await s.send('Page.enable'); await s.send('Runtime.enable'); await s.send('Log.enable')
  await s.send('Emulation.setDeviceMetricsOverride',{width:1366,height:768,deviceScaleFactor:1,mobile:false})
  await s.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]})
  await s.load()
  await s.ev(`localStorage.removeItem('education-tools:boolean-logic-teacher-mode');localStorage.removeItem('${prefix}-quiz-v3');localStorage.setItem('${prefix}-quiz-v2',JSON.stringify({answers:{q1:'a'},lastScore:8}));localStorage.setItem('${prefix}-exam-practice',JSON.stringify({'question-1':'Original draft','hotel-explain-v2':'Saved hotel explanation','college-entry-v2':'Saved college explanation'}));localStorage.setItem('${prefix}-lab',JSON.stringify({expression:'secure',inputs:{A:1,B:0,C:1}}));localStorage.setItem('${practiceKey}',JSON.stringify({version:1,inputCount:2,modes:{2:{taskId:'two-or',answers:[['0'],['1'],['1'],['1']],checked:true},3:{taskId:'three-and-not-c',answers:[['0','1','0']],checked:false}}}));`)
  await s.load()
  assert.equal(await s.ev('document.querySelectorAll("#lesson-quiz input:checked").length'),0)
  assert.equal(await s.ev('document.querySelector("#hotel-explain-v2").value'),'Saved hotel explanation')
  assert.equal(await s.ev('document.querySelector("#college-entry-v2").value'),'Saved college explanation')
  assert.match(await s.text('[data-practice-feedback]'),/Correct/)
  assert.equal(await s.text('[data-practice-table] th:last-child'),'A OR B')
  assert.equal(await s.ev('document.querySelectorAll("[data-practice-worked]").length'),0)
  assert.ok(await s.ev('!!(document.getElementById("truth-practice").compareDocumentPosition(document.getElementById("quiz")) & Node.DOCUMENT_POSITION_FOLLOWING)'))
  assert.deepEqual(await s.ev(`(()=>{const ids=[...document.querySelectorAll('[id]')].map(e=>e.id);return ids.filter((id,i)=>ids.indexOf(id)!==i)})()`),[])
  assert.deepEqual(await s.ev(`[...document.querySelectorAll('a[href^="#"]')].map(e=>e.hash.slice(1)).filter(id=>!document.getElementById(id))`),[])
  for(const id of ['boolean-values','calculations','three-inputs','compound-table','code-example']) assert.ok(await s.ev(`!!document.getElementById('${id}')`))
  assert.ok(await s.ev('document.querySelector("#overview img").complete && document.querySelector("#overview img").naturalWidth>0'))

  // Real execution: comments explain the recap without a separate programming lesson.
  const code='#boolean-recap'
  await show(code)
  await click(`${code} .live-code__primary-action`)
  await s.waitFor(`document.querySelectorAll('${code} .live-code__console-message').length===4`)
  assert.deepEqual(await s.ev(`[...document.querySelectorAll('${code} .live-code__console-message')].map(e=>e.textContent)`),['true','false','true','false'])
  const source=await s.ev(`document.querySelector('${code} .live-code__editor').value`)
  await s.input(`${code} .live-code__editor`,source.replace('16 >= 18','19 >= 18'),'input')
  await click(`${code} .live-code__primary-action`)
  await s.waitFor(`[...document.querySelectorAll('${code} .live-code__console-message')].at(-1)?.textContent==='true'`)

  const hotel='[data-boolean-demo=hotel]'
  await show(hotel)
  await s.ev(`document.querySelector('${hotel} [data-boolean-input=A]').focus()`)
  await s.send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,text:'\r'})
  await s.send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13})
  assert.equal(await s.ev('document.activeElement.dataset.booleanInput'),'A')
  assert.equal(await s.ev(`document.querySelector('${hotel}').dataset.output`),'0')
  await click(`${hotel} [data-boolean-input=B]`)
  assert.equal(await s.ev(`document.querySelector('${hotel}').dataset.output`),'1')
  assert.ok(await s.ev(`document.querySelector('${hotel}').getAnimations({subtree:true}).length>0`),'Door teaching motion remains available under reduced motion')
  await click(`${hotel} [data-boolean-action=reset]`)
  assert.equal(await s.ev(`document.querySelector('${hotel}').dataset.output`),'0')
  assert.equal(await s.ev(`document.querySelector('${hotel}').getAnimations({subtree:true}).length`),0)

  const taskIds={and:'two-and',or:'two-or',card:'two-and-not-b',alarm:'three-and-or',college:'three-and-not-c'}
  for(const kind of ['and','or','not','card','alarm','college']) {
    const host=`[data-boolean-table=${kind}]`
    await show(host)
    assert.equal(await s.ev(`document.querySelectorAll('${host} [data-boolean-input]').length`),kind==='alarm'?3:0)
    const count=await s.ev(`document.querySelectorAll('${host} [data-table-answer]').length`)
    const task=kind==='not'?null:getTask(taskIds[kind])
    const expected=kind==='not'?['1','0']:task.rows.flatMap(row=>task.columns.map(column=>String(evaluate(column.node,row))))
    assert.equal(await s.text(`${host} th:last-child`),task?.label||'NOT A')
    await click(`${host} [data-boolean-action=check]`)
    assert.equal(await s.ev(`document.querySelectorAll('${host} [data-result=missing]').length`),count)
    await s.input(`${host} [data-table-answer]`,expected[0],'change')
    await click(`${host} [data-boolean-action=show]`)
    assert.deepEqual(await s.ev(`[...document.querySelectorAll('${host} [data-table-answer]')].map(e=>e.value)`),expected)
    assert.ok(await s.ev(`[...document.querySelectorAll('${host} [data-table-answer]')].every(e=>e.disabled)`))
    await click(`${host} [data-boolean-action=show]`)
    assert.deepEqual(await s.ev(`[...document.querySelectorAll('${host} [data-table-answer]')].map(e=>e.value)`),[expected[0],...Array(count-1).fill('')],'Revealing then hiding keeps the learner draft')
    await s.ev(`(()=>{const values=${JSON.stringify(expected)};document.querySelectorAll('${host} [data-table-answer]').forEach((e,i)=>{e.value=values[i];e.dispatchEvent(new Event('change',{bubbles:true}))})})()`)
    await click(`${host} [data-boolean-action=check]`)
    assert.match(await s.text(`${host} .bl-class-status`),/Correct/)
    await s.input(`${host} [data-table-answer]`,String(1-Number(expected[0])),'change')
    await click(`${host} [data-boolean-action=check]`)
    assert.equal(await s.ev(`document.querySelectorAll('${host} [data-result=incorrect]').length`),1)
    await click(`${host} [data-boolean-action=clear]`)
    assert.ok(await s.ev(`[...document.querySelectorAll('${host} [data-table-answer]')].every(e=>e.value===''&&!e.disabled)`))
  }
  const alarm='[data-boolean-table=alarm]'
  await show(alarm)
  await s.input(`${alarm} [data-table-answer]`,'1','change')
  for(const name of ['A','C']) await click(`${alarm} [data-boolean-input=${name}]`)
  assert.equal(await s.ev(`document.querySelector('${alarm}').dataset.activeRow`),'5')
  assert.equal(await s.ev(`document.querySelector('${alarm} tr[aria-current=true]').dataset.row`),'5')
  assert.equal(await s.ev(`document.querySelector('${alarm} [data-table-answer]').value`),'1','Highlighting changes no entered values')

  // The original generator retains both modes and checks answers without a reveal panel.
  await show('[data-boolean-practice]')
  await click('[data-practice-clear]'); await click('[data-practice-check]')
  assert.match(await s.text('[data-practice-feedback]'),/empty/)
  await fillGenerated(true); await click('[data-practice-check]')
  assert.equal(await s.ev('document.querySelectorAll("[data-boolean-practice] [data-result=incorrect]").length'),1)
  await fillGenerated(false); await click('[data-practice-check]')
  const savedTwo=(await read(practiceKey)).modes[2]
  await s.input('[data-practice-mode]','3')
  assert.equal(await s.text('[data-practice-table] th:last-child'),getTask('three-and-not-c').label)
  assert.equal(await s.ev('document.querySelector("[data-practice-answer]").value'),'0')
  await fillGenerated(false); await click('[data-practice-check]')
  await s.load()
  assert.match(await s.text('[data-practice-feedback]'),/Correct/)
  await s.input('[data-practice-mode]','2')
  assert.deepEqual((await read(practiceKey)).modes[2],savedTwo)
  const before=await s.ev('document.querySelector("[data-boolean-practice]").dataset.taskId')
  await click('[data-practice-new]')
  assert.notEqual(await s.ev('document.querySelector("[data-boolean-practice]").dataset.taskId'),before)
  assert.ok(await s.ev('[...document.querySelectorAll("[data-practice-answer]")].every(e=>e.value==="")'))

  const answerQuiz=async n=>s.ev(`(()=>{document.querySelectorAll('#lesson-quiz [data-question]').forEach((q,i)=>{[...q.querySelectorAll('input')].find(e=>(e.value===q.dataset.answer)===(i<${n})).click()});document.querySelector('#lesson-quiz').requestSubmit()})()`)
  await answerQuiz(5); assert.equal((await read(progressKey))['boolean-logic'].passed,false)
  await answerQuiz(6); assert.equal((await read(progressKey))['boolean-logic'].passed,true)
  await answerQuiz(8)
  await s.load()
  assert.equal(await s.ev('document.querySelectorAll("#lesson-quiz input:checked").length'),8)
  assert.equal((await read(progressKey))['boolean-logic'].quizVersion,3)
  assert.equal((await read(`${prefix}-quiz-v2`)).lastScore,8)
  await click('[data-action=reset-quiz]')
  assert.equal((await read(`${prefix}-exam-practice`))['question-1'],'Original draft')
  assert.equal(await s.ev('document.querySelector("#hotel-explain-v2").value'),'Saved hotel explanation')
  await s.input('[data-practice-mode]','3')
  await click('[data-action=toggle-teacher-mode]')
  const total=Number((await s.text('[data-role=slide-status]')).match(/of (\d+)/)[1])
  const scrollable=new Set(['quiz','exam-practice','college-practice'])
  for(const [width,height] of [[1366,768],[1600,900]]) {
    await s.send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false})
    for(let i=0;i<total;i++) await click('[data-action=prev-slide]')
    for(let i=1;i<=total;i++) {
      const info=await s.ev(`(()=>{const e=document.getElementById(decodeURIComponent(location.hash.slice(1)));return{id:e.id,h:e.clientHeight,sh:e.scrollHeight,w:e.clientWidth,sw:e.scrollWidth}})()`)
      layouts.push({width,height,i,...info})
      if(info.sw>info.w+2) failures.push(`${width}: ${info.id} horizontal ${info.sw}/${info.w}`)
      if(!scrollable.has(info.id)&&info.sh>info.h+2) failures.push(`${width}: ${info.id} vertical ${info.sh}/${info.h}`)
      if(width===1366) await s.screenshot(`slide-${String(i).padStart(2,'0')}-${info.id}`)
      const kind=await s.ev(`document.getElementById(decodeURIComponent(location.hash.slice(1))).querySelector('[data-boolean-table]')?.dataset.booleanTable`)
      if(kind) {
        await click(`[data-boolean-table=${kind}] [data-boolean-action=show]`)
        if(!await s.ev(`(()=>{const e=document.getElementById(decodeURIComponent(location.hash.slice(1)));return e.scrollHeight<=e.clientHeight+2})()`)) failures.push(`${width}: ${kind} shown answers overflow`)
        if(width===1366)await s.screenshot(`shown-${kind}`)
        await click(`[data-boolean-table=${kind}] [data-boolean-action=show]`)
      }
      if(i<total) await click('[data-action=next-slide]')
    }
  }
  await click('[data-action=exit-teacher-mode]')
  for(const width of [390,320]) {
    await s.send('Emulation.setDeviceMetricsOverride',{width,height:844,deviceScaleFactor:1,mobile:true}); await frame()
    assert.ok(await s.ev('document.documentElement.scrollWidth<=innerWidth+1'),`${width}px page fits`)
    for(const selector of ['#boolean-recap','#overview',hotel,alarm,'[data-boolean-practice]']) { await show(selector); await s.screenshot(`mobile-${width}-${selector.replace(/[^a-z]/gi,'')}`) }
    await show(`${hotel} [data-boolean-input=A]`)
    const pt=await s.ev(`(()=>{const r=document.querySelector('${hotel} [data-boolean-input=A]').getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2}})()`)
    const before=await s.ev(`document.querySelector('${hotel} [data-boolean-input=A]').getAttribute('aria-pressed')`)
    await s.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[pt]}); await s.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]})
    await s.waitFor(`document.querySelector('${hotel} [data-boolean-input=A]').getAttribute('aria-pressed')!==${JSON.stringify(before)}`)
  }
  await s.send('Emulation.setEmulatedMedia',{media:'print'})
  assert.ok(await s.ev('[...document.querySelectorAll("[data-boolean-demo-fallback],[data-boolean-table-fallback],[data-boolean-practice-fallback],.bl-code-static")].every(e=>getComputedStyle(e).display!=="none")'))
  assert.ok(await s.ev('[...document.querySelectorAll("[data-boolean-demo-ui],[data-boolean-table-ui],[data-boolean-practice-ui],[data-live-code-example-id]")].every(e=>getComputedStyle(e).display==="none")'))
  await s.send('Emulation.setEmulatedMedia',{media:''})
  await s.send('Emulation.setScriptExecutionDisabled',{value:true})
  await s.load('/pages/topics/boolean-logic.html','true')
  assert.ok(await s.ev('[...document.querySelectorAll("[data-boolean-table-fallback],.bl-code-static")].every(e=>e.getClientRects().length>0)'))
  assert.ok(await s.ev('document.documentElement.scrollWidth<=innerWidth+1'))
  await s.send('Emulation.setScriptExecutionDisabled',{value:false}); await s.load()
  await answerQuiz(8)
  const hub='/pages/units/btec-level-3-unit-2.html', ready='document.querySelector("[data-topic-progress=F1]").textContent.includes("correct")'
  await s.load(hub,ready); assert.match(await s.text('[data-topic-progress=F1]'),/8\/8 correct/)
  await s.ev(`(()=>{const p=JSON.parse(localStorage.getItem('${progressKey}'));delete p['boolean-logic'];localStorage.setItem('${progressKey}',JSON.stringify(p));localStorage.removeItem('${prefix}-quiz-v3')})()`)
  await s.load(hub,ready); assert.match(await s.text('[data-topic-progress=F1]'),/0\/8 correct/)
  assert.equal((await read(`${prefix}-lab`)).expression,'secure')
  assert.deepEqual(s.errors.filter(e=>!e.includes('favicon.ico')),[])
  mkdirSync(process.env.FLEXBOX_SCREENSHOTS,{recursive:true});writeFileSync(`${process.env.FLEXBOX_SCREENSHOTS}/layout.json`,JSON.stringify({layouts,failures},null,2))
  assert.deepEqual(failures,[])
  console.log(`PASS: ${total} classroom slides; recap execution, six editable tables, row selection, generator persistence, quiz migration, desktop/mobile, print and no-JS.`)
} finally { await s.send('Emulation.setScriptExecutionDisabled',{value:false}).catch(()=>{}); await s.close() }
