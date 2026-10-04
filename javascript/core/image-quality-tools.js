import { normaliseDepth, quantiseShade, RUN_PRESETS, encodeRuns, decodeRuns } from '../data/image-quality-model.js'

const assetBase = '../../assets/images/image-representation/'
const text = (root, name, value) => { const node = root.querySelector(`[data-quality-output="${name}"]`); if (node) node.textContent = value }
function buttons(root, selector, current, attribute) { root.querySelectorAll(selector).forEach(button => button.setAttribute('aria-pressed', String(button.getAttribute(attribute) === String(current)))) }

export function initImageQualityTools(assets, root = document) {
  root.querySelectorAll('[data-quality-resolution]').forEach(tool => {
    let size = 16
    const render = () => {
      tool.querySelector('.quality-scene').src = `${assetBase}quality-resolution-${size}.svg`
      tool.querySelector('.quality-scene').alt = `The same house scene sampled as ${size} by ${size} pixels.`
      text(tool, 'resolution', `${size} × ${size} = ${size * size} pixels`)
      text(tool, 'resolution-detail', size === 8 ? 'The narrow door falls between these sample centres and disappears.' : 'More samples distinguish the narrow door and the roof edge.')
      buttons(tool, '[data-resolution-size]', size, 'data-resolution-size')
    }
    tool.querySelectorAll('[data-resolution-size]').forEach(button => button.addEventListener('click', () => { size = Number(button.dataset.resolutionSize); render() }))
    tool.querySelector('[data-quality-reset]').addEventListener('click', () => { size = 16; render() })
    tool.querySelector('[data-quality-controls]').hidden = false
    render()
  })
  root.querySelectorAll('[data-quality-zoom]').forEach(tool => {
    const render = scale => {
      tool.querySelector('[data-zoom-image]').style.width = `${64 * scale}px`
      text(tool, 'zoom', `View ×${scale} · stored image still 8 × 8 (64 pixels)`)
      buttons(tool, '[data-zoom-scale]', scale, 'data-zoom-scale')
    }
    tool.querySelectorAll('[data-zoom-scale]').forEach(button => button.addEventListener('click', () => render(Number(button.dataset.zoomScale))))
    tool.querySelector('[data-quality-reset]').addEventListener('click', () => render(1))
    tool.querySelector('[data-quality-controls]').hidden = false
    render(1)
  })
  root.querySelectorAll('[data-quality-depth]').forEach(tool => {
    let depth = 2
    const inspect = tool.querySelector('[data-shade-input]')
    const render = () => {
      const value = quantiseShade(inspect.value, depth)
      const image = tool.querySelector('[data-depth-image]')
      image.src = `${assetBase}quality-grey-${depth}.png`
      image.alt = `The same photograph with ${2 ** depth} available grey shades at ${depth} bits per pixel.`
      tool.querySelector('[data-depth-gradient]').src = `${assetBase}quality-gradient-${depth}.svg`
      tool.querySelector('[data-depth-gradient]').alt = `256 gradient positions using ${2 ** depth} available grey shades.`
      text(tool, 'depth', `${depth} bit${depth === 1 ? '' : 's'} per pixel · ${2 ** depth} possible shades`)
      text(tool, 'shade', `Source brightness ${inspect.value} → code ${value.code} → displayed grey ${value.shade}`)
      text(tool, 'banding', depth <= 2 ? 'Few shades make distinct bands.' : depth === 4 ? 'Sixteen shades reduce the jumps between tones.' : '256 shades preserve smoother tonal changes.')
      buttons(tool, '[data-depth-value]', depth, 'data-depth-value')
    }
    tool.querySelectorAll('[data-depth-value]').forEach(button => button.addEventListener('click', () => { depth = normaliseDepth(button.dataset.depthValue); render() }))
    inspect.addEventListener('input', render)
    tool.querySelector('[data-quality-reset]').addEventListener('click', () => { depth = 2; inspect.value = '110'; render() })
    tool.querySelectorAll('[data-quality-controls]').forEach(controls => { controls.hidden = false })
    render()
  })
  root.querySelectorAll('[data-quality-runs]').forEach(tool => {
    let preset = 'flat', stage = 0
    const stages = ['Original pixel values', 'Group neighbouring equal values', 'Store count and shade pairs', 'Decode and compare']
    const row = values => {
      const fragment = document.createDocumentFragment()
      values.forEach(value => { const cell = document.createElement('span'); cell.textContent = value; cell.style.backgroundColor = value ? '#fff' : '#24313b'; cell.style.color = value ? '#24313b' : '#fff'; fragment.append(cell) })
      return fragment
    }
    const render = () => {
      const values = RUN_PRESETS[preset], runs = encodeRuns(values)
      tool.querySelector('[data-run-original]').replaceChildren(row(values))
      tool.querySelector('[data-run-decoded]').replaceChildren(row(decodeRuns(runs)))
      const pairs = tool.querySelector('[data-run-pairs]')
      pairs.replaceChildren(...runs.map(run => { const item = document.createElement('span'); item.className = 'quality-pair'; item.textContent = `${run.count} × ${run.value}`; return item }))
      text(tool, 'run-stage', `Step ${stage + 1} of 4: ${stages[stage]}`)
      text(tool, 'run-count', `${runs.length} runs of equal neighbouring shades`)
      text(tool, 'run-size', `Pixel values: 16 bytes. Count/value pairs: ${runs.length * 2} bytes. Headers excluded.`)
      text(tool, 'run-verdict', `All ${values.length} values match exactly. ${preset === 'flat' ? 'Repetition makes this example smaller.' : 'The alternating example grows: two bytes per run for sixteen one-pixel runs.'}`)
      tool.querySelectorAll('[data-run-after]').forEach(node => { node.hidden = stage < Number(node.dataset.runAfter) })
      tool.querySelector('[data-quality-output="run-count"]').hidden = stage !== 1
      tool.querySelector('[data-run-prev]').setAttribute('aria-disabled', String(stage === 0))
      tool.querySelector('[data-run-next]').setAttribute('aria-disabled', String(stage === 3))
      buttons(tool, '[data-run-preset]', preset, 'data-run-preset')
    }
    tool.querySelectorAll('[data-run-preset]').forEach(button => button.addEventListener('click', () => { preset = button.dataset.runPreset; stage = 0; render() }))
    tool.querySelector('[data-run-prev]').addEventListener('click', () => { stage = Math.max(0, stage - 1); render() })
    tool.querySelector('[data-run-next]').addEventListener('click', () => { stage = Math.min(3, stage + 1); render() })
    tool.querySelector('[data-quality-reset]').addEventListener('click', () => { preset = 'flat'; stage = 0; render() })
    tool.querySelectorAll('[data-quality-controls]').forEach(controls => { controls.hidden = false })
    render()
  })
  root.querySelectorAll('[data-quality-compression]').forEach(tool => {
    let subject = 'photo', variant = 'medium'
    const render = () => {
      const reference = assets[subject].source, selected = assets[subject][variant]
      const subjectName = subject === 'photo' ? 'Photograph' : 'Diagram'
      for (const [role, asset] of [['source', reference], ['variant', selected]]) {
        tool.querySelectorAll(`[data-compression-image="${role}"]`).forEach(img => { img.src = asset.src; img.alt = `${subjectName}: ${role === 'source' ? 'reference PNG' : asset.label}` })
        text(tool, `${role}-size`, `${asset.bytes.toLocaleString('en-GB')} bytes`)
      }
      text(tool, 'variant-label', selected.label)
      text(tool, 'compression-status', `${subjectName} · ${reference.width} × ${reference.height} in both files · ${variant === 'source' ? 'The same lossless reference is shown twice.' : 'Compare the same edge or texture in both crops; dimensions have not changed.'}`)
      buttons(tool, '[data-compression-subject]', subject, 'data-compression-subject')
      buttons(tool, '[data-compression-variant]', variant, 'data-compression-variant')
      tool.querySelectorAll('[data-compression-crop]').forEach(crop => { crop.dataset.subject = subject })
    }
    tool.querySelectorAll('[data-compression-subject]').forEach(button => button.addEventListener('click', () => { subject = button.dataset.compressionSubject; render() }))
    tool.querySelectorAll('[data-compression-variant]').forEach(button => button.addEventListener('click', () => { variant = button.dataset.compressionVariant; render() }))
    tool.querySelector('[data-quality-reset]').addEventListener('click', () => { subject = 'photo'; variant = 'medium'; render() })
    tool.querySelectorAll('[data-quality-controls]').forEach(controls => { controls.hidden = false })
    render()
  })
}
