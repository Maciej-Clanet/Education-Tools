# Web development challenges

The three basics sections in the Web Development hub switch independently
between lessons and a compact numbered challenge grid. Lessons remain the
default. D marks debugging and P marks writing a program. Skills are available
on hover, keyboard focus, or the information button; Escape dismisses them.

The JavaScript bank has 37 challenges covering current lessons and the supplied
15-stage plan; see `docs/javascript_basics.md` for the numbered coverage map.
The original example stays in `javascript/data/web-challenges.js`. New JS tasks
live in `javascript/data/challenges/javascript-challenges.js` and use the shared
`challenge()` authoring helper in that directory.

Add entries with a stable unique `id`,
`section` (`html-basics`, `css-basics`, or `javascript-basics`), `number`,
`kind` (`debug` or `program`), `topic`, `title`, `skills`, and `workspace`.
When using the helper, supply `task`, `steps`, `checks`, and optional `code`
instead of `workspace`. Supply `expectedOutput` as a string with line breaks
to show the expected console output in its own block. Use one clear action per
step, quote text values, name variables explicitly, and keep additional test
inputs in `checks` instead of introducing new requirements there. It builds the structured instructions and defaults
programming tasks to empty JavaScript source. Keep challenge numbers sequential.
The site is not live yet, so renumbering does not need backwards compatibility.
Saved work is keyed by ID, separately from the displayed number.
The workspace uses the configuration in `docs/live_code_example.md`.
For writing tasks supply a source with `code: ""` or instructional comments;
do not omit sources, since the general playground supplies defaults otherwise.
HTML and CSS use `html-css` mode and can include locked scaffolding;
JavaScript uses the existing isolated console runtime.

Links use `pages/tools/code-playground.html?challenge=<id>`. Challenge mode
shows instructions, skills, a return link, and a restart button. It does not
change the student's general playground workspace or run automatic marking.

Each challenge autosaves after 600 ms and flushes on page hide, tab hide, and
navigation. Storage keys are `education-tools:code-playground-challenge-v1:<id>`.
Blank edits are preserved. Each save is independent so different challenges
opened in different tabs cannot overwrite one another. Saving failures are
shown in the playground. Restart asks before replacing only that challenge.

Saves remain on the current device until restarted or browser data is cleared;
there is no cross-device or account persistence and no automatic lesson expiry.
This avoids deleting classwork before a teacher has checked it. No completion
indicator is inferred from merely opening or editing an exercise.

Run `node --test tests/web-challenges.test.mjs tests/javascript-challenge-content.test.mjs`
for storage, reopen/reset, unknown-link, bank integrity, and executable reference
attempts with alternate inputs. Reference attempts are test fixtures only.
