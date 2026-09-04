import { initDebugLabs } from "../core/debug-lab.js"
import { initLessonPage } from "../core/lesson-shell.js"
import { initLiveCodeExamples } from "../core/live-code-example.js?v=20260904-9"

const lessonConfig = {
  lessonId: "running-javascript-and-using-the-console",
  defaultContext: "web-development",
  contexts: {
    "web-development": {
      label: "Web Development",
      backHref: "../resources/web-development.html#javascript-basics",
      backLabel: "Back to Web Development resources",
      previous: {
        title: "Colours, backgrounds, and borders",
        href: "colours-backgrounds-and-borders.html",
        description:
          "The previous live lesson finished the current CSS basics sequence with colour, background, border, and radius styling.",
        status: "Live",
      },
      next: {
        title: "Variables and data types",
        href: "variables-and-data-types.html",
        description:
          "Next, store values with const and let and recognise strings, numbers, and booleans.",
        status: "Live",
      },
    },
  },
  quiz: {
    storageKey: "lesson-running-javascript-and-using-the-console-quiz",
    passScore: 12,
    version: 1,
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
    id: "execution-order-live",
    title: "Run three instructions",
    description:
      "Press Run and compare the order of the console messages. Then move the last line above the second line and run it again.",
    executionMode: "javascript",
    defaultSplit: 54,
    sources: [
      {
        id: "javascript",
        type: "javascript",
        label: "JavaScript",
        code: `console.log("First");
console.log("Second");
console.log("Third");`,
      },
    ],
    execution: javascriptExecution,
  },
  {
    id: "hello-world-live",
    title: "Hello, world!",
    description:
      "Change the message inside the quotation marks, then press Run again.",
    executionMode: "javascript",
    defaultSplit: 56,
    sources: [
      {
        id: "javascript",
        type: "javascript",
        label: "JavaScript",
        code: `console.log("Hello, world!");`,
      },
    ],
    execution: javascriptExecution,
  },
  {
    id: "comments-live",
    title: "Comments are ignored",
    description:
      "Run the code and notice that only the console.log() instruction appears in the console.",
    executionMode: "javascript",
    defaultSplit: 56,
    sources: [
      {
        id: "javascript",
        type: "javascript",
        label: "JavaScript",
        code: `// Display a message
console.log("Program started");`,
      },
    ],
    execution: javascriptExecution,
  },
  {
    id: "console-types-live",
    title: "Compare log, warn, and error",
    description:
      "Run the code and compare the labels in the console. The final line proves that console.error() does not stop the program by itself.",
    executionMode: "javascript",
    defaultSplit: 55,
    sources: [
      {
        id: "javascript",
        type: "javascript",
        label: "JavaScript",
        code: `console.log("Program started");
console.warn("Battery is low");
console.error("File could not be loaded");
console.log("The program can still continue");`,
      },
    ],
    execution: javascriptExecution,
  },
  {
    id: "clear-console-live",
    title: "Clear earlier output",
    description:
      "Run the code. The first three messages are cleared, then the final message appears.",
    executionMode: "javascript",
    defaultSplit: 55,
    sources: [
      {
        id: "javascript",
        type: "javascript",
        label: "JavaScript",
        code: `console.log("Message one");
console.log("Message two");
console.log("Message three");

console.clear();

console.log("The previous messages were cleared.");`,
      },
    ],
    execution: javascriptExecution,
  },
  {
    id: "first-error-live",
    title: "Fix one broken line",
    description:
      "Press Run to see the error message. Then add the missing ) before the semicolon and run it again.",
    executionMode: "javascript",
    defaultSplit: 55,
    sources: [
      {
        id: "javascript",
        type: "javascript",
        label: "JavaScript",
        code: `console.log("Hello";`,
      },
    ],
    execution: javascriptExecution,
  },
  {
    id: "practice-live",
    title: "Console practice",
    instructions: [
      {
        type: "p",
        text: "Try these small changes. Run the code again after each one so you can see what changed in the console.",
      },
      {
        type: "ol",
        items: [
          "Change the normal message.",
          ["Add another ", inlineCode("console.log()"), " line."],
          "Move the warning to the top.",
          "Add a comment above one line.",
          ["Add ", inlineCode("console.clear();"), " before the final message."],
        ],
      },
    ],
    executionMode: "javascript",
    defaultSplit: 55,
    sources: [
      {
        id: "javascript",
        type: "javascript",
        label: "JavaScript",
        code: `console.log("Welcome");
console.warn("This is a warning");
console.error("This is an error");
console.log("Practice complete");`,
      },
    ],
    execution: javascriptExecution,
  },
]

function region(text, regionId, label) {
  return { text, regionId, label }
}

const debugTasks = [
  {
    id: "missing-console-bracket",
    mode: "find-and-fix",
    title: "The message does not appear",
    goal: "The program should display Hello in the console.",
    files: [
      {
        name: "script.js",
        language: "JavaScript",
        lines: [
          [
            region(
              'console.log("Hello";',
              "broken-console-line",
              "console.log command missing a closing parenthesis"
            ),
          ],
        ],
      },
    ],
    issues: [
      {
        id: "missing-closing-parenthesis",
        regionId: "broken-console-line",
        correctRepairId: "complete-command",
        foundFeedback: "You found the command that JavaScript cannot read.",
        repairFeedback: "The command is complete, so JavaScript can run it.",
        incorrectRepairFeedback:
          "That change still leaves the command incomplete or changes the message.",
        hints: [
          "Compare the broken line with console.log(\"Hello\");.",
          "The quote marks are already closed. Look near the semicolon.",
        ],
      },
    ],
    repairOptions: [
      {
        id: "complete-command",
        label: 'console.log("Hello");',
        replacement: 'console.log("Hello");',
      },
      {
        id: "remove-quotes",
        label: "console.log(Hello);",
        replacement: "console.log(Hello);",
      },
      {
        id: "keep-broken",
        label: 'console.log("Hello";',
        replacement: 'console.log("Hello";',
      },
    ],
    preview: {
      broken: {
        title: "Console",
        expected: "Expected output: Hello",
        actual: "Actual result: JavaScript shows an error before Hello appears.",
      },
      fixed: {
        title: "Console",
        expected: "Expected output: Hello",
        actual: "Actual result: Hello",
      },
    },
    explanation:
      'JavaScript needs the command to be complete before it can run it. The corrected line is console.log("Hello");.',
  },
]

initLessonPage(lessonConfig)
initLiveCodeExamples(liveCodeExamples)
initDebugLabs(debugTasks, {
  storageKey: "lesson-running-javascript-and-using-the-console-debug-lab",
  version: 1,
})
