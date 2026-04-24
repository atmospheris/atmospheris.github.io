<script setup>
import { useSeo } from '@/composables/useSeo'

useSeo({
  title: 'Page Not Found',
  path: '/404'
})
</script>

<template>
  <div class="content-page not-found-page">
    <div class="not-found-content">
      <div class="not-found-code">404</div>
      <h1>Page Not Found</h1>
      <p class="not-found-desc">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <router-link to="/" class="btn btn-primary">Back to Home</router-link>
    </div>
  </div>
</template>
