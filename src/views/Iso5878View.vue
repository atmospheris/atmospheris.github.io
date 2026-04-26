<script setup>
import { ref, computed } from 'vue'
import { computeWindDerived } from 'atmospheris'
import { useSeo } from '@/composables/useSeo'

useSeo({
  title: 'ISO 5878 Reference Atmospheres for Aerospace Use',
  description: 'ISO 5878 specifies reference atmospheres for aerospace use, providing temperature profiles, wind characteristics, and humidity models derived from empirical meteorological observations.',
  path: '/iso-5878'
})

// --- Wind Calculator State ---
const vx = ref(-3.9)
const vy = ref(-1.2)
const sigmaR = ref(5.9)
const useAbsoluteVx = ref(false)

const windResult = computed(() => {
  try {
    return computeWindDerived(vx.value, vy.value, sigmaR.value, {
      useAbsoluteVx: useAbsoluteVx.value
    })
  } catch {
    return null
  }
})

function fmt(v) {
  if (v == null || !isFinite(v)) return '—'
  return v.toFixed(1)
}

// --- Surface Conditions (from ISO 5878 Table 2) ---
const surfaceConditions = [
  { latitude: '15°', g0: 9.78381, radius: 6337.84, tDec: 299.650, tJun: 299.650, pDec: 1013.250, pJun: 1013.250 },
  { latitude: '30°N', g0: 9.79324, radius: 6345.65, tDec: 283.150, tJun: 297.150, pDec: 1020.500, pJun: 1014.000 },
  { latitude: '45°N', g0: 9.80665, radius: 6356.77, tDec: 272.650, tJun: 291.150, pDec: 1018.000, pJun: 1013.500 },
  { latitude: '60°N', g0: 9.81911, radius: 6367.10, tDec: 256.150, tJun: 282.150, pDec: 1013.000, pJun: 1010.200 },
  { latitude: '80°N', g0: 9.83051, radius: 6376.56, tDec: 248.950, tJun: 276.650, pDec: 1013.800, pJun: 1012.000 },
]
</script>

<template>
  <div class="content-page">
    <h1>ISO 5878 Reference Atmospheres for Aerospace Use</h1>
    <p class="content-lead">
      ISO 5878 specifies reference atmospheres for aerospace use, providing
      temperature profiles, wind characteristics, and humidity models derived from
      empirical meteorological observations across latitude zones.
    </p>

    <!-- What is ISO 5878 -->
    <section class="section">
      <h2 class="section-title">What is ISO 5878?</h2>
      <p>
        While <router-link to="/iso-2533">ISO 2533</router-link> defines a single
        idealized vertical atmosphere, ISO 5878 complements it by providing
        <em>reference atmospheres</em> &mdash; sets of atmospheric conditions that
        represent different latitude zones, seasons, and altitudes based on actual
        meteorological observations.
      </p>
      <p>
        The standard covers three atmospheric characteristics:
      </p>
      <ul class="content-list">
        <li>
          <strong>Atmospheric temperature, pressure, and density</strong> &mdash;
          Vertical profiles for five latitude zones (15°, 30°N, 45°N, 60°N, 80°N)
          in seasonal models (January and July), from sea level to 25 km.
        </li>
        <li>
          <strong>Wind characteristics</strong> &mdash;
          Zonal and meridional wind components, scalar mean speeds, and percentile
          values for four latitude bands (0°&ndash;20°N, 20°&ndash;40°N, 40°&ndash;60°N,
          60°&ndash;80°N) in January and July, modeled using the circular normal
          (Rice) distribution.
        </li>
        <li>
          <strong>Humidity</strong> &mdash;
          Water vapor pressure and mixing ratio profiles for the same latitude
          zones and seasonal models.
        </li>
      </ul>
    </section>

    <!-- Wind Characteristics -->
    <section class="section">
      <h2 class="section-title">Wind Characteristics</h2>
      <p>
        Wind is a vector quantity. ISO 5878 models wind speed distributions using
        the <strong>circular normal distribution</strong> (also known as the
        <strong>Rice distribution</strong>), where the probability density function
        is given by:
      </p>
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
      <p>
        where <math><mi>&nu;</mi></math> is wind speed,
        <math><msub><mi>V</mi><mi>r</mi></msub></math> is the magnitude of the
        vector mean wind,
        <math><msub><mi>&sigma;</mi><mi>r</mi></msub></math> is the standard
        deviation of the vector mean wind, and
        <math><msub><mi>I</mi><mn>0</mn></msub></math> is the zero-order modified
        Bessel function of the first kind.
      </p>
      <p>
        For latitude zones above 20°N, where the meridional component
        <math><msub><mi>V</mi><mi>y</mi></msub></math> does not exceed 6% of the
        zonal component <math><msub><mi>V</mi><mi>x</mi></msub></math>, it is
        assumed that <math><msub><mi>V</mi><mi>y</mi></msub><mo>=</mo><mn>0</mn></math>,
        so <math><msub><mi>V</mi><mi>r</mi></msub><mo>=</mo><mo>|</mo><msub><mi>V</mi><mi>x</mi></msub><mo>|</mo></math>.
      </p>
      <p>
        The expected scalar mean wind speed
        <math><msub><mi>V</mi><mi>sc</mi></msub></math> and the wind speeds
        equalled or exceeded on 1%, 10%, 20%, 80%, 90%, and 99% of occasions are
        calculated from this distribution.
      </p>
    </section>

    <!-- Interactive Wind Calculator -->
    <section class="section">
      <h2 class="section-title">Wind Distribution Calculator</h2>
      <p>
        Enter observed wind parameters to compute derived wind characteristics
        using the Rice distribution per ISO 5878 Section 5.4.
      </p>

      <div class="wind-calc-card">
        <div class="wind-calc-grid">
          <label class="wind-input-group">
            <span class="wind-input-label">
              <math><msub><mi>V</mi><mi>x</mi></msub></math>
              Mean zonal wind (m/s)
            </span>
            <input type="number" v-model.number="vx" step="0.1" class="wind-input" />
          </label>
          <label class="wind-input-group">
            <span class="wind-input-label">
              <math><msub><mi>V</mi><mi>y</mi></msub></math>
              Mean meridional wind (m/s)
            </span>
            <input type="number" v-model.number="vy" step="0.1" class="wind-input" />
          </label>
          <label class="wind-input-group">
            <span class="wind-input-label">
              <math><msub><mi>&sigma;</mi><mi>r</mi></msub></math>
              Std deviation (m/s)
            </span>
            <input type="number" v-model.number="sigmaR" step="0.1" min="0.1" class="wind-input" />
          </label>
          <label class="wind-input-group wind-input-check">
            <input type="checkbox" v-model="useAbsoluteVx" />
            <span>Use |<math><msub><mi>V</mi><mi>x</mi></msub></math>| for <math><msub><mi>V</mi><mi>r</mi></msub></math> (zones &gt; 20°N)</span>
          </label>
        </div>

        <div v-if="windResult" class="wind-results">
          <div class="wind-results-header">
            <h3>Derived Wind Characteristics</h3>
          </div>
          <div class="wind-results-grid">
            <div class="wind-stat">
              <span class="wind-stat-label">
                <math><msub><mi>V</mi><mi>r</mi></msub></math>
                Vector mean wind magnitude
              </span>
              <span class="wind-stat-value">{{ fmt(windResult.Vr) }} m/s</span>
            </div>
            <div class="wind-stat">
              <span class="wind-stat-label">
                <math><mi>&sigma;</mi></math>
                Per-component std deviation
              </span>
              <span class="wind-stat-value">{{ fmt(windResult.sigma) }} m/s</span>
            </div>
            <div class="wind-stat">
              <span class="wind-stat-label">
                <math><msub><mi>V</mi><mi>sc</mi></msub></math>
                Scalar mean wind speed
              </span>
              <span class="wind-stat-value">{{ fmt(windResult.Vsc) }} m/s</span>
            </div>
          </div>

          <div class="wind-percentiles">
            <h4>Percentile Wind Speeds (m/s)</h4>
            <div class="table-responsive">
              <table class="results-table wind-pct-table">
                <thead>
                  <tr>
                    <th>Percentile band</th>
                    <th class="text-right">Low (not exceeded on)</th>
                    <th class="text-right">High (not exceeded on)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="property-name">1% / 99%</td>
                    <td class="property-value">{{ fmt(windResult.percentiles['1'].low) }} <span class="pct-hint">(1%)</span></td>
                    <td class="property-value">{{ fmt(windResult.percentiles['1'].high) }} <span class="pct-hint">(99%)</span></td>
                  </tr>
                  <tr>
                    <td class="property-name">10% / 90%</td>
                    <td class="property-value">{{ fmt(windResult.percentiles['10'].low) }} <span class="pct-hint">(10%)</span></td>
                    <td class="property-value">{{ fmt(windResult.percentiles['10'].high) }} <span class="pct-hint">(90%)</span></td>
                  </tr>
                  <tr>
                    <td class="property-name">20% / 80%</td>
                    <td class="property-value">{{ fmt(windResult.percentiles['20'].low) }} <span class="pct-hint">(20%)</span></td>
                    <td class="property-value">{{ fmt(windResult.percentiles['20'].high) }} <span class="pct-hint">(80%)</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Surface Conditions -->
    <section class="section">
      <h2 class="section-title">Surface Conditions by Latitude</h2>
      <p>
        The following table gives the acceleration of free fall at sea level
        <math><msub><mi>g</mi><mn>0</mn></msub></math>,
        nominal Earth radius
        <math><msub><mi>r</mi><mi>&phi;</mi></msub></math>,
        and sea-level temperature and pressure for each latitudinal and seasonal model.
      </p>
      <div class="table-responsive">
        <table class="results-table layer-table">
          <thead>
            <tr>
              <th>Latitude</th>
              <th class="text-right"><math><msub><mi>g</mi><mn>0</mn></msub></math> (m/s&sup2;)</th>
              <th class="text-right"><math><msub><mi>r</mi><mi>&phi;</mi></msub></math> (km)</th>
              <th class="text-right"><math><mi>T</mi></math> Dec/Jan (K)</th>
              <th class="text-right"><math><mi>T</mi></math> Jun/Jul (K)</th>
              <th class="text-right"><math><mi>p</mi></math> Dec/Jan (hPa)</th>
              <th class="text-right"><math><mi>p</mi></math> Jun/Jul (hPa)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in surfaceConditions" :key="row.latitude">
              <td class="property-name">{{ row.latitude }}</td>
              <td class="property-value">{{ row.g0.toFixed(5) }}</td>
              <td class="property-value">{{ row.radius.toFixed(2) }}</td>
              <td class="property-value">{{ row.tDec.toFixed(3) }}</td>
              <td class="property-value">{{ row.tJun.toFixed(3) }}</td>
              <td class="property-value">{{ row.pDec.toFixed(3) }}</td>
              <td class="property-value">{{ row.pJun.toFixed(3) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Related Standards -->
    <section class="section">
      <h2 class="section-title">Related Standards</h2>
      <p>
        ISO 5878 is part of a family of atmospheric reference standards. For the
        full bibliography, see the <router-link to="/references">References</router-link> page.
      </p>
      <div class="table-responsive">
        <table class="results-table layer-table">
          <thead>
            <tr>
              <th>Standard</th>
              <th>Scope</th>
              <th>Relationship</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="property-name">ISO 2533</td>
              <td>Standard Atmosphere (&minus;5 km to 80 km)</td>
              <td>Foundation: defines the baseline vertical atmosphere</td>
            </tr>
            <tr>
              <td class="property-name">ISO 5878:1982</td>
              <td>Reference atmospheres for aerospace use</td>
              <td>First edition</td>
            </tr>
            <tr>
              <td class="property-name">ISO 5878:1982/Add 1:1983</td>
              <td>Wind supplement</td>
              <td>Added wind characteristic data and models</td>
            </tr>
            <tr>
              <td class="property-name">ISO 5878:1982/Add 2:1983</td>
              <td>Air humidity</td>
              <td>Added humidity profiles</td>
            </tr>
            <tr>
              <td class="property-name">ISO/DIS 5878</td>
              <td>Reference atmospheres (current draft)</td>
              <td>Incorporates all addenda into a revised edition</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Get the Standard CTA -->
    <section class="section">
      <div class="cta-card iso-purchase-card">
        <div class="iso-purchase-header">
          <img
            src="/iso-logo.svg"
            alt="ISO logo"
            class="iso-logo"
            width="60"
            height="60"
          />
          <div>
            <h2>Get the Official Standard</h2>
            <p>
              Purchase the ISO 5878 documents from the ISO Store for the complete
              specification, empirical data tables, and electronic inserts.
            </p>
          </div>
        </div>

        <div class="iso-purchase-group">
          <h3 class="iso-purchase-group-title">Current draft</h3>
          <div class="iso-purchase-item">
            <div class="iso-purchase-item-desc">
              <strong>ISO/DIS 5878</strong> &mdash;
              Reference atmospheres for aerospace use. Incorporates all previous
              addenda (wind and humidity). Provides temperature, pressure, density,
              wind, and humidity profiles for five latitude zones in seasonal models.
              Includes machine-readable XML electronic inserts.
            </div>
            <a href="https://www.iso.org/standard/90974.html" target="_blank" rel="noopener" class="btn btn-primary iso-purchase-btn">
              Purchase ISO/DIS 5878
            </a>
          </div>
        </div>

        <div class="iso-purchase-group iso-purchase-legacy">
          <h3 class="iso-purchase-group-title">Previous edition (superseded)</h3>
          <div class="iso-purchase-item">
            <div class="iso-purchase-item-desc">
              <strong>ISO 5878:1982</strong> &mdash;
              First edition. Reference atmospheres for aerospace use.
            </div>
            <a href="https://www.iso.org/standard/12077.html" target="_blank" rel="noopener" class="btn btn-outline iso-purchase-btn-legacy">
              ISO Store
            </a>
          </div>
          <div class="iso-purchase-item">
            <div class="iso-purchase-item-desc">
              <strong>Addendum 1:1983</strong> &mdash;
              Wind supplement with zonal and meridional wind data.
            </div>
            <a href="https://www.iso.org/standard/12078.html" target="_blank" rel="noopener" class="btn btn-outline iso-purchase-btn-legacy">
              ISO Store
            </a>
          </div>
          <div class="iso-purchase-item">
            <div class="iso-purchase-item-desc">
              <strong>Addendum 2:1983</strong> &mdash;
              Air humidity supplement with water vapor pressure and mixing ratio data.
            </div>
            <a href="https://www.iso.org/standard/12079.html" target="_blank" rel="noopener" class="btn btn-outline iso-purchase-btn-legacy">
              ISO Store
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Wind calculator card */
.wind-calc-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  margin-top: var(--spacing-md);
}

.wind-calc-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
  align-items: end;
}

.wind-input-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.wind-input-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  font-weight: var(--font-weight-medium);
}

.wind-input {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  font-family: var(--font-mono);
  background: var(--color-surface);
  color: var(--color-text);
  width: 100%;
  transition: border-color 0.15s;
}

.wind-input:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px var(--color-accent-subtle);
}

.wind-input-check {
  flex-direction: row;
  align-items: center;
  gap: var(--spacing-sm);
  padding-top: var(--spacing-md);
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  cursor: pointer;
}

.wind-input-check input[type="checkbox"] {
  width: 1rem;
  height: 1rem;
  accent-color: var(--color-accent);
}

/* Results */
.wind-results {
  margin-top: var(--spacing-lg);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--color-border);
}

.wind-results-header h3 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-md);
}

.wind-results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.wind-stat {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-surface-elevated);
  border-radius: var(--radius-md);
}

.wind-stat-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-light);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: var(--font-weight-medium);
}

.wind-stat-value {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  font-family: var(--font-mono);
  color: var(--color-accent-dark);
}

/* Percentiles */
.wind-percentiles h4 {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-sm);
}

.wind-pct-table {
  font-size: var(--font-size-sm);
}

.pct-hint {
  color: var(--color-text-light);
  font-size: var(--font-size-xs);
}
</style>
