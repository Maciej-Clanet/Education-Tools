# Bitmap image storage lesson

Refined and verified 4 October 2026 after the classroom review. The page has
17 student sections and 25 Teacher Slides, including one opener, four dividers,
a second representation-choice scenario and three individually presented written
tasks. Its URL and contextual previous/next navigation remain unchanged.

## Teaching focus

The lesson now teaches how bitmap storage works and why a representation suits a
particular use. It does not ask students to encode rows, decode pixel codes,
paint a target or reconstruct an image. Those activities and their learning goal
were removed after review. A brief palette illustration remains to explain that
a stored value gives each pixel a colour; no code conversion is assessed.

The sequence is:

1. A bitmap stores a grid of pixel values.
2. Rows and columns locate each pixel.
3. Each pixel needs a stored colour value.
4. Dimensions, colour format and pixel values describe the image.
5. A real photograph contains fine colour and tonal variation.
6. Bit depth means bits per pixel; 2^b gives the number of possible values.
7. A controlled gradient demonstrates tonal detail at fixed pixel positions.
8. Dimensions and bit depth determine uncompressed pixel-data size.
9. Vector images describe shapes rather than storing every pixel value.
10. The same raster and vector badge enlarge side by side.
11. Vector benefits include sharp resizing, object editing and compact simple art.
12. Photographs, complex artwork and output-format requirements expose limitations.
13. A museum website and route diagram show real representation choices.
14. Paired choices apply those ideas to fresh requirements.
15. Misconceptions, then the quiz and three written tasks.

The formula examples keep 8×4 positions fixed: one bit per pixel needs 32 bits
or four bytes; two bits need 64 bits or eight bytes. These are uncompressed
pixel-data figures, excluding file headers, palettes, padding and compression.
Detailed image quality and compression remain in the following C3 lesson.

Vector source geometry is distinguished from the final screen pixels. A simple
shape description can be compact, but the lesson makes no universal claim that
vector files are smaller. Original logo/editing/map visuals support the benefits
and use cases rather than relying only on lists.

## Authoring and components

`build-bitmap-lesson.mjs` is the authoritative static content generator. Run
`node build-bitmap-lesson.mjs` after changing its lesson or assessment content.
The generator also reproduces the original raster/vector badge pair. It has no
dependency on ignored `.raid-checks` snippets: the gradient markup is authored in
the generator and both static SVG ramps are generated with `quantiseShade` from
`javascript/data/image-quality-model.js`.

- `javascript/data/bitmap-image-model.js` retains the small image/palette
  fixtures, exact pixel-data calculation and paired-scenario definitions. Removed
  encoding, decoding, painting and saved-artwork helpers are no longer shipped.
- `javascript/core/bitmap-explorer.js` provides only the pixel-position selector
  and the three display-enlargement presets. Both start in temporary default
  states. The locator starts at row 2, column 5; the comparator starts at ×8.
- `javascript/core/bit-depth-gradient.js` and `css/bit-depth-gradient.css` provide
  the shared gradient component. It starts at two bits per pixel and offers
  one, two, four and eight bits: 2, 4, 16 and 256 available grey values.
- The gradient always has the same 256 horizontal positions and display width.
  Its eight-bit reference stays unchanged; each selected ramp is independently
  quantised from that reference. There is no persistence, animation or redundant
  reset button.
- The vector comparator has ×4, ×8 and ×12 buttons. The redundant Reset to ×8
  control was removed. The source remains 24×24 raster samples or three vector
  objects; only the display size changes.
- `javascript/pages/bitmap-image-storage.js` initializes the shared lesson shell,
  the single vector-construction walkthrough, paired scenarios, bitmap controls
  and bit-depth gradient explicitly.

Page composition belongs to `css/pages/bitmap-image-storage.css`. The shared
lesson shell is unchanged. With JavaScript disabled, the pixel illustrations,
completed shape sequence, default comparison, gradient strips and written
answer guidance remain available. Dynamic controls require JavaScript.

Old anchors including `encode-rows`, `decode-rows`, `bitmap-builder`, `one-bit`,
`colour-data` and `palette` now point to the short stored-value illustration.
`dimensions` points to the file-information section and `models` to vectors.
They do not create obsolete exercises or extra teaching slides.

## Photograph and assets

The bitmap photograph is now NASA's Bruce McCandless spacewalk photograph,
credited to Robert L. “Hoot” Gibson / NASA. Visible source and NASA usage links
accompany its resized/cropped presentation. The lesson uses
`assets/images/image-representation/bitmap-photo.jpg` at 960×640.

`bitmap-photo.json` records source, rights, hashes, crop/resize settings and the
matched 60×40 teaching crop at x636, y176. Both views use the same local image.
`build-bitmap-photo.mjs` reproduces the derivative; the source, modification and
reuse record is in the folder's `CREDITS.md`. Existing NASA image details are
linked through the [official source](https://www.nasa.gov/history/photos-from-sts-41b/)
and [usage guidance](https://www.nasa.gov/nasa-brand-center/images-and-media/).
The NAS photograph and compression fixtures in the other image lesson remain
unchanged.

## Assessment and saved work

Quiz version 4 contains ten questions with pass score eight. Its fresh answer key
is `lesson-bitmap-image-storage-quiz-v4` in both lesson configuration and unit
progress metadata. Questions assess bitmap structure, dimensions, bit depth,
possible values, storage, vector benefits and appropriate choices. No question
requires encoding or decoding a pixel sequence.

The exam store remains `lesson-bitmap-image-storage-exam-practice`. Current
response IDs are `explanation-v4`, `allocation-v4` and `representation-v4`.
The prompts ask for a storage/depth explanation, a 12×8×2-bit calculation and a
justified photograph/logo choice with limitations. Old question responses and
all earlier quiz keys remain untouched.

The removed artwork activity's unversioned and v3 saves also remain untouched.
No current bitmap control reads, modifies or clears those old keys.

## Verification

`node --test tests/bitmap-image.test.mjs` passes four tests covering fixture
interpretation, worked storage figures, invalid sizes and scenario reasoning.
Changed JavaScript passes syntax checks, and the static generator rebuilds the
17-section page and its assets successfully.

`node tests/bitmap-image.browser.mjs` passes focused browser checks for the
removed activities, pixel selection, every gradient preset and exact shade count,
unchanged reference/positions, native Enter handling, temporary gradient reset,
final vector step, all zoom presets, visual sections, scenario feedback and
untouched old artwork. Expanded states fit 1366×768 with reduced motion enabled.

The generic `representation-lessons.browser.mjs` bitmap pass also covers all
25 slides at 1366×768 and 1366×900, 390px/320px student layouts, current quiz and
written drafts, old-save isolation, assets, anchors and no-JavaScript reading.
The root review confirmed those checks and inspected the new photo, bit-depth,
gradient, vector and context slides. Screenshots are in
`.raid-checks/representation/`.
