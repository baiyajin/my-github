<template>
  <div 
    ref="cardRef"
    class="card-3d group cursor-pointer transform transition-all duration-500"
    :style="cardStyle"
    @click="handleClick"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <!-- 3D 翻转容器 -->
    <div 
      class="card-inner"
      :style="innerStyle"
    >
      <!-- 正面 -->
      <div class="card-front">
        <div class="text-6xl mb-4 text-center group-hover:scale-110 transition-transform duration-300">
          {{ image }}
        </div>
        <h3 class="text-2xl font-bold mb-3 text-gray-800">{{ title }}</h3>
        <p class="text-gray-600 mb-4 line-clamp-3">{{ description }}</p>
        <div class="flex flex-wrap gap-2 mb-4">
          <span 
            v-for="tag in tech" 
            :key="tag"
            class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
          >
            {{ tag }}
          </span>
        </div>
        <a 
          :href="link" 
          class="text-primary hover:text-secondary font-medium inline-flex items-center gap-2 transition-colors"
          @click.stop
        >
          查看详情 →
        </a>
      </div>
      
      <!-- 背面（翻转时显示） -->
      <div class="card-back">
        <div class="text-4xl mb-4">🚀</div>
        <h3 class="text-xl font-bold mb-3 text-white">{{ title }}</h3>
        <p class="text-white/80 mb-4 text-sm">{{ description }}</p>
        <div class="flex flex-wrap gap-2 justify-center">
          <span 
            v-for="tag in tech" 
            :key="tag"
            class="px-3 py-1 bg-white/20 text-white rounded-full text-sm"
          >
            {{ tag }}
          </span>
        </div>
      </div>
    </div>
    
    <!-- 波纹效果 -->
    <div 
      v-if="ripple"
      class="ripple-effect"
      :style="rippleStyle"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  title: String,
  description: String,
  tech: Array,
  image: String,
  link: String,
})

const cardRef = ref(null)
const isFlipped = ref(false)
const mouseX = ref(0)
const mouseY = ref(0)
const ripple = ref(false)
const rippleStyle = ref({})

// 卡片样式（3D变换）
const cardStyle = computed(() => {
  const rotateX = (mouseY.value - 0.5) * 10
  const rotateY = (mouseX.value - 0.5) * -10
  return {
    transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${isFlipped.value ? 1.05 : 1})`,
  }
})

// 内部翻转样式
const innerStyle = computed(() => {
  return {
    transform: isFlipped.value ? 'rotateY(180deg)' : 'rotateY(0deg)',
  }
})

// 鼠标移动处理
const handleMouseMove = (event) => {
  if (!cardRef.value) return
  const rect = cardRef.value.getBoundingClientRect()
  mouseX.value = (event.clientX - rect.left) / rect.width
  mouseY.value = (event.clientY - rect.top) / rect.height
}

const handleMouseLeave = () => {
  mouseX.value = 0.5
  mouseY.value = 0.5
  isFlipped.value = false
}

// 点击处理
const handleClick = (event) => {
  // 创建波纹效果
  if (!cardRef.value) return
  const rect = cardRef.value.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  
  ripple.value = true
  rippleStyle.value = {
    left: `${x}px`,
    top: `${y}px`,
  }
  
  setTimeout(() => {
    ripple.value = false
  }, 600)
  
  // 翻转卡片
  isFlipped.value = !isFlipped.value
}

// 视差滚动效果
let scrollY = 0
const handleScroll = () => {
  if (!cardRef.value) return
  scrollY = window.scrollY
  const rect = cardRef.value.getBoundingClientRect()
  const elementTop = rect.top + scrollY
  const windowHeight = window.innerHeight
  const scrollProgress = (scrollY + windowHeight - elementTop) / (windowHeight + rect.height)
  
  if (scrollProgress > 0 && scrollProgress < 1) {
    const parallaxY = (scrollProgress - 0.5) * 50
    cardRef.value.style.transform += ` translateY(${parallaxY}px)`
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.card-3d {
  transform-style: preserve-3d;
  perspective: 1000px;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1);
}

.card-front,
.card-back {
  position: relative;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.card-back {
  position: absolute;
  top: 0;
  left: 0;
  transform: rotateY(180deg);
  background: linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899);
  border-radius: 0.75rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.ripple-effect {
  position: absolute;
  border-radius: 50%;
  background: rgba(59, 130, 246, 0.4);
  transform: translate(-50%, -50%) scale(0);
  animation: ripple 0.6s ease-out;
  pointer-events: none;
  width: 100px;
  height: 100px;
}

@keyframes ripple {
  to {
    transform: translate(-50%, -50%) scale(4);
    opacity: 0;
  }
}

.card-3d:hover {
  z-index: 10;
}

.card-3d:hover .card-front {
  box-shadow: 0 20px 60px rgba(59, 130, 246, 0.3),
              0 0 40px rgba(139, 92, 246, 0.2);
}
</style>
