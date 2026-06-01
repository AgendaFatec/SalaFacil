import { TipoUser } from "@prisma/client";
import * as nodemailer from "nodemailer"
// src/utils/mailService.ts
import { BrevoClient, BrevoEnvironment } from "@getbrevo/brevo";
import 'dotenv/config';

export class MailService {
  private client: BrevoClient;
  private linkAcessoLogin: string;
  private senderEmail: string;

  constructor() {
    this.linkAcessoLogin = process.env.FRONTEND_URL || 'http://localhost:5173';
    this.senderEmail = process.env.MAIL_USER || 'wwluiza.09@gmail.com';

    this.client = new BrevoClient({
      apiKey: process.env.BREVO_KEY || '',
      environment: BrevoEnvironment.Default,
    });
  }

  async sendInvitation(email: string, tipoUser: TipoUser, userName?: string | null): Promise<void> {
    const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #005C6D;">Olá, ${userName ? userName : 'Usuário'}!</h2>
        <p style="font-size: 16px; color: #333;">Você foi convidado para ter acesso ao sistema de inventário e agendamento de salas <strong>Sala-Fácil</strong> como: <span style="color: #B20000; font-weight: bold;">${tipoUser}</span>.</p>
        <p style="font-size: 16px; color: #333;">Clique no botão abaixo para acessar o sistema e realizar seu login corporativo:</p>
        <div style="text-align: center; margin: 30px 0;">
            <a href="${this.linkAcessoLogin}/login" 
               style="background-color: #005C6D; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
               Acessar página de login
            </a>
        </div>
        <hr style="border: 0; border-top: 1px solid #e0e0e0;" />
        <small style="color: #777;">Se você não reconhece esta operação, por favor ignore este e-mail.</small>
    </div>
    `;

    try {
      // Método oficial da biblioteca para e-mails transacionais
      await this.client.transactionalEmails.sendTransacEmail({
        subject: 'Convite de Acesso - Sistema Sala-Fácil',
        to: [{ 
          email: email, 
          name: userName || "Usuário Convidado" 
        }],
        sender: { 
          name: 'Sala-Fácil FATEC', 
          email: this.senderEmail 
        },
        htmlContent: htmlBody,
      });

      console.log(`✅ [MailService] Convite enviado com sucesso via SDK Brevo para: ${email}`);
    } catch (error: any) {
      console.error('❌ [MailService] Erro no SDK do Brevo:', error);
      throw new Error(`Não foi possível enviar o e-mail: ${error.message}`);
    }
  }
}
// export class MailService{
//     private transporter;
//     private linkAcessoLogin;
//     constructor(){
//         this.linkAcessoLogin = process.env.FRONTEND_URL,
//         this.transporter = nodemailer.createTransport({
//             host: process.env.MAIL_HOST,
//             port: Number(process.env.MAIL_PORT),
//             secure:false,
//             auth:{
//                 user:process.env.MAIL_USER,
//                 pass: process.env.MAIL_PASS,
//             },
//             tls: {
//                 rejectUnauthorized: false 
//             }
//         })
//     }
//     async sendInvitation(email:string,tipoUser:TipoUser,userName?:string|null){
//         const htmlBody=`
//         <div style="font-family: Arial, sans-serif; max-width: 600px;">
//             <h2>Olá, ${userName ? userName : 'Usuário'} de emai: ${email}!</h2>
//             <p>Você foi convidado para ter acesso ao sistema de inventário e agendamento de salas como: ${tipoUser}</p>
//             <p>Clique no botão abaixo para prosseguir e realizar o primeiro Login:</p>
//             <a href="${this.linkAcessoLogin}/login" 
//             style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
//             Acessar página de login.
//             </a>
//             <hr />
//             <small>Se você não solicitou isso, ignore este e-mail.</small>
//         </div>
//         `;
//         try{
//             const resutaldoInvitation = await this.transporter.sendMail({
//                 from:'"Sistema de inventário e reserva de sala\nSala-Fácil\n"<no-reply@suaapp.com>',
//                 to:email,
//                 subject:'Contive de boas vindas',
//                 html:htmlBody
//             })
//             return resutaldoInvitation
//         }catch(error){
//             throw new Error(`Falha ao enviar e-mail\n${error}`);
//         }

//     }

// }
