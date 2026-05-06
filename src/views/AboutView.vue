<script setup>
import { ref } from 'vue'
import { useSeo } from '@/composables/useSeo'

useSeo({
  title: 'About Atmospheris',
  description: 'Atmospheris — Atmosphere + International Standard. The open-source reference implementation of ISO 2533 Standard Atmosphere, published by ISO/TC 20/SC 6 and Ribose.',
  path: '/about'
})

const expanded = ref(new Set())

function toggle(key) {
  const s = new Set(expanded.value)
  if (s.has(key)) s.delete(key)
  else s.add(key)
  expanded.value = s
}
</script>

<template>
  <div>
    <!-- Hero: Name Origin -->
    <section class="about-hero">
      <div class="about-hero-content">
        <p class="about-eyebrow">About</p>
        <h1 class="about-name">Atmospher<span class="name-accent">is</span></h1>
        <div class="name-etymology">
          <span class="etym-from">Atmospher<sup>e</sup></span>
          <span class="etym-plus">+</span>
          <span class="etym-accent">IS</span>
        </div>
        <p class="etym-note">International Standard</p>
        <p class="about-tagline">
          Serving atmospheric resources compliant with international standards.
        </p>
      </div>
    </section>

    <!-- Mission -->
    <section class="about-section">
      <div class="about-section-inner">
        <h2 class="about-section-title">Our Mission</h2>
        <p class="about-mission-text">
          Atmospheris provides the authoritative open-source implementation of the
          ISO 2533 Standard Atmosphere model &mdash; a reference framework used worldwide
          in aerospace engineering, atmospheric science, and industrial applications.
        </p>
        <p>
          We make the International Standard Atmosphere accessible through
          interactive calculation tools, comprehensive libraries, and transparent,
          verifiable algorithms that anyone can inspect, use, and contribute to.
        </p>
      </div>
    </section>

    <!-- The Logo -->
    <section class="about-section about-section-alt">
      <div class="about-section-inner">
        <h2 class="about-section-title">The Logo</h2>

        <div class="logo-breakdown">
          <div class="logo-display">
            <img src="@/assets/images/atmospheris-logo.svg" alt="Atmospheris Logo" class="the-logo-image" />
          </div>
          <div class="logo-details">
            <p class="logo-intro">
              The Atmospheris logo is a stylized cross-section of Earth's atmosphere
              &mdash; five curved bands, each representing one of the principal
              atmospheric layers, arranged from the densest to the thinnest.
            </p>
            <div class="logo-layers-list">
              <div class="logo-layer-row">
                <span class="layer-swatch" style="background: #f3e0d3;"></span>
                <div class="layer-info">
                  <strong>Exosphere</strong>
                  <span>The outermost shell, fading into the vacuum of space</span>
                </div>
              </div>
              <div class="logo-layer-row">
                <span class="layer-swatch" style="background: #7abae5;"></span>
                <div class="layer-info">
                  <strong>Thermosphere</strong>
                  <span>Where the International Space Station orbits and auroras ignite</span>
                </div>
              </div>
              <div class="logo-layer-row">
                <span class="layer-swatch" style="background: #2c84bf;"></span>
                <div class="layer-info">
                  <strong>Mesosphere</strong>
                  <span>The coldest atmospheric layer, where meteors burn up</span>
                </div>
              </div>
              <div class="logo-layer-row">
                <span class="layer-swatch" style="background: #33588e;"></span>
                <div class="layer-info">
                  <strong>Stratosphere</strong>
                  <span>Home to the ozone layer &mdash; stable, calm, and critical</span>
                </div>
              </div>
              <div class="logo-layer-row">
                <span class="layer-swatch" style="background: #1f2b3e;"></span>
                <div class="layer-info">
                  <strong>Troposphere</strong>
                  <span>Where all weather happens &mdash; the densest band of all</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="origin-block">
          <h3 class="origin-heading">The Name</h3>
          <p>
            <strong>Atmospheris</strong> blends two roots:
            the Ancient Greek <em>atmos</em> (ἀτμός,
            &ldquo;vapour&rdquo;) + <em>sphaira</em> (σφαῖρα,
            &ldquo;sphere&rdquo;), giving us <em>atmosphere</em> &mdash;
            the gaseous envelope surrounding Earth &mdash; and the suffix
            <strong>&ndash;is</strong>, a direct nod to <strong>IS</strong> in
            <em>International Standard</em>, the class of ISO documents that
            define globally harmonized technical references.
          </p>
          <p>
            The name captures the project&rsquo;s purpose in a single word:
            the <em>atmosphere</em>, made accessible through an
            <em>International Standard</em>.
          </p>
        </div>

        <div class="origin-block">
          <h3 class="origin-heading">Why It Was Built</h3>
          <p>
            Atmospheris was first developed as a companion tool for the revised
            <strong>ISO&nbsp;2533</strong> and <strong>ISO&nbsp;5878</strong> standards,
            giving standards users a dynamic calculator and clear reference materials
            to better understand the background and information described in the standards.
          </p>
        </div>
      </div>
    </section>

    <!-- Three Pillars -->
    <section class="about-section">
      <div class="about-section-inner">
        <h2 class="about-section-title">What We Build</h2>
        <div class="pillars-grid">
          <div class="pillar-card">
            <div class="pillar-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            </div>
            <h3>Open-Source Libraries</h3>
            <p>Reference implementations in Ruby and TypeScript, providing the complete set of ISA calculations defined in ISO 2533.</p>
            <div class="pillar-detail">
              <button class="pillar-toggle" @click="toggle('libs')">
                {{ expanded.has('libs') ? 'Show less' : 'Learn more' }}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline :points="expanded.has('libs') ? '18 15 12 9 6 15' : '6 9 12 15 18 9'"/></svg>
              </button>
              <div v-if="expanded.has('libs')" class="pillar-expanded">
                <ul>
                  <li>19+ atmospheric properties computed per altitude</li>
                  <li>Altitude range: &minus;2,000&thinsp;m to 80,000&thinsp;m geopotential</li>
                  <li>Normal and reduced precision modes</li>
                  <li>Reverse pressure-to-altitude lookup</li>
                  <li>Multiple unit systems (SI, imperial, aviation)</li>
                  <li>Cited in the upcoming ISO 2533:2026 revision</li>
                </ul>
              </div>
            </div>
          </div>

          <div class="pillar-card">
            <div class="pillar-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            </div>
            <h3>Interactive Calculator</h3>
            <p>A professional web calculator with 3D atmosphere visualization, 2D charts, table generation, and unit-aware property display.</p>
            <div class="pillar-detail">
              <button class="pillar-toggle" @click="toggle('calc')">
                {{ expanded.has('calc') ? 'Show less' : 'Learn more' }}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline :points="expanded.has('calc') ? '18 15 12 9 6 15' : '6 9 12 15 18 9'"/></svg>
              </button>
              <div v-if="expanded.has('calc')" class="pillar-expanded">
                <ul>
                  <li>Altitude-to-properties and pressure-to-altitude modes</li>
                  <li>3D interactive atmosphere column (Three.js)</li>
                  <li>2D scientific charts (temperature, pressure, density vs altitude)</li>
                  <li>Custom table generator with configurable ranges</li>
                  <li>Per-row unit toggles (metric / imperial)</li>
                  <li>Export to CSV, copy-to-clipboard, print layout</li>
                </ul>
              </div>
            </div>
          </div>

          <div class="pillar-card">
            <div class="pillar-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8"/></svg>
            </div>
            <h3>Standards Documentation</h3>
            <p>Comprehensive reference materials covering ISO 2533 constants, formulas, temperature layers, symbols, and related standards.</p>
            <div class="pillar-detail">
              <button class="pillar-toggle" @click="toggle('docs')">
                {{ expanded.has('docs') ? 'Show less' : 'Learn more' }}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline :points="expanded.has('docs') ? '18 15 12 9 6 15' : '6 9 12 15 18 9'"/></svg>
              </button>
              <div v-if="expanded.has('docs')" class="pillar-expanded">
                <ul>
                  <li>Complete symbol and variable reference</li>
                  <li>All 8 temperature layers with base values</li>
                  <li>Pressure and temperature formulas per layer type</li>
                  <li>Related standards comparison (ICAO, US 1976, WMO)</li>
                  <li>Bibliography of key references</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Standards Compliance -->
    <section class="about-section">
      <div class="about-section-inner">
        <h2 class="about-section-title">Standards Compliance</h2>
        <div class="standards-banner">
          <p class="standards-banner-highlight">
            Atmospheris is cited in the upcoming <strong>ISO 2533:2026</strong> revision
            as the reference implementation for programmatic ISA calculations.
          </p>
          <p>
            The implementation follows the complete specification of ISO 2533:1975
            (including Addenda 1:1985 and 2:1997), providing results identical to
            the published reference tables.
          </p>
          <router-link to="/iso-2533" class="btn btn-outline-dark about-cta">
            Learn about ISO 2533
          </router-link>
        </div>
      </div>
    </section>

    <!-- Published by -->
    <section class="about-section about-section-alt">
      <div class="about-section-inner">
        <h2 class="about-section-title">Published by</h2>
        <div class="publisher-grid">
          <div class="publisher-card">
            <a href="https://www.iso.org/committee/46560.html" target="_blank" rel="noopener" class="publisher-logo-link" aria-label="ISO/TC 20/SC 6">
              <img src="/iso-logo.svg" alt="ISO" class="publisher-logo iso-logo" width="100" height="100">
            </a>
            <div class="publisher-body">
              <h3 class="publisher-name">
                <a href="https://www.iso.org/committee/46560.html" target="_blank" rel="noopener">ISO/TC 20/SC 6</a>
              </h3>
              <p class="publisher-subtitle">Standard Atmospheres</p>
              <div class="publisher-text">
                <p>
                  ISO Technical Committee 20, Subcommittee 6 &mdash; the body responsible for
                  standardizing atmospheric reference models for aerospace, aviation,
                  and meteorology worldwide.
                </p>
                <p>
                  SC 6 authored the foundational <strong>ISO/R 2533:1975</strong> and the
                  authoritative <strong>ISO 5878:1982</strong>, whose work underpins aircraft
                  performance certification, spacecraft design, and weather forecasting.
                </p>
              </div>
              <a href="https://www.iso.org/committee/46560.html" target="_blank" rel="noopener" class="about-external-link">
                iso.org/committee/46560
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>
              </a>
            </div>
          </div>
          <div class="publisher-card">
            <a href="https://www.ribose.com" target="_blank" rel="noopener" class="publisher-logo-link" aria-label="Ribose">
              <img src="/ribose-logo.svg" alt="Ribose" class="publisher-logo ribose-publisher-logo" width="140" height="35">
            </a>
            <div class="publisher-body">
              <div class="publisher-text">
                <p>
                  Ribose provides technical support to ISO/TC 20/SC 6, developing and
                  maintaining Atmospheris as the committee&rsquo;s reference implementation
                  of the International Standard Atmosphere.
                </p>
                <p>
                  Ribose is also the author of Metanorma, UniWord, Plurimath, and other
                  open-source tools that bridge the gap between international standards and software.
                </p>
              </div>
              <a href="https://www.ribose.com" target="_blank" rel="noopener" class="about-external-link">
                ribose.com
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Open Source -->
    <section class="about-section">
      <div class="about-section-inner">
        <h2 class="about-section-title">Open Source</h2>
        <p>
          Atmospheris is released under the <strong>BSD-2-Clause</strong> license, allowing
          free use in both open-source and commercial projects.
        </p>
        <div class="oss-links">
          <a href="https://github.com/atmospheris/" target="_blank" rel="noopener" class="oss-link-card">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            <div>
              <strong>Ruby Gem on GitHub</strong>
              <span>riboseinc/atmospheris</span>
            </div>
          </a>
          <a href="https://www.npmjs.com/package/atmospheris" target="_blank" rel="noopener" class="oss-link-card">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
            <div>
              <strong>TypeScript on npm</strong>
              <span>npmjs.com/atmospheris</span>
            </div>
          </a>
        </div>
      </div>
    </section>

    <!-- Get Started -->
    <section class="about-section about-section-alt">
      <div class="about-section-inner">
        <h2 class="about-section-title">Get Started</h2>
        <p style="margin-bottom: var(--spacing-lg);">
          Try the interactive calculator, explore the standards, or integrate the
          library into your project.
        </p>
        <div class="oss-links">
          <router-link to="/calculator" class="oss-link-card">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg>
            <div>
              <strong>Interactive Calculator</strong>
              <span>Calculate atmospheric properties at any altitude</span>
            </div>
          </router-link>
          <router-link to="/api" class="oss-link-card">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></svg>
            <div>
              <strong>Library Documentation</strong>
              <span>Ruby gem and TypeScript/JavaScript API</span>
            </div>
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>
