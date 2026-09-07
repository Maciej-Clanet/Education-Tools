import { readStorage, writeStorage, removeStorage } from "../core/storage.js"

export const builderScenarios = {
  office: { label: "Office PC", budget: 600, minTier: 1, minRam: 16, minVram: 0, minResolution: 1080,
    needs: "Browser, word processing, spreadsheets, video calls and two monitors. Aim for sufficient performance and low running costs." },
  design: { label: "3D design student", budget: 1200, minTier: 2, minRam: 32, minVram: 8, minResolution: 1440,
    needs: "Supported 3D/video software, multitasking, at least 32 GB RAM, 8 GB dedicated VRAM and two 1440p displays. Software licences are already available." },
}

// Fictional teaching options. Socket names and prices do not describe real products.
export const builderOptions = {
  cpu: [
    { id: "office", label: "Office CPU · 4 cores · socket A · integrated graphics", price: 90, tier: 1, socket: "A", power: 65, integrated: true },
    { id: "media", label: "Media CPU · 6 cores / 12 threads · socket A · integrated graphics", price: 170, tier: 2, socket: "A", power: 95, integrated: true },
    { id: "premium", label: "Premium CPU · 8 cores · socket B · no integrated graphics", price: 260, tier: 3, socket: "B", power: 125, integrated: false },
  ],
  board: [
    { id: "a", label: "Board A · socket A · DDR4 · two display outputs", price: 75, socket: "A", ddr: 4 },
    { id: "b", label: "Board B · socket B · DDR5 · two display outputs", price: 110, socket: "B", ddr: 5 },
  ],
  ram: [
    { id: "8", label: "8 GB DDR4 kit", price: 25, capacity: 8, ddr: 4 },
    { id: "16", label: "16 GB DDR4 kit", price: 45, capacity: 16, ddr: 4 },
    { id: "32", label: "32 GB DDR4 kit", price: 80, capacity: 32, ddr: 4 },
    { id: "32-ddr5", label: "32 GB DDR5 kit", price: 100, capacity: 32, ddr: 5 },
  ],
  gpu: [
    { id: "integrated", label: "Use CPU integrated graphics · no separate card", price: 0, vram: 0, power: 0, length: 0 },
    { id: "entry", label: "Dedicated GPU · 4 GB VRAM · 230 mm", price: 130, vram: 4, power: 100, length: 230 },
    { id: "design", label: "Dedicated GPU · 8 GB VRAM · 250 mm", price: 230, vram: 8, power: 160, length: 250 },
    { id: "high", label: "High-end GPU · 16 GB VRAM · 340 mm", price: 430, vram: 16, power: 300, length: 340 },
  ],
  display: [
    { id: "single", label: "One 1080p monitor · 60 Hz", price: 90, count: 1, resolution: 1080 },
    { id: "dual", label: "Two 1080p monitors · 60 Hz", price: 170, count: 2, resolution: 1080 },
    { id: "design", label: "Two 1440p monitors · 60 Hz", price: 300, count: 2, resolution: 1440 },
  ],
  psu: [
    { id: "300", label: "300 W PSU · motherboard/CPU connections only", price: 35, watts: 300, gpuPower: false },
    { id: "450", label: "450 W PSU · compatible GPU power connection", price: 45, watts: 450, gpuPower: true },
    { id: "650", label: "650 W PSU · compatible GPU power connection", price: 75, watts: 650, gpuPower: true },
  ],
}
export const builderBasePrice = 100
const fieldLabels = { cpu: "CPU", board: "Motherboard", ram: "RAM", gpu: "Graphics", display: "Displays", psu: "Power supply" }

export function evaluateHardwareBuild(scenarioId, selections = {}) {
  const scenario = builderScenarios[scenarioId] ?? builderScenarios.office
  const parts = Object.fromEntries(Object.entries(builderOptions).map(([key, options]) => [key, options.find(option => option.id === selections[key])]))
  const total = builderBasePrice + Object.values(parts).reduce((sum, part) => sum + (part?.price ?? 0), 0)
  const issues = []
  const advice = []
  for (const [key, part] of Object.entries(parts)) if (!part) issues.push(`Choose ${fieldLabels[key].toLowerCase()}.`)
  const { cpu, board, ram, gpu, display, psu } = parts
  if (total > scenario.budget) issues.push(`Over budget by £${total - scenario.budget}. Reduce cost while keeping the required features.`)
  if (cpu && board && cpu.socket !== board.socket) issues.push("CPU and motherboard sockets do not match.")
  if (ram && board && ram.ddr !== board.ddr) issues.push("RAM generation does not match the motherboard.")
  if (cpu && cpu.tier < scenario.minTier) issues.push("Choose at least the media CPU tier for this design workload.")
  if (ram && ram.capacity < scenario.minRam) issues.push(`This scenario needs at least ${scenario.minRam} GB RAM for its active applications.`)
  if (gpu && gpu.vram < scenario.minVram) issues.push(`The design software requires a dedicated GPU with at least ${scenario.minVram} GB VRAM in this scenario.`)
  if (cpu && gpu?.id === "integrated" && !cpu.integrated) issues.push("This CPU has no integrated graphics; a motherboard display socket cannot create them.")
  if (gpu && gpu.length > 300) issues.push("The graphics card exceeds the case’s 300 mm GPU clearance.")
  if (display && (display.count < 2 || display.resolution < scenario.minResolution)) issues.push(`The user needs two displays at ${scenario.minResolution}p or higher.`)
  if (gpu?.power > 0 && psu && !psu.gpuPower) issues.push("This PSU lacks the required graphics-card power connection.")
  let recommendedWatts = null
  if (cpu && gpu) {
    // Simplified classroom allowance: 50 W for other internal components, then 25% headroom.
    recommendedWatts = Math.ceil((cpu.power + gpu.power + 50) * 1.25)
    if (psu && psu.watts < recommendedWatts) issues.push(`PSU capacity is below the activity’s ${recommendedWatts} W allowance, including headroom.`)
  }
  if (scenarioId !== "design") {
    if (gpu?.id === "integrated" && cpu?.integrated) advice.push("Integrated graphics are sufficient for these office tasks and support both supplied displays, leaving budget for RAM and readable screens.")
    if (gpu && gpu.id !== "integrated") advice.push("A dedicated GPU adds cost, power and heat with little benefit for this office workload.")
    if (cpu?.tier > 1) advice.push("The office CPU tier is sufficient here; explain any benefit before paying for the higher tier.")
    if (ram?.capacity > 16) advice.push("16 GB meets this office scenario. Extra capacity is not automatically extra speed.")
    if (display?.resolution > 1080) advice.push("Higher-resolution displays may help workspace, but must earn their extra cost within this budget.")
  } else if (gpu?.vram >= 8) advice.push("The GPU and VRAM meet the stated accelerated-design requirement; software support still matters.")
  if (issues.length === 0) advice.push("The selected options meet this simplified scenario. Justify the remaining budget and trade-offs; real purchases also need manufacturer compatibility checks.")
  return { total, budget: scenario.budget, remaining: scenario.budget - total, issues, advice, recommendedWatts, valid: issues.length === 0 }
}

export function initHardwareBuilder(root) {
  if (!root) return
  const key = "lesson-hardware-performance-system-builder-v1"
  const saved = readStorage(key, {})
  let scenarioId = Object.hasOwn(builderScenarios, saved?.scenario) ? saved.scenario : "office"
  const drafts = saved?.drafts && typeof saved.drafts === "object" ? saved.drafts : {}
  root.innerHTML = `
    <div class="builder-scenario"><label for="builder-scenario">User scenario</label><select id="builder-scenario">${Object.entries(builderScenarios).map(([id, scenario]) => `<option value="${id}">${scenario.label} — £${scenario.budget}</option>`).join("")}</select></div>
    <p data-builder-needs></p>
    <details class="exam-guidance"><summary>Included parts and compatibility assumptions</summary><p>The fixed £100 bundle includes a case with 300 mm GPU clearance, suitable CPU cooling, 512 GB SSD, keyboard, mouse and webcam. Software licences are already available. Both boards fit the case and support the matching CPU and RAM options. Display cables are included; all available graphics solutions support the supplied display pairs. The PSU allowance uses CPU + GPU + 50 W for other internal parts, plus 25% headroom. This is a simplified classroom model, not a real PSU-sizing rule.</p></details>
    <form data-builder-form><div class="builder-fields">${Object.entries(builderOptions).map(([field, options]) => `<div class="builder-field"><label for="builder-${field}">${fieldLabels[field]}</label><select id="builder-${field}" name="${field}"><option value="">Choose ${fieldLabels[field].toLowerCase()}</option>${options.map(option => `<option value="${option.id}">${option.label} — £${option.price}</option>`).join("")}</select></div>`).join("")}</div>
    <p class="builder-budget" data-builder-budget aria-live="polite"></p>
    <div class="quiz-actions"><button type="submit" class="primary-link">Check recommendation</button><button type="button" class="lesson-secondary-action" data-builder-reset>Reset activity</button></div>
    <div class="builder-feedback" data-builder-feedback aria-live="polite"></div></form>`
  const form = root.querySelector("form")
  const scenarioControl = root.querySelector("#builder-scenario")
  const feedback = root.querySelector("[data-builder-feedback]")
  const selections = () => Object.fromEntries(new FormData(form))
  function update() {
    const result = evaluateHardwareBuild(scenarioId, selections())
    root.querySelector("[data-builder-budget]").textContent = `Selected total: £${result.total} / £${result.budget} (includes £100 bundle). ${result.remaining >= 0 ? `£${result.remaining} remaining.` : `£${-result.remaining} over budget.`}`
  }
  function restore() {
    scenarioControl.value = scenarioId
    root.querySelector("[data-builder-needs]").textContent = builderScenarios[scenarioId].needs
    for (const control of form.querySelectorAll("select")) {
      control.value = drafts[scenarioId]?.[control.name] ?? ""
      if (control.selectedIndex < 0) control.value = ""
    }
    feedback.replaceChildren()
    update()
  }
  function save() { writeStorage(key, { scenario: scenarioId, drafts }) }
  form.addEventListener("change", () => {
    drafts[scenarioId] = selections()
    feedback.replaceChildren()
    update()
    save()
  })
  scenarioControl.addEventListener("change", () => { scenarioId = scenarioControl.value; restore(); save() })
  form.addEventListener("submit", event => {
    event.preventDefault()
    const result = evaluateHardwareBuild(scenarioId, selections())
    feedback.replaceChildren()
    const heading = document.createElement("strong")
    heading.textContent = result.valid ? "Requirements met — now justify the choice." : "Revise the recommendation."
    const list = document.createElement("ul")
    for (const message of [...result.issues, ...result.advice]) {
      const item = document.createElement("li")
      item.textContent = message
      list.append(item)
    }
    feedback.append(heading, list)
  })
  root.querySelector("[data-builder-reset]").addEventListener("click", () => {
    for (const id of Object.keys(drafts)) delete drafts[id]
    scenarioId = "office"
    removeStorage(key)
    restore()
  })
  restore()
}
