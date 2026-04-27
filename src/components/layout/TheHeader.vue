<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useTheme } from '@/composables/useTheme'

const { isDark, toggle } = useTheme()
const scrolled = ref(false)
const mobileOpen = ref(false)
const refDropdownOpen = ref(false)
const dropdownRef = ref(null)

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

function toggleDropdown() {
  refDropdownOpen.value = !refDropdownOpen.value
}

function onDropdownKeydown(e) {
  if (e.key === 'Escape') {
    closeDropdown()
    dropdownRef.value?.querySelector('.nav-dropdown-trigger')?.focus()
  }
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    const links = dropdownRef.value?.querySelectorAll('.nav-dropdown-menu a')
    if (links?.length) {
      const focused = document.activeElement
      const idx = Array.from(links).indexOf(focused)
      links[(idx + 1) % links.length].focus()
    }
  }
  if (e.key === 'ArrowUp') {
    e.preventDefault()
    const links = dropdownRef.value?.querySelectorAll('.nav-dropdown-menu a')
    if (links?.length) {
      const focused = document.activeElement
      const idx = Array.from(links).indexOf(focused)
      links[(idx - 1 + links.length) % links.length].focus()
    }
  }
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
        <router-link to="/api">API</router-link>
        <div class="nav-dropdown" ref="dropdownRef" @click.stop="toggleDropdown" @keydown="onDropdownKeydown">
          <button
            class="nav-dropdown-trigger"
            :class="{ active: refDropdownOpen }"
            :aria-expanded="refDropdownOpen"
            aria-haspopup="true"
          >
            Standards
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div class="nav-dropdown-menu" v-if="refDropdownOpen" role="menu">
            <router-link to="/iso-2533" @click="closeDropdown">ISO 2533</router-link>
            <router-link to="/iso-5878" @click="closeDropdown">ISO 5878</router-link>
            <router-link to="/symbols" @click="closeDropdown">Symbols &amp; Variables</router-link>
            <router-link to="/references" @click="closeDropdown">References</router-link>
          </div>
        </div>
        <router-link to="/about">About</router-link>
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

      <button class="mobile-menu-btn" @click="toggleMobile" :aria-label="mobileOpen ? 'Close menu' : 'Open menu'">
        <svg v-if="mobileOpen" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>
    </div>
  </header>

  <nav class="mobile-nav" :class="{ open: mobileOpen }">
    <router-link to="/calculator" @click="closeMobile">Calculator</router-link>
    <router-link to="/api" @click="closeMobile">API</router-link>
    <div class="mobile-nav-section">Standards</div>
    <router-link to="/iso-2533" @click="closeMobile" class="mobile-nav-sub">ISO 2533</router-link>
    <router-link to="/iso-5878" @click="closeMobile" class="mobile-nav-sub">ISO 5878</router-link>
    <router-link to="/symbols" @click="closeMobile" class="mobile-nav-sub">Symbols &amp; Variables</router-link>
    <router-link to="/references" @click="closeMobile" class="mobile-nav-sub">References</router-link>
    <router-link to="/about" @click="closeMobile">About</router-link>
  </nav>
</template>
