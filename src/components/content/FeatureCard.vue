<script setup>
defineProps({
  icon: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  linkText: { type: String, default: '' },
  linkTo: { type: String, default: '' }
})
</script>

<template>
  <div class="glass-card feature-card animate-on-scroll">
    <div class="icon-area" v-html="icon" />
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>
    <router-link v-if="linkTo" :to="linkTo" class="card-link">
      {{ linkText }} <span>&rarr;</span>
    </router-link>
  </div>
</template>
