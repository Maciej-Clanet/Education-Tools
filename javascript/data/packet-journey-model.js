// A classroom model: three labelled pieces and a simple reliable-delivery rule.
// This is not an IP/TCP header layout, checksum algorithm or network timing model.
export const DEFAULT_PACKET_MESSAGE = 'MEET AT THE GATE AT FOUR'
export const PACKET_CASES = ['normal', 'reorder', 'loss', 'damage']

export function buildPacketJourney(message, scenario = 'normal') {
  const text = typeof message === 'string' ? Array.from(message).slice(0, 120).join('') : ''
  if (!text.trim()) return { packets: [], frames: [{ received: [], arrivals: [], complete: false, message: '', status: 'Enter a message to prepare the packets.' }] }
  const characters = Array.from(text)
  const size = Math.ceil(characters.length / 3)
  const packets = []
  for (let i = 0; i < characters.length; i += size) packets.push({ id: packets.length + 1, payload: characters.slice(i, i + size).join('') })
  const ids = packets.map(p => p.id)
  const caseKey = PACKET_CASES.includes(scenario) ? scenario : 'normal'
  const problemId = Math.min(2, packets.length)
  const order = caseKey === 'reorder' && ids.length > 1 ? [ids.at(-1), ...ids.slice(0, -1)] : ids
  let received = [], arrivals = []
  const frames = []
  const snapshot = status => {
    const complete = received.length === packets.length
    frames.push({ received: [...received], arrivals: arrivals.map(a => ({ ...a })), complete,
      message: complete ? packets.map(p => p.payload).join('') : '', status })
  }
  snapshot(`${packets.length} ${packets.length === 1 ? 'packet' : 'packets'} prepared. Nothing has arrived yet.`)
  for (const id of order) {
    if (id === problemId && ['loss', 'damage'].includes(caseKey)) {
      arrivals.push({ id, outcome: caseKey === 'loss' ? 'lost' : 'rejected' })
      snapshot(caseKey === 'loss' ? `Packet ${id} is lost. The receiver has no copy of it.` : `Packet ${id} arrives with changed data. The check fails, so the receiver rejects it.`)
    } else {
      received.push(id)
      arrivals.push({ id, outcome: 'accepted' })
      snapshot(`Packet ${id} accepted. ${received.length === packets.length ? 'All pieces are ready. The receiver can rebuild the message.' : 'The receiver stores it in its numbered position.'}`)
    }
  }
  if (['loss', 'damage'].includes(caseKey)) {
    snapshot(`The sender has no confirmation for packet ${problemId}. After waiting, it will send that data again.`)
    received.push(problemId)
    arrivals.push({ id: problemId, outcome: 'resent' })
    snapshot(`Packet ${problemId} is sent again and accepted. All pieces are now ready.`)
  }
  return { packets, frames }
}
