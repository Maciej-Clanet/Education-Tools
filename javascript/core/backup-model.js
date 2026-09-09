// A whole-file, version-number teaching model. No real file access or scheduling.
export function buildBackupSets(files, days, type) {
  if (!['full', 'incremental', 'differential'].includes(type)) throw new Error('Unknown backup type')
  const versions = Object.fromEntries(files.map(file => [file, 1]))
  const changedSinceFull = new Set()
  return days.map((day, index) => {
    const changed = [...new Set(day.changed)]
    changed.forEach(file => {
      if (!Object.hasOwn(versions, file)) throw new Error('Unknown example file')
      versions[file] += 1
      changedSinceFull.add(file)
    })
    const kind = index === 0 ? 'full' : type
    const included = kind === 'full' ? files : kind === 'incremental' ? changed : [...changedSinceFull]
    return { label: day.label, kind, changed, files: Object.fromEntries(included.map(file => [file, versions[file]])) }
  })
}

export function recoveryIndices(sets) {
  if (!sets.length) return []
  const full = sets.findLastIndex(set => set.kind === 'full')
  if (full < 0) throw new Error('A full baseline is needed')
  const last = sets.length - 1
  if (last === full) return [full]
  if (sets[last].kind === 'differential') return [full, last]
  return Array.from({ length: last - full + 1 }, (_, index) => full + index)
}

export function restoreBackupSets(sets) {
  return Object.assign({}, ...recoveryIndices(sets).map(index => sets[index].files))
}

export function nextBackupState(state, action) {
  if (action.type === 'reset') return { strategy: 'full', recovered: false }
  if (action.type === 'select' && ['full', 'incremental', 'differential'].includes(action.strategy)) return { strategy: action.strategy, recovered: false }
  if (action.type === 'restore') return { ...state, recovered: true }
  return state
}
