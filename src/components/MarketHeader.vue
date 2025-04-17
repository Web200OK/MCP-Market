<!-- 市场头部组件模板 -->
<template>
  <!-- 固定顶部导航栏 -->
  <header class="market-header fixed-header">
    <div class="header-container">
      <div class="logo">MCP Market</div>

      <nav class="main-nav">
        <router-link v-for="item in mainNavItems" :key="item.route" :to="item.route" custom
          v-slot="{ navigate, isActive }">
          <div class="nav-item" :class="{ active: isActive }" @click="navigate">
            {{ item.name }}
          </div>
        </router-link>
      </nav>

      <div class="header-right">
        <div ref="darkSwitchRef" class="app-dark-switch">
          <el-switch
            :active-action-icon="MoonOutlined"
            :inactive-action-icon="SunOutlined"
            :model-value="darkMode"
            @update:modelValue="updateDarkMode"
          />
        </div>
        <el-button v-if="!isAuthenticated" type="primary" size="small" @click="showLoginDialog = true">
          登录
        </el-button>
        <el-dropdown v-else>
          <span class="user-avatar">
            <el-avatar :size="32" :src="userAvatar" />
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleShowConfig">程序配置</el-dropdown-item>
              <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>

      <el-dialog v-model="showLoginDialog" title="登录" width="400px">
        <el-form :model="loginForm" label-width="80px" label-position="right">
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

      <el-dialog v-model="showConfigDialog" title="程序配置" width="600px">
        <el-alert title="配置说明" type="info" description="请配置以下程序路径，这些路径将用于MCP Server安装时匹配对应的程序。" show-icon
          style="margin-bottom: 20px" />
        <el-form :model="envInfo" label-width="120px" label-position="right">
          <el-form-item v-for="(item, key) in envInfo" :key="key" :label="key">
            <el-input v-model="item.command" placeholder='C:\\Program Files\\xxx\\xxx.exe' style="width: 300px" />
            <el-button 
              type="danger" 
              circle 
              @click="handleRemovePath(key)"
              style="margin-left: 10px"
            >
              <el-icon><Delete /></el-icon>
            </el-button>
          </el-form-item>
          <div style="margin-bottom: 20px; text-align: left">
            <el-button v-if="!nodeInstalled" type="primary" @click="downloadProgram('node')" style="margin-right: 20px"
              :disabled="nodeInstalled">
              下载Node.js
            </el-button>
            <el-button v-if="!pythonInstalled" type="primary" @click="downloadProgram('python')"
              :disabled="pythonInstalled">
              下载Python
            </el-button>
            <el-button type="primary" @click="addCustomPath" style="margin-left: 20px">
              新增程序路径
            </el-button>
            <el-dialog v-model="showCustomPathDialog" title="新增程序路径" width="500px">
              <el-form :model="customPathForm" label-width="100px">
                <el-form-item label="程序名称">
                  <el-input v-model="customPathForm.name" placeholder="请输入程序名称" />
                </el-form-item>
                <el-form-item label="程序路径">
                  <el-input v-model="customPathForm.path" placeholder="请输入程序路径" />
                </el-form-item>
              </el-form>
              <template #footer>
                <el-button @click="showCustomPathDialog = false">取消</el-button>
                <el-button type="primary" @click="handleAddCustomPath">确认</el-button>
              </template>
            </el-dialog>
          </div>
        </el-form>
        <template #footer>
          <el-button @click="showConfigDialog = false">取消</el-button>
          <el-button type="primary" @click="handleSaveConfig">保存</el-button>
        </template>
      </el-dialog>
    </div>

    <div class="search-section" v-if="isHomePage">
      <h1 class="search-title">
        探索 <span class="highlight">MCP Server</span>
      </h1>
      <div class="search-container">
        <el-input v-model="searchQuery" placeholder="请输入搜索关键词" clearable @keyup.enter="handleSearch"
          class="search-input" style="border-color: #999">
          <template #prefix>
            <el-icon>
              <search />
            </el-icon>
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
import { ElMessage, ElLoading } from 'element-plus'
import { nodeInstall, pythonInstall, listLocalEnv, saveLocalEnvConfig, checkNodeInstalled, checkPythonInstalled } from '@/api/mcp'

import MoonOutlined from './MoonOutlined.vue';
import SunOutlined from './SunOutlined.vue';

// 定义组件事件
const emit = defineEmits(['search']) // 搜索事件

// 路由和状态管理
const route = useRoute() // 路由实例
const store = useStore() // Vuex存储
const isHomePage = computed(() => route.path === '/') // 是否在首页
const isAuthenticated = computed(() => store.state.isAuthenticated) // 是否已认证

// 登录相关状态
const showLoginDialog = ref(false) // 是否显示登录对话框
const showConfigDialog = ref(false) // 是否显示配置对话框
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

const handleSaveConfig = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: '正在保存配置...',
    background: 'rgba(0, 0, 0, 0.7)'
  })

  try {
    const data = await saveLocalEnvConfig(envInfo.value)

    if (data.success) {
      ElMessage.success('保存成功')
    } else {
      throw new Error(data.message || '保存失败')
    }

    showConfigDialog.value = false
  } catch (err) {
    ElMessage.error(`保存失败: ${err.message}`)
  } finally {
    loading.close()
  }
}

const downloadProgram = async (type) => {
  try {
    const loading = ElLoading.service({
      lock: true,
      text: '正在下载并安装程序...',
      background: 'rgba(0, 0, 0, 0.7)'
    })

    let success = false
    switch (type) {
      case 'node':
        success = await nodeInstall()
        break
      case 'python':
        success = await pythonInstall()
        break
    }

    if (!success) {
      throw new Error(`${type}安装失败`)
    }

    loading.close()
    ElMessage.success(`${type}程序下载并安装成功！`)
  } catch (err) {
    loading.close()
    ElMessage.error(`下载失败: ${err.message}`)
  }
}

const envInfo = ref({})

const nodeInstalled = ref(false)
const pythonInstalled = ref(false)

const showCustomPathDialog = ref(false)
const customPathForm = ref({
  name: '',
  path: ''
})

const addCustomPath = () => {
  showCustomPathDialog.value = true
}

const handleAddCustomPath = () => {
  const newKey = customPathForm.value.name || `自定义路径${Object.keys(envInfo.value).length + 1}`
  envInfo.value[newKey] = {
    command: customPathForm.value.path,
    env: {},
    originCommand: newKey
  }
  customPathForm.value = { name: '', path: '' }
  showCustomPathDialog.value = false
}

const handleRemovePath = (key) => {
  delete envInfo.value[key]
}

const handleShowConfig = async () => {
  showConfigDialog.value = true
  const loading = ElLoading.service({
    lock: true,
    text: '正在获取环境信息...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  try {
    const [envData, nodeStatus, pythonStatus] = await Promise.all([
      listLocalEnv(),
      checkNodeInstalled(),
      checkPythonInstalled()
    ])
    envInfo.value = envData.envInfo
    nodeInstalled.value = nodeStatus
    pythonInstalled.value = pythonStatus
    loading.close()
  } catch (err) {
    console.error('获取环境信息失败:', err)
    loading.close()
  }
}

// 导航数据
const mainNavItems = ref([
  { name: '首页', route: '/' },
  { name: '调试', route: '/debug' },
  // { name: '提交', route: '/submit' },
  // { name: '应用程序API', route: '/api' },
  { name: '权限', route: '/permission' }
])

// 搜索和过滤
const searchQuery = ref('')

const handleSearch = () => {
  // 搜索逻辑由各页面自行实现
  emit('search', searchQuery.value)
}

const darkMode = ref(false);

const darkSwitchRef = ref();

const changeDarkTheme = (isDark) => {
  const $html = document.documentElement;
  if ($html) {
    if (isDark) {
      $html.classList.add('dark');
    } else {
      $html.classList.remove('dark');
    }
  }
  darkMode.value = isDark;
  const themeItem =  { color: '#2f54eb' }
  changeThemeColor(themeItem);
  cacheTheme(isDark);
};

const themeColor = ref('#2f54eb');
const themeCacheKey = 'themeConfig';

const changeThemeColor = (item) => {
  themeColor.value = item.color;
  const id = 'ele-theme-var';
  const elem = document.getElementById(id);
  if (elem?.parentNode) {
    elem.parentNode.removeChild(elem);
  }
  const colors = darkMode.value ? item.darkColors : item.colors;
  if (colors) {
    const selector = darkMode.value ? 'html.dark' : ':root';
    const elem = document.createElement('style');
    elem.id = id;
    elem.setAttribute('type', 'text/css');
    elem.innerHTML = [
      `${selector}{`,
      `--el-color-primary:${colors[5]};`,
      `--el-color-primary-light-3:${colors[4]};`,
      `--el-color-primary-light-5:${colors[3]};`,
      `--el-color-primary-light-7:${colors[2]};`,
      `--el-color-primary-light-8:${colors[1]};`,
      `--el-color-primary-light-9:${colors[0]};`,
      `--el-color-primary-dark-2:${colors[6]};`,
      '}'
    ].join('');
    document.head.appendChild(elem);
  }
  cacheTheme(void 0, themeColor.value);
};

const updateDarkMode = (isDark) => {
  const el = darkSwitchRef.value?.querySelector?.('.el-switch__action');
  if (!el || typeof document.startViewTransition !== 'function') {
    changeDarkTheme(isDark);
    return;
  }
  const isOut = !isDark;
  document.documentElement.classList.add('disabled-transition');
  el.classList.add('view-transition-trigger');
  el.style.setProperty('view-transition-name', 'view-transition-trigger');
  const rect = el.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  const endRadius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y)
  );
  document
    .startViewTransition(() => changeDarkTheme(isDark))
    .ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`
      ];
      const anim = document.documentElement.animate(
        { clipPath: isOut ? [...clipPath].reverse() : clipPath },
        {
          duration: 400,
          easing: 'ease-in',
          pseudoElement: isOut
            ? `::view-transition-old(root)`
            : `::view-transition-new(root)`
        }
      );
      anim.onfinish = () => {
        el.style.removeProperty('view-transition-name');
        el.classList.remove('view-transition-trigger');
        document.documentElement.classList.remove('disabled-transition');
      };
    });
}

const cacheTheme = (isDark, color) => {
  try {
    const cacheTheme = JSON.parse(
      localStorage.getItem(themeCacheKey) || '{}'
    );
    if (isDark != null) {
      cacheTheme.dark = isDark;
    }
    if (color != null) {
      cacheTheme.color = color;
    }
    localStorage.setItem(themeCacheKey, JSON.stringify(cacheTheme));
  } catch (e) {
    console.error(e);
  }
};

const getCacheThemeColor = (color) => {
  const themeItem = { color: '#2f54eb' };
  return themeItem?.color || themeColors.value[0]?.color;
};

try {
  const cacheTheme = JSON.parse(localStorage.getItem(themeCacheKey) || '{}');
  if (cacheTheme.dark) {
    if (cacheTheme.color) {
      themeColor.value = getCacheThemeColor(cacheTheme.color);
    }
    changeDarkTheme(true);
  } else if (cacheTheme.color) {
    themeColor.value = getCacheThemeColor(cacheTheme.color);
    const themeItem = { color: '#2f54eb' }
    changeThemeColor(themeItem);
  }
} catch (e) {
  console.error(e);
}
</script>

<style scoped lang="scss">
.market-header {
  background: var(--el-bg-color);
  box-shadow: 0 1px 1px #eee;

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
      color: #d33b30;
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
          color: var(--el-color-primary);
        }

        &.active {
          color: var(--el-color-primary);
          border-bottom: 3px solid var(--el-color-primary);
        }
      }
    }

    .header-right {
      display: flex;
      gap: 30px;
      align-items: center;
    }
  }

  .search-section {
    padding: 30px 24px;
    text-align: center;

    .search-title {
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 20px;

      .highlight {
        color: #d33b30;
      }
    }

    .search-container {
      display: flex;
      justify-content: center;
      margin-bottom: 20px;

      .search-input {
        width: 800px;
        height: 50px;
        border-radius: 4px;
      }
    }
  }
}
</style>
