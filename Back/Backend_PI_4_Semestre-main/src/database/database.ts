import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import pg from 'pg'

import { any } from "zod";
import { tr } from "zod/locales";

export class PrismaService extends PrismaClient{
    constructor(){
        const pool  = new pg.Pool({
            connectionString: process.env.DATABASE_URL
        })
        const adapter = new PrismaPg(pool as any)

        super({
            adapter, log:[
                {level:'query', emit:'stdout'},
                {level:'error', emit:'stdout'},
                {level:'info', emit:'stdout'},
                {level:'warn', emit:'stdout'}
            ]   
        })
    }


    //funções de teste de conexão
    async connect(){
        try{
            await this.$connect();
            console.log(`Conexão com banco de dados realizado com sucesso:` )
        }catch(error){
            console.log("Erro de conexão com o banco de dados:", error)
        }
    }
}


// import { Pool } from "pg";

// const pool = new pg.Pool({connectionString: process.env.DATABASE_URL});
// const adapter = new PrismaPg(pool as any)


// export const prisma = new PrismaClient({adapter, log:[
//     {level:'query', emit:'stdout'},
//     {level:'error', emit:'stdout'},
//     {level:'info', emit:'stdout'},
//     {level:'warn', emit:'stdout'}
//     ]   
// })