<template>
  <nav 
    ref="navRef"
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    :class="navClass"
  >
    <div class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <div class="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          个人作品集
        </div>
        <div class="flex gap-6">
          <a 
            v-for="link in links" 
            :key="link.href"
            :href="link.href" 
            class="nav-link hover:text-primary transition-colors relative"
            :class="{ active: activeLink === link.href }"
            @click.prevent="handleNavClick(link.href)"
          >
            {{ link.label }}
            <span v-if="activeLink === link.href" class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></span>
          </a>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useSmoothScroll } from '../composables/useSmoothScroll'

const navRef = ref(null)
const scrollY = ref(0)
const activeLink = ref('#home')
const { scrollTo } = useSmoothScroll()

const links = [
  { href: '#home', label: '首页' },
  { href: '#projects', label: '作品' },
  { href: '#tech', label: '技术' },
  { href: '#demo', label: '演示' },
  { href: '#contact', label: '联系' },
]

const navClass = computed(() => {
  return scrollY.value > 50
    ? 'bg-white/95 backdrop-blur-lg shadow-lg'
    : 'bg-white/80 backdrop-blur-lg shadow-sm'
})

const handleNavClick = (href) => {
  activeLink.value = href
  scrollTo(href)
}

const updateScroll = () => {
  scrollY.value = window.pageYOffset
  
  // 更新活动链接
  const sections = links.map(link => document.querySelector(link.href))
  const currentSection = sections.findIndex((section, index) => {
    if (!section) return false
    const rect = section.getBoundingClientRect()
    return rect.top <= 100 && rect.bottom >= 100
  })
  
  if (currentSection !== -1) {
    activeLink.value = links[currentSection].href
  }
}

onMounted(() => {
  window.addEventListener('scroll', updateScroll, { passive: true })
  updateScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateScroll)
})
</script>

<style scoped>
.nav-link {
  position: relative;
  padding-bottom: 4px;
}

.nav-link.active {
  color: rgb(59, 130, 246);
}
</style>

