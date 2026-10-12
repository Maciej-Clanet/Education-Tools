# Backup and data recovery

Lesson: [student page](../../pages/topics/backup-and-data-recovery.html). Unit 2 A3: backup and recovery procedures.
Prerequisites: Storage roles and RAID fault tolerance.
Authoring: the linked HTML and its page script.
Depth: [definitions](../lesson_authoring.md#coverage-outline-format). Section IDs below refer to the lesson page.

## Coverage in order

1. **Covered** — Live data, failure/loss causes, backup versus recovery and distinctions from sync/RAID. (`live-data`)
2. **Introduced** — Three backup procedures using the same changing files. (`backup-types`)
3. **Covered** — Full backup operation, benefits and suitable uses. (`full`)
4. **Covered** — Incremental backup changes, chain dependencies, trade-offs and sequential restore. (`incremental`)
5. **Covered** — Differential backup's full-backup reference, trade-offs and latest-differential restore. (`differential`)
6. **Practice** — Compare identical daily changes and recap procedures. (`compare-strategies`)
7. **Covered** — Destinations/media, onsite/offsite protection and owner/operator responsibilities. (`storage-media`)
8. **Introduced** — UK personal-data recovery/testing duties as supporting context; no universal required backup frequency. (`legal-duties`)
9. **Covered** — Backup frequency, possible lost-work window and copying-load trade-off. (`frequency`)
10. **Covered** — Select a usable point before damage; contain, select, restore, verify and reopen. (`recovery-planning`)
11. **Covered** — Service/dependency priorities, recovery duration and restore testing. (`priorities`)
12. **Developed** — Incident case connecting backup readiness, monitoring and responsibility to recovery outcomes. (`gitlab-case`)
13. **Covered** — Incident-specific protection and a complete backup strategy. (`backup-vs-resilience`)
14. **Practice** — Strategy choices, saved plan and supported judgement; misconceptions, quiz and written tasks. (`choose-strategy`)

## Boundaries

Offsite is not automatically offline, cloud-based or ransomware-safe. File counts are not byte sizes or measured timings. Newest is not necessarily usable; restoring data is not the same as reopening a verified service. ICO/GitLab sources remain on the lesson page.
