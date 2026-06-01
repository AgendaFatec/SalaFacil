import axios, { Axios } from "axios";
import { access } from "node:fs";


export const msGraphClient = axios.create({
    baseURL: 'https://graph.microsoft.com/v1.0',
    timeout: 5000
})

export const getUserPhoto= async (accessToken: string):Promise<string | null> =>{
    try{
        const response = await msGraphClient.get('/me/photo/$value',{
            headers:{
                'Authorization': `Bearer ${accessToken}`,
                'ConsistencyLevel': 'eventual'
                
            },
            responseType:'arraybuffer',
        })
        if (!response.data) return null;
        const base64 = Buffer.from(response.data, 'binary').toString('base64');
        return `data:image/jpeg;base64,${base64}`
    }catch(error){  
        console.log("Aviso: Usuário sem foto ou sem permissão.");
        return null
    }
}