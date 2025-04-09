import axios from 'axios'
import request from '../request'
import type { MCPDetail } from '@/types/mcp'

/**
 * 获取MCP服务器详情
 * @param id 服务器ID
 * @returns Promise<MCPDetail>
 */
export const getMCPDetail = async (id: number): Promise<MCPDetail> => {
  const res = await request({
    method: 'post',
    url: '/mcp/detail',
    headers: new axios.AxiosHeaders(),
    data: { id }
  });
  return res as unknown as MCPDetail;
}
