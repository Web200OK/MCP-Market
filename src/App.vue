<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import MarketHeader from '@/components/MarketHeader.vue'
import { ElMessage } from 'element-plus'
import { onMounted, onUnmounted, ref } from "vue"

declare global {
  interface DocumentEventMap {
    'mcp-search': CustomEvent<string>
  }
}

const route = useRoute()

const sseData = ref<any>(null)
const eventSource = ref<EventSource | null>(null)

const handleSearch = (query: string) => {
  // 将搜索查询传递给当前路由组件
  if (route.path === '/') {
    // 如果是首页，触发MCPMarket组件的搜索
    document.dispatchEvent(new CustomEvent('mcp-search', { detail: query }))
  }
}

const initSSE = () => {
  eventSource.value = new EventSource('/mcpserver/webEvent')
  
  eventSource.value.onmessage = (event: any) => {
    const data = JSON.parse(event.data)
    sseData.value = data
    
    switch(data.type) {
      case 'info':
        ElMessage({
          message: `${data.title}: ${data.message}`,
          type: 'info'
        })
        break
      case 'warn':
        ElMessage({
          message: `${data.title}: ${data.message}`,
          type: 'warning'
        })
        break
      case 'error':
        ElMessage({
          message: `${data.title}: ${data.message}`,
          type: 'error'
        })
        break
      default:
        ElMessage.success('收到后端推送数据')
    }
  }
  
  eventSource.value.onerror = () => {
    ElMessage.error('SSE连接错误')
    eventSource.value?.close()
  }
}

onMounted(() => {
  initSSE()
})

onUnmounted(() => {
  eventSource.value?.close()
})
</script>

<template>
  <div class="app-container">
    <MarketHeader @search="handleSearch" />
    <main class="app-content">
      <router-view v-slot="{ Component }">
        <keep-alive :include="['DebugPage', 'APIPage', 'SubmitPage', 'PermissionPage', 'MCPMarket']">
          <component :is="Component" @search="handleSearch" />
        </keep-alive>
      </router-view>
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
