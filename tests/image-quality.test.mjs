import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync, statSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { quantiseShade, rawPixelSize, encodeRuns, decodeRuns, RUN_PRESETS, scenePixels, imageQualityQuestions, imageQualityScenarios } from '../javascript/data/image-quality-model.js'
import { imageCompressionAssets } from '../javascript/data/image-compression-assets.js'
import { evaluateScenarioPair } from '../javascript/core/paired-scenarios.js'

test('all greyscale codes are reachable and quantisation retains endpoints and code widths', () => {
  for (const depth of [1, 2, 4, 8]) {
    const samples = Array.from({ length: 256 }, (_, value) => quantiseShade(value, depth))
    assert.equal(new Set(samples.map(sample => sample.index)).size, 2 ** depth)
    assert.equal(samples[0].shade, 0)
    assert.equal(samples[255].shade, 255)
    samples.forEach((sample, index) => {
      assert.equal(sample.code.length, depth)
      assert.equal(parseInt(sample.code, 2), sample.index)
      if (index) assert.ok(sample.shade >= samples[index - 1].shade)
    })
  }
  assert.deepEqual(quantiseShade(110, 2), { index: 1, shade: 85, code: '01', levels: 4 })
  assert.equal(quantiseShade(-100, 2).shade, 0)
  assert.equal(quantiseShade(999, 2).shade, 255)
})

test('worked payloads preserve units and independent scaling effects', () => {
  assert.deepEqual(rawPixelSize(8, 4, 2), { pixels: 32, bits: 64, bytes: 8, megabytes: .000008 })
  const original = rawPixelSize(1200, 800, 24)
  assert.equal(original.bits, 23040000)
  assert.equal(original.bytes, 2880000)
  assert.equal(original.megabytes, 2.88)
  assert.equal(rawPixelSize(600, 400, 24).bytes, original.bytes / 4)
  assert.equal(rawPixelSize(1200, 800, 4).bytes, rawPixelSize(1200, 800, 8).bytes / 2)
  assert.throws(() => rawPixelSize(0, 800, 24), RangeError)
})

test('lossless runs round-trip including expansion and one-byte count boundaries', () => {
  for (const values of [RUN_PRESETS.flat, RUN_PRESETS.alternating, [], Array(256).fill(12), [0, 0, 90, 90, 255]]) {
    assert.deepEqual(decodeRuns(encodeRuns(values)), values)
  }
  assert.equal(encodeRuns(RUN_PRESETS.flat).length * 2, 4)
  assert.equal(encodeRuns(RUN_PRESETS.alternating).length * 2, 32)
  assert.deepEqual(encodeRuns(Array(256).fill(12)), [{ count: 255, value: 12 }, { count: 1, value: 12 }])
  assert.throws(() => encodeRuns([256]), RangeError)
  assert.throws(() => decodeRuns([{ count: 0, value: 1 }]), RangeError)
})

test('resolution fixtures sample one subject and reveal the documented narrow detail', () => {
  const small = scenePixels(8), medium = scenePixels(16), large = scenePixels(32)
  assert.equal(small.length, 64)
  assert.equal(medium.length, 256)
  assert.equal(large.length, 1024)
  assert.equal(small.includes('#243d49'), false)
  assert.ok(medium.includes('#243d49'))
  assert.ok(large.includes('#243d49'))
})

test('scenarios require a matched setting and reason, rather than independent correct fragments', () => {
  for (const scenario of Object.values(imageQualityScenarios)) {
    const [choice, reason] = scenario.acceptedPairs[0]
    assert.ok(evaluateScenarioPair(choice, reason, scenario.acceptedPairs))
    assert.equal(evaluateScenarioPair(choice, 'unrelated', scenario.acceptedPairs), false)
    assert.ok(scenario.incompleteMessage && scenario.retryMessage && scenario.successMessage)
  }
})

test('static lesson has complete controls, live assets, unique IDs and fresh assessment storage', () => {
  const path = resolve('pages/topics/resolution-bit-depth-and-image-compression.html')
  const html = readFileSync(path, 'utf8')
  const script = readFileSync('javascript/pages/resolution-bit-depth-and-image-compression.js', 'utf8')
  assert.equal((html.match(/data-question="q/g) || []).length, 12)
  assert.equal(imageQualityQuestions.length, 12)
  assert.equal((html.match(/data-exam-response=/g) || []).length, 5)
  assert.ok(html.includes('data-exam-response="question-1"'))
  assert.ok(!html.includes('data-exam-response="question-2"'))
  assert.match(script, /quiz-v3/)
  assert.match(script, /passScore: 9, version: 3/)
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1])
  assert.equal(new Set(ids).size, ids.length)
  for (const [,link] of html.matchAll(/(?:src|href)="((?!https?:|#)[^"?#]+\.(?:svg|jpg|png|js|css|md))"/g)) assert.ok(existsSync(resolve(dirname(path),link)),link)
  for (const [,anchor] of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(anchor),anchor)
  for (const fixture of Object.values(imageCompressionAssets)) for (const asset of Object.values(fixture)) assert.equal(statSync(resolve(dirname(path),asset.src)).size,asset.bytes)
  assert.ok(html.includes('quality-grey-1.png') && html.includes('quality-grey-8.png'))
  assert.ok(html.includes('CC0') && html.includes('Paris Street; Rainy Day') && html.includes('Art Institute of Chicago'))
  assert.ok(html.includes('8 × 4 = 32'))
  assert.doesNotMatch(html, /Ã—|Â·|â†/)
})
