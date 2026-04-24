import { ViteSSG } from 'vite-ssg'
import App from './App.vue'
import { routes } from './router'
import './styles/main.css'
import './styles/calculator.css'

export const createApp = ViteSSG(
  App,
  {
    routes,
    base: '/',
    scrollBehavior(to, from, savedPosition) {
      if (savedPosition) return savedPosition
      if (to.hash) return { el: to.hash, behavior: 'smooth' }
      return { top: 0, left: 0, behavior: 'instant' }
    }
  },
  ({ app, isClient }) => {
    // Client-only initialization handled in App.vue onMounted
  }
)
