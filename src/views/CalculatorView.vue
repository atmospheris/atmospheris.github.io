<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useSeo, buildWebApplicationSchema } from '@/composables/useSeo'
import CalculatorForm from '@/components/calculator/CalculatorForm.vue'
import CalculatorResults from '@/components/calculator/CalculatorResults.vue'
import AtmosphereExplorer from '@/components/calculator/AtmosphereExplorer.vue'
import CalculatorCharts from '@/components/calculator/CalculatorCharts.vue'
import CalculatorTable from '@/components/calculator/CalculatorTable.vue'
import { getAllProperties, getAltitudeFromPressure } from 'atmospheris'

useSeo({
  title: 'Standard Atmosphere Calculator',
  description: 'Interactive calculator for ISO 2533 Standard Atmosphere properties. Calculate temperature, pressure, density, and more at any altitude with 3D visualization.',
  path: '/calculator',
  schema: buildWebApplicationSchema()
})

const route = useRoute()

const result = ref(null)
const calcMode = ref('altitude')
const activeTab = ref('calculator')
const currentAltitude = ref(0)
const altitudeUnit = ref('meters')

const tabs = [
  { key: 'calculator', label: 'Calculator' },
  { key: 'explorer', label: 'Explorer 3D' },
  { key: 'table', label: 'Table' },
  { key: 'charts', label: 'Charts' },
]

function handleCalculate(input) {
  calcMode.value = input.mode
  altitudeUnit.value = input.unit || 'meters'
  try {
    if (input.mode === 'altitude') {
      currentAltitude.value = input.unit === 'feet' ? input.value / 3.280839895 : input.value
      result.value = getAllProperties({
        value: input.value,
        unit: input.unit,
        type: input.type,
        precision: input.precision
      })
      // Apply temperature offset (ΔT in °C) to the result
      const dt = input.tempOffset || 0
      if (dt !== 0 && result.value) {
        const r = result.value
        const T = r.temperature.kelvin + dt
        result.value = {
          ...r,
          temperature: {
            kelvin: T,
            celsius: T - 273.15,
            rankine: T * 1.8,
            fahrenheit: T * 1.8 - 459.67
          }
        }
      }
    } else {
      result.value = getAltitudeFromPressure({
        value: input.value,
        unit: input.unit,
        precision: input.precision
      }) || null
    }
  } catch (e) {
    result.value = null
  }
}

function handleExplorerAltitude(alt) {
  currentAltitude.value = alt
  // Also update the calculator results
  try {
    result.value = getAllProperties({
      value: alt,
      unit: 'meters',
      type: 'geopotential',
      precision: 'normal'
    })
  } catch (e) {
    // ignore
  }
}

onMounted(() => {
  // Check URL hash for tab
  const hash = window.location.hash.replace('#', '')
  if (tabs.some(t => t.key === hash)) {
    activeTab.value = hash
  }

  // Auto-calculate at sea level on load (or from URL params)
  const q = route.query
  if (q.pressure) {
    handleCalculate({
      mode: 'pressure',
      value: Number(q.pressure),
      unit: q.punit || 'mbar',
      precision: q.prec || 'normal'
    })
  } else {
    const alt = q.alt !== undefined ? Number(q.alt) : 0
    handleCalculate({
      mode: 'altitude',
      value: alt,
      unit: q.unit || 'meters',
      type: q.type || 'geopotential',
      precision: q.prec || 'normal'
    })
  }
})
</script>

<template>
  <div class="calculator-page">
    <div class="calculator-header">
      <h1>Standard Atmosphere Calculator</h1>
      <p>Calculate atmospheric properties from -2,000 m to 80,000 m following the ISO 2533 Standard Atmosphere model.</p>
    </div>

    <div class="calculator-body">
      <!-- Tab navigation -->
      <div class="calc-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          :class="{ active: activeTab === tab.key }"
          @click="activeTab = tab.key"
        >{{ tab.label }}</button>
      </div>

      <!-- Tab content -->
      <div class="calc-tab-content">
        <!-- Calculator Tab -->
        <div v-if="activeTab === 'calculator'" class="calc-layout">
          <div class="calc-input-panel">
            <CalculatorForm @calculate="handleCalculate" />
          </div>
          <div class="calc-results-panel">
            <CalculatorResults :result="result" :mode="calcMode" />
          </div>
        </div>

        <!-- Explorer 3D Tab -->
        <div v-else-if="activeTab === 'explorer'">
          <AtmosphereExplorer
            :altitude="currentAltitude"
            :unit="altitudeUnit"
            @update:altitude="handleExplorerAltitude"
          />
        </div>

        <!-- Table Tab -->
        <div v-else-if="activeTab === 'table'">
          <CalculatorTable />
        </div>

        <!-- Charts Tab -->
        <div v-else-if="activeTab === 'charts'">
          <CalculatorCharts :altitude="currentAltitude" />
        </div>
      </div>
    </div>
  </div>
</template>
