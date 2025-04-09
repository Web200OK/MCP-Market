import { getMCPList } from './mcp/list'
import { getMCPDetail } from './mcp/detail'
import { getInstalledMCPList } from './mcp/installed'
import { debugTool } from './mcp/debug'
import { getMCPStatus } from './mcp/status'
import { installMCP } from './mcp/install'
import { getCategoryList } from './mcp/categoryList'
import axios from 'axios'
import type { MCPItem, MCPDetail } from '@/types/mcp'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/',
  timeout: 10000
})

// 请求拦截器
instance.interceptors.request.use(config => {
  config.headers['Authorization'] = localStorage.getItem('token') || ''
  return config
})

// 响应拦截器
instance.interceptors.response.use(
  response => response.data,
  error => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

/**
 * 提交新的MCP服务器
 * @param data 服务器数据
 * @returns Promise<void>
 */
export const submitMCP = async (data: FormData): Promise<void> => {
  await instance.post('/api/mcp/submit', data)
}

/**
 * 获取MCP分类列表
 * @returns Promise<string[]>
 */
export const getCategories = async (): Promise<string[]> => {
  const res = await instance.get('/api/mcp/categories')
  return res.data
}

export {
  getMCPList,
  getMCPDetail,
  getInstalledMCPList,
  debugTool,
  getMCPStatus,
  installMCP,
  getCategoryList
}
