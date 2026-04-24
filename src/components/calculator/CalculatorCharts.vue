<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { IsaAlgorithms, TEMPERATURE_LAYERS } from 'atmospheris'

const props = defineProps({
  altitude: { type: Number, default: 0 }
})

const chartType = ref('temperature')
const altUnit = ref('m')
const containerRef = ref(null)

let chartInstance = null
let Chart = null

const chartTypes = [
  { key: 'temperature', label: 'Temperature' },
  { key: 'pressure', label: 'Pressure' },
  { key: 'density', label: 'Density' },
  { key: 'speedOfSound', label: 'Speed of Sound' },
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

function renderChart() {
  if (!containerRef.value || !Chart) return

  const isa = new IsaAlgorithms()
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

  const xLabel = altUnit.value === 'm' ? 'Altitude (m)' : 'Altitude (ft)'
  const altitudes = altUnit.value === 'm' ? data.alts : data.alts.map(a => a * 3.280839895)
  const currentAlt = altUnit.value === 'm' ? (props.altitude || 0) : (props.altitude || 0) * 3.280839895

  const layerAlts = altUnit.value === 'm'
    ? getLayerBoundaries()
    : getLayerBoundaries().map(a => a * 3.280839895)

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark'
  const gridColor = isDark ? 'rgba(129,140,248,0.15)' : 'rgba(99,102,241,0.1)'
  const textColor = isDark ? '#a5b4fc' : '#64748b'

  const isaAlt = props.altitude || 0
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
      borderColor: '#6366f1',
      backgroundColor: 'rgba(99,102,241,0.1)',
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
        ctx.strokeStyle = 'rgba(129,140,248,0.3)'
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
          backgroundColor: isDark ? '#1e1b4b' : '#0f172a',
          titleColor: '#fff',
          bodyColor: '#e2e8f0',
          borderColor: 'rgba(99,102,241,0.3)',
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

watch([chartType, altUnit, () => props.altitude], () => {
  renderChart()
})

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
        Altitude unit:
        <select v-model="altUnit">
          <option value="m">meters</option>
          <option value="ft">feet</option>
        </select>
      </label>
    </div>
    <div class="chart-canvas-wrapper">
      <canvas ref="containerRef"></canvas>
    </div>
  </div>
</template>
