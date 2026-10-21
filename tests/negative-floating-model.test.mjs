import test from 'node:test'
import assert from 'node:assert/strict'
import { twosFrames, pointFrames, floatAllocation, fractionTask, nextFractionTask, checkFractionAnswer } from '../javascript/core/negative-floating-model.js'
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { btecLevel3Unit2ProgressData } from '../javascript/data/unit-progress-data.js'

test('negation preserves eight bits and produces the negative magnitude, including the endpoint', () => {
  for (let magnitude = 1; magnitude <= 128; magnitude += 1) {
    const { original, frames } = twosFrames(magnitude)
    assert.equal(parseInt(original, 2), magnitude)
    for (const frame of frames) assert.match(frame.bits, /^[01]{8}$/)
    assert.equal(parseInt(frames.at(-1).bits, 2) - 256, -magnitude)
  }
  assert.throws(() => twosFrames(129), RangeError)
  assert.deepEqual(twosFrames(12).frames.slice(3).map(frame => frame.bits), ['11110010','11110000','11110100'])
  assert.deepEqual(twosFrames(12).frames.slice(2).map(frame => frame.carry), [-1,6,5,-1])
  assert.equal(twosFrames().original,'00000101')
  assert.equal(twosFrames().frames.at(-1).bits,'11111011')
  assert.ok(twosFrames().frames.every(frame=>frame.carry === -1),'The first teaching example needs no carry')
})

test('every point movement preserves the original value and ends in the declared form', () => {
  for (const kind of ['large','small','decode']) {
    const frames = pointFrames(kind)
    for (const frame of frames) {
      const [whole, fraction] = frame.mantissa.split('.')
      const mantissa = parseInt(whole,2) + [...fraction].reduce((sum, bit, i) => sum + Number(bit) * 2 ** -(i+1), 0)
      assert.equal(mantissa * 2 ** frame.exponent, frame.value, `${kind}: ${frame.mantissa} × 2^${frame.exponent}`)
    }
    assert.equal(frames.at(-1).exponent, kind === 'large' ? 3 : kind === 'small' ? -3 : 0)
    assert.equal(frames.at(-1).mantissa, kind === 'large' ? '1.10101' : kind === 'small' ? '1.101' : '1101.01')
  }
})

test('allocation retains ten bits and trades actual exponent range for actual precision', () => {
  let previous
  for (let exponentBits = 2; exponentBits <= 5; exponentBits += 1) {
    const value = floatAllocation(exponentBits)
    assert.equal(1 + exponentBits + value.mantissaBits, 10)
    assert.equal(value.maxExponent - value.minExponent + 1, 2 ** exponentBits)
    assert.equal(value.gap, 2 ** -(value.mantissaBits - 1))
    if (previous) { assert.ok(value.minExponent < previous.minExponent); assert.equal(value.gap, previous.gap * 2) }
    previous = value
  }
  assert.equal(floatAllocation(3).gap, 0.03125)
  assert.throws(() => floatAllocation(6), RangeError)
})

test('lesson metadata, storage isolation, original anchors and local assets agree', () => {
  const id = 'negative-and-floating-point-representation'
  const html = readFileSync(`pages/topics/${id}.html`, 'utf8')
  const script = readFileSync(`javascript/pages/${id}.js`, 'utf8')
  const metadata = btecLevel3Unit2ProgressData.sections.flatMap(section => section.lessons).find(lesson => lesson.id === id)
  assert.deepEqual(metadata.quiz, {version:3,totalQuestions:8,passScore:6,storageKey:`lesson-${id}-quiz-v3`})
  assert.match(script, /passScore: 6/)
  assert.match(script, /version: 3/)
  assert.ok(script.includes(metadata.quiz.storageKey))
  assert.equal([...html.matchAll(/data-question="q\d+"/g)].length,8)
  assert.equal([...html.matchAll(/data-exam-response=/g)].length,7)
  for(const anchor of ['overview','range','negative-numbers','twos-complement','twos-practice','floating-point','normalisation','precision','compare','mistakes','quiz','exam-practice']) assert.ok(html.includes(`id="${anchor}"`))
  assert.ok(!html.includes('data-exam-response="question-1"'))
  assert.ok(!html.includes('data-exam-response="question-2"'))
  for(const [,asset] of html.matchAll(/(?:src|href)="(\.\.\/[^"?#]+)(?:[?#][^"]*)?"/g)) assert.ok(existsSync(resolve('pages/topics',asset)),asset)
})

test('moving the point alone doubles the measurement', () => {
  const frames = pointFrames('scale')
  assert.deepEqual(frames.map(frame=>frame.point),[1,2,3])
  assert.deepEqual(frames.map(frame=>frame.value),[1.25,2.5,5])
  for(const frame of frames) assert.equal(parseInt(frame.digits,2) / 2 ** (frame.digits.length-frame.point),frame.value)
})

test('fraction questions and checking cover every non-whole eighth in the supported range', () => {
  for(let numerator=1;numerator<=127;numerator++) {
    if(numerator%8===0) { assert.throws(()=>fractionTask(numerator),RangeError); continue }
    const task=fractionTask(numerator)
    assert.equal(parseInt(task.bits,2)/8,task.answer)
    assert.equal(task.terms.reduce((sum,value)=>sum+value,0),task.answer)
    assert.equal(checkFractionAnswer(task,String(task.answer)).correct,true)
    for(const wrong of ['', ' ', '0x10', '1/2', 'Infinity', 'NaN', String(task.answer+1)]) assert.equal(checkFractionAnswer(task,wrong).correct,false)
    for(const random of [0,.25,.5,.75,.999999]) assert.notEqual(nextFractionTask(numerator,()=>random).numerator,numerator)
  }
})
