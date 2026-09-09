export const architectureScenarios = {
  "shared": {
    "acceptedPairs": [
      [
        "von",
        "flexible"
      ]
    ],
    "incompleteMessage": "Choose a model and a reason.",
    "successMessage": "Supported reasoning.",
    "retryMessage": "Reconsider the evidence and the selected reason.",
    "explanation": "A shared memory space supports flexible use of that pool. Explain the potential access bottleneck as the trade-off."
  },
  "stream": {
    "acceptedPairs": [
      [
        "harvard",
        "overlap"
      ]
    ],
    "incompleteMessage": "Choose a model and a reason.",
    "successMessage": "Supported reasoning.",
    "retryMessage": "Reconsider the evidence and the selected reason.",
    "explanation": "Separate paths can serve these different transfer types together. Actual throughput still depends on the rest of the design."
  },
  "unknown": {
    "acceptedPairs": [
      [
        "unknown",
        "evidence"
      ]
    ],
    "incompleteMessage": "Choose a model and a reason.",
    "successMessage": "Supported reasoning.",
    "retryMessage": "Reconsider the evidence and the selected reason.",
    "explanation": "A device\u2019s purpose alone does not establish its architecture. Ask about its memory organisation and access requirements."
  }
}
