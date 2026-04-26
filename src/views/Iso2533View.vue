<script setup>
import { CONSTANTS, DERIVED_CONSTANTS, TEMPERATURE_LAYERS } from 'atmospheris'
import { useSeo } from '@/composables/useSeo'

useSeo({
  title: 'ISO 2533 Standard Atmosphere',
  description: 'The ISO 2533 Standard Atmosphere model defines a reference vertical distribution of atmospheric properties. Key constants, temperature layers, and formulas.',
  path: '/iso-2533'
})

// Atmospheric composition from ISO 2533:2026 Table 2
const atmosphericComposition = [
  { gas: 'N\u2082', name: 'Nitrogen', volume: '78.084', molarMass: '28.0134' },
  { gas: 'O\u2082', name: 'Oxygen', volume: '20.9476', molarMass: '31.9988' },
  { gas: 'Ar', name: 'Argon', volume: '0.934', molarMass: '39.948' },
  { gas: 'CO\u2082', name: 'Carbon dioxide', volume: '0.0427', molarMass: '44.00995' },
  { gas: 'Ne', name: 'Neon', volume: '0.00182', molarMass: '20.183' },
  { gas: 'He', name: 'Helium', volume: '0.000524', molarMass: '4.0026' },
  { gas: 'CH\u2084', name: 'Methane', volume: '0.000192', molarMass: '16.04303' },
  { gas: 'Kr', name: 'Krypton', volume: '0.000114', molarMass: '83.80' },
  { gas: 'H\u2082', name: 'Hydrogen', volume: '0.000055', molarMass: '2.01594' },
  { gas: 'N\u2082O', name: 'Nitrous oxide', volume: '0.0000339', molarMass: '44.0128' },
]

// Sea-level physical characteristics from ISO 2533:2026 Table 3
const seaLevelCharacteristics = [
  { symbol: '<math><msub><mi>a</mi><mi>n</mi></msub></math>', value: '340.294', unit: 'm/s', desc: 'Speed of sound' },
  { symbol: '<math><msub><mi>H</mi><mrow><mi>p</mi><mi>n</mi></mrow></msub></math>', value: '8434.5', unit: 'm', desc: 'Pressure scale height' },
  { symbol: '<math><msub><mi>l</mi><mi>n</mi></msub></math>', value: '66.328 &times; 10\u207B\u2079', unit: 'm', desc: 'Mean free path of air particles' },
  { symbol: '<math><msub><mi>n</mi><mi>n</mi></msub></math>', value: '25.471 &times; 10\u00B2\u2074', unit: 'm\u207B\u00B3', desc: 'Air number density' },
  { symbol: '<math><mover><mi>v</mi><mo>\u0305</mo></mover><msub><mi>n</mi></msub></math>', value: '458.94', unit: 'm/s', desc: 'Mean air-particle speed' },
  { symbol: '<math><msub><mi>&gamma;</mi><mi>n</mi></msub></math>', value: '12.013', unit: 'N/m\u00B3', desc: 'Specific weight' },
  { symbol: '<math><msub><mi>&nu;</mi><mi>n</mi></msub></math>', value: '14.607 &times; 10\u207B\u2076', unit: 'm\u00B2/s', desc: 'Kinematic viscosity' },
  { symbol: '<math><msub><mi>&lambda;</mi><mi>n</mi></msub></math>', value: '25.343 &times; 10\u207B\u00B3', unit: 'W/(m\u00B7K)', desc: 'Thermal conductivity' },
  { symbol: '<math><msub><mi>&mu;</mi><mi>n</mi></msub></math>', value: '17.894 &times; 10\u207B\u2076', unit: 'Pa\u00B7s', desc: 'Dynamic viscosity' },
  { symbol: '<math><msub><mi>&omega;</mi><mi>n</mi></msub></math>', value: '6.9193 &times; 10\u2079', unit: 's\u207B\u00B9', desc: 'Collision frequency' },
]
</script>

<template>
  <div class="content-page">
    <h1>ISO 2533 Standard Atmosphere</h1>
    <p class="content-lead">
      The International Standard Atmosphere (ISA) is a reference model that defines the vertical
      distribution of atmospheric temperature, pressure, density, and other properties from
      &minus;5 km to 80 km altitude.
    </p>

    <!-- What is the Standard Atmosphere -->
    <section class="section">
      <h2 class="section-title">What is the Standard Atmosphere?</h2>
      <p>
        The Standard Atmosphere provides a common reference frame for aerospace engineering,
        scientific research, and industrial applications. Rather than representing any specific
        location or weather condition, it defines a set of baseline atmospheric conditions
        that enable consistent calculations worldwide.
      </p>
      <p>
        The model divides the atmosphere into layers, each with a defined temperature gradient.
        Within each layer, temperature varies linearly (or is constant, in isothermal layers),
        and pressure and density are derived from fundamental thermodynamic equations.
      </p>
      <p>
        ISO 2533 specifies these layers, the associated physical constants, and the equations
        that relate altitude to atmospheric properties. The result is a deterministic model:
        given any valid altitude, all atmospheric properties can be calculated precisely.
      </p>
      <p>
        The model assumes dry air as a perfect gas free from moisture and dust, with conventional
        initial values of temperature, pressure, and density at mean sea level. These
        simplifications make the model reproducible but mean it does not represent any specific
        real-world condition &mdash; for observed conditions by latitude and season, see
        <router-link to="/iso-5878">ISO 5878</router-link>.
      </p>
    </section>

    <!-- History -->
    <section class="section">
      <h2 class="section-title">History</h2>
      <p>
        The concept of a standard atmosphere dates back to the early 20th century, driven by the
        needs of aviation and meteorology. ISO 2533 was first published in 1975, establishing
        the international standard for atmospheric reference conditions.
      </p>
      <ul class="content-list">
        <li>
          <strong>ISO 2533:1975</strong> &mdash;
          Standard Atmosphere, identical with the ICAO and WMO Standard Atmospheres
          from &minus;2 km to 32 km, extended to 80 km using data from recent research.
          It specifies temperature, pressure, density, and other thermodynamic properties
          as functions of geometric and geopotential altitude.
          <a href="https://www.iso.org/standard/7472.html" target="_blank" rel="noopener">ISO&nbsp;Store&nbsp;&nearr;</a>
        </li>
        <li>
          <strong>Addendum&nbsp;1:1985</strong> &mdash;
          Hypsometrical tables relating geopotential altitude to atmospheric pressure,
          intended for calibration of aneroid and manometer-type instruments.
          Covers pressure ranges in hPa and mmHg at fine intervals.
          <a href="https://www.iso.org/standard/7473.html" target="_blank" rel="noopener">ISO&nbsp;Store&nbsp;&nearr;</a>
        </li>
        <li>
          <strong>Addendum&nbsp;2:1997</strong> &mdash;
          Extension of the altitude range to &minus;5,000 m (from &minus;2,000 m),
          and standard atmosphere tables as a function of altitude in feet
          (&minus;16,500 ft to 262,500 ft).
          <a href="https://www.iso.org/standard/7474.html" target="_blank" rel="noopener">ISO&nbsp;Store&nbsp;&nearr;</a>
        </li>
        <li>
          <strong>ISO 2533:2026</strong> &mdash;
          Second edition that cancels and replaces the 1975 first edition.
          Incorporates all addenda and errata, extends the lower altitude range to
          &minus;5 km, adds hypsometrical tables in hPa, and recalculates all values
          using modern computational methods with improved accuracy.
          <a href="https://www.iso.org/standard/90293.html" target="_blank" rel="noopener">ISO&nbsp;Store&nbsp;&nearr;</a>
        </li>
      </ul>
    </section>

    <!-- Why a Standard Atmosphere -->
    <section class="section">
      <h2 class="section-title">Why a Standard Atmosphere?</h2>
      <p>
        The concept of a standard atmosphere is crucial for numerous applications:
      </p>
      <div class="why-grid">
        <div class="why-card">
          <h3>Reference Framework</h3>
          <p>A common basis for consistent and reliable characterization of atmospheric conditions, enabling accurate calculations, simulations, and assessments across industries.</p>
        </div>
        <div class="why-card">
          <h3>Interoperability</h3>
          <p>Ensures measurements, models, and simulations from different sources can be compared, promoting harmonization across international boundaries.</p>
        </div>
        <div class="why-card">
          <h3>Performance Evaluation</h3>
          <p>Enables objective assessment of aircraft performance, weather model accuracy, and system efficiency against a known baseline.</p>
        </div>
        <div class="why-card">
          <h3>Safety Compliance</h3>
          <p>Crucial for maintaining safety standards in aviation and aerospace, ensuring systems are designed to withstand expected atmospheric conditions.</p>
        </div>
        <div class="why-card">
          <h3>International Collaboration</h3>
          <p>Promotes knowledge sharing among researchers and practitioners worldwide by adopting a common reference for atmospheric phenomena.</p>
        </div>
      </div>
    </section>

    <!-- Key Constants -->
    <section class="section">
      <h2 class="section-title">Key Constants</h2>
      <p>
        For the complete list of symbols, variables, and their definitions, see the
        <router-link to="/symbols">Symbols &amp; Variables</router-link> reference page.
      </p>
      <p>
        The following fundamental constants define the Standard Atmosphere model. These are
        fixed physical and conventional values used in all ISA calculations.
      </p>

      <dl class="constants-list">
        <div class="constant-item">
          <dt>
            <math>
              <msub><mi>g</mi><mi>n</mi></msub>
            </math>
          </dt>
          <dd>{{ CONSTANTS.g_n }} m/s&sup2;</dd>
          <dd class="constant-desc">Standard acceleration of free fall</dd>
        </div>
        <div class="constant-item">
          <dt>
            <math>
              <msub><mi>N</mi><mi>A</mi></msub>
            </math>
          </dt>
          <dd>{{ CONSTANTS.N_A.toExponential() }} mol<sup>&minus;1</sup></dd>
          <dd class="constant-desc">Avogadro constant</dd>
        </div>
        <div class="constant-item">
          <dt>
            <math>
              <msub><mi>p</mi><mi>n</mi></msub>
            </math>
          </dt>
          <dd>{{ CONSTANTS.p_n }} Pa</dd>
          <dd class="constant-desc">Standard air pressure at sea level</dd>
        </div>
        <div class="constant-item">
          <dt>
            <math>
              <msub><mi>&rho;</mi><mi>n</mi></msub>
            </math>
          </dt>
          <dd>{{ CONSTANTS.rho_n }} kg/m&sup3;</dd>
          <dd class="constant-desc">Standard air density</dd>
        </div>
        <div class="constant-item">
          <dt>
            <math>
              <msub><mi>T</mi><mi>n</mi></msub>
            </math>
          </dt>
          <dd>{{ CONSTANTS.T_n }} K</dd>
          <dd class="constant-desc">Standard thermodynamic air temperature at sea level (15 &deg;C)</dd>
        </div>
        <div class="constant-item">
          <dt>
            <math>
              <msup><mi>R</mi><mo>*</mo></msup>
            </math>
          </dt>
          <dd>{{ CONSTANTS.R_star }} J/(mol&middot;K)</dd>
          <dd class="constant-desc">Universal gas constant</dd>
        </div>
        <div class="constant-item">
          <dt>
            <math>
              <msub><mi>r</mi><mn>0</mn></msub>
            </math>
          </dt>
          <dd>{{ CONSTANTS.radius }} m</dd>
          <dd class="constant-desc">Nominal Earth radius (at 45&deg;32'33" latitude)</dd>
        </div>
        <div class="constant-item">
          <dt>
            <math><mi>&kappa;</mi></math>
          </dt>
          <dd>{{ CONSTANTS.kappa }}</dd>
          <dd class="constant-desc">Adiabatic index (ratio of specific heats)</dd>
        </div>
        <div class="constant-item">
          <dt>
            <math><mi>S</mi></math>
          </dt>
          <dd>110.4 K</dd>
          <dd class="constant-desc">Sutherland's temperature (for dynamic viscosity)</dd>
        </div>
        <div class="constant-item">
          <dt>
            <math>
              <msub><mi>&beta;</mi><mi>s</mi></msub>
            </math>
          </dt>
          <dd>1.468 &times; 10<sup>&minus;6</sup> kg/(m&middot;s&middot;K<sup>&frac12;</sup>)</dd>
          <dd class="constant-desc">Sutherland's empirical coefficient</dd>
        </div>
        <div class="constant-item">
          <dt>
            <math>
              <mi>&sigma;</mi>
            </math>
          </dt>
          <dd>0.365 &times; 10<sup>&minus;9</sup> m</dd>
          <dd class="constant-desc">Effective collision diameter of an air molecule</dd>
        </div>
        <div class="constant-item">
          <dt>
            <math><mi>M</mi></math>
          </dt>
          <dd>{{ DERIVED_CONSTANTS.M.toFixed(6) }} kg/mol</dd>
          <dd class="constant-desc">Molar mass of dry air (derived)</dd>
        </div>
        <div class="constant-item">
          <dt>
            <math><mi>R</mi></math>
          </dt>
          <dd>{{ DERIVED_CONSTANTS.R.toFixed(5) }} J/(kg&middot;K)</dd>
          <dd class="constant-desc">Specific gas constant for air (derived)</dd>
        </div>
      </dl>
    </section>

    <!-- Foundational Physics -->
    <section class="section">
      <h2 class="section-title">Foundational Physics</h2>
      <p>
        The ISA model is built from a small set of fundamental equations. Understanding
        these makes the entire model transparent.
      </p>

      <h3>The hydrostatic equation</h3>
      <p>
        A static atmosphere in equilibrium satisfies the relation between pressure,
        density, gravity, and altitude:
      </p>
      <div class="math-block">
        <math display="block">
          <mrow>
            <mo>&minus;</mo><mi>dp</mi><mo>=</mo><mi>&rho;</mi><mo>&times;</mo><mi>g</mi><mo>&times;</mo><mi>dh</mi>
          </mrow>
        </math>
      </div>

      <h3 class="api-subsection">The perfect gas law</h3>
      <p>
        At the altitudes covered by ISO 2533, air behaves as a perfect gas with constant
        molar mass. The full form uses the universal gas constant, while the simplified
        form uses the specific gas constant <em>R</em> = <em>R</em>&sup2;/M:
      </p>
      <div class="math-block">
        <math display="block">
          <mrow>
            <mi>p</mi><mo>=</mo><mi>&rho;</mi><mo>&times;</mo><mi>R</mi><mo>&times;</mo><mi>T</mi>
          </mrow>
        </math>
      </div>

      <h3 class="api-subsection">Gravity vs. altitude</h3>
      <p>
        The acceleration of free fall decreases with distance from the Earth&rsquo;s centre,
        following Newton&rsquo;s gravitation law. The nominal Earth radius
        <em>r</em>&nbsp;=&nbsp;6,356,766 m is from the Smithsonian Meteorological Tables,
        most accurate at latitude 45&deg;32'33":
      </p>
      <div class="math-block">
        <math display="block">
          <mrow>
            <mi>g</mi><mo>=</mo><msub><mi>g</mi><mi>n</mi></msub>
            <mo>&times;</mo>
            <msup>
              <mrow><mo>(</mo><mfrac><mi>r</mi><mrow><mi>r</mi><mo>+</mo><mi>h</mi></mrow></mfrac><mo>)</mo></mrow>
              <mn>2</mn>
            </msup>
          </mrow>
        </math>
      </div>
      <p>
        This approximation differs from the more accurate equation in the US Standard
        Atmosphere 1976 by less than 0.001% at 60,000 m.
      </p>

      <h3 class="api-subsection">Geopotential altitude</h3>
      <p>
        Geopotential altitude <em>H</em> is defined by integrating gravity over geometric
        altitude, then dividing by the standard gravity <em>g</em><sub>n</sub>:
      </p>
      <div class="math-block">
        <math display="block">
          <mrow>
            <mi>H</mi><mo>=</mo>
            <mfrac><mn>1</mn><msub><mi>g</mi><mi>n</mi></msub></mfrac>
            <mo>&times;</mo>
            <msubsup><mo>&int;</mo><mn>0</mn><mi>h</mi></msubsup>
            <mi>g</mi><mo>(</mo><mi>h</mi><mo>)</mo><mi>dh</mi>
          </mrow>
        </math>
      </div>
      <p>
        This gives the conversion formulas between geopotential and geometric altitude:
      </p>
      <div class="math-block">
        <math display="block">
          <mtable>
            <mtr>
              <mtd>
                <mrow>
                  <mi>H</mi><mo>=</mo>
                  <mfrac><mrow><mi>r</mi><mo>&times;</mo><mi>h</mi></mrow><mrow><mi>r</mi><mo>+</mo><mi>h</mi></mrow></mfrac>
                </mrow>
              </mtd>
            </mtr>
            <mtr>
              <mtd>
                <mrow>
                  <mi>h</mi><mo>=</mo>
                  <mfrac><mrow><mi>r</mi><mo>&times;</mo><mi>H</mi></mrow><mrow><mi>r</mi><mo>&minus;</mo><mi>H</mi></mrow></mfrac>
                </mrow>
              </mtd>
            </mtr>
          </mtable>
        </math>
      </div>
    </section>

    <!-- Atmospheric Composition -->
    <section class="section">
      <h2 class="section-title">Atmospheric Composition</h2>
      <p>
        Dry clean air composition remains practically constant up to altitudes of 90&ndash;95 km.
        The ISA uses the following composition near sea level (from ISO 2533:2026 Table 2).
        CO&#8322; content is updated from NOAA Global Monthly Mean data (December 2025).
      </p>
      <div class="table-responsive">
        <table class="results-table layer-table">
          <thead>
            <tr>
              <th>Gas</th>
              <th>Name</th>
              <th class="text-right">Volume %</th>
              <th class="text-right">Molar Mass (kg/kmol)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="gas in atmosphericComposition" :key="gas.gas">
              <td class="property-name"><strong>{{ gas.gas }}</strong></td>
              <td>{{ gas.name }}</td>
              <td class="property-value">{{ gas.volume }}</td>
              <td class="property-value">{{ gas.molarMass }}</td>
            </tr>
            <tr class="total-row">
              <td colspan="2"><strong>Total dry air</strong></td>
              <td class="property-value">100</td>
              <td class="property-value">{{ DERIVED_CONSTANTS.M.toFixed(6) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Sea-level Characteristics -->
    <section class="section">
      <h2 class="section-title">Sea-level Characteristics</h2>
      <p>
        In addition to the primary constants, ISO 2533:2026 Table 3 defines the following
        derived physical characteristics at mean sea level (H&nbsp;=&nbsp;0), calculated from
        the fundamental constants.
      </p>
      <div class="table-responsive">
        <table class="results-table layer-table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Symbol</th>
              <th class="text-right">Value</th>
              <th>Unit</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in seaLevelCharacteristics" :key="c.desc">
              <td>{{ c.desc }}</td>
              <td class="property-name"><span v-html="c.symbol"></span></td>
              <td class="property-value">{{ c.value }}</td>
              <td><code>{{ c.unit }}</code></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Temperature Layers -->
    <section class="section">
      <h2 class="section-title">Temperature Layers</h2>
      <p>
        The atmosphere is divided into 9 layers, each characterized by a base geopotential
        altitude, base temperature, and vertical temperature gradient
        (<math><msub><mi>&beta;</mi><mi>s</mi></msub></math>).
        A gradient of zero indicates an isothermal layer.
      </p>

      <div class="table-responsive">
        <table class="results-table layer-table">
          <thead>
            <tr>
              <th>Layer</th>
              <th class="text-right">Base <math><mi>H</mi></math> (m)</th>
              <th class="text-right">Base <math><mi>T</mi></math> (K)</th>
              <th class="text-right"><math><msub><mi>&beta;</mi><mi>s</mi></msub></math> (K/m)</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(layer, i) in TEMPERATURE_LAYERS" :key="i">
              <td class="property-name">{{ i + 1 }}</td>
              <td class="property-value">{{ layer.H }}</td>
              <td class="property-value">{{ layer.T }}</td>
              <td class="property-value">{{ layer.B !== undefined ? layer.B : '0' }}</td>
              <td>
                <span v-if="i === 0">Lower Troposphere</span>
                <span v-else-if="i === 1">Tropopause</span>
                <span v-else-if="i === 2">Lower Stratosphere</span>
                <span v-else-if="i === 3">Stratosphere</span>
                <span v-else-if="i === 4">Upper Stratosphere</span>
                <span v-else-if="i === 5">Stratopause</span>
                <span v-else-if="i === 6">Mesosphere</span>
                <span v-else-if="i === 7">Upper Mesosphere</span>
                <span v-else>Top</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Formulas -->
    <section class="section">
      <h2 class="section-title">Calculation Approach</h2>
      <p>
        The ISA formulas are implemented in our open-source library. Below is a summary
        of the approach used for each layer type.
      </p>

      <h3>Non-isothermal layers (<math><msub><mi>&beta;</mi><mi>s</mi></msub><mo>&ne;</mo><mn>0</mn></math>)</h3>
      <p>
        When the temperature gradient
        <math><msub><mi>&beta;</mi><mi>s</mi></msub></math>
        is non-zero, temperature varies linearly with geopotential altitude
        <math><mi>H</mi></math>:
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
                  <mo>&times;</mo>
                  <mo>(</mo><mi>H</mi><mo>&minus;</mo><msub><mi>H</mi><mi>b</mi></msub><mo>)</mo>
                </mrow>
              </mtd>
            </mtr>
            <mtr>
              <mtd>
                <mrow>
                  <mi>p</mi><mo>(</mo><mi>H</mi><mo>)</mo>
                  <mo>=</mo>
                  <msub><mi>p</mi><mi>b</mi></msub>
                  <mo>&times;</mo>
                  <msup>
                    <mrow>
                      <mo>(</mo>
                      <mfrac>
                        <mrow><mi>T</mi><mo>(</mo><mi>H</mi><mo>)</mo></mrow>
                        <msub><mi>T</mi><mi>b</mi></msub>
                      </mfrac>
                      <mo>)</mo>
                    </mrow>
                    <mrow>
                      <mo>&minus;</mo>
                      <mfrac>
                        <msub><mi>g</mi><mi>n</mi></msub>
                        <mrow><msub><mi>&beta;</mi><mi>s</mi></msub><mo>&times;</mo><mi>R</mi></mrow>
                      </mfrac>
                    </mrow>
                  </msup>
                </mrow>
              </mtd>
            </mtr>
            <mtr>
              <mtd>
                <mrow>
                  <mi>&rho;</mi><mo>(</mo><mi>H</mi><mo>)</mo>
                  <mo>=</mo>
                  <mfrac>
                    <mrow><mi>p</mi><mo>(</mo><mi>H</mi><mo>)</mo></mrow>
                    <mrow><mi>R</mi><mo>&times;</mo><mi>T</mi><mo>(</mo><mi>H</mi><mo>)</mo></mrow>
                  </mfrac>
                </mrow>
              </mtd>
            </mtr>
          </mtable>
        </math>
      </div>

      <h3 class="api-subsection">Isothermal layers (<math><msub><mi>&beta;</mi><mi>s</mi></msub><mo>=</mo><mn>0</mn></math>)</h3>
      <p>
        In isothermal layers, temperature remains constant and pressure decreases exponentially:
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
                </mrow>
              </mtd>
              <mtd><mtext>(constant)</mtext></mtd>
            </mtr>
            <mtr>
              <mtd>
                <mrow>
                  <mi>p</mi><mo>(</mo><mi>H</mi><mo>)</mo>
                  <mo>=</mo>
                  <msub><mi>p</mi><mi>b</mi></msub>
                  <mo>&times;</mo>
                  <mi>exp</mi>
                  <mo>(</mo>
                  <mfrac>
                    <mrow><mo>&minus;</mo><msub><mi>g</mi><mi>n</mi></msub><mo>&times;</mo><mo>(</mo><mi>H</mi><mo>&minus;</mo><msub><mi>H</mi><mi>b</mi></msub><mo>)</mo></mrow>
                    <mrow><mi>R</mi><mo>&times;</mo><msub><mi>T</mi><mi>b</mi></msub></mrow>
                  </mfrac>
                  <mo>)</mo>
                </mrow>
              </mtd>
            </mtr>
            <mtr>
              <mtd>
                <mrow>
                  <mi>&rho;</mi><mo>(</mo><mi>H</mi><mo>)</mo>
                  <mo>=</mo>
                  <mfrac>
                    <mrow><mi>p</mi><mo>(</mo><mi>H</mi><mo>)</mo></mrow>
                    <mrow><mi>R</mi><mo>&times;</mo><msub><mi>T</mi><mi>b</mi></msub></mrow>
                  </mfrac>
                </mrow>
              </mtd>
            </mtr>
          </mtable>
        </math>
      </div>

      <h3 class="api-subsection">Density and specific weight</h3>
      <p>
        Density is calculated from pressure and temperature via the perfect gas law:
      </p>
      <div class="math-block">
        <math display="block">
          <mrow>
            <mi>&rho;</mi><mo>=</mo>
            <mfrac><mi>p</mi><mrow><mi>R</mi><mo>&times;</mo><mi>T</mi></mrow></mfrac>
          </mrow>
        </math>
      </div>
      <p>
        Specific weight is the weight per unit volume of air:
      </p>
      <div class="math-block">
        <math display="block">
          <mrow>
            <mi>&gamma;</mi><mo>=</mo><mi>&rho;</mi><mo>&times;</mo><mi>g</mi>
          </mrow>
        </math>
      </div>

      <h3 class="api-subsection">Speed of sound</h3>
      <p>
        The speed of propagation of an infinitesimal perturbation in the gas.
        Not valid for shock waves or above the altitude limits of the standard.
      </p>
      <div class="math-block">
        <math display="block">
          <mrow>
            <mi>a</mi><mo>=</mo>
            <msqrt><mrow><mi>&kappa;</mi><mo>&times;</mo><mi>R</mi><mo>&times;</mo><mi>T</mi></mrow></msqrt>
            <mo>&asymp;</mo>
            <mn>20.04676</mn><mo>&times;</mo>
            <msqrt><mi>T</mi></msqrt>
          </mrow>
        </math>
      </div>

      <h3 class="api-subsection">Dynamic viscosity (Sutherland&rsquo;s formula)</h3>
      <p>
        Based on kinetic theory with experimentally derived constants. Invalid above 90 km altitude.
      </p>
      <div class="math-block">
        <math display="block">
          <mrow>
            <mi>&mu;</mi><mo>=</mo>
            <mfrac>
              <mrow><msub><mi>&beta;</mi><mi>s</mi></msub><mo>&times;</mo><msup><mi>T</mi><mrow><mn>3</mn><mo>/</mo><mn>2</mn></mrow></msup></mrow>
              <mrow><mi>T</mi><mo>+</mo><mi>S</mi></mrow>
            </mfrac>
          </mrow>
        </math>
      </div>

      <h3 class="api-subsection">Kinematic viscosity</h3>
      <div class="math-block">
        <math display="block">
          <mrow>
            <mi>&nu;</mi><mo>=</mo>
            <mfrac><mi>&mu;</mi><mi>&rho;</mi></mfrac>
          </mrow>
        </math>
      </div>

      <h3 class="api-subsection">Thermal conductivity</h3>
      <p>
        Calculated from an empirical formula with coefficients derived from experiments.
      </p>
      <div class="math-block">
        <math display="block">
          <mrow>
            <mi>&lambda;</mi><mo>=</mo>
            <mfrac>
              <mrow><mn>2.648151</mn><mo>&times;</mo><msup><mn>10</mn><mrow><mo>&minus;</mo><mn>3</mn></mrow></msup><mo>&times;</mo><msup><mi>T</mi><mrow><mn>3</mn><mo>/</mo><mn>2</mn></mrow></msup></mrow>
              <mrow><mi>T</mi><mo>+</mo><mn>245.4</mn><mo>&times;</mo><msup><mn>10</mn><mrow><mo>&minus;</mo><mrow><mn>12</mn><mo>/</mo><mi>T</mi></mrow></mrow></msup></mrow>
            </mfrac>
          </mrow>
        </math>
      </div>

      <h3 class="api-subsection">Pressure scale height</h3>
      <div class="math-block">
        <math display="block">
          <mrow>
            <msub><mi>H</mi><mi>p</mi></msub><mo>=</mo>
            <mfrac><mrow><mi>R</mi><mo>&times;</mo><mi>T</mi></mrow><mi>g</mi></mfrac>
          </mrow>
        </math>
      </div>

      <h3 class="api-subsection">Air number density</h3>
      <p>The number of neutral air particles per unit volume:</p>
      <div class="math-block">
        <math display="block">
          <mrow>
            <mi>n</mi><mo>=</mo>
            <mfrac>
              <mrow><msub><mi>N</mi><mi>A</mi></msub><mo>&times;</mo><mi>p</mi></mrow>
              <mrow><msup><mi>R</mi><mo>*</mo></msup><mo>&times;</mo><mi>T</mi></mrow>
            </mfrac>
          </mrow>
        </math>
      </div>

      <h3 class="api-subsection">Mean air-particle speed</h3>
      <p>
        Arithmetic average of air-particle speeds from Maxwell&rsquo;s distribution of molecular speeds:
      </p>
      <div class="math-block">
        <math display="block">
          <mrow>
            <mover><mi>v</mi><mo>&macr;</mo></mover><mo>=</mo>
            <msqrt><mrow><mfrac><mn>8</mn><mi>&pi;</mi></mfrac><mo>&times;</mo><mi>R</mi><mo>&times;</mo><mi>T</mi></mrow></msqrt>
            <mo>&asymp;</mo>
            <mn>1.595769</mn><mo>&times;</mo><msqrt><mrow><mi>R</mi><mo>&times;</mo><mi>T</mi></mrow></msqrt>
          </mrow>
        </math>
      </div>

      <h3 class="api-subsection">Mean free path</h3>
      <p>
        The average distance an air particle travels between successive collisions:
      </p>
      <div class="math-block">
        <math display="block">
          <mrow>
            <mi>l</mi><mo>=</mo>
            <mfrac>
              <mrow><msup><mi>R</mi><mo>*</mo></msup><mo>&times;</mo><mi>T</mi></mrow>
              <mrow><msqrt><mn>2</mn></msqrt><mo>&times;</mo><mi>&pi;</mi><mo>&times;</mo><msub><mi>N</mi><mi>A</mi></msub><mo>&times;</mo><msup><mi>&sigma;</mi><mn>2</mn></msup><mo>&times;</mo><mi>p</mi></mrow>
            </mfrac>
            <mo>=</mo>
            <mfrac><mn>1</mn><mrow><msqrt><mn>2</mn></msqrt><mo>&times;</mo><mi>&pi;</mi><mo>&times;</mo><msup><mi>&sigma;</mi><mn>2</mn></msup><mo>&times;</mo><mi>n</mi></mrow></mfrac>
          </mrow>
        </math>
      </div>

      <h3 class="api-subsection">Collision frequency</h3>
      <p>The mean air-particle speed divided by the mean free path:</p>
      <div class="math-block">
        <math display="block">
          <mrow>
            <mi>&omega;</mi><mo>=</mo>
            <mn>4</mn><mo>&times;</mo><msup><mi>&sigma;</mi><mn>2</mn></msup><mo>&times;</mo><msub><mi>N</mi><mi>A</mi></msub>
            <mo>&times;</mo><msqrt><mfrac><mi>&pi;</mi><mrow><msup><mi>R</mi><mo>*</mo></msup><mo>&times;</mo><mi>M</mi></mrow></mfrac></msqrt>
            <mo>&times;</mo><mfrac><mi>p</mi><msqrt><mi>T</mi></msqrt></mfrac>
          </mrow>
        </math>
      </div>
    </section>

    <!-- Standards Family -->
    <section class="section">
      <h2 class="section-title">Related Standards</h2>
      <p>
        The ISA model is related to several international standards. For the full bibliography
        and detailed comparisons, see the <router-link to="/references">References</router-link> page.
      </p>
      <div class="table-responsive">
        <table class="results-table layer-table">
          <thead>
            <tr>
              <th>Standard</th>
              <th>Altitude Range</th>
              <th>Relationship</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="property-name">ISO 2533:1975</td>
              <td>-2 km to 32 km</td>
              <td>Foundation document</td>
            </tr>
            <tr>
              <td class="property-name">ICAO Doc 7488/3</td>
              <td>-2 km to 80 km</td>
              <td>Extends ISA to 80 km</td>
            </tr>
            <tr>
              <td class="property-name">US Std Atm 1976</td>
              <td>-2 km to 1,000 km</td>
              <td>Identical to ISA to 32 km</td>
            </tr>
            <tr>
              <td class="property-name">WMO</td>
              <td>-2 km to 32 km</td>
              <td>Identical to ISA</td>
            </tr>
            <tr>
              <td class="property-name">ISO 2533:2026</td>
              <td>&minus;5 km to 80 km</td>
              <td>Modern revision</td>
            </tr>
            <tr>
              <td class="property-name"><router-link to="/iso-5878">ISO 5878</router-link></td>
              <td>Reference atmospheres for aerospace use</td>
              <td>Companion: observed conditions by latitude and season</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Try the Calculator CTA -->
    <section class="section">
      <div class="cta-card">
        <h2>Try the Calculator</h2>
        <p>
          Compute atmospheric properties at any altitude using our interactive calculator,
          featuring 3D visualization, 2D charts, and table generation.
        </p>
        <div class="cta-links">
          <router-link to="/calculator" class="btn btn-primary">
            Open Calculator
          </router-link>
          <router-link to="/symbols" class="btn btn-outline">
            Symbols &amp; Variables
          </router-link>
        </div>
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
              Purchase the ISO 2533 documents from the ISO Store for the complete specification,
              all equations, and authoritative reference tables.
            </p>
          </div>
        </div>

        <!-- Latest revision -->
        <div class="iso-purchase-group">
          <h3 class="iso-purchase-group-title">Current revision</h3>
          <div class="iso-purchase-item">
            <div class="iso-purchase-item-desc">
              <strong>ISO/DIS 2533</strong> &mdash;
              Second edition that cancels and replaces ISO 2533:1975 and all its addenda.
              Covers &minus;5 km to 80 km, includes hypsometrical tables, and recalculates
              all values using modern computational methods.
            </div>
            <a href="https://www.iso.org/standard/90293.html" target="_blank" rel="noopener" class="btn btn-primary iso-purchase-btn">
              Purchase ISO/DIS 2533
            </a>
          </div>
        </div>

        <!-- Legacy documents -->
        <div class="iso-purchase-group iso-purchase-legacy">
          <h3 class="iso-purchase-group-title">Previous edition (superseded by ISO/DIS 2533)</h3>
          <div class="iso-purchase-item">
            <div class="iso-purchase-item-desc">
              <strong>ISO 2533:1975</strong> &mdash;
              First edition. Standard Atmosphere from &minus;2 km to 80 km geopotential altitude.
            </div>
            <a href="https://www.iso.org/standard/7472.html" target="_blank" rel="noopener" class="btn btn-outline iso-purchase-btn-legacy">
              ISO Store
            </a>
          </div>
          <div class="iso-purchase-item">
            <div class="iso-purchase-item-desc">
              <strong>Addendum 1:1985</strong> &mdash;
              Hypsometrical tables for instrument calibration (pressure to altitude in hPa and mmHg).
            </div>
            <a href="https://www.iso.org/standard/7473.html" target="_blank" rel="noopener" class="btn btn-outline iso-purchase-btn-legacy">
              ISO Store
            </a>
          </div>
          <div class="iso-purchase-item">
            <div class="iso-purchase-item-desc">
              <strong>Addendum 2:1997</strong> &mdash;
              Extension to &minus;5,000 m and atmosphere tables in feet.
            </div>
            <a href="https://www.iso.org/standard/7474.html" target="_blank" rel="noopener" class="btn btn-outline iso-purchase-btn-legacy">
              ISO Store
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.total-row td {
  background: var(--color-surface-elevated);
  font-weight: var(--font-weight-semibold);
}

.why-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
}

.why-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  position: relative;
  overflow: hidden;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.why-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--color-accent), var(--color-accent-light));
}

.why-card:hover {
  border-color: var(--color-accent);
  box-shadow: var(--shadow-sm);
}

.why-card h3 {
  font-family: var(--font-display);
  font-size: var(--font-size-base);
  margin-bottom: var(--spacing-xs);
}

.why-card p {
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  line-height: var(--line-height-relaxed);
  margin-bottom: 0;
}
</style>
