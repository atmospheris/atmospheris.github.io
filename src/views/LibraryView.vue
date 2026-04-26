<script setup>
import { useSeo, buildSoftwareApplicationSchema } from '@/composables/useSeo'

useSeo({
  title: 'Library Documentation',
  description: 'Atmospheris library documentation — Ruby gem and TypeScript/JavaScript package for ISO 2533 Standard Atmosphere and ISO 5878 wind distribution calculations.',
  path: '/library',
  schema: buildSoftwareApplicationSchema()
})
</script>

<template>
  <div class="content-page">
    <h1>Library Documentation</h1>
    <p class="content-lead">
      Atmospheris provides the ISO 2533 Standard Atmosphere model and ISO 5878 wind
      distribution calculations as both a Ruby gem and a TypeScript/JavaScript library.
      Both implement the complete set of atmospheric property calculations from the
      standard, covering all 19 derived properties across the full altitude range of
      &minus;2,000 m to 80,000 m, plus Rice distribution wind modeling per ISO 5878.
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
          <p class="install-note">
            Works with Node.js, browser bundlers (Vite, Webpack), and Deno.
            Full TypeScript type definitions included.
          </p>
        </div>
        <div class="install-card">
          <h3>Ruby Gem</h3>
          <div class="code-block code-dark">
            <pre><code>gem install atmospheris</code></pre>
          </div>
          <p class="install-note">
            Or add to your Gemfile: <code>gem "atmospheris"</code>.
            Requires Ruby 3.0+.
          </p>
        </div>
      </div>
    </section>

    <!-- TypeScript Quick Start -->
    <section class="section">
      <h2 class="section-title">TypeScript Quick Start</h2>
      <div class="code-block code-dark">
        <div class="code-tab">index.ts</div>
        <pre><code>import { getAllProperties, getAltitudeFromPressure, computeWindDerived } from "atmospheris"

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
console.log(alt.geopotentialAltitude.meters) // ~10000

// Wind distribution (ISO 5878)
const wind = computeWindDerived(-3.9, -1.2, 5.9)
console.log(wind.Vsc)                     // 6.03 m/s</code></pre>
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
      <p>
        Calculates all atmospheric properties at a given altitude. Returns an object with
        temperature, pressure, density, viscosity, speed of sound, and 15 additional
        derived properties &mdash; 19 properties in total, matching the three property
        groups defined in ISO 2533 Tables 5&ndash;7.
      </p>

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
  temperature: { kelvin: number; celsius: number; fahrenheit: number; rankine: number }
  temperatureRatio: number
  molecularTemperature: number
  lapseRate: number
  pressure: { pascal: number; mbar: number; mmHg: number }
  pressureRatio: number
  density: number
  densityRatio: number
  sqrtDensityRatio: number
  gravity: number
  gravityRatio: number
  speedOfSound: number
  speedOfSoundRatio: number
  dynamicViscosity: number
  dynamicViscosityRatio: number
  kinematicViscosity: number
  kinematicViscosityRatio: number
  thermalConductivity: number
  thermalConductivityRatio: number
  pressureScaleHeight: number
  specificWeight: number
  airNumberDensity: number
  meanParticleSpeed: number
  collisionFrequency: number
  meanFreePath: number
  moleVolume: number
}</code></pre>
      </div>

      <h3 class="api-subsection">TypeScript &mdash; <code>getAltitudeFromPressure(input)</code></h3>
      <p>
        Reverse lookup: finds the geopotential and geometric altitude corresponding to a
        given atmospheric pressure. This implements the hypsometrical equation from
        ISO 2533 Addendum 1:1985.
      </p>

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

      <h3 class="api-subsection">TypeScript &mdash; <code>getAltitudeFromProperty(input)</code></h3>
      <p>
        Bidirectional solver: given <em>any</em> of the 28 supported atmospheric property
        values (temperature, pressure, density, viscosity, speed of sound, etc.), finds the
        corresponding altitude and returns all properties at that altitude. Useful when you
        know a target condition (e.g. "at what altitude is the speed of sound 295 m/s?")
        rather than the altitude itself.
      </p>

      <div class="code-block code-dark">
        <pre><code>import { getAltitudeFromProperty } from "atmospheris"

// At what altitude is temperature -56.5 °C?
const result = getAltitudeFromProperty({
  mode: "property",
  property: "temperature_c",
  value: -56.5,
  precision: "normal"
})
// result.geopotentialAltitude.meters => ~11000 (tropopause)

// At what altitude is density 0.1 kg/m³?
const r2 = getAltitudeFromProperty({
  mode: "property",
  property: "density_kgm3",
  value: 0.1
})</code></pre>
      </div>
      <p>
        The <code>property</code> field accepts any of the 28 property identifiers
        (e.g. <code>"temperature_k"</code>, <code>"pressure_mbar"</code>,
        <code>"speed_of_sound_ms"</code>, <code>"dynamic_viscosity"</code>,
        <code>"air_number_density"</code>, etc.). Returns the same
        <code>AltitudeResult</code> as <code>getAllProperties</code>.
      </p>

      <h3 class="api-subsection">TypeScript &mdash; <code>computeWindDerived(vx, vy, sigmaR, options?)</code></h3>
      <p>
        Computes derived wind characteristics from observed zonal and meridional wind
        components using the Rice (circular normal) distribution model defined in
        ISO 5878 Section 5.4. Returns scalar mean wind speed, per-component standard
        deviation, and wind speeds at six percentile levels (1%, 10%, 20%, 80%, 90%, 99%).
      </p>

      <div class="code-block code-dark">
        <pre><code>import { computeWindDerived } from "atmospheris"

const wind = computeWindDerived(-3.9, -1.2, 5.9)
// wind.Vr     => 4.08 — vector mean wind magnitude
// wind.Vsc    => 6.03 — scalar mean wind speed
// wind.sigma  => 4.17 — per-component std deviation
// wind.percentiles["1"]  => { low: ~0.1, high: ~14.7 }
// wind.percentiles["10"] => { low: ~0.5, high: ~12.0 }
// wind.percentiles["20"] => { low: ~1.2, high: ~10.5 }</code></pre>
      </div>
      <p>
        For latitude zones above 20°N where the meridional component Vy is negligible,
        pass <code>{ useAbsoluteVx: true }</code> to use |Vx| as Vr directly.
      </p>

      <h3 class="api-subsection">TypeScript &mdash; <code>RiceDistribution</code></h3>
      <p>
        Object-oriented wrapper that encapsulates a Rice distribution with fixed
        parameters, providing lazy-cached PDF, CDF, quantile, mean, and percentile
        computations:
      </p>
      <div class="code-block code-dark">
        <pre><code>import { RiceDistribution } from "atmospheris"

const dist = new RiceDistribution(4.08, 5.9)
dist.mean()              // Vsc ≈ 6.03 m/s
dist.pdf(5.0)            // probability density at 5 m/s
dist.cdf(10.0)           // P(wind ≤ 10 m/s)
dist.quantile(0.99)      // wind speed exceeded on 1% of occasions
dist.percentileBounds()  // { 1: {low,high}, 10: {low,high}, 20: {low,high} }</code></pre>
      </div>

      <h3 class="api-subsection">TypeScript &mdash; <code>WindObservation</code></h3>
      <p>
        Encapsulates a single altitude-level wind observation with empirically measured
        parameters and lazily computed derived statistics:
      </p>
      <div class="code-block code-dark">
        <pre><code>import { WindObservation } from "atmospheris"

const obs = new WindObservation({
  geopotentialAltitude: 1000,
  vx: -3.9, vy: -1.2, sigmaR: 5.9
})
obs.vr                        // 4.08 — vector mean wind magnitude
obs.vsc                       // 6.03 — calculated scalar mean speed
obs.percentileBounds[1].high  // ~14.7</code></pre>
      </div>

      <h3 class="api-subsection">TypeScript &mdash; Low-level wind functions</h3>
      <p>
        The underlying mathematical functions are also exported for advanced use:
      </p>
      <div class="code-block code-dark">
        <pre><code>import {
  besselI0, besselI1,     // Modified Bessel functions (Abramowitz & Stegun)
  ricePdf, riceCdf,       // Rice distribution PDF and CDF
  riceInvCdf,             // Rice inverse CDF (quantile)
  riceMean,               // Rice analytical mean (ISO 5878 Eq. 4)
} from "atmospheris"</code></pre>
      </div>

      <h3 class="api-subsection">TypeScript &mdash; Constants &amp; Layers</h3>
      <p>
        The library exports the fundamental ISA constants and temperature layer definitions
        for direct use in calculations or display:
      </p>

      <div class="code-block code-dark">
        <pre><code>import { CONSTANTS, DERIVED_CONSTANTS, TEMPERATURE_LAYERS } from "atmospheris"

CONSTANTS.g_n         // 9.80665 m/s² — standard gravitational acceleration
CONSTANTS.T_n         // 288.15 K — standard temperature
CONSTANTS.p_n         // 101325 Pa — standard pressure
CONSTANTS.rho_n       // 1.225 kg/m³ — standard density
CONSTANTS.R_star      // 8.31432 J/(mol·K) — universal gas constant
CONSTANTS.N_A         // 6.02257e+26 mol⁻¹ — Avogadro constant
CONSTANTS.radius      // 6356766 m — nominal Earth radius
CONSTANTS.kappa       // 1.4 — adiabatic index

DERIVED_CONSTANTS.M   // ~0.028964 kg/mol — molar mass of dry air
DERIVED_CONSTANTS.R   // ~287.052 J/(kg·K) — specific gas constant

// 9 temperature layers, each with { H, T, B } (base altitude, temperature, lapse rate)
TEMPERATURE_LAYERS.forEach(l => console.log(l.H, l.T, l.B))</code></pre>
      </div>

      <h3 class="api-subsection">Ruby &mdash; <code>Atmospheris::Export::AltitudeAttrs</code></h3>
      <p>
        Sets an altitude and computes all ISA properties. Supports geopotential, geometric,
        and direct altitude input in meters or feet.
      </p>
      <div class="code-block code-dark">
        <pre><code>attrs = Atmospheris::Export::AltitudeAttrs.new
attrs.set_geopotential_altitude(10_000, :meters)
attrs.realize_values!

attrs.temperature_kelvin       # => 223.252
attrs.temperature_celsius      # => -49.898
attrs.pressure_pascal          # => 26436.0
attrs.pressure_mbar            # => 264.36
attrs.density                  # => 0.4135
attrs.speed_of_sound           # => 299.46
attrs.dynamic_viscosity        # => 1.458e-5
attrs.kinematic_viscosity      # => 3.525e-5
attrs.pressure_scale_height    # => 6581.2
attrs.mean_free_path           # => 2.372e-7</code></pre>
      </div>

      <h3 class="api-subsection">Ruby &mdash; <code>Atmospheris::Export::PressureAttrs</code></h3>
      <p>
        Sets a pressure value and performs reverse lookup to find the corresponding
        altitude via the hypsometrical equation.
      </p>
      <div class="code-block code-dark">
        <pre><code>attrs = Atmospheris::Export::PressureAttrs.new
attrs.set_pressure(264.36, :mbar)
attrs.realize_values!
attrs.geopotential_altitude_meters  # => ~10000</code></pre>
      </div>

      <h3 class="api-subsection">Ruby &mdash; <code>Atmospheris::Isa::Algorithms</code></h3>
      <p>
        Low-level calculation methods for individual ISA formulas. Useful when you need
        fine-grained control over specific equations rather than computing all properties
        at once. Methods include: temperature, pressure, density, gravity, dynamic viscosity
        (Sutherland&rsquo;s formula), kinematic viscosity, speed of sound, thermal conductivity,
        mean free path, collision frequency, and air number density.
      </p>

      <h3 class="api-subsection">Ruby &mdash; <code>Atmospheris::Iso5878.compute_wind_derived</code></h3>
      <p>
        Computes derived wind characteristics from observed zonal and meridional wind
        components using the Rice (circular normal) distribution per ISO 5878 Section 5.4.
      </p>
      <div class="code-block code-dark">
        <pre><code># Quick function API
wind = Atmospheris::Iso5878.compute_wind_derived(-3.9, -1.2, 5.9)
wind.vr     #=> 4.08 — vector mean wind magnitude
wind.vsc    #=> 6.03 — scalar mean wind speed
wind.sigma  #=> 4.17 — per-component std deviation
wind.percentiles[1].high   #=> ~14.7
wind.percentiles[10]       #=> PercentilePair(low, high)

# For zones > 20°N where Vy ≈ 0
wind = Atmospheris::Iso5878.compute_wind_derived(-3.9, 0, 5.9,
  use_absolute_vx: true
)</code></pre>
      </div>

      <h3 class="api-subsection">Ruby &mdash; <code>WindObservation</code></h3>
      <p>
        Encapsulates a single altitude-level wind observation with empirical parameters
        and lazily computed derived statistics:
      </p>
      <div class="code-block code-dark">
        <pre><code>obs = Atmospheris::Iso5878::WindObservation.new(
  geopotential_altitude: 1000,
  vx: -3.9, vy: -1.2, sigma_r: 5.9
)
obs.vr                          #=> 4.08
obs.vsc                         #=> 6.03 (calculated)
obs.percentile_bounds[1].high   #=> ~14.7
obs.derived_fields              #=> WindDerivedFields struct</code></pre>
      </div>

      <h3 class="api-subsection">Ruby &mdash; <code>RiceDistribution</code></h3>
      <p>
        Object-oriented wrapper for the Rice distribution with lazy-cached computations:
      </p>
      <div class="code-block code-dark">
        <pre><code>dist = Atmospheris::Iso5878::RiceDistribution.new(vr: 4.08, sigma_r: 5.9)
dist.mean              #=> 6.03
dist.pdf(5.0)          #=> probability density at 5 m/s
dist.cdf(10.0)         #=> P(wind ≤ 10 m/s)
dist.quantile(0.99)    #=> ~14.7
dist.percentile_bounds #=> { 1 => Pair, 10 => Pair, 20 => Pair }</code></pre>
      </div>
    </section>

    <!-- Precision Modes -->
    <section class="section">
      <h2 class="section-title">Precision Modes</h2>
      <p>
        The library supports two precision levels, matching the presentation conventions
        in ISO 2533:
      </p>
      <ul class="content-list">
        <li><strong>Normal precision</strong> &mdash; Full significant figures for engineering calculations. Matches ISO 2533 Tables 5&ndash;7.</li>
        <li><strong>Reduced precision</strong> &mdash; Fewer significant digits, matching the reduced-precision tables in ISO 2533 Tables 8&ndash;10.</li>
      </ul>
      <p>
        Both modes use the same underlying formulas; only the output rounding differs.
        The precision setting does <strong>not</strong> affect calculation accuracy &mdash;
        only the number of digits presented in the result.
      </p>
    </section>

    <!-- Property Groups -->
    <section class="section">
      <h2 class="section-title">Property Groups</h2>
      <p>
        ISO 2533 organizes atmospheric properties into three groups, which the library
        returns in a single result object:
      </p>
      <div class="prop-group-grid">
        <div class="prop-group-card">
          <h3>Group 1 &mdash; Primary</h3>
          <ul>
            <li>Geopotential &amp; geometric altitude</li>
            <li>Temperature (K, °C, °F, °R) &amp; temperature ratio</li>
            <li>Molecular temperature &amp; lapse rate</li>
            <li>Pressure (Pa, mbar, mmHg) &amp; pressure ratio</li>
            <li>Density &amp; density ratio</li>
          </ul>
        </div>
        <div class="prop-group-card">
          <h3>Group 2 &mdash; Derived (Motion)</h3>
          <ul>
            <li>Gravity &amp; gravity ratio</li>
            <li>Speed of sound &amp; speed ratio</li>
            <li>Dynamic viscosity (Sutherland&rsquo;s formula)</li>
            <li>Kinematic viscosity</li>
            <li>Mean particle speed</li>
          </ul>
        </div>
        <div class="prop-group-card">
          <h3>Group 3 &mdash; Derived (Other)</h3>
          <ul>
            <li>Specific weight</li>
            <li>Pressure scale height</li>
            <li>Thermal conductivity</li>
            <li>Air number density</li>
            <li>Collision frequency</li>
            <li>Mean free path &amp; mole volume</li>
          </ul>
        </div>
      </div>
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

<style scoped>
.install-note {
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  margin-top: var(--spacing-sm);
}

.prop-group-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: var(--spacing-lg);
  margin-top: var(--spacing-lg);
}

.prop-group-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  border-top: 3px solid var(--color-accent);
}

.prop-group-card h3 {
  font-size: var(--font-size-base);
  margin-bottom: var(--spacing-md);
}

.prop-group-card ul {
  margin: 0;
  padding-left: var(--spacing-md);
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  line-height: var(--line-height-relaxed);
}

.prop-group-card li {
  margin-bottom: var(--spacing-xs);
}
</style>
