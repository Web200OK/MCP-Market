import axios, { 
  AxiosInstance, 
  InternalAxiosRequestConfig, 
  AxiosResponse, 
  AxiosError 
} from 'axios'

// 创建mock实例
const mockInstance: AxiosInstance = axios.create({
  baseURL: '/',
  timeout: 10000
})

// 创建远程实例
const remoteInstance: AxiosInstance = axios.create({
  baseURL: '/server',
  timeout: 10000,
  withCredentials: true
})

// 通用请求拦截器
const setupInterceptors = (instance: AxiosInstance) => {
  instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    if (!config.headers) {
      config.headers = new axios.AxiosHeaders()
    }
    config.headers.set('Authorization', localStorage.getItem('token') || '')
    config.headers.set('Content-Type', 'application/json')
    return config
  })

  instance.interceptors.response.use(
    (response: AxiosResponse) => response.data,
    (error: AxiosError) => {
      console.error('API Error:', error)
      return Promise.reject(error)
    }
  )
}

setupInterceptors(mockInstance)
setupInterceptors(remoteInstance)

// 根据路径选择实例
const request = (config: InternalAxiosRequestConfig & { url: string }) => {
  // 判断是否为mock接口
  const isMockApi = config.url.startsWith('/api/mcp')
  
  if (isMockApi) {
    return mockInstance(config)
  } else {
    return remoteInstance(config)
  }
}

export default request
