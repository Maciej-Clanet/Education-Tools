# Stored-program architecture: teaching sequence and implementation

Purpose: first teaching of B1's stored-program, Von Neumann and Harvard models,
using the existing topic URL and shared teacher deck. Explain prerequisites before
comparison; keep B2 instruction-cycle/cache mechanics and B3 registers for later.

## Teaching sequence

1. Same computer, different jobs: why stored instructions matter.
2. Instructions versus data: actions and the values they use.
3. The stored-program principle: memory holds executable instructions; both
   architecture models can implement it.
4. Tiny worked program: read 7, add 2, display 9; different stored instructions
   change behaviour without rewiring the processor.
5. CPU, memory and input/output: who does what?
6. What is a memory path/bus? Fetching instructions versus reading/writing data.
7. Von Neumann: labelled shared-memory/shared-path diagram.
8. Inside shared memory: addresses hold instruction or data values.
9. Two requests, one route: why an access may wait.
10. The Von Neumann bottleneck: cause, performance effect, limits.
11. Harvard: separate instruction/data memories and paths.
12. What can happen together? Memory access versus instruction execution.
13. Memory Access Lab: step the same ready request workload through both models.
14. Compare the arrangements: concise revision table after explanations.
15. Strengths and trade-offs: flexibility, contention and organisation.
16. Real designs mix ideas: a brief bridge, not a cache lesson.
17. Choosing for a task: requirements and evidence, not device stereotypes.
18. Scenario/reason matching with the existing paired-selection component.
19. Build an applied exam answer: feature → consequence → judgement.
20. Common mistakes.
21. Quick quiz (12 questions; version 2, pass 9).
22. Written practice with locally saved answers.

Teacher dividers before 7, 11, 17 and 20; 26 teacher slides in total.

## Visual/interaction design

- Local labelled vector architecture diagrams with text equivalents.
- A small symbolic program and shared/separate memory records, no real assembly.
- One deterministic Memory Access Lab. Ready instruction and data request queues
  use one shared path or two independent paths. Step/finish/reset and presets
  demonstrate overlap and a case with no benefit from a second path.
- Slots are illustrative transfer opportunities, not CPU cycles or performance
  benchmarks. Requests are already ready and independent; no dependent data access
  is scheduled before its instruction is known. No claim of twice-fast execution.
- Use native controls, visible request labels and live feedback; no timed autoplay.

## Verification

A couple of pure state/model tests covering path capacity, request conservation,
completion and reset. One focused browser smoke check: lab controls, shared quiz
and draft persistence, teacher interaction exclusion, mobile overflow and errors.
No screenshot sweep or exact-copy/slide-count regression tests.


## Implemented components and checks

- `javascript/core/memory-access-model.js`: pure queue scheduling and step state.
- `javascript/core/memory-access-lab.js`, `css/memory-access-lab.css`: labelled
  ready/transferred request tokens, bounded step/finish/reset and three presets.
  Reset restarts the selected workload; changing workload also clears progress.
  Shared-path requests alternate when both kinds are pending; this is a teaching
  scheduling choice, not a claim about real CPU arbitration.
- `assets/images/architecture/`: local labelled Von Neumann and Harvard SVGs,
  with visible captions and text alternatives.
- `javascript/data/architecture-scenarios.js`: three choice/reason activities
  using the existing paired-scenarios component, including insufficient evidence.
- Existing lesson shell provides teacher dividers, navigation, accessibility,
  quiz scoring/reset/persistence and four on-page written-answer drafts.
- Quiz version 2: 12 questions, pass 9; unit-progress metadata matches. A new quiz
  storage key and written-response IDs avoid reusing answers for changed questions.

Passed: the two focused cases in `tests/memory-access-model.test.mjs`, JavaScript
syntax, local links/unique IDs and whitespace checks. One focused browser smoke
check passed for step/finish/reset, instruction-only comparison, keyboard Space
activation, scenario feedback, quiz reset/reload and exam draft persistence,
teacher interaction isolation, local SVG loading, mobile overflow and errors.
One teacher-lab screenshot was reviewed; no slide-by-slide screenshot pass.
No package-based build or lint pipeline is configured.

## Source checks

Classic Harvard separation was checked against Microchip's primary documentation:
https://developerhelp.microchip.com/xwiki/bin/view/products/mcu-mpu/8-bit-avr/structure/core/

The brief mixed-design/cache explanation was checked against Arm's primary
explanation of instruction and data caches:
https://developer.arm.com/community/arm-community-blogs/b/architectures-and-processors-blog/posts/caches-and-self-modifying-code

Both links are offered in an optional real-examples disclosure. Detailed registers,
cache operation, pipeline timing, machine code and architecture benchmarks remain
outside this lesson. The lab transfers already-ready requests and does not execute
a program or derive CPU speed from the number of slots.
