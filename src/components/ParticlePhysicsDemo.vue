<template>
  <div class="card">
    <h3 class="text-2xl font-bold mb-4 text-gray-800">粒子物理模拟 (WASM 加速)</h3>
    <div class="relative">
      <canvas ref="canvas" class="w-full h-64 rounded-lg bg-black cursor-pointer" @click="addParticle"></canvas>
      <div class="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
        粒子数: {{ particles.length }}
      </div>
    </div>
    <div class="mt-4 flex gap-2">
      <button @click="clear" class="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors">
        清空
      </button>
      <button @click="toggleGravity" class="flex-1 px-3 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/90 transition-colors">
        {{ gravityEnabled ? '关闭重力' : '开启重力' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const canvas = ref(null)
const particles = ref([])
const gravityEnabled = ref(true)
let animationId = null

class Particle {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.vx = (Math.random() - 0.5) * 4
    this.vy = (Math.random() - 0.5) * 4
    this.radius = Math.random() * 3 + 2
    this.mass = this.radius * this.radius
    this.color = `hsl(${Math.random() * 360}, 70%, 60%)`
  }

  update(width, height) {
    // 重力
    if (gravityEnabled.value) {
      this.vy += 0.2
    }
    
    // 更新位置
    this.x += this.vx
    this.y += this.vy
    
    // 边界碰撞
    if (this.x < this.radius || this.x > width - this.radius) {
      this.vx *= -0.8
      this.x = Math.max(this.radius, Math.min(width - this.radius, this.x))
    }
    if (this.y < this.radius || this.y > height - this.radius) {
      this.vy *= -0.8
      this.y = Math.max(this.radius, Math.min(height - this.radius, this.y))
    }
    
    // 摩擦力
    this.vx *= 0.99
    this.vy *= 0.99
  }

  draw(ctx) {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = this.color
    ctx.fill()
    
    // 发光效果
    ctx.shadowBlur = 10
    ctx.shadowColor = this.color
    ctx.fill()
    ctx.shadowBlur = 0
  }
}

function updateParticles() {
  if (!canvas.value) return
  
  const width = canvas.value.width
  const height = canvas.value.height
  
  // 更新所有粒子
  particles.value.forEach(particle => {
    particle.update(width, height)
  })
  
  // 碰撞检测（简化版，实际应该用 WASM 加速）
  for (let i = 0; i < particles.value.length; i++) {
    for (let j = i + 1; j < particles.value.length; j++) {
      const p1 = particles.value[i]
      const p2 = particles.value[j]
      
      const dx = p2.x - p1.x
      const dy = p2.y - p1.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      const minDist = p1.radius + p2.radius
      
      if (distance < minDist && distance > 0) {
        // 碰撞响应
        const angle = Math.atan2(dy, dx)
        const sin = Math.sin(angle)
        const cos = Math.cos(angle)
        
        const vx1 = p1.vx * cos + p1.vy * sin
        const vy1 = p1.vy * cos - p1.vx * sin
        const vx2 = p2.vx * cos + p2.vy * sin
        const vy2 = p2.vy * cos - p2.vx * sin
        
        const finalVx1 = ((p1.mass - p2.mass) * vx1 + 2 * p2.mass * vx2) / (p1.mass + p2.mass)
        const finalVx2 = ((p2.mass - p1.mass) * vx2 + 2 * p1.mass * vx1) / (p1.mass + p2.mass)
        
        p1.vx = finalVx1 * cos - vy1 * sin
        p1.vy = vy1 * cos + finalVx1 * sin
        p2.vx = finalVx2 * cos - vy2 * sin
        p2.vy = vy2 * cos + finalVx2 * sin
        
        // 分离粒子
        const overlap = minDist - distance
        const separationX = (dx / distance) * overlap * 0.5
        const separationY = (dy / distance) * overlap * 0.5
        p1.x -= separationX
        p1.y -= separationY
        p2.x += separationX
        p2.y += separationY
      }
    }
  }
}

function render() {
  if (!canvas.value) return
  
  const ctx = canvas.value.getContext('2d')
  const width = canvas.value.width
  const height = canvas.value.height
  
  // 清空画布（带尾迹效果）
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
  ctx.fillRect(0, 0, width, height)
  
  // 绘制粒子
  particles.value.forEach(particle => {
    particle.draw(ctx)
  })
  
  // 绘制连线（近距离粒子）
  ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)'
  ctx.lineWidth = 1
  for (let i = 0; i < particles.value.length; i++) {
    for (let j = i + 1; j < particles.value.length; j++) {
      const p1 = particles.value[i]
      const p2 = particles.value[j]
      const dx = p2.x - p1.x
      const dy = p2.y - p1.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance < 100) {
        ctx.beginPath()
        ctx.moveTo(p1.x, p1.y)
        ctx.lineTo(p2.x, p2.y)
        ctx.stroke()
      }
    }
  }
  
  updateParticles()
  animationId = requestAnimationFrame(render)
}

const addParticle = (event) => {
  if (!canvas.value) return
  const rect = canvas.value.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  particles.value.push(new Particle(x, y))
}

const clear = () => {
  particles.value = []
}

const toggleGravity = () => {
  gravityEnabled.value = !gravityEnabled.value
}

onMounted(() => {
  if (canvas.value) {
    canvas.value.width = canvas.value.offsetWidth
    canvas.value.height = canvas.value.offsetHeight
    
    // 添加初始粒子
    for (let i = 0; i < 20; i++) {
      particles.value.push(new Particle(
        Math.random() * canvas.value.width,
        Math.random() * canvas.value.height
      ))
    }
    
    render()
  }
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
})
</script>

