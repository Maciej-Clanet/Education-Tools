# Debug Lab component

`javascript/core/debug-lab.js` renders guided, static debugging activities for
HTML, CSS, and JavaScript lessons. Shared presentation styles live in
`css/debug-lab.css`.

The component does not execute learner code or compare free-typed strings. A
lesson supplies trusted scenario data containing selectable regions and guided
repair choices.

## Basic use

Add the shared stylesheet to the lesson page:

```html
<link rel="stylesheet" href="../../css/debug-lab.css" />
```

Add one mount point for each activity:

```html
<div data-debug-lab-id="missing-class-dot"></div>
```

Import and initialise the component from the lesson script:

```js
import { initDebugLabs } from "../core/debug-lab.js"

initDebugLabs(debugTasks, {
  storageKey: "lesson-example-debug-labs",
  version: 1,
})
```

Increment `version` when saved completion should be treated as stale.

## Modes

- `find`: learners locate each configured issue. No repair stage is shown.
- `repair`: the issue is identified and learners choose the correct response
  or repair.
- `find-and-fix`: learners locate an issue, choose a repair, and test it.

One task can contain several issues. Debug Lab reports completed issues and
moves through the remaining issues without assuming there is only one bug.

## Task shape

```js
{
  id: "missing-class-dot",
  mode: "find-and-fix",
  title: "The warning style does not appear",
  goal: "The warning paragraph should match the supplied CSS rule.",
  files: [
    {
      name: "common.css",
      language: "CSS",
      lines: [
        [
          {
            text: "warning",
            regionId: "warning-selector",
            label: "CSS selector without a dot",
          },
          " {",
        ],
        "  /* supplied styling */",
        "}",
      ],
    },
  ],
  issues: [
    {
      id: "class-prefix",
      regionId: "warning-selector",
      correctRepairId: "add-dot",
      foundFeedback: "You located the selector.",
      repairFeedback: "The class selector now matches.",
      incorrectRepairFeedback: "That repair does not match the HTML class.",
      hints: ["A class selector begins with a dot."],
    },
  ],
  repairOptions: [
    { id: "add-dot", label: ".warning", replacement: ".warning" },
    { id: "add-hash", label: "#warning", replacement: "#warning" },
  ],
  preview: {
    broken: { title: "Result", html: "..." },
    fixed: { title: "Result", html: "..." },
  },
  interpretation: {
    title: "What the browser sees",
    text: "Without the dot, CSS looks for a warning element.",
    items: ["optional", "interpreted", "values"],
  },
  explanation: "A dot tells CSS that warning is a class name.",
}
```

Files can mix plain string lines with segment arrays. A segment with a
`regionId` becomes a keyboard-accessible selectable code region. Reuse the same
`regionId` when one repair should update several occurrences.

Repair options can live on the task or on an individual issue. Issue-level
options are useful when a multi-bug task needs different choices for each bug.
`repairPrompt` and `applyLabel` can rename the repair controls for diagnosis or
interpretation tasks.

Preview states may supply trusted local `html`, a `description`, or an
`expected` and `actual` result pair. Use conceptual results when a realistic
rendered preview would not help. `interpretation` and `explanation` appear only
after completion.

## Accessibility expectations

- Give every selectable region a concise, meaningful `label`.
- Do not make colour the only indication of selection, repair, or completion.
- Keep broken and fixed results understandable as text.
- Provide hints that guide without immediately stating the answer.
- Keep code examples short enough to remain usable with enlarged text and in
  Teacher Slides.
