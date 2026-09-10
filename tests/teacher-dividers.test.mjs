import test from 'node:test'
import assert from 'node:assert/strict'
import { buildTeacherSlideDeck } from '../javascript/core/lesson-shell.js'
import { initTeacherDividers, studentSlideTarget } from '../javascript/core/teacher-dividers.js'

function node(tagName = 'SECTION', classes = [], attributes = []) {
  return {
    tagName, dataset: {}, children: [],
    classList: { contains: name => classes.includes(name) },
    hasAttribute: name => attributes.includes(name),
    append(...children) { this.children.push(...children) },
  }
}

test('divider templates create hidden teacher sections once, without student section metadata', () => {
  const target = { id: 'topic', matches: selector => selector === '[data-lesson-section]' }
  const template = { dataset: {}, nextElementSibling: target, content: { cloneNode: () => node('H2') }, after(value) { this.created = value } }
  const previousDocument = globalThis.document
  globalThis.document = { createElement: tag => node(tag.toUpperCase()) }
  try {
    const root = { querySelectorAll: () => [template] }
    initTeacherDividers(root)
    const divider = template.created
    assert.equal(divider.hidden, true)
    assert.equal(divider.dataset.teacherOnly, '')
    assert.equal(divider.dataset.lessonSection, undefined)
    assert.equal(studentSlideTarget(divider, [divider, target]), target)
    initTeacherDividers(root)
    assert.equal(template.created, divider)
  } finally { globalThis.document = previousDocument }
})

test('deck includes dividers in order while preserving ordinary section chunks', () => {
  const before = node()
  before.children = [node('H2'), node('P'), node('DIV', [], ['data-slide-break']), node('P')]
  const divider = node()
  divider.dataset.teacherOnly = ''
  divider.children = [node('P', ['eyebrow']), node('H2'), node('P')]
  const after = node()
  after.children = [node('H2'), node('P')]
  const { slides, firstSlideIndexBySection } = buildTeacherSlideDeck([before, divider, after])
  assert.deepEqual(slides.map(slide => slide.section), [before, before, divider, after])
  const index = firstSlideIndexBySection.get(divider)
  assert.equal(slides[index - 1].section, before)
  assert.equal(slides[index + 1].section, after)
  assert.equal(studentSlideTarget(before, [before, divider, after]), before)
})

test('an opener is inserted before the first teaching section and maps back to it', () => {
  const target = { id: 'intro', matches: () => true, before(value) { this.created = value } }
  const template = { dataset: { teacherOpener: '' }, content: { cloneNode: () => node('H2') } }
  const previousDocument = globalThis.document
  globalThis.document = { createElement: tag => node(tag.toUpperCase()) }
  try {
    const root = { querySelectorAll: () => [template], querySelector: () => target }
    initTeacherDividers(root)
    const opener = target.created
    assert.equal(opener.id, 'intro--opener')
    assert.equal(opener.hidden, true)
    assert.equal(opener.dataset.teacherOpenerSlide, '')
    assert.equal(opener.dataset.lessonSection, undefined)
    const { slides } = buildTeacherSlideDeck([opener, node()])
    assert.equal(slides[0].section, opener)
    assert.equal(studentSlideTarget(opener, [opener, target]), target)
    initTeacherDividers(root)
    assert.equal(target.created, opener)
  } finally { globalThis.document = previousDocument }
})
