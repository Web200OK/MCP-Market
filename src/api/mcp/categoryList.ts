import axios from 'axios'
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
  const response = await request({
    method: 'get',
    url: '/mcp/categoryList',
    headers: new axios.AxiosHeaders()
  })
  return response as unknown as CategoryItem[]
}
