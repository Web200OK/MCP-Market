<template>
  <!-- MCP服务器详情页面模板 -->
  <div class="detail-container">
    <!-- 页面头部，带返回按钮 -->
    <el-page-header @back="goBack" content="MCP Server详情" />
    
    <el-card class="detail-card" v-if="server">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="概览" name="overview">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-card shadow="hover">
                <h3 class="info-title">基本信息</h3>
                <el-descriptions :column="1" border>
                  <el-descriptions-item label="Artifact ID">{{ server.artifactId }}</el-descriptions-item>
                  <el-descriptions-item label="名称">{{ server.name }}</el-descriptions-item>
                  <el-descriptions-item label="版本">{{ server.version }}</el-descriptions-item>
                  <el-descriptions-item label="运行类型">{{ server.runType }}</el-descriptions-item>
                  <el-descriptions-item label="安装类型">{{ server.installType }}</el-descriptions-item>
                  <el-descriptions-item label="本地路径">{{ server.localInstallPath }}</el-descriptions-item>
                  <el-descriptions-item label="URL">{{ server.url }}</el-descriptions-item>
                </el-descriptions>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card shadow="hover">
                <h3 class="info-title">运行配置</h3>
                <el-descriptions :column="1" border>
                  <el-descriptions-item label="启动命令">{{ server.command }}</el-descriptions-item>
                  <el-descriptions-item label="命令参数">
                    <el-tag v-for="(param, index) in server.commandParam" :key="index" style="margin-right: 5px;">
                      {{ param }}
                    </el-tag>
                  </el-descriptions-item>
                </el-descriptions>
              </el-card>
            </el-col>
          </el-row>
          <el-row :gutter="20" style="margin-top: 20px;">
            <el-col :span="12">
              <el-card shadow="hover">
                <h3 class="info-title">环境依赖</h3>
                <el-descriptions :column="1" border>
                  <el-descriptions-item 
                    v-for="(value, key) in server.envDependency" 
                    :key="key" 
                    :label="key"
                  >
                    {{ value }}
                  </el-descriptions-item>
                </el-descriptions>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card shadow="hover">
                <h3 class="info-title">环境参数</h3>
                <el-descriptions :column="1" border>
                  <el-descriptions-item 
                    v-for="(value, key) in server.envParam" 
                    :key="key" 
                    :label="key"
                  >
                    {{ value }}
                  </el-descriptions-item>
                </el-descriptions>
              </el-card>
            </el-col>
          </el-row>
        </el-tab-pane>

        <el-tab-pane label="描述" name="description">
          <el-card shadow="hover">
            <h3 class="info-title">服务描述</h3>
            <p class="description-text">{{ server.description }}</p>
          </el-card>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'MCPDetail',
  data() {
    return {
      activeTab: 'overview',
      connectionStatus: 'disconnected',
      isConnecting: false,
      loading: true,
      error: null,
      server: null
    }
  },
  created() {
    this.fetchServerDetail()
  },
  methods: {
    async fetchServerDetail() {
      this.loading = true
      this.error = null
      try {
        const { id } = this.$route.params
        const { data } = await axios.get('/api/mcp/detail', {
          params: { id }
        })
        
        if (data.code === 200 && data.data) {
          this.server = data.data
        } else {
          this.error = data.message || 'Failed to load server details'
          this.$message.error(this.error)
        }
      } catch (err) {
        this.error = err.message || 'Network error'
        this.$message.error(this.error)
      } finally {
        this.loading = false
      }
    },
    
    goBack() {
      this.$router.push('/')
    },
    
    useTool(tool) {
      this.$message.success(`准备使用工具: ${tool.name}`)
    },
    
    connectToServer() {
      this.isConnecting = true
      this.connectionStatus = 'connecting'
      
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
