# Data across multiple systems: improvement plan

Review date: 26 September 2026. Keep this file as the handover checklist if work
continues in another session. The original slide numbers below refer to the
28-slide deck reviewed by the user, not the revised sequence.

## Teaching approach

Follow Alex Smith's student record through named college computers and systems.
Introduce separate local copies and shared data before comparing their effects.
Centralised storage is one way of sharing data; connected applications may also
keep synchronised copies. Do not equate several devices with several independent
databases, or imply that centralisation removes the need for networks/protection.
Use plain Level 3 language, visible causes and consequences, and one main idea
per teaching slide. Use diagrams for relationships, recognisable PC silhouettes
for endpoints, and text labels as well as colour for every state.

## Work packages and review coverage

- [x] **1. Establish the problem and earn the solution** (notes 1–4; old slides
  2–4): introduce the two arrangements; show who needs which data; identify each
  separate PC/application; show an actual course mismatch and consequence without
  question/answer dropdowns; bridge the need for one maintained record into the
  solution; distinguish centralised access from synchronised copies.
- [x] **2. Access and decision criteria** (notes 5–8; old slides 6–9): explain that
  the five questions evaluate a proposed change; replace the compass; create an
  accessible previous/next/reset walkthrough comparing requests for copies with
  authorised shared access; restyle the permissions matrix; show available and
  unavailable service states together, without a diagram-changing reveal.
- [x] **3. Costs, implementation and productivity** (notes 9–13; old slides
  10–14): identify the student-information software, setup work and running costs;
  remove the arbitrary £20,000 price; show a move into use, a bad field mapping
  beside a corrected mapping, a measurable illustrative reduction in repeated
  entry, and the consequences of a failed update between applications.
- [x] **4. Security** (notes 14–15; old slides 15–17): show a concrete exposure
  and its control; separate identity/permissions, protection of data/devices and
  monitoring; explain each control's limits; improve sensitivity/harm visuals.
- [x] **5. Connect effects and apply** (notes 16–18; old slides 19–21): visual
  chains from remote access to several factors; explicitly name the move from
  departmental copies to centralised records; compare before/after impacts in
  the same college; retain the existing multi-factor Impact Explorer.
- [x] **6. Exam technique** (note 19): verify against Pearson Computing Unit 2
  (2016 qualification, not IT Unit 2); preserve benefit → impact → trade-off →
  application → judgement while making scenario links run through the answer;
  add explicit weighing. Make a reusable static visual pattern and authoring
  guidance. Apply to this lesson only; future lessons can reuse it near practice.
- [x] **7. Verify and document**: desktop/student/mobile/Teacher Slides visual
  review, walkthrough keyboard/bounds/reset, existing activity and lesson-shell
  regression tests, quiz/draft persistence, links/IDs/whitespace. Keep quiz v2
  (12 questions, pass 9) and written tasks unchanged unless a defect requires it.
  Update the lesson guide, Unit 2 tracker and shared exam-technique guidance.

## Pearson evidence and constraints

Checked the official [Unit 2 sample assessment materials](https://qualifications.pearson.com/content/dam/pdf/BTEC-Nationals/computing/2016/specification-and-sample-assessments/Sample-assessment-material-Unit-2-Fundamentals-Of-Computer-Systems.pdf),
printed pp. 29–31 (PDF pp. 30–32), questions 3(c) and 3(d), on 26 September 2026.
The 12-mark evaluation rewards relevant reasoning, consideration of competing
effects, attention to importance in the scenario, and a supported conclusion.
The 8-mark explanation has a different descriptor and no conclusion requirement.
Therefore this is a flexible teaching scaffold, not a Pearson-mandated formula or
a full 12-mark answer. Follow the actual command word and question. Do not teach
that every high-mark answer needs a recommendation, or that five sentences/five
factor definitions earn full marks. Our worked examples are original.

## Handover / validation log

- All seven work packages completed in this session. Final sequence: 29 student
  sections / 34 Teacher Slides; recorded in `docs/multiple_systems_lesson.md`.
- 14 relevant automated tests pass, including walkthrough bounds, restart,
  independent instances, idempotent setup and incomplete-markup fallback.
- Browser checks pass for quiz scoring/reload, written drafts, Impact Explorer
  feedback/navigation/reset, keyboard walkthrough controls and slide navigation.
- Reviewed every non-assessment teaching slide at 1366×900; all 32 also fit
  1366×768 without scrolling after spacing adjustments. Quiz/exam practice keep
  the existing scrolling surface. Mobile checks at 390px and 320px show no
  page-level horizontal overflow; the permissions table scrolls within its wrapper.
- No-JavaScript walkthrough and high-contrast views checked. No new motion.
  No browser exceptions, broken local asset/link targets or duplicate IDs.
- Quiz, written task and Impact Explorer markup compared with the original and
  retained (apart from section numbering). Quiz version and saved-answer IDs stay
  unchanged. Source evidence and reusable exam markup are in
  `docs/exam_technique.md`; project notes and Unit 2 tracker are updated.
- No remaining implementation work. Future teacher feedback can use section
  anchors or the final slide list rather than the original review numbers.
