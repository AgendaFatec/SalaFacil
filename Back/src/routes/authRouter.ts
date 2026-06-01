import { Route, Tags, Post, Body, Controller, SuccessResponse, Res, Get,Request as TsoaRequest, Request, Response, Path} from "tsoa";

import type { TsoaResponse } from "tsoa";
import passport from "passport";
import type{ IMicrosoftProfile } from "../interfaces/microsoft/IMicrosoftProfile.js";

import type{ Request as ExRequest, Response as ExResponse } from "express";

//Arvore de dependencia:
import { AuthController } from "@/controllers/authController.js";
import { AuthService } from "@/services/authService.js";
import { PrismaService } from "@/database/database.js";
import { resolve } from "node:dns";
import { any, regex } from "zod";
import { get, request } from "node:http";
import { tr } from "zod/locales";
import { Result } from "pg";


const prismaService = new PrismaService();
const authService = new AuthService(prismaService);
const authController = new AuthController(authService)



@Route("Auth")
@Tags("autenticacao")
export class AuthRouter extends Controller{

    @Get("login")
    public async login(
        @Request() req:any,
        // @Res() res:TsoaResponse<201, {msg: string}>
    ):Promise<void>{
        return new Promise((resolve, reject)=>{
            passport.authenticate('azuread-openidconnect', {prompt:'select_account'})(req, req.res, (err:any)=>{
            if (err) {
                console.log(err)
                return reject(err);
                // return res(201, {msg: err.msg})
            }
            resolve()
        });
        })
    }


    @Get("callback")
    @SuccessResponse("200", "Autenticado")
    public async handleCallback(
        // @Body() profile: IMicrosoftProfile,
        @Request() req:any,
        @Res() errorRes: TsoaResponse<500, {error: string}>

    ) {
        return new Promise((resolve, reject) => {
        passport.authenticate('azuread-openidconnect', { session: false }, async (err: any, profile: IMicrosoftProfile) => {
            if (err || !profile) {
                return reject(errorRes(500, { error: "Falha na autenticação Microsoft" }));
            }
            try {

                const result =await authController.handleCallBack(profile);
                
                req.session.userId = result.user.userID;
                req.session.nome = result.user.userNome;
                req.session.fotoUrl = result.user.fotoUrl;
                // console.log(`\n\n\n${result.token_jwt}\n\n`)
                // console.log(req)


                // console.log(`${req.session.nome}\n\n${req.session.userId}\n\nComeça aqui: ${req.session.fotoUrl} <-Termina Aqui`)
                // return req.res.redirect(`/api-docs?token=${result.token_jwt}`);
                const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
                console.log(`\n\n ${result.token_jwt}\n\n`)
                console.log(`${frontendUrl}`)
                return req.res.redirect(`${frontendUrl}/login?token=${result.token_jwt}`);

            } catch (error: any) {
                return reject(errorRes(500, { error: error.message }));
            }
        })(req, req.res); // Passamos o req/res do Express para o Passport trabalhar
    });
        // try {
        //     const profile = req.user as IMicrosoftProfile
                
        //     await authController.handleCallBack(profile);
            
        //     return req.res.redirect('/api-docs') 
        // } catch (error: any) {
        //     console.log("erro no processamento de login:", error.message)
        //     return errorRes(500, { error: error.message });

        //     // throw error
        //     // return req.res.redirect('/login?error=access_denied')

        // }
    }

    @Get("refresh")
    @SuccessResponse("200", "TokenRenovado")
    public async refresh(
        @Request() req:any,
        @Res() unauthorizedRes: TsoaResponse<401, {error: string}>
    ):Promise<{accessToken:string}>{
        const userId =req.session?.userId;

        if(!userId){
            return unauthorizedRes(401, {error:"Sessão expirada ou invalida"})
        }
        try{
            const newToken = await authController.handleRefreshToken(userId);
            // console.log(newToken.token_jwt)
            return {accessToken: newToken.token_jwt}
        }catch(error:any){
            return unauthorizedRes(401, {error:"Não foi possivel renovar o token"})
        }
    }

    @Get("user-photo/{userId}")
    public async getUserPhoto(
        @Path() userId: number,
        @Res() notFoundRes: TsoaResponse<404, { msg: string }>
    ): Promise<any> {
        const user = await prismaService.usuario.findUnique({
            where: { userID: userId },
            select: { fotoUrl: true }
        });

        if (!user || !user.fotoUrl) {
            return notFoundRes(404, { msg: "Foto não encontrada" });
        }
        const base64Data = user.fotoUrl.replace(/^data:image\/\w+;base64,/, "");
        const imgBuffer = Buffer.from(base64Data, 'base64');
        this.setHeader("Content-Type", "image/jpeg"); 
        return imgBuffer;
    }

    @Get("logout")
        public async logout(@Request() req: any) {
        req.session.destroy((err: any) => {
            if (err) console.error("Erro ao destruir sessão:", err);
        });
        req.res.clearCookie("connect.sid"); 
        return { message: "Logout realizado com sucesso" };
    }
}