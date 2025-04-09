import request from '../request'
import type { MCPItem } from '@/types/mcp'
import axios from 'axios'


/**
 * 获取MCP服务器列表
 * @param params 查询参数
 * @returns Promise<MCPItem[]>
 */
export const getMCPList = async (params: string): Promise<MCPItem[]> => {
  const res = await request({
    method: 'post',
    url: '/mcp/listBy',
    data: { params },
    headers: new axios.AxiosHeaders(),
  })
  // 假设响应数据在 res.data 中，将其返回
  return res as unknown as Promise<MCPItem[]>
}