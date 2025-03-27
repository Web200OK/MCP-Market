export interface MCPItem {
  id: number
  name: string
  description: string
  category: string
  icon: string
  rating: number
  downloads: number
  updatedAt: string
  type?: string
}

export interface MCPDetail extends MCPItem {
  author: string
  version: string
  repository: string
  documentation: string
  dependencies: string[]
  configSchema: Record<string, unknown>
  createdAt: string
}
