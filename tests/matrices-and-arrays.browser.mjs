// Run against an isolated local Chrome profile. Uses tests/helpers/browser-session.mjs;
// set FLEXBOX_TEST_ORIGIN / FLEXBOX_CDP_ORIGIN as described in docs/testing.md.
import assert from 'node:assert/strict'
import { mkdirSync, writeFileSync } from 'node:fs'
import { createBrowserSession } from './helpers/browser-session.mjs'

process.env.FLEXBOX_SCREENSHOTS ||= '.raid-checks/matrices'
const path = '/pages/topics/matrices-and-arrays.html'
const ready = 'document.querySelector("[data-walkthrough-ready]") && document.querySelectorAll("[data-matrix-answer]").length > 0'
const s = await createBrowserSession({ lessonPath: path, readyExpression: ready })
const base = 'education-tools:lesson-matrices-and-arrays-'
const keys = { quiz: base + 'quiz', practice: base + 'operation-practice', drafts: base + 'exam-practice' }
const teacherKey = 'education-tools:matrices-and-arrays-teacher-mode'
const failures = [], report = [], slides = []
const host = '[data-matrix-playback]'
const frame = () => s.ev('new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))')
const click = async selector => { await s.click(selector); await frame() }
const current = async () => Number((await s.text('[data-role=slide-status]')).match(/Slide (\d+)/)[1])
const status = () => s.text('[data-walkthrough-status]')
const playing = () => s.ev('document.querySelector("[data-matrix-play]").getAttribute("aria-pressed")')
const storage = async key => JSON.parse(await s.ev(`localStorage.getItem(${JSON.stringify(key)})`))
const fit = async label => {
  const box = await s.ev(`(()=>{const e=document.getElementById(location.hash.slice(1));return {id:e.id,w:e.clientWidth,sw:e.scrollWidth,h:e.clientHeight,sh:e.scrollHeight}})()`)
  if (box.id === 'arrays') assert.ok(await s.ev(`(()=>{const table=document.querySelector('#arrays table');return [...table.tBodies[0].rows].every(row=>[...row.cells].every((cell,i)=>{const header=table.tHead.rows[0].cells[i].getBoundingClientRect();const range=document.createRange();range.selectNodeContents(cell);const text=range.getBoundingClientRect();return Math.abs((text.left+text.right)/2-(header.left+header.right)/2)<2}))})()`),'Each array value aligns with its column heading')
  report.push({ label, ...box })
  if (box.sw > box.w + 2 || (!['quiz','exam-practice'].includes(box.id) && box.sh > box.h + 2)) failures.push({ label, ...box })
  await s.screenshot(label)
  return box.id
}
const goto = async id => {
  const target = slides.indexOf(id) + 1
  assert.ok(target > 0, `Slide exists: ${id}`)
  while (await current() !== target) await click(`[data-action=${await current() < target ? 'next-slide' : 'prev-slide'}]`)
}
const seed = {
  addition: { question: { type:'addition', left:[[2,1,3],[4,3,2],[5,2,1]], right:[[5,2,1],[1,6,3],[1,2,3]], answer:[[7,3,4],[5,9,5],[6,4,4]] }, answers:['7','','','','','','','',''] },
  scalar: { question: { type:'scalar', scalar:3, matrix:[[2,1,3],[4,3,2],[5,2,1]], answer:[[6,3,9],[12,9,6],[15,6,3]] }, answers:['6','','','','','','','',''] },
  multiplication: { question: { type:'multiplication', left:[[1,2,3],[4,5,6]], right:[[1,2],[3,4],[5,6]], answer:[[22,28],[49,64]] }, answers:['22','','',''] },
}
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
const working = 'Row 1, column 1:\n(1 × 1) + (2 × 3) + (3 × 5) = 22'

try {
  await s.send('Runtime.enable'); await s.send('Log.enable'); await s.send('Page.enable')
  await s.send('Emulation.setEmulatedMedia', { features: [{name:'prefers-reduced-motion',value:'reduce'}] })
  await s.send('Emulation.setDeviceMetricsOverride', { width:1366,height:768,deviceScaleFactor:1,mobile:false })
  await s.load()
  await s.ev(`(()=>{
    localStorage.removeItem(${JSON.stringify(teacherKey)});
    localStorage.setItem(${JSON.stringify(keys.practice)},${JSON.stringify(JSON.stringify(seed))});
    localStorage.setItem(${JSON.stringify(keys.quiz)}, JSON.stringify({answers:{q1:'a',q2:'b'},bestScore:4,lastScore:4}));
    localStorage.setItem(${JSON.stringify(keys.drafts)}, JSON.stringify({'question-1':'My seating draft','question-2':'My earlier points draft'}));
  })()`)
  await s.load()
  assert.equal(await s.ev('document.querySelector("[data-matrix-scratch]").value'),'','Existing questions load without a prior scratchpad')
  assert.ok(await s.ev('[...document.querySelectorAll("[data-matrix-answer]")].every(e=>e.type==="text"&&e.inputMode==="numeric")'),'Numeric answer fields have no spin buttons')
  await s.input('[data-matrix-scratch]',working,'input')
  assert.equal(await s.ev('document.querySelectorAll("[data-question] input:checked").length'),2)
  assert.equal(await s.ev('document.querySelector("[data-exam-response=question-1]").value'),'My seating draft')
  assert.equal(await s.ev('document.querySelector("[data-exam-response=points-addition-v2]").value'),'')
  await s.input('[data-exam-response=points-addition-v2]','Combine the same student and week positions.','input')
  await s.ev(`(()=>{
    document.querySelectorAll('[data-question]').forEach(q=>q.querySelector('input[value="'+q.dataset.answer+'"]').click());
    document.querySelector('#lesson-quiz').requestSubmit();
  })()`)
  assert.equal((await storage(keys.quiz)).bestScore,5)
  for (const [type, entry] of Object.entries(seed)) {
    const card = `[data-matrix-practice=${type}]`
    assert.equal(await s.ev(`document.querySelector('${card} [data-matrix-answer="0"]').value`),entry.answers[0])
    await click(`${card} [data-matrix-practice-action=check]`)
    assert.match(await s.text(`${card} [data-role=matrix-practice-status]`),/Fill every/)
    for (const [i,value] of entry.question.answer.flat().entries()) await s.input(`${card} [data-matrix-answer="${i}"]`,value,'input')
    await click(`${card} [data-matrix-practice-action=check]`)
    assert.match(await s.text(`${card} [data-role=matrix-practice-status]`),/^Correct/)
    assert.ok(await s.ev(`[...document.querySelectorAll('${card} [data-matrix-answer]')].every(e=>getComputedStyle(e).backgroundColor==='rgb(229, 241, 223)')`),'Correct cells are visibly green')
    await s.input(`${card} [data-matrix-answer="0"]`,entry.question.answer[0][0]+1,'input')
    assert.ok(await s.ev(`[...document.querySelectorAll('${card} [data-matrix-answer]')].every(e=>!e.matches('.is-correct,.is-incorrect')&&!e.hasAttribute('aria-invalid'))`),'Editing clears stale feedback')
    await click(`${card} [data-matrix-practice-action=check]`)
    assert.equal(await s.ev(`getComputedStyle(document.querySelector('${card} [data-matrix-answer="0"]')).backgroundColor`),'rgb(252, 227, 227)','Incorrect cells are visibly red')
    assert.equal(await s.ev(`document.querySelector('${card} [data-matrix-answer="0"]').getAttribute('aria-invalid')`),'true')
    assert.equal(await s.ev(`getComputedStyle(document.querySelector('${card} [data-matrix-answer="1"]')).backgroundColor`),'rgb(229, 241, 223)','Correct neighbours stay green')
    await s.input(`${card} [data-matrix-answer="0"]`,entry.question.answer[0][0],'input')
    await click(`${card} [data-matrix-practice-action=check]`)
  }
  await s.load()
  assert.equal(await s.ev('document.querySelector("[data-matrix-scratch]").value'),working,'Working survives checks and reload')
  assert.equal((await storage(keys.drafts))['question-2'],'My earlier points draft')
  assert.equal(await s.ev('document.querySelector("[data-exam-response=points-addition-v2]").value'),'Combine the same student and week positions.')
  for (const type of Object.keys(seed)) assert.match(await s.text(`[data-matrix-practice=${type}] [data-role=matrix-practice-status]`),/^Correct/)

  const audit = await s.ev(`(()=>{
    const ids=[...document.querySelectorAll('[id]')].map(e=>e.id);
    return {duplicates:ids.filter((id,i)=>ids.indexOf(id)!==i), missing:[...document.querySelectorAll('[data-section-link]')].filter(e=>!document.querySelector(e.hash)).map(e=>e.hash)};
  })()`)
  assert.deepEqual(audit,{duplicates:[],missing:[]})
  await click('[data-action=toggle-teacher-mode]')
  assert.equal(await s.ev('location.hash'),'#introduction--opener')
  const count = Number((await s.text('[data-role=slide-status]')).match(/of (\d+)/)[1])
  for (const [width,height] of [[1366,768],[1920,1080]]) {
    await s.send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false})
    while (await current()>1) await click('[data-action=prev-slide]')
    for(let i=1;i<=count;i++) {
      const id = await fit(`slide-${i}-${width}`)
      if(width===1366) slides.push(id)
      if(i<count) await click('[data-action=next-slide]')
    }
  }
  await s.send('Emulation.setDeviceMetricsOverride',{width:1366,height:768,deviceScaleFactor:1,mobile:false})
  assert.ok(slides.indexOf('introduction')<slides.indexOf('overview'))
  for(const id of ['addition--divider','scalar-multiplication--divider','multiplication-size--divider'])assert.ok(slides.includes(id))
  assert.equal(await s.ev('document.querySelectorAll("#multiplication-size .matrix-grid__cell.ma-row").length'),3)
  assert.equal(await s.ev('document.querySelectorAll("#multiplication-size .matrix-grid__cell.ma-column").length'),3)
  assert.ok(await s.ev('document.querySelectorAll("#arrays .code-snippet .syntax-number").length>=5'))
  assert.ok(await s.ev('parseFloat(getComputedStyle(document.querySelector("#arrays .code-snippet pre")).fontSize)>=20'),'Code is large enough for classroom use')
  await goto('multiplication-size')
  assert.equal(await s.ev('document.querySelectorAll(".ma-result-cell").length'),8)
  for(let index=0;index<8;index++) {
    await click(`.ma-result-cell:nth-child(${index+1})`)
    const row=Math.floor(index/4), column=index%4
    const selection=await s.ev(`(()=>{const selected=(grid,cls)=>[...document.querySelectorAll('[data-match-grid="'+grid+'"]>*')].flatMap((e,i)=>e.classList.contains(cls)?[i]:[]);return {a:selected('a','ma-row'),b:selected('b','ma-column'),result:selected('result','ma-target'),pressed:document.querySelectorAll('.ma-result-cell[aria-pressed="true"]').length}})()`)
    assert.deepEqual(selection,{a:[row*3,row*3+1,row*3+2],b:[column,column+4,column+8],result:[index],pressed:1})
    assert.equal(await s.text('[data-match-status]'),`Row ${row+1} of A × column ${column+1} of B`)
    assert.equal(await s.ev('location.hash'),'#multiplication-size','Selecting a cell does not advance the slide')
  }
  await fit('matrix-matching-row-2-column-4')
  await s.send('Page.bringToFront')
  await s.ev('document.querySelector(".ma-result-cell").focus()')
  await s.send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,text:'\r',unmodifiedText:'\r'})
  await s.send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13})
  assert.equal(await s.text('[data-match-status]'),'Row 1 of A × column 1 of B')
  assert.equal(await s.ev('document.activeElement.matches(".ma-result-cell[aria-pressed=true]")'),true)
  assert.equal(await s.ev('location.hash'),'#multiplication-size')
  await goto('matrix-multiplication')
  for(let step=1;step<=8;step++) {
    assert.match(await status(),new RegExp(`Step ${step} of 8`))
    assert.equal(await s.ev('document.querySelectorAll("[data-walkthrough-step]:not([hidden])").length'),1)
    if(step>=2&&step<=4){
      assert.equal(await s.text('[data-walkthrough-step]:not([hidden]) .ma-formula'),'(2 × 5) + (1 × 1)')
      assert.match(await s.text('[data-walkthrough-step]:not([hidden]) .ma-running-total'),/10/,'First product stays visible')
      if(step===3)assert.match(await s.text('[data-walkthrough-step]:not([hidden]) .ma-running-total'),/10\s*\+\s*1/)
    }
    await fit(`multiplication-step-${step}`)
    if(step<8) await click('[data-walkthrough-next]')
  }
  assert.deepEqual(await s.ev('[...document.querySelector("[data-walkthrough-step]:not([hidden]) .matrix-display:last-child").querySelectorAll(".matrix-grid__cell")].map(e=>Number(e.textContent))'),[11,10,23,26])
  await click('[data-walkthrough-next]'); assert.match(await status(),/Step 8 of 8/)
  await click('[data-walkthrough-reset]')
  await s.send('Page.bringToFront')
  await s.ev('document.querySelector("[data-walkthrough-next]").focus()')
  await s.send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,text:'\r',unmodifiedText:'\r'})
  await s.send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13})
  assert.match(await status(),/Step 2 of 8/)
  assert.equal(await s.ev('document.activeElement.hasAttribute("data-walkthrough-next")'),true)
  assert.equal(await s.ev('location.hash'),'#matrix-multiplication')
  await click('[data-walkthrough-reset]')
  const savedPractice = await storage(keys.practice)
  await click('[data-matrix-play]'); assert.equal(await playing(),'true')
  await sleep(3650); assert.match(await status(),/Step 2 of 8/)
  await click('[data-matrix-play]'); assert.equal(await playing(),'false')
  await sleep(3600); assert.match(await status(),/Step 2 of 8/)
  await click('[data-matrix-play]'); await click('[data-walkthrough-prev]'); assert.equal(await playing(),'false')
  assert.match(await status(),/Step 1 of 8/)
  await click('[data-matrix-play]'); await click('[data-action=next-slide]')
  await s.waitFor('document.querySelector("[data-matrix-play]").getAttribute("aria-pressed")==="false"')
  await goto('matrix-multiplication')
  await click('[data-matrix-play]'); await click('[data-walkthrough-reset]')
  assert.equal(await playing(),'false')
  // Start at the penultimate state to test finite completion and replay.
  for(let i=0;i<6;i++) await click('[data-walkthrough-next]')
  await click('[data-matrix-play]'); await sleep(3650)
  assert.match(await status(),/Step 8 of 8/); assert.equal(await playing(),'false')
  await click('[data-matrix-play]'); assert.match(await status(),/Step 1 of 8/)
  await click('[data-matrix-play]')
  assert.deepEqual(await storage(keys.practice),savedPractice)

  await goto('addition')
  await click('[data-action=next-slide]')
  await click('[data-matrix-practice=addition] [data-matrix-practice-action=new]')
  const fresh = (await storage(keys.practice)).addition
  assert.ok(fresh.answers.every(answer=>answer===''))
  const expected = fresh.question.left.flatMap((row,r)=>row.map((value,c)=>value+fresh.question.right[r][c]))
  for(const [i,value] of expected.entries()) await s.input(`[data-matrix-practice=addition] [data-matrix-answer="${i}"]`, i===0?value+1:value,'input')
  await click('[data-matrix-practice=addition] [data-matrix-practice-action=check]')
  assert.match(await s.text('[data-matrix-practice=addition] [data-role=matrix-practice-status]'),/1 cell needs/)
  await fit('matrix-answer-feedback')
  await click('[data-matrix-practice=addition] [data-matrix-practice-action=clear]')
  const cleared = await storage(keys.practice)
  assert.deepEqual(cleared.addition.question,fresh.question)
  assert.ok(cleared.addition.answers.every(answer=>answer===''))
  assert.deepEqual(cleared.multiplication,savedPractice.multiplication)
  assert.equal((await storage(keys.drafts))['question-2'],'My earlier points draft')

  await goto('multiplication-practice')
  const multiplyCard='[data-matrix-practice=multiplication]'
  await click(`${multiplyCard} [data-matrix-practice-action=clear]`)
  assert.equal(await s.ev('document.querySelector("[data-matrix-scratch]").value'),working,'Clear answers preserves working')
  await s.input(`${multiplyCard} [data-matrix-answer="0"]`,'22','input')
  await click('[data-matrix-scratch-clear]')
  assert.equal(await s.ev('document.querySelector("[data-matrix-scratch]").value'),'')
  assert.equal(await s.ev(`document.querySelector('${multiplyCard} [data-matrix-answer="0"]').value`),'22','Clear working preserves answers')
  await s.input('[data-matrix-scratch]',working,'input')
  await click(`${multiplyCard} [data-matrix-practice-action=new]`)
  assert.equal(await s.ev('document.querySelector("[data-matrix-scratch]").value'),'','New question starts a fresh scratchpad')
  assert.ok((await storage(keys.practice)).multiplication.answers.every(value=>value===''))

  await click('[data-action=exit-teacher-mode]')
  await s.ev(`document.querySelector('${host}').scrollIntoView()`); await frame()
  await click('[data-matrix-play]')
  await s.ev('window.scrollTo(0,0)')
  await s.waitFor('document.querySelector("[data-matrix-play]").getAttribute("aria-pressed")==="false"')
  for (const width of [390,320]) {
    await s.send('Emulation.setDeviceMetricsOverride',{width,height:844,deviceScaleFactor:1,mobile:true})
    assert.ok(await s.ev('document.documentElement.scrollWidth <= innerWidth + 1'),`Mobile width ${width}`)
    for(const id of ['introduction','overview','multiplication-size','matrix-multiplication','multiplication-practice','arrays']) {
      await s.ev(`document.getElementById('${id}').scrollIntoView()`); await frame()
      await s.screenshot(`${id}-mobile-${width}`)
    }
  }
  await s.send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true})
  await s.ev('document.querySelector(".ma-result-cell:last-child").scrollIntoView({block:"center"})'); await frame()
  const resultPoint=await s.ev('(()=>{const r=document.querySelector(".ma-result-cell:last-child").getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()')
  await s.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[resultPoint]})
  await s.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]})
  await s.waitFor('document.querySelector("[data-match-status]").textContent==="Row 2 of A × column 4 of B"')
  await s.ev('document.getElementById("matrix-multiplication").scrollIntoView()'); await frame()
  const point = await s.ev('(()=>{const r=document.querySelector("[data-walkthrough-next]").getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()')
  await s.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[point]})
  await s.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]})
  await s.waitFor('document.querySelector("[data-walkthrough-status]").textContent.includes("Step 2 of 8")')
  await s.send('Emulation.setEmulatedMedia',{media:'print'})
  assert.equal(await s.ev('[...document.querySelectorAll("[data-walkthrough-step]")].filter(e=>getComputedStyle(e).display!=="none").length'),8)
  await s.send('Emulation.setEmulatedMedia',{media:''})
  await s.send('Emulation.setScriptExecutionDisabled',{value:true})
  await s.send('Page.reload')
  await sleep(500)
  assert.equal(await s.ev('document.querySelector("[data-walkthrough-controls]").hidden'),true)
  assert.equal(await s.ev('document.querySelectorAll("[data-walkthrough-step]:not([hidden])").length'),8)
  assert.ok(await s.ev('document.querySelector("#matrix-multiplication").textContent.includes("23 wraps")'))
  assert.equal(await s.ev('document.querySelectorAll("[data-match-grid=result] span").length'),8,'Static result grid remains without JavaScript')
  assert.equal(await s.ev('document.querySelector("[data-match-instruction]").hidden'),true)
  await s.send('Emulation.setScriptExecutionDisabled',{value:false})
  assert.deepEqual(s.errors.filter(error=>!error.includes('/favicon.ico')),[])
} finally {
  mkdirSync('.raid-checks/matrices',{recursive:true})
  writeFileSync('.raid-checks/matrices/report.json',JSON.stringify({report,failures,errors:s.errors},null,2))
  await s.close()
}
assert.deepEqual(failures,[],'Teaching slides fit without overflow')
console.log('PASS: lesson slides, all walkthrough states, playback/reduced motion, keyboard/touch, mobile, static/print, generators, quiz and saved drafts.')
