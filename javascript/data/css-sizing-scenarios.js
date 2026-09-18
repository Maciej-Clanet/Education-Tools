export const sizingRules = {
  share: 'width: 30%;',
  article: 'width: 90%; max-width: 800px;',
  image: 'max-width: 100%;',
  hero: 'min-height: 100vh;',
  floor: 'min-width: 250px;',
}
export const sizingReasons = {
  share: 'Use a proportion of the parent width',
  ceiling: 'Use a flexible width with an upper limit',
  image: 'Limit width without requiring it to fill the parent',
  height: 'Set a viewport-height minimum, allowing growth',
  floor: 'Set a lower width limit',
}
const scenarios = {
  sidebar: ['share', 'share', 'A percentage width follows the parent’s available width in this example.'],
  article: ['article', 'ceiling', '90% adapts to the parent; max-width caps the article at 800px.'],
  image: ['image', 'image', 'max-width: 100% caps the normal image width at the parent’s available width.'],
  hero: ['hero', 'height', 'min-height sets the floor; a naturally sized hero may grow for its content.'],
  panel: ['floor', 'floor', 'min-width: 250px establishes the requested lower boundary.'],
}
export const sizingScenarioConfigs = Object.fromEntries(Object.entries(scenarios).map(([id, [rule, reason, explanation]]) => [id, {
  acceptedPairs: [[rule, reason]],
  incompleteMessage: 'Choose a sizing rule and a reason.',
  successMessage: 'A good fit for this intention.',
  retryMessage: 'Check which reference or limit the intention needs.',
  explanation,
}]))
