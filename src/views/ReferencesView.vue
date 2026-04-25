<script setup>
import { useSeo } from '@/composables/useSeo'

useSeo({
  title: 'References',
  description: 'References and bibliography for the ISO 2533 Standard Atmosphere model and related standards.',
  path: '/references'
})

const references = [
  {
    title: 'ISO 2533:1975',
    org: 'International Organization for Standardization',
    year: '1975',
    description: 'Standard Atmosphere. Defines the reference atmospheric model from -2,000 m to 80,000 m geopotential altitude, specifying temperature, pressure, density, and other thermodynamic properties.',
    relationship: 'Foundation document — the primary standard this site implements.',
    link: 'https://www.iso.org/standard/7472.html'
  },
  {
    title: 'ISO 2533:1975/Add 1:1985',
    org: 'International Organization for Standardization',
    year: '1985',
    description: 'Standard Atmosphere — Addendum 1: Hypsometrical tables. Provides hypsometrical tables as a supplement to the base standard.',
    relationship: 'Addendum to ISO 2533:1975, providing additional hypsometrical reference tables.',
    link: 'https://www.iso.org/standard/7473.html'
  },
  {
    title: 'ISO 2533:1975/Add 2:1997',
    org: 'International Organization for Standardization',
    year: '1997',
    description: 'Standard Atmosphere — Addendum 2: Extension to -5,000 m and standard atmosphere as a function of altitude in feet.',
    relationship: 'Addendum to ISO 2533:1975, extending the altitude range and adding foot-based altitude definitions.',
    link: 'https://www.iso.org/standard/7474.html'
  },
  {
    title: 'ISO 2533:2026 (forthcoming)',
    org: 'International Organization for Standardization',
    year: '2026',
    description: 'Revised edition of the Standard Atmosphere currently in development. Updates the 1975 standard with modern constants, improved computational methods, and extended altitude coverage.',
    relationship: 'Modern revision of ISO 2533:1975, currently in preparation.',
    link: 'https://www.iso.org/standard/90293.html'
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
    title: 'UnitsML',
    org: 'UnitsML Group',
    year: '2011',
    description: 'Units Markup Language. An XML vocabulary for encoding scientific units of measure.',
    relationship: 'Standards-based representation of units used in atmospheric calculations.',
    link: 'https://www.oasis-open.org/committees/unitsml'
  }
]

const standardsComparison = [
  { standard: 'ISO 2533:1975', range: '-2 km to 32 km', relation: 'Foundation document', color: '#6366f1' },
  { standard: 'ISO 2533:2026', range: 'TBD', relation: 'Modern revision (in progress)', color: '#818cf8' },
  { standard: 'ICAO Doc 7488/3', range: '-2 km to 80 km', relation: 'Extends ISA to 80 km', color: '#a855f7' },
  { standard: 'US Std Atm 1976', range: '-2 km to 1,000 km', relation: 'Identical to 32 km', color: '#3b82f6' },
  { standard: 'WMO', range: '-2 km to 32 km', relation: 'Identical to ISA', color: '#06b6d4' },
]
</script>

<template>
  <div class="content-page">
    <div class="content-hero">
      <h1>References</h1>
      <p>Bibliography and related standards for the ISO 2533 Standard Atmosphere model.</p>
    </div>

    <div class="content-body">
      <!-- Standards Family Comparison -->
      <section class="content-section">
        <h2>Standards Family</h2>
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
      <section class="content-section">
        <h2>Bibliography</h2>
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
    </div>
  </div>
</template>
