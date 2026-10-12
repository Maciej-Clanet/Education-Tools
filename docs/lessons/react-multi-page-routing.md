# Setting up multi-page routing

Page: [react-multi-page-routing.html](../../pages/topics/react-multi-page-routing.html).
Source: [React Router Word document](../word%20documents/React%20Router.docx).

Scope: basic declarative React Router setup in an existing Vite React JavaScript
app. Prerequisite: [project setup](starting-a-react-project.md), including its
global CSS. Layout routes and Outlet belong in a separate lesson. Nested routes,
parameters, loaders, programmatic navigation and framework routing are excluded.

1. **Introduced** — `#before-you-start`: different URL paths within a single-page
   application; Home at `/`, About at `/about`.
2. **Covered** — `#install-router`: install react-router in the project folder.
3. **Covered** — `#browser-router`: preserve the Vite entry imports and wrap App once.
4. **Covered** — `#page-files`: page folders and JSX/CSS pairs; folders do not
   automatically define routes in this setup.
5. **Covered** — `#page-components`: Home and About components and exports.
6. **Covered** — `#define-routes`: routing.jsx, Routes, Route, index and path,
   imports and JSX element props, limited to the two top-level routes.
7. **Covered** — `#connect-app`: render Pages inside App and use Link for navigation.
8. **Covered** — `#active-links`: replace the Link example with NavLink navigation.
9. **Covered** — `#style-navigation`: base/active classes and keyboard focus.
10. **Practice** — `#check-routing`: run, switch routes, inspect active links,
    Back/Forward and refresh. Hosting fallback is mentioned, not taught in depth.
11. **Practice** — `#common-mistakes`: router context, missing Pages render,
    import paths, destinations and active styles.

HTML is the authored source. Static syntax spans preserve readable/copyable JSX
without a runtime highlighter; `initCodeSnippets` adds copy controls. Both React
references use `css/react-reference.css`. All three screenshots are extracted
unchanged, with provenance beside the assets. The complete App examples supply
the missing route-rendering connection in the source document.

No Playground or quiz: this is a steps reference checked in the learner's own
project. No previous/next sequence or future-lesson placeholder is assigned.
