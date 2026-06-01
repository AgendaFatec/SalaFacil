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
import { DispositivoController } from "../controllers/dispositivoController.js";
import type {
  CreateDispositivo,
  UpdateDispositivo,
  Dispositivo,
} from "../interfaces/dispositivo/DispositivoDTO.js";
import type {
  Inventario,
  AtualizarInventarioPayload,
} from "../interfaces/inventario/InventarioDTO.js";

@Tags("Dispositivos")
@Route("dispositivos")
export class DispositivoRouter extends Controller {
  private controller = new DispositivoController();

  @Post()
  @Security("jwt", ["TI"])
  async criarDispositivo(
    @Body() dispositivo: CreateDispositivo,
    @Request() request: express.Request,
  ): Promise<Dispositivo> {
    return this.controller.criarDispositivo(dispositivo);
  }

  @Get("list-devices")
  @Security("jwt", ["TI"])
  async listarDispositivos(
    @Query() pagina?: number,
    @Query() limite?: number,
    @Query() tipo?: string,
    @Query() status?: string,
    @Query() busca?: string,
  ): Promise<{ data: Dispositivo[]; total: number }> {
    return this.controller.listarDispositivos(
      pagina,
      limite,
      tipo,
      status,
      busca,
    );
  }

  @Get("get-device/{id}")
  @Security("jwt", ["TI"])
  async obterDispositivo(@Path() id: number): Promise<Dispositivo | null> {
    return this.controller.obterDispositivo(id);
  }

  @Put("update-device/{id}")
  @Security("jwt", ["TI"])
  async atualizarDispositivo(
    @Path() id: number,
    @Body() dispositivo: UpdateDispositivo,
    @Request() request: express.Request,
  ): Promise<Dispositivo> {
    return this.controller.atualizarDispositivo(id, dispositivo);
  }

  @Delete("delete-device/{id}")
  @Security("jwt", ["TI"])
  async deletarDispositivo(
    @Path() id: number,
    @Request() request: express.Request,
  ): Promise<void> {
    return this.controller.deletarDispositivo(id);
  }

  @Post("atualizar-inventario")
  @Security("jwt", ["TI"])
  async atualizarInventarioCompleto(
    @Body() payload: AtualizarInventarioPayload,
    @Request() request: express.Request,
  ): Promise<Inventario> {
    return await this.controller.atualizarInventarioCompleto(payload);
  }
}
