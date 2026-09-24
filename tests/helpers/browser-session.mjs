import assert from 'node:assert/strict'
import { mkdirSync, writeFileSync } from 'node:fs'

export async function createBrowserSession({ lessonPath, readyExpression }) {
  const origin = process.env.FLEXBOX_TEST_ORIGIN || 'http://127.0.0.1:8784'
  const cdpOrigin = process.env.FLEXBOX_CDP_ORIGIN || 'http://127.0.0.1:9244'
  const target = await (await fetch(`${cdpOrigin}/json/new?about:blank`, { method: 'PUT' })).json()
  const socket = new WebSocket(target.webSocketDebuggerUrl)
  await new Promise(resolve => socket.addEventListener('open', resolve, { once: true }))
  const pending = new Map()
  const errors = []
  let serial = 0
  socket.addEventListener('message', event => {
    const data = JSON.parse(event.data)
    if (data.id) {
      const request = pending.get(data.id)
      if (!request) return
      pending.delete(data.id)
      clearTimeout(request.timeout)
      data.error ? request.reject(new Error(JSON.stringify(data.error))) : request.resolve(data.result)
    } else if (data.method === 'Runtime.exceptionThrown') {
      errors.push(data.params.exceptionDetails.exception?.description || data.params.exceptionDetails.text)
    } else if (data.method === 'Log.entryAdded' && data.params.entry.level === 'error') {
      errors.push(`${data.params.entry.text}${data.params.entry.url ? ` (${data.params.entry.url})` : ''}`)
    }
  })
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++serial
    const timeout = setTimeout(() => { pending.delete(id); reject(new Error(`Timed out: ${method}`)) }, 15000)
    pending.set(id, { resolve, reject, timeout })
    socket.send(JSON.stringify({ id, method, params }))
  })
  const ev = async expression => {
    const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
    if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails))
    return result.result.value
  }
  const waitFor = async expression => {
    for (let attempt = 0; attempt < 100; attempt++) {
      if (await ev(expression)) return
      await new Promise(resolve => setTimeout(resolve, 50))
    }
    throw new Error(`Not ready: ${expression}`)
  }
  const load = async (path = lessonPath, ready = readyExpression) => {
    await send('Page.navigate', { url: origin + path })
    await waitFor(`location.pathname === ${JSON.stringify(path.split('?')[0])} && document.readyState === 'complete' && (${ready})`)
  }
  const click = selector => ev(`document.querySelector(${JSON.stringify(selector)}).click()`)
  const input = (selector, value, type = 'change') => ev(`(() => {
    const control = document.querySelector(${JSON.stringify(selector)});
    control.value = ${JSON.stringify(String(value))};
    control.dispatchEvent(new Event(${JSON.stringify(type)}, { bubbles: true }));
  })()`)
  const text = selector => ev(`document.querySelector(${JSON.stringify(selector)}).textContent`)
  const boxes = id => ev(`(() => {
    const parent = document.querySelector('[data-flex-explorer="${id}"] [data-flex-parent]');
    const box = element => { const { x, y, width, height } = element.getBoundingClientRect(); return { x, y, width, height }; };
    return { parent: box(parent), children: [...parent.children].map(box) };
  })()`)
  const near = (actual, expected, message) => assert.ok(Math.abs(actual - expected) <= 1, `${message}: ${actual} vs ${expected}`)
  const groupCentre = (children, axis, size) => (children[0][axis] + children.at(-1)[axis] + children.at(-1)[size]) / 2
  const screenshot = async name => {
    if (!process.env.FLEXBOX_SCREENSHOTS) return
    mkdirSync(process.env.FLEXBOX_SCREENSHOTS, { recursive: true })
    const result = await send('Page.captureScreenshot', { format: 'png' })
    writeFileSync(`${process.env.FLEXBOX_SCREENSHOTS}/${name}.png`, Buffer.from(result.data, 'base64'))
  }
  const close = async () => {
    socket.close()
    await fetch(`${cdpOrigin}/json/close/${target.id}`)
  }
  return { origin, send, ev, waitFor, load, click, input, text, boxes, near, groupCentre, screenshot, errors, close }
}
