# Shared lesson components

Scan the tables when choosing an interaction; read only the relevant contract
below or linked component guide. Examples point to current usage, not compulsory
lesson templates. Paths are relative to the repository root unless linked.

## Lesson foundation

| Need | Source / reference | Current example |
| --- | --- | --- |
| Context navigation, section sidebar, quiz, written drafts, Teacher Slides | [lesson-shell.js](../javascript/core/lesson-shell.js), `css/pages/lesson.css` | [Arrays page script](../javascript/pages/arrays-lists-and-data-types.js) |
| Openers, dividers, slide breaks, optional teacher cues | [Markup guide](teacher_section_dividers.md), `javascript/core/teacher-dividers.js` | [Backup lesson](../pages/topics/backup-and-data-recovery.html) |
| Reading, display preferences and read aloud | `javascript/core/accessibility.js`; [product rules](project_requirements.md#design-and-accessibility) | Existing page header and accessibility launcher |
| Storage and aggregate quiz progress | `javascript/core/storage.js`, `javascript/core/quiz-progress.js`, `javascript/core/unit-progress.js`; `javascript/data/unit-progress-data.js` | Unit hub and lesson configuration |
| Worked evaluation and judgement | [Exam-technique guide](exam_technique.md), `css/exam-technique.css` | [Balanced answer](../pages/topics/data-across-multiple-systems.html#balanced-judgement) |

`initLessonPage(config)` initialises the shell only. Optional activities need
their own imports/initialisers and styles. Preserve the actual form nodes when
composing slides so state and listeners survive. `data-slide-break` must be an
empty **direct child** of a lesson section; it cannot split a nested form.
Use `data-no-slide-advance` around activity regions. Assessment migration rules
live once in [lesson authoring](lesson_authoring.md#components-and-learner-work).

## Sequences and motion

| Need | Source | Current example |
| --- | --- | --- |
| Complete authored states with Previous/Next/Restart | [lesson-walkthrough.js](../javascript/core/lesson-walkthrough.js), `css/lesson-walkthrough.css` | [Incremental restore](../pages/topics/backup-and-data-recovery.html#incremental-restore) |
| Authored states with selectable step navigation | [step-sequence.js](../javascript/core/step-sequence.js) | [Data journey](../pages/topics/collecting-and-processing-data.html#journey); styling currently in that page's CSS |
| Controlled CSS teaching loops | [teaching-animation.js](../javascript/core/teaching-animation.js) | `[data-teaching-animation]`; only use for an actual ongoing teaching loop |
| Data-driven playback and a small bounded state reducer | [kernel-visualiser.js](../javascript/core/kernel-visualiser.js), `css/kernel-visualiser.css` | [Kernel frames](../javascript/data/kernel-visualiser-data.js) |

### Walkthrough markup

Call `initLessonWalkthroughs()`. Host: `data-lesson-walkthrough`; each complete
state: `data-walkthrough-step="Short label"`. Include `data-walkthrough-controls`
with `data-walkthrough-prev`, `data-walkthrough-next`, `data-walkthrough-reset`
buttons and `data-walkthrough-status`. Initially hide controls, not states.
The component bounds navigation, retains button focus using `aria-disabled`,
supports independent instances and leaves all states readable without JS/printing.
It has no timer or persistence. The structure examples also provide
`renderStructureWalkthrough` in `content/lessons/stacks-and-queues-examples.mjs`.

### Selectable steps and playback

Call `initStepSequences()` for `data-step-sequence`. Panels use `data-step-panel`,
a unique ID and `h3`. Required controls: `data-step-controls`, `data-step-prev`,
`data-step-next`, `data-step-reset`, `data-step-status`; navigation uses
`data-step-navigation` and buttons with zero-based `data-step-to` / `aria-controls`.
Hide controls/navigation initially; show all panels. Reuse the Data Processing
example's print rule to reveal hidden panels. Its entrance effect is decorative.

`initTeachingAnimations()` adds a pause control to `[data-teaching-animation]`
and toggles `teaching-animation-paused` when paused/hidden/offscreen. The caller's
CSS must connect that class to its animations; this helper does not advance frames.

`nextKernelState(state, action, total)` is a pure `{index, playing}` reducer for
reset/previous/step/play/pause/tick, already reused by architecture and emulation.
It does not supply the timer, visibility handling or renderer. Kernel frame data
can set `execution: true` and a per-frame `mode` to distinguish executing code
from highlighted resources. Follow [teaching motion](teaching_motion.md).

## Choices and simulations

| Need | Source | Current configuration/example |
| --- | --- | --- |
| Choose an option and a matching reason | [paired-scenarios.js](../javascript/core/paired-scenarios.js) | [Software scenarios](../javascript/data/software-scenarios.js) |
| Fixed teaching-command terminal | [simulated-terminal.js](../javascript/core/simulated-terminal.js) | [Interface activities](../javascript/data/user-interface-activities.js), [lesson](../pages/topics/user-interfaces-and-software-choice.html#current-location) |
| Check an exact set of mechanisms | `evaluateMechanisms` in `javascript/core/kernel-visualiser.js` | Kernel control-room activity; reports missing and extra choices |

### Paired scenarios

Call `initPairedScenarios(configs)`. The object is keyed by each host's
`data-paired-scenario`. Mark its two selects `data-choice="type"` and
`data-choice="reason"`; include `data-check-pair`, `data-reset-pair`, and
`data-pair-feedback`. Config requires `acceptedPairs` (arrays of matching value
pairs) and `explanation` or `explanationsByChoice`. Supply `incompleteMessage`,
`successMessage` and `retryMessage` outside interface lessons: defaults name
interfaces. Both values must form an accepted pair, not two independent answers.
Changing either select clears feedback. Choices are temporary; Reset does not
erase a separate written draft. Supply authored answer guidance for no-JS reading.

### Simulated terminal

Call `initSimulatedTerminals(configs)` keyed by `data-simulated-terminal`.
Config contains `prompt` and `commands: [{command, output}]`. Host markup needs
a form/input, `data-terminal-output`, `data-terminal-status`, `data-terminal-reset`
and `data-current-command` matching the authored input. Optional
`data-terminal-example` buttons fill the input without executing it.

Commands are exact whole-entry lookups after case/spacing normalisation; there is
no shell, evaluation, filesystem or network access. Keep input/output as text.
Start/reset shows a fresh prompt and unexecuted current command; run appends a
transcript entry then clears the input. History/transcript are bounded; Up/Down
recalls history. Use fictional fixed data and label illustrative results honestly.

## Code teaching

| Need | Source / guide | Example |
| --- | --- | --- |
| Authored code/preview, staged changes and annotations | [code-preview.js](../javascript/core/code-preview.js) | [Styling text script](../javascript/pages/styling-text-with-css.js) |
| Learner-editable HTML/CSS or JavaScript console | [Live Code guide](live_code_example.md) | Styling Text and the shared Code Playground |
| Guided find/repair debugging without executing learner code | [Debug Lab guide](debug_lab.md) | Styling Text |
| Four-value CSS shorthand mapping | [Shorthand guide](shorthand_visualizer.md) | Colours, backgrounds and borders |
| Measured parent/child browser layouts | [flex-explorer.js](../javascript/core/flex-explorer.js), `css/flex-explorer.css` | [Basic configs](../javascript/data/flexbox-examples.js), [child configs](../javascript/data/flexbox-child-examples.js) |
| Independently saved Playground tasks | [Challenge guide](web_challenges.md) | `javascript/data/challenges/javascript-challenges.js` |

Live Code uses isolated iframes/workers; preserve its sandbox, CSP and network
restrictions. Embedded edits are temporary; the Playground owns autosaving.
Code Preview is an authored teaching view, not the editable execution runtime.

For Flexbox, `initFlexExplorers(configs)` enhances authored controls/boxes and
measures **real browser layout**. Optional config callbacks are
`parentStyles(state)`, `children(state)`, `code(state)`, `measure(state, geometry)`.
Child styles restore before rendering so old shorthand longhands cannot leak.
ResizeObserver refreshes measurements after size/slide changes. The examples
enforce horizontal LTR writing; wrapping can use `height: 'auto'`. Keep overflow
local to a focusable diagram and preserve DOM identity. `css/flexbox-lesson.css`
holds shared lesson composition; do not introduce hidden padding/gaps that alter
the teaching measurement. Start from the corresponding config and markup example.

## Topic-specific tools and models

These are useful starting points within their subject, not generic frameworks.
Inspect their current page script/config before reusing them. All paths in this
table name files in `javascript/core/` unless another location is specified.

| Topic | Available implementation and boundaries |
| --- | --- |
| Stack/queue operations | `structure-explorer.js`, `javascript/data/structure-model.js`; static markup helper in `content/lessons/structure-explorer-markup.mjs`. Independent temporary instances, separate returned value, immutable peek, explicit empty/full states. Labels are text; authored capacities are teaching limits. |
| Indexed collections | `array-explorer.js` / `array-model.js`; `content/lessons/collection-diagrams.mjs` for storage diagrams. Arrays lesson combines this with shared walkthroughs. |
| Validation, record sorting, numeric processing | `validation-lab.js`, `record-sort-demo.js`, `processing-tools.js`; `javascript/data/data-processing-examples.js`. Sorting moves whole records. Numeric reports and charts share the same accepted dataset; validation does not imply accuracy. |
| Connected-system implications | `impact-explorer.js` and `javascript/data/college-impacts.js`: scenario-based effects and trade-offs across the five A3 factors. |
| CSS units, sizing and display | `css-unit-references.js`, `size-explorer.js`, `display-explorer.js`; examples in the corresponding CSS lesson scripts and `javascript/data/`. Reuse actual browser layout and paired-scenario choices. |
| Backup and recovery | `backup-model.js`, `backup-comparison.js`, `recovery-lab.js`; `javascript/data/backup-example.js` and `recovery-scenario.js`. Same versioned files across comparisons; restore, verify and reopen are distinct stages. `backup-visualiser.js` is an older implementation, not the current lesson example. |
| Architecture, memory, emulation | `architecture-visualiser.js`, `shared-memory-explorer.js`, `scaling-activities.js`, `emulation-path-explorer.js`. Frames/routes/work units are illustrative, not timing benchmarks; physical machine boundaries and NUMA locality matter. |
| Byte conversions, binary and BCD | `data-unit-conversion.js`, `conversion-stepper.js`, `binary-representation.js`. Prefix conversions and bit/byte conversions are separate models. BCD rejects groups above 1001. |
| Text representation | `character-encoding.js`, `character-transmission.js`; `javascript/data/character-encoding-data.js`. Transmission uses an explicitly invented `hello` key. Inspectors count code points, not necessarily visible characters; no arbitrary decoder lab. |
| Bitmap and image quality | `bitmap-explorer.js`, `bit-depth-gradient.js`, `image-quality-tools.js`; pure fixtures in `javascript/data/bitmap-image-model.js` and `image-quality-model.js`. Gradient fixes pixel positions; comparisons change one variable. Real compression sizes come from `javascript/data/image-compression-assets.js`. |
| Hardware choice | `javascript/pages/hardware-system-builder.js`: fictional budget/compatibility scenarios with separate local drafts; not a generic shared purchasing tool. |

For image sources, rights and reproducible encoding, retain
[asset credits](../assets/images/image-representation/CREDITS.md) and
[quality asset recipes](../assets/images/image-representation/QUALITY-ASSETS.md).
Only add index entries when they help discover actual reuse; leave implementation
detail in the source, tests or an existing dedicated component guide.
