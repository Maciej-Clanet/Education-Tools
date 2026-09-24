// Start a static server and Chrome with --remote-debugging-port=9226, then run:
// node tests/live-code-editor.browser.mjs
// Override the defaults with SITE_URL and CHROME_DEBUG_URL.
import assert from 'node:assert/strict'

const site = process.env.SITE_URL || 'http://127.0.0.1:8766'
const chrome = process.env.CHROME_DEBUG_URL || 'http://127.0.0.1:9226'
const target = await (await fetch(`${chrome}/json/new?about:blank`, { method: 'PUT' })).json()
const socket = new WebSocket(target.webSocketDebuggerUrl)
await new Promise(resolve => socket.addEventListener('open', resolve, { once: true }))
let serial = 0
const pending = new Map()
socket.addEventListener('message', event => {
  const data = JSON.parse(event.data)
  if (!data.id) return
  const { resolve, reject } = pending.get(data.id)
  pending.delete(data.id)
  if (data.error) reject(new Error(JSON.stringify(data.error)))
  else resolve(data.result)
})
const send = (method, params = {}) => new Promise((resolve, reject) => {
  const id = ++serial
  pending.set(id, { resolve, reject })
  socket.send(JSON.stringify({ id, method, params }))
})
const evaluate = async expression => {
  const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
  if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails))
  return result.result.value
}
const settle = () => evaluate('new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))')
const key = async (name, code, text) => {
  for (const type of ['keyDown', 'keyUp']) {
    await send('Input.dispatchKeyEvent', { type, key: name, code: name, windowsVirtualKeyCode: code, ...(type === 'keyDown' && text ? { text } : {}) })
  }
}
async function aligned(label) {
  await settle()
  const [editor, highlight] = await evaluate(`[e, h].map(node => ({
    top: node.scrollTop, left: node.scrollLeft,
    height: node.clientHeight, width: node.clientWidth,
    scrollHeight: node.scrollHeight, scrollWidth: node.scrollWidth
  }))`)
  // Browsers can include the pre's trailing padding in horizontal overflow.
  // Its scroll range must cover the textarea's; the visible offsets must match.
  assert.ok(highlight.scrollWidth >= editor.scrollWidth, `${label}: horizontal range`)
  delete highlight.scrollWidth
  delete editor.scrollWidth
  assert.deepEqual(highlight, editor, label)
}

try {
  await send('Network.enable')
  await send('Network.setCacheDisabled', { cacheDisabled: true })
  await send('Emulation.setDeviceMetricsOverride', { width: 1366, height: 900, deviceScaleFactor: 1, mobile: false })
  await send('Page.navigate', { url: `${site}/pages/tools/code-playground.html` })
  for (let attempt = 0; attempt < 100; attempt++) {
    if (await evaluate(`!!document.querySelector('.live-code__editor')`)) break
    await new Promise(resolve => setTimeout(resolve, 50))
  }
  await evaluate(`document.querySelector('[data-playground-mode="javascript"]').click()`)
  await evaluate(`window.e = document.querySelector('.live-code__editor'); window.h = document.querySelector('.live-code__editor-highlight')`)

  for (const zoom of [1, 1.5]) {
    await evaluate(`document.querySelector('.live-code-example').style.setProperty('--live-code-local-zoom', ${JSON.stringify(String(zoom))})`)
    await evaluate(`e.value = ''; e.dispatchEvent(new Event('input', { bubbles: true })); e.focus()`)
    await send('Input.insertText', { text: 'long line '.repeat(40) })
    await settle()
    assert.ok(await evaluate('e.scrollLeft > 0'), 'typing a long line must scroll right')
    await key('Enter', 13, '\r')
    await aligned(`Enter after horizontal scrolling, zoom=${zoom}`)
    assert.equal(await evaluate('e.scrollLeft'), 0, 'Enter must restore the left padding before typing')
    await send('Input.insertText', { text: 'a' })
    await aligned('first character on the new line')
    assert.equal(await evaluate('e.scrollLeft'), 0, 'first character must retain the left padding')
    for (const longLines of [false, true]) {
      const source = Array.from({ length: 60 }, (_, i) => `console.log("line ${i}${longLines ? ' abc'.repeat(60) : ''}");`).join('\n')
      await evaluate(`e.value = ${JSON.stringify(source)}; e.dispatchEvent(new Event('input', { bubbles: true })); e.focus(); e.setSelectionRange(e.value.length, e.value.length)`)
      // Native typing scrolls the caret into view and adds an empty last row.
      await send('Input.insertText', { text: '\n' })
      await aligned(`new final line, zoom=${zoom}, longLines=${longLines}`)
      assert.ok(await evaluate('e.scrollTop > 0'), 'fixture must scroll vertically')
      for (let i = 0; i < 35; i++) {
        await key('ArrowUp', 38)
        await aligned(`ArrowUp ${i}, zoom=${zoom}, longLines=${longLines}`)
      }
      const point = await evaluate(`(() => { const r = e.getBoundingClientRect(); return { x: r.x + 100, y: r.y + 80 } })()`)
      for (const type of ['mousePressed', 'mouseReleased']) {
        await send('Input.dispatchMouseEvent', { type, ...point, button: 'left', clickCount: 1 })
      }
      await aligned('click another line')
      await evaluate('e.setSelectionRange(e.selectionStart, e.selectionStart + 10)')
      await aligned('select text')
      await send('Input.insertText', { text: 'replacement' })
      await aligned('type over selection')
      await evaluate('e.scrollTop = e.scrollHeight; e.scrollLeft = e.scrollWidth')
      await aligned('maximum vertical and horizontal scroll')
      if (longLines) assert.ok(await evaluate('e.scrollLeft > 0'), 'fixture must scroll horizontally')
      await evaluate(`e.value = ''; e.dispatchEvent(new Event('input', { bubbles: true }))`)
      await aligned('clear overflowing content')
    }
  }
  console.log('PASS: editor and syntax highlighting align after typing, ArrowUp, clicking, selecting, clearing, and two-axis scrolling at two code zoom levels.')
} finally {
  await send('Page.close')
  socket.close()
}
