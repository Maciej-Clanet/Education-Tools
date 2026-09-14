# Cluster computing, UMA and NUMA

## Consolidated physical teaching pass

The second pass replaces the expanded abstract sequence with physical computer
boundaries, local technical illustrations and one Shared-Memory Explorer.

| Measure | Previous | Current |
| --- | ---: | ---: |
| Student sections, including quiz and written practice | 40 | 22 |
| Teacher Slides, including opener/dividers/practice chunks | 57 | 33 |
| Teacher-only dividers | 6 | 4 |

The 22 sections contain 20 teaching/activity sections and two assessment sections.
Teacher Slides add the shared opener, four dividers and six additional written
question chunks. The quiz remains a scrollable assessment. No slide infrastructure
was changed; the existing template opener, dividers and chunk markers are reused.

## What was merged

- UMA architecture, uniformity, task movement, processor growth and bandwidth
  contention are now taught in the same explorer. The physical shared-memory
  introduction supplies the smaller-machine/desktop context, replacing separate
  theoretical suitability slides. No separate UMA growth tool remains.
- NUMA architecture, local access, remote access, memory-access lab and general
  locality repetition are combined in the explorer. The engineering motivation
  precedes it; one trade-off interpretation follows it. The physical VM example
  is the main application, with one brief analytics example.
- Cluster definition and node definition share one rack/pulled-server composition.
  Rendering uses 240 frames across eight servers; service capacity and qualified
  failover share one slide. Dependency/coordination trade-offs remain in revision
  notes and the retained workload activity rather than additional static slides.
- Three suitability examples use one progressive section. Six misconception
  disclosures share one section, with one correction open at a time. The compact
  physical comparison also acts as the revision summary.

## Physical model and terminology

The corrected scaling diagram begins with ONE COMPUTER (processor + RAM), then
branches into adding computers or adding processing/memory resources within that
computer. The latter is explicitly this lesson's multiprocessor scaling case;
scale up can include other upgrades.

Rack/server faces show separate machines with their own processor resources,
RAM and OS. An extracted server defines a cluster node. Two new local SVGs reuse
the existing Unit 2 hardware palette and visual conventions:

- `assets/images/architecture/shared-memory-single-socket.svg`: CPU package,
  cores, simplified memory system, DIMM modules and motherboard boundary.
- `assets/images/architecture/shared-memory-dual-socket.svg`: two socket regions,
  nearby DIMM banks, memory-channel connections and internal interconnect.

The explorer embeds the same drawings to highlight routes, alongside logical
views. Static detailed diagrams and the explorer allow keyboard-accessible local
horizontal scrolling on narrow screens, keeping labels readable. The recap uses
larger compact hardware labels instead of shrinking a whole motherboard.

A NUMA node is a processor/memory locality region inside one shared-memory
computer. A socket can contain many cores. One socket ≈ one node is explicitly a
teaching simplification; real processors can expose multiple nodes per socket.
Shared memory means the processor resources can address overall main memory;
it does not imply permission for applications to read each other's data.

NUMA is introduced as a scaling solution: each socket region contributes
processing, RAM capacity, memory channels and local bandwidth. The example grows
from 256 GB to two 256 GB regions; these are illustrative capacities, not timing
or performance measurements. Remote accesses and placement are the trade-off.

## Shared-Memory Explorer

`javascript/core/shared-memory-explorer.js` owns one temporary state object and
uses the existing `memoryRoute` model from `scaling-activities.js`.

- Architecture: UMA / NUMA. Switching clears the previous access result.
- View: Physical / Logical. Switching retains the chosen access and redraws it.
- UMA: choose 2/4/8 processing units and unit A onward; Access memory highlights
  an equivalent main-memory relationship. The physical view represents cores
  within one package, not a separate socket or DIMM bank for each core.
- UMA demand: the same view displays the selected number of possible requests;
  more simultaneous demand can increase contention. No fabricated timings or
  measured-pressure scale is used.
- NUMA: choose task node 0/1 and data node 0/1. Matching nodes highlight a direct
  local route; different nodes trace a longer dashed internal-interconnect route.
  Text and accessible descriptions report the same route and relative latency.
- Place task near data changes the task region to match its data. It illustrates
  locality, not a scheduler.
- Reset returns UMA / Physical / two units / A / no access trace.
- Changes to count, selected unit or task/data location clear stale access results;
  lowering the unit count keeps the selected unit within range.
- No animation, timing loop, network call or storage is used by the explorer.

The old standalone NUMA and UMA-growth DOM adapters were removed. The workload
distributor's allocation/reset logic is preserved (12 tasks, 1/2/4 machines), with
server styling and an OS label. Classifier scoring/reset is preserved; diagrams
now show physical machines. Its combined scenario still requires Cluster + NUMA.

## Practical application and assessment

The primary NUMA example is a college database VM: eight virtual CPUs and 32 GB
RAM on a host with 256 GB per node. A disclosure transforms remote placement into
local placement on the same physical motherboard. Virtual CPUs are scheduled
processing resources, not physical sockets. The revision explanation states that
hypervisors/operating systems try to preserve locality subject to capacity.

The overlap rack contains two separate servers, each containing NUMA nodes 0/1.
Network links are between computers; processor interconnects are inside them.
A smaller single-socket computer supplies UMA intuition without labelling every
modern desktop as textbook UMA.

Quiz: 14 questions, pass score 10, version **3**. Eleven existing concepts are retained (one question now uses the same node 0/1
labels as the explorer); three now assess NUMA-node meaning, why NUMA supports scaling, and VM locality.
The new `lesson-cluster-computing-uma-and-numa-quiz-v3` key prevents old answers
being restored under changed questions; older data is not deleted. Unit progress
metadata matches. Six existing exam questions and draft keys are preserved.
Question 6 now analyses a virtualisation host and uses its own v3 draft field key.

## Teacher Slide sequence

1. Shared lesson opener
2. When one computer isn’t enough
3. One starting point, two ways to grow
4. Two architectural levels
5. Next: Cluster computing
6. A cluster node is a whole computer
7. A render farm: 240 frames
8. A busy web service
9. Try distributing the work
10. Find the computer boundary
11. Next: Shared memory
12. What does “shared memory” mean?
13. Why build a larger server this way?
14. “Node” depends on context
15. Shared-Memory Explorer
16. What NUMA gains—and what it costs
17. College database VM: place work near its RAM
18. Beyond VMs: data and workers together
19. Next: Putting the architectures together
20. A rack of NUMA servers
21. What do these look like physically?
22. Identify what the physical diagram describes
23. Which concept matters here—and why?
24. Check the six common traps
25. Next: Practice
26. Check your understanding
27–33. Seven written questions, from explanation to evaluation

## Verification and scope

Representative explorer state tests cover architecture selection, view changes,
local/remote access in both directions, count changes, locality action and reset.
Existing scaling-activity and teacher-divider tests also pass. Local Chrome checks
cover all four architecture/view combinations, modes/selected controls, all NUMA
routes, reset, retained distribution and multi-label classifier, quiz scoring and
quiz/exam persistence. Opener entry, Next, sidebar targets and hidden student
presentation material checked. All 33 slides reviewed at 1366×900; instructional
slides fit, while the quiz intentionally scrolls. Responsive checks at 390×844
show no page-level horizontal overflow. Detailed diagrams may scroll locally.
Native keyboard radio/disclosure controls, explorer state across slide navigation,
reduced-motion preference, quiz reset and absence of runtime exceptions checked.
Relevant model/divider tests, JavaScript syntax checks and `git diff --check` pass.
There is no configured build or lint command in this static project.

No vendor internals, cache coherence, interconnect standards, scheduling algorithms,
actual failover simulation or benchmark model introduced. Uniformity is a memory
access model, not identical wire length or nanosecond performance. NUMA keeps
memory shared overall and does not guarantee faster execution.

Primary accuracy references:
- https://learn.microsoft.com/en-us/windows/win32/procthread/numa-support
- https://learn.microsoft.com/en-us/windows-server/virtualization/hyper-v/manage/non-uniform-memory-access
- https://www.amd.com/content/dam/amd/en/documents/processor-tech-docs/design-guides/56795_1_00-PUB.pdf
