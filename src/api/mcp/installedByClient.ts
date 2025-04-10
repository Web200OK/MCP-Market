import request from '../request'

export const getInstalledMCPByClient = async (clientId: string) => {
  const res = await request({
    method: 'get',
    url: '/api/mcp/installed-by-client',
    params: { clientId }
  })
  return res.data
}