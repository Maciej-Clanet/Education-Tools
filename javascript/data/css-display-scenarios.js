export const displayChoices = { block: 'block', inline: 'inline', 'inline-block': 'inline-block', none: 'none' }
export const displayReasons = {
  line: 'Start on a new line',
  text: 'Participate within the surrounding text line',
  sized: 'Join a line as a box that accepts width and height',
  absent: 'Remove the element and its layout space',
}
const scenarios = {
  sections: ['block', 'line', 'A normal block starts a new line; adjacent blocks normally stack.'],
  word: ['inline', 'text', 'Inline lets the highlighted word remain part of its sentence.'],
  links: ['inline-block', 'sized', 'Inline-block accepts width while joining other content on the line where space allows.'],
  message: ['none', 'absent', 'display: none removes the message from displayed layout without reserving a gap.'],
}
export const displayScenarioConfigs = Object.fromEntries(Object.entries(scenarios).map(([id, [display, reason, explanation]]) => [id, {
  acceptedPairs: [[display, reason]],
  incompleteMessage: 'Choose a display behaviour and a reason.',
  successMessage: 'A good fit for this intention.',
  retryMessage: 'Think about how the element should behave beside its neighbours.',
  explanation,
}]))
