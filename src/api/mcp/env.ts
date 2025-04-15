import request from '../request'
import axios from 'axios'

export const listLocalEnv = async (): Promise<[]> => {
    const res = await request({
      method: 'get',
      url: '/env/listLocalEnv',
      headers: new axios.AxiosHeaders(),
    })
    return res.data as unknown as Promise<[]>
}

export const nodeInstall = async (): Promise<boolean> => {
    const res = await request({
      method: 'post',
      url: '/env/nodeInstall',
      headers: new axios.AxiosHeaders(),
    })
    return res as unknown as Promise<boolean>
}

export const pythonInstall = async (): Promise<boolean> => {
    const res = await request({
      method: 'post',
      url: '/env/pythonInstall',
      headers: new axios.AxiosHeaders(),
    })
    return res as unknown as Promise<boolean>
}

export const saveLocalEnvConfig = async (data: any): Promise<boolean> => {
    const res = await request({
      method: 'post',
      url: '/env/saveLocalEnvConfig',
      headers: new axios.AxiosHeaders(),
      data: {
        envInfo: data
      }
    })
    return res as unknown as Promise<boolean>
}

export const checkNodeInstalled = async (): Promise<boolean> => {
    const res = await request({
      method: 'get',
      url: '/env/nodeTest',
      headers: new axios.AxiosHeaders(),
    })
    return res as unknown as Promise<boolean>
}

export const checkPythonInstalled = async (): Promise<boolean> => {
    const res = await request({
      method: 'get',
      url: '/env/pythonTest',
      headers: new axios.AxiosHeaders(),
    })
    return res as unknown as Promise<boolean>
}