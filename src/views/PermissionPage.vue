<template>
  <div class="permission-container" v-loading="loading">
    <div class="permission-layout">
      <!-- 左侧客户端列表 -->
      <div class="client-list">
        <h3>Client权限设置</h3>
        <el-menu 
          :default-active="activeClient" 
          @select="handleClientSelect"
        >
          <el-menu-item 
            v-for="client in clientList" 
            :key="client.id" 
            :index="client.id"
          >
            {{ client.name }}
          </el-menu-item>
        </el-menu>
      </div>

      <!-- 右侧服务器权限设置 -->
      <div class="server-permission">
        <h3>已安装服务器</h3>
        <div class="server-list">
          <div 
            v-for="server in serverList" 
            :key="server.key" 
            class="server-item"
          >
            <div class="server-info">
              <span>{{ server.name }}</span>
            </div>
            <el-switch 
              v-model="server.status" 
              @change="handlePermissionChange(server)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted  } from 'vue'
import { getClientList, getInstalledMCPByClient, updateServerPermission } from '@/api/mcp'
import { ElMessage } from 'element-plus'

// 客户端列表数据
const clientList = ref([])

// 获取客户端列表
const fetchClientList = async () => {
  try {
    const res = await getClientList()
    clientList.value = Array.isArray(res) ? res : []
    // 设置第一个客户端为默认选中
    if (clientList.value.length > 0) {
      activeClient.value = clientList.value[0].id
    }
  } catch (error) {
    console.error('获取客户端列表失败:', error)
    ElMessage.error('获取客户端列表失败，请稍后重试')
  }
}

// 服务器列表数据
const serverList = ref([])
const loading = ref(false)
const permissionsMap = ref({}) // 存储各客户端的权限状态

onMounted(async () => {
  loading.value = true
  try {
    await fetchClientList()
    const res = await getInstalledMCPByClient(activeClient.value)
    serverList.value = res.map(item => ({
      key: item.key,
      name: item.name,
      status: item.status,
    }))
    // 初始化权限映射
    permissionsMap.value.global = {}
    clientList.value.forEach(client => {
      permissionsMap.value[client.id] = {}
    })
  } catch (error) {
    console.error('获取已安装服务器列表失败:', error)
    ElMessage.error('获取服务器列表失败，请稍后重试')
  } finally {
    loading.value = false
  }
})

// 当前选中的客户端
const activeClient = ref('')

// 处理客户端选择
const handleClientSelect = async (index) => {
  activeClient.value = index
  loading.value = true
  try {
    const res = await getInstalledMCPByClient(index)
    serverList.value = res.map(item => ({
      key: item.key,
      name: item.name,
      status: item.status,
    }))
  } catch (error) {
    console.error('获取服务器列表失败:', error)
    ElMessage.error('获取服务器列表失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 处理权限变更
const handlePermissionChange = async (server) => {
  
}
</script>

<style scoped>
.permission-container {
  padding: 20px;
}

.permission-layout {
  display: flex;
  height: calc(100vh - 120px);
}

.client-list {
  width: 280px;
  border-right: 1px solid #eee;
  padding-right: 20px;
  min-height: 100%;
}

.server-permission {
  flex: 1;
  padding-left: 30px;
  padding-right: 30px;
  padding: 20px;
  border-radius: 16px 0 0 16px;
}

.server-list {
  margin-top: 20px;
}

.server-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  margin-bottom: 12px;
  border-radius: 12px;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.server-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.server-info {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>