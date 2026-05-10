import { initLessonPage } from "../core/lesson-shell.js"
import { readStorage, writeStorage } from "../core/storage.js"

const lessonConfig = {
  lessonId: "bitmap-image-storage",
  defaultContext: "btec-level-3-unit-2",
  contexts: {
    "btec-level-3-unit-2": {
      label: "BTEC Level 3 Computing Unit 2",
      backHref: "../units/btec-level-3-unit-2.html#section-c",
      backLabel: "Back to Unit 2 content",
      previous: {
        title: "Character sets, ASCII, and Unicode",
        description: "Previous in C2 Text representation.",
        status: "Live",
        href: "../topics/character-sets-ascii-and-unicode.html",
      },
      next: {
        title: "Resolution, bit depth, and image compression",
        description: "Next in C3 Image representation.",
        status: "Live",
        href: "../topics/resolution-bit-depth-and-image-compression.html",
      },
    },
  },
  quiz: {
    storageKey: "lesson-bitmap-image-storage-quiz",
    passScore: 4,
    version: 2,
  },
  examPractice: {
    storageKey: "lesson-bitmap-image-storage-exam-practice",
  },
}

const VECTOR_TOOL_STORAGE_KEY = "lesson-image-storage-vector-tool"
const BITMAP_BUILDER_STORAGE_KEY = "lesson-image-storage-bitmap-builder"
const BITMAP_WIDTH = 5
const BITMAP_HEIGHT = 5
const BITS_PER_PIXEL = 2
const BITMAP_PALETTE = [
  { label: "mint", code: "00", colour: "#eaf5ff" },
  { label: "teal", code: "01", colour: "#1f877d" },
  { label: "gold", code: "10", colour: "#b98c19" },
  { label: "ink", code: "11", colour: "#253442" },
]
const DEFAULT_BITMAP_PIXELS = [
  0, 0, 1, 1, 0,
  0, 1, 2, 1, 0,
  1, 2, 3, 2, 1,
  0, 1, 2, 1, 0,
  0, 0, 1, 0, 0,
]

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function normaliseScale(value) {
  const parsed = Number(value)

  if (!Number.isFinite(parsed)) {
    return 120
  }

  return clamp(Math.trunc(parsed), 60, 220)
}

function normaliseBitmapState(value) {
  const selectedColour = clamp(Number(value?.selectedColour) || 0, 0, 3)
  const pixels = Array.isArray(value?.pixels)
    ? value.pixels
    : DEFAULT_BITMAP_PIXELS

  return {
    selectedColour,
    pixels: Array.from({ length: BITMAP_WIDTH * BITMAP_HEIGHT }, (_, index) =>
      clamp(Number(pixels[index]) || 0, 0, 3)
    ),
  }
}

function renderBitmapPalette(tool, state) {
  const palette = tool.querySelector("[data-role='bitmap-palette']")

  if (!palette) {
    return
  }

  palette.replaceChildren()

  BITMAP_PALETTE.forEach((colour, index) => {
    const button = document.createElement("button")
    button.type = "button"
    button.className = "palette-button"
    button.classList.toggle("is-selected", state.selectedColour === index)
    button.dataset.paletteIndex = index.toString()
    button.style.setProperty("--swatch-colour", colour.colour)
    button.innerHTML = `<span></span><strong>${colour.code}</strong>${colour.label}`
    palette.append(button)
  })
}

function renderBitmapGrid(tool, state) {
  const grid = tool.querySelector("[data-role='bitmap-data-grid']")

  if (!grid) {
    return
  }

  grid.replaceChildren()

  state.pixels.forEach((colourIndex, pixelIndex) => {
    const colour = BITMAP_PALETTE[colourIndex]
    const column = (pixelIndex % BITMAP_WIDTH) + 1
    const row = Math.floor(pixelIndex / BITMAP_WIDTH) + 1
    const button = document.createElement("button")

    button.type = "button"
    button.className = "bitmap-data-pixel"
    button.dataset.pixelIndex = pixelIndex.toString()
    button.style.setProperty("--pixel-colour", colour.colour)
    button.setAttribute(
      "aria-label",
      `Pixel row ${row}, column ${column}, stored as ${colour.code}`
    )
    grid.append(button)
  })
}

function getBitmapRows(pixels) {
  return Array.from({ length: BITMAP_HEIGHT }, (_, rowIndex) =>
    pixels
      .slice(rowIndex * BITMAP_WIDTH, rowIndex * BITMAP_WIDTH + BITMAP_WIDTH)
      .map((colourIndex) => BITMAP_PALETTE[colourIndex].code)
  )
}

function renderBitmapData(tool, state) {
  const dataBlock = tool.querySelector("[data-role='bitmap-stored-data']")
  const rawBits = BITMAP_WIDTH * BITMAP_HEIGHT * BITS_PER_PIXEL

  if (dataBlock) {
    dataBlock.textContent = getBitmapRows(state.pixels)
      .map((row, index) => `row ${index + 1}: ${row.join(" ")}`)
      .join("\n")
  }

  setText(tool, "bitmap-dimensions", `${BITMAP_WIDTH} x ${BITMAP_HEIGHT}`)
  setText(tool, "bitmap-pixel-count", (BITMAP_WIDTH * BITMAP_HEIGHT).toString())
  setText(tool, "bitmap-bits-per-pixel", BITS_PER_PIXEL.toString())
  setText(tool, "bitmap-raw-bits", rawBits.toString())
  setText(tool, "bitmap-raw-bytes", Math.ceil(rawBits / 8).toString())
  setText(
    tool,
    "bitmap-data-note",
    "Painting changes the stored pixel codes. The raw size stays the same because this tiny bitmap still has 25 pixels and uses 2 bits per pixel."
  )
}

function renderBitmapBuilder(tool, state) {
  renderBitmapPalette(tool, state)
  renderBitmapGrid(tool, state)
  renderBitmapData(tool, state)
}

function initBitmapBuilder() {
  const tool = document.querySelector("[data-role='bitmap-data-builder']")

  if (!tool) {
    return
  }

  let state = normaliseBitmapState(
    readStorage(BITMAP_BUILDER_STORAGE_KEY, {
      selectedColour: 1,
      pixels: DEFAULT_BITMAP_PIXELS,
    })
  )

  function saveAndRender() {
    writeStorage(BITMAP_BUILDER_STORAGE_KEY, state)
    renderBitmapBuilder(tool, state)
  }

  tool.addEventListener("click", (event) => {
    const target = event.target

    if (!(target instanceof Element)) {
      return
    }

    const paletteButton = target.closest("[data-palette-index]")
    const pixelButton = target.closest("[data-pixel-index]")

    if (paletteButton) {
      state = {
        ...state,
        selectedColour: clamp(Number(paletteButton.dataset.paletteIndex), 0, 3),
      }
      saveAndRender()
      return
    }

    if (pixelButton) {
      const pixelIndex = Number(pixelButton.dataset.pixelIndex)

      if (!Number.isInteger(pixelIndex)) {
        return
      }

      state = {
        ...state,
        pixels: state.pixels.map((colourIndex, index) =>
          index === pixelIndex ? state.selectedColour : colourIndex
        ),
      }
      saveAndRender()
    }
  })

  saveAndRender()
}

function buildVectorData(scale) {
  const width = scale
  const height = Math.round(scale * 0.68)
  const circleRadius = Math.round(scale * 0.18)
  const strokeWidth = Math.max(2, Math.round(scale * 0.035))
  const fontSize = Math.max(12, Math.round(scale * 0.18))

  return {
    canvas: { width, height },
    commands: [
      {
        shape: "circle",
        cx: Math.round(width * 0.28),
        cy: Math.round(height * 0.48),
        r: circleRadius,
        fill: "#1f877d",
      },
      {
        shape: "line",
        x1: Math.round(width * 0.18),
        y1: Math.round(height * 0.77),
        x2: Math.round(width * 0.82),
        y2: Math.round(height * 0.2),
        stroke: "#b98c19",
        strokeWidth,
      },
      {
        shape: "text",
        x: Math.round(width * 0.58),
        y: Math.round(height * 0.58),
        value: "A",
        size: fontSize,
        fill: "#253442",
      },
    ],
  }
}

function vectorDataToText(data) {
  return JSON.stringify(data, null, 2)
}

function setText(root, role, value) {
  const element = root.querySelector(`[data-role='${role}']`)

  if (element) {
    element.textContent = value
  }
}

function renderVectorTool(tool, scale) {
  const safeScale = normaliseScale(scale)
  const data = buildVectorData(safeScale)
  const slider = tool.querySelector("[data-role='vector-scale-slider']")
  const preview = tool.querySelector("[data-role='vector-preview']")
  const dataBlock = tool.querySelector("[data-role='vector-data']")
  const circle = tool.querySelector("[data-role='vector-circle']")
  const line = tool.querySelector("[data-role='vector-line']")
  const text = tool.querySelector("[data-role='vector-text']")
  const [circleCommand, lineCommand, textCommand] = data.commands

  if (slider) {
    slider.value = safeScale.toString()
  }

  if (preview) {
    preview.setAttribute("width", data.canvas.width.toString())
    preview.setAttribute("height", data.canvas.height.toString())
    preview.setAttribute(
      "viewBox",
      `0 0 ${data.canvas.width} ${data.canvas.height}`
    )
  }

  if (circle) {
    circle.setAttribute("cx", circleCommand.cx.toString())
    circle.setAttribute("cy", circleCommand.cy.toString())
    circle.setAttribute("r", circleCommand.r.toString())
  }

  if (line) {
    line.setAttribute("x1", lineCommand.x1.toString())
    line.setAttribute("y1", lineCommand.y1.toString())
    line.setAttribute("x2", lineCommand.x2.toString())
    line.setAttribute("y2", lineCommand.y2.toString())
    line.setAttribute("stroke-width", lineCommand.strokeWidth.toString())
  }

  if (text) {
    text.setAttribute("x", textCommand.x.toString())
    text.setAttribute("y", textCommand.y.toString())
    text.setAttribute("font-size", textCommand.size.toString())
  }

  if (dataBlock) {
    dataBlock.textContent = vectorDataToText(data)
  }

  setText(tool, "vector-width", data.canvas.width.toString())
  setText(tool, "vector-height", data.canvas.height.toString())
  setText(tool, "vector-command-count", data.commands.length.toString())
  setText(
    tool,
    "vector-note",
    "The stored vector is still a short set of drawing instructions. Resizing changes numbers such as width, height, radius, and coordinates rather than creating a new pixel for every point."
  )
}

function initVectorTool() {
  const tool = document.querySelector("[data-role='vector-storage-tool']")

  if (!tool) {
    return
  }

  const slider = tool.querySelector("[data-role='vector-scale-slider']")
  const state = {
    scale: normaliseScale(
      readStorage(VECTOR_TOOL_STORAGE_KEY, { scale: 120 }).scale
    ),
  }

  function saveAndRender(scale) {
    state.scale = normaliseScale(scale)
    writeStorage(VECTOR_TOOL_STORAGE_KEY, state)
    renderVectorTool(tool, state.scale)
  }

  slider?.addEventListener("input", () => {
    saveAndRender(slider.value)
  })

  renderVectorTool(tool, state.scale)
}

initLessonPage(lessonConfig)
initBitmapBuilder()
initVectorTool()
