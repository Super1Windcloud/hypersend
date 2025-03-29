import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        '@main': resolve('./src/main'),
        '@': resolve('./src')
      }
    },
    build: {
      outDir: 'dist/main'
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        '@preload': resolve('./src/preload'),
        '@': resolve('./src')
      }
    },
    build: {
      outDir: 'dist/preload'

    }
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('./src/renderer/src'),
        '@': resolve('./src')
      }
    },
    plugins: [react()]
    , build: {
      outDir: 'dist/renderer'
    }
  }

})
