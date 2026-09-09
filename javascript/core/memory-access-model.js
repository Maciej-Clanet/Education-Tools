export const memoryWorkloads = {
  balanced: { instructions: 3, data: 3 },
  instructions: { instructions: 4, data: 0 },
  'data-heavy': { instructions: 2, data: 4 },
}

// Queues contain already-ready, independent transfers. Slots are not CPU cycles.
export function scheduleMemoryAccess(workload, architecture) {
  const slots = []
  let instruction = 0, data = 0
  let preferInstruction = true
  while (instruction < workload.instructions || data < workload.data) {
    const transfers = []
    if (architecture === 'harvard') {
      if (instruction < workload.instructions) transfers.push(`I${++instruction}`)
      if (data < workload.data) transfers.push(`D${++data}`)
    } else {
      if (instruction < workload.instructions && (preferInstruction || data >= workload.data)) transfers.push(`I${++instruction}`)
      else transfers.push(`D${++data}`)
      preferInstruction = !preferInstruction
    }
    slots.push(transfers)
  }
  return slots
}

export function nextMemoryLabState(state, action) {
  if (action.type === 'workload' && Object.hasOwn(memoryWorkloads, action.value)) return { workload: action.value, slot: 0 }
  if (action.type === 'reset') return { ...state, slot: 0 }
  const workload = memoryWorkloads[state.workload]
  const end = workload.instructions + workload.data
  if (action.type === 'step') return { ...state, slot: Math.min(end, state.slot + 1) }
  if (action.type === 'finish') return { ...state, slot: end }
  return state
}
