/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import {  fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { UsuariosRouter } from './usuarioRouter.js';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { TecnologiaRouter } from './tecnologiaRouter.js';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { InventarioRouter } from './inventarioRouter.js';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { DispositivoRouter } from './dispositivoRouter.js';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { CoordeandorRouter } from './coordenadorRouter.js';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ChamadaRouter } from './chamadaRouter.js';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AuthRouter } from './authRouter.js';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AgendamentoRouter } from './agendamentoRouter.js';
import { expressAuthentication } from './../auth/authentication.js';
// @ts-ignore - no great way to install types from subpackage
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';
import multer from 'multer';


const expressAuthenticationRecasted = expressAuthentication as (req: ExRequest, securityName: string, scopes?: string[], res?: ExResponse) => Promise<any>;


// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "Tecnologia": {
        "dataType": "refObject",
        "properties": {
            "idTecnologia": {"dataType":"double","required":true},
            "nomeTecnologia": {"dataType":"string","required":true},
            "descricao": {"dataType":"string"},
            "dataCriacao": {"dataType":"datetime","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateTecnologia": {
        "dataType": "refObject",
        "properties": {
            "nomeTecnologia": {"dataType":"string","required":true},
            "descricao": {"dataType":"string"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateTecnologia": {
        "dataType": "refObject",
        "properties": {
            "nomeTecnologia": {"dataType":"string"},
            "descricao": {"dataType":"string"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Inventario": {
        "dataType": "refObject",
        "properties": {
            "idInventario": {"dataType":"double","required":true},
            "salaId": {"dataType":"double","required":true},
            "salaNome": {"dataType":"string"},
            "capacidadeAlunos": {"dataType":"double"},
            "fotoSala": {"dataType":"array","array":{"dataType":"string"}},
            "statusInventario": {"dataType":"string","required":true},
            "dispositivos": {"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"quantidade":{"dataType":"double","required":true},"statusDispositivo":{"dataType":"string","required":true},"patrimonio":{"dataType":"string"},"tipoDispositivo":{"dataType":"string","required":true},"nomeDispositivo":{"dataType":"string","required":true},"idDispositivo":{"dataType":"double","required":true}}},"required":true},
            "tecnologias": {"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"descricao":{"dataType":"string"},"nomeTecnologia":{"dataType":"string","required":true},"idTecnologia":{"dataType":"double","required":true}}},"required":true},
            "criadoEm": {"dataType":"datetime","required":true},
            "atualizadoEm": {"dataType":"datetime","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateInventario": {
        "dataType": "refObject",
        "properties": {
            "salaId": {"dataType":"double","required":true},
            "dispositivoIds": {"dataType":"array","array":{"dataType":"double"}},
            "tecnologiaIds": {"dataType":"array","array":{"dataType":"double"}},
            "statusInventario": {"dataType":"string"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SalasComInventario": {
        "dataType": "refObject",
        "properties": {
            "idSala": {"dataType":"double","required":true},
            "nomeSala": {"dataType":"string","required":true},
            "tipoSala": {"dataType":"string","required":true},
            "capacidadeAlunos": {"dataType":"double"},
            "fotoSala": {"dataType":"array","array":{"dataType":"string"}},
            "disponibilidadeSala": {"dataType":"boolean","required":true},
            "inventario": {"dataType":"nestedObjectLiteral","nestedProperties":{"tecnologias":{"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"nomeTecnologia":{"dataType":"string","required":true},"idTecnologia":{"dataType":"double","required":true}}},"required":true},"dispositivos":{"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"status":{"dataType":"array","array":{"dataType":"string"}},"patrimonios":{"dataType":"array","array":{"dataType":"string"}},"nomes":{"dataType":"array","array":{"dataType":"string"},"required":true},"quantidade":{"dataType":"double","required":true},"tipoDispositivo":{"dataType":"string","required":true}}},"required":true},"idInventario":{"dataType":"double","required":true}},"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DispositivoUpdateDTO": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double"},
            "nome": {"dataType":"string"},
            "quantidade": {"dataType":"double","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TecnologiaUpdateDTO": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double"},
            "nome": {"dataType":"string"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateInventario": {
        "dataType": "refObject",
        "properties": {
            "statusInventario": {"dataType":"string"},
            "dispositivos": {"dataType":"array","array":{"dataType":"refObject","ref":"DispositivoUpdateDTO"}},
            "tecnologias": {"dataType":"array","array":{"dataType":"refObject","ref":"TecnologiaUpdateDTO"}},
            "tecnologiaIds": {"dataType":"array","array":{"dataType":"double"}},
            "capacidadeAlunos": {"dataType":"double"},
            "fotoSala": {"dataType":"array","array":{"dataType":"string"}},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Dispositivo": {
        "dataType": "refObject",
        "properties": {
            "idDispositivo": {"dataType":"double","required":true},
            "nomeDispositivo": {"dataType":"string","required":true},
            "tipoDispositivo": {"dataType":"string","required":true},
            "patrimonio": {"dataType":"string"},
            "statusDispositivo": {"dataType":"string","required":true},
            "dataCriacao": {"dataType":"datetime","required":true},
            "dataAtualizacao": {"dataType":"datetime","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateDispositivo": {
        "dataType": "refObject",
        "properties": {
            "nomeDispositivo": {"dataType":"string","required":true},
            "tipoDispositivo": {"dataType":"string","required":true},
            "patrimonio": {"dataType":"string"},
            "statusDispositivo": {"dataType":"string"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateDispositivo": {
        "dataType": "refObject",
        "properties": {
            "nomeDispositivo": {"dataType":"string"},
            "tipoDispositivo": {"dataType":"string"},
            "patrimonio": {"dataType":"string"},
            "statusDispositivo": {"dataType":"string"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AtualizarInventarioPayload": {
        "dataType": "refObject",
        "properties": {
            "dispositivo": {"dataType":"nestedObjectLiteral","nestedProperties":{"statusDispositivo":{"dataType":"string"},"patrimonio":{"dataType":"string"},"tipoDispositivo":{"dataType":"string","required":true},"nomeDispositivo":{"dataType":"string","required":true},"idDispositivo":{"dataType":"double"}},"required":true},
            "inventario": {"dataType":"nestedObjectLiteral","nestedProperties":{"data":{"dataType":"nestedObjectLiteral","nestedProperties":{"tecnologiaIds":{"dataType":"array","array":{"dataType":"double"}},"salaId":{"dataType":"double","required":true},"id":{"dataType":"double"}},"required":true},"type":{"dataType":"union","subSchemas":[{"dataType":"enum","enums":["create"]},{"dataType":"enum","enums":["update"]}],"required":true}},"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "_36_Enums.TipoUser": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["DOCENTE"]},{"dataType":"enum","enums":["TI"]},{"dataType":"enum","enums":["ADM"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TipoUser": {
        "dataType": "refAlias",
        "type": {"ref":"_36_Enums.TipoUser","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateUser": {
        "dataType": "refObject",
        "properties": {
            "email": {"dataType":"string","required":true},
            "tipoUser": {"ref":"TipoUser","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "_36_Enums.StatusConta": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["DESATIVADA"]},{"dataType":"enum","enums":["ATIVA"]},{"dataType":"enum","enums":["CONVIDADA"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "StatusConta": {
        "dataType": "refAlias",
        "type": {"ref":"_36_Enums.StatusConta","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TecnologiaSolicitadaPayload": {
        "dataType": "refObject",
        "properties": {
            "nome": {"dataType":"string","required":true},
            "versao": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateChamadaRequest": {
        "dataType": "refObject",
        "properties": {
            "salaId": {"dataType":"double","required":true},
            "usuarioId": {"dataType":"double","required":true},
            "dispositivoId": {"dataType":"double"},
            "dispositivo": {"dataType":"string"},
            "patrimonio": {"dataType":"string"},
            "tipoProblema": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["Hardware"]},{"dataType":"enum","enums":["Software"]}],"required":true},
            "descricao": {"dataType":"string"},
            "anexos": {"dataType":"string"},
            "tecnologias": {"dataType":"array","array":{"dataType":"refObject","ref":"TecnologiaSolicitadaPayload"}},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "_36_Enums.ChamadaStatus": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["ABERTO"]},{"dataType":"enum","enums":["EM_ATENDIMENTO"]},{"dataType":"enum","enums":["RESOLVIDO"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ChamadaStatus": {
        "dataType": "refAlias",
        "type": {"ref":"_36_Enums.ChamadaStatus","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateStatusRequest": {
        "dataType": "refObject",
        "properties": {
            "status": {"ref":"ChamadaStatus","required":true},
            "tecnicoId": {"dataType":"double","required":true},
            "acoesRealizadas": {"dataType":"string"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Agendamento": {
        "dataType": "refObject",
        "properties": {
            "idAgendamento": {"dataType":"double","required":true},
            "salaId": {"dataType":"double","required":true},
            "salaNome": {"dataType":"string"},
            "usuarioId": {"dataType":"double"},
            "dataAgendamento": {"dataType":"datetime","required":true},
            "horaInicio": {"dataType":"string","required":true},
            "horaFim": {"dataType":"string","required":true},
            "descricao": {"dataType":"string"},
            "statusAgendamento": {"dataType":"string","required":true},
            "criadoEm": {"dataType":"datetime","required":true},
            "atualizadoEm": {"dataType":"datetime","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateAgendamento": {
        "dataType": "refObject",
        "properties": {
            "salaId": {"dataType":"double","required":true},
            "usuarioId": {"dataType":"double"},
            "dataAgendamento": {"dataType":"datetime","required":true},
            "horaInicio": {"dataType":"string","required":true},
            "horaFim": {"dataType":"string","required":true},
            "descricao": {"dataType":"string"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SolicitarReserva": {
        "dataType": "refObject",
        "properties": {
            "salaId": {"dataType":"double","required":true},
            "usuarioId": {"dataType":"double","required":true},
            "dataAgendamento": {"dataType":"datetime","required":true},
            "horaInicio": {"dataType":"string","required":true},
            "horaFim": {"dataType":"string","required":true},
            "descricao": {"dataType":"string"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateAgendamento": {
        "dataType": "refObject",
        "properties": {
            "salaId": {"dataType":"double"},
            "dataAgendamento": {"dataType":"datetime"},
            "horaInicio": {"dataType":"string"},
            "horaFim": {"dataType":"string"},
            "descricao": {"dataType":"string"},
            "statusAgendamento": {"dataType":"string"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {"noImplicitAdditionalProperties":"ignore","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa




export function RegisterRoutes(app: Router,opts?:{multer?:ReturnType<typeof multer>}) {

    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################

    const upload = opts?.multer ||  multer({"limits":{"fileSize":8388608}});

    
        const argsUsuariosRouter_getMe: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.get('/Usuarios/me',
            authenticateMiddleware([{"jwt":["ADM","DOCENTE","TI"]}]),
            ...(fetchMiddlewares<RequestHandler>(UsuariosRouter)),
            ...(fetchMiddlewares<RequestHandler>(UsuariosRouter.prototype.getMe)),

            async function UsuariosRouter_getMe(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUsuariosRouter_getMe, request, response });

                const controller = new UsuariosRouter();

              await templateService.apiHandler({
                methodName: 'getMe',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUsuariosRouter_getFoto: Record<string, TsoaRoute.ParameterSchema> = {
                userId: {"in":"path","name":"userId","required":true,"dataType":"double"},
                notFound: {"in":"res","name":"404","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"msg":{"dataType":"string","required":true}}},
        };
        app.get('/Usuarios/foto/:userId',
            authenticateMiddleware([{"jwt":["ADM","DOCENTE","TI"]}]),
            ...(fetchMiddlewares<RequestHandler>(UsuariosRouter)),
            ...(fetchMiddlewares<RequestHandler>(UsuariosRouter.prototype.getFoto)),

            async function UsuariosRouter_getFoto(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUsuariosRouter_getFoto, request, response });

                const controller = new UsuariosRouter();

              await templateService.apiHandler({
                methodName: 'getFoto',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUsuariosRouter_listAll: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/Usuarios/list-users',
            authenticateMiddleware([{"jwt":["ADM"]}]),
            ...(fetchMiddlewares<RequestHandler>(UsuariosRouter)),
            ...(fetchMiddlewares<RequestHandler>(UsuariosRouter.prototype.listAll)),

            async function UsuariosRouter_listAll(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUsuariosRouter_listAll, request, response });

                const controller = new UsuariosRouter();

              await templateService.apiHandler({
                methodName: 'listAll',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUsuariosRouter_deleteUser: Record<string, TsoaRoute.ParameterSchema> = {
                userId: {"in":"path","name":"userId","required":true,"dataType":"double"},
        };
        app.delete('/Usuarios/delete-user/:userId',
            authenticateMiddleware([{"jwt":["ADM"]}]),
            ...(fetchMiddlewares<RequestHandler>(UsuariosRouter)),
            ...(fetchMiddlewares<RequestHandler>(UsuariosRouter.prototype.deleteUser)),

            async function UsuariosRouter_deleteUser(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUsuariosRouter_deleteUser, request, response });

                const controller = new UsuariosRouter();

              await templateService.apiHandler({
                methodName: 'deleteUser',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTecnologiaRouter_criarTecnologia: Record<string, TsoaRoute.ParameterSchema> = {
                tecnologia: {"in":"body","name":"tecnologia","required":true,"ref":"CreateTecnologia"},
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.post('/tecnologias',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(TecnologiaRouter)),
            ...(fetchMiddlewares<RequestHandler>(TecnologiaRouter.prototype.criarTecnologia)),

            async function TecnologiaRouter_criarTecnologia(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTecnologiaRouter_criarTecnologia, request, response });

                const controller = new TecnologiaRouter();

              await templateService.apiHandler({
                methodName: 'criarTecnologia',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTecnologiaRouter_listarTecnologias: Record<string, TsoaRoute.ParameterSchema> = {
                pagina: {"in":"query","name":"pagina","dataType":"double"},
                limite: {"in":"query","name":"limite","dataType":"double"},
                busca: {"in":"query","name":"busca","dataType":"string"},
        };
        app.get('/tecnologias',
            ...(fetchMiddlewares<RequestHandler>(TecnologiaRouter)),
            ...(fetchMiddlewares<RequestHandler>(TecnologiaRouter.prototype.listarTecnologias)),

            async function TecnologiaRouter_listarTecnologias(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTecnologiaRouter_listarTecnologias, request, response });

                const controller = new TecnologiaRouter();

              await templateService.apiHandler({
                methodName: 'listarTecnologias',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTecnologiaRouter_obterTecnologia: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
        };
        app.get('/tecnologias/:id',
            ...(fetchMiddlewares<RequestHandler>(TecnologiaRouter)),
            ...(fetchMiddlewares<RequestHandler>(TecnologiaRouter.prototype.obterTecnologia)),

            async function TecnologiaRouter_obterTecnologia(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTecnologiaRouter_obterTecnologia, request, response });

                const controller = new TecnologiaRouter();

              await templateService.apiHandler({
                methodName: 'obterTecnologia',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTecnologiaRouter_atualizarTecnologia: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
                tecnologia: {"in":"body","name":"tecnologia","required":true,"ref":"UpdateTecnologia"},
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.put('/tecnologias/:id',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(TecnologiaRouter)),
            ...(fetchMiddlewares<RequestHandler>(TecnologiaRouter.prototype.atualizarTecnologia)),

            async function TecnologiaRouter_atualizarTecnologia(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTecnologiaRouter_atualizarTecnologia, request, response });

                const controller = new TecnologiaRouter();

              await templateService.apiHandler({
                methodName: 'atualizarTecnologia',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTecnologiaRouter_deletarTecnologia: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.delete('/tecnologias/:id',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(TecnologiaRouter)),
            ...(fetchMiddlewares<RequestHandler>(TecnologiaRouter.prototype.deletarTecnologia)),

            async function TecnologiaRouter_deletarTecnologia(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTecnologiaRouter_deletarTecnologia, request, response });

                const controller = new TecnologiaRouter();

              await templateService.apiHandler({
                methodName: 'deletarTecnologia',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsInventarioRouter_criarInventario: Record<string, TsoaRoute.ParameterSchema> = {
                inventario: {"in":"body","name":"inventario","required":true,"ref":"CreateInventario"},
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.post('/inventarios',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(InventarioRouter)),
            ...(fetchMiddlewares<RequestHandler>(InventarioRouter.prototype.criarInventario)),

            async function InventarioRouter_criarInventario(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsInventarioRouter_criarInventario, request, response });

                const controller = new InventarioRouter();

              await templateService.apiHandler({
                methodName: 'criarInventario',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsInventarioRouter_listarInventarios: Record<string, TsoaRoute.ParameterSchema> = {
                pagina: {"in":"query","name":"pagina","dataType":"double"},
                limite: {"in":"query","name":"limite","dataType":"double"},
                status: {"in":"query","name":"status","dataType":"string"},
                Search_Sala: {"in":"query","name":"Search_Sala","dataType":"string"},
        };
        app.get('/inventarios',
            ...(fetchMiddlewares<RequestHandler>(InventarioRouter)),
            ...(fetchMiddlewares<RequestHandler>(InventarioRouter.prototype.listarInventarios)),

            async function InventarioRouter_listarInventarios(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsInventarioRouter_listarInventarios, request, response });

                const controller = new InventarioRouter();

              await templateService.apiHandler({
                methodName: 'listarInventarios',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsInventarioRouter_buscaPorPalavraChave: Record<string, TsoaRoute.ParameterSchema> = {
                busca: {"in":"query","name":"busca","required":true,"dataType":"string"},
                pagina: {"in":"query","name":"pagina","dataType":"double"},
                limite: {"in":"query","name":"limite","dataType":"double"},
        };
        app.get('/inventarios/busca/palavraChave',
            ...(fetchMiddlewares<RequestHandler>(InventarioRouter)),
            ...(fetchMiddlewares<RequestHandler>(InventarioRouter.prototype.buscaPorPalavraChave)),

            async function InventarioRouter_buscaPorPalavraChave(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsInventarioRouter_buscaPorPalavraChave, request, response });

                const controller = new InventarioRouter();

              await templateService.apiHandler({
                methodName: 'buscaPorPalavraChave',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsInventarioRouter_obterInventarioPorSala: Record<string, TsoaRoute.ParameterSchema> = {
                salaId: {"in":"path","name":"salaId","required":true,"dataType":"double"},
        };
        app.get('/inventarios/sala/:salaId',
            ...(fetchMiddlewares<RequestHandler>(InventarioRouter)),
            ...(fetchMiddlewares<RequestHandler>(InventarioRouter.prototype.obterInventarioPorSala)),

            async function InventarioRouter_obterInventarioPorSala(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsInventarioRouter_obterInventarioPorSala, request, response });

                const controller = new InventarioRouter();

              await templateService.apiHandler({
                methodName: 'obterInventarioPorSala',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsInventarioRouter_obterInventario: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
        };
        app.get('/inventarios/:id',
            ...(fetchMiddlewares<RequestHandler>(InventarioRouter)),
            ...(fetchMiddlewares<RequestHandler>(InventarioRouter.prototype.obterInventario)),

            async function InventarioRouter_obterInventario(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsInventarioRouter_obterInventario, request, response });

                const controller = new InventarioRouter();

              await templateService.apiHandler({
                methodName: 'obterInventario',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsInventarioRouter_atualizarInventario: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
                inventario: {"in":"body","name":"inventario","required":true,"ref":"UpdateInventario"},
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.put('/inventarios/:id',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(InventarioRouter)),
            ...(fetchMiddlewares<RequestHandler>(InventarioRouter.prototype.atualizarInventario)),

            async function InventarioRouter_atualizarInventario(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsInventarioRouter_atualizarInventario, request, response });

                const controller = new InventarioRouter();

              await templateService.apiHandler({
                methodName: 'atualizarInventario',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsInventarioRouter_deletarInventario: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.delete('/inventarios/:id',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(InventarioRouter)),
            ...(fetchMiddlewares<RequestHandler>(InventarioRouter.prototype.deletarInventario)),

            async function InventarioRouter_deletarInventario(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsInventarioRouter_deletarInventario, request, response });

                const controller = new InventarioRouter();

              await templateService.apiHandler({
                methodName: 'deletarInventario',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsInventarioRouter_uploadFoto: Record<string, TsoaRoute.ParameterSchema> = {
                file: {"in":"formData","name":"file","required":true,"dataType":"file"},
        };
        app.post('/inventarios/upload',
            authenticateMiddleware([{"jwt":[]}]),
            upload.fields([
                {
                    name: "file",
                    maxCount: 1
                }
            ]),
            ...(fetchMiddlewares<RequestHandler>(InventarioRouter)),
            ...(fetchMiddlewares<RequestHandler>(InventarioRouter.prototype.uploadFoto)),

            async function InventarioRouter_uploadFoto(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsInventarioRouter_uploadFoto, request, response });

                const controller = new InventarioRouter();

              await templateService.apiHandler({
                methodName: 'uploadFoto',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsDispositivoRouter_criarDispositivo: Record<string, TsoaRoute.ParameterSchema> = {
                dispositivo: {"in":"body","name":"dispositivo","required":true,"ref":"CreateDispositivo"},
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.post('/dispositivos',
            authenticateMiddleware([{"jwt":["TI"]}]),
            ...(fetchMiddlewares<RequestHandler>(DispositivoRouter)),
            ...(fetchMiddlewares<RequestHandler>(DispositivoRouter.prototype.criarDispositivo)),

            async function DispositivoRouter_criarDispositivo(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsDispositivoRouter_criarDispositivo, request, response });

                const controller = new DispositivoRouter();

              await templateService.apiHandler({
                methodName: 'criarDispositivo',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsDispositivoRouter_listarDispositivos: Record<string, TsoaRoute.ParameterSchema> = {
                pagina: {"in":"query","name":"pagina","dataType":"double"},
                limite: {"in":"query","name":"limite","dataType":"double"},
                tipo: {"in":"query","name":"tipo","dataType":"string"},
                status: {"in":"query","name":"status","dataType":"string"},
                busca: {"in":"query","name":"busca","dataType":"string"},
        };
        app.get('/dispositivos/list-devices',
            authenticateMiddleware([{"jwt":["TI"]}]),
            ...(fetchMiddlewares<RequestHandler>(DispositivoRouter)),
            ...(fetchMiddlewares<RequestHandler>(DispositivoRouter.prototype.listarDispositivos)),

            async function DispositivoRouter_listarDispositivos(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsDispositivoRouter_listarDispositivos, request, response });

                const controller = new DispositivoRouter();

              await templateService.apiHandler({
                methodName: 'listarDispositivos',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsDispositivoRouter_obterDispositivo: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
        };
        app.get('/dispositivos/get-device/:id',
            authenticateMiddleware([{"jwt":["TI"]}]),
            ...(fetchMiddlewares<RequestHandler>(DispositivoRouter)),
            ...(fetchMiddlewares<RequestHandler>(DispositivoRouter.prototype.obterDispositivo)),

            async function DispositivoRouter_obterDispositivo(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsDispositivoRouter_obterDispositivo, request, response });

                const controller = new DispositivoRouter();

              await templateService.apiHandler({
                methodName: 'obterDispositivo',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsDispositivoRouter_atualizarDispositivo: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
                dispositivo: {"in":"body","name":"dispositivo","required":true,"ref":"UpdateDispositivo"},
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.put('/dispositivos/update-device/:id',
            authenticateMiddleware([{"jwt":["TI"]}]),
            ...(fetchMiddlewares<RequestHandler>(DispositivoRouter)),
            ...(fetchMiddlewares<RequestHandler>(DispositivoRouter.prototype.atualizarDispositivo)),

            async function DispositivoRouter_atualizarDispositivo(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsDispositivoRouter_atualizarDispositivo, request, response });

                const controller = new DispositivoRouter();

              await templateService.apiHandler({
                methodName: 'atualizarDispositivo',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsDispositivoRouter_deletarDispositivo: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.delete('/dispositivos/delete-device/:id',
            authenticateMiddleware([{"jwt":["TI"]}]),
            ...(fetchMiddlewares<RequestHandler>(DispositivoRouter)),
            ...(fetchMiddlewares<RequestHandler>(DispositivoRouter.prototype.deletarDispositivo)),

            async function DispositivoRouter_deletarDispositivo(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsDispositivoRouter_deletarDispositivo, request, response });

                const controller = new DispositivoRouter();

              await templateService.apiHandler({
                methodName: 'deletarDispositivo',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsDispositivoRouter_atualizarInventarioCompleto: Record<string, TsoaRoute.ParameterSchema> = {
                payload: {"in":"body","name":"payload","required":true,"ref":"AtualizarInventarioPayload"},
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.post('/dispositivos/atualizar-inventario',
            authenticateMiddleware([{"jwt":["TI"]}]),
            ...(fetchMiddlewares<RequestHandler>(DispositivoRouter)),
            ...(fetchMiddlewares<RequestHandler>(DispositivoRouter.prototype.atualizarInventarioCompleto)),

            async function DispositivoRouter_atualizarInventarioCompleto(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsDispositivoRouter_atualizarInventarioCompleto, request, response });

                const controller = new DispositivoRouter();

              await templateService.apiHandler({
                methodName: 'atualizarInventarioCompleto',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCoordeandorRouter_handleCreateUser: Record<string, TsoaRoute.ParameterSchema> = {
                valuesUser: {"in":"body","name":"valuesUser","required":true,"ref":"CreateUser"},
                badRequest: {"in":"request","name":"badRequest","required":true,"dataType":"object"},
        };
        app.post('/Coordenacao/Criar_Usuario',
            authenticateMiddleware([{"jwt":["ADM"]}]),
            ...(fetchMiddlewares<RequestHandler>(CoordeandorRouter)),
            ...(fetchMiddlewares<RequestHandler>(CoordeandorRouter.prototype.handleCreateUser)),

            async function CoordeandorRouter_handleCreateUser(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCoordeandorRouter_handleCreateUser, request, response });

                const controller = new CoordeandorRouter();

              await templateService.apiHandler({
                methodName: 'handleCreateUser',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCoordeandorRouter_handleFindUsers: Record<string, TsoaRoute.ParameterSchema> = {
                errorRes: {"in":"res","name":"400","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"msg":{"dataType":"string","required":true}}},
                tipoUser: {"in":"query","name":"tipoUser","ref":"TipoUser"},
                statusConta: {"in":"query","name":"statusConta","ref":"StatusConta"},
        };
        app.get('/Coordenacao/listar',
            authenticateMiddleware([{"jwt":["ADM"]}]),
            ...(fetchMiddlewares<RequestHandler>(CoordeandorRouter)),
            ...(fetchMiddlewares<RequestHandler>(CoordeandorRouter.prototype.handleFindUsers)),

            async function CoordeandorRouter_handleFindUsers(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCoordeandorRouter_handleFindUsers, request, response });

                const controller = new CoordeandorRouter();

              await templateService.apiHandler({
                methodName: 'handleFindUsers',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCoordeandorRouter_handleFindUserById: Record<string, TsoaRoute.ParameterSchema> = {
                id_user: {"in":"path","name":"id_user","required":true,"dataType":"double"},
                errorRes: {"in":"res","name":"400","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"msg":{"dataType":"string","required":true}}},
                statusConta: {"in":"query","name":"statusConta","ref":"StatusConta"},
                tipoUser: {"in":"query","name":"tipoUser","ref":"TipoUser"},
        };
        app.get('/Coordenacao/find-by-id/:id_user',
            authenticateMiddleware([{"jwt":["ADM"]}]),
            ...(fetchMiddlewares<RequestHandler>(CoordeandorRouter)),
            ...(fetchMiddlewares<RequestHandler>(CoordeandorRouter.prototype.handleFindUserById)),

            async function CoordeandorRouter_handleFindUserById(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCoordeandorRouter_handleFindUserById, request, response });

                const controller = new CoordeandorRouter();

              await templateService.apiHandler({
                methodName: 'handleFindUserById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCoordeandorRouter_handleDesativarUser: Record<string, TsoaRoute.ParameterSchema> = {
                idUser: {"in":"query","name":"idUser","required":true,"dataType":"double"},
                errorRes: {"in":"res","name":"400","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"msg":{"dataType":"string","required":true}}},
                statusUser: {"in":"query","name":"statusUser","ref":"StatusConta"},
        };
        app.patch('/Coordenacao/desativa-user',
            authenticateMiddleware([{"jwt":["ADM"]}]),
            ...(fetchMiddlewares<RequestHandler>(CoordeandorRouter)),
            ...(fetchMiddlewares<RequestHandler>(CoordeandorRouter.prototype.handleDesativarUser)),

            async function CoordeandorRouter_handleDesativarUser(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCoordeandorRouter_handleDesativarUser, request, response });

                const controller = new CoordeandorRouter();

              await templateService.apiHandler({
                methodName: 'handleDesativarUser',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsChamadaRouter_criar: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"CreateChamadaRequest"},
        };
        app.post('/chamados',
            authenticateMiddleware([{"jwt":["TI","DOCENTE"]}]),
            ...(fetchMiddlewares<RequestHandler>(ChamadaRouter)),
            ...(fetchMiddlewares<RequestHandler>(ChamadaRouter.prototype.criar)),

            async function ChamadaRouter_criar(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsChamadaRouter_criar, request, response });

                const controller = new ChamadaRouter();

              await templateService.apiHandler({
                methodName: 'criar',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsChamadaRouter_listar: Record<string, TsoaRoute.ParameterSchema> = {
                status: {"in":"query","name":"status","ref":"ChamadaStatus"},
        };
        app.get('/chamados',
            authenticateMiddleware([{"jwt":["TI"]}]),
            ...(fetchMiddlewares<RequestHandler>(ChamadaRouter)),
            ...(fetchMiddlewares<RequestHandler>(ChamadaRouter.prototype.listar)),

            async function ChamadaRouter_listar(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsChamadaRouter_listar, request, response });

                const controller = new ChamadaRouter();

              await templateService.apiHandler({
                methodName: 'listar',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsChamadaRouter_listarChamadosDoUsuario: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                status: {"in":"query","name":"status","ref":"ChamadaStatus"},
        };
        app.get('/chamados/meus-chamados',
            authenticateMiddleware([{"jwt":["DOCENTE","TI"]}]),
            ...(fetchMiddlewares<RequestHandler>(ChamadaRouter)),
            ...(fetchMiddlewares<RequestHandler>(ChamadaRouter.prototype.listarChamadosDoUsuario)),

            async function ChamadaRouter_listarChamadosDoUsuario(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsChamadaRouter_listarChamadosDoUsuario, request, response });

                const controller = new ChamadaRouter();

              await templateService.apiHandler({
                methodName: 'listarChamadosDoUsuario',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsChamadaRouter_atualizarStatus: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
                body: {"in":"body","name":"body","required":true,"ref":"UpdateStatusRequest"},
        };
        app.put('/chamados/:id/status',
            authenticateMiddleware([{"jwt":["TI"]}]),
            ...(fetchMiddlewares<RequestHandler>(ChamadaRouter)),
            ...(fetchMiddlewares<RequestHandler>(ChamadaRouter.prototype.atualizarStatus)),

            async function ChamadaRouter_atualizarStatus(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsChamadaRouter_atualizarStatus, request, response });

                const controller = new ChamadaRouter();

              await templateService.apiHandler({
                methodName: 'atualizarStatus',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAuthRouter_login: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.get('/Auth/login',
            ...(fetchMiddlewares<RequestHandler>(AuthRouter)),
            ...(fetchMiddlewares<RequestHandler>(AuthRouter.prototype.login)),

            async function AuthRouter_login(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuthRouter_login, request, response });

                const controller = new AuthRouter();

              await templateService.apiHandler({
                methodName: 'login',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAuthRouter_handleCallback: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                errorRes: {"in":"res","name":"500","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"error":{"dataType":"string","required":true}}},
        };
        app.get('/Auth/callback',
            ...(fetchMiddlewares<RequestHandler>(AuthRouter)),
            ...(fetchMiddlewares<RequestHandler>(AuthRouter.prototype.handleCallback)),

            async function AuthRouter_handleCallback(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuthRouter_handleCallback, request, response });

                const controller = new AuthRouter();

              await templateService.apiHandler({
                methodName: 'handleCallback',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAuthRouter_refresh: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                unauthorizedRes: {"in":"res","name":"401","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"error":{"dataType":"string","required":true}}},
        };
        app.get('/Auth/refresh',
            ...(fetchMiddlewares<RequestHandler>(AuthRouter)),
            ...(fetchMiddlewares<RequestHandler>(AuthRouter.prototype.refresh)),

            async function AuthRouter_refresh(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuthRouter_refresh, request, response });

                const controller = new AuthRouter();

              await templateService.apiHandler({
                methodName: 'refresh',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAuthRouter_getUserPhoto: Record<string, TsoaRoute.ParameterSchema> = {
                userId: {"in":"path","name":"userId","required":true,"dataType":"double"},
                notFoundRes: {"in":"res","name":"404","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"msg":{"dataType":"string","required":true}}},
        };
        app.get('/Auth/user-photo/:userId',
            ...(fetchMiddlewares<RequestHandler>(AuthRouter)),
            ...(fetchMiddlewares<RequestHandler>(AuthRouter.prototype.getUserPhoto)),

            async function AuthRouter_getUserPhoto(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuthRouter_getUserPhoto, request, response });

                const controller = new AuthRouter();

              await templateService.apiHandler({
                methodName: 'getUserPhoto',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAuthRouter_logout: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.get('/Auth/logout',
            ...(fetchMiddlewares<RequestHandler>(AuthRouter)),
            ...(fetchMiddlewares<RequestHandler>(AuthRouter.prototype.logout)),

            async function AuthRouter_logout(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuthRouter_logout, request, response });

                const controller = new AuthRouter();

              await templateService.apiHandler({
                methodName: 'logout',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAgendamentoRouter_getFrequencia: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/agendamentos/frequencia',
            authenticateMiddleware([{"jwt":["ADM"]}]),
            ...(fetchMiddlewares<RequestHandler>(AgendamentoRouter)),
            ...(fetchMiddlewares<RequestHandler>(AgendamentoRouter.prototype.getFrequencia)),

            async function AgendamentoRouter_getFrequencia(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAgendamentoRouter_getFrequencia, request, response });

                const controller = new AgendamentoRouter();

              await templateService.apiHandler({
                methodName: 'getFrequencia',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAgendamentoRouter_criarAgendamento: Record<string, TsoaRoute.ParameterSchema> = {
                agendamento: {"in":"body","name":"agendamento","required":true,"ref":"CreateAgendamento"},
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.post('/agendamentos',
            authenticateMiddleware([{"jwt":["ADM","DOCENTE"]}]),
            ...(fetchMiddlewares<RequestHandler>(AgendamentoRouter)),
            ...(fetchMiddlewares<RequestHandler>(AgendamentoRouter.prototype.criarAgendamento)),

            async function AgendamentoRouter_criarAgendamento(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAgendamentoRouter_criarAgendamento, request, response });

                const controller = new AgendamentoRouter();

              await templateService.apiHandler({
                methodName: 'criarAgendamento',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAgendamentoRouter_solicitarReserva: Record<string, TsoaRoute.ParameterSchema> = {
                reserva: {"in":"body","name":"reserva","required":true,"ref":"SolicitarReserva"},
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.post('/agendamentos/solicitar-reserva',
            authenticateMiddleware([{"jwt":["ADM","DOCENTE"]}]),
            ...(fetchMiddlewares<RequestHandler>(AgendamentoRouter)),
            ...(fetchMiddlewares<RequestHandler>(AgendamentoRouter.prototype.solicitarReserva)),

            async function AgendamentoRouter_solicitarReserva(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAgendamentoRouter_solicitarReserva, request, response });

                const controller = new AgendamentoRouter();

              await templateService.apiHandler({
                methodName: 'solicitarReserva',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAgendamentoRouter_listarMinhasReservas: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.get('/agendamentos/meus-agendamentos',
            authenticateMiddleware([{"jwt":["DOCENTE"]}]),
            ...(fetchMiddlewares<RequestHandler>(AgendamentoRouter)),
            ...(fetchMiddlewares<RequestHandler>(AgendamentoRouter.prototype.listarMinhasReservas)),

            async function AgendamentoRouter_listarMinhasReservas(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAgendamentoRouter_listarMinhasReservas, request, response });

                const controller = new AgendamentoRouter();

              await templateService.apiHandler({
                methodName: 'listarMinhasReservas',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAgendamentoRouter_listarAgendamentos: Record<string, TsoaRoute.ParameterSchema> = {
                pagina: {"in":"query","name":"pagina","dataType":"double"},
                limite: {"in":"query","name":"limite","dataType":"double"},
                salaId: {"in":"query","name":"salaId","dataType":"double"},
                status: {"in":"query","name":"status","dataType":"string"},
                dataInicio: {"in":"query","name":"dataInicio","dataType":"string"},
                dataFim: {"in":"query","name":"dataFim","dataType":"string"},
        };
        app.get('/agendamentos',
            authenticateMiddleware([{"jwt":["ADM","DOCENTE"]}]),
            ...(fetchMiddlewares<RequestHandler>(AgendamentoRouter)),
            ...(fetchMiddlewares<RequestHandler>(AgendamentoRouter.prototype.listarAgendamentos)),

            async function AgendamentoRouter_listarAgendamentos(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAgendamentoRouter_listarAgendamentos, request, response });

                const controller = new AgendamentoRouter();

              await templateService.apiHandler({
                methodName: 'listarAgendamentos',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAgendamentoRouter_listarAgendamentosPorSala: Record<string, TsoaRoute.ParameterSchema> = {
                salaId: {"in":"path","name":"salaId","required":true,"dataType":"double"},
                dataInicio: {"in":"query","name":"dataInicio","dataType":"string"},
                dataFim: {"in":"query","name":"dataFim","dataType":"string"},
        };
        app.get('/agendamentos/sala/:salaId',
            authenticateMiddleware([{"jwt":["ADM","DOCENTE"]}]),
            ...(fetchMiddlewares<RequestHandler>(AgendamentoRouter)),
            ...(fetchMiddlewares<RequestHandler>(AgendamentoRouter.prototype.listarAgendamentosPorSala)),

            async function AgendamentoRouter_listarAgendamentosPorSala(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAgendamentoRouter_listarAgendamentosPorSala, request, response });

                const controller = new AgendamentoRouter();

              await templateService.apiHandler({
                methodName: 'listarAgendamentosPorSala',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAgendamentoRouter_obterAgendamento: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
        };
        app.get('/agendamentos/:id',
            ...(fetchMiddlewares<RequestHandler>(AgendamentoRouter)),
            ...(fetchMiddlewares<RequestHandler>(AgendamentoRouter.prototype.obterAgendamento)),

            async function AgendamentoRouter_obterAgendamento(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAgendamentoRouter_obterAgendamento, request, response });

                const controller = new AgendamentoRouter();

              await templateService.apiHandler({
                methodName: 'obterAgendamento',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAgendamentoRouter_atualizarAgendamento: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
                agendamento: {"in":"body","name":"agendamento","required":true,"ref":"UpdateAgendamento"},
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.put('/agendamentos/:id',
            authenticateMiddleware([{"jwt":["ADM"]}]),
            ...(fetchMiddlewares<RequestHandler>(AgendamentoRouter)),
            ...(fetchMiddlewares<RequestHandler>(AgendamentoRouter.prototype.atualizarAgendamento)),

            async function AgendamentoRouter_atualizarAgendamento(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAgendamentoRouter_atualizarAgendamento, request, response });

                const controller = new AgendamentoRouter();

              await templateService.apiHandler({
                methodName: 'atualizarAgendamento',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAgendamentoRouter_solicitarAlteracao: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
                alteracao: {"in":"body","name":"alteracao","required":true,"ref":"UpdateAgendamento"},
        };
        app.post('/agendamentos/:id/solicitar-alteracao',
            authenticateMiddleware([{"jwt":["DOCENTE"]}]),
            ...(fetchMiddlewares<RequestHandler>(AgendamentoRouter)),
            ...(fetchMiddlewares<RequestHandler>(AgendamentoRouter.prototype.solicitarAlteracao)),

            async function AgendamentoRouter_solicitarAlteracao(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAgendamentoRouter_solicitarAlteracao, request, response });

                const controller = new AgendamentoRouter();

              await templateService.apiHandler({
                methodName: 'solicitarAlteracao',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAgendamentoRouter_aprovarAgendamento: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.post('/agendamentos/:id/aprovar',
            authenticateMiddleware([{"jwt":["ADM"]}]),
            ...(fetchMiddlewares<RequestHandler>(AgendamentoRouter)),
            ...(fetchMiddlewares<RequestHandler>(AgendamentoRouter.prototype.aprovarAgendamento)),

            async function AgendamentoRouter_aprovarAgendamento(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAgendamentoRouter_aprovarAgendamento, request, response });

                const controller = new AgendamentoRouter();

              await templateService.apiHandler({
                methodName: 'aprovarAgendamento',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAgendamentoRouter_cancelarAgendamento: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.post('/agendamentos/:id/cancelar',
            authenticateMiddleware([{"jwt":["ADM"]}]),
            ...(fetchMiddlewares<RequestHandler>(AgendamentoRouter)),
            ...(fetchMiddlewares<RequestHandler>(AgendamentoRouter.prototype.cancelarAgendamento)),

            async function AgendamentoRouter_cancelarAgendamento(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAgendamentoRouter_cancelarAgendamento, request, response });

                const controller = new AgendamentoRouter();

              await templateService.apiHandler({
                methodName: 'cancelarAgendamento',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAgendamentoRouter_cancelarAgendamentoDocente: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.post('/agendamentos/:id/cancelar-docente',
            authenticateMiddleware([{"jwt":["DOCENTE"]}]),
            ...(fetchMiddlewares<RequestHandler>(AgendamentoRouter)),
            ...(fetchMiddlewares<RequestHandler>(AgendamentoRouter.prototype.cancelarAgendamentoDocente)),

            async function AgendamentoRouter_cancelarAgendamentoDocente(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAgendamentoRouter_cancelarAgendamentoDocente, request, response });

                const controller = new AgendamentoRouter();

              await templateService.apiHandler({
                methodName: 'cancelarAgendamentoDocente',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAgendamentoRouter_deletarAgendamento: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.delete('/agendamentos/:id',
            authenticateMiddleware([{"jwt":["ADM"]}]),
            ...(fetchMiddlewares<RequestHandler>(AgendamentoRouter)),
            ...(fetchMiddlewares<RequestHandler>(AgendamentoRouter.prototype.deletarAgendamento)),

            async function AgendamentoRouter_deletarAgendamento(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAgendamentoRouter_deletarAgendamento, request, response });

                const controller = new AgendamentoRouter();

              await templateService.apiHandler({
                methodName: 'deletarAgendamento',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function authenticateMiddleware(security: TsoaRoute.Security[] = []) {
        return async function runAuthenticationMiddleware(request: any, response: any, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            // keep track of failed auth attempts so we can hand back the most
            // recent one.  This behavior was previously existing so preserving it
            // here
            const failedAttempts: any[] = [];
            const pushAndRethrow = (error: any) => {
                failedAttempts.push(error);
                throw error;
            };

            const secMethodOrPromises: Promise<any>[] = [];
            for (const secMethod of security) {
                if (Object.keys(secMethod).length > 1) {
                    const secMethodAndPromises: Promise<any>[] = [];

                    for (const name in secMethod) {
                        secMethodAndPromises.push(
                            expressAuthenticationRecasted(request, name, secMethod[name], response)
                                .catch(pushAndRethrow)
                        );
                    }

                    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

                    secMethodOrPromises.push(Promise.all(secMethodAndPromises)
                        .then(users => { return users[0]; }));
                } else {
                    for (const name in secMethod) {
                        secMethodOrPromises.push(
                            expressAuthenticationRecasted(request, name, secMethod[name], response)
                                .catch(pushAndRethrow)
                        );
                    }
                }
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            try {
                request['user'] = await Promise.any(secMethodOrPromises);

                // Response was sent in middleware, abort
                if (response.writableEnded) {
                    return;
                }

                next();
            }
            catch(err) {
                // Show most recent error as response
                const error = failedAttempts.pop();
                error.status = error.status || 401;

                // Response was sent in middleware, abort
                if (response.writableEnded) {
                    return;
                }
                next(error);
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        }
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
