# Negative and floating point representation

Lesson and authored source: [student page](../../pages/topics/negative-and-floating-point-representation.html), its page script and page stylesheet. Unit 2 C1: negative and floating point numbers.
Prerequisites: unsigned binary place values, binary/denary conversion, and binary addition with carries. Binary fractions are introduced here.

## Coverage in order

1. **Introduced** — A temperature below zero needs a signed representation. (`overview`)
2. **Introduced / Covered** — A visual map establishes two separate methods before either is taught. Sign and magnitude then uses a separate sign bit, magnitude and two zero patterns. Method numbers remain visible in teaching headings. (`negative-methods`, `negative-numbers`)
3. **Covered** — Eight-bit two's complement: −128 place value, invert-and-add-one conversion and decoding by signed place values. The worked sequence keeps −5 throughout. The first conversion needs no carry; its labelled table keeps the positive number, carry boxes, inverted number, fixed addend and result separate. (`twos-place-value`, `twos-complement`, `decode-negative`)
4. **Covered** — One range diagram combines endpoints, bit patterns and the unequal positive/negative counts. Signed addition distinguishes the extra carry outside storage from the eight stored bits. Overflow shows two positive inputs producing a negative stored result when +128 does not fit. (`range`, `signed-addition`, `signed-overflow`)
5. **Practice** — Saved negative-value conversion with place-value headings and four numbered steps. Carries are optional saved working. The add-one row is fixed and read-only. The first working place is 128; the final signed result uses −128. (`twos-practice`)
6. **Covered / Practice** — A half-degree sensor reading introduces the need for fractions and the binary point. Halving successive place values leads into conversion. The checked task generator uses non-whole eighths, with new questions and saved answers. (`binary-point`, `fractions`, `fraction-practice`)
7. **Introduced / Covered** — Measurements across very different sizes motivate a separate scale. Moving the point alone doubles a measurement; the exponent then counts repeated ×2 steps. Positive, zero and negative powers of two lead into sign, mantissa/significand and exponent. The shared mantissa point position explains why normalisation is needed. (`floating-need`, `powers-of-two`, `exponents`, `floating-point`)
8. **Covered** — Normalisation with a separate sign and a leading 1 before the point. Each point movement changes the exponent to preserve the value. A value below one distinguishes negative exponent from negative sign. (`normalisation`, `small-values`)
9. **Covered** — Encoding the parts in a defined simple 10-bit format, changing only the sign, and decoding by reversing point movements. (`float-storage`, `read-float`)
10. **Practice** — Saved mantissa/exponent and signed fractional decoding questions. (`float-practice`)
11. **Covered** — Range/precision trade-off with a fixed bit budget, exact exponent bounds and gaps at a fixed exponent; rounding to the nearest available value; overflow and underflow in the defined format. (`precision`, `rounding`, `limits`)
12. **Practice** — Representation choices, misconceptions, concept quiz and separate written applications. (`compare`, `mistakes`, `quiz`, `exam-practice`)

## Boundaries and teaching conventions

The floating point example is a teaching format, not IEEE 754: one separate sign bit, a two's complement exponent and an explicit leading mantissa bit. The point follows that first mantissa bit. The allocation tool keeps ten total bits and compares gaps from 1 to 2 at exponent zero. It does not model reserved exponent codes, zero encodings, subnormal values, biased exponents or hardware exceptions. Other layouts, including signed fractional mantissas, are identified but not taught as a second conversion method. Follow the layout stated in a question.

Normalisation and decoding reuse 13.25 / 1101.01. Essential operations have visible manual steps and optional finite playback. The page uses the shared sequence reducer. Bit inversion, carries and point movement remain available under reduced motion. Playback pauses when hidden or offscreen. Complete authored methods remain available without JavaScript and in print.

The wording follows [ASD-STE100](https://www.asd-ste100.org/STE_faq.html): short sentences, direct instructions, consistent terms and definitions for required technical names. British curriculum spellings such as “normalisation” remain consistent with the adjacent lessons.

## Saved learner work

The conversion practice keeps its task and storage key. Its migration retains the previous working table under `legacyTableValues`, including the formerly editable add-one row. Existing positive, inverted and answer rows remain active. New carry working is optional and saved. The fraction generator has its own versioned store; the former fixed fraction answer remains in the exam store as a retired draft.

Demonstrations start in predictable temporary states and do not read or delete retired demonstration stores. The quiz uses its existing versioned answer key in both the page configuration and progress registry. Unchanged written prompts keep their response IDs. The shell preserves retired drafts when saving new responses. All previous section IDs and the lesson URL remain available; `range-limits` is an alias inside the combined range section.
