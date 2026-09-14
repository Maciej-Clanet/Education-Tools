# Units of digital data

`pages/topics/units-of-digital-data.html` remains the C1 lesson. The focused
correction separates two teaching models: first byte-prefix scale, then the
independent bit/byte relationship. It retains the existing lesson shell,
progressive examples, Workshop, pattern visual, quiz and written practice.

## Teaching sequence

There are 23 student sections and 32 Teacher Slides. The existing opener, four
teacher-only dividers and four exam slide-break markers provide the deck.

1. **Opener:** Units of Digital Data
2. Why do we need different units?
3. **Divider:** Converting units
4. Byte units: changing the size prefix
5. Decimal prefix steps use 1000
6. Binary prefix steps use 1024
7. Check which convention is intended
8. Same data, different-sized pieces
9. Walk the route: 3.5 GB → MB
10. Walk the route: 4096 MiB → GiB
11. Take each jump before using a shortcut: 2 GiB → KiB
12. Conversion Stepper
13. Conversion Workshop
14. **Divider:** Bits and bytes
15. A different relationship: bits vs bytes
16. One bit stores one binary state
17. Each extra bit doubles the possible patterns
18. Two parts of a unit label
19. Start simply: 80 bits → bytes
20. Keep mega; change bits to bytes — with the download-rate application revealed
21. **Divider:** Capacity and speed
22. Capacity and size: how much data?
23. Transfer rate: how much each second?
24. Match the units before finding the time
25. **Divider:** Practice
26. Spot the unit mistake
27. Quick quiz — 12 questions
28. Explain bits and patterns — 4 marks
29. Explain byte-prefix conversion strategy — 6 marks
30. Bit/byte distinction and separate decimal/binary calculations — 6 marks
31. Binary multi-step and decimal byte-prefix calculations — 6 marks
32. Interpret size/rate and estimate transfer time — 6 marks

The complete byte-prefix conversion block precedes bit/byte teaching. The normal
student page follows the same order, with fuller revision disclosures. The
mixed-rule slide and its preset are removed entirely, with no optional extension.

## Separate visual models

The main decimal ladder is **B ↔ KB ↔ MB ↔ GB ↔ TB**. The binary-prefix version
is **B ↔ KiB ↔ MiB ↔ GiB ↔ TiB**. Neither contains a bit box or a relationship
using 8. The overview uses decimal labels; only the explicit comparison table
puts decimal and binary systems side by side.

The later “A different relationship” slide introduces 8 bits = 1 byte and b/B
notation after the Workshop. The existing bit-state and pattern visuals now sit
inside this later block. A two-dimensional table separates prefix columns from
bits/bytes rows, alongside M+B and M+b labels. Horizontal movement changes the
prefix; vertical movement changes bits/bytes. The simple 80 bits → 10 bytes
example establishes division by 8 before any prefixed numerical example.

The following table highlights only the mega column: 80 Mb → 10 MB. The prefix
stays mega. A native disclosure shows 80 Mb/s vertically above ÷8 and 10 MB/s,
linking network-speed notation to download software. No byte-prefix ladder
appears in either bit/byte example. Capacity and transfer rate follow this block,
using 800 MB and 80 Mb/s; matching units gives 10 MB/s and an ideal 80 seconds.

The brief exam-convention note remains: some questions/software use ordinary
KB/MB/GB labels with 1024-based values. Learners should follow an explicitly
stated convention. This nuance does not change the main tool's formal labels.
The lesson retains KB from the brief; the notes also identify the spelling kB.

## Byte-only Conversion Stepper

`javascript/core/data-unit-conversion.js` exports the byte-unit arrays,
`conversionConvention` and `createConversionPlan(value, from, to, selectedBase)`.
The model supports only byte-prefix routes. With no explicit base, it infers the
system from the labels. If a base is supplied, all prefixed labels must match it.
Unknown units, conflicting systems and invalid numeric values are rejected.

`javascript/core/conversion-stepper.js` renders the same staged flow as before:
locate start/target, reason about direction, count each jump, calculate each step,
then reveal the answer and sense check. Intermediate amounts appear before the
final result. Multi-step exponent shortcuts appear only after the full route.
`nextKernelState` still supplies bounded Previous/Next/Reset behaviour.

The main tool always exposes a Unit system selector:

- Decimal (1000) populates B, KB, MB, GB and TB.
- Binary prefixes (1024) populates B, KiB, MiB, GiB and TiB.

Changing system preserves the value and prefix positions, maps the labels to the
chosen family, and clears the old route. Start, current and target remain
explicitly labelled. The selected system controls all ladder labels and factors.
No bit-based unit or mixed-rule route is offered. The three fixed examples in
`javascript/data/data-conversion-examples.js` are decimal, binary and multi-step.

Input remains finite and non-negative, 10^-9 to 10^12 (or zero). Display uses up to
12 significant digits and marks approximate final values. Main Reset restores
4096 MiB → GiB without starting; fixed examples reset to the first frame. State
is temporary and survives slide navigation. Keyboard focus, live stage feedback,
reduced motion and local horizontal scrolling remain supported.

## Practice and persistence

All 12 existing Workshop questions already use byte prefixes and remain intact.
Their parser, accepted decimal/binary practice conventions, rounding, feedback,
completion tracking and storage key are unchanged. The explicitly labelled
“Show me the steps (decimal)” link still loads a question at the first frame,
using the existing sidebar navigation. Teacher mode presents one card at a time;
student mode shows all cards. Paging does not alter answers.

The quiz retains its eleven questions, clarifies prefix terminology and adds a
simple equivalent-rate question (80 Mb/s = 10 MB/s). Version 4 has 12 questions,
pass score 9, with matching lesson and unit-progress metadata and a new quiz key.
There is no mixed bit/prefix quiz question.

The fourth written task replaces the mixed conversion with 2 GiB → KiB and
4500 MB → GB plus an explanation of direction. Its response key changes to
`question-4-byte-prefix-v2`, so an old answer is not attached to a new prompt.
The other four written tasks and draft keys are retained. The written-practice
storage record remains the same.

## Verification

Passed automated checks:

- `node --test tests/data-unit-conversion.test.mjs tests/teacher-dividers.test.mjs`
- Syntax checks for the model, stepper, example data and page initializer.
- `git diff --check`.

Representative model tests cover 3.5 GB → MB, 2 GB → KB, 4096 MiB → GiB,
2 GiB → KiB and 4500 MB → GB, intermediate byte units, matching system labels,
invalid input, zero, unchanged units and Previous/Next/Reset. Mixed-route tests
were removed with the unsupported feature. Static bit/byte teaching needs no
new calculation runtime or artificial tests.

Local Chromium checks cover both mode option lists and ladder contents, all
representative results, deferred final answers, mode-change invalidation,
Workshop handoff and persistence, quiz/draft reloads, slide sequence, responsive
width and browser errors. Screenshot review at 1366 × 900 covered all 32 slides,
including expanded teaching disclosures; teaching slides fit and the long quiz
intentionally scrolls. Detailed tables/ladders have keyboard-focusable local
scroll containers on narrow screens. These checks are not a full screen-reader
or physical classroom projection audit.

There is no configured lint/build task and no new dependency. This pass changes
no shared slideshow or storage logic. Visuals remain HTML/CSS plus the existing
SSD SVG. Binary arithmetic, mixed bit/prefix challenges and a general-purpose
conversion calculator remain outside scope.

Reference: [NIST binary prefixes](https://pml.nist.gov/cuu/Units/binary.html).
