export const interfaceTerminals = {
  "powershell": {
    "prompt": "PS C:\\Users\\Student>",
    "commands": [
      {
        "command": "Get-Date",
        "output": "08 September 2026 10:15:00\nExample date and time — fixed for this simulation."
      },
      {
        "command": "Get-Location",
        "output": "Path\n----\nC:\\Users\\Student"
      },
      {
        "command": "Get-ChildItem",
        "output": "Name             Type\n----             ----\nDocuments        Folder\nPictures         Folder\nassignment.txt   File\nnotes.txt        File"
      },
      {
        "command": "Get-Process",
        "output": "Process       ID    CPU (seconds)\nbrowser       124   42.8\neditor        248   18.2\nmusic         372   6.1\nsystem        4     95.0\nfilemanager   510   3.4\nnotes         624   1.2"
      },
      {
        "command": "Get-Help Get-Process",
        "output": "NAME\n    Get-Process\nPURPOSE\n    Shows running processes.\nEXAMPLE\n    Get-Process\nThis is a shortened teaching help entry."
      },
      {
        "command": "Get-Process | Sort-Object CPU -Descending",
        "output": "Process       ID    CPU (seconds)\nsystem        4     95.0\nbrowser       124   42.8\neditor        248   18.2\nmusic         372   6.1\nfilemanager   510   3.4\nnotes         624   1.2"
      },
      {
        "command": "Get-Process | Sort-Object CPU -Descending | Select-Object -First 5",
        "output": "Process       ID    CPU (seconds)\nsystem        4     95.0\nbrowser       124   42.8\neditor        248   18.2\nmusic         372   6.1\nfilemanager   510   3.4"
      }
    ]
  }
}

export const interfaceScenarios = {
  "files": {
    "title": "Rename 500 files using one naming rule.",
    "acceptedPairs": [
      [
        "cli",
        "automation"
      ]
    ],
    "explanation": "CLI scripting is a strong fit for repetition. A GUI batch-renaming tool could also be suitable if available; explain its batch capability rather than claiming all GUIs require individual clicks."
  },
  "ticket": {
    "title": "A tourist needs a ticket from a public machine.",
    "acceptedPairs": [
      [
        "menu",
        "guided"
      ]
    ],
    "explanation": "Menu-based describes the guided workflow, even when the ticket options are graphical touch buttons."
  },
  "image": {
    "title": "A designer needs to crop and retouch a complex image.",
    "acceptedPairs": [
      [
        "gui",
        "visual"
      ]
    ],
    "explanation": "A GUI gives direct manipulation and visual feedback. CLI image tools may help batch processing, but this task needs visual judgement."
  },
  "server": {
    "title": "An experienced administrator checks remote servers over a limited connection.",
    "acceptedPairs": [
      [
        "cli",
        "remote"
      ]
    ],
    "explanation": "CLI offers efficient text-based remote control. A web GUI could help occasional administration if the connection and available tools suit it."
  },
  "tests": {
    "title": "A developer repeatedly runs the same project tests.",
    "acceptedPairs": [
      [
        "cli",
        "automation"
      ]
    ],
    "explanation": "A repeatable command can be scripted. The developer can still use a graphical IDE to edit and debug."
  },
  "till": {
    "title": "A restaurant till shows large dish buttons and guides staff through order options.",
    "acceptedPairs": [
      [
        "menu",
        "guided"
      ],
      [
        "gui",
        "guided"
      ]
    ],
    "explanation": "Both choices are defensible here: the controls are graphical and the dominant workflow is guided menu selection. Explain both aspects for a stronger answer."
  }
}
