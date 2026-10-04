// Uses an isolated local test origin/profile; see docs/backup_recovery_lesson.md.
import assert from 'node:assert/strict';
import {createBrowserSession} from './helpers/browser-session.mjs';
process.env.FLEXBOX_TEST_ORIGIN ||= 'http://127.0.0.1:8765';
process.env.FLEXBOX_CDP_ORIGIN ||= 'http://127.0.0.1:9226';
const s=await createBrowserSession({lessonPath:'/pages/topics/raid-and-nas-storage-systems.html',readyExpression:'document.querySelector("[data-read-toggle]")?.hidden===false'});
await s.send('Runtime.enable');await s.send('Log.enable');await s.send('Page.enable');await s.send('Page.bringToFront');
await s.send('Emulation.setDeviceMetricsOverride',{width:1366,height:900,deviceScaleFactor:1,mobile:false});await s.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
const wait=ms=>new Promise(r=>setTimeout(r,ms));
await s.load();await s.ev('document.querySelector("[data-raid-read]").scrollIntoView()');await wait(1300);
assert.ok(await s.ev('document.querySelectorAll(".raid-arrival.has-arrived").length>0'));
assert.ok(await s.ev('document.querySelector("[data-raid-read]").getAnimations({subtree:true}).some(a=>a.playState==="running")'));
await s.click('[data-read-toggle]');const paused=await s.ev('document.querySelector("[data-raid-read]").innerHTML');await wait(1300);assert.equal(await s.ev('document.querySelector("[data-raid-read]").innerHTML'),paused);
await s.load('/pages/topics/kernel-functions-and-system-management.html','document.querySelector("[data-kernel-ready]")');await s.ev('document.querySelector("[data-kernel-ready]").scrollIntoView()');await wait(100);
assert.equal(await s.ev('document.querySelector("[data-kernel-ready] [data-kv-action=play]").disabled'),false);await s.click('[data-kernel-ready] [data-kv-action=play]');await wait(2800);assert.equal(await s.ev('document.querySelector("[data-kernel-ready]").dataset.kvIndex'),'1');await s.click('[data-kernel-ready] [data-kv-action=play]');
await s.load('/pages/topics/collecting-and-processing-data.html','document.querySelector("[data-sort-controls]")?.hidden===false');await s.ev('document.querySelector("[data-record-sort]").scrollIntoView()');await s.click('[data-sort-key=name]');assert.ok(await s.ev('document.querySelector("[data-record-sort]").getAnimations({subtree:true}).length>0'));
await s.ev('document.querySelector("[data-tool=sorting]").scrollIntoView();const f=document.querySelector("[data-tool=sorting]");f.elements.field.value="temperature";f.elements.direction.value="descending";f.requestSubmit()');assert.ok(await s.ev('document.querySelector("[data-tool=sorting]").getAnimations({subtree:true}).length>0'));
await s.load('/pages/topics/stored-program-architecture-von-neumann-and-harvard.html','document.querySelector("[data-architecture-ready]")');await s.ev('document.querySelector("[data-architecture-demo=shared]").scrollIntoView({behavior:"instant"})');await wait(100);await s.click('[data-architecture-demo=shared] [data-architecture-action=step]');assert.ok(await s.ev('document.querySelector("[data-architecture-demo=shared] .arch-flight").getAnimations().some(a=>a.playState==="running"&&a.effect.getTiming().duration===1100)'));
await s.load('/pages/topics/stacks-and-queues.html','document.querySelectorAll("[data-sx-ready]").length===2 && document.querySelector("#call-stack [data-walkthrough-ready]")');
assert.equal(await s.ev('matchMedia("(prefers-reduced-motion: reduce)").matches'),true);
for (const kind of ['stack','queue']) {
  const host=`[data-structure-explorer="${kind}"]`;
  await s.ev(`document.querySelector('${host}').scrollIntoView({behavior:'instant'})`);
  // Start and inspect the short teaching animation in the same browser task.
  // Separate round trips can miss a valid 220 ms transfer on a busy test runner.
  const added=await s.ev(`(()=>{
    const h=document.querySelector('${host}');
    h.querySelector('[data-sx-operation=reset]').click();
    h.querySelector('[data-sx-input]').value='D';
    h.querySelector('[data-sx-form]').requestSubmit();
    return {count:h.querySelector('[data-sx-count]').textContent,
      items:[...h.querySelectorAll('.sx-occupied .sx-item')].map(e=>e.textContent),
      moving:h.getAnimations({subtree:true}).some(a=>a.playState==='running'&&a.effect.getTiming().duration===220)};
  })()`);
  assert.equal(added.count,'4');assert.equal(added.moving,true,`${kind} addition remains visible under reduced motion`);
  assert.deepEqual(added.items,kind==='stack'?['D','C','B','A']:['A','B','C','D']);
  for (const operation of ['peek',kind==='stack'?'pop':'dequeue']) {
    const returned=await s.ev(`(()=>{
      const h=document.querySelector('${host}');
      h.querySelector('[data-sx-operation=${operation}]').click();
      const flight=document.querySelector('.structure-explorer-flight');
      return {count:h.querySelector('[data-sx-count]').textContent,
        result:h.querySelector('[data-sx-result]').textContent,
        items:[...h.querySelectorAll('.sx-occupied .sx-item')].map(e=>e.textContent),
        moving:!!flight?.getAnimations().some(a=>a.playState==='running'&&a.effect.getTiming().duration===300)};
    })()`);
    assert.equal(returned.moving,true,`${kind} ${operation} transfer remains visible under reduced motion`);
    assert.equal(returned.result,kind==='stack'?'D':'A');
    assert.equal(returned.count,operation==='peek'?'4':'3');
    assert.deepEqual(returned.items,operation==='peek'?added.items:kind==='stack'?['C','B','A']:['B','C','D']);
  }
  await s.click(`${host} [data-sx-operation=reset]`);
  assert.equal(await s.ev('document.querySelector(".structure-explorer-flight")'),null);
}
await s.ev('document.querySelector("#call-stack").scrollIntoView({behavior:"instant"})');
const callState=()=>s.ev(`(()=>{const step=document.querySelector('#call-stack [data-walkthrough-step]:not([hidden])');return {running:step.querySelector('.sx-current-function').textContent,frames:[...step.querySelectorAll('.sx-call-frame code')].map(e=>e.textContent)}})()`);
await s.click('#call-stack [data-walkthrough-reset]');
assert.deepEqual(await callState(),{running:'main()',frames:['main()']});
await s.click('#call-stack [data-walkthrough-next]');await s.click('#call-stack [data-walkthrough-next]');
assert.deepEqual(await callState(),{running:'verifyPassword()',frames:['verifyPassword()','checkLogin()','main()']});
await s.click('#call-stack [data-walkthrough-next]');
assert.deepEqual(await callState(),{running:'checkLogin()',frames:['checkLogin()','main()']});
await s.click('#call-stack [data-walkthrough-prev]');
assert.equal((await callState()).running,'verifyPassword()');
await s.click('#call-stack [data-walkthrough-reset]');
assert.deepEqual(await callState(),{running:'main()',frames:['main()']});
await s.load('/pages/topics/packet-data-packet-switching-and-protocols.html','document.querySelector("[data-action=next-packet]")?.disabled===false');await s.ev('document.querySelector("[data-action=next-packet]").scrollIntoView()');await s.click('[data-action=next-packet]');assert.ok(await s.ev('parseFloat(getComputedStyle(document.querySelector(".moving-packet")).animationDuration)>=1'));
assert.deepEqual(s.errors.filter(e=>!e.includes('favicon.ico')),[]);console.log('PASS: RAID, kernel playback, both sorting demos, architecture signal, stack/queue operations, manual call-stack steps and packet travel remain available under reduced motion.');await s.close();
