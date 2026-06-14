import 'dotenv/config';
import express, { Response as ExResponse, Request as ExRequest } from 'express';
import passport from 'passport';
import session from 'express-session';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { RegisterRoutes } from './routes/routes.js'; 
import './config/passportConfig.js'; 
// import { IMicrosoftProfile } from './interfaces/microsoft/IMicrosoftProfile.js';
// import { AuthController } from './controllers/authController.js';
import { PrismaService } from './database/database.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

import cors from "cors"



// const prismaService = new PrismaService();
// prismaService.connect();

const app = express();
const isProduction = process.env.NODE_ENV === 'production';
if (isProduction) {
  app.set('trust proxy', 1);
}

const allowedOrigins = [
  '*',
  'http://localhost:4173',
  'http://localhost:5173',
  'https://front-end-pi-4-semestre-fq6w.vercel.app'

]
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}))

app.use(express.json());
app.use(morgan('dev'));

app.use(session({
    secret: process.env.SESSION_SECRET || 'secret_fatec',
    resave: false,
    // saveUninitialized: false,
    saveUninitialized: true,
    cookie:{
      secure: isProduction,

      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000,
      
      httpOnly:true
    }
}));

app.use(passport.initialize());
app.use(passport.session());


app.use("/api-docs", swaggerUi.serve, async (_req: ExRequest, res: ExResponse) => {
  try {
    const swaggerDocument = await import("./docs/swagger.json", { with: { type: "json" } });
    return res.send(swaggerUi.generateHTML(swaggerDocument.default));
  } catch (err) {
    return res.status(500).send("O arquivo swagger.json ainda não foi gerado.");
  }
});

const storage = multer.memoryStorage();
const upload = multer({ 
  storage, 
  limits: { fileSize: 5 * 1024 * 1024 } 
});


RegisterRoutes(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Servidor de Catalogação FATEC ativo!`);
  console.log(` API: http://localhost:${PORT}`);
  console.log(` LOgin: http://localhost:${PORT}/Auth/login`);
  console.log(` Documentação: $http://localhost:${PORT}/api-docs`);
});






// app.get('/Auth/login', passport.authenticate('azuread-openidconnect'));

// app.get('/Auth/callback', 
//     passport.authenticate('azuread-openidconnect', { session: false }),
//     async (req, res) => {
//         try {
//             const profile = req.user as IMicrosoftProfile;
//             await authController.handleCallBack(profile);
            
//             res.redirect('/dashboard');
//         } catch (error) {
//             console.error("Erro ao salvar no banco:", error);
//             res.status(500).send("Erro interno ao processar login.");
//         }
//     }
// );
