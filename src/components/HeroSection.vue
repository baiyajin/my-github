<template>
  <section id="home" class="relative min-h-screen flex items-center justify-center overflow-hidden">
    <!-- Three.js 背景 -->
    <ThreeBackground />
    
    <!-- 内容层 -->
    <div class="relative z-10 container mx-auto px-4 py-20 text-center">
      <div class="card max-w-3xl mx-auto">
        <div class="mb-6">
          <div class="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-4xl text-white font-bold">
            JD
          </div>
          <h1 class="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            张三
          </h1>
          <p class="text-xl md:text-2xl text-gray-600 mb-6">
            全栈开发工程师 | 技术爱好者
          </p>
          <p class="text-lg text-gray-500 mb-8">
            专注于现代 Web 技术，热爱 Three.js 3D 开发和 WebAssembly 性能优化
          </p>
        </div>
        
        <!-- 技能标签 -->
        <div class="flex flex-wrap gap-3 justify-center mb-8">
          <span 
            v-for="skill in skills" 
            :key="skill"
            class="px-4 py-2 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary rounded-full font-medium"
          >
            {{ skill }}
          </span>
        </div>
        
        <!-- 行动按钮 -->
        <div class="flex gap-4 justify-center">
          <a href="#projects" class="btn-primary">
            查看作品
          </a>
          <a href="#contact" class="px-4 py-2 bg-white/50 backdrop-blur-sm text-primary rounded-lg hover:bg-white/70 transition-colors border border-primary/20">
            联系我
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import ThreeBackground from './ThreeBackground.vue'

const skills = ref([
  'Vue 3',
  'Vite',
  'Three.js',
  'WebAssembly',
  'UnoCSS',
  'JavaScript',
  'TypeScript',
  'Node.js',
])
</script>

