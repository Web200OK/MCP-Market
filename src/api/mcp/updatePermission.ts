import request from "../request";
import axios from "axios";

/**
 * 更新服务器权限
 * @param proxyId 客户端ID
 * @param key 服务器标识
 * @param status 是否启用
 * @returns Promise<void>
 */
export const updateServerPermission = async ({
  proxyId,
  key,
  status,
}: {
  proxyId: string;
  key: string;
  status: boolean;
}): Promise<void> => {
  const res = await request({
    method: "get",
    url: "/clientmanager/updateStatus",
    params: {
      proxyId,
      key,
      status,
    },
    headers: new axios.AxiosHeaders(),
  });
  return res;
};
