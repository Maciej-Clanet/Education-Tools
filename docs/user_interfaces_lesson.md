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
Output and echoed input are assigned with `textContent`. Each host declares
`data-current-command` and supplies the same initial input value in its HTML.
Initial state is a fresh prompt with that command prefilled but unexecuted.
Run command appends the command, output and a fresh prompt, then clears the input.
Transcript and history are bounded to 30 entries per terminal. Reset clears both
and restores the current command. Up/Down history still works without visible
shortcut instructions. A separate live status announces only the latest result;
the scrollable transcript remains keyboard-accessible for reviewing earlier runs.

The prompt/command/output slide uses a static Get-Date sequence. Five interactive
terminals begin at Get-Location. Their authored “Commands learned so far” buttons
accumulate earlier commands and fill the input without running it. A Current badge
and stronger border identify the slide's command; the pipeline slide also exposes
its introduced top-five extension. Run command is filled; Reset is secondary.

Supported examples: `Get-Date`, `Get-Location`, `Get-ChildItem`, `Get-Process`,
`Get-Help Get-Process`, `Get-Process | Sort-Object CPU -Descending`, and the latter
with `| Select-Object -First 5`. All use fictional fixed data. CPU values are
accumulated seconds, not current utilisation percentages. One static and five
interactive stages introduce the examples, retaining their teacher-only live-demo cues.
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

- Six existing activity tests pass after the terminal UX refinement. The terminal
  regression covers fresh/prefilled state, runs, transcript accumulation, picker
  clicks without execution, reset, instance isolation and unsupported input.
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
