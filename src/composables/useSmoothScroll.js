export function useSmoothScroll() {
  const scrollTo = (target, duration = 800) => {
    const targetElement = typeof target === 'string' 
      ? document.querySelector(target) 
      : target

    if (!targetElement) return

    const start = window.pageYOffset
    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset
    const distance = targetPosition - start
    let startTime = null

    const easeInOutCubic = (t) => {
      return t < 0.5 
        ? 4 * t * t * t 
        : 1 - Math.pow(-2 * t + 2, 3) / 2
    }

    const animation = (currentTime) => {
      if (startTime === null) startTime = currentTime
      const timeElapsed = currentTime - startTime
      const progress = Math.min(timeElapsed / duration, 1)
      
      window.scrollTo(0, start + distance * easeInOutCubic(progress))

      if (progress < 1) {
        requestAnimationFrame(animation)
      }
    }

    requestAnimationFrame(animation)
  }

  return { scrollTo }
}

