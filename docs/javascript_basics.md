# JavaScript Basics plan and challenge coverage

The challenge bank follows the supplied 15-stage console-first plan. The
existing **Working with Strings** lesson remains an additional live lesson
between Variables and Operators; it has dedicated exercises as well.
Only challenges have been created for future stages, not new lesson pages.

There are **37 challenges: 20 debugging and 17 write-from-scratch tasks**.
Challenges are numbered sequentially from 1 to 37. Each task now has short steps, a separate
expected-output block, and explicit checks.

Challenge 1 retains its original ID, number, starter, and local save. From
challenge 2 onwards, topics progress through the plan. D means debugging;
P means a blank editor with requirements and checks. Skills and topic names
appear in the grid's hover/focus/tap details rather than as extra grid labels.

| Plan stage | Lesson | Main content / teaching approach | Challenges |
| --- | --- | --- | --- |
| 1 | Running JavaScript and the Console | Statements, log, comments, edit → Run → output; light warn/error, clear already supported by the runtime. No DOM. | 2 D |
| 2 | Variables and Data Types | Prefer const; let for reassignment. Strings, numbers, booleans, typeof, undefined/null awareness. A value/variable visual can support the future lesson. | 1 D (original), 3 D, 4 P |
| Extra live lesson | Working with Strings | Concatenation, spacing, backticks and interpolation. | 5 D, 6 P |
| 3 | Operators and Expressions | +, -, *, /, %, assignment, expressions, precedence, template literals. Existing lesson also covers prompt/Number and compound assignment. | 7 D, 8–9 P |
| 4 | Comparisons and Boolean Logic | ===, !==, <, >, <=, >=, &&, logical OR `\|\|`, !; boolean results before if. Use strict equality as normal. | 10 D, 11 P |
| 5 | If Statements and Decisions | if, else if, else, boundaries and multiple conditions; branching visuals and Debug Lab suit the lesson. Defer ternary and switch. | 12 D, 13 P |
| 6 | Arrays | Zero-based indexes, reading/changing elements, length, push/pop; call them arrays, not lists. An index visual suits the lesson. | 14 D, 15 P |
| 7 | Loops: Repeating Code | Explain start/condition/change in for; basic while, termination and Stop/time limits. | 16 D, 17 P, 18 D |
| 8 | Looping Through Arrays | length, current elements, for...of, counting and accumulating; keep collection traversal separate from counter-loop introduction. | 19 D, 20 P |
| 9 | Functions: Reusable Code | Declarations, calls, parameters and arguments; reusable printing first. A parameter/input visual can support the lesson. | 21 D, 22 P |
| 10 | Functions and Return Values | Explicitly separate logging from returning a value; receive and combine results. | 23 D, 24 P |
| 11 | Scope | Practical global, block and function scope; local calculations and unavailable variables. No closure theory. Debug Lab suits the lesson. | 25 D, 26 P |
| 12 | Objects | Literals, key/value pairs, dot/bracket access and changing properties using familiar entities. No classes or prototypes. | 27 D, 28 P |
| 13 | Arrays of Objects and Nested Data | Arrays of structured entries, nested properties and loops as preparation for later JSON/APIs. | 29 D, 30 P |
| 14 | Reading Errors and Debugging JavaScript | Syntax, runtime and logic errors; predict, observe, locate, repair and retest with boundary cases. Reuse Debug Lab and Playground; no execution/stack-trace tool. | 31–33 D, 34 P |
| 15 | JavaScript Basics Practice / Mini Project | Combine variables, conditions, arrays, loops, functions and objects. Console-only requirements; students decide how to organise the solution. | 35–36 P, 37 D |

## Authoring and verification

- `javascript/data/web-challenges.js` preserves the original challenge and
  combines the bank from `javascript/data/challenges/javascript-challenges.js`.
- `javascript/data/challenges/challenge-authoring.js` constructs the common
  workspace and structured instructions. Programming tasks have genuinely
  empty source; debugging tasks have deliberately faulty source.
- Each task provides concrete success checks. Later tasks include boundaries,
  empty collections, changed inputs, or repeated calls where appropriate.
- Reference attempts and targeted alternate inputs are in
  `tests/fixtures/javascript-challenge-solutions.mjs`. They are development
  fixtures, not imported by the website and not an automatic student marker.
- `node --test tests/javascript-challenge-content.test.mjs tests/web-challenges.test.mjs`
  checks the bank, reference attempts, intentionally faulty starters, and
  independent save/reopen/restart behaviour. VM timeouts bound broken loops.

HTML and CSS challenges are still empty, as requested. The challenge bank does
not change lesson quiz questions, lesson availability, or quiz progress.
