import assert from 'node:assert/strict'
import { createBrowserSession } from './helpers/browser-session.mjs'
import { PRACTICE_TARGET } from '../javascript/data/bitmap-image-model.js'

process.env.FLEXBOX_TEST_ORIGIN ||= 'http://127.0.0.1:8765'
process.env.FLEXBOX_CDP_ORIGIN ||= 'http://127.0.0.1:9229'
process.env.FLEXBOX_SCREENSHOTS ||= '.raid-checks/representation'
const s = await createBrowserSession({ lessonPath:'/pages/topics/bitmap-image-storage.html', readyExpression:'document.querySelector("[data-walkthrough-ready]")' })
const frame=()=>s.ev('new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))')
const click=async selector=>{await s.click(selector);await frame()}
const goto=async id=>{
  for(let i=0;i<30;i++) {
    if(await s.ev(`location.hash===${JSON.stringify('#'+id)}`)) return
    await click('[data-action=next-slide]')
  }
  throw new Error('Slide not reached: '+id)
}
const fits=async id=>{
  const box=await s.ev(`(()=>{const e=document.getElementById(${JSON.stringify(id)});return {h:e.clientHeight,sh:e.scrollHeight,w:e.clientWidth,sw:e.scrollWidth}})()`)
  assert.ok(box.sh<=box.h+2,`${id}: ${box.sh}/${box.h} vertical`)
  assert.ok(box.sw<=box.w+2,`${id}: ${box.sw}/${box.w} horizontal`)
}
try {
  await s.send('Runtime.enable');await s.send('Log.enable');await s.send('Page.enable')
  await s.send('Emulation.setDeviceMetricsOverride',{width:1366,height:768,deviceScaleFactor:1,mobile:false})
  await s.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]})
  await s.load()
  if(await s.ev('document.body.classList.contains("teacher-mode-active")')) await click('[data-action=exit-teacher-mode]')
  const oldArt=await s.ev('localStorage.getItem("education-tools:lesson-image-storage-bitmap-builder")')
  await click('[data-bitmap-locator] [data-pixel="0"]')
  assert.match(await s.text('[data-position]'),/Row 1, column 1: white/)
  await click('[data-one-bit] [data-toggle-bit]')
  assert.equal(await s.text('[data-bit-value]'),'0')
  await click('[data-one-bit] [data-reset]')
  assert.equal(await s.text('[data-bit-value]'),'1')
  await click('[data-palette-demo] [data-toggle-palette]')
  assert.match(await s.text('[data-palette-status]'),/four pixels.*violet/)
  assert.equal(await s.ev('[...document.querySelectorAll("[data-palette-demo] [data-gold-pixel]")].filter(e=>getComputedStyle(e).backgroundColor==="rgb(164, 131, 207)").length'),4)
  await click('[data-palette-demo] [data-reset]')
  await click('[data-clear-art]')
  await click('[data-paint-colour="2"]');await click('[data-paint-pixel="0"]')
  assert.equal(await s.ev('document.querySelector("[data-paint-pixel]").dataset.value'),'2')
  await s.ev('document.querySelector("[data-paint-pixel]").focus();document.activeElement.dispatchEvent(new KeyboardEvent("keydown",{key:"ArrowRight",bubbles:true}))')
  assert.equal(await s.ev('document.activeElement.dataset.paintPixel'),'1')
  await s.load()
  assert.equal(await s.ev('document.querySelector("[data-paint-pixel]").dataset.value'),'2')
  assert.equal(await s.ev('localStorage.getItem("education-tools:lesson-image-storage-bitmap-builder")'),oldArt)
  await click('[data-action=toggle-teacher-mode]')
  await goto('encode-rows')
  for(let i=0;i<3;i++)await click('#encode-rows [data-walkthrough-next]')
  assert.match(await s.text('#encode-rows [data-walkthrough-status]'),/Step 4 of 4/)
  await s.ev('document.querySelector("#encode-rows details").open=true');await frame();await fits('encode-rows')
  await s.screenshot('bitmap-custom-encode-final')
  await goto('decode-rows')
  for(let i=0;i<3;i++)await click('#decode-rows [data-walkthrough-next]')
  await fits('decode-rows');await s.screenshot('bitmap-custom-decode-final')
  await goto('dimensions');await click('[data-width="4"]');await fits('dimensions')
  assert.equal((await s.text('[data-reshape-rows]')).split('\n').length,8)
  await s.screenshot('bitmap-custom-reshape-four')
  await click('[data-bitmap-reshape] [data-reset]')
  await goto('palette');await click('[data-toggle-palette]');await fits('palette')
  await goto('bitmap-builder');await click('[data-clear-art]');await click('[data-check-bitmap]');await fits('bitmap-builder')
  assert.match(await s.text('[data-builder-status]'),/pixels differ/)
  await s.ev(`for(const [i,value] of ${JSON.stringify(PRACTICE_TARGET)}.entries()){document.querySelector('[data-paint-colour="'+value+'"]').click();document.querySelector('[data-paint-pixel="'+i+'"]').click()}`)
  await click('[data-check-bitmap]');assert.match(await s.text('[data-builder-status]'),/Exact match/)
  await fits('bitmap-builder');await s.screenshot('bitmap-custom-builder-complete')
  await goto('vector-images');for(let i=0;i<2;i++)await click('#vector-images [data-walkthrough-next]');await fits('vector-images')
  await goto('vector-tool');await click('[data-zoom="12"]');await fits('vector-tool')
  assert.equal(await s.ev('document.querySelector("[data-scaled-badge]").getBoundingClientRect().width'),288)
  await s.screenshot('bitmap-custom-vector-12')
  await click('[data-vector-zoom] [data-reset]')
  assert.equal(await s.ev('document.querySelector("[data-scaled-badge]").getBoundingClientRect().width'),192)
  await goto('choosing')
  await s.input('[data-paired-scenario="museum-photo"] [data-choice="type"]','bitmap')
  await s.input('[data-paired-scenario="museum-photo"] [data-choice="reason"]','detail')
  await click('[data-paired-scenario="museum-photo"] [data-check-pair]');await fits('choosing')
  assert.match(await s.text('[data-paired-scenario="museum-photo"] [data-pair-feedback]'),/fits the photograph/)
  assert.deepEqual(s.errors.filter(error=>!error.includes('favicon.ico')),[])
  console.log('PASS bitmap tools: encode/decode end states, 4-column reshape, palette, painting, keyboard, persistence, old-work isolation, complete/error feedback, vector zoom and scenario feedback at 1366x768 under reduced motion')
} finally { await s.close() }
