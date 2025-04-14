import request from '../request'
import type { MCPItem } from '@/types/mcp'
import axios from 'axios'


/**
 * 获取已安装的MCP服务器列表
 * @returns Promise<MCPItem[]>
 */
export const getInstalledMCPList = async (): Promise<[]> => {
  const res = await request({
    method: 'post',
    url: '/mcpserver/installedServer',
    headers: new axios.AxiosHeaders(),
  })
  return res as unknown as Promise<[]>
}

/**
 * 获取简易的已安装的MCP服务器列表
 * @returns Promise<MCPItem[]>
 */
export const getSimpleInstalledMCPList = async (): Promise<[]> => {
  const res = await request({
    method: 'post',
    url: '/mcpserver/installedServerId',
    headers: new axios.AxiosHeaders(),
  })
  return res as unknown as Promise<[]>
}
