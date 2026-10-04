# Resolution, bit depth and image compression

Lesson: [student page](../../pages/topics/resolution-bit-depth-and-image-compression.html). Unit 2 C3: resolution, sample/bit depth, storage and compression effects.
Prerequisites: Bitmap dimensions, pixel values and introductory bit depth.
Authoring: [Generator](../../build-image-quality-lesson.mjs); `node build-image-quality-lesson.mjs --skip-images` for HTML/SVG edits. Full generation also requires ImageMagick for PNG derivatives.
Depth: [definitions](../lesson_authoring.md#coverage-outline-format). Section IDs below refer to the lesson page.

## Coverage in order

1. **Introduced** — Artwork preview versus poster requirements; retrieve pixel-grid interpretation. (`overview`)
2. **Covered** — Sampling/detail, enlargement limits and width × height pixel-count growth. (`resolution`)
3. **Developed** — Pixels versus physical print density; exact print-density calculations are optional. (`pixel-density`)
4. **Covered** — Possible pixel values and tonal precision at fixed dimensions. (`bit-depth`)
5. **Covered** — RGB channels, per-channel versus per-pixel depth, raw storage and predicted size changes. (`rgb-channels`)
6. **Covered** — Raw payload versus complete encoded-file size. (`complete-file`)
7. **Covered** — Lossless versus lossy encoding and reconstructed data. (`compression`)
8. **Developed** — Run-length worked recovery and possible expansion; optional byte accounting, not an implementation of PNG. (`lossless-runs`)
9. **Covered** — Measured encoded-image comparisons at fixed dimensions and the effect of image content. (`lossy-comparison`)
10. **Covered** — Distinguish resolution reduction, depth reduction and compression. (`three-routes`)
11. **Covered** — Preservation copy versus delivery preview and purpose-dependent trade-offs. (`trade-offs`)
12. **Practice** — Screenshot, gallery and icon choices; misconceptions, quiz and written explanation/calculation/evaluation. (`scenario-screenshot`)

## Boundaries

Do not conflate quantised preview-file sizes with ideal packed pixel depth or label JPEG settings as quality percentages. Keep one RGB storage walkthrough rather than repeating the preceding lesson's small calculation. Two-part pacing is an estimate. [Asset recipes](../../assets/images/image-representation/QUALITY-ASSETS.md) and [credits](../../assets/images/image-representation/CREDITS.md) retain measured sources/rights.
