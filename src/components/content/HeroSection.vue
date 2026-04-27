<script setup>
</script>

<template>
  <section class="hero">
    <div class="hero-content">
      <div class="hero-main">
        <slot />
      </div>
      <div v-if="$slots.decoration" class="hero-decoration">
        <slot name="decoration" />
      </div>
    </div>
  </section>
</template>
