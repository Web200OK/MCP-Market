import axios from 'axios'
import request from '../request'

export interface DebugParams {
  tool: string
  params: Record<string, string>
}

export interface DebugResult {
  id: string
  log: Array<{text: string}>
  success: boolean
  tool: string
}

export const debugTool = async (data: DebugParams) => {
  const response = await request({
    method: 'post',
    url: '/mcpserver/debug',
    data,
    headers: new axios.AxiosHeaders({
      'Content-Type': 'application/json'
    })
  })

  return (response as unknown) as DebugResult
}
