const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')

export function slots(values, { active = -1, caption = '', addresses = false } = {}) {
  return `<figure class="al-slots-figure"><div class="al-slots" style="--slot-count:${values.length}">${values.map((value, index) => `<div class="al-slot${index === active ? ' al-slot--active' : ''}${value === null ? ' al-slot--spare' : ''}"><span class="al-slot-index">Index ${index}</span><strong>${value === null ? 'Spare' : esc(value)}</strong>${addresses ? `<small>Address ${1000 + index * 4}</small>` : ''}</div>`).join('')}</div>${caption ? `<figcaption>${caption}</figcaption>` : ''}</figure>`
}

export function walkthrough(id, steps) {
  return `<div id="${id}" class="al-walkthrough" data-lesson-walkthrough data-no-slide-advance><div data-walkthrough-controls hidden><p data-walkthrough-status aria-live="polite"></p><button type="button" class="lesson-secondary-action" data-walkthrough-prev>Previous step</button><button type="button" class="primary-link" data-walkthrough-next>Next step</button><button type="button" class="lesson-secondary-action" data-walkthrough-reset>Restart</button></div>${steps.map(([title, body]) => `<div data-walkthrough-step="${esc(title)}"><h3 class="al-step-title">${title}</h3>${body}</div>`).join('')}</div>`
}

export function nodes(items, { active = '', compact = false } = {}) {
  const locations = { A: 640, B: 320, C: 128, D: 912 }
  return `<div class="al-chain${compact ? ' al-chain--compact' : ''}"><span class="al-head">Head<br>→ ${locations[items[0]]}</span>${items.map((item, i) => `<div class="al-node-wrap"><div class="al-node${active === item ? ' al-node--active' : ''}"><span class="al-node-location">Location ${locations[item]}</span><strong>${item}</strong><span class="al-node-next">next: ${i < items.length - 1 ? locations[items[i + 1]] : 'empty'}</span></div><span class="al-link-arrow" aria-hidden="true">→</span></div>`).join('')}<span class="al-end">End</span></div>`
}

const tracks = names => `<ol class="al-playlist">${names.map((name, index) => `<li><span class="al-track-number">${index + 1}</span><span class="al-album" aria-hidden="true">♪</span><strong>${name}</strong><span class="al-track-time">${['3:42', '2:58', '4:10', '3:16'][index]}</span></li>`).join('')}</ol>`

export const playlist = walkthrough('playlist-sequence', [
  ['Start with two tracks', tracks(['Daybreak', 'Night Drive']) + '<p class="al-step-result">Count: <strong>2</strong>. The list keeps the tracks in a chosen order.</p>'],
  ['Append a track', tracks(['Daybreak', 'Night Drive', 'First Light']) + '<p class="al-step-result">Count: <strong>3</strong>. Append adds First Light at the end.</p>'],
  ['Remove a track', tracks(['Daybreak', 'First Light']) + '<p class="al-step-result">Count: <strong>2</strong>. Removing Night Drive closes the gap in the visible order.</p>'],
])

export const growth = walkthrough('growth-sequence', [
  ['Spare capacity is available', slots(['A', 'B', 'C', null], { caption: 'Count 3 · Capacity 4. The spare slot is storage, not a fourth item.' }) + '<p class="al-step-result">Append D: the backing array already has room.</p>'],
  ['Use the spare slot', slots(['A', 'B', 'C', 'D'], { active: 3, caption: 'Count 4 · Capacity 4. The list now fills its backing array.' }) + '<p class="al-step-result">Append E: another slot is needed.</p>'],
  ['Allocate more room, copy, then append', slots(['A', 'B', 'C', 'D', 'E', null], { active: 4, caption: 'Count 5 · Capacity 6 in this illustration. A–D were copied into the larger array.' }) + '<p class="al-step-result">The list grows by replacing its backing array. The old array itself did not gain extra slots.</p>'],
])

export const traversal = walkthrough('linked-sequence', [
  ['Start at the head', nodes(['A', 'C', 'D'], { active: 'A' }) + '<p class="al-step-result">The head identifies A, the first node. A contains a value and a reference to the next node.</p>'],
  ['Follow A’s next reference', nodes(['A', 'C', 'D'], { active: 'C' }) + '<p class="al-step-result">A’s next reference leads to location 128: node C, the second item.</p>'],
  ['Follow C’s next reference', nodes(['A', 'C', 'D'], { active: 'D' }) + '<p class="al-step-result">C leads to D, the third item. D’s empty next reference marks the end.</p>'],
])

export const insertion = walkthrough('insert-sequence', [
  ['Insert B between A and C', `<div class="al-two"><article class="al-mini"><h4>Array-backed list · capacity 4</h4>${slots(['A', 'C', 'D', null])}<p>A spare slot is at the end, but B needs a gap after A.</p></article><article class="al-mini"><h4>Singly linked list</h4>${nodes(['A', 'C', 'D'], { active: 'A', compact: true })}<p>Assume the program already has a reference to A.</p></article></div>`],
  ['Make room or prepare a link', `<div class="al-two"><article class="al-mini"><h4>Shift entries to the right</h4>${slots(['A', null, 'C', 'D'], { active: 1 })}<p>Move D, then C. Index 1 is ready for B.</p></article><article class="al-mini"><h4>Prepare the new node</h4>${nodes(['A', 'C', 'D'], { compact: true })}<p class="al-new-link"><strong>New B at 320:</strong> set B.next → 128 (C).</p></article></div>`],
  ['Same order, different storage work', `<div class="al-two"><article class="al-mini"><h4>Write B into the gap</h4>${slots(['A', 'B', 'C', 'D'], { active: 1 })}<p>The order is A, B, C, D. Later entries moved.</p></article><article class="al-mini"><h4>Redirect A’s next to B</h4>${nodes(['A', 'B', 'C', 'D'], { active: 'B', compact: true })}<p>Set A.next → 320. C and D stay at their locations.</p></article></div>`],
])

export const arrayExplorer = `<div class="al-explorer" data-array-explorer data-no-slide-advance>
  <div class="al-dashboard-title"><strong>Failed logins · six hourly counts</strong><span>Length: 6</span></div>
  <div class="al-dashboard">${[3, 8, 2, 12, 5, 4].map((value, index) => `<button type="button" class="al-dashboard-slot" data-array-index="${index}" data-value="${value}" disabled aria-pressed="${index === 3}" aria-label="Index ${index}, ${index + 8}:00, count ${value}" style="--array-level:${value / 12 * 100}%"><span class="al-hour">${index + 8}:00</span><span class="al-bar-area" aria-hidden="true"><span class="al-bar"></span></span><strong data-array-value>${value}</strong><span class="al-dashboard-index">Index ${index}</span></button>`).join('')}</div>
  <p class="al-readout"><code data-array-output>failedLogins[3] → 12</code><span>Read the fourth element</span></p>
  <form class="al-array-controls" data-array-controls hidden novalidate><label for="array-count-input">New count at index <span data-array-selected>3</span></label><input id="array-count-input" data-array-input type="text" inputmode="numeric" maxlength="4" value="12" autocomplete="off"><button type="submit" class="primary-link">Update value</button><button type="button" class="lesson-secondary-action" data-array-restore>Restore example</button></form>
  <p class="al-explorer-status" data-array-status role="status">Select a slot to read its value, then change the count. Six elements use indices 0 to 5.</p>
</div>`
