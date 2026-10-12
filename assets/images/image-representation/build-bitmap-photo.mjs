// Reproduce the separately credited photograph used by the bitmap lesson.
// Run from any directory with Node.js and ImageMagick 7 on PATH.
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'

const assetDir = path.dirname(fileURLToPath(import.meta.url))
const projectDir = path.resolve(assetDir, '../../..')
const sourcePath = path.join(projectDir, '.raid-checks/bitmap-photo-nasa-source.jpg')
const outputPath = path.join(assetDir, 'bitmap-photo.jpg')
const sourceUrl = 'https://images-assets.nasa.gov/image/s84-27017/s84-27017~large.jpg'
const sourceSha256 = '011931746cbddd5442b5d8914d9d8806126d4c4e000a795db15cac5634fd1968'
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex')

await fs.mkdir(path.dirname(sourcePath), { recursive: true })
let sourceBytes
try { sourceBytes = await fs.readFile(sourcePath) } catch (error) {
  if (error.code !== 'ENOENT') throw error
  const response = await fetch(sourceUrl, { signal: AbortSignal.timeout(30000) })
  if (!response.ok) throw new Error(`NASA image download failed: HTTP ${response.status}`)
  sourceBytes = Buffer.from(await response.arrayBuffer())
  if (sha256(sourceBytes) !== sourceSha256) throw new Error('NASA source has changed; review it before regenerating.')
  await fs.writeFile(sourcePath, sourceBytes)
}
if (sha256(sourceBytes) !== sourceSha256) throw new Error('Cached source does not match the verified NASA image.')

const args = [
  sourcePath, '-auto-orient', '-crop', '1905x1270+0+0', '+repage',
  '-filter', 'Lanczos', '-resize', '960x640!', '-colorspace', 'sRGB',
  '-sampling-factor', '4:4:4', '-quality', '94', '-strip', outputPath
]
execFileSync('magick', args)
const outputBytes = await fs.readFile(outputPath)
const dimensions = execFileSync('magick', ['identify', '-format', '%wx%h', outputPath], { encoding: 'utf8' }).trim()
if (dimensions !== '960x640') throw new Error(`Unexpected output dimensions: ${dimensions}`)

const metadata = {
  file: 'bitmap-photo.jpg',
  title: 'Bruce McCandless II on the first untethered spacewalk',
  nasaImageId: 'S84-27017',
  creator: 'Robert L. "Hoot" Gibson / NASA',
  photographDate: '1984-02-07',
  sourcePage: 'https://www.nasa.gov/history/photos-from-sts-41b/',
  sourceAssetUrl: sourceUrl,
  rights: {
    label: 'NASA imagery: educational reuse permitted; generally not subject to US copyright',
    url: 'https://www.nasa.gov/nasa-brand-center/images-and-media/',
    note: 'The official source credits NASA and identifies Gibson as the photographer. No third-party copyright claim is attached to this image. NASA permits educational/informational use with source acknowledgement; this lesson does not imply endorsement.',
    verifiedDate: '2026-10-04'
  },
  source: { width: 1905, height: 1920, bytes: sourceBytes.length, sha256: sourceSha256 },
  derivation: {
    crop: { x: 0, y: 0, width: 1905, height: 1270 },
    resize: { width: 960, height: 640, filter: 'Lanczos' },
    colourSpace: 'sRGB',
    format: 'JPEG',
    jpegSamplingFactor: '4:4:4',
    jpegEncoderQuality: 94,
    stripMetadata: true,
    tool: execFileSync('magick', ['-version'], { encoding: 'utf8' }).split(/\r?\n/)[0],
    command: 'magick SOURCE.jpg -auto-orient -crop 1905x1270+0+0 +repage -filter Lanczos -resize 960x640! -colorspace sRGB -sampling-factor 4:4:4 -quality 94 -strip bitmap-photo.jpg',
    note: 'The NASA download is a JPEG reproduction. This resized and cropped lesson image is not original camera data. No objects or scene details have been added or removed independently.'
  },
  output: { width: 960, height: 640, bytes: outputBytes.length, sha256: sha256(outputBytes) },
  teachingCrop: {
    x: 636, y: 176, width: 60, height: 40,
    description: 'The gold visor and pale helmet edge, showing nearby colour variations.',
    cssBox: { left: '66.25%', top: '27.5%', width: '6.25%', height: '6.25%' },
    cssEnlargedImage: { width: '1600%', height: '1600%', transform: 'translate(-66.25%, -27.5%)', imageRendering: 'pixelated' },
    note: 'Both frames must retain the 3:2 aspect ratio. The crop is a display of the same decoded source pixels, with no resampling or separate recompression of the crop.'
  },
  caption: 'Bruce McCandless above Earth, 7 February 1984. Photograph: NASA / Robert L. "Hoot" Gibson. Resized and cropped; the close-up uses the same image.'
}
await fs.writeFile(path.join(assetDir, 'bitmap-photo.json'), `${JSON.stringify(metadata, null, 2)}\n`)
console.log(`Created bitmap-photo.jpg: ${dimensions}, ${outputBytes.length} bytes`)
