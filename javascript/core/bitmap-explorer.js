import { readStorage, writeStorage } from './storage.js'
import { BITMAP_ART_KEY, IMAGE_PALETTE, MONO_ARROW, PRACTICE_TARGET, normaliseArtwork, mismatchedPixels, pixelRows } from '../data/bitmap-image-model.js'

function setText(root, selector, text) { const node = root.querySelector(selector); if (node) node.textContent = text }
function setPressed(buttons, active) { buttons.forEach(button => button.setAttribute('aria-pressed', String(button === active))) }

export function initBitmapExplorers(root = document) {
  root.querySelectorAll('[data-bitmap-locator]').forEach(host => {
    const cells = [...host.querySelectorAll('[data-pixel]')]
    cells.forEach((button, index) => button.addEventListener('click', () => {
      setPressed(cells, button)
      setText(host, '[data-position]', `Row ${Math.floor(index / 8) + 1}, column ${index % 8 + 1}: ${MONO_ARROW[index] ? 'black' : 'white'}. One of 32 pixels.`)
    }))
    host.querySelector('[data-reset]').addEventListener('click', () => cells[12].click())
  })
  root.querySelectorAll('[data-one-bit]').forEach(host => {
    let value = 1
    function render() {
      setText(host, '[data-bit-value]', String(value))
      setText(host, '[data-bit-caption]', `${value ? 'Black' : 'White'} pixel → code ${value}`)
      host.querySelector('[data-bit-swatch]').style.background = value ? '#243746' : '#fff'
    }
    host.querySelector('[data-toggle-bit]').addEventListener('click', () => { value = 1 - value; render() })
    host.querySelector('[data-reset]').addEventListener('click', () => { value = 1; render() })
  })
  root.querySelectorAll('[data-bitmap-reshape]').forEach(host => {
    const controls = [...host.querySelectorAll('[data-width]')]
    const cells = [...host.querySelectorAll('[data-reshape-cell]')]
    function render(width) {
      const grid = host.querySelector('[data-reshape-grid]')
      grid.style.setProperty('--bitmap-cols', String(width))
      grid.style.width = width === 4 ? 'min(100%, 164px)' : ''
      cells.forEach((cell, i) => cell.setAttribute('aria-label', `Row ${Math.floor(i / width) + 1}, column ${i % width + 1}: ${MONO_ARROW[i]}`))
      setPressed(controls, controls.find(button => Number(button.dataset.width) === width))
      setText(host, '[data-reshape-status]', `${width} columns × ${32 / width} rows. The same 32 bits.`)
      setText(host, '[data-reshape-rows]', pixelRows(MONO_ARROW, width).map(row => row.join('')).join('\n'))
    }
    controls.forEach(button => button.addEventListener('click', () => render(Number(button.dataset.width))))
    host.querySelector('[data-reset]').addEventListener('click', () => render(8))
  })
  root.querySelectorAll('[data-palette-demo]').forEach(host => {
    let changed = false
    function render() {
      host.querySelectorAll('[data-gold-pixel]').forEach(pixel => { pixel.style.setProperty('--pixel-colour', changed ? '#a483cf' : IMAGE_PALETTE[2].colour) })
      setText(host, '[data-palette-meaning]', changed ? '10 = Violet' : '10 = Gold')
      setText(host, '[data-palette-status]', changed ? 'All four pixels containing 10 now use violet. Every stored pixel code is unchanged.' : 'Four pixels contain 10. The palette gives that code the colour gold.')
      host.querySelector('[data-toggle-palette]').setAttribute('aria-pressed', String(changed))
    }
    host.querySelector('[data-toggle-palette]').addEventListener('click', () => { changed = !changed; render() })
    host.querySelector('[data-reset]').addEventListener('click', () => { changed = false; render() })
  })
  root.querySelectorAll('[data-bitmap-builder]').forEach(host => {
    let state = normaliseArtwork(readStorage(BITMAP_ART_KEY, null))
    let colour = 1
    const cells = [...host.querySelectorAll('[data-paint-pixel]')]
    const palette = [...host.querySelectorAll('[data-paint-colour]')]
    function render() {
      cells.forEach((cell, i) => {
        const item = IMAGE_PALETTE[state.pixels[i]]
        cell.style.setProperty('--pixel-colour', item.colour)
        cell.dataset.value = String(state.pixels[i])
        cell.textContent = item.code
        cell.setAttribute('aria-label', `Row ${Math.floor(i / 8) + 1}, column ${i % 8 + 1}: ${item.name}, ${item.code}. Paint ${IMAGE_PALETTE[colour].name}.`)
        cell.classList.remove('is-mismatch')
      })
      setText(host, '[data-builder-rows]', pixelRows(state.pixels, 8).map(row => row.map(value => IMAGE_PALETTE[value].code).join(' ')).join('\n'))
      setPressed(palette, palette.find(button => Number(button.dataset.paintColour) === colour))
    }
    function save() { writeStorage(BITMAP_ART_KEY, state) }
    palette.forEach(button => button.addEventListener('click', () => {
      colour = Number(button.dataset.paintColour); render()
      setText(host, '[data-builder-status]', `Selected ${IMAGE_PALETTE[colour].name}, code ${IMAGE_PALETTE[colour].code}. Choose a pixel to paint.`)
    }))
    cells.forEach((cell, i) => {
      cell.addEventListener('click', () => {
        state.pixels[i] = colour; render(); save()
        setText(host, '[data-builder-status]', `Row ${Math.floor(i / 8) + 1}, column ${i % 8 + 1} now stores ${IMAGE_PALETTE[colour].code}. Pixel data still uses 64 bits.`)
      })
      cell.addEventListener('keydown', event => {
        const moves = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 8, ArrowUp: -8 }
        if (!(event.key in moves)) return
        event.preventDefault(); cells[Math.max(0, Math.min(31, i + moves[event.key]))].focus()
      })
    })
    host.querySelector('[data-check-bitmap]').addEventListener('click', () => {
      const errors = mismatchedPixels(state.pixels, PRACTICE_TARGET)
      errors.forEach(i => cells[i].classList.add('is-mismatch'))
      setText(host, '[data-builder-status]', errors.length ? `${errors.length} pixels differ from the target. Outlined pixels need another code; the first is row ${Math.floor(errors[0] / 8) + 1}, column ${errors[0] % 8 + 1}.` : 'Exact match: all 32 pixel codes reconstruct the target. The raw pixel data uses 64 bits, or 8 bytes.')
    })
    host.querySelector('[data-clear-art]').addEventListener('click', () => { state = normaliseArtwork(null); render(); save(); setText(host, '[data-builder-status]', 'Your practice grid is cleared to white. The target and written answers are unchanged.') })
    render()
  })
  root.querySelectorAll('[data-vector-zoom]').forEach(host => {
    const buttons = [...host.querySelectorAll('[data-zoom]')]
    function render(scale) {
      host.querySelectorAll('[data-scaled-badge]').forEach(image => image.style.width = `${24 * scale}px`)
      setPressed(buttons, buttons.find(button => Number(button.dataset.zoom) === scale))
      setText(host, '[data-zoom-status]', `×${scale} display enlargement: ${24 * scale} CSS pixels wide. The raster still has 24 × 24 stored pixels; the vector still has 3 shapes.`)
    }
    buttons.forEach(button => button.addEventListener('click', () => render(Number(button.dataset.zoom))))
    host.querySelector('[data-reset]').addEventListener('click', () => render(8))
    render(8)
  })
}
