<template>
  <div class="market-container">

    <!-- 搜索区域 -->
    <div class="search-section">
      <h3 class="search-title">搜索MCP服务</h3>
      <div class="search-container">
        <el-input
          v-model="searchQuery"
          placeholder="请输入搜索关键词"
          class="search-input"
          clearable
          @keyup.enter="handleSearch"
        >
          <template #append>
            <el-button 
              :icon="Search" 
              @click="handleSearch"
            />
          </template>
        </el-input>
      </div>
    </div>

    <!-- 主体内容 -->
    <div class="market-main with-header">
      <!-- 分类边栏 -->
      <aside class="category-sidebar">
        <h3 class="sidebar-title">分类</h3>
        <ul class="category-list">
          <li 
            v-for="category in categories"
            :key="category"
            :class="{ active: activeCategory === category }"
            @click="filterByCategory(category)"
          >
            {{ category }}
          </li>
        </ul>
      </aside>

      <!-- 内容区域 -->
      <main class="market-content">
        <div v-if="loading" class="loading">加载中...</div>
        <div v-else-if="error" class="error">{{ error.message }}</div>
        <div v-else class="service-grid">
          <div 
            v-for="service in services" 
            :key="service.id"
            class="service-card"
            @click="goToDetail(service.id)"
          >
            <div v-if="service.type === 'official'" class="card-badge">
              官方
            </div>
            <h3 class="card-title">{{ service.name }}</h3>
            <div class="card-tags">
              <el-tag 
                v-for="(tag, index) in service.tags" 
                :key="index"
                size="small"
              >
                {{ tag }}
              </el-tag>
            </div>
            <p class="card-desc">{{ service.description }}</p>
            <div class="card-footer">
              <div class="card-stats">
                <span>{{ service.stats.downloads }}次下载</span>
                <span>评分: {{ service.stats.rating }}</span>
              </div>
              <el-button 
                size="small" 
                :type="service.isDownload ? 'success' : 'primary'"
                @click.stop="handleInstall(service)"
              >
                {{ service.isDownload ? '已安装' : '点击安装' }}
              </el-button>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
declare global {
  interface DocumentEventMap {
    'mcp-search': CustomEvent<string>
  }
}

import { ref, onMounted, onUnmounted } from 'vue'
const emit = defineEmits(['search'])
const props = defineProps<{
  onSearch?: (query: string) => void
}>()
import { useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { getMCPList } from '@/api/mcp'
import { MCPItem } from '@/mock/index'

interface ServiceItem {
  id: string
  name: string
  type: string
  tags: string[]
  description: string
  stats: {
    downloads: number
    rating: string
  }
  isDownload: boolean
}

const router = useRouter()

// 搜索和过滤
const searchQuery = ref('')

// 分类数据
const categories = ref<string[]>([])
const activeCategory = ref('')

// 服务数据
const services = ref<ServiceItem[]>([])
const loading = ref(false)
const error = ref<Error | null>(null)

const goToDetail = (id: string) => {
  router.push({ name: 'mcp-details', params: { id } })
}

const fetchServices = async (category = '', search = '', signal?: AbortSignal) => {
  try {
    loading.value = true
    const { data: response } = await getMCPList(category, search)
    const data = response.data as MCPItem[]
    
    services.value = data.map(item => ({
      id: item.id.toString(),
      name: item.name,
      type: 'official',
      tags: [`#${item.status}`, `#${item.ip}:${item.port}`, `#${item.category}`],
      description: item.description,
      stats: {
        downloads: Math.floor(Math.random() * 10000),
        rating: (Math.random() * 2 + 3).toFixed(1)
      },
      isDownload: false
    }))
  } catch (err) {
    error.value = err as Error
    console.error('Failed to fetch MCP list:', err)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await fetchServices()
  // 只在初始加载时提取分类
  const { data: response } = await getMCPList()
  const data = response.data as MCPItem[]
  categories.value = [...new Set(data.map(item => item.category))]
  
  // 监听来自App.vue的搜索事件
  function handleExternalSearch(e: Event) {
    const event = e as CustomEvent<string>
    searchQuery.value = event.detail
    handleSearch()
  }
  
  document.addEventListener('mcp-search', handleExternalSearch as EventListener)
  
  // 组件卸载时移除监听器
  onUnmounted(() => {
    document.removeEventListener('mcp-search', handleExternalSearch as EventListener)
  })
})

async function filterByCategory(category: string) {
  activeCategory.value = activeCategory.value === category ? '' : category
  await fetchServices(activeCategory.value, searchQuery.value)
}

function handleInstall(service: ServiceItem) {
  service.isDownload = true
  ElMessage.success(`${service.name} 安装成功`)
}

const isSearching = ref(false)
const abortController = ref<AbortController>()

async function handleSearch() {
  if (isSearching.value) return
  
  isSearching.value = true
  abortController.value?.abort()
  abortController.value = new AbortController()
  
  const query = searchQuery.value.trim()
  
  try {
    await fetchServices(activeCategory.value, query, abortController.value.signal)
    emit('search', query)
    if (props.onSearch) {
      props.onSearch(query)
    }
  } catch (err) {
    if (err instanceof Error ? err.name !== 'AbortError' : false) {
      console.error('搜索请求失败:', err)
      ElMessage.error('搜索失败，请稍后重试')
    }
  } finally {
    isSearching.value = false
  }
}
</script>

<style scoped lang="scss">
.market-container {
  height: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #FFFFFF;
  overflow: hidden;
}

  .market-main {
    display: flex;
    flex: 1;
    overflow: auto;

    &.with-header {
      margin-top: 120px; /* 减少顶部间距 */
    }

  .category-sidebar {
    width: 200px;
    padding: 20px;
    background: #fff;
    border-right: 1px solid #eee;

    .sidebar-title {
      margin: 0 0 15px;
      font-size: 16px;
      color: #333;
    }

    .category-list {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        padding: 8px 12px;
        margin-bottom: 5px;
        cursor: pointer;
        border-radius: 4px;
        transition: all 0.2s;

        &:hover {
          background: #f5f5f5;
        }

        &.active {
          background: #e6f7ff;
          color: #1890ff;
          font-weight: 500;
        }
      }
    }
  }

  .market-content {
    flex: 1;
    padding: 24px 24px 0 24px; /* 调整顶部padding */
    overflow: visible;
    margin-left: 20px;
  }
}

/* 保留原有服务卡片样式 */
.service-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding-bottom: 40px; /* 添加底部padding */
}

.service-card {
  position: relative;
  padding: 20px;
  background: #FFFFFF;
  border-radius: 12px;
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.05),
    0 1px 2px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: 1px solid rgba(0, 0, 0, 0.1);
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 
      0 4px 6px rgba(0, 0, 0, 0.1),
      0 1px 3px rgba(0, 0, 0, 0.08);
    border-color: rgba(0, 0, 0, 0.15);
  }

  .card-badge {
    position: absolute;
    top: 0;
    right: 0;
    padding: 2px 10px;
    background: linear-gradient(135deg, #FF6D00, #FF9100);
    color: white;
    font-size: 12px;
    font-weight: 500;
    border-radius: 0 12px 0 12px;
  }

  .card-title {
    margin: 0 0 12px;
    font-size: 18px;
    font-weight: 600;
  }

  .card-tags {
    margin-bottom: 12px;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .card-desc {
    margin: 0 0 16px;
    font-size: 14px;
    color: #666;
  }

  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
