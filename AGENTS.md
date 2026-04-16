# Education Tools Agent Notes

## Start Here

Before making major UI, content, or structure changes, read:

- `docs/project_requirements.md`
- `docs/course_specs.md`

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
- Spec pages should stay brief and mainly route users into their unit pages.
- Unit pages should act as scheme-of-work hubs with links to all topics in that
  unit.
- Topic pages should be the main learning/SEO pages and should stay
  unit-agnostic where possible so one topic can support multiple units or
  specs.
- Topic or unit pages should support easy sidebar navigation.
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

## Working Style

- Prefer reusable components, helpers, and content structures that can support
  multiple lessons and mini-tools later.
- When adding a new section or page, fit it into the shared structure instead
  of creating an isolated mini-project unless the user asks for that.
- If you make a major product or IA decision, update `docs/project_requirements.md`
  and keep this file aligned with it so a new session can resume quickly.
