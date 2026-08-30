# Live Code Example component

`javascript/core/live-code-example.js` renders editable HTML/CSS examples with
a real generated preview. Shared styling lives in `css/live-code-example.css`.

This is deliberately separate from `javascript/core/code-preview.js`:

- Code Preview renders authored teaching previews, annotations, diagrams, and
  staged examples.
- Live Code Example combines editable source with locked scaffolding and
  renders the literal result in an isolated iframe.

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
backend.

## Configuration

```js
{
  id: "featured-text",
  title: "Try the text properties",
  description: "Change a value and observe the generated preview.",
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

Only entries in `sources` appear as tabs. Scaffolding is locked and never
shown as an editable source.

Supported source arrangements:

- HTML only: visible `html` source plus optional locked scaffold CSS.
- CSS only: visible `css` source plus locked scaffold HTML.
- HTML and CSS: both sources are visible as tabs; optional `htmlBefore`,
  `htmlAfter`, and scaffold CSS can still support the preview.

`scaffold.html` is used when no visible HTML source exists. With visible HTML,
`scaffold.htmlBefore` and `scaffold.htmlAfter` wrap it. Scaffold CSS is placed
before visible CSS.

The source objects intentionally use a general `type` field. A future
JavaScript runner can add a JavaScript source and an explicit run/execution
strategy without changing the HTML/CSS source model. JavaScript sources are
rejected by the current component rather than executed.

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

## Interaction and accessibility

- “Try it” switches between highlighted read-only code and a plain multiline
  editor.
- HTML/CSS changes update after a 200–400 ms debounce.
- Tab inserts two spaces; Shift+Tab removes indentation.
- Source tabs support arrow, Home, and End keys.
- The separator supports pointer dragging and arrow/Home/End keys.
- Buttons provide more-code, equal, and more-preview presets.
- Reset code does not reset split or zoom; reset view/layout does not change
  code.
- Local code zoom multiplies the normal code size. In Teacher Slides the
  global slide text-size variable becomes the code-size baseline.
- At narrow widths the panes stack and horizontal resizing controls are hidden.
- Debounced preview updates are not announced on every keystroke. Explicit
  mode and reset actions use a polite live region.
