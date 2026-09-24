// Progressively enhance authored examples. The browser performs all flex layout.
const cssProperties = {
  display: 'display', direction: 'flex-direction', justify: 'justify-content',
  align: 'align-items', gap: 'gap', height: 'height', wrap: 'flex-wrap',
}

export function initFlexExplorers(configs, root = document) {
  root.querySelectorAll('[data-flex-explorer]').forEach(host => {
    const config = configs[host.dataset.flexExplorer]
    if (!config || host.dataset.flexReady) return
    host.dataset.flexReady = 'true'
    const parent = host.querySelector('[data-flex-parent]')
    const controls = [...host.querySelectorAll('[data-flex-control]')]
    const horizontal = host.querySelector('[data-flex-horizontal]')
    const vertical = host.querySelector('[data-flex-vertical]')
    const code = host.querySelector('[data-flex-code]')
    const feedback = host.querySelector('[data-flex-feedback]')
    const spacing = host.querySelector('[data-flex-spacing]')
    const measurements = host.querySelector('[data-flex-measurements]')
    const children = [...parent.children]
    const childStyles = children.map(child => child.style.cssText)
    let state

    function measureLayout() {
      if (!state || !parent.getClientRects().length) return
      const rects = children.map(child => child.getBoundingClientRect())
      if (spacing && rects.length > 1) {
        const [first, second] = rects
        const distance = state.direction === 'column' ? second.top - first.bottom : second.left - first.right
        spacing.textContent = `Gap setting: ${state.gap}px. Actual space between children: ${Math.round(distance)}px.`
      }
      if (measurements && config.measure) {
        const bounds = parent.getBoundingClientRect()
        measurements.textContent = config.measure(state, {
          widths: rects.map(rect => rect.width),
          lines: new Set(rects.map(rect => Math.round(rect.top))).size,
          innerWidth: parent.clientWidth,
          overflow: rects.some(rect => rect.right > bounds.right + 1),
        })
      }
    }

    function render() {
      state = { ...config.initial }
      controls.forEach(control => { state[control.dataset.flexControl] = control.value })
      parent.style.display = state.display
      parent.style.flexDirection = state.direction
      parent.style.justifyContent = state.justify
      parent.style.alignItems = state.align
      if (state.wrap) parent.style.flexWrap = state.wrap
      parent.style.gap = `${state.gap}px`
      parent.style.height = state.height === 'auto' ? 'auto' : `${state.height}px`
      parent.style.maxWidth = state.width === 'compact' ? '240px' : '100%'
      if (config.parentStyles) Object.assign(parent.style, config.parentStyles(state))
      if (config.children) {
        const styles = config.children(state)
        children.forEach((child, index) => {
          child.style.cssText = childStyles[index]
          Object.assign(child.style, styles[index] ?? {})
        })
      }
      host.dataset.direction = state.direction

      if (horizontal && vertical) {
        const column = state.direction === 'column'
        const main = config.axes === 'direction' ? 'Children go this way' : 'Main axis'
        const mainLabel = config.axes === 'properties' ? `${main} · justify-content` : main
        const crossLabel = config.crossLabel ?? (config.axes === 'properties' ? 'Cross axis · align-items' : 'Cross axis')
        horizontal.textContent = column ? crossLabel : mainLabel
        vertical.textContent = column ? mainLabel : crossLabel
        horizontal.dataset.axis = column ? 'cross' : 'main'
        vertical.dataset.axis = column ? 'main' : 'cross'
        horizontal.hidden = config.axes === 'direction' && column
        vertical.hidden = config.axes === 'direction' && !column
      }

      code.textContent = config.code ? config.code(state) : `.parent {\n${config.properties.map(key => `  ${cssProperties[key]}: ${state[key]}${['gap', 'height'].includes(key) ? 'px' : ''};`).join('\n')}\n}`
      feedback.textContent = config.describe(state)
      controls.forEach(control => {
        if (control.type !== 'range') return
        control.setAttribute('aria-valuetext', `${control.value} pixels`)
        host.querySelector('[data-flex-gap-output]').textContent = `${control.value}px`
      })
      measureLayout()
    }

    controls.forEach(control => {
      control.disabled = false
      control.addEventListener(control.type === 'range' ? 'input' : 'change', render)
    })
    const reset = host.querySelector('[data-flex-reset]')
    reset.disabled = false
    reset.addEventListener('click', () => {
      controls.forEach(control => { control.value = String(config.initial[control.dataset.flexControl]) })
      render()
      feedback.textContent = `Example reset. ${feedback.textContent}`
    })
    if ((spacing || measurements) && typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(measureLayout)
      observer.observe(parent)
    }
    render()
  })
}
