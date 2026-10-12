# Bitmap and vector image storage

Lesson: [student page](../../pages/topics/bitmap-image-storage.html). Unit 2 C3: bitmap storage; vector comparison supports representation choice.
Prerequisites: Bits/bytes and small binary values.
Authoring: [Generator](../../build-bitmap-lesson.mjs); run `node build-bitmap-lesson.mjs`. Photograph derivatives use `build-bitmap-photo.mjs`.
Depth: [definitions](../lesson_authoring.md#coverage-outline-format). Section IDs below refer to the lesson page.

## Coverage in order

1. **Covered** — Bitmap pixel grid, rows/columns and stored colour values. (`overview`)
2. **Covered** — Dimensions, colour interpretation and pixel data needed to read an image. (`image-file`)
3. **Covered** — Photographic colour/tonal detail and raster suitability. (`photos`)
4. **Developed** — Bits per pixel, 2^b possible values and fixed-position tonal gradient; RGB channels and broader quality effects follow in the next C3 lesson. (`bit-depth`)
5. **Developed** — Small uncompressed pixel-payload calculation; larger RGB calculations follow later. (`file-size`)
6. **Developed** — Supporting contrast: stored shapes/geometry, construction and raster/vector enlargement. (`vector-images`)
7. **Covered** — Supporting representation choice: sharp resizing, object editing, simple-art size benefits and photographic/format limitations. (`vector-benefits`)
8. **Practice** — Museum website/route examples and fresh paired representation choices. (`use-contexts`)
9. **Practice** — Misconceptions, quiz and written explanation/choice. (`mistakes`)

## Boundaries

No row encoding/decoding, painting or reconstruction exercises. Raw pixel figures exclude headers/palettes/padding/compression. Vector geometry ultimately displays as pixels and is not universally smaller. Detailed resolution/depth/compression is in the next lesson. [Asset credits](../../assets/images/image-representation/CREDITS.md) and photo manifest preserve source/edits.

## References

- [W3C PNG scanlines](https://www.w3.org/TR/png-3/#7Scanlines)
- [W3C PNG colour types](https://www.w3.org/TR/png-3/#6Colour-types-and-values)
- [W3C SVG specification](https://www.w3.org/TR/SVG2/)
