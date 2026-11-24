// Isolated browser only: see docs/testing.md. No learner browser/storage.
import assert from 'node:assert/strict'
import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { createBrowserSession } from './helpers/browser-session.mjs'
import { transmissionScenarios } from '../javascript/data/transmission-scenarios.js'

const slug = 'transmission-methods-synchronous-asynchronous-serial-and-parallel'
const path = `/pages/topics/${slug}.html`
const html = readFileSync(path.slice(1), 'utf8')
const links = [...html.matchAll(/(?:href|src)="([^"#?]+)(?:[?#][^"]*)?"/g)].map(m=>m[1]).filter(x=>!/^https?:/.test(x))
assert.deepEqual(links.filter(x=>!existsSync(resolve(dirname(path.slice(1)),x))), [])
process.env.FLEXBOX_SCREENSHOTS ||= '.raid-checks/transmission'
const s = await createBrowserSession({lessonPath:path,readyExpression:'document.body.dataset.transmissionReady'})
const keys = {quiz:`education-tools:lesson-${slug}-quiz`, drafts:`education-tools:lesson-${slug}-exam-practice`, old:'education-tools:lesson-transmission-method-viewer'}
const quiz = {answers:{q1:'b',q2:'a',q3:'c',q4:'b',q5:'a'},lastScore:5,bestScore:5}
const drafts = {'question-1':'Existing video answer','question-2':'Existing machine answer',retired:'Keep this retired answer'}
const slides=[],report=[],failures=[]
const frame=()=>s.ev('new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))')
const click=async x=>{await s.click(x);await frame()}
const current=async()=>Number((await s.text('[data-role=slide-status]')).match(/Slide (\d+)/)[1])
const goto=async id=>{const n=slides.indexOf(id)+1;assert.ok(n>0,id);while(await current()!==n)await click(`[data-action=${await current()<n?'next-slide':'prev-slide'}]`)}
const fit=async label=>{
  const b=await s.ev(`(()=>{const e=document.getElementById(location.hash.slice(1));return {id:e.id,w:e.clientWidth,sw:e.scrollWidth,h:e.clientHeight,sh:e.scrollHeight}})()`)
  report.push({label,...b});if(b.sw>b.w+2||(!['quiz','exam-practice'].includes(b.id)&&b.sh>b.h+2))failures.push({label,...b})
  await s.screenshot(label);return b.id
}
const storage=key=>s.ev(`JSON.parse(localStorage.getItem(${JSON.stringify(key)}))`)
const keyboard=async selector=>{
  await s.ev(`document.querySelector(${JSON.stringify(selector)}).focus()`)
  for(const type of ['keyDown','keyUp'])await s.send('Input.dispatchKeyEvent',{type,key:' ',code:'Space',windowsVirtualKeyCode:32})
  await frame()
}
try {
  await s.send('Runtime.enable');await s.send('Log.enable')
  await s.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]})
  await s.send('Emulation.setDeviceMetricsOverride',{width:1366,height:768,deviceScaleFactor:1,mobile:false})
  await s.load()
  await s.ev(`localStorage.removeItem('education-tools:${slug}-teacher-mode')`)
  for(const [k,v] of [[keys.quiz,quiz],[keys.drafts,drafts],[keys.old,{mode:'parallel'}]])await s.ev(`localStorage.setItem(${JSON.stringify(k)},${JSON.stringify(JSON.stringify(v))})`)
  await s.load()
  assert.equal(await s.ev('document.querySelectorAll("[data-question] input:checked").length'),5)
  assert.equal(await s.ev('document.querySelector("[data-exam-response=question-1]").value'),drafts['question-1'])
  const audit=await s.ev(`(()=>{const ids=[...document.querySelectorAll('[id]')].map(e=>e.id);return {duplicates:ids.filter((id,i)=>ids.indexOf(id)!==i),missing:[...document.querySelectorAll('[data-section-link]')].filter(a=>!document.querySelector(a.hash)).map(a=>a.hash)}})()`)
  assert.deepEqual(audit,{duplicates:[],missing:[]})
  await click('[data-action=toggle-teacher-mode]')
  const count=Number((await s.text('[data-role=slide-status]')).match(/of (\d+)/)[1])
  for(const [width,height] of [[1366,768],[1920,1080]]){
    await s.send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false})
    while(await current()>1)await click('[data-action=prev-slide]')
    for(let i=1;i<=count;i++){const id=await fit(`slide-${i}-${width}`);if(width===1366)slides.push(id);if(i<count)await click('[data-action=next-slide]')}
  }
  await s.send('Emulation.setDeviceMetricsOverride',{width:1366,height:768,deviceScaleFactor:1,mobile:false})
  for(const id of ['viewer','skew','timing','synchronous','start-stop','selection']){
    await goto(id)
    const root=`#${id}`
    const total=await s.ev(`document.querySelectorAll('${root} [data-walkthrough-step]').length`)
    await click(`${root} [data-walkthrough-prev]`)
    for(let i=0;i<total;i++){
      assert.match(await s.text(`${root} [data-walkthrough-status]`),new RegExp(`Step ${i+1} of ${total}`))
      if(id==='viewer')assert.deepEqual(await s.ev(`[...document.querySelectorAll('${root} [data-walkthrough-step]:not([hidden]) .tm-bits')].map(e=>e.querySelectorAll('.is-filled').length)`),[i,i?4:0])
      if(id==='start-stop')assert.equal(await s.ev(`document.querySelectorAll('${root} [data-walkthrough-step]:not([hidden]) .tm-frame .is-current').length`),i===1?8:1)
      await fit(`${id}-step-${i+1}`);await keyboard(`${root} [data-walkthrough-next]`)
      assert.equal(await s.ev('location.hash'),'#'+id)
    }
    assert.match(await s.text(`${root} [data-walkthrough-status]`),new RegExp(`Step ${total} of ${total}`))
    await click(`${root} [data-walkthrough-reset]`)
    assert.match(await s.text(`${root} [data-walkthrough-status]`),/Step 1 /)
  }
  for(const id of ['data-paths','parallel']){
    await goto(id)
    const host=`#${id} [data-teaching-animation]`
    await s.waitFor(`!document.querySelector('${host}').classList.contains('teaching-animation-paused')`)
    const before=await s.ev(`document.querySelector('${host} .tm-moving').getAnimations()[0].currentTime`)
    await s.ev('new Promise(r=>setTimeout(r,100))')
    assert.ok(await s.ev(`document.querySelector('${host} .tm-moving').getAnimations()[0].currentTime`)>before)
    await keyboard(`${host} button`)
    assert.equal(await s.ev(`getComputedStyle(document.querySelector('${host} .tm-moving')).animationPlayState`),'paused')
    if(id==='data-paths')for(const time of [500,2500,4500,6500]){
      await s.ev(`document.querySelector('${host}').getAnimations({subtree:true}).forEach(a=>a.currentTime=${time})`)
      const visible=await s.ev(`[...document.querySelectorAll('${host} .tm-moving')].filter(e=>Number(getComputedStyle(e).opacity)>.9).map(e=>e.textContent)`)
      assert.deepEqual(visible,['1011'[Math.floor(time/2000)]])
    }
    await keyboard(`${host} button`);await click('[data-action=next-slide]')
    await s.waitFor(`document.querySelector('${host}').classList.contains('teaching-animation-paused')`)
  }
  for(const [id,config] of Object.entries(transmissionScenarios)){
    await goto(id)
    const root=`#${id}`
    await click(`${root} [data-check-pair]`);assert.match(await s.text(`${root} [data-pair-feedback]`),/Choose a method/)
    const [method,reason]=config.acceptedPairs[0]
    await s.input(`${root} [data-choice=type]`,method)
    await s.input(`${root} [data-choice=reason]`,'none')
    // Use an actual wrong option for each task.
    const wrong=await s.ev(`[...document.querySelector('${root} [data-choice=reason]').options].find(o=>o.value&&o.value!=='${reason}').value`)
    await s.input(`${root} [data-choice=reason]`,wrong);await click(`${root} [data-check-pair]`)
    assert.match(await s.text(`${root} [data-pair-feedback]`),/Reconsider/)
    await s.input(`${root} [data-choice=reason]`,reason);await click(`${root} [data-check-pair]`)
    assert.match(await s.text(`${root} [data-pair-feedback]`),/Suitable choice/)
    await s.input(`${root} textarea`,'My reason for '+id,'input');await fit(`${id}-feedback`)
    await click(`${root} [data-reset-pair]`)
    assert.equal(await s.ev(`document.querySelector('${root} textarea').value`),'My reason for '+id)
  }
  await click('[data-action=exit-teacher-mode]');await s.load()
  assert.equal(await s.ev('document.querySelector("#path-choice-draft").value'),'My reason for path-choice')
  assert.equal((await storage(keys.drafts)).retired,drafts.retired)
  assert.equal((await storage(keys.quiz)).bestScore,5)
  assert.deepEqual(await storage(keys.old),{mode:'parallel'})
  for(const width of [390,320]){
    await s.send('Emulation.setDeviceMetricsOverride',{width,height:844,deviceScaleFactor:1,mobile:true})
    assert.ok(await s.ev('document.documentElement.scrollWidth<=innerWidth+1'),`Page fits ${width}`)
    for(const id of ['overview','data-paths','parallel','viewer','skew','timing','synchronous','asynchronous','start-stop','overhead','combine','path-choice']){
      await s.ev(`document.getElementById('${id}').scrollIntoView()`);await frame();await s.screenshot(`${id}-${width}`)
    }
  }
  await s.ev('document.querySelector("#start-stop [data-walkthrough-next]").scrollIntoView({block:"center"})');await frame()
  const pt=await s.ev('(()=>{const r=document.querySelector("#start-stop [data-walkthrough-next]").getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()')
  await s.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[pt]});await s.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]})
  await s.waitFor('document.querySelector("#start-stop [data-walkthrough-status]").textContent.startsWith("Step 2")')
  await s.send('Emulation.setEmulatedMedia',{media:'print'})
  assert.equal(await s.ev('[...document.querySelectorAll("[data-walkthrough-step]")].filter(e=>getComputedStyle(e).display==="none").length'),0)
  assert.equal(await s.ev('getComputedStyle(document.querySelector(".teaching-animation-control")).display'),'none')
  await s.send('Emulation.setEmulatedMedia',{media:''})
  await s.send('Emulation.setScriptExecutionDisabled',{value:true});await s.send('Page.reload');await new Promise(r=>setTimeout(r,500))
  assert.equal(await s.ev('document.querySelectorAll("[data-walkthrough-step][hidden]").length'),0)
  assert.equal(await s.ev('getComputedStyle(document.querySelector(".tm-moving")).animationName'),'none')
  assert.equal(await s.ev('document.querySelector("[data-walkthrough-controls]").hidden'),true)
  await s.send('Emulation.setScriptExecutionDisabled',{value:false})
  assert.deepEqual(s.errors.filter(e=>!e.includes('/favicon.ico')),[])
}finally{
  mkdirSync(process.env.FLEXBOX_SCREENSHOTS,{recursive:true});writeFileSync(`${process.env.FLEXBOX_SCREENSHOTS}/report.json`,JSON.stringify({report,failures,errors:s.errors},null,2));await s.close()
}
assert.deepEqual(failures,[],'All teaching states fit')
console.log('PASS: all slides and walkthrough states, transfer animations, scenario checks and saved drafts, keyboard/touch, mobile, reduced motion, static/print and retained learner work.')
