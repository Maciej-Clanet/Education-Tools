import { initLessonPage } from '../core/lesson-shell.js'
import { initCharacterTransmissions } from '../core/character-transmission.js'
import { readStorage, writeStorage } from '../core/storage.js'
import { boundCharacterText, inspectCharacterText, decodeMismatch } from '../core/character-encoding.js'
import { CHARACTER_LIMIT } from '../data/character-encoding-data.js'

const lessonConfig = {
  lessonId: 'character-sets-ascii-and-unicode',
  defaultContext: 'btec-level-3-unit-2',
  contexts: {
    'btec-level-3-unit-2': {
      label: 'BTEC Level 3 Computing Unit 2', backHref: '../units/btec-level-3-unit-2.html#section-c', backLabel: 'Back to Unit 2 content',
      previous: { title: 'Negative and floating point representation', description: 'Previous in C1 Number systems.', status: 'Live', href: '../topics/negative-and-floating-point-representation.html' },
      next: { title: 'Image storage: bitmap and vector images', description: 'Next in C3 Image representation.', status: 'Live', href: '../topics/bitmap-image-storage.html' },
    },
  },
  quiz: { storageKey: 'lesson-character-sets-ascii-and-unicode-quiz-v4', passScore: 6, totalQuestions: 8, version: 4 },
  examPractice: { storageKey: 'lesson-character-sets-ascii-and-unicode-exam-practice' },
}

const INSPECTOR_STORAGE_KEY = 'lesson-character-sets-inspector'
const hexByte = byte => byte.toString(16).toUpperCase().padStart(2, '0')

function node(tag, className, text) {
  const element = document.createElement(tag)
  if (className) element.className = className
  if (text !== undefined) element.textContent = text
  return element
}

function initCharacterInspectors() {
  // Authored tables and diagrams remain visible if byte encoding is unavailable.
  if (typeof TextEncoder === 'undefined') return
  document.querySelectorAll('[data-character-inspector]').forEach(host => {
    const mode = host.dataset.characterInspector
    const original = host.dataset.text ?? 'Hi!'
    const input = host.querySelector('[data-inspector-input]')
    const tokens = host.querySelector('[data-inspector-tokens]')
    const card = host.querySelector('[data-inspector-card]')
    const status = host.querySelector('[data-inspector-status]')
    const table = host.querySelector('[data-inspector-table]')
    let inspected = inspectCharacterText(original)
    let selected = 0

    function renderSelection() {
      const character = inspected.characters[selected]
      tokens.querySelectorAll('button').forEach((button, index) => button.setAttribute('aria-pressed', String(index === selected)))
      card.replaceChildren()
      if (!character) {
        card.append(node('p', 'text-key', 'Enter text to inspect its code points and bytes.'))
        return
      }
      const identity = node('div', 'text-selected-character')
      identity.append(node('span', 'text-label', `Position ${selected + 1}`), node('strong', 'text-glyph', character.name))
      const values = node('dl', 'text-values')
      const addValue = (label, value) => {
        const group = node('div')
        group.append(node('dt', '', label), node('dd', '', value))
        values.append(group)
      }
      if (mode === 'ascii') {
        addValue('ASCII value · denary', character.point)
        addValue('ASCII code · 7 bits', character.binary ?? 'Outside standard ASCII')
      } else {
        addValue('Unicode code point', character.codePoint)
        addValue('Standard ASCII?', character.ascii ? 'Yes · value ' + character.point : 'No · outside 0–127')
        const group = node('div', 'text-byte-value')
        group.append(node('dt', '', 'UTF-8 bytes · hexadecimal'))
        const bytes = node('dd', 'text-bytes')
        character.bytes.forEach(byte => bytes.append(node('code', 'text-byte', hexByte(byte))))
        bytes.append(node('span', 'text-byte-count', `${character.bytes.length} byte${character.bytes.length === 1 ? '' : 's'}`))
        group.append(bytes)
        values.append(group)
      }
      card.append(identity, values)
    }

    function render(text, persist = false) {
      inspected = inspectCharacterText(text)
      selected = Math.min(selected, Math.max(0, inspected.codePoints - 1))
      if (input && input.value !== inspected.text) input.value = inspected.text
      tokens.replaceChildren()
      inspected.characters.forEach((character, index) => {
        const button = node('button', 'text-token', character.name)
        button.type = 'button'
        button.dataset.characterIndex = String(index)
        button.setAttribute('aria-label', `Position ${index + 1}: ${character.name}`)
        tokens.append(button)
      })
      if (table) {
        table.replaceChildren()
        inspected.characters.forEach(character => {
          const row = node('tr')
          ;[character.name, character.codePoint, String(character.point), character.binary ?? 'Outside ASCII', character.bytes.map(hexByte).join(' ')].forEach(value => row.append(node('td', '', value)))
          table.append(row)
        })
      }
      if (mode === 'ascii') status.textContent = 'Select a symbol. Its number and seven-bit code stay linked.'
      else if (!inspected.codePoints) status.textContent = 'Enter text. The example accepts up to 40 code points.'
      else {
        const coverage = inspected.unsupported.length
          ? `Outside standard ASCII: ${[...new Set(inspected.unsupported.map(item => item.name))].join(', ')}. UTF-8 can represent this text.`
          : 'Every code point is in standard ASCII.'
        status.textContent = `${inspected.codePoints} code points · ${inspected.bytes.length} UTF-8 bytes. ${coverage}${inspected.codePoints === CHARACTER_LIMIT ? ' 40-code-point limit reached.' : ''}`
      }
      renderSelection()
      if (persist) writeStorage(INSPECTOR_STORAGE_KEY, { text: inspected.text })
    }

    tokens.addEventListener('click', event => {
      const button = event.target.closest('[data-character-index]')
      if (!button || !tokens.contains(button)) return
      selected = Number(button.dataset.characterIndex)
      renderSelection()
    })
    input?.addEventListener('input', () => { selected = 0; render(input.value, true) })
    host.querySelectorAll('[data-inspector-sample]').forEach(button => button.addEventListener('click', () => {
      selected = 0
      render(button.dataset.inspectorSample, true)
    }))
    host.querySelector('[data-inspector-reset]')?.addEventListener('click', () => { selected = 0; render(original) })
    host.querySelector('[data-inspector-restore]')?.addEventListener('click', () => {
      const saved = readStorage(INSPECTOR_STORAGE_KEY, null)
      if (typeof saved?.text !== 'string') { status.textContent = 'There is no saved exploration yet. Try one of the examples.'; return }
      selected = 0
      render(boundCharacterText(saved.text))
    })
    host.querySelectorAll('[data-inspector-controls], [data-inspector-live]').forEach(element => { element.hidden = false })
    host.querySelector('[data-inspector-fallback]').hidden = true
    render(original)
  })
}

function initMismatch() {
  const host = document.querySelector('[data-encoding-mismatch]')
  const decoder = host.querySelector('[data-decoder]')
  const output = host.querySelector('[data-decoded-text]')
  const status = host.querySelector('[data-decoder-status]')
  function render() {
    output.textContent = decodeMismatch(decoder.value)
    status.textContent = decoder.value === 'utf-8'
      ? 'Same encoding at both ends: C3 A9 is decoded together as é.'
      : 'Same bytes, different interpretation: Windows-1252 reads C3 as Ã and A9 as ©.'
  }
  decoder.addEventListener('change', render)
  host.querySelector('[data-decoder-reset]').addEventListener('click', () => { decoder.value = 'utf-8'; render() })
  host.querySelector('[data-decoder-controls]').hidden = false
  host.querySelector('[data-decoder-live]').hidden = false
  host.querySelector('[data-decoder-fallback]').hidden = true
  render()
}

initLessonPage(lessonConfig)
initCharacterTransmissions()
initCharacterInspectors()
initMismatch()
