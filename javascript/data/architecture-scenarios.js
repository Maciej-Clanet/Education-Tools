export const architectureScenarios = {
  "a": {
    "acceptedPairs": [
      [
        "von",
        "shared"
      ]
    ],
    "incompleteMessage": "Choose a model and its architectural evidence.",
    "successMessage": "Supported reasoning.",
    "retryMessage": "Reconsider the memory and pathways shown.",
    "explanation": "The shared store and pathway identify the classic Von Neumann arrangement; instruction/data traffic may compete."
  },
  "b": {
    "acceptedPairs": [
      [
        "harvard",
        "separate"
      ]
    ],
    "incompleteMessage": "Choose a model and its architectural evidence.",
    "successMessage": "Supported reasoning.",
    "retryMessage": "Reconsider the memory and pathways shown.",
    "explanation": "The separate memories and paths identify Harvard, allowing instruction and data accesses to use independent routes."
  },
  "c": {
    "acceptedPairs": [
      [
        "modified",
        "mixed"
      ]
    ],
    "incompleteMessage": "Choose a model and its architectural evidence.",
    "successMessage": "Supported reasoning.",
    "retryMessage": "Reconsider the memory and pathways shown.",
    "explanation": "Shared main memory combined with separate instruction/data caches is a modified-Harvard or hybrid arrangement. Explain the level being described."
  }
}
