<template>
  <section id="tech" class="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
    <div class="container mx-auto px-4">
      <h2 class="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        技术栈
      </h2>
      <p class="text-center text-gray-600 mb-12 text-lg">
        我熟练掌握以下技术，并持续学习新技术
      </p>
      
      <div class="max-w-6xl mx-auto">
        <!-- Three.js 可视化技术栈 -->
        <div class="mb-12">
          <TechVisualization />
        </div>
        
        <!-- 技术分类 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <TechCategory 
            v-for="category in techCategories" 
            :key="category.name"
            :name="category.name"
            :techs="category.techs"
            :icon="category.icon"
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

