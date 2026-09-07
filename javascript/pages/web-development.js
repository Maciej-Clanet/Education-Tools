import { webChallenges, challengeKinds } from "../data/web-challenges.js"

const requestedSection = new URL(location.href).searchParams.get("challenges")

for (const sectionId of ["html-basics", "css-basics", "javascript-basics"]) {
  const section = document.getElementById(sectionId)
  const lessons = section.querySelector(".topic-grid")
  lessons.id = `${sectionId}-lessons`

  const controls = document.createElement("div")
  controls.className = "hub-view-toggle"
  controls.setAttribute("role", "group")
  controls.setAttribute("aria-label", `${section.querySelector("h2").textContent} view`)

  const panel = document.createElement("div")
  panel.id = `${sectionId}-challenges`
  panel.className = "hub-challenges"
  panel.hidden = true
  const challenges = webChallenges.filter((item) => item.section === sectionId)

  const legend = document.createElement("p")
  legend.className = "challenge-legend"
  legend.textContent = challenges.length
    ? "D = Debug · P = Write a program. Hover or use ⓘ to see skills."
    : "No challenges available here yet."
  panel.append(legend)

  const grid = document.createElement("ol")
  grid.className = "challenge-grid"
  for (const challenge of challenges) {
    const cell = document.createElement("li")
    cell.className = "challenge-cell"
    const link = document.createElement("a")
    link.className = "challenge-number"
    link.href = `../tools/code-playground.html?challenge=${encodeURIComponent(challenge.id)}`
    link.setAttribute("aria-label", `Challenge ${challenge.number}: ${challenge.title}. ${challengeKinds[challenge.kind]}.`)
    link.textContent = challenge.number
    const badge = document.createElement("span")
    badge.className = "challenge-kind"
    badge.setAttribute("aria-hidden", "true")
    badge.textContent = challenge.kind === "debug" ? "D" : "P"
    link.append(badge)

    const info = document.createElement("button")
    info.type = "button"
    info.className = "challenge-info"
    info.textContent = "ⓘ"
    info.setAttribute("aria-label", `Skills for challenge ${challenge.number}`)
    info.setAttribute("aria-expanded", "false")
    const tooltip = document.createElement("div")
    tooltip.id = `${challenge.id}-skills`
    tooltip.className = "challenge-tooltip"
    tooltip.setAttribute("role", "tooltip")
    tooltip.textContent = `${challenge.title} · ${challengeKinds[challenge.kind]}${challenge.topic ? ` · ${challenge.topic}` : ""} · Skills: ${challenge.skills.join(", ")}`
    link.setAttribute("aria-describedby", tooltip.id)
    info.setAttribute("aria-controls", tooltip.id)
    info.addEventListener("click", () => {
      cell.classList.remove("is-dismissed")
      const open = cell.classList.toggle("is-open")
      info.setAttribute("aria-expanded", String(open))
      if (!open) cell.classList.add("is-dismissed")
    })
    cell.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        cell.classList.remove("is-open")
        cell.classList.add("is-dismissed")
        info.setAttribute("aria-expanded", "false")
      }
    })
    cell.addEventListener("mouseleave", () => cell.classList.remove("is-dismissed"))
    cell.addEventListener("focusout", (event) => {
      if (!cell.contains(event.relatedTarget)) cell.classList.remove("is-dismissed")
    })
    cell.append(link, info, tooltip)
    grid.append(cell)
  }
  panel.append(grid)

  for (const view of ["Lessons", "Challenges"]) {
    const button = document.createElement("button")
    button.type = "button"
    button.textContent = view
    button.setAttribute("aria-controls", `${lessons.id} ${panel.id}`)
    button.setAttribute("aria-pressed", String(view === "Lessons"))
    button.addEventListener("click", () => {
      const showChallenges = view === "Challenges"
      lessons.hidden = showChallenges
      panel.hidden = !showChallenges
      for (const sibling of controls.children) {
        sibling.setAttribute("aria-pressed", String(sibling === button))
      }
    })
    controls.append(button)
  }
  lessons.before(controls)
  lessons.after(panel)
  if (requestedSection === sectionId) controls.lastElementChild.click()
}
