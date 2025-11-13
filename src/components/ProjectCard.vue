<template>
  <div 
    class="card group cursor-pointer transform transition-all duration-300 hover:scale-105"
    @click="handleClick"
  >
    <div class="text-6xl mb-4 text-center group-hover:scale-110 transition-transform">
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
</template>

<script setup>
defineProps({
  title: String,
  description: String,
  tech: Array,
  image: String,
  link: String,
})

const handleClick = () => {
  // 可以添加点击事件处理
}
</script>

