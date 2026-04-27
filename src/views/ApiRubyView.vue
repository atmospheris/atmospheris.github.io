<script setup>
import { useSeo, buildSoftwareApplicationSchema } from '@/composables/useSeo'

useSeo({
  title: 'Ruby API',
  description: 'Atmospheris Ruby gem API reference — the reference implementation for ISO 2533 Standard Atmosphere calculations and ISO 5878 wind distribution modeling.',
  path: '/api/ruby',
  schema: buildSoftwareApplicationSchema()
})
</script>

<template>
  <div class="content-page">
    <div class="api-page-header">
      <router-link to="/api" class="api-back-link">&larr; API Documentation</router-link>
      <h1>Ruby</h1>
      <p class="content-lead">
        The reference implementation &mdash; a comprehensive Ruby gem with object-oriented
        API, lazy computation, and full ISO coverage. Requires Ruby 3.0+.
      </p>
    </div>

    <!-- Installation -->
    <section class="section">
      <h2 class="section-title">Installation</h2>
      <div class="code-block code-dark">
        <div class="code-tab">Terminal</div>
        <pre><code>gem install atmospheris</code></pre>
      </div>
      <p class="install-note">
        Or add to your Gemfile: <code>gem "atmospheris"</code>.
        Requires Ruby 3.0+.
      </p>
    </section>

    <!-- Quick Start -->
    <section class="section">
      <h2 class="section-title">Quick Start</h2>
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

      <h3><code>Atmospheris::Export::AltitudeAttrs</code></h3>
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

      <h3 class="api-subsection"><code>Atmospheris::Export::PressureAttrs</code></h3>
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

      <h3 class="api-subsection"><code>Atmospheris::Isa::Algorithms</code></h3>
      <p>
        Low-level calculation methods for individual ISA formulas. Useful when you need
        fine-grained control over specific equations rather than computing all properties
        at once. Methods include: temperature, pressure, density, gravity, dynamic viscosity
        (Sutherland&rsquo;s formula), kinematic viscosity, speed of sound, thermal conductivity,
        mean free path, collision frequency, and air number density.
      </p>

      <h3 class="api-subsection"><code>Atmospheris::Iso5878.compute_wind_derived</code></h3>
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

      <h3 class="api-subsection"><code>WindObservation</code></h3>
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

      <h3 class="api-subsection"><code>RiceDistribution</code></h3>
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

    <!-- Links -->
    <section class="section">
      <h2 class="section-title">Resources</h2>
      <ul class="content-list">
        <li><a href="https://github.com/atmospheris/" target="_blank" rel="noopener">Ruby gem on GitHub</a></li>
        <li><a href="https://rubygems.org/gems/atmospheris" target="_blank" rel="noopener">atmospheris on RubyGems</a></li>
        <li><router-link to="/calculator">Interactive Calculator</router-link></li>
        <li><router-link to="/iso-2533">ISO 2533 &mdash; Standard Atmosphere</router-link></li>
        <li><router-link to="/iso-5878">ISO 5878 &mdash; Reference Atmospheres</router-link></li>
        <li><router-link to="/symbols">Symbols &amp; Variables</router-link></li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.api-page-header {
  margin-bottom: var(--spacing-xl);
}

.api-back-link {
  display: inline-block;
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  text-decoration: none;
  margin-bottom: var(--spacing-sm);
  transition: color var(--transition-fast);
}

.api-back-link:hover {
  color: var(--color-accent);
}

.api-page-header h1 {
  margin-bottom: var(--spacing-sm);
}

.install-note {
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  margin-top: var(--spacing-sm);
}
</style>
