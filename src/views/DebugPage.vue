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
                <el-descriptions-item label="地址">{{ currentServer.address }}</el-descriptions-item>
                <el-descriptions-item label="版本">{{ currentServer.version }}</el-descriptions-item>
                <el-descriptions-item label="描述">{{ currentServer.description }}</el-descriptions-item>
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
            <el-tabs v-model="activeToolTab">
              <el-tab-pane label="工具列表" name="tools">
                <el-table :data="currentServer.tools" @row-click="selectTool">
                  <el-table-column prop="name" label="工具名称" />
                  <el-table-column prop="description" label="描述" />
                </el-table>
              </el-tab-pane>
              
              <el-tab-pane label="调试" name="debug" :disabled="!selectedTool">
                <div v-if="selectedTool" class="tool-debug-area">
                  <h3>调试工具: {{ selectedTool.name }}</h3>
                  <el-form label-width="100px">
                    <el-form-item 
                      v-for="param in selectedTool.params" 
                      :key="param.name"
                      :label="param.name"
                    >
                      <el-input v-model="param.value" :placeholder="`输入${param.name}`" />
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="executeTool">执行</el-button>
                    </el-form-item>
                  </el-form>
                  <el-card v-if="debugResult" class="result-card">
                    <pre>{{ debugResult }}</pre>
                  </el-card>
                </div>
                <div v-else>
                  <el-descriptions :column="1" border>
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
                  </el-descriptions>
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
import { ref } from 'vue'

// 模拟数据
const servers = ref([
  {
    id: '1',
    name: '天气服务',
    address: 'weather.example.com',
    status: 'online',
    version: '1.2.0',
    description: '提供全球天气数据查询服务',
    tools: [
      {
        name: 'get_weather',
        description: '获取指定城市天气',
        params: [
          { name: 'city', value: '', required: true },
          { name: 'days', value: '3', required: false }
        ]
      }
    ]
  },
  {
    id: '2',
    name: '文件服务',
    address: 'files.example.com',
    status: 'online',
    version: '2.1.0',
    description: '提供文件搜索和管理功能',
    tools: [
      {
        name: 'search_files',
        description: '搜索文件内容',
        params: [
          { name: 'path', value: '', required: true },
          { name: 'pattern', value: '', required: true }
        ]
      }
    ]
  }
])

const currentServer = ref(null)
const selectedTool = ref(null)
const activeToolTab = ref('tools')
const debugResult = ref(null)

const handleServerChange = (server) => {
  currentServer.value = server
  selectedTool.value = null
  debugResult.value = null
}

const selectTool = (tool) => {
  selectedTool.value = tool
  activeToolTab.value = 'debug'
}

const executeTool = () => {
  // 模拟执行工具
  debugResult.value = JSON.stringify({
    tool: selectedTool.value.name,
    params: selectedTool.value.params.reduce((acc, param) => {
      acc[param.name] = param.value
      return acc
    }, {}),
    result: '执行成功',
    timestamp: new Date().toISOString()
  }, null, 2)
}

</script>

<style scoped>
.debug-page {
  padding: 20px;
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

.card-header {
  font-weight: bold;
  font-size: 16px;
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
  color: var(--el-text-color-secondary);
}

.result-card {
  margin-top: 20px;
}

.result-card pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}

/* 增强列表交互效果 */
:deep(.el-table__body tr:hover > td) {
  background-color: #f5f7fa;
  cursor: pointer;
}

:deep(.el-table__body tr.current-row > td) {
  background-color: #ecf5ff;
}

:deep(.el-table__body tr.current-row:hover > td) {
  background-color: #d9ecff;
}

.server-list .el-table {
  --el-table-border-color: var(--el-border-color-lighter);
  --el-table-border: 1px solid var(--el-table-border-color);
}

.server-list .el-table td {
  padding: 12px 0;
}

.tool-debug .el-table td {
  padding: 12px 0;
}
</style>
