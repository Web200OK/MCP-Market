<!-- MCP服务器调试页面模板 -->
<template>
  <div class="debug-page">
    <h2>MCP Server 调试工具</h2>
    <div class="debug-container">
      <!-- 左侧服务器列表 -->
      <div class="server-list">
        <el-card>
          <template #header>
            <div class="card-header">热门MCP服务器</div>
          </template>
          <el-table 
            :data="servers" 
            highlight-current-row
            @current-change="handleServerChange"
          >
            <el-table-column prop="name" label="服务器名称" />
            <el-table-column prop="status" label="状态" width="80">
              <template #default="{row}">
                <el-tag :type="row.status === 'online' ? 'success' : 'danger'">
                  {{ row.status === 'online' ? '在线' : '离线' }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>

      <!-- 右侧调试区域 -->
      <div class="debug-area">
        <el-card>
          <template #header>
            <div class="card-header">
              {{ currentServer ? `${currentServer.name} 调试` : 'MCP Server 概览' }}
            </div>
          </template>
          
          <!-- 服务器概览 -->
          <div class="server-overview">
            <el-descriptions :column="2" border>
              <template v-if="currentServer">
                <el-descriptions-item label="服务器名称">{{ currentServer.name }}</el-descriptions-item>
                <el-descriptions-item label="服务器地址">{{ currentServer.address }}</el-descriptions-item>
                <el-descriptions-item label="版本">{{ currentServer.version }}</el-descriptions-item>
                <el-descriptions-item label="状态">
                  <el-tag :type="currentServer.status === 'online' ? 'success' : 'danger'">
                    {{ currentServer.status === 'online' ? '在线' : '离线' }}
                  </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="描述">{{ currentServer.description }}</el-descriptions-item>
                <el-descriptions-item label="工具数量">{{ currentServer.tools?.length || 0 }}</el-descriptions-item>
              </template>
              <template v-else>
                <el-descriptions-item label="服务器总数">{{ servers.length }}</el-descriptions-item>
                <el-descriptions-item label="在线服务器">
                  {{ servers.filter(s => s.status === 'online').length }}
                </el-descriptions-item>
                <el-descriptions-item label="工具总数">
                  {{ servers.reduce((sum, s) => sum + (s.tools?.length || 0), 0) }}
                </el-descriptions-item>
                <el-descriptions-item label="最后更新时间">
                  {{ new Date().toLocaleString() }}
                </el-descriptions-item>
              </template>
            </el-descriptions>
          </div>

          <!-- 工具列表和调试区 -->
          <div class="tool-debug" v-if="currentServer">
            <div class="connection-status">
              <el-button 
                type="primary" 
                @click="connectServer"
                :loading="isConnecting"
                :disabled="connectionStatus === 'connected'"
              >
                {{ connectionStatus === 'connected' ? '已连接' : isConnecting ? '连接中...' : '连接服务器' }}
              </el-button>
              <el-tag :type="connectionStatus === 'connected' ? 'success' : 'danger'">
                {{ connectionStatus === 'connected' ? '已连接' : connectionStatus === 'connecting' ? '连接中' : '未连接' }}
              </el-tag>
            </div>
            <el-tabs v-model="activeToolTab">
              <el-tab-pane label="工具列表" name="tools" :disabled="connectionStatus !== 'connected'">
                <div v-if="connectionStatus !== 'connected'" class="tab-disabled-hint">
                  <el-empty description="请先连接服务器以查看工具列表" />
                </div>
                <el-table v-else :data="currentServer.tools" @row-click="selectTool">
                  <el-table-column prop="name" label="工具名称" />
                  <el-table-column prop="description" label="描述" />
                </el-table>
              </el-tab-pane>
              
              <el-tab-pane label="调试" name="debug" :disabled="connectionStatus !== 'connected' || !selectedTool">
                <div v-if="connectionStatus !== 'connected'" class="tab-disabled-hint">
                  <el-empty description="请先连接服务器以使用调试功能" />
                </div>
                <div v-if="selectedTool" class="tool-debug-area">
                  <h3>调试工具: {{ selectedTool.name }}</h3>
                  <div class="tool-debug-form">
                    <el-form label-width="120px" label-position="top">
                      <el-form-item 
                        v-for="param in selectedTool.params" 
                        :key="param.name"
                        :label="param.name"
                      >
                        <el-input 
                          v-model="param.value" 
                          :placeholder="`输入${param.name}`"
                          clearable
                        />
                      </el-form-item>
                      <el-form-item>
                        <el-button 
                          type="primary" 
                          @click="executeTool"
                          :loading="isExecuting"
                        >
                          {{ isExecuting ? '执行中...' : '执行' }}
                        </el-button>
                      </el-form-item>
                    </el-form>
                  </div>
                  <el-card v-if="debugResult" class="result-card">
                    <div class="result-header">
                      <span>执行结果</span>
                      <el-button 
                        type="text" 
                        icon="el-icon-document-copy" 
                        @click="copyResult"
                      />
                    </div>
                    <pre v-highlight><code class="language-json">{{ debugResult }}</code></pre>
                  </el-card>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup>
// 导入Vue响应式API
import { ref } from 'vue'

// 导入API方法
import { getMCPList, getMCPTools } from '@/api/mcp'

// 从mock接口获取服务器数据
const servers = ref([])

// 获取服务器列表
const fetchServers = async () => {
  try {
    const data = await getMCPList()
    servers.value = data.map(item => ({
      id: item.id.toString(),
      name: item.name,
      address: '',
      status: 'online',
      version: '',
      description: item.description,
      tools: []
    }))
  } catch (error) {
    console.error('获取服务器列表失败:', error)
  }
}

// 初始化时获取数据
fetchServers()

// 调试页面状态管理
const currentServer = ref(null) // 当前选中的服务器
const selectedTool = ref(null) // 当前选中的工具
const activeToolTab = ref('tools') // 当前激活的标签页
const debugResult = ref(null) // 调试结果
const connectionStatus = ref('disconnected') // 连接状态: disconnected/connecting/connected
const isConnecting = ref(false) // 是否正在连接中

// 处理服务器选择变化
const handleServerChange = async (server) => {
  currentServer.value = server // 更新当前服务器
  selectedTool.value = null // 重置选中工具
  debugResult.value = null // 清空调试结果
  connectionStatus.value = 'disconnected' // 重置连接状态
  
  try {
    // 获取服务器工具列表
    const data = await getMCPTools(server.id)
    currentServer.value.tools = data
  } catch (error) {
    console.error('获取工具列表失败:', error)
    currentServer.value.tools = []
  }
}

// 选择工具方法
const selectTool = (tool) => {
  selectedTool.value = tool // 设置当前工具
  activeToolTab.value = 'debug' // 切换到调试标签页
}

// 执行工具方法
// 连接服务器方法
const connectServer = async () => {
  if (!currentServer.value) return
  
  try {
    isConnecting.value = true
    connectionStatus.value = 'connecting'
    
    // 模拟连接过程
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    connectionStatus.value = 'connected'
  } catch (error) {
    connectionStatus.value = 'disconnected'
    console.error('连接失败:', error)
  } finally {
    isConnecting.value = false
  }
}

const executeTool = () => {
  if (connectionStatus.value !== 'connected') {
    return
  }
  
  // 模拟执行工具
  debugResult.value = JSON.stringify({
    tool: selectedTool.value.name, // 工具名称
    params: selectedTool.value.params.reduce((acc, param) => {
      acc[param.name] = param.value // 收集参数
      return acc
    }, {}),
    result: '执行成功', // 执行结果
    timestamp: new Date().toISOString() // 时间戳
  }, null, 2) // 格式化JSON输出
}

</script>

<style scoped>
.debug-page {
  padding: 20px;
  background-color: #f2f2f7;
}

.debug-container {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.server-list {
  width: 300px;
}

.debug-area {
  flex: 1;
}

.el-card {
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.el-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.card-header {
  font-weight: 600;
  font-size: 18px;
  color: #1c1c1e;
}

.server-overview {
  margin-bottom: 20px;
}

.tool-debug-area {
  padding: 20px;
}

.empty-tip {
  padding: 20px;
  text-align: center;
  color: #8e8e93;
}

.result-card {
  margin-top: 20px;
  background-color: rgba(255, 255, 255, 0.9);
}

.tool-debug-form {
  margin-bottom: 20px;
}

.result-card {
  margin-top: 20px;
  background-color: rgba(255, 255, 255, 0.9);
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  border-bottom: 1px solid #f0f0f0;
  font-weight: 600;
}

.result-card pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.6;
  color: #333;
  padding: 15px;
  margin: 0;
  background-color: #f8f8f8;
  border-radius: 4px;
}

pre code.hljs {
  padding: 0;
  background: transparent;
}

/* iOS风格按钮 */
.el-button {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.el-button--primary {
  background-color: #007aff;
  border-color: #007aff;
}

.el-button--primary:hover {
  background-color: #0062cc;
  border-color: #0062cc;
}

/* 增强列表交互效果 */
:deep(.el-table__body tr:hover > td) {
  background-color: rgba(0, 122, 255, 0.08);
  cursor: pointer;
}

:deep(.el-table__body tr.current-row > td) {
  background-color: rgba(0, 122, 255, 0.12);
}

:deep(.el-table__body tr.current-row:hover > td) {
  background-color: rgba(0, 122, 255, 0.16);
}

.server-list .el-table {
  --el-table-border-color: rgba(60, 60, 67, 0.12);
  --el-table-border: 1px solid var(--el-table-border-color);
  border-radius: 12px;
  overflow: hidden;
}

.server-list .el-table td {
  padding: 12px 0;
}

.tool-debug .el-table td {
  padding: 12px 0;
}

/* iOS风格标签 */
.el-tag {
  border-radius: 8px;
  font-weight: 500;
}

.el-tag--success {
  background-color: rgba(52, 199, 89, 0.12);
  color: #34c759;
}

.el-tag--danger {
  background-color: rgba(255, 59, 48, 0.12);
  color: #ff3b30;
}

.el-tag--warning {
  background-color: rgba(255, 149, 0, 0.12);
  color: #ff9500;
}

/* 连接状态动画 */
@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

.connection-status .el-tag {
  margin-left: 10px;
}

.connection-status .el-tag--warning {
  animation: pulse 1.5s infinite;
}
</style>
