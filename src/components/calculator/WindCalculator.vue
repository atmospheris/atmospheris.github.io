<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { computeWindDerived, ricePdf, riceCdf } from 'atmospheris'

const vx = ref(-3.9)
const vy = ref(-1.2)
const sigmaR = ref(5.9)
const useAbsoluteVx = ref(false)

const copied = ref(false)
const toastMsg = ref('')
const toastVisible = ref(false)

// Wind presets from ISO 5878 observed data
const presets = [
  { label: 'Tropical 1km', vx: -3.9, vy: -1.2, sigmaR: 5.9, zone: '0-20°N' },
  { label: 'Subtropical Jan 5km', vx: -1.6, vy: 0, sigmaR: 11.5, zone: '20-40°N' },
  { label: 'Mid-lat Jan 10km', vx: -14.0, vy: 0, sigmaR: 10.1, zone: '40-60°N' },
  { label: 'Subarctic Jul 10km', vx: -4.6, vy: 0, sigmaR: 7.5, zone: '60-80°N' },
  { label: 'Light wind', vx: 1.0, vy: 0.5, sigmaR: 2.0, zone: 'Custom' },
  { label: 'Strong wind', vx: -25.0, vy: 5.0, sigmaR: 15.0, zone: 'Custom' },
]

const windResult = computed(() => {
  try {
    return computeWindDerived(vx.value, vy.value, sigmaR.value, {
      useAbsoluteVx: useAbsoluteVx.value
    })
  } catch {
    return null
  }
})

function fmt(v) {
  if (v == null || !isFinite(v)) return '—'
  const abs = Math.abs(v)
  if (abs === 0) return '0'
  if (abs >= 100) return v.toFixed(1)
  if (abs >= 1) return v.toFixed(2)
  return v.toFixed(3)
}

function setPreset(p) {
  vx.value = p.vx
  vy.value = p.vy
  sigmaR.value = p.sigmaR
  useAbsoluteVx.value = p.zone !== '0-20°N'
}

function showToast(msg) {
  toastMsg.value = msg
  toastVisible.value = true
  setTimeout(() => { toastVisible.value = false }, 2000)
}

function copyResults() {
  if (!windResult.value) return
  const w = windResult.value
  const lines = [
    `Wind Distribution (ISO 5878 Rice Model)`,
    `Input: Vx=${vx.value} m/s, Vy=${vy.value} m/s, σr=${sigmaR.value} m/s`,
    `---`,
    `Vr (vector mean): ${fmt(w.Vr)} m/s`,
    `σ (per-component): ${fmt(w.sigma)} m/s`,
    `Vsc (scalar mean): ${fmt(w.Vsc)} m/s`,
    `---`,
    `Percentiles:`,
    `  1%:  ${fmt(w.percentiles['1'].low)} m/s`,
    `  10%: ${fmt(w.percentiles['10'].low)} m/s`,
    `  20%: ${fmt(w.percentiles['20'].low)} m/s`,
    `  80%: ${fmt(w.percentiles['20'].high)} m/s`,
    `  90%: ${fmt(w.percentiles['10'].high)} m/s`,
    `  99%: ${fmt(w.percentiles['1'].high)} m/s`,
  ]
  navigator.clipboard.writeText(lines.join('\n')).then(() => showToast('Results copied'))
}

// --- PDF Chart ---
const chartRef = ref(null)
let chartInstance = null
let Chart = null

function renderPdfChart() {
  if (!chartRef.value || !Chart || !windResult.value) return

  const w = windResult.value
  const vr = w.Vr
  const sr = sigmaR.value

  // Determine chart range: 0 to 99th percentile + margin
  const maxSpeed = w.percentiles['1'].high * 1.2
  const points = 120
  const pdfData = []
  const cdfData = []

  for (let i = 0; i <= points; i++) {
    const v = (maxSpeed * i) / points
    pdfData.push({ x: v, y: ricePdf(v, vr, sr) })
    cdfData.push({ x: v, y: riceCdf(v, vr, sr) })
  }

  // Percentile markers
  const percentileData = [
    { x: w.percentiles['1'].low, label: '1%' },
    { x: w.percentiles['10'].low, label: '10%' },
    { x: w.percentiles['20'].low, label: '20%' },
    { x: w.percentiles['20'].high, label: '80%' },
    { x: w.percentiles['10'].high, label: '90%' },
    { x: w.percentiles['1'].high, label: '99%' },
  ].filter(p => p.x > 0 && p.x < maxSpeed)

  const meanData = [{ x: w.Vsc, y: ricePdf(w.Vsc, vr, sr) }]

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark'
  const gridColor = isDark ? 'rgba(122,186,229,0.15)' : 'rgba(44,132,191,0.1)'
  const textColor = isDark ? '#a8d2ec' : '#64748b'

  // Percentile line plugin
  const percentilePlugin = {
    id: 'percentileLines',
    afterDraw(chart) {
      const ctx = chart.ctx
      const xScale = chart.scales.x
      const yScale = chart.scales.y
      percentileData.forEach(p => {
        const x = xScale.getPixelForValue(p.x)
        if (x < xScale.left || x > xScale.right) return
        ctx.save()
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)'
        ctx.lineWidth = 1
        ctx.setLineDash([4, 4])
        ctx.beginPath()
        ctx.moveTo(x, yScale.top)
        ctx.lineTo(x, yScale.bottom)
        ctx.stroke()
        ctx.fillStyle = 'rgba(245, 158, 11, 0.7)'
        ctx.font = '10px monospace'
        ctx.textAlign = 'center'
        ctx.fillText(p.label, x, yScale.top - 4)
        ctx.restore()
      })
    }
  }

  const config = {
    type: 'scatter',
    data: {
      datasets: [
        {
          label: 'PDF f(ν)',
          data: pdfData,
          borderColor: '#2c84bf',
          backgroundColor: 'rgba(44,132,191,0.08)',
          borderWidth: 2,
          fill: true,
          pointRadius: 0,
          tension: 0.3,
          showLine: true,
        },
        {
          label: 'CDF F(ν)',
          data: cdfData,
          borderColor: '#10b981',
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderDash: [6, 3],
          fill: false,
          pointRadius: 0,
          tension: 0.3,
          showLine: true,
          yAxisID: 'y1',
        },
        {
          label: `Vsc = ${fmt(w.Vsc)} m/s`,
          data: meanData,
          borderColor: '#ef4444',
          backgroundColor: '#ef4444',
          pointRadius: 7,
          pointHoverRadius: 9,
          showLine: false,
        },
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 400 },
      scales: {
        x: {
          type: 'linear',
          title: { display: true, text: 'Wind speed ν (m/s)', color: textColor },
          grid: { color: gridColor },
          ticks: { color: textColor },
          min: 0,
        },
        y: {
          type: 'linear',
          position: 'left',
          title: { display: true, text: 'PDF f(ν)', color: textColor },
          grid: { color: gridColor },
          ticks: { color: textColor },
          min: 0,
        },
        y1: {
          type: 'linear',
          position: 'right',
          title: { display: true, text: 'CDF F(ν)', color: '#10b981' },
          grid: { drawOnChartArea: false },
          ticks: { color: '#10b981' },
          min: 0,
          max: 1,
        }
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            color: textColor,
            usePointStyle: true,
            font: { size: 11 },
          }
        },
        tooltip: {
          backgroundColor: isDark ? '#1a2c3e' : '#0f172a',
          titleColor: '#fff',
          bodyColor: '#e2e8f0',
          borderColor: 'rgba(44,132,191,0.3)',
          borderWidth: 1,
          callbacks: {
            label: (ctx) => {
              if (ctx.datasetIndex === 1) return `CDF: ${ctx.parsed.y.toFixed(4)}`
              return `ν=${ctx.parsed.x.toFixed(1)} m/s → f=${ctx.parsed.y.toFixed(4)}`
            }
          }
        }
      }
    },
    plugins: [percentilePlugin]
  }

  if (chartInstance) chartInstance.destroy()
  chartInstance = new Chart(chartRef.value, config)
}

watch([vx, vy, sigmaR, useAbsoluteVx], () => {
  renderPdfChart()
})

onMounted(async () => {
  try {
    const chartModule = await import('chart.js/auto')
    Chart = chartModule.Chart
    renderPdfChart()
  } catch (e) {
    console.warn('Chart.js not available:', e)
  }
})

onUnmounted(() => {
  if (chartInstance) chartInstance.destroy()
})
</script>

<template>
  <div class="wind-calc">
    <div class="wind-calc-layout">
      <!-- Input Panel -->
      <div class="wind-input-panel">
        <div class="wind-input-section">
          <h3 class="wind-section-label">Wind Components</h3>

          <div class="input-group">
            <label>V<sub>x</sub> — Zonal wind (m/s)</label>
            <input type="number" v-model.number="vx" step="0.1" @input="renderPdfChart" />
          </div>

          <div class="input-group">
            <label>V<sub>y</sub> — Meridional wind (m/s)</label>
            <input type="number" v-model.number="vy" step="0.1" @input="renderPdfChart" />
          </div>

          <div class="input-group">
            <label>σ<sub>r</sub> — Std deviation (m/s)</label>
            <input type="number" v-model.number="sigmaR" step="0.1" min="0.1" @input="renderPdfChart" />
          </div>

          <label class="wind-checkbox">
            <input type="checkbox" v-model="useAbsoluteVx" @change="renderPdfChart" />
            <span>Use |V<sub>x</sub>| for V<sub>r</sub> (zones &gt; 20°N)</span>
          </label>
        </div>

        <!-- Presets -->
        <div class="wind-presets-section">
          <h3 class="wind-section-label">Presets <span class="wind-presets-subtitle">(ISO 5878 data)</span></h3>
          <div class="wind-preset-grid">
            <button
              v-for="p in presets"
              :key="p.label"
              class="wind-preset-btn"
              :class="{ active: vx === p.vx && vy === p.vy && sigmaR === p.sigmaR }"
              @click="setPreset(p)"
            >
              <span class="wind-preset-name">{{ p.label }}</span>
              <span class="wind-preset-zone">{{ p.zone }}</span>
            </button>
          </div>
        </div>

        <hr class="calc-divider" />

        <div class="wind-actions">
          <button @click="copyResults">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
            Copy Results
          </button>
        </div>
      </div>

      <!-- Results Panel -->
      <div class="wind-results-panel" v-if="windResult">
        <!-- Summary Stats -->
        <div class="wind-summary">
          <div class="wind-stat-card">
            <span class="wind-stat-label">V<sub>r</sub> Vector Mean</span>
            <span class="wind-stat-value">{{ fmt(windResult.Vr) }} <span class="wind-stat-unit">m/s</span></span>
          </div>
          <div class="wind-stat-card wind-stat-highlight">
            <span class="wind-stat-label">V<sub>sc</sub> Scalar Mean</span>
            <span class="wind-stat-value">{{ fmt(windResult.Vsc) }} <span class="wind-stat-unit">m/s</span></span>
          </div>
          <div class="wind-stat-card">
            <span class="wind-stat-label">σ Component Std Dev</span>
            <span class="wind-stat-value">{{ fmt(windResult.sigma) }} <span class="wind-stat-unit">m/s</span></span>
          </div>
        </div>

        <!-- Percentile Table -->
        <div class="wind-pct-section">
          <h3 class="wind-section-label">Percentile Wind Speeds</h3>
          <table class="results-table wind-pct-table">
            <thead>
              <tr>
                <th>Percentile</th>
                <th class="text-right">Speed (m/s)</th>
                <th class="text-right">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="property-name">1st percentile</td>
                <td class="property-value">{{ fmt(windResult.percentiles['1'].low) }}</td>
                <td class="pct-desc">Exceeded on 99% of occasions</td>
              </tr>
              <tr>
                <td class="property-name">10th percentile</td>
                <td class="property-value">{{ fmt(windResult.percentiles['10'].low) }}</td>
                <td class="pct-desc">Exceeded on 90% of occasions</td>
              </tr>
              <tr>
                <td class="property-name">20th percentile</td>
                <td class="property-value">{{ fmt(windResult.percentiles['20'].low) }}</td>
                <td class="pct-desc">Exceeded on 80% of occasions</td>
              </tr>
              <tr class="pct-mid-row">
                <td class="property-name">Scalar mean</td>
                <td class="property-value">{{ fmt(windResult.Vsc) }}</td>
                <td class="pct-desc">Expected speed V<sub>sc</sub></td>
              </tr>
              <tr>
                <td class="property-name">80th percentile</td>
                <td class="property-value">{{ fmt(windResult.percentiles['20'].high) }}</td>
                <td class="pct-desc">Not exceeded on 80% of occasions</td>
              </tr>
              <tr>
                <td class="property-name">90th percentile</td>
                <td class="property-value">{{ fmt(windResult.percentiles['10'].high) }}</td>
                <td class="pct-desc">Not exceeded on 90% of occasions</td>
              </tr>
              <tr>
                <td class="property-name">99th percentile</td>
                <td class="property-value">{{ fmt(windResult.percentiles['1'].high) }}</td>
                <td class="pct-desc">Not exceeded on 99% of occasions</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- PDF/CDF Chart -->
        <div class="wind-chart-section">
          <h3 class="wind-section-label">Rice Distribution</h3>
          <div class="wind-chart-wrapper">
            <canvas ref="chartRef"></canvas>
          </div>
          <p class="wind-chart-caption">
            PDF (solid blue) and CDF (dashed green) of the Rice distribution for V<sub>r</sub> = {{ fmt(windResult.Vr) }} m/s,
            σ<sub>r</sub> = {{ fmt(sigmaR) }} m/s. Red dot marks V<sub>sc</sub>.
            Dashed orange lines indicate percentile boundaries.
          </p>
        </div>
      </div>
    </div>

    <p class="wind-standards-note">
      Wind distribution calculated using the circular normal (Rice) distribution per
      <router-link to="/iso-5878">ISO 5878</router-link> Section 5.4.
      See the <router-link to="/api/js">API docs</router-link> for the
      <code>computeWindDerived</code> API.
    </p>
  </div>

  <div class="toast" :class="{ show: toastVisible }">{{ toastMsg }}</div>
</template>

<style scoped>
.wind-calc {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-glass);
}

.wind-calc-layout {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: var(--spacing-2xl);
}

/* --- Input Panel --- */
.wind-input-panel {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.wind-section-label {
  font-family: var(--font-display);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-accent);
  margin-bottom: var(--spacing-md);
}

.wind-presets-subtitle {
  color: var(--color-text-light);
  font-weight: var(--font-weight-normal);
  text-transform: none;
  letter-spacing: 0;
}

.wind-checkbox {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  cursor: pointer;
  padding-top: var(--spacing-sm);
}

.wind-checkbox input[type="checkbox"] {
  width: 1rem;
  height: 1rem;
  accent-color: var(--color-accent);
  flex-shrink: 0;
}

.wind-preset-grid {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.wind-preset-btn {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
  text-align: left;
  position: relative;
  overflow: hidden;
}

.wind-preset-btn::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: transparent;
  transition: background var(--transition-fast);
}

.wind-preset-btn:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.wind-preset-btn:hover::before {
  background: var(--color-accent);
}

.wind-preset-btn.active {
  background: var(--color-accent-subtle);
  border-color: var(--color-accent);
  color: var(--color-accent-dark);
}

.wind-preset-btn.active::before {
  background: var(--color-accent);
}

.wind-preset-name {
  font-weight: var(--font-weight-medium);
}

.wind-preset-zone {
  font-size: var(--font-size-xs);
  color: var(--color-text-light);
  font-family: var(--font-mono);
}

.wind-actions {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.wind-actions button {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  color: var(--color-text-light);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.wind-actions button:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

/* --- Results Panel --- */
.wind-results-panel {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.wind-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-md);
}

.wind-stat-card {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  padding: var(--spacing-md);
  background: var(--color-surface-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  position: relative;
  overflow: hidden;
}

.wind-stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--color-accent-subtle);
}

.wind-stat-highlight::before {
  background: linear-gradient(90deg, var(--color-accent), var(--color-accent-light));
}

.wind-stat-highlight {
  background: color-mix(in srgb, var(--color-accent) 4%, var(--color-surface-elevated));
}

.wind-stat-label {
  font-family: var(--font-display);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-text-light);
}

.wind-stat-value {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  font-family: var(--font-mono);
  color: var(--color-primary);
  line-height: 1.1;
}

.wind-stat-highlight .wind-stat-value {
  color: var(--color-accent-dark);
}

.wind-stat-unit {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-normal);
  color: var(--color-text-light);
}

/* Percentile table */
.wind-pct-section {
  background: var(--color-surface-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
}

.wind-pct-table {
  margin-top: var(--spacing-sm);
}

.pct-desc {
  font-size: var(--font-size-xs);
  color: var(--color-text-light);
  font-style: italic;
  padding-left: var(--spacing-md);
}

.pct-mid-row {
  background: color-mix(in srgb, var(--color-accent) 6%, transparent);
}

.pct-mid-row td {
  font-weight: var(--font-weight-semibold);
}

/* Chart */
.wind-chart-section {
  background: var(--color-surface-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  position: relative;
}

.wind-chart-section::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: var(--radius-lg);
  pointer-events: none;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

[data-theme="dark"] .wind-chart-section::after {
  box-shadow: inset 0 1px 0 rgba(122, 186, 229, 0.05);
}

.wind-chart-wrapper {
  position: relative;
  width: 100%;
  height: 300px;
}

.wind-chart-wrapper canvas {
  width: 100% !important;
  height: 100% !important;
}

.wind-chart-caption {
  margin-top: var(--spacing-md);
  font-size: var(--font-size-xs);
  color: var(--color-text-light);
  line-height: var(--line-height-relaxed);
}

.wind-standards-note {
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--color-border);
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  line-height: var(--line-height-relaxed);
}

.wind-standards-note code {
  background: var(--color-surface-elevated);
  padding: 0.15em 0.4em;
  border-radius: 3px;
  font-size: 0.9em;
}

/* Responsive */
@media (max-width: 1024px) {
  .wind-calc-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .wind-summary {
    grid-template-columns: 1fr;
  }

  .wind-stat-value {
    font-size: var(--font-size-xl);
  }
}
</style>
