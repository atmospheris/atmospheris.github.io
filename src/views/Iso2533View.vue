<script setup>
import { CONSTANTS, DERIVED_CONSTANTS, TEMPERATURE_LAYERS } from 'atmospheris'
import { useSeo } from '@/composables/useSeo'

useSeo({
  title: 'ISO 2533 Standard Atmosphere',
  description: 'The ISO 2533 Standard Atmosphere model defines a reference vertical distribution of atmospheric properties. Key constants, temperature layers, and formulas.',
  path: '/iso-2533'
})
</script>

<template>
  <div class="content-page">
    <h1>ISO 2533 Standard Atmosphere</h1>
    <p class="content-lead">
      The International Standard Atmosphere (ISA) is a reference model that defines the vertical
      distribution of atmospheric temperature, pressure, density, and other properties from
      sea level to 80 km altitude.
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
          <dd class="constant-desc">Standard gravitational acceleration</dd>
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
          <dd class="constant-desc">Standard pressure</dd>
        </div>
        <div class="constant-item">
          <dt>
            <math>
              <msub><mi>&rho;</mi><mi>n</mi></msub>
            </math>
          </dt>
          <dd>{{ CONSTANTS.rho_n }} kg/m&sup3;</dd>
          <dd class="constant-desc">Standard density</dd>
        </div>
        <div class="constant-item">
          <dt>
            <math>
              <msub><mi>T</mi><mi>n</mi></msub>
            </math>
          </dt>
          <dd>{{ CONSTANTS.T_n }} K</dd>
          <dd class="constant-desc">Standard temperature</dd>
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
          <dd class="constant-desc">Nominal Earth radius</dd>
        </div>
        <div class="constant-item">
          <dt>
            <math><mi>&kappa;</mi></math>
          </dt>
          <dd>{{ CONSTANTS.kappa }}</dd>
          <dd class="constant-desc">Adiabatic index / heat capacity ratio</dd>
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
          <dd>{{ DERIVED_CONSTANTS.R.toFixed(3) }} J/(kg&middot;K)</dd>
          <dd class="constant-desc">Specific gas constant for air (derived)</dd>
        </div>
      </dl>
    </section>

    <!-- Temperature Layers -->
    <section class="section">
      <h2 class="section-title">Temperature Layers</h2>
      <p>
        The atmosphere is divided into 8 layers, each characterized by a base geopotential
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

      <h3 class="api-subsection">Additional properties</h3>
      <p>
        From temperature, pressure, and density, the model derives:
        speed of sound, dynamic and kinematic viscosity, thermal conductivity,
        specific weight, pressure scale height, air number density,
        mean particle speed, mean free path, and collision frequency.
      </p>
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
              <td>TBD</td>
              <td>Modern revision (in progress)</td>
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
        <router-link to="/calculator" class="btn btn-primary">
          Open Calculator
        </router-link>
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
