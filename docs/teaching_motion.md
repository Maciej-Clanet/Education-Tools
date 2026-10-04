# Teaching motion

User preference confirmed 26 September 2026: a classroom PC's OS reduced-motion
setting must not prevent a pedagogical animation from demonstrating its content.

## Authoring rule

Distinguish motion that teaches a relationship, operation or ordered sequence from
motion that decorates a page transition or attracts attention. Do not gate teaching
playback behind `prefers-reduced-motion`, disable Play or jump straight to the final
state because of that setting. Preserve manual alternatives and visible pause
controls for ongoing playback. Pause timed sequences when hidden/offscreen, stop
finite sequences at the end, and provide labels or readable steps alongside motion.
A brief user-triggered transfer/sort may finish naturally without a separate Pause.

Decorative effects still honour reduced motion. Step-sequence entrance effects
and interface transitions retain that behaviour.
This policy does not change the user's saved accessibility/display preferences.

## Audited demonstrations

- Backup comparison: optional Play/Pause, manual days, Restart, finite end;
  source-to-destination file movement remains visible under reduced motion.
- RAID parallel read: existing visible-only loop and Pause remain; the OS no
  longer starts it at a completed frame or removes travelling pieces.
- Kernel sequences: Play stays enabled; Previous/Step/Reset pause and playback
  pauses offscreen/hidden. No content, scoring or sequence changes.
- Record sort and numeric-table sort: complete rows visibly move together after
  the learner chooses a sort. Their short movements complete naturally.
- Architecture uses travelling labels that say Instruction or Data, with visible
  waiting/received states. Three finite demonstrations provide Play/Pause/Replay,
  Previous/Next step/Restart and offscreen/hidden pausing. Separate routes animate
  independent transfers together. See `stored_program_lesson.md`.
- Packet travel retains its explanatory timing.
- Character transmission sends the illustrative codes for `hello` between two
  computers. Play/Pause/Resume, Next character and Restart retain pedagogical
  motion under reduced motion. Playback ends after five arrivals and pauses when
  the diagram or tab is hidden. `tests/character-encoding.browser.mjs` exercises
  the controls and verifies decoded letters appear as codes arrive.
- Stack and queue explorers: each user operation produces a brief visual change,
  even with reduced motion enabled. Additions use a 220 ms item movement; peek,
  pop and dequeue show a 300 ms transfer to the returned-value display. Peek
  leaves the stored item in place. These finite actions need no separate Pause.
  Reset cancels outstanding motion and restores the authored initial state.
  The undo, nested-call and file-scanning examples instead use manual Previous,
  Next step and Restart controls from `lesson-walkthrough.js`. They have no timer;
  each step reveals a complete synchronized state, and all steps remain readable
  without JavaScript. See `stacks_and_queues_lesson.md`.

The old stacks-and-queues entry/exit loop, its Pause control and decorative
stack-top pulse were retired in the 4 October 2026 rebuild. That lesson no longer
loads `teaching-animation.js`; the shared helper remains available for authored
CSS teaching loops elsewhere. An ongoing loop still requires visible playback
controls and offscreen pausing under the policy above.

`tests/teaching-motion.browser.mjs` checks the shared cross-lesson motion cases
with OS reduced motion enabled, including explorer transfers and manual call
stepping. Character transmission has its separate browser test listed above.
See `backup_recovery_lesson.md` for local browser-test setup. The revised
stacks-and-queues assertions await the integration run recorded in that lesson's
implementation notes; updating a test is not evidence that the full suite passed.
