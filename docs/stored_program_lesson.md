# Stored-program architecture: first-teaching rebuild

Purpose: motivate the stored-program idea, build one spatial model of a computer,
then derive Harvard's separation from Von Neumann's shared arrangement. Existing
URL, contextual navigation and shared lesson shell remain in use.

## Teaching sequence

1. How do you tell a computer what to do? Historical operator/patch-cable scene.
2. Changing the program could mean changing the machine: before/after configuration.
3. The stored-program breakthrough: external configuration becomes stored instructions.
4. From secondary storage to RAM to CPU.
5. Instructions and values are both binary patterns; interpretation gives meaning.
6. The whole stored-program computer: CPU, memory, input, output and paths.
7. Von Neumann architecture: shared memory and pathway.
8. CPU highlight: Control Unit.
9. CPU highlight: ALU.
10. CPU highlight: registers.
11. Instructions and data share memory.
12. Instructions and data share the pathway: step-through transfers.
13. One road, two kinds of traffic: bottleneck metaphor.
14. The Von Neumann bottleneck: shared transfer capacity can limit performance.
15. Tiny program: LOAD A, ADD B, OUTPUT, using A = 5 and B = 3.
16. Transform shared memory/path into separate instruction/data memories and paths.
17. Harvard architecture definition.
18. Independent instruction/data accesses on separate paths.
19. Von Neumann/Harvard visualiser: mode switching, Step, Previous step and Reset.
20. Compact comparison table, after both models are taught.
21. Modern modified Harvard: separate instruction/data caches, shared main memory.
22. Identify systems A/B/C from diagrams and justify with architectural evidence.
23. Common misconceptions.
24. Architecture in one picture: paired diagrams and stored-program principle.
25. Twelve-question quiz.
26. Six written exam tasks, progressing through 4, 4, 6, 6, 8 and 10 marks.

Five teacher-only dividers precede sections 3, 7, 16, 20 and 25: Stored-program
breakthrough, Von Neumann, Harvard, Comparing architectures and Practice. The
shared deck adds its “Next” presentation. Templates are absent from student
content and Jump To. Total: 26 teaching sections plus five teacher dividers.

## Visuals and reusable implementation

- `assets/images/architecture/machine-frame.svg` supplies the recurring CPU/input/
  output frame via SVG use. Inline memory/path layers reuse the same geometry
  throughout whole-machine, component, shared-path, Harvard and scenario views.
- Dashed outlines highlight CU, ALU, registers and memory without removing the
  surrounding machine. Captions name the highlighted area.
- Local `early-computer.svg`, `patch-a.svg`, `patch-b.svg`, `bottleneck-road.svg`
  and `modified-harvard.svg` provide historical, before/after, traffic and cache
  visuals. These are illustrative diagrams, not reconstructions of a named machine.
- `javascript/core/architecture-visualiser.js` reuses `nextKernelState` from the
  existing kernel visualiser. Deterministic frames live in
  `javascript/data/architecture-frames.js`. Shared CSS is
  `css/architecture-machine.css`; lesson composition stays in its page stylesheet.
- The shared path, tiny program, Harvard transformation, concurrent access and
  comparison all use this one small visualiser. Mode changes restart; Reset
  preserves the selected mode; controls stop at sequence boundaries.
- Existing paired-scenarios component handles evidence/reason feedback for shared
  Von Neumann, separate Harvard and modified-Harvard systems.
- Shared teacher deck, quiz, accessibility, contextual navigation and exam draft
  persistence remain in use. No duplicate slideshow or quiz engine.
- Quiz version 3: 12 questions, pass 9. Page configuration, storage key and unit
  progress metadata agree. Six new response IDs isolate changed exam drafts.
- Composition varies between historical scenes, before/after images, memory
  transformation, binary ribbon, persistent schematic, road metaphor, stepper,
  compact table and layered cache illustration; equal-card teaching grids removed.

## Model boundaries and accessibility

The small program uses symbolic addresses A/B to distinguish instruction fetches
from data accesses. It demonstrates an ordered explanation, not clock cycles.
The Harvard comparison overlaps a forthcoming instruction fetch with an independent
access associated with an already-decoded instruction. It does not imply that a
new instruction's dependent data is available before decoding, or that two
instructions execute together. No speed ratio is inferred from step counts.

Native keyboard controls have visible focus, text/live status and bounded states.
Transfers have dashed paths and labels, not colour alone. Motion is finite and
respects reduced-motion preferences. Diagrams have descriptions/captions and
horizontal scrolling on narrow screens; the comparison table also scrolls.
Teacher demos put controls beside the diagram on wide displays.

Registers are introduced only as small, fast CPU working storage. Detailed named
registers, the full fetch-decode-execute cycle, machine code, cache hierarchy,
pipelines, branch prediction, real timing and RISC/CISC remain for later lessons.

## Verification

Passed two focused state regression cases in `tests/architecture-visualiser.test.mjs`:
mode changes, bounded stepping, reset, shared/separate transfers, tiny-program
output and memory transformation. JavaScript syntax, local asset references,
unique HTML IDs, SVG XML parsing and whitespace checks passed.

Focused browser smoke check covers controls and keyboard Space, scenario feedback,
quiz scoring/reset/reload, exam draft persistence, teacher interaction isolation,
external SVG-frame loading, narrow-screen overflow, reduced motion and runtime
errors. Two representative views were inspected: historical opening and teacher
visualiser. The teacher layout was tightened after inspection. No screenshot sweep,
exact-copy tests, coverage work or new build tooling.

## Source checks

Historical plugboard example (qualified as some early machines; shallow context):
https://computerhistory.org/blog/unprogramming-the-eniac-lehmer-childs-play/

Classic Harvard separation, Microchip:
https://developerhelp.microchip.com/xwiki/bin/view/products/mcu-mpu/8-bit-avr/structure/core/

Separate instruction/data caches and shared memory, Arm:
https://developer.arm.com/community/arm-community-blogs/b/architectures-and-processors-blog/posts/caches-and-self-modifying-code

Optional disclosures offer these sources. History is motivation, not assessed trivia.
