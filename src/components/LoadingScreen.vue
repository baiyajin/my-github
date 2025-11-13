<template>
  <Transition name="fade">
    <div 
      v-if="isLoading"
      class="loading-screen fixed inset-0 z-[9999] bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center"
    >
      <div class="text-center">
        <!-- 加载动画 -->
        <div class="loader mb-8">
          <div class="loader-inner">
            <div class="loader-block"></div>
            <div class="loader-block"></div>
            <div class="loader-block"></div>
            <div class="loader-block"></div>
            <div class="loader-block"></div>
            <div class="loader-block"></div>
            <div class="loader-block"></div>
            <div class="loader-block"></div>
          </div>
        </div>
        
        <!-- 加载文字 -->
        <div class="text-white text-xl font-bold">
          <TypewriterText :text="loadingText" :speed="100" />
        </div>
        
        <!-- 进度条 -->
        <div class="w-64 h-1 bg-white/20 rounded-full mt-4 mx-auto overflow-hidden">
          <div 
            class="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
            :style="{ width: `${progress}%` }"
          ></div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import TypewriterText from './TypewriterText.vue'

const isLoading = ref(true)
const progress = ref(0)
const loadingText = ref('正在加载...')

onMounted(() => {
  // 模拟加载进度
  const interval = setInterval(() => {
    progress.value += Math.random() * 15
    if (progress.value >= 100) {
      progress.value = 100
      clearInterval(interval)
      setTimeout(() => {
        isLoading.value = false
      }, 500)
    }
  }, 200)
})
</script>

<style scoped>
.loader {
  width: 80px;
  height: 80px;
  margin: 0 auto;
}

.loader-inner {
  width: 100%;
  height: 100%;
  position: relative;
}

.loader-block {
  position: absolute;
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border-radius: 4px;
  animation: loader 1.2s infinite ease-in-out;
}

.loader-block:nth-child(1) {
  top: 0;
  left: 0;
  animation-delay: 0s;
}

.loader-block:nth-child(2) {
  top: 0;
  left: 30px;
  animation-delay: 0.15s;
}

.loader-block:nth-child(3) {
  top: 0;
  left: 60px;
  animation-delay: 0.3s;
}

.loader-block:nth-child(4) {
  top: 30px;
  left: 60px;
  animation-delay: 0.45s;
}

.loader-block:nth-child(5) {
  top: 60px;
  left: 60px;
  animation-delay: 0.6s;
}

.loader-block:nth-child(6) {
  top: 60px;
  left: 30px;
  animation-delay: 0.75s;
}

.loader-block:nth-child(7) {
  top: 60px;
  left: 0;
  animation-delay: 0.9s;
}

.loader-block:nth-child(8) {
  top: 30px;
  left: 0;
  animation-delay: 1.05s;
}

@keyframes loader {
  0%, 40%, 100% {
    transform: scale(0.4);
    opacity: 0.5;
  }
  20% {
    transform: scale(1);
    opacity: 1;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

