import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host:'0.0.0.0'
  },
  // 添加路径别名配置
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  // 确保静态资源服务配置正确
  publicDir: 'public',
})
