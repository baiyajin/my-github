<template>
  <div class="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-50">
    <div 
      class="h-full bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-150"
      :style="{ width: `${progress}%` }"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const progress = ref(0)

const updateProgress = () => {
  const windowHeight = window.innerHeight
  const documentHeight = document.documentElement.scrollHeight
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const scrollableHeight = documentHeight - windowHeight
  progress.value = scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 0
}

onMounted(() => {
  window.addEventListener('scroll', updateProgress, { passive: true })
  updateProgress()
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateProgress)
})
</script>

