import {
  readSessionStorage,
  readStorage,
  removeSessionStorage,
  removeStorage,
  writeSessionStorage,
  writeStorage,
} from "./storage.js";

const PERSISTENT_KEY = "accessibility-preferences";
const SESSION_KEY = "accessibility-session";

const PERSISTENT_DEFAULTS = {
  simplifyVisuals: false,
  lowDistraction: false,
  highContrast: false,
  dyslexiaFont: false,
  textScale: 1,
};

const SESSION_DEFAULTS = {
  readingMode: false,
  focusMode: false,
};

const MIN_TEXT_SCALE = 0.95;
const MAX_TEXT_SCALE = 1.25;
const TEXT_SCALE_STEP = 0.05;

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
let activeUtterance = null;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
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
  };
}

function normaliseSessionModes(value) {
  return {
    readingMode: Boolean(value?.readingMode),
    focusMode: Boolean(value?.focusMode),
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

function stopReading(clearNote = false) {
  if (!isSpeechSupported()) {
    return;
  }

  window.speechSynthesis.cancel();
  activeUtterance = null;
  updateReadAloudButton();

  if (clearNote) {
    setNote("");
  }
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
    document.querySelector("main") ??
    document.querySelector(".page-shell") ??
    document.body
  );
}

function updateReadAloudButton() {
  if (!readAloudButton) {
    return;
  }

  if (!isSpeechSupported()) {
    readAloudButton.disabled = true;
    readAloudButton.textContent = "Read aloud unavailable";
    return;
  }

  const isReading = Boolean(
    activeUtterance || window.speechSynthesis.speaking
  );

  readAloudButton.disabled = false;
  readAloudButton.textContent = isReading ? "Stop reading" : "Read aloud";
}

function startReading() {
  const target = getReadTarget();
  const text = buildReadableText(target);

  if (!text) {
    setNote("There is not enough readable text in this area yet.");
    updateReadAloudButton();
    return;
  }

  stopReading();

  const utterance = new window.SpeechSynthesisUtterance(text);
  utterance.lang = document.documentElement.lang || "en-GB";
  utterance.rate = 1;

  utterance.onend = () => {
    activeUtterance = null;
    updateReadAloudButton();
    setNote("");
  };

  utterance.onerror = () => {
    activeUtterance = null;
    updateReadAloudButton();
    setNote("Read aloud could not start on this device.");
  };

  activeUtterance = utterance;
  window.speechSynthesis.speak(utterance);
  updateReadAloudButton();
  setNote("Reading aloud is active. Use the same button to stop.");
}

function toggleReadAloud() {
  if (!isSpeechSupported()) {
    setNote("Read aloud is not supported in this browser.");
    updateReadAloudButton();
    return;
  }

  if (activeUtterance || window.speechSynthesis.speaking) {
    stopReading(true);
    return;
  }

  startReading();
}

function savePersistentPreferences() {
  writeStorage(PERSISTENT_KEY, persistentPreferences);
}

function saveSessionModes() {
  writeSessionStorage(SESSION_KEY, sessionModes);
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
  removeSessionStorage(SESSION_KEY);
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
              Visual preferences stay saved across the site. Reading and focus modes stay active only in this tab.
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
                  <span class="accessibility-control-copy">Increase reading comfort and remove extra clutter around content.</span>
                </span>
              </label>

              <label class="accessibility-toggle" for="accessibility-focus-mode">
                <input id="accessibility-focus-mode" type="checkbox" data-setting="focusMode" />
                <span>
                  <span class="accessibility-toggle-label">Focus mode</span>
                  <span class="accessibility-control-copy">Hide more secondary interface elements so the main content is easier to follow.</span>
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
                  <span class="accessibility-control-copy">Swap to a clearer sans-serif reading stack across headings, body copy, and inputs.</span>
                </span>
              </label>
            </div>
          </fieldset>

          <fieldset class="accessibility-group">
            <legend>Actions</legend>
            <div class="accessibility-actions">
              <button type="button" class="accessibility-action-button" data-action="toggle-read-aloud">
                Read aloud
              </button>
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
        sessionModes = {
          ...sessionModes,
          [setting]: checked,
        };
        saveSessionModes();
      } else {
        persistentPreferences = {
          ...persistentPreferences,
          [setting]: checked,
        };
        savePersistentPreferences();
      }

      applyAccessibilityState();
      syncControls();
    });
  });

  readAloudButton.addEventListener("click", toggleReadAloud);
  panel
    .querySelector("[data-action='reset-accessibility']")
    .addEventListener("click", resetAccessibilityState);

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !panel.hidden) {
      closePanel();
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
  sessionModes = normaliseSessionModes(
    readSessionStorage(SESSION_KEY, SESSION_DEFAULTS)
  );

  applyAccessibilityState();
  buildAccessibilityUI();
  syncControls();
  setNote(
    isSpeechSupported()
      ? ""
      : "Read aloud is not available in this browser."
  );
}
