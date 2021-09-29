import * as path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
	build: {
    lib: {
      entry: path.resolve(__dirname, 'src/Modalis.ts'),
      name: 'Modalis'
    },
    rollupOptions: {
      external: ['vue', 'tiny-emitter'],
      output: {
        globals: {
          vue: 'Vue',
          'tiny-emitter': 'TinyEmitter'
        }
      }
    }
  }
})
