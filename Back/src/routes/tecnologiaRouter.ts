import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Route,
  Body,
  Path,
  Query,
  Tags,
  Security,
  Request,
} from "tsoa";
import * as express from "express";
import { TecnologiaController } from "../controllers/tecnologiaController.js";
import * as TecnologiaDTOs from "../interfaces/tecnologia/TecnologiaDTO.js";

@Tags("Tecnologias")
@Route("tecnologias")
export class TecnologiaRouter extends Controller {
  private controller = new TecnologiaController();

  @Post()
  @Security("jwt")
  async criarTecnologia(
    @Body() tecnologia: TecnologiaDTOs.CreateTecnologia,
    @Request() request: express.Request,
  ): Promise<TecnologiaDTOs.Tecnologia> {
    return this.controller.criarTecnologia(tecnologia);
  }

  @Get()
  async listarTecnologias(
    @Query() pagina?: number,
    @Query() limite?: number,
    @Query() busca?: string,
  ): Promise<{ data: TecnologiaDTOs.Tecnologia[]; total: number }> {
    return this.controller.listarTecnologias(pagina, limite, busca);
  }

  @Get("{id}")
  async obterTecnologia(
    @Path() id: number,
  ): Promise<TecnologiaDTOs.Tecnologia | null> {
    return this.controller.obterTecnologia(id);
  }

  @Put("{id}")
  @Security("jwt")
  async atualizarTecnologia(
    @Path() id: number,
    @Body() tecnologia: TecnologiaDTOs.UpdateTecnologia,
    @Request() request: express.Request,
  ): Promise<TecnologiaDTOs.Tecnologia> {
    return this.controller.atualizarTecnologia(id, tecnologia);
  }

  @Delete("{id}")
  @Security("jwt")
  async deletarTecnologia(
    @Path() id: number,
    @Request() request: express.Request,
  ): Promise<void> {
    return this.controller.deletarTecnologia(id);
  }
}
