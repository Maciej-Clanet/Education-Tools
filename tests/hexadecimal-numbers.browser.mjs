// Use an isolated browser profile and local origin; setup: docs/testing.md.
import assert from 'node:assert/strict'
import { mkdirSync, writeFileSync } from 'node:fs'
import { createBrowserSession } from './helpers/browser-session.mjs'

const lessonPath = '/pages/topics/hexadecimal-numbers.html?context=btec-level-3-unit-2'
const ready = 'document.querySelector(".hx-row-choice") && document.querySelector(".live-code__iframe") && document.querySelector("[data-role=lesson-sequence]").children.length'
const s = await createBrowserSession({ lessonPath, readyExpression: ready })
const frame = () => s.ev('new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))')
const store = key => s.ev(`JSON.parse(localStorage.getItem('education-tools:${key}'))`)
const report = [], failures = []
const key = async (key, code, windowsVirtualKeyCode) => {
  await s.send('Input.dispatchKeyEvent', {type:'keyDown',key,code,windowsVirtualKeyCode,text:key==='Enter'?'\r':key===' '?' ':undefined})
  await s.send('Input.dispatchKeyEvent', {type:'keyUp',key,code,windowsVirtualKeyCode})
}
try {
  await s.send('Page.enable'); await s.send('Page.bringToFront'); await s.send('Runtime.enable'); await s.send('Log.enable')
  await s.send('Emulation.setDeviceMetricsOverride', {width:1366,height:768,deviceScaleFactor:1,mobile:false})
  await s.send('Emulation.setEmulatedMedia', {features:[{name:'prefers-reduced-motion',value:'reduce'}]})
  await s.load()
  await s.ev(`localStorage.clear();
    localStorage.setItem('education-tools:lesson-hexadecimal-numbers-quiz-v3',JSON.stringify({answers:{q1:'b'},lastScore:1}));
    localStorage.setItem('education-tools:lesson-hexadecimal-numbers-exam-practice',JSON.stringify({'question-1':'Keep my explanation.','retired-prompt':'Keep my retired draft.'}));
    localStorage.setItem('education-tools:lesson-hexadecimal-practice',JSON.stringify({mode:'hexToBinary',value:165,answer:'1010',feedback:'Type your answer, then check it.',checked:null}));
    localStorage.setItem('education-tools:lesson-hexadecimal-nibble-explorer',JSON.stringify({digit:'D'}));`)
  await s.load()
  assert.equal(await s.ev('document.querySelector("input[name=q1]:checked").value'), 'b')
  assert.equal(await s.ev('document.querySelector("[data-exam-response=question-1]").value'), 'Keep my explanation.')
  assert.equal(await s.ev('document.querySelector("[data-role=practice-answer]").value'), '', 'Retired answers must not attach to new questions')
  assert.equal((await store('lesson-hexadecimal-practice')).answer, '1010')
  assert.equal(await s.ev('document.querySelector("[data-practice-mode][aria-selected=true]").dataset.practiceMode'), 'binaryToHex', 'Start with the first binary tab')
  await s.ev(`localStorage.setItem('education-tools:lesson-hexadecimal-practice-v2',JSON.stringify({mode:'hexToDenary',questions:{hexToDenary:{value:165,answer:'160',checked:null},denaryToHex:{value:47,answer:'',checked:null}}}))`)
  await s.load()
  assert.equal(await s.ev('document.querySelector("[data-role=practice-answer]").value'), '160')
  assert.deepEqual(await s.ev(`(() => {const ids=[...document.querySelectorAll('[id]')].map(e=>e.id);return ids.filter((id,i)=>ids.indexOf(id)!==i)})()`), [])
  assert.deepEqual(await s.ev(`[...document.querySelectorAll('a[href^="#"]')].map(e=>e.hash.slice(1)).filter(id=>id&&!document.getElementById(id))`), [])
  const tables = await s.ev(`[...document.querySelectorAll('[data-hex-table]')].map(t=>[...t.tBodies[0].rows].map(r=>[...r.cells].map(c=>c.textContent.trim())))`)
  assert.equal(tables.length, 3)
  for (const rows of tables) assert.deepEqual(rows, Array.from({length:16},(_,n)=>[String(n),n.toString(2).padStart(4,'0'),n.toString(16).toUpperCase()]))
  const comparisons = await s.ev(`[...document.querySelectorAll('.hx-comparison article')].map(e=>({binary:e.querySelector('code').textContent,hex:e.querySelector('strong').textContent}))`)
  for (const item of comparisons) assert.equal(parseInt(item.binary,2),parseInt(item.hex,16))
  assert.equal(parseInt(comparisons[1].hex,16)-parseInt(comparisons[0].hex,16),2)

  // Whole rows are pointer targets; the plain denary cell supports native keyboard activation.
  await s.click('#nibbles tbody tr:nth-child(11) td:nth-child(3)')
  assert.equal(await s.ev('document.querySelector("#nibbles tbody tr:nth-child(11) button").getAttribute("aria-pressed")'), 'true')
  await s.ev('document.querySelector("#nibbles tbody tr:nth-child(16) button").focus()')
  await key('Enter','Enter',13)
  assert.equal(await s.ev('document.querySelectorAll("#nibbles .is-selected").length'), 1)
  assert.equal(await s.ev('document.querySelector("#nibbles tbody tr:nth-child(16) button").getAttribute("aria-pressed")'), 'true')
  await key(' ','Space',32)
  assert.equal(await s.ev('document.querySelectorAll("#nibbles .is-selected").length'), 0)

  const draftSelector = '[data-exam-response=hex-denary-3a-total]'
  await s.input(draftSelector, '58', 'input')
  await s.input('[data-role=practice-answer]', '165', 'input')
  await s.click('[data-action=check-practice]')
  assert.match(await s.text('[data-role=practice-feedback]'), /Correct/)
  await s.load()
  assert.equal(await s.ev(`document.querySelector('${draftSelector}').value`), '58')
  assert.equal((await store('lesson-hexadecimal-numbers-exam-practice'))['retired-prompt'], 'Keep my retired draft.')
  assert.deepEqual(await store('lesson-hexadecimal-nibble-explorer'), {digit:'D'})
  assert.match(await s.text('[data-role=practice-feedback]'), /Correct/)
  await s.click('[data-action=new-practice]')
  assert.equal((await store('lesson-hexadecimal-numbers-exam-practice'))['hex-denary-3a-total'], '58')
  // Tabs retain separate drafts; generated questions stay in the chosen direction.
  const denaryTab = '[data-practice-mode=hexToDenary]'
  const hexTab = '[data-practice-mode=denaryToHex]'
  await s.click(hexTab)
  assert.equal(await s.text('[data-role=practice-question]'), '47')
  for (const answer of ['2G', '2F.0', '']) {
    await s.input('[data-role=practice-answer]', answer, 'input')
    await s.click('[data-action=check-practice]')
    assert.ok(await s.ev('document.querySelector("[data-role=practice-feedback]").classList.contains("is-incorrect")'))
  }
  await s.input('[data-role=practice-answer]', '0x2f', 'input')
  await s.click('[data-action=check-practice]')
  assert.match(await s.text('[data-role=practice-feedback]'), /Correct.*47 denary = 2F hex/)
  await s.click(denaryTab)
  const denaryQuestion = await s.text('[data-role=practice-question]')
  for (const answer of ['', '12abc', '0xA5', '1e2']) {
    await s.input('[data-role=practice-answer]', answer, 'input')
    await s.click('[data-action=check-practice]')
    assert.ok(await s.ev('document.querySelector("[data-role=practice-feedback]").classList.contains("is-incorrect")'))
  }
  await s.input('[data-role=practice-answer]', String(parseInt(denaryQuestion,16)), 'input')
  await s.click('[data-action=check-practice]')
  assert.match(await s.text('[data-role=practice-feedback]'), /Correct/)
  await s.click(hexTab)
  assert.equal(await s.ev('document.querySelector("[data-role=practice-answer]").value'), '0x2f')
  await s.load()
  assert.equal(await s.ev('document.querySelector("[data-practice-mode][aria-selected=true]").dataset.practiceMode'), 'denaryToHex')
  assert.equal(await s.ev('document.querySelector("[data-role=practice-answer]").value'), '0x2f')
  for (let i=0;i<4;i++) {
    const before = await s.text('[data-role=practice-question]')
    await s.click('[data-action=new-practice]')
    assert.equal((await store('lesson-hexadecimal-practice-v2')).mode, 'denaryToHex')
    assert.notEqual(await s.text('[data-role=practice-question]'), before)
    assert.match(await s.text('[data-role=practice-question]'), /^\d+$/)
  }
  await s.ev('document.querySelector("[data-practice-mode=denaryToHex]").focus()')
  await key('ArrowLeft','ArrowLeft',37)
  assert.equal(await s.ev('document.activeElement.dataset.practiceMode'), 'hexToDenary')
  assert.equal(await s.text('[data-role=practice-question]'), denaryQuestion)
  assert.equal(await s.ev('document.querySelector("[data-role=practice-answer]").value'), String(parseInt(denaryQuestion,16)))
  await s.click('[data-action=new-practice]')
  assert.equal((await store('lesson-hexadecimal-practice-v2')).mode, 'hexToDenary')
  assert.notEqual(await s.text('[data-role=practice-question]'), denaryQuestion)
  assert.equal((await store('lesson-hexadecimal-practice')).answer, '1010', 'Keep the legacy store')
  // Add the two binary modes without losing existing denary drafts.
  const denaryDrafts = (await store('lesson-hexadecimal-practice-v2')).questions
  await s.ev(`(() => {
    const saved=JSON.parse(localStorage.getItem('education-tools:lesson-hexadecimal-practice-v2'));
    saved.questions.binaryToHex={value:165,answer:'',checked:null};
    saved.questions.hexToBinary={value:47,answer:'',checked:null};
    localStorage.setItem('education-tools:lesson-hexadecimal-practice-v2',JSON.stringify(saved));
  })()`)
  await s.load()
  assert.deepEqual(await s.ev('[...document.querySelectorAll("[data-practice-mode]")].map(t=>t.dataset.practiceMode)'), ['binaryToHex','hexToBinary','hexToDenary','denaryToHex'])
  await s.click('[data-practice-mode=binaryToHex]')
  assert.equal(await s.text('[data-role=practice-question]'), '1010 0101')
  await s.input('[data-role=practice-answer]', 'A6', 'input')
  await s.click('[data-action=check-practice]')
  assert.ok(await s.ev('document.querySelector("[data-role=practice-feedback]").classList.contains("is-incorrect")'))
  await s.input('[data-role=practice-answer]', 'a5', 'input')
  await s.click('[data-action=check-practice]')
  assert.match(await s.text('[data-role=practice-feedback]'), /Correct.*1010 0101 binary = A5 hex/)
  await s.click('[data-practice-mode=hexToBinary]')
  assert.equal(await s.text('[data-role=practice-question]'), '2F')
  for(const answer of ['101111','0010 1112','0010 11110','']) {
    await s.input('[data-role=practice-answer]', answer, 'input')
    await s.click('[data-action=check-practice]')
    assert.ok(await s.ev('document.querySelector("[data-role=practice-feedback]").classList.contains("is-incorrect")'))
  }
  for(const answer of ['00101111','0010 1111']) {
    await s.input('[data-role=practice-answer]', answer, 'input')
    await s.click('[data-action=check-practice]')
    assert.match(await s.text('[data-role=practice-feedback]'), /Correct.*2F hex = 0010 1111 binary/)
  }
  await s.load()
  assert.equal(await s.ev('document.querySelector("[data-practice-mode][aria-selected=true]").dataset.practiceMode'), 'hexToBinary')
  assert.equal(await s.ev('document.querySelector("[data-role=practice-answer]").value'), '0010 1111')
  await s.click('[data-practice-mode=binaryToHex]')
  assert.equal(await s.ev('document.querySelector("[data-role=practice-answer]").value'), 'a5')
  for(const mode of ['binaryToHex','hexToBinary']) {
    await s.click(`[data-practice-mode=${mode}]`)
    const before=await s.text('[data-role=practice-question]')
    await s.click('[data-action=new-practice]')
    assert.equal((await store('lesson-hexadecimal-practice-v2')).mode, mode)
    assert.notEqual(await s.text('[data-role=practice-question]'), before)
    assert.equal(await s.ev('document.querySelector("[data-role=practice-answer]").value'), '')
    assert.match(await s.text('[data-role=practice-question]'), mode==='binaryToHex'?/^[01]{4} [01]{4}$/:/^[0-9A-F]{2}$/)
  }
  const afterBinary=(await store('lesson-hexadecimal-practice-v2')).questions
  assert.deepEqual(afterBinary.hexToDenary,denaryDrafts.hexToDenary)
  assert.deepEqual(afterBinary.denaryToHex,denaryDrafts.denaryToHex)
  await s.ev('document.querySelector("[data-practice-mode=hexToBinary]").focus()')
  await key('Home','Home',36)
  assert.equal(await s.ev('document.activeElement.dataset.practiceMode'),'binaryToHex')
  await key('ArrowLeft','ArrowLeft',37)
  assert.equal(await s.ev('document.activeElement.dataset.practiceMode'),'denaryToHex','Arrow keys wrap across all four tabs')
  await s.click(denaryTab)
  // Hiding the reference must not change a question or answer.
  const beforeHide = await store('lesson-hexadecimal-practice-v2')
  await s.ev('document.querySelector(".hx-workshop-reference summary").focus()')
  await key('Enter','Enter',13)
  assert.equal(await s.ev('document.querySelector(".hx-workshop-reference").open'), false)
  assert.deepEqual(await store('lesson-hexadecimal-practice-v2'), beforeHide)
  await s.click('.hx-workshop-reference summary')
  assert.equal(await s.ev('document.querySelector(".hx-workshop-reference").open'), true)
  // The unchanged quiz still scores and restores, and its reset is isolated.
  await s.ev(`for(const q of document.querySelectorAll('[data-question]'))q.querySelector('input[value="'+q.dataset.answer+'"]').click();document.querySelector('#lesson-quiz').requestSubmit()`)
  assert.match(await s.text('[data-role=quiz-result]'), /10\/10/)
  await s.load()
  assert.equal(await s.ev('document.querySelectorAll("[data-question] input:checked").length'), 10)
  assert.equal((await store('lesson-progress:v1'))['hexadecimal-numbers'].quizVersion, 3)
  await s.click('[data-action=reset-quiz]')
  assert.equal((await store('lesson-hexadecimal-numbers-exam-practice'))['question-1'], 'Keep my explanation.')

  for (const [alias, target] of Object.entries({'compact-binary':'nibbles',converter:'base-sixteen','padding-binary':'binary-to-hex',summary:'mistakes'})) {
    await s.load(lessonPath+'#'+alias)
    assert.equal(await s.ev('location.hash'), '#'+target)
  }
  // Editing uses the existing sandboxed CSS runtime and updates the literal preview.
  await s.click('.live-code__primary-action')
  const css = 'h3 { color: #112233; }\n.card { background-color: #EEDDCC; }\nbutton { background-color: #55AA88; }'
  await s.input('.live-code__editor', css, 'input')
  await s.waitFor('document.querySelector(".live-code__iframe").srcdoc.includes("#112233")')
  // Sandboxed previews run in a separate target; inspect through CDP, not page access.
  const {targetInfos} = await s.send('Target.getTargets')
  const child = targetInfos.find(t=>t.type==='iframe' && t.url==='about:srcdoc')
  const version = await (await fetch(`${process.env.FLEXBOX_CDP_ORIGIN}/json/version`)).json()
  const socket = new WebSocket(version.webSocketDebuggerUrl)
  await new Promise(resolve=>socket.addEventListener('open',resolve,{once:true}))
  let requestId = 0
  const childSend = (method,params={},sessionId) => new Promise((resolve,reject)=>{
    const id=++requestId
    const timer=setTimeout(()=>{socket.removeEventListener('message',receive);reject(new Error('Preview inspection timed out'))},5000)
    function receive(event) {
      const message=JSON.parse(event.data)
      if(message.id!==id)return
      clearTimeout(timer);socket.removeEventListener('message',receive)
      message.error?reject(new Error(JSON.stringify(message.error))):resolve(message.result)
    }
    socket.addEventListener('message',receive)
    socket.send(JSON.stringify({id,method,params,sessionId}))
  })
  try {
    const {sessionId}=await childSend('Target.attachToTarget',{targetId:child.targetId,flatten:true})
    const preview=await childSend('Runtime.evaluate',{expression:'[getComputedStyle(document.querySelector("h3")).color,getComputedStyle(document.querySelector(".card")).backgroundColor,getComputedStyle(document.querySelector("button")).backgroundColor]',returnByValue:true},sessionId)
    assert.deepEqual(preview.result.value,['rgb(17, 34, 51)','rgb(238, 221, 204)','rgb(85, 170, 136)'])
  } finally {socket.close()}
  await s.load()
  assert.ok(!await s.ev('document.querySelector(".live-code__iframe").srcdoc.includes("#112233")'), 'Embedded edits are temporary')

  await s.click('[data-action=toggle-teacher-mode]')
  const total = Number((await s.text('[data-role=slide-status]')).match(/of (\d+)/)[1])
  const expectedFirst = ['overview--opener','overview','compare-values','nibbles']
  for (const [width,height] of [[1366,768],[1920,1080]]) {
    await s.send('Emulation.setDeviceMetricsOverride', {width,height,deviceScaleFactor:1,mobile:false})
    for(let i=1;i<total;i++)await s.click('[data-action=prev-slide]')
    for(let i=1;i<=total;i++) {
      await frame()
      const box = await s.ev(`(() => {const e=document.getElementById(location.hash.slice(1));return {id:e.id,w:e.clientWidth,sw:e.scrollWidth,h:e.clientHeight,sh:e.scrollHeight}})()`)
      report.push({width,height,index:i,...box})
      if(i<=4)assert.equal(box.id,expectedFirst[i-1])
      if(box.sw>box.w+2)failures.push(`${width} slide ${i} ${box.id}: horizontal ${box.sw}/${box.w}`)
      if(box.id!=='quiz'&&box.sh>box.h+2)failures.push(`${width} slide ${i} ${box.id}: vertical ${box.sh}/${box.h}`)
      if(width===1366)await s.screenshot(`hex-${String(i).padStart(2,'0')}`)
      if(box.id==='nibbles') {
        await s.click('#nibbles tbody tr:nth-child(11) td:nth-child(2)')
        assert.equal(await s.ev('location.hash'),'#nibbles','Table use must not advance slides')
        if (width === 1366) {
          const point = await s.ev(`(() => {const r=document.querySelector('#nibbles tbody tr:nth-child(16) td:nth-child(3)').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()`)
          await s.send('Emulation.setTouchEmulationEnabled', {enabled:true})
          await s.send('Input.dispatchTouchEvent', {type:'touchStart',touchPoints:[point]})
          await s.send('Input.dispatchTouchEvent', {type:'touchEnd',touchPoints:[]})
          await s.waitFor('document.querySelector("#nibbles tbody tr:nth-child(16)").classList.contains("is-selected")')
          assert.equal(await s.ev('location.hash'),'#nibbles','Touch selection must not advance slides')
          await s.send('Emulation.setTouchEmulationEnabled', {enabled:false})
        }
      }
      if(i<total)await s.click('[data-action=next-slide]')
    }
  }
  // Check the longer retry message in the classroom layout.
  await s.send('Emulation.setDeviceMetricsOverride',{width:1366,height:768,deviceScaleFactor:1,mobile:false})
  await s.ev(`localStorage.setItem('education-tools:lesson-hexadecimal-practice-v2',JSON.stringify({mode:'hexToDenary',questions:{hexToDenary:{value:165,answer:'160',checked:null}}}))`)
  await s.load()
  for(let i=1;i<19;i++)await s.click('[data-action=next-slide]')
  assert.equal(await s.ev('location.hash'),'#practice-zone')
  await s.click('[data-action=check-practice]')
  assert.match(await s.text('[data-role=practice-feedback]'),/Multiply the left digit/)
  await frame()
  assert.ok(await s.ev('document.querySelector("#practice-zone").scrollHeight <= document.querySelector("#practice-zone").clientHeight + 2'), 'Workshop retry feedback fits')
  await s.screenshot('hex-workshop-retry')
  await s.click('.hx-workshop-reference summary')
  assert.equal(await s.ev('location.hash'),'#practice-zone')
  await s.ev('document.querySelector("[data-practice-mode=hexToDenary]").focus()')
  await key('ArrowRight','ArrowRight',39)
  assert.equal(await s.ev('location.hash'),'#practice-zone','Tab navigation must not advance slides')
  assert.equal(await s.ev('document.activeElement.dataset.practiceMode'), 'denaryToHex')
  await s.click('[data-action=new-practice]')
  await s.input('[data-role=practice-answer]', 'wrong', 'input')
  await s.click('[data-action=check-practice]')
  await frame()
  assert.ok(await s.ev('document.querySelector("#practice-zone").scrollHeight <= document.querySelector("#practice-zone").clientHeight + 2'), 'Reverse direction and collapsed table fit')
  await s.screenshot('hex-workshop-hidden')
  await s.click('.hx-workshop-reference summary')
  for(const mode of ['binaryToHex','hexToBinary']) {
    await s.click(`[data-practice-mode=${mode}]`)
    await s.input('[data-role=practice-answer]', 'wrong', 'input')
    await s.click('[data-action=check-practice]')
    await frame()
    assert.equal(await s.ev('location.hash'),'#practice-zone')
    assert.ok(await s.ev('document.querySelector("#practice-zone").scrollHeight <= document.querySelector("#practice-zone").clientHeight + 2'), `${mode} fits with the table open`)
    await s.screenshot(`hex-workshop-${mode}`)
  }
  // The full-width scratch table is independent of the saved workshop answers.
  const beforeWorking = await store('lesson-hexadecimal-practice-v2')
  assert.equal(await s.ev('document.querySelector(".hx-binary-reference").open'), false)
  assert.deepEqual(await s.ev('[...document.querySelectorAll(".hx-binary-table th")].map(e=>Number(e.textContent))'), [128,64,32,16,8,4,2,1])
  await s.ev('document.querySelector(".hx-binary-reference summary").focus()')
  await key('Enter','Enter',13)
  assert.equal(await s.ev('document.querySelector(".hx-binary-reference").open'), true)
  assert.equal(await s.ev('location.hash'),'#practice-zone')
  assert.ok(await s.ev(`(() => {const table=document.querySelector('.hx-binary-reference').getBoundingClientRect();const workshop=document.querySelector('.hex-practice-layout').getBoundingClientRect();return Math.abs(table.width-workshop.width)<2 && table.top>=workshop.bottom})()`), 'Place-value table spans the width below both workshop columns')
  for(const [index,bit] of [...'00101111'].entries()) await s.input(`.hx-binary-table td:nth-child(${index+1}) input`,bit,'input')
  await s.click('.hx-binary-reference summary')
  await s.click('.hx-binary-reference summary')
  assert.equal(await s.ev('[...document.querySelectorAll("[data-binary-working-bit]")].map(e=>e.value).join("")'),'00101111')
  await s.input('[data-binary-working-bit]', '2', 'input')
  assert.equal(await s.ev('document.querySelector("[data-binary-working-bit]").value'),'')
  await s.click('[data-clear-binary-working]')
  assert.equal(await s.ev('[...document.querySelectorAll("[data-binary-working-bit]")].every(e=>e.value==="")'), true)
  assert.deepEqual(await store('lesson-hexadecimal-practice-v2'),beforeWorking, 'Clearing scratch work must preserve every saved tab')
  await s.send('Emulation.setDeviceMetricsOverride',{width:1920,height:1080,deviceScaleFactor:1,mobile:false})
  await s.ev('document.querySelector("#practice-zone").scrollTop=0')
  await frame()
  await s.screenshot('hex-workshop-binary-working')
  await s.click('[data-action=exit-teacher-mode]')
  for(const width of [390,320]) {
    await s.send('Emulation.setDeviceMetricsOverride',{width,height:844,deviceScaleFactor:1,mobile:true})
    await frame()
    if(await s.ev('document.documentElement.scrollWidth>innerWidth+1'))failures.push(`${width}: student horizontal overflow`)
    await s.ev('document.querySelector("#practice-zone").scrollIntoView()'); await s.screenshot(`hex-mobile-${width}`)
    await s.ev('document.querySelector(".hx-binary-reference").scrollIntoView()'); await s.screenshot(`hex-working-mobile-${width}`)
  }
  // Static content contains the full table, conversion steps and CSS example.
  await s.send('Emulation.setScriptExecutionDisabled',{value:true})
  await s.load(lessonPath,'true')
  assert.equal(await s.ev('document.querySelectorAll("#nibbles tbody tr").length'),16)
  assert.equal(await s.ev('document.querySelectorAll(".hx-method").length'),8)
  await s.ev('document.querySelector(".hx-binary-reference").open=true')
  assert.equal(await s.ev('document.querySelectorAll("[data-binary-working-bit]").length'),8)
  assert.ok(await s.ev('document.querySelector("#uses pre").textContent.includes("#FF8000")'))
  if(await s.ev('document.documentElement.scrollWidth>innerWidth+1'))failures.push('Static mobile horizontal overflow')
  assert.deepEqual(s.errors.filter(e=>!e.includes('favicon.ico')),[])
  if(process.env.FLEXBOX_SCREENSHOTS) {
    mkdirSync(process.env.FLEXBOX_SCREENSHOTS,{recursive:true})
    writeFileSync(`${process.env.FLEXBOX_SCREENSHOTS}/layout.json`,JSON.stringify({report,failures},null,2))
  }
  assert.deepEqual(failures,[],'Classroom and student layouts')
  console.log(`PASS: ${total} slides at 1366×768 and 1920×1080; mobile 390/320; tables, CSS preview, saved work, quiz, aliases and static content.`)
} finally {await s.close()}
