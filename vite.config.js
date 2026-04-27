import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      'atmospheris': process.env.ATMOSPHERIS_PATH
        ? resolve(process.env.ATMOSPHERIS_PATH)
        : resolve(__dirname, '../atmospheris-js/dist/index.js')
    }
  },
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'three': ['three'],
          'chart': ['chart.js']
        }
      }
    }
  },
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
    includedRoutes() {
      return ['/', '/calculator', '/calculator/explorer', '/calculator/wind', '/calculator/table', '/calculator/charts', '/library', '/api', '/api/js', '/api/ruby', '/iso-2533', '/iso-5878', '/references', '/symbols', '/about']
    },
    crittersOptions: {
      reduceInlineStyles: false
    }
  },
  optimizeDeps: {
    include: ['vue', 'vue-router', '@unhead/vue']
  },
  ssr: {
    noExternal: ['three', 'chart.js']
  }
})
