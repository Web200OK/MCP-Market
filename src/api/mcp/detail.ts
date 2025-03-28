import request from '../request'
import type { MCPDetail } from '@/types/mcp'

/**
 * 获取MCP服务器详情
 * @param id 服务器ID
 * @returns Promise<MCPDetail>
 */
export const getMCPDetail = async (id: number): Promise<MCPDetail> => {
  const res = await request.get('/api/mcp/detail', { params: { id } })
  // 假设响应数据在 res.data 中
  return res.data as MCPDetail;
}