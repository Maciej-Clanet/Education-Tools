# Arrays, lists and data types

Lesson: [student page](../../pages/topics/arrays-lists-and-data-types.html). Unit 2 D1: array/list features, applications, data types and storage implications.
Prerequisites: Stacks and queues; continue without repeating its data-structure/LIFO/FIFO introduction.
Authoring: [Generator](../../build-arrays-lists-lesson.mjs); run `node build-arrays-lists-lesson.mjs`. Diagrams: `content/lessons/collection-diagrams.mjs`; assessment: `javascript/data/arrays-lists-assessment.js`.
Depth: [definitions](../lesson_authoring.md#coverage-outline-format). Section IDs below refer to the lesson page.

## Coverage in order

1. **Introduced** — Need to read/change a particular item. (`overview`)
2. **Covered** — Indexed fixed array, zero-based position versus value, reads/updates and valid bounds. (`array`)
3. **Covered** — Integer, real, Boolean and string values; element type versus collection structure. (`data-types`)
4. **Developed** — Records with differently typed fields as one element type; no record implementation. (`typed-collections`)
5. **Covered** — Adjacent slots and direct access by known index versus searching. (`array-memory`)
6. **Covered** — Ordered, changing list contents and distinction between the interface and storage. (`list`)
7. **Covered** — Array-backed count/capacity and resizing/copying. (`dynamic-list`)
8. **Covered** — Linked nodes and sequential traversal from the head. (`linked-list`)
9. **Covered** — Ordered insertion: shifting array entries versus changing links; finding a node still has a cost. (`insertion`)
10. **Covered** — Storage/processor trade-offs and selection for monitoring, search results and editing. (`compare`)
11. **Practice** — Misconceptions, quiz and written monitoring/list-growth/insertion tasks. (`mistakes`)

## Boundaries

A list need not be linked or untyped. The fixed-array model is not every language's Array type; JavaScript arrays and CPython lists need qualification. Linked insertion is local only once the position is known. Multidimensional arrays/memory order follow in D2; no complexity notation or linked-list coding.
