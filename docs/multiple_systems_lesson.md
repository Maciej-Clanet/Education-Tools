# Data across multiple systems

The existing URL, `#why-multiple-systems` anchor, context navigation and lesson
shell remain. The old `#overview` anchor is retained as an alias in the opening
section. Twenty student sections become 24 teacher slides with four inert divider
templates. Long activities and practice use the shared deck's scrolling surface.

## Final teaching order

1. Why use data across multiple systems?
2. The problem with disconnected systems
3. Shared and connected data
4. Five questions to ask
5. Access: the right data for the right people
6. Access permissions in our college
7. Cost: more than the purchase price
8. What does implementation mean?
9. What can go wrong during implementation?
10. Productivity: remove repeated work
11. Security: more routes need protection
12. Why sensitivity matters
13. The five factors affect each other
14. Another trade-off: replace separate records
15. Worked college scenario
16. Impact Explorer
17. How to write a balanced answer
18. Common exam mistakes
19. Check your understanding
20. Exam-style practice

Teacher-only dividers precede sections 1 (Why organisations connect systems),
4 (The five implications), 13 (Making a judgement), and 18 (Practice).
They are excluded from student Jump To links and content by the shared shell.

## Recurring scenario and visuals

An illustrative college shares student information between attendance, reception,
teacher views, reporting and finance/admin. Alex Smith's course/contact update
shows why disconnected copies disagree and how reliable sharing helps staff and
students. This is a conceptual model, not a physical database/network design.

Visuals use the current A3 notebook cards and semantic HTML/CSS: disconnected
record cards, a shared-information source feeding authorised uses, a role/access
matrix, initial/ongoing cost groups, an implementation sequence, productivity
before/after flows and decision-to-factor cards. Visible text describes every
relationship; meaning does not depend on colour or decorative icons.

Access, cost, implementation, productivity and security are taught separately,
then connected through remote access and a shared-platform decision. Examples
include mixed security effects and short-term training costs versus later gains.
Worked and written answers emphasise benefit → impact → trade-off → application
→ conditional judgement, including effects on individual students.

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
