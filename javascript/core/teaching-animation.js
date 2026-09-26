// Controls for CSS teaching loops. Decorative animation keeps its own motion rules.
export function initTeachingAnimations(root = document) {
  root.querySelectorAll('[data-teaching-animation]').forEach(host => {
    if (host.dataset.teachingAnimationReady) return
    host.dataset.teachingAnimationReady = 'true'
    let paused = false, visible = false
    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'lesson-secondary-action teaching-animation-control'
    function render() {
      host.classList.toggle('teaching-animation-paused', paused || !visible || document.hidden)
      button.textContent = `${paused ? 'Play' : 'Pause'} ${host.dataset.teachingAnimation}`
      button.setAttribute('aria-pressed', String(paused))
    }
    button.addEventListener('click', () => { paused = !paused; render() })
    host.append(button)
    new IntersectionObserver(entries => { visible = entries[0].isIntersecting; render() }).observe(host)
    document.addEventListener('visibilitychange', render)
    window.addEventListener('pagehide', () => { visible = false; render() })
    render()
  })
}
