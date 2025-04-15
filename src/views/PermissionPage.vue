<template>
  <div class="permission-container" v-loading="loading">
    <div class="permission-layout">
      <!-- 左侧客户端列表 -->
      <div class="client-list">
        <h3>Client权限设置</h3>
        <div class="client-cards">
          <div 
            v-for="client in clientList" 
            :key="client.id" 
            :class="['client-card', { active: activeClient === client.id }]"
            @click="handleClientSelect(client.id)"
          >
            <div class="client-content">
              <span class="client-name">{{ client.name || '全局' }}</span>
              <el-icon 
                v-if="client.id !== -1"
                class="delete-icon"
                @click.stop="handleDeleteClient(client.id)"
              >
                <Close />
              </el-icon>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧服务器权限设置 -->
      <div class="server-permission">
        <h3>服务器权限</h3>
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
import { getClientList, getInstalledMCPByClient, updateServerPermission, deleteClient } from '@/api/mcp'
import { ElMessage, ElMessageBox } from 'element-plus'

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
  try {
    const res = await updateServerPermission({
      proxyId: activeClient.value,
      key: server.key,
      status: server.status
    })
    if (res.success) {
      ElMessage.success('权限更新成功')
    } else {
      ElMessage.error(res.message || '权限更新失败')
    }
  } catch (error) {
    console.error('更新权限失败:', error)
    ElMessage.error('更新权限失败，请稍后重试')
  }
}

// 处理删除客户端
const handleDeleteClient = async (clientId) => {
    await ElMessageBox.confirm('确定要删除此客户端吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
  try {
    loading.value = true
    const res = await deleteClient(clientId)
    if (res === 1) {
      ElMessage.success(res.message || '客户端删除成功')
      await fetchClientList()
      // 处理删除后的状态
      if (clientList.value.length === 0) {
        activeClient.value = ''
        serverList.value = []
      } else if (activeClient.value === clientId) {
        // 如果删除的是当前选中的客户端，重置选中状态并更新服务器列表
        activeClient.value = clientList.value[0].id
        const serverRes = await getInstalledMCPByClient(activeClient.value)
        serverList.value = serverRes.map(item => ({
          key: item.key,
          name: item.name,
          status: item.status,
        }))
      }
    } 
  } catch (error) {
    console.error('删除客户端失败:', error)
    ElMessage.error('删除客户端失败，请稍后重试')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.permission-container {
  padding: 20px;
}

.permission-layout {
  display: flex;
  gap: 20px;
  height: calc(100vh - 120px);
}

.client-list {
  width: 300px;
}

.client-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.client-card {
  padding: 16px;
  border-radius: 12px;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
  cursor: pointer;
}

.client-card:hover {
  background: rgba(0, 122, 255, 0.05);
  border-color: rgba(0, 122, 255, 0.2);
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.1);
}

.delete-icon {
  display: none;
  color: #f56c6c;
  cursor: pointer;
}

.client-card:hover .delete-icon {
  display: block;
}

.client-card.active {
  background: rgba(0, 122, 255, 0.1);
  border-color: rgba(0, 122, 255, 0.3);
}

.client-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.client-name {
  font-size: 14px;
  font-weight: 500;
}

.server-permission {
  flex: 1;
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
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.server-item:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.server-info {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>