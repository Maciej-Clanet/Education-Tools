# What is a backend?

Page: [what-is-a-backend.html](../../pages/topics/what-is-a-backend.html).
Scope: the first Backend lesson, before the FastAPI setup reference. Assumes
basic familiarity with websites; no Python knowledge required.

1. **Introduced** — `#one-click`: a workshop booking has interface and shared-rule work.
2. **Covered** — `#frontend-backend`: browser interface versus server application.
3. **Covered** — `#where-they-live`: hosting files versus executing downloaded code.
4. **Covered** — `#local-and-live`: local services/ports and hosted deployments;
   localhost refers to the caller's device, not the developer's computer.
5. **Covered** — `#what-each-controls`: presentation, feedback, validation and rules.
6. **Covered** — `#database`: storage versus application logic; local browser storage
   is not a shared record. A backend does not always require a database.
7. **Developed** — `#request-journey`: manual five-step booking journey with the shared
   walkthrough component. Concurrent booking correctness is mentioned, not implemented.
8. **Introduced** — `#api`: methods, paths, endpoints, response status and JSON.
9. **Covered** — `#trust-boundary`: untrusted browser input, permissions and secrets.
10. **Covered** — `#when-needed`: static browser tools versus shared server work.
11. **Practice** — `#misconceptions`, `#quiz`, `#practice`: distinctions, quiz and
    saved explanations using new library/price scenarios.
12. **Practice** — `#recap`: roles and link to the practical setup lesson.

The page HTML is the authored source. Illustrated diagrams use semantic HTML,
the shared `css/backend-lessons.css` foundations, and
`css/pages/backend-concepts.css`. Original SVG symbols live in
`assets/images/backend-concepts/architecture-symbols.svg`; no third-party imagery
is used. Browser interfaces, server racks, database records, a laptop boundary and
cloud hosting make each location and responsibility visible. Labelled request and
response arrows also have text descriptions; narrow layouts stack vertically.
The manual five-step walkthrough changes the browser state, request/response payload
and shared record (one place becomes zero; booking BK-104 is saved). The current
actor is marked with a label and border as well as colour. Controls work under
reduced motion, and all states remain readable without JavaScript.
Teacher opener/dividers use shared inert templates. Quiz metadata is in the page
script and progress registry; written work uses the lesson shell's local storage.
Authentication, databases, HTTP implementation and deployment setup are not taught.
