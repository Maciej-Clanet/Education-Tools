import assert from 'node:assert/strict'
import {createBrowserSession} from './helpers/browser-session.mjs'
process.env.FLEXBOX_TEST_ORIGIN||='http://127.0.0.1:8765'
process.env.FLEXBOX_CDP_ORIGIN||='http://127.0.0.1:9229'
process.env.FLEXBOX_SCREENSHOTS||='.raid-checks/representation'
const s=await createBrowserSession({lessonPath:'/pages/topics/bitmap-image-storage.html',readyExpression:'document.querySelector("[data-gradient-ready]")'})
const frame=()=>s.ev('new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))')
const click=async selector=>{await s.click(selector);await frame()}
const goto=async id=>{for(let i=0;i<40;i++){if(await s.ev(`location.hash===${JSON.stringify('#'+id)}`))return;await click('[data-action=next-slide]')}throw new Error('Slide not reached: '+id)}
const fits=async id=>{const b=await s.ev(`(()=>{const e=document.getElementById(${JSON.stringify(id)});return {h:e.clientHeight,sh:e.scrollHeight,w:e.clientWidth,sw:e.scrollWidth}})()`);assert.ok(b.sh<=b.h+2,`${id}: ${b.sh}/${b.h} vertical`);assert.ok(b.sw<=b.w+2,`${id}: ${b.sw}/${b.w} horizontal`)}
try{
 await s.send('Runtime.enable');await s.send('Log.enable');await s.send('Page.enable')
 await s.send('Emulation.setDeviceMetricsOverride',{width:1366,height:768,deviceScaleFactor:1,mobile:false})
 await s.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]})
 await s.load()
 if(await s.ev('document.body.classList.contains("teacher-mode-active")'))await click('[data-action=exit-teacher-mode]')
 const oldArtwork=await s.ev(`['education-tools:lesson-image-storage-bitmap-builder','education-tools:lesson-image-storage-bitmap-builder-v3'].map(k=>localStorage.getItem(k))`)
 assert.equal(await s.ev('document.querySelectorAll("[data-bitmap-builder],[data-paint-pixel],#encode-rows [data-walkthrough-next],#decode-rows [data-walkthrough-next]").length'),0)
 assert.equal(await s.ev('document.querySelectorAll("[data-vector-zoom] button").length'),3)
 await click('[data-bitmap-locator] [data-pixel="0"]')
 assert.match(await s.text('[data-position]'),/Row 1, column 1: white/)
 assert.equal(await s.text('[data-gradient-values]'),'4')
 const reference=await s.ev('document.querySelector("[data-gradient-reference]").innerHTML')
 await click('[data-action=toggle-teacher-mode]')
 await goto('bit-depth-gradient')
 for(const depth of [1,2,4,8]){
  await click(`[data-gradient-depth="${depth}"]`)
  assert.equal(await s.text('[data-gradient-values]'),String(2**depth))
  assert.equal(await s.ev('document.querySelectorAll("[data-gradient-selected] rect").length'),256)
  assert.equal(await s.ev('new Set([...document.querySelectorAll("[data-gradient-selected] rect")].map(e=>e.getAttribute("fill"))).size'),2**depth)
  assert.equal(await s.ev('document.querySelector("[data-gradient-reference]").innerHTML'),reference)
  await fits('bit-depth-gradient')
 }
 await s.screenshot('bitmap-revised-gradient-eight')
 await s.ev('document.querySelector("[data-gradient-depth]").focus()')
 const slideBefore=await s.text('[data-role=slide-status]')
 await s.send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,text:'\r'})
 await s.send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13})
 assert.equal(await s.text('[data-role=slide-status]'),slideBefore)
 assert.equal(await s.text('[data-gradient-values]'),'2')
 await goto('vector-images');await click('#vector-images [data-walkthrough-next]');await click('#vector-images [data-walkthrough-next]');await fits('vector-images')
 await goto('vector-tool')
 const sources=await s.ev('[...document.querySelectorAll("[data-scaled-badge]")].map(e=>e.src)')
 for(const scale of [4,12,8]){await click(`[data-zoom="${scale}"]`);assert.equal(await s.ev('document.querySelector("[data-scaled-badge]").getBoundingClientRect().width'),24*scale);await fits('vector-tool')}
 assert.deepEqual(await s.ev('[...document.querySelectorAll("[data-scaled-badge]")].map(e=>e.src)'),sources)
 await goto('vector-benefits');await fits('vector-benefits');await s.screenshot('bitmap-revised-vector-benefits')
 await goto('vector-limits');await fits('vector-limits')
 await goto('use-contexts');await fits('use-contexts');await s.screenshot('bitmap-revised-contexts')
 await goto('choosing')
 await s.input('[data-paired-scenario="museum-photo"] [data-choice="type"]','bitmap')
 await s.input('[data-paired-scenario="museum-photo"] [data-choice="reason"]','detail')
 await click('[data-paired-scenario="museum-photo"] [data-check-pair]');await fits('choosing')
 assert.match(await s.text('[data-paired-scenario="museum-photo"] [data-pair-feedback]'),/fits the photograph/)
 await s.load()
 assert.equal(await s.text('[data-gradient-values]'),'4')
 assert.deepEqual(await s.ev(`['education-tools:lesson-image-storage-bitmap-builder','education-tools:lesson-image-storage-bitmap-builder-v3'].map(k=>localStorage.getItem(k))`),oldArtwork)
 assert.deepEqual(s.errors.filter(e=>!e.includes('favicon.ico')),[])
 console.log('PASS bitmap revision: removed coding activities; gradient presets/held dimensions/keyboard/reset; vector steps/zoom/benefits/limits/contexts; scenario feedback; old artwork untouched')
}finally{await s.close()}
