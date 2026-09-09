# Backup and data recovery

The existing lesson URL and context navigation remain. The lesson has 24 student
sections and five inert teacher-divider templates (29 teacher slides). Old
`#why-backup`, `#overview`, `#recovery-planning` and `#backup-vs-resilience` links
still resolve. The shared deck supplies scrolling for longer activities.

## Final teaching order

1. Something went wrong
2. Backup vs recovery
3. Backup is not just “another copy”
4. Full backup
5. Incremental backup
6. Differential backup
7. Compare backup strategies (visualiser)
8. Full vs incremental vs differential (revision comparison)
9. Where can backups be stored?
10. Onsite backups
11. Offsite backups
12. Who manages the backup?
13. How often should backups happen?
14. The failure happened. What now?
15. Recovery procedure
16. What should be restored first?
17. Having a backup is not enough (recovery time)
18. How do you know a backup works?
19. Why RAID is not a backup
20. What makes a good backup strategy?
21. Choose a backup strategy
22. Common exam mistakes
23. Check your understanding
24. Exam-style practice

Teacher dividers precede sections 4 (Backup procedures), 9 (Where backups are
kept), 14 (Data recovery), 20 (Designing a backup strategy) and 22 (Practice).
They do not appear in student content or Jump To navigation.

## Teaching example and visualiser

Friday afternoon: college student records are corrupted. Thursday's recoverable
copy may exist, but Friday's later attendance changes are not recreated by
restoring that copy. Recovery must select a usable point before the damage.

`javascript/data/backup-example.js` defines four fictional files and four days:
Monday baseline, Tuesday attendance change, Wednesday contact change, Thursday
course change. Static teaching examples introduce each type before comparison.

- Full copies all selected files each day; restore the latest suitable full.
- Incremental copies changes since the preceding backup; restore Monday full
  plus the required Tuesday, Wednesday and Thursday incremental chain.
- Differential copies changes accumulated since Monday full; restore Monday
  full plus Thursday differential.
- File version numbers make the same final Thursday state visible for every
  strategy. Restore cards are labelled “Needed”/“Not needed”, not colour alone.

`javascript/core/backup-model.js` contains pure set/version and restore-chain
logic plus a small strategy/reset state transition. `backup-visualiser.js` and
`css/backup-visualiser.css` render native radio selection, file cards and restore
results. The restore action and live status sit above the timeline. Switching
strategy clears old restore output; reset returns to Full. Experiments are
session-only and do not access the filesystem or any external service.

This is a deterministic whole-file model, not byte-level backup software. File
counts are not storage-size estimates. It assumes intact required sets and omits
deletion records, retention algorithms, synthetic fulls, compression and real
scheduling. The lesson explains that missing chain sets can prevent recovery.

## Other visuals and reuse

The lesson reuses existing storage/server SVGs and A3 notebook card/flow patterns.
Three local SVGs in `assets/images/backup/` show a remote copy, same-building risk
and a physically separate site. Captions/alt text explain those relationships.
Location (onsite/offsite) and management (in-house/third-party) are separate axes;
examples include offsite backups managed by the college itself.

Recovery follows identify → select → restore → verify → return service. It covers
safe destination, usable version, completeness, access, missing recent changes,
priorities/dependencies and measured recovery time. Test restores are prominent.
RAID availability and sync alignment are distinguished from independent historical
recoverability; not every RAID level tolerates drive failure.

## Strategy activity and assessment

Four choice/reason cards reuse `paired-scenarios.js`, configured by
`javascript/data/backup-strategy-scenarios.js`. Learners justify type, active-record
frequency, location and management. Feedback explains benefits and limitations of
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
