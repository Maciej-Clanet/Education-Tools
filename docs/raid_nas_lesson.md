# RAID and NAS: visual teaching pass

42 student sections / 49 Teacher Slides, including one shared opener and six
teacher-only dividers. The page retains its URL, unit context, sidebar, glossary,
previous/next links, local quiz progress and four written response areas.

## Authoring

- The teaching source is `content/raid-nas-sections.mjs`; assessments and the
  static shell are assembled by `build-raid-lesson.mjs`.
- Run `node build-raid-lesson.mjs` after changing teaching content or assessments.
  It preserves the existing page header and writes the static HTML. It does not
  rewrite diagrams, photographs or this document.
- Page styles: `css/pages/raid-and-nas-storage-systems.css`.
- Activities: `javascript/pages/raid-storage-activities.js`; RAID definitions,
  preview content, decision scenarios and pure models: `javascript/data/raid-storage-data.js`.
- The September review and point coverage are in `docs/raid_nas_improvement_plan.md`.

## Teaching decisions

The single-drive problem precedes the RAID solution. A short, selectable level
preview supplies context; the three mechanisms are then taught without named
RAID levels. Capacity follows the mechanisms. Each detailed level is immediately
followed by a good-fit/poor-fit case; the six decision-task contexts are different.

Drive trays use labels and patterns as well as colour. Capacity bars show
installed versus usable space. Formula buttons open on hover, keyboard focus or
tap; Escape closes them. Formula controls and broader revision details are hidden
in Teacher Slides. The full comparison table remains in student revision and in
one reference dialog at the decision task. Teacher prompts have been removed.

The parallel-reading example is illustrative, not a measured benchmark. Equal
pieces arrive in six beats from one drive, or two beats from three drives. It
loops by default only while visible, can pause, and opens in a completed, paused
state when reduced motion is preferred. Background tabs and offscreen slides do
not advance it. Animation state is temporary.

The XOR primer teaches same/different before the symbol. Reconstruction tests
both possible missing bits. Four-bit XOR is optional student revision. The
parity-row selector retains text labels. The generic rebuild and the retained
RAID 5 rebuild show loss, degraded access, replacement, rebuilding and completion.
RAID 10 still lets students try individual failures in each mirror pair.

The real NAS photograph is local and credited in the visible caption; source,
licence and modification information are in `assets/images/storage/CREDITS.md`.
The cutaway is conceptual and distinguishes network electronics from the Ethernet
socket. Local versus network paths are full-width, stacked rows. NAS benefits,
costs, file requests and RAID-versus-backup explanations use progressive stages.
SAN starts with the server's need, then compares requests for a named file with
requests for numbered blocks; storage volume is defined in plain language.

## Assessment and persistence

Quiz version 3: 14 questions, pass score 10. The former RAID 5 formula question now
checks why distributed parity reduces usable space. The two-drive mirror question
still checks that a copy uses space. Written guidance does not require formulas.
The lesson config and Unit 2 aggregate metadata both use version 3.

Quiz answers save under `lesson-raid-and-nas-storage-systems-quiz-v3`. Existing
exam response IDs and their storage key are retained. Fresh decision contexts use
`lesson-raid-nas-decisions-v2`, so old-context answers are not shown against new
requirements; the earlier storage key is not deleted. Decision explanations are
self-checked, not automatically marked. The dialog closes with Escape and returns
focus to its opener.

Without JavaScript, all staged explanations are shown and the full RAID preview
and comparison reference remain available in native revision disclosures. Quiz
scoring, saved responses and Teacher Slides need JavaScript. The quiz and written
practice sections remain scrollable assessment pages in slide mode.

## Technical references

- [Intel: defining RAID volumes](https://www.intel.com/content/www/us/en/support/articles/000005867/technologies.html)
  supports the striping, mirroring, distributed parity and combined RAID overview.
- [Dell: RAID 1](https://www.dell.com/support/manuals/en-us/precision-t7875-workstation/tramore_precision_7875_tower_desktop_raid_guide/RAID-1?guid=guid-0bfca8da-8957-4c2b-96e1-e89df369d9d6&lang=en-us)
  supports the speed qualification: reads can benefit from balancing requests;
  writes are approximately single-drive performance in this implementation.
  The lesson allows for additional overhead instead of promising a fixed speed.
- [Dell: selecting RAID levels](https://www.dell.com/support/manuals/en-us/idrac9-lifecycle-controller-v7.x-series/idrac9_6.xx_lc_ug/selecting-raid-levels?guid=guid-5d365c37-4f63-4f4f-a48d-658498a39b2c&lang=en-us)
  provides the RAID level reference.
- [IBM: NAS](https://www.ibm.com/think/topics/network-attached-storage)
  supports the file-service/block-service distinction and acknowledges equipment
  that provides both. The lesson avoids treating organisation size as a strict
  NAS/SAN boundary.

## Verification

- `node --test tests/raid-storage.test.mjs tests/teacher-dividers.test.mjs`
- `node raid-browser-check.mjs`, with `raid-test-server.mjs` serving localhost:8765
  and an isolated headless browser exposing debugging on localhost:9225.
- Set `RAID_REVIEW_HEIGHT=768` for the compact desktop pass; the default is 900.
  The browser check also reviews a 390-pixel mobile page. Local screenshots and
  layout measurements are written to the ignored `.raid-checks/` folder.

## Teacher slide order

1. Lesson opener (teacher only)
2. Learning goals
3. One drive. One point of failure.
4. RAID: make drives work together
5. What matters most?
6. Different arrangements, different compromises
7. How drives cooperate (teacher-only divider)
8. Striping: spread the pieces
9. Why can striping be faster?
10. Mirroring: keep another copy
11. Mirroring: what do we gain and give up?
12. Parity: recovery without copying everything
13. A tiny rule: same or different?
14. Use the rule to recover a missing bit
15. Spread the parity work
16. From failure to recovery
17. Choose an arrangement (teacher-only divider)
18. Installed space versus space for files
19. Which techniques does each level use?
20. RAID 0: share the work
21. RAID 0: when would it fit?
22. RAID 1: keep a complete twin
23. RAID 1: when would it fit?
24. RAID 5: share data and parity
25. RAID 5: when would it fit?
26. RAID 5: fail, replace, rebuild
27. RAID 6: two sets of recovery information
28. RAID 6: when would it fit?
29. RAID 10: stripe across mirrored pairs
30. RAID 10: when would it fit?
31. Choose the compromise
32. Share the storage (teacher-only divider)
33. NAS: shared folders on the network
34. Inside a NAS: more than drive bays
35. Follow a file request
36. Local storage or network storage?
37. Why use a NAS?
38. NAS: what can get in the way?
39. NAS and RAID answer different questions
40. Files or disk space? (teacher-only divider)
41. Why might servers need a different kind of storage?
42. NAS and SAN: what does the client receive?
43. Keep access and recover data (teacher-only divider)
44. RAID is not backup
45. Apply your choices (teacher-only divider)
46. Choose the RAID level
47. Spot the misconception
48. Check your understanding
49. Exam-style practice
