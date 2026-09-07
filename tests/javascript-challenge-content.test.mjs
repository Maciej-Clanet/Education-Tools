import test from 'node:test'
import assert from 'node:assert/strict'
import vm from 'node:vm'
import { webChallenges, findChallenge } from '../javascript/data/web-challenges.js'
import { javascriptChallengeSolutions } from './fixtures/javascript-challenge-solutions.mjs'

function run(code, input) {
  let output = []
  const log = (...args) => {
    // Do not accumulate unbounded output from intentionally broken loop starters.
    if (output.length < 100) output.push(args.map(String).join(' '))
  }
  vm.runInNewContext(code, {
    prompt: () => input,
    console: { log, warn: log, error: log, clear: () => { output = [] } },
  }, { timeout: 100 })
  return output
}

test('JS bank has stable distinct IDs, complete instructions, blank programming editors, and topic coverage', () => {
  assert.equal(webChallenges.length, 37)
  assert.equal(new Set(webChallenges.map(item => item.id)).size, 37)
  assert.deepEqual(webChallenges.map(item => item.number), Array.from({ length: 37 }, (_, i) => i + 1))
  assert.equal(findChallenge('js-console-announcement'), undefined)
  assert.equal(webChallenges[0].id, 'js-console-variables')
  for (const item of webChallenges) {
    assert.equal(findChallenge(item.id), item)
    assert.equal(item.section, 'javascript-basics')
    assert.equal(item.workspace.executionMode, 'javascript')
    assert.equal(item.workspace.sources.length, 1)
    assert.equal(item.workspace.sources[0].type, 'javascript')
    assert.ok(item.topic && item.skills.length && item.workspace.instructions.length)
    assert.equal(item.workspace.execution.network.mode, 'disabled')
    assert.ok(javascriptChallengeSolutions[item.id], `Missing QA attempt: ${item.id}`)
    if (item.kind === 'program') assert.equal(item.workspace.sources[0].code, '')
    else assert.ok(item.workspace.sources[0].code.length > 0)
  }
  // All 15 plan stages, plus the existing dedicated strings lesson.
  assert.equal(new Set(webChallenges.map(item => item.topic)).size, 16)
})

for (const item of webChallenges) {
  const fixture = javascriptChallengeSolutions[item.id]
  test(`${item.number}: ${item.title} — reference output and alternate inputs`, () => {
    assert.ok(fixture, `Missing reference for ${item.id}`)
    let code = fixture.code ?? item.workspace.sources[0].code
    for (const [before, after] of fixture.repairs ?? []) {
      assert.ok(code.includes(before), `Stale repair for ${item.id}: ${before}`)
      code = code.replace(before, after)
    }
    assert.deepEqual(run(code, fixture.input), fixture.output)
    for (const variant of fixture.variants ?? []) {
      if (variant.replace) assert.ok(code.includes(variant.replace[0]), `Stale variant for ${item.id}`)
      const changed = variant.replace ? code.replace(...variant.replace) : code
      assert.deepEqual(run(changed + '\n' + (variant.append ?? ''), variant.input ?? fixture.input), variant.output)
    }
    if (item.kind === 'debug') {
      let broken
      try { broken = run(item.workspace.sources[0].code, fixture.input) } catch { return }
      assert.notDeepEqual(broken, fixture.output, 'A debugging starter must exhibit its intended bug')
    }
  })
}
