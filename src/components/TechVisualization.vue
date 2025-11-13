<template>
  <div ref="container" class="w-full h-96 rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

const container = ref(null)
let scene, camera, renderer, techNodes = [], animationId

const techData = [
  { name: 'Vue 3', position: [0, 2, 0], color: 0x42b883 },
  { name: 'Three.js', position: [-2, 0, 0], color: 0x000000 },
  { name: 'WebAssembly', position: [2, 0, 0], color: 0x654ff0 },
  { name: 'Vite', position: [0, -2, 0], color: 0x646cff },
  { name: 'UnoCSS', position: [-1.5, 1, 0], color: 0x00d9ff },
  { name: 'JavaScript', position: [1.5, 1, 0], color: 0xf7df1e },
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
    sphere.userData = { name: tech.name, index }
    scene.add(sphere)
    techNodes.push(sphere)

    // 添加连接线
    if (index > 0) {
      const lineGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(...techData[0].position),
        new THREE.Vector3(...tech.position),
      ])
      const lineMaterial = new THREE.LineBasicMaterial({ 
        color: 0x888888,
        opacity: 0.3,
        transparent: true,
      })
      const line = new THREE.Line(lineGeometry, lineMaterial)
      scene.add(line)
    }
  })

  // 添加光源
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
  scene.add(ambientLight)
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(5, 5, 5)
  scene.add(directionalLight)

  // 动画
  const animate = () => {
    animationId = requestAnimationFrame(animate)

    techNodes.forEach((node, index) => {
      const time = Date.now() * 0.001
      node.rotation.x += 0.01
      node.rotation.y += 0.01
      
      // 浮动效果
      const originalY = techData[index].position[1]
      node.position.y = originalY + Math.sin(time + index) * 0.2
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
  
  if (renderer) {
    renderer.dispose()
  }
  
  techNodes.forEach(node => {
    node.geometry.dispose()
    node.material.dispose()
  })
})
</script>

