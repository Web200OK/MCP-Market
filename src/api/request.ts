import axios from 'axios'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/',
  timeout: 10000
})

// 请求拦截器
instance.interceptors.request.use(config => {
  config.headers['Authorization'] = localStorage.getItem('token') || ''
  return config
})

// 响应拦截器
instance.interceptors.response.use(
  response => response.data,
  error => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

export default instance