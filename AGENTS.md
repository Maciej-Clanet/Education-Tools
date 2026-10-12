# Education Tools agent notes

## Project essentials

- Keep the site static-first, with no accounts and no backend unless requested.
  Use the existing localStorage helpers for lightweight learner persistence.
- Reuse existing components and page conventions. Keep the UI calm, accessible
  and student-facing; do not add developer notes or roadmap copy to lessons.
- Preserve lesson URLs, contextual navigation and saved learner work. Before
  changing assessments, follow the storage rules in the lesson authoring guide.
- Find the authored source before editing a generated page. Lesson outlines
  identify generators where used; do not maintain competing HTML/source copies.
- Shared styles: `css/`; page styles: `css/pages/`. Shared browser behaviour:
  `javascript/core/`; page composition: `javascript/pages/`; data and authored
  content: `javascript/data/` and `content/`. `donetools/` contains legacy experiments.

## Read for the task

Read relevant sections, not every linked document. A small correction does not
require a full project or curriculum review.

- **Product, homepage or navigation:** [project requirements](docs/project_requirements.md).
- **Lesson creation or substantial revision:** [lesson authoring](docs/lesson_authoring.md),
  then `docs/lessons/<page-slug>.md` if present. Consult adjacent outlines when
  deciding prerequisites or avoiding repeated teaching. An absent outline says
  nothing about whether a page exists; inspect the page and catalogue.
- **Choosing a lesson interaction:** scan [shared components](docs/shared_components.md),
  then read only the selected component's instructions and current usage example.
- **Changing animation:** apply the teaching/decorative distinction in
  [teaching motion](docs/teaching_motion.md), including its reduced-motion rule.
- **Unit 2 scope:** the applicable section of [Computing Unit 2](docs/computing_unit_2.md).
  Other qualification sources are in [course specifications](docs/course_specs.md).
- **Web JavaScript sequencing:** [JavaScript Basics](docs/javascript_basics.md).
- **Verification setup:** [testing](docs/testing.md); select checks for the change.

## Documentation upkeep

Record current coverage, intent and non-obvious constraints. Lesson outlines list
topics in teaching order with depth and boundaries; they are not completion logs.
Update the affected outline when teaching coverage changes. Keep actual quiz
configuration in code, and availability in the catalogue and hubs.

Put reusable authoring knowledge in the shared reference, product decisions in
project requirements, and image rights beside the assets. Do not automatically
create improvement plans, duplicate inventories, or append test reports and
session histories. Preserve unresolved requirements and important sources when
retiring documentation. Only change these notes for enduring project-wide rules
or documentation routes.
