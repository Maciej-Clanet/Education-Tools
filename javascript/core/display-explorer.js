// Use browser layout directly: the same elements remain in place in every mode.
export function initDisplayExplorers(root = document) {
  root.querySelectorAll('[data-display-explorer]').forEach(host => {
    const controls = Object.fromEntries([...host.querySelectorAll('[data-display-control]')].map(control => [control.dataset.displayControl, control]))
    const parent = host.querySelector('[data-display-parent]')
    const items = [...parent.querySelectorAll('[data-display-item]')]
    function render() {
      const mode = controls.mode.value
      parent.style.width = `${controls.parent.value}px`
      for (const item of items) {
        item.style.display = mode
        item.style.width = `${controls.width.value}px`
        item.style.height = `${controls.height.value}px`
      }
      host.querySelectorAll('[data-display-output]').forEach(output => {
        const name = output.dataset.displayOutput
        output.textContent = controls[name].value + (name === 'mode' ? '' : 'px')
      })
      for (const name of ['width', 'height', 'parent']) controls[name].setAttribute('aria-valuetext', `${controls[name].value} CSS pixels`)
      host.querySelector('[data-display-explanation]').textContent = {
        block: 'Block: each item starts a new line. Width and height size each box.',
        inline: 'Inline: the text joins a line and can wrap. These width and height declarations do not size these normal inline text elements.',
        'inline-block': 'Inline-block: each sized box joins a line. A whole box moves to the next line when it cannot fit.',
      }[mode]
    }
    Object.values(controls).forEach(control => control.addEventListener(control.tagName === 'SELECT' ? 'change' : 'input', render))
    render()
  })
  root.querySelectorAll('[data-display-switch]').forEach(host => {
    const select = host.querySelector('select')
    const target = host.querySelector('[data-display-target]')
    function render() {
      target.style.display = select.value
      host.querySelector('[data-display-value]').textContent = select.value
      const status = host.querySelector('[data-display-status]')
      status.textContent = select.value === 'none' ? 'The message is absent from layout. Item B moves up; no gap is reserved.' : select.value === 'inline' ? 'The price stays in the sentence. The HTML element is still a span.' : host.dataset.displaySwitch === 'price' ? 'The price starts a new line. The HTML element is still a span.' : 'The message occupies a line between Item A and Item B.'
    }
    select.addEventListener('change', render)
    render()
  })
}
