<script setup>
const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="footer-inner">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="footer-logo-row">
            <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="14" cy="14" r="13" stroke="currentColor" stroke-width="2"/>
              <path d="M7 18 C10 12, 18 12, 21 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
              <path d="M7 14 C10 8, 18 8, 21 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
              <circle cx="14" cy="7" r="1.5" fill="currentColor"/>
            </svg>
            <strong class="footer-brand-name">Atmospheris</strong>
          </div>
          <p>Reference implementation of the ISO 2533 Standard Atmosphere model. Open-source atmospheric property calculations for engineers and scientists.</p>
        </div>

        <div class="footer-column">
          <h4>Resources</h4>
          <router-link to="/calculator">Calculator</router-link>
          <router-link to="/library">Library Docs</router-link>
          <router-link to="/iso-2533">ISO 2533</router-link>
          <router-link to="/symbols">Symbols &amp; Variables</router-link>
          <router-link to="/references">References</router-link>
        </div>

        <div class="footer-column">
          <h4>Development</h4>
          <a href="https://github.com/atmospheris/" target="_blank" rel="noopener">Ruby Gem</a>
          <a href="https://www.npmjs.com/package/atmospheris" target="_blank" rel="noopener">npm Package</a>
          <a href="https://github.com/riboseinc" target="_blank" rel="noopener">Ribose GitHub</a>
        </div>
      </div>

      <div class="footer-bottom">
        <span>&copy; {{ year }} Ribose Inc. All rights reserved. BSD-2-Clause License.</span>
        <span>Published by <a href="https://www.ribose.com" target="_blank" rel="noopener" class="footer-link">Ribose</a></span>
      </div>
    </div>
  </footer>
</template>
