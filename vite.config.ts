import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0',
    // 添加代理配置（使用 Vite 的标准语法）
    proxy: {
      '/api': {
        target: 'http://localhost:8000', // 你的 Django 后端地址
        changeOrigin: true,
        secure: false,
        // 如果需要，可以配置重写规则
        // rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
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
