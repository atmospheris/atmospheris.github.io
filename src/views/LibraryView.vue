<script setup>
if (typeof window !== 'undefined') {
  window.location.replace('/api')
}
</script>

<template>
  <div class="content-page">
    <p>Redirecting to <router-link to="/api">API Documentation</router-link>&hellip;</p>
  </div>
</template>
