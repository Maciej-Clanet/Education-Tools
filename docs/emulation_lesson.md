# Emulation lesson

`pages/topics/emulation-in-computer-systems.html` is the reusable B1 lesson for
BTEC Level 3 Computing Unit 2. The existing URL, unit/context navigation,
catalogue entry and lesson shell are retained.

## Teaching design

The September 2026 rebuild replaces a compressed eight-section lesson with a
developing explanation: an old game expects a missing platform; software can
recreate its behaviour; the host supplies the real work. Host, target and emulator
are labelled on the recurring diagram before instruction sets or native execution
are introduced. Optional revision notes provide extra depth in student mode.

The target-system illustration connects processor, memory, graphics, sound, input
and storage. Conceptual LOAD / ADD / STORE labels establish the minimum
instruction-set vocabulary. An addition path gives translation a meaning; a host
keyboard-to-target-controller mapping and graphics-frame example show device
recreation. Native execution explicitly assumes a compatible platform.

Four separate use-case stories replace the former summary blocks: a museum's
1992 application, a class comparing 25 rare machines with existing computers, a
factory's 25-year-old stock application, and ARM target software tested on an
x86-64 development PC. Real-device validation is a separate teaching step.

The performance section combines a native reference with five visible stages:
read, decode, recreate/translate, execute host operations, update target state.
The following bar diagram contrasts one baseline work unit with ten illustrative
units (1 + 1 + 3 + 4 + 1). These are invented teaching units, prominently labelled
as an illustration, not a benchmark or a universal slowdown. Translation reuse
is a short optional extension. Accuracy includes timing and devices, without
claiming all emulators sacrifice accuracy. Virtualisation is introduced through
a guest virtual machine and acknowledges device emulation and mixed techniques.

## Final Teacher Slide sequence

There are 27 student sections. Shared infrastructure inserts the opener and five
dividers; six `data-slide-break` markers give each of the seven exam tasks its own
slide. The resulting deck has 39 slides; the count is a description, not a test
contract.

1. **Opener:** Emulation — How can one computer behave like another?
2. Software expects a computer you do not have
3. Could software imitate the missing machine?
4. Host, target and emulator
5. Recreate the behaviour the software expects
6. **Divider:** How emulation works
7. Processors have a machine-level vocabulary
8. Recreate what the target CPU would do
9. A different controller, the expected input
10. The game expects a particular graphics system
11. Native and emulated execution
12. **Divider:** Why emulation is used
13. Preserve the environment, not just the file
14. A class can explore an older computer
15. Keep important old software usable
16. Test software for a processor you do not own
17. Early testing is not always final proof
18. **Divider:** Performance and accuracy
19. Why emulation adds work
20. More work—not a fixed slowdown
21. Avoid repeating the same translation work
22. How closely must it match?
23. Emulation Path Explorer
24. **Divider:** Choosing emulation
25. Emulation and virtualisation can overlap
26. When the original platform is hard to reach
27. When another route may be better
28. Would you emulate it?
29. **Divider:** Practice
30. Challenge the misconception
31. Emulation in one picture
32. Check your understanding — 14-question quiz
33. Explain emulation — 4 marks
34. Explain host and target roles — 4 marks
35. Explain performance overhead — 6 marks
36. Explain preservation — 6 marks
37. Analyse target development — 8 marks
38. Discuss emulation versus original legacy hardware — 8 marks
39. Evaluate emulation as a long-term solution — 12 marks

The opener uses `template[data-teacher-opener]` with the four requested goals as
a plain list. Dividers use `template[data-teacher-divider]`. Neither appears in
student content or sidebar navigation. No slideshow logic was added.

## Components and state

- `javascript/core/emulation-path-explorer.js` renders a small, fixed path using
  the bounded step/reset reducer from the existing kernel visualiser.
- `javascript/data/emulation-examples.js` holds all three examples, two views and
  scenario answer pairs. It accepts no executable learner input.
- Each `[data-emulation-path]` instance has independent temporary state:
  `{ example, view, index }`. Example/view changes restart at stage one; Reset
  retains the selected example/view. Previous and Step stop at the endpoints.
- Emulated paths have five stages: target software, expectation, emulator, host
  behaviour, result. Native references run on compatible original/target hardware;
  they never suggest an incompatible modern host can directly run the old binary.
- Native selects/radios/buttons provide keyboard controls. Numbered stages,
  solid/dashed borders and `aria-current="step"` supplement colour. A live region
  announces the stage and explanation without visually duplicating the paragraph.
  There are no timers; reduced-motion preferences are respected.
- Shared `paired-scenarios.js` checks approach plus reason. Both straightforward
  early emulation and a qualified later-validation recommendation are accepted
  for development. The timing-sensitive industrial case requires the qualified
  real-hardware-validation answer. Native disclosures show one scenario at a time.

The shared quiz, exam drafts, glossary, accessibility launcher, teacher tools and
contextual navigation are retained. Quiz metadata and the unit progress registry
now use version 2, 14 questions, pass score 10. The new question set has a new
storage key; rewritten exam tasks use versioned keys to avoid attaching old
responses to different questions. Older browser storage is not deleted.

## Visual assets

- New `assets/images/emulation/retro-computer.svg`: fictional computer and wired
  controller, reused in the opening and use-case stories.
- New `assets/images/emulation/target-behaviour.svg`: one annotated target system.
- Reused `assets/images/os-types/laptop.svg` and existing project palette/style.
- Repeated target/emulator/host layers, input device, game screen, process paths,
  work-unit bars and balance are semantic HTML/CSS in the page-specific stylesheet.

The detailed machine diagram has a complete text alternative and a keyboard
focusable horizontal scroll container on narrow screens. Explanatory paths are
textual lists; independent examples do not have sequence arrows.

## Verification

Passed:

- `node --test tests/emulation-path.test.mjs tests/teacher-dividers.test.mjs tests/interface-activities.test.mjs`
- Syntax checks for the new controller/data and updated page initializer.
- `git diff --check`.
- Local Chromium: all three examples in both views, bounded steps, Previous,
  Reset, selection changes, incomplete/correct/reconsider scenario feedback and
  the qualified industrial recommendation.
- Quiz submission and reload restored all 14 answers; exam draft restored on
  reload. Reset checked and temporary test answers cleared.
- Unique IDs, sidebar targets, image decoding, opener/divider visibility,
  all 39 slides, no browser console, network or runtime errors.
- Screenshot review at 1366 × 900. Teaching slides fit including expanded
  teaching disclosures, all four scenario feedback states and the ARM explorer;
  the long quiz deliberately scrolls.
- Keyboard radio navigation and Space on disclosure controls, unchanged slide
  position during interaction, explorer state retained across slide navigation,
  reduced-motion setting, and mobile 390 × 844 with no page-level horizontal
  overflow. The detailed machine diagram scrolls within its own container.

The static project has no configured lint or build task. No shared quiz behaviour
was changed and no tests were added for static wording, illustration positioning,
work-unit values or slide count. Browser checks are temporary verification scripts,
not a new framework dependency. These checks do not constitute a full assistive-
technology or physical classroom projection audit.

## Accuracy references and scope

Primary references checked during authoring:

- [QEMU system introduction](https://www.qemu.org/docs/master/system/introduction.html):
  CPU/device system models and the coexistence of emulation with hardware-assisted
  virtualisation.
- [QEMU translator internals](https://www.qemu.org/docs/master/devel/tcg.html):
  translated blocks and reuse, simplified to the appropriate teaching level.

This is a deterministic conceptual illustration, not a real emulator. Assembly,
instruction encodings, registers, RISC/CISC, graphics APIs, translator algorithms
and hypervisor architecture are deferred. The copyright point remains a brief
reminder rather than a legal lesson. Hardware-validation needs depend on the
application; neither perfect reproduction nor a fixed speed ratio is promised.
