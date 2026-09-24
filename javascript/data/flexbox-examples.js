const base = {
  display: 'flex', direction: 'row', justify: 'flex-start', align: 'stretch',
  gap: 0, height: 196, width: 'full',
}
const initial = overrides => ({ ...base, ...overrides })
const main = state => state.direction === 'column' ? 'vertical' : 'horizontal'
const cross = state => state.direction === 'column' ? 'horizontal' : 'vertical'
const position = { 'flex-start': 'the start', center: 'the centre', 'flex-end': 'the end' }

export const flexboxExamples = {
  enable: {
    initial: initial({ display: 'block' }), properties: ['display'],
    describe: s => s.display === 'block'
      ? 'The three block children stack. Change display on the parent to flex.'
      : 'The same three children now form a row. Only the parent’s display changed.',
  },
  direction: {
    initial: initial({}), properties: ['display', 'direction'], axes: 'direction',
    describe: s => s.direction === 'row'
      ? 'Row: follow child 1 → 2 → 3 from left to right.'
      : 'Column: follow child 1 → 2 → 3 from top to bottom. The HTML order stays the same.',
  },
  axes: {
    initial: initial({}), properties: ['display', 'direction'], axes: 'names',
    describe: s => `With ${s.direction}, the main axis is ${main(s)}. The cross axis is ${cross(s)}. Main follows the direction of the children.`,
  },
  justify: {
    initial: initial({}), properties: ['display', 'direction', 'justify'], axes: 'names',
    describe: s => `The row moves to ${position[s.justify]} of the horizontal main axis. The children stay together. Their vertical positions do not change.`,
  },
  distribute: {
    initial: initial({}), properties: ['display', 'direction', 'justify'], axes: 'names',
    describe: s => s.justify === 'space-between'
      ? 'Spare space is shared between the children. The first and last children meet the parent’s inner edges.'
      : 'The children sit together at the start. The spare main-axis space is after child 3.',
  },
  align: {
    initial: initial({ align: 'flex-start' }), properties: ['display', 'direction', 'align'], axes: 'properties',
    describe: s => `Each child moves to ${position[s.align]} of the vertical cross axis. Their horizontal positions stay the same.`,
  },
  turn: {
    initial: initial({ justify: 'center', align: 'flex-start' }),
    properties: ['display', 'direction', 'justify', 'align'], axes: 'properties',
    describe: s => s.direction === 'row'
      ? 'Row: justify-content centres the group left to right. align-items keeps each child at the top.'
      : 'Column: justify-content now centres the group top to bottom. align-items keeps each child at the left. The properties still follow the same axes.',
  },
  stretch: {
    initial: initial({}), properties: ['display', 'direction', 'align'], axes: 'properties',
    describe: s => s.align === 'stretch'
      ? `With automatic ${s.direction === 'row' ? 'height' : 'width'}, each child stretches across the ${cross(s)} cross axis.`
      : `Each child keeps its content size and sits at ${position[s.align]} of the ${cross(s)} cross axis.`,
  },
  room: {
    initial: initial({ align: 'center', height: 52 }),
    properties: ['display', 'direction', 'align', 'height'], axes: 'properties',
    describe: s => Number(s.height) === 52
      ? 'Centre is already working. The parent only has room for the children’s height, so there is no spare vertical space to see above or below them.'
      : 'The taller parent has spare cross-axis space. align-items: center now leaves equal space above and below each child.',
  },
  gap: {
    initial: initial({ height: 100 }), properties: ['display', 'gap'],
    describe: s => `There ${Number(s.gap) === 0 ? 'is no gap' : `are ${s.gap} pixels`} between neighbouring children. Gap adds no space before child 1 or after child 3.`,
  },
  spacing: {
    initial: initial({ gap: 16, height: 100 }), properties: ['display', 'justify', 'gap'],
    describe: s => s.justify === 'space-between'
      ? 'The 16px gap stays as a minimum. space-between shares any remaining main-axis space between the children, making their separation larger.'
      : 'The children are exactly 16px apart. Making the parent wider leaves more spare space after child 3.',
  },
  combine: {
    initial: initial({ align: 'flex-start' }), properties: ['display', 'direction', 'justify', 'align', 'gap'], axes: 'properties',
    describe: s => `Direction: ${s.direction}. justify-content works on the ${main(s)} main axis; align-items works on the ${cross(s)} cross axis. Gap: ${s.gap}px.`,
  },
}
