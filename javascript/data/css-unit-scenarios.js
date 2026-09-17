export const unitScenarios = {
  border: { unit: 'px', reference: 'pixel', prompt: 'A border should stay about 2 CSS pixels thick.', explanation: 'px directly expresses the predictable CSS pixel thickness requested.' },
  image: { unit: '%', reference: 'container', prompt: 'An image should fill the width available inside its container.', explanation: 'A percentage width follows the containing block: width: 100% fits this intention.' },
  heading: { unit: 'rem', reference: 'root', prompt: 'A heading should be twice the site’s root text size.', explanation: '2rem uses the shared root font-size reference.' },
  button: { unit: 'em', reference: 'local', prompt: 'A button’s padding should grow with its own text.', explanation: 'For padding, em uses the button’s computed font size.' },
  hero: { unit: 'vh', reference: 'height', prompt: 'On a desktop browser, a hero should be at least as tall as the viewport.', explanation: 'min-height: 100vh matches that height reference while allowing more content.' },
  banner: { unit: 'vw', reference: 'width', prompt: 'A decorative banner should use half the browser viewport width.', explanation: '50vw follows the viewport width rather than the surrounding container.' },
}

export const unitScenarioConfigs = Object.fromEntries(Object.entries(unitScenarios).map(([id, scenario]) => [id, {
  acceptedPairs: [[scenario.unit, scenario.reference]],
  incompleteMessage: 'Choose a unit and the reference it should follow.',
  successMessage: 'A suitable match for this intention.',
  retryMessage: 'Reconsider what this measurement should respond to.',
  explanation: scenario.explanation,
}]))
