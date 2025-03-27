<template>
  <!-- MCP服务器详情页面模板 -->
  <div class="detail-container">
    <!-- 页面头部，带返回按钮 -->
    <el-page-header @back="goBack" content="MCP Server详情" />
    
    <el-card class="detail-card">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="概览" name="overview">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-card shadow="hover">
                <h3 class="info-title">基本信息</h3>
                <el-descriptions :column="1" border>
                  <el-descriptions-item label="服务器名称">
                    <div class="server-name-container">
                      <span>{{ server.name }}</span>
                      <el-button 
                        size="small"
                        type="primary" 
                        @click="connectToServer"
                        :loading="isConnecting"
                        :disabled="connectionStatus === 'connected'"
                      >
                        {{ connectionStatus === 'connected' ? '已连接' : '连接服务器' }}
                      </el-button>
                    </div>
                  </el-descriptions-item>
                  <el-descriptions-item label="服务器地址">{{ server.address }}</el-descriptions-item>
                  <el-descriptions-item label="状态">
                    <el-tag :type="server.status === 'online' ? 'success' : 'danger'">
                      {{ server.status === 'online' ? '在线' : '离线' }}
                    </el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item label="版本">{{ server.version }}</el-descriptions-item>
                  <el-descriptions-item label="最后活跃">{{ server.lastActive }}</el-descriptions-item>
                  <el-descriptions-item label="连接状态">
                    <el-tag :type="connectionStatus === 'connected' ? 'success' : connectionStatus === 'connecting' ? 'warning' : 'info'">
                      {{ connectionStatus === 'connected' ? '已连接' : connectionStatus === 'connecting' ? '连接中...' : '未连接' }}
                    </el-tag>
                  </el-descriptions-item>
                </el-descriptions>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card shadow="hover">
                <h3 class="info-title">详细描述</h3>
                <p class="description-text">{{ server.description }}</p>
              </el-card>
            </el-col>
          </el-row>
        </el-tab-pane>

        <el-tab-pane label="内容" name="content">
          <el-card shadow="hover">
            <h3 class="info-title">服务器内容</h3>
            <div v-html="server.content"></div>
          </el-card>
        </el-tab-pane>

        <el-tab-pane label="工具" name="tools">
          <el-table :data="server.tools" stripe>
            <el-table-column prop="name" label="工具名称" width="180" />
            <el-table-column prop="description" label="描述" />
            <el-table-column label="操作" width="120">
              <template #default="scope">
                <el-button size="small" @click="useTool(scope.row)">使用</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'MCPDetail',
  data() {
    return {
      activeTab: 'overview', // 当前激活的标签页
      connectionStatus: 'disconnected', // 连接状态: disconnected/connecting/connected
      isConnecting: false, // 是否正在连接中
      server: { // 服务器数据对象
        id: this.$route.params.id, // 从路由参数获取服务器ID
        name: '示例MCP服务器', // 服务器名称
        address: '127.0.0.1:8080', // 服务器地址
        status: 'online', // 服务器状态: online/offline
        version: '1.0.0', // 服务器版本
        lastActive: '2025-03-27 10:30:45', // 最后活跃时间
        description: '这是一个示例MCP服务器，提供各种工具和资源', // 服务器描述
        content: '<p>服务器包含以下资源：</p><ul><li>API文档</li><li>示例代码</li><li>调试工具</li></ul>', // HTML格式的服务器内容
        tools: [ // 服务器提供的工具列表
          { name: 'get_weather', description: '获取天气信息' },
          { name: 'search_files', description: '搜索文件内容' },
          { name: 'execute_command', description: '执行系统命令' }
        ]
      }
    }
  },
  methods: {
    // 返回上一页
    goBack() {
      this.$router.push('/')
    },
    
    // 使用工具方法
    useTool(tool) {
      this.$message.success(`准备使用工具: ${tool.name}`)
    },
    
    // 连接服务器方法
    connectToServer() {
      this.isConnecting = true
      this.connectionStatus = 'connecting'
      
      // 模拟连接过程
      setTimeout(() => {
        this.isConnecting = false
        this.connectionStatus = 'connected'
        this.$message.success('服务器连接成功')
      }, 1500)
    }
  }
}
</script>

<style scoped>
.detail-container {
  padding: 20px;
}

.detail-card {
  margin-top: 20px;
}

.info-title {
  color: var(--el-color-primary);
  margin-bottom: 15px;
}

.description-text {
  line-height: 1.8;
  color: var(--el-text-color-regular);
}

.el-card {
  margin-bottom: 20px;
  transition: all 0.3s var(--el-transition-function-fast-bezier);
  
  &:hover {
    transform: translateY(-3px);
  }
}

.server-name-container {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
