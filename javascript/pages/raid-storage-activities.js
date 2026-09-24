import { readStorage, writeStorage } from "../core/storage.js";
import { arraySurvives, raidLevels, raidPreviews, raidScenarios, evaluateRaidChoice, usableCapacity, raidReferenceTable, xorBits } from "../data/raid-storage-data.js";

function initMechanismVisuals() {
  document.querySelectorAll('[data-raid-picker]').forEach(root => {
    root.addEventListener('click', event => {
      const button = event.target.closest('[data-preview-level]');
      if (!button) return;
      const id = button.dataset.previewLevel, info = raidPreviews[id];
      root.querySelectorAll('[data-preview-level]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      root.querySelector('.raid-preview-number').textContent = id;
      root.querySelector('[data-preview-title]').textContent = info.title;
      root.querySelector('[data-preview-benefit]').textContent = info.benefit;
      root.querySelector('[data-preview-cost]').textContent = `The cost: ${info.cost}`;
    });
  });
  document.querySelectorAll('[data-parity-rows]').forEach(root => {
    root.addEventListener('click', event => {
      const button = event.target.closest('[data-parity-row]');
      if (!button) return;
      const row = button.dataset.parityRow;
      root.querySelectorAll('[data-parity-row]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      root.querySelectorAll('[data-block-family]').forEach(item => item.classList.toggle('is-dimmed', row !== 'all' && item.dataset.blockFamily !== row));
      root.querySelector('[data-parity-caption]').textContent = row === 'all'
        ? 'P-A protects A1 and A2; P-B protects B1 and B2; P-C protects C1 and C2.'
        : `Row ${row}: ${row}1 and ${row}2 are data. P-${row} is their parity. It is on Drive ${{A:3,B:2,C:1}[row]}.`;
    });
  });
  document.querySelectorAll('[data-xor-picker]').forEach(root => {
    root.addEventListener('change', () => {
      const a=root.querySelector('[data-xor-a]').value, b=root.querySelector('[data-xor-b]').value;
      root.querySelector('output').textContent = `${a===b ? 'Same' : 'Different'} → parity ${xorBits(a,b)}`;
    });
  });
  document.querySelectorAll('[data-capacity-info]').forEach(root => {
    const button=root.querySelector('button'), tip=root.querySelector('[hidden]');
    let pinned=false;
    const show = open => { tip.hidden=!open; button.setAttribute('aria-expanded', String(open)); };
    root.addEventListener('pointerenter', event => { if(event.pointerType==='mouse') show(true); });
    root.addEventListener('pointerleave', () => { if(!pinned && !root.contains(document.activeElement)) show(false); });
    button.addEventListener('focus', () => show(true));
    button.addEventListener('click', () => { pinned=!pinned; show(pinned); });
    root.addEventListener('focusout', event => { if(!root.contains(event.relatedTarget)) { pinned=false; show(false); } });
    root.addEventListener('keydown', event => { if(event.key==='Escape') { event.stopPropagation(); pinned=false; show(false); } });
  });
  document.querySelectorAll('[data-raid-read]').forEach(root => {
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
    const button=root.querySelector('[data-read-toggle]');
    const lanes=[...root.querySelectorAll('.raid-read-lane')];
    let beat=reduced.matches?7:0, paused=reduced.matches, visible=false, timer=null;
    function draw() {
      lanes.forEach(lane => {
        const parallel=lane.classList.contains('is-parallel');
        lane.querySelectorAll('.raid-read-piece').forEach((piece,i) => {
          piece.classList.toggle('is-moving', beat === (parallel?Math.floor(i/3):i)+1);
        });
        lane.querySelectorAll('.raid-arrival').forEach((piece,i) => piece.classList.toggle('has-arrived',beat >= (parallel?Math.floor(i/3):i)+1));
        const complete=beat >= (parallel?2:6);
        lane.classList.toggle('is-complete',complete);
        lane.querySelector('.raid-read-done').textContent = complete ? 'File ready' : `${Math.min(6,beat*(parallel?3:1))} of 6 pieces`;
      });
      root.classList.toggle('is-paused',paused);
      button.textContent=paused?'Play animation':'Pause animation';
      button.setAttribute('aria-pressed',String(paused));
    }
    function schedule() {
      clearInterval(timer); timer=null;
      if(!paused && visible && !document.hidden) timer=setInterval(() => { beat=(beat+1)%9; draw(); },1100);
    }
    button.hidden=false;
    button.addEventListener('click', () => { paused=!paused; if(!paused && beat>=7) beat=0; draw(); schedule(); });
    reduced.addEventListener('change', () => { paused=reduced.matches; beat=paused?7:0; draw(); schedule(); });
    document.addEventListener('visibilitychange',schedule);
    new IntersectionObserver(entries => { visible=entries[0].isIntersecting; schedule(); },{threshold:0.15}).observe(root);
    draw();
  });
}

export function initRaidActivities() {
  initMechanismVisuals();
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
        ? failed.length ? "Still accessible: a drive survives in each pair. Replace failed drives and rebuild." : "All drives healthy. Both mirror pairs contain two copies."
        : "Array lost: both drives in one pair have failed. The other pair cannot recreate its blocks.";
    });
  }

  const root = document.querySelector("[data-raid-scenarios]");
  if (!root) return;
  const key = "lesson-raid-nas-decisions-v2";
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
