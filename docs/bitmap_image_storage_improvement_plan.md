# Bitmap image storage improvement plan

**Status: Proposed 3 October 2026; implemented and verified 4 October 2026.**
See [the implementation guide](bitmap_image_storage_lesson.md)
for the delivered sequence, component contracts and verification evidence.

**Classroom review correction, 4 October 2026:** the current implementation
supersedes the encoding/decoding emphasis in the original proposal below. Row
exercises, bitmap painting/reconstruction and the decoding written task are
removed. Two explicit bit-depth sections, a new NASA photograph, illustrated
vector benefits/limitations and real project comparisons strengthen explanation
and choice. The paired zoom remains, with three size presets and no redundant
reset. Current assessment is quiz version 4, ten questions/pass eight, plus three
new written tasks. The implementation guide records the final 17-section,
25-slide sequence; the following proposal is retained as design history.

Rebuild `pages/topics/bitmap-image-storage.html` around the question: **How can a
computer rebuild a picture from stored numbers?** Move one small image through
picture, pixel grid, colour codes, stored sequence and reconstruction before
comparing bitmap and vector representations. Retain the existing URL and shared
lesson shell. The following records the agreed plan; the implementation guide
describes the completed live changes and any remaining verification.

Read alongside [the shared improvement plan](text_and_image_representation_improvement_plan.md).
The teaching references are [RAID and NAS](raid_nas_lesson.md) and
[User interfaces](user_interfaces_lesson.md): introduce a problem, show its
mechanism, offer a controlled interaction, then apply it in a different context.

## Scope and lesson duration

The C3 content recorded in [the Unit 2 specification and tracker](computing_unit_2.md#c3-image-representation)
requires bitmap/raster storage, resolution, sample/bit depth and compression.
Vector representation is a supporting comparison, not an explicitly listed C3
requirement. Keep the current title, but give bitmap encoding and interpretation
most teaching and assessment time.

**Planning assumption:** a 60-minute core lesson, with independent written
practice and optional extensions afterwards. Aim for approximately 18 concise
student sections, with an opener and four teacher-only dividers. Final slide
count depends on readable layout, not the longer RAID deck's length.

| Time | Core learning |
| --- | --- |
| 0–5 minutes | Picture, pixels and learning goals |
| 5–18 minutes | Locate pixels, encode rows and reconstruct a monochrome image |
| 18–30 minutes | Dimensions, palette interpretation and four colour codes |
| 30–42 minutes | Count pixel data and complete guided encoding practice |
| 42–50 minutes | Compare a photograph, shape instructions and enlargement |
| 50–60 minutes | Quick quiz, corrective feedback and an exit explanation |

Prior knowledge: bits, bytes and simple binary codes from C1 and C2. Retrieve
these briefly rather than reteaching binary conversion. The next C3 lesson owns
resolution changes, full depth relationships, RGB channel calculations, larger
file-size calculations and compression. This lesson establishes what those
quantities describe.

## Current lesson audit

The current eleven sections include a useful saved 5×5, four-colour paintable
grid and a vector tool. Keep their useful mechanisms, plus contextual navigation,
glossary, quiz progress and saved written responses.

The teaching sequence currently compares models before explaining either. It
introduces hexadecimal colour strings, vector syntax, two-bit codes and storage
totals before showing how a colour key works. Painting changes data, but learners
never reconstruct an image or discover why dimensions matter. The vector scaler
shows lengthy JSON without an equivalent raster comparison. Remaining sections
mostly state facts in cards and tables.

The five-question quiz mainly checks recognition, uses implausible distractors
and gives vector choices disproportionate space. Without JavaScript, the bitmap
grid, palette and row data are empty. There is no teacher opener or divider pacing.

The builder labels 50 bits as seven raw bytes. This is a possible minimum
whole-byte container for a continuously packed teaching stream, not an exact
image-file size. Actual formats may pad rows and add other data; PNG scanlines,
for example, begin on byte boundaries. Use byte-aligned examples first and label
all estimates precisely. [W3C PNG scanlines](https://www.w3.org/TR/png-3/#7Scanlines)

## Ordered teaching sections

Place an opener before section 1 with three goals: encode and decode pixels,
explain the information needed to reconstruct an image, and compare storage
representations. Use dividers before sections 3, 7, 13 and 17. Slides contain
student-facing explanations, not teacher prompts.

1. **From a picture to pixels.** Show a familiar school badge, then enlarge the
   same selected region until individual picture elements are visible. Connect
   picture, grid and stored numbers without presenting two competing models yet.
   Ask learners to identify one pixel.
2. **Rows and columns locate a pixel.** Introduce the same 8×4 arrow throughout
   the encoding sequence. Label width, height and row/column positions; highlight
   row 2, column 5. Establish `8 × 4 = 32 pixels` before counting any bits.
3. **Give two colours two codes.** Display `0 = white`, `1 = black`. Change one
   square and its linked bit. The code depends on the stated key; black is not
   intrinsically represented by one in every format.
4. **Store one row after another.** Highlight a row as its eight bits join the
   sequence. Step through four rows. Show the reading order with arrows and
   numbered row labels, not colour alone.
5. **Decode the stored sequence.** Reconstruct the same picture row by row.
   Learners predict the next row before revealing it. Keep the colour key visible
   and the selected code linked to its destination square.
6. **The numbers need dimensions.** Lay out the same 32 bits as 8×4 and 4×8.
   The bits have not changed, but the row boundaries have. Ask what information
   the decoder needs to reproduce the intended shape.
7. **Four colours need four codes.** Reveal `00`, `01`, `10`, `11` beside white,
   teal, gold and dark ink swatches. Explain two bits per pixel through these
   four choices. Reserve general powers and extensive depth tables for lesson 2.
8. **A pixel code can select a palette entry.** Select a gold pixel and follow
   `10` to its palette entry. Change that entry's colour without changing any
   pixel codes; predict which positions change. Explain that this is an indexed
   colour model, not a rule that all bitmap formats use palettes.
9. **Pixel data belongs inside a file.** Use a conceptual file diagram containing
   dimensions, colour interpretation and pixel data. Label it a teaching model,
   not the literal byte layout of PNG or BMP. Explain that real files contain
   information beyond the pixel values.
10. **Count the pixel data.** Give each of the 32 pixels two visible bit slots,
    then regroup 64 bits into eight bytes. Introduce the formula only after the
    quantities are visible. State the exclusions beside the result.
11. **Build and check a bitmap.** Show a fresh four-colour target and editable
    grid. Learners predict a row's codes, paint it, inspect the stored sequence
    and check their reconstruction. Repainting changes values but leaves the
    fixed number of pixel slots unchanged.
12. **Why raster data suits photographs.** Show a photograph and a precisely
    matched enlarged crop. Connect its many local colour variations to stored
    pixel values. Avoid a format list or an unsupported claim that every photo
    must use the same depth.
13. **Describe a drawing with shapes.** Build a badge from a rectangle, circle
    and line. Reveal one plain-language instruction beside each object. Teach
    coordinates, size and colour only as needed to interpret those instructions.
14. **Enlarge the same graphic two ways.** Enlarge a fixed raster and equivalent
    vector badge together. Keep source pixel count and source object count
    visible. The raster's samples remain fixed; vector geometry can be rendered
    for the new size. Do not rewrite source geometry merely to zoom its display.
15. **Choose for the content and use.** Work through a school photograph and
    school crest, then transfer to fresh museum and diagram scenarios. Require a
    representation plus a relevant reason. Briefly distinguish representation
    from file format: PNG/JPEG raster examples and an SVG shape example.
16. **Repair the misconceptions.** Revisit three claims with evidence: repainting
    must increase raw size; enlarging restores missing detail; vectors are always
    smaller. Keep the full comparison table in student revision details.
17. **Check understanding.** Complete the quick quiz, then give the exit
    explanation: what information lets a computer reconstruct a bitmap?
18. **Written practice.** Provide separate response areas and answer guidance.
    These are follow-on independent tasks, not all compulsory within 60 minutes.

## Worked examples and extensions

Use this arrow for the complete monochrome encode/decode sequence:

```text
00011000
00111100
01111110
00011000
```

With the stated white/black key, it contains 32 pixels at one bit each:
`8 × 4 × 1 = 32 bits = 4 bytes` of pixel data. Reshaping its unchanged stream into
four columns creates eight rows, making dimensions meaningful.

For four-colour teaching, use `00 = white`, `01 = teal`, `10 = gold`, `11 = ink`.
The row `00 01 01 10 10 11 00 00` represents eight pixels and sixteen bits.
An 8×4 image using those codes needs `8 × 4 × 2 = 64 bits = 8 bytes` of
uncompressed pixel data, excluding palette, metadata, padding and compression.
Repainting every pixel still leaves 64 bits in this fixed-width model.

Optional extensions are a learner-designed image, a decode challenge with a
different palette, and one direct-RGB pixel showing separate red, green and blue
values. Do not make channel-depth arithmetic prerequisite knowledge here. Actual
format terminology distinguishes sample depth from total bits per pixel; indexed
colour instead stores palette indices. [W3C PNG colour types](https://www.w3.org/TR/png-3/#6Colour-types-and-values)

## Interactive component contracts

### Bitmap encoding explorer

Generalise the existing builder into a reusable component with authored presets.
Default teaching state is the 8×4 monochrome arrow, row 1 selected and one bit per
pixel. Inputs are select pixel, select colour, paint, previous/next row,
encode/decode view and reset. Introduce the four-colour preset only after section
7; avoid exposing resolution and compression controls prematurely.

Outputs are selected position, named colour, linked code, row/stream highlighting
and explicitly labelled pixel-data totals. The practice preset adds a target and
Check action with feedback identifying mismatched positions; Reveal remains
separate. A dimensions/palette preset powers section 6 and section 8 using the
same model rather than another tool.

Teaching states are temporary. Save learner artwork under a new versioned key if
the 5×5 schema changes; leave existing work untouched. Use named swatches,
visible codes, selected states, touch-sized targets and keyboard controls.
Update cells without destroying focus; announce only the changed result.

Static fallback must contain the actual grid, colour key and all four stored
rows, with reconstruction guidance in native details. Label the scanning order
as this example's convention, not a universal file-format rule.

### Raster and vector enlargement comparator

Use the same badge as fixed 24×24 raster data and equivalent SVG shapes in large,
aligned comparison viewports. Start the classroom view at ×8 (192 CSS pixels
across), with a labelled native-size inset. Offer ×4, ×8, ×12 and Reset; define
these as display enlargement relative to the 24-pixel source width. Reset returns
to the readable ×8 view. Keep unchanged source sample/object counts and a short
instruction list visible. Keep JSON in optional revision details. State that the
raster uses nearest-neighbour enlargement; smoothing can change appearance
without recovering original detail.

Use authored large paired examples and native-size insets as fallback. Vector source is still rendered to
pixels on a raster display. SVG can include raster content, so describe the
particular shape example rather than claiming every SVG is purely vector.
[W3C SVG specification](https://www.w3.org/TR/SVG2/)

## Assessment and saved work

| Metadata | Current | Proposed after implementation |
| --- | --- | --- |
| Questions and pass score | 5 questions, pass 4 | 10 questions, pass 8 |
| Quiz version | 2 | 3 |
| Raw answer storage key | `lesson-bitmap-image-storage-quiz` | `lesson-bitmap-image-storage-quiz-v3` |
| Exam storage | `lesson-bitmap-image-storage-exam-practice` | Preserve key; use new response IDs for changed questions |

The lesson shell does not version-check raw saved quiz answers. Therefore the
new storage key is required as well as version 3 in `lessonConfig.quiz` and
`javascript/data/unit-progress-data.js`. Add the same explicit
`storageKey: "lesson-bitmap-image-storage-quiz-v3"` to the unit-progress quiz
metadata: its fallback reader otherwise checks the unversioned answer key when
aggregate progress is missing. Leave old keys untouched.

Allocate two quiz questions each to dimensions, encoding/decoding,
palette/metadata interpretation, raw allocation and representation/enlargement.
Use plausible distractors such as adding dimensions, confusing bits and bytes,
or assuming palette changes rewrite every stored code.

Written tasks should cover decoding a supplied 4×4 two-bit image, explaining the
information needed to rebuild a photograph, calculating pixel data with stated
exclusions, and comparing a museum photograph with a reusable venue logo. The
last task supports the vector comparison; most assessment remains bitmap-based.
Preserve response IDs only for substantively unchanged questions.

## Implementation and verification

1. Author the small source images, keys, target grids and expected answers first.
   Use local SVG/HTML for diagrams. Use a credited photograph with verified reuse
   permission and record its creator, source, licence and edits.
2. Build shared bitmap behaviour in `javascript/core/`, presets in
   `javascript/data/`, and lesson composition in the existing page files. Reuse
   `lesson-walkthrough.js`, `paired-scenarios.js` and the shared lesson shell
   where their existing contracts fit.
3. Rewrite sections while retaining the URL, contextual links and useful old
   anchors as sections or aliases. Add opener/divider templates and keep dense
   revision details outside the first-teaching slides.
4. Update assessment metadata and storage keys together. Update the Unit 2
   tracker and implementation guide only when the lesson has actually changed.
5. Verify encode/decode round trips, palette lookup, row reshaping and exact bit
   totals. Check reset, independent instances, saved artwork, quiz answers and
   written drafts without disturbing earlier saved keys.
6. Review every teaching state at 1366×768 and student layouts at 390px and
   320px. Check keyboard/touch operation, focus, no-JavaScript examples, links,
   image credits and slide navigation. Any timed playback follows
   [teaching motion](teaching_motion.md); manual steps are sufficient here.

Completion means learners can trace an image into codes and back, explain the
role of interpretation information, calculate the small model's pixel data and
justify a representation choice. More slides or more controls alone do not meet
that acceptance criterion.
