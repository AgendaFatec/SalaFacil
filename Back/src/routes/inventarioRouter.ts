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
  UploadedFile
} from "tsoa";
import * as express from "express";
import { InventarioController } from "../controllers/inventarioController.js";
import type {
  Inventario,
  CreateInventario,
  UpdateInventario,
  SalasComInventario,
} from "../interfaces/inventario/InventarioDTO.js";

@Tags("Inventários")
@Route("inventarios")
export class InventarioRouter extends Controller {
  private controller = new InventarioController();

  @Post()
  @Security("jwt")
  async criarInventario(
    @Body() inventario: CreateInventario,
    @Request() request: express.Request,
  ): Promise<Inventario> {
    return this.controller.criarInventario(inventario);
  }

  @Get()
  async listarInventarios(
    @Query() pagina?: number,
    @Query() limite?: number,
    @Query() status?: string,
    @Query() Search_Sala?: string,
  ): Promise<{ data: Inventario[]; total: number }> {
    // console.log('está batneodo aq')
    return this.controller.listarInventarios(
      pagina,
      limite,
      status,
      Search_Sala,
    );
  }

  @Get("busca/palavraChave")
  async buscaPorPalavraChave(
    @Query() busca: string,
    @Query() pagina?: number,
    @Query() limite?: number,
  ): Promise<{ data: SalasComInventario[]; total: number }> {
    return this.controller.buscaPorPalavraChave(busca, pagina, limite);
  }

  @Get("sala/{salaId}")
  async obterInventarioPorSala(
    @Path() salaId: number,
  ): Promise<Inventario | null> {
    return this.controller.obterInventarioPorSala(salaId);
  }

  @Get("{id}")
  async obterInventario(@Path() id: number): Promise<Inventario | null> {
    return this.controller.obterInventario(id);
  }

  @Put("{id}")
  @Security("jwt")
  async atualizarInventario(
    @Path() id: number,
    @Body() inventario: UpdateInventario,
    @Request() request: express.Request,
  ): Promise<Inventario> {
    return this.controller.atualizarInventario(id, inventario);
  }

  @Delete("{id}")
  @Security("jwt")
  async deletarInventario(
    @Path() id: number,
    @Request() request: express.Request,
  ): Promise<void> {
    return this.controller.deletarInventario(id);
  }

  @Security("jwt")
  @Post("upload")
  public async uploadFoto(
    @UploadedFile() file: Express.Multer.File
  ): Promise<{ url: string }> {
    return this.controller.uploadFoto(file);
  }

 


}
