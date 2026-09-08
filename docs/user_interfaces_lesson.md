# User interfaces refinement

The existing URL is retained. Generic software selection is merged into the next
lesson’s existing `choice-factors` section; OS selection and OS performance remain
for an operating-system refinement.

## Teaching order

1. What is a user interface?
2. Three interface styles to know
3. Graphical User Interface
4. Why GUIs are easy to learn
5. GUI strengths and limitations
6. What is a command-line interface?
7. Prompt, command and output
8. Where am I working?
9. Inspect a folder without File Explorer
10. Inspect running processes
11. CLI users use help
12. Combine commands into a pipeline
13. Why use a CLI when GUIs exist?
14. Repetition and automation
15. CLI in software engineering
16. CLI in cybersecurity
17. CLI in AI and data science
18. Servers, cloud and DevOps
19. CLI strengths and limitations
20. What is a menu-based interface?
21. Why can limiting choices be useful?
22. Real menu-based examples
23. Menu-based strengths and limitations
24. Real systems can use more than one interface
25. GUI vs CLI vs menu-based
26. What makes an interface suitable?
27. Worked scenarios
28. Choose the best interface
29. Common exam mistakes
30. Check your understanding
31. Exam-style practice

Five teacher-only dividers introduce graphical interfaces, command-line interfaces,
menu-based interfaces, comparing interface styles, and practice/exam technique.
There are 31 student sections and 36 teacher slides.

Quiz version 2: 12 questions, pass score 9. New exam response IDs prevent previous
software-choice drafts appearing under new UI questions.

## Components

The existing lesson shell supplies navigation, teacher slides, quiz scoring,
local progress and saved exam drafts. `data-teacher-note` is a shared CSS-only
cue pattern; five inert divider templates reuse the existing divider runtime.

`javascript/core/simulated-terminal.js` takes a config keyed by the host's
`data-simulated-terminal` value, with a prompt and a list of `{command, output}`
entries. It performs a whole-entry lookup after case/space normalisation. It
does not interpret shell syntax, evaluate code, access files or make requests.
Output and echoed input are assigned with `textContent`. History is temporary,
bounded to 30 entries per terminal, and cleared by Reset. Example buttons fill
the labelled input; Enter runs it; Up/Down traverses history and restores a draft.
Static example output remains readable without JavaScript.

Supported examples: `Get-Date`, `Get-Location`, `Get-ChildItem`, `Get-Process`,
`Get-Help Get-Process`, `Get-Process | Sort-Object CPU -Descending`, and the latter
with `| Select-Object -First 5`. All use fictional fixed data. CPU values are
accumulated seconds, not current utilisation percentages. Six short terminal
stages introduce the examples, each with a minimal teacher-only live-demo cue.
Network-related career examples are conceptual, with a teacher-check-first cue.

`javascript/core/paired-scenarios.js` generalises the existing native select-pair
pattern. Config provides `acceptedPairs` and explanatory feedback. The till
scenario accepts GUI or menu-based with the guided-workflow justification. It
does not independently accept a correct interface and an unrelated reason.
Both components keep lesson-specific data in
`javascript/data/user-interface-activities.js`.

Five local SVG teaching mockups show a desktop/terminal/ticket trio, an image
editor, an ATM, menu workflows and an editor with an integrated terminal.
Software engineering, cybersecurity, AI/data and server examples explain career
use cases without requiring commands to be memorised or executed.

## Verification and limits

- Six focused tests pass: four terminal/scenario tests and two shared divider tests.
- Changed JavaScript syntax, local links, unique IDs, labels and SVG parsing pass.
- No package manifest or configured lint/build pipeline exists for this static site.
- Browser connection reported no available browser. Layout, real keyboard/click
  interaction, quiz and draft persistence in a browser, teacher navigation and
  console checks remain manually unverified in this session.
- OS choice and OS use/performance remain deferred. PowerShell syntax training,
  scripting, security tools, Git, Python environments and SSH setup are out of scope.

Technical references:
- [Microsoft: Get-Process](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/get-process)
- [Microsoft: PowerShell pipelines](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_pipelines)
