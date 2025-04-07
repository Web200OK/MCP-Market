import request from '../request'
import type { MCPItem } from '@/types/mcp'

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
  const res = await request({method: 'get', url: '/api/mcp/list', params})
  // 假设响应数据在 res.data 中，将其返回
  return res.data
}