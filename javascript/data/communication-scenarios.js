export const communicationScenarios = {
  "channels-sensor": {
    "acceptedPairs": [
      [
        "simplex",
        "point"
      ]
    ],
    "explanation": "Only the sensor sends, so the channel is simplex. The dedicated path joins two devices, so it is point-to-point.",
    "incompleteMessage": "Choose both answers, then check.",
    "successMessage": "Correct.",
    "retryMessage": "Not quite."
  },
  "channels-radios": {
    "acceptedPairs": [
      [
        "half",
        "point"
      ]
    ],
    "explanation": "The radios take turns, so the channel is half-duplex. This link is between the two radios.",
    "incompleteMessage": "Choose both answers, then check.",
    "successMessage": "Correct.",
    "retryMessage": "Not quite."
  },
  "channels-office": {
    "acceptedPairs": [
      [
        "full",
        "point"
      ]
    ],
    "explanation": "Sending at the same time is full-duplex. This one cable is a point-to-point link.",
    "incompleteMessage": "Choose both answers, then check.",
    "successMessage": "Correct.",
    "retryMessage": "Not quite."
  },
  "channels-meters": {
    "acceptedPairs": [
      [
        "half",
        "multi"
      ]
    ],
    "explanation": "Requests and replies take turns: half-duplex. Several devices share the cable: multi-drop.",
    "incompleteMessage": "Choose both answers, then check.",
    "successMessage": "Correct.",
    "retryMessage": "Not quite."
  },
  "channels-alerts": {
    "acceptedPairs": [
      [
        "simplex",
        "multi"
      ]
    ],
    "explanation": "The receivers never send back, so this is simplex. Several devices use the same path, so it is multi-drop.",
    "incompleteMessage": "Choose both answers, then check.",
    "successMessage": "Correct.",
    "retryMessage": "Not quite."
  },
  "methods-desks": {
    "acceptedPairs": [
      [
        "ethernet",
        "fixed"
      ]
    ],
    "explanation": "Ethernet over copper suits fixed PCs with existing sockets. Each PC gets its own wired link.",
    "incompleteMessage": "Choose both answers, then check.",
    "successMessage": "Correct.",
    "retryMessage": "Not quite."
  },
  "methods-buildings": {
    "acceptedPairs": [
      [
        "fibre",
        "distance"
      ]
    ],
    "explanation": "Fibre suits a long, high-capacity cable link and is not affected by electrical interference.",
    "incompleteMessage": "Choose both answers, then check.",
    "successMessage": "Correct.",
    "retryMessage": "Not quite."
  },
  "methods-camera": {
    "acceptedPairs": [
      [
        "usb",
        "direct"
      ]
    ],
    "explanation": "USB provides a direct data connection between these nearby compatible devices.",
    "incompleteMessage": "Choose both answers, then check.",
    "successMessage": "Correct.",
    "retryMessage": "Not quite."
  },
  "methods-warehouse": {
    "acceptedPairs": [
      [
        "wifi",
        "move"
      ]
    ],
    "explanation": "Wi-Fi uses the existing coverage while workers move. Check coverage in every aisle.",
    "incompleteMessage": "Choose both answers, then check.",
    "successMessage": "Correct.",
    "retryMessage": "Not quite."
  },
  "methods-headphones": {
    "acceptedPairs": [
      [
        "bluetooth",
        "near"
      ]
    ],
    "explanation": "Bluetooth suits a nearby phone and headphones. A Wi-Fi network is not required.",
    "incompleteMessage": "Choose both answers, then check.",
    "successMessage": "Correct.",
    "retryMessage": "Not quite."
  },
  "methods-field": {
    "acceptedPairs": [
      [
        "cellular",
        "coverage"
      ]
    ],
    "explanation": "Cellular data uses the available mobile network. Check coverage and data costs.",
    "incompleteMessage": "Choose both answers, then check.",
    "successMessage": "Correct.",
    "retryMessage": "Not quite."
  }
}
