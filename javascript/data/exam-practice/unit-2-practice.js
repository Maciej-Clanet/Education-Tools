import { unit2Jun2024Exam } from "../past-exams/unit-2-jun-2024.js"
import { btecLevel3Unit2ProgressData } from "../unit-progress-data.js"

function buildTopics(progressData) {
  return progressData.sections.flatMap((section) =>
    section.lessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      sectionId: section.id,
      sectionTitle: section.title,
      href: lesson.href,
    }))
  )
}

export const unit2ExamPracticeConfig = {
  id: "btec-level-3-unit-2-practice",
  unitId: "btec-level-3-unit-2",
  unitTitle: "BTEC Level 3 Computing Unit 2: Computer Systems",
  qualification: "Pearson BTEC Level 3 National Computing",
  durationMinutes: 105,
  totalMarks: 80,
  topics: buildTopics(btecLevel3Unit2ProgressData),
  predefinedPapers: [
    {
      id: "unit-2-jun-2024",
      title: "June 2024 practice paper",
      shortTitle: "June 2024 paper",
      description:
        "A full 80-mark Unit 2 paper with local autosave, attempts, and teacher feedback import/export.",
      durationMinutes: 105,
      totalMarks: 80,
      exam: unit2Jun2024Exam,
    },
  ],
  questionBank: {
    version: 1,
    minCustomMarks: 4,
    groups: [
      {
        id: "u2-custom-a1-school-systems",
        title: "Question 1",
        totalMarks: 10,
        customEligible: true,
        topicIds: [
          "computer-system-types-and-internal-components",
          "input-output-and-storage-devices",
          "hardware-performance-and-component-choice",
        ],
        scenarioHtml: `
          <p>A secondary school is replacing the computer systems used in its library and media classroom.</p>
          <p>The new systems will be used for homework, printing, editing short videos, and storing shared resources.</p>
        `,
        parts: [
          {
            id: "a1-school-1",
            label: "1(a)",
            marks: 3,
            topicIds: ["computer-system-types-and-internal-components"],
            commandWord: "Give",
            ao: "AO1",
            promptHtml:
              "<p>Give <strong>three</strong> internal components that affect the performance of the new computers.</p>",
            response: {
              type: "list",
              count: 3,
              label: "Component",
              rows: 2,
            },
            rubric: {
              type: "points",
              maxMarks: 3,
              points: [
                {
                  label: "Processor or CPU",
                  terms: [["processor"], ["cpu"], ["central processing"]],
                },
                {
                  label: "RAM or main memory",
                  terms: [["ram"], ["main memory"], ["memory"]],
                },
                {
                  label: "Graphics card or GPU",
                  terms: [["gpu"], ["graphics"], ["video card"]],
                },
                {
                  label: "Storage drive",
                  terms: [["ssd"], ["hard drive"], ["storage"]],
                },
              ],
              modelAnswer:
                "CPU, RAM, GPU, and storage drive are all acceptable internal components.",
              aiCriteria:
                "Award one mark for each valid internal component that can affect performance, up to three marks.",
              examinerTip:
                "Name actual internal components rather than peripherals such as monitor or printer.",
            },
          },
          {
            id: "a1-school-2",
            label: "1(b)",
            marks: 3,
            topicIds: ["input-output-and-storage-devices"],
            commandWord: "Describe",
            ao: "AO2",
            promptHtml:
              "<p>Describe one input device and one output device that would be useful in the library. Link each device to the scenario.</p>",
            response: {
              type: "textarea",
              rows: 5,
              label: "Device choices and scenario links",
            },
            rubric: {
              type: "points",
              maxMarks: 3,
              points: [
                {
                  label: "Names a suitable input device",
                  terms: [["keyboard"], ["mouse"], ["scanner"], ["microphone"], ["camera"]],
                },
                {
                  label: "Names a suitable output device",
                  terms: [["monitor"], ["screen"], ["printer"], ["speaker"], ["projector"]],
                },
                {
                  label: "Links the device choice to the library use",
                  terms: [["homework"], ["printing"], ["library"], ["video"], ["resources"]],
                },
              ],
              modelAnswer:
                "A keyboard would let students enter homework answers and search for resources. A printer would produce paper copies of finished work.",
              aiCriteria:
                "Credit suitable devices and award application only where the answer connects the device to a library or media-classroom use.",
              examinerTip:
                "For applied marks, explain why the device fits this school scenario.",
            },
          },
          {
            id: "a1-school-3",
            label: "1(c)",
            marks: 4,
            topicIds: ["hardware-performance-and-component-choice"],
            commandWord: "Explain",
            ao: "AO2",
            promptHtml:
              "<p>Explain two factors the school should consider when choosing the hardware for the new computers.</p>",
            response: {
              type: "list",
              count: 2,
              label: "Factor",
              rows: 4,
            },
            rubric: {
              type: "points",
              maxMarks: 4,
              points: [
                {
                  label: "Cost or budget with a developed reason",
                  terms: [["cost"], ["budget"], ["price"]],
                },
                {
                  label: "Compatibility with existing software or network",
                  terms: [["compatib"], ["network"], ["software"]],
                },
                {
                  label: "Performance for media editing or multitasking",
                  terms: [["performance"], ["video"], ["multitask"], ["speed"]],
                },
                {
                  label: "User needs, accessibility, security, or reliability",
                  terms: [["accessib"], ["security"], ["reliab"], ["student"], ["user need"]],
                },
              ],
              modelAnswer:
                "The school should consider cost so it can buy enough machines within budget, and performance so video editing runs smoothly without slowing other library work.",
              aiCriteria:
                "Award up to two marks per explained factor: one for a valid factor and one for a scenario-linked explanation.",
              examinerTip:
                "A factor alone is not enough for full marks; develop why it matters.",
            },
          },
        ],
      },
      {
        id: "u2-custom-a2-health-app",
        title: "Question 2",
        totalMarks: 10,
        customEligible: true,
        topicIds: [
          "operating-system-types",
          "kernel-functions-and-system-management",
          "user-interfaces-and-software-choice",
          "utility-application-and-open-source-software",
        ],
        scenarioHtml: `
          <p>A health clinic is buying tablet computers for staff who visit patients at home.</p>
          <p>The tablets will run a patient-record app, connect to the clinic network, and store sensitive personal data.</p>
        `,
        parts: [
          {
            id: "a2-health-1",
            label: "2(a)",
            marks: 2,
            topicIds: ["operating-system-types"],
            commandWord: "State",
            ao: "AO1",
            promptHtml:
              "<p>State two features of a mobile operating system that would be useful on the tablets.</p>",
            response: {
              type: "list",
              count: 2,
              label: "Feature",
              rows: 2,
            },
            rubric: {
              type: "points",
              maxMarks: 2,
              points: [
                {
                  label: "Touchscreen or gesture support",
                  terms: [["touch"], ["gesture"]],
                },
                {
                  label: "Wireless networking support",
                  terms: [["wi-fi"], ["wireless"], ["cellular"], ["bluetooth"]],
                },
                {
                  label: "Power or battery management",
                  terms: [["battery"], ["power"]],
                },
                {
                  label: "Security controls",
                  terms: [["security"], ["encryption"], ["biometric"], ["password"]],
                },
              ],
              modelAnswer:
                "Touchscreen support and battery management are useful mobile OS features.",
              aiCriteria:
                "Award one mark for each valid mobile OS feature, up to two marks.",
              examinerTip:
                "Avoid generic software features unless they clearly belong to the operating system.",
            },
          },
          {
            id: "a2-health-2",
            label: "2(b)",
            marks: 4,
            topicIds: ["kernel-functions-and-system-management"],
            commandWord: "Explain",
            ao: "AO2",
            promptHtml:
              "<p>Explain how the kernel could help manage the patient-record app while staff are using the tablet.</p>",
            response: {
              type: "textarea",
              rows: 6,
              label: "Kernel explanation",
            },
            rubric: {
              type: "points",
              maxMarks: 4,
              points: [
                {
                  label: "Manages memory used by the app",
                  terms: [["memory"], ["ram"]],
                },
                {
                  label: "Schedules or manages processor time",
                  terms: [["processor"], ["cpu"], ["schedule"], ["execution"]],
                },
                {
                  label: "Handles interrupts, device drivers, or input/output",
                  terms: [["interrupt"], ["driver"], ["input"], ["output"]],
                },
                {
                  label: "Links the explanation to patient records or tablet use",
                  terms: [["patient"], ["record"], ["tablet"], ["clinic"]],
                },
              ],
              modelAnswer:
                "The kernel allocates memory to the patient-record app, schedules CPU time so the app can run alongside background tasks, and uses drivers to handle touchscreen and network input.",
              aiCriteria:
                "Credit accurate kernel functions and reward clear application to the app/tablet scenario.",
              examinerTip:
                "Name a kernel role, then say what it does for this app.",
            },
          },
          {
            id: "a2-health-3",
            label: "2(c)",
            marks: 4,
            topicIds: ["utility-application-and-open-source-software"],
            commandWord: "Describe",
            ao: "AO2",
            promptHtml:
              "<p>Describe two utility software tools that could help protect the clinic's data.</p>",
            response: {
              type: "list",
              count: 2,
              label: "Utility",
              rows: 4,
            },
            rubric: {
              type: "points",
              maxMarks: 4,
              points: [
                {
                  label: "Anti-malware or antivirus detects/removes threats",
                  terms: [["anti"], ["virus"], ["malware"], ["detect"], ["remove"]],
                },
                {
                  label: "Firewall controls network traffic",
                  terms: [["firewall"], ["traffic"], ["network"]],
                },
                {
                  label: "Encryption protects stored or transmitted data",
                  terms: [["encrypt"], ["encrypted"]],
                },
                {
                  label: "Backup or recovery utility restores data",
                  terms: [["backup"], ["restore"], ["recovery"]],
                },
              ],
              modelAnswer:
                "Anti-malware can detect malicious software on the tablet. Encryption software can protect patient data if a tablet is lost.",
              aiCriteria:
                "Award up to two marks per utility: one for naming a suitable utility and one for describing protection.",
              examinerTip:
                "A good answer explains how the utility protects sensitive data.",
            },
          },
        ],
      },
      {
        id: "u2-custom-b1-b2-research-lab",
        title: "Question 3",
        totalMarks: 12,
        customEligible: true,
        topicIds: [
          "stored-program-architecture-von-neumann-and-harvard",
          "cluster-computing-uma-and-numa",
          "emulation-in-computer-systems",
          "instruction-cycle",
          "cpu-performance-instruction-sets-and-cache",
        ],
        scenarioHtml: `
          <p>A university research lab processes large climate simulations.</p>
          <p>The lab also needs to run older modelling software that was written for a different processor architecture.</p>
        `,
        parts: [
          {
            id: "b1-lab-1",
            label: "3(a)",
            marks: 4,
            topicIds: ["cluster-computing-uma-and-numa"],
            commandWord: "Explain",
            ao: "AO2",
            promptHtml:
              "<p>Explain why cluster computing may be suitable for the climate simulations.</p>",
            response: {
              type: "textarea",
              rows: 6,
              label: "Cluster computing explanation",
            },
            rubric: {
              type: "points",
              maxMarks: 4,
              points: [
                {
                  label: "Uses multiple computers or nodes",
                  terms: [["node"], ["multiple computers"], ["cluster"]],
                },
                {
                  label: "Shares or divides processing work",
                  terms: [["divide"], ["parallel"], ["share"], ["workload"]],
                },
                {
                  label: "Improves performance or scalability",
                  terms: [["performance"], ["scalab"], ["faster"], ["speed"]],
                },
                {
                  label: "Links to large climate simulations",
                  terms: [["climate"], ["simulation"], ["research"]],
                },
              ],
              modelAnswer:
                "A cluster can split simulation work across several nodes, giving more processing power and making it easier to scale the system for large models.",
              aiCriteria:
                "Credit cluster features and application to large simulation workloads.",
              examinerTip:
                "The scenario link should focus on processing a large workload, not simply storing data.",
            },
          },
          {
            id: "b1-lab-2",
            label: "3(b)",
            marks: 4,
            topicIds: ["emulation-in-computer-systems"],
            commandWord: "Describe",
            ao: "AO2",
            promptHtml:
              "<p>Describe two issues the lab may face when using emulation to run the older software.</p>",
            response: {
              type: "list",
              count: 2,
              label: "Issue",
              rows: 4,
            },
            rubric: {
              type: "points",
              maxMarks: 4,
              points: [
                {
                  label: "Lower performance because translation adds overhead",
                  terms: [["slow"], ["performance"], ["overhead"], ["translation"]],
                },
                {
                  label: "Compatibility may not be perfect",
                  terms: [["compatib"], ["not work"], ["error"], ["feature"]],
                },
                {
                  label: "Extra configuration, testing, or specialist knowledge",
                  terms: [["configure"], ["test"], ["specialist"], ["setup"]],
                },
                {
                  label: "Licensing or support limitations",
                  terms: [["licen"], ["support"], ["vendor"]],
                },
              ],
              modelAnswer:
                "Emulation may reduce performance because instructions need to be translated. Some older features may not work correctly, so the lab would need testing.",
              aiCriteria:
                "Award up to two marks per developed issue, with credit for both issue and consequence.",
              examinerTip:
                "Do not only say emulation is useful; the question asks for issues.",
            },
          },
          {
            id: "b1-lab-3",
            label: "3(c)",
            marks: 4,
            topicIds: ["cpu-performance-instruction-sets-and-cache"],
            commandWord: "Explain",
            ao: "AO2",
            promptHtml:
              "<p>Explain how cache memory could affect the performance of the processor during repeated calculations.</p>",
            response: {
              type: "textarea",
              rows: 5,
              label: "Cache explanation",
            },
            rubric: {
              type: "points",
              maxMarks: 4,
              points: [
                {
                  label: "Cache stores frequently or recently used data/instructions",
                  terms: [["cache"], ["frequent"], ["recent"], ["instruction"], ["data"]],
                },
                {
                  label: "Cache is faster to access than main memory",
                  terms: [["faster"], ["main memory"], ["ram"]],
                },
                {
                  label: "Reduces fetch time or bottlenecks",
                  terms: [["fetch"], ["bottleneck"], ["access time"]],
                },
                {
                  label: "Links to repeated calculations",
                  terms: [["repeat"], ["calculation"], ["simulation"]],
                },
              ],
              modelAnswer:
                "Cache stores frequently used data and instructions close to the CPU. Repeated simulation calculations may be fetched from cache instead of slower RAM.",
              aiCriteria:
                "Credit the cache role, speed comparison, and application to repeated calculations.",
              examinerTip:
                "A strong answer explains both what cache stores and why that changes performance.",
            },
          },
        ],
      },
      {
        id: "u2-custom-c1-c3-media-file",
        title: "Question 4",
        totalMarks: 10,
        customEligible: true,
        topicIds: [
          "units-of-digital-data",
          "binary-and-bcd",
          "binary-arithmetic",
          "bitmap-image-storage",
          "resolution-bit-depth-and-image-compression",
        ],
        scenarioHtml: `
          <p>A graphics student is preparing images for an online portfolio.</p>
          <p>The website should load quickly while still showing clear images of the student's work.</p>
        `,
        parts: [
          {
            id: "c-media-1",
            label: "4(a)",
            marks: 2,
            topicIds: ["units-of-digital-data"],
            commandWord: "Calculate",
            ao: "AO2",
            promptHtml:
              "<p>An image file is 3 MB. Calculate the file size in KB. Use 1 MB = 1024 KB.</p>",
            response: {
              type: "input",
              label: "File size in KB",
              placeholder: "Enter a number",
            },
            rubric: {
              type: "calculation",
              maxMarks: 2,
              requiredNumbers: ["3072"],
              workingTerms: [["3", "1024"], ["3x1024"], ["3*1024"]],
              modelAnswer: "3 x 1024 = 3072 KB.",
              aiCriteria:
                "Award one mark for using 3 x 1024 and one mark for the final answer 3072 KB.",
              examinerTip:
                "Use binary storage units for this calculation.",
            },
          },
          {
            id: "c-media-2",
            label: "4(b)",
            marks: 4,
            topicIds: ["resolution-bit-depth-and-image-compression"],
            commandWord: "Explain",
            ao: "AO2",
            promptHtml:
              "<p>Explain how reducing resolution and bit depth could affect the images and the website.</p>",
            response: {
              type: "textarea",
              rows: 6,
              label: "Image explanation",
            },
            rubric: {
              type: "points",
              maxMarks: 4,
              points: [
                {
                  label: "Lower resolution means fewer pixels or less detail",
                  terms: [["resolution"], ["pixel"], ["detail"]],
                },
                {
                  label: "Lower bit depth means fewer colours",
                  terms: [["bit depth"], ["colour"], ["color"]],
                },
                {
                  label: "File size would be smaller",
                  terms: [["file size"], ["smaller"], ["less storage"]],
                },
                {
                  label: "Website could load faster but image quality may reduce",
                  terms: [["load"], ["faster"], ["quality"], ["portfolio"]],
                },
              ],
              modelAnswer:
                "Reducing resolution lowers the number of pixels and reducing bit depth lowers the number of colours. This reduces file size so pages load faster, but image quality may be worse.",
              aiCriteria:
                "Credit technical effect on image data and the applied effect on loading/quality.",
              examinerTip:
                "Balance file size and visual quality for this portfolio scenario.",
            },
          },
          {
            id: "c-media-3",
            label: "4(c)",
            marks: 4,
            topicIds: ["binary-arithmetic"],
            commandWord: "Complete",
            ao: "AO1",
            promptHtml:
              "<p>Complete the binary addition: <strong>1011 + 0110</strong>.</p>",
            response: {
              type: "input",
              label: "Binary answer",
              placeholder: "Enter the binary result",
            },
            rubric: {
              type: "sequence",
              maxMarks: 4,
              requiredNumbers: ["10001"],
              modelAnswer: "1011 + 0110 = 10001.",
              aiCriteria:
                "Award full marks for 10001. If manually marking later, credit correct carries and partial working.",
              examinerTip:
                "Remember that 1 + 1 creates a carry into the next column.",
            },
          },
        ],
      },
      {
        id: "u2-custom-d1-d2-queue-data",
        title: "Question 5",
        totalMarks: 10,
        customEligible: true,
        topicIds: [
          "stacks-and-queues",
          "arrays-lists-and-data-types",
          "matrices-and-arrays",
          "multi-dimensional-arrays-and-memory-order",
        ],
        scenarioHtml: `
          <p>A ticket website stores customer requests while users wait to buy concert tickets.</p>
          <p>The system also stores seat prices in rows and columns so the prices can be processed quickly.</p>
        `,
        parts: [
          {
            id: "d-ticket-1",
            label: "5(a)",
            marks: 3,
            topicIds: ["stacks-and-queues"],
            commandWord: "Explain",
            ao: "AO2",
            promptHtml:
              "<p>Explain why a queue is suitable for managing the waiting customers.</p>",
            response: {
              type: "textarea",
              rows: 5,
              label: "Queue explanation",
            },
            rubric: {
              type: "points",
              maxMarks: 3,
              points: [
                {
                  label: "Queue uses first in, first out",
                  terms: [["first in first out"], ["fifo"]],
                },
                {
                  label: "Customers are served in arrival order",
                  terms: [["arrival"], ["order"], ["wait"], ["served"]],
                },
                {
                  label: "Links to fairness or ticket waiting system",
                  terms: [["fair"], ["ticket"], ["customer"]],
                },
              ],
              modelAnswer:
                "A queue uses FIFO, so the customer who joins first is served first. This is fair for a ticket waiting system.",
              aiCriteria:
                "Credit FIFO, correct effect on ordering, and application to customers waiting.",
              examinerTip:
                "Use FIFO language and connect it to the waiting customers.",
            },
          },
          {
            id: "d-ticket-2",
            label: "5(b)",
            marks: 4,
            topicIds: ["matrices-and-arrays"],
            commandWord: "Describe",
            ao: "AO2",
            promptHtml:
              "<p>Describe how a two-dimensional array could be used to store the seat prices.</p>",
            response: {
              type: "textarea",
              rows: 5,
              label: "Array description",
            },
            rubric: {
              type: "points",
              maxMarks: 4,
              points: [
                {
                  label: "Uses rows and columns",
                  terms: [["row"], ["column"]],
                },
                {
                  label: "Each element stores one seat price",
                  terms: [["element"], ["price"], ["seat"]],
                },
                {
                  label: "Indexes identify a specific position",
                  terms: [["index"], ["position"], ["coordinate"]],
                },
                {
                  label: "Links rows/columns to the venue or seating plan",
                  terms: [["venue"], ["seat"], ["row"], ["column"]],
                },
              ],
              modelAnswer:
                "A two-dimensional array can store prices by row and seat number. The row and column index identify the element holding each price.",
              aiCriteria:
                "Credit array structure, element/index language, and scenario application.",
              examinerTip:
                "Explain how the data is organised, not just that an array exists.",
            },
          },
          {
            id: "d-ticket-3",
            label: "5(c)",
            marks: 3,
            topicIds: ["arrays-lists-and-data-types"],
            commandWord: "Give",
            ao: "AO1",
            promptHtml:
              "<p>Give three data types that could be used in the ticket system.</p>",
            response: {
              type: "list",
              count: 3,
              label: "Data type",
              rows: 2,
            },
            rubric: {
              type: "points",
              maxMarks: 3,
              points: [
                {
                  label: "Integer",
                  terms: [["integer"], ["int"]],
                },
                {
                  label: "Real, float, or decimal",
                  terms: [["real"], ["float"], ["decimal"]],
                },
                {
                  label: "String",
                  terms: [["string"], ["text"], ["char"]],
                },
                {
                  label: "Boolean",
                  terms: [["boolean"], ["true"], ["false"]],
                },
              ],
              modelAnswer:
                "Integer, real, string, and Boolean are valid data types.",
              aiCriteria:
                "Award one mark for each valid data type, up to three marks.",
              examinerTip:
                "Give data types, not examples of data values.",
            },
          },
        ],
      },
      {
        id: "u2-custom-e1-e3-warehouse-network",
        title: "Question 6",
        totalMarks: 10,
        customEligible: true,
        topicIds: [
          "communication-channels-and-connection-methods",
          "transmission-methods-synchronous-asynchronous-serial-and-parallel",
          "packet-data-packet-switching-and-protocols",
          "encryption-and-data-compression",
          "error-detection-methods",
          "error-correction-with-arq-and-fec",
        ],
        scenarioHtml: `
          <p>A warehouse uses handheld scanners to send stock updates to a central server.</p>
          <p>The scanners move around the building and sometimes lose signal near metal shelving.</p>
        `,
        parts: [
          {
            id: "e-warehouse-1",
            label: "6(a)",
            marks: 3,
            topicIds: ["communication-channels-and-connection-methods"],
            commandWord: "Describe",
            ao: "AO2",
            promptHtml:
              "<p>Describe a suitable connection method for the handheld scanners.</p>",
            response: {
              type: "textarea",
              rows: 5,
              label: "Connection method",
            },
            rubric: {
              type: "points",
              maxMarks: 3,
              points: [
                {
                  label: "Names a wireless connection method",
                  terms: [["wi-fi"], ["wireless"], ["bluetooth"], ["cellular"]],
                },
                {
                  label: "Explains mobility or no cable requirement",
                  terms: [["move"], ["mobile"], ["cable"], ["handheld"]],
                },
                {
                  label: "Considers reliability, range, or signal loss",
                  terms: [["range"], ["signal"], ["reliab"], ["shelving"]],
                },
              ],
              modelAnswer:
                "Wi-Fi would allow scanners to send updates while staff move around. The warehouse may need enough access points to reduce signal loss near shelving.",
              aiCriteria:
                "Credit a suitable method plus mobility and signal/range application.",
              examinerTip:
                "The scenario points toward wireless mobility, but reliability still matters.",
            },
          },
          {
            id: "e-warehouse-2",
            label: "6(b)",
            marks: 3,
            topicIds: ["packet-data-packet-switching-and-protocols"],
            commandWord: "Explain",
            ao: "AO2",
            promptHtml:
              "<p>Explain why packet switching is useful when sending stock updates across the network.</p>",
            response: {
              type: "textarea",
              rows: 5,
              label: "Packet switching explanation",
            },
            rubric: {
              type: "points",
              maxMarks: 3,
              points: [
                {
                  label: "Data is split into packets",
                  terms: [["packet"], ["split"]],
                },
                {
                  label: "Packets can travel by different routes or share network capacity",
                  terms: [["route"], ["network"], ["capacity"], ["share"]],
                },
                {
                  label: "Links to updates continuing despite busy or disrupted network paths",
                  terms: [["stock"], ["update"], ["busy"], ["disrupt"], ["signal"]],
                },
              ],
              modelAnswer:
                "Stock updates can be split into packets. Packet switching lets network capacity be shared and packets can use available routes.",
              aiCriteria:
                "Credit packetisation, routing/capacity benefit, and application to stock updates.",
              examinerTip:
                "Do not confuse packet switching with encryption.",
            },
          },
          {
            id: "e-warehouse-3",
            label: "6(c)",
            marks: 4,
            topicIds: ["error-detection-methods", "error-correction-with-arq-and-fec"],
            commandWord: "Explain",
            ao: "AO2",
            promptHtml:
              "<p>Explain how error detection and ARQ could help when scanner data is affected by signal loss.</p>",
            response: {
              type: "textarea",
              rows: 6,
              label: "Error handling explanation",
            },
            rubric: {
              type: "points",
              maxMarks: 4,
              points: [
                {
                  label: "Error detection checks whether data has changed",
                  terms: [["error detection"], ["checksum"], ["parity"], ["check"]],
                },
                {
                  label: "ARQ requests retransmission",
                  terms: [["arq"], ["retransmit"], ["resend"]],
                },
                {
                  label: "Improves accuracy or reliability of stock updates",
                  terms: [["accur"], ["reliab"], ["stock"]],
                },
                {
                  label: "Links to signal loss or warehouse interference",
                  terms: [["signal"], ["loss"], ["shelving"], ["interference"]],
                },
              ],
              modelAnswer:
                "A checksum or parity check can detect that scanner data has been corrupted. ARQ can request the packet again, improving reliability when signal loss occurs.",
              aiCriteria:
                "Credit detection, retransmission, and application to corrupted scanner updates.",
              examinerTip:
                "Detection finds the problem; ARQ is the recovery action.",
            },
          },
        ],
      },
    ],
  },
}
