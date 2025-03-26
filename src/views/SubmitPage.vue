<template>
  <div class="submit-page">
    <h2>提交MCP Server</h2>
    <div class="submit-content">
      <el-card class="submit-card">
        <template #header>
          <div class="card-header">
            <span>提交新的MCP服务</span>
          </div>
        </template>
        
        <el-form :model="form" label-width="120px">
          <el-form-item label="服务名称">
            <el-input v-model="form.name" placeholder="输入服务名称"></el-input>
          </el-form-item>
          
          <el-form-item label="服务类型">
            <el-select v-model="form.type" placeholder="选择服务类型">
              <el-option label="本地服务" value="local"></el-option>
              <el-option label="远程服务" value="remote"></el-option>
            </el-select>
          </el-form-item>
          
          <el-form-item label="服务地址">
            <el-input v-model="form.address" placeholder="输入服务地址"></el-input>
          </el-form-item>

          <el-form-item label="服务器配置(JSON)">
            <el-input
              v-model="form.serverConfig"
              type="textarea"
              :rows="4"
              placeholder="输入服务器配置JSON"
            ></el-input>
          </el-form-item>
          
          <el-form-item label="服务描述">
            <el-input 
              v-model="form.description" 
              type="textarea" 
              :rows="3"
              placeholder="详细描述服务功能"></el-input>
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" @click="handleSubmit">提交</el-button>
            <el-button>重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      
      <div class="submit-guide">
        <h3>提交指南</h3>
        <p>1. 确保服务符合MCP协议规范</p>
        <p>2. 提供完整的服务文档</p>
        <p>3. 测试服务稳定性后再提交</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const form = ref({
  name: '',
  type: '',
  address: '',
  serverConfig: '',
  description: ''
})

const handleSubmit = () => {
  console.log('提交表单:', form.value)
  // 这里添加提交逻辑
}
</script>

<style scoped>
.submit-page {
  padding: 20px;
}

.submit-content {
  display: flex;
  gap: 30px;
  margin-top: 20px;
}

.submit-card {
  flex: 1;
  max-width: 600px;
}

.submit-guide {
  flex: 1;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 4px;
}

.card-header {
  font-weight: bold;
  font-size: 18px;
}
</style>
