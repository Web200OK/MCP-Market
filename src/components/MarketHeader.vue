<!-- 市场头部组件模板 -->
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
        <el-button 
          v-if="!isAuthenticated"
          type="primary" 
          size="small"
          @click="showLoginDialog = true"
        >
          登录
        </el-button>
        <el-dropdown v-else>
          <span class="user-avatar">
            <el-avatar :size="32" :src="userAvatar" />
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>个人中心</el-dropdown-item>
              <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>

      <el-dialog
        v-model="showLoginDialog"
        title="登录"
        width="400px"
      >
        <el-form 
          :model="loginForm"
          label-width="80px"
          label-position="right"
        >
          <el-form-item label="用户名">
            <el-input v-model="loginForm.username" style="width: 240px" />
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="loginForm.password" type="password" style="width: 240px" />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="showLoginDialog = false">取消</el-button>
          <el-button type="primary" @click="handleLogin">登录</el-button>
        </template>
      </el-dialog>
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
import { useStore } from 'vuex'
// 定义组件事件
const emit = defineEmits(['search']) // 搜索事件

// 路由和状态管理
const route = useRoute() // 路由实例
const store = useStore() // Vuex存储
const isHomePage = computed(() => route.path === '/') // 是否在首页
const isAuthenticated = computed(() => store.state.isAuthenticated) // 是否已认证

// 登录相关状态
const showLoginDialog = ref(false) // 是否显示登录对话框
const loginForm = ref({ // 登录表单数据
  username: '',
  password: ''
})

const userAvatar = ref('https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png')

const handleLogin = () => {
  // TODO: 实际登录逻辑
  store.dispatch('login')
  showLoginDialog.value = false
}

const handleLogout = () => {
  store.dispatch('logout')
}

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
