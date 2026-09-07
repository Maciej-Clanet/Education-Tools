// Reference attempts for content QA. Not imported by the site or used to mark students.
// Repairs intentionally leave the authored starter intact outside the faulty parts.
export const javascriptChallengeSolutions = {
  'js-console-variables': {
    repairs: [['playername', 'playerName'], ['"Score:", "score"', '"Score:", score']],
    output: ['Player: Alex', 'Score: 10'],
    variants: [{ replace: ['score = 10', 'score = 15'], output: ['Player: Alex', 'Score: 15'] }],
  },
  'js-console-syntax': {
    repairs: [['"Welcome to coding);', '"Welcome to coding");'], ['"Ready to run";', '"Ready to run");']],
    output: ['Welcome to coding', 'Ready to run'],
  },
  'js-variable-reassignment': {
    repairs: [['const score = "10"', 'let score = 10'], ['score = "15"', 'score = 15']],
    output: ['10', '15'],
  },
  'js-variable-profile': {
    code: 'const memberName = "Sam"; const age = 16; const isMember = true; let points = 0; console.log(points); points = 5; console.log(points); let nextSession; const chosenProject = null; console.log(memberName); console.log(age); console.log(isMember); console.log(nextSession); console.log(chosenProject); console.log(typeof memberName); console.log(typeof age); console.log(typeof isMember);',
    output: ['0', '5', 'Sam', '16', 'true', 'undefined', 'null', 'string', 'number', 'boolean'],
  },
  'js-string-message': {
    repairs: [['"Hello" +', '"Hello " +'], ['"Hello ${memberName}!"', '`Hello ${memberName}!`']],
    output: ['Hello Sam!', 'Hello Sam!'],
    variants: [{ replace: ['"Sam"', '"Jo"'], output: ['Hello Jo!', 'Hello Jo!'] }],
  },
  'js-string-label': {
    code: 'const creator = "Asha"; const project = "Space Quiz"; const language = "JavaScript"; console.log(creator + " built " + project + " using " + language + "."); console.log(`${creator} built ${project} using ${language}.`);',
    output: ['Asha built Space Quiz using JavaScript.', 'Asha built Space Quiz using JavaScript.'],
    variants: [{ replace: ['"Space Quiz"', '"Word Game"'], output: ['Asha built Word Game using JavaScript.', 'Asha built Word Game using JavaScript.'] }],
  },
  'js-expression-average': {
    repairs: [['prompt("First score:")', 'Number(prompt("First score:"))'], ['firstScore + secondScore / 2', '(firstScore + secondScore) / 2']],
    input: '12',
    output: ['10'],
    variants: [{ replace: ['secondScore = 8', 'secondScore = 4'], input: '6', output: ['5'] }, { input: 'hello', output: ['NaN'] }],
  },
  'js-expression-receipt': {
    code: 'const price = 3; const quantity = 4; const paid = 20; const total = price * quantity; const change = paid - total; console.log(`Total: £${total}`); console.log(`Change: £${change}`);',
    output: ['Total: £12', 'Change: £8'],
    variants: [{ replace: ['quantity = 4', 'quantity = 2'], output: ['Total: £6', 'Change: £14'] }],
  },
  'js-expression-remainder': {
    code: 'const counters = 23; const groupSize = 5; const leftovers = counters % groupSize; const needed = groupSize - leftovers; console.log(leftovers); console.log(needed); console.log((counters + needed) / groupSize);',
    output: ['3', '2', '5'],
    variants: [{ replace: ['counters = 23; const groupSize = 5', 'counters = 17; const groupSize = 4'], output: ['1', '3', '5'] }],
  },
  'js-logic-entry': {
    repairs: [['age > 16 || hasPass', 'age >= 16 && hasPass'], ['role !== "student"', 'role === "student"'], ['role === "teacher"', 'role !== "teacher"']],
    output: ['false', 'true', 'true'],
    variants: [
      { replace: ['hasPass = false', 'hasPass = true'], output: ['true', 'true', 'true'] },
      { replace: ['age = 16;\nconst hasPass = false', 'age = 15;\nconst hasPass = true'], output: ['false', 'true', 'true'] },
    ],
  },
  'js-logic-discount': {
    code: 'const age = 17; const isStudent = true; const isSuspended = false; const discount = (age <= 18 || isStudent) && !isSuspended; console.log(discount); console.log(age > 18);',
    output: ['true', 'false'],
    variants: [
      { replace: ['age = 17; const isStudent = true', 'age = 25; const isStudent = false'], output: ['false', 'true'] },
      { replace: ['age = 17', 'age = 25'], output: ['true', 'true'] },
      { replace: ['isSuspended = false', 'isSuspended = true'], output: ['false', 'false'] },
    ],
  },
  'js-if-grades': {
    repairs: [['score > 50', 'score >= 80'], ['"Pass"', '"Distinction"'], ['score > 80', 'score >= 50'], ['console.log("Distinction");\n} else {', 'console.log("Pass");\n} else {']],
    output: ['Distinction'],
    variants: [80, 79, 50, 49].map(score => ({ replace: ['score = 85', `score = ${score}`], output: [score >= 80 ? 'Distinction' : score >= 50 ? 'Pass' : 'Retry'] })),
  },
  'js-if-delivery': {
    code: 'const orderTotal = 25; const isMember = true; if (orderTotal < 0) { console.log("Invalid total"); } else if (orderTotal >= 30 || isMember) { console.log("Free delivery"); } else { console.log("Delivery: £4"); }',
    output: ['Free delivery'],
    variants: [
      { replace: ['isMember = true', 'isMember = false'], output: ['Delivery: £4'] },
      { replace: ['orderTotal = 25; const isMember = true', 'orderTotal = 30; const isMember = false'], output: ['Free delivery'] },
      { replace: ['orderTotal = 25', 'orderTotal = -1'], output: ['Invalid total'] },
      { replace: ['orderTotal = 25; const isMember = true', 'orderTotal = 0; const isMember = false'], output: ['Delivery: £4'] },
    ],
  },
  'js-array-indexes': {
    repairs: [['console.log(team[1])', 'console.log(team[0])'], ['team[team.length]', 'team[team.length - 1]'], ['team[3] =', 'team[1] =']],
    output: ['Asha', 'Leo', '3'],
  },
  'js-array-kit': {
    code: 'const kit = ["pen", "ruler", "tape"]; kit[1] = "pencil"; kit.push("scissors"); const removed = kit.pop(); console.log(removed); console.log(kit[0]); console.log(kit[1]); console.log(kit.length);',
    output: ['scissors', 'pen', 'pencil', '3'],
  },
  'js-loop-countdown': {
    repairs: [['count++', 'count--']], output: ['5', '4', '3', '2', '1', 'Go!'],
    variants: [{ replace: ['count = 5', 'count = 3'], output: ['3', '2', '1', 'Go!'] }],
  },
  'js-loop-table': {
    code: 'const table = 3; for (let counter = 1; counter <= 5; counter++) { console.log(`${table} x ${counter} = ${table * counter}`); }',
    output: ['3 x 1 = 3', '3 x 2 = 6', '3 x 3 = 9', '3 x 4 = 12', '3 x 5 = 15'],
    variants: [{ replace: ['table = 3', 'table = 4'], output: ['4 x 1 = 4', '4 x 2 = 8', '4 x 3 = 12', '4 x 4 = 16', '4 x 5 = 20'] }],
  },
  'js-while-charge': {
    repairs: [['charge <= 100', 'charge < 100'], ['charge + 20', 'charge += 20']], output: ['40', '60', '80', '100'],
    variants: [{ replace: ['charge = 20', 'charge = 100'], output: [] }],
  },
  'js-array-loop-total': {
    repairs: [['let i = 1', 'let i = 0'], ['i <= scores.length', 'i < scores.length']], output: ['14'],
    variants: [{ replace: ['[4, 7, 3]', '[]'], output: ['0'] }, { replace: ['[4, 7, 3]', '[9]'], output: ['9'] }],
  },
  'js-array-loop-passes': {
    code: 'const scores = [35, 50, 80, 45]; let total = 0; let passes = 0; for (const score of scores) { total += score; if (score >= 50) { passes++; } } console.log(`Total: ${total}`); console.log(`Passes: ${passes}`);',
    output: ['Total: 210', 'Passes: 2'],
    variants: [{ replace: ['[35, 50, 80, 45]', '[50]'], output: ['Total: 50', 'Passes: 1'] }, { replace: ['[35, 50, 80, 45]', '[]'], output: ['Total: 0', 'Passes: 0'] }],
  },
  'js-function-call': {
    repairs: [['greet(Asha)', 'greet("Asha")'], ['greet;', 'greet("Ben");']], output: ['Hello Asha', 'Hello Ben'],
  },
  'js-function-badges': {
    code: 'function printBadge(name, role) { console.log(`${name} — ${role}`); } printBadge("Asha", "Designer"); printBadge("Ben", "Tester");',
    output: ['Asha — Designer', 'Ben — Tester'],
  },
  'js-return-total': {
    repairs: [['console.log(unitPrice * quantity);', 'return unitPrice * quantity;']], output: ['14'],
    variants: [{ replace: ['calculateTotal(3, 4)', 'calculateTotal(5, 2)'], output: ['12'] }],
  },
  'js-return-area': {
    code: 'function rectangleArea(width, height) { return width * height; } const first = rectangleArea(4, 3); const second = rectangleArea(5, 2); console.log(first + second);',
    output: ['22'],
    variants: [{ append: 'console.log(rectangleArea(0, 8)); console.log(rectangleArea(2, 7));', output: ['22', '0', '14'] }],
  },
  'js-scope-message': {
    repairs: [['if (isMember)', 'let message;\n  if (isMember)'], ['const message = "Welcome"', 'message = "Welcome"'], ['const message = "Join first"', 'message = "Join first"']],
    output: ['Welcome'], variants: [{ append: 'console.log(makeMessage(false)); console.log(makeMessage(true));', output: ['Welcome', 'Join first', 'Welcome'] }],
  },
  'js-scope-points': {
    code: 'const points = 10; function addBonus(points) { const bonus = 5; return points + bonus; } console.log(addBonus(points)); console.log(points);',
    output: ['15', '10'], variants: [{ append: 'console.log(addBonus(20)); console.log(points);', output: ['15', '10', '25', '10'] }],
  },
  'js-object-properties': {
    repairs: [['product.Name', 'product.name'], ['product.key', 'product[key]'], ['product.Stock', 'product.stock']], output: ['Notebook', '4', '3'],
  },
  'js-object-player': {
    code: 'const player = { name: "Jo", score: 10, active: true }; player.score += 5; const field = "name"; console.log(player[field]); console.log(player.score); console.log(player.active);',
    output: ['Jo', '15', 'true'], variants: [{ replace: ['field = "name"', 'field = "score"'], output: ['15', '15', 'true'] }],
  },
  'js-nested-roster': {
    repairs: [['students.address.city', 'students[0].address.city'], ['students.name', 'student.name'], ['student.scores[1]', 'student.scores[0]']], output: ['Leeds', 'Asha: 8', 'Ben: 6'],
  },
  'js-nested-basket': {
    code: 'const basket = [{ product: { name: "Pen", price: 2 }, quantity: 3 }, { product: { name: "Pad", price: 4 }, quantity: 2 }]; let total = 0; for (const item of basket) { const lineTotal = item.product.price * item.quantity; total += lineTotal; console.log(`${item.product.name}: £${lineTotal}`); } console.log(`Total: £${total}`);',
    output: ['Pen: £6', 'Pad: £8', 'Total: £14'],
    variants: [
      { replace: ['[{ product: { name: "Pen", price: 2 }, quantity: 3 }, { product: { name: "Pad", price: 4 }, quantity: 2 }]', '[]'], output: ['Total: £0'] },
      { replace: ['quantity: 3', 'quantity: 0'], output: ['Pen: £0', 'Pad: £8', 'Total: £8'] },
    ],
  },
  'js-debug-syntax': {
    repairs: [['price: 2\n', 'price: 2,\n']], output: ['Total: £6'],
    variants: [{ replace: ['quantity: 3', 'quantity: 4'], output: ['Total: £8'] }],
  },
  'js-debug-runtime': {
    repairs: [['students[1]', 'students[0]']], output: ['Starting report', 'Asha', 'Finished report'],
    variants: [{ replace: ['"Asha"', '"Jo"'], output: ['Starting report', 'Jo', 'Finished report'] }],
  },
  'js-debug-logic': {
    repairs: [['score > 50', 'score >= 50']], output: ['2'],
    variants: [{ replace: ['[50, 80, 20]', '[50]'], output: ['1'] }, { replace: ['[50, 80, 20]', '[49]'], output: ['0'] }, { replace: ['[50, 80, 20]', '[]'], output: ['0'] }],
  },
  'js-debug-test-cases': {
    code: 'function isPassing(score) { return score >= 50; } console.log(`49: ${isPassing(49) === false}`); console.log(`50: ${isPassing(50) === true}`); console.log(`51: ${isPassing(51) === true}`);',
    output: ['49: true', '50: true', '51: true'],
    variants: [{ replace: ['score >= 50', 'score > 50'], output: ['49: true', '50: false', '51: true'] }],
  },
  'js-project-library': {
    code: 'const books = [{ title: "Orbit", available: true }, { title: "River", available: false }, { title: "Cloud", available: true }]; function status(available) { if (available) { return "Available"; } return "On loan"; } let availableBooks = 0; for (const book of books) { console.log(`${book.title}: ${status(book.available)}`); if (book.available) { availableBooks++; } } console.log(`Total books: ${books.length}`); console.log(`Available books: ${availableBooks}`);',
    output: ['Orbit: Available', 'River: On loan', 'Cloud: Available', 'Total books: 3', 'Available books: 2'],
    variants: [
      { replace: ['title: "River", available: false', 'title: "River", available: true'], output: ['Orbit: Available', 'River: Available', 'Cloud: Available', 'Total books: 3', 'Available books: 3'] },
      { replace: ['[{ title: "Orbit", available: true }, { title: "River", available: false }, { title: "Cloud", available: true }]', '[]'], output: ['Total books: 0', 'Available books: 0'] },
    ],
  },
  'js-project-results': {
    code: 'const students = [{ name: "Asha", scores: [8, 10] }, { name: "Ben", scores: [4, 6] }, { name: "Jo", scores: [] }]; function average(scores) { let total = 0; for (const score of scores) { total += score; } return total / scores.length; } let passed = 0; for (const student of students) { if (student.scores.length === 0) { console.log(`${student.name}: No scores`); } else { const mean = average(student.scores); let result = "Retry"; if (mean >= 6) { result = "Pass"; passed++; } console.log(`${student.name}: ${mean} - ${result}`); } } console.log(`Passed: ${passed}`);',
    output: ['Asha: 9 - Pass', 'Ben: 5 - Retry', 'Jo: No scores', 'Passed: 1'],
    variants: [
      { replace: ['[4, 6]', '[6, 6]'], output: ['Asha: 9 - Pass', 'Ben: 6 - Pass', 'Jo: No scores', 'Passed: 2'] },
      { replace: ['[{ name: "Asha", scores: [8, 10] }, { name: "Ben", scores: [4, 6] }, { name: "Jo", scores: [] }]', '[]'], output: ['Passed: 0'] },
    ],
  },
  'js-project-stock-repair': {
    repairs: [['i <= items.length', 'i < items.length'], ['total = items[i].price + items[i].stock', 'total += items[i].price * items[i].stock'], ['console.log(total);', 'return total;']],
    output: ['Stock value: £14'],
    variants: [{ replace: ['stockValue(products)', 'stockValue([])'], output: ['Stock value: £0'] }, { replace: ['stock: 3', 'stock: 0'], output: ['Stock value: £8'] }],
  },
}
