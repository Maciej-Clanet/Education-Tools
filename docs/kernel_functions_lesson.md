# Kernel functions lesson redesign

## Slide order

1. Why does a kernel exist?
2. Applications, kernel and hardware
3. Build the picture one part at a time
4. Program vs process
5. Starting a program
6. Running and ending a process
7. Why can’t programs control everything?
8. User mode: useful work within limits
9. Kernel mode: trusted code with privileges
10. System calls: request, trusted handling, return
11. What is an interrupt?
12. Interrupt handling, step by step
13. Why manage memory?
14. Allocating RAM
15. Protecting and reclaiming memory
16. What is multitasking?
17. CPU time slicing
18. What about multiple CPU cores?
19. Multitasking and memory together
20. Applications request storage access
21. Disk access: coordinate competing requests
22. Why do file systems exist?
23. What does a file system track?
24. Opening and saving a file
25. FAT32 and NTFS: two file-system examples
26. Why do we need drivers?
27. Device drivers translate requests
28. The full kernel map
29. Wider OS management: networking
30. Wider OS management: security
31. What happens when you save an image?
32. Kernel control room
33. Common mistakes
34. Check your understanding
35. Exam-style practice

## Visualiser

`javascript/core/kernel-visualiser.js` renders labelled snapshots from `javascript/data/kernel-visualiser-data.js`; shared appearance is in `css/kernel-visualiser.css`. Native Play/Pause, Previous, Step and Reset controls use a finite state reducer. Playback ends at the last frame and pauses when hidden/offscreen. Reduced motion disables timed playback; every snapshot remains available through Step. No emulator, libraries, canvas or continuously running loop. Readable sequence transcripts remain without JavaScript.

Reused on teaching sections 5, 6, 10, 12, 14, 15, 17, 19, 21, 24 (open and save), 27 and 31. One interrupt player provides seven snapshots and a keyboard trigger. RAM has 12 labelled illustrative blocks; CPU strips show labelled illustrative time slices.

The system-call sequence uses optional `execution: true` configuration and a
`mode` string on each frame. Its active nodes identify executing code rather than
resources or spatial movement. Other sequences keep their existing focus labels.
User and kernel modes are defined as processor privilege modes, with a comparison
table, a five-stage file-save example and an explicit application-privilege warning.

Nine teacher-only dividers precede processor privilege modes, interrupts, memory
management, multitasking, disk access, file systems, device drivers, wider OS
management and the integrated recap. There are 35 student teaching sections and
44 teacher slides. See `teacher_section_dividers.md` for the reusable contract.

## Components and scope

Layered HTML/CSS diagrams, RAM blocks, CPU timelines, privilege boundaries, file records, lifecycle and storage/driver pipelines are code-native visuals. No new SVG/raster assets. Shared lesson shell, teacher presentation, keyboard navigation, quiz scoring/persistence and exam draft saving are reused. A small shared navigation fix forces initial scrolling when entering/restoring teacher mode so the visible section matches the counter and hash; scoring and storage logic remain unchanged. Scenario choices use native checkboxes and set comparison with missing/extra-answer feedback. Quiz version 2 has 16 questions and a 12/16 pass score; fresh storage and answer IDs avoid applying old answers to new questions.

Conceptual simplifications: process setup can overlap; work within processes is scheduled through threads; RAM blocks are ownership models, not addresses; equal time slices are illustrative; interrupted work need not be the next scheduled work; drivers can be outside the kernel; storage may buffer/defer work and completion does not necessarily mean durable storage. Networking/security remain wider OS management responsibilities, supported by kernel mechanisms.

Deferred: scheduling algorithms, paging/page tables and virtual-memory architecture, registers and interrupt priority detail, multiprocessing/multithreading detail, file-system engineering, networking protocols, security administration and driver development.

## Technical references

- [Microsoft: user and kernel modes](https://learn.microsoft.com/en-us/windows-hardware/drivers/gettingstarted/user-mode-and-kernel-mode)
- [Microsoft: processes and threads](https://learn.microsoft.com/en-us/windows/win32/procthread/about-processes-and-threads)
- [Microsoft: interrupt service routines](https://learn.microsoft.com/en-us/windows-hardware/drivers/kernel/introduction-to-interrupt-service-routines)
- [Microsoft: file-system comparison](https://learn.microsoft.com/en-us/windows/win32/fileio/filesystem-functionality-comparison)

## Verification

### Focused refinement pass

- Six focused tests pass: four existing visualiser tests and two shared divider tests.
- Browser runtime reported no available browsers in this session; manual layout,
  control interaction and console checks for this refinement remain unverified.
- Earlier browser checks below describe the preceding redesign, not this refinement.

- Four focused state/answer-set tests pass (`node tests/kernel-visualiser.test.mjs` and Node test runner).
- JavaScript syntax and `git diff --check` pass.
- Local Chrome checks pass for Step/Play/Pause/Previous/Reset, interrupt triggering and resumption, independent players, RAM allocation/reclamation, CPU slices, integrated saving, partial/multiple scenario answers and reset.
- Quiz 16/16 scoring, reset and reload persistence, plus exam draft restoration, verified through the shared shell.
- Normal and teacher layouts reviewed at desktop and mobile widths; map, recap, opening/saving pipelines and table grid reviewed visually. Keyboard activation does not advance the slide; offscreen playback pauses; reduced motion disables timed playback while retaining manual steps.
- Sidebar/context/sequence links and static transcripts without JavaScript checked. No JavaScript exceptions or lesson asset failures; Chrome only reports the existing missing site favicon.
- Shared teacher positioning regression checked at the kernel recap and on the neighbouring OS-types lesson (enter, reload, previous/next, exit).
