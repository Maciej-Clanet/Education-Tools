# Packet data, packet switching and protocols

Authored source: [student page](../../pages/topics/packet-data-packet-switching-and-protocols.html). Edit the HTML directly. Unit 2 E1: packet contents, the roles of packet components, packet switching and protocols that govern transmission. Prerequisites: bits and bytes from C1, communication channels and [transmission methods](transmission-methods-synchronous-asynchronous-serial-and-parallel.md). Router terminology is introduced here.

## Coverage in order

1. **Introduced** — A phone message provides the reason to send data. A packet carries a data piece plus handling information. (`overview`)
2. **Developed** — The same message is split into three colour-stable pieces. Payload is defined; a second step adds sender, receiver and position information to each piece. The small pieces and numbering are illustrative. (`split`)
3. **Covered** — A simplified packet model groups header, payload and error-checking data. Header and trailer are defined; field positions depend on the protocol. (`packets`)
4. **Covered** — Selectable fields explain source, destination, sequence, payload and checking roles using packet 2. The diagram combines information for teaching and is not an exact IP header. (`field-roles`)
5. **Covered** — A router forwards packets between networks. Packet switching handles separate packets without reserving a dedicated path for the whole message. (`switching`)
6. **Covered** — Two numbered packets can take different routes to the same receiver. Controlled motion follows both paths. The same route is also possible; forwarding rules and available links determine the route. (`routes`)
7. **Developed** — A before/after network diagram shows an unavailable link and an alternative route. Routing information takes time to update; an alternative does not guarantee loss-free delivery. (`route-change`)
8. **Covered** — Different transfers share a link; packets can wait or be lost when a device cannot store more. Efficiency and delay are connected to this mechanism. (`sharing`)
9. **Covered** — Arrival order 3, 1, 2 becomes message order 1, 2, 3. Sequence information supports rebuilding the original data. (`arrival-order`)
10. **Covered** — A protocol is an agreed set of communication rules. An invented field format shows why sender and receiver must interpret the same data consistently. Rules can also govern confirmation and retry behaviour. (`protocols`)
11. **Introduced** — IP and TCP provide concrete examples of complementary jobs. IP addresses and delivers packets across networks without guaranteeing arrival or order. TCP provides reliable, ordered data delivery. Acknowledgement and retransmission are defined. Detailed protocol internals are outside scope. (`protocol-examples`)
12. **Developed** — A missing message piece remains a gap. A simple reliable-delivery rule waits for confirmation, then resends the missing data. Recovery depends on the protocol, not packet switching alone. (`missing`)
13. **Developed** — Changed data can cause a check mismatch. The receiver rejects that copy; a reliable protocol can arrange recovery. A checksum is introduced as a check value, not a repair mechanism. Calculations belong in error detection. (`damaged`)
14. **Practice** — A manual packet journey accepts a learner message and changes one condition: normal delivery, changed arrival order, loss or changed data. Event history and numbered receiver positions remain visible together. The rebuilt message appears only when all pieces have been accepted. (`simulator`)
15. **Practice** — Restore the message order from three packets. Checked selections give text feedback and cell-level correctness. (`rebuild-task`)
16. **Practice** — Two scenarios require an action, a reason and a saved explanation of benefit and cost. A complete project file justifies recovery delay. An already-too-late voice fragment justifies continuing when the application can hide a small gap. The latter is a constrained application judgement, not a blanket rule about all voice traffic. (`file-judgement`, `call-judgement`)
17. **Practice** — Distinguish payload from whole packet, possible routes from guaranteed delivery, and error detection from recovery. Retained knowledge quiz and written questions apply the field roles and shared-network benefits. (`mistakes`, `quiz`, `exam-practice`)

## Boundaries and scope interpretation

Pearson E1 names packet contents, component roles, packet switching and protocols governing transmission. It does not prescribe a closed list of protocol names or a detailed header layout. The lesson develops mechanisms, consequences and scenario reasoning. IP and TCP support the explanation rather than creating a separate protocol memorisation course.

The three-packet model deliberately combines addressing, sequencing and checking information. Packet sizes, field locations, sequence units and confirmation rules vary in real protocols. TCP sequences bytes and presents an ordered byte stream; the lesson's numbered pieces are not an implementation of TCP acknowledgements. Routing is not presented as a fresh shortest-path calculation for every packet. Error checks detect changes but do not guarantee detection of every possible error or repair the payload.

No OSI layer memorisation, address calculations, routing algorithms, congestion-control algorithms, checksum/parity calculations, circuit-switching comparison course or network configuration. E2 covers error detection and E3 covers error correction. Encryption and compression follow this lesson.

## Persistence and presentation

Uses the shared lesson shell, opener/dividers, manual walkthrough, teaching-animation controls and paired-scenario checker. The network motion pauses offscreen and remains available with reduced motion. Static and print views expose all authored steps and field explanations. Walkthrough, field and task selections are temporary.

The new `lesson-packet-journey-v1` store saves the message and condition, not playback progress. When no new message exists, the simulator reads the message from `lesson-packet-switching-simulator`; that legacy store is not modified or removed. The original quiz configuration, raw-answer key and questions remain unchanged. Both original written prompts retain their response IDs. New `file-judgement-v1` and `call-judgement-v1` drafts use the existing exam store and its merge behaviour, which retains retired drafts. Existing section anchors remain valid.

## Sources

- [Pearson Computing specification, Issue 8](https://qualifications.pearson.com/content/dam/pdf/BTEC-Nationals/computing/2016/specification-and-sample-assessments/btec-nat-l3-ext-dip-in-computing-spec.pdf#page=44): Unit 2 E1 and the adjacent E2/E3 boundaries; Unit 2 assessment objectives support application and judgement.
- [RFC 791: Internet Protocol](https://www.rfc-editor.org/rfc/rfc791): addressing, datagram delivery and the limits of IP reliability.
- [RFC 9293: Transmission Control Protocol](https://www.rfc-editor.org/rfc/rfc9293.html): reliable ordered byte-stream delivery, sequencing, checks, acknowledgements and retransmission.
