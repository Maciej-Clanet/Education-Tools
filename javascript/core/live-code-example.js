import {
  removeStorage,
  writeSessionStorage,
  writeStorage,
} from "./storage.js"

const DEFAULT_DEBOUNCE = 300
const DEFAULT_SPLIT = 55
const MIN_SPLIT = 30
const MAX_SPLIT = 70
const MIN_CODE_ZOOM = 0.75
const MAX_CODE_ZOOM = 2.4
const CODE_ZOOM_STEP = 0.1
const DEFAULT_JS_TIMEOUT = 3000
const NARROW_LAYOUT_QUERY = "(max-width: 820px)"
const PLAYGROUND_HANDOFF_PREFIX = "code-playground-handoff"
const DEFAULT_PLAYGROUND_HREF = "../tools/code-playground.html"

const BLOCKED_ELEMENTS =
  "script, noscript, iframe, frame, frameset, object, embed, link, meta, base"
const URL_ATTRIBUTES = new Set([
  "action",
  "background",
  "cite",
  "data",
  "formaction",
  "href",
  "longdesc",
  "manifest",
  "ping",
  "poster",
  "profile",
  "src",
  "srcdoc",
  "srcset",
  "usemap",
  "xlink:href",
])
const PREVIEW_CSP = [
  "default-src 'none'",
  "script-src 'none'",
  "style-src 'unsafe-inline'",
  "img-src data:",
  "font-src 'none'",
  "media-src 'none'",
  "connect-src 'none'",
  "object-src 'none'",
  "frame-src 'none'",
  "worker-src 'none'",
  "form-action 'none'",
  "base-uri 'none'",
  "navigate-to 'none'",
].join("; ")

const PREVIEW_BASE_CSS = `
  :root { color-scheme: light; }
  *, *::before, *::after { box-sizing: border-box; }
  html { min-height: 100%; background: #fffdf8; }
  body {
    min-height: 100%;
    margin: 0;
    padding: 1.25rem;
    background: #fffdf8;
    color: #24313b;
    font-family: Arial, Helvetica, sans-serif;
    line-height: 1.5;
    overflow-wrap: anywhere;
  }
`

const LAYOUTS = [
  {
    id: "side-by-side",
    label: "Side by side",
    resultLabel: "Code beside result",
  },
  {
    id: "code-top",
    label: "Code above result",
    resultLabel: "Code above result",
  },
  {
    id: "result-top",
    label: "Result above code",
    resultLabel: "Result above code",
  },
]

const JAVASCRIPT_WORKER_SOURCE = `
(() => {
  const originalFetch = typeof self.fetch === "function" ? self.fetch.bind(self) : null;
  const blockedNetworkMessage = "Network requests are not available in this exercise.";
  const pendingTasks = new Set();

  function trackPromise(promise) {
    pendingTasks.add(promise);
    promise.then(
      () => pendingTasks.delete(promise),
      () => pendingTasks.delete(promise)
    );

    return promise;
  }

  function normalisePolicy(policy) {
    if (!policy || policy.mode !== "allowlist") {
      return { mode: "disabled", allowedOrigins: [], allowedUrls: [] };
    }

    return {
      mode: "allowlist",
      allowedOrigins: Array.isArray(policy.allowedOrigins)
        ? policy.allowedOrigins.map(String)
        : [],
      allowedUrls: Array.isArray(policy.allowedUrls)
        ? policy.allowedUrls.map(String)
        : [],
    };
  }

  function isAllowedUrl(url, policy) {
    return (
      policy.allowedOrigins.includes(url.origin) ||
      policy.allowedUrls.some((allowedUrl) => url.href.startsWith(allowedUrl))
    );
  }

  function createFetch(policy) {
    const normalisedPolicy = normalisePolicy(policy);

    return (input, init = {}) => {
      if (normalisedPolicy.mode !== "allowlist" || !originalFetch) {
        return trackPromise(Promise.reject(new Error(blockedNetworkMessage)));
      }

      const url = new URL(
        typeof input === "string" ? input : input?.url ?? "",
        self.location.href
      );

      if (!["http:", "https:"].includes(url.protocol) || !isAllowedUrl(url, normalisedPolicy)) {
        return trackPromise(Promise.reject(
          new Error("This exercise can only request approved teaching URLs.")
        ));
      }

      return trackPromise(originalFetch(input, {
        ...init,
        credentials: "omit",
      }));
    };
  }

  async function settleTrackedTasks() {
    for (let index = 0; index < 20 && pendingTasks.size > 0; index += 1) {
      await Promise.race([
        Promise.allSettled(Array.from(pendingTasks)),
        new Promise((resolve) => setTimeout(resolve, 50)),
      ]);
    }
  }

  function formatValue(value, seen = []) {
    if (value === null) {
      return "null";
    }

    if (value === undefined) {
      return "undefined";
    }

    if (typeof value === "string") {
      return value;
    }

    if (["number", "boolean", "bigint", "symbol"].includes(typeof value)) {
      return String(value);
    }

    if (typeof value === "function") {
      return "[Function]";
    }

    if (value instanceof Error) {
      return formatError(value);
    }

    if (seen.includes(value)) {
      return "[Circular]";
    }

    const nextSeen = [...seen, value];

    if (Array.isArray(value)) {
      const items = value
        .slice(0, 30)
        .map((item) => formatValue(item, nextSeen));
      const suffix = value.length > 30 ? ", ..." : "";

      return "[" + items.join(", ") + suffix + "]";
    }

    if (value instanceof Date) {
      return value.toISOString();
    }

    const keys = Object.keys(value);
    const entries = keys
      .slice(0, 30)
      .map((key) => key + ": " + formatValue(value[key], nextSeen));
    const suffix = keys.length > 30 ? ", ..." : "";

    return "{ " + entries.join(", ") + suffix + " }";
  }

  function getLearnerLine(stack) {
    const match = String(stack ?? "").match(/learner-code\\.js:(\\d+):(\\d+)/);

    if (!match) {
      return "";
    }

    return "line " + match[1];
  }

  function formatError(error) {
    const name = error?.name ? String(error.name) : "Error";
    const message = error?.message ? String(error.message) : String(error);
    const line = getLearnerLine(error?.stack);

    return name + ": " + message + (line ? " (" + line + ")" : "");
  }

  function postConsole(severity, values) {
    self.postMessage({
      type: "console",
      severity,
      text: values.map((value) => formatValue(value)).join(" "),
    });
  }

  function configureRuntime(policy) {
    self.fetch = createFetch(policy);
    self.XMLHttpRequest = undefined;
    self.WebSocket = undefined;
    self.EventSource = undefined;
    self.importScripts = () => {
      throw new Error("Importing external scripts is not available in this exercise.");
    };
    self.console = {
      log: (...values) => postConsole("log", values),
      info: (...values) => postConsole("log", values),
      warn: (...values) => postConsole("warn", values),
      error: (...values) => postConsole("error", values),
    };
  }

  self.onunhandledrejection = (event) => {
    event.preventDefault();
    self.postMessage({
      type: "error",
      severity: "error",
      text: formatError(event.reason),
    });
  };

  self.onerror = (message, source, lineno) => {
    self.postMessage({
      type: "error",
      severity: "error",
      text: "Error: " + String(message) + (lineno ? " (line " + lineno + ")" : ""),
    });
    return true;
  };

  self.onmessage = async (event) => {
    const payload = event.data ?? {};
    configureRuntime(payload.policy);

    try {
      const result = (0, eval)(String(payload.code ?? "") + "\\n//# sourceURL=learner-code.js");

      if (result && typeof result.then === "function") {
        await result;
      }

      await Promise.resolve();
      await settleTrackedTasks();
      await Promise.resolve();
      self.postMessage({ type: "done" });
    } catch (error) {
      self.postMessage({
        type: "error",
        severity: "error",
        text: formatError(error),
      });
      self.postMessage({ type: "done" });
    }
  };
})();
`

let javascriptWorkerUrl = null

function createElement(tagName, className = "", text = "") {
  const element = document.createElement(tagName)

  if (className) {
    element.className = className
  }

  if (text) {
    element.textContent = text
  }

  return element
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function copySerializable(value) {
  return JSON.parse(JSON.stringify(value ?? null))
}

function getGeneratedId(prefix = "live-code") {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`
}

function normalizeSourceType(type) {
  if (type === "js") {
    return "javascript"
  }

  return String(type ?? "").toLowerCase()
}

function normalizeSource(source, index) {
  const type = normalizeSourceType(source.type ?? source.id ?? `source-${index + 1}`)
  const initialCode = String(source.initialCode ?? source.code ?? "")

  return {
    id: source.id ?? type,
    type,
    label:
      source.label ??
      (type === "javascript" ? "JavaScript" : type.toUpperCase()),
    initialCode,
    currentCode: String(source.currentCode ?? source.code ?? initialCode),
  }
}

function normalizeExecutionMode(example, sources) {
  const configuredMode = example.executionMode ?? example.mode ?? example.execution?.mode

  if (configuredMode === "js" || configuredMode === "javascript") {
    return "javascript"
  }

  if (configuredMode === "javascript-console") {
    return "javascript"
  }

  if (configuredMode === "html-css" || configuredMode === "preview") {
    return "html-css"
  }

  if (sources.every((source) => source.type === "javascript")) {
    return "javascript"
  }

  return "html-css"
}

function normalizeNetworkPolicy(execution = {}) {
  const network = execution.network ?? {}

  if (network.mode === "allowlist") {
    return {
      mode: "allowlist",
      allowedOrigins: Array.isArray(network.allowedOrigins)
        ? network.allowedOrigins.map(String)
        : [],
      allowedUrls: Array.isArray(network.allowedUrls)
        ? network.allowedUrls.map(String)
        : [],
    }
  }

  return {
    mode: "disabled",
    allowedOrigins: [],
    allowedUrls: [],
  }
}

function normalizeExecutionConfig(example, mode) {
  const execution = example.execution ?? {}

  return {
    mode,
    timeoutMs: clamp(
      Number(execution.timeoutMs ?? example.timeoutMs ?? DEFAULT_JS_TIMEOUT),
      500,
      10000
    ),
    network: normalizeNetworkPolicy(execution),
  }
}

function getSupportedSourceTypes(mode) {
  return mode === "javascript" ? ["javascript"] : ["html", "css"]
}

function getResultPaneLabel(mode) {
  return mode === "javascript" ? "Console" : "Generated preview"
}

function getLayoutLabel(layoutId, mode) {
  const layout = LAYOUTS.find((item) => item.id === layoutId) ?? LAYOUTS[0]

  if (mode === "javascript") {
    return layout.label.replaceAll("result", "console")
  }

  return layout.label.replaceAll("result", "preview")
}

function normalizeLayoutId(layout) {
  return LAYOUTS.some((item) => item.id === layout) ? layout : "side-by-side"
}

function getCurrentLayout(example) {
  return normalizeLayoutId(example.layout ?? example.defaultLayout)
}

function getDefaultLayout(example) {
  return normalizeLayoutId(example.defaultLayout ?? example.layout)
}

function appendSyntaxText(parent, value, token = "") {
  if (!value) {
    return
  }

  if (!token) {
    parent.append(document.createTextNode(value))
    return
  }

  const span = document.createElement("span")
  span.className = `live-code__token live-code__token--${token}`
  span.textContent = value
  parent.append(span)
}

function renderTokenizedCode(output, code, patterns) {
  const fragment = document.createDocumentFragment()
  let index = 0

  while (index < code.length) {
    const match = patterns
      .map((pattern) => {
        pattern.regex.lastIndex = index
        const result = pattern.regex.exec(code)

        return result?.index === index ? { ...pattern, text: result[0] } : null
      })
      .find(Boolean)

    if (match?.text) {
      appendSyntaxText(fragment, match.text, match.token)
      index += match.text.length
    } else {
      appendSyntaxText(fragment, code[index])
      index += 1
    }
  }

  output.replaceChildren(fragment)
}

function appendHtmlAttributeTokens(parent, value) {
  const attributePattern =
    /(\s+)([^\s=/>]+)(?:(\s*=\s*)("[^"]*"|'[^']*'|[^\s"'>=]+))?/g
  let lastIndex = 0
  let match = attributePattern.exec(value)

  while (match) {
    appendSyntaxText(parent, value.slice(lastIndex, match.index))
    appendSyntaxText(parent, match[1])
    appendSyntaxText(parent, match[2], "attr")

    if (match[3]) {
      appendSyntaxText(parent, match[3], "punct")
    }

    if (match[4]) {
      appendSyntaxText(parent, match[4], "string")
    }

    lastIndex = attributePattern.lastIndex
    match = attributePattern.exec(value)
  }

  appendSyntaxText(parent, value.slice(lastIndex))
}

function renderHighlightedHtmlSyntax(output, code) {
  const fragment = document.createDocumentFragment()
  const tagPattern =
    /(<!--[\s\S]*?-->)|(<!doctype[^>]*>)|(<\/?)([a-zA-Z][\w:-]*)([^>]*?)(\/?>)/gi
  let lastIndex = 0
  let match = tagPattern.exec(code)

  while (match) {
    appendSyntaxText(fragment, code.slice(lastIndex, match.index))

    if (match[1]) {
      appendSyntaxText(fragment, match[1], "comment")
    } else if (match[2]) {
      appendSyntaxText(fragment, match[2], "keyword")
    } else {
      appendSyntaxText(fragment, match[3], "punct")
      appendSyntaxText(fragment, match[4], "tag")
      appendHtmlAttributeTokens(fragment, match[5])
      appendSyntaxText(fragment, match[6], "punct")
    }

    lastIndex = tagPattern.lastIndex
    match = tagPattern.exec(code)
  }

  appendSyntaxText(fragment, code.slice(lastIndex))
  output.replaceChildren(fragment)
}

function renderSyntaxHighlightedCode(output, code, type) {
  const normalisedType = normalizeSourceType(type)

  if (normalisedType === "html") {
    renderHighlightedHtmlSyntax(output, String(code ?? ""))
    return
  }

  const cssPatterns = [
    { token: "comment", regex: /\/\*[\s\S]*?\*\//y },
    { token: "string", regex: /"[^"]*"|'[^']*'/y },
    { token: "number", regex: /#[0-9a-fA-F]{3,8}\b/y },
    {
      token: "number",
      regex: /\b\d+(?:\.\d+)?(?:px|rem|em|%|vh|vw|s|ms|deg)?\b/y,
    },
    { token: "property", regex: /-{0,2}[a-zA-Z][-\w]*(?=\s*:)/y },
    {
      token: "keyword",
      regex:
        /\b(?:auto|block|bold|border-box|center|flex|grid|inline|italic|none|relative|solid|transparent|underline)\b/y,
    },
    { token: "selector", regex: /[.#]?[a-zA-Z][-\w]*(?=[\s.#:[,{>+~])/y },
    { token: "punct", regex: /[{}():;,]/y },
  ]
  const javascriptPatterns = [
    { token: "comment", regex: /\/\/[^\n]*|\/\*[\s\S]*?\*\//y },
    {
      token: "string",
      regex: /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`/y,
    },
    { token: "number", regex: /\b\d+(?:\.\d+)?\b/y },
    {
      token: "keyword",
      regex:
        /\b(?:async|await|break|case|catch|class|const|continue|do|else|false|finally|for|function|if|in|instanceof|let|new|null|of|return|switch|throw|true|try|typeof|undefined|var|while)\b/y,
    },
    { token: "function", regex: /\b(?:console\.(?:error|info|log|warn)|[a-zA-Z_$][\w$]*)(?=\s*\()/y },
    { token: "punct", regex: /[{}()[\].,;:+\-*\/%=<>!&|?]/y },
  ]
  const patterns =
    normalisedType === "css" ? cssPatterns : javascriptPatterns

  renderTokenizedCode(output, String(code ?? ""), patterns)
}

function renderReadonlyLiveCode(output, code, type) {
  const lines = String(code ?? "").replace(/\r\n/g, "\n").split("\n")

  output.replaceChildren(
    ...lines.map((line, index) => {
      const row = createElement("div", "live-code__line")
      const number = createElement(
        "span",
        "live-code__line-number",
        String(index + 1)
      )
      const content = createElement("span", "live-code__line-code")

      renderSyntaxHighlightedCode(content, line || " ", type)
      row.append(number, content)
      return row
    })
  )
}

function escapeStyleEndTags(css) {
  return css.replace(/<\/style/gi, "<\\/style")
}

export function sanitizeLivePreviewHtml(markup) {
  const parsed = new DOMParser().parseFromString(
    `<!doctype html><html><body>${markup}</body></html>`,
    "text/html"
  )

  parsed.querySelectorAll(BLOCKED_ELEMENTS).forEach((element) => element.remove())

  parsed.querySelectorAll("*").forEach((element) => {
    Array.from(element.attributes).forEach((attribute) => {
      const name = attribute.name.toLowerCase()

      if (name.startsWith("on") || URL_ATTRIBUTES.has(name)) {
        element.removeAttribute(attribute.name)
      }
    })
  })

  return parsed.body.innerHTML
}

export function buildLivePreviewDocument(example, sources) {
  const sourceByType = new Map(sources.map((source) => [source.type, source]))
  const visibleHtml = sourceByType.get("html")?.currentCode ?? ""
  const visibleCss = sourceByType.get("css")?.currentCode ?? ""
  const scaffold = example.scaffold ?? {}
  const combinedHtml = sourceByType.has("html")
    ? `${scaffold.htmlBefore ?? ""}${visibleHtml}${scaffold.htmlAfter ?? ""}`
    : scaffold.html ?? ""
  const combinedCss = `${PREVIEW_BASE_CSS}\n${scaffold.css ?? ""}\n${visibleCss}`
  const safeHtml = sanitizeLivePreviewHtml(combinedHtml)
  const safeCss = escapeStyleEndTags(combinedCss)

  return `<!doctype html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="${PREVIEW_CSP}">
  <style>${safeCss}</style>
</head>
<body>${safeHtml}</body>
</html>`
}

function getJavaScriptWorkerUrl() {
  if (!javascriptWorkerUrl) {
    javascriptWorkerUrl = URL.createObjectURL(
      new Blob([JAVASCRIPT_WORKER_SOURCE], { type: "text/javascript" })
    )
  }

  return javascriptWorkerUrl
}

function insertIndentation(textarea) {
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const value = textarea.value

  if (start === end) {
    textarea.setRangeText("  ", start, end, "end")
    return
  }

  const lineStart = value.lastIndexOf("\n", start - 1) + 1
  const selected = value.slice(lineStart, end)
  const changed = selected
    .split("\n")
    .map((line) => `  ${line}`)
    .join("\n")

  textarea.setRangeText(changed, lineStart, end, "select")
}

function removeIndentation(textarea) {
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const value = textarea.value
  const lineStart = value.lastIndexOf("\n", start - 1) + 1
  const selected = value.slice(lineStart, end)
  let removedBeforeStart = 0
  let removedTotal = 0
  const changed = selected
    .split("\n")
    .map((line, index) => {
      const match = line.match(/^( {1,2}|\t)/)
      const amount = match?.[0].length ?? 0
      removedTotal += amount

      if (index === 0) {
        removedBeforeStart = Math.min(amount, start - lineStart)
      }

      return line.slice(amount)
    })
    .join("\n")

  textarea.setRangeText(changed, lineStart, end, "select")
  textarea.setSelectionRange(
    Math.max(lineStart, start - removedBeforeStart),
    Math.max(lineStart, end - removedTotal)
  )
}

function createInstructionDisclosure(example, open, options = {}) {
  const hasTitle = Boolean(options.title)
  const details = createElement(
    "details",
    `live-code-task__instructions${hasTitle ? " live-code-task__instructions--with-title" : ""}`
  )
  const summary = createElement("summary")
  const body = createElement("div", "live-code-task__instruction-copy")
  const text = example.instructions ?? example.description ?? ""

  details.open = Boolean(open)

  if (hasTitle) {
    summary.append(
      createElement("span", "live-code-task__instruction-title", options.title),
      createElement("span", "live-code-task__instruction-label", "Instructions")
    )
  } else {
    summary.textContent = "Instructions"
  }

  body.textContent = text
  details.append(summary, body)

  return details
}

export function createLiveCodeWorkspace(root, example, options = {}) {
  const componentId = example.id ?? getGeneratedId()
  const sources = (example.sources ?? []).map(normalizeSource)
  const mode = normalizeExecutionMode(example, sources)
  const supportedTypes = getSupportedSourceTypes(mode)
  const unsupported = sources.filter((source) => !supportedTypes.includes(source.type))

  if (!sources.length) {
    root.textContent = "This live code example has no visible source to edit."
    return null
  }

  if (unsupported.length) {
    root.textContent =
      "This live code example uses a source type that is not available here."
    return null
  }

  const execution = normalizeExecutionConfig(example, mode)
  const narrowLayoutMedia =
    typeof window.matchMedia === "function"
      ? window.matchMedia(NARROW_LAYOUT_QUERY)
      : null
  const isPlayground = options.variant === "playground"
  const alwaysEditing = Boolean(options.alwaysEditing ?? isPlayground)
  const showTaskChrome = options.showTaskChrome !== false
  const showOpenInPlayground =
    mode === "html-css" && !isPlayground && options.showOpenInPlayground !== false
  const showResetCode = options.showResetCodeButton ?? !isPlayground
  const showResetViewInMenu = options.showResetViewInMenu ?? !isPlayground
  const resultLabel = getResultPaneLabel(mode)
  const state = {
    activeSourceId: sources[0].id,
    editing: alwaysEditing || mode === "javascript",
    split: clamp(Number(example.split ?? example.defaultSplit ?? DEFAULT_SPLIT), MIN_SPLIT, MAX_SPLIT),
    codeZoom: clamp(Number(example.codeZoom ?? 1), MIN_CODE_ZOOM, MAX_CODE_ZOOM),
    layout: getCurrentLayout(example),
    updateTimer: null,
    menuOpen: false,
    worker: null,
    runTimer: null,
    running: false,
    consoleEntries: [],
  }

  const task = createElement("section", "live-code-task")
  const taskHeader = createElement("div", "live-code-task__header")
  const titleInsideInstructions = Boolean(options.titleInsideInstructions)
  const instructionsText = example.instructions ?? example.description ?? ""
  const taskTitle =
    titleInsideInstructions && instructionsText
      ? null
      : createElement("h3", "live-code-task__title", example.title ?? "Try the code")
  const instructions = instructionsText
    ? createInstructionDisclosure(
        example,
        options.instructionsDefaultOpen ??
          example.instructionsOpen ??
          !document.body.classList.contains("teacher-mode-active"),
        {
          title: titleInsideInstructions ? example.title ?? "Try the code" : "",
        }
      )
    : null
  const shell = createElement(
    "article",
    `live-code-example live-code-example--${mode === "javascript" ? "javascript" : "preview"}`
  )
  const toolbar = createElement("div", "live-code__toolbar")
  const tabs = createElement("div", "live-code__tabs")
  const toolbarActions = createElement("div", "live-code__toolbar-actions")
  const zoomControls = createElement("div", "live-code__zoom-controls")
  const zoomDown = createElement("button", "live-code__icon-button", "-")
  const zoomValue = createElement("output", "live-code__zoom-value", "100%")
  const zoomUp = createElement("button", "live-code__icon-button", "+")
  const layoutControl = createElement("div", "live-code__layout-control")
  const layoutButton = createElement("button", "live-code__menu-button")
  const layoutMenu = createElement("div", "live-code__layout-menu")
  const fullscreenButton = createElement(
    "button",
    "lesson-secondary-action live-code__fullscreen",
    "Fullscreen"
  )
  const tryButton = createElement("button", "live-code__primary-action", "Try it")
  const runButton = createElement("button", "live-code__primary-action", "Run")
  const stopButton = createElement("button", "lesson-secondary-action", "Stop")
  const resetCodeButton = createElement(
    "button",
    "lesson-secondary-action",
    mode === "javascript" ? "Reset code" : "Reset code"
  )
  const openPlaygroundButton = createElement(
    "button",
    "lesson-secondary-action live-code__open-playground",
    "Open in Playground"
  )
  const workspace = createElement("div", "live-code__workspace")
  const codePane = createElement("section", "live-code__code-pane")
  const readonlyCode = createElement("div", "code-preview__code live-code__readonly")
  const editorShell = createElement("div", "live-code__editor-shell")
  const editorHighlight = createElement("pre", "live-code__editor-highlight")
  const editor = createElement("textarea", "live-code__editor")
  const separator = createElement("div", "live-code__separator")
  const resultPane = createElement("section", "live-code__result-pane")
  const resultHeading = createElement("div", "live-code__result-heading")
  const resultTitle = createElement("strong", "", resultLabel)
  const resultStatus = createElement("span", "live-code__result-status")
  const iframe = document.createElement("iframe")
  const consoleOutput = createElement("div", "live-code__console-output")
  const announcer = createElement("p", "sr-only")
  let instructionsTouched = false
  const handleDocumentPointerDown = (event) => {
    if (!state.menuOpen || layoutControl.contains(event.target)) {
      return
    }

    state.menuOpen = false
    updateLayoutMenu()
  }
  const teacherModeObserver = instructions
    ? new MutationObserver(() => {
        if (
          instructionsTouched ||
          !document.body.classList.contains("teacher-mode-active") ||
          !instructions.open
        ) {
          return
        }

        instructions.open = false
      })
    : null

  function getActiveSource() {
    return sources.find((source) => source.id === state.activeSourceId) ?? sources[0]
  }

  function getEffectiveLayout() {
    if (state.layout === "side-by-side" && narrowLayoutMedia?.matches) {
      return "code-top"
    }

    return state.layout
  }

  function syncEditorHighlightScroll() {
    editorHighlight.scrollTop = editor.scrollTop
    editorHighlight.scrollLeft = editor.scrollLeft
  }

  function updateEditorHighlight() {
    renderSyntaxHighlightedCode(editorHighlight, editor.value, getActiveSource().type)
    syncEditorHighlightScroll()
  }

  function isFullscreenActive() {
    return document.fullscreenElement === shell
  }

  function updateFullscreenButton() {
    const supported =
      typeof shell.requestFullscreen === "function" &&
      typeof document.exitFullscreen === "function"

    fullscreenButton.hidden = !supported
    fullscreenButton.textContent = isFullscreenActive()
      ? "Exit fullscreen"
      : "Fullscreen"
    fullscreenButton.setAttribute("aria-pressed", String(isFullscreenActive()))
  }

  async function toggleFullscreen() {
    try {
      if (isFullscreenActive()) {
        await document.exitFullscreen?.()
      } else {
        await shell.requestFullscreen?.()
      }
    } catch {
      announce("Fullscreen could not be changed in this browser.")
    }

    updateFullscreenButton()
  }

  function announce(message) {
    announcer.textContent = ""
    window.requestAnimationFrame(() => {
      announcer.textContent = message
    })
  }

  function notifyChange() {
    options.onChange?.(api)
  }

  function terminateWorker(message = "") {
    if (state.worker) {
      state.worker.terminate()
      state.worker = null
    }

    if (state.runTimer) {
      window.clearTimeout(state.runTimer)
      state.runTimer = null
    }

    state.running = false
    updateRunControls()

    if (message) {
      addConsoleEntry("error", message)
      announce(message)
    }
  }

  function addConsoleEntry(severity, text) {
    state.consoleEntries.push({
      severity,
      text: String(text),
    })

    if (state.consoleEntries.length > 120) {
      state.consoleEntries.shift()
    }

    renderConsole()
  }

  function renderConsole() {
    if (mode !== "javascript") {
      return
    }

    if (!state.consoleEntries.length) {
      const empty = createElement(
        "p",
        "live-code__console-empty",
        "Run your code to see console output here."
      )
      consoleOutput.replaceChildren(empty)
      return
    }

    consoleOutput.replaceChildren(
      ...state.consoleEntries.map((entry) => {
        const row = createElement(
          "div",
          `live-code__console-entry live-code__console-entry--${entry.severity}`
        )
        const label = createElement(
          "strong",
          "live-code__console-severity",
          entry.severity === "warn"
            ? "Warning"
            : entry.severity === "error"
              ? "Error"
              : "Log"
        )
        const message = createElement("span", "live-code__console-message", entry.text)

        row.append(label, message)
        return row
      })
    )
  }

  function updatePreview(immediate = false) {
    if (mode !== "html-css") {
      return
    }

    window.clearTimeout(state.updateTimer)
    iframe.setAttribute("aria-busy", "true")
    resultStatus.textContent = "Updating..."

    const render = () => {
      iframe.srcdoc = buildLivePreviewDocument(example, sources)
      resultStatus.textContent = "Preview updated"
    }

    if (immediate) {
      render()
    } else {
      state.updateTimer = window.setTimeout(
        render,
        clamp(Number(example.debounce ?? DEFAULT_DEBOUNCE), 200, 400)
      )
    }
  }

  function runJavaScript() {
    if (mode !== "javascript") {
      return
    }

    terminateWorker()
    state.consoleEntries = []
    renderConsole()
    resultStatus.textContent = "Running..."
    state.running = true
    updateRunControls()

    const worker = new Worker(getJavaScriptWorkerUrl())
    state.worker = worker
    state.runTimer = window.setTimeout(() => {
      terminateWorker(
        "Execution was stopped because the program ran for too long. Check whether a loop can ever finish."
      )
      resultStatus.textContent = "Stopped"
    }, execution.timeoutMs)

    worker.addEventListener("message", (event) => {
      if (worker !== state.worker) {
        return
      }

      const message = event.data ?? {}

      if (message.type === "console") {
        addConsoleEntry(message.severity ?? "log", message.text ?? "")
        return
      }

      if (message.type === "error") {
        addConsoleEntry("error", message.text ?? "The program stopped with an error.")
        return
      }

      if (message.type === "done") {
        terminateWorker()
        resultStatus.textContent = "Finished"
      }
    })

    worker.addEventListener("error", (event) => {
      if (worker !== state.worker) {
        return
      }

      addConsoleEntry(
        "error",
        `Error: ${event.message}${event.lineno ? ` (line ${event.lineno})` : ""}`
      )
      terminateWorker()
      resultStatus.textContent = "Stopped"
    })

    worker.postMessage({
      code: sources.find((source) => source.type === "javascript")?.currentCode ?? "",
      policy: execution.network,
    })
  }

  function updateTabs() {
    tabs.querySelectorAll("[role='tab']").forEach((tab) => {
      const selected = tab.dataset.sourceId === state.activeSourceId
      tab.setAttribute("aria-selected", String(selected))
      tab.tabIndex = selected ? 0 : -1
      tab.classList.toggle("is-active", selected)
    })
  }

  function updateSourceView() {
    const source = getActiveSource()

    editor.value = source.currentCode
    editor.setAttribute("aria-label", `Edit ${source.label} source`)
    codePane.setAttribute("aria-labelledby", `${componentId}-tab-${source.id}`)
    renderReadonlyLiveCode(readonlyCode, source.currentCode, source.type)
    updateEditorHighlight()
    updateTabs()
  }

  function updateEditingState(shouldFocus = false) {
    shell.classList.toggle("is-editing", state.editing)

    if (mode === "html-css" && !alwaysEditing) {
      tryButton.textContent = state.editing ? "View code" : "Try it"
      tryButton.setAttribute("aria-pressed", String(state.editing))
    }

    if (showResetCode) {
      resetCodeButton.hidden = mode === "html-css" && !state.editing && !alwaysEditing
    }

    readonlyCode.hidden = state.editing
    editorShell.hidden = !state.editing

    if (!state.editing) {
      readonlyCode.tabIndex = 0
    }

    if (!shouldFocus) {
      return
    }

    if (state.editing) {
      editor.focus()
    } else {
      readonlyCode.focus()
    }
  }

  function updateLayoutMenu() {
    layoutButton.textContent = `Layout: ${getLayoutLabel(state.layout, mode)}`
    layoutButton.setAttribute("aria-expanded", String(state.menuOpen))
    layoutMenu.hidden = !state.menuOpen

    layoutMenu.querySelectorAll("[data-layout-value]").forEach((button) => {
      const selected = button.dataset.layoutValue === state.layout
      button.setAttribute("aria-checked", String(selected))
      button.classList.toggle("is-selected", selected)
      button.querySelector("[data-role='layout-current']").hidden = !selected
    })
  }

  function updateLayout() {
    const effectiveLayout = getEffectiveLayout()
    const isSideBySide = effectiveLayout === "side-by-side"

    shell.dataset.layout = state.layout
    shell.dataset.effectiveLayout = effectiveLayout
    shell.style.setProperty("--live-code-split", `${state.split}%`)
    shell.style.setProperty("--live-code-inverse-split", `${100 - state.split}%`)
    shell.style.setProperty("--live-code-local-zoom", state.codeZoom.toFixed(2))
    separator.setAttribute(
      "aria-orientation",
      isSideBySide ? "vertical" : "horizontal"
    )
    separator.setAttribute("aria-valuenow", String(Math.round(state.split)))
    separator.setAttribute(
      "aria-valuetext",
      `${Math.round(state.split)}% code and ${Math.round(100 - state.split)}% ${resultLabel.toLowerCase()}`
    )
    zoomValue.value = `${Math.round(state.codeZoom * 100)}%`
    zoomValue.textContent = `${Math.round(state.codeZoom * 100)}%`
    zoomDown.disabled = state.codeZoom <= MIN_CODE_ZOOM
    zoomUp.disabled = state.codeZoom >= MAX_CODE_ZOOM
    updateLayoutMenu()
  }

  function updateRunControls() {
    runButton.disabled = state.running
    stopButton.disabled = !state.running
  }

  function setSplit(nextSplit, shouldAnnounce = true) {
    state.split = clamp(nextSplit, MIN_SPLIT, MAX_SPLIT)
    updateLayout()
    notifyChange()

    if (shouldAnnounce) {
      announce(separator.getAttribute("aria-valuetext"))
    }
  }

  function setCodeZoom(nextZoom) {
    state.codeZoom = clamp(nextZoom, MIN_CODE_ZOOM, MAX_CODE_ZOOM)
    updateLayout()
    notifyChange()
    announce(`Code size ${Math.round(state.codeZoom * 100)}%`)
  }

  function setLayout(nextLayout, shouldFocusButton = false) {
    if (!LAYOUTS.some((layout) => layout.id === nextLayout)) {
      return
    }

    state.layout = nextLayout
    state.menuOpen = false
    updateLayout()
    notifyChange()
    announce(`${getLayoutLabel(nextLayout, mode)} layout selected.`)

    if (shouldFocusButton) {
      layoutButton.focus()
    }
  }

  function selectSource(sourceId, focusTab = false) {
    const nextSource = sources.find((source) => source.id === sourceId)

    if (!nextSource) {
      return
    }

    state.activeSourceId = nextSource.id
    updateSourceView()

    if (focusTab) {
      tabs.querySelector(`[data-source-id="${CSS.escape(sourceId)}"]`)?.focus()
    } else if (state.editing) {
      editor.focus()
    }
  }

  function resetCode() {
    sources.forEach((source) => {
      source.currentCode = source.initialCode
    })
    updateSourceView()

    if (mode === "html-css") {
      updatePreview(true)
    } else {
      terminateWorker()
      state.consoleEntries = []
      renderConsole()
      resultStatus.textContent = "Ready"
    }

    notifyChange()
    announce("Code reset to the starting example.")

    if (state.editing) {
      editor.focus()
    }
  }

  function resetView() {
    state.split = clamp(
      Number(example.defaultSplit ?? DEFAULT_SPLIT),
      MIN_SPLIT,
      MAX_SPLIT
    )
    state.codeZoom = 1
    state.layout = getDefaultLayout(example)
    updateLayout()
    notifyChange()
    announce("View reset. Code was not changed.")
  }

  function getWorkspaceSnapshot() {
    return {
      schemaVersion: 1,
      title: example.title ?? "Code Playground",
      instructions: example.instructions ?? example.description ?? "",
      executionMode: mode,
      sources: sources.map((source) => ({
        id: source.id,
        type: source.type,
        label: source.label,
        initialCode: source.initialCode,
        code: source.currentCode,
      })),
      scaffold: copySerializable(example.scaffold ?? {}),
      execution: copySerializable(execution),
      defaultSplit: clamp(Number(example.defaultSplit ?? DEFAULT_SPLIT), MIN_SPLIT, MAX_SPLIT),
      defaultLayout: getDefaultLayout(example),
      layout: state.layout,
      split: state.split,
      codeZoom: state.codeZoom,
    }
  }

  function openInPlayground() {
    const handoffId = `${componentId}-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`
    const payload = {
      ...getWorkspaceSnapshot(),
      openedFrom: window.location.href,
    }
    const url = new URL(
      example.playgroundHref ?? options.playgroundHref ?? DEFAULT_PLAYGROUND_HREF,
      window.location.href
    )
    const storageKey = `${PLAYGROUND_HANDOFF_PREFIX}:${handoffId}`

    writeSessionStorage(storageKey, payload)
    writeStorage(storageKey, payload)
    url.searchParams.set("handoff", handoffId)
    const opened = window.open(url.href, "_blank", "noopener")

    window.setTimeout(() => {
      removeStorage(storageKey)
    }, 60000)

    if (!opened) {
      window.location.href = url.href
    }
  }

  const api = {
    get mode() {
      return mode
    },
    get running() {
      return state.running
    },
    getSnapshot: getWorkspaceSnapshot,
    resetCode,
    resetView,
    run: runJavaScript,
    stop() {
      terminateWorker("Execution stopped.")
      resultStatus.textContent = "Stopped"
    },
    destroy() {
      terminateWorker()
      window.clearTimeout(state.updateTimer)
      narrowLayoutMedia?.removeEventListener?.("change", updateLayout)
      document.removeEventListener("pointerdown", handleDocumentPointerDown)
      document.removeEventListener("fullscreenchange", updateFullscreenButton)
      teacherModeObserver?.disconnect()
    },
  }

  task.dataset.noSlideAdvance = ""
  shell.dataset.noReadAloud = ""
  shell.dataset.mode = mode

  if (showTaskChrome) {
    if (taskTitle) {
      taskHeader.append(taskTitle)
    }

    if (instructions) {
      const instructionSummary = instructions.querySelector("summary")
      instructionSummary?.addEventListener("click", () => {
        instructionsTouched = true
      })
      instructionSummary?.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          instructionsTouched = true
        }
      })
      taskHeader.append(instructions)
    }

    task.append(taskHeader)
  }

  tabs.setAttribute("role", "tablist")
  tabs.setAttribute("aria-label", "Visible source files")
  sources.forEach((source, index) => {
    const tab = createElement("button", "live-code__tab", source.label)
    tab.type = "button"
    tab.id = `${componentId}-tab-${source.id}`
    tab.dataset.sourceId = source.id
    tab.setAttribute("role", "tab")
    tab.setAttribute("aria-controls", `${componentId}-source-panel`)
    tab.setAttribute("aria-selected", String(index === 0))
    tab.tabIndex = index === 0 ? 0 : -1
    tabs.append(tab)
  })

  zoomDown.type = "button"
  zoomDown.setAttribute("aria-label", "Decrease code size")
  zoomUp.type = "button"
  zoomUp.setAttribute("aria-label", "Increase code size")
  zoomValue.setAttribute("aria-label", "Code size")
  zoomControls.setAttribute("aria-label", "Code size controls")
  zoomControls.append(createElement("span", "", "Code size"), zoomDown, zoomValue, zoomUp)

  layoutButton.type = "button"
  layoutButton.id = `${componentId}-layout-button`
  layoutButton.setAttribute("aria-haspopup", "menu")
  layoutButton.setAttribute("aria-controls", `${componentId}-layout-menu`)
  layoutMenu.id = `${componentId}-layout-menu`
  layoutMenu.setAttribute("role", "menu")
  layoutMenu.setAttribute("aria-label", "Choose code layout")
  layoutMenu.hidden = true

  LAYOUTS.forEach((layout) => {
    const item = createElement("button", "live-code__layout-item")
    const label = createElement("span", "", getLayoutLabel(layout.id, mode))
    const current = createElement("span", "live-code__layout-current", "Current")

    item.type = "button"
    item.dataset.layoutValue = layout.id
    item.setAttribute("role", "menuitemradio")
    item.setAttribute("aria-checked", "false")
    current.dataset.role = "layout-current"
    current.hidden = true
    item.append(label, current)
    layoutMenu.append(item)
  })

  if (showResetViewInMenu) {
    const resetViewButton = createElement(
      "button",
      "live-code__layout-item live-code__layout-item--reset",
      "Reset view"
    )
    resetViewButton.type = "button"
    resetViewButton.dataset.action = "reset-view"
    resetViewButton.setAttribute("role", "menuitem")
    layoutMenu.append(resetViewButton)
  }

  layoutControl.append(layoutButton, layoutMenu)
  fullscreenButton.type = "button"
  fullscreenButton.setAttribute("aria-pressed", "false")
  toolbarActions.append(zoomControls, layoutControl, fullscreenButton)

  if (mode === "javascript") {
    runButton.type = "button"
    stopButton.type = "button"
    stopButton.disabled = true
    toolbarActions.append(runButton, stopButton)
  } else if (!alwaysEditing) {
    tryButton.type = "button"
    tryButton.setAttribute("aria-pressed", "false")
    toolbarActions.append(tryButton)
  }

  if (showResetCode) {
    resetCodeButton.type = "button"
    resetCodeButton.hidden = mode === "html-css" && !state.editing && !alwaysEditing
    toolbarActions.append(resetCodeButton)
  }

  if (showOpenInPlayground) {
    openPlaygroundButton.type = "button"
    toolbarActions.append(openPlaygroundButton)
  }

  toolbar.append(tabs, toolbarActions)

  codePane.id = `${componentId}-source-panel`
  codePane.setAttribute("role", "tabpanel")
  codePane.setAttribute("aria-labelledby", `${componentId}-tab-${sources[0].id}`)
  editor.id = `${componentId}-editor`
  editor.spellcheck = false
  editor.autocomplete = "off"
  editor.autocapitalize = "off"
  editor.wrap = "off"
  editorHighlight.setAttribute("aria-hidden", "true")
  readonlyCode.hidden = state.editing
  editorShell.hidden = !state.editing
  editorShell.append(editorHighlight, editor)
  codePane.append(readonlyCode, editorShell)

  separator.tabIndex = 0
  separator.setAttribute("role", "separator")
  separator.setAttribute("aria-label", `Resize code and ${resultLabel.toLowerCase()} panes`)
  separator.setAttribute("aria-valuemin", String(MIN_SPLIT))
  separator.setAttribute("aria-valuemax", String(MAX_SPLIT))

  resultStatus.textContent =
    mode === "javascript" ? "Ready" : "Updates automatically"
  resultHeading.append(resultTitle, resultStatus)
  resultPane.append(resultHeading)

  if (mode === "javascript") {
    consoleOutput.setAttribute("role", "log")
    consoleOutput.setAttribute("aria-live", "polite")
    consoleOutput.setAttribute("aria-relevant", "additions text")
    consoleOutput.setAttribute("aria-label", "Console output")
    resultPane.append(consoleOutput)
  } else {
    iframe.className = "live-code__iframe"
    iframe.title = `Generated preview for ${example.title ?? "live code example"}`
    iframe.setAttribute("sandbox", "")
    iframe.setAttribute("referrerpolicy", "no-referrer")
    iframe.addEventListener("load", () => {
      iframe.setAttribute("aria-busy", "false")
    })
    resultPane.append(iframe)
  }

  workspace.append(codePane, separator, resultPane)
  announcer.setAttribute("role", "status")
  announcer.setAttribute("aria-live", "polite")
  announcer.setAttribute("aria-atomic", "true")
  shell.append(toolbar, workspace, announcer)
  task.append(shell)
  root.replaceChildren(task)

  tabs.addEventListener("click", (event) => {
    const tab = event.target.closest("[data-source-id]")

    if (tab) {
      selectSource(tab.dataset.sourceId)
    }
  })

  tabs.addEventListener("keydown", (event) => {
    const tab = event.target.closest("[data-source-id]")

    if (!tab || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
      return
    }

    event.preventDefault()
    const currentIndex = sources.findIndex((source) => source.id === tab.dataset.sourceId)
    let nextIndex = currentIndex

    if (event.key === "ArrowLeft") {
      nextIndex = (currentIndex - 1 + sources.length) % sources.length
    } else if (event.key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % sources.length
    } else if (event.key === "Home") {
      nextIndex = 0
    } else if (event.key === "End") {
      nextIndex = sources.length - 1
    }

    selectSource(sources[nextIndex].id, true)
  })

  layoutButton.addEventListener("click", () => {
    state.menuOpen = !state.menuOpen
    updateLayoutMenu()

    if (state.menuOpen) {
      const selected = layoutMenu.querySelector(".is-selected")
      selected?.focus()
    }
  })

  layoutButton.addEventListener("keydown", (event) => {
    if (!["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
      return
    }

    event.preventDefault()
    state.menuOpen = true
    updateLayoutMenu()
    const items = Array.from(layoutMenu.querySelectorAll("button"))
    const selectedIndex = items.findIndex((item) => item.classList.contains("is-selected"))
    const fallbackIndex = event.key === "ArrowUp" ? items.length - 1 : 0
    items[selectedIndex >= 0 ? selectedIndex : fallbackIndex]?.focus()
  })

  layoutMenu.addEventListener("click", (event) => {
    const item = event.target.closest("button")

    if (!item) {
      return
    }

    if (item.dataset.layoutValue) {
      setLayout(item.dataset.layoutValue, true)
      return
    }

    if (item.dataset.action === "reset-view") {
      state.menuOpen = false
      resetView()
      layoutButton.focus()
    }
  })

  layoutMenu.addEventListener("keydown", (event) => {
    const items = Array.from(layoutMenu.querySelectorAll("button"))
    const currentIndex = items.indexOf(document.activeElement)
    let nextIndex = currentIndex

    if (event.key === "Escape") {
      event.preventDefault()
      state.menuOpen = false
      updateLayoutMenu()
      layoutButton.focus()
      return
    }

    if (event.key === "Tab") {
      state.menuOpen = false
      updateLayoutMenu()
      return
    }

    if (event.key === "ArrowDown") {
      event.preventDefault()
      nextIndex = (currentIndex + 1) % items.length
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      nextIndex = (currentIndex - 1 + items.length) % items.length
    } else if (event.key === "Home") {
      event.preventDefault()
      nextIndex = 0
    } else if (event.key === "End") {
      event.preventDefault()
      nextIndex = items.length - 1
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      document.activeElement?.click()
    }

    if (nextIndex !== currentIndex) {
      items[nextIndex]?.focus()
    }
  })

  document.addEventListener("pointerdown", handleDocumentPointerDown)
  document.addEventListener("fullscreenchange", updateFullscreenButton)

  tryButton.addEventListener("click", () => {
    state.editing = !state.editing
    updateEditingState(true)
    announce(state.editing ? "Editing activated." : "View mode activated.")
  })

  runButton.addEventListener("click", runJavaScript)
  stopButton.addEventListener("click", () => {
    terminateWorker("Execution stopped.")
    resultStatus.textContent = "Stopped"
  })
  resetCodeButton.addEventListener("click", resetCode)
  openPlaygroundButton.addEventListener("click", openInPlayground)
  fullscreenButton.addEventListener("click", toggleFullscreen)

  editor.addEventListener("input", () => {
    getActiveSource().currentCode = editor.value
    updateEditorHighlight()

    if (mode === "html-css") {
      updatePreview()
    }

    notifyChange()
  })
  editor.addEventListener("scroll", syncEditorHighlightScroll)

  editor.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") {
      return
    }

    event.preventDefault()

    if (event.shiftKey) {
      removeIndentation(editor)
    } else {
      insertIndentation(editor)
    }

    editor.dispatchEvent(new Event("input", { bubbles: true }))
  })

  zoomDown.addEventListener("click", () => {
    setCodeZoom(state.codeZoom - CODE_ZOOM_STEP)
  })
  zoomUp.addEventListener("click", () => {
    setCodeZoom(state.codeZoom + CODE_ZOOM_STEP)
  })

  separator.addEventListener("keydown", (event) => {
    const effectiveLayout = getEffectiveLayout()
    const actions = {
      Home: () => setSplit(MIN_SPLIT),
      End: () => setSplit(MAX_SPLIT),
    }

    if (effectiveLayout === "side-by-side") {
      actions.ArrowLeft = () => setSplit(state.split - 5)
      actions.ArrowRight = () => setSplit(state.split + 5)
    } else if (effectiveLayout === "code-top") {
      actions.ArrowUp = () => setSplit(state.split - 5)
      actions.ArrowDown = () => setSplit(state.split + 5)
    } else {
      actions.ArrowUp = () => setSplit(state.split + 5)
      actions.ArrowDown = () => setSplit(state.split - 5)
    }

    if (actions[event.key]) {
      event.preventDefault()
      actions[event.key]()
    }
  })

  separator.addEventListener("pointerdown", (event) => {
    separator.setPointerCapture(event.pointerId)
    shell.classList.add("is-resizing")
  })

  separator.addEventListener("pointermove", (event) => {
    if (!separator.hasPointerCapture(event.pointerId)) {
      return
    }

    const bounds = workspace.getBoundingClientRect()
    const effectiveLayout = getEffectiveLayout()

    if (effectiveLayout === "side-by-side") {
      setSplit(((event.clientX - bounds.left) / bounds.width) * 100, false)
      return
    }

    const topPercent = ((event.clientY - bounds.top) / bounds.height) * 100
    setSplit(effectiveLayout === "result-top" ? 100 - topPercent : topPercent, false)
  })

  function endResize(event) {
    if (separator.hasPointerCapture(event.pointerId)) {
      separator.releasePointerCapture(event.pointerId)
    }
    shell.classList.remove("is-resizing")
    announce(separator.getAttribute("aria-valuetext"))
  }

  separator.addEventListener("pointerup", endResize)
  separator.addEventListener("pointercancel", endResize)
  narrowLayoutMedia?.addEventListener?.("change", updateLayout)
  teacherModeObserver?.observe(document.body, {
    attributeFilter: ["class"],
    attributes: true,
  })

  updateSourceView()
  updateEditingState()
  updateLayout()
  updateFullscreenButton()
  renderConsole()
  updateRunControls()

  if (mode === "html-css") {
    updatePreview(true)
  }

  return api
}

export function initLiveCodeExamples(examples) {
  const exampleMap = new Map(examples.map((example) => [example.id, example]))

  document.querySelectorAll("[data-live-code-example-id]").forEach((root) => {
    const example = exampleMap.get(root.dataset.liveCodeExampleId)

    if (!example) {
      root.textContent = "This live code example could not be loaded."
      return
    }

    createLiveCodeWorkspace(root, example)
  })
}
