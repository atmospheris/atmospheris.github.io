<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSeo, buildWebApplicationSchema } from '@/composables/useSeo'
import HeroSection from '@/components/content/HeroSection.vue'
import FeatureCard from '@/components/content/FeatureCard.vue'
import { getAllProperties, roundToSigFigs, paToMbar } from 'atmospheris'

useSeo({
  title: null,
  description: 'Open-source standard atmosphere models. Interactive calculator for ISO 2533 atmospheric properties and ISO 5878 wind distributions, with Ruby gem and TypeScript library.',
  path: '/',
  schema: buildWebApplicationSchema()
})

const sliderAltitude = ref(-2000)
const altUnit = ref('m')

const altRange = computed(() => {
  return altUnit.value === 'm'
    ? { min: -2000, max: 80000, step: 100 }
    : { min: -6562, max: 262467, step: 328 }
})

const altitudeInMeters = computed(() => {
  return altUnit.value === 'ft' ? Math.round(sliderAltitude.value * 0.3048) : sliderAltitude.value
})

function setAltUnit(u) {
  const currentMeters = altUnit.value === 'ft' ? sliderAltitude.value * 0.3048 : sliderAltitude.value
  altUnit.value = u
  sliderAltitude.value = u === 'ft' ? Math.round(currentMeters / 0.3048) : Math.round(currentMeters)
}

const props = computed(() => {
  try {
    return getAllProperties({
      value: altitudeInMeters.value,
      unit: 'meters',
      type: 'geopotential',
      precision: 'normal'
    })
  } catch {
    return null
  }
})

const displayProps = computed(() => {
  if (!props.value) return []
  const p = props.value
  return [
    { label: 'Temperature', value: p.temperature.celsius.toFixed(1), unit: '°C' },
    { label: 'Pressure', value: paToMbar(p.pressure.pascal).toFixed(2), unit: 'mbar' },
    { label: 'Density', value: p.density.toFixed(4), unit: 'kg/m³' },
    { label: 'Speed of Sound', value: p.speedOfSound.toFixed(2), unit: 'm/s' },
    { label: 'Gravity', value: p.gravity.toFixed(4), unit: 'm/s²' },
    { label: 'Dynamic Viscosity', value: p.dynamicViscosity.toExponential(4), unit: 'Pa·s' },
    { label: 'Kinematic Viscosity', value: p.kinematicViscosity.toExponential(4), unit: 'm²/s' },
    { label: 'Pressure Scale Height', value: p.pressureScaleHeight.toFixed(1), unit: 'm' },
  ]
})

const featureIcons = {
  altitude: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>',
  pressure: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>',
  precision: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg>',
  export: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8"/></svg>',
  tables: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18"/></svg>',
  units: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/></svg>',
}

const tsCode = `import { getAllProperties } from "atmospheris"

// Get all properties at 10,000 m geopotential altitude
const result = getAllProperties({
  value: 10000,
  unit: "meters",
  type: "geopotential",
  precision: "normal"
})

console.log(result.temperature.celsius)  // -49.898 °C
console.log(result.pressure.mbar)        // 264.36 mbar
console.log(result.density)              // 0.4135 kg/m³`

const rubyCode = `require "atmospheris"

# Calculate properties at 10,000 m geopotential altitude
result = Atmospheris::Export::AltitudeAttrs.new
result.set_geopotential_altitude(10_000, :meters)
result.realize_values!

puts result.temperature_celsius   #=> -50.0 °C
puts result.pressure_mbar         #=> 264.36 mbar
puts result.density               #=> 0.4135 kg/m³`
</script>

<template>
  <HeroSection>
    <p class="hero-eyebrow">Open-source standard atmosphere models</p>
    <h1 class="hero-title">
      Calculate the <span class="gradient-text">Standard Atmosphere</span>
    </h1>
    <p class="hero-description">
      Atmospheris provides open-source implementations of ISO atmospheric
      reference standards &mdash; from the baseline ISA (ISO 2533) to observed
      reference atmospheres and wind models (ISO 5878) &mdash; with interactive
      calculators, a Ruby gem, and a TypeScript library.
    </p>
    <div class="hero-actions">
      <router-link to="/calculator" class="btn btn-primary">Open Calculator</router-link>
      <a href="https://github.com/atmospheris/" target="_blank" rel="noopener" class="btn btn-outline">View on GitHub</a>
    </div>
  </HeroSection>

  <!-- Inline Calculator -->
  <section class="section">
    <div class="container">
      <div class="inline-calc animate-on-scroll">
        <h3 class="inline-calc-title">Quick Calculator</h3>
        <div class="inline-calc-input">
          <label for="home-alt-input">Altitude <span class="range-hint">(-2,000 to 80,000)</span></label>
          <div class="inline-input-composite">
            <input id="home-alt-input" type="number" v-model.number="sliderAltitude" :min="altRange.min" :max="altRange.max" :step="altRange.step" aria-label="Altitude value" />
            <div class="inline-unit-seg" role="group" aria-label="Altitude unit">
              <button :class="{ active: altUnit === 'm' }" @click="setAltUnit('m')" aria-label="Meters" aria-pressed="altUnit === 'm'">m</button>
              <button :class="{ active: altUnit === 'ft' }" @click="setAltUnit('ft')" aria-label="Feet" aria-pressed="altUnit === 'ft'">ft</button>
            </div>
          </div>
          <input type="range" v-model.number="sliderAltitude" :min="altRange.min" :max="altRange.max" :step="altRange.step" aria-label="Altitude slider" />
        </div>
        <div class="props-grid" v-if="displayProps.length">
          <div class="prop-item" v-for="p in displayProps" :key="p.label">
            <span class="prop-label">{{ p.label }}</span>
            <span class="prop-value">{{ p.value }} <span class="prop-unit">{{ p.unit }}</span></span>
          </div>
        </div>
        <div class="inline-calc-cta">
          <router-link to="/calculator" class="btn btn-outline-dark">Open Full Calculator &rarr;</router-link>
        </div>
      </div>
    </div>
  </section>

  <!-- Standards -->
  <section class="section">
    <div class="container">
      <h2 class="section-title">Standards</h2>
      <div class="standards-grid">
        <router-link to="/iso-2533" class="standard-card glass-card animate-on-scroll">
          <div class="standard-card-badge">Foundation</div>
          <h3>ISO 2533</h3>
          <p class="standard-card-subtitle">Standard Atmosphere</p>
          <p>
            The International Standard Atmosphere &mdash; a reference model defining
            temperature, pressure, density, and derived properties from
            &minus;5 km to 80 km altitude.
          </p>
          <span class="card-link">Explore ISO 2533 <span>&rarr;</span></span>
        </router-link>
        <router-link to="/iso-5878" class="standard-card glass-card animate-on-scroll">
          <div class="standard-card-badge standard-card-badge--alt">Aerospace</div>
          <h3>ISO 5878</h3>
          <p class="standard-card-subtitle">Reference Atmospheres for Aerospace Use</p>
          <p>
            Observed atmospheric conditions by latitude zone and season &mdash;
            temperature profiles, wind distributions (Rice model), and humidity
            data for real-world aerospace applications.
          </p>
          <span class="card-link">Explore ISO 5878 <span>&rarr;</span></span>
        </router-link>
      </div>
    </div>
  </section>

  <!-- Features -->
  <section class="section">
    <div class="container">
      <h2 class="section-title">Features</h2>
      <div class="features-grid">
        <FeatureCard
          :icon="featureIcons.altitude"
          title="Altitude to Properties"
          description="Calculate all 19 atmospheric properties at any altitude from -2,000 m to 80,000 m geopotential."
          link-text="Try it"
          linkTo="/calculator"
        />
        <FeatureCard
          :icon="featureIcons.pressure"
          title="Pressure to Altitude"
          description="Reverse lookup: find the altitude corresponding to any atmospheric pressure value."
          link-text="Try it"
          linkTo="/calculator"
        />
        <FeatureCard
          :icon="featureIcons.precision"
          title="Dual Precision"
          description="Normal precision for engineering or reduced precision for quick estimates, dynamically calculated per ISO 2533 formulas."
          link-text="Learn more"
          linkTo="/library"
        />
        <FeatureCard
          :icon="featureIcons.export"
          title="Data Export"
          description="Export calculated properties to YAML, XML, and other formats for integration with your tools."
          link-text="View API"
          linkTo="/library"
        />
        <FeatureCard
          :icon="featureIcons.tables"
          title="Dynamically Calculated Tables"
          description="Generate custom atmospheric property tables at any step size and altitude range, dynamically computed per the standard."
          link-text="See constants"
          linkTo="/iso-2533"
        />
        <FeatureCard
          :icon="featureIcons.units"
          title="Multiple Units"
          description="Input in meters or feet, geopotential or geometric. Results in SI and common engineering units."
          link-text="Calculator"
          linkTo="/calculator"
        />
      </div>
    </div>
  </section>

  <!-- Quick Start -->
  <section class="section section-alt">
    <div class="container">
      <h2 class="section-title">Get Started</h2>
      <div class="quickstart-grid">
        <div>
          <h3>TypeScript / JavaScript</h3>
          <p class="quickstart-desc">
            Install via npm and calculate atmospheric properties in just a few lines of TypeScript or JavaScript.
          </p>
          <div class="code-block code-dark">
            <div class="code-tab">npm install atmospheris</div>
            <pre><code>{{ tsCode }}</code></pre>
          </div>
        </div>
        <div>
          <h3>Ruby</h3>
          <p class="quickstart-desc">
            The reference implementation — a comprehensive Ruby gem for all ISA calculations.
          </p>
          <div class="code-block code-dark">
            <div class="code-tab">gem install atmospheris</div>
            <pre><code>{{ rubyCode }}</code></pre>
          </div>
        </div>
      </div>
      <div class="quickstart-cta">
        <router-link to="/library" class="btn btn-outline-dark">Full Documentation &rarr;</router-link>
      </div>
    </div>
  </section>
</template>

<style scoped>
.standards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--spacing-lg);
}

.standard-card {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: var(--color-text);
  padding: var(--spacing-lg);
}

.standard-card h3 {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-xs);
}

.standard-card-subtitle {
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  margin-bottom: var(--spacing-md);
}

.standard-card p:last-of-type {
  flex: 1;
  margin-bottom: var(--spacing-md);
}

.standard-card-badge {
  display: inline-block;
  width: fit-content;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.2em 0.6em;
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-sm);
  background: var(--color-accent-subtle);
  color: var(--color-accent-dark);
}

.standard-card-badge--alt {
  background: color-mix(in srgb, var(--color-accent) 12%, transparent);
  color: var(--color-accent);
}

.standard-card .card-link {
  margin-top: auto;
}
</style>
