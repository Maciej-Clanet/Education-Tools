# Data across multiple systems

September 2026 improvement pass: 29 student sections and 34 Teacher Slides.
The saved review checklist is [multiple_systems_improvement_plan.md](multiple_systems_improvement_plan.md).
The URL, previous/next context, old section IDs and #overview alias remain.
Quiz version 2 has 12 questions, pass score 9; the five written tasks and their
stored answer IDs are unchanged. Quiz/progress metadata therefore needs no bump.

## Teacher Slide sequence

1. Opener: Data Across Multiple Systems
2. Two ways to organise the same data
3. One student, several different jobs
4. Separate PCs, conflicting records
5. What would solve the repeated-update problem?
6. Centralised data: update once, use in several places
7. Connected systems can also keep synchronised copies
8. Divider: The five implications
9. Five questions before changing the system
10. Walkthrough: getting the current class list
11. Access permissions in our college
12. One shared service, several affected teams
13. What is the college paying for?
14. Implementation: moving into everyday use
15. A date can be valid and still be in the wrong field
16. Update once: where the time is saved
17. When an update fails to reach the next system
18. A new access route can expose a shared record
19. Two checks: who are you, and what may you do?
20. Protect the connection and the device
21. Shared control can make misuse easier to spot
22. The same exposure can cause different harm
23. Divider: Balancing the trade-offs
24. One decision creates several connected effects
25. The decision: centralise the college’s records
26. Centralising records: what changes for the college?
27. Impact Explorer
28. Exam technique: build a balanced answer
29. Finish by weighing the effects
30. Divider: Practice
31. Common exam mistakes (access, cost, implementation)
32. Common exam mistakes (productivity, security, applied reasoning)
33. Check your understanding
34. Exam-style practice

## Teaching and visual model

- Separate local copies and shared data are introduced before the college problem.
  Alex Smith (S104) is the recurring record. Labelled PC/laptop silhouettes show
  both the device and the application/file. Explicit updated/out-of-date badges
  make inconsistency visible without relying on colour or dropdowns.
- The missed course change leads to the need for a maintained shared record;
  the solution is introduced only after explaining that need. Centralised storage
  and synchronised application copies have separate diagrams and definitions.
- A proposal plus five questions explains what the factors are evaluating.
  Access uses a three-stage comparison walkthrough; availability keeps normal and
  outage states visible together. The permissions table retains its original
  role rules, with styled labels and a keyboard-focusable scrolling wrapper.
- Cost names a student-information platform and distinguishes introduction,
  operation and possible savings. No arbitrary supplier price is used. The
  productivity diagram compares three 2-minute entries with one: 30 weekly
  changes could free 120 minutes. These are labelled teaching assumptions, cover
  entry time only and do not imply a reduced wage bill.
- Implementation moves through prepare, prove and use. A field-mapping diagram
  shows the same birth date going to a wrong field or the correct field; valid
  format alone cannot establish correctness. Separate connected-system failure
  teaching shows an available application with stale data, rather than an outage.
- Security begins with an unlocked staff laptop exposing contacts. Subsequent
  sections distinguish identity from permission, connection/device protection,
  and monitoring. Permissions block an example payroll request; logs record it.
  Sensitivity is linked to concrete consequences for privacy, safety and support.
- Remote work creates two visible chains: what it enables and what it needs.
  The centralisation decision and worked comparison explicitly show before/after
  arrangements and changes to all five factors. Multiple computers continue to
  use the data even when its main records are centralised.
- The original Impact Explorer remains. A reusable two-section exam-technique
  pattern builds applied reasoning, weighs effects and supports a judgement;
  see [exam_technique.md](exam_technique.md) for Pearson evidence and reuse.

The page remains static HTML. Styles are in
`css/pages/data-across-multiple-systems.css`. The shared lesson shell handles
the opener, three dividers, existing misconception slide break and touch/keyboard
slide navigation. Student revision details stay hidden in Teacher Slides. No
photographs or third-party assets are required for these process diagrams.

## Shared walkthrough authoring

Load `css/lesson-walkthrough.css`, import `initLessonWalkthroughs` from
`javascript/core/lesson-walkthrough.js`, and call it before `initLessonPage`.
An optional root argument scopes discovery. Each independent instance has:

- `data-lesson-walkthrough` and `data-no-slide-advance` on the wrapper.
- One or more `data-walkthrough-step="Short step title"` panels, visible in HTML.
- A `data-walkthrough-controls` container with the HTML `hidden` attribute.
- A `data-walkthrough-status` paragraph with role=status, aria-live=polite and
  aria-atomic=true, plus native type=button controls with
  `data-walkthrough-prev`, `data-walkthrough-next` and `data-walkthrough-reset`.

Initialisation checks the required nodes, reveals controls and hides other
panels. Bounds use aria-disabled while retaining button focus; guarded handlers
prevent moving beyond the sequence. Restart restores step 1. There is no saved
state: reload starts fresh. Without JavaScript all steps remain readable and the
controls stay hidden; printing also shows all steps. Initialisation is idempotent.

## Validation

- Relevant automated regression suite includes the new walkthrough tests plus
  Impact Explorer, paired interface activities and teacher dividers.
- Local headless Chrome checks cover keyboard activation, previous/next bounds,
  restart and in-slide controls not advancing the deck; quiz scoring and answer
  restoration; written-draft restoration; Impact Explorer multi-factor feedback,
  response retention and reset; all section links and duplicate IDs.
- Visually reviewed all 32 non-assessment slides at 1366×900. All fit without
  scrolling at 1366×768 after compacting spacing without reducing teaching text
  size. Quiz and written practice retain the shared scrolling surface.
- Student views at 390px and 320px have no page-level horizontal overflow;
  wide tables scroll inside their labelled, focusable wrappers. Reviewed mobile
  device diagrams, access, permissions, productivity and exam technique, plus
  high contrast. No new animation is used. The no-JavaScript view displays all
  three walkthrough steps and no active controls or teacher-only slides.
- No browser runtime exceptions; local paths, retained assessment markup and
  whitespace checked. This static project has no package build/lint pipeline.
