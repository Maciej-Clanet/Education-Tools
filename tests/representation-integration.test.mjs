import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { btecLevel3Unit2ProgressData } from '../javascript/data/unit-progress-data.js'
import { imageCompressionAssets } from '../javascript/data/image-compression-assets.js'

const lessons = {
  'character-sets-ascii-and-unicode': { total: 8, pass: 6, version: 4, exams: 3, anchors: ['overview','character-sets','ascii','unicode','inspector','practice','implications','mistakes','quiz','exam-practice','exam-storage'] },
  'bitmap-image-storage': { total: 10, pass: 8, version: 4, exams: 3, anchors: ['overview','models','bitmap-pixels','colour-data','file-size','vector-images','vector-tool','choosing','mistakes','quiz','exam-practice','encode-rows','decode-rows','bitmap-builder'] },
  'resolution-bit-depth-and-image-compression': { total: 12, pass: 9, version: 3, exams: 5, anchors: ['overview','resolution','bit-depth','bit-depth-tool','raw-size','compression','trade-offs','mistakes','quiz','exam-practice'] },
}
for (const [id, expected] of Object.entries(lessons)) {
  test(`${id}: live quiz, aggregate metadata and versioned storage agree; old anchors survive`, () => {
    const html = readFileSync(`pages/topics/${id}.html`, 'utf8')
    const script = readFileSync(`javascript/pages/${id}.js`, 'utf8')
    const metadata = btecLevel3Unit2ProgressData.sections.flatMap(s=>s.lessons).find(l=>l.id===id)
    assert.equal(metadata.quiz.totalQuestions, expected.total)
    assert.equal(metadata.quiz.passScore, expected.pass)
    assert.equal(metadata.quiz.version, expected.version)
    assert.equal(metadata.quiz.storageKey, `lesson-${id}-quiz-v${expected.version}`)
    assert.ok(script.includes(metadata.quiz.storageKey))
    assert.match(script, new RegExp(`passScore:\\s*${expected.pass}`))
    assert.match(script, new RegExp(`version:\\s*${expected.version}`))
    assert.deepEqual([...html.matchAll(/data-question=["'](q\d+)["']/g)].map(match => match[1]), Array.from({length:expected.total},(_,index)=>`q${index+1}`))
    assert.equal([...html.matchAll(/data-exam-response=/g)].length, expected.exams)
    for (const anchor of expected.anchors) assert.match(html, new RegExp(`id=["']${anchor}["']`), anchor)
    assert.ok(html.indexOf('id="quiz"') < html.indexOf('id="exam-practice"'))
  })
}

function imageDimensions(data) {
  if (data.subarray(1,4).toString() === 'PNG') return [data.readUInt32BE(16), data.readUInt32BE(20)]
  assert.equal(data.readUInt16BE(0), 0xffd8)
  let offset=2
  while (offset < data.length) {
    assert.equal(data[offset], 0xff)
    const marker = data[offset+1], length=data.readUInt16BE(offset+2)
    if ([0xc0,0xc1,0xc2].includes(marker)) return [data.readUInt16BE(offset+7),data.readUInt16BE(offset+5)]
    offset += length+2
  }
  throw new Error('No image frame dimensions')
}
test('compression examples show measured file bytes and constant real pixel dimensions', () => {
  for (const variants of Object.values(imageCompressionAssets)) {
    for (const asset of Object.values(variants)) {
      const data = readFileSync(resolve('pages/topics', asset.src))
      assert.equal(data.length, asset.bytes, asset.src)
      assert.deepEqual(imageDimensions(data), [asset.width,asset.height], asset.src)
      assert.deepEqual([asset.width,asset.height], [960,640])
    }
    assert.ok(variants.high.bytes > variants.medium.bytes)
    assert.ok(variants.medium.bytes > variants.low.bytes)
  }
  // The counterexample matters: JPEG is not always smaller than PNG.
  assert.ok(imageCompressionAssets.diagram.source.bytes < imageCompressionAssets.diagram.high.bytes)
})
