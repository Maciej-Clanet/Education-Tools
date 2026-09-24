const initial = overrides => ({
  display: 'flex', direction: 'row', justify: 'flex-start', align: 'flex-start',
  wrap: 'nowrap', gap: 8, height: 100, width: 'full', parentWidth: 420, ...overrides,
})
const sizedParent = s => ({ width: `${s.parentWidth}px`, maxWidth: '100%' })
const items = (width, count = 3) => Array.from({ length: count }, () => ({ width: `${width}px`, minWidth: '0px' }))
const choice = (name, label, values) => ({ name, label, values: values.map(value => Array.isArray(value) ? value : [value, String(value)]) })
const parentWidths = choice('parentWidth', 'Parent width (limited by your screen)', [[420, '420px — roomy'], [240, '240px — tight']])
const widths = (s, g) => `Parent’s inside width: ${Math.round(g.innerWidth)}px. Child widths (rounded): ${g.widths.map((width, i) => `${i + 1}: ${Math.round(width)}px`).join(' · ')}.${g.overflow ? ' Children extend beyond the parent; scroll the diagram if needed.' : ''}`
const rowCSS = '.parent { display: flex; gap: 8px; }'
const childCSS = width => `.child { width: ${width}px; }`

export const flexboxChildExamples = {
  wrap: {
    initial: initial({ parentWidth: 240, height: 'auto' }), parentStyles: sizedParent,
    controls: [choice('wrap', 'Parent: flex-wrap', ['nowrap', 'wrap'])],
    children: () => items(96, 4).map(style => ({ ...style, minWidth: '96px' })),
    code: s => `.parent {\n  display: flex; gap: 8px;\n  flex-wrap: ${s.wrap};\n}\n.child {\n  width: 96px; min-width: 96px;\n}`,
    describe: s => s.wrap === 'wrap'
      ? 'The children can move onto another line. The parent’s direction is still row; their HTML order stays 1, 2, 3, 4.'
      : 'nowrap keeps one line. These children cannot become narrower than 96px, so they extend past the parent’s right edge.',
    measure: (s, g) => `${g.lines} ${g.lines === 1 ? 'line' : 'lines'} of children. ${g.overflow ? 'Scroll the diagram to see the overflow.' : 'All children fit within the parent.'}`,
  },
  reflow: {
    initial: initial({ parentWidth: 420, height: 'auto', wrap: 'wrap' }), parentStyles: sizedParent,
    controls: [choice('parentWidth', 'Parent width (limited by your screen)', [[420, '420px'], [240, '240px'], [160, '160px']])],
    children: () => items(96, 4).map(style => ({ ...style, minWidth: '96px' })),
    code: s => `.parent {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px;\n  width: ${s.parentWidth}px;\n  max-width: 100%;\n}`,
    describe: () => 'Only the parent’s width changes. Each child keeps its 96px minimum; fewer children fit per line as the parent narrows.',
    measure: (s, g) => `Parent’s inside width: ${Math.round(g.innerWidth)}px. ${g.lines} ${g.lines === 1 ? 'line' : 'lines'} of children.`,
  },
  nested: {
    initial: initial({ innerDisplay: 'block', height: 156 }), parentStyles: sizedParent,
    controls: [choice('innerDisplay', 'Child 2: display', [['block', 'block — normal flow'], ['flex', 'flex — arrange A and B']])],
    children: s => [{ width: '48px', height: '88px' }, { width: '112px', minWidth: '112px', height: 'auto', display: s.innerDisplay }, { width: '48px', height: '88px' }],
    code: s => `.parent {\n  display: flex;\n  gap: 8px;\n}\n.child-two {\n  display: ${s.innerDisplay};\n}`,
    describe: s => s.innerDisplay === 'flex'
      ? 'Child 2 is still a flex child of the outer parent. It is now also a flex parent for A and B, which form their own row.'
      : 'Child 2 is a flex child, but its own block children A and B stack normally. display: flex has not been inherited.',
  },
  grow: {
    initial: initial({ grow: '0' }), parentStyles: sizedParent,
    controls: [choice('grow', 'Child 2: flex-grow', ['0', '1'])],
    children: s => items(64).map((style, i) => ({ ...style, flexGrow: i === 1 ? s.grow : '0' })),
    code: s => `${rowCSS}\n${childCSS(64)}\n.child-two { flex-grow: ${s.grow}; }`,
    describe: s => s.grow === '0'
      ? 'Grow 0 is the default. None of these children takes the spare main-axis space.'
      : 'Child 2 takes the spare main-axis space. Children 1 and 3 keep their widths. Child 2 still uses normal block layout for its own contents.',
    measure: widths,
  },
  shares: {
    initial: initial({ grow: '1' }), parentStyles: sizedParent,
    controls: [choice('grow', 'Child 2: flex-grow (others stay at 1)', ['1', '2'])],
    children: s => items(64).map((style, i) => ({ ...style, flexGrow: i === 1 ? s.grow : '1' })),
    code: s => `${rowCSS}\n.child {\n  width: 64px;\n  flex-grow: 1;\n}\n.child-two { flex-grow: ${s.grow}; }`,
    describe: s => s.grow === '1'
      ? 'All three start at 64px and receive equal shares of the extra room.'
      : 'Grow factors 1 : 2 : 1 give child 2 twice the added space of either neighbour. Its final width is not twice theirs.',
    measure: (s, g) => `Each starts at 64px. Rounded measurements: ${g.widths.map((width, i) => `Child ${i + 1}: ${Math.round(width)}px (added ${Math.round(width - 64)}px)`).join(' · ')}.`,
  },
  shrink: {
    initial: initial({}), parentStyles: sizedParent, controls: [parentWidths],
    children: () => items(120),
    code: s => `.parent {\n  display: flex; gap: 8px;\n  width: ${s.parentWidth}px;\n  max-width: 100%;\n}\n.child {\n  width: 120px; min-width: 0;\n  flex-shrink: 1;\n}`,
    describe: () => 'Shrink 1 is the default. When the parent is too narrow, these equal-size children share the shortage. They stay on one line.',
    measure: widths,
  },
  protect: {
    initial: initial({ parentWidth: 240, shrink: '1' }), parentStyles: sizedParent,
    controls: [choice('shrink', 'Child 2: flex-shrink (others stay at 1)', ['1', '0'])],
    children: s => items(120).map((style, i) => ({ ...style, flexShrink: i === 1 ? s.shrink : '1' })),
    code: s => `${rowCSS}\n.child {\n  width: 120px;\n  min-width: 0;\n  flex-shrink: 1;\n}\n.child-two { flex-shrink: ${s.shrink}; }`,
    describe: s => s.shrink === '0'
      ? 'Child 2 keeps its 120px width. The other two can shrink further to make room, while their minimum sizes allow it.'
      : 'All three have the same starting width and shrink factor, so they give up equal amounts of width.',
    measure: widths,
  },
  refuse: {
    initial: initial({ parentWidth: 240, shrink: '1' }), parentStyles: sizedParent,
    controls: [choice('shrink', 'Every child: flex-shrink', ['1', '0'])],
    children: s => items(120).map(style => ({ ...style, flexShrink: s.shrink })),
    code: s => `.parent {\n  display: flex; gap: 8px;\n  flex-wrap: nowrap;\n}\n.child {\n  width: 120px; min-width: 0;\n  flex-shrink: ${s.shrink};\n}`,
    describe: s => s.shrink === '0'
      ? 'Nobody can shrink, and nowrap keeps one line. The children overflow: refusing to shrink cannot create more room.'
      : 'The children can shrink to fit this parent. Shrinking changes widths; wrapping would put children on another line.',
    measure: widths,
  },
  presets: {
    initial: initial({ preset: 'auto' }), parentStyles: sizedParent,
    controls: [choice('preset', 'Every child: flex', ['auto', 'none']), parentWidths],
    children: s => items(120).map(style => ({ ...style, flex: s.preset })),
    code: s => `${rowCSS}\n.child {\n  width: 120px;\n  min-width: 0;\n  flex: ${s.preset};\n}`,
    describe: s => s.preset === 'auto'
      ? 'flex: auto allows both growth and shrinking. The 120px width is the starting point; the available room determines the final width.'
      : 'flex: none allows neither growth nor shrinking. Each child keeps its 120px width, even when that causes overflow.',
    measure: widths,
  },
  shorthand: {
    initial: initial({ preset: 'auto' }), parentStyles: sizedParent,
    controls: [choice('preset', 'Every child: flex', [['auto', 'auto — keep width differences'], ['1', '1 — share from an equal start']])],
    children: s => [80, 160, 80].map(width => ({ width: `${width}px`, minWidth: '0px', flex: s.preset })),
    code: s => `.parent { display: flex; gap: 8px; }\n.child { min-width: 0; flex: ${s.preset}; }\n.child-one { width: 80px; }\n.child-two { width: 160px; }\n.child-three { width: 80px; }`,
    describe: s => s.preset === '1'
      ? 'flex: 1 shares this simple row from an equal starting point, giving matching widths here. It also allows shrinking; it is more than flex-grow: 1.'
      : 'flex: auto starts from the different widths, then lets the children grow or shrink to fit. Child 2 remains wider than its neighbours.',
    measure: widths,
  },
  self: {
    initial: initial({ self: 'auto', height: 196 }), parentStyles: () => ({ width: '100%' }), axes: 'self', crossLabel: 'Cross axis · align-self',
    controls: [choice('self', 'Child 2: align-self', ['auto', 'center', 'flex-end', 'flex-start', 'stretch'])],
    children: s => [{ width: '48px' }, { width: 'auto', height: 'auto', minWidth: '48px', minHeight: '48px', alignSelf: s.self }, { width: '48px' }],
    code: s => `.parent {\n  display: flex;\n  align-items: flex-start;\n  gap: 8px;\n}\n.child-two {\n  align-self: ${s.self};\n}`,
    describe: s => s.self === 'auto'
      ? 'auto follows the parent’s align-items setting: all children start at the top.'
      : s.self === 'stretch'
        ? 'Only child 2 stretches along the vertical cross axis. Its height is automatic; the other children stay at the top.'
        : `Only child 2 uses ${s.self} on the vertical cross axis. The parent still sets flex-start for the other children.`,
  },
  'self-turn': {
    initial: initial({ height: 196 }), parentStyles: () => ({ width: '100%' }), axes: 'self', crossLabel: 'Cross axis · align-self',
    controls: [choice('direction', 'Parent: flex-direction', ['row', 'column'])],
    children: () => items(48).map((style, i) => ({ ...style, alignSelf: i === 1 ? 'center' : 'auto' })),
    code: s => `.parent {\n  display: flex;\n  flex-direction: ${s.direction};\n  align-items: flex-start;\n  gap: 8px;\n}\n.child-two { align-self: center; }`,
    describe: s => s.direction === 'row'
      ? 'In a row, the cross axis is vertical. Child 2 centres top to bottom; the others stay at the top.'
      : 'In a column, the cross axis is horizontal. Child 2 centres left to right; the others stay at the left.',
  },
  'wrap-grow': {
    initial: initial({ parentWidth: 384, height: 'auto', wrap: 'wrap', grow: '0' }), parentStyles: sizedParent,
    controls: [choice('grow', 'Every child: flex-grow', ['0', '1'])],
    children: s => items(100, 4).map(style => ({ ...style, minWidth: '96px', flexGrow: s.grow })),
    code: s => `.parent {\n  display: flex; gap: 8px;\n  flex-wrap: wrap;\n}\n.child {\n  width: 100px; min-width: 96px;\n  flex-grow: ${s.grow};\n}`,
    describe: s => s.grow === '1'
      ? 'Each line shares its own spare space. If the last child has a line to itself, it grows across that whole line.'
      : 'Children can wrap, but grow 0 leaves each line’s spare room unused.',
    measure: (s, g) => `${g.lines} lines. ${widths(s, g)}`,
  },
}
