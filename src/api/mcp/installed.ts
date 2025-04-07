import request from '../request'
import type { MCPItem } from '@/types/mcp'

/**
 * 获取已安装的MCP服务器列表
 * @returns Promise<MCPItem[]>
 */
export const getInstalledMCPList = async (): Promise<MCPItem[]> => {
  const res = await request({ method: 'get', url: '/mcpserver/installedServer' })
  return res
}