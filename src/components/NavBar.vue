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
        
        <!-- 桌面端导航 -->
        <div class="hidden md:flex gap-6">
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
        
        <!-- 移动端菜单按钮 -->
        <button
          @click="toggleMobileMenu"
          class="md:hidden p-2 rounded-lg hover:bg-white/20 transition-colors"
          aria-label="菜单"
        >
          <div class="hamburger" :class="{ active: isMobileMenuOpen }">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </div>
      
      <!-- 移动端菜单 -->
      <Transition name="slide-down">
        <div 
          v-if="isMobileMenuOpen"
          class="md:hidden mt-4 pb-4 border-t border-white/10 pt-4"
        >
          <a 
            v-for="link in links" 
            :key="link.href"
            :href="link.href" 
            class="block py-2 px-4 rounded-lg hover:bg-white/10 transition-colors mb-2"
            :class="{ 'bg-white/10 text-primary': activeLink === link.href }"
            @click.prevent="handleMobileNavClick(link.href)"
          >
            {{ link.label }}
          </a>
        </div>
      </Transition>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useSmoothScroll } from '../composables/useSmoothScroll'

const navRef = ref(null)
const scrollY = ref(0)
const activeLink = ref('#home')
const isMobileMenuOpen = ref(false)
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

const handleMobileNavClick = (href) => {
  activeLink.value = href
  scrollTo(href)
  isMobileMenuOpen.value = false
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
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

/* 汉堡菜单动画 */
.hamburger {
  width: 24px;
  height: 18px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.hamburger span {
  display: block;
  height: 2px;
  width: 100%;
  background: currentColor;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.hamburger.active span:nth-child(1) {
  transform: rotate(45deg) translate(6px, 6px);
}

.hamburger.active span:nth-child(2) {
  opacity: 0;
}

.hamburger.active span:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -6px);
}

/* 移动端菜单动画 */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
  max-height: 500px;
  overflow: hidden;
}

.slide-down-enter-from,
.slide-down-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>

