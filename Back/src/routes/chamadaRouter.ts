import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Path,
  Route,
  Tags,
  Query,
  Security,
  Request,
} from "tsoa";
// import { ChamadaController } from "../controllers/ChamadaController.js";
import { ChamadaController } from "@/controllers/ChamadaController.js";
// import type{ CreateChamadaRequest,UpdateStatusRequest } from "@/interfaces/chamada/ChamadaDTO.js";

import type {
  CreateChamadaRequest,
  UpdateStatusRequest,
} from "../interfaces/chamada/ChamadaDTO.js";
import { ChamadaStatus } from "@prisma/client";

@Route("chamados")
@Tags("Chamados")
export class ChamadaRouter extends Controller {
  private controller = new ChamadaController();

  @Post()
  @Security("jwt", ["TI", "DOCENTE"])
  public async criar(@Body() body: CreateChamadaRequest) {
    return await this.controller.abrirChamado(body);
  }

  @Get()
  @Security("jwt", ["TI"])
  public async listar(@Query() status?: ChamadaStatus) {
    return await this.controller.listar(status);
  }

  @Get("meus-chamados")
  @Security("jwt", ["DOCENTE", "TI"])
  public async listarChamadosDoUsuario(
    @Request() req: any,
    @Query() status?: ChamadaStatus,
  ) {
    console.log(`${req.user.sub}`)
    return await this.controller.listarChamadosDoUsuario(req.user.sub, status);
  }

  @Put("{id}/status")
  @Security("jwt", ["TI"])
  public async atualizarStatus(
    @Request() req: any,
    @Path() id: number,
    @Body() body: UpdateStatusRequest,
  ) {
    return await this.controller.atualizar(id, body, req.user.sub);
  }
}
