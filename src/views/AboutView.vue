<script setup>
import { useSeo } from '@/composables/useSeo'

useSeo({
  title: 'About Atmospheris',
  description: 'About Atmospheris — the open-source reference implementation of ISO 2533 Standard Atmosphere, published by Ribose.',
  path: '/about'
})
</script>

<template>
  <div class="content-page">
    <h1>About Atmospheris</h1>
    <p class="content-lead">
      Atmospheris is the open-source reference implementation of the
      ISO 2533 Standard Atmosphere model, providing accurate atmospheric
      property calculations for engineers, scientists, and developers.
    </p>

    <section class="section">
      <div class="about-card">
        <h2 class="section-title">The Project</h2>
        <p>
          Atmospheris started as a Ruby gem implementing the complete set of ISA calculations
          defined in ISO 2533. It provides a comprehensive API for computing atmospheric
          properties at any altitude, supporting both normal and reduced precision modes,
          multiple unit systems, and reverse pressure-to-altitude lookup.
        </p>
        <p>
          A TypeScript library extends the same calculations to JavaScript environments,
          enabling web applications, Node.js services, and interactive calculators like this one.
        </p>
        <p>
          The library is cited in the upcoming ISO 2533:2026 revision as the reference
          implementation, making it the authoritative source for programmatic ISA calculations.
        </p>
      </div>
    </section>

    <section class="section">
      <div class="about-card">
        <h2 class="section-title">Ribose</h2>
        <p>
          Ribose is a technology company specializing in standards development and
          open-source software. Ribose develops and maintains Atmospheris as part of
          its commitment to making international standards more accessible and practically
          useful for the engineering and scientific community.
        </p>
        <p>
          <a href="https://www.ribose.com" target="_blank" rel="noopener">ribose.com</a>
        </p>
      </div>
    </section>

    <section class="section">
      <div class="about-card">
        <h2 class="section-title">Open Source</h2>
        <p>
          Atmospheris is released under the BSD-2-Clause license, allowing free use in
          both open-source and commercial projects.
        </p>
        <ul class="content-list">
          <li><a href="https://github.com/riboseinc/atmospheris" target="_blank" rel="noopener">Ruby gem on GitHub</a></li>
          <li><a href="https://www.npmjs.com/package/atmospheris" target="_blank" rel="noopener">TypeScript package on npm</a></li>
        </ul>
      </div>
    </section>
  </div>
</template>
