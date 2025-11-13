<template>
  <div class="card text-center">
    <div class="text-5xl mb-4">{{ icon }}</div>
    <h3 class="text-xl font-bold mb-4 text-gray-800">{{ name }}</h3>
    <div class="flex flex-col gap-2">
      <span 
        v-for="tech in techs" 
        :key="tech"
        class="px-3 py-2 bg-gradient-to-r from-primary/10 to-secondary/10 text-gray-700 rounded-lg text-sm font-medium hover:from-primary/20 hover:to-secondary/20 transition-all"
      >
        {{ tech }}
      </span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  name: String,
  techs: Array,
  icon: String,
})
</script>

