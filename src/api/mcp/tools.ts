import request from '../request'

/**
 * 获取MCP服务器工具列表
 * @param id 服务器ID
 * @returns Promise<any[]>
 */
export const getMCPTools = async (id: string): Promise<[]> => {
  const res = await request.get('/api/mcp/tools', { params: { id } })
  // 假设接口返回的数据在res.data中，返回res.data以匹配Promise<[]>类型
  return res.data;
}