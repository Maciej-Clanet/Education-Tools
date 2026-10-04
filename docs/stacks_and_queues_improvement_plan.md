# Stacks and queues: first-teaching improvement plan

4 October 2026. Implementation plan for the existing
`pages/topics/stacks-and-queues.html`; keep its URL and contextual navigation.
This document records the agreed sequence and content contracts, not a claim that
the rebuilt page has passed browser verification.

## Purpose and scope

Teach how a collection's access rule changes what a system does next. A learner
should be able to operate and trace stacks and FIFO queues, explain useful
software and hardware applications, and recognise empty/full cases and the
limits of the simplified models. This covers Unit 2 D1 features, applications and
implications; array/list implementations belong in the adjacent lesson.

Assume no coding experience. Introduce a function as a named piece of work and a
worker as the part of a program that performs a waiting job. Start with labelled
records and concrete actions. Only introduce operation notation after its visual
meaning. Do not require pointers, memory addresses, recursion, classes, algorithm
complexity or an implementation of an array-backed queue.

The current lesson has eight sections, a five-question quiz (pass four), two
written tasks and a combined saved simulator. Its facts are useful, but the
first-teaching route needs smaller steps, distinct operation explorers, and
applications whose visible outcomes explain why order matters. Use the calm
layout and progressive teaching standard of RAID/NAS and User interfaces without
copying their length.

## Agreed teaching order

The implementation uses 21 student sections, a teacher opener and four short
dividers: 26 teacher slides. The completed lesson and verification results are
recorded in [the implementation guide](stacks_and_queues_lesson.md).
Aim for a 60–75 minute introduction; the three longer written tasks can continue
as independent practice. Do not crowd sections to preserve a nominal slide count.

| Order / anchor | Main idea | Visual or learner action |
| --- | --- | --- |
| Opener | How does a computer choose what happens next? | Three goals; no terminology wall |
| 1 `overview` | A data structure organises data and access | Three file records form a collection; distinguish a record from the whole collection |
| 2 `why-structure` | Access order changes behaviour | Reversing the latest edit and taking the oldest waiting job lead to different outcomes |
| 3 `developer-context` | Developers use these rules in real systems | Runtime call stacks, undo libraries and background work; introduce security scanning as one application |
| Divider | Work back from the newest item | Begin the stack model |
| 4 `stack` | Last in, first out | A labelled top; add A, B, C and identify the next available item |
| 5 `stack-operations` | Push, pop and peek | Operation explorer; show returned value separately from remaining items; peek leaves state unchanged |
| 6 `undo` | Reverse recent changes first | Five-step drawing/undo sequence; canvas and action history change together |
| 7 `call-stack` | Nested calls need a return path | Five-step call/return sequence, one frame per unfinished call; label current work and waiting callers |
| 8 `debugging` | A stack view helps explain current execution | Small illustrative debugger panel with current frame and callers; not every past function |
| Divider | Keep waiting work in arrival order | Begin the FIFO queue model |
| 9 `queue` | First in, first out | Persistent front/rear labels and clear arrows; oldest waiting item leaves first |
| 10 `queue-operations` | Enqueue, dequeue and peek | Separate queue explorer; joining the rear does not change the front |
| 11 `file-scanning` | Arrival and processing are separate | Five-step upload queue → one worker → result sequence; dequeue moves a job out of the waiting area |
| 12 `buffers` | Buffering absorbs a temporary mismatch | Burst of data into finite storage, slower regular removal; include a hardware receive-buffer diagram |
| 13 `queue-policy` | Real work systems can add policies | Critical alert overtakes routine work under priority; two workers can finish out of removal order |
| Divider | Choose the rule for the job | Compare only after both models are taught |
| 14 `compare` | Same arrivals, different next item | A/B/C in both models; identify ends, operation names and a justified application |
| 15 `programmer-bridge` | Code requests the operations already learned | A few lines of pseudocode beside the equivalent item movement; no implementation listing |
| 16 `limits` | Empty and full need deliberate handling | Empty removal returns no item; fixed-capacity example rejects a new addition without overwriting existing data |
| 17 `mistakes` | Explain the rule and its boundaries | Reveal concise corrections; glossary can remain in revision detail |
| Divider | Check and explain | Quiz precedes longer writing |
| 18 `quiz` | Trace and reason | Ten questions; score eight or more |
| 19 `exam-practice` | Apply a stack to Undo | Four-mark saved response and expandable guidance |
| 20 `exam-call-stack` | Explain calls, returns and debugging | Four-mark saved response and expandable guidance |
| 21 `exam-scan-queue` | Justify a file-work queue | Six-mark saved response and expandable guidance |

## Context and visual accuracy

**Undo:** use an explicitly simplified application model. Store action records
with the information needed to reverse a change; a text label alone cannot undo
an edit. Recolour, move and add are separate undoable actions. Do not imply all
applications keep one simple stack or undo one keystroke at a time. Redo,
branching history and grouping can be a short revision note, not a fourth tool.
Qt's production undo framework supports command history and grouped operations.
[Qt QUndoStack](https://doc.qt.io/qt-6/qundostack.html)

**Nested calls:** current work sits above its caller; returning removes the
current frame and resumes the caller. A frame contains data for one invocation,
not the function's whole source code. Teach ordinary synchronous calls only.
The visible stack is the current unfinished call chain, not an execution log or
the application's undo history. Modern runtimes can optimise or present calls
differently. [GDB stack frames](https://sourceware.org/gdb/current/onlinedocs/gdb.html/Frames.html)

**Debugging and security:** developers use call-stack information to investigate
where a problem occurred and which calls led there. This is also relevant when
investigating a suspicious crash, but a crash or stack exhaustion is not, by
itself, proof of an exploit or attack. No exploit techniques are needed here.
[Visual Studio Call Stack](https://learn.microsoft.com/en-us/visualstudio/debugger/how-to-use-the-call-stack-window)

**File scanning:** label the demonstration “our simplified design”: equal
priority, one worker, FIFO waiting jobs. Keep files awaiting checks unavailable;
show waiting, scanning and checked states separately. A queue organises jobs;
it does not decide that a file is safe. Scanning is one of several upload
controls. The choice of FIFO is this lesson's design assumption, not an OWASP or
antivirus-product guarantee.
[OWASP File Upload guidance](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html)

**Buffering:** a queue can smooth a short burst but does not make each job faster.
Sustained arrivals above processing capacity increase waiting and resource use.
Use a qualitative diagram, not performance calculations. Full policies can
include waiting or rejecting work; this lesson's bounded explorer must name its
chosen behaviour. [Azure queue-based load levelling](https://learn.microsoft.com/en-us/azure/architecture/patterns/queue-based-load-leveling)

**Hardware:** show incoming data → FIFO receive buffer → processor, with an
explicit finite capacity. One concrete example is a UART receive FIFO, whose
oldest buffered data is retrieved first; the processor can service incoming data
after a brief delay. Do not claim every network buffer, disk scheduler or device
uses strict FIFO. No electronics knowledge or register names are necessary.
[Microchip receive and transmit buffers](https://onlinedocs.microchip.com/oxy/GUID-61202E6F-BC03-4D81-AAB9-269E87F9B49C-en-US-22/GUID-C75CCD6E-F156-44D3-B559-BDCBD6B2914E.html)

**Policies:** distinguish enqueue order, removal order and completion order.
Priority can deliberately override simple arrival order; concurrent workers can
finish jobs in a different order even when removal was FIFO. Avoid teaching
distributed-system implementation detail.
[RabbitMQ message ordering](https://www.rabbitmq.com/docs/queues#message-ordering)

**How often:** use a qualitative statement: “These ideas appear frequently in
software. You can use them through libraries and runtimes without writing your
own stack or queue.” This is a synthesis of the documented contexts, not a
measured claim about every developer's workday. A programmer may request queue
operations from an existing library while the runtime manages call frames.
[Python data structures](https://docs.python.org/3/tutorial/datastructures.html)
and [Python queue library](https://docs.python.org/3/library/queue.html)

## Interaction and accessibility contracts

- Use separate stack and queue explorers after each rule is introduced. Limit
  visible item labels and capacity for projector readability. Orient the stack
  with the top above other items; the queue must retain front/rear labels when
  it wraps on a narrow screen. A single item is both front and rear.
- Provide native labelled buttons, keyboard use, visible focus and short live
  status messages. Distinguish an operation's returned value from the collection.
  State changes must be visible through position/text, not colour alone.
- Each contextual sequence has five discrete states with visible step controls.
  If playback is added, provide Play/Pause, stop on completion and pause offscreen
  or when hidden. Teaching motion remains usable with reduced motion enabled.
  Keep a complete readable authored fallback when JavaScript is unavailable.
- Start new teaching sequences predictably. Prefer temporary operation state;
  do not reinterpret or overwrite the legacy
  `lesson-stacks-and-queues-simulator` key with a different schema.
- Pseudocode calls operations, for example `push(history, action)`, then
  `action = pop(history)`. Explain assignment in words. Any `isEmpty` check is a
  simplified single-worker teaching example, not a concurrency-safe recipe.
- Retain old anchors `overview`, `stack`, `queue`, `compare`, `mistakes`,
  `simulation`, `quiz` and `exam-practice`; obsolete `simulation` can be a hidden
  alias to the first explorer. Keep sidebar and contextual previous/next links.

## Assessment and persistence

`javascript/data/stacks-and-queues-assessment.js` exports:

- `quizQuestions`: ten `{ question, options, answer, feedback }` objects;
  `answer` is a zero-based option index. Coverage includes stack/queue traces,
  peek, Undo, nested returns, backlog, empty/full policies, concurrency and
  priority. Meaningful distractors distinguish common wrong models.
- `examTasks`: three `{ id, marks, title, prompt, guidance }` objects with
  `guidance` as an array of strings. Fresh IDs are `undo-stack-v2`,
  `call-stack-v2`, and `scan-queue-v2`. Display them after the quiz.
- `glossary`: short `{ term, definition }` records, optional revision content.

Set quiz version 2, total 10, pass score 8, and use the fresh raw key
`lesson-stacks-and-queues-quiz-v2` in both lesson configuration and
`javascript/data/unit-progress-data.js`. Retain the old unversioned quiz key and
old written response IDs `question-1` / `question-2` without restoring them into
new prompts. Keep the existing `stacks-and-queues-exam-practice` exam storage key;
the shared exam saver preserves retired fields when current answers are saved.
Refresh catalogue description and the D1 tracker; these integration
edits are separate from this plan and assessment module.

## Validation before completion

1. Independently check stack and queue traces, peek immutability, single-item
   endpoints, and empty/full transitions. Confirm Undo changes the artwork and
   call returns resume the correct caller.
2. Check each scan step separates waiting work from the active worker; queue
   order and completion wording must match the stated model.
3. Verify quiz answer indices, ten sequential question names, three fresh saved
   prompts, version 2 / pass 8 metadata, legacy-save isolation and reload behaviour.
4. Inspect every teacher slide and expanded state at 1366×768 and 1366×900;
   check 390px/320px layouts, keyboard controls, no-JavaScript fallback and reduced
   motion. Ensure stored item labels cannot inject markup.
5. Confirm old anchors, contextual navigation, course discovery and D1 aggregate
   progress. Report actual checks run; do not imply that a plan is browser-tested.
