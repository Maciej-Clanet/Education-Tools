import { normaliseDepth, quantiseShade } from '../data/image-quality-model.js'

const SVG_NS = 'http://www.w3.org/2000/svg'
const POSITION_COUNT = 256
const explanations = {
  1: 'Two shades: black or white. The abrupt change is a jump in tone; the pixel positions have not changed.',
  2: 'Four shades create visible bands. Several neighbouring pixels must share the same available shade.',
  4: 'Sixteen shades make the steps smaller. More tonal detail can be represented at the same pixel positions.',
  8: 'All 256 reference shades are available. This version matches the reference without adding any pixel positions.',
}

function renderGradient(host, requestedDepth) {
  const depth = normaliseDepth(requestedDepth)
  const ramp = host.querySelector('[data-gradient-selected]')
  const fragment = document.createDocumentFragment()
  for (let position = 0; position < POSITION_COUNT; position += 1) {
    // Every setting is independently quantised from the original 0–255 ramp.
    const { shade } = quantiseShade(position, depth)
    const sample = document.createElementNS(SVG_NS, 'rect')
    sample.setAttribute('x', String(position))
    sample.setAttribute('y', '0')
    sample.setAttribute('width', '1')
    sample.setAttribute('height', '40')
    sample.setAttribute('fill', `rgb(${shade},${shade},${shade})`)
    fragment.append(sample)
  }
  ramp.replaceChildren(fragment)
  ramp.setAttribute('aria-label', `${depth} bits per pixel: ${2 ** depth} available shades across the same 256 horizontal pixel positions.`)
  host.querySelector('[data-gradient-bits]').textContent = `${depth} bit${depth === 1 ? '' : 's'} per pixel`
  host.querySelector('[data-gradient-values]').textContent = String(2 ** depth)
  host.querySelector('[data-gradient-explanation]').textContent = explanations[depth]
  host.querySelectorAll('[data-gradient-depth]').forEach(button => {
    const selected = Number(button.dataset.gradientDepth) === depth
    button.setAttribute('aria-pressed', String(selected))
    button.classList.toggle('primary-link', selected)
    button.classList.toggle('lesson-secondary-action', !selected)
  })
  host.dataset.selectedDepth = String(depth)
}

export function initBitDepthGradients(root = document) {
  root.querySelectorAll('[data-bit-depth-gradient]').forEach(host => {
    if (host.dataset.gradientReady) return
    const controls = host.querySelector('[data-gradient-controls]')
    const required = ['[data-gradient-selected]', '[data-gradient-bits]', '[data-gradient-values]', '[data-gradient-explanation]']
    if (!controls || required.some(selector => !host.querySelector(selector))) return
    host.querySelectorAll('[data-gradient-depth]').forEach(button => {
      button.addEventListener('click', () => renderGradient(host, button.dataset.gradientDepth))
    })
    renderGradient(host, 2)
    host.dataset.gradientReady = 'true'
    controls.hidden = false
  })
}
