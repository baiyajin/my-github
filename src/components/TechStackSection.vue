<template>
  <section 
    id="tech" 
    ref="sectionRef"
    class="py-20 bg-gradient-to-br from-slate-50 to-blue-50"
    :style="{ transform: `translateY(${parallaxOffset}px)` }"
  >
    <div class="container mx-auto px-4">
      <h2 
        class="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent transition-all duration-700"
        :class="{ 'opacity-100 translate-y-0': isVisible, 'opacity-0 translate-y-10': !isVisible }"
      >
        技术栈
      </h2>
      <p 
        class="text-center text-gray-600 mb-12 text-lg transition-all duration-700 delay-100"
        :class="{ 'opacity-100 translate-y-0': isVisible, 'opacity-0 translate-y-10': !isVisible }"
      >
        我熟练掌握以下技术，并持续学习新技术
      </p>
      
      <div class="max-w-6xl mx-auto">
        <!-- Three.js 可视化技术栈 -->
        <div 
          class="mb-12 transition-all duration-700 delay-200"
          :class="{ 'opacity-100 translate-y-0': isVisible, 'opacity-0 translate-y-10': !isVisible }"
        >
          <TechVisualization />
        </div>
        
        <!-- 技术分类 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <TechCategory 
            v-for="(category, index) in techCategories" 
            :key="category.name"
            :name="category.name"
            :techs="category.techs"
            :icon="category.icon"
            :style="{ transitionDelay: `${300 + index * 100}ms` }"
            class="transition-all duration-700"
            :class="{ 'opacity-100 translate-y-0': isVisible, 'opacity-0 translate-y-10': !isVisible }"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import TechVisualization from './TechVisualization.vue'
import TechCategory from './TechCategory.vue'
import { useScrollAnimation, useParallax } from '../composables/useScrollAnimation'

const { isVisible, elementRef: sectionRef } = useScrollAnimation()
const { offset: parallaxOffset } = useParallax(0.3)

const techCategories = ref([
  {
    name: '前端框架',
    icon: '⚛️',
    techs: ['Vue 3', 'React', 'Angular', 'Svelte'],
  },
  {
    name: '构建工具',
    icon: '🛠️',
    techs: ['Vite', 'Webpack', 'Rollup', 'esbuild'],
  },
  {
    name: '3D 图形',
    icon: '🎨',
    techs: ['Three.js', 'WebGL', 'Babylon.js', 'A-Frame'],
  },
  {
    name: '性能优化',
    icon: '⚡',
    techs: ['WebAssembly', 'Worker', 'Service Worker', 'PWA'],
  },
])
</script>

