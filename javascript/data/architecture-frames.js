const base = { mode: 'von', instruction: 'Not fetched yet', working: 'No values yet', output: '—', transfers: [], active: [], requests: { instruction: 'Waiting', data: 'Waiting' } }

export const architectureFrames = {
  program: [
    { ...base, title: 'The program and its numbers are ready', description: 'The goal is to add 5 and 3, then display the total.' },
    { ...base, title: 'Fetch an instruction', description: 'The processor receives “Read the first number”.', instruction: 'Read the first number', transfers: [{ kind: 'instruction', text: 'Read first number', lane: 'shared' }], active: ['read'] },
    { ...base, title: 'Read the data', description: 'The same pathway now carries the value 5 into the processor.', instruction: 'Read the first number', working: '5', transfers: [{ kind: 'data', text: '5', lane: 'shared' }], active: ['five'] },
    { ...base, title: 'Fetch the next instruction', description: '“Add the next number” travels along that shared pathway.', instruction: 'Add the next number', working: '5', transfers: [{ kind: 'instruction', text: 'Add next number', lane: 'shared' }], active: ['add'] },
    { ...base, title: 'Read the next value', description: 'The value 3 follows. The processor now has both numbers.', instruction: 'Add the next number', working: '5 and 3', transfers: [{ kind: 'data', text: '3', lane: 'shared' }], active: ['three'] },
    { ...base, title: 'Carry out the addition', description: 'The ALU adds the values inside the processor.', instruction: 'Add the next number', working: '5 + 3 = 8', active: ['alu'] },
    { ...base, title: 'Fetch the final instruction', description: 'The processor receives “Show the total”.', instruction: 'Show the total', working: '8', transfers: [{ kind: 'instruction', text: 'Show total', lane: 'shared' }], active: ['show'] },
    { ...base, title: 'Show the result', description: 'The output is 8. Both instructions and values used the shared pathway.', instruction: 'Show the total', working: '8', output: '8', active: ['output'] },
  ],
  shared: [
    { ...base, title: 'Two requests need the same route', description: 'The processor needs a next instruction and data for its current instruction.', instruction: 'Next instruction needed', working: 'Current data needed' },
    { ...base, title: 'The instruction uses the shared path', description: 'The data request waits while this route carries the instruction.', instruction: 'Next instruction received', working: 'Data still waiting', transfers: [{ kind: 'instruction', text: 'Next instruction', lane: 'shared' }], active: ['instruction'], requests: { instruction: 'Using path', data: 'Waiting' } },
    { ...base, title: 'Now the data can use the path', description: 'The data travels after the instruction; the two requests competed for access.', instruction: 'Next instruction received', working: 'Data received', transfers: [{ kind: 'data', text: 'Current data', lane: 'shared' }], active: ['data'], requests: { instruction: 'Received', data: 'Using path' } },
    { ...base, title: 'Both requests have been served', description: 'A faster processor can still be held back by limited memory-transfer capacity.', instruction: 'Next instruction received', working: 'Data received', requests: { instruction: 'Received', data: 'Received' } },
  ],
  concurrent: [
    { ...base, mode: 'harvard', title: 'Two requests, two routes', description: 'A next instruction and data for the current instruction are ready to transfer.', instruction: 'Next instruction needed', working: 'Current data needed' },
    { ...base, mode: 'harvard', title: 'Instruction and data can travel together', description: 'Each transfer uses its own pathway to the same processor.', instruction: 'Next instruction received', working: 'Current data received', transfers: [{ kind: 'instruction', text: 'Next instruction', lane: 'instruction' }, { kind: 'data', text: 'Current data', lane: 'data' }], active: ['instruction', 'data'], requests: { instruction: 'Using own path', data: 'Using own path' } },
    { ...base, mode: 'harvard', title: 'Less competition for the pathway', description: 'This can reduce waiting when useful instruction and data accesses overlap.', instruction: 'Next instruction received', working: 'Current data received', requests: { instruction: 'Received', data: 'Received' } },
  ],
}
