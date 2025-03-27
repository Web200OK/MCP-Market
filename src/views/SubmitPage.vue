x<template>
  <div class="submit-page">
    <h2>提交MCP Server</h2>
    <div class="submit-content">
      <el-card class="submit-card">
        <template #header>
          <div class="card-header">
            <span>提交新的MCP服务</span>
          </div>
        </template>
        
        <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
          <el-form-item label="服务名称" prop="name">
            <el-input v-model="form.name" placeholder="输入服务名称"></el-input>
          </el-form-item>
          
          <el-form-item label="服务类型" prop="type">
            <el-select v-model="form.type" placeholder="选择服务类型">
              <el-option label="官方服务" value="official"></el-option>
              <el-option label="社区服务" value="community"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="服务分类" prop="category">
            <el-select v-model="form.category" placeholder="选择服务分类">
              <el-option 
                v-for="category in categories" 
                :key="category"
                :label="category" 
                :value="category"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="服务标签">
            <el-select
              v-model="form.tags"
              multiple
              filterable
              allow-create
              default-first-option
              placeholder="添加标签"
            >
              <el-option
                v-for="tag in commonTags"
                :key="tag"
                :label="tag"
                :value="tag"
              />
            </el-select>
          </el-form-item>
          
          <el-form-item label="服务地址" prop="address">
            <el-input v-model="form.address" placeholder="输入服务地址"></el-input>
          </el-form-item>

          <el-form-item label="服务器配置(JSON)" prop="serverConfig">
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
            <el-button @click="resetForm">重置</el-button>
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

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElForm } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { submitMCP, getCategories } from '@/api/mcp'

interface FormData {
  name: string
  type: string
  address: string
  serverConfig: string
  description: string
  tags: string[]
  category: string
}

const categories = ref<string[]>([])
const commonTags = ref<string[]>(['AI', '工具', 'API', '数据', '分析'])

onMounted(async () => {
  try {
    categories.value = await getCategories()
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  }
})

const form = ref<FormData>({
  name: '',
  type: 'official',
  address: '',
  serverConfig: '',
  description: '',
  tags: [],
  category: ''
})

const rules: FormRules = {
  name: [
    { required: true, message: '请输入服务名称', trigger: 'blur' },
    { min: 3, message: '名称长度至少3个字符', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择服务类型', trigger: 'change' }
  ],
  category: [
    { required: true, message: '请选择服务分类', trigger: 'change' }
  ],
  address: [
    { required: true, message: '请输入服务地址', trigger: 'blur' },
    { 
      validator: (rule: any, value: string, callback: (error?: Error) => void) => {
        if (form.value.type === 'remote' && !/^https?:\/\/.+/i.test(value)) {
          callback(new Error('远程服务地址必须是有效的URL'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  serverConfig: [
    { required: true, message: '请输入服务器配置', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: (error?: Error) => void) => {
        try {
          JSON.parse(value)
          callback()
        } catch (e) {
          callback(new Error('必须是有效的JSON格式'))
        }
      },
      trigger: 'blur'
    }
  ]
}

const formRef = ref<FormInstance | null>(null)

const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    const formData = new FormData()
    formData.append('tags', JSON.stringify(form.value.tags))
    Object.entries(form.value).forEach(([key, value]) => {
      if (key !== 'tags') {
        formData.append(key, String(value))
      }
    })
    await submitMCP(formData)
    ElMessage.success('提交成功')
    resetForm()
  } catch (error: any) {
    if (error?.response) {
      ElMessage.error(error.response.data.message || '提交失败')
    }
  }
}

const resetForm = () => {
    formRef.value?.resetFields()
    form.value = {
      name: '',
      type: 'official',
      address: '',
      serverConfig: '',
      description: '',
      tags: [],
      category: ''
    }
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
