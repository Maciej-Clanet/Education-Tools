# Cluster computing, UMA and NUMA

Lesson: [student page](../../pages/topics/cluster-computing-uma-and-numa.html). Unit 2 B1: cluster/shared-memory models, choice and implications.
Authoring: the linked HTML and its page script.
Depth: [definitions](../lesson_authoring.md#coverage-outline-format). Section IDs below refer to the lesson page.

## Coverage in order

1. **Introduced** — Need for more capacity; scale up/out and two architectural levels. (`overview`)
2. **Covered** — Cluster nodes as whole computers; render-farm and web-service work distribution, benefits and limits. (`nodes`)
3. **Practice** — Distribute tasks across machines. (`distributor`)
4. **Covered** — Machine boundaries, shared memory, sockets and local memory relationships. (`shared-transition`)
5. **Covered** — Why NUMA is used and how cluster/NUMA node meanings differ. (`why-numa`)
6. **Covered** — UMA equivalent memory access versus NUMA local/remote access, contention and locality through physical/logical views. (`memory-lab`)
7. **Covered** — NUMA capacity/locality benefits and placement/interconnect costs. (`numa-tradeoff`)
8. **Developed** — VM and analytics placement examples; conceptual locality, not scheduler implementation. (`vm`)
9. **Covered** — Clusters of NUMA servers; distinguish simultaneous architectural labels. (`overlap`)
10. **Practice** — Physical recap, multi-label classification and contextual choice. (`summary`)
11. **Practice** — Misconceptions, quiz and written tasks. (`mistakes`)

## Boundaries

UMA does not mean every observed access time is identical; caches/contention still matter. NUMA nodes are within a shared-memory machine, cluster nodes are computers. Do not invent access timings, fabricate independent DIMM banks for every core, or imply perfectly linear scaling.
