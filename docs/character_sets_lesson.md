# Character sets, ASCII and Unicode: first teaching

Rebuilt and refined 4 October 2026 from
[the original improvement plan](character_sets_improvement_plan.md).
The initial rebuild introduced the first-teaching structure. The same-day
correction simplifies its visual sequence and removes invented-code and byte-count
assessment. The redundant dropdown scenario slide was subsequently removed because
its supplied facts stated the answers. The current lesson has **21 student sections / 26 Teacher Slides**:
one opener, four dividers and three individual written-practice slides.

The existing URL, contextual navigation and useful anchors remain. The removed
`exam-storage` anchor is retained as a hidden alias beside the final written task;
the former `practice` anchor now points to the following character inspector.

## Teaching sequence

An illustrative shared key and a sender/transmission/receiver diagram trace
`hello` into codes and back. The invented codes demonstrate agreement only;
learners are not asked to memorise or calculate with them. Fonts are explained
using different drawings of A; Room 7 shows that a digit can be part of text.

ASCII develops through capacity, a four-symbol selector, control codes and
storage in bytes. A membership name introduces the coverage problem. Unicode
code points precede a single static character-to-UTF-8 visual. Variable-length
encoding remains visible, but byte totals are not an assessed skill. The
UTF-8/Windows-1252 mismatch shows why consistent decoding matters.

The quiz and written tasks apply character coverage and agreed interpretation
to unfamiliar examples. No dropdown scenario, byte-count input or arithmetic
challenge remains.

The editable inspector retains technical byte details for exploration. It says
**code points**, not characters; revision notes explain combining marks and
multi-code-point emoji. Dense references stay out of first-teaching slides.

## Components

- `pages/topics/character-sets-ascii-and-unicode.html` is the authored static
  source; no generator is needed.
- `javascript/pages/character-sets-ascii-and-unicode.js` composes the shared
  lesson shell, transmission, inspectors and decoder.
- `javascript/core/character-transmission.js` and
  `css/character-transmission.css` provide the transmission component.
  `initCharacterTransmissions(root)` enhances `[data-character-transmission]`.
  The completed no-JS diagram shows `hello → 00 01 10 10 11 → hello`, with an
  explicitly illustrative key, not ASCII or Unicode codes.
- Enhanced transmission starts with an empty receiver. Play/Pause/Resume,
  Next character and Restart expose each transfer. Playback stops at the fifth
  character; offscreen or hidden playback pauses and requires Resume. Its state
  is temporary. Teaching movement remains available with OS reduced motion.
- `javascript/core/character-encoding.js` handles bounded code-point inspection
  and the fixed decoding comparison. The obsolete A/B/space codebook API and
  byte-count prediction helper have been removed.
- `javascript/data/character-encoding-data.js` holds UTF-8 fixtures, fixed
  decoding results. The removed scenario data and runtime are no longer shipped.
  Page-specific layouts live in `css/pages/character-sets-ascii-and-unicode.css`.

The ASCII inspector starts with `Aa0 ` and exposes denary values and seven-bit
codes. The UTF-8 inspector starts with `Hi!`, supports presets and accepts up to
40 code points. Truncation preserves surrogate pairs; isolated surrogates follow
TextEncoder's replacement behaviour. User input is rendered with `textContent`.
Selecting a token preserves button focus. If TextEncoder is unavailable, authored
inspector examples remain visible.

The decoder accepts only the fixed `63 61 66 C3 A9` example and the named UTF-8
or Windows-1252 interpretation, with authored results if TextDecoder is missing.
All diagrams and inspector examples have readable static fallbacks.

## Assessment and saved work

Quiz **version 4: eight questions, pass score six** uses
`lesson-character-sets-ascii-and-unicode-quiz-v4` in both the page config and
Unit 2 metadata. Questions test agreed interpretation, ASCII capacity/case/control
codes, code point versus encoding, ASCII compatibility and international text.
Neither the invented key nor byte-count arithmetic is assessed. Earlier quiz
keys remain untouched.

The exam storage key stays
`lesson-character-sets-ascii-and-unicode-exam-practice`. Current response IDs:

- `character-code-agreement-v4`: explains character codes and agreed
  interpretation using the self-contained STOP/display scenario.
- `exam-international-v3`: retains the unchanged membership-name prompt.
- `exam-decoding-v3`: retains the unchanged decoder-mismatch prompt.

The former byte-count question is removed. Shared draft saving preserves retired
IDs, including `exam-practice-v3` and `exam-storage-v3`, without restoring their
answers beneath new prompts.

Selections and animation are temporary. Editable exploration
retains the `{text}` schema at `lesson-character-sets-inspector`: typing/presets
save, reload starts at `Hi!`, Restore retrieves earlier work, and Reset changes
only the view. Keys use the shared `education-tools:` prefix.

## Verification

The current encoding/model and metadata checks pass:

```powershell
node --test tests/character-encoding.test.mjs tests/representation-integration.test.mjs
node --check javascript/pages/character-sets-ascii-and-unicode.js
```

Current browser checks pass for all 26 slides at 1366×768 and 1366×900, student
layouts at 390px and 320px, and no-JavaScript reading. The dedicated interaction
suite verifies manual and animated arrivals under reduced motion, pause/resume,
automatic end, pausing when leaving the slide, quiz answer spacing, selection
focus, safe input and inspector fallback.
The shared suite verifies quiz/draft reloads, migration from both old quiz keys,
and preservation of retired written drafts. Reviewed screenshots include the
hello mapping, both computers, font/digit explanation, ASCII byte, UTF-8 overview
and quiz spacing. Setup is in
[the shared sequence record](text_and_image_representation_improvement_plan.md).

## References

- [RFC 20](https://www.rfc-editor.org/info/rfc20/): ASCII values and byte convention.
- [W3C encoding identification](https://www.w3.org/TR/international-specs/#char-encoding-identification):
  declarations, defaults and why guessing from bytes is unreliable.
- [Pearson Unit 2 specification](https://qualifications.pearson.com/content/dam/pdf/BTEC-Nationals/computing/2016/specification-and-sample-assessments/btec-nat-l3-ext-dip-in-computing-spec.pdf#page=44):
  C2 covers character-code purpose, ASCII and Unicode features/uses; manual UTF-8
  byte-count arithmetic is not explicitly listed.
- [RFC 3629](https://www.rfc-editor.org/info/rfc3629/): UTF-8 and ASCII compatibility.
- [Unicode encoding FAQ](https://www.unicode.org/faq/utf_bom.html): code points
  and encoding forms.
- [Unicode combining marks FAQ](https://www.unicode.org/faq/char_combmark.html):
  code points versus displayed characters.
- [WHATWG Windows-1252 index](https://encoding.spec.whatwg.org/index-windows-1252.txt):
  the mismatch example's single-byte interpretations.
