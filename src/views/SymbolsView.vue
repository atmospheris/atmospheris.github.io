<script setup>
import { computed } from 'vue'
import { CONSTANTS, DERIVED_CONSTANTS, TEMPERATURE_LAYERS } from 'atmospheris'
import { useSeo } from '@/composables/useSeo'

useSeo({
  title: 'Symbols & Variables',
  description: 'Complete reference of symbols, constants, variables, and equations used in the ISO 2533 Standard Atmosphere model.',
  path: '/symbols'
})

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

// ── Property Reference (deduplicated) ──
const propGroups = [
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
</script>

<template>
  <div class="symbols-page">
    <!-- Page Header -->
    <header class="container symbols-header">
      <h1>Symbols &amp; Variables</h1>
      <p class="content-lead">
        Complete reference of symbols, physical constants, and variables
        used in the ISO 2533 Standard Atmosphere model.
      </p>
    </header>

    <!-- Temperature Profile -->
    <section class="section section-profile">
      <div class="container">
        <h2 class="section-title">Atmosphere Layers</h2>
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
          <h2 class="section-title">Fundamental Constants</h2>
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
          <h3 class="subsection-title">Derived Constants</h3>
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

    <!-- Property Reference -->
    <section class="section section-alt">
      <div class="container">
        <div class="section-narrow">
          <h2 class="section-title">Computed Properties</h2>
          <p>
            All atmospheric properties calculable by the model, organized by category.
            Each property is available at any altitude within the model range (&minus;5 km to 80 km).
          </p>
        </div>
        <div class="prop-groups">
          <div v-for="g in propGroups" :key="g.name" class="prop-group">
            <div class="prop-group-header" :style="{ '--group-color': g.color }">
              <span class="prop-group-dot"></span>
              <h3>{{ g.name }}</h3>
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

    <!-- Key Equations -->
    <section class="section">
      <div class="container">
        <div class="section-narrow">
          <h2 class="section-title">Key Equations</h2>
          <p>
            The fundamental relationships used in the Standard Atmosphere.
            For complete derivation details, see the
            <router-link to="/iso-2533">ISO 2533</router-link> page.
          </p>

          <h3>Geopotential &harr; Geometric Altitude</h3>
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

          <h3 class="subsection-title">Temperature</h3>
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

          <h3 class="subsection-title">Ideal Gas Law</h3>
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
              <router-link to="/iso-2533" class="btn btn-outline-dark">ISO 2533 Details</router-link>
              <router-link to="/library" class="btn btn-outline-dark">Library Docs</router-link>
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

.prop-group-header h3 {
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

.prop-group-list {
  padding: var(--spacing-xs) 0;
}

.prop-item {
  display: grid;
  grid-template-columns: auto 1fr auto;
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
