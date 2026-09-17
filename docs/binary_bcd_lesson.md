# Binary and BCD teaching refinement

The existing `pages/topics/binary-and-bcd.html` now teaches the interpretation
of bits before bases and conversion. It has 18 student sections and 29 Teacher
Slides. It retains the lesson shell, original denary conversion simulator,
16-task Workshop, scratch table, glossary, navigation and local persistence.

## Teaching sequence

| Slide | Teaching focus |
| --- | --- |
| 1 | Shared teacher-only opener: Binary and BCD, framing question and four goals |
| 2 | Divider: How binary represents data |
| 3 | What does 01000001 mean? Number 65, ASCII A, shallow greyscale example |
| 4 | Reliable two-state electronics |
| 5 | Denary versus binary bases |
| 6 | Divider: Converting binary |
| 7 | Interactive place values and binary → denary |
| 8 | Preserved denary → binary step-through tool |
| 9 | Same table, opposite directions |
| 10 | Preserved 16-task Conversion Workshop |
| 11 | Divider: Binary Coded Decimal |
| 12 | Separate decimal display digits: encode 27 as 0010 0111 |
| 13 | Valid codes 0–9 and the six invalid single-digit codes |
| 14 | Pure binary 27 versus BCD 27 |
| 15 | Decimal display use: separate codes for 4 and 2 |
| 16 | Storage trade-off: 255 is 8 bits in pure binary, 12 in BCD |
| 17 | Guided BCD decoder: 2849, with 27 as a second worked example |
| 18 | Exam trap: read the BCD representation rule, then decode groups |
| 19 | Divider: Practice |
| 20–22 | Six misconceptions, two progressive corrections per slide |
| 23 | Visual revision summary |
| 24 | Quick quiz |
| 25–29 | Five written questions, each with a response and answer guide |

The combined conversion-method cards were replaced with a focused interactive
binary-to-denary slide, the original simulator on its own slide, and a brief
comparison. The previous single dense BCD section now separates motivation,
mapping, representation, application, storage, decoding and exam interpretation.
Encoding 27 is part of the motivation slide rather than a repeated standalone
slide. The hexadecimal base card, overview hook, forward note and quiz question
were removed; contextual next-lesson navigation still leads to hexadecimal.

## Interactions and reuse

- `javascript/core/binary-representation.js` contains small pure models for
  eight-bit selected values and grouped BCD decoding. It is not a general
  number-conversion framework.
- The main table starts/reset to `10101101 = 173`. Native buttons toggle each
  column; the selected-value sum, total and full eight-bit pattern update
  together. Pressed state, borders and included/off labels accompany colour.
  A polite atomic status region reports the result. The redundant Use? row
  was removed; powers remain secondary beneath place values.
- Main-table and decoder state are temporary and reset on reload. They retain
  state when moving between Teacher Slides. No new animation was added.
- The original denary simulator's step construction, controls and persistence
  remain intact. Its place-value constant now comes from the small shared model.
- The BCD decoder offers two fixed examples. Next groups the string, reveals
  each decimal digit, then joins the digits in order. Previous and Reset use
  the existing bounded `nextKernelState` utility. Changing the example resets
  the reveal. Arbitrary user input is intentionally omitted; the model still
  rejects incomplete groups and codes above 1001.
- The scratch table retains typing, arrow-key navigation, automatic focus,
  Clear and local saves. It has no automatic total. The same DOM instance moves
  into a collapsible Workshop dock for Teacher Slides and returns to its sidebar
  on exit. Narrow screens can scroll the table locally.
- The Workshop retains all 16 tasks, checking rules, progress and saved-state
  keys. Its completion panel now respects its hidden state.
- Native details provide progressive reveals. Shared teacher opener/divider
  templates, slide-break markers, quiz scoring, written-response storage,
  reading/accessibility settings and slide navigation are reused unchanged.

## Assessment and saved work

The original quiz questions on hardware, bases, place values and BCD remain.
The hexadecimal question now tests representation rules; seven additional
questions cover both conversion directions, unsigned range, valid BCD digits,
encoding, decoding and pure binary versus BCD.

Quiz metadata: version 3, 12 questions, pass 9, storage key
`lesson-binary-and-bcd-quiz-v3`, matching `unit-progress-data.js`. The new key
prevents former hexadecimal answers/scores restoring into the changed quiz.

The two original written questions and response keys remain. Three additional
questions cover why binary/interpretation matters, both conversion directions,
and BCD encoding/decoding. The original display-comparison question supplies
application and storage reasoning, with 255 as a concrete storage example.
Workshop, simulator, scratch and exam storage keys are unchanged.

## Scope and source

C1 includes BCD; the existing Binary arithmetic lesson covers BCD arithmetic.
The summary links there. Hexadecimal, signed numbers, arithmetic, floating
point and detailed character/image/audio encoding remain in their own lessons.
The ASCII/brightness examples here only establish interpretation.

Display use is qualified. A real component reference is Texas Instruments'
[CD4511B BCD-to-seven-segment decoder](https://www.ti.com/product/CD4511B).
This demonstrates one suitable display architecture, not a claim about all
modern displays or general-purpose numeric storage. The live lesson URL could
not be retrieved during this pass; implementation was based on repository files.

## Verification

- `node --test tests/binary-representation.test.mjs tests/teacher-dividers.test.mjs`
- JavaScript syntax checks and `git diff --check`.
- Local Chrome: default/toggle/reset, all-off/all-on, original simulator
  remainder progression and final answer, both BCD examples with previous/reset,
  both Workshop directions, quiz scoring and reload persistence for Workshop,
  quiz, scratch and written drafts.
- All 29 slides traversed at 1366×900 with teaching reveals/answer guides open.
  Teaching slides fit; the Workshop and quiz intentionally scroll.
- Responsive checks at 390, 768 and 1024px: no document overflow. Wide tables
  scroll locally; a mobile touch toggles the correct bit. Space activates bit
  buttons, simulator/decoder controls and disclosures without advancing slides.
  The scratch instance moves into the Workshop and returns on exit. Decoder
  Reset hides the previously revealed groups. Reduced-motion preference works;
  no automatic motion is introduced. No console/runtime or resource errors.
- No configured package build or lint task exists. No dependencies were added.
