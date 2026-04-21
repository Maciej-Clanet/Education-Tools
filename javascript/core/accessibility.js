import { readStorage, removeStorage, writeStorage } from "./storage.js";

const PERSISTENT_KEY = "accessibility-preferences";

const PERSISTENT_DEFAULTS = {
  simplifyVisuals: false,
  lowDistraction: false,
  highContrast: false,
  dyslexiaFont: false,
  textScale: 1,
  readAloudRate: 1,
};

const SESSION_DEFAULTS = {
  readingMode: false,
  focusMode: false,
};

const MIN_TEXT_SCALE = 0.95;
const MAX_TEXT_SCALE = 1.25;
const TEXT_SCALE_STEP = 0.05;
const READ_ALOUD_RATE_OPTIONS = [
  { value: 0.8, label: "0.8x" },
  { value: 1, label: "1x" },
  { value: 1.2, label: "1.2x" },
  { value: 1.4, label: "1.4x" },
  { value: 1.6, label: "1.6x" },
  { value: 1.8, label: "1.8x" },
  { value: 2, label: "2x" },
  { value: 2.5, label: "2.5x" },
  { value: 3, label: "3x" },
];

const READABLE_BLOCK_SELECTOR = [
  "h1",
  "h2",
  "h3",
  "h4",
  "p",
  "li",
  "dt",
  "dd",
  "legend",
  "label",
  "summary",
  "th",
  "td",
  ".quiz-answer",
].join(", ");

const READ_ALOUD_IGNORE_SELECTOR = [
  "script",
  "style",
  "nav",
  "aside",
  "template",
  "noscript",
  "[hidden]",
  "[aria-hidden='true']",
  ".ad-placeholder",
  ".accessibility-launcher",
  ".accessibility-panel",
  ".accessibility-backdrop",
  ".accessibility-player",
  ".teacher-controls",
  ".structure-controls",
  ".quiz-actions",
  ".lesson-sequence",
  "[data-no-read-aloud]",
].join(", ");

const EDITABLE_TARGET_SELECTOR = [
  "input",
  "textarea",
  "select",
  "[contenteditable='true']",
  "[role='textbox']",
].join(", ");

let persistentPreferences = {
  ...PERSISTENT_DEFAULTS,
};

let sessionModes = {
  ...SESSION_DEFAULTS,
};

let launcherButton;
let backdrop;
let panel;
let noteElement;
let textScaleInput;
let textScaleValue;
let readAloudButton;
let readTargetPreviewElement;
let playerElement;
let playerTargetElement;
let playerStatusElement;
let playerCurrentElement;
let playerProgressElement;
let playerSeekInput;
let playerPlaybackButton;
let playerStopButton;
let playerPrevSectionButton;
let playerNextSectionButton;
let playerRateInput;
let activeUtterance = null;
let activeReadSession = null;
let highlightedReadElement = null;
let previewUpdateFrame = null;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function normaliseReadAloudRate(value) {
  const rate = Number(value);
  const matchedOption = READ_ALOUD_RATE_OPTIONS.find(
    (option) => option.value === rate
  );

  return matchedOption?.value ?? PERSISTENT_DEFAULTS.readAloudRate;
}

function formatReadAloudRate(value) {
  return (
    READ_ALOUD_RATE_OPTIONS.find((option) => option.value === value)?.label ??
    `${value}x`
  );
}

function truncateText(value, maxLength = 180) {
  if (!value) {
    return "";
  }

  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 3).trimEnd()}...`;
}

function normalisePersistentPreferences(value) {
  const textScale = Number(value?.textScale);

  return {
    simplifyVisuals: Boolean(value?.simplifyVisuals),
    lowDistraction: Boolean(value?.lowDistraction),
    highContrast: Boolean(value?.highContrast),
    dyslexiaFont: Boolean(value?.dyslexiaFont),
    textScale: clamp(
      Number.isFinite(textScale) ? textScale : PERSISTENT_DEFAULTS.textScale,
      MIN_TEXT_SCALE,
      MAX_TEXT_SCALE
    ),
    readAloudRate: normaliseReadAloudRate(value?.readAloudRate),
  };
}

function isSpeechSupported() {
  return (
    "speechSynthesis" in window &&
    typeof window.SpeechSynthesisUtterance === "function"
  );
}

function applyAccessibilityState() {
  const body = document.body;

  if (!body) {
    return;
  }

  body.classList.toggle(
    "a11y-simplify-visuals",
    persistentPreferences.simplifyVisuals
  );
  body.classList.toggle(
    "a11y-low-distraction",
    persistentPreferences.lowDistraction
  );
  body.classList.toggle(
    "a11y-high-contrast",
    persistentPreferences.highContrast
  );
  body.classList.toggle("a11y-dyslexia", persistentPreferences.dyslexiaFont);
  body.classList.toggle("a11y-reading-mode", sessionModes.readingMode);
  body.classList.toggle("a11y-focus-mode", sessionModes.focusMode);

  document.documentElement.style.setProperty(
    "--user-font-scale",
    String(persistentPreferences.textScale)
  );
}

function setNote(message) {
  if (noteElement) {
    noteElement.textContent = message;
  }
}

function isEditableTarget(target) {
  return Boolean(target?.closest?.(EDITABLE_TARGET_SELECTOR));
}

function setSessionMode(setting, value) {
  if (!(setting in sessionModes)) {
    return;
  }

  sessionModes = {
    ...sessionModes,
    [setting]: Boolean(value),
  };

  applyAccessibilityState();
  syncControls();
}

function toggleSessionMode(setting) {
  if (!(setting in sessionModes)) {
    return;
  }

  setSessionMode(setting, !sessionModes[setting]);
}

function buildReadableText(target) {
  const clone = target.cloneNode(true);

  clone
    .querySelectorAll(
      [
        "script",
        "style",
        "button",
        "input",
        "textarea",
        "select",
        "nav",
        "aside",
        "template",
        "noscript",
        "[hidden]",
        "[aria-hidden='true']",
        ".ad-placeholder",
        ".accessibility-launcher",
        ".accessibility-panel",
        ".accessibility-backdrop",
        ".accessibility-player",
        ".teacher-controls",
      ].join(", ")
    )
    .forEach((element) => {
      element.remove();
    });

  clone.querySelectorAll("details:not([open])").forEach((details) => {
    details.remove();
  });

  return clone.textContent?.replace(/\s+/g, " ").trim() ?? "";
}

function splitTextForSpeech(text) {
  const sentences =
    text
      .match(/[^.!?]+(?:[.!?]+|$)/g)
      ?.map((chunk) => chunk.replace(/\s+/g, " ").trim())
      .filter(Boolean) ?? [];

  const chunks = sentences.length > 0 ? sentences : [text];

  return chunks.flatMap((chunk) => {
    if (chunk.length <= 260) {
      return [chunk];
    }

    const smallerChunks = chunk
      .split(/[,;:]\s+/)
      .map((part) => part.trim())
      .filter(Boolean);

    return smallerChunks.length > 0 ? smallerChunks : [chunk];
  });
}

function isReadableElement(element) {
  if (!element || !element.matches?.(READABLE_BLOCK_SELECTOR)) {
    return false;
  }

  if (element.closest(READ_ALOUD_IGNORE_SELECTOR)) {
    return false;
  }

  const style = window.getComputedStyle(element);

  if (style.display === "none" || style.visibility === "hidden") {
    return false;
  }

  return Boolean(buildReadableText(element));
}

function clearHighlightedReadElement() {
  if (!highlightedReadElement) {
    return;
  }

  highlightedReadElement.classList.remove("a11y-read-active");
  highlightedReadElement = null;
}

function highlightReadElement(element) {
  if (!element || highlightedReadElement === element) {
    return;
  }

  clearHighlightedReadElement();
  element.classList.add("a11y-read-active");
  highlightedReadElement = element;
}

function ensureReadElementVisible(element) {
  if (!element) {
    return;
  }

  const rect = element.getBoundingClientRect();
  const topBuffer = 120;
  const bottomBuffer = 160;

  if (
    rect.top >= topBuffer &&
    rect.bottom <= window.innerHeight - bottomBuffer
  ) {
    return;
  }

  element.scrollIntoView({
    behavior: "smooth",
    block: "center",
    inline: "nearest",
  });
}

function collectReadableSegments(target) {
  const elements = [];

  if (target.matches?.(READABLE_BLOCK_SELECTOR) && isReadableElement(target)) {
    elements.push(target);
  }

  target.querySelectorAll(READABLE_BLOCK_SELECTOR).forEach((element) => {
    if (isReadableElement(element)) {
      elements.push(element);
    }
  });

  return elements.flatMap((element) => {
    const text = buildReadableText(element);
    const chunks = splitTextForSpeech(text);

    return chunks.map((chunk) => ({
      element,
      text: chunk,
    }));
  });
}

function getReadTarget() {
  const activeLessonLink = document.querySelector(
    "[data-section-link].is-active, [data-section-link][aria-current='true']"
  );

  if (activeLessonLink) {
    const href = activeLessonLink.getAttribute("href") ?? "";

    if (href.startsWith("#")) {
      const section = document.querySelector(href);

      if (section) {
        return section;
      }
    }
  }

  return (
    document.querySelector(".lesson-main") ??
    document.querySelector(".unit-main") ??
    document.querySelector(".catalog-main") ??
    document.querySelector("main") ??
    document.querySelector(".page-shell") ??
    document.body
  );
}

function getReadTargetLabel(target) {
  if (!target) {
    return "Current page";
  }

  if (target.id) {
    const linkedSection = document.querySelector(
      `[data-section-link][href="#${target.id}"]`
    );

    if (linkedSection?.textContent?.trim()) {
      return linkedSection.textContent.trim();
    }
  }

  const heading =
    target.querySelector("h1, h2, h3") ?? document.querySelector("h1, h2");

  return heading?.textContent?.trim() || "Current page";
}

function getReadableSectionEntries() {
  return Array.from(
    document.querySelectorAll("[data-section-link][href^='#']")
  )
    .map((link) => {
      const href = link.getAttribute("href") ?? "";

      if (!href.startsWith("#")) {
        return null;
      }

      const target = document.querySelector(href);

      if (!target || !buildReadableText(target)) {
        return null;
      }

      return {
        link,
        target,
        label: link.textContent?.trim() || getReadTargetLabel(target),
      };
    })
    .filter(Boolean);
}

function getSectionIndexForTarget(target, sectionEntries) {
  return sectionEntries.findIndex((entry) => entry.target === target);
}

function getReadTargetDetails(target = getReadTarget()) {
  const sectionEntries = getReadableSectionEntries();
  const sectionIndex = getSectionIndexForTarget(target, sectionEntries);

  return {
    target,
    label: getReadTargetLabel(target),
    sectionEntries,
    sectionIndex,
  };
}

function formatReadTargetPreview(details) {
  if (details.sectionIndex >= 0) {
    return `Current read target: ${details.label} (${details.sectionIndex + 1} of ${details.sectionEntries.length
      })`;
  }

  return `Current read target: ${details.label}`;
}

function createReadSession(target, options = {}) {
  const segments = collectReadableSegments(target);

  if (segments.length === 0) {
    return null;
  }

  const sectionEntries = options.sectionEntries ?? getReadableSectionEntries();
  const sectionIndex = Number.isInteger(options.sectionIndex)
    ? options.sectionIndex
    : getSectionIndexForTarget(target, sectionEntries);

  let totalCharacters = 0;

  const characterOffsets = segments.map((segment) => {
    const offset = totalCharacters;
    totalCharacters += segment.text.length;
    return offset;
  });

  return {
    target,
    targetLabel: getReadTargetLabel(target),
    segments,
    characterOffsets,
    totalCharacters: Math.max(totalCharacters, 1),
    currentSegmentIndex: 0,
    currentSegmentCharacterIndex: 0,
    isPaused: false,
    isComplete: false,
    sectionEntries,
    sectionIndex,
  };
}

function getCurrentSegment() {
  if (!activeReadSession) {
    return null;
  }

  return (
    activeReadSession.segments[activeReadSession.currentSegmentIndex] ?? null
  );
}

function getReadProgress() {
  if (!activeReadSession) {
    return 0;
  }

  if (activeReadSession.currentSegmentIndex >= activeReadSession.segments.length) {
    return 1;
  }

  const segment = getCurrentSegment();
  const segmentLength = segment?.text.length ?? 0;
  const currentCharacterIndex = clamp(
    activeReadSession.currentSegmentCharacterIndex,
    0,
    segmentLength
  );
  const currentBase =
    activeReadSession.characterOffsets[activeReadSession.currentSegmentIndex] ??
    activeReadSession.totalCharacters;

  return clamp(
    (currentBase + currentCharacterIndex) / activeReadSession.totalCharacters,
    0,
    1
  );
}

function updateReadAloudButton() {
  const speechSupported = isSpeechSupported();
  const hasReadSession = Boolean(activeReadSession?.segments?.length);
  const previewTargetDetails = activeReadSession
    ? {
      target: activeReadSession.target,
      label: activeReadSession.targetLabel,
      sectionEntries: activeReadSession.sectionEntries,
      sectionIndex: activeReadSession.sectionIndex,
    }
    : getReadTargetDetails();

  document.body?.classList.toggle(
    "a11y-player-active",
    speechSupported && hasReadSession
  );

  if (readAloudButton) {
    if (!speechSupported) {
      readAloudButton.disabled = true;
      readAloudButton.textContent = "Read aloud unavailable";
    } else {
      readAloudButton.disabled = false;
      readAloudButton.textContent = hasReadSession
        ? "Restart current section"
        : "Read current section";
      readAloudButton.setAttribute(
        "aria-label",
        hasReadSession
          ? `Restart reading ${activeReadSession.targetLabel}.`
          : `Read ${previewTargetDetails.label}.`
      );
    }
  }

  if (readTargetPreviewElement) {
    readTargetPreviewElement.textContent = formatReadTargetPreview(
      previewTargetDetails
    );
  }

  if (!playerElement) {
    return;
  }

  if (!speechSupported || !hasReadSession) {
    playerElement.hidden = true;

    if (playerSeekInput) {
      playerSeekInput.disabled = true;
      playerSeekInput.max = "0";
      playerSeekInput.value = "0";
    }

    return;
  }

  const currentSegment = getCurrentSegment();
  const currentIndex = clamp(
    activeReadSession.currentSegmentIndex + 1,
    1,
    activeReadSession.segments.length
  );
  const progress = Math.round(getReadProgress() * 100);
  const inSection =
    activeReadSession.sectionIndex >= 0 &&
    activeReadSession.sectionEntries.length > 0;
  const isComplete = Boolean(activeReadSession.isComplete);

  playerElement.hidden = false;
  playerTargetElement.textContent = activeReadSession.targetLabel;
  playerStatusElement.textContent = isComplete
    ? inSection
      ? `Finished section ${activeReadSession.sectionIndex + 1} of ${activeReadSession.sectionEntries.length
      }.`
      : "Finished this section."
    : activeReadSession.isPaused
      ? inSection
        ? `Paused in section ${activeReadSession.sectionIndex + 1} of ${activeReadSession.sectionEntries.length
        }, part ${currentIndex} of ${activeReadSession.segments.length}.`
        : `Paused at part ${currentIndex} of ${activeReadSession.segments.length}.`
      : inSection
        ? `Reading section ${activeReadSession.sectionIndex + 1} of ${activeReadSession.sectionEntries.length
        }, part ${currentIndex} of ${activeReadSession.segments.length}.`
        : `Reading part ${currentIndex} of ${activeReadSession.segments.length}.`;
  playerCurrentElement.textContent = isComplete
    ? "This section has finished. Replay it, choose another point, or move to a different section."
    : currentSegment
      ? `Now reading: ${truncateText(currentSegment.text, 180)}`
      : "Ready to read.";
  playerProgressElement.textContent = `${progress}% read`;

  if (playerSeekInput) {
    playerSeekInput.disabled = activeReadSession.segments.length <= 1;
    playerSeekInput.max = String(
      Math.max(activeReadSession.segments.length - 1, 0)
    );
    playerSeekInput.value = String(
      clamp(
        activeReadSession.currentSegmentIndex,
        0,
        Math.max(activeReadSession.segments.length - 1, 0)
      )
    );
  }

  if (playerPlaybackButton) {
    playerPlaybackButton.disabled = false;
    playerPlaybackButton.textContent = isComplete
      ? "Replay"
      : activeReadSession.isPaused
        ? "Resume"
        : "Pause";
  }

  if (playerStopButton) {
    playerStopButton.disabled = false;
  }

  if (playerRateInput) {
    playerRateInput.value = String(persistentPreferences.readAloudRate);
  }

  if (playerPrevSectionButton) {
    playerPrevSectionButton.disabled =
      !inSection || activeReadSession.sectionIndex <= 0;
  }

  if (playerNextSectionButton) {
    playerNextSectionButton.disabled =
      !inSection ||
      activeReadSession.sectionIndex >=
      activeReadSession.sectionEntries.length - 1;
  }
}

function stopReading(clearNote = false) {
  if (isSpeechSupported()) {
    window.speechSynthesis.cancel();
  }

  activeUtterance = null;
  activeReadSession = null;
  clearHighlightedReadElement();
  updateReadAloudButton();

  if (clearNote) {
    setNote("");
  }
}

function finishReading() {
  if (!activeReadSession) {
    return;
  }

  activeUtterance = null;
  activeReadSession.isPaused = true;
  activeReadSession.isComplete = true;
  activeReadSession.currentSegmentIndex = activeReadSession.segments.length;
  activeReadSession.currentSegmentCharacterIndex = 0;
  clearHighlightedReadElement();
  updateReadAloudButton();
  setNote("Finished reading this section.");
}

function speakCurrentSegment() {
  if (!activeReadSession) {
    return;
  }

  const segment = getCurrentSegment();

  if (!segment) {
    finishReading();
    return;
  }

  const utterance = new window.SpeechSynthesisUtterance(segment.text);
  utterance.lang = document.documentElement.lang || "en-GB";
  utterance.rate = persistentPreferences.readAloudRate;

  utterance.onstart = () => {
    if (!activeReadSession || activeUtterance !== utterance) {
      return;
    }

    activeReadSession.isPaused = false;
    activeReadSession.currentSegmentCharacterIndex = 0;
    highlightReadElement(segment.element);
    ensureReadElementVisible(segment.element);
    updateReadAloudButton();
  };

  utterance.onboundary = (event) => {
    if (!activeReadSession || activeUtterance !== utterance) {
      return;
    }

    if (typeof event.charIndex === "number") {
      activeReadSession.currentSegmentCharacterIndex = clamp(
        event.charIndex,
        0,
        segment.text.length
      );
      updateReadAloudButton();
    }
  };

  utterance.onpause = () => {
    if (!activeReadSession || activeUtterance !== utterance) {
      return;
    }

    activeReadSession.isPaused = true;
    updateReadAloudButton();
  };

  utterance.onresume = () => {
    if (!activeReadSession || activeUtterance !== utterance) {
      return;
    }

    activeReadSession.isPaused = false;
    updateReadAloudButton();
  };

  utterance.onend = () => {
    if (!activeReadSession || activeUtterance !== utterance) {
      return;
    }

    activeReadSession.currentSegmentCharacterIndex = segment.text.length;
    activeUtterance = null;
    activeReadSession.currentSegmentIndex += 1;
    updateReadAloudButton();
    speakCurrentSegment();
  };

  utterance.onerror = () => {
    if (!activeReadSession || activeUtterance !== utterance) {
      return;
    }

    setNote("Read aloud could not continue on this device.");
    stopReading(false);
  };

  activeUtterance = utterance;
  window.speechSynthesis.speak(utterance);
  updateReadAloudButton();
}

function setReadAloudRate(nextRate) {
  const normalisedRate = normaliseReadAloudRate(nextRate);

  persistentPreferences = {
    ...persistentPreferences,
    readAloudRate: normalisedRate,
  };
  savePersistentPreferences();

  if (playerRateInput) {
    playerRateInput.value = String(normalisedRate);
  }

  if (!activeReadSession) {
    setNote(`Read aloud speed set to ${formatReadAloudRate(normalisedRate)}.`);
    updateReadAloudButton();
    return;
  }

  const shouldResume = !activeReadSession.isPaused && !window.speechSynthesis.paused;

  activeUtterance = null;
  window.speechSynthesis.cancel();

  if (shouldResume) {
    activeReadSession.isPaused = false;
    setNote(
      `Read aloud speed set to ${formatReadAloudRate(
        normalisedRate
      )}. Current part restarted at the new speed.`
    );
    speakCurrentSegment();
    return;
  }

  activeReadSession.isPaused = true;
  setNote(
    `Read aloud speed set to ${formatReadAloudRate(
      normalisedRate
    )}. Resume to continue.`
  );
  updateReadAloudButton();
}

function startReading(startIndex = 0, targetDetails = getReadTargetDetails()) {
  if (!isSpeechSupported()) {
    setNote("Read aloud is not supported in this browser.");
    updateReadAloudButton();
    return;
  }

  const session = createReadSession(targetDetails.target, {
    sectionEntries: targetDetails.sectionEntries,
    sectionIndex: targetDetails.sectionIndex,
  });

  if (!session) {
    setNote("There is not enough readable text in this area yet.");
    updateReadAloudButton();
    return;
  }

  stopReading();

  session.currentSegmentIndex = clamp(
    startIndex,
    0,
    Math.max(session.segments.length - 1, 0)
  );
  session.currentSegmentCharacterIndex = 0;
  session.isComplete = false;
  activeReadSession = session;

  const nextSegment = getCurrentSegment();

  if (nextSegment) {
    highlightReadElement(nextSegment.element);
    ensureReadElementVisible(nextSegment.element);
  }

  setNote(
    `Reading ${session.targetLabel}. Use the mini player to pause, resume, or move between sections.`
  );
  updateReadAloudButton();
  speakCurrentSegment();
}

function toggleReadAloud() {
  startReading(0, getReadTargetDetails());
}

function toggleReadAloudPlayback() {
  if (!isSpeechSupported()) {
    setNote("Read aloud is not supported in this browser.");
    updateReadAloudButton();
    return;
  }

  if (!activeReadSession) {
    startReading();
    return;
  }

  if (activeReadSession.isComplete) {
    activeReadSession.currentSegmentIndex = 0;
    activeReadSession.currentSegmentCharacterIndex = 0;
    activeReadSession.isPaused = false;
    activeReadSession.isComplete = false;

    const firstSegment = getCurrentSegment();

    if (firstSegment) {
      highlightReadElement(firstSegment.element);
      ensureReadElementVisible(firstSegment.element);
    }

    setNote(`Replaying ${activeReadSession.targetLabel}.`);
    speakCurrentSegment();
    return;
  }

  if (activeReadSession.isPaused || window.speechSynthesis.paused) {
    if (activeUtterance) {
      window.speechSynthesis.resume();
    } else {
      speakCurrentSegment();
    }

    activeReadSession.isPaused = false;
    setNote(`Resumed reading ${activeReadSession.targetLabel}.`);
    updateReadAloudButton();
    return;
  }

  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.pause();
    activeReadSession.isPaused = true;
    setNote("Read aloud paused. Use Resume to carry on.");
    updateReadAloudButton();
  }
}

function seekReadAloud(nextIndex) {
  if (!activeReadSession) {
    return;
  }

  const targetIndex = clamp(
    Math.round(nextIndex),
    0,
    Math.max(activeReadSession.segments.length - 1, 0)
  );
  const shouldResume =
    !activeReadSession.isPaused && !activeReadSession.isComplete;

  activeReadSession.currentSegmentIndex = targetIndex;
  activeReadSession.currentSegmentCharacterIndex = 0;
  activeReadSession.isComplete = false;

  const nextSegment = getCurrentSegment();

  if (nextSegment) {
    highlightReadElement(nextSegment.element);
    ensureReadElementVisible(nextSegment.element);
  }

  activeUtterance = null;
  window.speechSynthesis.cancel();

  if (shouldResume) {
    activeReadSession.isPaused = false;
    speakCurrentSegment();
  } else {
    activeReadSession.isPaused = true;
    updateReadAloudButton();
  }

  setNote("Read aloud moved to a new point in this section.");
}

function moveReadAloudSection(direction) {
  const currentDetails = activeReadSession
    ? {
      target: activeReadSession.target,
      label: activeReadSession.targetLabel,
      sectionEntries: activeReadSession.sectionEntries,
      sectionIndex: activeReadSession.sectionIndex,
    }
    : getReadTargetDetails();

  if (
    currentDetails.sectionIndex < 0 ||
    currentDetails.sectionEntries.length <= 1
  ) {
    return;
  }

  const nextSectionIndex = clamp(
    currentDetails.sectionIndex + direction,
    0,
    currentDetails.sectionEntries.length - 1
  );

  if (nextSectionIndex === currentDetails.sectionIndex) {
    return;
  }

  const nextSection = currentDetails.sectionEntries[nextSectionIndex];

  if (!nextSection) {
    return;
  }

  startReading(0, {
    target: nextSection.target,
    label: nextSection.label,
    sectionEntries: currentDetails.sectionEntries,
    sectionIndex: nextSectionIndex,
  });
}

function updateReadTargetPreview() {
  updateReadAloudButton();
}

function scheduleReadTargetPreviewUpdate() {
  if (previewUpdateFrame !== null) {
    return;
  }

  previewUpdateFrame = window.requestAnimationFrame(() => {
    previewUpdateFrame = null;

    if (!activeReadSession) {
      updateReadTargetPreview();
    }
  });
}

function savePersistentPreferences() {
  writeStorage(PERSISTENT_KEY, persistentPreferences);
}

function syncControls() {
  if (!panel) {
    return;
  }

  panel.querySelector("#accessibility-reading-mode").checked =
    sessionModes.readingMode;
  panel.querySelector("#accessibility-focus-mode").checked =
    sessionModes.focusMode;
  panel.querySelector("#accessibility-simplify-visuals").checked =
    persistentPreferences.simplifyVisuals;
  panel.querySelector("#accessibility-low-distraction").checked =
    persistentPreferences.lowDistraction;
  panel.querySelector("#accessibility-high-contrast").checked =
    persistentPreferences.highContrast;
  panel.querySelector("#accessibility-dyslexia-font").checked =
    persistentPreferences.dyslexiaFont;

  if (textScaleInput) {
    textScaleInput.value = String(persistentPreferences.textScale);
  }

  if (textScaleValue) {
    textScaleValue.textContent = `${Math.round(
      persistentPreferences.textScale * 100
    )}%`;
  }

  if (playerRateInput) {
    playerRateInput.value = String(persistentPreferences.readAloudRate);
  }

  updateReadAloudButton();
}

function openPanel() {
  panel.hidden = false;
  backdrop.hidden = false;
  launcherButton.setAttribute("aria-expanded", "true");
}

function closePanel() {
  panel.hidden = true;
  backdrop.hidden = true;
  launcherButton.setAttribute("aria-expanded", "false");
}

function resetAccessibilityState() {
  persistentPreferences = {
    ...PERSISTENT_DEFAULTS,
  };
  sessionModes = {
    ...SESSION_DEFAULTS,
  };

  removeStorage(PERSISTENT_KEY);
  stopReading(true);
  applyAccessibilityState();
  syncControls();
}

function buildAccessibilityUI() {
  if (document.querySelector("[data-role='accessibility-launcher']")) {
    return;
  }

  document.body.insertAdjacentHTML(
    "beforeend",
    `
      <div class="accessibility-backdrop" data-role="accessibility-backdrop" hidden></div>

      <section
        class="accessibility-player panel"
        data-role="accessibility-player"
        aria-label="Read aloud controls"
        hidden
      >
        <div class="accessibility-player-header">
          <div>
            <p class="eyebrow">Read Aloud</p>
            <h2 data-role="read-aloud-target">Current section</h2>
            <p class="accessibility-player-status" data-role="read-aloud-status" aria-live="polite">
              Ready to read.
            </p>
          </div>
          <div class="accessibility-player-header-actions">
            <label class="accessibility-player-speed" for="accessibility-read-aloud-rate">
              <span class="accessibility-player-speed-label">Speed</span>
              <select
                id="accessibility-read-aloud-rate"
                class="accessibility-player-select"
                data-action="set-read-aloud-rate"
              >
                ${READ_ALOUD_RATE_OPTIONS.map(
      (option) =>
        `<option value="${option.value}">${option.label}</option>`
    ).join("")}
              </select>
            </label>
            <button
              type="button"
              class="accessibility-player-button accessibility-player-button--stop"
              data-action="stop-read-aloud"
            >
              Stop
            </button>
          </div>
        </div>

        <p class="accessibility-player-copy" data-role="read-aloud-current"></p>

        <label class="accessibility-slider-row accessibility-player-progress" for="accessibility-read-aloud-seek">
          <div class="accessibility-slider-header">
            <span class="accessibility-slider-label">Progress</span>
            <span class="accessibility-slider-value" data-role="read-aloud-progress-text">0% read</span>
          </div>
          <input
            id="accessibility-read-aloud-seek"
            class="accessibility-slider accessibility-player-range"
            type="range"
            min="0"
            max="0"
            step="1"
            value="0"
            data-action="seek-read-aloud"
          />
        </label>

        <div class="accessibility-player-controls">
          <button
            type="button"
            class="accessibility-player-button"
            data-action="read-prev-section"
          >
            Previous section
          </button>
          <button
            type="button"
            class="accessibility-player-button"
            data-action="toggle-read-aloud-playback"
          >
            Pause
          </button>
          <button
            type="button"
            class="accessibility-player-button"
            data-action="read-next-section"
          >
            Next section
          </button>
        </div>
      </section>

      <div class="accessibility-launcher" data-role="accessibility-launcher">
        <button
          type="button"
          class="accessibility-launcher-button"
          data-action="toggle-accessibility-panel"
          aria-expanded="false"
          aria-controls="accessibility-panel"
        >
          <span class="accessibility-launcher-badge" aria-hidden="true">Aa</span>
          <span>Accessibility</span>
        </button>
      </div>

      <section
        id="accessibility-panel"
        class="accessibility-panel panel"
        data-role="accessibility-panel"
        aria-labelledby="accessibility-panel-title"
        role="dialog"
        hidden
      >
        <div class="accessibility-panel-header">
          <div>
            <p class="eyebrow">Reading And Accessibility</p>
            <h2 id="accessibility-panel-title">Make the page easier to use</h2>
            <p class="accessibility-panel-copy">
              Visual preferences stay saved across the site. Reading and focus modes reset when you reload or leave this page.
            </p>
          </div>
          <button type="button" class="accessibility-close-button" data-action="close-accessibility-panel">
            Close
          </button>
        </div>

        <div class="accessibility-panel-groups">
          <fieldset class="accessibility-group">
            <legend>Reading</legend>
            <div class="accessibility-control-list">
              <label class="accessibility-toggle" for="accessibility-reading-mode">
                <input id="accessibility-reading-mode" type="checkbox" data-setting="readingMode" />
                <span>
                  <span class="accessibility-toggle-label">Reading mode</span>
                  <span class="accessibility-control-copy">Increase reading comfort and remove extra clutter around content. Shortcut: R</span>
                </span>
              </label>

              <label class="accessibility-toggle" for="accessibility-focus-mode">
                <input id="accessibility-focus-mode" type="checkbox" data-setting="focusMode" />
                <span>
                  <span class="accessibility-toggle-label">Focus mode</span>
                  <span class="accessibility-control-copy">Hide more secondary interface elements so the main content is easier to follow. Shortcut: F</span>
                </span>
              </label>

              <div class="accessibility-slider-row">
                <div class="accessibility-slider-header">
                  <label class="accessibility-slider-label" for="accessibility-text-scale">Text size</label>
                  <span class="accessibility-slider-value" data-role="text-scale-value">100%</span>
                </div>
                <input
                  id="accessibility-text-scale"
                  class="accessibility-slider"
                  type="range"
                  min="${MIN_TEXT_SCALE}"
                  max="${MAX_TEXT_SCALE}"
                  step="${TEXT_SCALE_STEP}"
                  data-setting="textScale"
                />
              </div>
            </div>
          </fieldset>

          <fieldset class="accessibility-group">
            <legend>Visuals</legend>
            <div class="accessibility-control-list">
              <label class="accessibility-toggle" for="accessibility-simplify-visuals">
                <input id="accessibility-simplify-visuals" type="checkbox" data-setting="simplifyVisuals" />
                <span>
                  <span class="accessibility-toggle-label">Simplify visuals</span>
                  <span class="accessibility-control-copy">Remove scrapbook textures and decorative effects across the site.</span>
                </span>
              </label>

              <label class="accessibility-toggle" for="accessibility-low-distraction">
                <input id="accessibility-low-distraction" type="checkbox" data-setting="lowDistraction" />
                <span>
                  <span class="accessibility-toggle-label">Low distraction palette</span>
                  <span class="accessibility-control-copy">Use a softer, quieter color palette that is easier to scan for longer sessions.</span>
                </span>
              </label>

              <label class="accessibility-toggle" for="accessibility-high-contrast">
                <input id="accessibility-high-contrast" type="checkbox" data-setting="highContrast" />
                <span>
                  <span class="accessibility-toggle-label">High contrast mode</span>
                  <span class="accessibility-control-copy">Increase contrast for readability and projector-friendly display.</span>
                </span>
              </label>
            </div>
          </fieldset>

          <fieldset class="accessibility-group">
            <legend>Support</legend>
            <div class="accessibility-control-list">
              <label class="accessibility-toggle" for="accessibility-dyslexia-font">
                <input id="accessibility-dyslexia-font" type="checkbox" data-setting="dyslexiaFont" />
                <span>
                  <span class="accessibility-toggle-label">Dyslexia-friendly font stack</span>
                  <span class="accessibility-control-copy">Try a more distinct local reading font when available, with wider spacing across headings, body copy, and inputs.</span>
                </span>
              </label>
            </div>
          </fieldset>

          <fieldset class="accessibility-group">
            <legend>Actions</legend>
            <div class="accessibility-actions">
              <div class="accessibility-action-stack">
                <button type="button" class="accessibility-action-button" data-action="toggle-read-aloud">
                  Read current section
                </button>
                <p class="accessibility-control-copy accessibility-read-target" data-role="read-target-preview">
                  Current read target: Current page
                </p>
              </div>
              <button type="button" class="accessibility-reset-button" data-action="reset-accessibility">
                Reset to default
              </button>
            </div>
            <p class="accessibility-note" data-role="accessibility-note"></p>
          </fieldset>
        </div>
      </section>
    `
  );

  launcherButton = document.querySelector(
    "[data-action='toggle-accessibility-panel']"
  );
  backdrop = document.querySelector("[data-role='accessibility-backdrop']");
  panel = document.querySelector("[data-role='accessibility-panel']");
  noteElement = document.querySelector("[data-role='accessibility-note']");
  textScaleInput = document.querySelector("#accessibility-text-scale");
  textScaleValue = document.querySelector("[data-role='text-scale-value']");
  readAloudButton = document.querySelector("[data-action='toggle-read-aloud']");
  readTargetPreviewElement = document.querySelector(
    "[data-role='read-target-preview']"
  );
  playerElement = document.querySelector("[data-role='accessibility-player']");
  playerTargetElement = document.querySelector("[data-role='read-aloud-target']");
  playerStatusElement = document.querySelector("[data-role='read-aloud-status']");
  playerCurrentElement = document.querySelector("[data-role='read-aloud-current']");
  playerProgressElement = document.querySelector(
    "[data-role='read-aloud-progress-text']"
  );
  playerSeekInput = document.querySelector("[data-action='seek-read-aloud']");
  playerPlaybackButton = document.querySelector(
    "[data-action='toggle-read-aloud-playback']"
  );
  playerStopButton = document.querySelector("[data-action='stop-read-aloud']");
  playerRateInput = document.querySelector("[data-action='set-read-aloud-rate']");
  playerPrevSectionButton = document.querySelector(
    "[data-action='read-prev-section']"
  );
  playerNextSectionButton = document.querySelector(
    "[data-action='read-next-section']"
  );

  launcherButton.addEventListener("click", () => {
    if (panel.hidden) {
      openPanel();
      return;
    }

    closePanel();
  });

  panel
    .querySelector("[data-action='close-accessibility-panel']")
    .addEventListener("click", closePanel);
  backdrop.addEventListener("click", closePanel);

  panel.querySelectorAll("[data-setting]").forEach((control) => {
    const setting = control.dataset.setting;

    if (!setting) {
      return;
    }

    control.addEventListener("input", () => {
      if (setting === "textScale") {
        persistentPreferences = {
          ...persistentPreferences,
          textScale: clamp(
            Number(control.value),
            MIN_TEXT_SCALE,
            MAX_TEXT_SCALE
          ),
        };
        savePersistentPreferences();
        applyAccessibilityState();
        syncControls();
        return;
      }

      const checked = Boolean(control.checked);

      if (setting in sessionModes) {
        setSessionMode(setting, checked);
        return;
      }

      persistentPreferences = {
        ...persistentPreferences,
        [setting]: checked,
      };
      savePersistentPreferences();
      applyAccessibilityState();
      syncControls();
    });
  });

  readAloudButton.addEventListener("click", toggleReadAloud);
  playerPlaybackButton.addEventListener("click", toggleReadAloudPlayback);
  playerStopButton.addEventListener("click", () => stopReading(true));
  playerRateInput.addEventListener("input", () => {
    setReadAloudRate(playerRateInput.value);
  });
  playerPrevSectionButton.addEventListener("click", () =>
    moveReadAloudSection(-1)
  );
  playerNextSectionButton.addEventListener("click", () =>
    moveReadAloudSection(1)
  );
  playerSeekInput.addEventListener("change", () => {
    seekReadAloud(Number(playerSeekInput.value));
  });

  panel
    .querySelector("[data-action='reset-accessibility']")
    .addEventListener("click", resetAccessibilityState);

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !panel.hidden) {
      closePanel();
      return;
    }

    if (
      event.defaultPrevented ||
      event.repeat ||
      event.ctrlKey ||
      event.metaKey ||
      event.altKey ||
      event.shiftKey ||
      isEditableTarget(event.target)
    ) {
      return;
    }

    const pressedKey = event.key.toLowerCase();

    if (pressedKey === "r") {
      event.preventDefault();
      toggleSessionMode("readingMode");
      return;
    }

    if (pressedKey === "f") {
      event.preventDefault();
      toggleSessionMode("focusMode");
    }
  });

  window.addEventListener("beforeunload", () => {
    stopReading(true);
  });
}

export function initAccessibilityPanel() {
  if (!document.body) {
    return;
  }

  persistentPreferences = normalisePersistentPreferences(
    readStorage(PERSISTENT_KEY, PERSISTENT_DEFAULTS)
  );
  sessionModes = {
    ...SESSION_DEFAULTS,
  };

  applyAccessibilityState();
  buildAccessibilityUI();
  syncControls();
  window.addEventListener("scroll", scheduleReadTargetPreviewUpdate, {
    passive: true,
  });
  window.addEventListener("hashchange", scheduleReadTargetPreviewUpdate);
  window.addEventListener("resize", scheduleReadTargetPreviewUpdate);
  setNote(
    isSpeechSupported()
      ? ""
      : "Read aloud is not available in this browser."
  );
}
