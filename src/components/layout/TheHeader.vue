<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useTheme } from '@/composables/useTheme'

const { isDark, toggle } = useTheme()
const scrolled = ref(false)
const mobileOpen = ref(false)

function onScroll() {
  scrolled.value = window.scrollY > 10
}

function toggleMobile() {
  mobileOpen.value = !mobileOpen.value
}

function closeMobile() {
  mobileOpen.value = false
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <header class="header" :class="{ scrolled }">
    <div class="header-inner">
      <router-link to="/" class="header-logo">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="14" cy="14" r="13" stroke="currentColor" stroke-width="2"/>
          <path d="M7 18 C10 12, 18 12, 21 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
          <path d="M7 14 C10 8, 18 8, 21 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
          <circle cx="14" cy="7" r="1.5" fill="currentColor"/>
        </svg>
        Atmospheris
      </router-link>

      <nav class="header-nav">
        <router-link to="/calculator">Calculator</router-link>
        <router-link to="/library">Library</router-link>
        <router-link to="/iso-2533">ISO 2533</router-link>
        <router-link to="/symbols">Symbols</router-link>
        <router-link to="/references">References</router-link>
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

      <button class="mobile-menu-btn" @click="toggleMobile" aria-label="Toggle menu">
        {{ mobileOpen ? '✕' : '☰' }}
      </button>
    </div>
  </header>

  <nav class="mobile-nav" :class="{ open: mobileOpen }">
    <router-link to="/calculator" @click="closeMobile">Calculator</router-link>
    <router-link to="/library" @click="closeMobile">Library</router-link>
    <router-link to="/iso-2533" @click="closeMobile">ISO 2533</router-link>
    <router-link to="/symbols" @click="closeMobile">Symbols</router-link>
    <router-link to="/references" @click="closeMobile">References</router-link>
    <router-link to="/about" @click="closeMobile">About</router-link>
  </nav>
</template>
