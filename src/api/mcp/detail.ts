import request from '../request'
import type { MCPDetail } from '@/types/mcp'

/**
 * 获取MCP服务器详情
 * @param id 服务器ID
 * @returns Promise<MCPDetail>
 */
export const getMCPDetail = async (id: number): Promise<MCPDetail> => {
  const res = await request({method: 'get', url: '/mcp/detail', params: { id } })
  // 假设响应数据在 res.data 中
  // 假设响应数据在 res.data 中，修改为从 res.data 取数据
  return res;
}