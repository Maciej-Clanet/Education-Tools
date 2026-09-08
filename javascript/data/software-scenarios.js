export const softwareScenarios = {
  "photo": {
    "acceptedPairs": [
      [
        "application",
        "task"
      ]
    ],
    "explanation": "Create a visual work product. Classify by primary purpose, not whether the package is built in or open source.",
    "incompleteMessage": "Choose both a category and its purpose.",
    "successMessage": "Correct category and main purpose.",
    "retryMessage": "Reconsider the main purpose, then the category."
  },
  "copy": {
    "acceptedPairs": [
      [
        "utility",
        "maintain"
      ]
    ],
    "explanation": "Keep recoverable copies of data. Classify by primary purpose, not whether the package is built in or open source.",
    "incompleteMessage": "Choose both a category and its purpose.",
    "successMessage": "Correct category and main purpose.",
    "retryMessage": "Reconsider the main purpose, then the category."
  },
  "protect": {
    "acceptedPairs": [
      [
        "utility",
        "maintain"
      ]
    ],
    "explanation": "Protect the system against malicious software. Classify by primary purpose, not whether the package is built in or open source.",
    "incompleteMessage": "Choose both a category and its purpose.",
    "successMessage": "Correct category and main purpose.",
    "retryMessage": "Reconsider the main purpose, then the category."
  },
  "editor": {
    "acceptedPairs": [
      [
        "application",
        "task"
      ]
    ],
    "explanation": "Help a developer create software. Classify by primary purpose, not whether the package is built in or open source.",
    "incompleteMessage": "Choose both a category and its purpose.",
    "successMessage": "Correct category and main purpose.",
    "retryMessage": "Reconsider the main purpose, then the category."
  },
  "sheet": {
    "acceptedPairs": [
      [
        "application",
        "task"
      ]
    ],
    "explanation": "Help a user analyse financial information. Classify by primary purpose, not whether the package is built in or open source.",
    "incompleteMessage": "Choose both a category and its purpose.",
    "successMessage": "Correct category and main purpose.",
    "retryMessage": "Reconsider the main purpose, then the category."
  },
  "cleanup": {
    "acceptedPairs": [
      [
        "utility",
        "maintain"
      ]
    ],
    "explanation": "Maintain storage by removing unnecessary data. Classify by primary purpose, not whether the package is built in or open source.",
    "incompleteMessage": "Choose both a category and its purpose.",
    "successMessage": "Correct category and main purpose.",
    "retryMessage": "Reconsider the main purpose, then the category."
  },
  "studio": {
    "acceptedPairs": [
      [
        "a",
        "compatibility"
      ],
      [
        "b",
        "cost-control"
      ],
      [
        "c",
        "basic"
      ]
    ],
    "explanation": "",
    "incompleteMessage": "Choose an option and the priority supporting it.",
    "successMessage": "That priority matches the option. Now weigh its limitations.",
    "retryMessage": "That priority is not supported by the option card. Reconsider the evidence.",
    "explanationsByChoice": {
      "a": "A is easiest to justify when PSD compatibility and existing skills are essential. Its £1,500 annual licence cost must fit the total budget; confirm required files work and include renewal costs.",
      "b": "B reduces licence costs and grants source-code rights. It is defensible if real PSD files pass a trial and training/support can be funded. It is not a zero-cost change.",
      "c": "C suits basic low-demand work, but its lack of layered PSD support conflicts with the studio’s existing workflow. It would need a narrower role or an acceptable conversion plan; low price alone is not enough."
    }
  }
}
