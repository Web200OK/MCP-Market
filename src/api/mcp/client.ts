import request from '@/api/request'
import axios from 'axios'
import { ClientItem } from '@/types/mcp'

export const getClientList = async () => {
    const res = await request({
        method: 'get',
        url: 'clientmanager/queryClientList',
        headers: new axios.AxiosHeaders(),
    });
    return res.data as unknown as Promise<ClientItem[]>;
}

export const deleteClient = async (id: string) => {
    const res = await request({
        method: 'get',
        url: `clientmanager/deleteById`,
        headers: new axios.AxiosHeaders(),
        params: { id }
    });
    return res;
}