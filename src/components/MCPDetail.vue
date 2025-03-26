<template>
  <el-card>
    <h1>MCP Server Details</h1>
    <el-row :gutter="20" class="server-info">
      <el-col :span="12">
        <el-card shadow="hover">
          <h3 class="info-title">基本信息</h3>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="服务器名称">{{ server.name }}</el-descriptions-item>
            <el-descriptions-item label="所在地区">{{ server.location }}</el-descriptions-item>
            <el-descriptions-item label="价格">
              <el-tag type="success">{{ server.price }}</el-tag>
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
    <el-button type="primary" @click="goBack">Back to Market</el-button>
  </el-card>
</template>

<script>
export default {
  name: 'MCPDetail',
  data() {
    return {
      server: {
        name: 'Server Name',
        description: 'Server Description',
        location: 'Server Location',
        price: 'Server Price'
      }
    };
  },
  methods: {
    goBack() {
      this.$router.push('/');
    }
  }
};
</script>

<style scoped>
.server-info {
  margin-bottom: var(--el-margin);
  .info-title {
    color: var(--el-color-primary);
    margin-bottom: 15px;
  }
  .description-text {
    line-height: 1.8;
    color: var(--el-text-color-regular);
  }
  .el-card {
    transition: all 0.3s var(--el-transition-function-fast-bezier);
    &:hover {
      transform: translateY(-3px);
    }
  }
}
</style>