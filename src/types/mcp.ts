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
  artifactId: string
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
