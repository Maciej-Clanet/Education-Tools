# Starting a FastAPI backend

Page: [starting-a-fastapi-backend.html](../../pages/topics/starting-a-fastapi-backend.html).
Scope: a first practical Python backend, from an empty folder to a local API with
request models and grouped routes. Prerequisite: [What is a backend?](what-is-a-backend.md)
and basic Python familiarity. Python 3.10+; no prior FastAPI knowledge assumed.

1. **Introduced** — `#before-you-start`: browser request, Python function and JSON
   response; local tools and intended outcome.
2. **Covered** — `#project-folder`: separate backend folder, VS Code editor versus
   terminal, and an initially empty main.py.
3. **Covered** — `#virtual-environment`: project package isolation before commands;
   PowerShell and macOS/Linux creation and activation side by side.
4. **Introduced / Covered** — `#dependencies`: FastAPI as a framework, pip as an
   installer and Uvicorn as the server; install the FastAPI standard extra into
   the active venv. Database drivers are deferred.
5. **Covered** — `#first-endpoint`: import, app object, GET decorator, function and
   return, with code and matching explanations alongside each other.
6. **Covered** — `#run-server`, `#test-endpoint`: command parts in order, main:app,
   development reload and port 8001; root JSON, /docs, response body and status 200.
7. **Covered** — `#save-dependencies`: gitignore on its own teaching slide; recording
   and restoring requirements together on the next, with both commands visible.
8. **Introduced** — `#middleware`: shared before/after processing, using theoretical
   timing and logging examples. Custom middleware implementation is deferred.
9. **Introduced / Developed** — `#cors`, `#configure-cors`: different frontend/backend
   origins and browser permission to read responses; ready-made middleware with
   local Vite origins, GET/POST and Content-Type. CORS is not authentication.
   Preflight mechanics and deployment policy are deferred.
10. **Covered** — `#organise-files`: models, routes and main.py responsibilities.
    This local Python 3 layout uses namespace-package imports without empty
    __init__.py files; run from the project root.
11. **Developed** — `#request-models`: body → required field/type checks → function;
    Pydantic BaseModel, RegisterForm and LoginForm. Email strings do not validate
    address ownership. Advanced validation and account handling are deferred.
12. **Covered** — `#route-file`: router imports, then one function per teaching slide;
    typed parameters, plain model_dump() to a dictionary, dictionary lookup,
    direct model-field access and explicit response fields.
13. **Covered** — `#include-router`: importing and including the router, prefix and
    tags beside code; complete main.py; always-visible code-to-path mapping for
    POST /auth/register using the same example throughout.
14. **Practice** — `#test-models`, `#restart-and-fix`: visible request/response pair,
    missing-field 422, second POST route, expected docs listing and common errors.

HTML is the authored source. Snippets use the shared static highlighting/copy
component; diagrams use semantic HTML/CSS and remain readable without JavaScript.
Page composition is in `css/pages/starting-a-fastapi-backend.css`, using shared
backend diagram foundations. Used screenshots retain credits beside the assets.
The lesson keeps the same section anchors and contextual previous link.

Auth-named routes demonstrate request handling only: no accounts, password
storage, login or database. model_dump() contains all fields internally; returned
responses explicitly select email/username and never echo passwords. There is no
quiz or written-answer store on this reference lesson.

Technical references: [Python namespace packages](https://docs.python.org/3/reference/import.html#namespace-packages),
[venv](https://docs.python.org/3/library/venv.html),
[pip freeze](https://pip.pypa.io/en/stable/cli/pip_freeze/),
[FastAPI CORS](https://fastapi.tiangolo.com/tutorial/cors/) and
[Pydantic serialization](https://docs.pydantic.dev/latest/concepts/serialization/).
