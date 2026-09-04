# Live Code Example component

`javascript/core/live-code-example.js` renders compact editable code workspaces
for lesson Live Code Examples and the standalone Code Playground. Shared
styling lives in `css/live-code-example.css`.

This is deliberately separate from `javascript/core/code-preview.js`:

- Code Preview renders authored teaching previews, annotations, diagrams, and
  staged examples.
- Live Code Example combines editable source with locked scaffolding and
  renders the literal result in an isolated iframe or JavaScript worker console.

Adding Live Code Example does not change existing authored previews.

## Basic use

Add the shared stylesheet to the lesson page after `lesson.css`:

```html
<link rel="stylesheet" href="../../css/live-code-example.css" />
```

Add a mount point:

```html
<div data-live-code-example-id="featured-text"></div>
```

Initialise it from the lesson script:

```js
import { initLiveCodeExamples } from "../core/live-code-example.js"

initLiveCodeExamples(liveCodeExamples)
```

Edits stay in component memory. They are not written to storage, URLs, or a
backend. The standalone Code Playground uses the same component with a page
controller that autosaves to `localStorage`.

## Configuration

```js
{
  id: "featured-text",
  title: "Try the text properties",
  instructions: [
    {
      type: "p",
      text: "Change a value and observe the generated preview.",
    },
    {
      type: "ol",
      items: [
        ["Change ", { type: "code", code: "purple" }, " to green."],
        "Check the generated preview.",
      ],
    },
  ],
  debounce: 300,
  defaultSplit: 55,
  sources: [
    {
      id: "html",
      type: "html",
      label: "HTML",
      code: `<p class="featured-text">Example text</p>`,
    },
    {
      id: "css",
      type: "css",
      label: "CSS",
      code: `.featured-text {
  color: purple;
}`,
    },
  ],
  scaffold: {
    htmlBefore: "",
    htmlAfter: "",
    html: "",
    css: "",
  },
}
```

Only entries in `sources` appear as tabs. Scaffolding is locked and never shown
as an editable source.

`instructions` can be a plain string or authored structured content. Structured
instructions are rendered with DOM APIs, not arbitrary HTML, and travel with the
example when it is opened in the standalone Playground. Supported blocks are
paragraphs, ordered lists, unordered lists, inline code, emphasis, strong text,
and short code blocks. `description` remains a plain-text fallback for older
examples.

Supported source arrangements:

- HTML only: visible `html` source plus optional locked scaffold CSS.
- CSS only: visible `css` source plus locked scaffold HTML.
- HTML and CSS: both sources are visible as tabs; optional `htmlBefore`,
  `htmlAfter`, and scaffold CSS can still support the preview.

`scaffold.html` is used when no visible HTML source exists. With visible HTML,
`scaffold.htmlBefore` and `scaffold.htmlAfter` wrap it. Scaffold CSS is placed
before visible CSS.

The source objects intentionally use a general `type` field. A future
DOM JavaScript runner can add HTML/CSS/JavaScript sources and an explicit
iframe execution strategy without changing the source-tab model.

## Execution modes

`executionMode` selects the runtime:

- `html-css` renders editable HTML/CSS in a generated iframe preview. This is
  the default unless every source is JavaScript.
- `javascript` renders a JavaScript editor and beginner console. The learner
  must choose `Run`; code does not execute after each keystroke.

JavaScript-only examples should use a single JavaScript source:

```js
{
  id: "variables-console",
  title: "Try variables in the console",
  description: "Change the score, then run the code again.",
  executionMode: "javascript",
  sources: [
    {
      id: "javascript",
      type: "javascript",
      label: "JavaScript",
      code: `const score = 10
console.log("Score:", score)`,
    },
  ],
  execution: {
    timeoutMs: 3000,
    network: { mode: "disabled" },
  },
}
```

Do not use `javascript` sources in `html-css` preview examples. HTML/CSS preview
mode continues to reject unsupported source types and never runs scripts typed
into the HTML or CSS panes.

## Preview isolation

The generated preview is a separate `srcdoc` document in an iframe with an
empty sandbox capability list. It does not receive script, same-origin,
navigation, popup, or form permissions.

The preview document also uses a restrictive Content Security Policy:

- scripts, objects, frames, workers, fonts, media, and connections are blocked;
- external stylesheets and CSS imports are blocked;
- images are restricted to data URLs;
- forms, base URLs, and navigation are blocked.

Before preview generation, script and embedded-browsing elements are removed,
event-handler attributes are removed, and URL-bearing HTML attributes such as
`src`, `href`, and `action` are removed. The visible editor text is not changed;
sanitisation applies only to the generated preview.

Do not loosen the sandbox or CSP for a lesson-specific convenience. If a future
example genuinely needs a resource, add the narrowest explicit capability to
the component after reviewing its impact.

## JavaScript worker isolation

JavaScript-only mode runs learner code inside a dedicated Web Worker created
from the shared component. It captures `console.log`, `console.warn`, and
`console.error`, supports `console.clear()`, displays runtime and syntax errors
in the console pane, and terminates the worker when the user chooses `Stop` or
when the configured timeout is reached.

The console heading includes a small clear button for manually clearing output.

`prompt()` is supported in JavaScript mode. The worker pauses and shows an
inline prompt form in the console pane, then resumes the learner code with the
submitted value. Cancelling returns `null`, matching browser prompt behaviour.
Simple `prompt(...)` calls are transformed so beginner code does not need to
write `await prompt(...)`.

The default timeout is 3000 ms. Keep examples small enough for that budget, or
raise `execution.timeoutMs` only for a clear teaching reason.

Network access is disabled by default:

```js
execution: {
  network: { mode: "disabled" },
}
```

The implementation already accepts an allowlist shape for a future `fetch()`
lesson:

```js
execution: {
  network: {
    mode: "allowlist",
    allowedOrigins: ["https://example.edu"],
    allowedUrls: ["https://example.edu/api/teaching/"],
  },
}
```

If enabled later, worker `fetch()` omits credentials and rejects destinations
outside the configured HTTP(S) allowlist. Other network-style APIs are not
enabled.

The standalone JavaScript Playground allows `fetch()` to
`https://jsonplaceholder.typicode.com` by default for beginner API experiments.
Lesson-authored JavaScript examples should keep network disabled unless the
lesson has a specific allowlist need.

## Layout, interaction, and accessibility

- The example title and instructions render above the tool. Instructions are a
  disclosure; they default open in normal lessons and collapsed when the
  component mounts inside restored Teacher Slides. Structured instructions use
  semantic paragraphs, lists, and code elements. Standalone pages can pass
  `titleInsideInstructions: true` to place the tool title inside the disclosure
  summary.
- `Try it` switches HTML/CSS embedded examples between highlighted read-only
  code and a syntax-highlighted multiline editor.
- JavaScript examples are editable and use `Run`, `Stop`, and `Reset code`.
- HTML/CSS changes update after a 200–400 ms debounce.
- Tab inserts two spaces; Shift+Tab removes indentation.
- Ctrl+/ toggles comments for the current source language.
- Source tabs support arrow, Home, and End keys.
- The layout menu supports side-by-side, code above result, and result above
  code. The selected state is text-labelled and exposed with ARIA.
- The toolbar includes a fullscreen button so learners can expand the code
  tool without the surrounding page chrome.
- The separator supports pointer dragging and arrow/Home/End keys. It switches
  between vertical and horizontal behaviour for side-by-side and stacked
  layouts.
- Reset code does not reset split or zoom; reset view does not change code.
- Local code zoom multiplies the normal code size. In Teacher Slides the
  global slide text-size variable becomes the code-size baseline.
- At narrow widths, side-by-side examples use a stacked effective layout to
  avoid page-level horizontal overflow.
- Debounced preview updates are not announced on every keystroke. Explicit
  mode and reset actions use a polite live region.

## Open in Playground

Embedded examples show `Open in Playground`. The component opens the
playground in a new tab with only an opaque handoff ID in the URL and does not
navigate the current lesson tab. Source code, instructions, scaffolding, and
execution configuration are not encoded into a shareable URL.

The handoff transfers the current edited code as well as each source's authored
starting code, layout, split, and code zoom so the playground can continue the
task and still reset back to the original example.

The handoff is written to same-origin temporary storage under
`code-playground-handoff:*`, then removed when the playground consumes it. The
opener also clears the cross-tab payload after a short delay.

## Standalone Code Playground

`pages/tools/code-playground.html` hosts the same Live Code component in
playground mode. `javascript/pages/code-playground.js` owns workspace choice,
handoff consumption, debounced `localStorage` autosave, reset confirmation, and
the small saved-status label.

The storage key is versioned as `code-playground-workspaces-v1`. The controller
handles missing, malformed, or incompatible stored state by falling back to the
starter workspaces. Saved snapshots include the current layout, pane split, and
code zoom.
