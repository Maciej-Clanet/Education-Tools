// Authored introductions and illustrations, rendered by the lesson generator.
export const structureDefinition = `
<div class="sq-definition">
  <p>A <strong>data structure</strong> is a way to <mark>organise data</mark> in a program.</p>
  <p>It also sets rules for how the program can <mark>use that data</mark>.</p>
</div>
<p class="sq-definition-note">The program needs to know more than the values. It needs a way to store, find and change them.</p>`

export const structureParts = `
<p class="sq-lead">To describe a data structure, ask three questions.</p>
<div class="sq-parts">
  <article><span class="sq-part-number">1</span><h3>Items</h3><p>What data do we keep?</p><div class="sq-loose-items" aria-hidden="true"><span>A</span><span>B</span><span>C</span></div><p class="sq-note">An item is one piece of data.</p></article>
  <span class="sq-part-arrow" aria-hidden="true">→</span>
  <article><span class="sq-part-number">2</span><h3>Organisation</h3><p>How do we arrange it?</p><ol class="sq-ordered-items" aria-label="Items arranged in order"><li>A</li><li>B</li><li>C</li></ol><p class="sq-note">For example, keep the items in an order.</p></article>
  <span class="sq-part-arrow" aria-hidden="true">→</span>
  <article><span class="sq-part-number">3</span><h3>Operations</h3><p>What can we do with it?</p><div class="sq-operation-words"><span><b>+</b> Add</span><span><b>⌕</b> Read</span><span><b>−</b> Remove</span></div><p class="sq-note">An operation is an action on the data.</p></article>
</div>`

export const shoppingExample = `
<p class="sq-lead">A shopping-list app needs to keep more than one item.</p>
<div class="sq-shopping-example">
  <div class="sq-shopping-app" role="img" aria-label="Shopping list: Bread, Milk, Apples. A new item can be added below them.">
    <div class="sq-app-bar"><span aria-hidden="true">☰</span><strong>Shopping list</strong><span aria-hidden="true">⋮</span></div>
    <ol>${['Bread','Milk','Apples'].map(name=>`<li><span class="sq-shopping-box" aria-hidden="true"></span>${name}</li>`).join('')}</ol>
    <div class="sq-add-item"><span aria-hidden="true">+</span> Add an item</div>
  </div>
  <dl class="sq-example-explanation">
    <div><dt>Items</dt><dd>The names: Bread, Milk and Apples.</dd></div>
    <div><dt>Organisation</dt><dd>A list keeps the names in an order.</dd></div>
    <div><dt>Operations</dt><dd>Add a name, read the list or remove a name.</dd></div>
  </dl>
</div>
<p class="sq-takeaway">The names are the data. The list is the data structure that organises them.</p>`

const features = [
  { id: 'undo', name: 'Undo typing', symbol: '↶', structure: 'Stack', reason: 'Undo must reverse the most recent change first. A stack makes that change available next.',
    visual: `<div class="sq-mini-editor"><div class="sq-app-bar">Notes <span>↶ Undo</span></div><p>Hello <mark>Sam</mark><span class="sq-caret" aria-hidden="true"></span></p><div class="sq-mini-caption">Latest change: type “Sam”</div></div><p class="sq-feature-result">Undo removes “Sam” before the earlier text.</p>` },
  { id: 'print', name: 'Print documents', symbol: '▤', structure: 'Queue', reason: 'In this simple printer, jobs wait in the order they arrive. A queue makes the oldest waiting job available next.',
    visual: `<div class="sq-mini-print"><div class="sq-printer" aria-hidden="true"><span>PRINT</span><i></i></div><div class="sq-print-jobs"><span><b>1</b>Poster</span><span><b>2</b>Timetable</span><span><b>3</b>Letter</span></div></div><p class="sq-feature-result">The poster was sent first. It prints next.</p>` },
  { id: 'music', name: 'Arrange a playlist', symbol: '♫', structure: 'List', reason: 'A playlist keeps songs in a chosen order. A list lets the app add a song, remove a song or change its position.',
    visual: `<div class="sq-mini-playlist"><div class="sq-app-bar">♫ My playlist</div>${['Morning','On the way','Home'].map((song,i)=>`<div><b>${i+1}</b><span>${song}</span><span aria-hidden="true">≡</span></div>`).join('')}</div><p class="sq-feature-result">The order can change when you move a song.</p>` },
]
export const softwareFeatures = `
<p class="sq-lead">Select a feature to see which structure can support it and why.</p>
<div class="sq-feature-picker" data-software-features data-no-slide-advance>
  <div class="sq-feature-choices" data-feature-controls hidden role="group" aria-label="Software features">
    ${features.map(({id,name,symbol})=>`<button type="button" data-feature-choice="${id}" aria-controls="sq-feature-${id}" aria-pressed="false"><span aria-hidden="true">${symbol}</span>${name}</button>`).join('')}
  </div>
  <div class="sq-feature-panels">${features.map(({id,name,structure,reason,visual})=>`<article id="sq-feature-${id}" data-feature-panel="${id}" aria-labelledby="sq-feature-title-${id}"><div class="sq-feature-heading"><h3 id="sq-feature-title-${id}">${name}</h3><span>${structure}</span></div><p>${reason}</p>${visual}</article>`).join('')}</div>
  <p class="sr-only" data-feature-status role="status"></p>
</div>`

export const trayStack = `
<div class="sq-scene-scroll" tabindex="0" role="region" aria-label="Stack of trays. Scroll sideways on a small screen.">
<svg class="sq-scene sq-tray-scene" viewBox="0 0 560 340" role="img" aria-labelledby="sq-trays-title sq-trays-desc">
  <title id="sq-trays-title">A stack of cafeteria trays</title><desc id="sq-trays-desc">Tray A was added first at the bottom, then B, then C on top. Add and remove trays at the top. C leaves first.</desc>
  <defs><linearGradient id="sq-tray-wall" x2="0" y2="1"><stop stop-color="#f6eee0"/><stop offset="1" stop-color="#e5d9bf"/></linearGradient><marker id="sq-tray-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 6 3 0 6" fill="none" stroke="#215c62" stroke-width="1.5"/></marker></defs>
  <rect width="560" height="340" rx="18" fill="url(#sq-tray-wall)"/>
  <path d="M0 280H560V340H0Z" fill="#c4a47d"/><path d="M0 280H560" stroke="#9b7957" stroke-width="3"/>
  <ellipse cx="272" cy="280" rx="174" ry="16" fill="#715534" opacity=".18"/>
  <text x="34" y="40" class="sq-scene-kicker">CAFETERIA TRAYS</text>
  <g fill="none" stroke="#215c62" stroke-width="4" marker-end="url(#sq-tray-arrow)"><path d="M150 67V126"/><path d="M369 128V66"/></g>
  <text x="109" y="60" class="sq-scene-label">Push</text><text x="346" y="53" class="sq-scene-label">Pop</text>
  <g stroke-width="2.5" stroke-linejoin="round">
    <path d="M94 243 344 243 435 267 185 267Z" fill="#d59a67" stroke="#905d34"/><path d="M94 243V256L185 282H435V267H185Z" fill="#b8804d" stroke="#905d34"/>
    <path d="M94 199 344 199 435 223 185 223Z" fill="#82b9b6" stroke="#3e777c"/><path d="M94 199V212L185 238H435V223H185Z" fill="#5c9299" stroke="#3e777c"/>
    <path d="M94 155 344 155 435 179 185 179Z" fill="#e8bd57" stroke="#977322"/><path d="M94 155V168L185 194H435V179H185Z" fill="#c79935" stroke="#977322"/>
    <path d="M122 161H339L401 177H190Z" fill="#f5d683" stroke="#b18a36"/>
  </g>
  <g class="sq-tray-letter"><text x="286" y="191">C</text><text x="286" y="235">B</text><text x="286" y="279">A</text></g>
  <path d="M443 185H477" stroke="#795d20" stroke-width="2"/><text x="484" y="190" class="sq-scene-small">Top</text>
  <text x="280" y="318" text-anchor="middle" class="sq-scene-label">C was added last. C leaves first.</text>
</svg></div>`

const person = (x, colour, letter, label) => `<g transform="translate(${x} 0)"><ellipse cx="0" cy="239" rx="29" ry="8" fill="#183e4220"/><path d="M-13 193-16 232M13 193 16 232" fill="none" stroke="#314852" stroke-width="13" stroke-linecap="round"/><path d="M-22 151-33 190M22 151 33 190" stroke="#be8d69" stroke-width="10" stroke-linecap="round"/><path d="M-23 144Q0 131 23 144L25 194H-25Z" fill="${colour}" stroke="#314852" stroke-width="2"/><circle cy="118" r="21" fill="#d5a580"/><path d="M-21 115Q-23 87 0 91Q24 91 21 117L13 105Q-1 112-16 104" fill="#3e3937"/><circle cy="166" r="16" fill="#fff8e9"/><text y="173" text-anchor="middle" class="sq-scene-label">${letter}</text><text y="274" text-anchor="middle" class="sq-scene-label">${label}</text></g>`
export const cinemaQueue = `
<div class="sq-scene-scroll" tabindex="0" role="region" aria-label="Cinema queue. Scroll sideways on a small screen.">
<svg class="sq-scene sq-cinema-scene" viewBox="0 0 980 300" role="img" aria-labelledby="sq-cinema-title sq-cinema-desc">
  <title id="sq-cinema-title">A cinema ticket queue</title><desc id="sq-cinema-desc">A arrived first and stands at the front, nearest the ticket desk. B is behind A. C is at the rear. A leaves the queue first. New arrivals join behind C.</desc>
  <defs><marker id="sq-queue-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 6 3 0 6" fill="none" stroke="#215c62" stroke-width="1.5"/></marker></defs>
  <rect width="980" height="300" rx="18" fill="#f1ecdf"/><path d="M0 239H980V300H0Z" fill="#e0ded1"/>
  <g transform="translate(34 64)"><rect width="154" height="177" rx="6" fill="#b35644"/><rect x="12" y="12" width="130" height="92" rx="3" fill="#294d55"/><rect x="-9" y="-14" width="172" height="32" rx="4" fill="#f1cb71"/><text x="77" y="8" text-anchor="middle" class="sq-scene-label">TICKETS</text><path d="M8 107H146" stroke="#793f35" stroke-width="9"/><path d="M30 132H125M30 149H125" stroke="#d48768" stroke-width="6"/></g>
  <g fill="none" stroke="#215c62" stroke-width="4" marker-end="url(#sq-queue-arrow)"><path d="M324 73H218"/><path d="M912 73H746"/></g>
  <text x="265" y="53" text-anchor="middle" class="sq-scene-label">Dequeue</text><text x="831" y="53" text-anchor="middle" class="sq-scene-label">Enqueue</text>
  ${person(356,'#e0b651','A','Front · first')}${person(521,'#75a6a9','B','Waiting')}${person(686,'#c87861','C','Rear · last')}
  <path d="M764 212H927" stroke="#65857f" stroke-width="2" stroke-dasharray="7 6"/><text x="844" y="188" text-anchor="middle" class="sq-scene-small">Join here</text>
</svg></div>`
