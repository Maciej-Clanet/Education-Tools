// Isolated local origin/profile; setup is documented in docs/testing.md.
import assert from 'node:assert/strict';
import { createBrowserSession } from './helpers/browser-session.mjs';
process.env.FLEXBOX_TEST_ORIGIN ||= 'http://127.0.0.1:8765';
process.env.FLEXBOX_CDP_ORIGIN ||= 'http://127.0.0.1:9226';
const ready = 'document.querySelectorAll("[data-architecture-ready]").length===3';
const s = await createBrowserSession({ lessonPath: '/pages/topics/stored-program-architecture-von-neumann-and-harvard.html', readyExpression: ready });
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const host = kind => `[data-architecture-demo=${kind}]`;
const action = (kind, name) => `${host(kind)} [data-architecture-action=${name}]`;
const state = kind => s.ev(`({...document.querySelector('${host(kind)}').dataset})`);
const visible = async kind => {
  await s.ev(`document.querySelector('${host(kind)}').scrollIntoView({behavior:'instant',block:'center'})`);
  await wait(100);
};
await s.send('Runtime.enable'); await s.send('Log.enable'); await s.send('Page.enable'); await s.send('Page.bringToFront');
await s.send('Emulation.setDeviceMetricsOverride', { width: 1366, height: 768, deviceScaleFactor: 1, mobile: false });
await s.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
await s.load();
if (await s.ev('document.body.classList.contains("teacher-mode-active")')) await s.click('[data-action=exit-teacher-mode]');
assert.equal(await s.ev('document.querySelectorAll("[data-lesson-section]").length'), 23);
assert.equal(await s.ev('document.querySelectorAll("[data-exam-response]").length'), 6);
assert.equal(await s.ev('document.querySelectorAll("[data-paired-scenario]").length'), 0);
assert.deepEqual(await s.ev(`(()=>{const ids=[...document.querySelectorAll('[id]')].map(x=>x.id);return ids.filter((id,i)=>ids.indexOf(id)!==i)})()`), []);
assert.deepEqual(await s.ev(`[...document.querySelectorAll('a[href^="#"]')].map(x=>x.getAttribute('href').slice(1)).filter(id=>id&&!document.getElementById(id))`), []);
await s.ev('Promise.all([...document.images].map(image=>{image.loading="eager";return image.decode()}))');

// Labelled transfer movement survives reduced motion, with manual navigation and visible waiting.
await visible('shared'); await s.click(action('shared', 'step'));
assert.equal(await s.text(`${host('shared')} [data-request-kind=data]`), 'Waiting');
assert.ok(await s.ev(`document.querySelector('${host('shared')} .arch-flight').getAnimations().some(a=>a.playState==='running'&&a.effect.getTiming().duration===1100)`));
assert.match(await s.text(`${host('shared')} .arch-flight`), /InstructionNext instruction/);
await s.click(action('shared', 'step'));
assert.equal(await s.text(`${host('shared')} [data-request-kind=instruction]`), 'Received');
await s.click(action('shared', 'previous')); assert.equal((await state('shared')).architectureIndex, '1');
await s.click(action('shared', 'reset')); assert.equal((await state('shared')).architectureIndex, '0');

// Play, pause in place, manual interruption, offscreen pause, finite end and replay.
await visible('concurrent'); await s.click(action('concurrent', 'play')); await wait(2500);
assert.equal((await state('concurrent')).architectureIndex, '1');
assert.equal(await s.ev(`document.querySelectorAll('${host('concurrent')} .arch-flight').length`), 2);
await s.click(action('concurrent', 'play'));
assert.ok(await s.ev(`document.querySelector('${host('concurrent')}').getAnimations({subtree:true}).every(a=>a.playState==='paused')`));
await wait(2500); assert.equal((await state('concurrent')).architectureIndex, '1');
await s.click(action('concurrent', 'play')); await s.click(action('concurrent', 'previous'));
assert.equal((await state('concurrent')).architecturePlaying, 'false');
await s.click(action('concurrent', 'play'));
await s.ev('document.querySelector("#overview").scrollIntoView({behavior:"instant"})');
await s.waitFor(`document.querySelector('${host('concurrent')}').dataset.architecturePlaying==='false'`);
await visible('concurrent'); await s.click(action('concurrent', 'reset')); await s.click(action('concurrent', 'play')); await wait(4900);
assert.equal((await state('concurrent')).architectureIndex, '2'); assert.equal((await state('concurrent')).architecturePlaying, 'false');
assert.equal(await s.text(action('concurrent', 'play')), 'Replay');
await s.click(action('concurrent', 'play')); assert.equal((await state('concurrent')).architectureIndex, '0');
await s.click(action('concurrent', 'reset'));

// Existing quiz and response drafts survive an actual page reload.
await s.ev(`for(const q of document.querySelectorAll('[data-question]'))q.querySelector('input[value="'+q.dataset.answer+'"]').click();document.querySelector('#lesson-quiz').requestSubmit();const response=document.querySelector('[data-exam-response]');response.value='The separate pathways let independent instruction and data accesses overlap.';response.dispatchEvent(new Event('input',{bubbles:true}));`);
assert.match(await s.text('[data-role=quiz-result]'), /12/);
const origin = await s.ev('performance.timeOrigin'); await s.send('Page.reload');
await s.waitFor(`performance.timeOrigin!==${origin}&&(${ready})`);
assert.equal(await s.ev('document.querySelectorAll("[data-question] input:checked").length'), 12);
assert.match(await s.ev('document.querySelector("[data-exam-response]").value'), /independent instruction/);
await s.click('[data-action=reset-quiz]'); assert.equal(await s.ev('document.querySelectorAll("[data-question] input:checked").length'), 0);

// Every slide and every demonstration state fits both classroom viewports (the full quiz scrolls).
await s.click('[data-action=toggle-teacher-mode]');
for (const height of [900, 768]) {
  await s.send('Emulation.setDeviceMetricsOverride', { width: 1366, height, deviceScaleFactor: 1, mobile: false });
  for (let i = 0; i < 34; i++) await s.click('[data-action=prev-slide]');
  for (let index = 1; index <= 35; index++) {
    assert.match(await s.text('[data-role=slide-status]'), new RegExp(`Slide ${index} of 35$`));
    const check = async () => {
      const box = await s.ev(`(()=>{const el=[...document.querySelectorAll('.lesson-main > section')].find(e=>{const r=e.getBoundingClientRect();return r.left>=-2&&r.left<10});return {id:el.id,h:el.clientHeight,sh:el.scrollHeight,w:el.clientWidth,sw:el.scrollWidth}})()`);
      assert.ok(box.sw <= box.w + 2, `${height}px: slide ${index} horizontal overflow`);
      if (box.id !== 'quiz') assert.ok(box.sh <= box.h + 2, `${height}px: slide ${index} vertical overflow ${box.sh}/${box.h}`);
    };
    await check();
    const kind = ({ 13: 'program', 14: 'shared', 18: 'concurrent' })[index];
    if (kind) {
      await s.click(action(kind, 'reset'));
      const total = ({ program: 8, shared: 4, concurrent: 3 })[kind];
      for (let frame = 1; frame < total; frame++) { await s.click(action(kind, 'step')); await check(); }
      assert.equal(await s.ev(`document.querySelector('${action(kind, 'step')}').getAttribute('aria-disabled')`), 'true');
      if (kind === 'program') assert.equal(await s.text(`${host(kind)} [data-machine-output]`), '8');
      await s.click(action(kind, 'reset'));
      // Native keyboard activation should operate the tool without advancing the deck.
      await s.ev(`document.querySelector('${action(kind, 'step')}').focus()`);
      await s.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, text: '\r' });
      await s.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
      assert.equal((await state(kind)).architectureIndex, '1');
      assert.match(await s.text('[data-role=slide-status]'), new RegExp(`Slide ${index} of 35$`));
      await s.screenshot(`${kind}-${height}`);
    }
    if (index < 35) await s.click('[data-action=next-slide]');
  }
}
await s.click('[data-action=exit-teacher-mode]');
for (const width of [390, 320]) {
  await s.send('Emulation.setDeviceMetricsOverride', { width, height: 844, deviceScaleFactor: 1, mobile: true });
  for (const kind of ['program', 'shared', 'concurrent']) {
    await visible(kind); await s.click(action(kind, 'reset')); await s.click(action(kind, 'step')); await wait(1150);
    assert.ok(await s.ev('document.documentElement.scrollWidth<=innerWidth+1'), `${width}px overflow`);
    assert.ok(await s.ev(`[...document.querySelectorAll('${host(kind)} .arch-flight')].every(f=>{const a=f.getBoundingClientRect(),b=f.parentElement.getBoundingClientRect();return a.bottom<=b.bottom+2&&a.right<=b.right+2})`));
  }
  await s.screenshot(`mobile-${width}`);
}
// Print and no-JS retain readable sequences, rather than dead controls.
await s.send('Emulation.setEmulatedMedia', { media: 'print' });
assert.ok(await s.ev('[...document.querySelectorAll("[data-architecture-transcript]")].every(el=>getComputedStyle(el).display!=="none")'));
await s.send('Emulation.setEmulatedMedia', { media: 'screen' });
await s.send('Emulation.setScriptExecutionDisabled', { value: true });
const last = await s.ev('performance.timeOrigin'); await s.send('Page.reload');
await s.waitFor(`performance.timeOrigin!==${last}&&document.readyState==='complete'`);
assert.ok(await s.ev('[...document.querySelectorAll("[data-architecture-transcript]")].every(el=>!el.hidden)'));
assert.ok(await s.ev('[...document.querySelectorAll("[data-architecture-controls]")].every(el=>el.hidden)'));
assert.ok(await s.ev('document.documentElement.scrollWidth<=innerWidth+1'));
assert.deepEqual(s.errors.filter(error => !error.includes('favicon.ico')), []);
console.log('PASS: 35 slides at two desktop heights; every demo state; labelled reduced-motion transfers; controls, finite playback and offscreen pause; native keyboard; quiz 12/12, draft reload, reset; mobile 390/320; print/no-JS; IDs, anchors, images and runtime errors.');
await s.close();
