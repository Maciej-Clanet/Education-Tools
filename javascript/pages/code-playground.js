import { createLiveCodeWorkspace } from "../core/live-code-example.js?v=20260904-5"
import {
  readSessionStorage,
  readStorage,
  removeStorage,
  removeSessionStorage,
  writeStorage,
} from "../core/storage.js"

const STORAGE_KEY = "code-playground-workspaces-v1"
const HANDOFF_PREFIX = "code-playground-handoff"
const SCHEMA_VERSION = 1
const SAVE_DELAY = 600

const DIRECT_WORKSPACE_IDS = {
  "html-css": "direct-html-css",
  javascript: "direct-javascript",
}

const STARTERS = {
  "html-css": {
    id: DIRECT_WORKSPACE_IDS["html-css"],
    title: "HTML and CSS Playground",
    instructions:
      "Edit the HTML and CSS, then use the generated preview to check how the page changes.",
    executionMode: "html-css",
    defaultSplit: 55,
    sources: [
      {
        id: "html",
        type: "html",
        label: "HTML",
        code: `<article class="profile-card">
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
        code: `.profile-card {
  max-width: 28rem;
  padding: 24px;
  border: 4px solid purple;
  border-radius: 16px;
  background-color: lightblue;
  color: navy;
}`,
      },
    ],
    scaffold: {},
  },
  javascript: {
    id: DIRECT_WORKSPACE_IDS.javascript,
    title: "JavaScript Console Playground",
    instructions:
      "Write JavaScript, choose Run, then read the console output.",
    executionMode: "javascript",
    defaultSplit: 56,
    sources: [
      {
        id: "javascript",
        type: "javascript",
        label: "JavaScript",
        code: `const score = 10
const bonus = 5

console.log("Score:", score + bonus)`,
      },
    ],
    execution: {
      timeoutMs: 3000,
      network: {
        mode: "allowlist",
        allowedOrigins: ["https://jsonplaceholder.typicode.com"],
        allowedUrls: [],
      },
    },
  },
}

const mount = document.querySelector("[data-role='playground-mount']")
const modeButtons = Array.from(document.querySelectorAll("[data-playground-mode]"))
const resetWorkspaceButton = document.querySelector(
  "[data-action='reset-workspace']"
)
const resetViewButton = document.querySelector("[data-action='reset-view']")
const saveStatus = document.querySelector("[data-role='save-status']")
const sourceContext = document.querySelector("[data-role='playground-context']")

let activeApi = null
let activeWorkspaceId = null
let activeMode = "html-css"
let saveTimer = null
let state = readPlaygroundState()

function createEmptyState() {
  return {
    schemaVersion: SCHEMA_VERSION,
    activeWorkspaceId: DIRECT_WORKSPACE_IDS["html-css"],
    workspaces: {},
  }
}

function isObject(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value))
}

function normaliseMode(mode) {
  if (mode === "javascript" || mode === "javascript-console" || mode === "js") {
    return "javascript"
  }

  return "html-css"
}

function normaliseSources(sources, mode) {
  if (!Array.isArray(sources) || sources.length === 0) {
    return STARTERS[mode].sources
  }

  return sources
    .filter((source) => isObject(source))
    .map((source, index) => ({
      id: String(source.id ?? source.type ?? `source-${index + 1}`),
      type: String(source.type ?? source.id ?? ""),
      label: String(source.label ?? source.type ?? `Source ${index + 1}`),
      initialCode: String(source.initialCode ?? source.code ?? ""),
      code: String(source.code ?? source.currentCode ?? source.initialCode ?? ""),
    }))
}

function normaliseSnapshot(snapshot, fallbackMode = "html-css") {
  const mode = normaliseMode(snapshot?.executionMode ?? snapshot?.mode ?? fallbackMode)
  const starter = STARTERS[mode]

  return {
    schemaVersion: SCHEMA_VERSION,
    title: String(snapshot?.title ?? starter.title),
    instructions: String(snapshot?.instructions ?? starter.instructions),
    executionMode: mode,
    sources: normaliseSources(snapshot?.sources, mode),
    scaffold: isObject(snapshot?.scaffold) ? snapshot.scaffold : starter.scaffold ?? {},
    execution: isObject(snapshot?.execution)
      ? snapshot.execution
      : starter.execution ?? {},
    defaultSplit: Number(snapshot?.defaultSplit ?? snapshot?.split ?? starter.defaultSplit),
    defaultLayout: snapshot?.defaultLayout ?? starter.defaultLayout ?? "side-by-side",
    layout: snapshot?.layout ?? starter.layout ?? "side-by-side",
    split: Number(snapshot?.split ?? snapshot?.defaultSplit ?? starter.defaultSplit),
    codeZoom: Number(snapshot?.codeZoom ?? 1),
    openedFrom: snapshot?.openedFrom ? String(snapshot.openedFrom) : "",
  }
}

function readPlaygroundState() {
  const storedState = readStorage(STORAGE_KEY, null)

  if (
    !isObject(storedState) ||
    storedState.schemaVersion !== SCHEMA_VERSION ||
    !isObject(storedState.workspaces)
  ) {
    return createEmptyState()
  }

  return {
    schemaVersion: SCHEMA_VERSION,
    activeWorkspaceId:
      typeof storedState.activeWorkspaceId === "string"
        ? storedState.activeWorkspaceId
        : DIRECT_WORKSPACE_IDS["html-css"],
    workspaces: storedState.workspaces,
  }
}

function writePlaygroundState() {
  writeStorage(STORAGE_KEY, state)
}

function getStarterSnapshot(mode) {
  return normaliseSnapshot(STARTERS[mode], mode)
}

function upgradeDirectWorkspaceSnapshot(workspaceId, snapshot) {
  if (workspaceId !== DIRECT_WORKSPACE_IDS.javascript) {
    return snapshot
  }

  return {
    ...snapshot,
    title: STARTERS.javascript.title,
    instructions: STARTERS.javascript.instructions,
    execution: {
      ...snapshot.execution,
      timeoutMs: snapshot.execution.timeoutMs ?? STARTERS.javascript.execution.timeoutMs,
      network: STARTERS.javascript.execution.network,
    },
  }
}

function getWorkspace(workspaceId, mode) {
  const storedWorkspace = state.workspaces[workspaceId]

  if (isObject(storedWorkspace) && isObject(storedWorkspace.snapshot)) {
    const snapshot = normaliseSnapshot(storedWorkspace.snapshot, mode)

    return {
      ...storedWorkspace,
      snapshot:
        (storedWorkspace.source ?? "direct") === "direct"
          ? upgradeDirectWorkspaceSnapshot(workspaceId, snapshot)
          : snapshot,
    }
  }

  return {
    id: workspaceId,
    mode,
    source: "direct",
    updatedAt: null,
    snapshot: getStarterSnapshot(mode),
  }
}

function storeWorkspace(workspaceId, snapshot, source = "direct") {
  const mode = normaliseMode(snapshot.executionMode)

  state.workspaces[workspaceId] = {
    id: workspaceId,
    mode,
    source,
    updatedAt: new Date().toISOString(),
    snapshot: normaliseSnapshot(snapshot, mode),
  }
  state.activeWorkspaceId = workspaceId
}

function setSaveStatus(message) {
  if (saveStatus) {
    saveStatus.textContent = message
  }
}

function saveNow() {
  if (!activeApi || !activeWorkspaceId) {
    return
  }

  window.clearTimeout(saveTimer)
  saveTimer = null
  storeWorkspace(
    activeWorkspaceId,
    activeApi.getSnapshot(),
    state.workspaces[activeWorkspaceId]?.source ?? "direct"
  )
  writePlaygroundState()
  setSaveStatus("Saved locally")
}

function scheduleSave() {
  setSaveStatus("Saving...")
  window.clearTimeout(saveTimer)
  saveTimer = window.setTimeout(saveNow, SAVE_DELAY)
}

function hasChangedFromStart(snapshot) {
  return snapshot.sources.some((source) => source.code !== source.initialCode)
}

function syncModeButtons() {
  modeButtons.forEach((button) => {
    const selected = button.dataset.playgroundMode === activeMode

    button.classList.toggle("is-active", selected)
    button.setAttribute("aria-pressed", String(selected))
  })
}

function setContext(workspace) {
  if (!sourceContext) {
    return
  }

  sourceContext.textContent =
    workspace.source === "lesson"
      ? "Continue the exercise in a larger workspace."
      : "Choose a workspace type and keep experimenting."
}

function renderWorkspace(workspaceId, mode, source = "direct") {
  const workspace = getWorkspace(workspaceId, mode)
  const snapshot = normaliseSnapshot(workspace.snapshot, mode)

  activeApi?.destroy()
  activeWorkspaceId = workspaceId
  activeMode = normaliseMode(snapshot.executionMode)
  state.activeWorkspaceId = workspaceId
  syncModeButtons()
  setContext({ ...workspace, source })
  setSaveStatus(workspace.updatedAt ? "Saved locally" : "Ready")

  activeApi = createLiveCodeWorkspace(mount, snapshot, {
    variant: "playground",
    alwaysEditing: true,
    showOpenInPlayground: false,
    showResetCodeButton: false,
    showResetViewInMenu: false,
    instructionsDefaultOpen: true,
    titleInsideInstructions: true,
    onChange: scheduleSave,
  })
}

function resetWorkspace() {
  if (!activeApi || !activeWorkspaceId) {
    return
  }

  const currentSnapshot = activeApi.getSnapshot()
  const shouldConfirm =
    hasChangedFromStart(currentSnapshot) ||
    Boolean(state.workspaces[activeWorkspaceId]?.updatedAt)

  if (
    shouldConfirm &&
    !window.confirm("Reset this workspace? Your saved code here will be replaced.")
  ) {
    return
  }

  const starter =
    state.workspaces[activeWorkspaceId]?.source === "lesson"
      ? {
        ...currentSnapshot,
        sources: currentSnapshot.sources.map((source) => ({
          ...source,
          code: source.initialCode,
        })),
      }
      : getStarterSnapshot(activeMode)

  storeWorkspace(activeWorkspaceId, starter, state.workspaces[activeWorkspaceId]?.source ?? "direct")
  writePlaygroundState()
  renderWorkspace(activeWorkspaceId, activeMode, state.workspaces[activeWorkspaceId]?.source ?? "direct")
  setSaveStatus("Saved locally")
}

function handleModeChange(mode) {
  const nextMode = normaliseMode(mode)

  if (nextMode === activeMode && activeWorkspaceId === DIRECT_WORKSPACE_IDS[nextMode]) {
    return
  }

  saveNow()
  renderWorkspace(DIRECT_WORKSPACE_IDS[nextMode], nextMode, "direct")
}

function consumeHandoff() {
  const url = new URL(window.location.href)
  const handoffId = url.searchParams.get("handoff")

  if (!handoffId) {
    return null
  }

  const handoffKey = `${HANDOFF_PREFIX}:${handoffId}`
  const snapshot =
    readSessionStorage(handoffKey, null) ?? readStorage(handoffKey, null)

  removeSessionStorage(handoffKey)
  removeStorage(handoffKey)
  url.searchParams.delete("handoff")
  window.history.replaceState(null, "", `${url.pathname}${url.hash}`)

  if (!isObject(snapshot)) {
    return null
  }

  const normalisedSnapshot = normaliseSnapshot(snapshot, snapshot.executionMode)

  return {
    id: `lesson-${handoffId}`,
    mode: normalisedSnapshot.executionMode,
    source: "lesson",
    snapshot: normalisedSnapshot,
  }
}

function init() {
  const handoff = consumeHandoff()

  if (handoff) {
    storeWorkspace(handoff.id, handoff.snapshot, "lesson")
    writePlaygroundState()
    renderWorkspace(handoff.id, handoff.mode, "lesson")
  } else {
    const preferredWorkspace = isObject(state.workspaces[state.activeWorkspaceId])
      ? state.workspaces[state.activeWorkspaceId]
      : null
    const mode = normaliseMode(preferredWorkspace?.mode ?? "html-css")
    const workspaceId = preferredWorkspace?.id ?? DIRECT_WORKSPACE_IDS[mode]

    renderWorkspace(workspaceId, mode, preferredWorkspace?.source ?? "direct")
  }

  modeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      handleModeChange(button.dataset.playgroundMode)
    })
  })

  resetWorkspaceButton?.addEventListener("click", resetWorkspace)
  resetViewButton?.addEventListener("click", () => {
    activeApi?.resetView()
  })

  window.addEventListener("beforeunload", saveNow)
}

if (mount) {
  init()
}
