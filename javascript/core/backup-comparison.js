import { buildBackupSets } from './backup-model.js'

export function comparisonFrame(example, dayIndex) {
  const index = Math.max(0, Math.min(example.days.length - 1, dayIndex))
  return {
    index,
    day: example.days[index],
    sets: Object.fromEntries(['full', 'incremental', 'differential'].map(type => [type, buildBackupSets(example.files, example.days, type)[index]])),
  }
}

export function fileTokens(files, { changed = [], compact = false } = {}) {
  const list = document.createElement('ul')
  list.className = `bk-files${compact ? ' bk-files-compact' : ''}`
  for (const [file, version] of Object.entries(files)) {
    const item = document.createElement('li')
    item.dataset.file = file
    item.classList.toggle('bk-file-changed', changed.includes(file))
    const name = document.createElement('span')
    name.textContent = file.replace('.csv', '')
    const badge = document.createElement('b')
    badge.textContent = `v${version}`
    item.append(name, badge)
    list.append(item)
  }
  if (!list.children.length) {
    const item = document.createElement('li'); item.textContent = 'No changed files'; list.append(item)
  }
  return list
}

// Teaching playback deliberately ignores OS reduced-motion. Play is optional;
// manual steps, Pause, Restart and off-screen pausing remain available.
export function initBackupComparisons(example, root = document) {
  root.querySelectorAll('[data-backup-comparison]').forEach(host => {
    if (host.dataset.comparisonReady) return
    host.dataset.comparisonReady = 'true'
    let index = 0, playing = false, timer = null
    const play = host.querySelector('[data-comparison-play]')
    const live = host.querySelector('[data-comparison-live]')
    const status = host.querySelector('[data-comparison-status]')
    function cancelAnimations() { host.getAnimations({ subtree: true }).forEach(animation => animation.cancel()) }
    function render(animate = false) {
      cancelAnimations()
      const frame = comparisonFrame(example, index)
      host.dataset.dayIndex = String(index)
      host.dataset.playing = String(playing)
      host.querySelector('[data-comparison-day]').textContent = frame.day.label
      host.querySelector('[data-comparison-change]').textContent = index === 0 ? 'Starting point: all four files are at version 1.' : `Changed today: ${frame.day.changed.map(name => name.replace('.csv', '')).join(', ')}. Other files keep their versions.`
      live.replaceChildren(fileTokens(frame.sets.full.files, { changed: frame.day.changed }))
      const starts = new Map([...live.querySelectorAll('[data-file]')].map(item => [item.dataset.file, item.getBoundingClientRect()]))
      for (const type of ['full', 'incremental', 'differential']) {
        const row = host.querySelector(`[data-comparison-row="${type}"]`)
        const target = row.querySelector('[data-comparison-files]')
        target.replaceChildren(fileTokens(frame.sets[type].files, { changed: frame.day.changed, compact: true }))
        row.querySelector('[data-comparison-basis]').textContent = index === 0 ? 'Full starting copy' : type === 'full' ? 'All selected files' : type === 'incremental' ? `Since ${example.days[index - 1].label}’s backup` : 'Since Monday’s full'
        if (animate) target.querySelectorAll('[data-file]').forEach(item => {
          const from = starts.get(item.dataset.file), to = item.getBoundingClientRect()
          if (from) item.animate([{ transform: `translate(${from.left - to.left}px, ${from.top - to.top}px)`, opacity: .3 }, { transform: 'translate(0, 0)', opacity: 1 }], { duration: 650, easing: 'ease-in-out' })
        })
      }
      host.querySelector('[data-comparison-prev]').disabled = index === 0
      host.querySelector('[data-comparison-next]').disabled = index === example.days.length - 1
      play.textContent = playing ? 'Pause comparison' : index === example.days.length - 1 ? 'Replay comparison' : 'Play comparison'
      play.setAttribute('aria-pressed', String(playing))
      status.textContent = `${index + 1} of ${example.days.length} · ${frame.day.label}. ${index === 0 ? 'All three methods begin with a full copy.' : index === 1 ? 'The first changed file appears in both change-based backups.' : 'Incremental copies today’s changed file. Differential also recopies the earlier changed files.'}`
    }
    function pause() { playing = false; clearTimeout(timer); timer = null; cancelAnimations(); render() }
    function schedule() {
      clearTimeout(timer)
      if (playing) timer = setTimeout(() => {
        index += 1
        if (index >= example.days.length - 1) playing = false
        render(true); schedule()
      }, 2400)
    }
    host.querySelector('[data-comparison-prev]').addEventListener('click', () => { pause(); index = Math.max(0, index - 1); render(true) })
    host.querySelector('[data-comparison-next]').addEventListener('click', () => { pause(); index = Math.min(example.days.length - 1, index + 1); render(true) })
    host.querySelector('[data-comparison-reset]').addEventListener('click', () => { pause(); index = 0; render() })
    play.addEventListener('click', () => {
      if (playing) { pause(); return }
      if (index === example.days.length - 1) index = 0
      playing = true; render(); schedule()
    })
    new IntersectionObserver(entries => { if (!entries[0].isIntersecting) pause() }).observe(host)
    document.addEventListener('visibilitychange', () => { if (document.hidden) pause() })
    window.addEventListener('pagehide', pause)
    host.querySelector('[data-comparison-controls]').hidden = false
    render()
  })
}
