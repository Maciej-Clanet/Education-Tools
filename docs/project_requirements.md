# Product requirements

Use this document for product, discovery and site-layout decisions. Lesson
composition belongs in [lesson authoring](lesson_authoring.md).

## Purpose and architecture

Educational tutorials and mini-tools, served as a static site without accounts.
Lightweight work and progress stay in the browser. BTEC Computing Unit 2 and the
separate Web Development resource hub are supported teaching areas; the structure
must allow reusable topics to serve other units and qualifications.

## Discovery and page roles

- Home helps learners find a unit, topic, course or specification quickly through
  search. Browse order: unit hubs and subject resource hubs, then topics, then
  specifications. A direct search can surface specifications normally.
- Unfiltered browsing shows live pages. Planned topics may appear in search but
  must not look like completed live resources. Availability and search metadata
  belong in `javascript/data/course-catalog.js`, not a second Markdown checklist.
- Specification pages stay brief and route into their units. Home specification
  cards link to units; unit cards identify the unit, qualification and subject.
- Unit hubs are ordered schemes of work grouped by specification headings, with
  direct lesson links. Resource hubs reuse that layout with generic labels such
  as “Overview”. Both make the main course/search route easy to reach.
- Topic pages are the main teaching/search destinations. Keep their content and
  catalogue descriptions unit-agnostic where possible; pass unit context through
  links/parameters for appropriate back and previous/next navigation.
- Unit quiz progress aggregates shared lesson quiz IDs. Protected classroom exam
  entries may save drafts/attempts locally and show feedback under each question.
  The existing client-side gate is not a server authentication system.
- Web basics sections offer lessons and numbered challenge grids. Challenges open
  the shared Playground, save independently, and expose skills on hover/focus/tap;
  opening an exercise does not establish completion. See [challenges](web_challenges.md).

## Design and accessibility

- Simple, friendly, calm scrapbook/notebook styling. Keep the home hero focused on
  learning and search. Search may overlap the hero on desktop but flows below it
  on small screens.
- Reserve side/bottom space for future adverts or promoted resources; do not put
  prominent adverts above or among the main catalogue entries.
- Use one shared Reading and Accessibility launcher. Site-wide font, contrast,
  text-size, palette and simplification preferences persist across pages;
  temporary reading/focus modes reset on reload or departure.
- While read aloud is active, retain a visible mini player after the panel closes:
  pause/resume, stop, progress/current location, section navigation and speed.
- Teacher Slides reuse lesson content and support keyboard, swipe and tap.
  Presentation tools are temporary and unobtrusive when closed.

Change these requirements when product decisions change, not when another lesson
is published. Source links are in [course specifications](course_specs.md).
