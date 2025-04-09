import request from '../request'

type CategoryItem = {
  id: number
  categoryName: string
  createTs: string
  updateTs: string
}

/**
 * 获取MCP服务器分类列表
 * @returns Promise<CategoryItem[]>
 */
export const getCategoryList = async (): Promise<CategoryItem[]> => {
  const res = await request({method: 'get', url: '/mcp/categoryList'})
  // 假设接口返回的数据在res.data中，返回res.data以匹配Promise<CategoryItem[]>类型
  return res;
}