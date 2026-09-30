# Data across multiple systems

30 September 2026 classroom-flow improvement pass: 27 student sections and
37 Teacher Slides. The earlier review is retained in
[multiple_systems_improvement_plan.md](multiple_systems_improvement_plan.md).
The URL, previous/next context and old section IDs remain; `before-sharing`,
`security-monitoring` and `shared-trade-off` now point into their replacement
sections as aliases, alongside the existing `overview` alias.

Quiz version 2 has 12 questions, pass score 9. The Impact Explorer, five written
tasks and stored answer IDs remain. Quiz/progress metadata needs no version bump.

## Teacher Slide sequence

1. Opener: Data Across Multiple Systems
2. Multiple computers. Different ways to organise data.
3. Separate copies: a small furniture business
4. Why might separate copies be enough?
5. Separate copies: one change, conflicting plans
6. Divider: An alternative: shared data
7. The upgrade: one maintained order record
8. Five implications of the proposed upgrade
9. Divider: 1 · Access
10. Access: current information away from the office
11. Access: match permissions to the job
12. Access: what if the shared service stops?
13. Divider: 2 · Cost
14. Cost: compare the whole cost over time
15. Divider: 3 · Implementation
16. Implementation: make the change usable
17. Implementation: a valid date in the wrong field
18. Divider: 4 · Productivity
19. Productivity: less repeated work
20. Productivity: specialist systems can exchange updates
21. Productivity: old data creates new work
22. Divider: 5 · Security
23. Security: another device is another route in
24. Security: control what each account can do
25. Security: protect the route and both ends
26. Security: match protection to potential harm
27. Divider: Balancing the trade-offs
28. One decision creates several connected effects
29. Apply the five implications: a college
30. Impact Explorer
31. Exam technique: build a balanced answer
32. Finish by weighing the effects
33. Divider: Practice
34. Common exam mistakes (access, cost, implementation)
35. Common exam mistakes (productivity, security, applied reasoning)
36. Check your understanding
37. Exam-style practice

## Teaching and visual model

- The opening explicitly separates the number of computers from the arrangement
  of their data. Separate files and a shared source are introduced as starting
  arrangements, rather than an exhaustive choice or a claim that more computers
  automatically share updates.
- Oak & Room, a small furniture business, grounds the introduction, access, cost,
  implementation and initial security teaching. Sales, warehouse and delivery
  staff maintain named spreadsheets for order 1842. The lesson first explains
  why familiar, inexpensive local files can be sufficient with few changes;
  then a Friday-to-Monday delivery change exposes disagreement and wasted work.
  A short native reveal allows students to predict the driver's decision.
- The proposed shared order system follows the problem and precedes the five
  implications. One maintained record serves several authorised devices.
  Revision detail distinguishes logical centralisation from one physical server,
  and consistency from accuracy: a shared source can also spread a wrong value.
- Each implication has a teacher-only divider, a factor-prefixed heading and
  a matching eyebrow. Access compares an offline driver list with a current
  authorised view, without the former three-step access walkthrough. The role
  matrix and normal/outage comparison retain distinct lessons about permission
  and availability, including the limits of an offline fallback.
- Cost compares setup, operation and avoided waste over the same time period.
  Separate copies also consume resources; a shared system is not automatically
  worthwhile. Implementation follows prepare, prove and launch stages, then
  shows order 2750's delivery date mapped into an invoice-date field. A valid
  format does not establish the right meaning.
- A recruitment agency provides a fresh productivity example. Three 2-minute
  entries for a temporary worker's contact details become one: 30 weekly changes
  could free 120 minutes. These are illustrative entry-time assumptions, not
  measured savings or a promise of a lower wage bill.
- A retailer's warehouse application and web shop introduce synchronised copies
  under productivity. An automatic update removes re-entry while preserving
  specialist systems. A failed stock update then causes an order for two lamps
  when only one remains, making correction work visible. An available application
  can still contain stale data; managed copies differ from unmanaged duplication.
- Security returns to the furniture company's delivery tablet. An unlocked
  session exposes customer details. Authentication, permissions and logging
  share one focused section: permissions block actions, while logs record them
  for review and response. Connection encryption and device protection remain
  distinct, with their limits explained. Revision detail covers alteration,
  deletion and recovery as well as confidentiality.
- College sensitivity provides a short transfer example before the application
  work: public timetables, contact details and safeguarding records have different
  consequences if exposed, altered or lost. The final college sequence connects
  effects, compares all five implications and retains the Impact Explorer and
  written tasks. The former repeated centralisation introduction is folded into
  this explicit transfer to a new setting.
- The two-section evaluation pattern develops applied reasoning, weighs effects
  and supports a judgement where the command word requires it. See
  [exam_technique.md](exam_technique.md) for Pearson evidence and reuse.

The page remains static HTML with page styles in
`css/pages/data-across-multiple-systems.css`. The shared lesson shell handles
one opener, eight dividers, one misconception slide break and touch/keyboard
navigation. Student revision details stay hidden in Teacher Slides. The diagram
states use text labels as well as colour. No external imagery or new animation
is required.

## Shared walkthrough reference

This lesson no longer loads or initialises the walkthrough component. Its shared
helper and styles remain available at `javascript/core/lesson-walkthrough.js`
and `css/lesson-walkthrough.css`. A current example is the incremental restore
sequence in
[`backup-and-data-recovery.html#incremental-restore`](../pages/topics/backup-and-data-recovery.html#incremental-restore);
see [backup_recovery_lesson.md](backup_recovery_lesson.md).

The component provides previous/next/restart controls, bounded navigation,
independent instances and a readable no-JavaScript/print fallback. Its existing
regression coverage remains in `tests/lesson-walkthrough.test.mjs`.

## Validation

- Regression checks pass with `node --test tests/impact-explorer.test.mjs
  tests/teacher-dividers.test.mjs tests/lesson-walkthrough.test.mjs`. The
  walkthrough tests still cover the shared helper used elsewhere.
- Browser review covers all 37 slides at 1366×768 and 1366×900, checking 118
  default, reveal and feedback states. Teaching slides fit without overflow,
  including the longest incorrect Impact Explorer feedback. Assessment retains
  the shared scrolling surface.
- The original 12 quiz questions and answers and all five written tasks are
  byte-identical apart from section eyebrows. Quiz scoring at 12/12, reset,
  reload persistence and written-draft persistence pass.
- All six Impact Explorer consequences pass correct, incorrect and incomplete
  feedback checks, with navigation checked.
- Student views at 320px and 390px have no page-level horizontal overflow. The
  no-JavaScript fallback is checked. No browser runtime errors, duplicate IDs,
  broken anchors or HTML nesting problems were found.
- This static project has no package build/lint pipeline.
