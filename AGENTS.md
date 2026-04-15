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

- The home page should help users find a course, spec, unit, or topic quickly.
- Content should be organised primarily by course or specification.
- Topic or unit pages should support easy sidebar navigation.
- Users should be able to get back to the full course or unit search easily.
- Keep room in layouts for future advertising or promoted resources.

## Design Direction

- Keep the UI simple, friendly, and calm.
- The preferred visual reference so far is:
  `donetools/unit conversion tutorial/`
- Reuse shared patterns rather than building isolated one-off interfaces.

## Structure Direction

- Shared styles belong in `css/`.
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
