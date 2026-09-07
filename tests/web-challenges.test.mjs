import test from 'node:test'
import assert from 'node:assert/strict'
import vm from 'node:vm'
import { readFileSync } from 'node:fs'
import { webChallenges, findChallenge, challengeKinds } from '../javascript/data/web-challenges.js'
import { readChallenge, saveChallenge } from '../javascript/core/challenge-storage.js'

test('challenge saves are independent, preserve blank code, and report storage failure', () => {
  const entries = new Map()
  globalThis.window = { localStorage: {
    getItem: key => entries.get(key) ?? null,
    setItem: (key, value) => entries.set(key, value),
  } }
  assert.equal(saveChallenge('first', { sources: [{ id: 'javascript', code: 'const score = 15' }] }), true)
  saveChallenge('second', { sources: [{ id: 'javascript', code: '' }] })
  assert.equal(readChallenge('first').snapshot.sources[0].code, 'const score = 15')
  assert.equal(readChallenge('second').snapshot.sources[0].code, '')
  assert.equal(readChallenge('missing'), null)
  window.localStorage.setItem = () => { throw new Error('quota') }
  assert.equal(saveChallenge('first', {}), false)
  assert.equal(readChallenge('first').snapshot.sources[0].code, 'const score = 15')
  delete globalThis.window
})

const controller = readFileSync(new URL('../javascript/pages/code-playground.js', import.meta.url), 'utf8')
  .replace(/^import[\s\S]*?from "[^"\n]+"\r?\n/gm, '')

function openChallenge(id, saves) {
  const nodes = new Map()
  const node = selector => {
    if (!nodes.has(selector)) nodes.set(selector, { hidden: false, textContent: '', addEventListener() {} })
    return nodes.get(selector)
  }
  let snapshot
  const context = vm.createContext({
    URL, console, findChallenge, challengeKinds,
    readChallenge: id => saves.get(id),
    saveChallenge: (id, value) => { saves.set(id, { snapshot: structuredClone(value) }); return true },
    readStorage: () => null,
    writeStorage: () => { throw new Error('Challenges must not write general playground state') },
    window: { location: { href: `http://localhost/pages/tools/code-playground.html?challenge=${id}` },
      clearTimeout() {}, setTimeout() {}, addEventListener() {}, confirm: () => true },
    document: { querySelector: node, querySelectorAll: () => [], addEventListener() {} },
    createLiveCodeWorkspace: (_mount, value) => {
      snapshot = structuredClone(value)
      return { destroy() {}, getSnapshot: () => snapshot }
    },
  })
  vm.runInContext(controller, context)
  return { nodes, run: code => vm.runInContext(code, context), snapshot: () => snapshot }
}

test('challenge controller restores edits after reopening and resets only its challenge', () => {
  const saves = new Map([['other', { snapshot: { sources: [{ code: 'keep me' }] } }]])
  let page = openChallenge('js-console-variables', saves)
  assert.equal(page.snapshot().executionMode, 'javascript')
  page.snapshot().sources[0].code = ''
  page.run('saveNow()')
  page = openChallenge('js-console-variables', saves)
  assert.equal(page.snapshot().sources[0].code, '')
  assert.match(page.nodes.get("[data-role='challenge-back']").href, /challenges=javascript-basics#javascript-basics$/)
  page.run('resetWorkspace()')
  assert.equal(page.snapshot().sources[0].code, webChallenges[0].workspace.sources[0].code)
  assert.equal(saves.get('other').snapshot.sources[0].code, 'keep me')
})

test('unknown challenge does not open or overwrite a workspace', () => {
  const page = openChallenge('unknown', new Map())
  assert.equal(page.snapshot(), undefined)
  assert.match(page.nodes.get("[data-role='playground-context']").textContent, /could not be found/)
})

test('debugging starter fails and intended repairs produce variable-based output', () => {
  const source = webChallenges[0].workspace.sources[0].code
  assert.throws(() => vm.runInNewContext(source), /playername is not defined/)
  const output = []
  const repaired = source.replace('playername', 'playerName').replace('"Score:", "score"', '"Score:", score')
  vm.runInNewContext(repaired, { console: { log: (...args) => output.push(args.join(' ')) } })
  assert.deepEqual(output, ['Player: Alex', 'Score: 10'])
})
