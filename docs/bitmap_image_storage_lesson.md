# Bitmap image storage lesson

Implemented 4 October 2026. The page now has 18 student sections, an opener and
four teacher-only dividers. A second scenario and four individually presented
written tasks bring the deck to 27 Teacher Slides. The URL, contextual navigation
and previous/next sequence remain unchanged; `models` remains as an anchor alias.

## Teaching decisions

The lesson follows one 8×4 arrow through position, one-bit coding, row encoding
and reconstruction. Dimensions then reshape its unchanged 32 bits. Four-colour
codes and a palette change introduce interpretation before the conceptual file
diagram and pixel-data calculation. The main worked sizes are 32 bits / four
bytes for the monochrome arrow and 64 bits / eight bytes for the two-bit model.
Both exclude other file data.

The saved construction activity uses a fresh target. A photograph and matching
crop connect the small model to raster images. Three shape instructions and a
paired enlargement tool introduce vectors as a supporting comparison; bitmap
storage remains the main C3 teaching and assessment focus. RGB, format nuance and
full comparison notes remain in student revision disclosures. Resolution changes,
channel depth and compression belong to the next lesson.

The planned 60-minute core is a pacing assumption. The four written tasks are
available for independent practice rather than compulsory completion in that
session. See [the improvement plan](bitmap_image_storage_improvement_plan.md).

## Authoring

`build-bitmap-lesson.mjs` generates the teaching HTML and the original raster/vector
badge assets. Run `node build-bitmap-lesson.mjs` after changing its content or
assessment arrays. It retains the existing outer page shell, replaces the main
content and section navigation, and ensures the walkthrough stylesheet is linked.

- `javascript/data/bitmap-image-model.js` contains inspectable fixtures,
  encode/decode and reshaping functions, saved-work normalisation and scenarios.
- `javascript/core/bitmap-explorer.js` enhances authored grids and controls.
- `javascript/pages/bitmap-image-storage.js` initializes the shared shell,
  walkthroughs, paired scenarios and bitmap tools explicitly.
- `css/pages/bitmap-image-storage.css` contains page composition and responsive
  teaching layouts. Tools reuse the shared runtime and styles; the common exam
  saver also preserves retired draft IDs during this three-lesson rebuild.

## Tools and persistence

The locator, one-bit toggle, row walkthroughs, dimension switch and palette
demonstration start in authored temporary states. Native Previous/Next/Restart
controls operate the three walkthroughs. There is no automatic playback.

The practice grid uses `lesson-image-storage-bitmap-builder-v3`. It saves only
the 32 bounded palette indices. Palette selection remains temporary. The target,
Check action, outlines and textual first-mismatch feedback are independent of the
worked arrow. Grid buttons retain focus during edits and support arrow-key
movement. Clear my grid affects only this practice grid. Earlier 5×5 work under
`lesson-image-storage-bitmap-builder` remains untouched.

The comparator displays the same badge as 24×24 raster samples and three vector
objects. It starts at a readable ×8; ×4, ×8, ×12 and reset change only display
size. The raster uses nearest-neighbour enlargement. The original project SVG
and PNG are generated from the same square/circle/line geometry; the PNG samples
pixel centres without antialiasing. The white canvas is not counted as an object.
The old vector-tool storage key is neither read nor erased.

Without JavaScript, the grids, colour keys, every walkthrough stage, byte groups,
paired image examples and answer guidance remain readable. Interactive controls
and quiz scoring require JavaScript. Revision disclosures include target row
codes; editable controls do not replace the static teaching examples.

## Assessment

Quiz version 3 contains ten questions with pass score eight. Its answer key is
`lesson-bitmap-image-storage-quiz-v3`; the same key must be recorded explicitly in
Unit 2 progress metadata so its fallback never treats the old answers as current.

The exam store remains `lesson-bitmap-image-storage-exam-practice`; new response
IDs are `decode-v3`, `interpretation-v3`, `allocation-v3` and `representation-v3`.
Earlier saved responses remain untouched. One task decodes a 4×4 two-bit image,
one explains interpretation, one calculates 24 bytes from 12×8×2 bits, and one
recommends representations for a museum photograph and logo.

## Evidence and verification

PNG row packing and sample/index terminology were checked against the
[W3C PNG specification](https://www.w3.org/TR/png-3/). The
[W3C SVG specification](https://www.w3.org/TR/SVG2/) supports the qualified
vector/raster distinction. The photograph's author, licence and crop attribution
appear on the page and in
[the image credits](../assets/images/image-representation/CREDITS.md).

`node --test tests/bitmap-image.test.mjs` passes five meaningful model tests:
worked encode/decode round trips, fixed-bit reshaping, four-colour fixtures,
invalid-code rejection and bounded saved artwork with mismatch reporting.
Changed JavaScript passes `node --check`; regeneration produces the expected
18 sections, ten questions and four response IDs.

Browser acceptance passes using the isolated server on port 8765 and debugging
browser on port 9229:

- `$env:REP_LESSONS='bitmap-image-storage'; node tests/representation-lessons.browser.mjs` (PowerShell):
  all 27 slides at 1366×768 and 1366×900, student layouts at 390px and 320px,
  ten-question scoring and persistence, saved drafts, old-answer isolation,
  static fallback, assets, IDs and navigation.
- `node tests/bitmap-image.browser.mjs`: the final encoding explanation open,
  final decoding stage, temporary resets, palette colours, arrow-key focus,
  practice/error feedback, old-artwork isolation and scenario feedback. These
  expanded states fit 1366×768 with OS reduced motion enabled.

Reviewed screenshots are saved under `.raid-checks/representation/`. The first
written task places its code matrix beside its response field; compact spacing
and inline walkthrough controls keep large teaching figures readable without
clipping. The photo crop contains 60×40 source pixels and matches its marked
region in the full photograph. Answer guidance remains an expandable reading
surface, and the long quiz retains normal assessment scrolling.
