import { initDebugLabs } from "../core/debug-lab.js"
import { initLessonPage } from "../core/lesson-shell.js"
import { initLiveCodeExamples } from "../core/live-code-example.js?v=20260904-9"

const lessonConfig = {
  lessonId: "variables-and-data-types",
  defaultContext: "web-development",
  contexts: {
    "web-development": {
      label: "Web Development",
      backHref: "../resources/web-development.html#javascript-basics",
      backLabel: "Back to Web Development resources",
      previous: {
        title: "Running JavaScript and using the console",
        href: "running-javascript-and-using-the-console.html",
        description:
          "Review how JavaScript runs instructions and displays values in the console.",
        status: "Live",
      },
      next: {
        title: "Working with strings",
        href: "working-with-strings.html",
        description:
          "Next, learn how to combine text and include stored values in messages.",
        status: "Live",
      },
    },
  },
  quiz: {
    storageKey: "lesson-variables-and-data-types-quiz",
    passScore: 13,
    version: 1,
  },
  examPractice: {
    storageKey: "lesson-variables-and-data-types-exam-practice",
  },
}

const javascriptExecution = {
  timeoutMs: 3000,
  network: { mode: "disabled" },
}

function inlineCode(code) {
  return { type: "code", code }
}

const liveCodeExamples = [
  {
    id: "console-recap-live",
    title: "Console recap",
    description:
      "Run this familiar instruction. Soon, the displayed value will come from a variable instead.",
    executionMode: "javascript",
    defaultSplit: 55,
    sources: [
      {
        id: "javascript",
        type: "javascript",
        label: "JavaScript",
        code: `console.log("Hello");`,
      },
    ],
    execution: javascriptExecution,
  },
  {
    id: "const-output-live",
    title: "Store and output a value",
    description:
      "Run the program, then change the name stored in studentName and run it again.",
    executionMode: "javascript",
    defaultSplit: 55,
    sources: [
      {
        id: "javascript",
        type: "javascript",
        label: "JavaScript",
        code: `const studentName = "Alex";

console.log(studentName);`,
      },
    ],
    execution: javascriptExecution,
  },
  {
    id: "let-reassignment-live",
    title: "Watch a value change",
    description:
      "Run the program and compare the output before and after score is reassigned.",
    executionMode: "javascript",
    defaultSplit: 55,
    sources: [
      {
        id: "javascript",
        type: "javascript",
        label: "JavaScript",
        code: `let score = 10;

console.log(score);

score = 15;

console.log(score);`,
      },
    ],
    execution: javascriptExecution,
  },
  {
    id: "const-error-live",
    title: "Try reassigning a const",
    description:
      "Run the code and read the error. Then change const to let and run it again.",
    executionMode: "javascript",
    defaultSplit: 55,
    sources: [
      {
        id: "javascript",
        type: "javascript",
        label: "JavaScript",
        code: `const score = 10;
score = 20;

console.log(score);`,
      },
    ],
    execution: javascriptExecution,
  },
  {
    id: "prompt-flow-live",
    title: "Ask for input and store it",
    description:
      "Run the program, enter a name in the prompt, then check the console output.",
    executionMode: "javascript",
    defaultSplit: 55,
    sources: [
      {
        id: "javascript",
        type: "javascript",
        label: "JavaScript",
        code: `const name = prompt("What is your name?");

console.log(name);`,
      },
    ],
    execution: javascriptExecution,
  },
  {
    id: "data-types-live",
    title: "Ask JavaScript for each type",
    description:
      "Run the program and compare the type reported for text, a whole number, a decimal number, and a boolean.",
    executionMode: "javascript",
    defaultSplit: 53,
    sources: [
      {
        id: "javascript",
        type: "javascript",
        label: "JavaScript",
        code: `console.log(typeof "Alex");
console.log(typeof 17);
console.log(typeof 4.99);
console.log(typeof true);`,
      },
    ],
    execution: javascriptExecution,
  },
  {
    id: "guided-practice-live",
    title: "Explore a player profile",
    instructions: [
      {
        type: "p",
        text: "Complete each step and press Run whenever you want to check the current values.",
      },
      {
        type: "ol",
        items: [
          "Run the program and enter a player name.",
          ["Change the game stored in ", inlineCode("game"), "."],
          "Run the program again.",
          "Change the starting score.",
          [
            "Change ",
            inlineCode("score"),
            " later in the program and observe both score outputs.",
          ],
          [
            "Change ",
            inlineCode("hasPremium"),
            " between ",
            inlineCode("false"),
            " and ",
            inlineCode("true"),
            ".",
          ],
        ],
      },
    ],
    executionMode: "javascript",
    defaultSplit: 52,
    sources: [
      {
        id: "javascript",
        type: "javascript",
        label: "JavaScript",
        code: `const playerName = prompt("What is your player name?");
const game = "Space Adventure";
let score = 0;
const hasPremium = false;

console.log(playerName);
console.log(game);
console.log(score);
console.log(hasPremium);

score = 10;

console.log(score);`,
      },
    ],
    execution: javascriptExecution,
  },
  {
    id: "player-profile-live",
    title: "Build a player profile",
    instructions: [
      {
        type: "p",
        text: "Create a small player profile using only the ideas from this lesson.",
      },
      {
        type: "ol",
        items: [
          ["Ask for the player's name with ", inlineCode("prompt()"), "."],
          ["Store the returned name in a ", inlineCode("const"), "."],
          ["Create another ", inlineCode("const"), " that stores a game name."],
          ["Create a ", inlineCode("let"), " called ", inlineCode("score"), " that starts at 0."],
          ["Create a boolean called ", inlineCode("hasPremium"), "."],
          ["Output each value with ", inlineCode("console.log()"), "."],
          ["Assign a different value to ", inlineCode("score"), "."],
          "Output the new score.",
        ],
      },
    ],
    executionMode: "javascript",
    defaultSplit: 52,
    sources: [
      {
        id: "javascript",
        type: "javascript",
        label: "JavaScript",
        code: `// Build your player profile below
`,
      },
    ],
    execution: javascriptExecution,
  },
]

function region(text, regionId, label) {
  return { text, regionId, label }
}

function createDebugTask({
  id,
  title,
  goal,
  brokenLine,
  fixedLine,
  regionId,
  regionLabel,
  linesBefore = [],
  linesAfter = [],
  repairs,
  correctRepairId,
  foundFeedback,
  repairFeedback,
  incorrectRepairFeedback,
  hints,
  brokenResult,
  fixedResult,
  explanation,
}) {
  return {
    id,
    mode: "find-and-fix",
    title,
    goal,
    files: [
      {
        name: "script.js",
        language: "JavaScript",
        lines: [
          ...linesBefore,
          [region(brokenLine, regionId, regionLabel)],
          ...linesAfter,
        ],
      },
    ],
    issues: [
      {
        id: `${id}-issue`,
        regionId,
        correctRepairId,
        foundFeedback,
        repairFeedback,
        incorrectRepairFeedback,
        hints,
      },
    ],
    repairOptions: repairs,
    preview: {
      broken: {
        title: "Console check",
        expected: goal,
        actual: brokenResult,
      },
      fixed: {
        title: "Console check",
        expected: goal,
        actual: fixedResult,
      },
    },
    explanation: `${explanation} Corrected code: ${fixedLine}`,
  }
}

const debugTasks = [
  createDebugTask({
    id: "reassigning-const",
    title: "A score that needs to change",
    goal: "The score should be allowed to change from 10 to 20.",
    brokenLine: "const score = 10;",
    fixedLine: "let score = 10;",
    regionId: "score-declaration",
    regionLabel: "score declared with const even though it needs reassignment",
    linesAfter: ["", "score = 20;", "", "console.log(score);"],
    repairs: [
      { id: "use-let", label: "let score = 10;", replacement: "let score = 10;" },
      { id: "use-var", label: "var score = 10;", replacement: "var score = 10;" },
      { id: "remove-value", label: "const score;", replacement: "const score;" },
    ],
    correctRepairId: "use-let",
    foundFeedback: "You found the declaration that prevents reassignment.",
    repairFeedback: "let fits because this score must be assigned a different value later.",
    incorrectRepairFeedback: "Use the modern declaration intended for a value that needs reassignment.",
    hints: ["The requirement says that score needs to change.", "Use const by default and let when reassignment is needed."],
    brokenResult: "The later score = 20 line produces an error.",
    fixedResult: "The score can change to 20.",
    explanation: "let fits the stated requirement because score needs reassignment.",
  }),
  createDebugTask({
    id: "string-without-quotes",
    title: "A name without quotation marks",
    goal: "Store the text Alex in the name variable.",
    brokenLine: "const name = Alex;",
    fixedLine: 'const name = "Alex";',
    regionId: "unquoted-name",
    regionLabel: "Alex written without quotation marks",
    repairs: [
      { id: "quote-name", label: 'const name = "Alex";', replacement: 'const name = "Alex";' },
      { id: "quote-variable", label: 'const "name" = Alex;', replacement: 'const "name" = Alex;' },
      { id: "boolean-name", label: "const name = true;", replacement: "const name = true;" },
    ],
    correctRepairId: "quote-name",
    foundFeedback: "You found the value JavaScript is treating as a variable name.",
    repairFeedback: "Quotation marks make Alex a string value.",
    incorrectRepairFeedback: "The requirement is to store the text Alex in a normally named variable.",
    hints: ["Strings are written inside quotation marks.", "The variable name stays unquoted; the stored text needs quotes."],
    brokenResult: "JavaScript looks for an identifier called Alex and reports an error.",
    fixedResult: "name stores the string Alex.",
    explanation: "Without quotes, JavaScript treats Alex as an identifier rather than literal text.",
  }),
  createDebugTask({
    id: "variable-name-typo",
    title: "A variable name does not match",
    goal: "Display the value stored in score.",
    brokenLine: "console.log(socre);",
    fixedLine: "console.log(score);",
    regionId: "misspelled-score",
    regionLabel: "score misspelled as socre",
    linesBefore: ["const score = 10;", ""],
    repairs: [
      { id: "spell-score", label: "console.log(score);", replacement: "console.log(score);" },
      { id: "quote-score", label: 'console.log("score");', replacement: 'console.log("score");' },
      { id: "log-socre", label: "console.log(socre);", replacement: "console.log(socre);" },
    ],
    correctRepairId: "spell-score",
    foundFeedback: "You found the misspelled variable name.",
    repairFeedback: "The output line now refers to the existing score variable.",
    incorrectRepairFeedback: "Match the variable name exactly and output its stored value, not the word score.",
    hints: ["Earlier code declares const score = 10;.", "Compare the letters in score and socre."],
    brokenResult: "JavaScript reports that socre is not defined.",
    fixedResult: "The console displays 10.",
    explanation: "Variable names must match exactly wherever they are used.",
  }),
  createDebugTask({
    id: "boolean-as-string",
    title: "Text used instead of a boolean",
    goal: "Store a boolean showing whether the user is logged in.",
    brokenLine: 'const isLoggedIn = "true";',
    fixedLine: "const isLoggedIn = true;",
    regionId: "quoted-boolean",
    regionLabel: "true placed inside quotation marks",
    repairs: [
      { id: "boolean-true", label: "const isLoggedIn = true;", replacement: "const isLoggedIn = true;" },
      { id: "string-yes", label: 'const isLoggedIn = "yes";', replacement: 'const isLoggedIn = "yes";' },
      { id: "string-false", label: 'const isLoggedIn = "false";', replacement: 'const isLoggedIn = "false";' },
    ],
    correctRepairId: "boolean-true",
    foundFeedback: "You found the quoted value, which is currently a string.",
    repairFeedback: "Without quotation marks, true is the boolean value required.",
    incorrectRepairFeedback: "The requirement asks for a boolean, not text.",
    hints: ["Boolean values are true or false.", "Boolean values do not use quotation marks."],
    brokenResult: 'isLoggedIn stores the string "true".',
    fixedResult: "isLoggedIn stores the boolean true.",
    explanation: '"true" is text, while true without quotation marks is a boolean.',
  }),
]

initLessonPage(lessonConfig)
initLiveCodeExamples(liveCodeExamples)
initDebugLabs(debugTasks, {
  storageKey: "lesson-variables-and-data-types-debug-labs",
  version: 1,
})
