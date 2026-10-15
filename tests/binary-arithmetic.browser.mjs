// Run with an isolated Chrome profile and local origin; see docs/testing.md.
import assert from 'node:assert/strict'
import { createBrowserSession } from './helpers/browser-session.mjs'

const s = await createBrowserSession({
  lessonPath:'/pages/topics/binary-arithmetic.html?context=btec-level-3-unit-2',
  readyExpression:'document.querySelectorAll(".binary-entry-table").length === 2',
})
const frame = () => s.ev('new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))')
const click = async selector => { await s.click(selector); await frame() }
const card = type => `[data-practice-type="${type}"]`
const practiceKey='education-tools:lesson-binary-arithmetic-practice'
const stored = key => s.ev(`JSON.parse(localStorage.getItem(${JSON.stringify(key)}))`)
const practice = () => stored(practiceKey)
const submit = type => s.ev(`document.querySelector('${card(type)} form').requestSubmit()`)
const failures=[]
const report=[]
try {
  await s.send('Runtime.enable'); await s.send('Log.enable'); await s.send('Page.enable')
  await s.send('Emulation.setDeviceMetricsOverride',{width:1366,height:768,deviceScaleFactor:1,mobile:false})
  await s.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]})
  await s.load()
  await s.ev(`localStorage.clear();
    localStorage.setItem('education-tools:lesson-binary-arithmetic-quiz',JSON.stringify({answers:{q1:'b',q4:'b'},lastScore:5,bestScore:5}));
    localStorage.setItem('education-tools:lesson-binary-arithmetic-exam-practice',JSON.stringify({'question-1':'Saved carry explanation','retired-prompt':'Keep my draft'}));
    localStorage.setItem('education-tools:lesson-progress:v1',JSON.stringify({'binary-arithmetic':{quizVersion:2,correct:5,answered:5,checked:true}}));
    localStorage.setItem('${practiceKey}',JSON.stringify({
      addition:{task:{type:'addition',first:11,second:6,answer:17,width:4},tableValues:{auxiliary:['1','1','1','',''],result:['1','0','0','0','1']},status:'correct',message:'Correct.'},
      subtraction:{task:{type:'subtraction',first:8,second:3,answer:5,width:4},tableValues:{auxiliary:['','1','1','1'],result:['0','1','0','1']},status:'correct',message:'Correct.'},
      multiplication:{task:{type:'multiplication',first:5,second:5,answer:25,width:5},inputValue:'11001',status:'correct',message:'Correct.'},
      division:{task:{type:'division',first:15,second:3,answer:5,width:4},tableValues:{divisionRows:[{quotientBit:'1',remainder:'0011'},{quotientBit:'0',remainder:'0011'},{quotientBit:'1',remainder:'0000'}]},status:'correct',message:'Correct.'},
      bcd:{task:{type:'bcd',first:5,second:7,answer:12,width:8},inputValue:'0001 0010',status:'correct',message:'Correct.'}
    }));`)
  await s.load('/pages/units/btec-level-3-unit-2.html','document.querySelector("[data-quiz-state]")')
  assert.equal(await s.ev(`document.querySelector('a[href*="topics/binary-arithmetic.html"]').closest('.lesson-item').dataset.quizState`),'stale')
  await s.load()
  assert.equal(await s.ev('document.querySelectorAll("[data-question] input:checked").length'),0)
  assert.equal(await s.ev('document.querySelector("[data-exam-response]").value'),'Saved carry explanation')
  const migrated=await practice()
  assert.deepEqual(migrated.subtraction.tableValues.result,['0','1','0','1'])
  assert.deepEqual(migrated.subtraction.legacyTableValues.auxiliary,['','1','1','1'])
  assert.equal(migrated.division.inputValue,'101')
  assert.equal(await s.ev(`document.querySelector('${card('multiplication')} [data-role=practice-answer]').value`),'11001')

  await submit('addition')
  assert.equal((await practice()).addition.status,'correct')
  await submit('subtraction')
  assert.equal((await practice()).subtraction.status,'incorrect','Old borrow markers must not be graded as rewritten digits')
  const subAux = i => `${card('subtraction')} [data-practice-row=auxiliary][data-practice-index="${i}"]`
  for(const [i,value] of ['0','1','1'].entries())await s.input(subAux(i),value,'input')
  await s.ev(`const input=document.querySelector('${subAux(3)}');input.value='';input.focus()`)
  await s.send('Input.insertText',{text:'1'})
  await s.send('Input.insertText',{text:'0'})
  assert.equal(await s.ev(`document.querySelector('${subAux(3)}').value`),'10')
  assert.equal(await s.ev(`document.activeElement===document.querySelector('${subAux(3)}')`),true)
  await s.load()
  assert.equal(await s.ev(`document.querySelector('${subAux(3)}').value`),'10')
  await submit('subtraction')
  assert.equal((await practice()).subtraction.status,'correct')
  await s.input(`${card('subtraction')} [data-practice-row=result][data-practice-index="3"]`,'10','input')
  assert.equal(await s.ev(`document.querySelector('${card('subtraction')} [data-practice-row=result][data-practice-index="3"]').value`),'1','Answer cells remain one bit')
  for(const type of ['multiplication','division','bcd']) {await submit(type);assert.equal((await practice())[type].status,'correct')}
  assert.deepEqual((await practice()).division.tableValues,migrated.division.tableValues)
  await s.input(`${card('division')} [data-role=practice-answer]`,'111','input');await submit('division')
  assert.equal((await practice()).division.status,'incorrect')
  await s.input(`${card('division')} [data-role=practice-answer]`,'101','input');await submit('division')

  for(const [first,second,answer] of [[0,0,'0000'],[3,4,'0111'],[5,7,'0001 0010'],[9,8,'0001 0111'],[9,9,'0001 1000']]) {
    await s.ev(`const p=JSON.parse(localStorage.getItem('${practiceKey}'));p.bcd={task:{type:'bcd',first:${first},second:${second},answer:${first+second},width:8},inputValue:'',status:'empty'};localStorage.setItem('${practiceKey}',JSON.stringify(p))`)
    await s.load()
    await s.input(`${card('bcd')} [data-role=practice-answer]`,answer,'input');await submit('bcd')
    assert.equal((await practice()).bcd.status,'correct',`${first}+${second} BCD`)
  }
  await s.input(`${card('bcd')} [data-role=practice-answer]`,'10010','input');await submit('bcd')
  assert.equal((await practice()).bcd.status,'incorrect','Ordinary binary is not BCD')
  await s.input(`${card('bcd')} [data-role=practice-answer]`,'0001 1000','input');await submit('bcd')

  await s.ev(`for(const q of document.querySelectorAll('[data-question]'))q.querySelector('input[value="'+q.dataset.answer+'"]').click();document.querySelector('#lesson-quiz').requestSubmit()`)
  assert.match(await s.text('[data-role=quiz-result]'),/6\/6/)
  await s.load()
  assert.equal(await s.ev('document.querySelectorAll("[data-question] input:checked").length'),6)
  const savedPractice=await practice()
  await click('[data-action=reset-quiz]')
  assert.equal(await stored('education-tools:lesson-binary-arithmetic-quiz-v3'),null)
  assert.equal((await stored('education-tools:lesson-binary-arithmetic-quiz')).lastScore,5)
  assert.deepEqual(await practice(),savedPractice)
  assert.equal((await stored('education-tools:lesson-binary-arithmetic-exam-practice'))['retired-prompt'],'Keep my draft')
  await s.ev(`for(const q of document.querySelectorAll('[data-question]'))q.querySelector('input[value="'+q.dataset.answer+'"]').click();document.querySelector('#lesson-quiz').requestSubmit()`)
  await click(`${card('subtraction')} [data-practice-action=new-question]`)
  const afterNew=await practice()
  for(const type of ['addition','multiplication','division','bcd'])assert.deepEqual(afterNew[type],savedPractice[type])

  assert.deepEqual(await s.ev(`(()=>{const ids=[...document.querySelectorAll('[id]')].map(e=>e.id);return ids.filter((id,i)=>ids.indexOf(id)!==i)})()`),[])
  assert.deepEqual(await s.ev(`[...document.querySelectorAll('a[href^="#"]')].map(e=>e.getAttribute('href').slice(1)).filter(id=>id&&!document.getElementById(id))`),[])
  await s.ev('scrollTo(0,0)')
  await click('[data-action=toggle-teacher-mode]')
  const total=Number((await s.text('[data-role=slide-status]')).match(/of (\d+)/)[1])
  for(const [width,height] of [[1366,768],[1920,1080]]) {
    await s.send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false})
    for(let i=1;i<total;i++)await click('[data-action=prev-slide]')
    for(let index=1;index<=total;index++) {
      await frame()
      const box=await s.ev(`(()=>{const e=document.getElementById(decodeURIComponent(location.hash.slice(1)));return {id:e.id,h:e.clientHeight,sh:e.scrollHeight,w:e.clientWidth,sw:e.scrollWidth}})()`)
      report.push({width,index,...box})
      if(box.sw>box.w+2 || (box.id!=='quiz' && box.id!=='exam-practice' && box.sh>box.h+2))failures.push({width,index,...box})
      if(width===1366 || ['addition','borrow-chain','multiply-example','division-example','bcd-correction'].includes(box.id))await s.screenshot(`arithmetic-${width}-${String(index).padStart(2,'0')}-${box.id}`)
      if(index<total)await click('[data-action=next-slide]')
    }
  }
  await click('[data-action=exit-teacher-mode]')
  for(const width of [390,320]) {
    await s.send('Emulation.setDeviceMetricsOverride',{width,height:844,deviceScaleFactor:1,mobile:true});await frame()
    assert.ok(await s.ev('document.documentElement.scrollWidth<=innerWidth+1'),`No page overflow at ${width}`)
    const tables=await s.ev(`[...document.querySelectorAll('.binary-entry-table,.ba-table-wrap')].map(e=>({width:e.clientWidth,scrollWidth:e.scrollWidth}))`)
    assert.ok(tables.every(t=>t.scrollWidth<=t.width+1),`Tables fit at ${width}`)
    for(const id of ['borrow-chain','subtraction-practice','division-example','bcd-correction']) {
      await s.ev(`document.getElementById('${id}').scrollIntoView()`);await frame();await s.screenshot(`arithmetic-${width}-${id}`)
    }
  }
  await s.load('/pages/units/btec-level-3-unit-2.html','document.querySelector("[data-quiz-state]")')
  assert.match(await s.ev(`document.querySelector('a[href*="topics/binary-arithmetic.html"]').closest('.lesson-item').querySelector('[data-role=lesson-progress]').title`),/6\/6/)
  await s.send('Emulation.setScriptExecutionDisabled',{value:true})
  await s.load('/pages/topics/binary-arithmetic.html','true')
  assert.ok(await s.ev('[...document.querySelectorAll(".ba-table,.ba-steps")].every(e=>e.getBoundingClientRect().height>0)'),'Worked methods are readable without JS')
  assert.ok(await s.ev('document.documentElement.scrollWidth<=innerWidth+1'))
  assert.deepEqual(s.errors.filter(e=>!e.includes('favicon.ico')),[])
  console.log(JSON.stringify({slides:total,layouts:report.length,failures,passed:'Practice grading, 10 input and reload, retained legacy working, BCD correction branches, quiz persistence/reset/isolation, unit progress, responsive/static layouts'},null,2))
  assert.deepEqual(failures,[])
} finally {await s.close()}
