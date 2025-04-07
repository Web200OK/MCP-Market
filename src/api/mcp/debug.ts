import request from '../request'

export interface DebugParams {
  tool: string
  params: Record<string, string>
}

export interface DebugResult {
  tool: string
  params: Record<string, string>
  result: string
  timestamp: string
}

export const debugTool = (data: DebugParams) => {
  return request({method: 'post', url: '/mcpserver/debug', data }) as Promise<DebugResult>
}