// Isolated profile and local origin only; see docs/testing.md.
import assert from 'node:assert/strict'
import { createBrowserSession } from './helpers/browser-session.mjs'
const s = await createBrowserSession({
  lessonPath:'/pages/topics/binary-arithmetic.html?context=btec-level-3-unit-2',
  readyExpression:'document.querySelectorAll(".ba-demo").length === 5',
})
const key = 'education-tools:lesson-binary-arithmetic-practice'
const frame = () => s.ev('new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))')
const card = type => `[data-practice-type="${type}"]`
const saved = () => s.ev(`JSON.parse(localStorage.getItem('${key}'))`)
const demo = id => `#${id} .ba-demo`
const action = (id, name) => `${demo(id)} [data-demo-action=${name}]`
const settled = id => s.waitFor(`!document.querySelector('${demo(id)}').hasAttribute('aria-busy')`)
const fit = async id => {
  const size = await s.ev(`(()=>{const e=document.getElementById('${id}');return [e.scrollWidth,e.clientWidth,e.scrollHeight,e.clientHeight]})()`)
  assert.ok(size[0] <= size[1]+1 && size[2] <= size[3]+1, `${id} fits slide: ${size}`)
}
try {
  await s.send('Page.enable'); await s.send('Runtime.enable'); await s.send('Log.enable')
  await s.send('Emulation.setDeviceMetricsOverride',{width:1366,height:768,deviceScaleFactor:1,mobile:false})
  await s.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]})
  await s.load()
  await s.ev(`localStorage.removeItem('education-tools:lesson-preferences'); const p=JSON.parse(localStorage.getItem('${key}'));
    p.multiplication={task:{type:'multiplication',first:15,second:5,answer:75,width:7},inputValue:'1001011',status:'correct',message:'Correct.'};
    p.division={task:{type:'division',first:75,second:5,answer:15,width:7},workingVersion:2,inputValue:'1111',status:'correct',message:'Correct.'};
    p.bcd={task:{type:'bcd',first:9,second:9,answer:18,width:8},inputValue:'0001 1000',status:'correct',message:'Correct.'};
    localStorage.setItem('${key}',JSON.stringify(p));`)
  await s.load()
  for (const [type, cell, value] of [['multiplication','carry-0','10'],['division','0-current','101'],['bcd','raw-0','1']]) {
    const selector = `${card(type)} [data-scratch-key="${cell}"]`
    await s.ev(`document.querySelector('${selector}').scrollIntoView(); document.querySelector('${selector}').focus()`)
    for (const bit of value) await s.send('Input.insertText',{text:bit})
    assert.equal(await s.ev(`document.activeElement === document.querySelector('${selector}')`),true)
    assert.equal((await saved())[type].scratch[cell],value)
  }
  const snapshot = await saved()
  await s.load()
  assert.deepEqual(await saved(), snapshot, 'All scratch work and answers survive a reload')
  for (const type of ['multiplication','division','bcd']) {
    assert.equal((await saved())[type].status,'correct','Scratch edits do not change answer grading')
  }
  await s.click(`${card('multiplication')} [data-scratch-clear]`)
  const cleared = await saved()
  assert.deepEqual(cleared.multiplication.scratch,{})
  assert.equal(cleared.multiplication.inputValue,snapshot.multiplication.inputValue)
  assert.deepEqual(cleared.division,snapshot.division)
  assert.deepEqual(cleared.bcd,snapshot.bcd)

  await s.ev('scrollTo(0,0)')
  if (!await s.ev('document.body.classList.contains("teacher-mode-active")')) await s.click('[data-action=toggle-teacher-mode]')
  const total = Number((await s.text('[data-role=slide-status]')).match(/of (\d+)/)[1])
  for (let i=1;i<total;i++) await s.click('[data-action=prev-slide]')
  for (let slide=1;slide<=total;slide++) {
    await frame()
    const id = await s.ev('decodeURIComponent(location.hash.slice(1))')
    if (await s.ev(`!!document.querySelector('#${id} .ba-demo')`)) {
      const slideStatus = await s.text('[data-role=slide-status]')
      // Real keyboard activation must step the tool, not the presentation.
      await s.ev(`document.querySelector('${action(id,'next')}').focus()`)
      await s.send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13})
      await s.send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13})
      assert.equal(await s.text('[data-role=slide-status]'),slideStatus)
      await settled(id)
      await s.click(action(id,'reset'))
      let checkedMotion = false
      while (await s.ev(`document.querySelector('${action(id,'next')}').getAttribute('aria-disabled') !== 'true'`)) {
        await s.click(action(id,'next'))
        const moving = await s.ev(`!!document.querySelector('${demo(id)} .ba-moving-token')`)
        if (moving && !checkedMotion) {
          assert.ok(await s.ev(`document.querySelector('${demo(id)} .ba-moving-token').getAnimations()[0].effect.getTiming().duration > 0`),'Teaching motion survives reduced motion preference')
          await frame(); await s.screenshot(`tool-${id}-moving`)
          // Reset cancels the in-flight movement and does not change learner work.
          await s.click(action(id,'reset'))
          assert.equal(await s.ev(`document.querySelector('${demo(id)}').dataset.step`),'0')
          assert.equal(await s.ev(`document.querySelectorAll('${demo(id)} .ba-moving-token').length`),0)
          checkedMotion = true
          continue
        }
        await settled(id)
        await fit(id)
      }
      assert.ok(checkedMotion)
      await s.screenshot(`tool-${id}-finished`)
      const final = await s.text(`${demo(id)} .ba-demo-explanation`)
      if(id==='borrow-chain') assert.match(final,/0101/)
      if(id==='division-by-101') assert.match(final,/11001.*101.*101, remainder 0/)
      if(id==='division-remainder') assert.match(final,/remainder 1/)
      await s.click(action(id,'previous'))
      assert.notEqual(await s.ev(`document.querySelector('${demo(id)}').dataset.phase`),'done')
      await s.click(action(id,'reset'))
      await s.click(action(id,'next'))
      assert.equal(await s.ev(`document.querySelector('${demo(id)}').dataset.step`),'1')
      await settled(id)
      await s.click(action(id,'reset'))
    }
    if (['multiplication-practice','division-practice','bcd-practice'].includes(id)) {
      await fit(id)
      await s.screenshot(`tool-${id}-largest`)
    }
    if(slide<total) await s.click('[data-action=next-slide]')
  }
  assert.deepEqual(await saved(),cleared,'Demonstration controls leave all learner work intact')
  await s.click('[data-action=exit-teacher-mode]')
  for (const width of [390,320]) {
    await s.send('Emulation.setDeviceMetricsOverride',{width,height:844,deviceScaleFactor:1,mobile:true})
    await frame()
    assert.ok(await s.ev('document.documentElement.scrollWidth <= innerWidth+1'))
    for (const id of ['subtraction','division-by-101','multiplication-practice','division-practice','bcd-practice']) {
      await s.ev(`document.getElementById('${id}').scrollIntoView()`)
      await frame(); await s.screenshot(`tool-${width}-${id}`)
      assert.ok(await s.ev(`[...document.querySelectorAll('#${id} table')].filter(e=>e.getBoundingClientRect().width).every(e=>e.scrollWidth<=e.clientWidth+1)`))
    }
  }
  await s.ev(`document.querySelector('${action('subtraction','next')}').scrollIntoView({block:'center'})`)
  await frame()
  const point = await s.ev(`(()=>{const r=document.querySelector('${action('subtraction','next')}').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()`)
  await s.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[point]})
  await s.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]})
  await s.waitFor(`document.querySelector('${demo('subtraction')}').dataset.step === '1'`)
  for (const type of ['multiplication','division','bcd']) {
    const before = await saved()
    await s.click(`${card(type)} [data-practice-action=new-question]`)
    const after = await saved()
    assert.equal(after[type].inputValue,'')
    assert.equal(after[type].scratch,undefined)
    for (const other of Object.keys(before).filter(other=>other!==type)) assert.deepEqual(after[other],before[other])
  }
  await s.send('Emulation.setEmulatedMedia',{media:'print'})
  assert.ok(await s.ev('[...document.querySelectorAll(".ba-static-method")].every(e=>getComputedStyle(e).display!=="none")'),'Printed methods remain visible')
  assert.ok(await s.ev('[...document.querySelectorAll(".ba-demo")].every(e=>getComputedStyle(e).display==="none")'))
  assert.deepEqual(s.errors.filter(e=>!e.includes('favicon.ico')),[])
  console.log('Passed: all demonstration steps, reduced-motion teaching animation, reset during motion, keyboard controls, independent saved scratch tables, largest generated questions, phone layouts and print fallback.')
} finally { await s.close() }
