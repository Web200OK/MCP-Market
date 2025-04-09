<template>
  <div class="permission-container" v-loading="loading">
    <div class="permission-layout">
      <!-- 左侧客户端列表 -->
      <div class="client-list">
        <h3>服务器权限设置</h3>
        <el-menu 
          :default-active="activeClient" 
          @select="handleClientSelect"
        >
          <el-menu-item index="global">全局权限</el-menu-item>
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
            :key="server.id" 
            class="server-item"
          >
            <div class="server-info">
              <span>{{ server.name }}</span>
              <el-tag size="small" type="info">{{ server.version }}</el-tag>
            </div>
            <el-switch 
              v-model="server.enabled" 
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
import { getInstalledMCPList, getClientList } from '@/api/mcp'
import { ElMessage } from 'element-plus'

// 客户端列表数据
const clientList = ref([])

// 获取客户端列表
const fetchClientList = async () => {
  try {
    const res = await getClientList()
    clientList.value = Array.isArray(res) ? res : []
  } catch (error) {
    console.error('获取客户端列表失败:', error)
    ElMessage.error('获取客户端列表失败，请稍后重试')
  }
}

// 服务器列表数据
const serverList = ref([])
const loading = ref(false)
const permissionsMap = ref({}) // 存储各客户端的权限状态

// 获取已安装服务器列表
onMounted(async () => {
  loading.value = true
  try {
    await fetchClientList()
    const res = await getInstalledMCPList()
    serverList.value = res.servers.map(item => ({
      ...item,
      enabled: true,
      clientId: item.clientId || 'global'
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
const activeClient = ref('global')

// 处理客户端选择
const handleClientSelect = (index) => {
  activeClient.value = index
  // 根据选中的客户端过滤显示对应的服务器列表
  if (index === 'global') {
    serverList.value.forEach(server => {
      server.enabled = permissionsMap.value.global[server.id] ?? true
    })
  } else {
    serverList.value.forEach(server => {
      server.enabled = permissionsMap.value[index][server.id] ?? (server.clientId === index)
    })
  }
}

// 处理权限变更
const handlePermissionChange = (server) => {
  // 保存当前客户端的权限设置
  if (activeClient.value === 'global') {
    permissionsMap.value.global[server.id] = server.enabled
  } else {
    permissionsMap.value[activeClient.value][server.id] = server.enabled
  }
  console.log(`服务器 ${server.name} 权限已${server.enabled ? '启用' : '禁用'}`)
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
  background: #f8f8f8;
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