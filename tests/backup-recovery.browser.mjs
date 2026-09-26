// Uses an isolated local test origin/profile; see docs/backup_recovery_lesson.md.
import assert from 'node:assert/strict';
import {createBrowserSession} from './helpers/browser-session.mjs';
process.env.FLEXBOX_TEST_ORIGIN ||= 'http://127.0.0.1:8765';
process.env.FLEXBOX_CDP_ORIGIN ||= 'http://127.0.0.1:9226';
const ready='document.querySelector("[data-recovery-ready]")';
const s=await createBrowserSession({lessonPath:'/pages/topics/backup-and-data-recovery.html',readyExpression:ready});
const ev=s.ev,click=s.click,pause=ms=>new Promise(r=>setTimeout(r,ms));
await s.send('Runtime.enable');await s.send('Log.enable');await s.send('Page.enable');await s.send('Page.bringToFront');
await s.send('Emulation.setDeviceMetricsOverride',{width:1366,height:768,deviceScaleFactor:1,mobile:false});
await s.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
await s.load();if(await s.ev("document.body.classList.contains('teacher-mode-active')"))await s.click("[data-action=exit-teacher-mode]");
await ev('Promise.all([...document.images].map(x=>{x.loading="eager";return x.decode()}))');
assert.equal(await ev('document.querySelectorAll("[data-lesson-section]").length'),35);
assert.equal(await ev('document.querySelectorAll(".bk-scenario-brief").length'),5);
// Comparison: manual movement remains visible under the OS motion preference.
await ev('document.querySelector("#compare-strategies").scrollIntoView()');await pause(100);
await click('[data-comparison-next]');
assert.ok(await ev('document.querySelector("[data-backup-comparison]").getAnimations({subtree:true}).length>0'));
await click('[data-comparison-next]');
assert.equal(await ev('document.querySelectorAll("[data-comparison-row=incremental] [data-file]").length'),1);
assert.equal(await ev('document.querySelectorAll("[data-comparison-row=differential] [data-file]").length'),2);
await click('[data-comparison-reset]');await click('[data-comparison-play]');await pause(2600);
assert.equal(await ev('document.querySelector("[data-backup-comparison]").dataset.dayIndex'),'1');
await click('[data-comparison-play]');const frame=await ev('document.querySelector("[data-backup-comparison]").dataset.dayIndex');await pause(2500);assert.equal(await ev('document.querySelector("[data-backup-comparison]").dataset.dayIndex'),frame);
await click('[data-comparison-play]');await ev('document.querySelector("#live-data").scrollIntoView({behavior: "instant"})');await s.waitFor('document.querySelector("[data-backup-comparison]").dataset.playing==="false"');
await ev('document.querySelector("#compare-strategies").scrollIntoView()');await pause(100);await click('[data-comparison-reset]');await click('[data-comparison-play]');await pause(7500);
assert.equal(await ev('document.querySelector("[data-backup-comparison]").dataset.dayIndex'),'3');assert.equal(await ev('document.querySelector("[data-backup-comparison]").dataset.playing'),'false');
await click('[data-comparison-play]');assert.equal(await ev('document.querySelector("[data-backup-comparison]").dataset.dayIndex'),'0');await click('[data-comparison-reset]');
// Static walkthrough restores one set at a time; reset returns to baseline.
for(let i=0;i<3;i++)await click('[data-walkthrough-next]');
assert.equal(await ev('document.querySelector("[data-walkthrough-step]:not([hidden])").querySelectorAll(".bk-restore-stage article:last-child b")[1].textContent'),'v2');
await click('[data-walkthrough-reset]');assert.match(await s.text('[data-walkthrough-status]'),/Step 1 of 4/);
// Guided recovery: invalid point stays blocked and feedback explains why.
await click('[data-recovery-next]');await click('[data-recovery-next]');assert.match(await s.text('[data-recovery-feedback]'),/Choose a recovery/);
await click('[data-recovery-copy][value=friday]');await click('[data-recovery-next]');assert.match(await s.text('[data-recovery-feedback]'),/contains the damage/);
assert.equal(await ev('document.querySelector("[data-recovery-lab]").dataset.recoveryStep'),'1');
await click('[data-recovery-copy][value=thursday]');await click('[data-recovery-next]');assert.match(await s.text('[data-recovery-service]'),/Awaiting checks/);
await click('[data-recovery-next]');assert.match(await s.text('[data-recovery-service]'),/Ready to reopen/);
await click('[data-recovery-next]');assert.equal(await ev('document.querySelector("[data-recovery-next]").disabled'),true);
await click('[data-recovery-prev]');await click('[data-recovery-reset]');assert.equal(await ev('document.querySelector("[data-recovery-lab]").dataset.recoveryStep'),'0');
// Explicit scenarios and reset feedback.
for(const [scenario,choice,reason,word] of [['frequency','daily','resources','does not meet'],['frequency','hourly','recent','fits the stated'],['location','onsite','local','fire'],['location','both','balance','addresses quick']]){
 await s.input(`[data-paired-scenario=${scenario}] [data-choice=type]`,choice);await s.input(`[data-paired-scenario=${scenario}] [data-choice=reason]`,reason);await click(`[data-paired-scenario=${scenario}] [data-check-pair]`);assert.match(await s.text(`[data-paired-scenario=${scenario}] [data-pair-feedback]`),new RegExp(word));
}
await click('[data-paired-scenario=location] [data-reset-pair]');assert.equal(await s.text('[data-paired-scenario=location] [data-pair-feedback]'),'');
// Existing assessments retain their keys and survive a genuine reload.
await ev(`for(const q of document.querySelectorAll('[data-question]'))q.querySelector('input[value="'+q.dataset.answer+'"]').click();document.querySelector('#lesson-quiz').requestSubmit();const exam=document.querySelector('[data-exam-response]');exam.value='Restore checked essential records first, then the less urgent archive.';exam.dispatchEvent(new Event('input',{bubbles:true}));`);
assert.match(await s.text('[data-role=quiz-result]'),/14/);
const before=await ev('performance.timeOrigin');await s.send('Page.reload');await s.waitFor(`performance.timeOrigin!==${before} && (${ready})`);
assert.equal(await ev('document.querySelectorAll("[data-question] input:checked").length'),14);assert.match(await ev('document.querySelector("[data-exam-response]").value'),/essential records/);
await click('[data-action=reset-quiz]');assert.equal(await ev('document.querySelectorAll("[data-question] input:checked").length'),0);
// Check the most content-rich interactive states in the deck and native Enter.
await click('[data-action=toggle-teacher-mode]');
for(let i=1;i<13;i++)await click('[data-action=next-slide]');
for(let step=0;step<4;step++){
 assert.ok(await ev('document.querySelector("#incremental-restore").scrollHeight<=document.querySelector("#incremental-restore").clientHeight+2'));
 if(step<3)await click('[data-walkthrough-next]');
}
for(let i=13;i<17;i++)await click('[data-action=next-slide]');
await click('[data-comparison-reset]');
for(let day=0;day<4;day++){
 assert.ok(await ev('document.querySelector("#compare-strategies").scrollHeight<=document.querySelector("#compare-strategies").clientHeight+2'));
 if(day<3)await click('[data-comparison-next]');
}
for(let i=17;i<28;i++)await click('[data-action=next-slide]');
assert.match(await s.text('[data-role=slide-status]'),/28 of 46/);
await ev('document.querySelector("[data-recovery-next]").focus()');
await s.send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,text:'\r'});await s.send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});
assert.equal(await ev('document.querySelector("[data-recovery-lab]").dataset.recoveryStep'),'1');assert.match(await s.text('[data-role=slide-status]'),/28 of 46/);
await click('[data-recovery-copy][value=friday]');await click('[data-recovery-next]');await s.screenshot('recovery-error-768');
assert.ok(await ev('document.querySelector("#procedure").scrollHeight<=document.querySelector("#procedure").clientHeight+2'));
await click('[data-recovery-copy][value=thursday]');for(let i=2;i<5;i++){await click('[data-recovery-next]');await s.screenshot('recovery-'+i+'-768')}
for(let i=28;i<36;i++)await click('[data-action=next-slide]');await s.input('[data-paired-scenario=type] [data-choice=type]','incremental');await s.input('[data-paired-scenario=type] [data-choice=reason]','small');await click('[data-paired-scenario=type] [data-check-pair]');await s.screenshot('strategy-feedback-768');
assert.ok(await ev('document.querySelector("#choose-strategy").scrollHeight<=document.querySelector("#choose-strategy").clientHeight+2'));
await click('[data-action=exit-teacher-mode]');
for(const width of [390,320]){await s.send('Emulation.setDeviceMetricsOverride',{width,height:844,deviceScaleFactor:1,mobile:true});assert.ok(await ev('document.documentElement.scrollWidth<=innerWidth+1'));}
// No JS still exposes the complete sequence and manual reading fallback.
await s.send('Emulation.setScriptExecutionDisabled',{value:true});const last=await ev('performance.timeOrigin');await s.send('Page.reload');await s.waitFor(`performance.timeOrigin!==${last} && document.readyState==='complete'`);
assert.equal(await ev('[...document.querySelectorAll("[data-walkthrough-step]")].every(x=>getComputedStyle(x).display!=="none")'),true);
assert.equal(await ev('document.querySelector("[data-recovery-fallback]").hidden'),false);assert.equal(await ev('document.querySelector("[data-comparison-controls]").hidden'),true);
assert.ok(await ev('document.documentElement.scrollWidth<=innerWidth+1'));
assert.deepEqual(s.errors.filter(e=>!e.includes('favicon.ico')),[]);
console.log('PASS: comparison, playback under reduced motion, manual stepping, pause, end, restart, offscreen pause, recovery guards and stages, native keyboard, scenario feedback, quiz 14/14, draft reload, reset, mobile, assets and no-JS fallback.');
await s.close();

