# Collecting and processing data

## September 2026 redesign

34 student sections, one shared teacher opener and four section dividers produce
46 Teacher Slides (the existing six transformation questions and three pairs of
misconceptions remain separate slides). The URL, context navigation, glossary,
quiz progress and written-answer storage remain stable.

The redesign plan follows the review in this order:

| Review notes | Teaching change |
| --- | --- |
| 1–3: weak introduction, hidden examples, forgettable use cases | Begin with a canteen choosing how many lunches to prepare. Visible sales evidence leads to a decision; a separate data → process → information diagram names the stages. Illustrated attendance, bus and greenhouse examples show consequences. |
| 4–6: collection origins, terminology and context | Origin map before methods. Show a person answering a form, a greenhouse sensor supplying values and an app recording its own failed order. Define log and telemetry in context. Separate capture hardware examples and a when/where/what diagram. |
| 7–8: functions and raw data | Give raw order records their own before/after slide. Follow with six named functions without premature definitions. Raw data can be labelled; it is unprocessed for the current task, not intrinsically meaningless. |
| 9–10: validation | Problem → rule gate → four editable checks → valid versus accurate. School-trip booking starts with two passes and two failures, all untested. Test individually or together, edit, load a corrected example or reset. |
| 11–13: sorting, conversion, aggregation | Animate complete name/time/score records into alphabetical, chronological or numerical order. Show four conversion cases. Merge three till totals into one count before weather count/mean/max summaries. Records can be grouped across places or times; multiple sites are not required. |
| 14–15: analysis and reporting | Compare Monday/Friday sales across three weeks to find a repeated pattern. The following slide separates finding that pattern from communicating it in a manager's brief. A pattern alone does not establish its cause. |
| 16–17: report views and recap | Show eight orders beside count bars and a proportional pie chart. Show the editable weather source table beside its report, with held readings explicit. Retain the six-function comparison table with visual examples. |
| 18: complete journey | Seven selectable steps carry the same six weather records through collection, validation, sorting, optional conversion, aggregation, analysis and reporting. Previous/next/restart controls, current-step navigation and restrained transition animation. |
| 19: end tasks | Review all six paired transformations, 14 quiz questions and five written tasks against the new teaching. They remain applicable, including attendance, supermarket and transport transfer tasks. Their wording, scoring and saved-answer IDs remain unchanged. |

Core explanations and examples are visible. Disclosures are reserved for optional
CSV reference and assessment answer reveals. One idea per teaching section;
Teacher Slides reuse the student content. The teacher-only title opener remains
brief, with goals, ahead of the visual canteen introduction.

## Sequence

1. How many lunches should the canteen make?
2. From recorded facts to useful information
3. Different settings, decisions that matter
4. Start with the origin of the data
5. Manual collection
6. Automatic hardware collection
7. Different inputs need different hardware
8. Software records its own activity
9. Hardware captures, software records
10. Adding when, where and what
11. Raw data
12. Six processing functions
13. Bad inputs distort results
14. Validation rules
15. School-trip validation lab
16. Valid versus accurate
17. Sorting complete records
18. Sorting weather records
19. Four conversion examples
20. Temperature conversion tool
21. Aggregation using three tills
22. Weather summary choices
23. Aggregation tool
24. Analysis using repeated sales patterns
25. Editable weather trend
26. Reporting the finding to an audience
27. Raw orders, bar chart and pie chart
28. Weather records beside their report
29. Six-function recap table
30. Interactive complete journey
31. Six paired transformation questions
32. Three pairs of misconceptions
33. Quick quiz
34. Five written exam-style tasks

Dividers precede collection, raw data, report formats and practice. No teacher
prompts or per-lesson deck runtime are added.

## Components and data

- Original code-native CSS/SVG diagrams require no external assets or licences.
- `javascript/core/step-sequence.js` enhances static authored panels. Attribute
  contract: `data-step-sequence`, `data-step-panel` (each with an h3 and unique
  ID), `data-step-navigation`, `data-step-to` (zero-based index plus
  `aria-controls`), `data-step-controls`, `data-step-prev`, `data-step-next`,
  `data-step-reset`, `data-step-status`. Controls start hidden; panels start
  visible. Animation respects reduced motion; printing reveals every panel.
- `javascript/core/validation-lab.js` checks authored presence, range, integer
  and format rules. `javascript/data/data-processing-examples.js` supplies the
  booking rules, corrected values and sorting records. Input edits invalidate
  stale feedback; “Test all” never relies on the browser blocking submission.
  Each card tests its displayed rule only, not every possible rule for that field.
- `javascript/core/record-sort-demo.js` moves whole existing record nodes,
  animating their positions and preserving field relationships. Reduced-motion
  users get the same ordering without animation.
- `javascript/core/processing-tools.js` retains the numeric forms and charts.
  The report's visible source table and optional CSV use the same last successful
  weather dataset as the graph. All six records retain their original order;
  only range-accepted records contribute to the report summary and chart.
- `javascript/data/weather-records.js` retains six unsorted timestamped readings,
  including 91°C outside the illustrative station's −30°C to 55°C rule. The
  walkthrough uses these original records independently of trend-tool edits.
- Sorting weather records preserves timestamp/temperature pairs and restores
  source order on reset. Aggregation does not silently validate its input.
- Analysis checks every successive change in time order; the range rule flags
  possible anomalies. It makes no statistical or causal claim. Time spacing in
  charts is proportional; joining available readings does not invent measurements
  at missing times. Invalid edits retain the last successful graph and report;
  all-invalid inputs produce an explicit empty report.

No backend, accounts, framework or chart package. Tool experiments reset on
reload. Quiz version 2 remains 14 questions, pass 10. Existing quiz and exam-draft
storage keys and IDs are preserved because assessment content has not changed.

## Checks

Run `node --test tests/data-processing.test.mjs tests/teacher-dividers.test.mjs
tests/interface-activities.test.mjs`. Browser review covers all slides, every
journey stage, keyboard controls, reduced motion, validation edits and resets,
record sorting, numeric tools and invalid inputs, source/report agreement, quiz
scoring/persistence, exam drafts, mobile width and no-JavaScript reading.
There is no package build or lint command in this static repository.

Verified in local Chrome at 1366×768: every teaching slide and every journey
state fits at the default presentation text size. The long quiz and written-task
sections intentionally retain scrolling. Interaction checks passed for all four
validation rules and keyboard activation, record sorting, the original numeric
tools, invalid/all-rejected weather datasets, raw/report agreement, six paired
scenarios, quiz scoring/reset/reload and exam draft reload. Student layouts at
1366, 1024, 768 and 390 pixels have no horizontal page overflow. Reduced motion,
print-visible journey steps and no-JavaScript lesson/report content also passed;
no uncaught browser errors. Node regressions, JavaScript syntax, HTML reference
checks and whitespace checks passed.
