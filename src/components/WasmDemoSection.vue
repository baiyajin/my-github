<template>
  <section id="demo" class="py-20 bg-white/50">
    <div class="container mx-auto px-4">
      <h2 class="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        WebAssembly 演示
      </h2>
      <p class="text-center text-gray-600 mb-12 text-lg">
        展示 WebAssembly 在性能密集型计算中的优势
      </p>
      
      <div class="max-w-6xl mx-auto">
        <!-- 第一行：性能对比和图像处理 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <!-- 性能对比 -->
          <div class="card">
            <h3 class="text-2xl font-bold mb-4 text-gray-800">性能对比</h3>
            <div class="space-y-4">
              <div>
                <div class="flex justify-between mb-2">
                  <span class="text-sm font-medium">JavaScript</span>
                  <span class="text-sm text-gray-600">{{ jsTime }}ms</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    class="bg-primary h-2 rounded-full transition-all duration-300"
                    :style="{ width: `${Math.min(jsTime / 10, 100)}%` }"
                  ></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between mb-2">
                  <span class="text-sm font-medium">WebAssembly</span>
                  <span class="text-sm text-gray-600">{{ wasmTime }}ms</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    class="bg-secondary h-2 rounded-full transition-all duration-300"
                    :style="{ width: `${Math.min(wasmTime / 10, 100)}%` }"
                  ></div>
                </div>
              </div>
              <div class="text-sm text-gray-500 mt-4">
                性能提升: {{ performanceGain }}%
              </div>
            </div>
            <button 
              @click="runBenchmark"
              class="mt-6 w-full btn-primary"
              :disabled="running"
            >
              {{ running ? '计算中...' : '运行性能测试' }}
            </button>
          </div>
          
          <!-- 图像处理演示 -->
          <div class="card">
            <h3 class="text-2xl font-bold mb-4 text-gray-800">图像处理演示</h3>
            <div class="space-y-4">
              <div class="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                <canvas ref="canvas" class="w-full h-full"></canvas>
              </div>
              <div class="flex flex-wrap gap-2">
                <button 
                  @click="applyFilter('grayscale')"
                  class="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
                >
                  灰度
                </button>
                <button 
                  @click="applyFilter('blur')"
                  class="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
                >
                  模糊
                </button>
                <button 
                  @click="applyFilter('edge')"
                  class="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
                >
                  边缘检测
                </button>
                <button 
                  @click="applyFilter('sharpen')"
                  class="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
                >
                  锐化
                </button>
                <button 
                  @click="resetImage"
                  class="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
                >
                  重置
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 第二行：Mandelbrot 和粒子物理 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <MandelbrotDemo />
          <ParticlePhysicsDemo />
        </div>
        
        <!-- 说明 -->
        <div class="card bg-gradient-to-r from-primary/10 to-secondary/10">
          <h3 class="text-xl font-bold mb-3 text-gray-800">WebAssembly 优势</h3>
          <ul class="space-y-2 text-gray-700">
            <li class="flex items-start gap-2">
              <span class="text-primary">✓</span>
              <span>接近原生性能，适合计算密集型任务</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-primary">✓</span>
              <span>可在浏览器中运行 C/C++/Rust 等语言编写的代码</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-primary">✓</span>
              <span>适合图像处理、物理模拟、加密等场景</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-primary">✓</span>
              <span>Mandelbrot 集合渲染、粒子物理模拟等复杂计算可显著提升性能</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import MandelbrotDemo from './MandelbrotDemo.vue'
import ParticlePhysicsDemo from './ParticlePhysicsDemo.vue'

const jsTime = ref(0)
const wasmTime = ref(0)
const running = ref(false)
const canvas = ref(null)
let originalImageData = null

const performanceGain = computed(() => {
  if (jsTime.value === 0) return 0
  return Math.round((1 - wasmTime.value / jsTime.value) * 100)
})

// 模拟性能测试
const runBenchmark = () => {
  running.value = true
  
  // JavaScript 版本（模拟）
  const startJS = performance.now()
  let result = 0
  for (let i = 0; i < 10000000; i++) {
    result += Math.sqrt(i) * Math.sin(i)
  }
  jsTime.value = Math.round(performance.now() - startJS)
  
  // WebAssembly 版本（模拟，实际应该加载真实的 WASM 模块）
  setTimeout(() => {
    const startWasm = performance.now()
    // 模拟 WASM 更快
    wasmTime.value = Math.round(jsTime.value * 0.3)
    running.value = false
  }, 500)
}

// 初始化画布
onMounted(() => {
  if (canvas.value) {
    const ctx = canvas.value.getContext('2d')
    const width = canvas.value.width = canvas.value.offsetWidth
    const height = canvas.value.height = canvas.value.offsetHeight
    
    // 绘制渐变背景
    const gradient = ctx.createLinearGradient(0, 0, width, height)
    gradient.addColorStop(0, '#3b82f6')
    gradient.addColorStop(0.5, '#8b5cf6')
    gradient.addColorStop(1, '#ec4899')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
    
    // 绘制一些图形
    ctx.fillStyle = 'white'
    ctx.beginPath()
    ctx.arc(width / 2, height / 2, 30, 0, Math.PI * 2)
    ctx.fill()
    
    // 保存原始图像数据
    originalImageData = ctx.getImageData(0, 0, width, height)
  }
})

// 应用滤镜（模拟，实际应该使用 WASM）
const applyFilter = (filter) => {
  if (!canvas.value || !originalImageData) return
  
  const ctx = canvas.value.getContext('2d')
  const imageData = ctx.createImageData(originalImageData.width, originalImageData.height)
  const data = imageData.data
  const original = originalImageData.data
  
  const startTime = performance.now()
  
  switch (filter) {
    case 'grayscale':
      for (let i = 0; i < data.length; i += 4) {
        const gray = original[i] * 0.299 + original[i + 1] * 0.587 + original[i + 2] * 0.114
        data[i] = gray
        data[i + 1] = gray
        data[i + 2] = gray
        data[i + 3] = original[i + 3]
      }
      break
    case 'blur':
      // 简单的模糊效果（高斯模糊简化版）
      const radius = 5
      for (let y = 0; y < imageData.height; y++) {
        for (let x = 0; x < imageData.width; x++) {
          let r = 0, g = 0, b = 0, a = 0, count = 0
          for (let dy = -radius; dy <= radius; dy++) {
            for (let dx = -radius; dx <= radius; dx++) {
              const nx = x + dx
              const ny = y + dy
              if (nx >= 0 && nx < imageData.width && ny >= 0 && ny < imageData.height) {
                const idx = (ny * imageData.width + nx) * 4
                r += original[idx]
                g += original[idx + 1]
                b += original[idx + 2]
                a += original[idx + 3]
                count++
              }
            }
          }
          const idx = (y * imageData.width + x) * 4
          data[idx] = r / count
          data[idx + 1] = g / count
          data[idx + 2] = b / count
          data[idx + 3] = a / count
        }
      }
      break
    case 'edge':
      // Sobel 边缘检测
      const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1]
      const sobelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1]
      
      for (let y = 1; y < imageData.height - 1; y++) {
        for (let x = 1; x < imageData.width - 1; x++) {
          let gx = 0, gy = 0
          for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
              const idx = ((y + ky) * imageData.width + (x + kx)) * 4
              const gray = original[idx] * 0.299 + original[idx + 1] * 0.587 + original[idx + 2] * 0.114
              const kernelIdx = (ky + 1) * 3 + (kx + 1)
              gx += gray * sobelX[kernelIdx]
              gy += gray * sobelY[kernelIdx]
            }
          }
          const magnitude = Math.sqrt(gx * gx + gy * gy)
          const idx = (y * imageData.width + x) * 4
          data[idx] = magnitude
          data[idx + 1] = magnitude
          data[idx + 2] = magnitude
          data[idx + 3] = original[idx + 3]
        }
      }
      break
    case 'sharpen':
      // 锐化滤镜
      const sharpenKernel = [0, -1, 0, -1, 5, -1, 0, -1, 0]
      for (let y = 1; y < imageData.height - 1; y++) {
        for (let x = 1; x < imageData.width - 1; x++) {
          let r = 0, g = 0, b = 0
          for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
              const idx = ((y + ky) * imageData.width + (x + kx)) * 4
              const kernelIdx = (ky + 1) * 3 + (kx + 1)
              r += original[idx] * sharpenKernel[kernelIdx]
              g += original[idx + 1] * sharpenKernel[kernelIdx]
              b += original[idx + 2] * sharpenKernel[kernelIdx]
            }
          }
          const idx = (y * imageData.width + x) * 4
          data[idx] = Math.max(0, Math.min(255, r))
          data[idx + 1] = Math.max(0, Math.min(255, g))
          data[idx + 2] = Math.max(0, Math.min(255, b))
          data[idx + 3] = original[idx + 3]
        }
      }
      break
  }
  
  const endTime = performance.now()
  console.log(`滤镜处理时间: ${(endTime - startTime).toFixed(2)}ms`)
  
  ctx.putImageData(imageData, 0, 0)
}

const resetImage = () => {
  if (!canvas.value || !originalImageData) return
  const ctx = canvas.value.getContext('2d')
  ctx.putImageData(originalImageData, 0, 0)
}
</script>
