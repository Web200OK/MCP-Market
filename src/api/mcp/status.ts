import request from '@/api/request';

export function getMCPStatus() {
  return request({
    url: '/mcpserver/status',
    method: 'get'
  });
}