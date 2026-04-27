<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSeo, buildWebApplicationSchema } from '@/composables/useSeo'
import HeroSection from '@/components/content/HeroSection.vue'
import FeatureCard from '@/components/content/FeatureCard.vue'
import { getAllProperties, roundToSigFigs, paToMbar } from 'atmospheris'

useSeo({
  title: null,
  description: 'Open-source standard atmosphere and wind models. Interactive calculators for ISO 2533 atmospheric properties and ISO 5878 wind distributions, with Ruby gem and TypeScript library.',
  path: '/',
  schema: buildWebApplicationSchema()
})

const sliderAltitude = ref(0)
const altUnit = ref('m')
const altType = ref('geopotential')

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
      type: altType.value,
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

// Atmospheric layer for current altitude
const altitudeLayer = computed(() => {
  const m = altitudeInMeters.value
  if (m < 0) return { name: 'Below Sea Level', color: '#64748b' }
  if (m < 11000) return { name: 'Troposphere', color: '#2c84bf' }
  if (m < 20000) return { name: 'Tropopause', color: '#38bdf8' }
  if (m < 32000) return { name: 'Stratosphere', color: '#7abae5' }
  if (m < 47000) return { name: 'Stratosphere (Upper)', color: '#818cf8' }
  if (m < 51000) return { name: 'Stratopause', color: '#a78bfa' }
  if (m < 71000) return { name: 'Mesosphere', color: '#6366f1' }
  return { name: 'Mesopause+', color: '#4f46e5' }
})

const featureIcons = {
  altitude: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>',
  pressure: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>',
  precision: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg>',
  wind: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.59 4.59A2 2 0 1111 8H2M12.59 19.41A2 2 0 1014 16H2M17.73 7.73A2.5 2.5 0 1119.5 12H2"/></svg>',
  export: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8"/></svg>',
  tables: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18"/></svg>',
  units: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/></svg>',
}

const tsCode = `import { getAllProperties, computeWindDerived } from "atmospheris"

// Get all properties at 10,000 m geopotential altitude
const result = getAllProperties({
  value: 10000,
  unit: "meters",
  type: "geopotential",
  precision: "normal"
})

console.log(result.temperature.celsius)  // -49.898 °C
console.log(result.pressure.mbar)        // 264.36 mbar

// Wind distribution per ISO 5878
const wind = computeWindDerived(-3.9, -1.2, 5.9)
console.log(wind.Vsc)  // 6.03 m/s — scalar mean wind speed`

const rubyCode = `require "atmospheris"

# Calculate properties at 10,000 m geopotential altitude
result = Atmospheris::Export::AltitudeAttrs.new
result.set_geopotential_altitude(10_000, :meters)
result.realize_values!

puts result.temperature_celsius   #=> -50.0 °C
puts result.pressure_mbar         #=> 264.36 mbar

# Wind distribution per ISO 5878
wind = Atmospheris::Iso5878.compute_wind_derived(-3.9, -1.2, 5.9)
puts wind.vsc  #=> 6.03 m/s`
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
      reference atmospheres, wind distributions, and humidity models
      (ISO 5878) &mdash; with interactive calculators, a Ruby gem, and a
      TypeScript library.
    </p>
    <div class="hero-actions">
      <router-link to="/calculator" class="btn btn-primary">Open Calculator</router-link>
      <a href="https://github.com/atmospheris/" target="_blank" rel="noopener" class="btn btn-outline">View on GitHub</a>
    </div>

    <template #decoration>
      <svg viewBox="0 0 260 520" class="atmosphere-column" role="img" aria-label="Atmospheric layers from sea level to 80 km">
        <defs>
          <linearGradient id="atm-tropo" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="#0ea5e9" stop-opacity="0.6"/>
          </linearGradient>
          <linearGradient id="atm-strato" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#818cf8" stop-opacity="0.25"/>
            <stop offset="100%" stop-color="#6366f1" stop-opacity="0.45"/>
          </linearGradient>
          <linearGradient id="atm-meso" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#6366f1" stop-opacity="0.4"/>
            <stop offset="100%" stop-color="#4338ca" stop-opacity="0.7"/>
          </linearGradient>
          <filter id="atm-glow">
            <feGaussianBlur stdDeviation="2" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <!-- Column background -->
        <rect x="30" y="16" width="200" height="488" rx="8" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)" stroke-width="0.5"/>

        <!-- Troposphere 0–11 km (bottom portion) -->
        <rect x="32" y="422" width="196" height="80" rx="0" fill="url(#atm-tropo)"/>
        <text x="130" y="466" text-anchor="middle" fill="rgba(255,255,255,0.85)" font-size="11" font-family="var(--font-display)" font-weight="600">Troposphere</text>
        <text x="130" y="480" text-anchor="middle" fill="rgba(255,255,255,0.45)" font-size="8" font-family="var(--font-mono)">0 – 11 km</text>

        <!-- Tropopause 11–20 km -->
        <rect x="32" y="374" width="196" height="48" fill="rgba(56,189,248,0.15)"/>
        <text x="130" y="400" text-anchor="middle" fill="rgba(255,255,255,0.6)" font-size="8" font-family="var(--font-mono)">Tropopause · 11–20 km</text>

        <!-- Stratosphere 20–47 km -->
        <rect x="32" y="220" width="196" height="154" fill="url(#atm-strato)"/>
        <text x="130" y="290" text-anchor="middle" fill="rgba(255,255,255,0.85)" font-size="11" font-family="var(--font-display)" font-weight="600">Stratosphere</text>
        <text x="130" y="304" text-anchor="middle" fill="rgba(255,255,255,0.45)" font-size="8" font-family="var(--font-mono)">20 – 47 km</text>

        <!-- Stratopause 47–51 km -->
        <rect x="32" y="194" width="196" height="26" fill="rgba(139,92,246,0.15)"/>
        <text x="130" y="210" text-anchor="middle" fill="rgba(255,255,255,0.6)" font-size="8" font-family="var(--font-mono)">Stratopause · 47–51 km</text>

        <!-- Mesosphere 51–71 km -->
        <rect x="32" y="82" width="196" height="112" fill="url(#atm-meso)"/>
        <text x="130" y="136" text-anchor="middle" fill="rgba(255,255,255,0.85)" font-size="11" font-family="var(--font-display)" font-weight="600">Mesosphere</text>
        <text x="130" y="150" text-anchor="middle" fill="rgba(255,255,255,0.45)" font-size="8" font-family="var(--font-mono)">51 – 71 km</text>

        <!-- Mesopause / Top -->
        <rect x="32" y="18" width="196" height="64" rx="6" fill="rgba(67,56,202,0.3)"/>
        <text x="130" y="38" text-anchor="middle" fill="rgba(255,255,255,0.85)" font-size="11" font-family="var(--font-display)" font-weight="600">Mesopause</text>
        <text x="130" y="52" text-anchor="middle" fill="rgba(255,255,255,0.45)" font-size="8" font-family="var(--font-mono)">71 – 80 km</text>

        <!-- Altitude markers on left -->
        <line x1="20" y1="502" x2="30" y2="502" stroke="rgba(255,255,255,0.3)" stroke-width="0.5"/>
        <text x="18" y="505" text-anchor="end" fill="rgba(255,255,255,0.35)" font-size="7" font-family="var(--font-mono)">0</text>

        <line x1="20" y1="422" x2="30" y2="422" stroke="rgba(255,255,255,0.2)" stroke-width="0.5"/>
        <text x="18" y="425" text-anchor="end" fill="rgba(255,255,255,0.25)" font-size="7" font-family="var(--font-mono)">11</text>

        <line x1="20" y1="374" x2="30" y2="374" stroke="rgba(255,255,255,0.2)" stroke-width="0.5"/>
        <text x="18" y="377" text-anchor="end" fill="rgba(255,255,255,0.25)" font-size="7" font-family="var(--font-mono)">20</text>

        <line x1="20" y1="220" x2="30" y2="220" stroke="rgba(255,255,255,0.2)" stroke-width="0.5"/>
        <text x="18" y="223" text-anchor="end" fill="rgba(255,255,255,0.25)" font-size="7" font-family="var(--font-mono)">47</text>

        <line x1="20" y1="82" x2="30" y2="82" stroke="rgba(255,255,255,0.2)" stroke-width="0.5"/>
        <text x="18" y="85" text-anchor="end" fill="rgba(255,255,255,0.25)" font-size="7" font-family="var(--font-mono)">71</text>

        <text x="18" y="10" text-anchor="end" fill="rgba(255,255,255,0.25)" font-size="7" font-family="var(--font-mono)">km</text>

        <!-- Animated altitude indicator line -->
        <rect x="230" y="422" width="3" height="80" fill="rgba(255,255,255,0.6)" rx="1" filter="url(#atm-glow)">
          <animate attributeName="y" values="502;82;502" dur="8s" repeatCount="indefinite"/>
          <animate attributeName="height" values="2;2;2" dur="8s" repeatCount="indefinite"/>
        </rect>
      </svg>
    </template>
  </HeroSection>

  <!-- Inline Calculator -->
  <section class="section">
    <div class="container">
      <div class="inline-calc animate-on-scroll">
        <div class="inline-calc-header">
          <h3 class="inline-calc-title">Quick Calculator</h3>
          <span class="layer-badge" :style="{ '--layer-color': altitudeLayer.color }">{{ altitudeLayer.name }}</span>
        </div>
        <div class="inline-calc-input">
          <label for="home-alt-input">
            Altitude
            <span class="range-hint">({{ altType === 'geopotential' ? 'H' : 'h' }}, -2,000 to 80,000)</span>
          </label>
          <div class="inline-input-composite">
            <input id="home-alt-input" type="number" v-model.number="sliderAltitude" :min="altRange.min" :max="altRange.max" :step="altRange.step" aria-label="Altitude value" />
            <div class="inline-unit-seg" role="group" aria-label="Altitude reference">
              <button :class="{ active: altType === 'geopotential' }" @click="altType = 'geopotential'" aria-label="Geopotential altitude" aria-pressed="altType === 'geopotential'">H</button>
              <button :class="{ active: altType === 'geometric' }" @click="altType = 'geometric'" aria-label="Geometric altitude" aria-pressed="altType === 'geometric'">h</button>
            </div>
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
          :icon="featureIcons.wind"
          title="Wind Distributions"
          description="Compute scalar mean wind speed and percentile speeds from observed vector components using the Rice distribution (ISO 5878)."
          link-text="Calculator"
          linkTo="/iso-5878"
        />
        <FeatureCard
          :icon="featureIcons.precision"
          title="Dual Precision"
          description="Normal precision for engineering or reduced precision for quick estimates, dynamically calculated per ISO 2533 formulas."
          link-text="Learn more"
          linkTo="/api"
        />
        <FeatureCard
          :icon="featureIcons.export"
          title="Data Export"
          description="Export calculated properties to YAML, XML, and other formats for integration with your tools."
          link-text="View API"
          linkTo="/api"
        />
        <FeatureCard
          :icon="featureIcons.tables"
          title="Dynamically Calculated Tables"
          description="Generate custom atmospheric property tables at any step size and altitude range, dynamically computed per the standard."
          link-text="See constants"
          linkTo="/iso-2533"
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
            Install via npm and calculate atmospheric properties and wind distributions in just a few lines.
          </p>
          <div class="code-block code-dark">
            <div class="code-tab">npm install atmospheris</div>
            <pre><code>{{ tsCode }}</code></pre>
          </div>
        </div>
        <div>
          <h3>Ruby</h3>
          <p class="quickstart-desc">
            The reference implementation — a comprehensive Ruby gem for ISA calculations and wind modeling.
          </p>
          <div class="code-block code-dark">
            <div class="code-tab">gem install atmospheris</div>
            <pre><code>{{ rubyCode }}</code></pre>
          </div>
        </div>
      </div>
      <div class="quickstart-cta">
        <router-link to="/api" class="btn btn-outline-dark">Full Documentation &rarr;</router-link>
      </div>
    </div>
  </section>
</template>

<style scoped>
.atmosphere-column {
  width: 100%;
  height: auto;
  filter: drop-shadow(0 0 20px rgba(44, 132, 191, 0.15));
}

.inline-calc-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.inline-input-composite {
  width: 240px;
}

.layer-badge {
  font-family: var(--font-display);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 0.2em 0.7em;
  border-radius: var(--radius-full);
  background: color-mix(in srgb, var(--layer-color) 12%, transparent);
  color: var(--layer-color);
  white-space: nowrap;
  transition: background 0.3s, color 0.3s;
}

[data-theme="dark"] .layer-badge {
  background: color-mix(in srgb, var(--layer-color) 18%, transparent);
}

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
  position: relative;
}

.standard-card h3 {
  font-family: var(--font-display);
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
  line-height: var(--line-height-relaxed);
  font-size: var(--font-size-sm);
}

.standard-card-badge {
  display: inline-block;
  width: fit-content;
  font-family: var(--font-display);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 0.2em 0.7em;
  border-radius: var(--radius-full);
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
