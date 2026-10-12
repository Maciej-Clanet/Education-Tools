# JavaScript Basics teaching sequence

This is the agreed console-first course plan, not a lesson-completion checklist.
Check `javascript/data/course-catalog.js` for live pages. Existing Working with
Strings remains an extra lesson between Variables and Operators.

| Order | Lesson | Scope and boundary |
| --- | --- | --- |
| 1 | Running JavaScript and the Console | Statements, logging, comments, edit → Run → output; light warn/error/clear. No DOM. |
| 2 | Variables and Data Types | Prefer const; let for reassignment. Strings, numbers, booleans, typeof; undefined/null awareness. |
| 2a | Working with Strings | Concatenation, spaces, backticks and interpolation. |
| 3 | Operators and Expressions | Arithmetic, remainder, assignment, precedence and expressions; existing lesson also teaches prompt/Number and compound assignment. |
| 4 | Comparisons and Boolean Logic | Strict equality, inequality, relational and logical operators; Boolean results before if. |
| 5 | If Statements and Decisions | if/else if/else, boundaries and combined conditions. Defer ternary and switch. |
| 6 | Arrays | Zero-based indexing, reading/updating, length, push/pop. Use JavaScript's term array. |
| 7 | Loops: Repeating Code | for start/condition/change; basic while, termination and Stop/time limits. |
| 8 | Looping Through Arrays | length, current element, for...of, counting and accumulating. |
| 9 | Functions: Reusable Code | Declarations, calls, parameters and arguments; reusable printing first. |
| 10 | Functions and Return Values | Logging versus returning; receive and combine results. |
| 11 | Scope | Global, block and function scope; local calculations and unavailable variables. No closure theory. |
| 12 | Objects | Literals, properties, dot/bracket access and updates. No classes or prototypes. |
| 13 | Arrays of Objects and Nested Data | Structured entries, nested properties and traversal before JSON/APIs. |
| 14 | Reading Errors and Debugging | Syntax/runtime/logic errors; predict, observe, locate, repair, retest boundaries. No new execution/stack-trace tool. |
| 15 | Basics Practice / Mini Project | Combine the concepts in console-only tasks; learners choose the organisation. |

Use the existing Live Code console/Playground and Debug Lab; see
[shared components](shared_components.md#code-teaching). Diagrams for indexes,
branching, variables or parameters may help, but are not required new tools.

Challenges in `javascript/data/web-challenges.js` and
`javascript/data/challenges/javascript-challenges.js` include future topics;
challenge existence does not imply the corresponding lesson exists. Preserve
stable IDs and independent saves. Bank entries carry their topic/skills, so do
not duplicate counts or exercise-number mappings here. HTML/CSS challenge banks
remain empty by the current scope; extending them requires a task to do so.
Authoring, persistence and reference-attempt checks: [web challenges](web_challenges.md).
