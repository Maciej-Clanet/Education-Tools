import { initCodePreviews } from "../core/code-preview.js"
import { initDebugLabs } from "../core/debug-lab.js"
import { initLessonPage } from "../core/lesson-shell.js"
import { initLiveCodeExamples } from "../core/live-code-example.js"
import { initShorthandVisualizers } from "../core/shorthand-visualizer.js"

const lessonConfig = {
  lessonId: "colours-backgrounds-and-borders",
  defaultContext: "web-development",
  contexts: {
    "web-development": {
      label: "Web Development",
      backHref: "../resources/web-development.html#css-basics",
      backLabel: "Back to Web Development resources",
      previous: {
        title: "Styling text with CSS",
        href: "styling-text-with-css.html",
        description:
          "The previous lesson used properties and values to control text appearance and readability.",
        status: "Live",
      },
      next: {
        title: "CSS units",
        description:
          "Next, compare common CSS units and choose suitable units for different measurements.",
        status: "Planned",
      },
    },
  },
  quiz: {
    storageKey: "lesson-colours-backgrounds-and-borders-quiz",
    passScore: 17,
    version: 1,
  },
}

const liveCodeExamples = [
  {
    id: "colour-background-live",
    title: "Compare text and background colour",
    description:
      "Change navy and lightblue independently. Observe which declaration changes the text and which fills the element area.",
    sources: [
      {
        id: "css",
        type: "css",
        label: "CSS",
        code: `.card {
  color: navy;
  background-color: lightblue;
}`,
      },
    ],
    scaffold: {
      html: `<article class="card">
  <h2>Red Panda</h2>
  <p>Red pandas spend much of their time in trees.</p>
</article>`,
      css: `.card { padding: 24px; }`,
    },
  },
  {
    id: "border-style-live",
    title: "Try four border styles",
    description:
      "Change solid to dashed, dotted, or double. The width and colour stay the same while the line style changes.",
    sources: [
      {
        id: "css",
        type: "css",
        label: "CSS",
        code: `.card {
  border-width: 6px;
  border-style: solid;
  border-color: purple;
}`,
      },
    ],
    scaffold: {
      html: `<article class="card">
  <h2>Border styles</h2>
  <p>Try solid, dashed, dotted, and double.</p>
</article>`,
      css: `.card { padding: 24px; background-color: lightblue; }`,
    },
  },
  {
    id: "radius-shapes-live",
    title: "Try corner radius values",
    description:
      "Change 20px to 0px, 40px, or 50%. The supplied square and rectangle reveal why the starting shape matters.",
    sources: [
      {
        id: "css",
        type: "css",
        label: "CSS",
        code: `.shape {
  border-radius: 20px;
}`,
      },
    ],
    scaffold: {
      html: `<div class="shape-row">
  <div class="shape shape-square">Square</div>
  <div class="shape shape-rectangle">Rectangle</div>
</div>`,
      css: `.shape-row { display: flex; flex-wrap: wrap; gap: 24px; align-items: center; }
.shape { display: grid; place-items: center; border: 4px solid purple; background-color: lightblue; font-weight: bold; }
.shape-square { width: 150px; height: 150px; }
.shape-rectangle { width: 230px; height: 130px; }`,
    },
  },
  {
    id: "card-workshop-live",
    title: "Style the card",
    description:
      "Try changing the background colour, border style, width, colour, and corner radius.",
    defaultSplit: 58,
    sources: [
      {
        id: "html",
        type: "html",
        label: "HTML",
        code: `<article class="card">
  <h2>Red Panda</h2>
  <p>
    Red pandas spend much of their time in trees.
  </p>
</article>`,
      },
      {
        id: "css",
        type: "css",
        label: "CSS",
        code: `.card {
  color: navy;
  background-color: lightblue;
  border: 4px solid purple;
  border-radius: 20px;
}`,
      },
    ],
    scaffold: {
      css: `.card { padding: 24px; }`,
    },
  },
]

const shorthandVisualizers = [
  {
    id: "corner-radius-clockwise",
    property: "border-radius",
    values: ["10px", "20px", "30px", "40px"],
    previewKind: "border-radius",
    previewLabel: "Card",
    title: "Start at the top-left and move clockwise",
    description:
      "Point to, focus, or select a value to reveal the corner it controls. Use the arrow keys to move between values.",
  },
]

function region(text, regionId, label) {
  return { text, regionId, label }
}

const debugTasks = [
  {
    id: "uk-background-spelling",
    mode: "find-and-fix",
    title: "The card background stays unchanged",
    goal: "The card should have a blue background.",
    files: [{
      name: "common.css",
      language: "CSS",
      lines: [
        ".card {",
        ["  ", region("background-colour", "uk-colour-property", "property using UK spelling"), ": blue;"],
        "}",
      ],
    }],
    issues: [{
      id: "css-color-spelling",
      regionId: "uk-colour-property",
      correctRepairId: "background-color",
      foundFeedback: "You found the property written with UK spelling.",
      repairFeedback: "The browser now recognises background-color.",
      hints: ["CSS uses the American spelling color in property names."],
    }],
    repairOptions: [
      { id: "background-color", label: "background-color", replacement: "background-color" },
      { id: "colour-background", label: "colour-background", replacement: "colour-background" },
      { id: "background", label: "background-colour", replacement: "background-colour" },
    ],
    preview: {
      broken: { title: "Card", html: '<div class="colour-debug-card"><span>Property ignored</span>Red Panda</div>' },
      fixed: { title: "Card", html: '<div class="colour-debug-card has-blue-background"><span>background-color applied</span>Red Panda</div>' },
    },
    explanation:
      "CSS property names use color, even in UK English pages. The same spelling appears in color, border-color, and background-color.",
  },
  {
    id: "border-missing-style",
    mode: "find-and-fix",
    title: "The separate border properties do not draw a line",
    goal: "The card should have a visible 3px solid purple border.",
    files: [{
      name: "common.css",
      language: "CSS",
      lines: [
        ".card {",
        "  border-width: 3px;",
        ["  ", region("/* missing declaration */", "missing-style-line", "missing border declaration")],
        "  border-color: purple;",
        "}",
      ],
    }],
    issues: [{
      id: "border-style-required",
      regionId: "missing-style-line",
      correctRepairId: "solid-style",
      foundFeedback: "You found the missing part between width and colour.",
      repairFeedback: "The solid style gives the browser a visible line to draw.",
      hints: ["A border needs width, style, and colour."],
    }],
    repairOptions: [
      { id: "solid-style", label: "border-style: solid;", replacement: "border-style: solid;" },
      { id: "line-style", label: "line-style: solid;", replacement: "line-style: solid;" },
      { id: "border-visible", label: "border-visible: yes;", replacement: "border-visible: yes;" },
    ],
    preview: {
      broken: { title: "Card", html: '<div class="border-debug-card"><span>No visible style</span>Red Panda</div>' },
      fixed: { title: "Card", html: '<div class="border-debug-card has-purple-border"><span>3px solid purple</span>Red Panda</div>' },
    },
    explanation:
      "Width and colour are not enough on their own. A visible border needs a style such as solid, dashed, dotted, or double.",
  },
  {
    id: "broken-border-shorthand",
    mode: "find-and-fix",
    title: "The border shorthand is incomplete",
    goal: "The card should have a 3px solid purple border.",
    files: [{
      name: "common.css",
      language: "CSS",
      lines: [
        ".card {",
        ["  ", region("border: 3px purple;", "incomplete-border", "border shorthand missing its style")],
        "}",
      ],
    }],
    issues: [{
      id: "shorthand-style",
      regionId: "incomplete-border",
      correctRepairId: "complete-border",
      foundFeedback: "You found the incomplete shorthand declaration.",
      repairFeedback: "The shorthand now contains width, style, and colour.",
      hints: ["Which word tells the browser what kind of line to draw?"],
    }],
    repairOptions: [
      { id: "complete-border", label: "border: 3px solid purple;", replacement: "border: 3px solid purple;" },
      { id: "comma-border", label: "border: 3px, purple;", replacement: "border: 3px, purple;" },
      { id: "reverse-border", label: "border: purple 3px;", replacement: "border: purple 3px;" },
    ],
    preview: {
      broken: { title: "Card", html: '<div class="border-debug-card"><span>Style missing</span>Red Panda</div>' },
      fixed: { title: "Card", html: '<div class="border-debug-card has-purple-border"><span>WIDTH + STYLE + COLOUR</span>Red Panda</div>' },
    },
    explanation:
      "The common border shorthand combines width, style, and colour in one declaration: border: 3px solid purple;.",
  },
  {
    id: "hex-missing-hash",
    mode: "find-and-fix",
    title: "The HEX colour is ignored",
    goal: "The text should be red using a six-digit HEX colour.",
    files: [{
      name: "common.css",
      language: "CSS",
      lines: [
        ".card {",
        ["  color: ", region("ff0000", "hex-without-hash", "HEX value missing its hash"), ";"],
        "}",
      ],
    }],
    issues: [{
      id: "hex-hash",
      regionId: "hex-without-hash",
      correctRepairId: "valid-hex",
      foundFeedback: "You found the HEX value without its opening hash.",
      repairFeedback: "The value is now valid six-digit HEX.",
      hints: ["A HEX colour value begins with one punctuation mark."],
    }],
    repairOptions: [
      { id: "valid-hex", label: "#ff0000", replacement: "#ff0000" },
      { id: "dot-hex", label: ".ff0000", replacement: ".ff0000" },
      { id: "quoted-hex", label: '"ff0000"', replacement: '"ff0000"' },
    ],
    preview: {
      broken: { title: "Card text", html: '<div class="hex-debug-text"><span>Invalid colour value</span>Red Panda</div>' },
      fixed: { title: "Card text", html: '<div class="hex-debug-text is-red"><span>#ff0000 applied</span>Red Panda</div>' },
    },
    explanation:
      "HEX colour values begin with #. In #hero the hash belongs to an ID selector; in color: #ff0000; it belongs to the colour value.",
  },
  {
    id: "malformed-rgb",
    mode: "find-and-fix",
    title: "The RGB value has a missing channel",
    goal: "The text should be red using RGB.",
    files: [{
      name: "common.css",
      language: "CSS",
      lines: [
        ".card {",
        ["  color: ", region("rgb(255, 0)", "two-channel-rgb", "RGB value containing only two channels"), ";"],
        "}",
      ],
    }],
    issues: [{
      id: "rgb-three-channels",
      regionId: "two-channel-rgb",
      correctRepairId: "red-rgb",
      foundFeedback: "You found the RGB value with a missing channel.",
      repairFeedback: "RGB now has red, green, and blue channel values.",
      hints: ["RGB needs three numbers: red, green, and blue."],
    }],
    repairOptions: [
      { id: "red-rgb", label: "rgb(255, 0, 0)", replacement: "rgb(255, 0, 0)" },
      { id: "five-rgb", label: "rgb(255, 0, 0, 0, 1)", replacement: "rgb(255, 0, 0, 0, 1)" },
      { id: "named-rgb", label: "rgb(red)", replacement: "rgb(red)" },
    ],
    preview: {
      broken: { title: "Card text", html: '<div class="hex-debug-text"><span>Invalid RGB structure</span>Red Panda</div>' },
      fixed: { title: "Card text", html: '<div class="hex-debug-text is-red"><span>R 255 · G 0 · B 0</span>Red Panda</div>' },
    },
    explanation:
      "The taught RGB syntax needs three channel values in red, green, blue order. rgb(255, 0, 0) represents red.",
  },
]

function channelToHex(value) {
  return Number(value).toString(16).padStart(2, "0")
}

function initColourExplorer() {
  const root = document.querySelector("[data-colour-explorer]")

  if (!root) {
    return
  }

  const controls = {
    red: root.querySelector("[data-colour-channel='red']"),
    green: root.querySelector("[data-colour-channel='green']"),
    blue: root.querySelector("[data-colour-channel='blue']"),
    alpha: root.querySelector("[data-colour-channel='alpha']"),
  }
  const outputs = {
    red: root.querySelector("[data-colour-value='red']"),
    green: root.querySelector("[data-colour-value='green']"),
    blue: root.querySelector("[data-colour-value='blue']"),
    alpha: Array.from(root.querySelectorAll("[data-colour-value='alpha']")),
    rgb: root.querySelector("[data-colour-format='rgb']"),
    rgba: root.querySelector("[data-colour-format='rgba']"),
    hex: root.querySelector("[data-colour-format='hex']"),
  }
  const swatch = root.querySelector("[data-colour-swatch]")
  const status = root.querySelector("[data-colour-status]")
  const resetButton = root.querySelector("[data-action='reset-colour-explorer']")

  function update(announce = false) {
    const red = Number(controls.red.value)
    const green = Number(controls.green.value)
    const blue = Number(controls.blue.value)
    const alpha = Number(controls.alpha.value)
    const alphaText = String(Number(alpha.toFixed(1)))
    const rgb = `rgb(${red}, ${green}, ${blue})`
    const rgba = `rgba(${red}, ${green}, ${blue}, ${alphaText})`
    const hex = `#${channelToHex(red)}${channelToHex(green)}${channelToHex(blue)}`

    outputs.red.textContent = String(red)
    outputs.green.textContent = String(green)
    outputs.blue.textContent = String(blue)
    outputs.alpha.forEach((output) => {
      output.textContent = alphaText
    })
    outputs.rgb.textContent = rgb
    outputs.rgba.textContent = rgba
    outputs.hex.textContent = hex
    swatch.style.backgroundColor = rgba
    swatch.setAttribute("aria-label", `Colour preview: ${rgba}, equivalent HEX without alpha ${hex}`)

    if (announce) {
      status.textContent = `Colour set to ${rgb}; HEX ${hex}; alpha ${alphaText}.`
    }
  }

  Object.values(controls).forEach((control) => {
    control.addEventListener("input", () => update(false))
    control.addEventListener("change", () => update(true))
  })

  resetButton.addEventListener("click", () => {
    controls.red.value = "128"
    controls.green.value = "60"
    controls.blue.value = "190"
    controls.alpha.value = "0.5"
    update(true)
    controls.red.focus()
  })

  update(false)
}

initLessonPage(lessonConfig)
initCodePreviews()
initLiveCodeExamples(liveCodeExamples)
initShorthandVisualizers(shorthandVisualizers)
initDebugLabs(debugTasks, {
  storageKey: "lesson-colours-backgrounds-and-borders-debug-labs",
  version: 1,
})
initColourExplorer()
