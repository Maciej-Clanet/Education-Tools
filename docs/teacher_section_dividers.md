# Teacher-only section dividers

Place an inert template immediately before a normal `data-lesson-section`:

```html
<template data-teacher-divider>
  <h2>Memory management</h2>
  <p>How processes safely share RAM</p>
</template>
<section id="memory" class="lesson-section panel" data-lesson-section>
  <!-- Normal lesson content -->
</section>
```

Only the heading is required; the one-line subtitle is optional. The shell adds
the `Next` eyebrow. Keep these templates to a heading and optional paragraph.
Each target section must have a unique ID. No per-lesson JavaScript is needed.

`javascript/core/teacher-dividers.js` creates a hidden presentation section with
`data-teacher-only`, without `data-lesson-section`. The shared teacher deck includes
it in DOM order, counts it, and uses the existing keyboard, button and touch
navigation. Student Jump To links should continue to reference teaching sections.
Templates are inert without JavaScript; generated sections stay hidden outside
teacher mode, including from reading and accessibility tools.

The generated ID is `<following-section-id>--divider`. Teacher-mode reloads can
restore that hash. Loading that hash in student mode, or exiting on a divider,
normalises the hash and scroll position to the following teaching section.
Entering from student mode ignores hidden dividers when finding the nearest slide.

Styles live in `css/pages/lesson.css`. Shared behaviour is covered by
`node --test tests/teacher-dividers.test.mjs`.

## Small teacher-only cues

Use `<p data-teacher-note>Optional live demo: …</p>` inside a normal section.
The shared stylesheet hides the cue from student content, reading tools and
printing, and reveals it in Teacher Slides without creating another slide.
Keep cues brief. Do not apply `data-teacher-only` to notes: that attribute is
reserved for generated full presentation sections.

## Teacher-only lesson opener

Use one `<template data-teacher-opener>` per lesson. Put it inside
`<main class="lesson-main" data-role="lesson-main">`, immediately before the first
`<section ... data-lesson-section>` (and before its divider template, if present).
The shared `teacher-dividers.js` renderer inserts the opener ahead of all teaching
sections/dividers. It uses the same deck, tools, keyboard/touch navigation and
numbering as section dividers; there is no separate presentation implementation.

Smallest valid declaration:

```html
<template data-teacher-opener>
  <h2>Lesson title</h2>
</template>
```

The title in `h2` is required. Add an optional `p` for a short subtitle/framing
question, and an optional `ul` with 2–4 short `li` goals. The shell supplies the
“Today” eyebrow. Do not add a second h1, IDs, scripts or `data-lesson-section`
to the template. Keep the declaration to a title, subtitle and goals.

```html
<template data-teacher-opener>
  <h2>Backup and Data Recovery</h2>
  <p>How can we recover when data is lost?</p>
  <ul>
    <li>Explain why backups are needed</li>
    <li>Compare full, incremental and differential backups</li>
    <li>Choose suitable backup locations</li>
    <li>Explain how data is restored</li>
  </ul>
</template>
```

No edits to shared JavaScript, CSS, slideshow registration, Jump To links or
slide numbering are needed in lessons already using `initLessonPage` and
`css/pages/lesson.css`. These templates are inert without JavaScript and remain
hidden in student mode, read-aloud discovery and printing.

Opening Teacher Slides always starts at the declared opener, including a reload
with Teacher Slides saved as active. This intentionally takes precedence over a
saved content hash for lessons with an opener. Lessons without an opener retain
their existing nearest-section entry and hash restoration. Only the first opener
declaration is used. Generated ID: `<first-section-id>--opener`; exiting on the
opener, or visiting that hash in student mode, maps to the first student section.

Quick check: normal page → no opener; Teacher Slides → opener first; Next → first
content (or its divider, if declared); Previous → opener; Jump To → no opener link.

## Lightweight teaching composition

`data-slide-break` on an empty direct child of a lesson section splits that
section into teacher slides while preserving all student content and live form
nodes. Collecting and processing data uses it for six separate transformation
questions and three pairs of misconceptions. Native `details`/`summary` reveals
remain keyboard/touch accessible; its page-scoped `.data-revision` supplements
retain broader independent-reading examples but are hidden in Teacher Slides.
