<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
    <!-- 导航栏 -->
    <NavBar />
    
    <!-- 主要内容 -->
    <main>
      <!-- 首页 Hero 区域 -->
      <HeroSection />
      
      <!-- 作品展示 -->
      <ProjectsSection />
      
      <!-- 技术栈展示 -->
      <TechStackSection />
      
      <!-- WebAssembly 演示 -->
      <WasmDemoSection />
      
      <!-- 联系信息 -->
      <ContactSection />
    </main>
    
    <!-- 页脚 -->
    <Footer />
  </div>
</template>

<script setup>
import NavBar from './components/NavBar.vue'
import HeroSection from './components/HeroSection.vue'
import ProjectsSection from './components/ProjectsSection.vue'
import TechStackSection from './components/TechStackSection.vue'
import WasmDemoSection from './components/WasmDemoSection.vue'
import ContactSection from './components/ContactSection.vue'
import Footer from './components/Footer.vue'
</script>

