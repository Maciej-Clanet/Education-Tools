// Exact lookup only: no shell, interpreter, network request or dynamic evaluation.
export function normaliseTeachingCommand(command) {
  return String(command).trim().toLowerCase().replace(/[ \t]+/g, ' ').replace(/ *\| */g, '|')
}

export function resolveTeachingCommand(command, commands) {
  const key = normaliseTeachingCommand(command)
  const entry = commands.find(item => normaliseTeachingCommand(item.command) === key)
  return entry ? { supported: true, output: entry.output } : {
    supported: false,
    output: 'This teaching terminal only supports the commands used in this lesson. Choose a learned command below and try again.',
  }
}

export function initSimulatedTerminals(configs, root = document) {
  root.querySelectorAll('[data-simulated-terminal]').forEach(host => {
    const config = configs[host.dataset.simulatedTerminal]
    if (!config || host.dataset.terminalReady) return
    host.dataset.terminalReady = 'true'
    const form = host.querySelector('form')
    const input = host.querySelector('input')
    const output = host.querySelector('[data-terminal-output]')
    const announcement = host.querySelector('[data-terminal-status]')
    const currentCommand = host.dataset.currentCommand ?? ''
    const transcript = []
    const history = []
    let cursor = 0
    let draft = ''
    function reset() {
      history.length = 0; transcript.length = 0; cursor = 0; draft = ''
      input.value = currentCommand
      output.textContent = config.prompt
    }
    reset()
    form.addEventListener('submit', event => {
      event.preventDefault()
      const command = input.value.trim()
      if (!command) { input.focus(); return }
      const result = resolveTeachingCommand(command, config.commands)
      transcript.push(`${config.prompt} ${command}\n${result.output}`)
      if (transcript.length > 30) transcript.shift()
      output.textContent = `${transcript.join('\n\n')}\n\n${config.prompt}`
      announcement.textContent = `${command}\n${result.output}\nReady for another command.`
      output.scrollTop = output.scrollHeight
      history.push(command)
      if (history.length > 30) history.shift()
      cursor = history.length
      draft = ''
      input.value = ''
      input.focus()
    })
    input.addEventListener('keydown', event => {
      if (!['ArrowUp', 'ArrowDown'].includes(event.key) || !history.length) return
      event.preventDefault()
      if (cursor === history.length) draft = input.value
      cursor = Math.max(0, Math.min(history.length, cursor + (event.key === 'ArrowUp' ? -1 : 1)))
      input.value = cursor === history.length ? draft : history[cursor]
    })
    host.querySelectorAll('[data-terminal-example]').forEach(button => {
      button.addEventListener('click', () => {
        input.value = button.dataset.terminalExample
        cursor = history.length
        input.focus()
      })
    })
    host.querySelector('[data-terminal-reset]').addEventListener('click', () => {
      reset()
      announcement.textContent = 'Terminal reset. The current command is ready to run.'
      input.focus()
    })
  })
}
