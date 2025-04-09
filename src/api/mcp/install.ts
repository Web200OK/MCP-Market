import request from '../request'
import axios from 'axios'

/**
 * 安装MCP服务器
 * @param id 服务器ID
 * @returns Promise<any>
 */
export const installMCP = async (id: string) => {
  const res = await request({
    method: 'get',
    url: '/mcpserver/install',
    params: { id },
    headers: new axios.AxiosHeaders(),
  })
  return res
}
