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
export function bitmapPixelData(width,height,bitsPerPixel) {
  if (![width,height,bitsPerPixel].every(value=>Number.isInteger(value)&&value>0)) throw new RangeError('Dimensions and depth must be positive integers.')
  const pixels=width*height, bits=pixels*bitsPerPixel
  if(!Number.isSafeInteger(bits)) throw new RangeError('Pixel data exceeds the supported range.')
  return {pixels,bits,bytes:bits/8}
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
