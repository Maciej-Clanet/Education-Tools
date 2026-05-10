import { initLessonPage } from "../core/lesson-shell.js"
import { readStorage, writeStorage } from "../core/storage.js"

const lessonConfig = {
  lessonId: "resolution-bit-depth-and-image-compression",
  defaultContext: "btec-level-3-unit-2",
  contexts: {
    "btec-level-3-unit-2": {
      label: "BTEC Level 3 Computing Unit 2",
      backHref: "../units/btec-level-3-unit-2.html#section-c",
      backLabel: "Back to Unit 2 content",
      previous: {
        title: "Image storage: bitmap and vector images",
        description: "Previous in C3 Image representation.",
        status: "Live",
        href: "../topics/bitmap-image-storage.html",
      },
      next: {
        title: "Stacks and queues",
        description: "Next in D1 Data structures.",
        status: "Live",
        href: "../topics/stacks-and-queues.html",
      },
    },
  },
  quiz: {
    storageKey: "lesson-resolution-bit-depth-and-image-compression-quiz",
    passScore: 4,
    version: 2,
  },
  examPractice: {
    storageKey: "lesson-resolution-bit-depth-and-image-compression-exam-practice",
  },
}

const BIT_DEPTH_STORAGE_KEY = "lesson-resolution-bit-depth-tool"
const BIT_DEPTH_SAMPLE_WIDTH = 16
const BIT_DEPTH_SAMPLE_HEIGHT = 10

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function createElement(tagName, className, textContent) {
  const element = document.createElement(tagName)

  if (className) {
    element.className = className
  }

  if (textContent !== undefined) {
    element.textContent = textContent
  }

  return element
}

function normaliseBitDepth(value) {
  const parsed = Number(value)

  if (!Number.isFinite(parsed)) {
    return 3
  }

  return clamp(Math.trunc(parsed), 1, 8)
}

function quantise(value, bitDepth) {
  const levels = 2 ** bitDepth
  const level = Math.round((clamp(value, 0, 255) / 255) * (levels - 1))
  return Math.round((level / (levels - 1)) * 255)
}

function setText(root, role, value) {
  const element = root.querySelector(`[data-role='${role}']`)

  if (element) {
    element.textContent = value
  }
}

function getSampleBrightness(x, y) {
  const centreX = 7.5
  const centreY = 4.8
  const distance = Math.hypot(x - centreX, y - centreY)
  const highlight = Math.max(0, 130 - distance * 30)
  const diagonal = x * 8 + y * 11
  const wave = Math.sin((x + y) / 2.2) * 24

  return clamp(38 + diagonal + highlight + wave, 0, 255)
}

function renderGradientPreview(container, bitDepth) {
  container.replaceChildren()

  Array.from({ length: 32 }, (_, index) => {
    const brightness = quantise((index / 31) * 255, bitDepth)
    const cell = createElement("span")
    cell.style.backgroundColor = `rgb(${brightness}, ${brightness}, ${brightness})`
    container.append(cell)
  })
}

function renderImagePreview(container, bitDepth) {
  container.replaceChildren()

  Array.from(
    { length: BIT_DEPTH_SAMPLE_WIDTH * BIT_DEPTH_SAMPLE_HEIGHT },
    (_, index) => {
      const x = index % BIT_DEPTH_SAMPLE_WIDTH
      const y = Math.floor(index / BIT_DEPTH_SAMPLE_WIDTH)
      const brightness = quantise(getSampleBrightness(x, y), bitDepth)
      const cell = createElement("span")
      cell.style.backgroundColor = `rgb(${brightness}, ${brightness}, ${brightness})`
      container.append(cell)
    }
  )
}

function renderPalettePreview(container, bitDepth) {
  container.replaceChildren()

  const levels = 2 ** bitDepth
  const shownLevels = Math.min(levels, 16)

  Array.from({ length: shownLevels }, (_, index) => {
    const brightness =
      levels === 1 ? 0 : Math.round((index / (shownLevels - 1)) * 255)
    const swatch = createElement("span")
    swatch.style.backgroundColor = `rgb(${brightness}, ${brightness}, ${brightness})`
    container.append(swatch)
  })
}

function renderBitDepthTool(tool, bitDepth) {
  const safeBitDepth = normaliseBitDepth(bitDepth)
  const levels = 2 ** safeBitDepth
  const samplePixels = BIT_DEPTH_SAMPLE_WIDTH * BIT_DEPTH_SAMPLE_HEIGHT
  const rawBits = samplePixels * safeBitDepth
  const slider = tool.querySelector("[data-role='bit-depth-slider']")
  const gradient = tool.querySelector("[data-role='bit-depth-gradient']")
  const image = tool.querySelector("[data-role='bit-depth-image']")
  const palette = tool.querySelector("[data-role='bit-depth-palette']")

  if (slider) {
    slider.value = safeBitDepth.toString()
  }

  if (gradient) {
    renderGradientPreview(gradient, safeBitDepth)
  }

  if (image) {
    renderImagePreview(image, safeBitDepth)
  }

  if (palette) {
    renderPalettePreview(palette, safeBitDepth)
  }

  setText(
    tool,
    "bit-depth-value",
    `${safeBitDepth} bit${safeBitDepth === 1 ? "" : "s"}`
  )
  setText(tool, "bit-depth-levels", levels.toLocaleString("en-GB"))
  setText(tool, "bit-depth-sample-bits", rawBits.toLocaleString("en-GB"))
  setText(
    tool,
    "bit-depth-sample-bytes",
    Math.ceil(rawBits / 8).toLocaleString("en-GB")
  )
  setText(
    tool,
    "bit-depth-note",
    safeBitDepth <= 2
      ? "Low bit depth creates obvious bands because there are very few shades available."
      : safeBitDepth <= 4
        ? "More shades are available, so the image keeps more tonal detail."
        : "High bit depth gives many possible values, so gradients and subtle detail appear smoother."
  )
}

function initBitDepthTool() {
  const tool = document.querySelector("[data-role='bit-depth-tool']")

  if (!tool) {
    return
  }

  const slider = tool.querySelector("[data-role='bit-depth-slider']")
  const savedState = readStorage(BIT_DEPTH_STORAGE_KEY, { bitDepth: 3 })
  const state = {
    bitDepth: normaliseBitDepth(savedState?.bitDepth),
  }

  function saveAndRender(bitDepth) {
    state.bitDepth = normaliseBitDepth(bitDepth)
    writeStorage(BIT_DEPTH_STORAGE_KEY, state)
    renderBitDepthTool(tool, state.bitDepth)
  }

  slider?.addEventListener("input", () => {
    saveAndRender(slider.value)
  })

  renderBitDepthTool(tool, state.bitDepth)
}

initLessonPage(lessonConfig)
initBitDepthTool()
