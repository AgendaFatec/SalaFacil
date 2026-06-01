import { TipoUser } from "@prisma/client";
import { StatusConta } from "@prisma/client";



export interface TokenPayload {
    sub: number;       
    email: string;     
    role: TipoUser;      
    status: StatusConta;    
    iat?: number;      
    exp?: number;     
    
    
    userName:string,
    // fotoUrl:string
}