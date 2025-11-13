import { ref, onMounted, onUnmounted } from 'vue'

export function useScrollAnimation() {
  const isVisible = ref(false)
  const elementRef = ref(null)

  const checkVisibility = () => {
    if (!elementRef.value) return

    const rect = elementRef.value.getBoundingClientRect()
    const windowHeight = window.innerHeight || document.documentElement.clientHeight
    
    // 当元素进入视口时触发
    if (rect.top < windowHeight * 0.8 && rect.bottom > 0) {
      isVisible.value = true
    }
  }

  onMounted(() => {
    checkVisibility()
    window.addEventListener('scroll', checkVisibility, { passive: true })
    window.addEventListener('resize', checkVisibility, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', checkVisibility)
    window.removeEventListener('resize', checkVisibility)
  })

  return { isVisible, elementRef }
}

export function useParallax(speed = 0.5) {
  const offset = ref(0)

  const updateParallax = () => {
    offset.value = window.pageYOffset * speed
  }

  onMounted(() => {
    window.addEventListener('scroll', updateParallax, { passive: true })
    updateParallax()
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', updateParallax)
  })

  return { offset }
}

