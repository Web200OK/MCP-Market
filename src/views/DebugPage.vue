<template>
  <div class="debug-page">
    <h2>调试工具</h2>
    <div class="debug-content">
      <el-card class="debug-card">
        <template #header>
          <div class="card-header">
            <span>MCP Server 调试</span>
          </div>
        </template>
        <div class="debug-tools">
          <el-button type="primary">连接测试</el-button>
          <el-button>性能分析</el-button>
          <el-button>日志查看</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
// 调试页面逻辑
</script>

<style scoped>
.debug-page {
  padding: 20px;
}

.debug-content {
  margin-top: 20px;
}

.debug-card {
  max-width: 800px;
  margin: 0 auto;
}

.card-header {
  font-weight: bold;
  font-size: 18px;
}

.debug-tools {
  display: flex;
  gap: 10px;
}
</style>
