# Starting a FastAPI backend

Page: [starting-a-fastapi-backend.html](../../pages/topics/starting-a-fastapi-backend.html).
Sources: [Starting a backend project](../word%20documents/Starting%20a%20backend%20project.docx)
and [Backend Reacap Doc](../word%20documents/Backend%20Reacap%20Doc.docx).
Prerequisite: [What is a backend?](what-is-a-backend.md); basic Python familiarity
helps with functions, imports and types. This is the second Backend lesson.

1. **Introduced** — `#before-you-start`: scope and local prerequisites.
2. **Covered** — `#project-folder`: main.py, FastAPI app and GET / greeting.
3. **Covered** — `#virtual-environment`: creation, shell-specific activation and
   interpreter checks; environment versus virtual machine/server.
4. **Covered** — `#dependencies`: interpreter-bound pip and FastAPI standard extra;
   MongoDB driver is explained but not required or configured.
5. **Covered** — `#run-server`: Uvicorn import target, reload, port 8001 and stopping.
6. **Covered** — `#test-endpoint`: root JSON and interactive /docs.
7. **Covered** — `#save-dependencies`: gitignore, freeze and restoring requirements.
8. **Developed** — `#middleware`: request/response placement and optional working
   timing middleware. No custom authentication/region-blocking middleware.
9. **Covered** — `#cors`, `#configure-cors`: origins, browser enforcement, same-origin
   /docs, preflight awareness and explicit local Vite origins. Not bot protection.
10. **Covered** — `#organise-files`, `#request-models`: models/routes packages and
    Pydantic body shapes; string fields do not establish identity or email validity.
11. **Covered** — `#route-file`, `#include-router`: APIRouter, prefix, tags, explicit
    mounting and complete final main.py.
12. **Practice** — `#test-models`, `#restart-and-fix`: valid/missing-field requests,
    expected route list, restarting and common errors.

HTML is the authored source; static Python/shell/JSON highlighting and copy use
the existing snippet component. Six images are extracted unchanged; credits sit
beside assets. The recap prefix image illustrates an older deletion path, which
is explicitly not implemented. Original code-native diagrams share backend CSS.

The auth-named sample routes only demonstrate models and routers: no account
creation, password storage, login or database. Responses exclude passwords and
do not claim authentication succeeded. The original invalid middleware syntax,
typographic command dashes and CORS security claims have been corrected. The
source documents' port 3000 is aligned to the existing Vite setup at 5173.
This reference omits a quiz and has a concrete previous link, with no future placeholder.
