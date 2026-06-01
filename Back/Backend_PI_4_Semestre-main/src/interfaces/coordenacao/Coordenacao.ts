import { StatusConta, TipoUser } from "@prisma/client"
import {z} from "zod"
// import { TipoSala as PrismaTipoSala} from "@prisma/client";


export interface NewUser{
    email: string
    tipoUser: TipoUser
    statusConta: StatusConta
    dataCriacao: Date
}
export interface CreateUser {
    email: string;
    tipoUser: TipoUser;
}


export interface ValuesToFind{
    nome:string,
    email:string
    tipoUser:string
    statusConta: string
    dataCriacao:Date
}
export interface FindUsers{
    tipoUser?: TipoUser,
    statusConta?: StatusConta
}


// export const NewUserSchema = z.object({
//   email: z.string().email("Formato de e-mail inválido"),
//   tipoUser: z.enum(TipoNewUser), // Garante que o valor venha do Enum do Prisma
//   status: z.enum(statusConta).optional(),
// });
