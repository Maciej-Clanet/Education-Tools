// Requires the isolated local test browser, not a user's browsing profile.
import assert from 'node:assert/strict'
import { createBrowserSession } from './helpers/browser-session.mjs'
process.env.FLEXBOX_TEST_ORIGIN ||= 'http://127.0.0.1:8765'
process.env.FLEXBOX_CDP_ORIGIN ||= 'http://127.0.0.1:9229'
process.env.FLEXBOX_SCREENSHOTS ||= '.raid-checks/image-quality'
const s = await createBrowserSession({ lessonPath: '/pages/topics/resolution-bit-depth-and-image-compression.html', readyExpression: 'document.querySelector("[data-quality-controls]").hidden === false && document.querySelector("[data-teacher-opener-slide]")' })
const frame = () => s.ev('new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))')
const click = async selector => { await s.click(selector); await frame() }
const fit = async id => {
  const box = await s.ev(`(()=>{const e=document.getElementById('${id}');return {height:e.clientHeight,scroll:e.scrollHeight,width:e.clientWidth,scrollWidth:e.scrollWidth}})()`)
  if (box.scroll > box.height + 2) await s.screenshot(`overflow-${id}`)
  assert.ok(box.scroll <= box.height + 2, `${id}: ${JSON.stringify(box)}`)
  assert.ok(box.scrollWidth <= box.width + 2, `${id}: horizontal ${JSON.stringify(box)}`)
}
const goto = async id => {
  for (let index=0;index<40;index++) {
    if (await s.ev(`location.hash === '#${id}'`)) return
    await click('[data-action=next-slide]')
  }
  throw new Error(`Could not reach ${id}`)
}
try {
  await s.send('Runtime.enable'); await s.send('Log.enable')
  await s.send('Emulation.setDeviceMetricsOverride',{width:1366,height:768,deviceScaleFactor:1,mobile:false})
  await s.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]})
  await s.load()
  await s.ev("localStorage.removeItem('education-tools:resolution-bit-depth-and-image-compression-teacher-mode')")
  await s.load()
  await click('[data-action=toggle-teacher-mode]')
  await goto('resolution')
  for(const size of [8,32,16]) {
    await click(`[data-resolution-size="${size}"]`)
    assert.match(await s.text('[data-quality-output=resolution]'),new RegExp(String(size*size)))
    assert.equal(await s.ev(`document.querySelector('[data-resolution-size="${size}"]').getAttribute('aria-pressed')`),'true')
    await fit('resolution')
  }
  await click('[data-quality-resolution] [data-quality-reset]')
  assert.match(await s.text('[data-quality-output=resolution]'),/256/)
  await goto('zoom')
  for(const scale of [1,2,3]) {
    await click(`[data-zoom-scale="${scale}"]`)
    assert.equal(await s.ev('document.querySelector("[data-zoom-image]").getBoundingClientRect().width'),64*scale)
    await fit('zoom')
  }
  await click('[data-quality-zoom] [data-quality-reset]')
  await goto('bit-depth-tool')
  for(const depth of [1,2,4,8]) {
    await click(`[data-depth-value="${depth}"]`)
    assert.match(await s.text('[data-quality-output=depth]'),new RegExp(`${2**depth} possible shades`))
    for(const brightness of [0,110,255]) {
      await s.input('[data-shade-input]',brightness,'input'); await frame()
      assert.match(await s.text('[data-quality-output=shade]'),new RegExp(`Source brightness ${brightness}`))
      await fit('bit-depth-tool')
    }
  }
  await click('[data-quality-depth] [data-quality-reset]')
  assert.equal(await s.ev('document.querySelector("[data-shade-input]").value'),'110')
  assert.match(await s.text('[data-quality-output=shade]'),/code 01/)
  await s.screenshot('depth-reset')
  await goto('raw-size')
  for(let step=0;step<3;step++) { await fit('raw-size'); await click('#raw-size [data-walkthrough-next]') }
  await click('#raw-size [data-walkthrough-reset]')
  await goto('photo-size')
  for(let step=0;step<4;step++) { await fit('photo-size'); await click('#photo-size [data-walkthrough-next]') }
  await goto('lossless-runs')
  for(const preset of ['flat','alternating']) {
    await click(`[data-run-preset="${preset}"]`)
    for(let step=0;step<4;step++) { await fit('lossless-runs'); if(step<3) await click('[data-run-next]') }
    assert.equal(await s.ev('document.querySelector("[data-run-original]").textContent'),await s.ev('document.querySelector("[data-run-decoded]").textContent'))
    assert.match(await s.text('[data-quality-output=run-size]'),preset==='flat'?/4 bytes/:/32 bytes/)
    await s.screenshot(`runs-${preset}`)
  }
  await click('[data-quality-runs] [data-quality-reset]')
  assert.match(await s.text('[data-quality-output=run-stage]'),/Step 1 of 4/)
  await goto('lossy-comparison')
  for(const subject of ['photo','diagram']) {
    await click(`[data-compression-subject="${subject}"]`)
    for(const variant of ['source','high','medium','low']) {
      await click(`[data-compression-variant="${variant}"]`)
      await s.ev('Promise.all([...document.querySelectorAll("[data-compression-image]")].map(i=>i.decode()))')
      const sources=await s.ev('[...document.querySelectorAll("[data-compression-image=variant]")].map(i=>i.src)')
      assert.equal(sources[0],sources[1])
      assert.ok(sources[0].includes(subject))
      await fit('lossy-comparison')
    }
    await s.screenshot(`compression-${subject}-low`)
  }
  await click('[data-quality-compression] [data-quality-reset]')
  assert.match(await s.text('[data-quality-output=variant-size]'),/64,526/)
  for(const [scenario,choice,reason] of [['screenshot','lossless','text'],['gallery','lossy','transfer'],['icon','mono','two']]) {
    await goto(`scenario-${scenario}`)
    await s.input(`[data-paired-scenario=${scenario}] [data-choice=type]`,choice)
    await s.input(`[data-paired-scenario=${scenario}] [data-choice=reason]`,reason)
    await click(`[data-paired-scenario=${scenario}] [data-check-pair]`)
    assert.match(await s.text(`[data-paired-scenario=${scenario}] [data-pair-feedback]`),/suitable pair/)
    await fit(`scenario-${scenario}`)
    await click(`[data-paired-scenario=${scenario}] summary`)
    await fit(`scenario-${scenario}`)
  }
  assert.deepEqual(s.errors.filter(error=>!error.includes('favicon.ico')),[])
  console.log('PASS image quality controls: presets, quantisation inspection, exact zoom scales, RLE all stages, asset swaps, resets, scenarios and revealed-state layouts at 1366×768 under reduced motion.')
} finally { await s.close() }
