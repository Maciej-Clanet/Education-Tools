import { initLessonPage } from "../core/lesson-shell.js"
import { initLiveCodeExamples } from "../core/live-code-example.js?v=20260904-9"

const lessonConfig = {
  lessonId: "working-with-strings",
  defaultContext: "web-development",
  contexts: {
    "web-development": {
      label: "Web Development",
      backHref: "../resources/web-development.html#javascript-basics",
      backLabel: "Back to Web Development resources",
      previous: {
        title: "Variables and data types",
        href: "variables-and-data-types.html",
        description:
          "Review const, let, prompt input, and the string, number, and boolean data types.",
        status: "Live",
      },
      next: {
        title: "Operators and expressions",
        description:
          "Next, use operators to create results from values and expressions.",
        status: "Planned",
      },
    },
  },
  quiz: {
    storageKey: "lesson-working-with-strings-quiz",
    passScore: 12,
    version: 1,
  },
  examPractice: {
    storageKey: "lesson-working-with-strings-exam-practice",
  },
}

const javascriptExecution = {
  timeoutMs: 3000,
  network: { mode: "disabled" },
}

function inlineCode(value) {
  return { type: "code", code: value }
}

function singleTask(text) {
  return [{ type: "p", text }]
}

function javascriptSource(lines) {
  return [
    {
      id: "javascript",
      type: "javascript",
      label: "JavaScript",
      code: lines.join("\n"),
    },
  ]
}

const liveCodeExamples = [
  {
    id: "recap-name-typo-live",
    title: "Debug recap 1: display the entered name",
    instructions: singleTask(
      "Fix the code so the name entered by the user is displayed in the console. Run the program to check your repair."
    ),
    executionMode: "javascript",
    defaultSplit: 54,
    sources: javascriptSource([
      'const name = prompt("What is your name?");',
      "",
      "console.log(namme);",
    ]),
    execution: javascriptExecution,
  },
  {
    id: "recap-changing-value-live",
    title: "Debug recap 2: allow the score to change",
    instructions: singleTask(
      "The score needs to change later in the program. Fix the variable declaration so the program can run, then check that the console displays 10."
    ),
    executionMode: "javascript",
    defaultSplit: 54,
    sources: javascriptSource([
      "const score = 0;",
      "",
      "score = 10;",
      "",
      "console.log(score);",
    ]),
    execution: javascriptExecution,
  },
  {
    id: "join-with-plus-live",
    title: "Join a greeting with +",
    instructions: singleTask(
      "Run the program, then change the value stored in name and run it again. Observe which parts of the message stay fixed and which part changes."
    ),
    executionMode: "javascript",
    defaultSplit: 55,
    sources: javascriptSource([
      'const name = "Alex";',
      "",
      'console.log("Hello " + name);',
    ]),
    execution: javascriptExecution,
  },
  {
    id: "missing-space-live",
    title: "Find the missing space",
    instructions: [
      {
        type: "p",
        text: "Run the program and inspect the output. Then add a string containing one space between firstName and surname so the console displays Alex Smith.",
      },
    ],
    executionMode: "javascript",
    defaultSplit: 55,
    sources: javascriptSource([
      'const firstName = "Alex";',
      'const surname = "Smith";',
      "",
      "console.log(firstName + surname);",
    ]),
    execution: javascriptExecution,
  },
  {
    id: "long-concatenation-live",
    title: "Build a longer message with +",
    instructions: [
      {
        type: "ol",
        items: [
          "Run the program and answer both prompts.",
          "Check that the greeting contains your first name, surname, spaces, comma, and final message.",
          "Change the final ordinary text and run the program again.",
          "Inspect how many quotation marks and + symbols are needed to build the message.",
        ],
      },
    ],
    executionMode: "javascript",
    defaultSplit: 52,
    sources: javascriptSource([
      'const firstName = prompt("What is your first name?");',
      'const surname = prompt("What is your surname?");',
      "",
      "console.log(",
      '  "Hello " + firstName + " " + surname + ", welcome to the website!"',
      ");",
    ]),
    execution: javascriptExecution,
  },
  {
    id: "template-literal-live",
    title: "Insert a value with a template literal",
    instructions: [
      {
        type: "ol",
        items: [
          "Run the program and read the greeting.",
          ["Change the value stored in ", inlineCode("name"), " and run it again."],
          ["Change the ordinary text around ", inlineCode("${name}"), "."],
        ],
      },
    ],
    executionMode: "javascript",
    defaultSplit: 55,
    sources: javascriptSource([
      'const name = "Alex";',
      "",
      "console.log(`Hello ${name}!`);",
    ]),
    execution: javascriptExecution,
  },
  {
    id: "ordinary-quotes-live",
    title: "Compare ordinary quotes with backticks",
    instructions: [
      {
        type: "ol",
        items: [
          "Run the program and observe that the first message displays ${name} literally.",
          "Compare the delimiters at the start and end of each message.",
          "Change the first message to use backticks and run it again.",
        ],
      },
    ],
    executionMode: "javascript",
    defaultSplit: 53,
    sources: javascriptSource([
      'const name = "Alex";',
      "",
      'console.log("Hello ${name}");',
      "console.log(`Hello ${name}`);",
    ]),
    execution: javascriptExecution,
  },
  {
    id: "multiple-values-live",
    title: "Insert more than one value",
    instructions: singleTask(
      "Run the program, then change each stored value and observe how one template literal inserts all three values into readable output."
    ),
    executionMode: "javascript",
    defaultSplit: 52,
    sources: javascriptSource([
      'const firstName = "Alex";',
      'const surname = "Smith";',
      'const favouriteGame = "Minecraft";',
      "",
      "console.log(",
      "  `${firstName} ${surname}'s favourite game is ${favouriteGame}.`",
      ");",
    ]),
    execution: javascriptExecution,
  },
  {
    id: "message-experiment-live",
    title: "Experiment with a dynamic profile message",
    instructions: [
      {
        type: "p",
        text: "Explore how ordinary text and inserted values work together inside one template literal.",
      },
      {
        type: "ol",
        items: [
          "Run the program and answer all three prompts.",
          "Change the wording of the final message.",
          ["Move the ", inlineCode("surname"), " insertion somewhere else in the message."],
          "Add another piece of ordinary text.",
          ["Remove one ", inlineCode("${...}"), " section and observe what happens."],
          "Change the final message to use a different order.",
        ],
      },
    ],
    executionMode: "javascript",
    defaultSplit: 50,
    sources: javascriptSource([
      'const firstName = prompt("What is your first name?");',
      'const surname = prompt("What is your surname?");',
      'const favouriteGame = prompt("What is your favourite game?");',
      "",
      "console.log(",
      "  `Hello ${firstName} ${surname}! Your favourite game is ${favouriteGame}.`",
      ");",
    ]),
    execution: javascriptExecution,
  },
  {
    id: "debug-ordinary-quotes-live",
    title: "Debug 1: make the stored name appear",
    instructions: singleTask(
      "Fix the code so the value stored in name appears in the output instead of the characters ${name}. Run the program to check your repair."
    ),
    executionMode: "javascript",
    defaultSplit: 54,
    sources: javascriptSource([
      'const name = "Alex";',
      "",
      'console.log("Hello ${name}");',
    ]),
    execution: javascriptExecution,
  },
  {
    id: "debug-missing-braces-live",
    title: "Debug 2: repair the insertion",
    instructions: singleTask(
      "Fix the template literal so it inserts the value stored in name. Run the program and check that the console displays Hello Alex."
    ),
    executionMode: "javascript",
    defaultSplit: 54,
    sources: javascriptSource([
      'const name = "Alex";',
      "",
      "console.log(`Hello $name`);",
    ]),
    execution: javascriptExecution,
  },
  {
    id: "debug-mismatched-delimiters-live",
    title: "Debug 3: match the string delimiters",
    instructions: singleTask(
      "Fix the mismatched string delimiters so the program runs and displays Hello Alex. The template literal must begin and end with backticks."
    ),
    executionMode: "javascript",
    defaultSplit: 54,
    sources: javascriptSource([
      'const name = "Alex";',
      "",
      "console.log(`Hello ${name}\");",
    ]),
    execution: javascriptExecution,
  },
  {
    id: "debug-concatenation-space-live",
    title: "Debug 4: separate the two names",
    instructions: singleTask(
      "Keep this as a concatenation example. Add a string containing one space so the output displays Alex Smith, then run the program to check it."
    ),
    executionMode: "javascript",
    defaultSplit: 54,
    sources: javascriptSource([
      'const firstName = "Alex";',
      'const surname = "Smith";',
      "",
      "console.log(firstName + surname);",
    ]),
    execution: javascriptExecution,
  },
  {
    id: "profile-message-live",
    title: "Build a profile message",
    instructions: [
      {
        type: "p",
        text: "Create one friendly profile sentence using only ideas from the first three JavaScript lessons.",
      },
      {
        type: "ol",
        items: [
          "Ask the user for their first name, surname, and favourite game with three prompts.",
          ["Store each answer in its own ", inlineCode("const"), " variable."],
          "Create one template literal for the complete output sentence.",
          ["Insert all three stored values with ", inlineCode("${...}"), "."],
          ["Display the finished sentence with ", inlineCode("console.log()"), "."],
          "Run the program and check the spacing and punctuation in the output.",
        ],
      },
      {
        type: "p",
        content: [
          { type: "strong", text: "Target shape: " },
          "Hello Alex Smith! Your favourite game is Minecraft.",
        ],
      },
    ],
    executionMode: "javascript",
    defaultSplit: 50,
    sources: javascriptSource(["// Build your profile message below", ""]),
    execution: javascriptExecution,
  },
]

initLessonPage(lessonConfig)
initLiveCodeExamples(liveCodeExamples)
