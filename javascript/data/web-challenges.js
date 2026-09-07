import { javascriptChallenges } from "./challenges/javascript-challenges.js"

// Keep IDs stable: each challenge has its own local workspace.
export const webChallenges = [
  {
    id: "js-console-variables",
    section: "javascript-basics",
    number: 1,
    kind: "debug",
    topic: "Variables and Data Types",
    title: "Repair the score message",
    skills: ["Variables", "console.log", "Case-sensitive names"],
    workspace: {
      title: "Challenge 1: Repair the score message",
      executionMode: "javascript",
      instructions: [
        { type: "p", text: "Fix the code so it shows the name stored in playerName and the number stored in score." },
        { type: "ol", items: [
          "Click Run and read the error message.",
          "In the first console.log line, check the spelling and capital letters of the variable name. It must match playerName at the top of the code.",
          "In the second console.log line, make it print the number stored in score, rather than the word score.",
          "Run the program again."
        ] },
        { type: "p", text: "Expected console output:" },
        { type: "pre", code: "Player: Alex\nScore: 10" },
        { type: "p", text: "Check your work:" },
        { type: "ul", items: ["Change score from 10 to 15 and run again. The second line should become Score: 15 without changing the console.log line."] }
      ],
      sources: [{
        id: "javascript", type: "javascript", label: "JavaScript",
        code: 'const playerName = "Alex";\nconst score = 10;\n\nconsole.log("Player:", playername);\nconsole.log("Score:", "score");'
      }],
      execution: { timeoutMs: 3000, network: { mode: "disabled" } }
    }
  },
  ...javascriptChallenges,
]

export const challengeKinds = { debug: "Debug", program: "Write a program" }

export function findChallenge(id) {
  return webChallenges.find((challenge) => challenge.id === id)
}
