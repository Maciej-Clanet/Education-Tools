# Backup and data recovery

Updated 26 September 2026. The lesson has 35 student sections and 46 Teacher
Slides, including the shared opener and five section dividers. The saved work
plan is [backup_recovery_improvement_plan.md](backup_recovery_improvement_plan.md).
The existing URL, unit context, previous/next links, glossary, quiz and written
response keys remain. Existing `#why-backup`, `#overview`, `#recovery-planning`
and `#backup-vs-resilience` anchors still resolve.

## Final Teacher Slide sequence

1. Opener: Backup and Data Recovery
2. Define live data: current working records versus a retained recovery copy
3. Friday 15:40: college records are corrupted
4. Causes of loss and the protection each needs
5. Backup before failure; recovery after failure
6. One deletion incident: backup, sync and RAID serve different purposes
7. Divider: Backup procedures
8. Introduce three procedures using the same four files and daily changes
9. Full backup timeline
10. Full: advantage, trade-off and suitable use
11. Incremental timeline: moving reference point
12. Incremental: advantage, trade-off and suitable use
13. Interactive incremental restore: build the recovered files in four steps
14. Differential timeline: fixed full-backup reference point
15. Differential: advantage, trade-off and suitable use
16. Differential restore: Monday full plus Thursday differential
17. Simultaneous animated comparison of the same daily changes
18. Full/incremental/differential recap table
19. Divider: Where backups are kept
20. Storage destinations and their practical limitations
21. Onsite copy survives a local drive failure
22. Offsite copy survives an incident affecting the college site
23. Organisation's responsibility versus in-house/provider operation
24. Personal-data recovery duties, with ICO source
25. Daily and hourly schedules compared at the same failure time
26. Divider: Data recovery
27. Newest is not always usable: select a point before the damage
28. Interactive five-stage recovery lab
29. Priorities: urgent registers before the large archive
30. Recovery duration: retrieve, transfer, restore and check
31. Restore-test evidence versus a successful copy job
32. GitLab incident case study, with primary source
33. RAID and backup responses to four incidents
34. Divider: Designing a backup strategy
35. Join data, timing, location, ownership and recovery decisions
36. Strategy choice: backup procedure
37. Strategy choice: frequency and the one-hour loss limit
38. Strategy choice: local recovery and site-loss protection
39. Strategy choice: who operates the backups
40. Written plan and example judgement
41. Shared evaluation technique applied to a backup choice
42. Divider: Practice
43. Misconceptions: RAID, sync and incremental
44. Misconceptions: differential restore, recoverability and offsite management
45. Existing 14-question quiz
46. Existing six exam-style tasks

Written work and assessments retain the shared scroll surface. First-teaching
sections are concise; supplementary detail uses student revision disclosures.
No teacher prompts, backend, real backup operation or external service is added.

## Shared example and interactions

`javascript/data/backup-example.js` and `javascript/core/backup-model.js` define
Monday's four v1 files, Tuesday's attendance change, Wednesday's contact change
and Thursday's course change. Each static timeline uses the same versions as the
interactive comparison. Full copies all selected files; incremental copies
changes since the previous backup; differential copies changes since the last
full. Recurring changed files keep their latest version (covered by model tests).

The new `javascript/core/backup-comparison.js` and `css/backup-comparison.css`
show the live files and all three procedures simultaneously. Previous/Next day,
Play/Pause and Restart are native buttons. Copy motion maps each destination
file back to the matching live file. Playback stops at Thursday, pauses offscreen
or when the page is hidden, and deliberately ignores OS reduced motion. Changed
files have text version labels as well as a border/badge cue. The model represents
whole files: counts are not byte sizes, transfer-time estimates or a guarantee
about real software. Deletions, compression and specialised backup features are
outside this introductory example.

Incremental restore uses `lesson-walkthrough.js`: each step applies one required
set to the accumulated recovered files. Differential restore shows why earlier
differentials are unnecessary when the latest suitable one contains their changes.
All walkthrough steps remain readable without JavaScript and in print. The older
`backup-visualiser.js` is no longer loaded by this lesson.

`javascript/core/recovery-lab.js` uses `javascript/data/recovery-scenario.js` for
five stages: identify/contain, select, restore, verify and return service. A newer
Friday copy includes corruption; the checked Thursday point is usable. No choice
or a damaged/unknown copy cannot advance past selection. Restoring does not
immediately reopen the service: verification and reopening remain separate stages.
Previous and Restart are bounded, the copies have a labelled radio group, status
and feedback are announced, and all actions remain within the slide. The static
five-stage fallback is available without JavaScript and in print. Exploration is
temporary; it does not alter saved student work.

## Context and examples

- Live data is defined before the incident and added to the glossary. It need not
  be online. Recovery point is also defined.
- One deletion scenario distinguishes historical recovery, synchronisation and
  RAID fault tolerance, including qualifications about sync history and RAID levels.
- Identical two-site diagrams contrast a failed local drive with a flooded site.
  Offsite is not automatically offline, cloud-based, provider-managed or protected
  against ransomware. Storage choices include advantages and practical limitations.
- Ownership remains with the college regardless of who operates the service.
  The legal slide concerns UK personal data and risk-appropriate recovery/testing;
  it does not invent a universal legally mandated backup frequency. Source:
  [ICO data-security guidance](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/security/a-guide-to-data-security/).
- At Friday 15:40, a usable midnight copy leaves a 15h40 window; a 15:00 copy leaves
  40 minutes. Both bars share a 16-hour scale. The assumption is completed usable
  recovery points; failed jobs can extend the loss window. Backup load is the trade-off.
- Restore priorities use identical five-hour workloads: four hours of archive
  followed by one hour of essential service versus the reverse. Registers become
  available after five hours or one hour. Dependencies must be restored first.
- A two-hour recovery budget explicitly includes retrieval, transfer, restoration
  and checks; it is an illustrative example, distinct from potential lost work.
- The GitLab case links to its [incident report](https://about.gitlab.com/blog/postmortem-of-database-outage-of-january-31/).
  It distinguishes database-record loss from code repositories and connects the
  outcome to monitoring, restore testing and assigned responsibility.

## Strategy and assessments

Every strategy task shows Situation and Your task. Choice/reason feedback uses
`paired-scenarios.js` and `backup-strategy-scenarios.js`. Frequency now accepts only
hourly/recent against the stated one-hour tolerance; saving resources with daily
or weekly copying does not satisfy that constraint. Location accepts both/balance
for quick local recovery plus a separate copy against site loss. Procedure and
management choices retain qualified alternative answers and explicit limitations.
These activities do not automatically mark the written justification.

The evaluation slide reuses `css/exam-technique.css`; see `exam_technique.md` for
Pearson evidence and scope. It demonstrates choice, impact, application, trade-off
and a conditional judgement. It is a developed example, not a complete extended
answer or a universal answer formula.

Quiz content is unchanged: version 2, 14 questions, pass 10. Unit progress metadata
and the lesson's quiz config therefore remain unchanged. Six written tasks retain
4, 4, 6, 6, 8 and 12 marks, original response IDs and saved drafts. The written
strategy plan keeps `v2-strategy-plan`.

## Validation

- All 46 slides reviewed visually; desktop layouts checked at 1366×900 and
  1366×768. Normal pages checked at 390px and 320px without horizontal overflow.
- Comparison versions, step bounds, replay/end/pause, offscreen pausing and visible
  copy animation under OS reduced motion verified in headless Chrome.
- Recovery selection guards, all stages, Previous/Restart, keyboard Enter, feedback
  and slide-navigation isolation checked. No-JavaScript and print reading fallbacks
  remain present. Local images load; source links and legacy IDs retained.
- Quiz 14/14, reset, genuine reload persistence and written-draft persistence checked.
- `tests/backup-model.test.mjs`, `tests/backup-recovery.test.mjs` and
  `tests/lesson-walkthrough.test.mjs` cover versions/chains, scenario requirements,
  recovery guards and walkthrough state. Related teaching component regressions pass.
- Browser regressions: `tests/backup-recovery.browser.mjs` and
  `tests/teaching-motion.browser.mjs`. They use the existing browser-session helper,
  a local server on 8765 and a dedicated Chrome debugging profile on port 9226.
  Override `FLEXBOX_TEST_ORIGIN` / `FLEXBOX_CDP_ORIGIN` if needed; screenshots are
  optional through `FLEXBOX_SCREENSHOTS`. Use an isolated profile: tests create
  local answers and preferences. The in-app browser had no available session,
  so this review used local headless Chrome.

See `teaching_motion.md` for the related correction to existing teaching animations.
