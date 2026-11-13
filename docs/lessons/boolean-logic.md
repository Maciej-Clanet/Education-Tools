# Boolean logic

Authored source: [lesson HTML](../../pages/topics/boolean-logic.html). The lesson
uses the shared shell. The page script initialises temporary demonstrations,
editable classroom tables, saved truth-table practice and the shared JavaScript runner.

## Scope and boundaries

Unit 2 F1: Boolean values, AND/OR/NOT, comparisons, combined expressions and truth tables. Uses simple real situations;
no programming knowledge is assumed. Two-input practice establishes the method;
three-input practice extends the same method to eight rows. Working columns are
calculated results, not independent inputs.

Standard gate symbols, gate circuits, XOR/NAND/NOR teaching, Boolean algebraic
simplification and Karnaugh maps are outside this lesson. The opening JavaScript recap demonstrates Boolean values and comparison results;
its comments supply the explanation. Code writing is not an assessment requirement. Flowchart symbols are
taught in the following F2 lesson.

Pearson's [Technology Update, p. 11](https://qualifications.pearson.com/content/dam/pdf/BTEC-Nationals/computing/2016/specification-and-sample-assessments/Technology_update_for_teaching_Sept2018.pdf#page=11)
names mathematical and relational operators, AND/OR/NOT, and truth tables.
The [Computing FAQ, Q29, p. 23](https://qualifications.pearson.com/content/dam/pdf/subject-updates/ICT/FAQs/Computing_SuiteWide_FAQs.pdf#page=23)
explicitly excludes gate circuits, extra symbolic notation and formal Boolean
simplification. Q11 on p. 8 inconsistently mentions complex logic diagrams; the
lesson follows the direct Q29 clarification and the Technology Update. Neither
establishes a two-input maximum. Three-input exercises are a teaching extension
of the method, not a claim about an official maximum.

Photo provenance is recorded beside the [image asset](../../assets/images/boolean-logic/CREDITS.md).

The supplied reference decks *6_Boolean Algebra 1*, *7_Boolean Algebra 2* and
*8_Logic Diagrams* informed the hotel and college examples and working-column
progression. They are not templates or authored website sources.

## Teaching sequence

1. **Practice** - Short Boolean recap in the shared JavaScript runner: true/false,
   comparison results and using the result to make a decision. Comments explain
   the examples. (`boolean-recap`)
2. **Introduced** - Hotel card reader photograph and two prominent conditions:
   active card and matching room. Inputs, output and a simple operation/description
   table for AND, OR and NOT. Other gates are named only. (`overview`, `operators`)
3. **Covered** - AND through the interactive card/lock model. Map true/false to
   1/0; list four input combinations; complete an editable AND table.
   (`hotel-rule`, `truth-tables`, `and-table`)
4. **Covered** - Inclusive OR through smoke and heat sensors; NOT through a
   door-closed sensor. Each operation has a separate editable table with its
   expression in the final column heading. (`or-rule`, `or-table`, `not-rule`, `not-table`)
5. **Practice** - Identify the operation for printer, fan and cover-warning rules.
   (`choose-rule`)
6. **Covered** - Relational operators produce Boolean results. Arithmetic is not
   developed in this lesson. (`comparisons`)
7. **Covered** - Combined expressions, brackets and working columns using an
   active/unblocked card. Complete NOT B before the final result.
   (`combine`, `compound-two-table`)
8. **Developed** - Three inputs and eight rows through A AND (B OR C). Input toggles
   highlight a row without changing any answers. Both working and final columns
   can be completed in class. (`flow`)
9. **Covered** - Bracket grouping changes the rule, demonstrated with fixed inputs.
   Transfer to valid ID, enrolment and blocked status, followed by its editable
   truth table. (`brackets`, `college-rule`, `college-table`)
10. **Practice** - Inclusive OR, the scope of NOT and row counts. (`mistakes`)
11. **Practice** - Generated two/three-input tables, with the full expression in
    the output heading and automatic checking. Followed by a knowledge quiz and
    saved hotel/college explanations. (`truth-practice`, `quiz`, `exam-practice`,
    `college-practice`)

Classroom tables provide Check answer, Show/Hide answers and Clear table. Revealing
answers leaves the entered draft intact. The generator deliberately has no answer
reveal. Complete authored examples remain available without JavaScript and in print.
Removed section anchors remain as aliases in the relevant teaching section.

## Persistence

The replacement quiz uses a fresh versioned answer store. Written prompts retain their existing IDs and exam store, preserving current and
retired drafts. The old
exploration store remains untouched. Each generator input count keeps its own
task and answers. Classroom tables, the hotel model and embedded code edits are temporary.
