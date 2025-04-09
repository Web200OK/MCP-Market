import axios from 'axios'
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

export const debugTool = async (data: DebugParams): Promise<DebugResult> => {
  const response = await request({
    method: 'post',
    url: '/mcpserver/debug',
    data,
    headers: new axios.AxiosHeaders({
      'Content-Type': 'application/json'
    })
  })

  return {
    tool: data.tool,
    params: data.params,
    result: JSON.stringify(response),
    timestamp: new Date().toISOString()
  }
}
