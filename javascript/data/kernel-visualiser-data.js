// Deterministic conceptual snapshots, not an OS emulator.
export const kernelSequences = {
  "start": {
    "title": "Open the browser",
    "nodes": [
      {
        "id": "browser",
        "label": "Browser",
        "layer": "Applications"
      },
      {
        "id": "process",
        "label": "Process management",
        "layer": "Kernel"
      },
      {
        "id": "memory",
        "label": "Memory management",
        "layer": "Kernel"
      },
      {
        "id": "ssd",
        "label": "SSD: stored program",
        "layer": "Hardware"
      },
      {
        "id": "cpu",
        "label": "CPU",
        "layer": "Hardware"
      }
    ],
    "frames": [
      {
        "title": "Program on SSD",
        "detail": "The browser program is stored software; it is not yet this running process.",
        "active": [
          "ssd"
        ]
      },
      {
        "title": "Read the program",
        "detail": "The user opens the browser. The OS reads the instructions and data it needs from storage.",
        "active": [
          "browser",
          "ssd"
        ]
      },
      {
        "title": "Allocate RAM",
        "detail": "The kernel allocates working memory for the new process.",
        "active": [
          "memory"
        ],
        "ram": [
          "Kernel",
          "Kernel",
          "Browser",
          "Browser",
          "Browser"
        ]
      },
      {
        "title": "Create a process",
        "detail": "The OS creates a running instance and records its resources. These setup tasks may overlap in a real OS.",
        "active": [
          "process"
        ],
        "ram": [
          "Kernel",
          "Kernel",
          "Browser",
          "Browser",
          "Browser"
        ]
      },
      {
        "title": "Assign CPU time",
        "detail": "The kernel schedules work from the process so its instructions can execute.",
        "active": [
          "process",
          "cpu"
        ],
        "ram": [
          "Kernel",
          "Kernel",
          "Browser",
          "Browser",
          "Browser"
        ]
      },
      {
        "title": "Browser ready",
        "detail": "The browser becomes usable. The kernel continues managing its resources while it runs.",
        "active": [
          "browser"
        ],
        "ram": [
          "Kernel",
          "Kernel",
          "Browser",
          "Browser",
          "Browser"
        ]
      }
    ],
    "ram": true
  },
  "life": {
    "title": "Run, close, release",
    "nodes": [
      {
        "id": "browser",
        "label": "Browser",
        "layer": "Applications"
      },
      {
        "id": "process",
        "label": "Process management",
        "layer": "Kernel"
      },
      {
        "id": "memory",
        "label": "Memory management",
        "layer": "Kernel"
      },
      {
        "id": "ssd",
        "label": "SSD: stored program",
        "layer": "Hardware"
      },
      {
        "id": "cpu",
        "label": "CPU",
        "layer": "Hardware"
      }
    ],
    "frames": [
      {
        "title": "Process active",
        "detail": "The kernel tracks memory, CPU scheduling, open files and hardware requests.",
        "active": [
          "process",
          "cpu"
        ],
        "ram": [
          "Kernel",
          "Kernel",
          "Browser",
          "Browser",
          "Browser"
        ]
      },
      {
        "title": "Process ends",
        "detail": "Work from this process is removed from scheduling; its files and other resources are released.",
        "active": [
          "process"
        ],
        "ram": [
          "Kernel",
          "Kernel",
          "Browser",
          "Browser",
          "Browser"
        ]
      },
      {
        "title": "Memory reclaimed",
        "detail": "Its allocated RAM becomes available again. The stored program remains on the SSD.",
        "active": [
          "memory",
          "ssd"
        ],
        "ram": [
          "Kernel",
          "Kernel"
        ]
      }
    ],
    "ram": true
  },
  "call": {
    "title": "Save a file: which code is executing?",
    "execution": true,
    "nodes": [
      {
        "id": "app",
        "label": "Word / editor code · USER MODE",
        "layer": "Code the CPU can execute"
      },
      {
        "id": "kernel",
        "label": "Trusted kernel code · KERNEL MODE",
        "layer": "Code the CPU can execute"
      }
    ],
    "frames": [
      {
        "title": "Application code is executing",
        "detail": "The editor prepares a file to save. Its code cannot directly perform arbitrary protected storage operations.",
        "active": [
          "app"
        ],
        "mode": "USER MODE"
      },
      {
        "title": "Application makes a system call",
        "detail": "The editor deliberately requests an OS save service through the system-call mechanism.",
        "active": [
          "app"
        ],
        "mode": "USER MODE · SYSTEM CALL requested"
      },
      {
        "title": "Controlled transition",
        "detail": "Execution transfers to an approved entry point in trusted kernel code. The CPU now executes that code with kernel privileges.",
        "active": [
          "kernel"
        ],
        "mode": "KERNEL MODE · trusted code begins"
      },
      {
        "title": "Kernel code handles the operation",
        "detail": "Kernel code validates the request, checks permissions and works with OS subsystems and drivers to perform permitted storage work on behalf of the editor.",
        "active": [
          "kernel"
        ],
        "mode": "KERNEL MODE"
      },
      {
        "title": "Return to application code",
        "detail": "The kernel returns data, success or an error. Execution resumes in the editor’s code with restricted privileges. Real requests may wait or complete asynchronously.",
        "active": [
          "app"
        ],
        "mode": "USER MODE · RETURN to application"
      }
    ]
  },
  "interrupt": {
    "title": "Handle a keyboard interrupt",
    "nodes": [
      {
        "id": "music",
        "label": "Music process",
        "layer": "Applications"
      },
      {
        "id": "state",
        "label": "Saved process state",
        "layer": "Kernel"
      },
      {
        "id": "handler",
        "label": "Interrupt handler",
        "layer": "Kernel"
      },
      {
        "id": "keyboard",
        "label": "Keyboard / controller",
        "layer": "Hardware"
      },
      {
        "id": "cpu",
        "label": "CPU",
        "layer": "Hardware"
      }
    ],
    "frames": [
      {
        "title": "Process running",
        "detail": "The CPU is executing work from the music process.",
        "active": [
          "music",
          "cpu"
        ]
      },
      {
        "title": "Interrupt received",
        "detail": "A key press is reported through the input hardware. The signal requests CPU attention.",
        "active": [
          "keyboard",
          "cpu"
        ]
      },
      {
        "title": "Save the current state",
        "detail": "Enough state is preserved to resume the interrupted work later; the whole program is not reloaded.",
        "active": [
          "state"
        ]
      },
      {
        "title": "Run the handler",
        "detail": "The CPU executes the appropriate interrupt handler.",
        "active": [
          "handler",
          "cpu"
        ]
      },
      {
        "title": "Deal with the event",
        "detail": "The input event is acknowledged and passed on for processing. Some work may be deferred.",
        "active": [
          "handler"
        ]
      },
      {
        "title": "Restore state",
        "detail": "The saved state is restored for the interrupted work in this simplified sequence.",
        "active": [
          "state"
        ]
      },
      {
        "title": "Resume work",
        "detail": "The music process continues. An interrupt is a normal event, not necessarily an error.",
        "active": [
          "music",
          "cpu"
        ]
      }
    ],
    "trigger": "Send keyboard interrupt"
  },
  "memory": {
    "title": "Allocate working memory",
    "nodes": [
      {
        "id": "apps",
        "label": "Browser · Music · Editor · Game",
        "layer": "Applications"
      },
      {
        "id": "memory",
        "label": "Allocate · track · protect · reclaim",
        "layer": "Kernel"
      },
      {
        "id": "ram",
        "label": "RAM blocks",
        "layer": "Hardware"
      }
    ],
    "frames": [
      {
        "title": "Available RAM",
        "detail": "The OS already uses some RAM. The labelled free blocks are available.",
        "active": [
          "memory",
          "ram"
        ],
        "ram": [
          "Kernel",
          "Kernel"
        ]
      },
      {
        "title": "Open Browser",
        "detail": "The kernel allocates three model blocks to Browser.",
        "active": [
          "memory",
          "ram"
        ],
        "ram": [
          "Kernel",
          "Kernel",
          "Browser",
          "Browser",
          "Browser"
        ]
      },
      {
        "title": "Open Music",
        "detail": "Music receives its own model blocks.",
        "active": [
          "memory",
          "ram"
        ],
        "ram": [
          "Kernel",
          "Kernel",
          "Browser",
          "Browser",
          "Browser",
          "Music",
          "Music"
        ]
      },
      {
        "title": "Open Editor",
        "detail": "Editor receives memory; existing allocations are tracked.",
        "active": [
          "memory",
          "ram"
        ],
        "ram": [
          "Kernel",
          "Kernel",
          "Browser",
          "Browser",
          "Browser",
          "Music",
          "Music",
          "Editor",
          "Editor"
        ]
      },
      {
        "title": "Open Game",
        "detail": "Game receives the remaining blocks in this model. Real allocation sizes vary.",
        "active": [
          "memory",
          "ram"
        ],
        "ram": [
          "Kernel",
          "Kernel",
          "Browser",
          "Browser",
          "Browser",
          "Music",
          "Music",
          "Editor",
          "Editor",
          "Game",
          "Game",
          "Game"
        ]
      }
    ],
    "ram": true
  },
  "reclaim": {
    "title": "Protect and reclaim RAM",
    "nodes": [
      {
        "id": "apps",
        "label": "Browser · Music · Editor · Game",
        "layer": "Applications"
      },
      {
        "id": "memory",
        "label": "Allocate · track · protect · reclaim",
        "layer": "Kernel"
      },
      {
        "id": "ram",
        "label": "RAM blocks",
        "layer": "Hardware"
      }
    ],
    "frames": [
      {
        "title": "Separate allocations",
        "detail": "Each process has allocated memory. Colour and labels identify the owner in this model.",
        "active": [
          "ram"
        ],
        "ram": [
          "Kernel",
          "Kernel",
          "Browser",
          "Browser",
          "Browser",
          "Music",
          "Music",
          "Editor",
          "Editor",
          "Game",
          "Game",
          "Game"
        ]
      },
      {
        "title": "Block an invalid write",
        "detail": "Game tries to overwrite Browser memory. OS and hardware protection restrict this unauthorised access.",
        "active": [
          "memory"
        ],
        "ram": [
          "Kernel",
          "Kernel",
          "Browser",
          "Browser",
          "Browser",
          "Music",
          "Music",
          "Editor",
          "Editor",
          "Game",
          "Game",
          "Game"
        ]
      },
      {
        "title": "Editor closes",
        "detail": "The kernel reclaims Editor memory. Other applications keep their allocations.",
        "active": [
          "memory",
          "ram"
        ],
        "ram": [
          "Kernel",
          "Kernel",
          "Browser",
          "Browser",
          "Browser",
          "Music",
          "Music",
          "Free",
          "Free",
          "Game",
          "Game",
          "Game"
        ]
      }
    ],
    "ram": true
  },
  "cpu": {
    "title": "Share one CPU core",
    "nodes": [
      {
        "id": "apps",
        "label": "Browser · Music · Editor · Download",
        "layer": "Applications"
      },
      {
        "id": "schedule",
        "label": "Scheduler assigns CPU time",
        "layer": "Kernel"
      },
      {
        "id": "cpu",
        "label": "One CPU core",
        "layer": "Hardware"
      }
    ],
    "frames": [
      {
        "title": "Ready to share",
        "detail": "Follow the slices from left to right. Equal widths are illustrative, not a scheduling rule.",
        "active": [
          "schedule"
        ],
        "slice": -1
      },
      {
        "title": "Slice 1: Browser",
        "detail": "The core now executes work from Browser. Other ready work waits for CPU time.",
        "active": [
          "cpu"
        ],
        "slice": 0
      },
      {
        "title": "Slice 2: Music",
        "detail": "The core now executes work from Music. Other ready work waits for CPU time.",
        "active": [
          "cpu"
        ],
        "slice": 1
      },
      {
        "title": "Slice 3: Editor",
        "detail": "The core now executes work from Editor. Other ready work waits for CPU time.",
        "active": [
          "cpu"
        ],
        "slice": 2
      },
      {
        "title": "Slice 4: Browser",
        "detail": "The core now executes work from Browser. Other ready work waits for CPU time.",
        "active": [
          "cpu"
        ],
        "slice": 3
      },
      {
        "title": "Slice 5: Download",
        "detail": "The core now executes work from Download. Other ready work waits for CPU time.",
        "active": [
          "cpu"
        ],
        "slice": 4
      },
      {
        "title": "Slice 6: Music",
        "detail": "The core now executes work from Music. Other ready work waits for CPU time.",
        "active": [
          "cpu"
        ],
        "slice": 5
      }
    ],
    "timeline": [
      "Browser",
      "Music",
      "Editor",
      "Browser",
      "Download",
      "Music"
    ]
  },
  "together": {
    "title": "Notes, music and a download",
    "nodes": [
      {
        "id": "apps",
        "label": "Editor · Music · Download",
        "layer": "Applications"
      },
      {
        "id": "schedule",
        "label": "CPU scheduling",
        "layer": "Kernel"
      },
      {
        "id": "memory",
        "label": "Memory management",
        "layer": "Kernel"
      },
      {
        "id": "cpu",
        "label": "One CPU core",
        "layer": "Hardware"
      }
    ],
    "frames": [
      {
        "title": "Editor receives CPU time",
        "detail": "The active CPU slice changes, while all three processes retain allocated RAM. Being in RAM does not mean executing right now.",
        "active": [
          "schedule",
          "cpu"
        ],
        "slice": 0,
        "ram": [
          "Kernel",
          "Kernel",
          "Editor",
          "Editor",
          "Editor",
          "Music",
          "Music",
          "Download",
          "Download"
        ]
      },
      {
        "title": "Music receives CPU time",
        "detail": "The active CPU slice changes, while all three processes retain allocated RAM. Being in RAM does not mean executing right now.",
        "active": [
          "schedule",
          "cpu"
        ],
        "slice": 1,
        "ram": [
          "Kernel",
          "Kernel",
          "Editor",
          "Editor",
          "Editor",
          "Music",
          "Music",
          "Download",
          "Download"
        ]
      },
      {
        "title": "Download receives CPU time",
        "detail": "The active CPU slice changes, while all three processes retain allocated RAM. Being in RAM does not mean executing right now.",
        "active": [
          "schedule",
          "cpu"
        ],
        "slice": 2,
        "ram": [
          "Kernel",
          "Kernel",
          "Editor",
          "Editor",
          "Editor",
          "Music",
          "Music",
          "Download",
          "Download"
        ]
      },
      {
        "title": "Editor receives CPU time",
        "detail": "The active CPU slice changes, while all three processes retain allocated RAM. Being in RAM does not mean executing right now.",
        "active": [
          "schedule",
          "cpu"
        ],
        "slice": 3,
        "ram": [
          "Kernel",
          "Kernel",
          "Editor",
          "Editor",
          "Editor",
          "Music",
          "Music",
          "Download",
          "Download"
        ]
      },
      {
        "title": "Music receives CPU time",
        "detail": "The active CPU slice changes, while all three processes retain allocated RAM. Being in RAM does not mean executing right now.",
        "active": [
          "schedule",
          "cpu"
        ],
        "slice": 4,
        "ram": [
          "Kernel",
          "Kernel",
          "Editor",
          "Editor",
          "Editor",
          "Music",
          "Music",
          "Download",
          "Download"
        ]
      },
      {
        "title": "Download receives CPU time",
        "detail": "The active CPU slice changes, while all three processes retain allocated RAM. Being in RAM does not mean executing right now.",
        "active": [
          "schedule",
          "cpu"
        ],
        "slice": 5,
        "ram": [
          "Kernel",
          "Kernel",
          "Editor",
          "Editor",
          "Editor",
          "Music",
          "Music",
          "Download",
          "Download"
        ]
      }
    ],
    "timeline": [
      "Editor",
      "Music",
      "Download",
      "Editor",
      "Music",
      "Download"
    ],
    "ram": true
  },
  "disk": {
    "title": "Coordinate storage access",
    "nodes": [
      {
        "id": "editor",
        "label": "Editor save request",
        "layer": "Applications"
      },
      {
        "id": "browser",
        "label": "Browser download request",
        "layer": "Applications"
      },
      {
        "id": "queue",
        "label": "OS checks / queues requests",
        "layer": "Kernel"
      },
      {
        "id": "ssd",
        "label": "Storage operation",
        "layer": "Hardware"
      }
    ],
    "frames": [
      {
        "title": "Two requests",
        "detail": "The editor wants to save while the browser is downloading. Both need storage access.",
        "active": [
          "editor",
          "browser"
        ]
      },
      {
        "title": "Check and coordinate",
        "detail": "The OS checks access and may queue requests. Applications do not independently command the SSD.",
        "active": [
          "queue"
        ]
      },
      {
        "title": "Perform storage work",
        "detail": "The storage stack carries out a request. Other requests remain coordinated.",
        "active": [
          "ssd"
        ]
      },
      {
        "title": "Report completion",
        "detail": "The OS reports a result to the requesting application. The order here is illustrative.",
        "active": [
          "editor"
        ]
      }
    ]
  },
  "open": {
    "title": "Open coursework.docx",
    "nodes": [
      {
        "id": "app",
        "label": "Application",
        "layer": "Applications"
      },
      {
        "id": "files",
        "label": "File-system information",
        "layer": "Kernel"
      },
      {
        "id": "stack",
        "label": "Storage / driver stack",
        "layer": "Kernel"
      },
      {
        "id": "ssd",
        "label": "SSD",
        "layer": "Hardware"
      }
    ],
    "frames": [
      {
        "title": "Ask for a named file",
        "detail": "The application requests Documents/coursework.docx.",
        "active": [
          "app"
        ]
      },
      {
        "title": "Find file information",
        "detail": "The file system locates its directory entry and data locations; access is checked.",
        "active": [
          "files"
        ]
      },
      {
        "title": "Read the data",
        "detail": "The wider storage and driver stack requests a read from the device.",
        "active": [
          "stack",
          "ssd"
        ]
      },
      {
        "title": "Return file data",
        "detail": "The data is made available to the application in memory.",
        "active": [
          "app"
        ]
      }
    ]
  },
  "write": {
    "title": "Save coursework.docx",
    "nodes": [
      {
        "id": "app",
        "label": "Application",
        "layer": "Applications"
      },
      {
        "id": "files",
        "label": "File-system information",
        "layer": "Kernel"
      },
      {
        "id": "stack",
        "label": "Storage / driver stack",
        "layer": "Kernel"
      },
      {
        "id": "ssd",
        "label": "SSD",
        "layer": "Hardware"
      }
    ],
    "frames": [
      {
        "title": "Send changed data",
        "detail": "The application asks the OS to save its data.",
        "active": [
          "app"
        ]
      },
      {
        "title": "Organise the file",
        "detail": "File-system code determines allocation and updates relevant metadata.",
        "active": [
          "files"
        ]
      },
      {
        "title": "Request the write",
        "detail": "The storage and driver stack arranges writes of file data and metadata.",
        "active": [
          "stack",
          "ssd"
        ]
      },
      {
        "title": "Return a result",
        "detail": "The OS reports the outcome. Buffering can separate a returned result from durable storage.",
        "active": [
          "app"
        ]
      }
    ]
  },
  "driver": {
    "title": "Translate a print request",
    "nodes": [
      {
        "id": "app",
        "label": "Application / OS: print page",
        "layer": "Applications"
      },
      {
        "id": "driver",
        "label": "Compatible printer driver",
        "layer": "Kernel"
      },
      {
        "id": "printer",
        "label": "Printer: device commands",
        "layer": "Hardware"
      }
    ],
    "frames": [
      {
        "title": "General request",
        "detail": "An application asks to print without knowing every printer model.",
        "active": [
          "app"
        ]
      },
      {
        "title": "Driver prepares commands",
        "detail": "The appropriate driver translates the OS request into communication supported by this device.",
        "active": [
          "driver"
        ]
      },
      {
        "title": "Hardware responds",
        "detail": "The printer receives suitable commands and produces the page.",
        "active": [
          "printer"
        ]
      }
    ]
  },
  "save-image": {
    "title": "Save an image while music plays",
    "nodes": [
      {
        "id": "editor",
        "label": "Image editor: user mode",
        "layer": "Applications"
      },
      {
        "id": "music",
        "label": "Music process",
        "layer": "Applications"
      },
      {
        "id": "schedule",
        "label": "CPU scheduling",
        "layer": "Kernel"
      },
      {
        "id": "memory",
        "label": "Memory management",
        "layer": "Kernel"
      },
      {
        "id": "gate",
        "label": "System call / privilege",
        "layer": "Kernel"
      },
      {
        "id": "files",
        "label": "File system",
        "layer": "Kernel"
      },
      {
        "id": "disk",
        "label": "Disk access",
        "layer": "Kernel"
      },
      {
        "id": "driver",
        "label": "Storage driver",
        "layer": "Kernel"
      },
      {
        "id": "handler",
        "label": "Interrupt handling",
        "layer": "Kernel"
      },
      {
        "id": "cpu",
        "label": "CPU",
        "layer": "Hardware"
      },
      {
        "id": "ssd",
        "label": "SSD",
        "layer": "Hardware"
      }
    ],
    "frames": [
      {
        "title": "Image editor is a process",
        "detail": "The editor is already running; the music player is another process.",
        "active": [
          "editor"
        ],
        "ram": [
          "Kernel",
          "Kernel",
          "Editor",
          "Editor",
          "Editor",
          "Editor",
          "Music",
          "Music"
        ],
        "slice": -1
      },
      {
        "title": "Image data occupies RAM",
        "detail": "The kernel tracks the memory allocated to the editor and music player.",
        "active": [
          "memory"
        ],
        "ram": [
          "Kernel",
          "Kernel",
          "Editor",
          "Editor",
          "Editor",
          "Editor",
          "Music",
          "Music"
        ],
        "slice": -1
      },
      {
        "title": "Share CPU time",
        "detail": "Work from Editor and Music takes turns on this model core.",
        "active": [
          "schedule",
          "cpu"
        ],
        "slice": 1,
        "ram": [
          "Kernel",
          "Kernel",
          "Editor",
          "Editor",
          "Editor",
          "Editor",
          "Music",
          "Music"
        ]
      },
      {
        "title": "Application in user mode",
        "detail": "The editor cannot directly command protected storage hardware.",
        "active": [
          "editor"
        ],
        "ram": [
          "Kernel",
          "Kernel",
          "Editor",
          "Editor",
          "Editor",
          "Editor",
          "Music",
          "Music"
        ],
        "slice": -1
      },
      {
        "title": "Request a save",
        "detail": "The editor uses an OS service, conceptually entering via a system call.",
        "active": [
          "gate"
        ],
        "ram": [
          "Kernel",
          "Kernel",
          "Editor",
          "Editor",
          "Editor",
          "Editor",
          "Music",
          "Music"
        ],
        "slice": -1
      },
      {
        "title": "Handle protected work",
        "detail": "Kernel code checks the request and coordinates the permitted operation.",
        "active": [
          "gate"
        ],
        "ram": [
          "Kernel",
          "Kernel",
          "Editor",
          "Editor",
          "Editor",
          "Editor",
          "Music",
          "Music"
        ],
        "slice": -1
      },
      {
        "title": "Organise the file",
        "detail": "File-system code determines where data belongs and which metadata needs updating.",
        "active": [
          "files"
        ],
        "ram": [
          "Kernel",
          "Kernel",
          "Editor",
          "Editor",
          "Editor",
          "Editor",
          "Music",
          "Music"
        ],
        "slice": -1
      },
      {
        "title": "Request disk access",
        "detail": "The OS coordinates this write with other storage requests.",
        "active": [
          "disk"
        ],
        "ram": [
          "Kernel",
          "Kernel",
          "Editor",
          "Editor",
          "Editor",
          "Editor",
          "Music",
          "Music"
        ],
        "slice": -1
      },
      {
        "title": "Communicate with the SSD",
        "detail": "The storage driver and controller carry the operation to hardware.",
        "active": [
          "driver",
          "ssd"
        ],
        "ram": [
          "Kernel",
          "Kernel",
          "Editor",
          "Editor",
          "Editor",
          "Editor",
          "Music",
          "Music"
        ],
        "slice": -1
      },
      {
        "title": "Completion event",
        "detail": "The device may signal completion using an interrupt; the OS handles that event.",
        "active": [
          "handler"
        ],
        "ram": [
          "Kernel",
          "Kernel",
          "Editor",
          "Editor",
          "Editor",
          "Editor",
          "Music",
          "Music"
        ],
        "slice": -1
      },
      {
        "title": "Return to the application",
        "detail": "The OS reports the outcome and application work continues. Music remains a separately managed process.",
        "active": [
          "editor"
        ],
        "slice": 2,
        "ram": [
          "Kernel",
          "Kernel",
          "Editor",
          "Editor",
          "Editor",
          "Editor",
          "Music",
          "Music"
        ]
      }
    ],
    "ram": true,
    "timeline": [
      "Editor",
      "Music",
      "Editor",
      "Music"
    ]
  }
}
