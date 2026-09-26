# Stored-program architecture: first-teaching rebuild

Updated 26 September 2026. The improvement checklist is in
`stored_program_improvement_plan.md`. The existing URL, shared lesson shell,
contextual navigation, glossary, quizzes and saved written responses remain.

## Sequence and slide map

23 student sections produce 35 Teacher Slides: one objective opener, five dividers,
one extra misconceptions slide and five extra written-task slides. The quiz remains
one scrollable slide. Revision disclosures are hidden in Teacher Slides.

| Slide | Main idea |
| --- | --- |
| 1 | Opener: stored programs, instructions/data, memory arrangements, device suitability |
| 2–3 | Familiar programs; why the historical example matters; early ENIAC cables/switches |
| 4–6 | Stored-program divider; change the program; introduce instructions and data with 5 + 3 |
| 7–9 | Laptop storage → RAM → CPU; architecture-neutral roles; short CPU-parts primer |
| 10–12 | Introduce architectures; Von Neumann divider; classic shared memory/path |
| 13–16 | Run the small program; contention; why choose Von Neumann; room-heating design example |
| 17–20 | Harvard divider; concurrent access; headphone sound processing; fixed memory split drawback |
| 21–24 | Modern-design divider; split caches/shared main memory; Raspberry Pi photo editing; cache costs |
| 25–27 | Apply feature → effect → task → trade-off/judgement; common misconceptions |
| 28–29 | Practice divider and unchanged 12-question quiz |
| 30–35 | Six separate written tasks, with saved response areas and answer guides |

The first whole-system visual is a role map with no memory-to-CPU wiring. It must
not imply that every stored-program computer has the Von Neumann arrangement.
Instruction/data meaning comes before the architecture names. Control Unit, ALU
and registers get one short introduction; named registers, machine code and the
full instruction cycle belong in subsequent lessons. Definitions and examples use
plain language; technical qualifications remain in revision disclosures.

## Visuals and demonstration contract

The retained original `early-computer.svg` illustrates physical programming.
Process diagrams use responsive HTML/CSS with original inline SVG icons.
This replaces the old fixed SVG machine frame, separate CPU highlights,
road metaphor and large cache graphic. The initial role map stays abstract; later
diagrams explicitly name shared/separate memories and pathways. Three locally
stored real photographs show a room thermostat, headphones and a Raspberry Pi 4.
Their creators, source links, licences and resizing are recorded in
`assets/images/architecture/CREDITS.md`, with attribution visible below each image.
The photos are about 294 KB combined and require no external image requests.

`javascript/core/architecture-visualiser.js` reuses `nextKernelState` and reads
`javascript/data/architecture-frames.js`. `css/architecture-machine.css` handles
the memory/route/processor diagrams; the page stylesheet handles lesson composition.
Three values are supported for `data-architecture-demo`:

- `program`: eight stages, fetching three readable operations, receiving 5 and 3,
  adding inside the processor and displaying 8.
- `shared`: four stages, with an instruction using the route while data waits,
  followed by data transfer. Waiting/received badges show the contention.
- `concurrent`: three stages, with a ready next instruction and independent data
  for the current operation using separate routes to one CPU together.

Frames provide title, description, CPU fields, highlighted source items, request
statuses and an array of labelled transfers. Each transfer identifies its kind,
visible words and route. The responsive diagram switches to vertical routes on
mobile. Static HTML supplies the baseline and a full readable transcript.

Controls are Previous, Play/Pause/Replay, Next step and Restart. Manual movement
stops playback. Ends are bounded; Replay resets and starts again. Each transfer
lasts 1.1 seconds; automatic frames advance every 2.4 seconds. These durations
are teaching pacing, never measured hardware performance. Controls retain focus
at sequence boundaries using aria-disabled and guarded handlers. Status and its
explanation share a polite live region. Tool interactions do not move the slide.

Teaching motion ignores the OS reduced-motion preference, as explicitly requested.
Playback pauses offscreen, on page hiding or departure; Pause also freezes a
travelling label. Manual alternatives remain. Print/no-JavaScript exposes the
transcript and hides the controls. No simulation state needs persistence.

The old mode-switching comparison and diagram-identification activity are removed;
`architecture-scenarios.js` is no longer needed. The compact reference comparison
table remains in a student revision disclosure. Historical section IDs survive as
anchors within the relevant new section so old links remain useful.

## Model boundaries and practical use

- The readable Read/Add/Show operations simplify a program. Stages are not clock
  cycles. Instructions and values are both binary patterns; roles depend on how
  the processor interprets them. No invented bit encoding is taught.
- “Shared” is an access/address-space model, not a promise of one physical memory
  chip or interchangeable Flash/RAM. The loading diagram is a laptop example;
  some small systems execute programs directly from non-volatile Flash.
- Harvard allows independent accesses to overlap; it does not imply two CPUs,
  two simultaneous instructions, removal of dependencies or a guaranteed speed ratio.
- Modified Harvard is a simplified shared-main-memory/split-cache example. It
  does not draw every cache level or claim all processors use that exact layout.
- The micro:bit and Arduino examples were replaced after classroom-level feedback.
  Avoid processor model names in the teaching copy. Use familiar tasks and explain
  the requirement before connecting it to memory access.
- Room heating: a hypothetical simple controller reads temperature and switches
  heating. When a shared pathway already meets its response needs, extra access
  capacity may have little practical value. This does not establish the architecture
  of the photographed model or of every thermostat.
- Headphones: digital noise cancellation illustrates continual sound data and
  repeated processing. Harvard-style access can reduce waiting. The source explains
  sound-processing architectures generally; the photo is task context, not evidence
  about that product's internals or its digital/analogue implementation.
- Raspberry Pi 4 retains the verified separate instruction/data caches and shared
  main-memory example; the processor is simply named “processor”.
- Shared-memory flexibility: two diagrams allocate the same ten units of RAM as
  3 program + 5 data + 2 spare or 6 program + 2 data + 2 spare. The fixed Harvard
  example needs 6 program + 2 data, but has two five-unit pools: three spare data
  units cannot fill the missing program unit. Equal units and a fixed split are
  explicit simplifying assumptions; this is not a claim that every Harvard design
  has equal pools or that Flash/RAM are interchangeable.
- The new cache-cost slide explains chip area/cost, tracking up-to-date copies and
  waiting when a copy is absent. It contrasts the benefit for a simple controller
  with repeated image processing. None of the architecture names alone determines
  price, power or speed; the trade-off depends on the implementation and task.

Hardware facts link to primary documentation. Projects and suitability explanations
are illustrative inferences, not claims about manufacturer intentions or benchmarks.
See the source list in the improvement plan and on-page sources/revision notes.

## Assessments

Quiz version 3 stays unchanged: 12 questions, pass 9, matching page configuration
and unit progress metadata. The six written questions retain 4, 4, 6, 6, 8 and 10
marks, answer guides, v3 response IDs and the existing draft storage key. Each now
has its own teaching slide. No assessment migration is required.

The suitability explanation reuses `css/exam-technique.css`. As in
`exam_technique.md`, this is a thinking scaffold, not an official mark scheme or
a universal formula. Use it for analysis/evaluation when the command word calls
for it; short definition questions do not require a complete balanced evaluation.

## Validation and resuming work

- The initial 32 slides were visually reviewed; the seven changed/new views in
  this refinement were inspected at both desktop heights and on mobile. All 35
  slides were layout-checked at 1366×900 and 1366×768. Every
  demonstration state fits these viewports. The complete quiz intentionally
  scrolls; opening longer answer guides or increasing text size can also scroll.
- Mobile 390/320px: no horizontal page overflow; vertical transfer labels stay
  inside their routes. Mobile controls use two columns.
- Three model regression cases cover bounded controls, pause/replay, program data
  order/output, shared contention and simultaneous independent Harvard transfers.
- Browser checks cover OS reduced motion, all states, Play/Pause/Replay/Restart,
  offscreen pausing, keyboard Enter, slide isolation, quiz 12/12, reset and actual
  reload persistence for quiz answers and written drafts, print/no-JS fallbacks,
  duplicate IDs, fragment links, local images and runtime errors.
- All 12 quiz fieldsets and six exam cards match the prior version after whitespace
  normalisation. All old section anchors remain and local asset references resolve.

Run `node --test tests/architecture-visualiser.test.mjs`. Browser regression:
`node tests/stored-program-architecture.browser.mjs`. The shared teaching-motion
check also exercises the new labelled architecture transfers.

Browser tests use `tests/helpers/browser-session.mjs`, a local server such as
`node raid-test-server.mjs` on port 8765 and a dedicated Chrome debugging profile
on port 9226. Override `FLEXBOX_TEST_ORIGIN` and `FLEXBOX_CDP_ORIGIN` if needed;
`FLEXBOX_SCREENSHOTS` optionally saves evidence. Always use an isolated profile:
tests create local answers/preferences. The in-app browser had no available
session, so this review used local headless Chrome. No new build system or backend.
