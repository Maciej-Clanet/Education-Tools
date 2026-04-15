# Educational Tutorials And Tools Project Notes

## Purpose

Create a simple, friendly website for educational tutorials and educational
tools.

The site should work as a static front end with no accounts and ideally no
backend. Any quizzes, lesson progress, or mini-tool state should be saved in
the browser with `localStorage` where useful.

## Core Product Goals

- Make it easy to find a course, spec, unit, or topic from the home page.
- Organise content by specification or course name first.
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
- The visual direction should take inspiration from the existing unit
  conversion tutorial, which is currently the preferred style reference.

## Information Architecture Direction

- Home page:
  Searchable list of specs or courses.
- Course/spec page:
  Overview of units within that qualification.
- Topic/unit page:
  Sidebar navigation for lessons, sections, quizzes, and tool links.
- Shared tool layer:
  Reusable JavaScript helpers for storage, filtering, scoring, and common UI
  patterns.

## Content Sources

- Spec links are listed in [course_specs.md](./course_specs.md).
- Course metadata can start as a local JavaScript or JSON catalogue.
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

## First Build Milestone

- Create this requirements note.
- Create a homepage with placeholder course selection.
- Add a working search experience using local data.
- Reserve layout space for future adverts or promos.
- Scaffold folders and reusable scripts for future lessons and tools.

## Next Likely Steps

- Add a first real course page and unit page shell with sidebar navigation.
- Move course data into a more structured content format if needed.
- Decide how legacy `donetools/` pieces should be merged into the new shared
  design system.
- Add common quiz components that use `localStorage`.
