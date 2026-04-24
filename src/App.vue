<script setup>
import { onMounted } from 'vue'
import { useHead } from '@unhead/vue'
import TheHeader from '@/components/layout/TheHeader.vue'
import TheFooter from '@/components/layout/TheFooter.vue'
import { useReadingProgress } from '@/composables/useReadingProgress'
import { useScrollAnimation } from '@/composables/useScrollAnimation'
import { useTheme } from '@/composables/useTheme'
import { buildWebSiteSchema } from '@/utils/seoHelpers'

const { progress } = useReadingProgress()
useScrollAnimation()
useTheme()

useHead({
  htmlAttrs: { lang: 'en' },
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }
  ],
  script: [
    { type: 'application/ld+json', children: JSON.stringify(buildWebSiteSchema()) }
  ]
})

onMounted(() => {
  if (typeof window !== 'undefined' && !document.querySelector('[data-theme]')) {
    const stored = localStorage.getItem('atmospheris-theme')
    const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', stored || system)
  }
})
</script>

<template>
  <div class="reading-progress" :style="{ width: progress + '%' }" />
  <TheHeader />
  <main>
    <router-view />
  </main>
  <TheFooter />
</template>
