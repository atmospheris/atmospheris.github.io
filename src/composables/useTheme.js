import { ref, watch } from 'vue'

const STORAGE_KEY = 'atmospheris-theme'
const isClient = typeof window !== 'undefined'

const theme = ref(isClient
  ? (localStorage.getItem(STORAGE_KEY) || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'))
  : 'light'
)

if (isClient) {
  document.documentElement.setAttribute('data-theme', theme.value)
}

export function useTheme() {
  function toggle() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    if (isClient) {
      document.documentElement.setAttribute('data-theme', theme.value)
      localStorage.setItem(STORAGE_KEY, theme.value)
    }
  }

  function set(t) {
    theme.value = t
    if (isClient) {
      document.documentElement.setAttribute('data-theme', t)
      localStorage.setItem(STORAGE_KEY, t)
    }
  }

  const isDark = ref(theme.value === 'dark')
  watch(theme, (val) => {
    isDark.value = val === 'dark'
  })

  return { theme, isDark, toggle, set }
}
