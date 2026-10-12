# Multi-dimensional arrays and memory order

Lesson and authored source: [student page](../../pages/topics/multi-dimensional-arrays-and-memory-order.html). Unit 2 D2: single, two- and multi-dimensional arrays, row-major and column-major order. The HTML is authored directly.

Prerequisites: [Matrices and arrays](matrices-and-arrays.md), including row/column positions, dimensions and zero-based 2D access. Matrix arithmetic is not repeated.

## Coverage in order

1. **Introduced** — Dimensions as axes, each contributing an index. Multidimensional includes 2D, not only 3D and above. A temperature-monitoring example grows one axis at a time. (`overview`)
2. **Covered** — 1D indexed access, valid zero-based indexes and element count versus dimension count. (`one-dimensional`)
3. **Covered** — 2D day/hour access, shape versus number of dimensions and total elements. (`two-dimensional`)
4. **Covered** — 3D sensor/day/hour access, selection of a 2D layer and total element count; dimensions can represent categories/time rather than physical space. (`multi-dimensional`)
5. **Introduced** — Logical coordinates versus linear addresses, packed equal-sized elements and the need for a consistent layout rule. (`memory-order`)
6. **Covered** — Row-major storage, with a labelled grid and ordered memory strip. (`row-major`)
7. **Covered** — Column-major storage of the same values in the same logical grid. (`column-major`)
8. **Practice** — Retained visualiser on its own slide; order selection, bounded manual steps, slider and restart. Grid geometry remains 2 × 3 on mobile; memory remains a linear strip. Static/print sequences remain readable. (`memory-visualiser`)
9. **Covered** — Shape, dimension count and indexed values remain unchanged when the matching storage rule is used. The old `mistakes` anchor aliases this recap. (`compare`)
10. **Developed** — Applying dimensions to one-room bookings and greyscale video frames; no encoding or video-compression detail. (`software-dimensions`)
11. **Introduced** — Image-filter access patterns, nearby memory accesses and cache reuse; matching access to layout can improve performance, with no universal speed claim. (`software-performance`)
12. **Developed** — Exchanging raw numeric grids: shape, element type and layout must agree; a concrete wrong-layout interpretation shows changed positions. Native C and MATLAB are layout examples. (`software-exchange`)
13. **Practice** — Definition/index/storage-order quiz and separate written questions on bookings and comparing memory sequences. (`quiz`)

## Boundaries and persistence

Diagrams use packed numeric arrays and illustrative bracket indexing, not a claim that every language's nested array is contiguous. Slots represent elements, not bytes. No address formulas, stride arithmetic, cache-line sizing, benchmarking or language-library coding. Real data exchange may require other metadata; shape/type/order are the relevant lesson concepts.

The corrected multidimensional definition has a versioned quiz answer key and matching progress metadata. Legacy quiz data is retained separately. Both written prompts and response IDs remain unchanged; the visualiser has no saved learner state.

## Sources

- [NumPy: N-dimensional arrays and memory layout](https://numpy.org/doc/stable/reference/arrays.ndarray.html).
- [MathWorks: row-major and column-major layouts](https://www.mathworks.com/help/coder/ug/what-are-column-major-and-row-major-representation-1.html).
- [MathWorks: layout and performance](https://www.mathworks.com/help/coder/ug/code-design-for-row-major-array-layout.html).
