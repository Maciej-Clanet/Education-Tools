import { parseValues, validateTemperature, convertTemperature, sortRecords, summarise, describeTrend } from './data-processing.js'

const format = value => Number(value.toFixed(2)).toLocaleString('en-GB')
const svgNS = 'http://www.w3.org/2000/svg'
function element(tag, attributes = {}, text) {
  const node = document.createElementNS(svgNS, tag)
  Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, value))
  if (text !== undefined) node.textContent = text
  return node
}

// Numeric, local SVG plot with exact readings in its text alternative.
function renderChart(container, records, title) {
  container.replaceChildren()
  const figure = document.createElement('figure')
  figure.className = 'data-chart'
  const caption = document.createElement('figcaption')
  caption.textContent = records.length
    ? `${title}. ${sortRecords(records).map(r => `${r.time}: ${format(r.temperature)}°C`).join('; ')}.`
    : `${title}. No readings meet the reporting rule.`
  if (records.length) {
    const ordered = sortRecords(records)
    const stats = summarise(ordered.map(r => r.temperature))
    const low = Math.floor(stats.minimum / 5) * 5 - 5
    const tickStep = Math.max(5, Math.ceil((stats.maximum - low) / 20) * 5)
    const high = low + tickStep * 4
    const minutes = time => Number(time.slice(0, 2)) * 60 + Number(time.slice(3))
    const first = minutes(ordered[0].time), last = minutes(ordered.at(-1).time)
    const x = record => first === last ? 320 : 65 + (minutes(record.time) - first) / (last - first) * 510
    const y = value => 245 - (value - low) / (high - low) * 195
    const svg = element('svg', { viewBox: '0 0 640 295', role: 'img', 'aria-label': caption.textContent })
    svg.append(element('title', {}, title))
    for (let i = 0; i <= 4; i++) {
      const value = low + (high - low) * i / 4
      svg.append(element('line', { x1: 65, x2: 575, y1: y(value), y2: y(value), class: 'chart-axis' }), element('text', { x: 55, y: y(value) + 5, 'text-anchor': 'end' }, format(value)))
    }
    svg.append(element('text', { x: 20, y: 22 }, '°C'), element('text', { x: 600, y: 285, 'text-anchor': 'end' }, 'Time'))
    svg.append(element('polyline', { points: ordered.map(r => `${x(r)},${y(r.temperature)}`).join(' '), class: 'chart-line' }))
    ordered.forEach(record => {
      const point = element('circle', { cx: x(record), cy: y(record.temperature), r: 5, class: 'chart-point' })
      point.append(element('title', {}, `${record.time}: ${format(record.temperature)}°C`))
      svg.append(point, element('text', { x: x(record), y: 266, 'text-anchor': 'middle' }, record.time))
    })
    figure.append(svg)
  }
  figure.append(caption)
  container.append(figure)
}

export function initProcessingTools(defaultRecords, root = document) {
  let records = defaultRecords.map(record => ({ ...record }))
  const query = selector => root.querySelector(selector)
  function renderReport() {
    const accepted = records.filter(r => validateTemperature(r.temperature))
    const rejected = records.filter(r => !validateTemperature(r.temperature))
    const summary = summarise(accepted.map(r => r.temperature))
    query('[data-report-summary]').textContent = summary
      ? `${summary.count} accepted readings · Average ${format(summary.average)}°C · High ${format(summary.maximum)}°C · Trend: ${describeTrend(accepted).toLowerCase()}.`
      : 'No accepted readings. A temperature summary cannot be calculated.'
    query('[data-report-exceptions]').textContent = rejected.length
      ? `Exceptions: ${rejected.map(r => `${r.time}: ${format(r.temperature)}°C`).join('; ')}. Outside −30 to 55°C; excluded from chart and summary pending investigation. Lines connect available readings, not measurements of the missing times.`
      : 'All readings pass the −30 to 55°C rule. Passing does not prove accuracy.'
    query('[data-raw-records]').textContent = 'timestamp,temperature_c,sensor_id\n' + records.map(r => `2026-09-08T${r.time}:00,${r.temperature},sensor_03`).join('\n')
    renderChart(query('[data-report-chart]'), accepted, 'Accepted weather readings')
  }
  function renderAnalysis() {
    renderChart(query('[data-analysis-chart]'), records, 'All weather readings, including possible anomalies')
    const stats = summarise(records.map(r => r.temperature))
    const unusual = records.filter(r => !validateTemperature(r.temperature))
    query('[data-tool="analysis"] [data-result]').textContent = `Trend: ${describeTrend(records).toLowerCase()} (all successive changes considered). Highest: ${format(stats.maximum)}°C. Lowest: ${format(stats.minimum)}°C. ${unusual.length ? `Possible anomalies outside our range: ${unusual.map(r => `${r.time} (${format(r.temperature)}°C)`).join(', ')}.` : 'No readings outside our range.'} This does not explain the cause.`
    renderReport()
  }
  root.querySelectorAll('[data-tool]').forEach(form => {
    const kind = form.dataset.tool
    const result = form.querySelector('[data-result]')
    function update() {
      try {
        if (kind === 'validation' || kind === 'conversion') {
          const value = parseValues(form.elements.value.value)[0]
          result.textContent = kind === 'validation'
            ? `${validateTemperature(value) ? 'Valid' : 'Invalid'}: ${format(value)}°C ${validateTemperature(value) ? 'passes' : 'fails'} the −30 to 55°C range rule. This does not prove whether the reading is true.`
            : `${format(value)}°C = ${format(convertTemperature(value))}°F. Same temperature, different unit.`
        } else if (kind === 'aggregation') {
          const stats = summarise(parseValues(form.elements.values.value))
          const operation = form.elements.operation.value
          result.textContent = `${operation[0].toUpperCase() + operation.slice(1)} = ${format(stats[operation])}${['average', 'minimum', 'maximum'].includes(operation) ? '°C' : ''}. Calculated from ${stats.count} readings; no range validation is applied here.`
        } else if (kind === 'sorting') {
          const sorted = sortRecords(defaultRecords, form.elements.field.value, form.elements.direction.value)
          const tbody = form.querySelector('tbody')
          const oldTops = new Map([...tbody.rows].map(row => [row.cells[0].textContent, row.getBoundingClientRect().top]))
          tbody.replaceChildren(...sorted.map(record => {
            const row = document.createElement('tr')
            for (const value of [record.time, `${record.temperature}${validateTemperature(record.temperature) ? '' : ' · outside rule'}`]) {
              const cell = document.createElement('td'); cell.textContent = value; row.append(cell)
            }
            return row
          }))
          if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            for (const row of tbody.rows) {
              const offset = oldTops.get(row.cells[0].textContent) - row.getBoundingClientRect().top
              if (Number.isFinite(offset) && offset) row.animate([
                { transform: `translateY(${offset}px)` }, { transform: 'translateY(0)' },
              ], { duration: 650, easing: 'ease-in-out' })
            }
          }
          result.textContent = `Sorted by ${form.elements.field.value}, ${form.elements.direction.value}. Values and timestamp–temperature pairs are unchanged.`
        } else if (kind === 'analysis') {
          const next = [...form.querySelectorAll('[name="reading"]')].map(input => ({ time: input.dataset.time, temperature: parseValues(input.value)[0] }))
          records = next
          renderAnalysis()
        }
      } catch (error) {
        result.textContent = `${error.message} ${kind === 'analysis' ? 'The graph and report still show the last successfully plotted readings.' : ''}`
      }
    }
    form.addEventListener('submit', event => { event.preventDefault(); update() })
    form.addEventListener('reset', () => {
      // Run after the native reset restores the default field values.
      queueMicrotask(() => {
        if (kind === 'sorting') {
          const tbody = form.querySelector('tbody')
          tbody.replaceChildren(...originalRows.map(row => row.cloneNode(true)))
          result.textContent = 'Original record order restored.'
        } else update()
      })
    })
    const originalRows = kind === 'sorting' ? [...form.querySelectorAll('tbody tr')].map(row => row.cloneNode(true)) : []
    if (kind !== 'sorting') update()
  })
  root.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => {
    const report = button.dataset.view === 'report'
    query('#weather-report').hidden = !report
    query('#weather-raw').hidden = report
    root.querySelectorAll('[data-view]').forEach(control => control.setAttribute('aria-pressed', String(control === button)))
    query('[data-view-status]').textContent = `${report ? 'Report' : 'Raw data'} view selected.`
  }))
}
