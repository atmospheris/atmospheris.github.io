<script setup>
import { computed } from 'vue'
import { CONSTANTS, DERIVED_CONSTANTS, TEMPERATURE_LAYERS } from 'atmospheris'
import { useSeo } from '@/composables/useSeo'

useSeo({
  title: 'Symbols & Variables',
  description: 'Complete reference of symbols, constants, variables, and equations used in ISO 2533 (Standard Atmosphere) and ISO 5878 (Reference Atmospheres for Aerospace Use).',
  path: '/symbols'
})

// ── Standard Jump Nav ──
const standardsNav = [
  { key: 'iso-2533', label: 'ISO 2533', subtitle: 'Standard Atmosphere' },
  { key: 'iso-5878', label: 'ISO 5878', subtitle: 'Reference Atmospheres' },
]

// ══════════════════════════════════════════════════════════
//  ISO 2533 DATA
// ══════════════════════════════════════════════════════════

// ── Temperature Profile SVG ──
const SVG_W = 340, SVG_H = 540
const M = { t: 25, r: 18, b: 42, l: 52 }
const PW = SVG_W - M.l - M.r
const PH = SVG_H - M.t - M.b
const A_MIN = -2000, A_MAX = 80000, A_R = A_MAX - A_MIN
const T_MIN = 190, T_MAX = 310, T_R = T_MAX - T_MIN

const aY = h => M.t + PH * (1 - (h - A_MIN) / A_R)
const tX = t => M.l + PW * (t - T_MIN) / T_R

const profilePts = computed(() =>
  TEMPERATURE_LAYERS.map(l => ({ x: tX(l.T), y: aY(l.H), H: l.H, T: l.T, B: l.B }))
)

const layerColors = ['#f59e0b', '#eab308', '#3b82f6', '#f97316', '#ef4444', '#dc2626', '#8b5cf6', '#6366f1']
const layerNames = ['Lower Troposphere', 'Troposphere', 'Tropopause', 'Lower Stratosphere', 'Upper Stratosphere', 'Stratopause', 'Mesosphere', 'Upper Mesosphere']

const segments = computed(() => {
  const p = profilePts.value
  return p.slice(0, -1).map((a, i) => ({
    x1: a.x, y1: a.y, x2: p[i + 1].x, y2: p[i + 1].y,
    mx: (a.x + p[i + 1].x) / 2, my: (a.y + p[i + 1].y) / 2,
    name: layerNames[i], color: layerColors[i],
  }))
})

const fillPath = computed(() => {
  const p = profilePts.value
  const lx = tX(T_MIN)
  const points = p.map(pt => `L${pt.x.toFixed(1)},${pt.y.toFixed(1)}`).join(' ')
  return `M${lx},${aY(A_MIN)} ${points} L${lx},${aY(A_MAX)} Z`
})

const altGrid = [0, 10, 20, 30, 40, 50, 60, 70, 80].map(km => ({ y: aY(km * 1000), label: km }))
const tempGrid = [200, 220, 240, 260, 280, 300].map(k => ({ x: tX(k), label: k }))

// ── Layer Table ──
const layerTableData = computed(() =>
  TEMPERATURE_LAYERS.slice(0, -1).map((l, i) => ({
    num: i + 1,
    name: layerNames[i],
    color: layerColors[i],
    from: l.H,
    to: TEMPERATURE_LAYERS[i + 1].H,
    baseT: l.T,
    beta: l.B,
    iso: l.B === 0,
  }))
)

function fmtAlt(m) {
  if (m === 0) return '0'
  return (m / 1000) + ' km'
}

// ── Constants Cards ──
const constantsCards = computed(() => [
  { m: '<math><msub><mi>g</mi><mi>n</mi></msub></math>', name: 'Standard Gravity', val: CONSTANTS.g_n, unit: 'm/s\u00B2', desc: 'Standard gravitational acceleration at mean sea level' },
  { m: '<math><msub><mi>N</mi><mi>A</mi></msub></math>', name: 'Avogadro Constant', val: CONSTANTS.N_A.toExponential(4), unit: 'kmol\u207B\u00B9', desc: 'Number of particles per kilomole of substance' },
  { m: '<math><msub><mi>p</mi><mi>n</mi></msub></math>', name: 'Standard Pressure', val: CONSTANTS.p_n.toLocaleString(), unit: 'Pa', desc: 'Atmospheric pressure at mean sea level (1 atm)' },
  { m: '<math><msub><mi>T</mi><mi>n</mi></msub></math>', name: 'Standard Temperature', val: CONSTANTS.T_n, unit: 'K', desc: 'Temperature at mean sea level (15 \u00B0C)' },
  { m: '<math><msub><mi>\u03C1</mi><mi>n</mi></msub></math>', name: 'Standard Density', val: CONSTANTS.rho_n, unit: 'kg/m\u00B3', desc: 'Air density at mean sea level' },
  { m: '<math><msup><mi>R</mi><mo>*</mo></msup></math>', name: 'Universal Gas Constant', val: CONSTANTS.R_star, unit: 'J/(kmol\u00B7K)', desc: 'Universal molar gas constant' },
  { m: '<math><msub><mi>r</mi><mn>0</mn></msub></math>', name: 'Effective Earth Radius', val: CONSTANTS.radius.toLocaleString(), unit: 'm', desc: 'Nominal Earth radius for altitude conversion' },
  { m: '<math><mi>\u03BA</mi></math>', name: 'Heat Capacity Ratio', val: CONSTANTS.kappa, unit: '\u2014', desc: 'Ratio of specific heats c\u209A/c\u1D65 for dry air' },
])

const derivedCards = computed(() => [
  { m: '<math><mi>M</mi></math>', name: 'Molar Mass of Air', val: DERIVED_CONSTANTS.M.toFixed(3), unit: 'kg/kmol', desc: 'Derived: M = \u03C1\u2099R*T\u2099/p\u2099' },
  { m: '<math><mi>R</mi></math>', name: 'Specific Gas Constant', val: DERIVED_CONSTANTS.R.toFixed(2), unit: 'J/(kg\u00B7K)', desc: 'Derived: R = R*/M' },
])

// ── ISO 2533 Property Reference ──
const iso2533PropGroups = [
  {
    name: 'Altitude', color: '#3b82f6',
    props: [
      { sym: '<math><mi>H</mi></math>', label: 'Geopotential Altitude', units: 'm, ft' },
      { sym: '<math><mi>h</mi></math>', label: 'Geometric Altitude', units: 'm, ft' },
    ]
  },
  {
    name: 'Temperature', color: '#f59e0b',
    props: [
      { sym: '<math><mi>T</mi></math>', label: 'Temperature', units: 'K, \u00B0C, \u00B0F, \u00B0R' },
      { sym: '<math><mi>\u03B8</mi></math>', label: 'Temperature Ratio', units: '\u2014', note: 'T / T\u2099' },
      { sym: '<math><msub><mi>\u03B2</mi><mi>s</mi></msub></math>', label: 'Temperature Gradient', units: 'K/m', note: 'Lapse rate' },
    ]
  },
  {
    name: 'Pressure', color: '#ef4444',
    props: [
      { sym: '<math><mi>p</mi></math>', label: 'Pressure', units: 'Pa, mbar, mmHg' },
      { sym: '<math><mi>\u03B4</mi></math>', label: 'Pressure Ratio', units: '\u2014', note: 'p/p\u2099' },
    ]
  },
  {
    name: 'Density', color: '#10b981',
    props: [
      { sym: '<math><mi>\u03C1</mi></math>', label: 'Density', units: 'kg/m\u00B3' },
      { sym: '<math><mi>\u03C3</mi></math>', label: 'Density Ratio', units: '\u2014', note: '\u03C1/\u03C1\u2099' },
      { sym: '<math><msqrt><mi>\u03C3</mi></msqrt></math>', label: '\u221A Density Ratio', units: '\u2014' },
    ]
  },
  {
    name: 'Motion & Viscosity', color: '#8b5cf6',
    props: [
      { sym: '<math><mi>g</mi></math>', label: 'Gravity', units: 'm/s\u00B2' },
      { sym: '<math><mi>a</mi></math>', label: 'Speed of Sound', units: 'm/s' },
      { sym: '<math><mi>\u03BC</mi></math>', label: 'Dynamic Viscosity', units: 'Pa\u00B7s' },
      { sym: '<math><mi>\u03BD</mi></math>', label: 'Kinematic Viscosity', units: 'm\u00B2/s' },
    ]
  },
  {
    name: 'Other Properties', color: '#64748b',
    props: [
      { sym: '<math><mi>\u03BB</mi></math>', label: 'Thermal Conductivity', units: 'W/(m\u00B7K)' },
      { sym: '<math><msub><mi>H</mi><mi>p</mi></msub></math>', label: 'Pressure Scale Height', units: 'm' },
      { sym: '<math><mi>\u03B3</mi></math>', label: 'Specific Weight', units: 'N/m\u00B3' },
      { sym: '<math><mi>n</mi></math>', label: 'Air Number Density', units: 'm\u207B\u00B3' },
      { sym: '<math><mover><mi>v</mi><mo>\u00AF</mo></mover></math>', label: 'Mean Particle Speed', units: 'm/s' },
      { sym: '<math><mi>\u03C9</mi></math>', label: 'Collision Frequency', units: 's\u207B\u00B9' },
      { sym: '<math><mi>l</mi></math>', label: 'Mean Free Path', units: 'm' },
      { sym: '<math><msub><mi>V</mi><mi>m</mi></msub></math>', label: 'Mole Volume', units: 'm\u00B3/mol' },
      { sym: '<math><msub><mi>T</mi><mi>M</mi></msub></math>', label: 'Molecular Temperature', units: 'K' },
    ]
  },
]

// ══════════════════════════════════════════════════════════
//  ISO 5878 DATA
// ══════════════════════════════════════════════════════════

const iso5878WindGroups = [
  {
    name: 'Wind Vector Components', color: '#f59e0b', provenance: 'observed',
    props: [
      { sym: '<math><msub><mi>V</mi><mi>x</mi></msub></math>', label: 'Mean Zonal Wind', units: 'm/s', note: 'East\u2013west component (positive eastward)' },
      { sym: '<math><msub><mi>V</mi><mi>y</mi></msub></math>', label: 'Mean Meridional Wind', units: 'm/s', note: 'North\u2013south component (positive northward)' },
      { sym: '<math><msub><mi>\u03C3</mi><mi>r</mi></msub></math>', label: 'Vector Mean Std Deviation', units: 'm/s', note: 'Standard deviation of the vector mean wind' },
    ]
  },
  {
    name: 'Derived Wind Quantities', color: '#38bdf8', provenance: 'calculated',
    props: [
      { sym: '<math><msub><mi>V</mi><mi>r</mi></msub></math>', label: 'Vector Mean Wind Magnitude', units: 'm/s', note: 'Vr = \u221A(Vx\u00B2 + Vy\u00B2)' },
      { sym: '<math><mi>\u03C3</mi></math>', label: 'Per-Component Std Deviation', units: 'm/s', note: '\u03C3 = \u03C3r / \u221A2' },
      { sym: '<math><msub><mi>V</mi><mi>sc</mi></msub></math>', label: 'Scalar Mean Wind Speed', units: 'm/s', note: 'Expected value from Rice distribution' },
      { sym: '<math><mi>\u03B8</mi></math>', label: 'Mean Wind Direction', units: 'rad', note: 'arctan(Vy / Vx)' },
    ]
  },
  {
    name: 'Wind Distribution', color: '#6366f1', provenance: 'calculated',
    props: [
      { sym: '<math><mi>f</mi><mo>(</mo><mi>\u03BD</mi><mo>)</mo></math>', label: 'Probability Density Function', units: 's/m', note: 'Rice (circular normal) distribution' },
      { sym: '<math><mi>\u03BD</mi></math>', label: 'Wind Speed Variable', units: 'm/s', note: 'Random variable in the Rice PDF' },
      { sym: '<math><msub><mi>I</mi><mn>0</mn></msub></math>', label: 'Modified Bessel Function', units: '\u2014', note: 'Zero-order, first kind' },
      { sym: '<math><msub><mi>V</mi><mi>p</mi></msub></math>', label: 'Percentile Wind Speed', units: 'm/s', note: 'p% = {1, 10, 20, 80, 90, 99}' },
    ]
  },
]

const iso5878HumidityGroups = [
  {
    name: 'Humidity Measures', color: '#059669', provenance: 'mixed',
    props: [
      { sym: '<math><mi>r</mi></math>', label: 'Humidity Mixing Ratio', units: 'g/kg', note: 'Primary characteristic; mv / ma' },
      { sym: '<math><msup><mi>e</mi><mo>\u2032</mo></msup></math>', label: 'Vapour Pressure', units: 'hPa', note: 'Partial pressure of water vapour' },
      { sym: '<math><msup><mi>e</mi><mo>\u2032</mo></msup><msub><mi></mi><mi>w</mi></msub></math>', label: 'Saturation Vapour Pressure', units: 'hPa', note: 'Equilibrium vapour pressure' },
      { sym: '<math><msub><mi>t</mi><mi>d</mi></msub></math>', label: 'Dew-Point Temperature', units: '\u00B0C', note: 'Temperature for saturation at constant pressure' },
      { sym: '<math><mi>U</mi></math>', label: 'Relative Humidity', units: '%', note: 'U = 100 \u00D7 e\u2032 / e\u2032w' },
    ]
  },
  {
    name: 'Auxiliary Variables', color: '#64748b',
    props: [
      { sym: '<math><msub><mi>m</mi><mi>v</mi></msub></math>', label: 'Mass of Water Vapour', units: 'kg' },
      { sym: '<math><msub><mi>m</mi><mi>a</mi></msub></math>', label: 'Mass of Dry Air', units: 'kg' },
      { sym: '<math><mi>a</mi></math>', label: 'Saturation Coefficient', units: 'K', note: '7.5 K (t \u2265 0\u00B0C) or 9.5 K (t < 0\u00B0C)' },
      { sym: '<math><mi>b</mi></math>', label: 'Saturation Coefficient', units: 'K', note: '237.3 K (t \u2265 0\u00B0C) or 265.5 K (t < 0\u00B0C)' },
    ]
  },
]

const iso5878RefAtmGroups = [
  {
    name: 'Reference Atmosphere Parameters', color: '#818cf8', provenance: 'mixed',
    props: [
      { sym: '<math><mi>\u03C6</mi></math>', label: 'Latitude', units: '\u00B0', note: 'Geographic latitude of the zone' },
      { sym: '<math><msub><mi>g</mi><mn>0</mn></msub><mo>(</mo><mi>\u03C6</mi><mo>)</mo></math>', label: 'Sea-Level Gravity', units: 'm/s\u00B2', note: 'Gravity at sea level, varies by latitude' },
      { sym: '<math><msub><mi>r</mi><mi>\u03C6</mi></msub></math>', label: 'Nominal Earth Radius', units: 'm', note: 'Effective Earth radius at latitude \u03C6' },
      { sym: '<math><mi>T</mi><mo>(</mo><mi>\u03C6</mi><mo>,</mo><mi>s</mi><mo>)</mo></math>', label: 'Temperature Profile', units: 'K', note: 'By latitude zone \u03C6 and season s' },
      { sym: '<math><mi>p</mi><mo>(</mo><mi>\u03C6</mi><mo>,</mo><mi>s</mi><mo>)</mo></math>', label: 'Pressure Profile', units: 'Pa', note: 'By latitude zone \u03C6 and season s' },
      { sym: '<math><mi>\u03C1</mi><mo>(</mo><mi>\u03C6</mi><mo>,</mo><mi>s</mi><mo>)</mo></math>', label: 'Density Profile', units: 'kg/m\u00B3', note: 'By latitude zone \u03C6 and season s' },
    ]
  },
  {
    name: 'Latitude Zones & Seasons', color: '#f59e0b',
    props: [
      { sym: '<math><mn>15\u00B0</mn></math>', label: 'Tropical Zone', units: '\u2014', note: 'Annual model (no seasonal distinction)' },
      { sym: '<math><mn>30\u00B0N</mn></math>', label: 'Subtropical Zone', units: '\u2014', note: 'January & July seasonal models' },
      { sym: '<math><mn>45\u00B0N</mn></math>', label: 'Mid-Latitude Zone', units: '\u2014', note: 'January & July seasonal models' },
      { sym: '<math><mn>60\u00B0N</mn></math>', label: 'Subarctic Zone', units: '\u2014', note: 'January & July seasonal models' },
      { sym: '<math><mn>80\u00B0N</mn></math>', label: 'Arctic Zone', units: '\u2014', note: 'January & July seasonal models' },
    ]
  },
  {
    name: 'Stratospheric Regimes', color: '#ef4444', provenance: 'observed',
    props: [
      { sym: '<math><msub><mi>T</mi><mi>cold</mi></msub></math>', label: 'Cold Regime Temperature', units: 'K', note: '~223 K (60\u00B0N) or ~232 K (80\u00B0N) at 45 km' },
      { sym: '<math><msub><mi>T</mi><mi>warm</mi></msub></math>', label: 'Warm Regime Temperature', units: 'K', note: '~267 K at 45 km (60\u00B0N and 80\u00B0N)' },
    ]
  },
]

// Latitude zone surface conditions for the reference table
const refAtmConditions = [
  { zone: '15\u00B0', name: 'Tropical', g0: '9.78381', radius: '6,337.84', tDec: '299.650', tJun: '299.650', pDec: '1013.250', pJun: '1013.250' },
  { zone: '30\u00B0N', name: 'Subtropical', g0: '9.79324', radius: '6,345.65', tDec: '283.150', tJun: '297.150', pDec: '1020.500', pJun: '1014.000' },
  { zone: '45\u00B0N', name: 'Mid-latitude', g0: '9.80665', radius: '6,356.77', tDec: '272.650', tJun: '291.150', pDec: '1018.000', pJun: '1013.500' },
  { zone: '60\u00B0N', name: 'Subarctic', g0: '9.81911', radius: '6,367.10', tDec: '256.150', tJun: '282.150', pDec: '1013.000', pJun: '1010.200' },
  { zone: '80\u00B0N', name: 'Arctic', g0: '9.83051', radius: '6,376.56', tDec: '248.950', tJun: '276.650', pDec: '1013.800', pJun: '1012.000' },
]

// Wind bands for latitude-based wind data
const windBands = [
  { band: '0\u00B0\u201320\u00B0N', name: 'Tropical', lat: 'Low latitudes' },
  { band: '20\u00B0\u201340\u00B0N', name: 'Subtropical', lat: 'Mid latitudes' },
  { band: '40\u00B0\u201360\u00B0N', name: 'Temperate', lat: 'Higher mid latitudes' },
  { band: '60\u00B0\u201380\u00B0N', name: 'Subarctic/Arctic', lat: 'High latitudes' },
]
</script>

<template>
  <div class="symbols-page">
    <!-- Page Header -->
    <header class="container symbols-header">
      <h1>Symbols &amp; Variables</h1>
      <p class="content-lead">
        Complete reference of symbols, physical constants, and variables
        used in ISO 2533 (Standard Atmosphere) and ISO 5878 (Reference Atmospheres for Aerospace Use).
      </p>

      <!-- Standard Jump Nav -->
      <nav class="standards-jump" aria-label="Jump to standard">
        <a v-for="s in standardsNav" :key="s.key" :href="'#' + s.key" class="standard-jump-link">
          <span class="standard-jump-label">{{ s.label }}</span>
          <span class="standard-jump-sub">{{ s.subtitle }}</span>
        </a>
      </nav>
    </header>

    <!-- ═══════════════════════════════════════════════════ -->
    <!--  ISO 2533                                          -->
    <!-- ═══════════════════════════════════════════════════ -->
    <div id="iso-2533" class="standard-section">
      <div class="container">
        <div class="standard-section-header">
          <span class="standard-badge standard-badge--2533">ISO 2533</span>
          <h2>Standard Atmosphere</h2>
          <p>A deterministic model defining temperature, pressure, density, and derived properties from &minus;5 km to 80 km altitude.</p>
        </div>
      </div>

      <!-- Temperature Profile -->
      <section class="section section-profile">
        <div class="container">
          <h3 class="section-title">Atmosphere Layers</h3>
          <p class="section-desc">
            The Standard Atmosphere divides the atmosphere into layers, each with a defined
            temperature gradient <math><msub><mi>&beta;</mi><mi>s</mi></msub></math>.
            The profile below shows how temperature varies with altitude.
          </p>
          <div class="profile-grid">
            <!-- SVG Diagram -->
            <div class="profile-chart">
              <svg
                :viewBox="`0 0 ${SVG_W} ${SVG_H}`"
                class="profile-svg"
                role="img"
                aria-label="Standard Atmosphere temperature profile: temperature versus altitude from 0 to 80 km"
              >
                <defs>
                  <linearGradient id="profile-fill-grad" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.12" />
                    <stop offset="40%" stop-color="#ef4444" stop-opacity="0.08" />
                    <stop offset="100%" stop-color="#6366f1" stop-opacity="0.12" />
                  </linearGradient>
                  <filter id="profile-glow">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                <!-- Filled area -->
                <path :d="fillPath" fill="url(#profile-fill-grad)" />

                <!-- Grid: altitude (horizontal) -->
                <line v-for="g in altGrid" :key="'a' + g.label"
                  :x1="M.l" :y1="g.y" :x2="SVG_W - M.r" :y2="g.y"
                  class="svg-grid" />
                <!-- Grid: temperature (vertical) -->
                <line v-for="g in tempGrid" :key="'t' + g.label"
                  :x1="g.x" :y1="M.t" :x2="g.x" :y2="SVG_H - M.b"
                  class="svg-grid" />

                <!-- Profile line (glow + colored segments) -->
                <g filter="url(#profile-glow)">
                  <line v-for="(s, i) in segments" :key="'s' + i"
                    :x1="s.x1" :y1="s.y1" :x2="s.x2" :y2="s.y2"
                    :stroke="s.color" class="svg-segment" />
                </g>
                <!-- Crisp overlay without glow -->
                <line v-for="(s, i) in segments" :key="'sc' + i"
                  :x1="s.x1" :y1="s.y1" :x2="s.x2" :y2="s.y2"
                  :stroke="s.color" class="svg-segment svg-segment-crisp" />

                <!-- Data points -->
                <circle v-for="(p, i) in profilePts" :key="'p' + i"
                  :cx="p.x" :cy="p.y" r="3.5" class="svg-point">
                  <title>{{ (p.H / 1000).toFixed(1) }} km &mdash; {{ p.T.toFixed(2) }} K</title>
                </circle>

                <!-- Axes -->
                <line :x1="M.l" :y1="M.t" :x2="M.l" :y2="SVG_H - M.b" class="svg-axis" />
                <line :x1="M.l" :y1="SVG_H - M.b" :x2="SVG_W - M.r" :y2="SVG_H - M.b" class="svg-axis" />

                <!-- Altitude labels (Y-axis) -->
                <text v-for="g in altGrid" :key="'al' + g.label"
                  :x="M.l - 6" :y="g.y + 3.5"
                  class="svg-label svg-label-y">{{ g.label }}</text>

                <!-- Temperature labels (X-axis) -->
                <text v-for="g in tempGrid" :key="'tl' + g.label"
                  :x="g.x" :y="SVG_H - M.b + 16"
                  class="svg-label svg-label-x">{{ g.label }}</text>

                <!-- Axis titles -->
                <text :x="(M.l + SVG_W - M.r) / 2" :y="SVG_H - 3" class="svg-axis-title">Temperature (K)</text>
                <text
                  :x="10" :y="SVG_H / 2"
                  class="svg-axis-title svg-axis-title-y"
                  :transform="`rotate(-90, 10, ${SVG_H / 2})`"
                >Altitude (km)</text>
              </svg>
            </div>

            <!-- Layer Table -->
            <div class="profile-table">
              <div class="table-responsive">
                <table class="layer-ref-table">
                  <thead>
                    <tr>
                      <th class="th-dot"></th>
                      <th>Layer</th>
                      <th>Altitude Range</th>
                      <th><math><mi>T</mi></math> (K)</th>
                      <th><math><msub><mi>&beta;</mi><mi>s</mi></msub></math></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="l in layerTableData" :key="l.num">
                      <td><span class="layer-dot" :style="{ background: l.color }"></span></td>
                      <td class="layer-name">{{ l.name }}</td>
                      <td class="layer-alt">{{ fmtAlt(l.from) }} &ndash; {{ fmtAlt(l.to) }}</td>
                      <td class="layer-temp">{{ l.baseT }}</td>
                      <td class="layer-beta">
                        <span v-if="l.iso" class="iso-badge">Isothermal</span>
                        <code v-else>{{ l.beta > 0 ? '+' : '' }}{{ (l.beta * 1000).toFixed(1) }} &times; 10&minus;3</code>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Fundamental Constants -->
      <section class="section">
        <div class="container">
          <div class="section-narrow">
            <h3 class="section-title">Fundamental Constants</h3>
            <p>
              Fixed physical and conventional values that define the Standard Atmosphere.
              All ISA calculations derive from these constants.
            </p>
          </div>
          <div class="constants-grid">
            <div v-for="c in constantsCards" :key="c.name" class="const-card">
              <div class="const-symbol" v-html="c.m"></div>
              <div class="const-body">
                <span class="const-name">{{ c.name }}</span>
                <span class="const-value">{{ c.val }} <span class="const-unit">{{ c.unit }}</span></span>
                <span class="const-desc">{{ c.desc }}</span>
              </div>
            </div>
          </div>

          <div class="section-narrow">
            <h4 class="subsection-title">Derived Constants</h4>
          </div>
          <div class="constants-grid constants-grid--derived">
            <div v-for="c in derivedCards" :key="c.name" class="const-card const-card--derived">
              <div class="const-symbol" v-html="c.m"></div>
              <div class="const-body">
                <span class="const-name">{{ c.name }}</span>
                <span class="const-value">{{ c.val }} <span class="const-unit">{{ c.unit }}</span></span>
                <span class="const-desc">{{ c.desc }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ISO 2533 Property Reference -->
      <section class="section section-alt">
        <div class="container">
          <div class="section-narrow">
            <h3 class="section-title">Computed Properties</h3>
            <p>
              All atmospheric properties calculable by the model, organized by category.
              Each property is available at any altitude within the model range (&minus;5 km to 80 km).
            </p>
          </div>
          <div class="prop-groups">
            <div v-for="g in iso2533PropGroups" :key="g.name" class="prop-group">
              <div class="prop-group-header" :style="{ '--group-color': g.color }">
                <span class="prop-group-dot"></span>
                <h4>{{ g.name }}</h4>
                <span class="prop-group-count">{{ g.props.length }}</span>
              </div>
              <div class="prop-group-list">
                <div v-for="p in g.props" :key="p.label" class="prop-item">
                  <span class="prop-sym" v-html="p.sym"></span>
                  <span class="prop-label">{{ p.label }}</span>
                  <span class="prop-units">{{ p.units }}</span>
                  <span v-if="p.note" class="prop-note">{{ p.note }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ISO 2533 Key Equations -->
      <section class="section">
        <div class="container">
          <div class="section-narrow">
            <h3 class="section-title">Key Equations</h3>
            <p>
              The fundamental relationships used in the Standard Atmosphere.
              For complete derivation details, see the
              <router-link to="/iso-2533">ISO 2533</router-link> page.
            </p>

            <h4>Geopotential &harr; Geometric Altitude</h4>
            <p>
              Geopotential altitude <math><mi>H</mi></math> accounts for gravity variation
              with height, while geometric altitude <math><mi>h</mi></math> is the physical
              distance from sea level. At sea level they are equal; at high altitudes,
              geometric exceeds geopotential.
            </p>
            <div class="math-block">
              <math display="block">
                <mtable>
                  <mtr>
                    <mtd>
                      <mrow>
                        <mi>H</mi>
                        <mo>=</mo>
                        <mfrac>
                          <mrow><msub><mi>r</mi><mn>0</mn></msub><mo>&middot;</mo><mi>h</mi></mrow>
                          <mrow><msub><mi>r</mi><mn>0</mn></msub><mo>+</mo><mi>h</mi></mrow>
                        </mfrac>
                      </mrow>
                    </mtd>
                    <mtd><mtext>&nbsp; geometric &rarr; geopotential</mtext></mtd>
                  </mtr>
                  <mtr>
                    <mtd>
                      <mrow>
                        <mi>h</mi>
                        <mo>=</mo>
                        <mfrac>
                          <mrow><msub><mi>r</mi><mn>0</mn></msub><mo>&middot;</mo><mi>H</mi></mrow>
                          <mrow><msub><mi>r</mi><mn>0</mn></msub><mo>&minus;</mo><mi>H</mi></mrow>
                        </mfrac>
                      </mrow>
                    </mtd>
                    <mtd><mtext>&nbsp; geopotential &rarr; geometric</mtext></mtd>
                  </mtr>
                </mtable>
              </math>
            </div>

            <h4 class="subsection-title">Temperature</h4>
            <p>
              In gradient layers, temperature varies linearly; in isothermal layers it remains constant.
            </p>
            <div class="math-block">
              <math display="block">
                <mtable>
                  <mtr>
                    <mtd>
                      <mrow>
                        <mi>T</mi><mo>(</mo><mi>H</mi><mo>)</mo>
                        <mo>=</mo>
                        <msub><mi>T</mi><mi>b</mi></msub>
                        <mo>+</mo>
                        <msub><mi>&beta;</mi><mi>s</mi></msub>
                        <mo>&middot;</mo>
                        <mo>(</mo><mi>H</mi><mo>&minus;</mo><msub><mi>H</mi><mi>b</mi></msub><mo>)</mo>
                      </mrow>
                    </mtd>
                    <mtd><mtext>&nbsp; gradient layer</mtext></mtd>
                  </mtr>
                  <mtr>
                    <mtd>
                      <mrow><mi>T</mi><mo>(</mo><mi>H</mi><mo>)</mo><mo>=</mo><msub><mi>T</mi><mi>b</mi></msub></mrow>
                    </mtd>
                    <mtd><mtext>&nbsp; isothermal layer</mtext></mtd>
                  </mtr>
                </mtable>
              </math>
            </div>

            <h4 class="subsection-title">Ideal Gas Law</h4>
            <p>Density is derived from pressure and temperature via the ideal gas equation:</p>
            <div class="math-block">
              <math display="block">
                <mrow>
                  <mi>&rho;</mi>
                  <mo>=</mo>
                  <mfrac><mi>p</mi><mrow><mi>R</mi><mo>&middot;</mo><mi>T</mi></mrow></mfrac>
                </mrow>
              </math>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- ═══════════════════════════════════════════════════ -->
    <!--  ISO 5878                                          -->
    <!-- ═══════════════════════════════════════════════════ -->
    <div id="iso-5878" class="standard-section standard-section--alt">
      <div class="container">
        <div class="standard-section-header">
          <span class="standard-badge standard-badge--5878">ISO 5878</span>
          <h2>Reference Atmospheres for Aerospace Use</h2>
          <p>Observed atmospheric conditions by latitude zone and season &mdash; temperature profiles, wind distributions (Rice model), and humidity data for real-world aerospace applications.</p>
        </div>
      </div>

      <!-- Wind Distribution Symbols -->
      <section class="section">
        <div class="container">
          <div class="section-narrow">
            <h3 class="section-title">Wind Distribution</h3>
            <p>
              ISO 5878 models wind speed distributions using the <strong>circular normal (Rice) distribution</strong>.
              Wind is characterized by its vector components and the statistical spread around the mean.
            </p>
          </div>
          <div class="prop-groups">
            <div v-for="g in iso5878WindGroups" :key="g.name" class="prop-group">
              <div class="prop-group-header" :style="{ '--group-color': g.color }">
                <span class="prop-group-dot"></span>
                <h4>{{ g.name }}</h4>
                <span class="prop-group-count">{{ g.props.length }}</span>
                <span v-if="g.provenance === 'observed'" class="provenance-badge provenance-observed prop-group-provenance">Observed</span>
                <span v-else-if="g.provenance === 'calculated'" class="provenance-badge provenance-calculated prop-group-provenance">Calculated</span>
              </div>
              <div class="prop-group-list">
                <div v-for="p in g.props" :key="p.label" class="prop-item">
                  <span class="prop-sym" v-html="p.sym"></span>
                  <span class="prop-label">{{ p.label }}</span>
                  <span class="prop-units">{{ p.units }}</span>
                  <span v-if="p.note" class="prop-note">{{ p.note }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Wind Key Equations -->
          <div class="section-narrow" style="margin-top: var(--spacing-2xl);">
            <h4 class="subsection-title">Key Equations</h4>

            <h5 class="eq-heading">Vector mean wind magnitude</h5>
            <div class="math-block">
              <math display="block">
                <mrow>
                  <msub><mi>V</mi><mi>r</mi></msub>
                  <mo>=</mo>
                  <msqrt><mrow><msubsup><mi>V</mi><mi>x</mi><mn>2</mn></msubsup><mo>+</mo><msubsup><mi>V</mi><mi>y</mi><mn>2</mn></msubsup></mrow></msqrt>
                </mrow>
              </math>
            </div>

            <h5 class="eq-heading">Rice probability density function</h5>
            <div class="math-block">
              <math display="block">
                <mrow>
                  <mi>f</mi><mo>(</mo><mi>&nu;</mi><mo>)</mo>
                  <mo>=</mo>
                  <mfrac>
                    <mrow><mn>2</mn><mi>&nu;</mi></mrow>
                    <msup><mi>&sigma;</mi><mi>r</mi></msup>
                  </mfrac>
                  <mi>exp</mi>
                  <mo>(</mo>
                  <mfrac>
                    <mrow><mo>&minus;</mo><mo>(</mo><msup><mi>&nu;</mi><mn>2</mn></msup><mo>+</mo><msup><mi>V</mi><mi>r</mi></msup><mo>)</mo></mrow>
                    <msup><mi>&sigma;</mi><mi>r</mi></msup>
                  </mfrac>
                  <mo>)</mo>
                  <mo>&times;</mo>
                  <msub><mi>I</mi><mn>0</mn></msub>
                  <mo>(</mo>
                  <mfrac>
                    <mrow><mn>2</mn><mi>&nu;</mi><msub><mi>V</mi><mi>r</mi></msub></mrow>
                    <msup><mi>&sigma;</mi><mi>r</mi></msup>
                  </mfrac>
                  <mo>)</mo>
                </mrow>
              </math>
            </div>

            <h5 class="eq-heading">Simplification for zones above 20&deg;N</h5>
            <p>
              When <math><msub><mi>V</mi><mi>y</mi></msub></math> does not exceed 6% of
              <math><msub><mi>V</mi><mi>x</mi></msub></math>, it is assumed that
              <math><msub><mi>V</mi><mi>y</mi></msub><mo>=</mo><mn>0</mn></math>, so:
            </p>
            <div class="math-block">
              <math display="block">
                <mrow>
                  <msub><mi>V</mi><mi>r</mi></msub>
                  <mo>=</mo>
                  <mo>|</mo><msub><mi>V</mi><mi>x</mi></msub><mo>|</mo>
                </mrow>
              </math>
            </div>
          </div>
        </div>
      </section>

      <!-- Humidity Symbols -->
      <section class="section section-alt">
        <div class="container">
          <div class="section-narrow">
            <h3 class="section-title">Humidity</h3>
            <p>
              ISO 5878 provides humidity profiles for each latitude zone and seasonal model.
              The <strong>humidity mixing ratio</strong> is the primary characteristic because
              it remains constant during vertical or horizontal air movements unless condensation
              or evaporation occurs.
            </p>
          </div>
          <div class="prop-groups">
            <div v-for="g in iso5878HumidityGroups" :key="g.name" class="prop-group">
              <div class="prop-group-header" :style="{ '--group-color': g.color }">
                <span class="prop-group-dot"></span>
                <h4>{{ g.name }}</h4>
                <span class="prop-group-count">{{ g.props.length }}</span>
                <span v-if="g.provenance === 'mixed'" class="provenance-badge provenance-observed prop-group-provenance">Observed + Calculated</span>
              </div>
              <div class="prop-group-list">
                <div v-for="p in g.props" :key="p.label" class="prop-item">
                  <span class="prop-sym" v-html="p.sym"></span>
                  <span class="prop-label">{{ p.label }}</span>
                  <span class="prop-units">{{ p.units }}</span>
                  <span v-if="p.note" class="prop-note">{{ p.note }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Humidity Key Equations -->
          <div class="section-narrow" style="margin-top: var(--spacing-2xl);">
            <h4 class="subsection-title">Key Equations</h4>

            <h5 class="eq-heading">Humidity mixing ratio</h5>
            <div class="math-block">
              <math display="block">
                <mrow>
                  <mi>r</mi>
                  <mo>=</mo>
                  <mfrac>
                    <msub><mi>m</mi><mi>v</mi></msub>
                    <msub><mi>m</mi><mi>a</mi></msub>
                  </mfrac>
                </mrow>
              </math>
            </div>

            <h5 class="eq-heading">Vapour pressure from mixing ratio</h5>
            <div class="math-block">
              <math display="block">
                <mrow>
                  <msup><mi>e</mi><mo>&prime;</mo></msup>
                  <mo>=</mo>
                  <mfrac><mi>r</mi><mrow><mn>621.98</mn><mo>+</mo><mi>r</mi></mrow></mfrac>
                  <mo>&times;</mo><mi>p</mi>
                </mrow>
              </math>
            </div>

            <h5 class="eq-heading">Saturation vapour pressure</h5>
            <p>For &minus;20&deg;C &lt; <em>t</em> &lt; 30&deg;C:</p>
            <div class="math-block">
              <math display="block">
                <mrow>
                  <msup><mi>e</mi><mo>&prime;</mo></msup><msub><mi></mi><mi>w</mi></msub>
                  <mo>=</mo>
                  <mn>6.107</mn>
                  <mo>&times;</mo>
                  <msup><mn>10</mn><mrow><mo>(</mo><mi>a</mi><mo>&middot;</mo><mi>t</mi><mo>)</mo><mo>/</mo><mo>(</mo><mi>b</mi><mo>+</mo><mi>t</mi><mo>)</mo></mrow></msup>
                </mrow>
              </math>
            </div>

            <h5 class="eq-heading">Relative humidity</h5>
            <div class="math-block">
              <math display="block">
                <mrow>
                  <mi>U</mi><mo>=</mo><mn>100</mn><mo>&times;</mo>
                  <mfrac><msup><mi>e</mi><mo>&prime;</mo></msup><mrow><msup><mi>e</mi><mo>&prime;</mo></msup><msub><mi></mi><mi>w</mi></msub></mrow></mfrac>
                </mrow>
              </math>
            </div>
          </div>
        </div>
      </section>

      <!-- Reference Atmosphere Parameters -->
      <section class="section">
        <div class="container">
          <div class="section-narrow">
            <h3 class="section-title">Reference Atmosphere Parameters</h3>
            <p>
              Unlike ISO 2533's single global model, ISO 5878 provides separate atmospheric
              profiles for five latitude zones, each with seasonal (January/July) variations.
              The following parameters define the surface conditions for each zone.
            </p>
          </div>

          <div class="prop-groups">
            <div v-for="g in iso5878RefAtmGroups" :key="g.name" class="prop-group">
              <div class="prop-group-header" :style="{ '--group-color': g.color }">
                <span class="prop-group-dot"></span>
                <h4>{{ g.name }}</h4>
                <span class="prop-group-count">{{ g.props.length }}</span>
                <span v-if="g.provenance === 'mixed'" class="provenance-badge provenance-calculated prop-group-provenance">Calculated + Observed</span>
                <span v-else-if="g.provenance === 'observed'" class="provenance-badge provenance-observed prop-group-provenance">Observed</span>
              </div>
              <div class="prop-group-list">
                <div v-for="p in g.props" :key="p.label" class="prop-item">
                  <span class="prop-sym" v-html="p.sym"></span>
                  <span class="prop-label">{{ p.label }}</span>
                  <span class="prop-units">{{ p.units }}</span>
                  <span v-if="p.note" class="prop-note">{{ p.note }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Surface Conditions Reference Table -->
          <div class="section-narrow" style="margin-top: var(--spacing-2xl);">
            <h4 class="subsection-title">Surface Conditions by Latitude Zone</h4>
            <p>
              <span class="provenance-badge provenance-calculated">Calculated</span>
              <math><msub><mi>g</mi><mn>0</mn></msub></math> and
              <math><msub><mi>r</mi><mi>&phi;</mi></msub></math>
              from geophysical formulae.
              <span class="provenance-badge provenance-observed">Observed</span>
              Temperature and pressure from meteorological station data.
            </p>
          </div>
          <div class="table-responsive">
            <table class="layer-ref-table">
              <thead>
                <tr>
                  <th>Zone</th>
                  <th>Name</th>
                  <th class="text-right"><math><msub><mi>g</mi><mn>0</mn></msub></math> (m/s&sup2;)</th>
                  <th class="text-right"><math><msub><mi>r</mi><mi>&phi;</mi></msub></math> (m)</th>
                  <th class="text-right"><math><mi>T</mi></math> Dec/Jan (K)</th>
                  <th class="text-right"><math><mi>T</mi></math> Jun/Jul (K)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in refAtmConditions" :key="row.zone">
                  <td class="layer-name">{{ row.zone }}</td>
                  <td>{{ row.name }}</td>
                  <td class="text-right">{{ row.g0 }}</td>
                  <td class="text-right">{{ row.radius }}</td>
                  <td class="text-right">{{ row.tDec }}</td>
                  <td class="text-right">{{ row.tJun }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Wind Latitude Bands -->
          <div class="section-narrow" style="margin-top: var(--spacing-2xl);">
            <h4 class="subsection-title">Wind Data Latitude Bands</h4>
            <p>
              Wind characteristic data is organized into four latitude bands
              (distinct from the five zones used for temperature and pressure profiles).
            </p>
          </div>
          <div class="table-responsive">
            <table class="layer-ref-table">
              <thead>
                <tr>
                  <th>Band</th>
                  <th>Name</th>
                  <th>Coverage</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="b in windBands" :key="b.band">
                  <td class="layer-name">{{ b.band }}</td>
                  <td>{{ b.name }}</td>
                  <td>{{ b.lat }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>

    <!-- CTA -->
    <section class="section">
      <div class="container">
        <div class="section-narrow">
          <div class="cta-card">
            <h2>Next Steps</h2>
            <p>
              Use these symbols in the interactive calculator, explore the full
              standard documentation, or integrate the library into your project.
            </p>
            <div class="cta-links">
              <router-link to="/calculator" class="btn btn-primary">Open Calculator</router-link>
              <router-link to="/iso-2533" class="btn btn-outline">ISO 2533</router-link>
              <router-link to="/iso-5878" class="btn btn-outline">ISO 5878</router-link>
              <router-link to="/library" class="btn btn-outline">Library Docs</router-link>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ── Page Layout ── */
.symbols-page {
  padding-top: calc(var(--header-height) + var(--spacing-2xl));
  padding-bottom: var(--spacing-3xl);
}

.symbols-header {
  padding: var(--spacing-3xl) clamp(1rem, 4vw, 2rem) 0;
  max-width: 780px;
}

.symbols-header h1 {
  position: relative;
  display: inline-block;
  margin-bottom: var(--spacing-lg);
}

.symbols-header h1::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 0;
  width: 56px;
  height: 3px;
  background: var(--hero-gradient);
  border-radius: 2px;
}

.section-narrow {
  max-width: 780px;
}

.section-desc {
  color: var(--color-text-light);
  max-width: 65ch;
}

/* ── Standards Jump Nav ── */
.standards-jump {
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-xl);
}

.standard-jump-link {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  text-decoration: none;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
  flex: 1;
}

.standard-jump-link:hover {
  border-color: var(--color-accent);
  box-shadow: var(--shadow-sm);
  color: var(--color-accent);
}

.standard-jump-label {
  font-family: var(--font-display);
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-base);
}

.standard-jump-sub {
  font-size: var(--font-size-xs);
  color: var(--color-text-light);
}

/* ── Standard Section ── */
.standard-section-header {
  max-width: 780px;
  padding: var(--spacing-2xl) 0 0;
}

.standard-section-header h2 {
  border: none;
  padding: 0;
  margin-bottom: var(--spacing-sm);
}

.standard-section-header p {
  color: var(--color-text-light);
}

.standard-badge {
  display: inline-block;
  font-family: var(--font-display);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 0.2em 0.7em;
  border-radius: var(--radius-full);
  margin-bottom: var(--spacing-sm);
}

.standard-badge--2533 {
  background: var(--color-accent-subtle);
  color: var(--color-accent-dark);
}

[data-theme="dark"] .standard-badge--2533 {
  background: rgba(122, 186, 229, 0.15);
  color: var(--color-accent-light);
}

.standard-badge--5878 {
  background: rgba(5, 150, 105, 0.10);
  color: #059669;
}

[data-theme="dark"] .standard-badge--5878 {
  background: rgba(52, 211, 153, 0.12);
  color: #34d399;
}

.standard-section--alt {
  border-top: 2px solid var(--color-border);
}

.standard-section--alt .standard-section-header {
  padding-top: var(--spacing-3xl);
}

/* ── Equation Headings ── */
.eq-heading {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  margin-top: var(--spacing-lg);
  margin-bottom: var(--spacing-sm);
  color: var(--color-text-light);
}

/* ── Temperature Profile Section ── */
.section-profile {
  background: linear-gradient(180deg, var(--color-surface-elevated) 0%, var(--color-background) 100%);
  border-top: 1px solid var(--color-border);
}

.profile-grid {
  display: grid;
  grid-template-columns: minmax(260px, 1fr) minmax(320px, 1.3fr);
  gap: var(--spacing-xl);
  align-items: start;
  margin-top: var(--spacing-xl);
}

.profile-chart {
  position: sticky;
  top: calc(var(--header-height) + var(--spacing-lg));
}

.profile-svg {
  width: 100%;
  height: auto;
  display: block;
}

.svg-grid {
  stroke: var(--color-border);
  stroke-width: 0.5;
  stroke-dasharray: 3 3;
  opacity: 0.7;
}

.svg-axis {
  stroke: var(--color-text-light);
  stroke-width: 1;
  fill: none;
}

.svg-segment {
  stroke-width: 2.5;
  stroke-linecap: round;
}

.svg-segment-crisp {
  stroke-width: 2;
}

.svg-point {
  fill: var(--color-surface);
  stroke: var(--color-text);
  stroke-width: 1.5;
  transition: r 0.15s ease;
}

.svg-point:hover {
  r: 5;
}

.svg-label {
  font-family: var(--font-mono);
  font-size: 9px;
  fill: var(--color-text-light);
  user-select: none;
}

.svg-label-y {
  text-anchor: end;
}

.svg-label-x {
  text-anchor: middle;
}

.svg-axis-title {
  font-family: var(--font-sans);
  font-size: 10px;
  fill: var(--color-text-light);
  text-anchor: middle;
  font-weight: var(--font-weight-medium);
}

/* ── Layer Reference Table ── */
.layer-ref-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--font-size-sm);
}

.layer-ref-table th {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-text-light);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-bottom: 2px solid var(--color-border);
  text-align: left;
  white-space: nowrap;
}

.th-dot {
  width: 20px;
}

.layer-ref-table td {
  padding: var(--spacing-sm);
  border-bottom: 1px solid var(--color-border-subtle);
  vertical-align: middle;
}

.layer-name {
  font-weight: var(--font-weight-medium);
  white-space: nowrap;
}

.layer-alt {
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  white-space: nowrap;
}

.layer-temp {
  font-family: var(--font-mono);
}

.layer-beta code {
  font-size: var(--font-size-xs);
}

.layer-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: var(--radius-full);
}

.iso-badge {
  display: inline-block;
  font-family: var(--font-sans);
  font-size: var(--font-size-xs);
  padding: 0.15em 0.55em;
  border-radius: var(--radius-full);
  background: var(--color-accent-subtle);
  color: var(--color-accent-dark);
  font-weight: var(--font-weight-medium);
  white-space: nowrap;
}

[data-theme="dark"] .iso-badge {
  background: rgba(122, 186, 229, 0.15);
  color: var(--color-accent-light);
}

/* ── Constants Grid ── */
.constants-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--spacing-md);
  margin-top: var(--spacing-xl);
}

.constants-grid--derived {
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  margin-top: var(--spacing-md);
}

.const-card {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-left: 3px solid var(--color-accent);
  border-radius: var(--radius-md);
  transition: box-shadow var(--transition-fast), border-color var(--transition-fast);
}

.const-card:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--color-accent);
}

.const-card--derived {
  border-left-color: var(--color-accent-warm);
}

.const-card--derived:hover {
  border-color: var(--color-accent-warm);
}

.const-symbol {
  font-size: 1.3rem;
  min-width: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-accent);
  padding-top: 2px;
}

.const-body {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.const-name {
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-sm);
}

.const-value {
  font-family: var(--font-mono);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.const-unit {
  color: var(--color-text-light);
  font-weight: var(--font-weight-normal);
}

.const-desc {
  font-size: var(--font-size-xs);
  color: var(--color-text-light);
  line-height: var(--line-height-normal);
}

/* ── Subsection Title ── */
.subsection-title {
  font-size: var(--font-size-xl);
  margin-top: var(--spacing-xl);
  margin-bottom: var(--spacing-md);
}

/* ── Section Alt Background ── */
.section-alt {
  background: var(--color-surface-elevated);
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
}

/* ── Property Groups ── */
.prop-groups {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--spacing-lg);
  margin-top: var(--spacing-xl);
}

.prop-group {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.prop-group-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
  background: color-mix(in srgb, var(--group-color, #888) 6%, transparent);
}

.prop-group-header h4 {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  margin: 0;
  flex: 1;
}

.prop-group-dot {
  width: 10px;
  height: 10px;
  border-radius: var(--radius-full);
  background: var(--group-color, #888);
  flex-shrink: 0;
}

.prop-group-count {
  font-size: var(--font-size-xs);
  font-family: var(--font-mono);
  color: var(--color-text-light);
  background: var(--color-surface-elevated);
  padding: 0.1em 0.5em;
  border-radius: var(--radius-full);
}

.prop-group-provenance {
  font-size: 0.6rem;
}

.prop-group-list {
  padding: var(--spacing-xs) 0;
}

.prop-item {
  display: grid;
  grid-columns: auto 1fr auto;
  gap: var(--spacing-xs) var(--spacing-md);
  align-items: baseline;
  padding: var(--spacing-xs) var(--spacing-lg);
  font-size: var(--font-size-sm);
  transition: background var(--transition-fast);
}

.prop-item:hover {
  background: var(--color-surface-elevated);
}

.prop-sym {
  font-size: 1.05rem;
  min-width: 1.8rem;
  text-align: center;
}

.prop-label {
  font-weight: var(--font-weight-medium);
}

.prop-units {
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  color: var(--color-text-light);
  text-align: right;
  white-space: nowrap;
}

.prop-note {
  grid-column: 2 / -1;
  font-size: var(--font-size-xs);
  color: var(--color-text-light);
  margin-top: -2px;
  padding-bottom: var(--spacing-xs);
}

/* ── Responsive ── */
@media (max-width: 900px) {
  .profile-grid {
    grid-template-columns: 1fr;
  }

  .profile-chart {
    position: static;
    max-width: 380px;
    margin: 0 auto;
  }

  .standards-jump {
    flex-direction: column;
  }
}

@media (max-width: 640px) {
  .symbols-header {
    padding-left: clamp(1rem, 3vw, 1.5rem);
    padding-right: clamp(1rem, 3vw, 1.5rem);
  }

  .constants-grid,
  .constants-grid--derived {
    grid-template-columns: 1fr;
  }

  .prop-groups {
    grid-template-columns: 1fr;
  }

  .prop-item {
    grid-template-columns: auto 1fr;
  }

  .prop-units {
    grid-column: 2;
    text-align: left;
  }

  .prop-note {
    grid-column: 2;
  }

  .layer-ref-table {
    font-size: var(--font-size-xs);
  }
}
</style>
