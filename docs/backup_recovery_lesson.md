# Backup and data recovery

The existing lesson URL and context navigation remain. Twenty-five student
sections become 42 teacher slides: one shared opener, five existing dividers,
two separate restore-chain chunks, five recovery states, four strategy decisions
plus the written plan, and two misconception chunks. Old `#why-backup`,
`#overview`, `#recovery-planning` and `#backup-vs-resilience` links still resolve.
Long written work and assessments use the shared deck's scrolling surface.

## Final Teacher Slide sequence

1. Opener: Backup and Data Recovery
2. Something went wrong: Friday 15:40
3. Why live data can be lost
4. Backup vs recovery
5. Backup is not just “another copy”: backup / sync / RAID
6. Divider: Backup procedures
7. Full backup timeline
8. Incremental backup timeline
9. Incremental restore chain
10. Differential backup timeline
11. Differential restore chain
12. Backup Strategy Visualiser
13. Full / incremental / differential recap
14. Divider: Where backups are kept
15. Storage destinations
16. Onsite: local device failure
17. Offsite: site-wide incident
18. Location vs management
19. Backup frequency and potential loss window
20. Divider: Data recovery
21. Friday incident: what now?
22. Identify
23. Select
24. Restore
25. Verify
26. Return service
27. Recovery priorities
28. Recovery time
29. Test restores
30. RAID vs backup scenarios
31. Divider: Designing a backup strategy
32. Complete strategy map
33. Strategy choice 1: backup type
34. Strategy choice 2: frequency
35. Strategy choice 3: location
36. Strategy choice 4: management
37. Written recovery plan and example judgement
38. Divider: Practice
39. Misconceptions: RAID, sync and incremental
40. Misconceptions: differential restore, recoverability and offsite management
41. Existing quiz
42. Existing exam practice

All five section-divider placements and titles are preserved. The opener uses
`template[data-teacher-opener]` before the first teaching section, with the framing
question “What happens when important data is lost?” and four goals covering types,
storage, restoration and justified strategy. No shared opener, lesson shell or
shared lesson stylesheet changes were needed. See `teacher_section_dividers.md`.

## Teaching example and visualiser

Friday afternoon: college student records are corrupted. Thursday's recoverable
copy may exist, but Friday's later attendance changes are not recreated by
restoring that copy. Recovery must select a usable point before the damage.

`javascript/data/backup-example.js` defines four fictional files and four days:
Monday baseline, Tuesday attendance change, Wednesday contact change, Thursday
course change. Static teaching timelines, generated from the existing example/model during
authoring, introduce each type before comparison. Native day disclosures reveal
Monday–Thursday file versions. All three timelines share the same file tokens
and labels as the visualiser; versions above v1 have a border cue plus a textual
version badge. Version numbers, not colour, carry the change information.

- Full copies all selected files each day; restore the latest suitable full.
- Incremental copies changes since the preceding backup; restore Monday full
  plus the required Tuesday, Wednesday and Thursday incremental chain.
- Differential copies changes accumulated since Monday full; restore Monday
  full plus Thursday differential.
- File version numbers make the same final Thursday state visible for every
  strategy. Recovery gathers the required sets into an explicitly labelled chain,
  with file contents and version badges rather than colour-only selection.

`javascript/core/backup-model.js` contains pure set/version and restore-chain
logic plus a small strategy/reset state transition. `backup-visualiser.js` and
`css/backup-visualiser.css` render native radio selection, file cards and restore
results. The selector precedes the timeline and the restore action follows it. Recovery
replaces the timeline visually with the required sets and their actual file
versions, linked in restore order, followed by the recovered Thursday files.
The underlying set-building, selection and restore logic are unchanged. Switching
strategy clears old restore output; reset returns to Full and reveals the timeline. Experiments are
session-only and do not access the filesystem or any external service.

This is a deterministic whole-file model, not byte-level backup software. File
counts are not storage-size estimates. It assumes intact required sets and omits
deletion records, retention algorithms, synthetic fulls, compression and real
scheduling. The lesson explains that missing chain sets can prevent recovery.

## Other visuals and reuse

The Friday incident dashboard shows the unavailable college system, Thursday's
23:00 backup and potentially missing Friday attendance. Causes of loss are now a
separate short follow-up. Backup versus recovery uses a failure boundary; backup,
synchronisation and RAID use one file scenario with qualified, revealable outcomes.

Storage destinations surround the college server. The same two-site diagram first
shows a local drive failure, then switches from available systems to a site-wide
incident. A tape icon at the separate physical site avoids equating offsite with
cloud. Fuller original media/location explanations remain in student-only revision
supplements. A 2×2 matrix separates location from management responsibility.

Frequency switches between daily and hourly intervals on one proportional time
scale: 16 hours versus 37 minutes of changes potentially at risk. The text states
that failed jobs can extend the gap. Recovery duration contrasts illustrative
36-hour and 2-hour downtime, then reveals retrieval, transfer, restore and checks.

Recovery reuses the existing `data-slide-break` mechanism for five states of the
same backup → recovery environment → live service diagram. The focus moves from
failure to selecting a copy, restoring, verifying and returning service. This is
presentation markup, not a new stepper runtime. Priorities are an illustrative
outage queue based on criticality and dependencies, not file size or a universal
ranking. Restore testing challenges the job-success message and reveals checks
and possible failures; successful samples provide evidence rather than guarantees.

The RAID server remains alongside four native scenario disclosures: drive failure,
deletion, encryption by ransomware and site loss. Suitable fault-tolerant RAID can
help availability; independent protected backups enable historical recovery.
The final strategy diagram gathers seven short decision labels around recoverable
data. Misconceptions use two teacher chunks and native correction disclosures.

Page styling is scoped to `css/pages/backup-and-data-recovery.css`. Shared changes
are limited to `backup-visualiser.js` (render file contents within restore sets and
compact status) and `css/backup-visualiser.css` (matching file tokens and chains).
`backup-model.js`, the example dataset, paired-scenario logic and lesson shell are
unchanged. No animation, dependency or real file operation was introduced.

## Strategy activity and assessment

Four choice/reason cards reuse `paired-scenarios.js`, configured by
`javascript/data/backup-strategy-scenarios.js`. Learners justify type, active-record
frequency, location and management. Existing slide chunks present one decision
at a time, followed by the original written plan; the normal page retains all
choices. Original form nodes preserve selections and feedback across navigation.
Repeated scenario context is shown only once on the student page. Feedback explains benefits and limitations of
each selected choice; it does not certify a whole plan as correct. In particular,
weekly copying can match a resource-saving rationale while remaining unsuitable
for frequently changing student records. The written recovery plan and example
judgement address separate archive schedules, priorities and restore tests.

The shell retains quiz scoring/reset/persistence and written draft storage.
Quiz version 2 has 14 questions, pass 10, with a new answer key in localStorage
and matching shared unit-progress metadata. Six applied written tasks use 4, 4,
6, 6, 8 and 12 marks. New response IDs prevent old answers appearing under changed
questions. The strategy-plan textarea uses the same existing draft infrastructure.

## Scope and verification

No real backup operations, uploads/downloads, vendors, enterprise disaster-recovery
architecture, detailed RPO/RTO terminology, cryptographic key-management procedures,
replication or high-availability design. Those depths are deliberately deferred.
Priorities are reasoned scenario cards, not a forced universal ranking.

Relevant regression command:
`node --test tests/backup-model.test.mjs tests/interface-activities.test.mjs tests/teacher-dividers.test.mjs`

Browser checks cover all strategies and recovered versions, required restore sets,
keyboard radio switching, reset, conditional strategy feedback, quiz scoring/reset/
reload, strategy and exam drafts, teacher dividers and interaction exclusion,
mobile overflow, local SVG loading and runtime errors. Syntax, unique-ID/link and
whitespace checks also apply. No package-based build or lint pipeline is configured.

## Second-pass verification

All 12 existing `tests/*.test.mjs` files pass. No new tests were added for static
markup. Existing backup-model state/chain coverage remains unchanged. JavaScript
syntax and whitespace checks pass. Quiz/exam content and the written strategy
plan were compared with HEAD and are unchanged apart from section eyebrow numbers.

Local Chrome checks passed for all three strategies and recovered versions,
required restore chains, keyboard radio changes, reset, conditional choice feedback,
choice retention across teacher chunks, quiz scoring/reset/reload, saved strategy
and exam drafts, native keyboard reveals, opener, all 42 deck entries, student
restoration, unique IDs/sidebar targets, local images and expanded mobile width.
Screenshots were inspected for the opener, teaching states and restore views.
At 1366×900, expanded teaching and visualiser recovery states fit; the original
long written plan/guidance, quiz and exam practice remain scrollable. No runtime
errors were observed. No package-based build/lint pipeline is configured.
