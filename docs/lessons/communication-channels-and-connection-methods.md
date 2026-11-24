# Communication channels and connection methods

Authored source: [student page](../../pages/topics/communication-channels-and-connection-methods.html). Unit 2 E1, Transmitting data. The HTML is edited directly; the matching answer pairs live in `javascript/data/communication-scenarios.js`.

## Coverage in order

1. **Introduced** — A communication channel as a path from sender to receiver. Radio broadcasts, staff radios and a phone call give familiar reasons for different channels. (`overview`)
2. **Introduced** — Channel descriptions explain data flow; connection methods identify the technology used. A mobile phone call separates these questions: voice travels both ways, while radio connects each phone to the mobile network. The arrows represent the conversation through that network, not a direct radio link between phones or a claim about radio duplex modes. (`channel-and-method`)
3. **Covered** — Simplex, half-duplex and full-duplex. Labelled direction diagrams show one-way flow, turn-taking and simultaneous flow. A network switch is defined at its first use in the full-duplex example. Teaching loops have pause controls; arrows and examples remain readable without motion. (`direction`, `half-duplex`, `full-duplex`)
4. **Covered** — Point-to-point and multi-drop. One PC cable joins exactly two devices. A selectable controller-and-meter bus shows several devices sharing one cable, with one meter replying at a time. This is an example access rule, not a definition of all multi-drop systems. (`arrangement`, `multi-drop`)
5. **Developed** — Direction and arrangement describe different properties of the same link. Five scenario tasks require both labels, with checks and explanations. (`combine-descriptions`, `channel-practice`)
6. **Introduced** — Wired electrical/light signals and wireless radio signals. (`connection-methods`)
7. **Covered** — Six practical connection examples, each with a real photograph, a suitable task, a benefit and a limit: Ethernet over copper, fibre-optic cable, USB, Wi-Fi, Bluetooth and cellular data. Fibre is a medium that can carry Ethernet, rather than an alternative at the same technical layer. USB-C shape alone does not specify speed. Typical Wi-Fi radio is half-duplex; fast turn-taking still supports two-way applications. (`ethernet` through `cellular`)
8. **Practice** — Six connection scenarios ask for a method and a reason. Needs and available equipment constrain the best answer. These are contextual choices, not universal rankings. (`scenario-chooser`)
9. **Developed** — Mobility, capacity, distance, reliability, security and cost, through a selectable real example for each factor. Bandwidth and interference are defined when used. (`selection`)
10. **Developed** — A warehouse recommendation builds from need to feature to benefit, then checks a limitation and an alternative. (`justify-link`)
11. **Practice** — Short recap, knowledge quiz and separate written explanations on a fixed-PC video link and moving warehouse scanners. (`mistakes`, `quiz`, `exam-practice`)

## Scope and boundaries

The specification explicitly names the five channel types and requires selection of connection methods for tasks. It does not provide a closed list of connection technologies or require a table of standard versions and exact speeds/ranges. The six examples develop recognition, comparison and contextual justification at the depth supported by AO2–AO4. They are teaching examples, not a claim that Pearson prescribes exactly these six.

The following transmission lesson covers synchronous/asynchronous and serial/parallel transmission. Protocols, packets, encryption and error handling are taught later. This lesson does not teach network configuration, addressing calculations, OSI layers, connector wiring or version-specific performance figures. Wireless is not automatically full-duplex; a wired connection is not automatically secure. A channel diagram shows directions, not the internal construction of a cable.

## Interactions and persistence

Uses the shared lesson shell, teacher opener/dividers, teaching-animation controls, paired-scenario checker and manual walkthrough. One authored source supports student reading, teacher slides and static fallback. Teaching motion remains available with reduced motion enabled, and pauses when hidden or offscreen.

The new matching tasks use `lesson-communication-matching-v1` through the shared localStorage helpers. They retain each pair and the current task independently for both groups. Clearing one task leaves other tasks intact. The retired `lesson-communication-scenario-tool` key is retained untouched. Existing quiz identity, answer key, version and pass threshold remain unchanged. Both written prompts and response IDs are preserved, including saved retired drafts. All original section anchors remain valid.

## Sources

- [Pearson Computing specification, Issue 8](https://qualifications.pearson.com/content/dam/pdf/BTEC-Nationals/computing/2016/specification-and-sample-assessments/btec-nat-l3-ext-dip-in-computing-spec.pdf): Unit 2 E1, printed p.34 (PDF p.44); assessment objectives, printed p.30 (PDF p.40).
- [Cisco wireless RF reference guide](https://www.cisco.com/c/en/us/td/docs/wireless/controller/9800/technical-reference/wireless-rf-reference-guide.html): Wi-Fi radio uses half-duplex access.
- [Photograph sources, authors and licences](../../assets/images/communication/CREDITS.md).
