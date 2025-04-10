<!-- API文档页面模板 -->
<template>
  <div class="api-page">
    <h2>应用程序API</h2>
    <div class="api-content">
      <el-card class="api-card">
        <template #header>
          <div class="card-header">
            <span>MCP API文档</span>
          </div>
        </template>

        <el-tabs type="border-card" style="border-color: #999; border-radius: 12px">
          <el-tab-pane label="基础API">
            <h3>获取MCP服务列表</h3>
            <pre>GET /api/mcps</pre>
            <p>返回所有已注册的MCP服务列表</p>

            <h3>获取单个MCP服务</h3>
            <pre>GET /api/mcps/:id</pre>
            <p>返回指定ID的MCP服务详情</p>
          </el-tab-pane>

          <el-tab-pane label="工具API">
            <h3>调用MCP工具</h3>
            <pre>POST /api/mcps/:id/tools/:tool</pre>
            <p>调用指定MCP服务的工具</p>

            <h3>访问MCP资源</h3>
            <pre>GET /api/mcps/:id/resources/:uri</pre>
            <p>访问指定MCP服务的资源</p>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'APIPage'
}
</script>

<script setup>
// 这里可以添加API调用逻辑
// 这里可以添加API调用逻辑
</script>

<style scoped>
.api-page {
  padding: 20px;
}

.api-content {
  margin-top: 20px;
}

.api-card {
  max-width: 800px;
  margin: 0 auto;
}

.card-header {
  font-weight: bold;
  font-size: 18px;
}

pre {
  background: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
}
</style>
