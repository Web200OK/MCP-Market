<template>
  <!-- 固定顶部导航栏 -->
  <header class="market-header fixed-header">
    <div class="header-container">
      <div class="logo">MCP Market</div>
      
      <nav class="main-nav">
        <router-link
          v-for="item in mainNavItems"
          :key="item.route"
          :to="item.route"
          custom
          v-slot="{ navigate, isActive }"
        >
          <div
            class="nav-item"
            :class="{ active: isActive }"
            @click="navigate"
          >
            {{ item.name }}
          </div>
        </router-link>
      </nav>

      <div class="header-right">
        <el-button type="primary" size="small">登录</el-button>
      </div>
    </div>

  <div class="search-section" v-if="isHomePage">
    <h1 class="search-title">
      探索 <span class="highlight">MCP Server</span>
    </h1>
    <div class="search-container">
      <el-input
        v-model="searchQuery"
        placeholder="你正在寻找什么？"
        clearable
        @change="handleSearch"
        class="search-input"
      >
        <template #prefix>
          <el-icon><search /></el-icon>
        </template>
      </el-input>
    </div>
  </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isHomePage = computed(() => route.path === '/')

// 导航数据
const mainNavItems = ref([
  { name: '首页', route: '/' },
  { name: '调试', route: '/debug' }, 
  { name: '提交', route: '/submit' },
  { name: '应用程序API', route: '/api' }
])

// 搜索和过滤
const searchQuery = ref('')

const handleSearch = () => {
  // 搜索逻辑由各页面自行实现
  emit('search', searchQuery.value)
}
</script>

<style scoped lang="scss">
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
</style>
