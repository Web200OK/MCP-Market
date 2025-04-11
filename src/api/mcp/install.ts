import request from '../request'
import axios from 'axios'

/**
 * 安装MCP服务器
 * @param id 服务器ID
 * @returns Promise<any>
 */
export const installMCP = async (id: string, argExtList?: string[], envExtList?: Record<string, string>) => {
  const res = await request({
    method: 'post',
    url: '/mcpserver/install',
    data: { id, argExtList, envExtList },
    headers: new axios.AxiosHeaders({'Content-Type': 'application/json'}),
  })
  return res
}
