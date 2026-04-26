<script setup>
import { useSeo } from '@/composables/useSeo'

useSeo({
  title: 'References',
  description: 'References and bibliography for the ISO 2533 Standard Atmosphere model and related standards.',
  path: '/references'
})

const references = [
  {
    title: 'ISO 2533:2026 (forthcoming)',
    org: 'International Organization for Standardization',
    year: '2026',
    description: 'Second edition of Standard Atmosphere. Cancels and replaces ISO 2533:1975 and incorporates Addendum 1, Addendum 2, and errata. Covers -5 km to 80 km, includes hypsometrical tables in hPa, and recalculates all values using modern computational methods with improved accuracy.',
    relationship: 'Current revision — supersedes ISO 2533:1975 and all addenda.',
    link: 'https://www.iso.org/standard/90293.html'
  },
  {
    title: 'ISO 2533:1975',
    org: 'International Organization for Standardization',
    year: '1975',
    description: 'First edition of Standard Atmosphere. Identical with the ICAO and WMO Standard Atmospheres from -2 km to 32 km, extended to 80 km using atmospheric research data. Specifies temperature, pressure, density, and other thermodynamic properties as functions of geometric and geopotential altitude.',
    relationship: 'Original standard — the primary document this site implements.',
    link: 'https://www.iso.org/standard/7472.html'
  },
  {
    title: 'ISO 2533:1975/Add 1:1985',
    org: 'International Organization for Standardization',
    year: '1985',
    description: 'Addendum 1: Hypsometrical tables. Relates geopotential altitude to atmospheric pressure for calibration of aneroid and manometer-type instruments. Covers pressure in hPa (0.01 hPa intervals) and mmHg (0.01 mmHg intervals), plus altitude-to-pressure lookup tables.',
    relationship: 'Supplement to ISO 2533:1975 for instrument calibration.',
    link: 'https://www.iso.org/standard/7473.html'
  },
  {
    title: 'ISO 2533:1975/Add 2:1997',
    org: 'International Organization for Standardization',
    year: '1997',
    description: 'Addendum 2: Extension to -5,000 m and standard atmosphere as a function of altitude in feet. Extends the lower altitude range from -2,000 m to -5,000 m, and provides atmosphere tables in 200 ft and 500 ft steps from -16,500 ft to 262,500 ft.',
    relationship: 'Supplement to ISO 2533:1975 extending range and adding foot-based tables.',
    link: 'https://www.iso.org/standard/7474.html'
  },
  {
    title: 'ICAO Doc 7488/3',
    org: 'International Civil Aviation Organization',
    year: '1993',
    description: 'Manual of the ICAO Standard Atmosphere — extended to 80 kilometres (262,500 feet). Provides the same model as ISO 2533 for the lower atmosphere but extends definitions to higher altitudes.',
    relationship: 'Extends ISA from 32 km to 80 km. Identical to ISO 2533 below 32 km.',
    link: 'https://store.icao.int/en/manual-of-the-icao-standard-atmosphere-extended-to-80-kilometres-262-500-feet-doc-7488'
  },
  {
    title: 'U.S. Standard Atmosphere 1976',
    org: 'NOAA, NASA, USAF',
    year: '1976',
    description: 'The U.S. Standard Atmosphere, 1976. Joint publication by the National Oceanic and Atmospheric Administration, National Aeronautics and Space Administration, and United States Air Force.',
    relationship: 'Identical to ISA from -2 km to 32 km geopotential. Extends to 1,000 km.',
    link: 'https://ntrs.nasa.gov/citations/19770009539'
  },
  {
    title: 'WMO — Guide to Meteorological Instruments and Methods of Observation (WMO-No. 49)',
    org: 'World Meteorological Organization',
    year: '2018',
    description: 'The WMO Guide references the Standard Atmosphere for calibration and standardization of meteorological instruments.',
    relationship: 'Adopts ISA from -2 km to 32 km for meteorological applications.',
    link: 'https://library.wmo.int/records/item/41650-guide-to-meteorological-instruments-and-methods-of-observation'
  },
  {
    title: 'Smithsonian Meteorological Tables',
    org: 'Smithsonian Institution',
    year: '1951/1968',
    description: 'Compiled by Robert J. List. Historical reference containing standard atmosphere tables and extensive meteorological data.',
    relationship: 'Predecessor reference work. ISA values are consistent with these tables.',
    link: null
  },
  {
    title: 'SI Brochure (9th Edition)',
    org: 'Bureau International des Poids et Mesures (BIPM)',
    year: '2019',
    description: 'The International System of Units (SI). Defines all base units (metre, kilogram, second, kelvin, mole) used in the Standard Atmosphere.',
    relationship: 'Defines the system of units used throughout the ISA standard.',
    link: 'https://www.bipm.org/en/publications/si-brochure'
  },
  {
    title: 'ISO/DIS 5878',
    org: 'International Organization for Standardization',
    year: '2025',
    description: 'Reference atmospheres for aerospace use. Provides temperature, pressure, density, wind, and humidity profiles for five latitude zones (15° to 80°N) in seasonal models (January and July). Incorporates previous addenda on wind characteristics and humidity. Includes machine-readable XML electronic inserts.',
    relationship: 'Companion standard — provides observed atmospheric conditions to complement the idealized ISA.',
    link: 'https://www.iso.org/standard/90974.html'
  },
  {
    title: 'ISO 5878:1982',
    org: 'International Organization for Standardization',
    year: '1982',
    description: 'First edition of reference atmospheres for aerospace use. Defines temperature, pressure, and density profiles by latitude zone and season from sea level to 25 km geopotential altitude.',
    relationship: 'Superseded by ISO/DIS 5878.',
    link: 'https://www.iso.org/standard/12077.html'
  },
  {
    title: 'ISO 5878:1982/Add 1:1983',
    org: 'International Organization for Standardization',
    year: '1983',
    description: 'Wind supplement to ISO 5878. Provides zonal and meridional wind component data, scalar mean speeds, and percentile values for four latitude bands, modeled using the circular normal (Rice) distribution.',
    relationship: 'Supplement to ISO 5878:1982 adding wind characteristic data.',
    link: 'https://www.iso.org/standard/12078.html'
  },
  {
    title: 'ISO 5878:1982/Add 2:1983',
    org: 'International Organization for Standardization',
    year: '1983',
    description: 'Humidity supplement to ISO 5878. Provides water vapor pressure and mixing ratio profiles for the same latitude zones and seasonal models.',
    relationship: 'Supplement to ISO 5878:1982 adding humidity profiles.',
    link: 'https://www.iso.org/standard/12079.html'
  },
  {
    title: 'UnitsML',
    org: 'UnitsML Group',
    year: '2011',
    description: 'Units Markup Language. An XML vocabulary for encoding scientific units of measure.',
    relationship: 'Standards-based representation of units used in atmospheric calculations.',
    link: 'https://www.oasis-open.org/committees/unitsml'
  }
]

const standardsComparison = [
  { standard: 'ISO 2533:1975', range: '-2 km to 32 km', relation: 'Foundation document', color: '#2c84bf' },
  { standard: 'ISO 2533:2026', range: '-5 km to 80 km', relation: 'Modern revision', color: '#7abae5' },
  { standard: 'ICAO Doc 7488/3', range: '-2 km to 80 km', relation: 'Extends ISA to 80 km', color: '#a855f7' },
  { standard: 'US Std Atm 1976', range: '-2 km to 1,000 km', relation: 'Identical to 32 km', color: '#3b82f6' },
  { standard: 'WMO', range: '-2 km to 32 km', relation: 'Identical to ISA', color: '#06b6d4' },
  { standard: 'ISO/DIS 5878', range: '0 to 25 km', relation: 'Companion: observed conditions by latitude', color: '#f59e0b' },
]
</script>

<template>
  <div class="content-page">
    <h1>References</h1>
    <p class="content-lead">
      Bibliography and related standards for the ISO Standard Atmosphere models.
    </p>

    <!-- Standards Family Comparison -->
    <section class="section">
      <h2 class="section-title">Standards Family</h2>
        <p>Several international standards define atmosphere models that are related to or derived from the ISO Standard Atmosphere.</p>
        <div class="table-responsive">
          <table class="layer-table">
            <thead>
              <tr>
                <th>Standard</th>
                <th>Altitude Range</th>
                <th>Relationship to ISO 2533</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="s in standardsComparison" :key="s.standard">
                <td>
                  <span class="layer-dot" :style="{ background: s.color }"></span>
                  {{ s.standard }}
                </td>
                <td><code>{{ s.range }}</code></td>
                <td>{{ s.relation }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

    <!-- Bibliography -->
    <section class="section">
      <h2 class="section-title">Bibliography</h2>
        <div class="references-grid">
          <div v-for="ref in references" :key="ref.title" class="ref-card">
            <div class="ref-header">
              <h3>{{ ref.title }}</h3>
              <span class="ref-year">{{ ref.year }}</span>
            </div>
            <p class="ref-org">{{ ref.org }}</p>
            <p class="ref-desc">{{ ref.description }}</p>
            <div class="ref-relationship">
              <strong>Relationship:</strong> {{ ref.relationship }}
            </div>
            <a v-if="ref.link" :href="ref.link" target="_blank" rel="noopener" class="ref-link">
              View source
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </a>
          </div>
        </div>
      </section>

    <!-- Next Steps -->
    <section class="section">
      <div class="cta-card">
        <h2>Explore the Standards</h2>
        <p>
          Dive into the implementation details, constants, and interactive tools
          for each standard.
        </p>
        <div class="cta-links">
          <router-link to="/calculator" class="btn btn-primary">Open Calculator</router-link>
          <router-link to="/iso-2533" class="btn btn-outline-dark">ISO 2533</router-link>
          <router-link to="/iso-5878" class="btn btn-outline-dark">ISO 5878</router-link>
        </div>
      </div>
    </section>
  </div>
</template>
