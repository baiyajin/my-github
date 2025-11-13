<template>
  <section id="demo" class="py-20 bg-white/50">
    <div class="container mx-auto px-4">
      <h2 class="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        WebAssembly 演示
      </h2>
      <p class="text-center text-gray-600 mb-12 text-lg">
        展示 WebAssembly 在性能密集型计算中的优势
      </p>
      
      <div class="max-w-4xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                    :style="{ width: `${jsTime / 10}%` }"
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
                    :style="{ width: `${wasmTime / 10}%` }"
                  ></div>
                </div>
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
              <div class="flex gap-2">
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
              </div>
            </div>
          </div>
        </div>
        
        <!-- 说明 -->
        <div class="mt-8 card bg-gradient-to-r from-primary/10 to-secondary/10">
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
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const jsTime = ref(0)
const wasmTime = ref(0)
const running = ref(false)
const canvas = ref(null)

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
    gradient.addColorStop(1, '#8b5cf6')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
    
    // 绘制一些图形
    ctx.fillStyle = 'white'
    ctx.beginPath()
    ctx.arc(width / 2, height / 2, 30, 0, Math.PI * 2)
    ctx.fill()
  }
})

// 应用滤镜（模拟，实际应该使用 WASM）
const applyFilter = (filter) => {
  if (!canvas.value) return
  
  const ctx = canvas.value.getContext('2d')
  const imageData = ctx.getImageData(0, 0, canvas.value.width, canvas.value.height)
  const data = imageData.data
  
  switch (filter) {
    case 'grayscale':
      for (let i = 0; i < data.length; i += 4) {
        const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114
        data[i] = gray
        data[i + 1] = gray
        data[i + 2] = gray
      }
      break
    case 'blur':
      // 简单的模糊效果
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, data[i] * 1.2)
        data[i + 1] = Math.min(255, data[i + 1] * 1.2)
        data[i + 2] = Math.min(255, data[i + 2] * 1.2)
      }
      break
    case 'edge':
      // 简单的边缘检测
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
        const threshold = avg > 128 ? 255 : 0
        data[i] = threshold
        data[i + 1] = threshold
        data[i + 2] = threshold
      }
      break
  }
  
  ctx.putImageData(imageData, 0, 0)
}
</script>

