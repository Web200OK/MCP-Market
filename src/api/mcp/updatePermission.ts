import request from '../request'
import axios from 'axios'

/**
 * 更新服务器权限
 * @param clientId 客户端ID
 * @param serverId 服务器ID
 * @param enabled 是否启用
 * @returns Promise<void>
 */
export const updateServerPermission = async ({
  clientId,
  serverId,
  enabled
}: {
  clientId: string
  serverId: string
  enabled: boolean
}): Promise<void> => {
  await request({
    method: 'post',
    url: '/api/mcp/updatePermission',
    data: {
      clientId,
      serverId,
      enabled
    },
    headers: new axios.AxiosHeaders()
  })
}