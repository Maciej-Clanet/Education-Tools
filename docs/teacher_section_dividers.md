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
