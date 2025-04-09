export interface MCPItem {
  id: string
  name: string
  description: string
  category: string
  rating: number
  downloads: number
  updatedAt: string
  tags?: string[]
}

export interface MCPDetail extends MCPItem {
  id: string
  name: string
  version: string
  description: string
  runType: string
  command: string
  commandParam: string[]
  url: string
  envDependency: Record<string, string>
  envParam: Record<string, string>
  localInstallPath: string
  installType: string
}

export interface ClientItem {
  id: string
  name: string
}
