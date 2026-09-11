# Cluster computing, UMA and NUMA

Rebuilt for first teaching at the existing URL. The 40 student sections produce
57 Teacher Slides: one shared opener, six shared dividers, five separately paced
misconceptions and seven separately paced exam questions. The quiz remains a
scrollable activity. Student sections retain optional fuller revision notes.

## Teaching model

Start with a rendering queue, distinguish scale out from scaling processors
inside one shared-memory system, and retain that distinction in a branching map.
Cluster describes separate cooperating computers. UMA and NUMA describe memory
access within shared-memory multiprocessor systems. A cluster can contain NUMA
servers; the classifier explicitly accepts Cluster + NUMA.

The original overview, cluster, UMA, NUMA and comparison card collections were
replaced with node diagrams, workload allocations, equivalent memory paths,
local/remote route traces, placement transformations and applied examples.
Common mistakes use one reveal per Teacher Slide. The recap retains three compact
architecture diagrams, with the overlap statement immediately below.

Computer boundaries are solid; processor/memory regions inside NUMA systems use
dashed boundaries. CPU and RAM blocks have distinct labels and borders. Networks
between computers use dashed links. UMA uses equivalent paths. NUMA local access
uses a short solid trace; remote access follows a longer dashed trace through the
interconnect. Narrow screens use readable HTML region diagrams instead of shrinking
SVG labels. Selected CPU/RAM blocks have outlines; remote links also have dashed
outlines and an explicit text route.

## Infrastructure and activities

- Reuses `initLessonPage`, quiz/progress, exam drafts, accessibility, contextual
  navigation and the existing teacher deck. No changes to shared slide machinery.
- Uses one `template[data-teacher-opener]`, matching Collecting and processing
  data, plus six `template[data-teacher-divider]` declarations. Both remain out
  of the student page and Jump To. Opening slides starts at the opener.
- `data-slide-break` paces misconceptions and individual written questions.
- Native details/summary supplies keyboard-accessible reveals. `arch-revision`
  supplements remain on the student page and are hidden in Teacher Slides.
- `javascript/core/scaling-activities.js` contains three small pure models and
  their DOM adapters. No timers, processes, network calls or benchmark claims.
- Cluster distributor allocates 12 numbered independent tasks round-robin across
  1, 2 or 4 nodes. Counts are 12, 6 or 3 per node. Changing node count returns work
  to the waiting pool; Reset restores one node and 12 waiting tasks.
- UMA step selector shows 2, 4 or 8 processors converging on the same memory
  system. It illustrates potential contention, not measured timing.
- NUMA controls select task CPU A/B and data RAM A/B. Access traces the local or
  remote route, with a matching accessible description and text route. Changing
  a selection clears the previous result. Move task near its data selects the
  matching CPU and demonstrates local access. Reset restores A/A with no trace.
- Classifier has four diagrams and checkbox labels. Exact applicable sets are
  Cluster; UMA; NUMA; Cluster + NUMA. Selection changes clear stale feedback;
  Reset restores diagram A and clears all selections.
- Activity state is temporary; quiz and written answers persist locally through
  the existing infrastructure. No backend, new libraries or external assets.

Quiz: 14 questions, pass score 10, version 2 in the page config and unit progress
metadata. A new `lesson-cluster-computing-uma-and-numa-quiz-v2` storage key prevents
old five-question attempts being restored as new answers. Existing old storage is
not deleted. New exam field keys prevent old answers appearing under new prompts.
The existing URL, unit link and catalogue entry are retained.

## Final Teacher Slide sequence

1. Opener — Cluster Computing, UMA and NUMA
2. When one machine is not enough
3. Two broad ways to add resources
4. The architecture map
5. Next: Cluster computing
6. What is a node?
7. What is a cluster?
8. Split a rendering job
9. Not every job splits perfectly
10. Serving lots of users
11. What if a node fails?
12. Why use a cluster?
13. Distribute the workload
14. Cluster vs multiprocessor system
15. Next: Shared memory
16. Why processors need memory
17. Next: UMA
18. UMA architecture
19. What does “uniform” mean?
20. One task, either processor
21. Add more processors
22. Uniform latency ≠ unlimited bandwidth
23. Where might UMA make sense?
24. Next: NUMA
25. Why change the memory layout?
26. NUMA architecture
27. Local memory access
28. Remote memory access
29. Try local and remote access
30. Same program, different placement
31. Virtual machine placement
32. A large in-memory workload
33. Add another NUMA region
34. Next: Comparing architectures
35. These are not three competing categories
36. A cluster of NUMA servers
37. What does the diagram describe?
38. Identify the architecture
39. Which approach suits the workload?
40. Rendering: justify the cluster
41. A large shared-memory database
42. A smaller shared-memory system
43. Misconception: a cluster is one computer with many CPUs
44. Misconception: NUMA means private memory
45. Misconception: UMA cannot have contention
46. Misconception: NUMA is always better
47. Misconception: the three descriptions are mutually exclusive
48. Architecture in one picture
49. Next: Practice
50. Check your understanding — 14-question quiz
51. Explain cluster computing — 4 marks
52. Explain UMA vs NUMA — 4 marks
53. Explain UMA contention — 6 marks
54. Explain NUMA locality — 6 marks
55. Analyse a rendering cluster — 8 marks
56. Analyse NUMA for a large server — 8 marks
57. Evaluate architectural factors — 12 marks

## Accuracy and deliberate simplifications

No linear speedup, automatic failover or fabricated latency benchmarks. Failure
recovery is a qualified visual explanation, not an interactive failure simulator.
UMA uniformity does not imply unlimited bandwidth or identical real access times.
NUMA is shared overall memory, not private RAM or separate computers. Socket and
NUMA-region correspondence is simplified and explicitly qualified in revision
notes. VM virtual CPUs are not physical sockets. Locality can help but cannot
eliminate all contention or remote access.

NUMA/locality wording was checked against Microsoft's primary explanations:
- https://learn.microsoft.com/en-us/windows/win32/procthread/numa-support
- https://learn.microsoft.com/en-us/windows-server/virtualization/hyper-v/manage/non-uniform-memory-access

No protocols, cache coherence, scheduling algorithms, hypervisor configuration,
HPC theory or distributed-computing framework introduced.

## Verification

- Three representative model tests in `tests/scaling-activities.test.mjs` cover
  distribution, local/remote routes in both directions and multi-answer matching.
- Existing teacher-divider tests passed; JS syntax and whitespace checks passed.
- Local Chrome: all node counts, activity resets, all four NUMA combinations,
  locality action, classifier multi-label feedback and reset, 14/14 quiz scoring,
  saved quiz/exam answers after reload, and quiz reset.
- Opener hidden in student mode and absent from Jump To; first in slides, Next
  reaches first content. Sidebar anchors resolve; IDs are unique.
- All 57 slides reviewed at 1366×900, including teaching reveals. Rendering and
  region-growth compositions refined after review; revised teaching views fit.
- Mobile 390×844: no page-level horizontal overflow, readable compact NUMA view.
  Native keyboard disclosure and reduced-motion preference checked. No runtime
  exceptions. Full quiz and expanded written guidance may scroll intentionally.
