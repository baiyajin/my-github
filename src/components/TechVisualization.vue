<template>
  <div class="relative w-full h-96 rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
    <div ref="container" class="w-full h-full"></div>
    
    <!-- 技术详情弹窗 -->
    <Transition name="fade">
      <div 
        v-if="selectedTech"
        class="absolute top-4 left-4 bg-white/95 backdrop-blur-lg rounded-lg p-4 shadow-xl max-w-xs z-10"
        @click.stop
      >
        <h3 class="text-lg font-bold mb-2" :style="{ color: `#${selectedTech.color.toString(16)}` }">
          {{ selectedTech.name }}
        </h3>
        <p class="text-sm text-gray-600">{{ selectedTech.description }}</p>
        <button 
          @click="selectedTech = null"
          class="mt-2 text-xs text-gray-400 hover:text-gray-600"
        >
          关闭
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

const container = ref(null)
const selectedTech = ref(null)
let scene, camera, renderer, techNodes = [], lines = [], animationId
let raycaster, mouse, handleClick

const techData = [
  { name: 'Vue 3', position: [0, 2, 0], color: 0x42b883, description: '渐进式 JavaScript 框架，用于构建用户界面' },
  { name: 'Three.js', position: [-2, 0, 0], color: 0x000000, description: '3D 图形库，用于创建和显示动画 3D 计算机图形' },
  { name: 'WebAssembly', position: [2, 0, 0], color: 0x654ff0, description: '高性能的二进制格式，可在浏览器中运行' },
  { name: 'Vite', position: [0, -2, 0], color: 0x646cff, description: '下一代前端构建工具，提供极速的开发体验' },
  { name: 'UnoCSS', position: [-1.5, 1, 0], color: 0x00d9ff, description: '即时原子化 CSS 引擎，按需生成样式' },
  { name: 'JavaScript', position: [1.5, 1, 0], color: 0xf7df1e, description: '动态编程语言，Web 开发的核心技术' },
]

onMounted(() => {
  if (!container.value) return

  scene = new THREE.Scene()
  
  camera = new THREE.PerspectiveCamera(
    75,
    container.value.clientWidth / container.value.clientHeight,
    0.1,
    1000
  )
  camera.position.set(0, 0, 8)

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
  renderer.setSize(container.value.clientWidth, container.value.clientHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  container.value.appendChild(renderer.domElement)
  
  // 射线投射器（用于点击检测）
  raycaster = new THREE.Raycaster()
  mouse = new THREE.Vector2()

  // 创建技术节点
  techData.forEach((tech, index) => {
    const geometry = new THREE.SphereGeometry(0.3, 16, 16)
    const material = new THREE.MeshStandardMaterial({ 
      color: tech.color,
      metalness: 0.7,
      roughness: 0.3,
      emissive: tech.color,
      emissiveIntensity: 0.2,
    })
    const sphere = new THREE.Mesh(geometry, material)
    sphere.position.set(...tech.position)
    sphere.userData = { name: tech.name, index, baseScale: 1 }
    scene.add(sphere)
    techNodes.push(sphere)

    // 添加连接线（连接到中心节点）
    if (index > 0) {
      const lineGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(...techData[0].position),
        new THREE.Vector3(...tech.position),
      ])
      const lineMaterial = new THREE.LineBasicMaterial({ 
        color: tech.color,
        opacity: 0.2,
        transparent: true,
      })
      const line = new THREE.Line(lineGeometry, lineMaterial)
      line.userData = { from: 0, to: index, tech }
      scene.add(line)
      lines.push(line)
    }
  })

  // 添加光源
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
  scene.add(ambientLight)
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(5, 5, 5)
  scene.add(directionalLight)

  // 点击交互
  handleClick = (event) => {
    if (!container.value) return
    
    const rect = container.value.getBoundingClientRect()
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(techNodes)
    
    if (intersects.length > 0) {
      const clickedNode = intersects[0].object
      const tech = techData[clickedNode.userData.index]
      selectedTech.value = tech
      
      // 高亮效果
      techNodes.forEach((node, index) => {
        if (index === clickedNode.userData.index) {
          node.scale.set(1.5, 1.5, 1.5)
          node.material.emissiveIntensity = 0.5
          node.userData.baseScale = 1.5
        } else {
          node.scale.set(1, 1, 1)
          node.material.emissiveIntensity = 0.2
          node.userData.baseScale = 1
        }
      })
    } else {
      selectedTech.value = null
      techNodes.forEach(node => {
        node.scale.set(1, 1, 1)
        node.material.emissiveIntensity = 0.2
        node.userData.baseScale = 1
      })
    }
  }
  
  container.value.addEventListener('click', handleClick)

  // 动画（包含能量流动效果）
  const clock = new THREE.Clock()
  const animate = () => {
    animationId = requestAnimationFrame(animate)
    const elapsedTime = clock.getElapsedTime()

    techNodes.forEach((node, index) => {
      node.rotation.x += 0.01
      node.rotation.y += 0.01
      
      // 浮动效果
      const originalY = techData[index].position[1]
      node.position.y = originalY + Math.sin(elapsedTime + index) * 0.2
      
      // 脉冲效果（能量流动）- 只在未选中时应用
      if (!selectedTech.value || selectedTech.value.name !== techData[index].name) {
        const pulse = Math.sin(elapsedTime * 2 + index) * 0.1 + 1
        const currentScale = node.userData.baseScale || 1
        node.scale.set(currentScale * pulse, currentScale * pulse, currentScale * pulse)
      }
    })

    // 能量流动效果（连线动画）
    lines.forEach((line, index) => {
      const time = elapsedTime + index * 0.5
      const opacity = 0.2 + Math.sin(time * 2) * 0.2
      line.material.opacity = Math.max(0.1, Math.min(0.5, opacity))
    })

    // 旋转整个场景
    scene.rotation.y += 0.005

    renderer.render(scene, camera)
  }

  animate()

  // 窗口大小调整
  const handleResize = () => {
    if (!container.value) return
    camera.aspect = container.value.clientWidth / container.value.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(container.value.clientWidth, container.value.clientHeight)
  }

  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  
  if (container.value) {
    container.value.removeEventListener('click', handleClick)
  }
  
  if (renderer) {
    renderer.dispose()
  }
  
  techNodes.forEach(node => {
    node.geometry.dispose()
    node.material.dispose()
  })
  
  lines.forEach(line => {
    line.geometry.dispose()
    line.material.dispose()
  })
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>

