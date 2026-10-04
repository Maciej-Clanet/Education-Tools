# Resolution bit depth and image compression improvement plan

Proposed 3 October 2026; implemented 4 October 2026. See
[the lesson notes](image_quality_lesson.md) for the current 29-section / 35-slide
structure, component contracts, assessment and verification. The 4 October review
removed duplicate jump links, brightness inspection and the repeated small-image
calculation; it added a museum artwork source and visual compression paths.
The sequence below records the original proposal, including superseded details;
the lesson notes record current behaviour.

Rebuild `pages/topics/resolution-bit-depth-and-image-compression.html` around
controlled changes to the same image. Learners should see what changes, explain
why the data changes, and then choose settings for a purpose. This plan follows
the [shared teaching direction](text_and_image_representation_improvement_plan.md)
and the mechanism-before-comparison approach in the RAID and NAS and User
interfaces lessons. It preserves the existing URL and shared lesson shell.

## Scope and classroom pacing

The C3 specification requires the effects of resolution, sample/bit depth and
compression on image representation and storage. The preceding
[bitmap and vector lesson](bitmap_image_storage_improvement_plan.md) should establish
pixels, colour codes, rows, dimensions and the distinction between pixels and
drawing instructions. This lesson owns the systematic depth and size calculations
and compression teaching. Retrieve those foundations briefly; do not repeat the
bitmap builder or reteach vector graphics.

Planning assumption: a classroom period lasts 60 minutes. This content warrants
two periods within the existing page. Period 1 teaches resolution, depth and raw
storage; Period 2 teaches compression and choices, with retrieval and assessment.
Do not squeeze both into a dense 60-minute slideshow. Exact print-density
calculations, run-length byte accounting and additional written practice are
optional extensions. Lossy/lossless meaning and visible effects remain core.

Use an opener with three goals: explain detail and colour precision, calculate
raw pixel storage, and justify compression choices. Add teacher-only dividers
before resolution, depth, storage, compression and application, with a clear
Part 2 restart point. Keep first-teaching slides free of teacher prompts.

## Current weaknesses

The current ten sections contain five recall questions and two written tasks.
Useful navigation, glossary, saved answers and the greyscale experiment can remain,
but their teaching treatment needs rebuilding:

- Resolution uses unrelated CSS colour patterns on 4 by 4 and 8 by 8 grids.
  They do not show the same subject sampled at different dimensions.
- The introduction presents three definitions before establishing a problem.
  Pixel dimensions, display enlargement and print density are not separated.
- Bit depth is called bits per pixel, then described as values for a channel or
  palette without explaining those different models.
- The gradient has only 32 samples and the palette silently stops at 16 swatches.
  The tool therefore cannot visibly demonstrate all 256 levels at 8 bits.
  Its abstract 16 by 10 preview also obscures the practical effect on an image.
- Raw storage is one formula and one example; there is no guided bits-to-bytes
  working or prediction about changing two dimensions.
- Compression has two text cards, with no encode/decode mechanism or real image
  comparison. The quiz distractors include unrelated keyboards and speakers.
- The three previews are empty without JavaScript, despite the readable-notes
  fallback. Saved tool state has no reset to establish a classroom starting point.

## Proposed teaching sequence

Each numbered item is one teaching idea, normally one short section or slide.
The estimated pacing includes demonstrations and student responses rather than
allocating a fixed minute to every slide.

### Period 1 representation and storage

Allow approximately 5 minutes for retrieval, 15 for resolution, 15 for depth,
20 for storage and practice, and 5 for an exit check.

1. **One photograph for two jobs.** Show the same photograph in a small web card
   and a large poster. Establish the need to preserve useful detail while handling
   storage limits; defer the settings and conclusions.
2. **Read the image data we already know.** Retrieve rows, columns and a pixel
   value using the preceding lesson's 8 by 4 image. Check: 32 pixels, not 12.
3. **Dimensions tell us the sample count.** Show the same simple subject at
   8 by 8, 16 by 16 and 32 by 32, displayed at the same size. Annotate a thin
   feature that becomes distinguishable with more samples.
4. **Enlarging a view does not add stored detail.** Enlarge the 8 by 8 version
   while its dimensions counter remains unchanged. Distinguish zoom from changing
   pixel data; describe resampling as making a new grid from existing samples.
5. **Doubling both dimensions gives four times the pixels.** Build four empty
   8 by 8 counting blocks into a 16 by 16 grid: 64 becomes 256, before introducing
   large numbers. Then reveal the same subject sampled once across the whole
   grid from the reference. The blocks explain pixel count; they must not repeat
   the picture four times or suggest that upscaling restores original detail.
6. **Print size and pixel density are linked.** Keep 1200 by 800 pixels fixed
   while spreading them across smaller/larger print outlines. Introduce PPI;
   keep arithmetic in an optional disclosure. Changing density metadata alone
   adds no samples. [Adobe's image-size explanation](https://helpx.adobe.com/photoshop/desktop/crop-resize-transform/resize-adjust-resolution/image-size-resolution-and-resampling.html)
   supports this distinction; do not repeat its generic screen-PPI advice.
7. **A pixel needs a choice of values.** Build 1-bit codes `0, 1`, then 2-bit
   codes `00, 01, 10, 11` beside two and four labelled grey swatches. Predict the
   next doubling before revealing eight values with three bits.
8. **More available values can preserve smoother tones.** Keep dimensions fixed
   and compare 1, 2, 4 and 8-bit greyscale versions of one gradient and image.
   Define banding at an annotated transition; identify what stayed constant.
9. **Three channels describe an RGB pixel.** Unpack one colour into red, green
   and blue values. Eight bits per channel gives 24 bits per pixel and
   `256 × 256 × 256 = 16,777,216` combinations, excluding transparency.
10. **Always label what the depth measures.** Compare 8-bit greyscale, 8-bit
    indexed colour and RGB with 8 bits per channel. The first has up to 256
    shades, the second up to 256 palette entries, and the third uses 24 bits per
    pixel. Present indexed colour as retrieval, with palette storage separate.
    Format terminology varies: [W3C PNG](https://www.w3.org/TR/png-3/)
    explicitly distinguishes sample depth from total bits per pixel.
11. **Count one pixel then the whole image.** Retrieve the 8 by 4,
    2-bit example: `32 pixels × 2 = 64 bits`, then `64 ÷ 8 = 8 bytes`.
    State that this is ideally packed pixel data, excluding palette and headers.
12. **Scale the same reasoning to a photograph.** For 1200 by 800, 24-bit RGB:
    `960,000 pixels → 23,040,000 bits → 2,880,000 bytes → 2.88 MB`.
    Declare decimal MB; do not silently mix MB and MiB.
13. **Predict before changing a setting.** Halving both dimensions to 600 by
    400 gives 720,000 bytes at 24 bits per pixel, one quarter. Separately,
    reducing 8-bit greyscale to 4-bit at fixed dimensions halves raw storage.
    Do not imply that changing pixel colours alone changes raw payload size.
14. **Raw pixel data is not the complete file.** A labelled file diagram shows
    metadata, any palette, and encoded image data. The formula is a model of
    uncompressed pixel payload; it does not predict a JPEG or PNG file's bytes.
    Exit check: calculate 100 by 80 at 8 bits per pixel and explain the limit of
    the answer: 64,000 bits, 8,000 bytes, before extra file information.

### Period 2 compression and application

Allow 5 minutes for retrieval, 20 for compression mechanisms and comparisons,
15 for scenarios, 10 for the quiz, and 10 for one written response. Longer
responses continue independently or in a later practice period.

15. **Store the same data more efficiently.** Retrieve raw size, then reveal a
    before/encoded/decoded path. The question is whether decoding recreates the
    exact starting pixel values, not whether the picture looks similar.
16. **Lossless can describe repetition.** Step from a row of repeated greyscale
    values to count/value pairs and back. Reconstructed values match exactly.
    This is a teaching run-length example, not the algorithm inside PNG.
17. **Lossy reconstruction is an approximation.** Compare a real source image
    with pre-encoded JPEG variants at unchanged dimensions. Identify changed
    edges/texture and inspect a matching crop. Do not demonstrate JPEG merely
    by lowering bit depth or removing rows of pixels.
18. **Compression results depend on the content.** Compare a photograph and a
    diagram containing sharp text. PNG provides lossless raster compression;
    the familiar DCT-based JPEG mode is lossy, although the wider JPEG standard
    includes other modes. [W3C PNG](https://www.w3.org/TR/png-3/),
    [JPEG committee overview](https://jpeg.org/jpeg/).
19. **Three different routes to less data.** A three-lane before/after diagram
    contrasts downsampling, reducing colour precision and compression. Lossy
    compression can alter values while keeping dimensions unchanged; lossless
    encoding preserves the values supplied to it. Saving a previously damaged
    image losslessly does not restore earlier discarded information.
20. **Work through a constrained choice.** A museum needs an exact digital
    preservation copy and a small preview. Keep the original pixel values in
    the preservation version; derive a smaller web version and inspect its
    detail. State the two purposes before recommending settings.
21. **Choose and explain.** Fresh paired scenarios cover a screenshot with
    small text, a photographic gallery with a transfer budget, and a monochrome
    device icon. Require a relevant reason; accept justified alternatives when
    the requirements permit them.
22. **Repair a misconception.** Use pairs such as “300 PPI creates more
    pixels” and “every 8-bit image has only 256 possible colours”. Learners
    identify the missing condition, then reveal the corrected explanation.
23. **Quick quiz then written practice.** Keep the quiz before longer tasks.
    Present each written task separately in Teacher Slides, with saved response
    areas and concealed answer guidance.

## Visual and interaction contracts

### Resolution and depth comparisons

Reuse one authored scene and one credited local photograph. Controls are preset
buttons, not an unrestricted editor. The resolution view starts at 16 by 16,
supports 8/16/32 square samples, and fixes display size and colour precision.
Grid labels and an enlarged selected crop identify lost details. Zoom changes
display scale only; reset restores the starting view. Derive every sample from
the same reference with one documented method.

The separate greyscale view starts at 2 bits per pixel; controls select
1/2/4/8. Fix its raster dimensions. Show a 256-position gradient, shade count,
selected value and binary code. At 8 bits, label any abbreviated palette
“16 sample swatches of 256”; never imply all values are displayed. Quantise from
the original each time so increasing depth does not appear to recover data
from a previously saved reduced-depth image. State that this is a fresh
comparison with the reference. Keep controls temporary and provide Reset.

Both views need static side-by-side examples and explanatory captions without
JavaScript. Do not rely on colour alone for codes or highlight states.

### Storage walkthrough

Reuse `lesson-walkthrough.js` for count pixels, multiply by bits per pixel,
divide by eight, then convert units. Start with 8 by 4 at 2 bits per pixel;
offer the photograph example and one independent task. Previous/Next/Restart
reveal working while retaining units. Avoid a separate general calculator.
Without JavaScript, show all worked stages in order.

### Compression comparisons

Use two compact views. The lossless walkthrough defaults to sixteen 8-bit
greyscale pixels: eight zeros followed by eight values of 255. Stages highlight
runs, encode pairs and decode. Optional accounting defines one byte for count
and one for value: 16 raw bytes become four pair bytes, excluding headers.
An alternating row needs 32 pair bytes, showing that this method can expand
data. Use native controls and static original/pairs/reconstructed diagrams.

The image comparator selects Photograph/Diagram and source PNG or three JPEG
presets, initially Photograph with a medium-compression variant. Use local
assets pre-encoded from the same 960 by 640 RGB reference; keep dimensions and
encoder settings other than compression preset fixed. Show both full image and
matching magnified crop, measured file bytes, dimensions, and source labels.
Record encoder/settings, source rights and actual bytes in an asset manifest;
choose variants after checking visible differences. No invented file-size
estimates, universal quality percentages, uploads or browser-dependent exports.
Static source/strong-compression comparisons and a size table supply the fallback.

## Assessment and continuity

Propose quiz version 3, 12 questions, pass score 9, replacing current version 2,
five questions, pass score 4. Cover pixel counts; fourfold scaling; zoom versus
resampling; density; powers of two; channel versus pixel depth; two payload
calculations; exact recovery; unchanged dimensions under lossy compression;
file-size limits; and one justified scenario. Distractors should represent
plausible misconceptions. Include immediate explanatory feedback.

Propose five written tasks: explain depth reduction; show a size calculation;
explain dimension scaling; compare source/reconstructed data; evaluate two
versions for different purposes. Reuse the existing depth-reduction prompt and
its `question-1` draft ID if unchanged. Give replacement/new prompts fresh IDs
so old answers never appear under different questions. Use the shared evaluation
scaffold for the final task. Mark counts are teaching estimates, not official
Pearson mark schemes.

Implementation must change both quiz metadata locations and use the fresh answer
key `lesson-resolution-bit-depth-and-image-compression-quiz-v3`. Versioning the
aggregate summary alone does not isolate old raw answers. Set that `storageKey`
explicitly in `unit-progress-data.js` too, preventing its fallback from reading
the legacy key when a current summary is absent. Leave old storage
untouched. Keep existing anchors as sections or aliases, glossary and contextual
navigation. Update the Unit 2 tracker only after implementation and validation.

## Implementation and verification

Edit the existing HTML, page script and page stylesheet; place scenario/asset
data in `javascript/data/`. Reuse shared walkthroughs and paired scenarios.
Extract a small image renderer only if both C3 pages need the same behaviour;
do not build an image-editing framework. Keep formula assumptions visible and
full references in student revision disclosures.

Verify arithmetic and quantisation boundaries, exact lossless reconstruction,
asset dimensions/byte counts and quiz metadata. Review keyboard/touch controls,
reset, every comparison state, no-JavaScript content, draft/quiz persistence and
old links. Check normal and Teacher Slides at 1366 by 768 and 1366 by 900,
plus 390/320-pixel mobile widths. Essential labels and image detail must remain
legible from the classroom. Any teaching playback must follow
`docs/teaching_motion.md`; manual stages are sufficient for this plan.
