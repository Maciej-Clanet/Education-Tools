# Technical Audit - 2026-05-15

This report is a read-only technical audit of the Education Tools static site.
It focuses on structure, maintainability, runtime risk, SEO, performance, and
future session context cost rather than lesson content accuracy.

## Scope Checked

- Read the startup/project docs:
  - `AGENTS.md`
  - `docs/project_requirements.md`
  - `docs/course_specs.md`
  - `docs/computing_unit_2.md`
- Inspected the main static surface:
  - `index.html`
  - `pages/units/btec-level-3-unit-2.html`
  - representative topic pages
  - representative exam pages
- Inspected shared browser code:
  - `javascript/core/lesson-shell.js`
  - `javascript/core/accessibility.js`
  - `javascript/core/past-exam.js`
  - `javascript/core/exam-practice.js`
  - `javascript/core/unit-progress.js`
  - `javascript/core/quiz-progress.js`
  - `javascript/core/storage.js`
  - `javascript/core/search.js`
- Inspected local data:
  - `javascript/data/course-catalog.js`
  - `javascript/data/unit-progress-data.js`
  - exam practice data
- Inspected CSS structure:
  - shared CSS in `css/`
  - page CSS in `css/pages/`
- Ran lightweight validation:
  - `node --check` over all `javascript/**/*.js`
  - local HTML `href`/`src` target and anchor checks
  - relative JS import checks
  - course catalogue, unit progress, and page href target checks
  - topic page coverage checks across topic files, catalogue, and unit progress
  - quiz metadata checks against actual `data-question` counts
  - basic SEO metadata checks
  - duplicate static `id` checks
  - headless browser smoke checks via local `python3 -m http.server`

## High-Level Summary

The site is in good shape for a static-first project. Local links, anchors, JS
imports, topic catalogue coverage, unit progress coverage, and quiz metadata
were all consistent at the time of this audit.

The biggest technical risk is not an obvious runtime bug. It is that the same
lesson facts are manually repeated across several places:

- topic HTML in `pages/topics/`
- page entry JS in `javascript/pages/`
- homepage catalogue data in `javascript/data/course-catalog.js`
- unit progress data in `javascript/data/unit-progress-data.js`
- the Unit 2 hub HTML in `pages/units/btec-level-3-unit-2.html`
- CSS files in `css/pages/`

That currently works, but it is fragile. As more units and specs are added, this
manual synchronization will become the main source of broken search entries,
incorrect progress data, stale quiz versions, missing next/previous links, and
SEO drift.

## Repository Shape

Approximate source size:

- HTML: 44 files, about 45,572 lines
- JS: 57 files, about 21,392 lines
- CSS: 45 files, about 21,314 lines
- Markdown docs: 9 files, about 829 lines
- Topic pages: 40 live topic HTML files
- Page-specific JS entries: 43 files
- Page-specific CSS files: 41 files

Largest source areas:

- `css/pages/lesson.css`: 2,216 lines
- `javascript/core/lesson-shell.js`: 1,781 lines
- `javascript/core/past-exam.js`: 1,673 lines
- `javascript/core/accessibility.js`: 1,498 lines
- `javascript/data/course-catalog.js`: 1,124 lines
- many topic pages are 45-66 KB each

There is no `package.json`, bundler config, lint config, test config, or browser
test config in the repo root at the time of this audit.

## What Looks Healthy

- Static-first direction is being followed.
- No missing local `href`/`src` targets were found in HTML.
- No missing local hash anchors were found.
- No missing relative JS imports were found.
- All 40 topic HTML files are represented in both `course-catalog.js` and
  `unit-progress-data.js`.
- Course catalogue hrefs resolve from the homepage context.
- Unit progress hrefs resolve from the unit page context.
- Lesson `previous`/`next` href strings checked in page JS resolve.
- Quiz question counts, pass scores, quiz IDs, and quiz versions matched between
  topic HTML, page JS, and `unit-progress-data.js`.
- No duplicate static `id` attributes were found in HTML source.
- All HTML files declare `lang="en-GB"`.
- Headless browser smoke checks showed the homepage catalogue, unit progress
  rendering, lesson shell, accessibility launcher, and practice exam chooser
  initializing over HTTP.

## Priority Findings

### P1 - Manual Multi-File Lesson Synchronization Will Not Scale

The site currently requires a lesson to be added or updated in multiple places:
topic page, page JS config, unit hub links, homepage catalogue, unit progress
metadata, and sometimes page CSS. The checks show those are consistent now, but
this is the highest-maintenance part of the project.

Examples:

- `javascript/data/course-catalog.js` is the homepage search source.
- `javascript/data/unit-progress-data.js` is the unit progress source.
- `pages/units/btec-level-3-unit-2.html` manually repeats the lesson list.
- each lesson script repeats context, back link, previous/next, quiz storage,
  pass score, and sometimes quiz version.

Recommended direction:

- Create one canonical lesson manifest, for example
  `javascript/data/lessons/unit-2.js`.
- Store each lesson's ID, title, section, topic href, context hrefs, quiz total,
  pass score, quiz version, status, and previous/next order in that manifest.
- Generate or render:
  - homepage catalogue entries
  - unit hub lesson lists
  - unit progress metadata
  - lesson context navigation
- Keep page-specific JS only for genuine interactive tools.

This does not require a backend. It can stay static-first by using data modules
or a small local build script later.

### P1 - No Automated Guardrail Exists for the Consistency Checks

The audit used ad hoc Node checks and found the catalogue/progress/link state is
clean. Because there is no package/test setup, future sessions could easily miss
the same checks.

Recommended direction:

- Add a tiny `package.json` only for local developer checks.
- Add scripts such as:
  - `check:js` for `node --check`
  - `check:links` for local href/src/hash validation
  - `check:catalog` for topic/catalog/unit-progress coverage
  - `check:quiz` for question count/pass score/version consistency
- Keep the checks dependency-light. They can be plain Node scripts in
  `scripts/`.

This would preserve the static-first site while making future agents safer.

### P1 - LocalStorage Writes Fail Silently From the User's Point of View

`javascript/core/storage.js` catches localStorage/sessionStorage errors and logs
warnings only. That is fine for light quiz progress, but exam drafts and
attempts are larger and more important.

Relevant files:

- `javascript/core/storage.js`
- `javascript/core/past-exam.js`
- `javascript/core/exam-practice.js`

Risk:

- Storage quota, disabled storage, private browsing limitations, or corrupted
  JSON can cause draft/attempt save failure.
- The user may see "Draft saved on this device" from `past-exam.js` even if
  `writeStorage()` only logged a warning internally.

Recommended direction:

- Make `writeStorage()` return `{ ok: true }` or `{ ok: false, error }`.
- Let exam draft/attempt flows show visible status if saving fails.
- Add a "download backup JSON" fallback for important drafts.
- Add clear/delete controls for old generated papers and attempts.

### P2 - SEO Is Mostly Basic And Missing Canonical/Sitemap Support

The page-level titles and descriptions are present on all pages, which is good.
The gaps are around canonical URLs, sitemap discovery, social previews, and
title length.

Findings:

- 44/44 HTML files have no `<link rel="canonical">`.
- `robots.txt` explicitly notes that the production sitemap still needs to be
  added.
- The two exam pages are missing `og:title` and `og:description`.
- Many page titles are longer than typical search display limits.
- No pages use `og:image` or `twitter:image`.
- No favicon link/icon was present; the headless browser smoke check requested
  `/favicon.ico` and received a 404.
- Topic URLs can be opened both with and without `?context=...`; without
  canonicals, those can become duplicate-indexing variants.

Relevant examples:

- `robots.txt` line 4 has the sitemap TODO.
- `pages/exams/btec-level-3-unit-2-practice.html` lines 7-15 have title,
  description, and some OG tags, but no `og:title` or `og:description`.
- `docs/project_requirements.md` already says topic pages should be canonical
  where possible and sitemap/robots work should be added later.

Recommended direction:

- Add canonical URLs to all indexable pages once the production domain is known.
- Canonical topic pages should probably point to the no-query version, while
  `?context=...` remains a UI/navigation state.
- Add `sitemap.xml` and reference it from `robots.txt`.
- Add missing OG metadata to exam pages.
- Shorten long titles where useful, especially the very long topic names.
- Add social preview images if the site will be shared publicly.
- Add a small favicon and explicit icon links so every page avoids the implicit
  `/favicon.ico` 404.

### P2 - Runtime HTML Injection Is Safe Only While Data Stays Trusted

Several render paths use `innerHTML` with local data strings. That is acceptable
while the data is hand-authored and trusted, but it becomes risky if content is
ever loaded from user input, AI output, CMS data, imported files, or external
JSON.

Examples:

- `javascript/core/past-exam.js` renders `part.promptHtml` with `innerHTML`.
- `javascript/core/past-exam.js` renders `group.scenarioHtml` with `innerHTML`.
- `javascript/core/exam-practice.js` uses `innerHTML` to render predefined and
  saved paper cards.

Recommended direction:

- Keep trusted authored HTML explicit and documented.
- If any external/content-authored pipeline is added, sanitize HTML before
  rendering or switch to structured render functions.
- For simple text fields such as titles/descriptions, prefer DOM nodes and
  `textContent`.

### P2 - Shared Core Files Have Too Many Responsibilities

`javascript/core/lesson-shell.js` currently handles context navigation, section
navigation, quiz persistence/scoring, exam-practice response persistence, and a
large teacher slide system. `javascript/core/accessibility.js` handles
preferences, panel rendering, read-aloud target discovery, speech session state,
and mini-player UI.

Relevant landmarks:

- `lesson-shell.js`
  - `initContextNavigation()`
  - `initSectionNavigation()`
  - `initQuiz()`
  - `initExamPractice()`
  - `initTeacherMode()`
  - `initLessonPage()`
- `accessibility.js`
  - readable segment discovery
  - speech synthesis handling
  - accessibility UI rendering
  - preference persistence

Recommended direction:

- Split `lesson-shell.js` into smaller modules:
  - `lesson-context.js`
  - `lesson-section-nav.js`
  - `lesson-quiz.js`
  - `lesson-exam-practice.js`
  - `teacher-mode.js`
- Split `accessibility.js` into:
  - `accessibility-preferences.js`
  - `read-aloud.js`
  - `accessibility-ui.js`
- Keep `initLessonPage()` and `initAccessibilityPanel()` as small orchestrators.

This would make the code much easier for future sessions to modify without
accidentally affecting unrelated behavior.

### P2 - CSS And Page Assets Are Request-Heavy

The static asset model is simple, but pages load several CSS files and one or
more JS module graphs. For a classroom/static site this may be fine, but it is
not optimized for production performance.

Typical topic page head:

- `css/base.css`
- `css/components.css`
- `css/theme.css`
- `css/pages/lesson.css`
- optional page-specific CSS
- `css/accessibility.css`
- `javascript/accessibility.js`
- page-specific JS

Other observations:

- There are 45 CSS files.
- There are 41 page-specific CSS files.
- `css/pages/lesson.css` alone is about 44 KB and 2,216 lines.
- Many panels use shadows and decorative backgrounds.
- `prefers-reduced-motion` exists in some places, but global smooth scrolling
  and many transitions are not centrally governed.

Recommended direction:

- For production, consider a no-backend build step that bundles/minifies CSS
  and JS while still outputting static files.
- Move repeated page-specific CSS patterns back into shared lesson components.
- Add a global reduced-motion rule for transitions and `scroll-behavior`.
- Keep heavy shadows/background effects opt-in where they are visually useful,
  not automatic on every panel.

### P2 - Large Hand-Written HTML Pages Make Refactoring Expensive

Many topic pages are 1,000+ lines and 45-66 KB. That is not a browser problem,
but it is an editing problem.

Risk:

- Repeated lesson scaffolding makes global layout changes tedious.
- It is easy to update one topic pattern but miss another.
- Future units will multiply this cost.

Recommended direction:

- Introduce reusable section data for common lesson blocks:
  - overview
  - glossary
  - common mistakes/exam traps
  - quick quiz
  - exam-style practice
  - previous/next sequence
- Keep authored lesson content in structured data or partials.
- Generate static HTML from those partials if SEO remains a priority.

### P3 - Exam Practice UX Has Future Backend/AI Labels But No Backend

The project direction is no backend unless explicitly changed. The exam pages
currently include labels such as "Retry AI marking" and the unit page mentions
automatic AI feedback coming soon.

Risk:

- Learners may see controls that cannot do useful work yet.
- Future agents may assume a backend/AI endpoint exists because the UI says so.

Recommended direction:

- Keep the static export/import teacher feedback workflow visible.
- Hide or clearly disable AI-specific controls until an endpoint exists.
- If retained, document that they are placeholders in a technical note rather
  than relying on visible page copy.

### P3 - Docs Are Mostly Fine, But Unit 2 Tracker Is Doing Too Much

Startup context cost is not extreme, but it can be improved.

Current line counts:

- `AGENTS.md`: 115 lines
- `docs/project_requirements.md`: 237 lines
- `docs/computing_unit_2.md`: 427 lines
- `docs/course_specs.md`: 14 lines
- core Markdown total checked: 820 lines

The main issue is `docs/computing_unit_2.md`: it mixes progress tracking,
implementation notes, assessment details, and long source/spec excerpts. Since
AGENTS says to read it when working on Unit 2, this file will keep eating
context in future sessions.

Recommended direction:

- Split `docs/computing_unit_2.md` into:
  - `docs/unit-2-progress.md`: short status tracker and required update rules
  - `docs/reference/computing_unit_2_spec_notes.md`: longer source/spec notes
  - `docs/reference/unit-2-exam-practice.md`: exam-practice-specific guidance
- Keep `AGENTS.md` pointing to the short progress file first, then reference
  docs only when needed.
- PDFs in `docs/` are large assets, not startup context. Keep them, but avoid
  asking future agents to read PDFs unless the task requires them.

## Checks With Clean Results

These were explicitly checked and did not show problems:

- Local HTML `href`/`src` targets: no missing targets.
- Local hash anchors: no missing anchors.
- Relative JS imports: no missing imports.
- Topic HTML files vs homepage catalogue: all 40 topic pages covered.
- Topic HTML files vs unit progress data: all 40 topic pages covered.
- Course catalogue hrefs: all resolved from homepage context.
- Unit progress hrefs: all resolved from unit page context.
- Page JS lessonConfig hrefs: all checked href strings resolved.
- Quiz metadata: no mismatches found between unit progress, lesson page config,
  and actual question counts.
- Static duplicate IDs: none found.
- HTML language declarations: all pages use `en-GB`.
- JS syntax: `node --check` passed for all JS files.
- Headless browser smoke checks loaded the tested pages; the only repeated
  request failure observed was the missing implicit `/favicon.ico`.

## Suggested Implementation Order

1. Add dependency-light validation scripts for the checks above.
2. Introduce a canonical Unit 2 lesson manifest and migrate catalogue/progress
   generation to it.
3. Add canonical URLs, sitemap support, and missing exam OG metadata.
4. Make storage writes report success/failure to important flows, especially
   exam drafts and attempts.
5. Split the largest shared modules into smaller, focused modules.
6. Consolidate repeated page-specific CSS into shared lesson component CSS.
7. Split `docs/computing_unit_2.md` into a short progress tracker plus reference
   files.

## Notes For Future Sessions

- Do not assume the manual data files are inconsistent; they were consistent on
  2026-05-15. Add checks before refactoring.
- Preserve the static-first/no-backend direction unless the user explicitly
  changes it.
- The most valuable next technical change is probably not visual. It is adding
  guardrail scripts so future lesson additions cannot silently drift.
