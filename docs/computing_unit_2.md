# Computing Unit 2 scope reference

Read only the relevant content area when planning or checking Unit 2 coverage.
This is the qualification scope, not a lesson-completion or improvement tracker.
Current lesson coverage belongs in `docs/lessons/`; page availability and teaching
order are in the unit hub and `javascript/data/course-catalog.js`.

Source: Pearson BTEC Level 3 National Extended Diploma in Computing, first teaching
2016, Issue 8 — [specification](https://qualifications.pearson.com/content/dam/pdf/BTEC-Nationals/computing/2016/specification-and-sample-assessments/btec-nat-l3-ext-dip-in-computing-spec.pdf).
The essential-content extract below is retained from the existing project source;
this documentation refactor does not revalidate the qualification's current terms.
The local supporting revision book is `docs/Unit 2 - Fundamentals of Computing Revision Book-1.pdf`.

## Assessment context

Unit 2 concerns the relationships between hardware/software, computer architecture,
representation/organisation/transmission of data, and logic/data flow. The source
specification describes a written examination of 80 marks over 1 hour 45 minutes.

- AO1: knowledge and understanding of computing facts, terms, standards, concepts
  and processes.
- AO2: apply that knowledge to real-life scenarios.
- AO3: select/use technologies and procedures to explore outcomes and solve
  problems in context.
- AO4: analyse/evaluate information, technologies and procedures to recommend
  and justify solutions.
- AO5: connect technologies, procedures, outcomes and solutions to resolve problems.

Use the actual question and mark scheme for answer requirements; avoid universal
command-word or paragraph formulas. [Exam-technique guidance](exam_technique.md)
records a worked evaluation pattern and the relevant sample-assessment source.

## Essential content
The essential content is set out under content areas. Learners must cover all specified content
before the assessment

## A Hardware and software
The concepts and implications of the use of, and relationships between, hardware and software that
form computer systems.

### A1 Computer hardware in a computer system
• Types of computer systems:
    o multi-functional devices
    o personal computers
    o mobile devices
    o servers.
• The purpose, features and uses of internal components used in:
    o multi-functional devices
    o personal computers
    o mobile devices
    o servers.
• Factors affecting the choice, use and performance of internal components.
• The hardware used in computer systems:
    o input devices
    o output devices
    o storage devices.
• How the features of hardware can affect their performance and the performance of a
    computer system.
• Factors affecting choice of hardware:
    o user experience – ease of use, performance, availability, accessibility
    o user needs
    o compatibility
    o cost
    o efficiency
    o implementation – timescales, testing, migration to new system
    o productivity
    o security.
• Data storage and recovery systems:
    o redundant array of independent disks (RAID)
    o network attached storage (NAS)

### A2 Computer software in a computer system
• Operating systems:
    o types of operating system:
        – real-time operating system
        – single-user single task
        – single-user multi-tasking
        – multi-user
    o the role of the kernel in controlling and managing system components and tasks:
        – program execution
        – interrupts
        – modes
        – memory management
        – multi-tasking
        – disk access
        – file systems
        – device drivers
    o the role of the operating system in managing:
        – networking
        – security
    o factors affecting the choice and use of user interfaces:
        – graphical
        – command line
        – menu based
    o factors affecting the choice of operating system
    o factors affecting the use and performance of an operating system.
• Utility software:
    o the purpose, features and uses of utility software
    o factors affecting the choice, use and performance of utility software.
• Application software:
    o the purpose, features and uses of application software
    o factors affecting the choice, use and performance of application software.
• The principles and implications of open source operating systems and software.

### A3 Data processing
• The use, features and implications of computer systems for data processing.
• The role of hardware in collecting data.
• The role of software in collecting data.
• Data processing functions:
    o aggregation
    o analysis
    o conversion
    o reporting
    o sorting
    o validation.
• The impact on individuals and organisations of using and storing data across multiple
computer systems:
    o access
    o cost
    o implementation
    o productivity
    o security.
• Backup and data recovery procedures

## B Computer architecture
The implications of computer architecture models and the impact of the relationships between their
component parts.

### B1 Approaches to computer architecture
• The features and characteristics of different computer architecture models:
    o stored program model:
        – Von Neumann architecture
        – Harvard architecture
    o cluster computing
    o uniform memory access and non-uniform memory access.
• Use and application of emulation.
• Factors affecting the choice of different architecture models.
• The impact of using different architecture models.

### B2 The concepts of microarchitecture
• Instruction cycles.
• Execution speeds:
    o factors affecting execution speeds
    o methods of increasing execution speed
    o implications of execution speeds.
• The use and choice of instruction sets.
• Pipelining.
• Cache.
• Registers.
• Multi-processing and multi-threading.
• The features and implications of embedded and mobile central processing unit (CPU)
architecture.
• The features and implications of microcomputer CPU architecture.
• The features and implications of server CPU architecture.

### B3 Registers and register handling
• Types of register:
    o general purpose register
    o special registers:
        – accumulator
        – instruction register
        – memory address register (MAR)
        – memory data register (MDR)
        – program counter.
• The function and purpose of general and special registers and their impact on the way
computer systems perform.
• The role of interrupts in a computer system.

## C How data is represented by computer systems
The characteristics, concepts and implications of computer data representation methods.

### C1 Number systems
• The use and interpretation of number systems used in computer systems, including:
    o units of digital data (bit, byte, kilobyte and multiples of these)
    o binary
    o binary coded decimal (BCD).
• The use of binary arithmetic (including BCD) to perform calculations: addition, subtraction,
multiplication and division.
• The use of binary to represent negative and floating point numbers.

### C2 Text representation
• The purpose and implications of using codes to represent character sets.
• The features and uses of common character sets:
    o ASCII
    o UNICODE

### C3 Image representation
• How bitmap/raster image data is stored and represented in a computer system.
• The impact of image resolution on the way images are stored and represented.
• The impact of sample/bit depth on the way that image data is stored and images
are displayed.
• The effects of compression on image data.

## D How data is organised on computer systems
The characteristics and implications of methods of organising data in computer systems, and its
impact on computer processes.

### D1 Data structures
• The features, applications and implications of data types used in computer systems:
    o stack
    o queue
    o array
    o list.
• The use and application of data types in computer software.
• The use and implications of data types in computer hardware.

### D2 Indices and matrices
Matrix representation in computer systems:
• the relationship between matrices and arrays
• mathematical operations using matrices
• single, two- and multi-dimensional arrays
• row-major and column-major order.

## E How data is transmitted by computer systems
The concepts, processes and implications of data transmission in and between computer systems.
### E1 Transmitting data
• Types of communication channel:
    o simplex
    o half-duplex
    o full-duplex
    o point-to-point
    o multi-drop.
• Methods of connecting devices and transmitting data across and between
computer systems.
• The selection of connection methods to fulfil specified tasks and functions.
• Asynchronous and synchronous data transmission.
• Parallel and serial transmission.
• Use of packet data in transmitting data:
    o contents of a data packet
    o the role of components of a data packet
    o packet switching.
• Protocols used to govern and control data transmission.
• The features, applications and implications of encryption
    o simple encryption ciphers:
        – Caesar cipher
        – Vigenère cipher
    o encryption used in computer systems:
        – symmetric key encryption
        – public key encryption.
• Types of compression:
    o lossy
    o lossless.
• The applications and implications of data compression.

### E2 Error detection
• Methods used to detect errors in data transmission:
    o parity schemes
    o checksum
    o repetition schemes
    o cyclic redundancy check (CRC).
• The concepts, implications and applications of error detection.

### E3 Error correction
• Commonly-used error correction systems:
    o automatic repeat request (ARQ)
    o forward error correction (FEC).
• The concepts, implications and applications of error correction systems.

## F The use of logic and data flow in computer systems
The use, application and interpretation of logical processes and diagrams to represent data flow and
relationships in and between computer systems.

### F1 Boolean logic
• The use, application and interpretation of Boolean logic to identify data flow and
solve problems.
• The use, application and interpretation of Boolean logic to identify logical structures,
represent data flow and solve problems.

### F2 Flow charts and system diagrams
• The use, application and interpretation of flow charts and diagrams to represent data flow
in and between computer systems.
• The use, application and interpretation of flow charts and diagrams to solve problems.
