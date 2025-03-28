<!-- MCP市场页面模板 -->
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
        <div v-if="loading" class="service-grid">
          <div 
            v-for="n in 6" 
            :key="n"
            class="service-card skeleton"
          >
            <div class="skeleton-title"></div>
            <div class="skeleton-tags">
              <div class="skeleton-tag"></div>
              <div class="skeleton-tag"></div>
              <div class="skeleton-tag"></div>
            </div>
            <div class="skeleton-desc"></div>
            <div class="skeleton-footer">
              <div class="skeleton-stats"></div>
              <div class="skeleton-button"></div>
            </div>
          </div>
        </div>
        <div v-else-if="error" class="error">{{ error.message }}</div>
        <div v-else class="service-grid">
          <div 
            v-for="service in services" 
            :key="service.id"
            class="service-card"
            @click="goToDetail(service.id)"
            style="border: 1px solid rgba(0, 122, 255, 0.2); box-shadow: 0 2px 12px 0 rgba(0, 122, 255, 0.1)"
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
              <span>{{ service.downloads }}次下载</span>
              <span>评分: {{ service.rating.toFixed(1) }}</span>
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
// 定义组件事件和属性
const emit = defineEmits(['search']) // 搜索事件
const props = defineProps<{
  onSearch?: (query: string) => void // 搜索回调函数
}>()
import { useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { getMCPList, getCategories } from '@/api/mcp'
import type { MCPItem } from '@/types/mcp'

interface ServiceItem extends Omit<MCPItem, 'id'> {
  id: string
  isDownload: boolean
}

const router = useRouter()

// 搜索和过滤
const searchQuery = ref('') // 搜索关键词

// 分类数据
const categories = ref<string[]>([]) // 分类列表
const activeCategory = ref('') // 当前选中的分类

// 服务数据
const services = ref<ServiceItem[]>([]) // MCP服务列表
const loading = ref(false) // 加载状态
const error = ref<Error | null>(null) // 错误信息

const goToDetail = (id: string) => {
  router.push({ name: 'mcp-details', params: { id } })
}

const fetchServices = async (category = '', search = '', signal?: AbortSignal) => {
  try {
    loading.value = true
    const data = await getMCPList({ category, search })
    
    services.value = data.map(item => ({
      ...item,
      id: item.id.toString(),
      isDownload: false,
      type: item.type || 'official',
      description: item.description || '暂无描述',
      downloads: item.downloads || 0,
      rating: item.rating || 5.0
    }))
  } catch (err) {
    error.value = err as Error
    console.error('Failed to fetch MCP list:', err)
  } finally {
    loading.value = false
  }
}

// 监听来自App.vue的搜索事件
function handleExternalSearch(e: Event) {
  const event = e as CustomEvent<string>
  searchQuery.value = event.detail
  handleSearch()
}

onMounted(async () => {
  await fetchServices()
  // 获取分类列表
  categories.value = await getCategories()
  
  document.addEventListener('mcp-search', handleExternalSearch as EventListener)
})

// 组件卸载时移除监听器
onUnmounted(() => {
  document.removeEventListener('mcp-search', handleExternalSearch as EventListener)
})

async function filterByCategory(category: string) {
  try {
    loading.value = true
    activeCategory.value = activeCategory.value === category ? '' : category
    await fetchServices(activeCategory.value, searchQuery.value)
  } catch (err) {
    console.error('分类过滤失败:', err)
    ElMessage.error('分类过滤失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

function handleInstall(service: ServiceItem) {
  service.isDownload = true
  ElMessage.success(`${service.name} 安装成功`)
}

const isSearching = ref(false)
const abortController = ref<AbortController>()
const searchTimeout = ref<NodeJS.Timeout>()

async function handleSearch() {
  if (isSearching.value) return
  
  // Clear previous timeout if exists
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }

  // Set new timeout for debounce (300ms)
  searchTimeout.value = setTimeout(async () => {
    isSearching.value = true
    abortController.value?.abort()
    abortController.value = new AbortController()
    
    const query = searchQuery.value.trim()
    
    try {
      await fetchServices(activeCategory.value, query, abortController.value.signal)
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
  }, 300)
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
  gap: 24px;
  padding-bottom: 40px;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

.skeleton {
  pointer-events: none;
  
  .skeleton-title {
    height: 24px;
    width: 70%;
    background: #f0f0f0;
    border-radius: 4px;
    margin-bottom: 16px;
    animation: pulse 1.5s ease-in-out infinite;
  }
  
  .skeleton-tags {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
    
    .skeleton-tag {
      height: 24px;
      width: 60px;
      background: #f0f0f0;
      border-radius: 12px;
      animation: pulse 1.5s ease-in-out infinite;
    }
  }
  
  .skeleton-desc {
    height: 60px;
    background: #f0f0f0;
    border-radius: 4px;
    margin-bottom: 20px;
    animation: pulse 1.5s ease-in-out infinite;
  }
  
  .skeleton-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .skeleton-stats {
      height: 16px;
      width: 120px;
      background: #f0f0f0;
      border-radius: 4px;
      animation: pulse 1.5s ease-in-out infinite;
    }
    
    .skeleton-button {
      height: 32px;
      width: 80px;
      background: #f0f0f0;
      border-radius: 8px;
      animation: pulse 1.5s ease-in-out infinite;
    }
  }
}

.service-card {
  position: relative;
  padding: 24px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.05),
    0 1px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  overflow: hidden;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 16px;
    padding: 1px;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.4),
      rgba(255, 255, 255, 0.1)
    );
    -webkit-mask: 
      linear-gradient(#fff 0 0) content-box, 
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 
      0 8px 25px rgba(0, 0, 0, 0.1),
      0 2px 6px rgba(0, 0, 0, 0.05);
  }

  &:active {
    transform: scale(0.98);
  }

  .card-badge {
    position: absolute;
    top: 0;
    right: 0;
    padding: 4px 12px;
    background: linear-gradient(135deg, #007AFF, #34C759);
    color: white;
    font-size: 12px;
    font-weight: 500;
    border-radius: 0 16px 0 16px;
  }

  .card-title {
    margin: 0 0 16px;
    font-size: 20px;
    font-weight: 700;
    color: #1C1C1E;
  }

  .card-tags {
    margin-bottom: 16px;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    .el-tag {
      background: rgba(120, 120, 128, 0.12);
      color: #3A3A3C;
      border: none;
    }
  }

  .card-desc {
    margin: 0 0 20px;
    font-size: 15px;
    line-height: 1.5;
    color: #636366;
  }

  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .card-stats {
      font-size: 13px;
      color: #8E8E93;

      span:first-child {
        margin-right: 12px;
      }
    }

    .el-button {
      border-radius: 8px;
      font-weight: 500;
    }
  }
}
</style>
