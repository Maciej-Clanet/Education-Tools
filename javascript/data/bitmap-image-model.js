export const BITMAP_WIDTH = 8
export const BITMAP_HEIGHT = 4
export const MONO_ARROW = '00011000001111000111111000011000'.split('').map(Number)
export const IMAGE_PALETTE = [
  { name: 'White', code: '00', colour: '#ffffff' },
  { name: 'Teal', code: '01', colour: '#167b76' },
  { name: 'Gold', code: '10', colour: '#e3b445' },
  { name: 'Ink', code: '11', colour: '#243746' },
]
export const COLOUR_ARROW = [0,0,0,2,2,0,0,0, 0,0,1,2,2,1,0,0, 0,1,1,3,3,1,1,0, 0,0,0,3,3,0,0,0]
export const PRACTICE_TARGET = [0,1,1,0,0,1,1,0, 1,2,2,1,1,2,2,1, 1,2,3,3,3,3,2,1, 0,1,1,1,1,1,1,0]
export const BITMAP_ART_KEY = 'lesson-image-storage-bitmap-builder-v3'

export function encodePixels(pixels, depth) {
  if (!Number.isInteger(depth) || depth < 1 || depth > 8) throw new RangeError('Use 1–8 bits per pixel.')
  if (!Array.isArray(pixels) || pixels.some(value => !Number.isInteger(value) || value < 0 || value >= 2 ** depth)) throw new RangeError('A pixel value does not fit the stated depth.')
  return pixels.map(value => value.toString(2).padStart(depth, '0')).join('')
}

export function decodePixels(bits, depth) {
  if (!Number.isInteger(depth) || depth < 1 || depth > 8 || typeof bits !== 'string' || !/^[01]*$/.test(bits) || bits.length % depth) throw new RangeError('The bit sequence must contain complete pixel codes.')
  return Array.from({ length: bits.length / depth }, (_, i) => parseInt(bits.slice(i * depth, (i + 1) * depth), 2))
}

export function pixelRows(pixels, width) {
  if (!Number.isInteger(width) || width < 1 || !Array.isArray(pixels) || pixels.length % width) throw new RangeError('Width must divide the number of pixels.')
  return Array.from({ length: pixels.length / width }, (_, row) => pixels.slice(row * width, (row + 1) * width))
}

export function normaliseArtwork(value) {
  const source = Array.isArray(value?.pixels) ? value.pixels : []
  return { pixels: Array.from({ length: 32 }, (_, i) => Number.isInteger(source[i]) && source[i] >= 0 && source[i] <= 3 ? source[i] : 0) }
}

export function mismatchedPixels(pixels, target) {
  if (pixels.length !== target.length) throw new RangeError('Images must have matching dimensions.')
  return pixels.flatMap((value, i) => value === target[i] ? [] : [i])
}

export const bitmapScenarios = {
  'museum-photo': {
    acceptedPairs: [['bitmap', 'detail']],
    incompleteMessage: 'Choose a representation and a reason.',
    successMessage: 'That choice fits the photograph.',
    retryMessage: 'Connect the stored information to the subject.',
    explanation: 'A raster stores the many local colour variations of the artefact pixel by pixel. A larger display still needs enough source pixels.',
  },
  'route-diagram': {
    acceptedPairs: [['vector', 'shapes']],
    incompleteMessage: 'Choose a representation and a reason.',
    successMessage: 'That choice fits the diagram.',
    retryMessage: 'Consider the lines and shapes being reused.',
    explanation: 'Vector geometry describes the route lines and stops and can be rendered at different sizes. Complex artwork is not automatically a small file.',
  },
}
