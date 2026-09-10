import { buildBackupSets, recoveryIndices, restoreBackupSets, nextBackupState } from './backup-model.js'

function node(tag, className, text) {
  const element = document.createElement(tag)
  if (className) element.className = className
  if (text !== undefined) element.textContent = text
  return element
}

function fileList(files, className = 'backup-files') {
  const list = node('ul', className)
  for (const [file, version] of Object.entries(files)) {
    const item = node('li', version > 1 ? 'file-updated' : '')
    item.append(node('code', '', file), node('span', 'backup-version', `v${version}`))
    list.append(item)
  }
  if (!list.childElementCount) list.append(node('li', '', 'No changed files'))
  return list
}

export function initBackupVisualisers(example, root = document) {
  const descriptions = {
    full: 'Full: all selected files are copied each day.',
    incremental: 'Incremental: after Monday’s full, each set contains changes since the previous backup.',
    differential: 'Differential: after Monday’s full, each set contains changes since that full backup.',
  }
  root.querySelectorAll('[data-backup-visualiser]').forEach(host => {
    if (host.dataset.backupReady) return
    host.dataset.backupReady = 'true'
    let state = { strategy: 'full', recovered: false }
    const selectors = [...host.querySelectorAll('[name="backup-type"]')]
    const dayHost = host.querySelector('[data-backup-days]')
    const recovery = host.querySelector('[data-backup-recovery]')
    const status = host.querySelector('[data-backup-status]')
    function render() {
      const sets = buildBackupSets(example.files, example.days, state.strategy)
      const needed = recoveryIndices(sets)
      host.querySelector('[data-backup-description]').textContent = descriptions[state.strategy]
      selectors.forEach(input => { input.checked = input.value === state.strategy })
      dayHost.replaceChildren()
      const timeline = node('div', 'backup-days')
      sets.forEach((set, index) => {
        const card = node('article', 'backup-day')
        card.append(node('h3', '', set.label), node('p', 'backup-kind', `${set.kind[0].toUpperCase()}${set.kind.slice(1)} backup`))
        card.append(node('p', 'backup-change', index === 0 ? 'Starting files: all at v1.' : `Changed today: ${set.changed.length ? set.changed.join(', ') : 'none'}.`))
        card.append(fileList(set.files))
        if (state.recovered) {
          const required = needed.includes(index)
          card.dataset.required = String(required)
          card.append(node('p', 'backup-required', required ? 'Needed for this restore' : 'Not needed for this restore'))
        }
        timeline.append(card)
      })
      dayHost.append(timeline)
      recovery.hidden = !state.recovered
      recovery.replaceChildren()
      if (state.recovered) {
        const chain = node('ol', 'backup-restore-chain')
        needed.forEach(index => {
          const set = sets[index]
          const item = node('li', '')
          item.append(node('strong', '', `${set.label} ${set.kind}`), fileList(set.files, 'backup-set-files'))
          chain.append(item)
        })
        recovery.append(node('h3', '', 'Restore these sets in order'), chain, node('h3', '', 'Recovered Student Records · Thursday version'), fileList(restoreBackupSets(sets)), node('p', '', 'Each strategy recovers the same Thursday versions. Friday’s later changes are not recreated. All required sets must be intact and usable.'))
        status.textContent = `Recovery after Thursday: ${needed.length} backup ${needed.length === 1 ? 'set' : 'sets'} required.`
      } else status.textContent = `${descriptions[state.strategy]} Backup contents updated. Simulate recovery to see which sets are needed.`
    }
    selectors.forEach(input => input.addEventListener('change', () => {
      state = nextBackupState(state, { type: 'select', strategy: input.value }); render()
    }))
    host.querySelector('[data-backup-restore]').addEventListener('click', () => {
      state = nextBackupState(state, { type: 'restore' }); render()
    })
    host.querySelector('[data-backup-reset]').addEventListener('click', () => {
      state = nextBackupState(state, { type: 'reset' }); render()
    })
    render()
  })
}
