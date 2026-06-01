import * as z from "zod";
import { TipoUser, StatusConta } from "@prisma/client";
import { error } from "node:console";


export const NewUserSchema = z.object({
  email: z
    .string()
    .email("Formato de e-mail inválido")
    .trim()
    .toLowerCase(),
    
    tipoUser: z.enum(TipoUser, {

    error: (issue) => issue.code === "invalid_value" || issue.code === undefined
    ?"Este pârametro é obirgatório"
    :"Não é uma string"
  }),
  // status: z.enum(StatusConta).default(StatusConta.CONVIDADA),
  // dataCriacao: z.date().default(()=> new Date),
});


export type NewUserRequest = z.infer<typeof NewUserSchema>;

