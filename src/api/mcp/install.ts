import request from '../request'

/**
 * 安装MCP服务器
 * @param id 服务器ID
 * @returns Promise<void>
 */
export const installMCP = async (id: string): Promise<void> => {
  const res = await request({ method: 'get', url: '/mcpserver/install', params: { id } })
  return res
}