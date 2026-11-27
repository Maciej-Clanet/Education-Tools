# Transmission methods

Authored source: [student page](../../pages/topics/transmission-methods-synchronous-asynchronous-serial-and-parallel.html). The HTML is edited directly. Unit 2 E1: synchronous/asynchronous and serial/parallel transmission. Prerequisite: [communication channels and connection methods](communication-channels-and-connection-methods.md); bits and bytes from C1. Direction and network equipment are not retaught.

## Coverage in order

1. **Introduced** — A computer sends a lamp brightness setting. In this example, `11110001` represents level 241. The sender, signal and receiver diagram establishes why the receiver must preserve bit values and order and know when to read. (`overview`)
2. **Introduced** — Prominent serial/parallel and synchronous/asynchronous labels separate the data-path choice from the timing choice. A transfer can use both descriptions. (`two-questions`)
3. **Covered** — One comparison sends `1011` serially on one path and in parallel on four paths. Playback, received-bit boxes and a shared time control show how the mechanisms differ. Changing only the serial bit rate demonstrates parallel finishing first at equal per-path rates, a tie at four times the rate, and serial finishing first at eight times the rate. Travel delay stays equal; bit rate changes sending intervals, not signal propagation speed. (`data-paths`; `parallel` and `viewer` are aliases)
4. **Covered** — Timing skew as unequal arrival times. A switchable longer fourth path delays the new 1 during a `0000` to `1011` transfer. The diagram separates current receiver values from the result stored at the read time. Reading too early stores `1010`; the later arrival does not repair that stored result. A later read lets all four new values arrive. (`skew`)
5. **Developed** — The `11110001` waveform stays high for four bit times, low for three, then high for one. An optional timing grid, moving read position and accumulating result connect the signal to individual bits. Changing the interval between reads produces different results from the unchanged signal. Runs of equal values are not separate bits without an agreed timing rule. (`timing`)
6. **Covered** — A clock circuit produces a repeating timing signal, not the time of day. Regular pulses define read spacing; a marked rise is one example of an agreed read point. Separate clock lines and timing recovered from data are acknowledged without teaching clock-recovery circuitry. (`clock`)
7. **Covered** — A synchronous example sends data and a clock from the computer to the lamp controller. A shared diagram aligns each rising clock edge with stable data and accumulates `11110001`. One data path makes this example serial; the extra clock line supplies timing rather than another data bit. (`synchronous`; `combine` is an alias)
8. **Covered** — In the asynchronous start/stop example, both devices have local timers set to the same bit rate and format before transfer. The illustrative 1,000-bit-per-second setting gives a one-millisecond bit time. The start bit aligns the receiver's read schedule; it does not communicate the bit rate. (`asynchronous`)
9. **Developed** — One asynchronous unit is shown as a complete waveform: idle 1, start 0, eight data bits, stop 1, then idle. The moving read position highlights start/data/stop regions and accumulates only the eight data reads. The same `11110001` pattern is shown in sending order, not as a claim about the bit order of a specific UART. (`start-stop`)
10. **Covered** — Overhead defined through ten transmitted bits for eight useful bits. Occasional units versus long streams; synchronous transfer can avoid start/stop framing around every byte but can still need other control information. (`overhead`)
11. **Covered** — Comparison of timing, prior agreement and typical uses. Neither uninterrupted synchronous transfer nor mandatory gaps between asynchronous units are claimed. (`compare-timing`)
12. **Developed** — A camera-stream judgement links need, feature and consequence, with shared-timing support as a condition. (`selection`)
13. **Practice** — Two scenarios require a method/reason pair and a saved written judgement: a longer greenhouse cable and an occasional alarm-sensor reading. Guides weigh the competing concern rather than asserting a universal winner. (`path-choice`, `timing-choice`)
14. **Practice** — Misconceptions, existing knowledge quiz and separate written questions on continuous video and short internal data paths. (`mistakes`, `quiz`, `exam-practice`)

## Boundaries and scope interpretation

Pearson lists both method pairs in E1, without prescribing named hardware interfaces, clock waveforms or detailed calculations. Unit 2 assessment objectives also require application, analysis and justified recommendations. This lesson therefore covers mechanisms, implications and contextual choices. Start/stop framing, a simple overhead count, clock/read diagrams and skew support those explanations; they are not presented as separately mandated detailed subtopics.

The brightness, signal-reading, synchronous and asynchronous explanations retain the same `11110001` pattern. The shorter `1011` example isolates path count and skew. Animated timings, path lengths and rate comparisons are teaching models, not measured device performance or interface benchmarks. A higher serial bit rate changes how often bits are sent; it does not imply a higher propagation speed. A data path is not necessarily one physical wire.

No protocol register setup, baud/divisor calculations, sampling tolerances, signal-integrity mathematics, bit-order memorisation or named-interface recall. Packet structure, switching and protocols follow in the next lesson. Parity and error detection remain in their own lesson. The start/stop example is one common format, not a claim about every asynchronous system. The separate-clock synchronous example does not mean every synchronous link needs a separate clock wire. The camera-stream example concerns transmission timing, not all layers of an internet video application.

## Persistence and presentation

Uses the shared shell, opener/dividers, the judgement walkthrough and paired-scenario checker. The path comparison and timing diagrams have bounded playback, pause/restart and time controls; timing diagrams also have a next-read control. Teaching motion pauses offscreen and remains available with reduced motion. Static examples and explanations support no-JavaScript and print views. Demonstrations and method/reason selections are temporary; the new tools add no learner progress store.

The retired `lesson-transmission-method-viewer` store remains untouched. The original quiz, version, pass threshold and raw-answer key are unchanged. Both original written prompts and IDs remain unchanged. Scenario drafts retain the distinct `path-choice-v1` and `timing-choice-v1` IDs in the existing exam store, whose merge behaviour retains older drafts. Existing section anchors remain valid: `parallel` and `viewer` point into the combined comparison, and `combine` points into the synchronous example.

## Sources

- [Pearson Computing specification, Issue 8](https://qualifications.pearson.com/content/dam/pdf/BTEC-Nationals/computing/2016/specification-and-sample-assessments/btec-nat-l3-ext-dip-in-computing-spec.pdf#page=44): Unit 2 E1; assessment objectives in the same unit.
- [Microchip: communication modes](https://onlinedocs.microchip.com/oxy/GUID-010260B4-17F3-4FE8-8E04-90F3705BF991-en-US-15/GUID-3A1C58F5-4C27-4075-97F9-6130D7CB66CD.html): shared synchronous clock versus local asynchronous receive timing.
- [Microchip: asynchronous USART communication](https://ww1.microchip.com/downloads/en/Appnotes/00774a.pdf): start/data/stop and idle levels.
- [Microchip: SPI introduction](https://developerhelp.microchip.com/xwiki/bin/view/applications/SPI): clocked serial sensor-interface context, not a required protocol lesson.
- [Texas Instruments: serialising parallel data](https://www.ti.com/product/DS99R101/part-details/DS99R101VS/NOPB): the relationship between multiple parallel paths and skew.
- [Texas Instruments: receiver skew margin](https://www.ti.com/lit/an/snla249/snla249.pdf#page=9): unequal path delay and its effect on the receiver's sampling margin; engineering calculations are not taught here.
