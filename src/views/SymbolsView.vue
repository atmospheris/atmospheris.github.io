<script setup>
import { useSeo } from '@/composables/useSeo'

useSeo({
  title: 'Symbols & Variables',
  description: 'Mathematical symbols and variables used in the ISO 2533 Standard Atmosphere model.',
  path: '/symbols'
})

const symbols = [
  { symbol: 'g<sub>n</sub>', name: 'Standard gravity', value: '9.806 65', unit: 'm/s²', description: 'Standard gravitational acceleration at mean sea level' },
  { symbol: 'h', name: 'Geometric altitude', value: '—', unit: 'm', description: 'Altitude measured as vertical distance from mean sea level' },
  { symbol: 'H', name: 'Geopotential altitude', value: '—', unit: 'm', description: 'Gravity-adjusted altitude: H = r₀h / (r₀ + h)' },
  { symbol: 'M', name: 'Molar mass of air', value: '28.964 420', unit: 'kg/kmol', description: 'Molar mass of dry air at sea level' },
  { symbol: 'N<sub>A</sub>', name: 'Avogadro constant', value: '6.022 140 76 × 10²³', unit: 'mol⁻¹', description: 'Number of constituent particles per mole' },
  { symbol: 'p<sub>n</sub>', name: 'Standard pressure', value: '101 325', unit: 'Pa', description: 'Standard atmospheric pressure at mean sea level (1 atm)' },
  { symbol: 'R*', name: 'Universal gas constant', value: '8.314 462 618', unit: 'J/(mol·K)', description: 'Universal molar gas constant' },
  { symbol: 'R', name: 'Specific gas constant', value: '287.052 87', unit: 'J/(kg·K)', description: 'Specific gas constant for dry air: R = R*/M' },
  { symbol: 'r₀', name: 'Effective Earth radius', value: '6 356 766', unit: 'm', description: 'Effective radius of the Earth used in altitude conversion' },
  { symbol: 'T<sub>n</sub>', name: 'Standard temperature', value: '288.15', unit: 'K', description: 'Standard temperature at mean sea level (15 °C)' },
  { symbol: 't<sub>n</sub>', name: 'Standard temperature', value: '15', unit: '°C', description: 'Standard temperature at mean sea level in Celsius' },
  { symbol: 'κ (kappa)', name: 'Heat capacity ratio', value: '1.4', unit: '—', description: 'Ratio of specific heats (c<sub>p</sub>/c<sub>v</sub>) for dry air' },
  { symbol: 'ρ<sub>n</sub>', name: 'Standard density', value: '1.225', unit: 'kg/m³', description: 'Standard air density at mean sea level' },
  { symbol: 'σ (sigma)', name: 'Density ratio', value: '—', unit: '—', description: 'Relative density: ρ/ρ<sub>n</sub>' },
  { symbol: 'β<sub>s</sub>', name: 'Temperature gradient', value: '—', unit: 'K/m', description: 'Vertical temperature gradient (lapse rate) in each layer' },
]

const temperatureLayers = [
  { from: '-2 000', to: '0', beta: '-6.5 × 10⁻³', layer: 'Lower troposphere' },
  { from: '0', to: '11 000', beta: '-6.5 × 10⁻³', layer: 'Troposphere' },
  { from: '11 000', to: '20 000', beta: '0', layer: 'Tropopause (isothermal)' },
  { from: '20 000', to: '32 000', beta: '+1.0 × 10⁻³', layer: 'Lower stratosphere' },
  { from: '32 000', to: '47 000', beta: '+2.8 × 10⁻³', layer: 'Upper stratosphere' },
  { from: '47 000', to: '51 000', beta: '0', layer: 'Stratopause (isothermal)' },
  { from: '51 000', to: '71 000', beta: '-2.8 × 10⁻³', layer: 'Mesosphere' },
  { from: '71 000', to: '80 000', beta: '-2.0 × 10⁻³', layer: 'Upper mesosphere' },
]
</script>

<template>
  <div class="content-page">
    <div class="content-hero">
      <h1>Symbols & Variables</h1>
      <p>Mathematical symbols and physical constants used in the ISO 2533 Standard Atmosphere model.</p>
    </div>

    <div class="content-body">
      <!-- Key Concepts -->
      <section class="content-section">
        <h2>Geopotential vs Geometric Altitude</h2>
        <p>A critical distinction in the Standard Atmosphere is between <strong>geopotential altitude (H)</strong> and <strong>geometric altitude (h)</strong>.</p>

        <div class="formula-block">
          <p class="formula">h = r₀ · H / (r₀ − H)</p>
          <p class="formula-desc">where r₀ = 6,356,766 m (effective Earth radius)</p>
        </div>

        <p>Geopotential altitude accounts for the variation of gravitational acceleration with altitude. At sea level they are equal; at high altitudes, geometric altitude exceeds geopotential altitude. The Standard Atmosphere defines all properties as functions of geopotential altitude.</p>
      </section>

      <!-- Symbols Table -->
      <section class="content-section">
        <h2>Symbol Reference</h2>
        <div class="table-responsive">
          <table class="layer-table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Name</th>
                <th>Value</th>
                <th>Unit</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="s in symbols" :key="s.symbol">
                <td><code class="symbol" v-html="s.symbol"></code></td>
                <td>{{ s.name }}</td>
                <td><code>{{ s.value }}</code></td>
                <td>{{ s.unit }}</td>
                <td class="symbol-desc" v-html="s.description"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Temperature Layers -->
      <section class="content-section">
        <h2>Temperature Layers</h2>
        <p>The atmosphere is divided into concentric layers, each with a defined temperature gradient β<sub>s</sub> (lapse rate).</p>

        <div class="table-responsive">
          <table class="layer-table">
            <thead>
              <tr>
                <th>Layer</th>
                <th>From (m)</th>
                <th>To (m)</th>
                <th>Gradient β<sub>s</sub> (K/m)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="l in temperatureLayers" :key="l.from">
                <td>{{ l.layer }}</td>
                <td>{{ l.from }}</td>
                <td>{{ l.to }}</td>
                <td><code>{{ l.beta }}</code></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="formula-block">
          <p class="formula">T = T<sub>b</sub> + β<sub>s</sub> · (H − H<sub>b</sub>)</p>
          <p class="formula-desc">Temperature in a gradient layer</p>
        </div>

        <div class="formula-block">
          <p class="formula">T = T<sub>b</sub> (constant)</p>
          <p class="formula-desc">Temperature in an isothermal layer (β<sub>s</sub> = 0)</p>
        </div>
      </section>
    </div>
  </div>
</template>
