<script setup>
import { useSeo, buildSoftwareApplicationSchema } from '@/composables/useSeo'

useSeo({
  title: 'Library Documentation',
  description: 'Atmospheris library documentation — Ruby gem and TypeScript/JavaScript package for ISO 2533 Standard Atmosphere calculations.',
  path: '/library',
  schema: buildSoftwareApplicationSchema()
})
</script>

<template>
  <div class="content-page">
    <h1>Library Documentation</h1>
    <p class="content-lead">
      Atmospheris provides the ISO 2533 Standard Atmosphere model as both a Ruby gem and a TypeScript/JavaScript library.
      Both implement the complete set of atmospheric property calculations from the standard.
    </p>

    <!-- Installation -->
    <section class="section">
      <h2 class="section-title">Installation</h2>

      <div class="install-grid">
        <div class="install-card">
          <h3>TypeScript / JavaScript</h3>
          <div class="code-block code-dark">
            <pre><code>npm install atmospheris</code></pre>
          </div>
        </div>
        <div class="install-card">
          <h3>Ruby Gem</h3>
          <div class="code-block code-dark">
            <pre><code>gem install atmospheris</code></pre>
          </div>
        </div>
      </div>
    </section>

    <!-- TypeScript Quick Start -->
    <section class="section">
      <h2 class="section-title">TypeScript Quick Start</h2>
      <div class="code-block code-dark">
        <div class="code-tab">index.ts</div>
        <pre><code>import { getAllProperties, getAltitudeFromPressure } from "atmospheris"

// Get all properties at 10,000 m geopotential altitude
const result = getAllProperties({
  value: 10000,
  unit: "meters",
  type: "geopotential",
  precision: "normal"
})

console.log(result.temperature.kelvin)    // 223.252
console.log(result.pressure.mbar)         // 264.36
console.log(result.density)               // 0.4135
console.log(result.speedOfSound)          // 299.46

// Reverse lookup: pressure to altitude
const alt = getAltitudeFromPressure({
  value: 264.36,
  unit: "mbar"
})
console.log(alt.geopotentialAltitude.meters) // ~10000</code></pre>
      </div>
    </section>

    <!-- Ruby Quick Start -->
    <section class="section">
      <h2 class="section-title">Ruby Quick Start</h2>
      <div class="code-block code-dark">
        <div class="code-tab">example.rb</div>
        <pre><code>require "atmospheris"

# Calculate all properties at a given altitude
attrs = Atmospheris::Export::AltitudeAttrs.new
attrs.set_geopotential_altitude(10_000, :meters)
attrs.realize_values!

# Access individual properties
attrs.temperature_kelvin       # => 223.252 K
attrs.temperature_celsius      # => -49.898 °C
attrs.pressure_pascal          # => 26436.0 Pa
attrs.pressure_mbar            # => 264.36 mbar
attrs.density                  # => 0.4135 kg/m³
attrs.speed_of_sound           # => 299.46 m/s</code></pre>
      </div>
    </section>

    <!-- API Reference -->
    <section class="section">
      <h2 class="section-title">API Reference</h2>

      <h3>TypeScript &mdash; <code>getAllProperties(input)</code></h3>
      <p>Calculates all atmospheric properties at a given altitude. Returns an object with temperature, pressure, density, viscosity, speed of sound, and more.</p>

      <div class="code-block code-dark">
        <div class="code-tab">types.d.ts</div>
        <pre><code>interface AltitudeInput {
  value: number          // Altitude value
  unit: "meters" | "feet"
  type: "geopotential" | "geometric"
  precision?: "normal" | "reduced"  // default: "normal"
}

interface AltitudeResult {
  geopotentialAltitude: { meters: number; feet: number }
  geometricAltitude: { meters: number; feet: number }
  temperature: { kelvin: number; celsius: number }
  pressure: { pascal: number; mbar: number; mmHg: number }
  pressureRatio: number
  density: number
  densityRatio: number
  sqrtDensityRatio: number
  gravity: number
  speedOfSound: number
  dynamicViscosity: number
  kinematicViscosity: number
  thermalConductivity: number
  pressureScaleHeight: number
  specificWeight: number
  airNumberDensity: number
  meanParticleSpeed: number
  collisionFrequency: number
  meanFreePath: number
}</code></pre>
      </div>

      <h3 class="api-subsection">TypeScript &mdash; <code>getAltitudeFromPressure(input)</code></h3>
      <p>Reverse lookup: finds the altitude corresponding to a given atmospheric pressure.</p>

      <div class="code-block code-dark">
        <pre><code>interface PressureInput {
  value: number
  unit: "mbar" | "mmHg"
  precision?: "normal" | "reduced"
}

interface PressureResult {
  geopotentialAltitude: { meters: number; feet: number }
  geometricAltitude: { meters: number; feet: number }
  pressure: { mbar: number; mmHg: number }
}</code></pre>
      </div>

      <h3 class="api-subsection">Ruby &mdash; <code>Atmospheris::Export::AltitudeAttrs</code></h3>
      <p>Sets an altitude and computes all ISA properties. Supports geopotential, geometric, and direct altitude input in meters or feet.</p>

      <h3 class="api-subsection">Ruby &mdash; <code>Atmospheris::Export::PressureAttrs</code></h3>
      <p>Sets a pressure value and performs reverse lookup to find the corresponding altitude.</p>

      <h3 class="api-subsection">Ruby &mdash; <code>Atmospheris::Isa::Algorithms</code></h3>
      <p>Low-level calculation methods for individual ISA formulas: temperature, pressure, density, gravity, viscosity, and more.</p>
    </section>

    <!-- Precision Modes -->
    <section class="section">
      <h2 class="section-title">Precision Modes</h2>
      <p>
        The library supports two precision levels, matching the presentation conventions in ISO 2533:
      </p>
      <ul class="content-list">
        <li><strong>Normal precision</strong> &mdash; Full significant figures for engineering calculations.</li>
        <li><strong>Reduced precision</strong> &mdash; Fewer significant digits, matching the reduced-precision tables in the standard.</li>
      </ul>
    </section>

    <!-- Links -->
    <section class="section">
      <h2 class="section-title">Resources</h2>
      <ul class="content-list">
        <li><a href="https://github.com/atmospheris/" target="_blank" rel="noopener">Ruby gem on GitHub</a></li>
        <li><a href="https://rubygems.org/gems/atmospheris" target="_blank" rel="noopener">atmospheris on RubyGems</a></li>
        <li><a href="https://www.npmjs.com/package/atmospheris" target="_blank" rel="noopener">atmospheris on npm</a></li>
        <li><router-link to="/calculator">Interactive Calculator</router-link></li>
        <li><router-link to="/iso-2533">ISO 2533 — Standard Atmosphere</router-link></li>
        <li><router-link to="/iso-5878">ISO 5878 — Reference Atmospheres</router-link></li>
        <li><router-link to="/symbols">Symbols &amp; Variables</router-link></li>
      </ul>
    </section>
  </div>
</template>
