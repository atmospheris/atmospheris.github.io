<script setup>
const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="footer-inner">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="footer-logo-row">
            <img src="@/assets/images/atmospheris-logo.svg" alt="" width="24" height="24" />
            <strong class="footer-brand-name"><span>Atmospher<span class="brand-is">is</span></span></strong>
          </div>
          <p>Open-source implementations of ISO atmospheric reference standards. Standard atmosphere models, wind distributions, and atmospheric property calculations for engineers and scientists.</p>
        </div>

        <div class="footer-column">
          <h4>Resources</h4>
          <router-link to="/calculator">Calculator</router-link>
          <router-link to="/library">Use API</router-link>
          <router-link to="/iso-2533">ISO 2533</router-link>
          <router-link to="/iso-5878">ISO 5878</router-link>
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
        <div class="footer-bottom-right">
          <a href="https://opensource.org/licenses/BSD-2-Clause" target="_blank" rel="noopener" class="footer-license-link">
            BSD-2-Clause License
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
