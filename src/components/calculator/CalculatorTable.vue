<script setup>
import { ref, watch, nextTick } from 'vue'
import { IsaAlgorithms } from 'atmospheris'

const startAlt = ref(0)
const endAlt = ref(20000)
const stepSize = ref(1000)
const altUnit = ref('meters')
const loading = ref(false)
const tableData = ref([])

const presets = [
  { label: 'Troposphere', start: 0, end: 11000, step: 500 },
  { label: 'Aviation (0–15 km)', start: 0, end: 15000, step: 500 },
  { label: 'Stratosphere', start: 11000, end: 32000, step: 1000 },
  { label: 'Full Range', start: -2000, end: 80000, step: 2000 },
]

const toastMsg = ref('')
const toastVisible = ref(false)

function setPreset(p) {
  startAlt.value = p.start
  endAlt.value = p.end
  stepSize.value = p.step
  altUnit.value = 'meters'
}

function showToast(msg) {
  toastMsg.value = msg
  toastVisible.value = true
  setTimeout(() => { toastVisible.value = false }, 2000)
}

function generateTableData() {
  const isa = new IsaAlgorithms()
  const start = altUnit.value === 'feet' ? startAlt.value / 3.280839895 : startAlt.value
  const end = altUnit.value === 'feet' ? endAlt.value / 3.280839895 : endAlt.value
  const step = altUnit.value === 'feet' ? stepSize.value / 3.280839895 : stepSize.value

  if (step <= 0 || start >= end) {
    tableData.value = []
    return
  }

  const rows = []
  for (let h = start; h <= end + step * 0.01; h += step) {
    const geoH = h
    const temp = isa.temperatureFromGeopotential(geoH)
    const pres = isa.pressureFromGeopotential(geoH)
    const dens = isa.densityFromGeopotential(geoH)
    const sos = isa.speedOfSound(geoH)
    const grav = isa.gravityAtGeopotential(geoH)
    const dv = isa.dynamicViscosity(geoH)
    const kv = isa.kinematicViscosity(geoH)
    const mfp = isa.meanFreePath(geoH)
    const presMbar = isa.pressureMbarFromGeopotential(geoH)

    rows.push({
      alt: geoH,
      altFt: geoH * 3.280839895,
      temp,
      tempC: temp - 273.15,
      pres,
      presMbar,
      dens,
      sos,
      grav,
      dv,
      kv,
      mfp
    })
  }
  tableData.value = rows
}

watch([startAlt, endAlt, stepSize, altUnit], () => {
  loading.value = true
  nextTick(() => {
    generateTableData()
    loading.value = false
  })
}, { immediate: true })

function fmt(val, digits = 2) {
  if (val === 0) return '0'
  const abs = Math.abs(val)
  if (abs >= 1e6 || abs < 1e-3) return val.toExponential(digits)
  if (abs < 1) return val.toFixed(6)
  if (abs < 100) return val.toFixed(4)
  return val.toFixed(2)
}

function copyCSV() {
  const headers = ['Altitude (m)', 'Altitude (ft)', 'Temp (K)', 'Temp (°C)', 'Pressure (Pa)', 'Pressure (mbar)', 'Density (kg/m³)', 'Speed of Sound (m/s)', 'Gravity (m/s²)', 'Dynamic Viscosity (Pa·s)', 'Kinematic Viscosity (m²/s)', 'Mean Free Path (m)']
  const csv = [
    headers.join(','),
    ...tableData.value.map(r =>
      [r.alt, r.altFt.toFixed(0), fmt(r.temp), fmt(r.tempC), fmt(r.pres), fmt(r.presMbar), fmt(r.dens), fmt(r.sos), fmt(r.grav), fmt(r.dv), fmt(r.kv), fmt(r.mfp)].join(',')
    )
  ].join('\n')
  navigator.clipboard.writeText(csv).then(() => showToast('CSV copied to clipboard'))
}

function downloadCSV() {
  const headers = ['Altitude (m)', 'Altitude (ft)', 'Temp (K)', 'Temp (°C)', 'Pressure (Pa)', 'Pressure (mbar)', 'Density (kg/m³)', 'Speed of Sound (m/s)', 'Gravity (m/s²)', 'Dynamic Viscosity (Pa·s)', 'Kinematic Viscosity (m²/s)', 'Mean Free Path (m)']
  const csv = [
    headers.join(','),
    ...tableData.value.map(r =>
      [r.alt, r.altFt.toFixed(0), fmt(r.temp), fmt(r.tempC), fmt(r.pres), fmt(r.presMbar), fmt(r.dens), fmt(r.sos), fmt(r.grav), fmt(r.dv), fmt(r.kv), fmt(r.mfp)].join(',')
    )
  ].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `atmosphere-table-${startAlt.value}-${endAlt.value}.csv`
  a.click()
  URL.revokeObjectURL(url)
  showToast('CSV file downloaded')
}

function copyTSV() {
  const headers = ['Altitude (m)', 'Altitude (ft)', 'Temp (K)', 'Temp (°C)', 'Pressure (Pa)', 'Pressure (mbar)', 'Density (kg/m³)', 'Speed of Sound (m/s)']
  const tsv = [
    headers.join('\t'),
    ...tableData.value.map(r =>
      [r.alt, r.altFt.toFixed(0), fmt(r.temp), fmt(r.tempC), fmt(r.pres), fmt(r.presMbar), fmt(r.dens), fmt(r.sos)].join('\t')
    )
  ].join('\n')
  navigator.clipboard.writeText(tsv).then(() => showToast('TSV copied (paste into spreadsheet)'))
}
</script>

<template>
  <div class="table-generator">
    <div class="table-preset-btns">
      <button
        v-for="p in presets"
        :key="p.label"
        class="table-preset-btn"
        :class="{ active: startAlt === p.start && endAlt === p.end && stepSize === p.step }"
        @click="setPreset(p)"
      >{{ p.label }}</button>
    </div>

    <div class="table-controls">
      <div class="input-group">
        <label>Start</label>
        <input type="number" v-model.number="startAlt" step="100" />
      </div>
      <div class="input-group">
        <label>End</label>
        <input type="number" v-model.number="endAlt" step="100" />
      </div>
      <div class="input-group">
        <label>Step</label>
        <input type="number" v-model.number="stepSize" step="100" min="1" />
      </div>
      <div class="input-group">
        <label>Unit</label>
        <div class="radio-pills">
          <button :class="{ active: altUnit === 'meters' }" @click="altUnit = 'meters'">m</button>
          <button :class="{ active: altUnit === 'feet' }" @click="altUnit = 'feet'">ft</button>
        </div>
      </div>
    </div>

    <div class="table-scroll-container" :class="{ 'table-loading': loading }">
      <div v-if="loading" class="table-spinner">
        <div class="spinner"></div>
        <span>Generating table...</span>
      </div>
      <table class="gen-table">
        <thead>
          <tr>
            <th>Alt (m)</th>
            <th>Alt (ft)</th>
            <th>Temp (K)</th>
            <th>Temp (°C)</th>
            <th>Pres (Pa)</th>
            <th>Pres (mbar)</th>
            <th>Density (kg/m³)</th>
            <th>Speed of Sound (m/s)</th>
            <th>Gravity (m/s²)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in tableData" :key="i">
            <td>{{ row.alt >= 0 ? '+' : '' }}{{ row.alt.toLocaleString() }}</td>
            <td>{{ row.altFt.toFixed(0) }}</td>
            <td>{{ fmt(row.temp) }}</td>
            <td>{{ fmt(row.tempC) }}</td>
            <td>{{ fmt(row.pres) }}</td>
            <td>{{ fmt(row.presMbar) }}</td>
            <td>{{ fmt(row.dens) }}</td>
            <td>{{ fmt(row.sos) }}</td>
            <td>{{ fmt(row.grav) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="table-export-row">
      <button class="export-btn" @click="copyCSV">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
        Copy CSV
      </button>
      <button class="export-btn" @click="copyTSV">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
        Copy TSV
      </button>
      <button class="export-btn" @click="downloadCSV">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Download CSV
      </button>
    </div>

    <div class="toast" :class="{ show: toastVisible }">{{ toastMsg }}</div>
  </div>
</template>
