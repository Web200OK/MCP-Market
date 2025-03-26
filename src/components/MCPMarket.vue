<template>
  <div class="market-container">

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
              >
                {{ service.isDownload ? '已安装' : '安装' }}
              </el-button>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import { getMCPList } from '@/api/mcp'

const route = useRoute()
const router = useRouter()

// 导航数据
const mainNavItems = ref([
  { name: '首页', route: '/' },
  { name: '调试', route: '/debug' }, 
  { name: '提交', route: '/submit' },
  { name: '应用程序API', route: '/api' }
])

// 搜索和过滤
const searchQuery = ref('')

// 分类数据
const categories = ref([
  '本地MCP Server',
  '远程MCP Server',
  '浏览器自动化',
  '数据库管理',
  '文件系统',
  '开发者工具',
  '搜索与知识管理'
])
const activeCategory = ref('')

// 服务数据
const services = ref([])
const loading = ref(false)
const error = ref(null)

const fetchServices = async (category = '', search = '') => {
  try {
    loading.value = true
    const { data: response } = await getMCPList({ 
      category,
      search 
    })
    services.value = response.data.map(item => ({
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
    error.value = err
    console.error('Failed to fetch MCP list:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchServices()
})

async function filterByCategory(category) {
  activeCategory.value = activeCategory.value === category ? '' : category
  await fetchServices(activeCategory.value, searchQuery.value)
}

async function handleSearch() {
  await fetchServices(activeCategory.value, searchQuery.value)
}
</script>

<style scoped lang="scss">
.market-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #F8F9FA;
}

.market-header {
  background: #FFFFFF;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  
  &.fixed-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
  }

  .header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 24px;
    height: 60px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);

    .logo {
      font-size: 20px;
      font-weight: bold;
      color: #1A73E8;
    }

    .main-nav {
      display: flex;
      gap: 30px;

      .nav-item {
        padding: 0 10px;
        cursor: pointer;
        height: 60px;
        line-height: 60px;
        transition: all 0.3s;

        &:hover {
          color: #1A73E8;
        }

        &.active {
          color: #1A73E8;
          border-bottom: 3px solid #1A73E8;
        }
      }
    }
  }

  .search-section {
    padding: 30px 24px;
    text-align: center;

    .search-title {
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 20px;
      color: #333;

      .highlight {
        color: #E60012;
      }
    }

    .search-container {
      display: flex;
      justify-content: center;
      margin-bottom: 20px;

      .search-input {
        width: 600px;
      }
    }
  }
}

  .market-main {
    display: flex;
    flex: 1;
    overflow: hidden;

    &.with-header {
      margin-top: 220px; /* 增加顶部间距 */
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
    overflow-y: auto;
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
