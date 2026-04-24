<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  result: { type: Object, default: null },
  mode: { type: String, default: 'altitude' }
})

const copied = ref(false)
const toastMsg = ref('')
const toastVisible = ref(false)
const collapsedGroups = ref(new Set())
const globalUnitSystem = ref('metric') // 'metric' | 'imperial'

// Per-row unit toggles state: key → unit key
const unitToggles = ref({})

function getUnitToggle(key, options) {
  if (globalUnitSystem.value === 'imperial' && options) {
    // Auto-select first imperial-compatible option when in imperial mode
    const imperialDefault = options.find(u => u !== options[0])
    return unitToggles.value[key] || imperialDefault || options[0]
  }
  return unitToggles.value[key] || options[0]
}

function setUnitToggle(key, unit) {
  unitToggles.value[key] = unit
}

function setGlobalUnit(system) {
  globalUnitSystem.value = system
  // Reset per-row toggles so they auto-resolve
  unitToggles.value = {}
}

// Imperial conversion factors (multiply metric base value)
const IMPERIAL = {
  // density: kg/m³ → slugs/ft³
  density: { 'kg/m³': 1, 'slugs/ft³': 1.9403203e-3 },
  // dynamic viscosity: Pa·s → lbf·s/ft²
  dynamicViscosity: { 'Pa·s': 1, 'lbf·s/ft²': 2.0885434e-2 },
  // kinematic viscosity: m²/s → ft²/s
  kinematicViscosity: { 'm²/s': 1, 'ft²/s': 1 / 0.09290304 },
  // speed of sound: m/s → ft/s, knots
  speedOfSound: { 'm/s': 1, 'ft/s': 1 / 0.3048, 'knots': 1.9438445 },
  // mean particle speed: m/s → ft/s, knots
  meanParticleSpeed: { 'm/s': 1, 'ft/s': 1 / 0.3048, 'knots': 1.9438445 },
  // gravity: m/s² → ft/s²
  gravity: { 'm/s²': 1, 'ft/s²': 1 / 0.3048 },
  // specific weight: N/m³ → lbf/ft³
  specificWeight: { 'N/m³': 1, 'lbf/ft³': 6.365880e-2 },
  // thermal conductivity: W/(m·K) → BTU/(hr·ft·°F)
  thermalConductivity: { 'W/(m·K)': 1, 'BTU/(hr·ft·°F)': 0.5778 },
  // pressure scale height: m → ft, nmi
  pressureScaleHeight: { 'm': 1, 'ft': 1 / 0.3048, 'nmi': 5.3996e-4 },
  // mean free path: m → ft, nmi
  meanFreePath: { 'm': 1, 'ft': 1 / 0.3048, 'nmi': 5.3996e-4 },
}

function getConversionFactor(row) {
  if (!row.unitOptions) return 1
  const current = getUnitToggle(row.key, row.unitOptions)
  const conv = IMPERIAL[row.key]
  if (!conv) return 1
  return conv[current] ?? 1
}

const rows = computed(() => {
  if (!props.result) return []
  const r = props.result

  if (props.mode === 'pressure') {
    return [
      { group: 'Altitude', rows: [
        { name: 'Geopotential Altitude', symbol: '<math><mi>H</mi></math>', key: 'geo_m', value: r.geopotentialAltitude.meters, unit: 'm', unitOptions: null },
        { name: 'Geometric Altitude', symbol: '<math><mi>h</mi></math>', key: 'geom_m', value: r.geometricAltitude.meters, unit: 'm', unitOptions: null },
      ]},
      { group: 'Pressure', rows: [
        { name: 'Pressure', symbol: '<math><mi>p</mi></math>', key: 'p_mbar', value: r.pressure.mbar, unit: 'mbar', unitOptions: null },
      ]}
    ]
  }

  return [
    { group: 'Altitude', rows: [
      { name: 'Geopotential Altitude', symbol: '<math><mi>H</mi></math>', key: 'geo', value: r.geopotentialAltitude, unitOptions: ['m', 'ft'], unitMap: { m: 'meters', ft: 'feet' } },
      { name: 'Geometric Altitude', symbol: '<math><mi>h</mi></math>', key: 'geom', value: r.geometricAltitude, unitOptions: ['m', 'ft'], unitMap: { m: 'meters', ft: 'feet' } },
    ]},
    { group: 'Temperature', rows: [
      { name: 'Temperature', symbol: '<math><mi>T</mi></math>', key: 'temp', value: r.temperature, unitOptions: ['K', '°C', '°F', '°R'], unitMap: { K: 'kelvin', '°C': 'celsius', '°F': 'fahrenheit', '°R': 'rankine' } },
      { name: 'Temperature Ratio', symbol: '<math><mi>θ</mi></math>', key: 'tratio', value: r.temperatureRatio, unit: '', unitOptions: null },
      { name: 'Molecular Temperature', symbol: '<math><msub><mi>T</mi><mi>M</mi></msub></math>', key: 'tmol', value: r.molecularTemperature, unit: 'K', unitOptions: null },
      { name: 'Lapse Rate', symbol: '<math><msub><mi>β</mi><mi>s</mi></msub></math>', key: 'lr', value: r.lapseRate, unit: 'K/m', unitOptions: null },
    ]},
    { group: 'Pressure', rows: [
      { name: 'Pressure', symbol: '<math><mi>p</mi></math>', key: 'pres', value: r.pressure, unitOptions: ['Pa', 'mbar', 'mmHg'], unitMap: { Pa: 'pascal', mbar: 'mbar', mmHg: 'mmHg' } },
      { name: 'Pressure Ratio', symbol: '<math><mi>δ</mi></math>', key: 'pratio', value: r.pressureRatio, unit: '', unitOptions: null },
    ]},
    { group: 'Density', rows: [
      { name: 'Density', symbol: '<math><mi>ρ</mi></math>', key: 'dens', value: r.density, unitOptions: ['kg/m³', 'slugs/ft³'], conversions: IMPERIAL.density },
      { name: 'Density Ratio', symbol: '<math><mi>σ</mi></math>', key: 'dratio', value: r.densityRatio, unit: '', unitOptions: null },
      { name: 'Square Root Density Ratio', symbol: '<math><msqrt><mi>σ</mi></msqrt></math>', key: 'sqrt_dratio', value: r.sqrtDensityRatio, unit: '', unitOptions: null },
    ]},
    { group: 'Motion & Viscosity', rows: [
      { name: 'Speed of Sound', symbol: '<math><mi>a</mi></math>', key: 'sos', value: r.speedOfSound, unitOptions: ['m/s', 'ft/s', 'knots'], conversions: IMPERIAL.speedOfSound },
      { name: 'Speed of Sound Ratio', symbol: '<math><mi>a</mi><mo>/</mo><msub><mi>a</mi><mn>0</mn></msub></math>', key: 'sos_r', value: r.speedOfSoundRatio, unit: '', unitOptions: null },
      { name: 'Dynamic Viscosity', symbol: '<math><mi>μ</mi></math>', key: 'dv', value: r.dynamicViscosity, unitOptions: ['Pa·s', 'lbf·s/ft²'], conversions: IMPERIAL.dynamicViscosity },
      { name: 'Dynamic Viscosity Ratio', symbol: '<math><mi>μ</mi><mo>/</mo><msub><mi>μ</mi><mn>0</mn></msub></math>', key: 'dv_r', value: r.dynamicViscosityRatio, unit: '', unitOptions: null },
      { name: 'Kinematic Viscosity', symbol: '<math><mi>ν</mi></math>', key: 'kv', value: r.kinematicViscosity, unitOptions: ['m²/s', 'ft²/s'], conversions: IMPERIAL.kinematicViscosity },
      { name: 'Kinematic Viscosity Ratio', symbol: '<math><mi>ν</mi><mo>/</mo><msub><mi>ν</mi><mn>0</mn></msub></math>', key: 'kv_r', value: r.kinematicViscosityRatio, unit: '', unitOptions: null },
      { name: 'Mean Particle Speed', symbol: '<math><mover><mi>v</mi><mo>¯</mo></mover></math>', key: 'mps', value: r.meanParticleSpeed, unitOptions: ['m/s', 'ft/s', 'knots'], conversions: IMPERIAL.meanParticleSpeed },
    ]},
    { group: 'Other Properties', rows: [
      { name: 'Gravity', symbol: '<math><mi>g</mi></math>', key: 'grav', value: r.gravity, unitOptions: ['m/s²', 'ft/s²'], conversions: IMPERIAL.gravity },
      { name: 'Gravity Ratio', symbol: '<math><mi>g</mi><mo>/</mo><msub><mi>g</mi><mi>n</mi></msub></math>', key: 'grav_r', value: r.gravityRatio, unit: '', unitOptions: null },
      { name: 'Specific Weight', symbol: '<math><mi>γ</mi></math>', key: 'sw', value: r.specificWeight, unitOptions: ['N/m³', 'lbf/ft³'], conversions: IMPERIAL.specificWeight },
      { name: 'Pressure Scale Height', symbol: '<math><msub><mi>H</mi><mi>p</mi></msub></math>', key: 'psh', value: r.pressureScaleHeight, unitOptions: ['m', 'ft', 'nmi'], conversions: IMPERIAL.pressureScaleHeight },
      { name: 'Thermal Conductivity', symbol: '<math><mi>λ</mi></math>', key: 'tc', value: r.thermalConductivity, unitOptions: ['W/(m·K)', 'BTU/(hr·ft·°F)'], conversions: IMPERIAL.thermalConductivity },
      { name: 'Thermal Conductivity Ratio', symbol: '<math><mi>λ</mi><mo>/</mo><msub><mi>λ</mi><mn>0</mn></msub></math>', key: 'tc_r', value: r.thermalConductivityRatio, unit: '', unitOptions: null },
      { name: 'Air Number Density', symbol: '<math><mi>n</mi></math>', key: 'and', value: r.airNumberDensity, unit: 'm⁻³', unitOptions: null },
      { name: 'Collision Frequency', symbol: '<math><mi>ω</mi></math>', key: 'cf', value: r.collisionFrequency, unit: 's⁻¹', unitOptions: null },
      { name: 'Mean Free Path', symbol: '<math><mi>l</mi></math>', key: 'mfp', value: r.meanFreePath, unitOptions: ['m', 'ft', 'nmi'], conversions: IMPERIAL.meanFreePath },
      { name: 'Mole Volume', symbol: '<math><msub><mi>V</mi><mi>m</mi></msub></math>', key: 'mv', value: r.moleVolume, unit: 'm³/mol', unitOptions: null },
    ]}
  ]
})

function getDisplayValue(row) {
  if (!row.unitOptions) {
    // Simple value — no unit options
    return formatValue(row.value)
  }

  // Case 1: Pre-computed unit objects (altitude, temperature, pressure)
  if (row.unitMap) {
    const currentUnit = getUnitToggle(row.key, row.unitOptions)
    const unitKey = row.unitMap[currentUnit]
    const val = typeof row.value === 'object' ? row.value[unitKey] : row.value
    return formatValue(val)
  }

  // Case 2: Conversion factor approach (imperial units)
  const val = typeof row.value === 'number' ? row.value : row.value
  const factor = getConversionFactor(row)
  return formatValue(val * factor)
}

function getDisplayUnit(row) {
  if (!row.unitOptions) return row.unit || ''
  return getUnitToggle(row.key, row.unitOptions)
}

function formatValue(val) {
  if (val === undefined || val === null) return '—'
  if (val === 0) return '0'
  const abs = Math.abs(val)
  if (abs === 0) return '0'
  if (abs >= 1e6 || abs < 1e-3) return val.toExponential(4)
  if (abs < 1) return val.toFixed(6)
  if (abs < 100) return val.toFixed(4)
  const fixed = val.toFixed(2)
  const parts = fixed.split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}

function showToast(msg) {
  toastMsg.value = msg
  toastVisible.value = true
  setTimeout(() => { toastVisible.value = false }, 2000)
}

function copyValue(row) {
  const val = getDisplayValue(row)
  const unit = getDisplayUnit(row)
  const text = unit ? `${val} ${unit}` : val
  navigator.clipboard.writeText(text).then(() => showToast('Copied: ' + text))
}

function copyResults() {
  if (!props.result) return
  const lines = rows.value.flatMap(group => [
    `--- ${group.group} ---`,
    ...group.rows.map(r => `${r.name}: ${getDisplayValue(r)} ${getDisplayUnit(r)}`)
  ])
  navigator.clipboard.writeText(lines.join('\n')).then(() => showToast('All results copied'))
}

function exportCSV() {
  if (!props.result) return
  const csvRows = ['Property,Value,Unit']
  rows.value.forEach(group => {
    group.rows.forEach(r => {
      const val = getDisplayValue(r)
      const unit = getDisplayUnit(r)
      csvRows.push(`"${r.name}",${val},"${unit}"`)
    })
  })
  downloadFile(csvRows.join('\n'), 'atmosphere-properties.csv', 'text/csv')
  showToast('CSV downloaded')
}

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function toggleGroup(group) {
  const s = new Set(collapsedGroups.value)
  if (s.has(group)) s.delete(group)
  else s.add(group)
  collapsedGroups.value = s
}
</script>

<template>
  <div v-if="result">
    <div class="results-panel-header">
      <h3>Properties</h3>
      <div class="global-unit-toggle">
        <button :class="{ active: globalUnitSystem === 'metric' }" @click="setGlobalUnit('metric')">Metric</button>
        <button :class="{ active: globalUnitSystem === 'imperial' }" @click="setGlobalUnit('imperial')">Imperial</button>
      </div>
    </div>
    <table class="results-table">
      <template v-for="(group, gi) in rows" :key="gi">
        <tr class="results-group-header" @click="toggleGroup(group.group)">
          <td colspan="3">
            <span class="collapse-icon" :class="{ collapsed: collapsedGroups.has(group.group) }">&#9660;</span>
            {{ group.group }}
          </td>
        </tr>
        <template v-if="!collapsedGroups.has(group.group)">
          <tr v-for="(row, ri) in group.rows" :key="ri">
            <td class="property-name">
              <span v-if="row.symbol" class="property-symbol" v-html="row.symbol"></span>
              {{ row.name }}
            </td>
            <td class="property-value" @click="copyValue(row)" title="Click to copy">
              {{ getDisplayValue(row) }}
              <span class="property-unit">{{ getDisplayUnit(row) }}</span>
              <span v-if="row.unitOptions" class="property-unit-toggle">
                <button
                  v-for="u in row.unitOptions"
                  :key="u"
                  :class="{ active: getUnitToggle(row.key, row.unitOptions) === u }"
                  @click.stop="setUnitToggle(row.key, u)"
                >{{ u }}</button>
              </span>
            </td>
          </tr>
        </template>
      </template>
    </table>
    <div class="export-row">
      <button class="export-btn" @click="copyResults">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
        Copy All
      </button>
      <button class="export-btn" @click="exportCSV">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        CSV
      </button>
      <button class="export-btn" @click="window.print()">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
        Print
      </button>
    </div>
  </div>
  <div v-else class="empty-state">
    <svg class="empty-state-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-subtle)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
    <p>Enter an altitude or property value to calculate atmospheric properties.</p>
  </div>

  <!-- Toast -->
  <div class="toast" :class="{ show: toastVisible }">{{ toastMsg }}</div>
</template>
