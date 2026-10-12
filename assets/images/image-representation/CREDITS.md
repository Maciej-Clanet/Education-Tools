# Image representation teaching assets

## Museum artwork reproduction

The image-quality lesson uses **Gustave Caillebotte, Paris Street; Rainy Day,
1877**, The Art Institute of Chicago, Charles H. and Mary F. S. Worcester
Collection, accession 1964.336. The museum's
[collection entry](https://www.artic.edu/artworks/20684/paris-street-rainy-day)
and [primary metadata](https://api.artic.edu/api/v1/artworks/20684?fields=id,title,artist_display,date_display,image_id,is_public_domain,copyright_notice,credit_line)
identify the work and its public-domain status. The museum's
[open-access image policy](https://www.artic.edu/open-access/open-access-images)
releases applicable reproductions under
[CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/). Verified 4 October 2026.

The actual 2898×2250 JPEG download, saved as `quality-artwork-original.jpg`, is
from the [Wikimedia mirror of the museum reproduction](https://commons.wikimedia.org/wiki/File:Gustave_Caillebotte_-_Paris_Street,_Rainy_Day_-_1964.336_-_Art_Institute_of_Chicago.jpg).
That file page explicitly marks the reproduction CC0 and credits the museum
collection entry as its source. The museum's image endpoint required browser
verification, so its current rendition was not downloaded; the mirror is not
claimed to be byte-identical to it. `quality-artwork.json` records the exact
download URL, SHA-256 hash, rights evidence and reproducible command.

`photo-source.png` takes the 2898×1932 region starting at `(0, 159)` and resizes
it to 960×640 using Lanczos filtering, retaining the aspect ratio. It is stored
as an sRGB, 8-bit-per-channel RGB PNG with metadata stripped. The PNG preserves
this prepared central excerpt, not the complete painting reproduction or
original camera data. No compositing or generative edits were made.
`photo-jpeg-high.jpg`, `photo-jpeg-medium.jpg` and `photo-jpeg-low.jpg` are
recompressed derivatives of those reference pixels.

Visible caption: **Gustave Caillebotte, Paris Street; Rainy Day, 1877. The Art
Institute of Chicago. CC0. Cropped/resized; greyscale or recompressed where shown.**
Link the artwork title to the museum collection entry and CC0 to its dedication.

`quality-grey-1.png`, `quality-grey-2.png`, `quality-grey-4.png` and
`quality-grey-8.png` convert the reference to greyscale, then quantise brightness
to 2, 4, 16 and 256 possible evenly spaced values respectively without dithering.
The prepared image actually uses 2, 4, 14 and 220 distinct shades: an image need
not use every value its depth permits. Dimensions remain 960×640. See
[the generation notes](QUALITY-ASSETS.md) and `build-assets.mjs` for the procedure.

## Bitmap lesson photograph

`bitmap-photo.jpg` is a separate photograph for the bitmap-storage lesson:
**Bruce McCandless II on the first untethered spacewalk**, NASA image
**S84-27017**, taken by **Robert L. "Hoot" Gibson / NASA** on **7 February 1984**.
NASA's [history of the STS-41B photographs](https://www.nasa.gov/history/photos-from-sts-41b/)
identifies Gibson as the photographer of this image. The image was downloaded
from the [official NASA image asset](https://images-assets.nasa.gov/image/s84-27017/s84-27017~large.jpg).

[NASA's images and media guidelines](https://www.nasa.gov/nasa-brand-center/images-and-media/)
permit educational and informational reuse with source acknowledgement, and
explain that NASA imagery generally is not subject to US copyright. This source
credits NASA and carries no third-party copyright notice. This classroom example
does not imply NASA endorsement. Source and usage terms checked 4 October 2026.

The downloaded JPEG is 1905×1920 pixels. The derivative takes the 1905×1270 region
starting at `(0, 0)`, resizes it to 960×640 with ImageMagick's Lanczos filter, and
encodes an sRGB JPEG at encoder setting 94 with 4:4:4 sampling and stripped
metadata. The scene has not been composited or generatively altered. The source
download is itself a photographic reproduction, not original camera data.

The lesson enlarges the **60×40** source-pixel region starting at **(636, 176)**,
across the visor and helmet edge. Its matching full-image box starts at
**66.25% left, 27.5% top** and is **6.25% wide and high**. Both views must retain
the 3:2 aspect ratio; the close-up enlarges the same decoded image pixels using
nearest-neighbour display, without generating additional source detail.

Run `node assets/images/image-representation/build-bitmap-photo.mjs` to reproduce
the bitmap lesson derivative and metadata. The script downloads and hash-checks
the source when its local cache is absent. `bitmap-photo.json` records source and
output hashes, dimensions, bytes, exact crop, encoder version/settings, rights
links and the visible attribution contract. This asset and script are independent
of the museum artwork and quality/compression fixtures above.

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
on PATH to reproduce the source PNGs, JPEGs, greyscale variants, manifest and
browser data module. The checked-in artwork JPEG is hash-checked before use.
The manifest records the actual encoder version, source hash, edits, fixed
settings and measured bytes. All JPEGs use 4:4:4 chroma sampling; only the encoder
quality setting varies (90, 45, 8). These settings are not percentages of original
quality. All comparisons retain 960×640 pixels. A source PNG can be smaller than
a JPEG for the flat-colour diagram; the UI must show the measured result.
