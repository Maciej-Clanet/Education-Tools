# Emulation in computer systems

Lesson: [student page](../../pages/topics/emulation-in-computer-systems.html). Unit 2 B1: emulation applications, choice and implications.
Authoring: the linked HTML and its page script.
Depth: [definitions](../lesson_authoring.md#coverage-outline-format). Section IDs below refer to the lesson page.

## Coverage in order

1. **Covered** — Missing-platform problem; emulation and host/target/emulator roles. (`overview`)
2. **Developed** — Expected machine behaviour and instruction-set vocabulary; detailed instruction-set comparison belongs in B2. (`expectations`)
3. **Covered** — Recreate CPU effects, input and graphics behaviour; native versus emulated execution. (`cpu-mapping`)
4. **Covered** — Preservation, education, legacy software and cross-platform development uses. (`preservation`)
5. **Covered** — Limits of early emulated testing and need for appropriate hardware validation. (`hardware-check`)
6. **Covered** — Extra work/overhead and task-dependent performance. (`performance`)
7. **Introduced** — Reusing translated work as an optimisation; no translator implementation. (`optimisation`)
8. **Covered** — Accuracy requirements and performance trade-offs. (`accuracy`)
9. **Practice** — Trace native/emulated paths with fixed examples. (`path-explorer`)
10. **Introduced** — Emulation/virtualisation distinction and possible overlap; no hypervisor course. (`virtualisation`)
11. **Covered** — Appropriate and unsuitable contexts and alternative approaches. (`good-fit`)
12. **Practice** — Qualified choice/reason scenarios, misconceptions, recap, quiz and written tasks. (`scenarios`)

## Boundaries

Emulation is not guaranteed compatibility or a fixed slowdown. Illustrative work units are not timings. The path explorer executes no learner code. Final proof depends on the system's requirements; timing-sensitive systems may need real hardware.

## References

- [QEMU system introduction](https://www.qemu.org/docs/master/system/introduction.html)
- [QEMU translator internals](https://www.qemu.org/docs/master/devel/tcg.html)
