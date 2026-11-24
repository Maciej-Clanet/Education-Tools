import test from 'node:test'
import assert from 'node:assert/strict'
import { buildPacketJourney, DEFAULT_PACKET_MESSAGE, PACKET_CASES } from '../javascript/data/packet-journey-model.js'

test('the default journey keeps the three pieces used in the teaching sequence', () => {
  const { packets } = buildPacketJourney(DEFAULT_PACKET_MESSAGE)
  assert.deepEqual(packets.map(p => p.payload.trim()), ['MEET AT', 'THE GATE', 'AT FOUR'])
  assert.equal(packets.map(p => p.payload).join(''), DEFAULT_PACKET_MESSAGE)
})

test('every case preserves and reconstructs the exact message', () => {
  for (const text of ['Meet at the gate at four.', 'A', 'AB', '🌍 café — 你好', '  preserve spaces  ', '<script>hello</script>']) {
    for (const mode of PACKET_CASES) {
      const { packets, frames } = buildPacketJourney(text, mode)
      assert.equal(packets.map(p=>p.payload).join(''),text)
      assert.equal(frames.at(-1).message,text)
      assert.equal(frames.at(-1).complete,true)
      assert.equal(new Set(frames.at(-1).received).size,packets.length)
      assert.equal(frames[0].arrivals.length,0,'Earlier snapshots do not mutate')
    }
  }
})
test('reordering does not change the receiver positions', () => {
  const { frames } = buildPacketJourney('ABCDEFGHI','reorder')
  assert.deepEqual(frames[1].received,[3])
  assert.deepEqual(frames.at(-1).received,[3,1,2])
  assert.equal(frames.at(-1).message,'ABCDEFGHI')
})
test('loss and damaged data leave a gap until the retry succeeds', () => {
  for (const mode of ['loss','damage']) {
    const { frames } = buildPacketJourney('ABCDEFGHI',mode)
    assert.deepEqual(frames[3].received,[1,3])
    assert.equal(frames[3].complete,false)
    assert.equal(frames[3].message,'')
    assert.deepEqual(frames[4].received,[1,3],'Waiting alone cannot repair data')
    assert.equal(frames[2].arrivals[1].outcome,mode==='loss'?'lost':'rejected')
    assert.equal(frames.at(-1).arrivals.at(-1).outcome,'resent')
    assert.equal(frames.at(-1).message,'ABCDEFGHI')
  }
})
test('empty/invalid input and limits are safe', () => {
  for (const value of ['', '  ', null, {}]) assert.equal(buildPacketJourney(value).packets.length,0)
  assert.equal(Array.from(buildPacketJourney('🌍'.repeat(121)).frames.at(-1).message).length,120)
  assert.deepEqual(buildPacketJourney('abc','bad'),buildPacketJourney('abc','normal'))
})
