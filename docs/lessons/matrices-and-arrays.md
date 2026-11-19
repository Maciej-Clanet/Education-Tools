# Matrices and arrays

Lesson and authored source: [student page](../../pages/topics/matrices-and-arrays.html). Unit 2 D2: matrix representation, arithmetic and the relationship to arrays. This page is authored directly in HTML.

Prerequisites: [Arrays, lists and data types](arrays-lists-and-data-types.md), particularly indexed access and zero-based positions. The short sequence leaves multidimensional indexing and memory order to the following lesson.

## Coverage in order

1. **Introduced** — Matrix as a rectangular grid of numbers before applying it to two clubs' snack-box orders. (`introduction`, `overview`)
2. **Covered** — Rows, columns, elements and dimensions in rows × columns order; dimensions versus total element count. (`matrices`)
3. **Introduced** — Purposes of addition, scalar multiplication and matrix multiplication. (`operations`)
4. **Covered** — Element-by-element addition, equal dimensions, consistent row/column meaning and unchanged result shape; saved question generator. (`addition`)
5. **Covered** — Scalar as one number, multiplication of every element and unchanged shape; saved question generator. (`scalar-multiplication`)
6. **Covered** — Matrix multiplication compatibility: select a cell in the 2 × 4 result to highlight its row in a 2 × 3 matrix and its column in a 3 × 4 matrix. Labels identify the selected row and column. Their lengths match; result dimensions come from rows of A and columns of B. An unmatched-length example explains why an operation can be invalid. (`multiplication-size`)
7. **Covered** — Row/column selection, ordered pairs, products, summation and placement of all four result cells. The formula and completed products remain visible while the first cell is calculated. The snack-box example connects box counts to totals of items. Shared walkthrough states support manual steps, optional playback and static/print reading. (`matrix-multiplication`)
8. **Practice** — Saved multiplication generator, including rectangular inputs and a free-text working area; revision explanation of why matching-position multiplication fails and why operand order matters. (`multiplication-practice`)
9. **Covered** — 2D indexed storage of the same matrix, row/column index order, zero-based access versus one-based position language; brief 1D contrast. A large highlighted pseudocode example connects both indexes to the selected element. (`arrays`)
10. **Covered** — Matrix as a mathematical representation and array as indexed storage; array storage does not automatically perform matrix operations. (`compare`)
11. **Practice** — Position, shape and operation checks, retained quiz, and separate written tasks on seating storage and combining points. (`mistakes`)

## Boundaries and persistence

No determinants, inverses, matrix algebra proofs or matrix-library code. Multidimensional arrays, row-major and column-major memory order belong to the next lesson. Walkthrough playback is temporary and pauses when hidden/offscreen; it does not alter saved practice.

The operation generators and quiz retain their existing storage. Multiplication working is stored with its question; clearing answer cells preserves the working, while Clear working affects only the scratchpad. New question resets both its answers and working. Older saved questions without a scratchpad still load. The seating prompt retains its response ID. The clarified points question uses `points-addition-v2`; the existing exam store preserves retired drafts, including `question-2`.
