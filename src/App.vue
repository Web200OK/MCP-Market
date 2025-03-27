<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import MarketHeader from '@/components/MarketHeader.vue'

declare global {
  interface DocumentEventMap {
    'mcp-search': CustomEvent<string>
  }
}

const route = useRoute()

const handleSearch = (query: string) => {
  // 将搜索查询传递给当前路由组件
  if (route.path === '/') {
    // 如果是首页，触发MCPMarket组件的搜索
    document.dispatchEvent(new CustomEvent('mcp-search', { detail: query }))
  }
}
</script>

<template>
  <div class="app-container">
    <MarketHeader @search="handleSearch" />
    <main class="app-content">
      <RouterView @search="handleSearch" />
    </main>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.app-content {
  flex: 1;
  padding-top: 60px; /* 仅匹配导航栏高度 */
}
</style>
