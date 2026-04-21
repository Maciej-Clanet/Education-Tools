# Educational Tutorials And Tools Project Notes

## Purpose

Create a simple, friendly website for educational tutorials and educational
tools.

The site should work as a static front end with no accounts and ideally no
backend. Any quizzes, lesson progress, or mini-tool state should be saved in
the browser with `localStorage` where useful.

## Core Product Goals

- Make it easy to find a unit, topic, course, or spec from the home page.
- Include a search bar on the main page.
- Support topic pages with an easy sidebar for navigating within a unit or
  course area.
- Make it easy to return from a topic page back to the full unit or course
  search.
- Keep the visual design simple, friendly, and calm.
- Leave room in the layout for future advertising or promoted resources.
- Reuse patterns and scripts across multiple lessons and mini-tools where
  possible.

## Constraints

- No user accounts.
- Prefer no backend at all.
- Use local browser storage for lightweight persistence.
- Existing items in `donetools/` are temporary and will be unified later.
- The original visual reference came from the existing unit conversion
  tutorial, but the current chosen direction is a scrapbook / notebook hybrid.

## Information Architecture Direction

- Home page:
  Search-first discovery of units, topics, and courses, with spec pages
  available but not dominant.
- Spec page:
  Short qualification overview with a route into all units in that spec.
- Unit page:
  Scheme-of-work hub for a unit, with ordered links to all related topics,
  quizzes, and mini-tools.
- Topic page:
  Main teaching page for a concept, designed to be reusable across multiple
  units where possible and likely to be the main SEO target.
- Shared tool layer:
  Reusable JavaScript helpers for storage, filtering, scoring, and common UI
  patterns.

## Current Product Decisions

- Students are more likely to search by unit number, unit name, or specific
  topic than by spec title alone.
- The homepage should show unit cards first, then topic cards, and spec cards
  last, while still letting spec pages appear in search.
- Spec cards should stay short and link through with a button such as
  `See all units` rather than listing every unit on the homepage.
- Unit cards should show the unit name, the spec it belongs to, and a subject
  area, with a CTA such as `See all topics`.
- Topic cards should show a short description and subject area, but should not
  mention a specific unit if the topic may belong to multiple units.
- Topic pages should be canonical where possible to avoid duplicate content
  across specs and improve SEO.
- Reusable topic pages should carry unit context through links or parameters so
  the same page can show different back links and previous/next lesson links
  without duplicating lesson content.
- Lesson pages should share a core structure with a breadcrumb, section
  sidebar, contextual back navigation, previous/next lesson links, optional
  interactive tools, and an end quiz unless there is a strong reason not to.
- Lesson pages should normally also include a glossary pattern, a common
  mistakes or exam traps section, and at least one short exam-style practice
  area with answer guidance where that format makes sense for the topic.
- Where both are present, a shorter quick quiz should usually come before the
  longer exam-style practice tasks, and exam-style practice should include
  built-in response areas so learners can write inside the page.
- The site should expose a clear shared `Reading and Accessibility` control
  from a sticky launcher rather than scattering many separate toggles around
  each page.
- Accessibility preferences that describe how the whole site should look, such
  as text size, visual simplification, contrast, palette, and font choices,
  should persist site-wide. Temporary page-use modes such as reading mode and
  focus mode should reset when the page reloads or the user leaves the page.
- Read aloud should keep its key controls visible after the accessibility panel
  is closed, including pause or resume, stop, visible progress, a clear
  indicator of the current reading point, easy movement between sections, and
  a simple speed control.
- Teacher mode should reuse the same lesson sections as a swipe or tap-friendly
  slide view instead of requiring a separately maintained duplicate slide deck.
- Teacher slide mode can include a collapsible presentation tools shelf for
  temporary in-session teaching aids such as highlighting, spotlighting, and
  blanking the screen, but it should stay compact when those tools are not in
  use.
- The current content focus is BTEC Level 3 Computing Unit 2.
- When the homepage is not filtered by search, it should prioritise real live
  pages. Planned lesson topics can still appear through search, but should not
  be presented as if they are already finished live pages by default.
- Unit pages should group lessons by specification headings such as `A1` and
  `B2`, but should usually expose the specific lesson targets directly instead
  of requiring an extra group-page click.
- When a new lesson page is created, its existence should also be reflected in
  the relevant unit page and in `javascript/data/course-catalog.js` so it is
  searchable from the homepage.

## Current Homepage Direction

- The hero should stay focused on learning and search.
- On large screens, the search card can overlap the bottom of the hero.
- On smaller screens, the search card should sit normally after the hero so it
  does not cover content below.
- Visible page copy should stay learner-facing. Avoid adding copy that reads as
  developer notes, SEO reminders, or explanations of the website itself unless
  there is a real user-facing reason to show it.
- The chosen homepage visual direction is currently a scrapbook / notebook
  hybrid.
- Keep ad space available, but prefer dedicated side or bottom placements over
  interrupting the catalogue with ads.

## Content Sources

- Spec links are listed in [course_specs.md](./course_specs.md).
- Unit 2 content planning and completion tracking now lives in
  [computing_unit_2.md](./computing_unit_2.md).
- Course metadata and homepage search entries currently live in
  `javascript/data/course-catalog.js`.
- Lesson content can later move into `content/lessons/`.

## Project Structure Direction

- `css/`
  Shared styling and theme tokens.
- `javascript/core/`
  Reusable helpers such as storage and search utilities.
- `javascript/data/`
  Local catalogue data for courses and units.
- `content/courses/`
  Source material or structured course metadata.
- `content/lessons/`
  Lesson and topic content that can feed topic pages later.
- `content/tools/`
  Shared content or configuration for reusable mini-tools.
- `pages/`
  Future course, unit, or topic page templates.
- `donetools/`
  Legacy experiments to fold into the main structure later.

## Foundation Status

- Requirements notes and agent startup notes are in place.
- The homepage has a working search experience using local data.
- The homepage now highlights the live Unit 2 hub plus live and planned Unit 2
  lesson pages.
- The first real unit hub now exists at `pages/units/btec-level-3-unit-2.html`.
- Live topic lessons now exist at `pages/topics/stacks-and-queues.html` and
  `pages/topics/registers-and-their-functions.html`, and
  `pages/topics/interrupts-and-register-handling.html`, and
  `pages/topics/arrays-lists-and-data-types.html`, and
  `pages/topics/matrices-and-arrays.html`, and
  `pages/topics/multi-dimensional-arrays-and-memory-order.html`.
- A shared lesson shell now supports sidebar navigation, contextual unit
  navigation, teacher slide mode, and quiz persistence.
- The current lesson template now includes glossary, exam trap, and exam-style
  practice patterns that future lessons should reuse where appropriate.
- A shared accessibility launcher now provides reading, focus, visual, font,
  contrast, and read-aloud controls across the live pages.
- Read aloud now uses a persistent mini player with pause or resume, stop,
  progress tracking, current-block highlighting, and speed control while it is
  active.
- Shared CSS, theme, and page-specific styling are split into reusable files.
- Layout space is reserved for future adverts or promos.

## Next Likely Steps

- Build more Unit 2 lessons on top of the shared lesson shell.
- Decide when lesson content should move from page HTML into structured
  `content/lessons/` data.
- Decide what a short spec page should include beyond description + unit links.
- Add `sitemap.xml` and likely `robots.txt` once the canonical live domain is
  known.
- Move course data into a more structured content format if needed.
- Decide how legacy `donetools/` pieces should be merged into the new shared
  design system.
- Add more lesson-specific mini-tools where the topic benefits from them.
