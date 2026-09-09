# Collecting and processing data

The existing lesson URL and unit context are retained. The first-teaching order
has 28 student sections and four inert teacher-divider templates (32 teacher
slides). Long quiz, practice and tool slides use the existing scrolling deck.

## Final teaching order

1. Why collect data?
2. Data vs information
3. Where is collection used?
4. How is data collected?
5. Manual data collection
6. Automatic hardware collection
7. Software/system-generated collection
8. Hardware and software work together
9. Collection worked example
10. Raw data needs processing: six-function toolbox
11. What is validation?
12. Try a validation rule
13. What is sorting?
14. Try sorting weather records
15. What is conversion?
16. Try converting a temperature
17. What is aggregation?
18. Try aggregating readings
19. What is analysis?
20. Explore the weather trend
21. What is reporting?
22. Report view vs raw data
23. Six processing functions: revision comparison
24. Complete data-processing journey (one possible sequence)
25. Which processing function happened?
26. Common exam mistakes
27. Check your understanding
28. Exam-style practice

Teacher dividers precede sections 4 (Collecting data), 10 (Processing functions),
22 (From raw data to information) and 25 (Practice). The shared shell supplies
“Next”, hides them for students and excludes them from Jump To.

## Data and components

- `javascript/data/weather-records.js`: six intentionally unsorted timestamped
  readings, including 91°C outside the teaching station's −30 to 55°C rule.
- Collection first demonstrates a single 14.2°C record; subsequent processing
  uses rounded whole-degree values for readable arithmetic.
- Sorting preserves complete records and restores original order on reset.
  It uses the starting dataset independently of the trend editor.
- Validation and Celsius conversion use independent editable single values.
- Aggregation accepts 1–24 comma-separated finite numbers and offers count,
  total, average, minimum and maximum. Defaults are the five accepted weather
  readings. It does not silently validate or remove user-entered values.
- Analysis plots all six editable readings in time order. Trend classification
  compares successive values: increasing, decreasing, steady or mixed. Anomalies
  are deterministic range-rule flags, not statistical or causal discoveries.
- Reporting and raw CSV use the same latest successfully plotted records.
  The chart and mean/high summaries use accepted readings; rejected readings
  appear explicitly in an exception note. The raw view retains all six original
  records and their original order, without padding or invented observations.
  Timestamp spacing is proportional; connecting lines do not claim measurements
  at omitted times. All-invalid datasets produce an explicit empty summary.
- `javascript/core/data-processing.js`: small pure numeric helpers.
- `javascript/core/processing-tools.js`: focused native forms and a shared SVG
  chart renderer with exact readings in a visible text alternative. Numeric
  inputs reject blanks, non-finite numbers and magnitudes above 1,000,000.
  Invalid edits retain the last successful graph and report with an explanation.
- `javascript/data/data-processing-scenarios.js`: six transformation/reason
  matches using the existing `paired-scenarios.js` component.
- Local SVG scenario illustrations and page-scoped CSS use the shared visual
  language. No new framework, service, account or chart dependency.

Tool experiments reset on reload; quiz and exam drafts use existing persistence.
Quiz version 2 has 14 questions, pass score 10, and a new answer storage key.
Unit progress metadata matches. New exam field IDs avoid attaching old answers
to different questions; prior saved drafts are not migrated into these tasks.

## Scope and verification

Intentionally limited to simple range validation, Celsius/Fahrenheit conversion,
six fixed timestamps, lightweight descriptive analysis and a six-row raw report.
No SQL, advanced statistics, machine learning or sensor electronics. Multi-system
access/cost/security impacts and backup/recovery remain in later A3 lessons.

Regression checks: `node --test tests/data-processing.test.mjs
 tests/teacher-dividers.test.mjs tests/interface-activities.test.mjs`.
Browser checks cover editable tools/reset, invalid inputs, empty reports, raw/report
correspondence, paired feedback, quiz scoring/reset/reload, exam drafts, teacher
navigation and mobile overflow. Syntax and whitespace checks also apply.
