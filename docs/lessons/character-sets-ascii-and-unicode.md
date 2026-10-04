# Character sets, ASCII and Unicode

Lesson: [student page](../../pages/topics/character-sets-ascii-and-unicode.html). Unit 2 C2: character codes, ASCII/Unicode features, uses and implications.
Prerequisites: Bits/bytes and simple binary; hex references are supplied.
Authoring: the linked HTML and its page script.
Depth: [definitions](../lesson_authoring.md#coverage-outline-format). Section IDs below refer to the lesson page.

## Coverage in order

1. **Covered** — Text as codes, agreed mappings, transmission and decoding. (`overview`)
2. **Covered** — Character identity versus font appearance; digits can be text. (`appearance`)
3. **Covered** — ASCII's seven-bit capacity, table lookup, case/symbol distinctions, controls and byte storage. (`ascii`)
4. **Covered** — Limited character coverage and international-text needs. (`ascii-limits`)
5. **Covered** — Unicode code points and broader repertoire. (`unicode`)
6. **Introduced** — UTF-8 as an encoding of code points into variable-length bytes; no manual byte construction or counting assessment. (`utf8`)
7. **Covered** — ASCII compatibility and why consistent encoding/decoding matters. (`ascii-compatible`)
8. **Covered** — Wrong-decoder example, garbled text and practical consequences. (`decoding`)
9. **Developed** — Code-point/byte exploration; combining marks and multi-code-point emoji are revision qualifications. (`inspector`)
10. **Practice** — Misconceptions, quick quiz and written agreement/international-text/decoding scenarios. (`mistakes`)

## Boundaries

The illustrative hello key is not ASCII/Unicode. Code points need not equal visible characters; Unicode is not simply a fixed 16-bit code. Do not reintroduce invented-code calculations, byte-count tasks or the removed dropdown scenario.

## References

- [Pearson Unit 2 specification](https://qualifications.pearson.com/content/dam/pdf/BTEC-Nationals/computing/2016/specification-and-sample-assessments/btec-nat-l3-ext-dip-in-computing-spec.pdf#page=44)
- [Unicode characters and combining marks FAQ](https://www.unicode.org/faq/char_combmark.html)
- [RFC 3629](https://www.rfc-editor.org/rfc/rfc3629.txt)
