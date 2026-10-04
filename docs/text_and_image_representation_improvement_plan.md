# Text and image representation teaching improvement plan

Proposed 3 October 2026; implemented in the three existing lesson pages on
4 October 2026. The original plan below records the first-teaching sequence,
using the teaching approach of RAID/NAS and User Interfaces. Implementation and
verification notes follow it. The detailed plans specify examples, visuals,
tools and assessment:

- [Character sets, ASCII and Unicode](character_sets_improvement_plan.md)
- [Image storage with bitmaps and vectors](bitmap_image_storage_improvement_plan.md)
- [Resolution, bit depth and compression](image_quality_improvement_plan.md)

## The learning sequence

The connecting idea is that stored bits require an agreed interpretation. The
text lesson makes this concrete with a shared character mapping. The first image
lesson reconstructs a picture from pixel codes, dimensions and a colour key. The
second changes the amount and precision of image data, then examines compression.

| Lesson | Driving question | Main visual transformation | What learners should be able to do |
| --- | --- | --- | --- |
| Character sets, ASCII and Unicode | How does another computer know which text our bits mean? | Message → agreed codes → transmitted data → decoded message | Explain character codes, ASCII's limits and consistent Unicode interpretation |
| Image storage | How can a computer rebuild a picture from numbers? | Picture → grid → pixel codes → ordered data → picture | Explain a bitmap's data and interpretation, then compare it with a shape description |
| Resolution, depth and compression | Which image data can we change, and what do we gain or lose? | Same subject with changed dimensions, colour precision or compression | Predict effects, calculate raw pixel data and justify an image choice for a task |

The required C2/C3 coverage is character coding, ASCII/Unicode, raster storage,
resolution, sample/bit depth and compression. Vector comparison supports the
existing image lesson, but should remain a short contrast. UTF-8 illustrates how
Unicode becomes bytes; hand-encoding its bit prefixes is unnecessary. These scope
decisions follow [Pearson Issue 8, printed page 34](https://qualifications.pearson.com/content/dam/pdf/BTEC-Nationals/computing/2016/specification-and-sample-assessments/btec-nat-l3-ext-dip-in-computing-spec.pdf#page=44).

Assume students have met bits, bytes, simple binary values and hexadecimal notation
in C1. Start with brief retrieval and supply small reference tables throughout;
do not make memorising codes a prerequisite. As a planning assumption, allow one
60-minute core session each for text and bitmap storage, followed by optional
written practice. Allow two sessions for image quality: resolution/depth/size,
then compression and application. These are pacing estimates, not fixed timetables.

## What to carry over from the stronger lessons

RAID/NAS teaches mechanisms before named arrangements and keeps the same data
visible across each transformation. User Interfaces introduces commands gradually
and then applies them to concrete tasks. Apply those principles here:

- Begin with a familiar problem and three short goals. Use shared teacher-only
  opener and divider templates; keep student navigation focused on content.
- Give each teaching section one main idea and a large labelled visual. Reveal
  the next relationship after the current one is understood.
- Keep the same message or image through a worked sequence. Change one variable
  at a time in comparisons. State what remains fixed alongside each control.
- Place short prediction/check/reveal moments within teaching. Use different
  examples for independent application so learners transfer the idea.
- Introduce controls when their concepts are taught. Avoid exposing a full
  settings panel before students understand its inputs.
- Retain glossary, explanations and reference tables for independent reading.
  Put dense supplements in revision disclosures outside the main slide flow.
- Put the quick quiz before extended written practice. Give written tasks saved
  response areas and answer guidance, with one task per teacher slide.

These plans do not adopt the benchmark lessons' section counts as targets. Review
classroom readability and pacing before settling the final slide count.

## Shared implementation requirements

Retain the three URLs, shared shell, contextual back/previous/next navigation,
accessibility launcher and useful old anchors. Preserve anchors as aliases when
content moves. No backend, accounts or separate slide decks are needed.

Use `lesson-walkthrough.js` for static sequences with Previous/Next/Restart and
`paired-scenarios.js` where a choice and its reason belong together. Share bitmap
data/rendering logic across C3 where it genuinely serves both pages. Keep lesson
presets in `javascript/data/`, reusable behaviour in `javascript/core/`, and page
composition/styles in the existing page files. Avoid building a general graphics
editor or arbitrary encoding laboratory.

Initialise walkthroughs explicitly; `initLessonPage` does not do so. Supply all
paired-scenario feedback strings because its defaults refer to interfaces; it
does not persist answers. Put `data-no-slide-advance` around interactive areas.
Place `data-slide-break` only as a direct section child: it cannot split questions
inside one nested form. Use the existing exam layout pattern to separate tasks.

Use authored HTML/SVG diagrams for mappings and processes. Photo comparisons need
one local source and reproducible derivatives, with source/creator/licence/edits
recorded. Compression figures must come from actual encoded assets; never invent
file sizes to match a visual. Teaching fixtures and their expected values should
be inspectable independently of the UI.

All tools need an authored static example, labelled controls, keyboard/touch
operation, stable focus and an explicit reset. Do not communicate only through
colour. Teaching demonstrations start in a predictable temporary state; learner
work can persist separately. Follow [teaching motion](teaching_motion.md): visible
step/playback controls, offscreen pausing and teaching playback available with OS
reduced motion. Manual stepping is sufficient for these plans.

## Assessment and saved work

Before this rebuild, all three quizzes had five questions, pass score four and
version two. Image quizzes now use version three. The refined character lesson
uses version four: eight questions, pass six, without invented-code or byte-count
assessment. The shared shell does not check the version of raw saved quiz answers,
so changing only `version` is insufficient. Use a fresh
`lesson-<lesson-id>-quiz-v<version>` storage key in each page config **and** the
matching `quiz.storageKey` in `unit-progress-data.js`; its legacy fallback otherwise
reads the original key. Update totals/pass scores consistently and verify unit
progress after both fresh and old saved attempts. Leave old storage untouched.

Keep existing exam-response IDs only for substantively unchanged prompts. New
prompts and incompatible activity schemas need new IDs/keys. Resetting a teacher
demonstration must not erase a learner's artwork or written answers.

## Build order and acceptance

1. Rebuild text representation first, establishing the interpretation idea and
   validating progressive examples in the shared shell.
2. Build the bitmap encoding/decoding model and its static examples; then add the
   limited raster/vector comparison.
3. Reuse the image fixtures/model for resolution and depth, derive calculations,
   and add measured compression examples.
4. Replace assessment content and update metadata together. Review existing hub
   and catalogue descriptions only where the final scope requires changed copy.
5. Check factual fixtures, round trips and calculations; then review each teaching
   state at 1366×768 and a larger classroom viewport, and student pages at 390/320px.
   Check keyboard/touch, no-JS reading, resets, instance independence, saved drafts,
   quiz progression and reduced-motion behaviour where playback exists.
6. Record actual implementation and verification in the Unit 2 tracker and lesson
   notes only after the rebuild passes.

Success means a student can explain the mechanism from the visuals, make a correct
prediction before using a tool and apply the idea to an unfamiliar example. More
sections or more animation alone do not demonstrate improvement.

## Implementation record — 4 October 2026

| Live lesson | Student sections | Teacher Slides | Current quiz | Written tasks | Implementation notes |
| --- | ---: | ---: | --- | ---: | --- |
| Character sets, ASCII and Unicode | 21 | 26 | v4: 8 questions, pass 6 | 3 | [Character sets](character_sets_lesson.md) |
| Image storage | 17 | 25 | v4: 10 questions, pass 8 | 3 | [Bitmap storage](bitmap_image_storage_lesson.md) |
| Resolution, bit depth and compression | 29 | 35 | v3: 12 questions, pass 9 | 5 | [Image quality](image_quality_lesson.md) |

All three existing URLs, contextual navigation and useful old anchors are
retained. Teacher Slides reuse the same teaching sections, with openers and
dividers. Core concepts use large authored diagrams and controlled examples;
reference detail remains available in revision disclosures. The character
transmission has visible playback/pause and manual controls; teaching movement
remains available under reduced motion. No account, backend or new dependency
is needed to serve the lessons.

The text tools distinguish code points, UTF-8 bytes and visible characters,
including spaces and controls. Its quiz and written practice use real coverage/
decoding scenarios; technical byte details remain in the inspector without
byte-count assessment. The redundant dropdown task is removed. The refined bitmap
lesson uses a short storage illustration,
explicit bit-depth gradients and practical raster/vector comparisons, without
reconstruction exercises. Image-quality tools independently change sampling,
colour precision and compression, using measured file sizes rather than invented
figures. The bitmap lesson uses a NASA spacewalk photo with a matched helmet
crop; the quality lesson uses a separate museum painting for all its comparisons.
It retains one RGB storage walkthrough and introduces lossless/lossy compression
with illustrated encoding/decoding paths. The photographs
have local, reproducible derivatives with
[licence and edits recorded](../assets/images/image-representation/CREDITS.md).

Quiz configurations and unit-progress metadata use matching versioned
storage keys, totals and pass scores: character and bitmap v4, image quality v3.
Catalogue summaries describe the rebuilt
content. Written responses retain their original storage keys with new IDs for
changed prompts. The shared exam saver now merges current responses into saved
data, preserving retired draft IDs without presenting them under new questions.

### Verification

The combined model/integration/shared-component suite covers encoding fixtures,
bitmap storage calculations, quantisation, compression, assessment metadata and
shared lesson controls. Dedicated browser suites exercise the visible tools and
storage migrations, including the revised bitmap quiz and retired written tasks.

```powershell
node --test tests/character-encoding.test.mjs tests/bitmap-image.test.mjs tests/image-quality.test.mjs tests/representation-integration.test.mjs tests/teacher-dividers.test.mjs tests/lesson-walkthrough.test.mjs tests/interface-activities.test.mjs
```

Browser checks use the existing `raid-test-server.mjs` server at
`http://127.0.0.1:8765` and an isolated Chrome profile with remote debugging at
`http://127.0.0.1:9229`. Do not point these checks at a learner's normal browser
profile: the tests deliberately seed and replace local test-origin storage.
The helper also accepts `FLEXBOX_TEST_ORIGIN`, `FLEXBOX_CDP_ORIGIN` and
`FLEXBOX_SCREENSHOTS` overrides.

```powershell
node raid-test-server.mjs
# In a separate terminal, with the isolated debugging browser running:
$env:REP_LESSONS = ''
node tests/representation-lessons.browser.mjs
node tests/character-encoding.browser.mjs
node tests/bitmap-image.browser.mjs
node tests/image-quality.browser.mjs
```

The shared browser suite checks every slide at 1366×768 and 1366×900, student
pages at 390px and 320px, image loading, IDs and anchors, no-JavaScript reading,
quiz scoring and reloads, retired draft preservation, and old-quiz isolation.
The full three-lesson run also checks the Unit 2 C2/C3 totals and fallback when
only old quiz answers remain. Dedicated tool suites exercise changed and revealed
states, resets, keyboard operation, temporary versus saved state, and reduced
motion. Screenshots and the layout report are local test artifacts under
`.raid-checks/representation/`.

The corrected character, bitmap and image-quality lessons pass the classroom/mobile
layout review. Dedicated interaction suites exercise their tools. The quiz remains a scrolling
assessment, while supplementary guidance opens on demand. Suggested classroom
timings remain estimates pending use with a class.
