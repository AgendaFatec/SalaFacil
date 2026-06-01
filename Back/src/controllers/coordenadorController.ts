import { Controller, Request, Response } from "tsoa";
import { CoordenadorService } from "@/services/coordenador/coordenadorService.js";
import { NewUser, CreateUser } from "../interfaces/coordenacao/Coordenacao.js";
import {StatusConta, TipoUser } from "@prisma/client";
import { error } from "node:console";
// import { number } from "zod";


export class CoordenacaoController extends Controller{
    constructor(private coordenacaoService: CoordenadorService){
    super();
    }
    async handleCreateUser(newUser: CreateUser){
        const existingUser = await this.coordenacaoService.findUserByEmail(newUser.email)
        // if (IsValidUser){return {msg: "Usuário invalido para criação"}}
        try{
            if (existingUser) {
                if (existingUser.statusUser === "DESATIVADA") { 
                    return await this.coordenacaoService.updateStatusConta(
                        existingUser.userID, 
                        StatusConta.CONVIDADA,
                        newUser.tipoUser
                    );
                }
                this.setStatus(409); 
                return { msg: "Usuário já está cadastrado e ativo." };
            }
            const newUserData: NewUser = {
                ...newUser,
                statusConta: "CONVIDADA",
                dataCriacao: new Date()
            };

            return await this.coordenacaoService.createNewUser(newUserData)
        }catch(Erro){
            return error
        }
    }
    async handleFindUsers(tipoUser?:TipoUser, statusConta?:StatusConta){
        return await this.coordenacaoService.listUsers(tipoUser, statusConta)
    }

    async handleFindUserById(id_user:number, statusConta?: StatusConta, tipoUser?:TipoUser){
        return await this.coordenacaoService.findUserById(id_user, statusConta, tipoUser)
    }


    async handleUpdateUserStatus(idUser: number, status: StatusConta) {
        const user = await this.coordenacaoService.findUserById(idUser);
        
        if (!user) {
            this.setStatus(404);
            throw new Error("Usuário não encontrado.");
        }

        return await this.coordenacaoService.updateStatusConta(idUser, status, user.tipoUser);
    }



    // private async handleSendInvitation(email:string, userType:TipoUser){
    //     const user = await this.coordenacaoService.findUserByEmail(email)
    //     if (!user) {
    //         this.setStatus(404);
    //         return new Error("Usuário não encontrado.");
    //     }
    //     return await this.coordenacaoService.sendInvitation(email, userType, user)
        
    // }
}