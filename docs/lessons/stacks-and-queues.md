# Stacks and queues

Lesson: [student page](../../pages/topics/stacks-and-queues.html). Unit 2 D1: stack/queue features, applications and implications.
Authoring: [Generator](../../build-stacks-and-queues-lesson.mjs); run `node build-stacks-and-queues-lesson.mjs`. Shared examples/markup are in `content/lessons/`; assessments in `javascript/data/stacks-and-queues-assessment.js`.
Depth: [definitions](../lesson_authoring.md#coverage-outline-format). Section IDs below refer to the lesson page.

## Coverage in order

1. **Introduced** — Data structures, items versus collections, access order and developer/security uses. (`overview`)
2. **Covered** — LIFO, top, push/pop/peek and returned value versus remaining collection. (`stack`)
3. **Covered** — Undo as reversing actions; nested calls and reverse-order returns. (`undo`)
4. **Introduced** — Paused call stacks for diagnosis; not a full execution history or debugging course. (`debugging`)
5. **Covered** — FIFO, front/rear, enqueue/dequeue/peek and waiting-file processing. (`queue`)
6. **Covered** — Burst buffering, sustained overload and capacity implications. (`buffers`)
7. **Developed** — Priority and multiple workers: removal order can differ from completion order; no scheduling implementation. (`queue-policy`)
8. **Covered** — Compare stack/queue behaviour for the same arrivals. (`compare`)
9. **Developed** — Read operation-based pseudocode and handle empty/full states; no structure implementation. (`programmer-bridge`)
10. **Practice** — Misconceptions, quiz and written Undo/call-stack/scanning applications. (`mistakes`)

## Boundaries

Explorers' fixed capacity is illustrative, not universal. Peek does not remove; queue removal starts work, not completion. Arrays/lists/storage implementations follow in the next lesson; no recursion, pointer coding or complexity notation.

## References

- [Python data structures](https://docs.python.org/3/tutorial/datastructures.html)
