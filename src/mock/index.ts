import type { MockMethod } from 'vite-plugin-mock'
import Mock from 'mockjs'

export interface MCPItem {
  id: number
  name: string
  description: string
  status: 'online' | 'offline' | 'maintenance'
  lastActive: string
  ip: string
  port: number
  category: string
}

const categories = [
  '本地MCP Server',
  '远程MCP Server',
  '浏览器自动化',
  '数据库管理',
  '文件系统',
  '开发者工具',
  '搜索与知识管理'
]

const mcpList = Mock.mock({
  'list|10-20': [{
    'id|+1': 1,
    'name': '@ctitle(5, 10)',
    'description': '@cparagraph(1, 3)',
    'status|1': ['online', 'offline', 'maintenance'],
    'lastActive': '@datetime',
    'ip': '@ip',
    'port': '@natural(1000, 9999)',
    'category|1': categories
  }]
})

export default [
  {
    url: '/api/mcp/list',
    method: 'get',
    response: ({ query }: { query: { category?: string; search?: string } }) => {
      const { category, search } = query
      let data = mcpList.list
      
      if (category) {
        data = data.filter((item: MCPItem) => item.category === category)
      }
      
      if (search) {
        const searchLower = search.toLowerCase()
        data = data.filter((item: MCPItem) => 
          item.name.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower) ||
          item.category.toLowerCase().includes(searchLower))
      }
      
      return {
        code: 200,
        data
      }
    }
  },
  {
    url: '/api/mcp/detail',
    method: 'get',
    response: ({ query }: { query: { id: string } }) => {
      const { id } = query
      const detail = mcpList.list.find((item: MCPItem) => item.id === +id)
      return {
        code: detail ? 200 : 404,
        data: detail || null,
        message: detail ? 'success' : 'not found'
      }
    }
  },
  {
    url: '/api/mcp/categories',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: categories
      }
    }
  },
  {
    url: '/api/mcp/submit',
    method: 'post',
    response: () => {
      return {
        code: 200,
        data: null,
        message: '提交成功'
      }
    }
  }
] as MockMethod[]
