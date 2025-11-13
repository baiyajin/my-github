<template>
  <div ref="container" class="absolute inset-0 w-full h-full"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

const container = ref(null)
let scene, camera, renderer, particles, particleSystem, lineSystem, geometries = [], animationId
let mouseX = 0, mouseY = 0

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
  camera.position.z = 15

  // 创建渲染器
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
  renderer.setSize(container.value.clientWidth, container.value.clientHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  container.value.appendChild(renderer.domElement)

  // 创建增强的粒子系统（5000个粒子）
  const particleCount = 5000
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)
  const velocities = new Float32Array(particleCount * 3)

  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 50
    positions[i + 1] = (Math.random() - 0.5) * 50
    positions[i + 2] = (Math.random() - 0.5) * 50

    velocities[i] = (Math.random() - 0.5) * 0.02
    velocities[i + 1] = (Math.random() - 0.5) * 0.02
    velocities[i + 2] = (Math.random() - 0.5) * 0.02

    const color = new THREE.Color()
    const hue = Math.random() * 0.3 + 0.5 // 蓝色到紫色
    color.setHSL(hue, 1, 0.6)
    colors[i] = color.r
    colors[i + 1] = color.g
    colors[i + 2] = color.b
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size: 0.15,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    sizeAttenuation: true,
  })

  particles = new THREE.Points(geometry, material)
  particles.userData.velocities = velocities
  scene.add(particles)

  // 创建粒子连线系统
  const lineGeometry = new THREE.BufferGeometry()
  const linePositions = new Float32Array(particleCount * 3 * 2)
  lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3))
  
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x3b82f6,
    transparent: true,
    opacity: 0.2,
  })
  
  particleSystem = { geometry, positions, velocities }
  lineSystem = { geometry: lineGeometry, positions: linePositions }

  // 添加多个动态几何体
  const geometriesData = [
    { type: 'box', position: [-4, 2, 0], color: 0x3b82f6, size: 1.2 },
    { type: 'sphere', position: [4, 2, 0], color: 0x8b5cf6, size: 1 },
    { type: 'torus', position: [-4, -2, 0], color: 0xec4899, size: 1 },
    { type: 'octahedron', position: [4, -2, 0], color: 0x00d9ff, size: 1 },
    { type: 'tetrahedron', position: [0, 3, -2], color: 0xf7df1e, size: 0.8 },
  ]

  geometriesData.forEach((data, index) => {
    let geo
    switch (data.type) {
      case 'box':
        geo = new THREE.BoxGeometry(data.size, data.size, data.size)
        break
      case 'sphere':
        geo = new THREE.SphereGeometry(data.size, 32, 32)
        break
      case 'torus':
        geo = new THREE.TorusGeometry(data.size, 0.3, 16, 100)
        break
      case 'octahedron':
        geo = new THREE.OctahedronGeometry(data.size)
        break
      case 'tetrahedron':
        geo = new THREE.TetrahedronGeometry(data.size)
        break
    }

    const mat = new THREE.MeshStandardMaterial({
      color: data.color,
      metalness: 0.8,
      roughness: 0.2,
      emissive: data.color,
      emissiveIntensity: 0.3,
    })

    const mesh = new THREE.Mesh(geo, mat)
    mesh.position.set(...data.position)
    mesh.userData.originalPosition = [...data.position]
    mesh.userData.rotationSpeed = {
      x: (Math.random() - 0.5) * 0.02,
      y: (Math.random() - 0.5) * 0.02,
      z: (Math.random() - 0.5) * 0.02,
    }
    scene.add(mesh)
    geometries.push(mesh)
  })

  // 增强光源系统
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
  scene.add(ambientLight)
  
  const directionalLight1 = new THREE.DirectionalLight(0x3b82f6, 1)
  directionalLight1.position.set(10, 10, 5)
  scene.add(directionalLight1)
  
  const directionalLight2 = new THREE.DirectionalLight(0x8b5cf6, 0.8)
  directionalLight2.position.set(-10, -10, 5)
  scene.add(directionalLight2)

  // 添加点光源（动态）
  const pointLight = new THREE.PointLight(0xec4899, 2, 100)
  pointLight.position.set(0, 0, 10)
  scene.add(pointLight)

  // 动画循环
  const clock = new THREE.Clock()
  const animate = () => {
    animationId = requestAnimationFrame(animate)
    const elapsedTime = clock.getElapsedTime()

    // 更新粒子位置（跟随鼠标）
    const positions = particles.geometry.attributes.position.array
    const velocities = particles.userData.velocities

    for (let i = 0; i < particleCount * 3; i += 3) {
      // 鼠标影响
      const dx = mouseX * 10 - positions[i]
      const dy = mouseY * 10 - positions[i + 1]
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance < 5) {
        const force = (5 - distance) / 5
        velocities[i] += dx * force * 0.001
        velocities[i + 1] += dy * force * 0.001
      }

      // 更新位置
      positions[i] += velocities[i]
      positions[i + 1] += velocities[i + 1]
      positions[i + 2] += velocities[i + 2]

      // 边界反弹
      if (Math.abs(positions[i]) > 25) velocities[i] *= -1
      if (Math.abs(positions[i + 1]) > 25) velocities[i + 1] *= -1
      if (Math.abs(positions[i + 2]) > 25) velocities[i + 2] *= -1
    }

    particles.geometry.attributes.position.needsUpdate = true

    // 更新粒子连线
    updateParticleLines(positions, linePositions, particleCount)

    // 更新几何体动画
    geometries.forEach((mesh, index) => {
      mesh.rotation.x += mesh.userData.rotationSpeed.x
      mesh.rotation.y += mesh.userData.rotationSpeed.y
      mesh.rotation.z += mesh.userData.rotationSpeed.z

      // 浮动效果
      const [x, y, z] = mesh.userData.originalPosition
      mesh.position.y = y + Math.sin(elapsedTime + index) * 0.5
      mesh.position.x = x + Math.cos(elapsedTime * 0.5 + index) * 0.3

      // 脉冲效果
      const scale = 1 + Math.sin(elapsedTime * 2 + index) * 0.1
      mesh.scale.set(scale, scale, scale)
    })

    // 更新点光源位置（跟随鼠标）
    pointLight.position.x = mouseX * 5
    pointLight.position.y = mouseY * 5

    // 相机平滑跟随鼠标
    camera.position.x += (mouseX * 2 - camera.position.x) * 0.05
    camera.position.y += (mouseY * 2 - camera.position.y) * 0.05
    camera.lookAt(scene.position)

    renderer.render(scene, camera)
  }

  // 更新粒子连线
  function updateParticleLines(positions, linePositions, count) {
    const maxDistance = 3
    let lineIndex = 0

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      for (let j = i + 1; j < count && lineIndex < count * 2; j++) {
        const j3 = j * 3
        const dx = positions[i3] - positions[j3]
        const dy = positions[i3 + 1] - positions[j3 + 1]
        const dz = positions[i3 + 2] - positions[j3 + 2]
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)

        if (distance < maxDistance) {
          linePositions[lineIndex * 3] = positions[i3]
          linePositions[lineIndex * 3 + 1] = positions[i3 + 1]
          linePositions[lineIndex * 3 + 2] = positions[i3 + 2]
          lineIndex++
          linePositions[lineIndex * 3] = positions[j3]
          linePositions[lineIndex * 3 + 1] = positions[j3 + 1]
          linePositions[lineIndex * 3 + 2] = positions[j3 + 2]
          lineIndex++
        }
      }
    }

    lineSystem.geometry.setDrawRange(0, lineIndex)
    lineSystem.geometry.attributes.position.needsUpdate = true
  }

  // 创建连线
  const lines = new THREE.LineSegments(lineSystem.geometry, lineMaterial)
  scene.add(lines)

  animate()

  // 处理窗口大小变化
  const handleResize = () => {
    if (!container.value) return
    camera.aspect = container.value.clientWidth / container.value.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(container.value.clientWidth, container.value.clientHeight)
  }

  window.addEventListener('resize', handleResize)

  // 增强鼠标交互
  const handleMouseMove = (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1
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

  geometries.forEach(mesh => {
    mesh.geometry.dispose()
    mesh.material.dispose()
  })
})
</script>

<style scoped>
div {
  pointer-events: none;
}
</style>
