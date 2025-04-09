<template>
  <div class="permission-container">
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
              <span>{{ server.version }}</span>
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
import { ref } from 'vue'

// 客户端列表数据
const clientList = ref([
  { id: 'mcp-web', name: 'MCP Web客户端' },
  { id: 'mcp-mobile', name: 'MCP移动端' },
  { id: 'mcp-desktop', name: 'MCP桌面版' },
  { id: 'mcp-terminal', name: 'MCP终端版' },
  { id: 'mcp-embedded', name: 'MCP嵌入式版' }
])

// 服务器列表数据
const serverList = ref([
  { id: 'server1', name: 'MCP Server 1', version: '1.0.0', enabled: true },
  { id: 'server2', name: 'MCP Server 2', version: '1.2.0', enabled: false }
])

// 当前选中的客户端
const activeClient = ref('global')

// 处理客户端选择
const handleClientSelect = (index) => {
  activeClient.value = index
  // TODO: 根据选中的客户端加载对应的服务器列表
}

// 处理权限变更
const handlePermissionChange = (server) => {
  // TODO: 保存权限设置
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
  width: 200px;
  border-right: 1px solid #eee;
  padding-right: 20px;
}

.server-permission {
  flex: 1;
  padding-left: 20px;
}

.server-list {
  margin-top: 20px;
}

.server-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.server-info {
  display: flex;
  flex-direction: column;
}
</style>