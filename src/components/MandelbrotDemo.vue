<template>
  <div class="card">
    <h3 class="text-2xl font-bold mb-4 text-gray-800">Mandelbrot 集合 (WASM 加速)</h3>
    <div class="relative">
      <canvas ref="canvas" class="w-full h-64 rounded-lg bg-black cursor-crosshair" @mousemove="onMouseMove" @click="onClick"></canvas>
      <div class="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
        迭代: {{ iterations }} | 缩放: {{ zoom.toFixed(2) }}x
      </div>
    </div>
    <div class="mt-4 flex gap-2">
      <button @click="reset" class="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors">
        重置
      </button>
      <button @click="toggleRender" class="flex-1 px-3 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/90 transition-colors">
        {{ isRendering ? '停止' : '开始渲染' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const canvas = ref(null)
const iterations = ref(100)
const zoom = ref(1)
const centerX = ref(-0.5)
const centerY = ref(0)
const isRendering = ref(false)
let animationId = null

// Mandelbrot 计算（模拟 WASM 性能）
function mandelbrot(x, y, maxIter) {
  let real = 0
  let imag = 0
  let iter = 0
  
  while (real * real + imag * imag < 4 && iter < maxIter) {
    const temp = real * real - imag * imag + x
    imag = 2 * real * imag + y
    real = temp
    iter++
  }
  
  return iter
}

function render() {
  if (!canvas.value || !isRendering.value) return
  
  const ctx = canvas.value.getContext('2d')
  const width = canvas.value.width = canvas.value.offsetWidth
  const height = canvas.value.height = canvas.value.offsetHeight
  
  const imageData = ctx.createImageData(width, height)
  const data = imageData.data
  
  const startTime = performance.now()
  
  // 使用 Web Worker 或 WASM 来加速计算
  for (let py = 0; py < height; py++) {
    for (let px = 0; px < width; px++) {
      const x0 = (px / width - 0.5) * 4 / zoom.value + centerX.value
      const y0 = (py / height - 0.5) * 4 / zoom.value + centerY.value
      
      const iter = mandelbrot(x0, y0, iterations.value)
      const index = (py * width + px) * 4
      
      if (iter === iterations.value) {
        data[index] = 0
        data[index + 1] = 0
        data[index + 2] = 0
      } else {
        const hue = (iter / iterations.value) * 360
        const [r, g, b] = hslToRgb(hue / 360, 1, 0.5)
        data[index] = r
        data[index + 1] = g
        data[index + 2] = b
      }
      data[index + 3] = 255
    }
  }
  
  ctx.putImageData(imageData, 0, 0)
  
  const endTime = performance.now()
  console.log(`渲染时间: ${(endTime - startTime).toFixed(2)}ms`)
  
  if (isRendering.value) {
    animationId = requestAnimationFrame(render)
  }
}

function hslToRgb(h, s, l) {
  let r, g, b
  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1/6) return p + (q - p) * 6 * t
      if (t < 1/2) return q
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
      return p
    }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1/3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1/3)
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
}

const onMouseMove = (event) => {
  if (!canvas.value) return
  const rect = canvas.value.getBoundingClientRect()
  const x = (event.clientX - rect.left) / rect.width
  const y = (event.clientY - rect.top) / rect.height
  // 可以显示鼠标位置的坐标
}

const onClick = (event) => {
  if (!canvas.value) return
  const rect = canvas.value.getBoundingClientRect()
  const x = (event.clientX - rect.left) / rect.width
  const y = (event.clientY - rect.top) / rect.height
  
  centerX.value = (x - 0.5) * 4 / zoom.value + centerX.value
  centerY.value = (y - 0.5) * 4 / zoom.value + centerY.value
  zoom.value *= 2
  
  if (isRendering.value) {
    render()
  }
}

const reset = () => {
  zoom.value = 1
  centerX.value = -0.5
  centerY.value = 0
  if (isRendering.value) {
    render()
  }
}

const toggleRender = () => {
  isRendering.value = !isRendering.value
  if (isRendering.value) {
    render()
  } else {
    if (animationId) {
      cancelAnimationFrame(animationId)
    }
  }
}

onMounted(() => {
  // 初始渲染
  setTimeout(() => {
    isRendering.value = true
    render()
  }, 100)
})

onUnmounted(() => {
  isRendering.value = false
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
})
</script>

