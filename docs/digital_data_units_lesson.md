# Units of digital data: visual refinement

The existing C1 lesson remains at `pages/topics/units-of-digital-data.html`.
This pass preserves its curriculum, contextual links, independent Conversion
Workshop, quiz shell and written-answer persistence. Dense sections are
recomposed into 22 student sections and 31 Teacher Slides, rather than adding
binary arithmetic or a new curriculum.

## Teaching changes

- Four illustrative sizes establish why different units are useful. A conceptual
  two-state bit precedes progressive 1/2/3/8-bit patterns and a bracketed byte.
  Lowercase b versus uppercase B appears here, before conversion work.
- The same ladder layout recurs in the overview, separate decimal/binary
  explanations and worked conversions. Its double-lined bit/byte boundary
  always uses 8. Other prefix boundaries use 1000 or 1024, explicitly labelled
  in both directions. Start, target and current positions have text labels and
  different border treatments, not just colour.
- Decimal and binary are taught before the comparison. The KB label is retained
  from the existing lesson and user brief (also written kB); KiB is separately
  defined. Explicit question conventions take precedence in calculations.
- Two equally sized container diagrams show one GB versus 1000 MB. Ten drawn
  groups each represent 100 MB; the data area stays the same. Smaller pieces need
  a larger number, giving multiplication/division a reason and a sense check.
- Five fixed worked examples reuse the new stepper. Learners see each jump and
  intermediate amount before a multi-step exponent shortcut is offered.
- Capacity/size, transfer rate and an idealised 800 MB at 80 Mb/s calculation
  have separate teaching moments. Matching units gives 10 MB/s, then 80 seconds.
- Misconceptions use exclusive native disclosures. Fuller student revision notes
  remain available but do not crowd Teacher Slides.

## Teacher Slide sequence

The opener and four dividers use existing inert templates. The five exam tasks
use four `data-slide-break` markers; no new slideshow mechanism was introduced.
The shared keyboard handler now respects `data-no-slide-advance` for navigation
keys and leaves Space activation to focused buttons/links/summaries. This fixes
activity buttons advancing the deck; other teacher shortcuts remain available.

1. **Opener:** Units of Digital Data — How do computers measure the amount of data they store and move?
2. Why do we need different units?
3. **Divider:** Building the units
4. One bit stores one binary state
5. Each extra bit doubles the possible patterns
6. Eight bits form one byte
7. One ladder, two types of relationship
8. Decimal prefix steps use 1000
9. Binary prefix steps use 1024
10. Check which convention is intended
11. **Divider:** Converting units
12. Same data, different-sized pieces
13. Walk the route: 3.5 GB → MB
14. Walk the route: 4096 MiB → GiB
15. Take each jump before using a shortcut: 2 GiB → KiB
16. Bits ↔ bytes uses 8: 80 Mb → MB, with the reverse revealed separately
17. One route can use two different rules: 16 Mb → KB
18. Conversion Stepper
19. Conversion Workshop
20. **Divider:** Capacity and speed
21. Capacity and size: how much data?
22. Transfer rate: how much each second?
23. Match the units before finding the time
24. **Divider:** Practice
25. Spot the unit mistake
26. Quick quiz — 11 questions
27. Existing question 1: explain bits and bit patterns — 4 marks
28. Existing question 2: explain conversion strategy — 6 marks
29. Explain bit/byte distinction; decimal and binary calculations — 6 marks
30. Multi-step and mixed conversions with method — 6 marks
31. Interpret size/rate and estimate transfer time — 6 marks

## Conversion Stepper contract

`javascript/core/data-unit-conversion.js` contains the small unit model and pure
`createConversionPlan(value, from, to, selectedBase)` function. It returns edges
with `from`, `to`, `factor`, `type`, `operation`, `before` and `after`, plus ordered
teaching frames and the final result. Each boundary is classified as `bit-byte`
or `prefix`. There is no expression evaluation or general maths engine.

`javascript/core/conversion-stepper.js` renders `[data-conversion-stepper]`.
A fixed example key (`decimal`, `binary`, `multi`, `bits`, `mixed`) loads from
`javascript/data/data-conversion-examples.js`; an empty key provides the editable
tool. All instances reuse `nextKernelState` for bounded Next/Previous/Reset.
Styles live in `css/conversion-stepper.css`, with lesson visuals in its page CSS.

The sequence is: locate start/target; explain direction; trace each jump; apply
each relationship; reveal the answer and sense check. One jump produces five
frames; two jumps produce seven. Intermediate results appear during calculation,
but the final result appears only in the last frame. Pure bit/byte conversions
show a focused 8-based bridge instead of irrelevant prefix steps.

Supported units are b/Kb/Mb/Gb/Tb, B/KB/MB/GB/TB and KiB/MiB/GiB/TiB. The tool
supports either direction, multiple prefix steps, bits/bytes, mixed routes,
unchanged units and zero. Native binary prefixes fix the scale at 1024. A
convention selector appears only for ambiguous ordinary-prefix changes; matching
bit/byte prefixes require no 1000/1024 choice. The 1024 option is explicitly
labelled as a question convention, not a formal redefinition of MB.

Both ends use one prefix system. Selecting a prefix from a different system
aligns the other prefixed unit and explains that adjustment beside the controls.
The pure model rejects conflicting explicit systems. Cross-system comparisons
can be made as two conversions through B. Numeric input is non-negative and
finite, from 10^-9 to 10^12 (or zero). Display uses up to 12 significant digits,
marks rounded final values approximately and does not promise arbitrary precision.

Changing any input clears the old route. Main-tool Reset restores the initial
4096 MiB → GiB inputs without starting; fixed demos reset to their first frame.
State is temporary and remains intact while navigating Teacher Slides. Visible
focus, labelled controls, a live status region and local ladder scrolling support
keyboard use. There are no timers or autoplay; reduced motion is respected.

## Preserved practice and integration

The 12 Workshop tasks, number parsing, accepted decimal/binary answers, rounding,
feedback and `lesson-units-of-digital-data-practice` storage are retained.
`Show me the steps (decimal)` loads a task into the main stepper at its first
frame through a local `conversion:load` event and the existing sidebar navigation.
It does not reveal the answer. The learner can change the convention and restart.

Teacher Slides present one existing Workshop card at a time using Previous/Next
question controls and the shared bounded reducer. The student page retains all
12 cards; paging does not mutate answers or completion state.

The five existing quiz questions are retained, with the unit-system question
clarified to say *prefix* steps. Six questions fill coverage gaps: eight-bit byte,
unit order, decimal calculation, binary multi-step calculation, direction
reasoning and capacity/rate. Quiz version 3 has 11 questions and pass score 8 in
both lesson and unit-progress metadata; its new key avoids stale quiz results.
The two existing exam questions and their draft keys are preserved; three applied
tasks are appended using new keys under the same exam storage record.

## Verification and scope

Passed automated checks:

- `node --test tests/data-unit-conversion.test.mjs tests/teacher-dividers.test.mjs`
- Syntax checks for the unit model, stepper, example data and lesson initializer.
- `git diff --check`.

The conversion tests cover all six requested numerical cases, intermediate units
and relationship types, explicit conventions, invalid input, zero/unchanged
units and bounded step navigation. No tests assert static wording, visual
positioning, exact lesson slide count or diagram decoration.

Passed browser verification covers the six cases, deferred final answers, independent
demo state, conditional convention controls, pattern progression, Workshop
handoff, answer/quiz/draft persistence, keyboard operation, Teacher Slides,
responsive width, reduced motion and browser errors. Screenshots were reviewed at
1366 × 900 and mobile width 390. All teaching slides and worked-conversion frames
fit the desktop viewport, including mixed conversions and the Workshop card.
Space activates the focused activity button; normal arrow navigation and Escape
still work. There were no browser console, network or runtime errors.
The quiz deliberately scrolls; wide ladders
scroll within their own keyboard-focusable containers. These checks do not
constitute a full screen-reader or physical classroom projection audit.

The static project has no configured lint/build task and gains no dependency.
The existing SSD SVG is reused; other visuals are semantic HTML/CSS. No image
generation or new raster assets are needed. Binary place values, BCD, arithmetic,
signed numbers and arbitrary cross-system calculator features remain outside
this focused refinement.

Reference checked: [NIST binary prefixes](https://pml.nist.gov/cuu/Units/binary.html)
for the distinction between decimal prefixes, binary prefixes and eight-bit bytes.
