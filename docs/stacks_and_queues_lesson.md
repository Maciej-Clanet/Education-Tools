# Stacks and queues implementation guide

The 4 October 2026 rebuild teaches why a program needs a data structure before
introducing stack and queue rules. It replaces the revision-style page and mixed
simulator with two independent explorers and concrete software examples. The
stable URL is `pages/topics/stacks-and-queues.html`.

The generated lesson has **21 student sections and 26 Teacher Slides**: the same
21 sections, one opener and four dividers. It contains a ten-question quiz and
three written tasks. Integrated layout, interaction, persistence and cross-lesson
motion checks pass on the completed page.

## Teaching sequence

The lesson covers the stack and queue part of Unit 2 D1. Arrays, lists, language
syntax and implementation complexity remain outside this lesson's main teaching
sequence. Optional revision details supply qualifications and primary sources.

| Sections | Purpose |
| --- | --- |
| `overview`, `why-structure`, `developer-context` | Introduce items, organisation and operations; show why newest-first and arrival-order access solve different jobs; connect the idea to development and investigation. |
| `stack`, `stack-operations`, `undo` | Explain top and LIFO, then push/pop/peek and a reversible editing history. |
| `call-stack`, `debugging` | Follow nested calls and returns, then use a paused call stack to locate a failure. |
| `queue`, `queue-operations`, `file-scanning` | Explain front/rear and FIFO, then enqueue/dequeue/peek and separate waiting files from the one worker's current file. |
| `buffers`, `queue-policy` | Explain burst buffering, sustained overload, priority policies and why removal order differs from completion order. |
| `compare`, `programmer-bridge`, `limits`, `mistakes` | Compare rules, read short pseudocode, handle empty/full states and correct common misconceptions. |
| `quiz`, `exam-practice`, `exam-practice-2`, `exam-practice-3` | Check understanding, then explain Undo, nested calls and a file-scanning queue. |

Teacher dividers introduce Stacks, Queues, Using the structures, and Apply and
explain. Optional `.sq-revision` supplements stay out of Teacher Slides. Sidebar
links, contextual previous/next navigation, glossary, accessibility and saved
assessment continue to use the shared lesson shell. The legacy `#simulation`
anchor routes into the stack explorer section.

## Files and generation

- `build-stacks-and-queues-lesson.mjs` assembles the existing page shell, teaching
  sections, assessments, opener, dividers and navigation. Rebuild with
  `node build-stacks-and-queues-lesson.mjs`; edit its source and imported content
  instead of maintaining a competing copy in generated HTML.
- `content/lessons/structure-explorer-markup.mjs` exports
  `structureExplorerMarkup({kind, id, capacity, items})` for the static initial
  diagrams and hidden enhancement controls.
- `javascript/data/structure-model.js` supplies the pure, immutable state and
  operation model. `javascript/core/structure-explorer.js` enhances each diagram;
  `css/structure-explorer.css` styles it under `.structure-explorer`.
- `content/lessons/stacks-and-queues-examples.mjs` exports
  `undoHistoryExample`, `functionCallsExample`, `fileScanningQueueExample`, their
  step arrays and `renderStructureWalkthrough`. `css/structure-examples.css`
  scopes every rule under `.structure-example` to avoid explorer class clashes.
- `javascript/data/stacks-and-queues-assessment.js` holds quiz items, written
  prompts, guidance and glossary entries.
- `javascript/pages/stacks-and-queues.js` initialises the lesson shell, shared
  walkthroughs and explorers. `css/pages/stacks-and-queues.css` supplies page
  layout; shared `lesson-walkthrough.js` and `lesson-walkthrough.css` supply manual
  sequence controls.

No backend, accounts, remote images, external runtime or new framework is needed.
Illustrations use HTML and original inline SVG geometry.

## Explorer contract

Each `[data-structure-explorer]` instance starts independently with capacity five,
items A, B, C and input D. Stack state is stored bottom-to-top; queue state is
front-to-rear. The diagram identifies the current top or front and rear, and the
separate output identifies whether an item was peeked at or removed.

The stack supports push, pop, peek and Reset. The queue supports enqueue,
dequeue, peek and Reset. A native form submits additions, including Enter from
the input. The controls prevent accidental slide advancement. Labels are trimmed
and repeated whitespace is collapsed; accepted labels contain one to twelve
Unicode code points. Labels are displayed as text, and duplicate values are
allowed. Authored capacity may be from one to six; five is this lesson's explicit
teaching limit, not a universal property of either structure.

`performStructureOperation` returns `{state, result}` without changing the input
state. A successful peek returns the current endpoint without changing its count.
A failed empty removal/peek or full addition reports the problem and leaves the
items unchanged. The browser clears any previous returned value after a failed
operation so an old result cannot appear to belong to the failed attempt.

Reset restores A, B, C, input D and a blank returned-value display. Explorer state
is temporary and does not read, overwrite or remove legacy tool saves. Without
JavaScript, the labelled initial diagram and explanatory status remain readable;
inactive controls stay hidden.

Additions move into their slot over 220 ms. Read/removal results travel to the
output over 300 ms; peek retains the original stored item. These user-triggered,
finite teaching actions remain available under reduced motion. A later operation
or Reset cancels outstanding motion. There is no automatic loop or playback
timer. See [teaching motion](teaching_motion.md).

## Manual application sequences

Each example contains five complete static states. The shared walkthrough
initialiser reveals one at a time and enables native Previous, Next step and
Restart buttons. It keeps navigation focus stable at the boundaries, announces
the step status, and leaves every state visible without JavaScript or in print.
The sequence controls themselves do not execute arbitrary code or scan files.

| Example | Five states |
| --- | --- |
| Undo | Add “Museum visit”; add “Meet at 10:00”; highlight the time; Undo the highlight; Undo the added line. Document content and action stack change together. |
| Function calls | Run `main()`; call `checkLogin()`; call `verifyPassword()`; return to `checkLogin()`; return to `main()`. The active frame is highlighted and return destinations are labelled. |
| File scanning | A arrives; B then C arrive; the worker takes A; D joins while A runs; A finishes and the worker takes B. Front/rear markers stay attached to the actual waiting endpoints. |

Undo reverses stored actions, including formatting; it is not defined as deleting
letters. A real editor may group edits or maintain redo information. The call
stack represents currently unfinished calls rather than a complete execution
history. Queue removal starts processing in the scan example; it does not mark a
file complete or safe. The separate policy section explains that several workers
may complete FIFO jobs in a different order.

## Assessment and saved work

The quiz is **version 2**, with **10 questions and pass score 8**. Its fresh key is
`lesson-stacks-and-queues-quiz-v2`; lesson configuration and Unit 2 progress
metadata must agree on that key, total, pass score and version. The shared storage
helper prefixes actual browser keys with `education-tools:`. Older quiz keys and
attempts remain untouched and must not restore as answers to the new questions.

Written responses retain the existing `stacks-and-queues-exam-practice` storage
key. New response IDs are `undo-stack-v2`, `call-stack-v2` and `scan-queue-v2`.
The shared saver merges current responses with stored ones, preserving unmatched
retired drafts without displaying them under these new prompts. The estimated
practice marks are 4, 4 and 6; guidance supports self-checking rather than claiming
an official marking scheme.

## Validation

The contextual-example harness and the final assembled page both pass all
fifteen manual states at 1366×768, Previous/Next/Restart, 320/390 px layouts and
the static fallback. Teacher-only spacing keeps diagrams and controls above the
presentation toolbar; normal reading and print retain all authored states.

Run the meaningful pure-model checks with:

```powershell
node --test tests/structure-model.test.mjs
```

`node tests/stacks-and-queues.browser.mjs` passes all 26 slides at 1366×768 and
1366×900, all sequence states, both explorers including long labels, reset, peek,
empty/full states, native Enter and focus, 320/390 px student views, static
fallbacks, asset loading, unique IDs and useful old anchors. It verifies 7/10
fails, 8/10 passes, full scoring and reload persistence; new written responses
persist while legacy quiz answers, retired drafts and simulator saves remain
untouched. Unit D1 correctly uses the new ten-question quiz and ignores retired
v1 scores. Screenshots and the zero-failure report are in the ignored
`.raid-checks/stacks-and-queues/` directory.

The existing cross-lesson motion test has been updated for the retired queue loop
and now checks stack/queue transfers and manual nested-call steps under reduced
motion. The complete cross-lesson suite passes. With the local server on
8765 and an isolated Chrome profile exposing CDP on 9229, run:

```powershell
$env:FLEXBOX_TEST_ORIGIN = 'http://127.0.0.1:8765'
$env:FLEXBOX_CDP_ORIGIN = 'http://127.0.0.1:9229'
node tests/teaching-motion.browser.mjs
```

The test's fallback CDP port is 9226; the environment override above is required
for the current review session. The pure model and shared walkthrough/divider
suite passes 12 checks. Generator reproducibility, changed-script syntax,
assessment metadata and local links are checked as well.
