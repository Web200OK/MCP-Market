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
 * 获取MCP服务器列表
 * @param params 查询参数
 * @returns Promise<MCPItem[]>
 */
export const getMCPList = async (params?: {
  category?: string
  search?: string
  page?: number
  size?: number
}): Promise<MCPItem[]> => {
  const res = await instance.get('/api/mcp/list', { params })
  return res.data
}

/**
 * 获取MCP服务器详情
 * @param id 服务器ID
 * @returns Promise<MCPDetail>
 */
export const getMCPDetail = async (id: number): Promise<MCPDetail> => {
  const res = await instance.get('/api/mcp/detail', { params: { id } })
  return res.data
}

/**
 * 提交新的MCP服务器
 * @param data 服务器数据
 * @returns Promise<void>
 */
export const submitMCP = async (data: FormData): Promise<void> => {
  await instance.post('/api/mcp/submit', data)
}
