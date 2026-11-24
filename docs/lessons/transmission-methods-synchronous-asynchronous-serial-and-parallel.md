# Transmission methods

Authored source: [student page](../../pages/topics/transmission-methods-synchronous-asynchronous-serial-and-parallel.html). The HTML is edited directly. Unit 2 E1: synchronous/asynchronous and serial/parallel transmission. Prerequisite: [communication channels and connection methods](communication-channels-and-connection-methods.md); bits and bytes from C1. Direction and network equipment are not retaught.

## Coverage in order

1. **Introduced** — A sensor reading reaches a computer as bits. The receiver must identify each bit and retain its order. Illustrative bits are not a temperature encoding. (`overview`)
2. **Introduced** — Data paths and timing answer two separate questions. (`two-questions`)
3. **Covered** — Serial sends bits in sequence on one data path. Parallel carries different bits simultaneously on several paths. Sensor and memory-bus examples; controlled teaching animations show the distinction. A data path is not necessarily one physical wire. (`data-paths`, `parallel`)
4. **Developed** — A manual comparison sends the same four bits at the same rate per path. Receipt accumulates over four intervals for serial and one for the four-path parallel example. This is a controlled comparison, not a prediction of modern interface speeds. (`viewer`)
5. **Covered** — Timing skew as different arrival times on parallel paths. Two snapshots at a read time show a complete group versus one late bit. Short matched paths and longer cable concerns are explained without electrical calculations. (`skew`)
6. **Introduced** — A signal level can last for several bits; transitions alone do not count bits. Equal bit times resolve a six-bit example. A clock is defined as a regular timing signal. (`timing`)
7. **Covered** — Synchronous shared timing, aligned reads and accumulated received bits. A clocked sensor link is the example; a separate clock and recovered timing are both acknowledged without teaching encoding. (`synchronous`)
8. **Covered** — Asynchronous units may start at irregular times, while their bits still have an agreed duration. The start bit aligns local receive timing. A change-reporting sensor provides context. (`asynchronous`)
9. **Developed** — A common asynchronous serial format: idle high, start 0, eight data bits, stop 1. A staged diagram retains the whole unit while highlighting each role. Bits are shown in sending order, not as a decimal-conversion exercise. (`start-stop`)
10. **Covered** — Overhead defined through ten transmitted bits for eight useful bits. Occasional units versus long streams; synchronous transfer can avoid per-byte start/stop framing but can still need other control information. (`overhead`)
11. **Covered** — Comparison of timing, agreement and typical uses. Neither uninterrupted synchronous transfer nor mandatory gaps between asynchronous units are claimed. (`compare-timing`)
12. **Developed** — A clocked serial sensor transfer combines both descriptions. The clock line is separate from data-path width; omitted power/control connections are stated. (`combine`)
13. **Developed** — A camera-stream judgement links need, feature and consequence, with shared-timing support as a condition. (`selection`)
14. **Practice** — Two original scenarios require a method/reason pair and a saved written judgement: a longer greenhouse cable and an occasional alarm-sensor reading. Guides weigh the competing concern rather than asserting a universal winner. (`path-choice`, `timing-choice`)
15. **Practice** — Misconceptions, existing knowledge quiz and separate written questions on continuous video and short internal data paths. (`mistakes`, `quiz`, `exam-practice`)

## Boundaries and scope interpretation

Pearson lists both method pairs in E1, without prescribing named hardware interfaces, clock waveforms or detailed calculations. Unit 2 assessment objectives also require application, analysis and justified recommendations. This lesson therefore covers mechanisms, implications and contextual choices. Start/stop framing, a simple overhead count and skew support those explanations; they are not presented as separately mandated detailed subtopics.

No protocol register setup, baud/divisor calculations, sampling tolerances, signal-integrity mathematics, bit-order memorisation or named-interface recall. Packet structure, switching and protocols follow in the next lesson. Parity and error detection remain in their own lesson. The start/stop example is one common format, not a claim about every asynchronous system. The camera-stream example concerns transmission timing, not all layers of an internet video application.

## Persistence and presentation

Uses the shared shell, opener/dividers, manual walkthroughs, teaching-animation controls and paired-scenario checker. Teaching motion has pause controls and stops offscreen; it remains available with reduced motion. Static and print views show all authored steps. Demonstrations and method/reason selections are temporary.

The retired `lesson-transmission-method-viewer` store remains untouched. The original quiz, version, pass threshold and raw-answer key are unchanged. Both original written prompts and IDs remain unchanged. New scenario drafts have distinct `path-choice-v1` and `timing-choice-v1` IDs in the existing exam store, whose merge behaviour retains older drafts. Existing section anchors remain valid; `viewer` now opens the paced transfer comparison.

## Sources

- [Pearson Computing specification, Issue 8](https://qualifications.pearson.com/content/dam/pdf/BTEC-Nationals/computing/2016/specification-and-sample-assessments/btec-nat-l3-ext-dip-in-computing-spec.pdf#page=44): Unit 2 E1; assessment objectives in the same unit.
- [Microchip: communication modes](https://onlinedocs.microchip.com/oxy/GUID-010260B4-17F3-4FE8-8E04-90F3705BF991-en-US-15/GUID-3A1C58F5-4C27-4075-97F9-6130D7CB66CD.html): shared synchronous clock versus local asynchronous receive timing.
- [Microchip: asynchronous USART communication](https://ww1.microchip.com/downloads/en/Appnotes/00774a.pdf): start/data/stop and idle levels.
- [Microchip: SPI introduction](https://developerhelp.microchip.com/xwiki/bin/view/applications/SPI): clocked serial sensor-interface context, not a required protocol lesson.
- [Texas Instruments: serialising parallel data](https://www.ti.com/product/DS99R101/part-details/DS99R101VS/NOPB): the relationship between multiple parallel paths and skew.
