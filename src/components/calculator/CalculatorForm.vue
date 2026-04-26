<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { PROPERTY_DEFS, getAllProperties, getAltitudeFromProperty } from 'atmospheris'

const emit = defineEmits(['calculate'])

const route = useRoute()

const mode = ref('altitude')
const altitudeValue = ref(0)
const altitudeUnit = ref('meters')
const altitudeType = ref('geopotential')
const pressureValue = ref(1013.25)
const pressureUnit = ref('mbar')
const precision = ref('normal')
const tempOffset = ref(0)

// By Property mode
const selectedProperty = ref('temperature_k')
const propertyValue = ref(288.15)

// Compute valid range for the selected property
// Get values at altitude extremes (-2000m and 80000m)
const propertyRange = computed(() => {
  try {
    const propsAtMin = getAllProperties({ value: -2000, unit: 'meters', type: 'geopotential', precision: 'normal' })
    const propsAtMax = getAllProperties({ value: 80000, unit: 'meters', type: 'geopotential', precision: 'normal' })
    if (!propsAtMin || !propsAtMax) return null

    const key = selectedProperty.value
    const valAtMin = getPropertyValue(propsAtMin, key)
    const valAtMax = getPropertyValue(propsAtMax, key)

    if (valAtMin == null || valAtMax == null) return null
    return {
      min: Math.min(valAtMin, valAtMax),
      max: Math.max(valAtMin, valAtMax)
    }
  } catch {
    return null
  }
})

function getPropertyValue(props, key) {
  const mapping = {
    geopotential_altitude_m: () => props.geopotentialAltitude?.meters,
    geopotential_altitude_ft: () => props.geopotentialAltitude?.feet,
    geometric_altitude_m: () => props.geometricAltitude?.meters,
    geometric_altitude_ft: () => props.geometricAltitude?.feet,
    temperature_k: () => props.temperature?.kelvin,
    temperature_c: () => props.temperature?.celsius,
    temperature_f: () => props.temperature?.fahrenheit,
    temperature_r: () => props.temperature?.rankine,
    temperature_ratio: () => props.temperatureRatio,
    lapse_rate: () => props.lapseRate,
    pressure_pa: () => props.pressure?.pascal,
    pressure_mbar: () => props.pressure?.millibar,
    pressure_mmhg: () => props.pressure?.mmHg,
    pressure_ratio: () => props.pressureRatio,
    density_kgm3: () => props.density?.kgm3,
    density_ratio: () => props.densityRatio,
    sqrt_density_ratio: () => props.sqrtDensityRatio,
    gravity_ms2: () => props.gravity,
    gravity_ratio: () => props.gravityRatio,
    speed_of_sound_ms: () => props.speedOfSound,
    speed_of_sound_ratio: () => props.speedOfSoundRatio,
    dynamic_viscosity: () => props.dynamicViscosity,
    dynamic_viscosity_ratio: () => props.dynamicViscosityRatio,
    kinematic_viscosity: () => props.kinematicViscosity,
    kinematic_viscosity_ratio: () => props.kinematicViscosityRatio,
    thermal_conductivity: () => props.thermalConductivity,
    thermal_conductivity_ratio: () => props.thermalConductivityRatio,
    pressure_scale_height: () => props.pressureScaleHeight,
    specific_weight: () => props.specificWeight,
    air_number_density: () => props.airNumberDensity,
    mean_particle_speed: () => props.meanParticleSpeed,
    collision_frequency: () => props.collisionFrequency,
    mean_free_path: () => props.meanFreePath,
    mole_volume: () => props.moleVolume,
    molecular_temperature: () => props.molecularTemperature,
  }
  const fn = mapping[key]
  return fn ? fn() : null
}

const presets = [
  { label: 'Sea Level', value: 0, range: 'Sea Level' },
  { label: '1 km', value: 1000, range: 'Troposphere' },
  { label: '5 km', value: 5000, range: 'Troposphere' },
  { label: 'Tropopause', value: 11000, range: 'Tropopause' },
  { label: '15 km', value: 15000, range: 'Stratosphere' },
  { label: '20 km', value: 20000, range: 'Stratosphere' },
  { label: '32 km', value: 32000, range: 'Stratosphere' },
  { label: '47 km', value: 47000, range: 'Stratopause' },
  { label: '51 km', value: 51000, range: 'Mesosphere' },
  { label: '71 km', value: 71000, range: 'Mesosphere' },
]

const altitudeRange = computed(() => {
  if (altitudeUnit.value === 'meters') return { min: -2000, max: 80000, step: 100 }
  return { min: -6562, max: 262467, step: 328 }
})

const altitudeRangeHint = computed(() => {
  return altitudeUnit.value === 'meters'
    ? '(-2,000 to 80,000 m)'
    : '(-6,562 to 262,467 ft)'
})

// Property groups for the dropdown
const propertyGroups = computed(() => {
  const groups = {}
  for (const [key, def] of Object.entries(PROPERTY_DEFS)) {
    if (!groups[def.group]) groups[def.group] = []
    groups[def.group].push({ key, ...def })
  }
  return groups
})

function setPreset(val) {
  altitudeValue.value = val
  altitudeUnit.value = 'meters'
  doCalculate()
}

function resetToSeaLevel() {
  mode.value = 'altitude'
  altitudeValue.value = 0
  altitudeUnit.value = 'meters'
  altitudeType.value = 'geopotential'
  tempOffset.value = 0
  doCalculate()
}

function doCalculate() {
  if (mode.value === 'altitude') {
    emit('calculate', {
      mode: 'altitude',
      value: Number(altitudeValue.value),
      unit: altitudeUnit.value,
      type: altitudeType.value,
      precision: precision.value,
      tempOffset: Number(tempOffset.value) || 0
    })
  } else if (mode.value === 'pressure') {
    emit('calculate', {
      mode: 'pressure',
      value: Number(pressureValue.value),
      unit: pressureUnit.value,
      precision: precision.value
    })
  } else if (mode.value === 'property') {
    emit('calculate', {
      mode: 'property',
      property: selectedProperty.value,
      value: Number(propertyValue.value),
      precision: precision.value
    })
  }
}

function setMode(m) {
  mode.value = m
  doCalculate()
}

function getShareUrl() {
  const base = window.location.origin + '/calculator'
  if (mode.value === 'altitude') {
    const params = new URLSearchParams({
      alt: altitudeValue.value,
      unit: altitudeUnit.value,
      type: altitudeType.value,
      prec: precision.value
    })
    if (tempOffset.value) params.set('dt', tempOffset.value)
    return base + '?' + params.toString()
  }
  if (mode.value === 'pressure') {
    return base + '?pressure=' + pressureValue.value + '&punit=' + pressureUnit.value
  }
  if (mode.value === 'property') {
    return base + '?prop=' + selectedProperty.value + '&val=' + propertyValue.value
  }
  return base
}

function copyShareUrl() {
  navigator.clipboard.writeText(getShareUrl())
}

function formatRangeValue(val) {
  if (val === 0) return '0'
  const abs = Math.abs(val)
  if (abs >= 1e6) return val.toExponential(2)
  if (abs >= 100) return val.toFixed(1)
  if (abs >= 1) return val.toFixed(3)
  if (abs >= 0.001) return val.toFixed(6)
  return val.toExponential(2)
}

onMounted(() => {
  const q = route.query
  if (q.prop) {
    mode.value = 'property'
    selectedProperty.value = q.prop
    propertyValue.value = Number(q.val)
  } else if (q.pressure) {
    mode.value = 'pressure'
    pressureValue.value = Number(q.pressure)
    pressureUnit.value = q.punit || 'mbar'
  } else if (q.alt !== undefined) {
    altitudeValue.value = Number(q.alt)
    altitudeUnit.value = q.unit || 'meters'
    altitudeType.value = q.type || 'geopotential'
    if (q.dt) tempOffset.value = Number(q.dt)
  }
  if (q.prec) precision.value = q.prec
})
</script>

<template>
  <div>
    <div class="mode-toggle">
      <button :class="{ active: mode === 'altitude' }" @click="setMode('altitude')">By Altitude</button>
      <button :class="{ active: mode === 'pressure' }" @click="setMode('pressure')">By Pressure</button>
      <button :class="{ active: mode === 'property' }" @click="setMode('property')">By Property</button>
    </div>
    <p class="mode-desc">
      <template v-if="mode === 'altitude'">Given an altitude (geopotential or geometric), calculate all 19 atmospheric properties.</template>
      <template v-else-if="mode === 'pressure'">Given a pressure value, find the corresponding altitude (hypsometrical lookup).</template>
      <template v-else>Given any atmospheric property value, find the corresponding altitude.</template>
    </p>

    <!-- Altitude mode -->
    <template v-if="mode === 'altitude'">
      <div class="input-group">
        <label>Altitude <span class="range-hint">{{ altitudeRangeHint }}</span></label>
        <div class="input-composite">
          <input
            type="number"
            v-model.number="altitudeValue"
            :min="altitudeRange.min"
            :max="altitudeRange.max"
            :step="altitudeRange.step"
            @input="doCalculate"
          />
          <div class="unit-segment">
            <button :class="{ active: altitudeUnit === 'meters' }" @click="altitudeUnit = 'meters'; doCalculate()">m</button>
            <button :class="{ active: altitudeUnit === 'feet' }" @click="altitudeUnit = 'feet'; doCalculate()">ft</button>
          </div>
        </div>
      </div>

      <div class="input-group">
        <label>Reference</label>
        <div class="radio-pills">
          <button :class="{ active: altitudeType === 'geopotential' }" @click="altitudeType = 'geopotential'; doCalculate()">Geopotential (H)</button>
          <button :class="{ active: altitudeType === 'geometric' }" @click="altitudeType = 'geometric'; doCalculate()">Geometric (Z)</button>
        </div>
      </div>

      <div class="input-group">
        <label>Temperature Offset</label>
        <input
          type="number"
          v-model.number="tempOffset"
          step="0.5"
          placeholder="0 °C"
          @input="doCalculate"
        />
      </div>

      <div class="input-group">
        <label>Precision</label>
        <div class="radio-pills">
          <button :class="{ active: precision === 'normal' }" @click="precision = 'normal'; doCalculate()">Normal</button>
          <button :class="{ active: precision === 'reduced' }" @click="precision = 'reduced'; doCalculate()">Reduced</button>
        </div>
      </div>

      <div class="input-group">
        <label>Presets</label>
        <div class="preset-chips">
          <button
            v-for="p in presets"
            :key="p.value"
            class="preset-chip"
            :class="{ active: altitudeValue === p.value && altitudeUnit === 'meters' }"
            @click="setPreset(p.value)"
            :title="p.range"
          >
            {{ p.label }}
          </button>
        </div>
      </div>
    </template>

    <!-- Pressure mode -->
    <template v-else-if="mode === 'pressure'">
      <div class="input-group">
        <label>Pressure <span class="range-hint">{{ pressureUnit === 'mbar' ? '0.01 – 1,013.25 mbar' : '0.01 – 760.00 mmHg' }}</span></label>
        <div class="input-composite">
          <input
            type="number"
            v-model.number="pressureValue"
            step="0.01"
            @input="doCalculate"
          />
          <div class="unit-segment">
            <button :class="{ active: pressureUnit === 'mbar' }" @click="pressureUnit = 'mbar'; doCalculate()">mbar</button>
            <button :class="{ active: pressureUnit === 'mmHg' }" @click="pressureUnit = 'mmHg'; doCalculate()">mmHg</button>
          </div>
        </div>
      </div>

      <div class="input-group">
        <label>Precision</label>
        <div class="radio-pills">
          <button :class="{ active: precision === 'normal' }" @click="precision = 'normal'; doCalculate()">Normal</button>
          <button :class="{ active: precision === 'reduced' }" @click="precision = 'reduced'; doCalculate()">Reduced</button>
        </div>
      </div>
    </template>

    <!-- Property mode -->
    <template v-else-if="mode === 'property'">
      <div class="input-group">
        <label>Property</label>
        <select v-model="selectedProperty" @change="doCalculate" class="property-select">
          <optgroup v-for="(props, group) in propertyGroups" :key="group" :label="group">
            <option v-for="p in props" :key="p.key" :value="p.key">
              {{ p.label }}{{ p.unit ? ' (' + p.unit + ')' : '' }}
            </option>
          </optgroup>
        </select>
      </div>

      <div class="input-group">
        <label>Value</label>
        <div class="property-input-row">
          <input
            type="number"
            v-model.number="propertyValue"
            step="any"
            @input="doCalculate"
          />
          <span class="property-input-unit" v-if="PROPERTY_DEFS[selectedProperty]?.unit">
            {{ PROPERTY_DEFS[selectedProperty].unit }}
          </span>
        </div>
        <div v-if="propertyRange" class="property-range-hint">
          Valid range: {{ formatRangeValue(propertyRange.min) }} – {{ formatRangeValue(propertyRange.max) }}
          {{ PROPERTY_DEFS[selectedProperty]?.unit || '' }}
        </div>
      </div>

      <div class="input-group">
        <label>Precision</label>
        <div class="radio-pills">
          <button :class="{ active: precision === 'normal' }" @click="precision = 'normal'; doCalculate()">Normal</button>
          <button :class="{ active: precision === 'reduced' }" @click="precision = 'reduced'; doCalculate()">Reduced</button>
        </div>
      </div>
    </template>

    <hr class="calc-divider" />

    <div class="calc-actions">
      <button @click="resetToSeaLevel" title="Reset to sea level">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 12a9 9 0 1 1 3 7"/><polyline points="3 22 3 16 9 16"/></svg>
        Reset
      </button>
      <button @click="copyShareUrl" title="Copy shareable URL">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
        Share URL
      </button>
    </div>
  </div>
</template>
