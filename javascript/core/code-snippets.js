// Read-only snippets: syntax colours are authored in HTML, so they also work
// without JavaScript. Copy the code's textContent, never its highlighted markup.
export function initCodeSnippets(root = document) {
  root.querySelectorAll("[data-code-snippet]").forEach((snippet) => {
    if (snippet.dataset.copyReady) return
    const code = snippet.querySelector("pre code")
    const toolbar = snippet.querySelector(".code-snippet__toolbar")
    if (!code || !toolbar) return
    snippet.dataset.copyReady = "true"

    const button = document.createElement("button")
    button.type = "button"
    button.className = "code-snippet__copy"
    button.textContent = "Copy"
    button.setAttribute("aria-label", `Copy ${snippet.dataset.codeSnippet}`)
    const status = document.createElement("span")
    status.className = "code-snippet__status"
    status.setAttribute("role", "status")
    toolbar.append(status, button)

    let resetTimer
    button.addEventListener("click", async () => {
      clearTimeout(resetTimer)
      try {
        await navigator.clipboard.writeText(code.textContent)
        status.textContent = "Copied"
      } catch {
        const selection = window.getSelection()
        const range = document.createRange()
        range.selectNodeContents(code)
        selection.removeAllRanges()
        selection.addRange(range)
        status.textContent = "Code selected. Press Ctrl+C or ⌘C to copy."
      }
      resetTimer = setTimeout(() => { status.textContent = "" }, 5000)
    })
  })
}
