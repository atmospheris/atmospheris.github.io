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
        <div class="footer-bottom-left">
          <span class="footer-copyright">&copy; {{ year }}</span>
          <a href="https://www.ribose.com" target="_blank" rel="noopener" class="footer-ribose-link">
            <img src="/ribose-logo.svg" alt="Ribose" class="footer-ribose-logo">
          </a>
        </div>
        <div class="footer-bottom-center">
          <span class="footer-standard-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Reference implementation for ISO 2533:2026
          </span>
        </div>
        <div class="footer-bottom-right">
          <a href="https://opensource.org/licenses/BSD-2-Clause" target="_blank" rel="noopener" class="footer-license-link">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>
            BSD-2-Clause License
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
