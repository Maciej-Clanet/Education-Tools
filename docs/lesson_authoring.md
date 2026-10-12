# Lesson authoring

Read for new lessons or substantial teaching changes. Use the target outline in
`docs/lessons/`, relevant neighbouring outlines and the applicable specification
section to decide what to assume, introduce, develop or leave for later.

## Teaching and layout

- Start from a familiar problem; establish the mechanism before comparisons and
  terminology-heavy summaries. Use one main idea per first-teaching slide.
- Keep the same data/example through a sequence; change one variable at a time
  in comparisons and state what stays fixed. Introduce controls as their concepts
  are taught. Use fresh examples for independent application.
- Keep fuller revision explanations available to students without crowding slides.
  Use static HTML/SVG/CSS diagrams for processes and relationships, real photos
  for equipment recognition. Record source, creator, licence and edits beside
  third-party assets; preserve attribution and reproducible image derivatives.
- Reuse the lesson shell: sidebar, contextual back/previous/next navigation,
  glossary, misconceptions and assessment where appropriate. Preserve useful old
  anchors as aliases when sections move.
- Teacher Slides use the same sections, not a duplicate deck. Use the existing
  [opener/divider and slide-break markup](teacher_section_dividers.md). Keep slides
  free of teacher prompts; add small live-demo cues only when requested.
- Usually put the quick quiz before longer written tasks. Provide saved on-page
  response areas and answer guidance; split long tasks into separate teacher
  slides. Use [exam technique](exam_technique.md) when the command word warrants
  evaluation, with a scenario-specific judgement rather than a fixed formula.

## Components and learner work

Consult the [component index](shared_components.md) before inventing an interaction.
Keep authored explanations/examples readable without JavaScript. Use native
labelled controls, keyboard/touch support, stable focus and text beyond colour.
Prevent tool interactions from advancing the slide (`data-no-slide-advance`).
Teaching motion must remain available with OS reduced motion; provide manual or
playback controls and pause ongoing playback offscreen. Decorative transitions
still respect reduced motion. Details: [teaching motion](teaching_motion.md).

Keep demonstrations in predictable temporary state unless saving serves a learning
purpose. Resetting a demonstration must not erase written answers or other work.

- New pages: update their unit/resource hub, `javascript/data/course-catalog.js`,
  contextual previous/next links, and quiz metadata in
  `javascript/data/unit-progress-data.js` where applicable.
- Changed quiz questions/answers/totals/pass scores: keep that registry and
  `lessonConfig.quiz` consistent. Bump the version when prior progress is stale.
  A replacement quiz also needs a fresh answer `storageKey` in **both** places:
  raw saved answers have no checked version, and the registry has a legacy fallback.
- Reuse quiz IDs across units unless the actual questions/marking differ.
- Changed written prompts need new response IDs. Keep IDs for unchanged prompts;
  retain the exam store and its merge behaviour that preserves retired drafts.
  Never attach old answers to new questions or delete legacy stores casually.

Verify affected content, interactions, presentation and persistence using
[testing guidance](testing.md). Store commands/setup once, not a pass report in
every lesson outline.

## Coverage outline format

Use `docs/lessons/<page-slug>.md`: lesson/source link, scope, optional prerequisites,
then a numbered topic sequence. Consecutive sections may be grouped; retain the
order of appearance and include the starting section ID to check against the page.

- **Introduced:** brief orientation; do not assume independent application.
- **Developed:** substantive teaching of part of the topic; name the boundary or
  the later lesson responsible for the remainder.
- **Covered:** the named topic reaches its intended unit scope, including relevant
  application/implications. Check the content and specification, not just headings.
- **Practice:** recap, misconception checks or assessment; not a depth rating.

Depth applies to the named topic, not an entire specification bucket or student
mastery. Web lesson labels refer to their stated course scope, not Unit 2.
Label supporting/enrichment topics explicitly. Distinguish assumed prerequisites
from first introductions; record significant exclusions and deferred teaching.
Keep only essential source/generator notes and important references not already
available on the page. Do not duplicate quiz counts, component APIs, slide totals,
test results or development history. An outline is a current coverage map, not a
claim that a lesson needs no further improvement.
