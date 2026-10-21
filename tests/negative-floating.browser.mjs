// Isolated local profile only: this suite seeds learner storage. See docs/testing.md.
import assert from 'node:assert/strict'
import { mkdirSync, writeFileSync } from 'node:fs'
import { createBrowserSession } from './helpers/browser-session.mjs'

process.env.FLEXBOX_TEST_ORIGIN ||= 'http://127.0.0.1:8765'
process.env.FLEXBOX_CDP_ORIGIN ||= 'http://127.0.0.1:9237'
process.env.FLEXBOX_SCREENSHOTS ||= '.raid-checks/negative-floating'
const id = 'negative-and-floating-point-representation'
const key = `education-tools:lesson-${id}`
const s = await createBrowserSession({ lessonPath:`/pages/topics/${id}.html?context=btec-level-3-unit-2`, readyExpression:'document.querySelectorAll(".nf-player").length === 5 && document.querySelector("[data-teacher-opener-slide]")' })
const frame = () => s.ev('new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))')
const click = async selector => { await s.click(selector); await frame() }
const show = async selector => { await s.ev(`document.querySelector(${JSON.stringify(selector)}).scrollIntoView({block:'center'})`); await frame() }
const failures = [], layouts = []
try {
  await s.send('Runtime.enable'); await s.send('Log.enable'); await s.send('Page.enable')
  await s.send('Emulation.setEmulatedMedia', { features:[{name:'prefers-reduced-motion',value:'reduce'}] })
  await s.send('Emulation.setDeviceMetricsOverride', { width:1366,height:768,deviceScaleFactor:1,mobile:false })
  await s.load()
  await s.ev(`localStorage.removeItem('education-tools:${id}-teacher-mode');localStorage.removeItem('${key}-quiz-v3');localStorage.removeItem('education-tools:lesson-negative-floating-fraction-practice-v1');localStorage.setItem('${key}-quiz',JSON.stringify({answers:{q1:'b',q2:'a'},lastScore:5}));localStorage.setItem('${key}-exam-practice',JSON.stringify({'question-1':'Earlier negative answer','question-2':'Earlier sensor answer','fraction-value-v3':'Original fraction draft'}));localStorage.setItem('education-tools:lesson-negative-floating-twos-practice',JSON.stringify({task:{type:'encode',value:-18,bits:'11101110'},tableValues:{magnitude:[...'00010010'],inverted:[...'11101101'],addOne:[...'00000001'],result:[...'11101110']},status:'correct',message:'Saved conversion.'}));`)
  await s.load()
  assert.equal(await s.ev('document.querySelectorAll("[data-question] input:checked").length'),0)
  assert.equal(await s.ev('document.querySelector("[data-exam-response]").value'),'')
  assert.equal(await s.ev('[...document.querySelectorAll("[data-twos-practice-row=result]")].map(e=>e.value).join("")'),'11101110')
  await click('[data-role=twos-practice-form] button[type=submit]')
  assert.match(await s.text('[data-role=twos-practice-feedback]'),/Correct/)
  assert.ok(await s.ev('[...document.querySelectorAll("[data-twos-practice-row=addOne]")].every(e=>e.readOnly && e.tabIndex===-1)'))
  assert.equal(await s.ev('[...document.querySelectorAll("[data-twos-practice-row=addOne]")].map(e=>e.value).join("")'),'00000001')
  assert.match(await s.text('.twos-practice-table thead'),/128.*64.*32.*16.*8.*4.*2.*1/)
  assert.equal(await s.ev('document.querySelectorAll("[data-twos-practice-row=carry]").length'),8)
  await s.input('[data-twos-practice-row=carry][data-twos-practice-index="6"]','1','input')
  await s.input('#fraction-answer','2.625','input')
  await s.input('#float-mantissa-v3','1.011','input')
  await s.input('#negative-method-v3','18 = 00010010. Invert and add one.','input')
  await s.ev(`for(const q of document.querySelectorAll('[data-question]'))q.querySelector('input[value="'+q.dataset.answer+'"]').click();document.querySelector('#lesson-quiz').requestSubmit()`)
  assert.match(await s.text('[data-role=quiz-result]'),/8/)
  await s.load()
  assert.equal(await s.ev('document.querySelector("#fraction-answer").value'),'2.625')
  assert.equal(await s.ev('document.querySelector("#float-mantissa-v3").value'),'1.011')
  assert.match(await s.ev('document.querySelector("#negative-method-v3").value'),/Invert/)
  assert.equal(await s.ev(`JSON.parse(localStorage.getItem('${key}-exam-practice'))['question-1']`),'Earlier negative answer')
  assert.equal(await s.ev(`JSON.parse(localStorage.getItem('${key}-exam-practice'))['question-2']`),'Earlier sensor answer')
  assert.equal(await s.ev(`JSON.parse(localStorage.getItem('${key}-exam-practice'))['fraction-value-v3']`),'Original fraction draft')
  assert.equal(await s.ev('document.querySelectorAll("[data-twos-practice-row=carry]")[6].value'),'1')
  assert.equal(await s.ev("JSON.parse(localStorage.getItem('education-tools:lesson-negative-floating-twos-practice')).legacyTableValues.result.join('')"),'11101110')
  assert.equal(await s.ev(`JSON.parse(localStorage.getItem('${key}-quiz')).lastScore`),5)
  assert.equal(await s.ev('document.querySelectorAll("[data-question] input:checked").length'),8)
  assert.equal(await s.ev(`JSON.parse(localStorage.getItem('education-tools:lesson-progress:v1'))['${id}'].quizVersion`),3)
  assert.equal(await s.ev(`JSON.parse(localStorage.getItem('education-tools:lesson-progress:v1'))['${id}'].correct`),8)
  await click('[data-action=reset-quiz]')
  assert.equal(await s.ev('document.querySelectorAll("[data-question] input:checked").length'),0)
  assert.equal(await s.ev('document.querySelector("#fraction-answer").value'),'2.625')
  await s.input('#fraction-answer','9','input')
  await click('[data-fraction-practice] button[type=submit]')
  assert.match(await s.text('[data-fraction-feedback]'),/Check the places/)
  await s.input('#fraction-answer','2.625','input')
  await click('[data-fraction-practice] button[type=submit]')
  assert.match(await s.text('[data-fraction-feedback]'),/Correct/)
  await click('[data-role=twos-practice-form] button[type=submit]')
  assert.match(await s.text('[data-role=twos-practice-feedback]'),/Correct/)
  await click('[data-fraction-new]')
  assert.equal(await s.ev('document.querySelector("#fraction-answer").value'),'')
  const numerator = await s.ev("JSON.parse(localStorage.getItem('education-tools:lesson-negative-floating-fraction-practice-v1')).numerator")
  assert.notEqual(numerator,21)
  await s.input('#fraction-answer',String(numerator/8),'input')
  await click('[data-fraction-practice] button[type=submit]')
  await s.load()
  assert.equal(await s.ev('document.querySelector("#fraction-answer").value'),String(numerator/8))
  assert.match(await s.text('[data-fraction-feedback]'),/Correct/)
  assert.deepEqual(await s.ev(`(()=>{const ids=[...document.querySelectorAll('[id]')].map(e=>e.id);return ids.filter((v,i)=>ids.indexOf(v)!==i)})()`),[])
  assert.deepEqual(await s.ev(`[...document.querySelectorAll('a[href^="#"]')].map(e=>e.hash.slice(1)).filter(id=>!document.getElementById(id))`),[])

  // All five players: manual boundaries, physical teaching motion, playback, reset and focus.
  for (const kind of ['twos','large','small','decode','scale']) {
    const host = `[data-number-demo=${kind}]`
    await show(host)
    await click(`${host} [data-number-action=reset]`)
    await s.ev(`document.querySelector('${host} [data-number-action=step]').focus()`)
    await s.send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,text:'\r'})
    await s.send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13})
    assert.equal(await s.ev(`document.querySelector('${host}').dataset.step`),'1')
    assert.equal(await s.ev(`document.activeElement.dataset.numberAction`),'step')
    assert.ok(await s.ev(`document.querySelector('${host}').getAnimations({subtree:true}).length > 0`),'Teaching motion survives reduced motion')
    await s.screenshot(`student-${kind}-step`)
    for (let i=0;i<8;i++) await click(`${host} [data-number-action=step]`)
    assert.equal(await s.ev(`document.querySelector('${host} [data-number-action=step]').getAttribute('aria-disabled')`),'true')
    assert.equal(await s.ev(`document.activeElement.dataset.numberAction`),'step')
    if(kind==='twos') assert.equal(await s.ev(`[...document.querySelectorAll('${host} .nf-current-row .nf-bit')].map(e=>e.textContent).join('')`),'11111011')
    await click(`${host} [data-number-action=previous]`)
    assert.equal(await s.ev(`document.querySelector('${host} [data-number-action=step]').getAttribute('aria-disabled')`),'false')
    await click(`${host} [data-number-action=reset]`)
    assert.equal(await s.ev(`document.querySelector('${host}').getAnimations({subtree:true}).length`),0)
    await click(`${host} [data-number-action=play]`)
    await s.waitFor(`Number(document.querySelector('${host}').dataset.step)>0`)
    await click(`${host} [data-number-action=play]`)
    assert.equal(await s.ev(`document.querySelector('${host}').dataset.playing`),'false')
    await click(`${host} [data-number-action=reset]`)
    await click(`${host} [data-number-action=play]`)
    await show('#overview')
    await s.waitFor(`document.querySelector('${host}').dataset.playing==='false'`)
  }
  await show('[data-number-demo=large]')
  await click('[data-number-demo=large] [data-number-action=reset]')
  await click('[data-number-demo=large] [data-number-action=play]')
  await s.waitFor("document.querySelector('[data-number-demo=large]').dataset.step==='3'")
  assert.equal(await s.ev("document.querySelector('[data-number-demo=large]').dataset.playing"),'false')
  await click('[data-number-demo=large] [data-number-action=reset]')
  await click('[data-number-demo=large] [data-number-action=play]')
  const otherTab = await s.send('Target.createTarget',{url:'about:blank'})
  await s.send('Target.activateTarget',{targetId:otherTab.targetId})
  assert.equal(await s.ev('document.hidden'),true)
  await s.waitFor("document.querySelector('[data-number-demo=large]').dataset.playing==='false'")
  assert.equal(await s.ev("document.querySelector('[data-number-demo=large]').dataset.step"),'0')
  await s.send('Target.closeTarget',{targetId:otherTab.targetId})
  await s.send('Page.bringToFront')
  await click('[data-sign="1"]')
  assert.match(await s.text('[data-signed-value]'),/−13.25/)
  await s.input('#nf-exponent-bits',5,'input')
  assert.match(await s.text('[data-allocation-range]'),/-16 to \+15/)
  assert.match(await s.text('[data-allocation-precision]'),/0.125/)
  assert.equal(await s.ev('document.querySelectorAll(".nf-allocation-strip span").length'),10)

  // Classroom layouts: every slide and each changing player state.
  await click('[data-action=toggle-teacher-mode]')
  const total = Number((await s.text('[data-role=slide-status]')).match(/of (\d+)/)[1])
  for (const [width,height] of [[1366,768],[1600,900]]) {
    await s.send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false})
    for(let i=0;i<total;i++) await click('[data-action=prev-slide]')
    for(let index=1;index<=total;index++) {
      const box = await s.ev(`(()=>{const el=document.getElementById(decodeURIComponent(location.hash.slice(1)));return {id:el.id,h:el.clientHeight,sh:el.scrollHeight,w:el.clientWidth,sw:el.scrollWidth}})()`)
      layouts.push({index,width,height,...box})
      if(box.sw>box.w+2) failures.push(`${width}×${height}: ${index} ${box.id} horizontal ${box.sw}/${box.w}`)
      if(box.id!=='quiz'&&box.sh>box.h+2) failures.push(`${width}×${height}: ${index} ${box.id} vertical ${box.sh}/${box.h}`)
      if(width===1366) await s.screenshot(`slide-${String(index).padStart(2,'0')}-${box.id}`)
      const player = await s.ev(`document.getElementById(decodeURIComponent(location.hash.slice(1))).querySelector('[data-number-demo]')?.dataset.numberDemo`)
      if(player) {
        for(let j=0;j<7;j++) {
          await click(`[data-number-demo=${player}] [data-number-action=step]`)
          if (!await s.ev(`(()=>{const el=document.getElementById(decodeURIComponent(location.hash.slice(1)));return el.scrollHeight<=el.clientHeight+2})()`)) failures.push(`${width}×${height}: ${player} step ${j} overflow`)
        }
      }
      if(index<total) await click('[data-action=next-slide]')
    }
  }
  await click('[data-action=exit-teacher-mode]')
  for(const width of [390,320]) {
    await s.send('Emulation.setDeviceMetricsOverride',{width,height:844,deviceScaleFactor:1,mobile:true})
    await frame()
    assert.ok(await s.ev('document.documentElement.scrollWidth<=innerWidth+1'),`${width}px fits`)
    for(const selector of ['#overview','[data-number-demo=twos]','[data-number-demo=large]','#float-storage','#precision','#rounding']) {
      await show(selector)
      await s.screenshot(`mobile-${width}-${selector.replace(/[^a-z]/gi,'')}`)
    }
    await click('[data-number-demo=large] [data-number-action=reset]')
    await show('[data-number-demo=large] [data-number-action=step]')
    const point = await s.ev("(()=>{const r=document.querySelector('[data-number-demo=large] [data-number-action=step]').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()")
    await s.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[point]})
    await s.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]})
    await s.waitFor("document.querySelector('[data-number-demo=large]').dataset.step==='1'")
  }
  // Print exposes every authored method, including the complete point movements.
  await s.send('Emulation.setEmulatedMedia',{media:'print'})
  assert.ok(await s.ev('[...document.querySelectorAll(".nf-static-method")].every(e=>getComputedStyle(e).display!=="none")'))
  assert.ok(await s.ev('[...document.querySelectorAll(".nf-player")].every(e=>getComputedStyle(e).display==="none")'))
  await s.send('Emulation.setEmulatedMedia',{media:''})
  await s.send('Emulation.setScriptExecutionDisabled',{value:true})
  await s.load(`/pages/topics/${id}.html`,'true')
  assert.ok(await s.ev('[...document.querySelectorAll(".nf-static-method")].every(e=>getComputedStyle(e).display!=="none")'))
  assert.ok(await s.ev('document.documentElement.scrollWidth<=innerWidth+1'))
  await s.send('Emulation.setScriptExecutionDisabled',{value:false})
  await s.load()
  await s.ev(`for(const q of document.querySelectorAll('[data-question]'))q.querySelector('input[value="'+q.dataset.answer+'"]').click();document.querySelector('#lesson-quiz').requestSubmit()`)
  const hub = '/pages/units/btec-level-3-unit-2.html'
  const hubReady = 'document.querySelector("[data-topic-progress=C1]").textContent.includes("correct")'
  await s.load(hub,hubReady)
  // Other C1 lessons are untouched in this isolated profile.
  assert.match(await s.text('[data-topic-progress=C1]'),/8\/44 correct/)
  await s.ev(`const map=JSON.parse(localStorage.getItem('education-tools:lesson-progress:v1'));delete map['${id}'];localStorage.setItem('education-tools:lesson-progress:v1',JSON.stringify(map));localStorage.removeItem('${key}-quiz-v3')`)
  await s.load(hub,hubReady)
  assert.match(await s.text('[data-topic-progress=C1]'),/0\/44 correct/)
  assert.deepEqual(s.errors.filter(error=>!error.includes('favicon.ico')),[])
  mkdirSync(process.env.FLEXBOX_SCREENSHOTS,{recursive:true})
  writeFileSync(`${process.env.FLEXBOX_SCREENSHOTS}/layout.json`,JSON.stringify({layouts,failures},null,2))
  assert.deepEqual(failures,[])
  console.log(`PASS: ${total} slides at 1366×768 and 1600×900; 390/320px layouts; animated states, reduced motion, focus, playback, scoring, saved work, print and no-JS.`)
} finally { await s.close() }
