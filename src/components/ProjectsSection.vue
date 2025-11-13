<template>
  <section id="projects" class="py-20 bg-white/50">
    <div class="container mx-auto px-4">
      <h2 class="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        作品展示
      </h2>
      <p class="text-center text-gray-600 mb-12 text-lg">
        以下是我的一些精选项目，展示了现代 Web 技术的应用
      </p>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <ProjectCard 
          v-for="project in projects" 
          :key="project.id"
          :title="project.title"
          :description="project.description"
          :tech="project.tech"
          :image="project.image"
          :link="project.link"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import ProjectCard from './ProjectCard.vue'

const projects = ref([
  {
    id: 1,
    title: '3D 可视化平台',
    description: '基于 Three.js 开发的交互式 3D 数据可视化平台，支持实时数据渲染和交互操作。',
    tech: ['Vue 3', 'Three.js', 'WebGL', 'Vite'],
    image: '🎨',
    link: '#',
  },
  {
    id: 2,
    title: '高性能计算应用',
    description: '使用 WebAssembly 优化的高性能计算应用，实现复杂的数学运算和图像处理。',
    tech: ['WebAssembly', 'Rust', 'Vue 3', 'Canvas API'],
    image: '⚡',
    link: '#',
  },
  {
    id: 3,
    title: '现代化 UI 组件库',
    description: '基于 Vue 3 和 UnoCSS 构建的现代化 UI 组件库，提供丰富的交互组件。',
    tech: ['Vue 3', 'UnoCSS', 'TypeScript', 'Vite'],
    image: '🎯',
    link: '#',
  },
  {
    id: 4,
    title: '实时协作工具',
    description: '支持多人实时协作的在线工具，采用 WebSocket 和 WebRTC 技术。',
    tech: ['Vue 3', 'WebSocket', 'WebRTC', 'Node.js'],
    image: '🤝',
    link: '#',
  },
  {
    id: 5,
    title: '数据可视化仪表盘',
    description: '企业级数据可视化仪表盘，支持多种图表类型和实时数据更新。',
    tech: ['Vue 3', 'D3.js', 'ECharts', 'WebSocket'],
    image: '📊',
    link: '#',
  },
  {
    id: 6,
    title: '移动端 PWA 应用',
    description: '渐进式 Web 应用，支持离线使用和推送通知，提供原生应用体验。',
    tech: ['Vue 3', 'PWA', 'Service Worker', 'IndexedDB'],
    image: '📱',
    link: '#',
  },
])
</script>

