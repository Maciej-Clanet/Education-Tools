# Binary arithmetic

Lesson: [student page](../../pages/topics/binary-arithmetic.html). Unit 2 C1: whole-number binary arithmetic and BCD addition.
Prerequisites: Binary place values, binary/denary conversion and the four-bit-per-decimal-digit BCD rule.
Authoring: the linked HTML, `javascript/pages/binary-arithmetic.js` and `css/pages/binary-arithmetic.css`. The manual teaching tools use `javascript/pages/binary-arithmetic-demos.js`. Borrowing, long division and practice migration use `javascript/core/binary-arithmetic-model.js`.
Depth: [definitions](../lesson_authoring.md#coverage-outline-format). Section IDs below refer to the lesson page.

## Coverage in order

1. **Introduced** — Align matching binary place values before calculating. (`overview`)
2. **Covered** — Addition rules, writing a result bit, carrying into the next column, and keeping a final carry. (`core-patterns`, `addition`)
3. **Practice** — Saved addition generator with separate carry and answer rows. (`addition-practice`)
4. **Covered** — Borrowing one higher-place unit as two lower-place units; passing a borrow through zeros; subtraction using the rewritten top row. Manual steps animate each adjacent exchange and fill one answer column at a time. The working value 10 means two units in that column. Denary place-value headings are separate from binary working. (`subtraction`, `borrow-chain`, `subtract-after-borrowing`)
5. **Practice** — Saved subtraction generator. The new top row accepts 0, 1 and 10 and is checked against the same borrowing method as the examples. (`subtraction-practice`)
6. **Covered** — Multiplication by powers of two, enough width to retain bits, one row per multiplier bit, zero rows and addition of partial products. (`multiplication`, `multiply-example`, `multiply-zero`)
7. **Practice** — Saved multiplication generator with a working table for carries, shifted partial products and their sum. (`multiplication-practice`)
8. **Covered** — Right shift for division by two, the removed bit as remainder, and long division by bringing down one bit at a time. Manual tools separate bringing down a bit from choosing the answer bit and subtracting. Worked cases include division by 11 and 101, plus a nonzero remainder. (`division`, `division-example`, `division-by-101`, `division-remainder`)
9. **Practice** — Saved division generator with exact whole-number answers. A working table follows the same bring-down, current-group, subtraction, remainder and answer-bit sequence as the examples. (`division-practice`)
10. **Covered** — BCD addition: no-correction case, add-six correction above 9, correction after a carry, and carrying between decimal digit groups. (`bcd-arithmetic`, `bcd-correction`, `bcd-carry`, `bcd-two-digits`)
11. **Practice** — Saved single-digit BCD addition generator with a binary working table for carries, raw sum and correction before writing the final BCD groups. Misconceptions, concept quiz and written explanations follow. (`bcd-practice`, `mistakes`, `quiz`, `exam-practice`)

## Boundaries and source

All operands are non-negative whole numbers. Subtraction results are non-negative. Fixed-width overflow, signed arithmetic and fractional answers are outside this lesson. Negative and floating-point representations follow in the next lesson. BCD addition is developed here; BCD subtraction, multiplication and division are not covered here.

Pearson's [Extended Diploma in Computing specification, Issue 8, Unit 2 C1, printed page 33](https://qualifications.pearson.com/content/dam/pdf/BTEC-Nationals/computing/2016/specification-and-sample-assessments/btec-nat-l3-ext-dip-in-computing-spec.pdf#page=43) explicitly includes arithmetic with BCD in the essential content. BCD addition is therefore retained as assessable content; this does not predict an individual exam question.

## Saved working

The practice store remains unchanged. When the subtraction row notation changes, retain the old marker row under `legacyTableValues` and keep the learner's answer row. For division, retain the old working table and restore its complete quotient as the answer. Unchanged written questions keep their response IDs. Quiz answer keys follow the versioned-storage rule in the authoring guide.

Scratch tables are ungraded and saved under each question's `scratch` field. Clearing working affects only that table; a new question resets only that practice card. Demonstration steps are temporary and never change learner answers. The brief, manually requested transfers remain available with reduced motion; reset cancels a transfer. Authored complete methods remain readable without JavaScript and in print.
