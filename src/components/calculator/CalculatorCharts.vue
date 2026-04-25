<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { IsaAlgorithms, TEMPERATURE_LAYERS } from 'atmospheris'

const props = defineProps({
  altitude: { type: Number, default: -2000 }
})

const chartType = ref('temperature')
const altUnit = ref('m')
const altType = ref('H') // 'H' = geopotential, 'h' = geometric
const R = 6356766
const containerRef = ref(null)

// Compare mode: which properties to overlay
const compareSelected = ref(new Set(['temperature', 'pressure', 'density']))

let chartInstance = null
let Chart = null

const chartTypes = [
  { key: 'temperature', label: 'Temperature' },
  { key: 'pressure', label: 'Pressure' },
  { key: 'density', label: 'Density' },
  { key: 'speedOfSound', label: 'Speed of Sound' },
  { key: 'compare', label: 'Compare' },
]

function generateData(isa, propFn) {
  const alts = []
  const vals = []
  for (let h = -2000; h <= 80000; h += 400) {
    alts.push(h)
    vals.push(propFn(h))
  }
  return { alts, vals }
}

function getLayerBoundaries() {
  return TEMPERATURE_LAYERS.map(l => l.H)
}

// Property configs for compare mode
const COMPARE_PROPS = {
  temperature: { label: 'Temperature', unit: 'K', fn: (isa, h) => isa.temperatureFromGeopotential(h), color: '#ef4444' },
  pressure: { label: 'Pressure', unit: 'Pa', fn: (isa, h) => isa.pressureFromGeopotential(h), color: '#2c84bf' },
  density: { label: 'Density', unit: 'kg/m³', fn: (isa, h) => isa.densityFromGeopotential(h), color: '#10b981' },
  speedOfSound: { label: 'Speed of Sound', unit: 'm/s', fn: (isa, h) => isa.speedOfSound(h), color: '#f59e0b' },
}

function renderChart() {
  if (!containerRef.value || !Chart) return

  const isa = new IsaAlgorithms()
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark'
  const gridColor = isDark ? 'rgba(122,186,229,0.15)' : 'rgba(44,132,191,0.1)'
  const textColor = isDark ? '#a8d2ec' : '#64748b'

  // Compare mode: overlay multiple properties
  if (chartType.value === 'compare') {
    renderCompareChart(isa, isDark, gridColor, textColor)
    return
  }

  let data, yLabel, isLog

  switch (chartType.value) {
    case 'temperature':
      data = generateData(isa, h => isa.temperatureFromGeopotential(h))
      yLabel = 'Temperature (K)'
      isLog = false
      break
    case 'pressure':
      data = generateData(isa, h => isa.pressureFromGeopotential(h))
      yLabel = 'Pressure (Pa)'
      isLog = true
      break
    case 'density':
      data = generateData(isa, h => isa.densityFromGeopotential(h))
      yLabel = 'Density (kg/m³)'
      isLog = true
      break
    case 'speedOfSound':
      data = generateData(isa, h => isa.speedOfSound(h))
      yLabel = 'Speed of Sound (m/s)'
      isLog = false
      break
  }

  const isGeometric = altType.value === 'h'
  const altLabel = isGeometric ? 'h' : 'H'
  const xLabel = altUnit.value === 'm' ? `${altLabel} (m)` : `${altLabel} (ft)`
  const toDisplayAlt = (h) => {
    const val = isGeometric && h > 0 ? R * h / (R - h) : h
    return altUnit.value === 'm' ? val : val * 3.280839895
  }
  const altitudes = data.alts.map(toDisplayAlt)
  const currentAlt = toDisplayAlt(props.altitude ?? -2000)

  const layerAlts = getLayerBoundaries().map(toDisplayAlt)

  const isaAlt = props.altitude ?? -2000
  let currentVal
  switch (chartType.value) {
    case 'temperature': currentVal = isa.temperatureFromGeopotential(isaAlt); break
    case 'pressure': currentVal = isa.pressureFromGeopotential(isaAlt); break
    case 'density': currentVal = isa.densityFromGeopotential(isaAlt); break
    case 'speedOfSound': currentVal = isa.speedOfSound(isaAlt); break
  }

  const datasets = [
    {
      label: yLabel,
      data: altitudes.map((a, i) => ({ x: a, y: data.vals[i] })),
      borderColor: '#2c84bf',
      backgroundColor: 'rgba(44,132,191,0.1)',
      borderWidth: 2,
      fill: true,
      pointRadius: 0,
      tension: 0.1,
      showLine: true,
    },
    {
      label: 'Current',
      data: [{ x: currentAlt, y: currentVal }],
      borderColor: '#f59e0b',
      backgroundColor: '#f59e0b',
      pointRadius: 6,
      pointHoverRadius: 8,
      showLine: false,
    }
  ]

  const layerPlugin = {
    id: 'layerLines',
    afterDraw(chart) {
      const ctx = chart.ctx
      const xScale = chart.scales.x
      const yScale = chart.scales.y
      layerAlts.forEach(alt => {
        const x = xScale.getPixelForValue(alt)
        if (x < xScale.left || x > xScale.right) return
        ctx.save()
        ctx.strokeStyle = 'rgba(122,186,229,0.3)'
        ctx.lineWidth = 1
        ctx.setLineDash([4, 4])
        ctx.beginPath()
        ctx.moveTo(x, yScale.top)
        ctx.lineTo(x, yScale.bottom)
        ctx.stroke()
        ctx.restore()
      })
    }
  }

  const config = {
    type: 'scatter',
    data: { datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 300 },
      scales: {
        x: {
          type: 'linear',
          title: { display: true, text: xLabel, color: textColor },
          grid: { color: gridColor },
          ticks: { color: textColor }
        },
        y: {
          type: isLog ? 'logarithmic' : 'linear',
          title: { display: true, text: yLabel, color: textColor },
          grid: { color: gridColor },
          ticks: { color: textColor }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: isDark ? '#1a2c3e' : '#0f172a',
          titleColor: '#fff',
          bodyColor: '#e2e8f0',
          borderColor: 'rgba(44,132,191,0.3)',
          borderWidth: 1,
          callbacks: {
            label: (ctx) => {
              return `${ctx.parsed.x.toLocaleString()} → ${ctx.parsed.y.toExponential(4)}`
            }
          }
        }
      }
    },
    plugins: [layerPlugin]
  }

  if (chartInstance) {
    chartInstance.destroy()
  }
  chartInstance = new Chart(containerRef.value, config)
}

function renderCompareChart(isa, isDark, gridColor, textColor) {
  const isGeometric = altType.value === 'h'
  const altLabel = isGeometric ? 'h' : 'H'
  const xLabel = altUnit.value === 'm' ? `${altLabel} (m)` : `${altLabel} (ft)`
  const toDisplayAlt = (h) => {
    const val = isGeometric && h > 0 ? R * h / (R - h) : h
    return altUnit.value === 'm' ? val : val * 3.280839895
  }
  const currentAlt = toDisplayAlt(props.altitude ?? -2000)
  const isaAlt = props.altitude ?? -2000

  const selected = [...compareSelected.value]
  if (selected.length === 0) {
    if (chartInstance) chartInstance.destroy()
    return
  }

  // Generate normalized data: each property scaled to 0-1 for overlay
  const allData = {}
  const ranges = {}
  for (const key of selected) {
    const rawData = generateData(isa, h => COMPARE_PROPS[key].fn(isa, h))
    const vals = rawData.vals
    const min = Math.min(...vals)
    const max = Math.max(...vals)
    const range = max - min || 1
    ranges[key] = { min, max, range }
    allData[key] = {
      alts: rawData.alts.map(toDisplayAlt),
      vals,
      normalized: vals.map(v => ((v - min) / range) * 100) // 0-100 scale
    }
  }

  // Use first selected property's altitude array
  const altitudes = allData[selected[0]].alts

  const layerAlts = getLayerBoundaries().map(toDisplayAlt)

  const datasets = selected.map(key => {
    const prop = COMPARE_PROPS[key]
    const d = allData[key]
    return {
      label: `${prop.label} (${prop.unit})`,
      data: altitudes.map((a, i) => ({ x: a, y: d.vals[i] })),
      borderColor: prop.color,
      backgroundColor: 'transparent',
      borderWidth: 2,
      pointRadius: 0,
      tension: 0.1,
      showLine: true,
      yAxisID: key === selected[0] ? 'y' : (selected.length <= 2 ? 'y1' : 'y'),
    }
  })

  // Add current altitude markers for each property
  for (const key of selected) {
    const prop = COMPARE_PROPS[key]
    const val = COMPARE_PROPS[key].fn(isa, isaAlt)
    datasets.push({
      label: `${prop.label} (current)`,
      data: [{ x: currentAlt, y: val }],
      borderColor: prop.color,
      backgroundColor: prop.color,
      pointRadius: 6,
      pointHoverRadius: 8,
      showLine: false,
      yAxisID: key === selected[0] ? 'y' : (selected.length <= 2 ? 'y1' : 'y'),
    })
  }

  const layerPlugin = {
    id: 'layerLinesCompare',
    afterDraw(chart) {
      const ctx = chart.ctx
      const xScale = chart.scales.x
      const yScale = chart.scales.y
      layerAlts.forEach(alt => {
        const x = xScale.getPixelForValue(alt)
        if (x < xScale.left || x > xScale.right) return
        ctx.save()
        ctx.strokeStyle = 'rgba(122,186,229,0.3)'
        ctx.lineWidth = 1
        ctx.setLineDash([4, 4])
        ctx.beginPath()
        ctx.moveTo(x, yScale.top)
        ctx.lineTo(x, yScale.bottom)
        ctx.stroke()
        ctx.restore()
      })
    }
  }

  // Build Y-axes: depends on number of selected properties
  let scales, tooltipCallbacks

  if (selected.length <= 2) {
    // 1-2 properties: raw values with dual Y axes
    scales = {
      x: {
        type: 'linear',
        title: { display: true, text: xLabel, color: textColor },
        grid: { color: gridColor },
        ticks: { color: textColor }
      },
      y: {
        type: 'linear',
        position: 'left',
        title: {
          display: true,
          text: `${COMPARE_PROPS[selected[0]].label} (${COMPARE_PROPS[selected[0]].unit})`,
          color: COMPARE_PROPS[selected[0]].color
        },
        grid: { color: gridColor },
        ticks: { color: COMPARE_PROPS[selected[0]].color }
      }
    }

    if (selected.length === 2) {
      scales.y1 = {
        type: 'linear',
        position: 'right',
        title: {
          display: true,
          text: `${COMPARE_PROPS[selected[1]].label} (${COMPARE_PROPS[selected[1]].unit})`,
          color: COMPARE_PROPS[selected[1]].color
        },
        grid: { drawOnChartArea: false },
        ticks: { color: COMPARE_PROPS[selected[1]].color }
      }
    }

    tooltipCallbacks = {
      label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y.toExponential(4)}`
    }
  } else {
    // 3+ properties: normalized 0-100% scale
    scales = {
      x: {
        type: 'linear',
        title: { display: true, text: xLabel, color: textColor },
        grid: { color: gridColor },
        ticks: { color: textColor }
      },
      y: {
        type: 'linear',
        position: 'left',
        title: { display: true, text: 'Normalized (% of range)', color: textColor },
        grid: { color: gridColor },
        ticks: { color: textColor },
        min: 0,
        max: 100,
      }
    }

    // Rebuild datasets with normalized values
    datasets.length = 0
    for (const key of selected) {
      const prop = COMPARE_PROPS[key]
      const d = allData[key]
      datasets.push({
        label: `${prop.label} (${prop.unit})`,
        data: altitudes.map((a, i) => ({ x: a, y: d.normalized[i] })),
        borderColor: prop.color,
        backgroundColor: 'transparent',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.1,
        showLine: true,
        yAxisID: 'y',
      })
    }

    // Current altitude markers (normalized)
    for (const key of selected) {
      const prop = COMPARE_PROPS[key]
      const r = ranges[key]
      const rawVal = COMPARE_PROPS[key].fn(isa, isaAlt)
      const normVal = ((rawVal - r.min) / r.range) * 100
      datasets.push({
        label: `${prop.label} (current)`,
        data: [{ x: currentAlt, y: normVal }],
        borderColor: prop.color,
        backgroundColor: prop.color,
        pointRadius: 6,
        pointHoverRadius: 8,
        showLine: false,
        yAxisID: 'y',
      })
    }

    tooltipCallbacks = {
      label: (ctx) => {
        const idx = ctx.dataIndex
        const key = selected[ctx.datasetIndex]
        if (!key || !allData[key]) return ''
        const rawVal = allData[key].vals[idx]
        return `${ctx.dataset.label}: ${rawVal.toExponential(4)}`
      }
    }
  }

  const config = {
    type: 'scatter',
    data: { datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 300 },
      scales,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            color: textColor,
            usePointStyle: true,
            filter: (item) => !item.text.includes('(current)')
          }
        },
        tooltip: {
          backgroundColor: isDark ? '#1a2c3e' : '#0f172a',
          titleColor: '#fff',
          bodyColor: '#e2e8f0',
          borderColor: 'rgba(44,132,191,0.3)',
          borderWidth: 1,
          mode: 'index',
          intersect: false,
          callbacks: tooltipCallbacks
        }
      }
    },
    plugins: [layerPlugin]
  }

  if (chartInstance) {
    chartInstance.destroy()
  }
  chartInstance = new Chart(containerRef.value, config)
}

function toggleCompareProp(key) {
  const s = new Set(compareSelected.value)
  if (s.has(key)) {
    if (s.size > 1) s.delete(key)
  } else {
    s.add(key)
  }
  compareSelected.value = s
  renderChart()
}

watch([chartType, altUnit, altType, () => props.altitude], () => {
  renderChart()
})

// Compare mode checkbox changes trigger re-render via toggleCompareProp directly

onMounted(async () => {
  try {
    // Use chart.js/auto which auto-registers all components
    const chartModule = await import('chart.js/auto')
    Chart = chartModule.Chart
    renderChart()
  } catch (e) {
    console.warn('Chart.js not available:', e)
  }
})

onUnmounted(() => {
  if (chartInstance) chartInstance.destroy()
})
</script>

<template>
  <div class="chart-section">
    <div class="chart-type-tabs">
      <button
        v-for="ct in chartTypes"
        :key="ct.key"
        class="chart-type-tab"
        :class="{ active: chartType === ct.key }"
        @click="chartType = ct.key"
      >{{ ct.label }}</button>
    </div>
    <div class="chart-controls">
      <label>
        Altitude type:
        <select v-model="altType">
          <option value="H">H — Geopotential</option>
          <option value="h">h — Geometric</option>
        </select>
      </label>
      <label>
        Unit:
        <select v-model="altUnit">
          <option value="m">meters</option>
          <option value="ft">feet</option>
        </select>
      </label>
    </div>
    <div v-if="chartType === 'compare'" class="compare-controls">
      <span class="compare-label">Properties:</span>
      <label v-for="(prop, key) in COMPARE_PROPS" :key="key" class="compare-checkbox" :style="{ '--prop-color': prop.color }">
        <input
          type="checkbox"
          :checked="compareSelected.has(key)"
          @change="toggleCompareProp(key)"
        />
        <span class="compare-swatch" :style="{ background: prop.color }"></span>
        {{ prop.label }}
      </label>
    </div>
    <div class="chart-canvas-wrapper">
      <canvas ref="containerRef"></canvas>
    </div>
  </div>
</template>
