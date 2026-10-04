# Character sets ASCII and Unicode teaching improvement plan

Proposed 3 October 2026; implemented 4 October 2026. The resulting lesson and
verification are documented in [the implementation notes](character_sets_lesson.md).
The original planning specification follows. Rebuild the existing
`pages/topics/character-sets-ascii-and-unicode.html` for first teaching, preserving
its URL and student revision value. Follow the
[shared sequence and implementation requirements](text_and_image_representation_improvement_plan.md).

## Teaching purpose and scope

Start with **How does another computer know which text our bits mean?** By the end,
learners should explain agreed character codes, use a small ASCII reference, and
explain why international text needs broader coverage and a consistent encoding.
Use UTF-8 to make storage and compatibility visible, without teaching the algorithm
for constructing UTF-8 byte sequences.

Assume prior knowledge of bits/bytes and simple binary from C1; provide a reference
for hexadecimal. Plan a 60-minute core: shared codes 10 minutes, ASCII 12, Unicode
and bytes 13, compatibility/application 12, quiz/exit explanation 8, with 5 minutes
for transitions. Extended written practice and the optional combining-mark example
can follow in independent work. Adjust pacing after a classroom walkthrough.

## Current page audit

The page has ten student sections, a five-question quiz and two written prompts.
Keep its useful ASCII examples, editable inspector and shared local persistence.
The problems are sequence and evidence:

- The opening already names the character/code/binary/display pipeline and its
  answers. Learners never build a mapping or experience why agreement matters.
- The next section introduces printable characters, controls, code points and
  encoding together. ASCII and Unicode each get one dense explanatory section.
- The inspector reveals six columns at once, including hexadecimal UTF-8 bytes,
  before a worked encoding/decoding example has explained them.
- The ASCII activity is a random yes/no classification with generic feedback;
  it does not identify the character causing a mismatch or show the mechanism.
- Compatibility is one table row containing `café` and `cafÃ©`. There is no visible
  byte sequence or named decoder explaining what changed.
- `Array.from(text).length` is labelled “Characters”, although it counts code
  points, which may differ from perceived characters. “Unicode is needed” also
  implies Unicode is the only possible representation outside ASCII.
- There are no teacher opener/dividers or substantial static inspector examples.
  The quiz uses implausible distractors and tests little beyond recall.

## Ordered teaching sequence

Use approximately 20 content sections plus a shared opener and four short
dividers. Written questions can split into individual slides. Final slide count
depends on readable layout, not this estimate.

| Order | Section and teaching move | Visual or action | Check before moving on |
| --- | --- | --- | --- |
| Opener | Sending text between computers | Two message windows and three goals | Establish the question without showing the complete answer |
| 1 | A message must become data | `AB A` enters a sender; the receiver needs instructions for interpreting bits | What agreement would let the receiver recover the text? |
| 2 | Make a tiny codebook | Four entries: space `00`, A `01`, B `10`, C `11` | Encode one symbol using the supplied key |
| 3 | Encode then decode | Follow `AB A` → `01 10 00 01` → `AB A`, one token at a time | Decode the last two tokens before reveal |
| 4 | Same bits with a different mapping | Receiver swaps A and B while transmitted bits remain fixed; output becomes `BA B` | Explain the failure without claiming the bits were damaged |
| 5 | Character meaning and appearance | One stored A shown in two fonts; separately show digit `0` versus numeric zero | Does changing the font change the stored character code? |
| Divider | A shared standard | ASCII supplies a widely agreed mapping | — |
| 6 | Seven bits give 128 codes | Small doubling tree 1 bit → 2 choices, 2 → 4, then 7 → 128 | Distinguish 128 possibilities from the largest value, 127 |
| 7 | Read a small ASCII table | Compare A=65, a=97, digit 0=48, space=32 with labelled seven-bit values | Explain why uppercase and lowercase need different codes |
| 8 | Some codes do not draw a symbol | `Hi` + LF + `A`; show the LF token and two-line result | Count LF as data although it is not a printed letter |
| 9 | Store a short ASCII message | `Hi!` → 72, 105, 33; put each seven-bit value in a labelled eight-bit byte | Retrieve 8 bits per byte; distinguish ASCII code width from this byte storage |
| 10 | A name does not fit | `Jose` and `José` in a membership system, then £ and a Greek letter | Identify the unsupported code, rather than rejecting all the text |
| Divider | More writing systems | The mapping needs broader coverage | — |
| 11 | Unicode assigns code points | A, é, 漢 and 😀 on a labelled code-point strip; introduce `U+` hexadecimal notation | Recognise that these numbers identify characters, not font shapes |
| 12 | An encoding turns code points into bytes | Follow é → U+00E9 → UTF-8 → C3 A9; reveal each stage | Is a code point label itself the stored UTF-8 byte sequence? |
| 13 | Byte count can vary | Same four examples shown in one, two, three and four byte boxes | Predict whether four code points must occupy four bytes |
| 14 | ASCII text still fits UTF-8 | Reuse `Hi!`; its byte boxes remain 48 69 21 in hexadecimal | Correct the claim that switching to UTF-8 doubles all text |
| Divider | Decode consistently | Stored bytes need the right interpretation | — |
| 15 | The right bytes with the wrong decoder | `café` encoded once, decoded as UTF-8 or Windows-1252 | Identify the only setting that changed |
| 16 | Choose a consistent system | Worked international club register: names, a symbol and a plain English entry | Explain coverage and agreement, not merely “Unicode is bigger” |
| 17 | Investigate fresh messages | Guided inspector tasks, followed by optional editable text | Predict coverage/count, inspect, then explain evidence |
| Divider | Apply what you know | New examples test the mechanism | — |
| 18 | Repair common mistakes | Three short claims: font=encoding, Unicode=16 bits, every symbol=one byte | Reveal a counterexample from the lesson for each |
| 19 | Quick quiz | Ten applied questions with useful feedback | Check independent understanding |
| 20 | Written practice | Four prompts with response areas and hidden guidance | Explain a process and justify a choice |

The tiny codebook is explicitly an invented teaching model, not ASCII or a cipher.
Do not put ASCII codes beside it until its agreement principle is established.
The bridge into C3 is one sentence: pictures also need rules for interpreting
stored values, but those values will represent pixels rather than text.

## Worked fixtures and technical boundaries

Standard ASCII has 128 positions numbered 0–127. Its seven-bit codes can be placed
in eight-bit bytes with a leading zero; that distinction should stay visible in
the storage example. A is `1000001` as a seven-bit value and `01000001` in such a
byte. “ASCII always occupies exactly seven stored bits per character” is too broad.
[RFC 20](https://www.rfc-editor.org/info/rfc20/) supplies the table and byte convention.

Use these exact UTF-8 fixtures; byte values below are hexadecimal:

| Text | Code point | UTF-8 bytes | Byte count |
| --- | --- | --- | --- |
| A | U+0041 | 41 | 1 |
| é | U+00E9 | C3 A9 | 2 |
| 漢 | U+6F22 | E6 BC A2 | 3 |
| 😀 | U+1F600 | F0 9F 98 80 | 4 |

Thus `Aé漢😀` contains four code points and ten UTF-8 bytes, while `Hi!` contains
three code points and three bytes (`48 69 21`). `café` has four code points and
five bytes (`63 61 66 C3 A9`). Do not add a BOM or newline to these fixtures.
These are byte-encoding examples, not values for students to memorise. UTF-8 uses
one to four bytes for a Unicode scalar value and preserves ASCII-range values.
[RFC 3629](https://www.rfc-editor.org/rfc/rfc3629.txt)

Unicode is not a fixed 16-bit storage scheme, and its code points are distinct
from an encoding's byte representation. Keep UTF-16/32 and historical “extended
ASCII” variants in a short revision disclosure; do not imply one universal
extended-ASCII mapping. [Unicode encoding FAQ](https://www.unicode.org/faq/utf_bom.html)

For the mismatch, hold `63 61 66 C3 A9` constant. UTF-8 yields `café`;
Windows-1252 yields `cafÃ©`. Name the decoder; do not describe the wrong result as
“ASCII”. The relevant single-byte mappings are in the
[WHATWG Windows-1252 index](https://encoding.spec.whatwg.org/index-windows-1252.txt).
This is an interpretation failure, distinct from a font lacking a glyph.

In optional revision, compare precomposed é with `e` plus U+0301. They can look
alike while containing different code-point sequences. The main inspector must
therefore say “Code points” and “UTF-8 bytes”; it need not become a grapheme-count
tool. [Unicode characters and combining marks FAQ](https://www.unicode.org/faq/char_combmark.html)

## Tools and visuals to build

### Shared-code walkthrough

Use `lesson-walkthrough.js` with authored stages for the codebook, encoding,
transmission and decoding. Default is `AB A` with matching sender/receiver keys;
the later mismatch stage switches the receiver's A/B mapping. Previous, Next and
Restart expose the linked character, code and output. All stages remain readable
without JavaScript. Labels and token outlines carry meaning alongside colour.
Manual steps are enough; no decorative travelling bits are needed.

### Progressive character inspector

Refactor the existing inspector into configured instances sharing one calculation
helper. Fixed teaching instances progressively show only the columns already
taught. The final practice instance remains editable, initially `Hi!`, with
presets `café`, `Aé漢😀` and a line-break sample. Keep the input bounded (up to 40
code points without cutting surrogate pairs), show its limit and handle empty
input with “Enter text” rather than a vacuous success result.

Outputs are the selected code point, named whitespace/control characters, ASCII
coverage and exact UTF-8 byte boxes/count. If showing a binary column, label it
“ASCII code, 7 bits” and keep it separate from encoded eight-bit bytes. Use a
semantic table in revision and a selected-character card on narrow screens/slides;
do not require a six-column horizontal scroll during first teaching.

Replace “Unicode is needed” with “Outside standard ASCII; UTF-8 can represent this
text”. On a practice check, highlight and name the unsupported code points and
explain the result. Use a fixed progression of fresh tasks before optional free
exploration; avoid random repeats during teaching.

Reset restores the authored example. Teaching instances are temporary and do not
load the existing saved practice text. Retain the old saved inspector data for
independent exploration where compatible, or leave its key untouched if a new
schema is required. Render user input with `textContent`. Without TextEncoder or
JavaScript, show the supplied worked table and guidance rather than empty output.

### Encoding mismatch view

One fixed sender uses UTF-8. A receiver selector offers UTF-8 and Windows-1252,
with UTF-8 initially selected; `café` and the byte strip never change. Outputs
show the decoded text and selected interpretation. Reset returns to UTF-8.
Use native TextDecoder when available, with authored results for these fixtures
as fallback. No network requests or arbitrary file inputs are needed. A static
side-by-side version supplies the no-JS explanation.

## Assessment and feedback

Propose ten quiz questions, pass eight, version three. Cover agreement/decoding
(two), ASCII range/control/case (three), code points/UTF-8 counts (three), and
compatibility/international suitability (two). Give a small code or byte table
where needed. Distractors should expose misconceptions such as counting bytes
as letters or confusing a font with an encoding.

Four written tasks should follow the quiz:

1. Encode and decode a supplied short message using a reference. Guidance traces
   each lookup and explains why both systems need the mapping.
2. Explain why an ASCII-only club register cannot faithfully store supplied names
   such as José and 李. Guidance connects missing codes to users' data and recommends
   supported Unicode encoding throughout the route.
3. Use a supplied byte table to calculate the UTF-8 size of `Aé漢😀`. Guidance gives
   1 + 2 + 3 + 4 = 10 bytes = 80 bits, explicitly excluding other file data.
4. Diagnose the supplied `café`/`cafÃ©` example. Guidance names differing decoding,
   the unchanged bytes and consistent UTF-8 handling as the remedy for this case.

These are authored practice questions, not official Pearson questions or a fixed
marking formula. Pair a short claim with evidence and consequence; a full extended
evaluation framework is unnecessary for a small decoding explanation.

## Implementation and verification

Retain existing section anchors or aliases, context links, glossary and lesson
identity. Update visible/meta descriptions from revision-only framing to learning
language. Use the existing page HTML/JS/CSS, shared walkthrough, and a small data
file for fixtures; extract encoding helpers only where multiple instances use them.

Change the page quiz storage key to
`lesson-character-sets-ascii-and-unicode-quiz-v3`. Set the matching
`quiz.storageKey`, version three, ten questions and pass eight in
`unit-progress-data.js`. Preserve old keys and give changed exam prompts fresh
response IDs. Update the tracker only when implementation is complete.

Verify encode/decode fixtures, ASCII boundaries 127/128, whitespace, empty input,
non-BMP emoji and combining marks. Check that changing a font leaves codes alone
and changing the decoder leaves bytes alone. Review each progressive state,
keyboard/focus and touch operation, fallback examples, independent instance
resets, and quiz/draft persistence using the shared acceptance checklist. Actual
classroom and browser layout verification belongs to the eventual build.
