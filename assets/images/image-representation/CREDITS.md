# Image representation teaching assets

## Photograph

The photograph is **Synology nas 413j back open.jpg** by
[Korrupt](https://commons.wikimedia.org/wiki/User:Korrupt), 24 January 2024,
licensed [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
[Source file and licence](https://commons.wikimedia.org/wiki/File:Synology_nas_413j_back_open.jpg)
verified 4 October 2026. The original local file is
`../storage/nas-open-photo.jpg`, previously downloaded for the RAID/NAS lesson.

`photo-source.png` is a resized, centred 960×640 crop, decoded from that JPEG and
stored as 8-bit-per-channel RGB PNG. It is a lossless reference for these teaching
comparisons, not original camera data. `photo-jpeg-high.jpg`,
`photo-jpeg-medium.jpg` and `photo-jpeg-low.jpg` are recompressed derivatives of
the reference. Retain the attribution, licence link and indication of edits when
using these images. Greyscale teaching derivatives also retain this attribution.

`quality-grey-1.png`, `quality-grey-2.png`, `quality-grey-4.png` and
`quality-grey-8.png` convert the reference to greyscale, then quantise brightness
to 2, 4, 16 and 256 evenly spaced values respectively without dithering. Their
dimensions remain 960×640. See [the generation notes](QUALITY-ASSETS.md) and
`build-image-quality-lesson.mjs` for the reproducible procedure.

## Diagram

`diagram.svg` is an original project illustration authored for this lesson on
4 October 2026. It depicts an illustrative museum visitor map, not a real venue.
`diagram-source.png` rasterises it at 960×640 with a white background.
The three `diagram-jpeg-*.jpg` files encode those same reference pixels.

`bitmap-badge-vector.svg` and `bitmap-badge-raster.png` are original project
geometry from `build-bitmap-lesson.mjs`. Both contain the same three shapes;
the raster samples their colours at the centres of a 24×24 grid.

## Reproduction and measurements

Run `node assets/images/image-representation/build-assets.mjs` with ImageMagick 7
on PATH to reproduce the source PNGs, JPEGs, manifest and browser data module.
The manifest records the actual encoder version, source hash, edits, fixed
settings and measured bytes. All JPEGs use 4:4:4 chroma sampling; only the encoder
quality setting varies (90, 45, 8). These settings are not percentages of original
quality. All comparisons retain 960×640 pixels. A source PNG can be smaller than
a JPEG for the flat-colour diagram; the UI must show the measured result.
