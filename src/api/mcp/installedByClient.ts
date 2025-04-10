import request from '../request'
import axios from "axios";

export const getInstalledMCPByClient = async (proxyId: string) => {
  const res = await request({
    method: 'get',
    url: '/clientmanager/listProxyAuthMcp',
    params: { proxyId },
    headers: new axios.AxiosHeaders(),
  })
  return res.data
}