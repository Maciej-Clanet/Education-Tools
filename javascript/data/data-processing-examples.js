export const bookingRules = {
  name: { kind: 'presence', pass: 'A name has been entered.', fail: 'Enter a student name.' },
  age: { kind: 'range', minimum: 16, maximum: 18, pass: 'Within 16–18 inclusive.', fail: 'Enter an age from 16 to 18.' },
  tickets: { kind: 'integer', pass: 'The quantity is a whole number.', fail: 'Enter a whole number, such as 2.' },
  studentId: { kind: 'format', pattern: '^ST-[0-9]{3}$', pass: 'Matches ST- and three digits.', fail: 'Use ST- and three digits, such as ST-204.' },
}

export const correctedBooking = { name: 'Alex', age: '17', tickets: '2', studentId: 'ST-204' }

export const arrivalRecords = [
  { name: 'Zara', time: '09:05', score: 84 },
  { name: 'Amir', time: '09:10', score: 72 },
  { name: 'Mei', time: '08:55', score: 91 },
]
