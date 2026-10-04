# Stored-program architecture: Von Neumann and Harvard

Lesson: [student page](../../pages/topics/stored-program-architecture-von-neumann-and-harvard.html). Unit 2 B1: stored-program models, choice and implications.
Authoring: the linked HTML and its page script.
Depth: [definitions](../lesson_authoring.md#coverage-outline-format). Section IDs below refer to the lesson page.

## Coverage in order

1. **Introduced** — Historical programming problem and early ENIAC context. (`overview`)
2. **Covered** — Stored programs, instructions versus data and changing the task. (`stored-program`)
3. **Developed** — Laptop storage → RAM → CPU example and architecture-neutral system roles. (`loading`)
4. **Introduced** — Control unit, ALU and registers; detailed cycle/register teaching belongs in B2/B3. (`cpu-parts`)
5. **Introduced** — Shared versus separate memory-access arrangements. (`architectures`)
6. **Covered** — Von Neumann memory/access, traced operations, contention, flexibility and a heating-control suitability example. (`von-neumann`)
7. **Covered** — Harvard separate memories/paths, overlapping accesses, sound-processing suitability and fixed-capacity trade-offs. (`harvard`)
8. **Developed** — Modified-Harvard example: shared main memory and separate instruction/data caches; detailed cache mechanisms belong in B2. (`modern-designs`)
9. **Developed** — Raspberry Pi example and cache costs, misses and task-dependent suitability. (`modern-in-practice`)
10. **Practice** — Relate feature to effect/task/trade-off; misconceptions, quiz and written tasks. (`exam-technique`)

## Boundaries

Demo stages are not clock cycles or benchmarks. Separate access is not two CPUs or two completed instructions. Thermostat/headphone photos illustrate tasks, not verified internals of those products. Fixed equal memory pools and split-cache layout are qualified models. Technical sources remain in page revision notes; [image credits](../../assets/images/architecture/CREDITS.md) retain rights/context.
