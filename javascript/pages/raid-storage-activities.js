import { readStorage, writeStorage } from "../core/storage.js";
import { arraySurvives, raidLevels, raidScenarios, evaluateRaidChoice, usableCapacity, raidReferenceTable } from "../data/raid-storage-data.js";

export function initRaidActivities() {
  document.querySelectorAll("[data-raid-stages]").forEach(root => {
    const panels = [...root.querySelectorAll("[data-stage-panel]")];
    const previous = root.querySelector("[data-stage-prev]");
    const next = root.querySelector("[data-stage-next]");
    let index = 0;
    function render() {
      panels.forEach((panel, i) => { panel.hidden = i !== index; });
      previous.disabled = index === 0;
      next.disabled = index === panels.length - 1;
      root.querySelector("[data-stage-count]").textContent = `${index + 1} / ${panels.length} · ${panels[index].querySelector("h3").textContent}`;
    }
    root.querySelector(".raid-stage-controls").hidden = false;
    previous.addEventListener("click", () => { index = Math.max(0, index - 1); render(); });
    next.addEventListener("click", () => { index = Math.min(panels.length - 1, index + 1); render(); });
    render();
  });

  const failureDemo = document.querySelector("[data-raid10]");
  if (failureDemo) {
    const disks = [...failureDemo.querySelectorAll(".raid-drive")];
    disks.forEach((disk, i) => { disk.querySelector("strong").textContent = `Drive ${i + 1}`; });
    failureDemo.querySelector("fieldset").hidden = false;
    failureDemo.addEventListener("change", () => {
      const failed = [...failureDemo.querySelectorAll("input:checked")].map(input => Number(input.value));
      disks.forEach((disk, i) => {
        disk.classList.toggle("is-failed", failed.includes(i));
        disk.querySelector("small").textContent = failed.includes(i) ? "✕ Failed · data unavailable here" : "● Healthy";
      });
      failureDemo.querySelector("[data-raid10-status]").textContent = arraySurvives("10", 4, failed)
        ? failed.length ? "Still accessible: at least one drive survives in each mirror pair. Replace failed drives and rebuild to restore protection." : "All drives healthy. Both mirror pairs contain two copies."
        : "Array lost: both drives in at least one mirror pair have failed. The other pair cannot recreate those missing blocks.";
    });
  }

  const root = document.querySelector("[data-raid-scenarios]");
  if (!root) return;
  const key = "lesson-raid-nas-decisions-v1";
  const saved = readStorage(key, {});
  const drafts = saved && typeof saved.drafts === "object" && saved.drafts !== null ? saved.drafts : {};
  let current = raidScenarios.some(item => item.id === saved?.current) ? saved.current : raidScenarios[0].id;
  root.innerHTML = `<label for="raid-scenario">Choose a scenario</label><select id="raid-scenario">${raidScenarios.map(s=>`<option value="${s.id}">${s.title}</option>`).join("")}</select><div class="raid-scenario-brief"><h3 data-scenario-title></h3><p data-scenario-needs></p><p data-scenario-drives></p></div><form data-scenario-form><fieldset><legend>Which RAID level or levels can you justify?</legend><div class="raid-choice-grid">${raidLevels.map(level=>`<label class="raid-choice"><input type="checkbox" name="raid" value="${level.id}" /> <strong>RAID ${level.id}</strong><span data-choice-capacity="${level.id}"></span></label>`).join("")}</div></fieldset><label for="raid-reason">Explain your choice</label><textarea id="raid-reason" rows="4" placeholder="I would choose RAID … because … . The trade-off is … ."></textarea><div class="raid-stage-controls"><button type="submit" class="primary-link">Compare my choice</button><button type="button" class="lesson-secondary-action" data-reset-scenario>Clear this attempt</button></div><p class="raid-save-note">Choices and explanations save on this device.</p><div data-scenario-feedback role="status" aria-live="polite"></div></form>`;
  const select = root.querySelector("select");
  const reference = document.createElement("dialog");
  reference.className = "raid-reference-dialog";
  reference.setAttribute("aria-labelledby", "raid-reference-heading");
  reference.setAttribute("data-no-slide-advance", "");
  reference.innerHTML = `<form method="dialog"><button class="lesson-secondary-action" autofocus>Close reference</button></form><h2 id="raid-reference-heading">RAID reference</h2>${raidReferenceTable()}`;
  document.body.append(reference);
  const lookup = document.createElement("button");
  lookup.type = "button";
  lookup.className = "lesson-secondary-action raid-lookup-button";
  lookup.textContent = "Open RAID reference";
  lookup.addEventListener("click", () => reference.showModal());
  root.prepend(lookup);
  root.parentElement.querySelector(".raid-lookup").hidden = true;
  const reason = root.querySelector("textarea");
  const choices = [...root.querySelectorAll('input[name="raid"]')];
  const feedback = root.querySelector("[data-scenario-feedback]");
  function save() {
    drafts[current] = { choices: choices.filter(c=>c.checked).map(c=>c.value), reason: reason.value };
    writeStorage(key, { current, drafts });
  }
  function render() {
    const scenario = raidScenarios.find(s=>s.id===current);
    select.value = current;
    root.querySelector("[data-scenario-title]").textContent = scenario.title;
    root.querySelector("[data-scenario-needs]").textContent = scenario.needs;
    root.querySelector("[data-scenario-drives]").textContent = `${scenario.drives} × ${scenario.size} TB drives · ${scenario.drives * scenario.size} TB raw capacity`;
    const draft = drafts[current];
    choices.forEach(input => { input.checked = Array.isArray(draft?.choices) && draft.choices.includes(input.value); });
    reason.value = typeof draft?.reason === "string" ? draft.reason : "";
    raidLevels.forEach(level => {
      const capacity = usableCapacity(level.id, scenario.drives, scenario.size);
      root.querySelector(`[data-choice-capacity="${level.id}"]`).textContent = capacity === null ? "Not an arrangement taught for this drive count" : `${capacity} TB usable`;
    });
    feedback.replaceChildren();
  }
  select.addEventListener("change", () => { save(); current = select.value; render(); save(); });
  choices.forEach(input => input.addEventListener("change", () => { save(); feedback.replaceChildren(); }));
  reason.addEventListener("input", () => { save(); feedback.replaceChildren(); });
  root.querySelector("form").addEventListener("submit", event => {
    event.preventDefault(); save();
    const result = evaluateRaidChoice(current, choices.filter(c=>c.checked).map(c=>c.value));
    feedback.replaceChildren();
    const heading = document.createElement("h4");
    heading.textContent = result.valid ? "A defensible choice — now check your reasoning" : "Reconsider the requirements";
    feedback.append(heading);
    for (const message of result.messages) { const p = document.createElement("p"); p.textContent = message; feedback.append(p); }
    const prompt = document.createElement("p");
    prompt.textContent = reason.value.trim()
      ? "Compare your explanation with this feedback: have you linked a benefit to a requirement, named a trade-off, and explained each option you selected? Your written reasoning is for self-checking or teacher review; it is not automatically marked."
      : "Add an explanation: which requirement does your choice meet, and what capacity, performance or protection do you give up?";
    feedback.append(prompt);
  });
  root.querySelector("[data-reset-scenario]").addEventListener("click", () => {
    if (!window.confirm("Clear your choices and explanation for this scenario?")) return;
    delete drafts[current]; render(); save();
  });
  render();
}
