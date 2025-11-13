<template>
  <div 
    ref="cursorRef"
    class="custom-cursor"
    :style="cursorStyle"
  >
    <div class="cursor-dot"></div>
    <div class="cursor-ring"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const cursorRef = ref(null)
const mouseX = ref(0)
const mouseY = ref(0)
const ringX = ref(0)
const ringY = ref(0)
const isHovering = ref(false)

const cursorStyle = ref({
  left: '0px',
  top: '0px',
})

const ringStyle = ref({
  left: '0px',
  top: '0px',
})

const handleMouseMove = (e) => {
  mouseX.value = e.clientX
  mouseY.value = e.clientY
  
  cursorStyle.value = {
    left: `${mouseX.value}px`,
    top: `${mouseY.value}px`,
  }
  
  // 延迟更新 ring 位置（跟随效果）
  requestAnimationFrame(() => {
    ringX.value += (mouseX.value - ringX.value) * 0.15
    ringY.value += (mouseY.value - ringY.value) * 0.15
  })
}

const handleMouseEnter = () => {
  isHovering.value = true
}

const handleMouseLeave = () => {
  isHovering.value = false
}

onMounted(() => {
  // 初始化位置
  ringX.value = window.innerWidth / 2
  ringY.value = window.innerHeight / 2
  
  document.addEventListener('mousemove', handleMouseMove)
  
  // 检测可交互元素
  const interactiveElements = document.querySelectorAll('a, button, .card-3d, .magnetic-btn')
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', handleMouseEnter)
    el.addEventListener('mouseleave', handleMouseLeave)
  })
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
})
</script>

<style scoped>
.custom-cursor {
  position: fixed;
  pointer-events: none;
  z-index: 9999;
  mix-blend-mode: difference;
}

.cursor-dot {
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: transform 0.1s ease;
}

.cursor-ring {
  width: 40px;
  height: 40px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.3s ease, height 0.3s ease, border-color 0.3s ease;
}

.custom-cursor:hover .cursor-ring,
.custom-cursor.hovering .cursor-ring {
  width: 60px;
  height: 60px;
  border-color: rgba(59, 130, 246, 0.8);
}

@media (max-width: 768px) {
  .custom-cursor {
    display: none;
  }
}
</style>

