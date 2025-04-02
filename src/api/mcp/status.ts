import request from '@/api/request';

export function getMCPStatus() {
  return request({
    url: '/api/mcpserver/status',
    method: 'get'
  });
}