// Teaching models. The floating point format is explicitly defined by the lesson.
export function twosFrames(magnitude = 5) {
  if (!Number.isInteger(magnitude) || magnitude < 1 || magnitude > 128) throw new RangeError('Use a magnitude from 1 to 128.')
  const original = magnitude.toString(2).padStart(8, '0')
  const bits = [...original].map(bit => bit === '0' ? '1' : '0')
  const frames = [
    { bits: original, changed: [], carry: -1, title: `Write ${magnitude} in eight bits.`, detail: 'Keep all eight positions, including the zeros on the left.' },
    { bits: bits.join(''), changed: [0,1,2,3,4,5,6,7], carry: -1, title: 'Invert every bit.', detail: 'Invert means change each 0 to 1 and each 1 to 0.' },
    { bits: bits.join(''), changed: [], carry: -1, title: 'Add the fixed value 00000001.', detail: 'The inverted bits are the first number. The second number is always 1.' },
  ]
  for (let index = 7; index >= 0; index -= 1) {
    const carry = bits[index] === '1'
    bits[index] = carry ? '0' : '1'
    frames.push({ bits: bits.join(''), changed: [index], carry: carry ? index - 1 : -1,
      title: carry ? '1 + 1 = 10: write 0 and carry 1.' : '0 + 1 = 1: write 1 and stop.',
      detail: carry ? 'The carry moves one column to the left.' : `The result is ${bits.join('')}. This is −${magnitude} in eight-bit two's complement.` })
    if (!carry) break
  }
  return { original, frames }
}

export function pointFrames(kind) {
  if (kind === 'scale') return [1,2,3].map((point, index) => ({
    digits: '1010', point, mantissa: `${'1010'.slice(0,point)}.${'1010'.slice(point)}`,
    value: 1.25 * 2 ** index, exponent: index,
    title: index === 0 ? 'Start with a measurement of 1.25.' : `Multiply by 2: ${1.25 * 2 ** (index-1)} × 2 = ${1.25 * 2 ** index}.`,
    detail: index === 0 ? 'The binary value is 1.01. The extra zero does not change it.' : 'The point moves one place right. The value doubles.',
  }))
  const small = kind === 'small'
  const decode = kind === 'decode'
  const digits = small ? '0001101' : '110101'
  const start = small || decode ? 1 : 4
  const end = small || decode ? 4 : 1
  const direction = end > start ? 1 : -1
  const value = small ? 0.203125 : 13.25
  const frames = []
  for (let point = start; direction > 0 ? point <= end : point >= end; point += direction) {
    const exponent = small ? 1 - point : 4 - point
    const raw = `${digits.slice(0, point)}.${digits.slice(point) || '0'}`
    const mantissa = raw.replace(/^0+(?=\d)/, '')
    frames.push({ digits, point, exponent, mantissa, value,
      title: point === start ? (decode ? 'Start with the stored parts.' : 'Start with the original binary value.') : `Move the point one place ${direction < 0 ? 'left' : 'right'}.`,
      detail: point === start ? 'The denary value stays the same throughout.' : decode
        ? 'Multiply the mantissa by 2. Reduce the remaining exponent by 1.'
        : small ? 'The mantissa doubles. Reduce the exponent by 1 to keep the same value.'
          : 'The mantissa halves. Increase the exponent by 1 to keep the same value.',
    })
  }
  frames.at(-1).detail = small
    ? 'Ignore the zeros before the first 1. The result is 1.101 × 2⁻³. The value is positive.'
    : decode ? '1101.01 in binary is 13.25 in denary. The remaining multiplier is 2⁰ = 1.'
      : 'The result is 1.10101 × 2³. Multiplication by 8 restores the original value.'
  return frames
}

export function fractionTask(numerator) {
  if (!Number.isInteger(numerator) || numerator < 1 || numerator > 127 || numerator % 8 === 0) throw new RangeError('Use a non-whole eighth from 1/8 to 127/8.')
  const bits = numerator.toString(2).padStart(7, '0')
  return { numerator, bits, binary: `${bits.slice(0,4)}.${bits.slice(4)}`, answer: numerator / 8,
    terms: [...bits].flatMap((bit,index) => bit === '1' ? [2 ** (3-index)] : []) }
}

export function nextFractionTask(previous, random = Math.random) {
  const choices = Array.from({length:127},(_,index)=>index+1).filter(value=>value%8!==0 && value!==previous)
  return fractionTask(choices[Math.min(choices.length-1, Math.floor(random() * choices.length))])
}

export function checkFractionAnswer(task, answer) {
  const text = String(answer).trim()
  if (!/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(text)) return { correct:false, message:'Enter a denary number, such as 2.625.' }
  if (Number(text) === task.answer) return { correct:true, message:`Correct. ${task.terms.join(' + ')} = ${task.answer}.` }
  return { correct:false, message:'Check the places with a 1. Add the whole-number values and the fraction values.' }
}

export function floatAllocation(exponentBits) {
  if (!Number.isInteger(exponentBits) || exponentBits < 2 || exponentBits > 5) throw new RangeError('Use 2 to 5 exponent bits.')
  const mantissaBits = 9 - exponentBits
  return { exponentBits, mantissaBits, minExponent: -(2 ** (exponentBits - 1)),
    maxExponent: 2 ** (exponentBits - 1) - 1, gap: 2 ** -(mantissaBits - 1) }
}
