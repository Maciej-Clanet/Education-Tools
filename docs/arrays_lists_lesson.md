# Arrays, lists, and data types: first teaching

Rebuilt 4 October 2026 as the direct continuation of Stacks and queues. Do not
repeat the data-structure introduction or LIFO/FIFO recap. Open with a new need:
reading or changing a particular item in a collection.

## Teaching sequence

1. A security dashboard needs the count for a particular hour. Introduce a fixed
   collection, then index versus value and zero-based positions.
2. Read and update a six-element array in an interactive dashboard. Updating a
   value leaves the length unchanged. Explain valid indices and boundaries.
3. Separate the element's data type from the structure holding the elements.
   Use integer counts, real measurements, Boolean flags and string identifiers.
   A collection of records can contain the same record type with different field
   types; linked storage does not imply mixed types.
4. Show adjacent, equal-width array slots and a direct indexed read. Distinguish
   knowing an index from searching for a value. Keep address arithmetic as an
   explanation, not an assessment calculation.
5. Introduce a list through a changing playlist. Its ordered contents can grow
   and shrink. Then distinguish the list interface from its implementation:
   an array-backed list or linked nodes.
6. Step through count/capacity and growth in an array-backed list; follow links
   through a singly linked list; compare a middle insertion in both layouts.
   A linked insertion is local only when the position is already known.
7. Compare the three models and select them for fixed measurements, changing
   search results and known-node updates. Include memory/processor implications.
8. Misconceptions, ten-question quiz, then three saved written tasks.

## Content boundaries

- The main array model has fixed length, one element type and contiguous slots.
  This is not a claim that every language's type named `Array` behaves that way.
- A list is not necessarily linked. Typed lists exist. Python lists use an
  array of references; JavaScript arrays do not exemplify this fixed-size model.
- A singly linked list follows next references from its head. Other linked-list
  forms exist. Node locations are schematic, not numeric memory calculations.
- Array insertion must preserve order and may move subsequent items; resizing a
  full array-backed list may allocate a larger array and copy its entries.
- Linked nodes use extra reference storage. Traversal can be needed to find an
  insertion position. Avoid blanket claims that linked lists are always faster.
- No multidimensional arrays, linked-list coding, complexity notation, exam-board
  claims about specific language implementations, or security exploit exercises.

## Sources checked

- [Microsoft: C# arrays](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/arrays)
- [Microsoft: List<T>, remarks](https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.list-1?view=net-10.0)
- [Python: how CPython lists are implemented](https://docs.python.org/3/faq/design.html#how-are-lists-implemented-in-cpython)
- [Oracle: LinkedList](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/LinkedList.html)

## Implementation and maintenance

`build-arrays-lists-lesson.mjs` authors the static lesson, using visual helpers in
`content/lessons/collection-diagrams.mjs` and assessment data in
`javascript/data/arrays-lists-assessment.js`. Run the generator after edits.
The existing page header is preserved and updated idempotently.

`javascript/core/array-explorer.js` enhances the static indexed collection. Its
controls only change temporary demo state. `javascript/core/array-model.js`
validates indices and whole-number counts; it has no DOM or persistence.
Shared lesson walkthroughs provide explicit previous/next/restart controls.
There is no autoplay, and all stages remain readable without JavaScript.

Keep the existing lesson URL, context navigation, glossary and section anchors.
Quiz v2 has 10 questions, pass score 8 and a new raw storage key. Update both
page config and unit progress metadata together. Written tasks use new IDs but
the existing `lesson-arrays-lists-and-data-types-exam-practice` storage key;
the shared saver retains retired drafts. Never migrate old answers to new prompts.

## Validation completed

- 18 teaching sections, 2 dividers and 1 opener: 21 Teacher Slides. All teaching
  slides fit at 1366×768 and 1366×900; the full quiz scrolls intentionally.
- All 12 sequence states checked with reduced motion enabled. No autoplay or
  dependence on decorative animation. Static stages remain visible without JS.
- Array reads, updates, boundary counts, invalid input, restore and Enter-key
  behaviour checked. Reading/updating does not advance the teacher slide.
- Mobile layouts checked at 390px and 320px. The comparison table has its own
  horizontal scroll region; the page itself does not overflow.
- Quiz v2 totals/pass score, fresh answers, retained old raw quiz, new written
  response IDs, retained retired drafts and D1 total20 verified in the browser.
- Local assets, unique IDs, section anchors and browser errors checked.

Re-run with `node --test tests/array-model.test.mjs tests/lesson-walkthrough.test.mjs`
and `node tests/arrays-lists.browser.mjs`. The browser suite expects the same
isolated local HTTP/CDP setup as the stacks and queues suite; see its environment
variables. Screenshots and layout reports are written to ignored `.raid-checks/`.
