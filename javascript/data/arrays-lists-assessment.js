// Quiz version 2: fixed typed arrays, general lists and explicit implementations.
export const quizQuestions = [
  {
    question: 'A zero-based array contains [18, 7, 25, 9]. What does readings[2] return?',
    options: ['7', '25', '2'], answer: 1,
    feedback: 'Index 0 holds 18, index 1 holds 7, and index 2 holds 25. The index identifies a position; it is not the stored value.',
  },
  {
    question: 'A fixed-size array has six elements. A program replaces the value at index 3. What happens to its length?',
    options: ['It stays at six', 'It increases to seven', 'It becomes three'], answer: 0,
    feedback: 'Replacing an existing element changes its value, not the number of elements. Fixed size does not mean read-only.',
  },
  {
    question: 'Which indices are valid in a zero-based array of length 5?',
    options: ['1 to 5', '0 to 5', '0 to 4'], answer: 2,
    feedback: 'There are five positions: 0, 1, 2, 3 and 4. Index 5 is beyond the last element.',
  },
  {
    question: 'A user ID is displayed as 0042 and will never be used in arithmetic. Which data type best preserves it?',
    options: ['Integer', 'String', 'Boolean'], answer: 1,
    feedback: 'A string preserves the identifier, including its leading zeros. A whole-number value does not preserve the same textual formatting.',
  },
  {
    question: 'A typed array holds SensorReading records. Each record has a text name and a real-number temperature. Is that consistent with one element type?',
    options: ['Yes: each element is the same SensorReading record type', 'No: all fields in a record must have one type', 'Only if the records are stored in linked nodes'], answer: 0,
    feedback: 'The element type is SensorReading. A record can group fields of different types; that is separate from the collection’s storage layout.',
  },
  {
    question: 'A library provides a list that can grow and lets you read items by index. What can you conclude about its storage?',
    options: ['It must be a linked list', 'Its items must have different data types', 'Those features alone do not tell you: it could be array-backed'], answer: 2,
    feedback: 'List describes an ordered collection and its operations. A growable array is one common implementation; linked nodes are another.',
  },
  {
    question: 'An array-backed list has three items and capacity four. It appends one item. Must it allocate a bigger backing array now?',
    options: ['Yes, every append replaces the backing array', 'No, the fourth slot is already available', 'No, because the list is now linked'], answer: 1,
    feedback: 'Count becomes four while capacity stays four. Growth is needed when an addition exceeds the available capacity, not on every append.',
  },
  {
    question: 'In a singly linked list, only the head is initially known. How does the program find the third item?',
    options: ['Follow the next reference twice from the head', 'Calculate its location from the head plus two element widths', 'Read the third item without visiting another node'], answer: 0,
    feedback: 'It visits the first node, follows next to the second, then next to the third. The nodes do not need to occupy adjacent memory slots.',
  },
  {
    question: 'A linked list already has a reference to node A and will insert B immediately after it. Why can this avoid moving later items?',
    options: ['All the later values are deleted', 'Every list has spare adjacent slots', 'B can link to A’s old successor, then A can link to B'], answer: 2,
    feedback: 'Changing those references preserves the order without shifting later values. Finding A could take traversal if its reference were not already known.',
  },
  {
    question: 'A device stores exactly 24 hourly measurements and frequently reads a known hour’s position. Which model most directly suits this requirement?',
    options: ['A singly linked list because every read follows all links', 'A fixed-size array because the size is known and indexed access is useful', 'Any structure, because access patterns never matter'], answer: 1,
    feedback: 'A fixed-size array matches the known number of measurements and direct indexed access. The justification links the structure to the required operations.',
  },
]

export const examTasks = [
  {
    id: 'hourly-array-v2', title: 'An hourly monitoring display', marks: 4,
    prompt: 'A security dashboard stores 24 whole-number failed-login counts, one for each hour from 00:00 to 23:00. Explain why a fixed-size array is suitable. State the element type and the zero-based index for 17:00.',
    guidance: ['An integer stores a whole-number count.', 'The number of hourly slots is known: 24.', 'The program can read or update a particular hour directly by its index, without following earlier entries.', '17:00 is at index 17 because 00:00 is at index 0. Updating the count leaves the array length at 24.'],
  },
  {
    id: 'growing-results-v2', title: 'A changing results list', marks: 4,
    prompt: 'A file-search app discovers an unknown number of matching files. It appends each match and lets the user select a result by index. Explain why an array-backed list is a suitable choice, and what may happen when its backing array is full.',
    guidance: ['The list can grow as more matches are found; its logical count need not be fixed in advance.', 'An array-backed implementation supports direct indexed access to a selected result.', 'A full backing array may be replaced by a larger one and its entries copied, so some additions involve extra work.', 'Spare capacity uses memory. The app can usually use a library list rather than implement resizing itself.'],
  },
  {
    id: 'linked-insertion-v2', title: 'Explain a linked insertion', marks: 4,
    prompt: 'A singly linked list contains A → C → D. A program already has a reference to node A and inserts a new node B after it. Explain the link changes, one benefit compared with inserting into an array-backed list, and one cost of linked storage.',
    guidance: ['Set B’s next reference to C, then set A’s next reference to B. The resulting order is A → B → C → D.', 'C and D can remain in their existing locations; their entries do not need to shift to make a gap.', 'Each node needs storage for a next reference as well as its value.', 'Access by position requires following links. If A were not already known, locating it could also take traversal.'],
  },
]

export const glossary = [
  ['Array', 'In our main model, a fixed number of elements of one type, stored in adjacent equal-width slots and accessed by index.'],
  ['Element', 'One item in a collection.'],
  ['Index', 'A position used to identify an element. These examples count from zero.'],
  ['Data type', 'Defines the kind of value and the operations allowed on it.'],
  ['Record', 'A group of named fields, which can have different data types.'],
  ['List', 'An ordered collection. Our list model supports adding and removing items; the storage implementation can vary.'],
  ['Array-backed list', 'A list that keeps its entries in an underlying array, replacing that array when more capacity is needed.'],
  ['Count / length', 'The number of elements currently in a collection.'],
  ['Capacity', 'The number of entries the current storage can hold before it needs to grow.'],
  ['Linked list', 'A list implemented using nodes connected by references.'],
  ['Node', 'A value or reference to an item, together with link information.'],
  ['Head', 'A reference to the first node in a linked list.'],
  ['Next reference', 'A link identifying the next node; an empty reference marks the end in this example.'],
  ['Traversal', 'Visiting nodes in sequence by following their links.'],
]
