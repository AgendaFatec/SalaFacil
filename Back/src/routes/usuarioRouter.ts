import { Route, Tags, Controller, Get, Request, Path, Res, Security,Delete } from "tsoa";
import { UsuariosController } from "@/controllers/usuarioController.js";
import { UsuariosService } from "@/services/user/usuariosService.js";
import { PrismaService } from "@/database/database.js";
import type { TsoaResponse } from "tsoa";

@Route("Usuarios")
@Tags("Usuarios")
export class UsuariosRouter extends Controller {
    private readonly usuariosController: UsuariosController;

    constructor() {
        super();
        const prismaService = new PrismaService();
        const usuariosService = new UsuariosService(prismaService);
        this.usuariosController = new UsuariosController(usuariosService);
    }
    @Security("jwt",['ADM','DOCENTE','TI'])
    @Get("me")
    public async getMe(@Request() req: any): Promise<any> {
        return await this.usuariosController.handleGetMe(req.user.sub);
    }


    @Security("jwt", ['ADM','DOCENTE','TI'])
    @Get("foto/{userId}")
    public async getFoto(
        @Path() userId: number,
        @Res() notFound: TsoaResponse<404, { msg: string }>
    ): Promise<any> {
        const foto = await this.usuariosController.handleGetPhoto(userId);
        // console.log(typeof(foto))

        if (!foto) {
            return notFound(404, { msg: "Usuário sem foto cadastrada." });
        }

        this.setHeader("Content-Type", "image/jpeg");
        this.setHeader("Cache-Control", "public, max-age=3600"); 
        return foto;
    }


    @Security("jwt", ['ADM'])
    @Get("list-users")
    public async listAll() {
        // return {msg: "Teste"}
        return await this.usuariosController.handleListAll();
    }

    @Security("jwt", ['ADM'])
    @Delete("delete-user/{userId}")
    public async deleteUser(@Path() userId: number) {
        return await this.usuariosController.handleDelete(userId);
    }
}