import { initLessonPage } from "../core/lesson-shell.js"
import { initLiveCodeExamples } from "../core/live-code-example.js?v=20260904-9"

const lessonConfig = {
  "lessonId": "operators-and-expressions",
  "defaultContext": "web-development",
  "contexts": {
    "web-development": {
      "label": "Web Development",
      "backHref": "../resources/web-development.html#javascript-basics",
      "backLabel": "Back to Web Development resources",
      "previous": {
        "title": "Working with strings",
        "href": "working-with-strings.html",
        "description": "Review concatenation and inserting values into template literals.",
        "status": "Live"
      },
      "next": {
        "title": "Comparisons and Boolean Logic",
        "description": "Next, learn how to compare values and combine true-or-false results.",
        "status": "Planned"
      }
    }
  },
  "quiz": {
    "storageKey": "lesson-operators-and-expressions-quiz",
    "passScore": 16,
    "version": 1
  },
  "examPractice": {
    "storageKey": "lesson-operators-and-expressions-exam-practice"
  }
}

const liveCodeExamples = [
  {
    "id": "arithmetic-live",
    "title": "Explore four arithmetic operators",
    "instructions": [
      {
        "type": "ol",
        "items": [
          "Run the program and read all four results.",
          "Change one number. Predict the new results before pressing Run.",
          "Try each of +, -, *, and / with numbers of your choice. Use a non-zero divisor for division.",
          "Explain which operation each line performs."
        ]
      }
    ],
    "executionMode": "javascript",
    "defaultSplit": 54,
    "sources": [
      {
        "id": "javascript",
        "type": "javascript",
        "label": "JavaScript",
        "code": "console.log(10 + 5);\nconsole.log(10 - 5);\nconsole.log(10 * 5);\nconsole.log(10 / 5);"
      }
    ],
    "execution": {
      "timeoutMs": 3000,
      "network": {
        "mode": "disabled"
      }
    }
  },
  {
    "id": "types-live",
    "title": "Compare number addition and text joining",
    "instructions": [
      {
        "type": "ol",
        "items": [
          "Predict the output of both lines, then run the program.",
          "Change both examples to use 7 and 2. Keep the quotation marks in the second example.",
          "Run again. Explain why the outputs are different."
        ]
      }
    ],
    "executionMode": "javascript",
    "defaultSplit": 54,
    "sources": [
      {
        "id": "javascript",
        "type": "javascript",
        "label": "JavaScript",
        "code": "console.log(5 + 3);\nconsole.log(\"5\" + \"3\");"
      }
    ],
    "execution": {
      "timeoutMs": 3000,
      "network": {
        "mode": "disabled"
      }
    }
  },
  {
    "id": "prompt-text-live",
    "title": "Observe what prompt input does with +",
    "instructions": [
      {
        "type": "ol",
        "items": [
          "Run the program, type 10 into the prompt, and submit it.",
          "Read the output 105. Explain how the submitted text was joined with 5.",
          "Run again with another number written as text and predict the joined result."
        ]
      }
    ],
    "executionMode": "javascript",
    "defaultSplit": 54,
    "sources": [
      {
        "id": "javascript",
        "type": "javascript",
        "label": "JavaScript",
        "code": "const number = prompt(\"Enter a number:\");\nconsole.log(number + 5);"
      }
    ],
    "execution": {
      "timeoutMs": 3000,
      "network": {
        "mode": "disabled"
      }
    }
  },
  {
    "id": "number-conversion-live",
    "title": "Convert input before adding",
    "instructions": [
      {
        "type": "ol",
        "items": [
          "Run the program, enter 10, and check that the output is 15.",
          "Try another numeric input. Predict the result before submitting it.",
          "Rewrite the first two lines as const number = Number(prompt(\"Enter a number:\")); and run again.",
          "Choose whichever conversion form you find easier to read."
        ]
      }
    ],
    "executionMode": "javascript",
    "defaultSplit": 54,
    "sources": [
      {
        "id": "javascript",
        "type": "javascript",
        "label": "JavaScript",
        "code": "const input = prompt(\"Enter a number:\");\nconst number = Number(input);\n\nconsole.log(number + 5);"
      }
    ],
    "execution": {
      "timeoutMs": 3000,
      "network": {
        "mode": "disabled"
      }
    }
  },
  {
    "id": "template-expression-live",
    "title": "Insert a calculated value into a message",
    "instructions": [
      {
        "type": "ol",
        "items": [
          "Predict the message, then run the program.",
          "Change the stored score and the amount added inside ${...}. Predict and run again.",
          "Add console.log(score); after the message. Observe that calculating inside the template literal does not reassign score."
        ]
      }
    ],
    "executionMode": "javascript",
    "defaultSplit": 54,
    "sources": [
      {
        "id": "javascript",
        "type": "javascript",
        "label": "JavaScript",
        "code": "const score = 10;\nconsole.log(`Your next score will be ${score + 5}.`);"
      }
    ],
    "execution": {
      "timeoutMs": 3000,
      "network": {
        "mode": "disabled"
      }
    }
  },
  {
    "id": "order-live",
    "title": "Compare calculation order",
    "instructions": [
      {
        "type": "ol",
        "items": [
          "Predict both outputs before running the program.",
          "Run and explain why the first result is 14 and the second is 20.",
          "Change the numbers in both lines, keeping the parentheses only in the second line. Predict and rerun."
        ]
      }
    ],
    "executionMode": "javascript",
    "defaultSplit": 54,
    "sources": [
      {
        "id": "javascript",
        "type": "javascript",
        "label": "JavaScript",
        "code": "console.log(2 + 3 * 4);\nconsole.log((2 + 3) * 4);"
      }
    ],
    "execution": {
      "timeoutMs": 3000,
      "network": {
        "mode": "disabled"
      }
    }
  },
  {
    "id": "update-live",
    "title": "Update a numeric score",
    "instructions": [
      {
        "type": "ol",
        "items": [
          "Run the program and check that the score becomes 15.",
          "Replace score = score + 5; with score += 5; and rerun. Compare the result.",
          "Try -= 5, *= 2, and /= 2 one at a time in place of the update. Predict the score before each run."
        ]
      }
    ],
    "executionMode": "javascript",
    "defaultSplit": 54,
    "sources": [
      {
        "id": "javascript",
        "type": "javascript",
        "label": "JavaScript",
        "code": "let score = 10;\nscore = score + 5;\nconsole.log(score);"
      }
    ],
    "execution": {
      "timeoutMs": 3000,
      "network": {
        "mode": "disabled"
      }
    }
  },
  {
    "id": "debug-symbol-live",
    "title": "Debug 1: multiply two values",
    "instructions": [
      {
        "type": "ol",
        "items": [
          "Run the program and read the error.",
          "Fix the program so JavaScript multiplies 5 by 4.",
          "Run again and check that the output is 20."
        ]
      }
    ],
    "executionMode": "javascript",
    "defaultSplit": 54,
    "sources": [
      {
        "id": "javascript",
        "type": "javascript",
        "label": "JavaScript",
        "code": "const total = 5 × 4;\nconsole.log(total);"
      }
    ],
    "execution": {
      "timeoutMs": 3000,
      "network": {
        "mode": "disabled"
      }
    }
  },
  {
    "id": "debug-input-live",
    "title": "Debug 2: add to numeric input",
    "instructions": [
      {
        "type": "ol",
        "items": [
          "Run the program and enter 5. The intended output is 15.",
          "Fix the input so it is treated as a number while keeping the addition of 10.",
          "Run again with 5, then with a different numeric input, to check your repair."
        ]
      }
    ],
    "executionMode": "javascript",
    "defaultSplit": 54,
    "sources": [
      {
        "id": "javascript",
        "type": "javascript",
        "label": "JavaScript",
        "code": "const number = prompt(\"Enter a number:\");\nconsole.log(number + 10);"
      }
    ],
    "execution": {
      "timeoutMs": 3000,
      "network": {
        "mode": "disabled"
      }
    }
  },
  {
    "id": "debug-order-live",
    "title": "Debug 3: follow the calculation requirement",
    "instructions": [
      {
        "type": "ol",
        "items": [
          "The requirement is to add 5 and 3 first, then multiply that result by 2.",
          "Run the current program and compare its output with the intended result of 16.",
          "Fix the expression without changing the numbers or operators, then rerun."
        ]
      }
    ],
    "executionMode": "javascript",
    "defaultSplit": 54,
    "sources": [
      {
        "id": "javascript",
        "type": "javascript",
        "label": "JavaScript",
        "code": "const result = 5 + 3 * 2;\nconsole.log(result);"
      }
    ],
    "execution": {
      "timeoutMs": 3000,
      "network": {
        "mode": "disabled"
      }
    }
  },
  {
    "id": "debug-update-live",
    "title": "Debug 4: allow the score to change",
    "instructions": [
      {
        "type": "ol",
        "items": [
          "Run the program and read the error.",
          "Fix the declaration so score can be updated from 10 to 15.",
          "Keep the update expression and run again to check the output."
        ]
      }
    ],
    "executionMode": "javascript",
    "defaultSplit": 54,
    "sources": [
      {
        "id": "javascript",
        "type": "javascript",
        "label": "JavaScript",
        "code": "const score = 10;\nscore = score + 5;\nconsole.log(score);"
      }
    ],
    "execution": {
      "timeoutMs": 3000,
      "network": {
        "mode": "disabled"
      }
    }
  },
  {
    "id": "calculator-live",
    "title": "Explore a simple calculator",
    "instructions": [
      {
        "type": "ol",
        "items": [
          "Run the program and enter two numbers. For these division examples, choose a non-zero second number.",
          "Predict each answer before submitting the second number and checking the console.",
          "Try different values, including a pair such as 10 and 3.",
          "Add another output using % to display the remainder.",
          "Change one calculation, for example by adding parentheses around firstNumber + secondNumber and then multiplying that result by 2.",
          "Write your changed expression directly inside ${...} in a template literal, then predict and run again."
        ]
      }
    ],
    "executionMode": "javascript",
    "defaultSplit": 54,
    "sources": [
      {
        "id": "javascript",
        "type": "javascript",
        "label": "JavaScript",
        "code": "const firstNumber = Number(prompt(\"Enter the first number:\"));\nconst secondNumber = Number(prompt(\"Enter the second number:\"));\n\nconsole.log(`Added: ${firstNumber + secondNumber}`);\nconsole.log(`Subtracted: ${firstNumber - secondNumber}`);\nconsole.log(`Multiplied: ${firstNumber * secondNumber}`);\nconsole.log(`Divided: ${firstNumber / secondNumber}`);"
      }
    ],
    "execution": {
      "timeoutMs": 3000,
      "network": {
        "mode": "disabled"
      }
    }
  },
  {
    "id": "shopping-total-live",
    "title": "Build a shopping total",
    "instructions": [
      {
        "type": "ol",
        "items": [
          "Ask the user for a product price with prompt().",
          "Convert that input to a number and store it in price.",
          "Ask for a quantity, convert it to a number, and store it in quantity.",
          "Multiply price by quantity and store the result in a variable called total.",
          "Output the result using a template literal, with a message such as Total: £12.",
          "Run with price 4 and quantity 3 and check for Total: £12. Try another price and quantity.",
          "Separate input and conversion steps or Number(prompt(...)) are both acceptable."
        ]
      }
    ],
    "executionMode": "javascript",
    "defaultSplit": 54,
    "sources": [
      {
        "id": "javascript",
        "type": "javascript",
        "label": "JavaScript",
        "code": "// Build your shopping-total program below\n"
      }
    ],
    "execution": {
      "timeoutMs": 3000,
      "network": {
        "mode": "disabled"
      }
    }
  }
]

initLessonPage(lessonConfig)
initLiveCodeExamples(liveCodeExamples)
