import { onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'

export function useScrollAnimation() {
  let observer = null
  const route = useRoute()

  function createObserver() {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = entry.target.dataset.stagger || 0
            if (delay > 0) {
              setTimeout(() => entry.target.classList.add('visible'), delay)
            } else {
              entry.target.classList.add('visible')
            }
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
  }

  function observeElements() {
    if (!observer) return
    document.querySelectorAll('.animate-on-scroll').forEach((el, index) => {
      el.classList.remove('visible')
      if (!el.dataset.stagger) {
        el.dataset.stagger = index * 80
      }
      observer.observe(el)
    })
  }

  onMounted(() => {
    createObserver()
    observeElements()
  })

  // Re-observe on route change (for SSG/client navigation)
  watch(() => route.path, () => {
    nextTick(() => {
      if (observer) observer.disconnect()
      createObserver()
      observeElements()
    })
  })

  onUnmounted(() => {
    if (observer) observer.disconnect()
  })
}
