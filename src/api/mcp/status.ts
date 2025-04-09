import request from '@/api/request';
import axios from 'axios'


export async function getMCPStatus() {
  const res = await request({
    method: 'get',
    url: '/mcpserver/status',
    headers: new axios.AxiosHeaders(),
  })
  return res
}