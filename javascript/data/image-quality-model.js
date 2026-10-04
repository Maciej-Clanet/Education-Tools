// Fixed teaching models; these payload totals exclude file overhead/compression.
export const QUALITY_DEPTHS = [1, 2, 4, 8]
export function normaliseDepth(value) {
  const depth = Number(value)
  return QUALITY_DEPTHS.includes(depth) ? depth : 2
}
export function quantiseShade(value, depth = 2) {
  depth = normaliseDepth(depth)
  const original = Math.max(0, Math.min(255, Number(value) || 0))
  const levels = 2 ** depth
  const index = Math.round(original * (levels - 1) / 255)
  return { index, shade: Math.round(index * 255 / (levels - 1)), code: index.toString(2).padStart(depth, '0'), levels }
}
export function rawPixelSize(width, height, bitsPerPixel) {
  if (![width, height, bitsPerPixel].every(value => Number.isInteger(value) && value > 0)) throw new RangeError('Positive integer dimensions and bits per pixel are required.')
  const pixels = width * height
  const bits = pixels * bitsPerPixel
  return { pixels, bits, bytes: bits / 8, megabytes: bits / 8 / 1_000_000 }
}
export const RUN_PRESETS = {
  flat: [...Array(8).fill(0), ...Array(8).fill(255)],
  alternating: Array.from({ length: 16 }, (_, index) => index % 2 ? 255 : 0),
}
export function encodeRuns(values) {
  if (!Array.isArray(values) || values.some(value => !Number.isInteger(value) || value < 0 || value > 255)) throw new RangeError('Each shade must fit in one byte.')
  const runs = []
  for (const value of values) {
    const last = runs.at(-1)
    if (last && last.value === value && last.count < 255) last.count++
    else runs.push({ count: 1, value })
  }
  return runs
}
export function decodeRuns(runs) {
  if (!Array.isArray(runs) || runs.some(run => !Number.isInteger(run.count) || run.count < 1 || run.count > 255 || !Number.isInteger(run.value) || run.value < 0 || run.value > 255)) throw new RangeError('Runs need a one-byte count and one-byte shade.')
  return runs.flatMap(run => Array(run.count).fill(run.value))
}
// A fixed high-detail scene, sampled at pixel centres. More samples resolve
// a narrow door and roof edge; enlarging an existing sample grid cannot do so.
export function sceneColour(x, y) {
  if (Math.hypot(x - .79, y - .18) < .095) return '#f3c64d'
  if (y > .81) return '#658c60'
  if (y > .32 && y < .50 && Math.abs(x - .5) < (y - .32) * 1.75) return '#9f5b46'
  if (x > .22 && x < .78 && y >= .5 && y <= .81) {
    if (x > .465 && x < .535 && y > .615) return '#243d49'
    if ((x > .29 && x < .40 || x > .60 && x < .71) && y > .55 && y < .66) return '#5692b2'
    return '#eedcc1'
  }
  return '#cbe4ef'
}
export function scenePixels(size) {
  if (![8, 16, 32].includes(size)) throw new RangeError('Use a teaching sample size: 8, 16 or 32.')
  return Array.from({ length: size * size }, (_, index) => sceneColour(((index % size) + .5) / size, (Math.floor(index / size) + .5) / size))
}

export const imageQualityScenarios = {
  screenshot: { acceptedPairs: [['lossless', 'text']], incompleteMessage: 'Choose a setting and a reason.', successMessage: 'A suitable pair.', retryMessage: 'Consider the small text and the need for exact pixel values.', explanation: 'Keep adequate dimensions and use lossless encoding so small text is not changed by lossy compression.' },
  gallery: { acceptedPairs: [['lossy', 'transfer']], incompleteMessage: 'Choose a setting and a reason.', successMessage: 'A suitable pair.', retryMessage: 'Link your choice to photographic detail and the transfer budget.', explanation: 'A resized, carefully checked lossy copy can reduce transfer size. Keep the source and inspect the result; the smallest file may lose too much detail.' },
  icon: { acceptedPairs: [['mono', 'two']], incompleteMessage: 'Choose a setting and a reason.', successMessage: 'A suitable pair.', retryMessage: 'Count how many pixel values the display needs.', explanation: 'This icon uses exactly black and white with no grey edge pixels, so one bit per pixel can represent its two values.' },
}

export const imageQualityQuestions = [
  ['How many pixels are in a 100 × 80 image?', ['180', '8,000', '64,000'], 1, 'Multiply width by height: 100 × 80 = 8,000 pixels.'],
  ['Width and height both double. At the same bits per pixel, what happens to raw pixel data?', ['It doubles', 'It stays the same', 'It becomes four times as large'], 2, 'There are twice as many columns and twice as many rows: 2 × 2 = 4.'],
  ['You zoom into an 8 × 8 image without resampling. What changes?', ['Its displayed size, while the 64 stored samples stay the same', 'Its stored dimensions automatically increase', 'Original detail missing from the samples is recovered'], 0, 'Zoom changes the view. It does not add information to the source pixels.'],
  ['A 1200 × 800 image changes from 150 PPI to 300 PPI with resampling OFF. What happens?', ['Pixel count doubles', 'It prints smaller; pixel count stays the same', 'Its stored colours double'], 1, 'The same 1200 × 800 samples are packed into fewer inches. No samples are added.'],
  ['How many different codes can four bits represent?', ['4', '8', '16'], 2, '2⁴ = 16 possible codes. Each extra bit doubles the number.'],
  ['An RGB pixel has 8 bits for red, 8 for green and 8 for blue. What is its depth, excluding alpha?', ['8 bits per pixel', '24 bits per pixel', '256 bits per pixel'], 1, 'Add all three channels: 8 + 8 + 8 = 24 bits per pixel.'],
  ['What is the raw pixel payload of an 8 × 4 image at 2 bits per pixel?', ['8 bytes', '64 bytes', '32 bytes'], 0, '8 × 4 × 2 = 64 bits; 64 ÷ 8 = 8 bytes, excluding extra file data.'],
  ['What is the raw pixel payload of a 600 × 400 image at 24 bits per pixel?', ['5,760,000 bytes', '240,000 bytes', '720,000 bytes'], 2, '600 × 400 × 24 = 5,760,000 bits, divided by eight = 720,000 bytes.'],
  ['What makes compression lossless?', ['The decoded image looks close enough', 'The original supplied data can be reconstructed exactly', 'The file always uses fewer bytes'], 1, 'Lossless means exact reconstruction of the data given to the encoder, not guaranteed savings.'],
  ['Two JPEG copies have identical dimensions but different compression settings. Can their decoded pixels differ?', ['Yes: lossy compression can change values without changing the dimensions', 'No: identical dimensions mean identical data', 'Only if the display resolution changes'], 0, 'Pixel count and pixel values are different properties. Lossy encoding may change the values.'],
  ['Why may a PNG file size differ from width × height × bits per pixel ÷ 8?', ['The formula measures its physical print size', 'PNG does not contain raster images', 'The formula excludes compression and extra file information'], 2, 'The formula models uncompressed pixel payload, not the complete encoded file.'],
  ['A screenshot has small text and must preserve its pixel values exactly. Which choice is justified?', ['Strong lossy compression because all web images should use it', 'Lossless encoding at adequate dimensions to preserve the supplied values', 'Reduce to two colours regardless of the source'], 1, 'The exact-data requirement favours lossless encoding; adequate dimensions keep the text samples.'],
]
