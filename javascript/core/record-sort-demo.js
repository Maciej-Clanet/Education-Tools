// Move existing record nodes together, retaining their labels and relationships.
export function initRecordSort(records, scope = document) {
  scope.querySelectorAll('[data-record-sort]').forEach(root => {
    const list = root.querySelector('.dp-sort-records')
    const original = [...list.children]
    const buttons = [...root.querySelectorAll('[data-sort-key]')]
    const labels = { name: 'Name, A–Z', time: 'Arrival, earliest first', score: 'Score, highest first', original: 'Original order' }
    buttons.forEach(button => button.addEventListener('click', () => {
      const key = button.dataset.sortKey
      const oldTops = new Map(original.map(row => [row, row.getBoundingClientRect().top]))
      const ordered = key === 'original' ? original : [...original].sort((a, b) => {
        const left = records[Number(a.dataset.record)][key]
        const right = records[Number(b.dataset.record)][key]
        return key === 'score' ? right - left : left.localeCompare(right, 'en-GB')
      })
      list.append(...ordered)
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        ordered.forEach(row => {
          row.getAnimations().forEach(animation => animation.cancel())
          const offset = oldTops.get(row) - row.getBoundingClientRect().top
          if (offset) row.animate([{ transform: `translateY(${offset}px)` }, { transform: 'translateY(0)' }], { duration: 600, easing: 'ease-in-out' })
        })
      }
      buttons.forEach(control => control.setAttribute('aria-pressed', String(control === button)))
      root.querySelector('[data-sort-status]').textContent = `${labels[key]}. ${ordered.map(row => records[Number(row.dataset.record)].name).join(' → ')}. Each person's time and score move with their name.`
    }))
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.sortKey === 'original')))
    root.querySelector('[data-sort-controls]').hidden = false
  })
}
