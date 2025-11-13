<template>
  <section id="contact" class="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
    <div class="container mx-auto px-4">
      <h2 class="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        联系我
      </h2>
      <p class="text-center text-gray-600 mb-12 text-lg">
        欢迎与我交流技术或合作项目
      </p>
      
      <div class="max-w-2xl mx-auto">
        <div class="card">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div class="text-center">
              <div class="text-4xl mb-3">📧</div>
              <h3 class="font-bold mb-2 text-gray-800">邮箱</h3>
              <a href="mailto:example@email.com" class="text-primary hover:text-secondary transition-colors">
                example@email.com
              </a>
            </div>
            <div class="text-center">
              <div class="text-4xl mb-3">💼</div>
              <h3 class="font-bold mb-2 text-gray-800">GitHub</h3>
              <a href="https://github.com" target="_blank" class="text-primary hover:text-secondary transition-colors">
                github.com/username
              </a>
            </div>
          </div>
          
          <!-- 社交媒体链接 -->
          <div class="flex justify-center gap-4">
            <a 
              v-for="social in socialLinks" 
              :key="social.name"
              :href="social.url" 
              target="_blank"
              class="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white hover:scale-110 transition-transform"
              :title="social.name"
            >
              <span class="text-xl">{{ social.icon }}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const socialLinks = ref([
  { name: 'GitHub', icon: '💻', url: 'https://github.com' },
  { name: 'LinkedIn', icon: '💼', url: 'https://linkedin.com' },
  { name: 'Twitter', icon: '🐦', url: 'https://twitter.com' },
  { name: 'Blog', icon: '📝', url: 'https://blog.example.com' },
])
</script>

