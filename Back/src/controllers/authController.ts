import { Controller, Request, Response } from "tsoa";
import { AuthService } from "../services/authService.js";
import { IMicrosoftProfile } from "../interfaces/microsoft/IMicrosoftProfile.js";


export class AuthController extends Controller{

    constructor(private authService:AuthService){
        //força a inicialização do construtor do service
        //basicamente esta classe, em seu construtor diz para ao objeto instanciado: authService para instanciar seu objeto de qualquer maneira
        super();
    }
    // private authService = new AuthService();
    
    async handleCallBack(profile: IMicrosoftProfile){
        return await this.authService.loginGenerateToken(profile)
        // return await this.authService.findAndValidate(profile)
    }
    async handleRefreshToken(userId:number){
        return await this.authService.refresUserToken(userId)
    }
    
}