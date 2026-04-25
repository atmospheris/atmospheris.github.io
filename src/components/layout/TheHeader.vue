<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useTheme } from '@/composables/useTheme'

const { isDark, toggle } = useTheme()
const scrolled = ref(false)
const mobileOpen = ref(false)
const refDropdownOpen = ref(false)

function onScroll() {
  scrolled.value = window.scrollY > 10
}

function toggleMobile() {
  mobileOpen.value = !mobileOpen.value
}

function closeMobile() {
  mobileOpen.value = false
}

function closeDropdown() {
  refDropdownOpen.value = false
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('click', closeDropdown)
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  document.removeEventListener('click', closeDropdown)
})
</script>

<template>
  <header class="header" :class="{ scrolled }">
    <div class="header-inner">
      <router-link to="/" class="header-logo">
        <img src="@/assets/images/atmospheris-logo.svg" alt="" width="28" height="28" />
        <span>Atmospher<span class="brand-is">is</span></span>
      </router-link>

      <nav class="header-nav">
        <router-link to="/calculator">Calculator</router-link>
        <router-link to="/library">Use API</router-link>
        <div class="nav-dropdown" @click.stop="refDropdownOpen = !refDropdownOpen">
          <button class="nav-dropdown-trigger" :class="{ active: refDropdownOpen }">
            Reference
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div class="nav-dropdown-menu" v-if="refDropdownOpen">
            <router-link to="/iso-2533" @click="closeDropdown">ISO 2533</router-link>
            <router-link to="/symbols" @click="closeDropdown">Symbols &amp; Variables</router-link>
            <router-link to="/references" @click="closeDropdown">References</router-link>
            <div class="nav-dropdown-divider"></div>
            <router-link to="/about" @click="closeDropdown">About</router-link>
          </div>
        </div>
      </nav>

      <div class="header-right">
        <a href="https://github.com/atmospheris/" target="_blank" rel="noopener" class="ribose-badge" aria-label="GitHub">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
        </a>
        <button class="theme-toggle" @click="toggle" :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
          <!-- Sun icon -->
          <svg v-if="isDark" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
          <!-- Moon icon -->
          <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
        </button>
      </div>

      <button class="mobile-menu-btn" @click="toggleMobile" aria-label="Toggle menu">
        {{ mobileOpen ? '✕' : '☰' }}
      </button>
    </div>
  </header>

  <nav class="mobile-nav" :class="{ open: mobileOpen }">
    <router-link to="/calculator" @click="closeMobile">Calculator</router-link>
    <router-link to="/library" @click="closeMobile">Use API</router-link>
    <div class="mobile-nav-section">Reference</div>
    <router-link to="/iso-2533" @click="closeMobile" class="mobile-nav-sub">ISO 2533</router-link>
    <router-link to="/symbols" @click="closeMobile" class="mobile-nav-sub">Symbols &amp; Variables</router-link>
    <router-link to="/references" @click="closeMobile" class="mobile-nav-sub">References</router-link>
    <router-link to="/about" @click="closeMobile" class="mobile-nav-sub">About</router-link>
  </nav>
</template>
