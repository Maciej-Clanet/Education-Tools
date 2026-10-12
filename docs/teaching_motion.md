# Teaching motion

Motion that explains an operation or relationship must remain available even when
a classroom computer requests reduced motion. Do not disable Play, skip to the
final frame or remove the explanatory movement because of `prefers-reduced-motion`.
This is an explicit teaching preference, distinct from decorative animation.

- Provide visible Play/Pause or manual steps. Ongoing playback pauses offscreen,
  in hidden tabs and on departure; finite sequences stop at the end.
- A brief user-triggered operation, such as moving a complete sorted record, may
  finish naturally without its own Pause button. Reset cancels outstanding motion.
- Keep labels/readable states alongside movement and a static no-JavaScript/print
  explanation. Teaching timings are illustrative, not hardware benchmarks.
- Decorative entrance effects, interface transitions and other cosmetic motion
  continue to honour reduced motion. Do not change saved accessibility preferences.

For available players, see [shared components](shared_components.md#sequences-and-motion).
Current examples include backup comparison, architecture transfers, character
transmission and stack/queue operations. Test their controls and hidden/offscreen
behaviour with OS reduced motion enabled; see [testing](testing.md).
