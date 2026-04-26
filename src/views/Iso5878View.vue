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

// Latitude zone descriptions
const latitudeZones = [
  { zone: '15°', name: 'Tropical', description: 'Annual model (no seasonal distinction). Warm, stable conditions year-round near the equator.' },
  { zone: '30°N', name: 'Subtropical', description: 'January: cool, dry conditions. July: warm, monsoonal influences. Strong seasonal contrast.' },
  { zone: '45°N', name: 'Mid-latitude', description: 'January: cold winter conditions. July: warm summer. Significant seasonal temperature swing (~18.5 K).' },
  { zone: '60°N', name: 'Subarctic', description: 'January: very cold winter. July: mild summer. Largest seasonal temperature range (~26 K).' },
  { zone: '80°N', name: 'Arctic', description: 'January: extremely cold polar conditions. July: cool summer with significant warming from winter.' },
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

    <!-- Latitude Zones -->
    <section class="section">
      <h2 class="section-title">Latitude Zones</h2>
      <p>
        ISO 5878 provides atmospheric models for five latitudinal bands, representing
        conditions from the tropics to the Arctic. The 15° zone uses an annual model
        (tropical conditions vary little seasonally), while the other four zones provide
        separate January and July seasonal profiles.
      </p>
      <div class="zone-cards">
        <div v-for="z in latitudeZones" :key="z.zone" class="zone-card">
          <div class="zone-lat">{{ z.zone }}</div>
          <div class="zone-body">
            <h3>{{ z.name }}</h3>
            <p>{{ z.description }}</p>
          </div>
        </div>
      </div>
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
        using the Rice distribution per ISO 5878.
        For the full-featured calculator with PDF/CDF visualization, presets, and percentile charts,
        see the <router-link to="/calculator/wind">Wind Calculator</router-link>.
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

    <!-- Humidity -->
    <section class="section">
      <h2 class="section-title">Humidity Models</h2>
      <p>
        ISO 5878 provides humidity profiles for each latitude zone and seasonal model.
        The <strong>humidity mixing ratio</strong> <math><mi>r</mi></math> is the primary
        humidity characteristic &mdash; it is the ratio of water vapour mass to dry air
        mass in the same volume, expressed in g/kg:
      </p>
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
      <p>
        The mixing ratio is used as the primary characteristic because it is the most
        conservative &mdash; it remains constant during vertical or horizontal air
        movements unless condensation or evaporation occurs.
      </p>
      <p>
        From the mixing ratio, the standard derives:
      </p>
      <ul class="content-list">
        <li><strong>Vapour pressure</strong> &mdash;
          The partial pressure of water vapour:
        </li>
      </ul>
      <div class="math-block">
        <math display="block">
          <mrow>
            <mi>e&prime;</mi><mo>=</mo>
            <mfrac><mi>r</mi><mrow><mn>621.98</mn><mo>+</mo><mi>r</mi></mrow></mfrac>
            <mo>&times;</mo><mi>p</mi>
          </mrow>
        </math>
      </div>

      <ul class="content-list">
        <li><strong>Saturation vapour pressure</strong> &mdash;
          The vapour pressure at which moist air exists in equilibrium with its liquid phase.
          For &minus;20&deg;C &lt; <em>t</em> &lt; 30&deg;C, the following approximation applies:
        </li>
      </ul>
      <div class="math-block">
        <math display="block">
          <mrow>
            <mi>e&prime;</mi><msub><mi></mi><mi>w</mi></msub><mo>=</mo>
            <mn>6.107</mn><mo>&times;</mo>
            <msup><mn>10</mn><mrow><mo>(</mo><mi>a</mi><mo>&times;</mo><mi>t</mi><mo>)</mo><mo>/</mo><mo>(</mo><mi>b</mi><mo>+</mo><mi>t</mi><mo>)</mo></mrow></msup>
          </mrow>
        </math>
      </div>
      <p>
        where <em>a</em> = 7.5 K, <em>b</em> = 237.3 K for <em>t</em> &ge; 0&deg;C;
        and <em>a</em> = 9.5 K, <em>b</em> = 265.5 K over an ice surface for <em>t</em> &lt; 0&deg;C.
      </p>

      <ul class="content-list">
        <li><strong>Dew-point temperature</strong> &mdash;
          The temperature to which air must be cooled at constant pressure to reach saturation:
        </li>
      </ul>
      <div class="math-block">
        <math display="block">
          <mrow>
            <msub><mi>t</mi><mi>d</mi></msub><mo>=</mo>
            <mfrac>
              <mrow><mn>237.3</mn><mo>&times;</mo><msub><mi>log</mi><mn>10</mn></msub><mo>(</mo><mi>e&prime;</mi><mo>/</mo><mn>6.1070</mn><mo>)</mo></mrow>
              <mrow><mn>7.5</mn><mo>&minus;</mo><msub><mi>log</mi><mn>10</mn></msub><mo>(</mo><mi>e&prime;</mi><mo>/</mo><mn>6.1070</mn><mo>)</mo></mrow>
            </mfrac>
          </mrow>
        </math>
      </div>

      <ul class="content-list">
        <li><strong>Relative humidity</strong> &mdash;
          The ratio of actual vapour pressure to saturation vapour pressure at the same temperature and pressure:
        </li>
      </ul>
      <div class="math-block">
        <math display="block">
          <mrow>
            <mi>U</mi><mo>=</mo><mn>100</mn><mo>&times;</mo>
            <mfrac><mi>e&prime;</mi><mrow><mi>e&prime;</mi><msub><mi></mi><mi>w</mi></msub></mrow></mfrac>
          </mrow>
        </math>
      </div>
      <p>
        Humidity profiles are provided as median values by latitude zone and meridian,
        plus percentile distributions from station data, covering altitudes from sea level
        to approximately 10 km.
      </p>
    </section>

    <!-- Cold and Warm Regimes -->
    <section class="section">
      <h2 class="section-title">Cold and Warm Stratospheric Regimes</h2>
      <p>
        In Arctic and sub-Arctic regions, sudden warmings and coolings of the winter
        stratosphere and mesosphere produce large changes in the vertical structure of
        the atmosphere. Observed 35 km temperatures have a range of roughly
        <strong>75 K in winter</strong> compared with only <strong>20 K in summer</strong>.
      </p>
      <p>
        The winter temperature distributions in this region are <em>bimodal</em> &mdash;
        temperatures are normally much lower or much higher than the seasonal mean.
        Consequently, mean monthly or seasonal atmospheric models for the winter months
        are of limited value for specifying temperature in Arctic and sub-Arctic regions.
      </p>
      <p>
        ISO 5878 provides separate <strong>cold</strong> and <strong>warm</strong>
        stratospheric regime profiles for 60&deg;N and 80&deg;N in December&ndash;January,
        constructed from observations at Fort Greely (Alaska), Fort Churchill (Canada),
        West Geirinish (Scotland), and Heiss Island (Russia):
      </p>
      <div class="regime-grid">
        <div class="regime-card regime-cold">
          <h3>Cold Regime</h3>
          <p>Defined when the observed temperature at 45 km is near:</p>
          <ul>
            <li><strong>223 K</strong> at 60&deg;N (equalled or exceeded in 93&ndash;98% of observations)</li>
            <li><strong>232 K</strong> at 80&deg;N (exceeded in 80% of observations)</li>
          </ul>
        </div>
        <div class="regime-card regime-warm">
          <h3>Warm Regime</h3>
          <p>Defined when the observed temperature at 45 km is near:</p>
          <ul>
            <li><strong>267 K</strong> at both 60&deg;N and 80&deg;N</li>
            <li>Equalled or exceeded in 1&ndash;30% of observations depending on station</li>
          </ul>
        </div>
      </div>
      <p class="regime-note">
        Note: These definitions differ from the Sudden Stratospheric Warming (SSW) definitions
        used in the meteorological literature.
      </p>
    </section>

    <!-- Atmospheric Variations -->
    <section class="section">
      <h2 class="section-title">Atmospheric Variations</h2>

      <h3>Seasonal and latitudinal variations</h3>
      <p>
        Maximum and minimum mean monthly temperatures do not occur at all latitudes
        and levels in the same month. Below 25 km, temperatures follow the expected
        June/July maximum and December/January minimum pattern. In the upper
        stratosphere, however, semi-annual and biennial cycles complicate the annual
        temperature cycle.
      </p>
      <p>
        A notable feature is the <strong>first isopycnic level</strong> near 8 km &mdash;
        a level of minimum seasonal density variability where density remains
        relatively constant throughout the year regardless of geographic location.
        The levels of <em>maximum</em> seasonal and latitudinal variability in density
        and pressure are between 65 km and 75 km, with the greatest variability at
        high latitudes.
      </p>
      <p>
        In the mesosphere (above 60&ndash;65 km), maximum mean monthly temperatures
        occur in December/January &mdash; reversed from lower altitudes.
      </p>

      <h3 class="api-subsection">Longitudinal variations</h3>
      <p>
        In summer, longitudinal variations are relatively small at all latitudes
        up to 80 km. Isotherms parallel latitude circles and the circulation pattern
        is symmetrical about the poles.
      </p>
      <p>
        During winter, however, longitudinal variations at 60&ndash;80&deg;N become
        as important as latitudinal and seasonal changes:
      </p>
      <ul class="content-list">
        <li>Mean monthly altitudes of pressure surfaces in the lower mesosphere vary by &gt;2,500 m</li>
        <li>Temperatures vary by 15&ndash;20 K at 20&ndash;35 km</li>
        <li>Densities change by 15&ndash;20% at 40&ndash;60 km</li>
      </ul>
      <p>
        These differences reflect the longitudinal asymmetry in the winter circulation,
        driven by the Aleutian anticyclone and the displacement of the polar low
        toward the Eurasian continent.
      </p>
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

/* Latitude zone cards */
.zone-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
}

.zone-card {
  display: flex;
  gap: var(--spacing-md);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  transition: border-color var(--transition-fast);
}

.zone-card:hover {
  border-color: var(--color-accent);
}

.zone-lat {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-accent);
  font-family: var(--font-mono);
  flex-shrink: 0;
  min-width: 50px;
}

.zone-body h3 {
  font-size: var(--font-size-base);
  margin-bottom: var(--spacing-xs);
}

.zone-body p {
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  line-height: var(--line-height-relaxed);
  margin-bottom: 0;
}

@media (max-width: 640px) {
  .zone-card {
    flex-direction: column;
    gap: var(--spacing-sm);
  }
}

/* Regime cards */
.regime-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
}

.regime-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  border-top: 3px solid var(--color-accent);
}

.regime-card h3 {
  font-size: var(--font-size-base);
  margin-bottom: var(--spacing-sm);
}

.regime-card p {
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  margin-bottom: var(--spacing-xs);
}

.regime-card ul {
  margin: var(--spacing-xs) 0 0;
  padding-left: var(--spacing-md);
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
}

.regime-cold {
  border-top-color: #3b82f6;
}

.regime-warm {
  border-top-color: #f59e0b;
}

.regime-note {
  margin-top: var(--spacing-md);
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  font-style: italic;
}
</style>
