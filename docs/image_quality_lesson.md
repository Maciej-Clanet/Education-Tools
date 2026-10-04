# Resolution bit depth and image compression lesson

Implemented and refined 4 October 2026. The existing URL contains 29 student sections
and 35 Teacher Slides, including an opener and five dividers. The Part 2 divider
starts compression after resolution, colour precision and raw storage. The
two-period pacing in [the improvement plan](image_quality_improvement_plan.md)
remains a teaching estimate rather than a fixed timetable.

## Teaching order

Gustave Caillebotte's *Paris Street; Rainy Day* (Art Institute of Chicago, CC0)
introduces web-preview and poster needs, then supplies every photographic depth
and compression comparison. Attribution and the central crop are documented
with the assets. The separate NASA photograph belongs to the bitmap lesson.
The preceding bitmap lesson's 8 by 4 arrow retrieves dimensions before learners
change the sample count of a fixed house scene. Enlargement, fourfold pixel-count
growth and print density receive separate explanations. Colour codes precede
the greyscale tool, then RGB channel values explain why eight bits per channel
means 24 bits per pixel. One standalone RGB walkthrough models pixel, bit and
byte units; the smaller calculation repeated from the preceding lesson is removed.

Part 2 uses two illustrated paths to distinguish input, encoded file and
reconstructed values: lossless recovers every value, while lossy discards some
information. The original and both results keep the same grid dimensions. A
run-length example demonstrates exact recovery and a counterexample to guaranteed
savings. Genuine encoded photograph/diagram assets then show lossy changes at
fixed dimensions. Three routes to smaller data are compared before a museum
worked decision and three fresh paired scenarios. The quick quiz precedes five
separate written tasks, one per teacher slide.

## Authoring and files

- `build-image-quality-lesson.mjs` builds static lesson HTML and authored scene /
  gradient SVGs. It retains the shared static hero. Run
  `node build-image-quality-lesson.mjs --skip-images` for HTML/SVG-only changes.
- A full `node build-image-quality-lesson.mjs` also uses ImageMagick on PATH to
  regenerate the greyscale PNG derivatives from `photo-source.png`.
- `javascript/data/image-quality-model.js` contains pure quantisation, raw pixel
  size, run-length and procedural scene models, plus quiz/scenario fixtures.
- `javascript/core/image-quality-tools.js` enhances authored controls. The page
  script explicitly initialises the shared lesson shell, walkthroughs, paired
  scenarios and these tools.
- `javascript/data/image-compression-assets.js` supplies measured source/variant
  bytes to both the build and browser code. Shared source encoding is documented
  in `assets/images/image-representation/CREDITS.md` and its manifest.
- Styling is confined to the existing page stylesheet. No shared shell or
  shared stylesheet change is required.

## Tool behaviour

The resolution view starts at 16 by 16 and samples the same scene at pixel
centres for 8/16/32 square grids. The narrow door is deliberately missed at 8 by
8. SVG rectangles are a display of those fixed pixel samples, not an example of
vector resampling. The zoom view enlarges only the unchanged 8 by 8 samples.
Neither tool claims enlargement can recover missing source information.

Depth starts at two bits per pixel. Buttons select
1/2/4/8 bits. The photograph dimensions remain 960 by 640; the independently
authored gradient has all 256 source positions. The unexplained brightness
inspection slider is removed. Each comparison derives from the reference,
not from the previous quantised state. These preview PNGs contain quantised
grey values; their encoded file sizes are not the ideal packed bit-depth totals.

Run-length starts with eight zero values followed by eight values of 255.
Previous/Next reveal grouping, count/value pairs and exact decoding. Alternating
shades demonstrate expansion: 16 one-byte pixels become 16 two-byte pairs.
Optional byte accounting excludes headers. This teaching format is not PNG's
compression algorithm. Counts are bounded to 255 in the pure model.

The compression comparator starts with the photograph and medium-compression
JPEG. Reference PNG and JPEG presets keep 960 by 640 dimensions. Both full
views and matching crop windows update together, with measured bytes. The diagram
can be larger as a JPEG than as its PNG reference; the UI reports that result
without claiming a universal format ranking. Full-image previews are scaled to
fit; the crop displays the same source region at greater visual scale. Encoding
settings are fixture choices, not percentages of visual quality.

Every demonstration has predictable temporary state and Reset. No tool state
is persisted and no timed animation is required. Native controls stay focused
when samples or output text change. Static source examples, gradient/photo
comparisons, all walkthrough stages and the lossless reconstruction are authored
in HTML for reading without JavaScript. Paired-scenario guidance remains a native
disclosure when scoring is unavailable.

## Assessment and storage

Quiz version 3 has 12 questions, pass score 9. Its fresh answer key is
`lesson-resolution-bit-depth-and-image-compression-quiz-v3`; unit-progress metadata
must use that same explicit key, version, total and pass score. Old answer/tool
keys are not removed.

Five written tasks cover depth effects, RGB payload calculation, dimension
scaling, reconstructed values and justified archive/preview choices. The original
depth question retains `question-1` under the existing exam-practice storage key.
Four new task IDs start `quality-v3-`, so the former second response is not shown
against a different prompt. The shared exam saver merges current response fields
into the saved object, retaining unmatched earlier draft IDs without displaying
them under replacement prompts.
Marks are identified as practice estimates and guidance supports self-checking.

## Verification

`node --test tests/image-quality.test.mjs tests/lesson-walkthrough.test.mjs`
passes nine checks: all shade codes/endpoints, calculated units/scaling, lossless
round trips and expansion, one-byte run limits, scene detail, matched scenarios,
static assets/IDs/storage, and shared walkthrough navigation/instance behaviour.
Changed modules pass Node syntax checks. ImageMagick confirms all four greyscale
previews are 960 by 640. They allow 2, 4, 16 and 256 shades; the artwork actually
uses 2, 4, 14 and 220 respectively. An image need not use every available value.
The authored gradient covers all values at each depth.

Setting `$env:REP_LESSONS='resolution-bit-depth-and-image-compression'` in
PowerShell, then running `node tests/representation-lessons.browser.mjs`, passes
the full 35-slide layout review
at 1366 by 768 and 1366 by 900, student layouts at 390/320 pixels, all image loads,
no-JavaScript reading, 12/12 scoring, reload persistence and old quiz isolation.

`node tests/image-quality.browser.mjs` passes all resolution/depth presets,
fixed photo/gradient dimensions, exact displayed zoom ratios, walkthrough bounds,
both run-length presets through every step, all eight compression combinations,
resets and matched scenarios. It also checks revealed-state slide dimensions at
1366 by 768 under OS reduced motion. Screenshot review confirmed readable depth
controls, all sixteen alternating count/value pairs, and visible photo/diagram
compression differences. Browser setup uses the shared isolated localhost test
server/profile; see the shared implementation review.

## Technical references

- [W3C PNG specification](https://www.w3.org/TR/png-3/): per-sample versus
  per-pixel depth, indexed colour and lossless raster encoding.
- [Adobe image size and resampling](https://helpx.adobe.com/photoshop/desktop/crop-resize-transform/resize-adjust-resolution/image-size-resolution-and-resampling.html):
  dimensions, print density and resampling are distinct changes.
- [JPEG committee overview](https://jpeg.org/jpeg/): the familiar lossy coding
  mode is one part of a wider standard with other modes.
