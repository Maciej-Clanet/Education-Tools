const ready = { focus: '', transfer: 'none', signal: 'Ready', working: 'Working storage', output: 'Result' }
export const architectureFrames = {
  shared: [
    { ...ready, mode: 'von', description: 'Ready: instructions and data are in the same memory system.' },
    { ...ready, mode: 'von', transfer: 'instruction', signal: 'I · instruction → CPU', description: 'Instruction fetch: the highlighted shared path carries an instruction from memory to the CPU.' },
    { ...ready, mode: 'von', transfer: 'data', signal: 'D · value → CPU', description: 'Data access: the same highlighted path now carries a value. Both kinds of transfer use this route.' },
  ],
  program: [
    { ...ready, mode: 'von', description: 'Ready: memory holds LOAD A, ADD B, OUTPUT and values A = 5, B = 3.' },
    { ...ready, mode: 'von', focus: 'cu', transfer: 'instruction', signal: 'I · LOAD A', description: 'Fetch LOAD A from shared memory. The Control Unit interprets the instruction: obtain the value at A.' },
    { ...ready, mode: 'von', focus: 'registers', transfer: 'data', signal: 'D · A = 5', working: 'Working value: 5', description: 'Read A = 5 through the same shared path and hold the value in CPU working storage.' },
    { ...ready, mode: 'von', focus: 'cu', transfer: 'instruction', signal: 'I · ADD B', working: 'Working value: 5', description: 'Fetch ADD B through the shared path. The processor now knows it needs the value at B.' },
    { ...ready, mode: 'von', focus: 'registers', transfer: 'data', signal: 'D · B = 3', working: 'Values ready: 5 and 3', description: 'Read B = 3 through the shared path. Both operands are now available inside the CPU.' },
    { ...ready, mode: 'von', focus: 'alu', working: 'Result held: 8', signal: 'ALU: 5 + 3 = 8', description: 'The ALU adds 5 and 3, producing 8. This is processing inside the CPU, not another memory transfer.' },
    { ...ready, mode: 'von', focus: 'cu', transfer: 'instruction', signal: 'I · OUTPUT', working: 'Result held: 8', description: 'Fetch OUTPUT through the shared path. It directs the system to present the result.' },
    { ...ready, mode: 'von', transfer: 'output', signal: 'Result → output', working: 'Result held: 8', output: '8', description: 'Send 8 to output. The program is complete; the memory still contains instructions and data.' },
  ],
  split: [
    { ...ready, mode: 'von', description: 'Start here: one shared instruction/data memory and one shared CPU–memory path.' },
    { ...ready, mode: 'harvard', focus: 'memory', description: 'Separate the instruction and data memories and give each its own path. The CPU, input and output remain in place. What could this allow?' },
  ],
  concurrent: [
    { ...ready, mode: 'harvard', description: 'Ready: a forthcoming instruction fetch and a data access for an already-decoded instruction can use separate paths.' },
    { ...ready, mode: 'harvard', transfer: 'both', signal: 'I and D · independent', description: 'Both highlighted paths can carry their independent transfers together: instruction memory to CPU and data memory to CPU. This does not imply two instructions execute simultaneously.' },
  ],
}
architectureFrames.compare = {
  von: [
    { ...ready, mode: 'von', description: 'Von Neumann ready: an instruction fetch and an independent data transfer both need the shared path.' },
    { ...ready, mode: 'von', transfer: 'instruction', signal: 'I moves · D waits', description: 'The instruction fetch uses the highlighted shared path. The data request waits for that path to become available.' },
    { ...ready, mode: 'von', transfer: 'data', signal: 'D uses same path', description: 'The data transfer now uses the same path. Both transfers are complete; the structure was shared throughout.' },
  ],
  harvard: architectureFrames.concurrent,
}
