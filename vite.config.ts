import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteMockServe } from 'vite-plugin-mock'
import path from 'path'

export default defineConfig({
  base:'/mcp-market/',
  plugins: [
    vue(),
    viteMockServe({
      mockPath: 'src/mock',
      enable: true
    })
  ],
  server: {
    proxy: {
      '/mcpserver': {
        target: 'https://15d9224bc8032cf7c07d7bdf88df2a37.serveo.net',
        changeOrigin: true,
        secure: false,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      },
      '/clientmanager': {
        target: 'https://15d9224bc8032cf7c07d7bdf88df2a37.serveo.net',
        changeOrigin: true,
        secure: false,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      },
      '/mcp': {
        target: 'https://cb6c7bf1ca0fe38d0aef8251f89c3dd0.serveo.net',
        changeOrigin: true,
        secure: false,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
