<script setup>
import { useSeo, buildSoftwareApplicationSchema } from '@/composables/useSeo'

useSeo({
  title: 'API Documentation',
  description: 'Atmospheris API documentation — Ruby gem and TypeScript/JavaScript library for ISO 2533 Standard Atmosphere and ISO 5878 wind distribution calculations.',
  path: '/api',
  schema: buildSoftwareApplicationSchema()
})
</script>

<template>
  <div class="content-page">
    <h1>API Documentation</h1>
    <p class="content-lead">
      Atmospheris provides the ISO 2533 Standard Atmosphere model and ISO 5878 wind
      distribution calculations as both a Ruby gem and a TypeScript/JavaScript library.
      Both implement the complete set of atmospheric property calculations from the
      standard, covering all 19 derived properties across the full altitude range of
      &minus;2,000&thinsp;m to 80,000&thinsp;m, plus Rice distribution wind modeling per ISO 5878.
    </p>

    <!-- Language selection -->
    <section class="section">
      <h2 class="section-title">Choose Your Language</h2>
      <div class="api-lang-grid">
        <router-link to="/api/js" class="api-lang-card">
          <div class="api-lang-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
          </div>
          <h3>TypeScript / JavaScript</h3>
          <p>
            Full TypeScript type definitions, tree-shakeable exports, and works with
            Node.js, browser bundlers (Vite, Webpack), and Deno.
          </p>
          <div class="code-block code-dark code-inline">
            <pre><code>npm install atmospheris</code></pre>
          </div>
          <span class="api-lang-link">View TypeScript/JS docs &rarr;</span>
        </router-link>
        <router-link to="/api/ruby" class="api-lang-card">
          <div class="api-lang-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8"/></svg>
          </div>
          <h3>Ruby</h3>
          <p>
            The reference implementation &mdash; a comprehensive Ruby gem with
            object-oriented API, lazy computation, and full ISO coverage.
            Requires Ruby 3.0+.
          </p>
          <div class="code-block code-dark code-inline">
            <pre><code>gem install atmospheris</code></pre>
          </div>
          <span class="api-lang-link">View Ruby docs &rarr;</span>
        </router-link>
      </div>
    </section>

    <!-- Property Groups -->
    <section class="section">
      <h2 class="section-title">Property Groups</h2>
      <p>
        ISO 2533 organizes atmospheric properties into three groups, which both libraries
        return in a single result object:
      </p>
      <div class="prop-group-grid">
        <div class="prop-group-card">
          <h3>Group 1 &mdash; Primary</h3>
          <ul>
            <li>Geopotential &amp; geometric altitude</li>
            <li>Temperature (K, °C, °F, °R) &amp; temperature ratio</li>
            <li>Molecular temperature &amp; lapse rate</li>
            <li>Pressure (Pa, mbar, mmHg) &amp; pressure ratio</li>
            <li>Density &amp; density ratio</li>
          </ul>
        </div>
        <div class="prop-group-card">
          <h3>Group 2 &mdash; Derived (Motion)</h3>
          <ul>
            <li>Gravity &amp; gravity ratio</li>
            <li>Speed of sound &amp; speed ratio</li>
            <li>Dynamic viscosity (Sutherland&rsquo;s formula)</li>
            <li>Kinematic viscosity</li>
            <li>Mean particle speed</li>
          </ul>
        </div>
        <div class="prop-group-card">
          <h3>Group 3 &mdash; Derived (Other)</h3>
          <ul>
            <li>Specific weight</li>
            <li>Pressure scale height</li>
            <li>Thermal conductivity</li>
            <li>Air number density</li>
            <li>Collision frequency</li>
            <li>Mean free path &amp; mole volume</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Precision Modes -->
    <section class="section">
      <h2 class="section-title">Precision Modes</h2>
      <p>
        Both libraries support two precision levels, matching the presentation conventions
        in ISO 2533:
      </p>
      <ul class="content-list">
        <li><strong>Normal precision</strong> &mdash; Full significant figures for engineering calculations. Matches ISO 2533 Tables 5&ndash;7.</li>
        <li><strong>Reduced precision</strong> &mdash; Fewer significant digits, matching the reduced-precision tables in ISO 2533 Tables 8&ndash;10.</li>
      </ul>
      <p>
        Both modes use the same underlying formulas; only the output rounding differs.
        The precision setting does <strong>not</strong> affect calculation accuracy &mdash;
        only the number of digits presented in the result.
      </p>
    </section>

    <!-- Links -->
    <section class="section">
      <h2 class="section-title">Resources</h2>
      <ul class="content-list">
        <li><a href="https://github.com/atmospheris/" target="_blank" rel="noopener">Ruby gem on GitHub</a></li>
        <li><a href="https://rubygems.org/gems/atmospheris" target="_blank" rel="noopener">atmospheris on RubyGems</a></li>
        <li><a href="https://www.npmjs.com/package/atmospheris" target="_blank" rel="noopener">atmospheris on npm</a></li>
        <li><router-link to="/calculator">Interactive Calculator</router-link></li>
        <li><router-link to="/iso-2533">ISO 2533 &mdash; Standard Atmosphere</router-link></li>
        <li><router-link to="/iso-5878">ISO 5878 &mdash; Reference Atmospheres</router-link></li>
        <li><router-link to="/symbols">Symbols &amp; Variables</router-link></li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.api-lang-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--spacing-lg);
  margin-top: var(--spacing-lg);
}

.api-lang-card {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: var(--color-text);
  padding: var(--spacing-xl);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  position: relative;
  overflow: hidden;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.api-lang-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--color-accent), var(--color-accent-light));
}

.api-lang-card:hover {
  border-color: var(--color-accent);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.api-lang-icon {
  margin-bottom: var(--spacing-md);
  color: var(--color-accent);
}

.api-lang-card h3 {
  font-family: var(--font-display);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-sm);
}

.api-lang-card > p {
  flex: 1;
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--spacing-md);
}

.code-inline {
  margin-bottom: var(--spacing-md);
}

.api-lang-link {
  font-family: var(--font-display);
  font-weight: var(--font-weight-semibold);
  color: var(--color-accent);
  font-size: var(--font-size-sm);
}

.prop-group-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: var(--spacing-lg);
  margin-top: var(--spacing-lg);
}

.prop-group-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  position: relative;
  overflow: hidden;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.prop-group-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--color-accent), var(--color-accent-light));
}

.prop-group-card:hover {
  border-color: var(--color-accent);
  box-shadow: var(--shadow-sm);
}

.prop-group-card h3 {
  font-family: var(--font-display);
  font-size: var(--font-size-base);
  margin-bottom: var(--spacing-md);
}

.prop-group-card ul {
  margin: 0;
  padding-left: var(--spacing-md);
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  line-height: var(--line-height-relaxed);
}

.prop-group-card li {
  margin-bottom: var(--spacing-xs);
}
</style>
