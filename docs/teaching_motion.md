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

Decorative effects still honour reduced motion. The stack-top attention pulse,
step-sequence entrance effects and interface transitions retain that behaviour.
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
- Queue entry/exit: reduced motion no longer removes the teaching loop. The new
  `javascript/core/teaching-animation.js` adds a native Pause/Play control and
  pauses when hidden/offscreen. The existing compact mobile static layout remains.

The CSS-loop helper attaches once to `[data-teaching-animation="queue animation"]`.
It uses a host pause class; matching animation descendants need an
`animation-play-state: paused` rule. Its state is temporary, with no storage.

`tests/teaching-motion.browser.mjs` checks all audited demonstrations with OS
reduced motion enabled, including retained decorative suppression and pause
controls. See `backup_recovery_lesson.md` for local browser-test setup.
