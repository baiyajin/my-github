<template>
  <div 
    ref="elementRef"
    :class="['scroll-reveal', { 'revealed': isVisible }]"
    :style="revealStyle"
  >
    <slot />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  delay: {
    type: Number,
    default: 0,
  },
  direction: {
    type: String,
    default: 'up', // up, down, left, right
  },
  distance: {
    type: Number,
    default: 50,
  },
})

const elementRef = ref(null)
const isVisible = ref(false)

const revealStyle = ref({
  opacity: '0',
  transform: '',
})

const getTransform = () => {
  const transforms = {
    up: `translateY(${props.distance}px)`,
    down: `translateY(-${props.distance}px)`,
    left: `translateX(${props.distance}px)`,
    right: `translateX(-${props.distance}px)`,
  }
  return transforms[props.direction] || transforms.up
}

revealStyle.value.transform = getTransform()

const checkVisibility = () => {
  if (!elementRef.value || isVisible.value) return

  const rect = elementRef.value.getBoundingClientRect()
  const windowHeight = window.innerHeight
  const elementTop = rect.top
  const elementBottom = rect.bottom

  // 元素进入视口
  if (elementTop < windowHeight && elementBottom > 0) {
    setTimeout(() => {
      isVisible.value = true
      revealStyle.value.opacity = '1'
      revealStyle.value.transform = 'translate(0, 0)'
    }, props.delay)
  }
}

onMounted(() => {
  window.addEventListener('scroll', checkVisibility, { passive: true })
  checkVisibility() // 初始检查
})

onUnmounted(() => {
  window.removeEventListener('scroll', checkVisibility)
})
</script>

<style scoped>
.scroll-reveal {
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.scroll-reveal.revealed {
  opacity: 1;
  transform: translate(0, 0) !important;
}
</style>

