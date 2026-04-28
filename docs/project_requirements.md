# Edu Tools Notes

## Purpose

Static-first edu tutorials/tools site. Calm, friendly. No accounts. Prefer no backend. Quiz/progress/tool state -> `localStorage`.

## Goals

- Home: fast find unit/topic/course/spec.
- Main search bar.
- Topic pages: sidebar nav inside unit/course context.
- Easy return topic -> full unit/course search.
- Simple calm UI.
- Leave ad/promo room.
- Reuse patterns/scripts across lessons/tools.

## Constraints

- No accounts.
- No backend unless user changes direction.
- Browser storage for light persistence.
- `donetools/` = legacy experiments, fold later.
- Original visual ref: unit conversion tutorial. Current direction: scrapbook/notebook hybrid.

## IA

- Home: search-first. Units/topics/courses primary; specs searchable, not dominant.
- Spec page: brief qual overview -> all units.
- Unit page: scheme-of-work hub, ordered topic/quiz/tool links.
- Topic page: main concept teaching/SEO page; reusable across units where possible.
- Shared tool layer: JS helpers for storage/filter/scoring/common UI.

## Product Decisions

- Students likely search by unit number/name/topic, less by spec title.
- Homepage default order: live units -> live topics -> specs. Search can reveal planned lessons.
- Spec cards short, CTA e.g. `See all units`.
- Unit cards show unit name/spec/subject, CTA e.g. `See all topics`.
- Topic cards show short desc/subject; avoid unit mention if multi-unit.
- Topic pages canonical where possible; avoid duplicate content.
- Reusable topics carry unit context via links/params for back/prev/next without duplicate lessons.
- Lesson shell: breadcrumb, section sidebar, contextual back, prev/next, optional tools, end quiz unless reason.
- Lesson content normally has glossary, exam traps/common mistakes, exam-style practice + answer guidance.
- Quick quiz before longer exam practice. Exam practice has on-page response areas.
- Shared `Reading and Accessibility` sticky launcher; avoid scattered toggles.
- Site-wide prefs persist: text size, simplification, contrast, palette, font.
- Temporary modes reset on reload/leave: reading/focus.
- Read aloud mini-player stays visible after panel close: pause/resume, stop, progress, current point, section nav, speed.
- Teacher mode reuses lesson sections as swipe/tap slide view, no duplicate deck.
- Teacher slide tools shelf collapsible: highlight, spotlight, blank screen; compact when idle.
- Focus now: BTEC Level 3 Computing Unit 2.
- Default homepage shows real live pages only. Planned topics only via search.
- Unit pages group by spec headings e.g. `A1`, `B2`, expose lesson targets directly.
- New lesson page also update relevant unit page + `javascript/data/course-catalog.js`.

## Homepage

- Hero = learning + search.
- Large screens: search card may overlap hero bottom.
- Small screens: search card sits after hero.
- Visible copy learner-facing. No dev/SEO/roadmap/meta copy unless user-facing need.
- Visual direction: scrapbook/notebook hybrid.
- Keep ad room, prefer side/bottom over catalogue interruption.

## Sources

- Spec links: [course_specs.md](./course_specs.md)
- Unit 2 plan/progress: [computing_unit_2.md](./computing_unit_2.md)
- Catalogue/search data: `javascript/data/course-catalog.js`
- Future lesson content: `content/lessons/`

## Structure

- `css/` shared styles/tokens.
- `javascript/core/` reusable storage/search/UI helpers.
- `javascript/data/` local catalogue data.
- `content/courses/` source/structured course metadata.
- `content/lessons/` lesson/topic content later.
- `content/tools/` mini-tool content/config.
- `pages/` future course/unit/topic templates.
- `donetools/` legacy, fold later.

## Status

- Requirements + agent notes exist.
- Homepage search works with local data.
- Homepage highlights live Unit 2 hub + live/planned Unit 2 lessons.
- First live unit hub: `pages/units/btec-level-3-unit-2.html`.
- Live topic lessons:
  `computer-system-types-and-internal-components`,
  `input-output-and-storage-devices`,
  `hardware-performance-and-component-choice`,
  `raid-and-nas-storage-systems`,
  `operating-system-types`,
  `kernel-functions-and-system-management`,
  `user-interfaces-and-software-choice`,
  `utility-application-and-open-source-software`,
  `collecting-and-processing-data`,
  `data-across-multiple-systems`,
  `backup-and-data-recovery`,
  `stored-program-architecture-von-neumann-and-harvard`,
  `cluster-computing-uma-and-numa`,
  `emulation-in-computer-systems`,
  `instruction-cycle`,
  `cpu-performance-instruction-sets-and-cache`,
  `pipelining-multi-processing-and-multi-threading`,
  `cpu-architecture-for-different-systems`,
  `registers-and-their-functions`,
  `interrupts-and-register-handling`,
  `stacks-and-queues`,
  `arrays-lists-and-data-types`,
  `matrices-and-arrays`,
  `multi-dimensional-arrays-and-memory-order`,
  `communication-channels-and-connection-methods`,
  `transmission-methods-synchronous-asynchronous-serial-and-parallel`,
  `packet-data-packet-switching-and-protocols`,
  `encryption-and-data-compression`,
  `error-detection-methods`,
  `error-correction-with-arq-and-fec`.
- Shared lesson shell: sidebar, contextual unit nav, teacher slide mode, quiz persistence.
- Current lesson template includes glossary/exam traps/exam practice patterns.
- Shared accessibility launcher: reading, focus, visual, font, contrast, read-aloud controls.
- Read aloud mini-player: pause/resume, stop, progress, current-block highlight, speed.
- CSS/theme/page styles split reusable.
- Layout reserves future ad/promo space.

## Next

- Build more Unit 2 lessons on shared shell.
- Decide when lesson HTML -> structured `content/lessons/`.
- Decide brief spec page content beyond desc + unit links.
- Add `sitemap.xml`/`robots.txt` after canonical domain known.
- Move course data into structured content if needed.
- Merge `donetools/` into design system.
- Add lesson mini-tools where useful.
