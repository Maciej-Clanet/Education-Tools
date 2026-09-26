import test from 'node:test'
import assert from 'node:assert/strict'
import { initLessonWalkthroughs } from '../javascript/core/lesson-walkthrough.js'

function walkthroughFixture(titles = ['Request', 'Retrieve', 'Use']) {
  const element = () => ({
    hidden: true, textContent: '', attributes: {}, listeners: {},
    setAttribute(name, value) { this.attributes[name] = value },
    addEventListener(name, handler) { (this.listeners[name] ??= []).push(handler) },
    click() { this.listeners.click?.forEach(handler => handler()) },
  })
  const steps = titles.map(title => ({ hidden: false, dataset: { walkthroughStep: title } }))
  const controls = element(), status = element(), previous = element(), next = element(), reset = element()
  const nodes = {
    '[data-walkthrough-controls]': controls,
    '[data-walkthrough-status]': status,
    '[data-walkthrough-prev]': previous,
    '[data-walkthrough-next]': next,
    '[data-walkthrough-reset]': reset,
  }
  const host = { dataset: {}, querySelector: selector => nodes[selector], querySelectorAll: () => steps }
  return { host, steps, controls, status, previous, next, reset, nodes }
}

test('walkthrough bounds, reverse navigation and restart keep one readable step', () => {
  const f = walkthroughFixture()
  initLessonWalkthroughs({ querySelectorAll: () => [f.host] })
  assert.equal(f.controls.hidden, false)
  assert.deepEqual(f.steps.map(step => step.hidden), [false, true, true])
  f.previous.click()
  assert.equal(f.status.textContent, 'Step 1 of 3: Request')
  f.next.click(); f.next.click(); f.next.click()
  assert.equal(f.status.textContent, 'Step 3 of 3: Use')
  assert.equal(f.next.attributes['aria-disabled'], 'true')
  assert.deepEqual(f.steps.map(step => step.hidden), [true, true, false])
  f.previous.click()
  assert.equal(f.status.textContent, 'Step 2 of 3: Retrieve')
  f.reset.click()
  assert.equal(f.status.textContent, 'Step 1 of 3: Request')
})

test('multiple walkthroughs stay independent and repeated setup does not double-bind buttons', () => {
  const first = walkthroughFixture(), second = walkthroughFixture()
  const root = { querySelectorAll: () => [first.host, second.host] }
  initLessonWalkthroughs(root); initLessonWalkthroughs(root)
  first.next.click()
  assert.equal(first.status.textContent, 'Step 2 of 3: Retrieve')
  assert.equal(second.status.textContent, 'Step 1 of 3: Request')
})

test('incomplete markup keeps the static fallback; a single-step sequence stays bounded', () => {
  const broken = walkthroughFixture(), single = walkthroughFixture(['Only step'])
  delete broken.nodes['[data-walkthrough-status]']
  initLessonWalkthroughs({ querySelectorAll: () => [broken.host, single.host] })
  assert.equal(broken.controls.hidden, true)
  assert.ok(broken.steps.every(step => !step.hidden))
  single.next.click(); single.previous.click(); single.reset.click()
  assert.equal(single.status.textContent, 'Step 1 of 1: Only step')
  assert.equal(single.next.attributes['aria-disabled'], 'true')
  assert.equal(single.previous.attributes['aria-disabled'], 'true')
})
