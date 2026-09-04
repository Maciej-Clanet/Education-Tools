import { initCodePreviews } from "../core/code-preview.js"
import { initDebugLabs } from "../core/debug-lab.js"
import { initLessonPage } from "../core/lesson-shell.js"
import { initLiveCodeExamples } from "../core/live-code-example.js?v=20260904-6"

const lessonConfig = {
  lessonId: "styling-text-with-css",
  defaultContext: "web-development",
  contexts: {
    "web-development": {
      label: "Web Development",
      backHref: "../resources/web-development.html#css-basics",
      backLabel: "Back to Web Development resources",
      previous: {
        title: "CSS selectors",
        href: "css-selectors.html",
        description:
          "The previous lesson used class, ID, and element selectors to identify which HTML elements CSS should affect.",
        status: "Live",
      },
      next: {
        title: "Colours, backgrounds, and borders",
        href: "colours-backgrounds-and-borders.html",
        description:
          "Next, fill element backgrounds, draw and round borders, and compare named, RGB, RGBA, and HEX colours.",
        status: "Live",
      },
    },
  },
  quiz: {
    storageKey: "lesson-styling-text-with-css-quiz",
    passScore: 16,
    version: 1,
  },
}

function inlineCode(code) {
  return { type: "code", code }
}

const liveCodeExamples = [
  {
    id: "selector-recap-live",
    title: "Move the featured-text class",
    description:
      "The supplied preview styling is locked. Try moving class=\"featured-text\" to a different paragraph and observe which one changes.",
    defaultSplit: 58,
    sources: [
      {
        id: "html",
        type: "html",
        label: "HTML",
        code: `<p>
  Red pandas spend much of their time in trees.
</p>

<p class="featured-text">
  Their reddish fur helps them blend into their habitat.
</p>

<p>
  Bamboo makes up a large part of their diet.
</p>`,
      },
    ],
    scaffold: {
      css: `.featured-text {
  color: purple;
  font-weight: bold;
}`,
    },
  },
  {
    id: "colour-size-live",
    title: "Try colour and size",
    description:
      "Only the CSS is exposed. Change purple to red or green, then experiment with different px values.",
    sources: [
      {
        id: "css",
        type: "css",
        label: "CSS",
        code: `.featured-text {
  color: purple;
  font-size: 24px;
}`,
      },
    ],
    scaffold: {
      html: `<p>Red pandas spend much of their time in trees.</p>
<p class="featured-text">Their reddish fur helps them blend into their habitat.</p>
<p>Bamboo makes up a large part of their diet.</p>`,
    },
  },
  {
    id: "text-tools-live",
    title: "Try weight, style, and decoration",
    description:
      "Change the supplied values to compare normal and bold, normal and italic, or none and underline.",
    sources: [
      {
        id: "css",
        type: "css",
        label: "CSS",
        code: `.featured-text {
  font-weight: bold;
  font-style: normal;
  text-decoration: none;
}`,
      },
    ],
    scaffold: {
      html: `<p class="featured-text">Red pandas use their long tails for balance.</p>`,
    },
  },
  {
    id: "alignment-spacing-live",
    title: "Try alignment and line spacing",
    description:
      "Change left to center or right. Then compare line-height values of 1, 1.5, and 2.",
    sources: [
      {
        id: "css",
        type: "css",
        label: "CSS",
        code: `.featured-text {
  text-align: left;
  line-height: 1.5;
}`,
      },
    ],
    scaffold: {
      html: `<p class="featured-text">Red pandas are skilled climbers. Curved claws help them grip branches, while their long tails help them balance high in the forest canopy.</p>`,
      css: `.featured-text {
  max-width: 34rem;
}`,
    },
  },
  {
    id: "text-property-workshop",
    title: "Try the text properties",
    instructions: [
      {
        type: "p",
        text: "Try changing the text colour, size, weight, style, alignment, and line spacing. Check the preview after each change.",
      },
      {
        type: "ol",
        items: [
          ["Open the editor if needed, then change ", inlineCode("purple"), " to ", inlineCode("green"), "."],
          ["Change ", inlineCode("24px"), " to ", inlineCode("40px"), "."],
          ["Change ", inlineCode("bold"), " to ", inlineCode("normal"), ", then try ", inlineCode("italic"), "."],
          ["Try ", inlineCode("underline"), ", ", inlineCode("center"), ", and ", inlineCode("line-height: 2"), "."],
          "Switch to HTML and move the class to a different paragraph.",
        ],
      },
    ],
    defaultSplit: 55,
    sources: [
      {
        id: "html",
        type: "html",
        label: "HTML",
        code: `<h2>Red Pandas</h2>

<p>
  Red pandas spend much of their time in trees.
</p>

<p class="featured-text">
  Their reddish fur helps them blend into their habitat.
</p>`,
      },
      {
        id: "css",
        type: "css",
        label: "CSS",
        code: `.featured-text {
  color: purple;
  font-size: 24px;
  font-weight: bold;
  font-style: normal;
  text-decoration: none;
  text-align: left;
  line-height: 1.5;
}`,
      },
    ],
  },
]

function region(text, regionId, label) {
  return { text, regionId, label }
}

const debugTasks = [
  {
    id: "property-typo",
    mode: "find-and-fix",
    title: "The text does not become bold",
    goal: "The featured paragraph should use bold text.",
    files: [
      {
        name: "common.css",
        language: "CSS",
        lines: [
          [region(".featured-text", "typo-selector", "featured-text selector"), " {"],
          ["  ", region("font-weigth", "weight-typo", "misspelled property font-weigth"), ": ", region("bold", "typo-value", "bold value"), ";"],
          "}",
        ],
      },
    ],
    issues: [
      {
        id: "weight-property-name",
        regionId: "weight-typo",
        correctRepairId: "correct-weight",
        foundFeedback: "You found the misspelled property name.",
        repairFeedback: "The property is now font-weight, so the browser recognises the declaration.",
        hints: ["Compare the property spelling with font and weight."],
      },
    ],
    repairOptions: [
      { id: "correct-weight", label: "font-weight", replacement: "font-weight" },
      { id: "weight-font", label: "weight-font", replacement: "weight-font" },
      { id: "font-bold", label: "font-bold", replacement: "font-bold" },
    ],
    preview: {
      broken: { title: "Featured paragraph", html: '<p class="text-debug-preview"><span>Property not recognised</span>Red pandas can climb head-first down a tree.</p>' },
      fixed: { title: "Featured paragraph", html: '<p class="text-debug-preview is-bold"><span>font-weight applied</span>Red pandas can climb head-first down a tree.</p>' },
    },
    explanation:
      "CSS property names must be written correctly. The browser does not recognise font-weigth, but it does recognise font-weight.",
  },
  {
    id: "missing-colon",
    mode: "find-and-fix",
    title: "The colour declaration is malformed",
    goal: "The featured paragraph should use purple text.",
    files: [
      {
        name: "common.css",
        language: "CSS",
        lines: [
          [region(".featured-text", "colon-selector", "featured-text selector"), " {"],
          ["  ", region("color purple;", "missing-colon-declaration", "declaration missing a colon")],
          "}",
        ],
      },
    ],
    issues: [
      {
        id: "colon-between-parts",
        regionId: "missing-colon-declaration",
        correctRepairId: "add-colon",
        foundFeedback: "You found the malformed declaration.",
        repairFeedback: "The colon now separates the property from its value.",
        hints: ["A declaration follows the pattern property: value;."],
      },
    ],
    repairOptions: [
      { id: "add-colon", label: "color: purple;", replacement: "color: purple;" },
      { id: "add-equals", label: "color = purple;", replacement: "color = purple;" },
      { id: "reverse", label: "purple: color;", replacement: "purple: color;" },
    ],
    preview: {
      broken: { title: "Featured paragraph", html: '<p class="text-debug-preview"><span>Declaration ignored</span>Reddish fur provides camouflage.</p>' },
      fixed: { title: "Featured paragraph", html: '<p class="text-debug-preview is-purple"><span>color applied</span>Reddish fur provides camouflage.</p>' },
    },
    explanation:
      "The colon belongs between the property and value. The complete declaration is color: purple;.",
  },
  {
    id: "missing-semicolon",
    mode: "find-and-fix",
    title: "Two declarations run together",
    goal: "The featured paragraph should become purple and bold.",
    files: [
      {
        name: "common.css",
        language: "CSS",
        lines: [
          ".featured-text {",
          ["  ", region("color: purple", "missing-semicolon-token", "colour declaration missing its semicolon")],
          ["  ", region("font-weight: bold;", "following-weight", "following font-weight declaration")],
          "}",
        ],
      },
    ],
    issues: [
      {
        id: "declaration-separator",
        regionId: "missing-semicolon-token",
        correctRepairId: "finish-colour",
        foundFeedback: "You found the declaration that runs into the next one.",
        repairFeedback: "The semicolon now ends color: purple; before font-weight begins.",
        hints: ["The first declaration needs to end before the next property begins."],
      },
    ],
    repairOptions: [
      { id: "finish-colour", label: "color: purple;", replacement: "color: purple;" },
      { id: "add-comma", label: "color: purple,", replacement: "color: purple," },
      { id: "remove-colon", label: "color purple;", replacement: "color purple;" },
    ],
    preview: {
      broken: { title: "Featured paragraph", html: '<p class="text-debug-preview"><span>Combined invalid value</span>Two declarations are not applied.</p>' },
      fixed: { title: "Featured paragraph", html: '<p class="text-debug-preview is-purple is-bold"><span>Both declarations applied</span>Purple and bold text appears.</p>' },
    },
    interpretation: {
      title: "What the browser sees",
      text: "Without the first semicolon, the browser reads purple font-weight: bold as part of one invalid color value instead of two declarations.",
    },
    explanation:
      "A semicolon separates this declaration from the next one. Omitting it here prevents the browser from recognising the intended color and font-weight declarations.",
  },
  {
    id: "every-paragraph-selector",
    mode: "find-and-fix",
    title: "The requirement applies to every paragraph",
    goal: "Every paragraph on the page should use the supplied 20px text size.",
    files: [
      {
        name: "common.css",
        language: "CSS",
        lines: [
          [region(".featured-text", "too-specific-selector", "featured-text class selector"), " {"],
          "  font-size: 20px;",
          "}",
        ],
      },
    ],
    issues: [
      {
        id: "selector-scope",
        regionId: "too-specific-selector",
        correctRepairId: "paragraph-selector",
        foundFeedback: "You found the selector that reaches only the featured paragraph.",
        repairFeedback: "The p selector now matches every paragraph, which matches the requirement.",
        hints: ["Do we genuinely mean every element of one HTML type?"],
      },
    ],
    repairOptions: [
      { id: "paragraph-selector", label: "p", replacement: "p" },
      { id: "all-class", label: ".all", replacement: ".all" },
      { id: "paragraph-id", label: "#paragraph", replacement: "#paragraph" },
    ],
    preview: {
      broken: { title: "Three paragraphs", html: '<div class="paragraph-debug-list"><p>Normal size</p><p class="is-large">20px featured paragraph</p><p>Normal size</p></div>' },
      fixed: { title: "Three paragraphs", html: '<div class="paragraph-debug-list is-all-large"><p>20px paragraph</p><p>20px paragraph</p><p>20px paragraph</p></div>' },
    },
    explanation:
      "A class is useful for particular elements. Here the requirement genuinely means every p element, so the broad p selector is the simpler match.",
  },
  {
    id: "property-value-order",
    mode: "find-and-fix",
    title: "Property and value are reversed",
    goal: "The featured paragraph should use bold text.",
    files: [
      {
        name: "common.css",
        language: "CSS",
        lines: [
          ".featured-text {",
          ["  ", region("bold: font-weight;", "reversed-declaration", "declaration with property and value reversed")],
          "}",
        ],
      },
    ],
    issues: [
      {
        id: "property-before-value",
        regionId: "reversed-declaration",
        correctRepairId: "weight-bold",
        foundFeedback: "You found the declaration with its parts in the wrong places.",
        repairFeedback: "The property now comes first, followed by the colon and its value.",
        hints: ["The pattern is property: value;. Which word is the property name?"],
      },
    ],
    repairOptions: [
      { id: "weight-bold", label: "font-weight: bold;", replacement: "font-weight: bold;" },
      { id: "bold-weight", label: "bold font-weight;", replacement: "bold font-weight;" },
      { id: "weight-equals", label: "font-weight = bold;", replacement: "font-weight = bold;" },
    ],
    preview: {
      broken: { title: "Featured paragraph", html: '<p class="text-debug-preview"><span>Declaration ignored</span>Normal text remains.</p>' },
      fixed: { title: "Featured paragraph", html: '<p class="text-debug-preview is-bold"><span>font-weight applied</span>Bold text appears.</p>' },
    },
    explanation:
      "A declaration begins with the property, then a colon, then the value. font-weight is the property and bold is its value.",
  },
]

initLessonPage(lessonConfig)
initCodePreviews()
initLiveCodeExamples(liveCodeExamples)
initDebugLabs(debugTasks, {
  storageKey: "lesson-styling-text-with-css-debug-labs",
  version: 1,
})
