# Education Tools Agent Notes

## Start Here

Before making major UI, content, or structure changes, read:

- `docs/project_requirements.md`
- `docs/course_specs.md`
- `docs/computing_unit_2.md` when working on BTEC Level 3 Computing Unit 2

## Project Defaults

- This project should stay static-first.
- No accounts are needed.
- Prefer no backend at all unless the user explicitly changes direction.
- Use `localStorage` for lightweight persistence such as quiz progress,
  answers, or tool state.

## Product Direction

- The home page should help users find a unit, topic, course, or spec quickly.
- Home page browsing should prioritise unit pages first, then topic pages, with
  spec pages shown last unless directly searched for.
- When the home page is not filtered by search, live pages should be shown by
  default. Planned lesson topics can still appear in search, but should not be
  presented as finished live pages in the default browse state.
- Spec pages should stay brief and mainly route users into their unit pages.
- Unit pages should act as scheme-of-work hubs with links to all topics in that
  unit.
- Unit pages should not force an extra "topic group page" click unless that
  middle page has a real purpose. Group cards on the unit page should normally
  contain direct lesson lists.
- Topic pages should be the main learning/SEO pages and should stay
  unit-agnostic where possible so one topic can support multiple units or
  specs.
- Reusable topic pages should use unit context in their links or parameters so
  the same page can show different back links and previous/next lesson links
  without duplicating the lesson itself.
- Topic or unit pages should support easy sidebar navigation.
- Lesson pages should normally include a sidebar, contextual back navigation,
  previous/next lesson links, and an end quiz unless there is a clear reason
  not to.
- Lesson pages should normally reuse a glossary pattern, a common mistakes or
  exam traps section, and at least one exam-style practice area with answer
  guidance where that fits the topic.
- Where both are present, a shorter quick quiz should usually come before the
  longer exam-style practice tasks, and exam practice should include on-page
  response areas so students can write inside the lesson itself.
- Accessibility and display adjustments should normally live in one clear
  shared launcher such as `Reading and Accessibility`, not as scattered page
  toggles.
- Site-wide accessibility preferences such as font, contrast, text size,
  palette, and visual simplification should persist across pages. Temporary
  reading or focus modes should reset when the page reloads or the user leaves
  the page rather than behaving like saved preferences.
- Read aloud should keep a small visible control surface while active so users
  can pause or resume, stop, see progress, move between sections, adjust
  speed, and
  understand what part of the page is currently being read even after closing
  the accessibility panel.
- Lesson pages should support a teacher slide mode that reuses the same lesson
  sections and works well with swipe and tap navigation on touch displays.
- Teacher slide mode can include a collapsible presentation tools shelf for
  temporary slide-only teaching aids such as highlighting, spotlighting, or
  blanking the screen, but it should stay unobtrusive when those tools are not
  open.
- Users should be able to get back to the full course or unit search easily.
- Keep room in layouts for future advertising or promoted resources.

## Design Direction

- Keep the UI simple, friendly, and calm.
- Keep the hero focused on learning and search. Do not place prominent ad
  blocks above the catalogue on the home page.
- Reuse shared patterns rather than building isolated one-off interfaces.

## Structure Direction

- Shared styles belong in `css/`, with page-specific styling in `css/pages/`.
- Reusable browser logic belongs in `javascript/core/`.
- Local catalogue or structured content data belongs in `javascript/data/` or
  `content/`.
- Future page shells belong in `pages/`.
- Existing items in `donetools/` are legacy experiments and should not be
  treated as the final structure.
- `pages/units/btec-level-3-unit-2.html` is the first live unit hub.

## Working Style

- Prefer reusable components, helpers, and content structures that can support
  multiple lessons and mini-tools later.
- When adding a new section or page, fit it into the shared structure instead
  of creating an isolated mini-project unless the user asks for that.
- Keep visible page copy student-facing. Do not add text that reads like
  developer notes, SEO reminders, roadmap status, or explanations of the site
  itself unless the user explicitly wants that kind of meta copy on the page.
- If you make a major product or IA decision, update `docs/project_requirements.md`
  and keep this file aligned with it so a new session can resume quickly.
- Treat `docs/computing_unit_2.md` as the progress tracker for Unit 2 lessons.
  As lesson pages are completed, their status should be reflected there.
- When a new lesson page is added, also update the relevant unit page and
  `javascript/data/course-catalog.js` so the lesson stays discoverable from the
  homepage search.
