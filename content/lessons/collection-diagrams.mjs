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

const trackDetails = {
  'Daybreak': { id: 'daybreak', time: '3:42' },
  'Night Drive': { id: 'night-drive', time: '2:58' },
  'First Light': { id: 'first-light', time: '4:10' },
}
const tracks = names => `<ol class="al-playlist">${names.map((name, index) => `<li data-track="${trackDetails[name].id}"><span class="al-track-number">${index + 1}</span><span class="al-album" aria-hidden="true">♪</span><strong>${name}</strong><span class="al-track-time">${trackDetails[name].time}</span></li>`).join('')}</ol>`

export const playlist = walkthrough('playlist-sequence', [
  ['Start with two tracks', tracks(['Daybreak', 'Night Drive']) + '<p class="al-step-result">Count: <strong>2</strong>. The list keeps the tracks in a chosen order.</p>'],
  ['Append a track', tracks(['Daybreak', 'Night Drive', 'First Light']) + '<p class="al-step-result">Count: <strong>3</strong>. Append adds First Light at the end.</p>'],
  ['Remove a track', tracks(['Daybreak', 'First Light']) + '<p class="al-step-result">Count: <strong>2</strong>. Removing Night Drive closes the gap in the visible order.</p>'],
])

// All growth states use the same slot width. Four slots must look shorter than six.
function growthRow(values, label, kind, retired = false) {
  return `<div class="al-growth-row${retired ? ' al-growth-row--retired' : ''}" data-growth-array="${kind}"><p class="al-growth-label"><strong>${label}</strong>${values.length === 6 ? '<span>+2 slots</span>' : retired ? '<span>No longer used by this list</span>' : ''}</p><div class="al-growth-slots">${values.map((value,index)=>`<div class="al-growth-cell${value === null ? ' al-growth-cell--spare' : ''}${index > 3 ? ' al-growth-cell--extra' : ''}"${value ? ` data-item="${value}"` : ''}><span>Index ${index}</span><strong>${value || 'Spare'}</strong></div>`).join('')}</div></div>`
}
const growthDiagram = (current, next, phase = '') => `<div class="al-growth-scroll" tabindex="0" role="region" aria-label="Backing arrays. Scroll sideways on a small screen."><div class="al-growth-diagram" data-growth-phase="${phase}">${growthRow(current, next ? 'Old array · 4 slots' : 'Current array · 4 slots', 'old', phase === 'append')}${next ? `<div class="al-copy-route"${phase === 'copy' ? '' : ' aria-hidden="true"'}>${phase === 'copy' ? '<span>↓</span>'.repeat(4) + '<strong>Copy A–D</strong>' : ''}</div>${growthRow(next, 'New array · 6 slots', 'new')}` : ''}</div></div>`
export const growth = walkthrough('growth-sequence', [
  ['Spare capacity is available', growthDiagram(['A','B','C',null]) + '<p class="al-step-result">Count <strong>3</strong> · Capacity <strong>4</strong>. Append D: one slot is spare.</p>'],
  ['Use the spare slot', growthDiagram(['A','B','C','D']) + '<p class="al-step-result">Count <strong>4</strong> · Capacity <strong>4</strong>. To append E, we need more room.</p>'],
  ['Make a new, larger array', growthDiagram(['A','B','C','D'],[null,null,null,null,null,null],'allocate') + '<p class="al-step-result">The new array has <strong>6 slots</strong>. The four items are still in the old array.</p>'],
  ['Copy A–D into the new array', growthDiagram(['A','B','C','D'],['A','B','C','D',null,null],'copy') + '<p class="al-step-result">Copy each item to the same index. Count stays <strong>4</strong>. Two slots are spare.</p>'],
  ['Add E to the new array', growthDiagram(['A','B','C','D'],['A','B','C','D','E',null],'append') + '<p class="al-step-result">Count <strong>5</strong> · Capacity <strong>6</strong>. The list now uses the new array.</p>'],
])

export const traversal = walkthrough('linked-sequence', [
  ['Start at the head', nodes(['A', 'C', 'D'], { active: 'A' }) + '<p class="al-step-result">The head identifies A, the first node. A contains a value and a reference to the next node.</p>'],
  ['Follow A’s next reference', nodes(['A', 'C', 'D'], { active: 'C' }) + '<p class="al-step-result">A’s next reference leads to location 128: node C, the second item.</p>'],
  ['Follow C’s next reference', nodes(['A', 'C', 'D'], { active: 'D' }) + '<p class="al-step-result">C leads to D, the third item. D’s empty next reference marks the end.</p>'],
])

function insertionChain(stage) {
  const node = (item, x, y, location, next, isNew = false) => `<g class="al-insert-node${isNew ? ' al-insert-node--new' : ''}" data-node="${item}" data-next="${next}" transform="translate(${x} ${y})"><rect width="100" height="90" rx="9"/><path d="M0 28H100M0 61H100"/><text x="50" y="19" class="al-insert-location">At ${location}</text><text x="50" y="53" class="al-insert-value">${item}</text><text x="50" y="80" class="al-insert-next">next: ${next}</text></g>`
  const arrow = (path, changed = false) => `<path class="al-insert-arrow${changed ? ' al-insert-arrow--new' : ''}" d="${path}" marker-end="url(#al-insert-arrow-${stage}${changed ? '-new' : ''})"/>`
  const description = stage === 1 ? 'Head points to A at 640. A points to C at 128. C points to D at 912.' : stage === 2 ? 'A still points to C. New node B at 320 is below the chain and points to C at 128. A does not point to B yet.' : 'A now points to B at 320. B points to C at 128. C and D have not moved.'
  return `<div class="al-insertion-scroll" tabindex="0" role="region" aria-label="Linked insertion diagram. Scroll sideways on a small screen."><svg class="al-insertion-chain" viewBox="0 0 600 240" role="img" aria-label="${description}" data-insertion-stage="${stage}"><defs>${['','-new'].map(suffix=>`<marker id="al-insert-arrow-${stage}${suffix}" viewBox="0 0 10 10" markerWidth="8" markerHeight="8" refX="9" refY="5" orient="auto-start-reverse"><path d="M1 1 9 5 1 9" class="al-insert-arrow${suffix ? ' al-insert-arrow--new' : ''}"/></marker>`).join('')}</defs>
  <text x="20" y="19" class="al-insert-head">Head</text>${arrow('M70 24V39')}
  ${node('A',20,42,640,stage === 3 ? 320 : 128)}${node('C',290,42,128,912)}${node('D',425,42,912,'empty')}
  ${stage === 3 ? arrow('M120 87H153',true) + node('B',155,42,320,128,true) + arrow('M255 87H288',true) : arrow('M120 87H288')}
  ${arrow('M390 87H423')}${arrow('M525 87H549')}<text x="555" y="93" class="al-insert-head">End</text>
${stage === 2 ? `<text x="205" y="136" class="al-insert-new-label">New node</text>${node('B',155,144,320,128,true)}${arrow('M255 189H340V134',true)}` : ''}
  </svg></div>`
}
export const insertion = walkthrough('insert-sequence', [
  ['Insert B between A and C', `<div class="al-two"><article class="al-mini"><h4>Array-backed list · capacity 4</h4>${slots(['A', 'C', 'D', null])}<p>A spare slot is at the end, but B needs a gap after A.</p></article><article class="al-mini"><h4>Singly linked list</h4>${insertionChain(1)}<p>Assume the program already has a reference to A.</p></article></div>`],
  ['Make room or prepare a link', `<div class="al-two"><article class="al-mini"><h4>Shift entries to the right</h4>${slots(['A', null, 'C', 'D'], { active: 1 })}<p>Move D, then C. Index 1 is ready for B.</p></article><article class="al-mini"><h4>Prepare the new node</h4>${insertionChain(2)}<p>B points to C. A still points to C, so B is not yet in the list.</p></article></div>`],
  ['Same order, different storage work', `<div class="al-two"><article class="al-mini"><h4>Write B into the gap</h4>${slots(['A', 'B', 'C', 'D'], { active: 1 })}<p>The order is A, B, C, D. Later entries moved.</p></article><article class="al-mini"><h4>Redirect A’s next to B</h4>${insertionChain(3)}<p>Set A.next → 320. C and D stay at their locations.</p></article></div>`],
])

export const arrayExplorer = `<div class="al-explorer" data-array-explorer data-no-slide-advance>
  <div class="al-dashboard-title"><strong>Failed logins · six hourly counts</strong><span>Length: 6</span></div>
  <div class="al-dashboard">${[3, 8, 2, 12, 5, 4].map((value, index) => `<button type="button" class="al-dashboard-slot" data-array-index="${index}" data-value="${value}" disabled aria-pressed="${index === 3}" aria-label="Index ${index}, ${index + 8}:00, count ${value}" style="--array-level:${value / 12 * 100}%"><span class="al-hour">${index + 8}:00</span><span class="al-bar-area" aria-hidden="true"><span class="al-bar"></span></span><strong data-array-value>${value}</strong><span class="al-dashboard-index">Index ${index}</span></button>`).join('')}</div>
  <p class="al-readout"><code data-array-output>failedLogins[3] → 12</code><span>Read the fourth element</span></p>
  <form class="al-array-controls" data-array-controls hidden novalidate><label for="array-count-input">New count at index <span data-array-selected>3</span></label><input id="array-count-input" data-array-input type="text" inputmode="numeric" maxlength="4" value="12" autocomplete="off"><button type="submit" class="primary-link">Update value</button><button type="button" class="lesson-secondary-action" data-array-restore>Restore example</button></form>
  <p class="al-explorer-status" data-array-status role="status">Select a slot to read its value, then change the count. Six elements use indices 0 to 5.</p>
</div>`
