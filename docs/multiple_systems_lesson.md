# Data across multiple systems

The existing URL, `#why-multiple-systems` anchor, context navigation and lesson
shell remain. The old `#overview` anchor is retained as an alias in the opening
section. Twenty-three student sections become 28 teacher slides using the existing
opener/divider templates and one existing `data-slide-break` for misconceptions.

## Final Teacher Slide sequence

1. Lesson opener: Data Across Multiple Systems
2. Why use data across multiple systems?
3. The problem with disconnected systems
4. Shared and connected data
5. Divider: The five implications
6. Five questions to ask
7. Access: the right data for the right people
8. Access permissions in our college
9. Shared access creates a dependency
10. Cost: more than the purchase price
11. What does implementation mean?
12. What can go wrong during implementation?
13. Productivity: remove repeated work
14. When poor integration creates extra work
15. Security: more routes need protection
16. Protect each route
17. Why sensitivity matters
18. Divider: Balancing the trade-offs
19. The five factors affect each other
20. Another trade-off: replace separate records
21. Worked college scenario
22. Impact Explorer
23. How to write a balanced answer
24. Divider: Practice
25. Misconceptions: access, cost and implementation
26. Misconceptions: productivity, security and applied answers
27. Check your understanding
28. Exam-style practice

The shared lesson opener replaces the redundant introductory divider so Next
enters the first teaching section immediately. Its subtitle is “What changes when
several systems need the same data?” Four concise goals cover organisational
sharing, the five factors, connected consequences and balanced judgements.
The old “Making a judgement” divider is renamed “Balancing the trade-offs”;
the other two transition placements are preserved. No shared opener/runtime or
shared stylesheet changes are needed. Authoring remains documented in
[teacher_section_dividers.md](teacher_section_dividers.md).

## Recurring scenario and visual composition

Alex Smith's course/contact record sits in the same semantic HTML/CSS college
map throughout: reception above, teacher/attendance left, reporting right and
finance/admin below. Disconnected copies lose the connecting lines and show old
versus new fields. Connected systems use relevant current information; this
remains a conceptual model, not one physical database or network architecture.
The same map shows an unavailable service, stale synchronised copies and broader
staff/device access. Text states and labels carry meaning independently of colour;
the SVG connection lines are decorative and hidden from assistive technology.

- Access now separates current authorised information, a concise VIEW / EDIT /
  NO ACCESS matrix, and shared-service dependency. Safeguarding requires separate
  authorisation; illustrative job titles do not imply entitlement to every field.
- Native reveals replace a before workflow with its after diagram for access,
  productivity and expanded security routes. Closing restores the before view.
- The illustrative £20,000 purchase grows into introduction and ongoing cost
  items, followed by potential savings. No invented universal total is given.
- A numbered implementation timeline shows the whole move. One migration example
  puts Alex's date of birth in the course-start field; a reveal compares against
  the source and fixes the mapping. Other risks remain in revision supplements.
- Productivity compares UPDATE / UPDATE / UPDATE against UPDATE ONCE. A separate
  synchronisation-failure diagram shows extra checking and correction work.
- Security introduces expanding access routes before a second slide reuses them
  with identity, permission, connection, device and monitoring controls. A final
  reveal retains the potential for consistent permissions and central monitoring.
- A sensitivity scale distinguishes public, personal and highly sensitive data
  while preserving the need to protect public information from alteration.
- One remote-work decision branches into five progressively disclosed effects.
  The second trade-off becomes a short application question. The worked college
  decision reveals three applied implications and a conditional judgement.
- The answer-building sequence grows from benefit through impact, trade-off and
  application to judgement. Misconceptions use two existing teacher chunks with
  three revealable corrections each; the student page retains the full set.

Page-scoped `.systems-revision` details keep broader explanations on the normal
page and hide them in Teacher Slides. Native details/summary controls support
keyboard input without a new interaction runtime; named groups allow one focused
consequence at a time. No animations or new motion effects were added. Narrow
screens stack maps and allow the permissions matrix to scroll within its wrapper.

## Impact Explorer

- `javascript/data/college-impacts.js`: six consequences and supported
  factor/impact pairs, with applied explanations.
- `javascript/core/impact-explorer.js` and `css/impact-explorer.css`: reusable
  native-checkbox/radio activity,
  one consequence at a time; reuses `evaluateScenarioPair` from the shared paired
  scenarios component. The shell and existing quiz-answer/button patterns handle
  presentation and interaction exclusion in teacher mode.
- Learners choose one or more factors and an overall Benefit, Concern or Could
  be both. The tone applies to the stated consequence as a whole.
- Any supported subset receives positive feedback; other direct links are
  suggested rather than demanded. Unsupported selections prompt reconsideration
  and explain the consequence. This is reasoning practice, not a quiz score.
- Previous/next preserve each response and checked feedback within the page
  session. Reset clears only the current consequence. Editing clears stale
  feedback. Navigation is bounded and moves focus to the new statement.
- Experiments reset on reload. No new storage scheme or simulation framework.
- Second pass changes only presentation: larger current consequence, compact
  factor labels in Teacher Slides and reduced spacing. All options, multi-factor
  reasoning, previous/next state, feedback and reset behaviour remain unchanged.

## Assessment and persistence

Quiz version 2: 12 questions, pass score 9. The answer storage key and shared unit
progress metadata are updated together. Scoring, reset and local persistence are
unchanged shared behaviour. Five written tasks (4, 4, 6, 8 and 12 marks) retain
on-page locally saved drafts and applied answer guidance. New response IDs avoid
showing old answers under changed questions; old drafts are not migrated.

## Scope and checks

Permissions, data sensitivity and implementation safeguards stay high-level.
No network design, distributed databases, APIs, cloud architecture, security
operations or backup/recovery procedures are taught here. Backup/fallback is
mentioned only as a changeover precaution; recovery is the next lesson.

Relevant regression command:
`node --test tests/impact-explorer.test.mjs tests/interface-activities.test.mjs tests/teacher-dividers.test.mjs`

Browser verification covers multiple selections, benefit/concern/both feedback,
per-consequence state/reset, keyboard use, quiz scoring/reset/reload, exam drafts,
student/teacher dividers, desktop/mobile layout and runtime errors. Also check
JavaScript syntax, local links/IDs and `git diff --check`. No package-based
lint or build pipeline is configured in this static project.

## Second-pass verification

All 12 existing `tests/*.test.mjs` files passed; no new tests were added for static
markup/layout. Quiz questions and exam task content were compared against HEAD
and are unchanged apart from section eyebrow numbering. No package lint/build
pipeline is configured. Whitespace, duplicate IDs and sidebar targets were checked.

Local Chrome checks cover multi-factor Benefit/Concern/Could be both, unsupported
choices, per-consequence state, reset, keyboard input/focus, quiz scoring and reload,
exam drafts, opener and section navigation, teacher/student separation, all 28 deck
entries, expanded disclosures and mobile page width. Screenshots were reviewed
for the opener, every slide and mobile layouts. No runtime errors were observed.
Long quiz/exam sections continue to use the shared scrolling presentation surface.
