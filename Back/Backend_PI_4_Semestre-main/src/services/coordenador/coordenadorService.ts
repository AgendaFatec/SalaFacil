import { Profile } from "passport";
import { PrismaService } from "@/database/database.js";
import {TipoUser as PrismaTipoUser, StatusConta, TipoSala, TipoUser} from "@prisma/client"
import { omit } from "zod/mini";
import { NewUser, ValuesToFind } from "@/interfaces/coordenacao/Coordenacao.js"; 
import { create } from "node:domain";
import { tr } from "zod/locales";
import { all } from "axios";
import { userInfo } from "node:os";

import { MailService } from "@/utils/mailService.js";

export class CoordenadorService{
    constructor(
        private prisma: PrismaService,
    ){}

    async createNewUser(newUser: NewUser){
        const userData = await this.prisma.usuario.create({
            data:{
                userEmail: newUser.email,
                tipoUser: newUser.tipoUser,
                criadoDate: newUser.dataCriacao,
                statusUser: newUser.statusConta,

                docente: newUser.tipoUser === TipoUser.DOCENTE ? {create:{}}:undefined,
                ti: newUser.tipoUser === TipoUser.TI ? {create:{}}:undefined,
                adm: newUser.tipoUser === TipoUser.ADM ? {create:{}}:undefined
            },
            include:{
                docente:true,
                ti:true,
                adm:true
            }
        })
        
        // console.log(`\n\n\n userData: \n ${userData}\n\n`)
        const user:NewUser = {
            email: userData.userEmail,
            tipoUser: userData.tipoUser,
            statusConta:userData.statusUser,
            dataCriacao: userData.criadoDate
        };
        // console.log(`\n\n\n user: \n ${user}\n\n`)

        try {
            await this.sendInvitation(user.email, user.tipoUser)
        } catch (error) {
            console.error(`Falha ao enviar convite para ${user.email}:`, error);
        }

        return user
    }
    async listUsers(tipoUser?:TipoUser, statusConta?:StatusConta){


    const filter: any = {};
    if (tipoUser) filter.tipoUser = tipoUser;
    if (statusConta) filter.statusUser = statusConta;

    return await this.prisma.usuario.findMany({
        where: filter,
        select: {
            userID: true,
            userNome: true,
            userEmail: true,
            criadoDate: true,
            fotoUrl: true,
            statusUser: true,
            tipoUser: true,
            ti: true,
            docente: true,
            adm: true
        },
        orderBy: {
            userNome: 'desc'
        }
    });


        // if (tipoUser){
        //     const allUser = await this.prisma.usuario.findMany({
        //     select:{
        //         userID:true,
        //         userNome:true,
        //         userEmail:true,
        //         criadoDate:true,
        //         fotoUrl:true,
        //         statusUser:true,
        //         ti:true,
        //         docente:true,
        //         adm:true
        //     },
        //     where:{
        //         tipoUser: tipoUser,
        //     },
        //     orderBy:{
        //         userNome:'desc'
        //     },
            
        //     })
        //     return allUser
        // }
        // if(statusConta){
        //     const allUser = await this.prisma.usuario.findMany({
        //     select:{
        //         userID:true,
        //         userNome:true,
        //         userEmail:true,
        //         criadoDate:true,
        //         fotoUrl:true,
        //         statusUser:true,
        //         ti:true,
        //         docente:true,
        //         adm:true
        //     },
        //     where:{
        //         statusUser: statusConta,
        //     },
        //     orderBy:{
        //         userNome:'desc'
        //     }
        //     })
        //     return allUser
        // }
        // else{
        //     const allUser = await this.prisma.usuario.findMany({
        //     select:{
        //         userID:true,
        //         userNome:true,
        //         userEmail:true,
        //         criadoDate:true,
        //         fotoUrl:true,
        //         statusUser:true,
                
        //         ti:true,
        //         docente:true,
        //         adm:true
        //     },
        //     orderBy:{
        //         tipoUser: "desc"
        //     }
        //     })
        //     return allUser
        // }

    }
    async findUserByEmail(email_user:string){
        try{
            const userValues = await this.prisma.usuario.findUnique({
                where:{userEmail:email_user},
                select:{userID:true, userEmail:true, userNome:true, tipoUser:true, statusUser:true}
            })
            return userValues
        }catch(error){
            console.log(error)
            throw error
        }
    }

    async findUserById(id_user:number, statusConta?:StatusConta, tipoUser?:TipoUser){
        const filter: any = {};
        if (tipoUser) filter.tipoUser = tipoUser;
        if (statusConta) filter.statusUser = statusConta;
        return await this.prisma.usuario.findUnique(
            {
                where: {userID:id_user},
                select: {
                    userID: true,
                    userNome: true,
                    userEmail: true,
                    criadoDate: true,
                    fotoUrl: true,
                    statusUser: true,
                    tipoUser: true,
                    ti: true,
                    docente: true,
                    adm: true
                }
            }
        )

    }    
    // async updateStatusConta(id_user:number, statusConta:StatusConta, tipoUser?:TipoUser){
    //     const filter:any ={}
    //     if(tipoUser) filter.tipoUser = tipoUser
    //     try{
    //         return await this.prisma.usuario.update({
    //         where:{userID: id_user},
    //         data:{
    //             statusUser: statusConta,
    //             tipoUser: tipoUser
    //         }
    //     })
    //     }catch(erro){
    //         return erro
    //     }

    // }
    async updateStatusConta(id_user: number, statusConta: StatusConta, novoTipoUser?: TipoUser) {
    return await this.prisma.$transaction(async (tx) => {
        const currentUser = await tx.usuario.findUnique({
            where: { userID: id_user },
            select: { tipoUser: true }
        });
        if (novoTipoUser && currentUser && currentUser.tipoUser !== novoTipoUser) {
            const oldType = currentUser.tipoUser.toLowerCase();
            // @ts-ignore
            await tx[oldType].deleteMany({
                where: { fk_userID: id_user }
            });

            const newType = novoTipoUser.toLowerCase();
            // @ts-ignore
            await tx[newType].create({
                data: { fk_userID: id_user }
            });
        }

        return await tx.usuario.update({
            where: { userID: id_user },
            data: {
                statusUser: statusConta,
                tipoUser: novoTipoUser || currentUser?.tipoUser
            },
            include: { docente: true, ti: true, adm: true }
        });
    });
    }

    


    private async sendInvitation(email:string, userType: TipoUser){
        const mailService = new MailService();
        const user = await this.findUserByEmail(email)
        try{
            if(user?.statusUser === StatusConta.ATIVA){
                const resMailSend = await mailService.sendInvitation(email, userType, user.userNome)
                return resMailSend
            }
            const resMailSend = await mailService.sendInvitation(email,userType)
            return resMailSend
        }catch(error){
            throw error
        }
    }

}