<template>
  <section id="home" class="relative min-h-screen flex items-center justify-center overflow-hidden">
    <!-- Three.js 背景 -->
    <ThreeBackground />
    
    <!-- 内容层 -->
    <div class="relative z-10 container mx-auto px-4 py-20 text-center">
      <div class="card max-w-3xl mx-auto transform transition-all duration-500 hover:scale-105">
        <div class="mb-6">
          <!-- 头像区域 - 带旋转和粒子环绕效果 -->
          <div class="relative w-32 h-32 mx-auto mb-6">
            <div 
              ref="avatarContainer"
              class="w-32 h-32 rounded-full bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center text-4xl text-white font-bold shadow-2xl transform transition-all duration-300 hover:scale-110 hover:rotate-12"
            >
              JD
            </div>
            <!-- 环绕粒子 -->
            <div 
              v-for="(particle, index) in avatarParticles" 
              :key="index"
              class="absolute w-2 h-2 rounded-full bg-primary opacity-60"
              :style="getParticleStyle(index)"
            ></div>
          </div>
          
          <!-- 打字机效果标题 -->
          <h1 class="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent min-h-[4rem]">
            <TypewriterText :text="name" :speed="150" />
          </h1>
          
          <p class="text-xl md:text-2xl text-gray-600 mb-6">
            <TypewriterText :text="title" :speed="80" />
          </p>
          <p class="text-lg text-gray-500 mb-8">
            <TypewriterText :text="description" :speed="50" />
          </p>
        </div>
        
        <!-- 技能标签 - 带3D翻转和发光效果 -->
        <div class="flex flex-wrap gap-3 justify-center mb-8">
          <div
            v-for="(skill, index) in skills" 
            :key="skill"
            class="skill-tag"
            :style="{ animationDelay: `${index * 0.1}s` }"
            @mouseenter="onSkillHover(index)"
            @mouseleave="onSkillLeave(index)"
          >
            <span class="skill-text">{{ skill }}</span>
          </div>
        </div>
        
        <!-- 行动按钮 - 带磁吸效果 -->
        <div class="flex gap-4 justify-center">
          <a 
            href="#projects" 
            ref="primaryButton"
            class="btn-primary magnetic-btn"
            @mousemove="onButtonMove($event, 'primary')"
            @mouseleave="onButtonLeave('primary')"
          >
            查看作品
          </a>
          <a 
            href="#contact" 
            ref="secondaryButton"
            class="px-4 py-2 bg-white/50 backdrop-blur-sm text-primary rounded-lg hover:bg-white/70 transition-colors border border-primary/20 magnetic-btn"
            @mousemove="onButtonMove($event, 'secondary')"
            @mouseleave="onButtonLeave('secondary')"
          >
            联系我
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import ThreeBackground from './ThreeBackground.vue'
import TypewriterText from './TypewriterText.vue'

const name = '张三'
const title = '全栈开发工程师 | 技术爱好者'
const description = '专注于现代 Web 技术，热爱 Three.js 3D 开发和 WebAssembly 性能优化'

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

const avatarContainer = ref(null)
const primaryButton = ref(null)
const secondaryButton = ref(null)

// 头像环绕粒子
const avatarParticles = ref(Array(8).fill(0))
let particleAnimationId = null

// 获取粒子样式
const getParticleStyle = (index) => {
  const angle = (index / avatarParticles.value.length) * Math.PI * 2
  const radius = 70
  const x = Math.cos(angle) * radius
  const y = Math.sin(angle) * radius
  return {
    left: `calc(50% + ${x}px)`,
    top: `calc(50% + ${y}px)`,
    transform: 'translate(-50%, -50%)',
  }
}

// 粒子动画
onMounted(() => {
  let time = 0
  const animateParticles = () => {
    time += 0.02
    if (avatarContainer.value) {
      const particles = avatarContainer.value.parentElement.querySelectorAll('.absolute.w-2')
      particles.forEach((particle, index) => {
        const angle = (index / avatarParticles.value.length) * Math.PI * 2 + time
        const radius = 70 + Math.sin(time * 2 + index) * 10
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius
        particle.style.left = `calc(50% + ${x}px)`
        particle.style.top = `calc(50% + ${y}px)`
        particle.style.opacity = (0.4 + Math.sin(time + index) * 0.3).toString()
      })
    }
    particleAnimationId = requestAnimationFrame(animateParticles)
  }
  animateParticles()
})

onUnmounted(() => {
  if (particleAnimationId) {
    cancelAnimationFrame(particleAnimationId)
  }
})

// 技能标签悬停效果
const onSkillHover = (index) => {
  // 可以通过添加类来触发CSS动画
}

const onSkillLeave = (index) => {
  // 移除效果
}

// 按钮磁吸效果
const onButtonMove = (event, type) => {
  const button = type === 'primary' ? primaryButton.value : secondaryButton.value
  if (!button) return

  const rect = button.getBoundingClientRect()
  const x = event.clientX - rect.left - rect.width / 2
  const y = event.clientY - rect.top - rect.height / 2

  const distance = Math.sqrt(x * x + y * y)
  const maxDistance = 100
  const strength = Math.min(distance / maxDistance, 1)

  const moveX = (x / distance) * strength * 10
  const moveY = (y / distance) * strength * 10

  button.style.transform = `translate(${moveX}px, ${moveY}px)`
}

const onButtonLeave = (type) => {
  const button = type === 'primary' ? primaryButton.value : secondaryButton.value
  if (!button) return
  button.style.transform = 'translate(0, 0)'
}
</script>

<style scoped>
.skill-tag {
  position: relative;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
  border-radius: 9999px;
  font-weight: 500;
  color: rgb(59, 130, 246);
  cursor: pointer;
  transition: all 0.3s ease;
  transform-style: preserve-3d;
  animation: fadeInUp 0.6s ease-out both;
}

.skill-tag:hover {
  transform: translateY(-5px) rotateX(10deg) scale(1.1);
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(139, 92, 246, 0.3));
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.4),
              0 0 20px rgba(139, 92, 246, 0.3);
  color: white;
}

.skill-tag::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 9999px;
  background: linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
  filter: blur(8px);
}

.skill-tag:hover::before {
  opacity: 1;
}

.skill-text {
  position: relative;
  z-index: 1;
}

.magnetic-btn {
  transition: transform 0.2s ease-out;
  position: relative;
  overflow: hidden;
}

.magnetic-btn::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.magnetic-btn:hover::after {
  width: 300px;
  height: 300px;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
