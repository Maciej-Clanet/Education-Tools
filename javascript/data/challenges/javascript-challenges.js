import { challenge } from "./challenge-authoring.js";

const js = (entry) => challenge({ section: "javascript-basics", ...entry });

export const javascriptChallenges = [
  js({
    "id": "js-console-syntax",
    "number": 2,
    "kind": "debug",
    "topic": "Running JavaScript and the Console",
    "title": "Fix the two messages",
    "skills": [
      "Statements",
      "console.log",
      "Comments",
      "Syntax errors"
    ],
    "task": "The code should show two messages, but missing punctuation stops it from running.",
    "steps": [
      "Click Run and read the error message.",
      "Check both console.log lines for missing quotation marks or round brackets. Add the missing punctuation.",
      "Click Run again. Keep the message text and the comment unchanged."
    ],
    "expectedOutput": "Welcome to coding\nReady to run",
    "checks": [
      "Both messages should appear on separate lines, in the order shown above."
    ],
    "code": "// Welcome the class\nconsole.log(\"Welcome to coding);\nconsole.log(\"Ready to run\";"
  }),
  js({
    "id": "js-variable-reassignment",
    "number": 3,
    "kind": "debug",
    "topic": "Variables and Data Types",
    "title": "Fix the changing score",
    "skills": [
      "const",
      "let",
      "Reassignment",
      "Numbers"
    ],
    "task": "The score should start at 10 and then change to 15. The program currently stops before it can show 15.",
    "steps": [
      "Run the code to see where it stops.",
      "Change the declaration of score so that its value can be changed later. Keep const for playerName because the name does not change.",
      "Remove the quotation marks around 10 and 15 so that both values are numbers.",
      "Run the code again."
    ],
    "expectedOutput": "10\n15",
    "checks": [
      "The program should show both numbers without an error."
    ],
    "code": "const playerName = \"Alex\";\nconst score = \"10\";\nconsole.log(score);\nscore = \"15\";\nconsole.log(score);"
  }),
  js({
    "id": "js-variable-profile",
    "number": 4,
    "kind": "program",
    "topic": "Variables and Data Types",
    "title": "Create a club member profile",
    "skills": [
      "const",
      "let",
      "Strings",
      "Numbers",
      "Booleans",
      "typeof",
      "undefined",
      "null"
    ],
    "task": "Write a program that stores a club member’s details in variables and shows them in the console.",
    "steps": [
      "Create three const variables: memberName containing the text \"Sam\", age containing the number 16, and isMember containing true. Do not put quotation marks around true.",
      "Create a let variable called points with the value 0. Print points with console.log(), change points to 5, then print it again.",
      "Create a let variable called nextSession without giving it a value. Create a const variable called chosenProject with the value null.",
      "Print memberName, age, isMember, nextSession, and chosenProject, in that order. Use a separate console.log() for each one.",
      "Finally, use typeof to print the types of memberName, age, and isMember, in that order."
    ],
    "expectedOutput": "0\n5\nSam\n16\ntrue\nundefined\nnull\nstring\nnumber\nboolean",
    "checks": [
      "nextSession should show undefined because you have not given it a value. chosenProject should show null because that is the value you gave it.",
      "Check that age has type number and isMember has type boolean. If either shows string, check for quotation marks around its value."
    ]
  }),
  js({
    "id": "js-string-message",
    "number": 5,
    "kind": "debug",
    "topic": "Working with Strings",
    "title": "Fix the welcome sentence",
    "skills": [
      "Concatenation",
      "Spaces",
      "Template literals"
    ],
    "task": "Both console.log lines should show the same welcome message. Each line currently has a different mistake.",
    "steps": [
      "Run the code and compare the two messages with the expected output below.",
      "In the line that uses + to join text, add the missing space between Hello and the name.",
      "In the other line, change the quotation marks so that ${memberName} is replaced by the name stored in the variable."
    ],
    "expectedOutput": "Hello Sam!\nHello Sam!",
    "checks": [
      "Change the value of memberName from \"Sam\" to \"Jo\" and run again. Both lines should show Hello Jo! without changing either console.log line."
    ],
    "code": "const memberName = \"Sam\";\nconsole.log(\"Hello\" + memberName + \"!\");\nconsole.log(\"Hello ${memberName}!\");"
  }),
  js({
    "id": "js-string-label",
    "number": 6,
    "kind": "program",
    "topic": "Working with Strings",
    "title": "Write a project message",
    "skills": [
      "Strings",
      "Concatenation",
      "Template literals",
      "Variables"
    ],
    "task": "Write the same sentence in two ways: first by joining text with +, then by using a template literal.",
    "steps": [
      "Create three const variables: creator containing \"Asha\", project containing \"Space Quiz\", and language containing \"JavaScript\".",
      "Use console.log() to build the sentence shown below. Join the text and the three variables with +. Include spaces between words.",
      "Add a second console.log() that produces the same sentence using backticks and ${...} to insert the variables."
    ],
    "expectedOutput": "Asha built Space Quiz using JavaScript.\nAsha built Space Quiz using JavaScript.",
    "checks": [
      "Change project to \"Word Game\" and run again. Both sentences should now say Asha built Word Game using JavaScript."
    ]
  }),
  js({
    "id": "js-expression-average",
    "number": 7,
    "kind": "debug",
    "topic": "Operators and Expressions",
    "title": "Fix the average score",
    "skills": [
      "prompt()",
      "Number()",
      "Numbers vs strings",
      "Operator precedence",
      "Parentheses"
    ],
    "task": "The program asks for one score and stores a second score in the code. It should add the two scores, then divide their total by 2.",
    "steps": [
      "Click Run. When asked for the first score, type 12 and submit it.",
      "prompt() gives you text, even when you type a number. Use Number() to convert this answer to a number.",
      "Fix the average calculation so that the two scores are added together before the total is divided by 2. Use round brackets to control the order.",
      "Run again and enter 12."
    ],
    "expectedOutput": "10",
    "checks": [
      "Change secondScore to 4, run again, and enter 6 at the prompt. The answer should be 5.",
      "For these checks, type a number into the prompt and submit it. You do not need to handle cancelled or non-number answers."
    ],
    "code": "const firstScore = prompt(\"First score:\");\nconst secondScore = 8;\nconst average = firstScore + secondScore / 2;\nconsole.log(average);"
  }),
  js({
    "id": "js-expression-receipt",
    "number": 8,
    "kind": "program",
    "topic": "Operators and Expressions",
    "title": "Calculate a snack bill",
    "skills": [
      "Multiplication",
      "Subtraction",
      "Assignment",
      "Template literals"
    ],
    "task": "A snack costs £3. A customer buys 4 snacks and pays with £20. Write a program to calculate the bill and the change they should receive.",
    "steps": [
      "Create price with the value 3, quantity with the value 4, and paid with the value 20. Store all three as numbers.",
      "Create total by multiplying price by quantity.",
      "Create change by subtracting total from paid.",
      "Print two messages in the format shown below. Insert the values of total and change into the messages."
    ],
    "expectedOutput": "Total: £12\nChange: £8",
    "checks": [
      "Change quantity to 2 and run again. The messages should be Total: £6 and Change: £14.",
      "The messages should use your calculated variables, so you do not need to edit the console.log lines when quantity changes."
    ]
  }),
  js({
    "id": "js-expression-remainder",
    "number": 9,
    "kind": "program",
    "topic": "Operators and Expressions",
    "title": "Count the leftover counters",
    "skills": [
      "Remainder %",
      "Division",
      "Addition",
      "Expressions"
    ],
    "task": "You have 23 counters and want to put them into groups of 5. You can make 4 full groups, with 3 counters left over. Write a program to work this out and find how many extra counters would complete one more group.",
    "steps": [
      "Create counters with the number 23 and groupSize with the number 5.",
      "Create leftovers using the remainder operator (%). This is how many counters are left after making full groups.",
      "Create needed by subtracting leftovers from groupSize. This is how many extra counters are needed to complete the last group.",
      "Create groupsAfterAdding by adding needed to counters, then dividing that total by groupSize.",
      "Print leftovers, needed, and groupsAfterAdding on separate lines, in that order."
    ],
    "expectedOutput": "3\n2\n5",
    "checks": [
      "The output means: 3 counters left over, 2 extra counters needed, and 5 full groups after adding them.",
      "Change counters to 17 and groupSize to 4. The three output lines should be 1, 3, and 5.",
      "Only use examples with some counters left over for this task. You do not need to handle exact groups yet."
    ]
  }),
  js({
    "id": "js-logic-entry",
    "number": 10,
    "kind": "debug",
    "topic": "Comparisons and Boolean Logic",
    "title": "Fix the entry checks",
    "skills": [
      "===",
      "!==",
      ">=",
      "&&",
      "Booleans"
    ],
    "task": "Someone can enter an event only if they are 16 or older and have an entry pass. The program also checks whether their role is student and whether it is not teacher.",
    "steps": [
      "Fix canEnter so it is true only when age is 16 or above AND hasPass is true.",
      "Fix the second console.log line so it checks whether role is equal to \"student\". Use ===.",
      "Fix the third console.log line so it checks whether role is not equal to \"teacher\". Use !==.",
      "Run the program with the original values shown in the code."
    ],
    "expectedOutput": "false\ntrue\ntrue",
    "checks": [
      "The first line is false because hasPass is false. The second and third lines are true because the role is \"student\", not \"teacher\".",
      "Change hasPass to true and run again. The first line should become true.",
      "Keep hasPass as true, then change age to 15. The first line should become false."
    ],
    "code": "const age = 16;\nconst hasPass = false;\nconst role = \"student\";\nconst canEnter = age > 16 || hasPass;\nconsole.log(canEnter);\nconsole.log(role !== \"student\");\nconsole.log(role === \"teacher\");"
  }),
  js({
    "id": "js-logic-discount",
    "number": 11,
    "kind": "program",
    "topic": "Comparisons and Boolean Logic",
    "title": "Check who gets a discount",
    "skills": [
      "||",
      "&&",
      "!",
      "<=",
      ">",
      "Boolean expressions"
    ],
    "task": "A shop gives a discount to customers who are 18 or younger, or who are students. A suspended customer cannot get a discount, whatever their age or student status.",
    "steps": [
      "Create age with the number 17, isStudent with true, and isSuspended with false.",
      "Create canGetDiscount. It should be true when the customer meets the discount rules above, and false otherwise. Use comparison and logical operators; you do not need an if statement.",
      "Create isOver18. It should be true when age is greater than 18, and false otherwise.",
      "Print canGetDiscount first, then isOver18 on the next line."
    ],
    "expectedOutput": "true\nfalse",
    "checks": [
      "The starting customer gets a discount and is not over 18, so the two lines are true and false.",
      "Set age to 25, isStudent to false, and isSuspended to false. The output should be false, then true.",
      "Keep age as 25 and isSuspended as false, but change isStudent to true. Both lines should now be true.",
      "Now change isSuspended to true. The first line must become false because suspended customers never get a discount."
    ]
  }),
  js({
    "id": "js-if-grades",
    "number": 12,
    "kind": "debug",
    "topic": "If Statements and Decisions",
    "title": "Fix the grade checks",
    "skills": [
      "if",
      "else if",
      "else",
      ">=",
      "Branch order"
    ],
    "task": "The program should print one grade: Distinction for a score of 80 or more, Pass for 50 to 79, or Retry for anything below 50.",
    "steps": [
      "Run the starter with score set to 85. Compare its message with the rules above.",
      "Fix the order of the if and else if checks so a high score gets the correct grade.",
      "Make sure that exactly 80 gets Distinction and exactly 50 gets Pass. Keep the final else for scores below 50."
    ],
    "expectedOutput": "Distinction",
    "checks": [
      "Run separately with each score: 80 should show Distinction; 79 should show Pass; 50 should show Pass; 49 should show Retry.",
      "Each run should print only one grade."
    ],
    "code": "const score = 85;\nif (score > 50) {\n  console.log(\"Pass\");\n} else if (score > 80) {\n  console.log(\"Distinction\");\n} else {\n  console.log(\"Retry\");\n}"
  }),
  js({
    "id": "js-if-delivery",
    "number": 13,
    "kind": "program",
    "topic": "If Statements and Decisions",
    "title": "Work out the delivery charge",
    "skills": [
      "if",
      "else if",
      "else",
      "Multiple conditions"
    ],
    "task": "A shop needs to tell a customer whether delivery is free or costs £4. An order total below zero is invalid.",
    "steps": [
      "Create orderTotal with the number 25 and isMember with true.",
      "First, check whether orderTotal is below 0. If it is, print \"Invalid total\".",
      "Otherwise, delivery is free if orderTotal is 30 or more OR isMember is true. Print \"Free delivery\" in either case.",
      "For all other orders, print \"Delivery: £4\". Use one if / else if / else chain."
    ],
    "expectedOutput": "Free delivery",
    "checks": [
      "With orderTotal 25 and isMember false, expect Delivery: £4.",
      "With orderTotal 30 and isMember false, expect Free delivery.",
      "With orderTotal -1 and isMember true, expect Invalid total.",
      "With orderTotal 0 and isMember false, expect Delivery: £4."
    ]
  }),
  js({
    "id": "js-array-indexes",
    "number": 14,
    "kind": "debug",
    "topic": "Arrays",
    "title": "Fix the team names",
    "skills": [
      "Arrays",
      "Zero-based indexes",
      ".length",
      "Changing elements"
    ],
    "task": "The array contains three team members. The program should print the first and last names, replace the second name with Maya, then print how many names are in the array.",
    "steps": [
      "Fix the first console.log so it reads the first name. Remember that array positions start at 0.",
      "Fix the second console.log so it reads the last name using team.length.",
      "Fix the line that assigns \"Maya\" so it replaces Ben, rather than adding a fourth person."
    ],
    "expectedOutput": "Asha\nLeo\n3",
    "checks": [
      "After the program runs, the array should contain \"Asha\", \"Maya\", and \"Leo\", in that order.",
      "You can temporarily add console.log(team) at the end to inspect the array."
    ],
    "code": "const team = [\"Asha\", \"Ben\", \"Leo\"];\nconsole.log(team[1]);\nconsole.log(team[team.length]);\nteam[3] = \"Maya\";\nconsole.log(team.length);"
  }),
  js({
    "id": "js-array-kit",
    "number": 15,
    "kind": "program",
    "topic": "Arrays",
    "title": "Change the items in a kit",
    "skills": [
      "Arrays",
      "Indexes",
      "push()",
      "pop()",
      ".length"
    ],
    "task": "Use an array to store and change the items in an activity kit.",
    "steps": [
      "Create a const array called kit with the strings \"pen\", \"ruler\", and \"tape\", in that order.",
      "Change the second item from \"ruler\" to \"pencil\".",
      "Use push() to add \"scissors\" to the end.",
      "Use pop() to remove the last item. Store the value returned by pop() in a variable called removed.",
      "Print removed, kit’s first item, kit’s second item, and kit.length. Use one console.log() for each."
    ],
    "expectedOutput": "scissors\npen\npencil\n3",
    "checks": [
      "The final kit should contain \"pen\", \"pencil\", and \"tape\". You do not need a loop for this task."
    ]
  }),
  js({
    "id": "js-loop-countdown",
    "number": 16,
    "kind": "debug",
    "topic": "Loops: Repeating Code",
    "title": "Fix the countdown",
    "skills": [
      "for loops",
      "Start / condition / change",
      "Loop termination"
    ],
    "task": "The loop should count down from 5 to 1, then print Go! It currently keeps counting in the wrong direction.",
    "steps": [
      "Read the for line before running it. Look at how count changes after each turn through the loop.",
      "Fix that change so count gets smaller and the loop eventually stops.",
      "Run the repaired code. If you run the broken version, click Stop to end it."
    ],
    "expectedOutput": "5\n4\n3\n2\n1\nGo!",
    "checks": [
      "Zero should not appear.",
      "Change the starting count to 3 and run again. You should see 3, 2, 1, and Go! on separate lines."
    ],
    "code": "for (let count = 5; count >= 1; count++) {\n  console.log(count);\n}\nconsole.log(\"Go!\");"
  }),
  js({
    "id": "js-loop-table",
    "number": 17,
    "kind": "program",
    "topic": "Loops: Repeating Code",
    "title": "Print the three-times table",
    "skills": [
      "for loops",
      "Counter variables",
      "Multiplication",
      "Template literals"
    ],
    "task": "Write a for loop that prints the first five lines of the three-times table.",
    "steps": [
      "Create a variable called table with the number 3.",
      "Use a for loop with a counter that starts at 1 and finishes at 5.",
      "Inside the loop, multiply table by the counter. Print the calculation and answer in the format shown below."
    ],
    "expectedOutput": "3 x 1 = 3\n3 x 2 = 6\n3 x 3 = 9\n3 x 4 = 12\n3 x 5 = 15",
    "checks": [
      "Change table to 4 and run again. The first line should be 4 x 1 = 4 and the last should be 4 x 5 = 20.",
      "Your program should print exactly five lines using the loop."
    ]
  }),
  js({
    "id": "js-while-charge",
    "number": 18,
    "kind": "debug",
    "topic": "Loops: Repeating Code",
    "title": "Fix the battery charge",
    "skills": [
      "while loops",
      "Reassignment",
      "Loop conditions"
    ],
    "task": "A battery starts at 20% charge. Each turn through the loop should add 20, then print the new charge. The loop should stop when it reaches 100%.",
    "steps": [
      "Fix the line inside the loop so it changes the value stored in charge.",
      "Fix the while condition so the loop does not add any more charge once charge reaches 100.",
      "Run the repaired code. If you run the broken version, click Stop to end it."
    ],
    "expectedOutput": "40\n60\n80\n100",
    "checks": [
      "The program should stop at 100 and never print 120.",
      "Change the starting charge to 100 and run again. Nothing should be printed because the battery is already full."
    ],
    "code": "let charge = 20;\nwhile (charge <= 100) {\n  charge + 20;\n  console.log(charge);\n}"
  }),
  js({
    "id": "js-array-loop-total",
    "number": 19,
    "kind": "debug",
    "topic": "Looping Through Arrays",
    "title": "Fix the total score",
    "skills": [
      "Arrays",
      "for loops",
      ".length",
      "Accumulators"
    ],
    "task": "The program should add all the numbers in scores and print their total. It currently starts at the wrong position and goes past the end of the array.",
    "steps": [
      "Fix the starting value of i so the loop includes the first score.",
      "Fix the loop condition so it stops before trying to read a position that does not exist.",
      "Keep total starting at 0 before the loop. Each turn should add one score to total."
    ],
    "expectedOutput": "14",
    "checks": [
      "Replace the scores array with [9] and run: the total should be 9.",
      "Replace it with [] and run: the total should be 0."
    ],
    "code": "const scores = [4, 7, 3];\nlet total = 0;\nfor (let i = 1; i <= scores.length; i++) {\n  total += scores[i];\n}\nconsole.log(total);"
  }),
  js({
    "id": "js-array-loop-passes",
    "number": 20,
    "kind": "program",
    "topic": "Looping Through Arrays",
    "title": "Add the scores and count the passes",
    "skills": [
      "for...of",
      "Arrays",
      "Counting",
      "Accumulators",
      "if"
    ],
    "task": "Write a program that adds all the scores and counts how many are 50 or above. A score of exactly 50 is a pass.",
    "steps": [
      "Create scores containing the numbers 35, 50, 80, and 45.",
      "Before the loop, create two let variables starting at 0: total and passes.",
      "Use a for...of loop to read each score. Add it to total. If it is 50 or more, add 1 to passes.",
      "After the loop, print total and passes in the format below."
    ],
    "expectedOutput": "Total: 210\nPasses: 2",
    "checks": [
      "With scores set to [50], expect Total: 50 and Passes: 1.",
      "With scores set to [], expect Total: 0 and Passes: 0."
    ]
  }),
  js({
    "id": "js-function-call",
    "number": 21,
    "kind": "debug",
    "topic": "Functions: Reusable Code",
    "title": "Fix the function calls",
    "skills": [
      "Function declarations",
      "Parameters",
      "Arguments",
      "Calling functions"
    ],
    "task": "The greet function already knows how to print a greeting. Fix the lines below it so it greets Asha and then Ben.",
    "steps": [
      "Fix greet(Asha) so it sends the text \"Asha\" into the function.",
      "Change the last line so it calls greet with the text \"Ben\".",
      "Leave the function itself unchanged and run the program."
    ],
    "expectedOutput": "Hello Asha\nHello Ben",
    "checks": [
      "Try adding one more call for \"Jo\". It should add Hello Jo as a third line."
    ],
    "code": "function greet(name) {\n  console.log(\"Hello \" + name);\n}\ngreet(Asha);\ngreet;"
  }),
  js({
    "id": "js-function-badges",
    "number": 22,
    "kind": "program",
    "topic": "Functions: Reusable Code",
    "title": "Write a badge-printing function",
    "skills": [
      "Functions",
      "Parameters",
      "Arguments",
      "Template literals"
    ],
    "task": "Write one function that prints a person’s name and their role. Call it twice to print two different badges.",
    "steps": [
      "Declare a function called printBadge with two parameters: name and role.",
      "Inside the function, use console.log() to print the name, a dash, and the role, as shown below.",
      "Call printBadge with \"Asha\" and \"Designer\". Then call it with \"Ben\" and \"Tester\"."
    ],
    "expectedOutput": "Asha — Designer\nBen — Tester",
    "checks": [
      "The function should use its parameters in the message. Changing the names in the calls should change the output.",
      "This function prints its message directly with console.log(); it does not need to return a value."
    ]
  }),
  js({
    "id": "js-return-total",
    "number": 23,
    "kind": "debug",
    "topic": "Functions and Return Values",
    "title": "Fix the returned price",
    "skills": [
      "return",
      "console.log vs return",
      "Function results"
    ],
    "task": "calculateTotal should give back the cost of the snacks. The code below the function then adds £2 for delivery. At the moment, the function only prints the cost, so the final calculation fails.",
    "steps": [
      "Inside calculateTotal, use return to give back unitPrice multiplied by quantity.",
      "Keep the final console.log below the function. It should print the returned cost plus 2.",
      "Run the program."
    ],
    "expectedOutput": "14",
    "checks": [
      "Only the final result should be printed.",
      "Change the function call to calculateTotal(5, 2) and run again. The result should be 12: £10 for snacks plus £2 delivery."
    ],
    "code": "function calculateTotal(unitPrice, quantity) {\n  console.log(unitPrice * quantity);\n}\nconst subtotal = calculateTotal(3, 4);\nconsole.log(subtotal + 2);"
  }),
  js({
    "id": "js-return-area",
    "number": 24,
    "kind": "program",
    "topic": "Functions and Return Values",
    "title": "Return the area of a rectangle",
    "skills": [
      "return",
      "Parameters",
      "Receiving results",
      "Combining function results"
    ],
    "task": "Write a function that calculates a rectangle’s area. Use it to find the combined area of two rectangular floors.",
    "steps": [
      "Declare rectangleArea with parameters width and height.",
      "Inside the function, return width multiplied by height. Do not print inside this function.",
      "Call rectangleArea for a floor 4 metres wide and 3 metres long. Store the returned number in a variable.",
      "Call it again for a floor 5 metres wide and 2 metres long. Store this result too.",
      "Add the two returned numbers and print the total."
    ],
    "expectedOutput": "22",
    "checks": [
      "To test the function separately, print rectangleArea(0, 8). It should show 0.",
      "Print rectangleArea(2, 7). It should show 14."
    ]
  }),
  js({
    "id": "js-scope-message",
    "number": 25,
    "kind": "debug",
    "topic": "Scope",
    "title": "Fix where message is created",
    "skills": [
      "Block scope",
      "Function scope",
      "return",
      "let"
    ],
    "task": "The function creates message inside the if or else curly brackets. The return line is outside those brackets, so it cannot use either of those message variables.",
    "steps": [
      "Change the code so the function returns \"Welcome\" when isMember is true and \"Join first\" when it is false.",
      "Keep any message variable inside the function. Do not move it above the function.",
      "Run the program with makeMessage(true) in the final console.log."
    ],
    "expectedOutput": "Welcome",
    "checks": [
      "Change the call to makeMessage(false) and run again. It should print Join first.",
      "Try printing the results of makeMessage(true), makeMessage(false), and makeMessage(true) in one run. You should see Welcome, Join first, and Welcome."
    ],
    "code": "function makeMessage(isMember) {\n  if (isMember) {\n    const message = \"Welcome\";\n  } else {\n    const message = \"Join first\";\n  }\n  return message;\n}\nconsole.log(makeMessage(true));"
  }),
  js({
    "id": "js-scope-points",
    "number": 26,
    "kind": "program",
    "topic": "Scope",
    "title": "Add a bonus inside a function",
    "skills": [
      "Global scope",
      "Function scope",
      "Local variables",
      "Parameters"
    ],
    "task": "Write a function that adds 5 to the points it receives. The points variable outside the function should keep its original value.",
    "steps": [
      "Create const points = 10 outside the function.",
      "Declare a function called addBonus with one parameter, also called points.",
      "Inside addBonus, create const bonus = 5. Return the parameter points plus bonus.",
      "Below the function, print addBonus(points). On the next line, print the outside points variable."
    ],
    "expectedOutput": "15\n10",
    "checks": [
      "Try addBonus(20): it should return 25. The outside points variable should still be 10.",
      "bonus is created inside the function, so code outside the function cannot use it."
    ]
  }),
  js({
    "id": "js-object-properties",
    "number": 27,
    "kind": "debug",
    "topic": "Objects",
    "title": "Fix the product details",
    "skills": [
      "Object literals",
      "Dot notation",
      "Bracket notation",
      "Property names"
    ],
    "task": "The program should print the product’s name and price, change its stock to 3, then print the new stock. Property names must match the names in the object.",
    "steps": [
      "Fix the first console.log so it reads the name property.",
      "The variable key contains \"price\". Fix the second console.log to use that variable to choose which property to read.",
      "Fix the assignment so it changes the existing stock property. Do not create a new property with a capital S."
    ],
    "expectedOutput": "Notebook\n4\n3",
    "checks": [
      "The product should still have just three properties: name, price, and stock.",
      "You can temporarily print product at the end to inspect its properties."
    ],
    "code": "const product = { name: \"Notebook\", price: 4, stock: 5 };\nconst key = \"price\";\nconsole.log(product.Name);\nconsole.log(product.key);\nproduct.Stock = 3;\nconsole.log(product.stock);"
  }),
  js({
    "id": "js-object-player",
    "number": 28,
    "kind": "program",
    "topic": "Objects",
    "title": "Create and update a player",
    "skills": [
      "Objects",
      "Key/value pairs",
      "Dot notation",
      "Bracket notation",
      "Changing properties"
    ],
    "task": "Store a player’s details together in an object, then increase their score.",
    "steps": [
      "Create an object called player. Give it three properties: name containing \"Jo\", score containing 10, and active containing true.",
      "Use player.score to increase the score by 5.",
      "Create a variable called field containing the string \"name\".",
      "Print player[field], then player.score, then player.active. Use a separate console.log() for each."
    ],
    "expectedOutput": "Jo\n15\ntrue",
    "checks": [
      "Change field from \"name\" to \"score\" and run again. The output should now be 15, 15, and true.",
      "The square brackets let field choose which property to read."
    ]
  }),
  js({
    "id": "js-nested-roster",
    "number": 29,
    "kind": "debug",
    "topic": "Arrays of Objects and Nested Data",
    "title": "Fix the student report",
    "skills": [
      "Arrays of objects",
      "Nested properties",
      "Array indexes",
      "for...of"
    ],
    "task": "Each student has a name, an address object, and a scores array. Print the first student’s city, then each student’s name and first score.",
    "steps": [
      "Fix the first console.log so it reads the city from the first student in the students array.",
      "Inside the loop, use student to read the student currently being processed.",
      "Read that student’s first score, remembering that the first array position is 0."
    ],
    "expectedOutput": "Leeds\nAsha: 8\nBen: 6",
    "checks": [
      "Add a third student with a name, address, and at least one score. The loop should print their name and first score too."
    ],
    "code": "const students = [\n  { name: \"Asha\", address: { city: \"Leeds\" }, scores: [8, 9] },\n  { name: \"Ben\", address: { city: \"York\" }, scores: [6, 7] }\n];\nconsole.log(students.address.city);\nfor (const student of students) {\n  console.log(`${students.name}: ${student.scores[1]}`);\n}"
  }),
  js({
    "id": "js-nested-basket",
    "number": 30,
    "kind": "program",
    "topic": "Arrays of Objects and Nested Data",
    "title": "Calculate the basket total",
    "skills": [
      "Arrays of objects",
      "Nested objects",
      "Loops",
      "Accumulators"
    ],
    "task": "A basket contains 3 pens costing £2 each and 2 pads costing £4 each. Store this information and calculate the cost of each group of items and the whole basket.",
    "steps": [
      "Create an array called basket with two objects, one for the pens and one for the pads.",
      "Each object needs a product property and a quantity property. product should itself be an object with name and price properties.",
      "For the first item, use name \"Pen\", price 2, and quantity 3. For the second, use name \"Pad\", price 4, and quantity 2.",
      "Loop through basket. For each item, multiply its product price by its quantity and print the name and cost.",
      "Add these costs together and print the basket total after the loop."
    ],
    "expectedOutput": "Pen: £6\nPad: £8\nTotal: £14",
    "checks": [
      "Change the pen quantity to 0. The lines should become Pen: £0, Pad: £8, and Total: £8.",
      "Set basket to an empty array, []. The only output should be Total: £0."
    ]
  }),
  js({
    "id": "js-debug-syntax",
    "number": 31,
    "kind": "debug",
    "topic": "Reading Errors and Debugging JavaScript",
    "title": "Fix the missing punctuation",
    "skills": [
      "Syntax errors",
      "Reading errors",
      "Object literals",
      "Systematic debugging"
    ],
    "task": "JavaScript cannot run this program because a punctuation mark is missing from the order object.",
    "steps": [
      "Click Run and read the error message. Check the line mentioned in the error and the line above it.",
      "Add the missing punctuation. Keep the price, quantity, and calculation unchanged.",
      "Run again to check the result."
    ],
    "expectedOutput": "Total: £6",
    "checks": [
      "Change quantity to 4 and run again. The message should be Total: £8.",
      "This was a syntax error: the code broke a JavaScript writing rule, so the program could not start."
    ],
    "code": "const order = {\n  price: 2\n  quantity: 3\n};\nconsole.log(`Total: £${order.price * order.quantity}`);"
  }),
  js({
    "id": "js-debug-runtime",
    "number": 32,
    "kind": "debug",
    "topic": "Reading Errors and Debugging JavaScript",
    "title": "Fix the missing student",
    "skills": [
      "Runtime errors",
      "Undefined values",
      "Array bounds",
      "Systematic debugging"
    ],
    "task": "The program prints its first message, then stops with an error. It tries to read a student at an array position that does not exist.",
    "steps": [
      "Run the code and notice which message appears before the error.",
      "The array contains just one student. Fix the position used to read that student’s name.",
      "Keep all three console.log lines and run again."
    ],
    "expectedOutput": "Starting report\nAsha\nFinished report",
    "checks": [
      "Change the student’s name to \"Jo\". The middle line should change to Jo.",
      "This was a runtime error: the program started, but failed when it reached the incorrect array access."
    ],
    "code": "const students = [{ name: \"Asha\" }];\nconsole.log(\"Starting report\");\nconsole.log(students[1].name);\nconsole.log(\"Finished report\");"
  }),
  js({
    "id": "js-debug-logic",
    "number": 33,
    "kind": "debug",
    "topic": "Reading Errors and Debugging JavaScript",
    "title": "Fix the pass count",
    "skills": [
      "Logic errors",
      "Boundary tests",
      "Loops",
      "Conditions"
    ],
    "task": "A score of 50 or more is a pass. The program runs without an error message, but it counts too few passes.",
    "steps": [
      "Look at the scores and count how many should pass before you run the code.",
      "Run the code and compare its result with your count.",
      "Fix the if condition so a score of exactly 50 is counted."
    ],
    "expectedOutput": "2",
    "checks": [
      "Run with scores set to [50]: expect 1.",
      "Run with scores set to [49]: expect 0.",
      "Run with scores set to []: expect 0.",
      "This was a logic error: the code ran, but used the wrong rule and produced the wrong answer."
    ],
    "code": "const scores = [50, 80, 20];\nlet passes = 0;\nfor (const score of scores) {\n  if (score > 50) {\n    passes++;\n  }\n}\nconsole.log(passes);"
  }),
  js({
    "id": "js-debug-test-cases",
    "number": 34,
    "kind": "program",
    "topic": "Reading Errors and Debugging JavaScript",
    "title": "Test the pass mark",
    "skills": [
      "Test cases",
      "Functions",
      "return",
      "Strict equality",
      "Boundary values"
    ],
    "task": "Write a function that decides whether a score is a pass. Then write three checks to find out whether your function gives the right answers.",
    "steps": [
      "Write isPassing(score). It should return true for 50 or more, and false for anything below 50.",
      "Test score 49 by comparing isPassing(49) with false using ===. Print the comparison result after the label \"49: \".",
      "Test score 50 by comparing isPassing(50) with true. Print the result after \"50: \".",
      "Test score 51 in the same way, expecting true. Print the result after \"51: \"."
    ],
    "expectedOutput": "49: true\n50: true\n51: true",
    "checks": [
      "Here, true means your function gave the expected answer. The 49 check is true because the function correctly returned false for a failing score.",
      "Temporarily change the function’s rule from >= 50 to > 50. Run again: the 50 check should now say false, showing that it found the mistake.",
      "Change the rule back to >= 50 before finishing. All three checks should say true again."
    ]
  }),
  js({
    "id": "js-project-library",
    "number": 35,
    "kind": "program",
    "topic": "JavaScript Basics Practice / Mini Project",
    "title": "Build a library report",
    "skills": [
      "Variables",
      "Objects",
      "Arrays",
      "Loops",
      "Conditions",
      "Functions",
      "return"
    ],
    "task": "Write a console program that lists the books in a small library and shows how many can be borrowed.",
    "steps": [
      "Store three book objects in an array. Use a title string and an available boolean for each book: \"Orbit\" is available, \"River\" is not available, and \"Cloud\" is available.",
      "Print each title followed by \"Available\" when its available value is true, or \"On loan\" when it is false.",
      "Count all the books and the available books. Print both counts at the end.",
      "Use at least one function that returns a value used by your report. You can choose what this function does and how to organise the rest of your code."
    ],
    "expectedOutput": "Orbit: Available\nRiver: On loan\nCloud: Available\nTotal books: 3\nAvailable books: 2",
    "checks": [
      "Change River’s available value to true. Its line should become River: Available and the available count should become 3.",
      "Add a fourth book. The total count should become 4, and the available count should include it only if it is available.",
      "Try an empty books array. Print Total books: 0 and Available books: 0."
    ]
  }),
  js({
    "id": "js-project-results",
    "number": 36,
    "kind": "program",
    "topic": "JavaScript Basics Practice / Mini Project",
    "title": "Build a class results report",
    "skills": [
      "Arrays of objects",
      "Nested data",
      "Functions",
      "return",
      "Loops",
      "Conditions"
    ],
    "task": "Write a console program that calculates each student’s average quiz score and reports whether they passed.",
    "steps": [
      "Create an array of student objects. Each needs a name and a scores array: \"Asha\" has [8, 10], \"Ben\" has [4, 6], and \"Jo\" has [].",
      "For a student with scores, calculate their average: add their scores and divide by how many scores they have.",
      "An average of 6 or more is a Pass. A lower average is a Retry. If the student has no scores, print \"No scores\" for them instead of calculating an average.",
      "Print one line per student in the format below. Then print how many students passed. A student with no scores does not count as a pass.",
      "Use at least one function that returns a value used by the report. Choose how to organise your code."
    ],
    "expectedOutput": "Asha: 9 - Pass\nBen: 5 - Retry\nJo: No scores\nPassed: 1",
    "checks": [
      "Change Ben’s scores to [6, 6]. His line should become Ben: 6 - Pass and the final line should become Passed: 2.",
      "Try an empty students array. The only output should be Passed: 0."
    ]
  }),
  js({
    "id": "js-project-stock-repair",
    "number": 37,
    "kind": "debug",
    "topic": "JavaScript Basics Practice / Mini Project",
    "title": "Fix the stock value report",
    "skills": [
      "Objects",
      "Arrays",
      "Loops",
      "Accumulators",
      "return",
      "Debugging"
    ],
    "task": "A shop has 3 pens worth £2 each and 2 pads worth £4 each. The program should calculate the value of all these items: £6 for the pens plus £8 for the pads makes £14.",
    "steps": [
      "Run the starter and fix one problem at a time.",
      "Make the loop visit each product once, without going past the end of the array.",
      "For each product, multiply price by stock. Add that amount to the running total instead of replacing the previous total.",
      "Make stockValue return the total. Keep the console.log below the function to print the final message."
    ],
    "expectedOutput": "Stock value: £14",
    "checks": [
      "Change the pen stock to 0. The result should be Stock value: £8.",
      "Try stockValue([]). The result should be Stock value: £0.",
      "Only the final message should appear; the function should not print extra totals."
    ],
    "code": "const products = [\n  { name: \"Pen\", price: 2, stock: 3 },\n  { name: \"Pad\", price: 4, stock: 2 }\n];\nfunction stockValue(items) {\n  let total = 0;\n  for (let i = 0; i <= items.length; i++) {\n    total = items[i].price + items[i].stock;\n  }\n  console.log(total);\n}\nconsole.log(`Stock value: £${stockValue(products)}`);"
  })
];
