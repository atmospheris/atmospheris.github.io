<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSeo, buildWebApplicationSchema } from '@/composables/useSeo'
import HeroSection from '@/components/content/HeroSection.vue'
import FeatureCard from '@/components/content/FeatureCard.vue'
import { getAllProperties, roundToSigFigs, paToMbar } from 'atmospheris'

useSeo({
  title: null,
  description: 'Interactive ISO 2533 Standard Atmosphere calculator, Ruby gem, and TypeScript library for atmospheric property computations.',
  path: '/',
  schema: buildWebApplicationSchema()
})

const sliderAltitude = ref(0)

const props = computed(() => {
  try {
    return getAllProperties({
      value: sliderAltitude.value,
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
    <p class="hero-eyebrow">Reference implementation for ISO 2533:2026</p>
    <h1 class="hero-title">
      Calculate the <span class="gradient-text">Standard Atmosphere</span>
    </h1>
    <p class="hero-description">
      Atmospheris provides the authoritative open-source implementation of the
      ISO 2533 Standard Atmosphere model, with an interactive calculator,
      Ruby gem, and TypeScript library.
    </p>
    <div class="hero-actions">
      <router-link to="/calculator" class="btn btn-primary">Open Calculator</router-link>
      <a href="https://github.com/riboseinc/atmospheris" target="_blank" rel="noopener" class="btn btn-outline">View on GitHub</a>
    </div>
  </HeroSection>

  <!-- Inline Calculator -->
  <section class="section">
    <div class="container">
      <div class="inline-calc animate-on-scroll">
        <h3 class="inline-calc-title">Quick Calculator</h3>
        <div class="inline-calc-input">
          <label>Altitude (m)</label>
          <input type="number" v-model.number="sliderAltitude" min="-2000" max="80000" step="100" />
          <input type="range" v-model.number="sliderAltitude" min="-2000" max="80000" step="100" />
          <span class="inline-calc-value">{{ sliderAltitude }} m</span>
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
          description="Normal precision for engineering or reduced precision for quick estimates, matching ISO 2533 tables."
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
          title="Full ISO Tables"
          description="Complete set of atmospheric property tables covering all temperature layers defined in the standard."
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

  <!-- Trust Badges -->
  <section class="section">
    <div class="trust-badges">
      <div class="trust-badge">
        <span class="badge-icon">&#9989;</span>
        <span>Reference implementation for ISO 2533:2026</span>
      </div>
      <div class="trust-badge">
        <span class="badge-icon">&#127961;</span>
        <span>Published by Ribose</span>
      </div>
      <div class="trust-badge">
        <span class="badge-icon">&#128220;</span>
        <span>BSD-2-Clause License</span>
      </div>
    </div>
  </section>
</template>
