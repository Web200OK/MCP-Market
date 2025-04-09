import request from '../request'

/**
 * 获取MCP服务器分类列表
 * @returns Promise<any[]>
 */
export const getCategoryList = async (): Promise<[]> => {
  const res = await request({method: 'get', url: '/mcp/categoryList'})
  // 假设接口返回的数据在res.data中，返回res.data以匹配Promise<[]>类型
  return res;
}