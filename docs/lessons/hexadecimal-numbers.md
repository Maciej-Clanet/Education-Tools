# Hexadecimal numbers

Lesson: [student page](../../pages/topics/hexadecimal-numbers.html), supporting the Unit 2 number systems sequence.
Prerequisites: Binary place values, binary/denary conversion, bits, nibbles and bytes.
Authoring: the linked HTML, `javascript/pages/hexadecimal-numbers.js` and `css/pages/hexadecimal-numbers.css`.
Depth: [definitions](../lesson_authoring.md#coverage-outline-format). Section IDs below refer to the lesson page.

## Coverage in order

1. **Introduced** — Compare two close 32-bit binary values, then see each hex form directly below its binary form. Hex makes the difference easier to find without changing either value. (`overview`, `compare-values`)
2. **Covered** — One hex digit per four-bit group. A table lists all sixteen values, with denary, binary and hex columns and their bases. Rows can be highlighted with a pointer or keyboard. (`nibbles`)
3. **Covered** — Hex in CSS colours, memory addresses and file bytes. The shared Live Code component demonstrates text, card and button colours. A debugger diagram distinguishes an address from the byte stored there. (`uses`, `memory-addresses`, `raw-bytes`)
4. **Covered** — Base 16, digit values 0–15 and symbols 0–9/A–F. Reuse the full table to read digits; 10 hex means one sixteen and zero ones. (`base-sixteen`)
5. **Covered / Practice** — Hex to denary: find digit values, multiply by place values, then add. The source number is separate from the title. Aligned columns show the worked example 2F; a fill-in example uses 3A. (`place-value`, `hex-to-denary`)
6. **Covered / Practice** — Hex to binary: write four bits per digit in the same order. The worked example uses 2F; the fill-in example uses 5C. (`conversion-methods`, `hex-to-binary-practice`)
7. **Covered / Practice** — Binary to hex: group from the right, add zeros on the left when needed, then read each hex digit. Padding is part of the method. The worked example uses 101111; the fill-in example uses 110101. (`binary-to-hex`, `binary-to-hex-practice`)
8. **Covered / Practice** — Denary to hex through binary. A place-value row shows 47 as 0010 1111, then 2F. A fill-in example uses 58. (`denary-to-hex`, `denary-to-hex-practice`)
9. **Practice** — Saved conversion workshop with four direction tabs: binary to hex, hex to binary, hex to denary and denary to hex. Binary conversions come first. Students practise with the collapsible digit table, then hide it for further questions. A full-width, collapsible eight-bit place-value table below the workshop provides temporary working for binary/denary conversions. A concise rule check, concept quiz and written questions follow. (`practice-zone`, `mistakes`, `quiz`, `exam-practice`)

## Boundaries and persistence

Hex is shorthand for binary, not a separate physical storage format. Examples use non-negative whole numbers. Hex arithmetic, signed representations and fractions are outside this lesson. Conversion practice belongs in the worked steps, workshop and written questions; the quiz checks representation rules and uses.

The worked methods reuse 2F / 47 / 0010 1111 so that the representation changes while the value stays fixed. All essential steps are visible; answer guidance is optional. The lesson text uses short sentences, consistent terms and one instruction per step.

The existing quiz and written prompts keep their storage keys and response IDs. The workshop uses its versioned storage key so that retired answers cannot attach to new questions. Adding a direction preserves the existing tabs and their saved answers. It saves the selected direction and a separate question and answer per tab. New questions keep the selected direction. The earlier binary workshop store is left intact. New fill-in fields use new IDs in the existing exam store, whose merge behaviour preserves retired drafts. Table highlights, binary working and embedded CSS edits are temporary. Clearing binary working does not change saved answers. Retired section links resolve to the matching current section. The retired explorer store is left intact.
