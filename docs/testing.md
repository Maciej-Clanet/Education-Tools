# Verification setup

Read for checks relevant to a change. This static repository has no package
manifest or configured npm build/lint pipeline. Run Node checks from the repository
root; use the matching tests in `tests/` rather than repeating an entire suite
after every small edit.

## Selecting checks

- Pure model/component changes: `node --test tests/<relevant-name>.test.mjs`.
  Syntax checks: `node --check <changed-script>`.
- Generated content: run the lesson's documented generator and verify repeatable
  output. Check local links/assets, section IDs and assessment metadata.
- Teaching/UI changes: inspect the changed slides and interactive states at
  1366×768 (and a larger desktop size), plus 390/320px student layouts. Include
  keyboard/touch operation, focus, reduced motion and static fallbacks as relevant.
  Teaching content should fit; long quizzes, written work and expanded guidance
  may use their intended scrolling surfaces.
- Assessment/storage changes: verify scoring, reset and actual reload persistence,
  old quiz isolation, retained retired drafts and unit progress aggregation.
- Documentation-only edits: check links, source pointers, outline ordering and
  `git diff --check`; a browser run is unnecessary unless runtime files changed.

## Browser regressions

Most lesson regressions are `tests/*.browser.mjs`; Flexbox uses
`tests/flexbox-browser.mjs` and `tests/flexbox-children-browser.mjs`.
Inspect the selected script's header for setup and overrides.

Use an **isolated browser profile and local test origin**: these tests seed,
replace or clear local learner answers/preferences. Never attach them to a
learner's normal browser profile.

Start `node raid-test-server.mjs` in a separate terminal; it serves this repository
on `http://127.0.0.1:8765`. Launch an isolated Chrome/Chromium debugging instance
using an unused port, then explicitly set both origins before running a test:

```powershell
$env:FLEXBOX_TEST_ORIGIN = 'http://127.0.0.1:8765'
$env:FLEXBOX_CDP_ORIGIN = 'http://127.0.0.1:9229'
node tests/representation-lessons.browser.mjs
```

The CDP URL must match the browser actually launched. Defaults differ between
scripts and `tests/helpers/browser-session.mjs`; old session port numbers are
not requirements. `FLEXBOX_SCREENSHOTS` optionally selects an evidence directory.
The representation suite accepts `REP_LESSONS` for a subset; inspect its parser
for accepted values. Keep screenshots/reports in ignored `.raid-checks/` locations.
The tests do not launch the browser for you.

Report checks actually run in the task response. Do not present a historical pass
record as proof of the current state or leave transient environment failures in
the permanent lesson coverage outlines.
