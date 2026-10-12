# RAID and NAS storage systems

Lesson: [student page](../../pages/topics/raid-and-nas-storage-systems.html). Unit 2 A1: storage/recovery systems. SAN is a supporting comparison.
Authoring: [Teaching source](../../content/raid-nas-sections.mjs) and [generator](../../build-raid-lesson.mjs); run `node build-raid-lesson.mjs`.
Depth: [definitions](../lesson_authoring.md#coverage-outline-format). Section IDs below refer to the lesson page.

## Coverage in order

1. **Introduced** — Single-drive failure, RAID purpose and competing performance/capacity/availability needs. (`why-raid`)
2. **Covered** — Striping and parallel reads; mirroring and its capacity trade-off. (`raid-mechanisms`)
3. **Developed** — Parity as recovery information, same/different rule, missing-bit reconstruction and distributed parity; no full parity-code engineering. (`parity`)
4. **Covered** — Failure, degraded operation and rebuild; installed versus usable capacity. (`rebuilds`)
5. **Covered** — RAID 0, 1, 5, 6 and 10: arrangement, usable capacity, failure tolerance and appropriate uses. (`raid-levels`)
6. **Practice** — Compare arrangements against requirements. (`raid-comparison`)
7. **Covered** — NAS shared files, internal hardware, network request path, local/network comparison, benefits and limitations. (`nas-basics`)
8. **Covered** — Separate NAS access from RAID drive organisation. (`raid-in-nas`)
9. **Introduced** — Server storage need and NAS files versus SAN blocks; supporting context. (`san`)
10. **Covered** — RAID fault tolerance versus backup protection from deletion and wider incidents. (`raid-not-backup`)
11. **Practice** — Choose an arrangement, correct misconceptions, quiz and written tasks. (`choice-and-recovery`)

## Boundaries

Teach mechanisms before named levels. Capacity formulas stay in revision support, not required first-teaching arithmetic. Mirroring does not universally double reads; RAID 10 survival depends on which mirrored members fail. Detailed backup procedures belong in A3.

## References

- [Intel: defining RAID volumes](https://www.intel.com/content/www/us/en/support/articles/000005867/technologies.html)
- [Dell: RAID 1](https://www.dell.com/support/manuals/en-us/precision-t7875-workstation/tramore_precision_7875_tower_desktop_raid_guide/RAID-1?guid=guid-0bfca8da-8957-4c2b-96e1-e89df369d9d6&lang=en-us)
- [Dell: selecting RAID levels](https://www.dell.com/support/manuals/en-us/idrac9-lifecycle-controller-v7.x-series/idrac9_6.xx_lc_ug/selecting-raid-levels?guid=guid-5d365c37-4f63-4f4f-a48d-658498a39b2c&lang=en-us)
- [IBM: NAS](https://www.ibm.com/think/topics/network-attached-storage)
