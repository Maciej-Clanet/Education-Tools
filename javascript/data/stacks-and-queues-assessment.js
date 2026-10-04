// First-teaching assessment, 4 October 2026. Quiz v2: 10 questions, pass score 8.
// Questions use abstract operations; no programming-language syntax is assumed.
export const quizQuestions = [
  {
    question: 'An empty stack receives push(A), push(B), pop(), then push(C). What does the next pop() return?',
    options: ['A', 'C', 'B'],
    answer: 1,
    feedback: 'The first pop removes B. Pushing C then places C above A, so the next pop returns C: last in, first out.',
  },
  {
    question: 'A stack contains A at the bottom and B at the top. What does peek() do?',
    options: ['Returns B and leaves both items in the stack', 'Returns B and removes it', 'Returns A and leaves both items in the stack'],
    answer: 0,
    feedback: 'Peek reads the top item without removing it. B remains on top and the stack still contains two items.',
  },
  {
    question: 'A simple drawing app records Add circle, Move circle, then Recolour circle. Why does a stack suit its Undo feature?',
    options: ['It reverses the oldest action first', 'It chooses whichever action took longest', 'It makes the most recent recorded action available first'],
    answer: 2,
    feedback: 'Undo reverses Recolour circle first, then Move circle. A stack gives access to recent actions in reverse order; the app must still store enough information to reverse each action.',
  },
  {
    question: 'In a simple sequence, openFile calls checkFile, which calls readHeader. readHeader finishes normally. Which function resumes next?',
    options: ['openFile, because it started first', 'checkFile, because it directly called readHeader', 'readHeader starts again automatically'],
    answer: 1,
    feedback: 'The readHeader frame is removed when that call returns. Its caller, checkFile, resumes; openFile is still waiting below it.',
  },
  {
    question: 'An empty FIFO queue receives enqueue(A), enqueue(B), dequeue(), then enqueue(C). What does the next dequeue() return?',
    options: ['C', 'A', 'B'],
    answer: 2,
    feedback: 'The first dequeue removes A. B is now the oldest waiting item, and C joins behind it, so the next dequeue returns B.',
  },
  {
    question: 'Files keep joining a scan queue faster than the worker can scan them. What happens if no limit or other action changes this?',
    options: ['The backlog and waiting time grow', 'The queue makes the worker scan each file faster', 'FIFO changes automatically into LIFO'],
    answer: 0,
    feedback: 'A queue can absorb a short burst, but it does not increase the worker’s scanning rate. Sustained excess arrivals grow the backlog and consume storage.',
  },
  {
    question: 'A queue is empty. This teaching model reports an empty result instead of waiting. What should dequeue() do?',
    options: ['Return the value 0 as a real item', 'Report that no item is available and leave the queue empty', 'Return the last item that was removed earlier'],
    answer: 1,
    feedback: 'There is no front item to remove. The empty case must be handled explicitly; it must not invent an item or change the collection.',
  },
  {
    question: 'A stack has a fixed capacity of three items and already contains A, B and C. Its stated policy rejects additions when full. What happens on push(D)?',
    options: ['The stack stores four items despite its fixed capacity', 'A is silently overwritten', 'The push is rejected and A, B and C remain'],
    answer: 2,
    feedback: 'This stack has no free slot, so its stated full policy rejects D without changing existing items. Other systems may use different capacity policies; those must be specified.',
  },
  {
    question: 'Two workers take A then B from a FIFO queue. B is a much shorter job and finishes first. Has this alone broken the FIFO removal rule?',
    options: ['No: removal order and completion order are different', 'Yes: FIFO requires every job to take the same time', 'Yes: B must have joined before A'],
    answer: 0,
    feedback: 'A was removed before B, so removal was FIFO. With concurrent workers, different processing times can produce a different completion order.',
  },
  {
    question: 'A security tool deliberately selects a newly arrived critical alert ahead of older routine alerts. Which description fits?',
    options: ['Strict FIFO, because every alert is still stored', 'A priority policy, so strict arrival order is not guaranteed', 'LIFO, because critical alerts always arrive last'],
    answer: 1,
    feedback: 'The selection is based on priority, not simply age. A real system called a queue can use priority rules; do not assume that every scheduler or alert queue is strict FIFO.',
  },
]

export const examTasks = [
  {
    id: 'undo-stack-v2',
    marks: 4,
    title: 'Explain a simple Undo feature',
    prompt: 'A drawing app records three actions in this order: Add circle, Move circle, Recolour circle. It uses a stack for a simple Undo feature. State which two actions are reversed when Undo is used twice, explain why the order fits a stack, and describe what the app must store to make an action reversible.',
    guidance: [
      'The first Undo reverses Recolour circle; the second reverses Move circle.',
      'A stack is last in, first out: the most recently recorded action is available at the top.',
      'Undo removes or steps back past the most recent reversible action before reaching the earlier action below it.',
      'A record needs enough information to reverse the change, such as the previous colour or previous position. A label alone does not perform the reversal.',
    ],
  },
  {
    id: 'call-stack-v2',
    marks: 4,
    title: 'Follow nested function calls',
    prompt: 'A function is a named piece of work. openFile calls checkFile, and checkFile calls readHeader. The program pauses inside readHeader; none of the three calls has finished. Explain the order of these call-stack frames from top to bottom, what happens when readHeader returns normally, and how this view can help a developer investigate a problem.',
    guidance: [
      'The order from top to bottom is readHeader, checkFile, openFile: the most recently started unfinished call is on top.',
      'A frame holds information about one function call, including information needed to continue its work and return to its caller.',
      'When readHeader returns, its frame is removed and checkFile resumes. openFile remains waiting.',
      'A developer can see the current call chain and inspect relevant frames to investigate how execution reached this point. This is not a list of every function that has ever run.',
    ],
  },
  {
    id: 'scan-queue-v2',
    marks: 6,
    title: 'Choose a queue for file scanning',
    prompt: 'A service accepts uploaded files and keeps them unavailable while checks run. In this simplified design, one worker takes equally urgent jobs in arrival order. It is already scanning A; B then C are waiting, and D now arrives. Recommend a data structure for the waiting jobs, state the next two jobs the worker should take, and explain one benefit and one limitation if uploads arrive in a burst.',
    guidance: [
      'Use a FIFO queue for the waiting jobs, so the earliest waiting arrival is selected first.',
      'D is enqueued at the rear behind B and C. A is already being processed and is no longer a waiting job.',
      'The next two jobs dequeued are B, then C; D waits behind them.',
      'The queue buffers a short burst while the worker handles jobs at its own rate, separating arrival from processing.',
      'The queue uses storage and jobs wait. If arrivals remain faster than processing, the backlog grows; a finite queue needs a stated full policy.',
      'The queue organises work; scanning and the other checks assess files. Merely being queued or finishing one scan is not a guarantee that a file is safe.',
    ],
  },
]

export const glossary = [
  { term: 'Data structure', definition: 'A way to organise data and define how it can be accessed or changed.' },
  { term: 'Stack / LIFO', definition: 'A collection where the last item added is the first item removed.' },
  { term: 'Push / pop', definition: 'Push adds an item to the top of a stack. Pop removes and returns the top item.' },
  { term: 'Peek', definition: 'Read the next available item without removing it: the top of a stack or front of a queue.' },
  { term: 'Queue / FIFO', definition: 'A collection where the first item added is the first item removed.' },
  { term: 'Enqueue / dequeue', definition: 'Enqueue adds an item at the rear. Dequeue removes and returns the item at the front.' },
  { term: 'Call-stack frame', definition: 'Information about one unfinished function call in the simple nested-call model.' },
  { term: 'Buffer', definition: 'Temporary storage that holds data or work until another part of a system is ready to handle it.' },
  { term: 'Capacity', definition: 'The maximum number of items a particular structure is configured or able to hold.' },
  { term: 'Priority policy', definition: 'A rule that selects items using their priority rather than only their arrival order.' },
]
