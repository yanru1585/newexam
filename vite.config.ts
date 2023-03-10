import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'


export default defineConfig({
  plugins: [vue()],
  base: './',
  build:{
  minify: 'terser',
  terserOptions: {
   compress: {
     //生产环境时移除console.log()
     drop_console: true,
     drop_debugger: true,
   },
   }
  }
})
