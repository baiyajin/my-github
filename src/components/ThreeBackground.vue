<template>
  <div ref="container" class="absolute inset-0 w-full h-full"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

const container = ref(null)
let scene, camera, renderer, particles, animationId

onMounted(() => {
  if (!container.value) return

  // 创建场景
  scene = new THREE.Scene()
  
  // 创建相机
  camera = new THREE.PerspectiveCamera(
    75,
    container.value.clientWidth / container.value.clientHeight,
    0.1,
    1000
  )
  camera.position.z = 5

  // 创建渲染器
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
  renderer.setSize(container.value.clientWidth, container.value.clientHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  container.value.appendChild(renderer.domElement)

  // 创建粒子系统
  const particleCount = 1000
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)

  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 20
    positions[i + 1] = (Math.random() - 0.5) * 20
    positions[i + 2] = (Math.random() - 0.5) * 20

    const color = new THREE.Color()
    color.setHSL(Math.random() * 0.2 + 0.5, 1, 0.5)
    colors[i] = color.r
    colors[i + 1] = color.g
    colors[i + 2] = color.b
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size: 0.1,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
  })

  particles = new THREE.Points(geometry, material)
  scene.add(particles)

  // 添加几何体
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
  const boxMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x3b82f6,
    metalness: 0.7,
    roughness: 0.3,
  })
  const box = new THREE.Mesh(boxGeometry, boxMaterial)
  box.position.set(-2, 0, 0)
  scene.add(box)

  const sphereGeometry = new THREE.SphereGeometry(0.8, 32, 32)
  const sphereMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x8b5cf6,
    metalness: 0.7,
    roughness: 0.3,
  })
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
  sphere.position.set(2, 0, 0)
  scene.add(sphere)

  // 添加光源
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(5, 5, 5)
  scene.add(directionalLight)

  // 动画循环
  const animate = () => {
    animationId = requestAnimationFrame(animate)

    // 旋转粒子
    particles.rotation.x += 0.0005
    particles.rotation.y += 0.001

    // 旋转几何体
    box.rotation.x += 0.01
    box.rotation.y += 0.01
    sphere.rotation.x += 0.01
    sphere.rotation.y += 0.01

    renderer.render(scene, camera)
  }

  animate()

  // 处理窗口大小变化
  const handleResize = () => {
    if (!container.value) return
    camera.aspect = container.value.clientWidth / container.value.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(container.value.clientWidth, container.value.clientHeight)
  }

  window.addEventListener('resize', handleResize)

  // 鼠标交互
  const handleMouseMove = (event) => {
    const mouseX = (event.clientX / window.innerWidth) * 2 - 1
    const mouseY = -(event.clientY / window.innerHeight) * 2 + 1

    camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05
    camera.position.y += (mouseY * 0.5 - camera.position.y) * 0.05
    camera.lookAt(scene.position)
  }

  window.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  
  if (renderer) {
    renderer.dispose()
  }
  
  if (particles) {
    particles.geometry.dispose()
    particles.material.dispose()
  }
})
</script>

<style scoped>
div {
  pointer-events: none;
}
</style>

