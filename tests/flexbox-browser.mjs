// Opt-in integration check (Node 22+, no npm dependencies).
// Start: python3 -m http.server 8784 --bind 127.0.0.1
// Start an isolated Chrome: google-chrome --headless=new --remote-debugging-port=9244
//   --user-data-dir=/tmp/flexbox-browser-check about:blank
// Run: node tests/flexbox-browser.mjs
// Override FLEXBOX_TEST_ORIGIN / FLEXBOX_CDP_ORIGIN or set FLEXBOX_SCREENSHOTS.
import assert from 'node:assert/strict'
import { createBrowserSession } from './helpers/browser-session.mjs'

const lessonPath = '/pages/topics/flexbox-basics.html?context=web-development'
const { origin, send, ev, waitFor, load, click, input, text, boxes, near, groupCentre, screenshot, errors, close } = await createBrowserSession({
  lessonPath, readyExpression: "document.querySelectorAll('[data-flex-ready]').length === 12",
})

try {
  await send('Runtime.enable')
  await send('Page.enable')
  await send('Log.enable')
  await send('Emulation.setDeviceMetricsOverride', { width: 1366, height: 900, deviceScaleFactor: 1, mobile: false })
  await load()
  // This script must use an isolated browser profile: clear only this test origin.
  await ev('localStorage.clear()')
  await load()
  assert.equal(await ev("document.querySelectorAll('[data-lesson-section]').length"), 18)
  assert.deepEqual(await ev("[...document.querySelectorAll('[data-section-link]')].filter(a => !document.getElementById(a.hash.slice(1))).map(a => a.hash)"), [])
  assert.equal(await ev("new Set([...document.querySelectorAll('[id]')].map(e => e.id)).size === document.querySelectorAll('[id]').length"), true)
  await screenshot('desktop')

  await ev("window.originalFlexChildren = [...document.querySelectorAll('[data-flex-parent] > div')]")
  let b = await boxes('enable')
  assert.ok(b.children[1].y > b.children[0].y)
  await input('#enable-display', 'flex')
  b = await boxes('enable')
  near(b.children[0].y, b.children[2].y, 'flex creates a row')
  await input('#direction-direction', 'column')
  b = await boxes('direction')
  near(b.children[0].x, b.children[2].x, 'column children share x')
  assert.ok(b.children[2].y > b.children[1].y)
  await input('#axes-direction', 'column')
  assert.match(await text('[data-flex-explorer=axes] [data-flex-horizontal]'), /Cross axis/)
  assert.match(await text('[data-flex-explorer=axes] [data-flex-vertical]'), /Main axis/)

  await input('#justify-justify', 'center')
  b = await boxes('justify')
  near(groupCentre(b.children, 'x', 'width'), b.parent.x + b.parent.width / 2, 'row main centring')
  await input('#justify-justify', 'flex-end')
  b = await boxes('justify')
  near(b.children[2].x + b.children[2].width, b.parent.x + b.parent.width - 2, 'row main end')
  await input('#distribute-justify', 'space-between')
  b = await boxes('distribute')
  near(b.children[0].x, b.parent.x + 2, 'space-between start')
  near(b.children[2].x + 48, b.parent.x + b.parent.width - 2, 'space-between end')
  near(b.children[1].x - b.children[0].x, b.children[2].x - b.children[1].x, 'space-between equal distribution')

  const start = await boxes('align')
  await input('#align-align', 'center')
  b = await boxes('align')
  for (let n = 0; n < 3; n++) {
    near(b.children[n].x, start.children[n].x, 'align does not change main position')
    near(b.children[n].y + 24, b.parent.y + b.parent.height / 2, 'row cross centring')
  }
  await input('#align-align', 'flex-end')
  b = await boxes('align')
  near(b.children[0].y + 48, b.parent.y + b.parent.height - 2, 'row cross end')
  await input('#turn-direction', 'column')
  b = await boxes('turn')
  near(groupCentre(b.children, 'y', 'height'), b.parent.y + b.parent.height / 2, 'column main centring')
  near(b.children[0].x, b.parent.x + 2, 'column cross start')
  assert.match(await text('[data-flex-explorer=turn] [data-flex-vertical]'), /justify-content/)
  assert.match(await text('[data-flex-explorer=turn] [data-flex-horizontal]'), /align-items/)

  b = await boxes('stretch')
  near(b.children[0].height, b.parent.height - 4, 'auto-height row stretch')
  await input('#stretch-align', 'center')
  b = await boxes('stretch')
  near(b.children[0].height, 48, 'centre removes row stretching')
  await input('#stretch-direction', 'column')
  await input('#stretch-align', 'stretch')
  b = await boxes('stretch')
  near(b.children[0].width, b.parent.width - 4, 'auto-width column stretch')
  await input('#stretch-align', 'center')
  b = await boxes('stretch')
  near(b.children[0].width, 48, 'centre removes column stretching')
  near(b.children[0].x + 24, b.parent.x + b.parent.width / 2, 'column cross centring')
  b = await boxes('room')
  near(b.children[0].y, b.parent.y + 2, 'no spare cross space')
  await input('#room-height', 196)
  b = await boxes('room')
  near(b.children[0].y + 24, b.parent.y + b.parent.height / 2, 'extra height reveals alignment')

  await ev("document.querySelector('#gap-gap').focus()")
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'ArrowRight', code: 'ArrowRight', windowsVirtualKeyCode: 39 })
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'ArrowRight', code: 'ArrowRight', windowsVirtualKeyCode: 39 })
  assert.equal(await ev("document.querySelector('#gap-gap').value"), '4')
  assert.equal(await text('[data-flex-explorer=gap] output'), '4px')
  await input('#gap-gap', 24, 'input')
  b = await boxes('gap')
  near(b.children[1].x - b.children[0].x - 48, 24, 'gap size')
  near(b.children[0].x, b.parent.x + 2, 'gap adds no outside padding')
  await input('#spacing-width', 'compact')
  b = await boxes('spacing')
  near(b.children[1].x - b.children[0].x - 48, 16, 'fixed gap in narrow parent')
  await input('#spacing-justify', 'space-between')
  b = await boxes('spacing')
  assert.ok(b.children[1].x - b.children[0].x - 48 > 16)
  const compactGap = b.children[1].x - b.children[0].x - 48
  await input('#spacing-width', 'full')
  b = await boxes('spacing')
  assert.ok(b.children[1].x - b.children[0].x - 48 > compactGap)
  await input('#spacing-justify', 'flex-start')
  b = await boxes('spacing')
  near(b.children[1].x - b.children[0].x - 48, 16, 'fixed gap in wider parent')

  await input('#combine-direction', 'column')
  await input('#combine-align', 'center')
  await input('#combine-gap', 8, 'input')
  b = await boxes('combine')
  near(b.children[0].x + 24, b.parent.x + b.parent.width / 2, 'combined column alignment')
  near(b.children[1].y - b.children[0].y - 48, 8, 'column gap')
  await click('[data-flex-explorer=combine] [data-flex-reset]')
  assert.equal(await ev("document.querySelector('#combine-direction').value"), 'row')
  assert.equal(await ev("[...document.querySelectorAll('[data-flex-parent] > div')].every((item, i) => item === window.originalFlexChildren[i])"), true)

  await click('.live-code__primary-action')
  await ev("(() => { const editor = document.querySelector('.live-code__editor'); editor.value = editor.value.replace('flex-direction: row', 'flex-direction: column'); editor.dispatchEvent(new Event('input', { bubbles: true })); })()")
  await waitFor("document.querySelector('.live-code__iframe').srcdoc.includes('flex-direction: column')")
  assert.equal(await ev("document.querySelector('.live-code__iframe').getAttribute('sandbox')"), '')

  // Exercise incorrect feedback, full scoring, and persisted quiz + written responses.
  await click('[name=q1][value=a]')
  await ev("document.querySelector('#lesson-quiz').requestSubmit()")
  assert.match(await text('[data-question=q1] [data-question-feedback]'), /parent/)
  await ev("for (const q of document.querySelectorAll('[data-question]')) q.querySelector('input[value=' + q.dataset.answer + ']').click(); document.querySelector('#lesson-quiz').requestSubmit(); const response = document.querySelector('[data-exam-response]'); response.value = 'In a column, align-items uses the horizontal cross axis.'; response.dispatchEvent(new Event('input', { bubbles: true }));")
  assert.equal(await ev("document.querySelectorAll('.quiz-question.is-correct').length"), 10)
  const summary = await ev("(async () => { const {readLessonQuizProgress} = await import('/javascript/core/quiz-progress.js'); return readLessonQuizProgress('flexbox-basics'); })()")
  assert.equal(summary.correct, 10)
  assert.equal(summary.totalQuestions, 10)
  await load()
  assert.equal(await ev("document.querySelectorAll('[data-question] input:checked').length"), 10)
  assert.match(await ev("document.querySelector('[data-exam-response]').value"), /horizontal cross/)

  await load('/pages/resources/web-development.html', "document.querySelector('a[href*=\"flexbox-basics\"]')")
  assert.match(await text('a[href*="flexbox-basics"]'), /Flexbox Basics/)
  const metadata = await ev("(async () => { const {catalogItems} = await import('/javascript/data/course-catalog.js'); const {webDevelopmentProgressData} = await import('/javascript/data/unit-progress-data.js'); return {catalog: catalogItems.find(item => item.id === 'topic-flexbox-basics'), progress: webDevelopmentProgressData.sections.find(section => section.id === 'css-basics').lessons.find(lesson => lesson.id === 'flexbox-basics')}; })()")
  assert.equal(metadata.catalog.status, 'live')
  assert.deepEqual(metadata.progress.quiz, { version: 1, totalQuestions: 10, passScore: 8 })
  await load('/pages/topics/css-display.html?context=web-development', "document.querySelector('[data-role=lesson-sequence] a[href*=\"flexbox-basics\"]')")
  await load()
  await click('[data-action=reset-quiz]')
  assert.equal(await ev("document.querySelectorAll('[data-question] input:checked').length"), 0)

  // Responsive diagrams should keep all children inside their parent even at max gap.
  for (const width of [390, 320]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 844, deviceScaleFactor: 1, mobile: false })
    await input('#combine-gap', 24, 'input')
    assert.equal(await ev('document.documentElement.scrollWidth <= innerWidth'), true, `page width ${width}`)
    const overflow = await ev("[...document.querySelectorAll('[data-flex-parent]')].flatMap(parent => { const p = parent.getBoundingClientRect(); return [...parent.children].filter(child => { const c = child.getBoundingClientRect(); return c.right > p.right + 1 || c.bottom > p.bottom + 1; }).map(() => parent.closest('[data-flex-explorer]').dataset.flexExplorer); })")
    assert.deepEqual(overflow, [], `preview bounds at ${width}`)
  }
  await ev("document.querySelector('#align-items').scrollIntoView()")
  await screenshot('mobile-align')
  await send('Emulation.setDeviceMetricsOverride', { width: 1366, height: 900, deviceScaleFactor: 1, mobile: false })
  await click('[data-action=toggle-teacher-mode]')
  await waitFor("document.body.classList.contains('teacher-mode-active') && location.hash.endsWith('--opener')")
  assert.match(await ev('location.hash'), /--opener/)
  const slides = []
  for (let index = 0; index < 60; index++) {
    const id = await ev('location.hash.slice(1)')
    const status = await text('[data-role=slide-status]')
    slides.push(status)
    if (['align-items', 'turn-the-axes', 'stretch', 'gap-and-space', 'live-code'].includes(id)) {
      await screenshot(`slide-${id}`)
      if (id === 'turn-the-axes') {
        await input('#turn-direction', 'column')
        const current = await boxes('turn')
        near(current.children[0].x, current.parent.x + 2, 'live controls work inside slides')
      }
    }
    if (await ev("document.querySelector('[data-action=next-slide]').disabled")) break
    await click('[data-action=next-slide]')
  }
  assert.ok(slides.length >= 23 && slides.length < 60)
  await click('[data-action=exit-teacher-mode]')
  assert.equal(await ev("document.body.classList.contains('teacher-mode-active')"), false)
  assert.equal(await ev("[...document.querySelectorAll('[data-teacher-only]')].every(node => node.hidden)"), true)
  assert.deepEqual(errors, [], 'no browser errors')

  await send('Emulation.setScriptExecutionDisabled', { value: true })
  await send('Page.navigate', { url: origin + lessonPath })
  await new Promise(resolve => setTimeout(resolve, 500))
  // Re-enable evaluation after load; this does not rerun the page's module scripts.
  await send('Emulation.setScriptExecutionDisabled', { value: false })
  assert.equal(await ev("document.querySelectorAll('[data-flex-ready]').length"), 0)
  assert.equal(await ev("document.querySelectorAll('[data-flex-parent]').length"), 12)
  assert.equal(await ev("document.querySelectorAll('[data-lesson-section]').length"), 18)
  assert.equal(await ev("document.querySelector('#axes-direction').disabled"), true)
  console.log(`PASS: real layout/axes/stretch/space/gap, keyboard, code editor, persistence, discovery, 320/390px, ${slides.length} teacher slides, static fallback, no browser errors.`)
} finally {
  await close()
}
