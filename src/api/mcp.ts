import axios from 'axios'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/',
  timeout: 5000
})

export const getMCPList = (category?: string, search?: string) => {
  return instance.get('/api/mcp/list', {
    params: {
      category,
      search
    }
  })
}

export const getMCPDetail = (id: number) => {
  return instance.get('/api/mcp/detail', { params: { id } })
}
