# Stored-program architecture improvement plan

Review: 26 September 2026. Original notes refer to the old 26-section / 31-slide
version; the follow-up about examples on slides 15/18 refers to the first revised
32-slide version. The current version has 35 slides. Continue from this checklist.

## Direction

Teach why stored programs matter before teaching the two memory organisations.
Define an instruction, data, processor and memory in familiar language. The first
whole-system picture must explain roles without depicting a particular memory
architecture. Introduce the choice of shared/separate memory arrangements before
Von Neumann. CPU parts get one short contextual introduction, with full details
left to later lessons. Keep detailed qualifications in student revision notes.
Following the example review, use familiar tasks and real photos, avoid processor
model names in student copy, and make the reasons for choosing each approach clear.

## Work packages

- [x] **Opening and foundations (notes 1–8):** shared objective opener; historical
  bridge before the existing illustration; ENIAC context and a clear programming
  problem; redesigned stored-program and loading visuals; concrete instruction/data
  examples; architecture-neutral overview and a brief CPU-part primer.
- [x] **Models and teaching tools (9–13):** simpler labelled memory/processor
  diagrams; rebuild the tiny-program animation; animate contention with visible
  waiting requests; merge Harvard structure and concurrent access into one
  controlled demonstration; remove duplicate comparison simulators and slides.
- [x] **Modern designs and use (14–16 and final request):** readable diagram of
  shared main memory plus separate nearby caches; introduce cache only as far as
  needed. Remove diagram-identification activity. The initially added micro:bit
  and Arduino examples were superseded by room-heating and headphone-processing
  design scenarios. Retain the sourced Raspberry Pi example. Distinguish sourced
  hardware facts from illustrative suitability, not manufacturer design intent.
- [x] **Example/trade-off follow-up:** remove chip names; add three credited real
  photos; explain Von Neumann simplicity and flexible shared RAM, Harvard fixed
  capacity/extra connections, and modified Harvard cache costs and remaining waits.
  Use a ten-unit capacity example and familiar task requirements, with no claim
  that the photographed thermostat/headphone models have a specific architecture.
- [x] **Assessment and continuity:** preserve the existing quiz, version 3,
  12 questions, pass 9, and existing written prompts/draft IDs where unchanged.
  Improve exam presentation, reuse the evaluation scaffold, retain glossary,
  navigation and useful old anchors. Move reference material out of first teaching.
- [x] **Validation and handover:** state/model regression checks; animation under
  OS reduced motion, Play/Pause/Step/Previous/Reset, visibility pausing and bounded
  ends; quiz/draft persistence; no-JS reading; all slide layouts at 1366×900 and
  1366×768 including interactive states; mobile widths 390/320; assets/IDs/links;
  update Unit 2 tracker and `stored_program_lesson.md`.

## Evidence checked

- History: [Computer History Museum, ENIAC](https://www.computerhistory.org/revolution/story/78).
  Retain the locally authored illustrative room; do not present it as a photograph
  or an exact reconstruction. Focus on configuring a task rather than historical trivia.
- [Arm small-processor datasheet](https://developer.arm.com/-/media/Arm%20Developer%20Community/PDF/Processor%20Datasheets/Arm_Cortex-M0_Processor_Datasheet.pdf)
  confirms a real low-area, low-power shared-bus design. The thermostat is an
  illustrative suitability scenario; chip names are kept out of the teaching copy.
- [Analog Devices: why use a sound-processing processor?](https://www.analog.com/en/resources/analog-dialogue/articles/dsp-101-part-2.html)
  explains separate program/data access and sustained processing. Apply the principle
  to headphone sound processing without claiming the pictured product's internals.
- [Microchip memory organisation](https://developerhelp.microchip.com/xwiki/bin/view/products/mcu-mpu/16bit-mcu/architecture/)
  supports separate paths and differently organised instruction/data memories.
- [Raspberry Pi BCM2711](https://www.raspberrypi.com/documentation/computers/processors.html#bcm2711)
  has Cortex-A72 cores with separate instruction/data L1 caches and shared system RAM;
  [Arm cache explanation](https://developer.arm.com/community/arm-community-blogs/b/architectures-and-processors-blog/posts/caches-and-self-modifying-code)
  supports the distinction between unified software memory and split nearby paths.

## Status

Completed and refined 26 September 2026. The lesson now has 23 student sections and 35 Teacher
Slides, including the opener, five dividers and six separate written tasks.

Original slides and all changed/new views were visually reviewed; all 35 slide
layout checks passed at 1366×900 and 1366×768,
including every interactive state. The full quiz intentionally scrolls. Mobile
390/320px, readable no-JS/print sequences, reduced-motion teaching playback,
native keyboard controls, quiz 12/12/reset/reload and saved written drafts passed.
Three model regressions and the cross-lesson teaching-motion regression passed
during the rebuild; the expanded 35-slide browser regression passed after refinement.
Quiz and written-task content/IDs remain unchanged; all previous section anchors
and local references are valid. Syntax and whitespace checks passed.

Implementation contracts, slide map and test setup are in `stored_program_lesson.md`;
the Unit 2 tracker is updated. No requested work remains deferred. Accepted changes
to the RAID/NAS, multiple-systems and backup lessons remain in the working tree.
