# Backup and data recovery improvement plan

Review: 26 September 2026. Original slide numbers refer to the 42-slide version.
Keep this checklist and the final sequence in `backup_recovery_lesson.md` as a
handover if work continues in another session.

## Teaching design

Use the college's student records throughout. Define live data before the first
incident. Use the same four files and Monday–Thursday changes for every backup
type, with explicit version labels and backup boundaries. Compare arrangements
side by side where a difference matters. Keep first teaching concise, with fuller
revision details on the student page. Preserve existing anchors and assessments.

## Work packages

- [x] **Foundations (notes 1–3):** define live data; replace introductory visuals;
  explain backup versus recovery and why backup, sync and RAID serve different
  purposes; introduce full/incremental/differential before teaching each.
- [x] **Types and restores (4–8):** matching file timelines; explicit benefits,
  limitations and suitable uses; incremental recovery walkthrough showing what
  each set adds; contrasting differential restore; simultaneous animated
  comparison with Play/Pause, Previous/Next and Restart; redesigned recap.
- [x] **Storage and ownership (9–11):** clean destination diagrams; sufficient
  and insufficient protection for local failure versus site loss; offsite does
  not mean offline or immune to ransomware; clear owner/operator distinction;
  a short UK personal-data recovery obligation example with an official source.
- [x] **Frequency and recovery (12–14):** compare schedules at the same failure
  time; quantify potential loss and trade-offs; replace five recovery slides
  with a guided interactive recovery lab; show why dependencies and urgent
  services must take priority over a large, less urgent archive.
- [x] **Testing and strategy (15–17):** sourced GitLab case study; show a restore
  test and its evidence; rebuild RAID/backup incident comparisons and the complete
  strategy visual; rewrite and format scenario prompts with explicit constraints,
  tasks and qualified feedback. Reuse the new exam-technique pattern where useful.
- [x] **Teaching motion:** pedagogical animations remain available regardless of
  the operating system's reduced-motion setting. Retain explicit playback/step
  controls and hidden-page pausing. Fix existing teaching demonstrations affected
  by OS gating; retain reduced-motion behaviour for decorative/interface effects.
  Record the preference in AGENTS.md and project requirements.
- [x] **Validation and handover:** model/activity regressions; every slide at
  classroom dimensions; responsive student layout; all interactive states,
  keyboard operation, playback under reduced motion, pause/reset, persistence,
  no-JavaScript fallback, links/IDs and whitespace. Update Unit 2 tracker and guide.

## Evidence

- [GitLab's incident report](https://about.gitlab.com/blog/postmortem-of-database-outage-of-january-31/)
  (incident 31 January 2017, report 10 February 2017): use a concise original
  summary of failed backup jobs, undelivered alerts, lack of test ownership,
  recovery from an earlier snapshot and lost recent changes. Do not imply all
  repositories were deleted or that recovery was impossible.
- [ICO data-security guidance](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/security/a-guide-to-data-security/)
  checked 26 September 2026: risk-appropriate ability to restore personal-data
  availability/access and regular assessment of safeguards. Do not invent a
  universal legally required hourly/daily backup schedule or treat all important
  business data as personal data.

## Status

Complete: all work packages implemented and checked. Final sequence is 35 student
sections / 46 Teacher Slides; see `backup_recovery_lesson.md`.

Validation: 25 relevant model/component tests pass, as do the backup-interaction
and teaching-motion browser checks. All slides reviewed at classroom dimensions;
first-teaching slides and the recovery/feedback states fit 1366×768. Written-plan,
quiz and exam tasks retain their scrolling surface. Mobile widths 390px and 320px
have no page overflow. Quiz/exam content is unchanged; scoring, reset and saved
work survive reload. No-JavaScript reading, assets, unique IDs and legacy anchors
checked. Existing accepted changes to Data across multiple systems were preserved.
