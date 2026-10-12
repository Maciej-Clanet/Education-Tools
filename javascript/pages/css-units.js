// CSS Units is now part of CSS Units and Sizing. Keep old lesson links useful.
const sectionAliases = {
  'same-number': 'percent-vw', measurements: 'measurements', pixels: 'measurements',
  percentages: 'size-explorer', 'percentage-uses': 'size-explorer',
  'root-units': 'font-references', 'local-units': 'font-references',
  'font-references': 'font-references', 'component-spacing': 'component-spacing',
  viewport: 'percent-vw', 'viewport-width': 'percent-vw',
  'viewport-height': 'viewport-height', 'percent-vw': 'percent-vw',
  'viewport-uses': 'hero-height', 'unit-choice': 'summary', 'unit-chooser': 'choose-rule',
  'live-experiment': 'live-code', debugging: 'debugging', mistakes: 'mistakes',
  summary: 'summary', quiz: 'quiz', practice: 'practice',
}
const destination = new URL('css-sizing.html', window.location.href)
destination.search = window.location.search
const oldSection = window.location.hash.slice(1)
destination.hash = oldSection ? (sectionAliases[oldSection] ?? 'measurements') : ''
document.querySelector('[data-merged-lesson-link]').href = destination.href
window.location.replace(destination.href)
