import request from '../request'

export const getInstalledMCPByClient = async (proxyId: string) => {
  const res = await request({
    method: 'get',
    url: '/clientmanager/listProxyAuthMcp',
    params: { proxyId }
  })
  return res.data
}