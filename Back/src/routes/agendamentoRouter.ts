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
import { AgendamentoController } from "../controllers/agendamentoController.js";
import type {
  Agendamento,
  CreateAgendamento,
  UpdateAgendamento,
  SolicitarReserva,
} from "../interfaces/agendamento/AgendamentoDTO.js";

@Tags("Agendamentos")
@Route("agendamentos")
export class AgendamentoRouter extends Controller {

  private controller = new AgendamentoController();
  @Get("frequencia")
  @Security("jwt", ["ADM"])
  async getFrequencia(): Promise<{ salaNome: string, total: number }[]> {
    return this.controller.getFrequencia();
  }
  
  
  @Post()
  @Security("jwt", ["ADM", "DOCENTE"])
  async criarAgendamento(
    @Body() agendamento: CreateAgendamento,
    @Request() request: express.Request,
  ): Promise<Agendamento> {
    return this.controller.criarAgendamento(agendamento);
  }

  @Post("solicitar-reserva")
  @Security("jwt",["ADM", "DOCENTE"])
  async solicitarReserva(
    @Body() reserva: SolicitarReserva,
    @Request() request: express.Request,
  ): Promise<Agendamento> {
    return this.controller.solicitarReserva(reserva);
  }

  @Get("meus-agendamentos")
  @Security("jwt", ["DOCENTE"])
  async listarMinhasReservas(@Request() request: express.Request): Promise<Agendamento[]> {
    const usuarioId = (request as any).user.sub;
    return this.controller.listarMinhasReservas(usuarioId);
  }


  @Get()
  @Security("jwt", ["ADM", "DOCENTE"])
  async listarAgendamentos(
    @Query() pagina?: number,
    @Query() limite?: number,
    @Query() salaId?: number,
    @Query() status?: string,
    @Query() dataInicio?: string,
    @Query() dataFim?: string,
  ): Promise<{ data: Agendamento[]; total: number }> {
    return this.controller.listarAgendamentos(
      pagina,
      limite,
      salaId,
      status,
      dataInicio,
      dataFim,
    );
  }

  @Get("sala/{salaId}")
  @Security("jwt", ["ADM", "DOCENTE"])
  async listarAgendamentosPorSala(
    @Path() salaId: number,
    @Query() dataInicio?: string,
    @Query() dataFim?: string,
  ): Promise<Agendamento[]> {
    return this.controller.listarAgendamentosPorSala(
      salaId,
      dataInicio,
      dataFim,
    );
  }

  @Get("{id}")
  async obterAgendamento(@Path() id: number): Promise<Agendamento | null> {
    return this.controller.obterAgendamento(id);
  }

  @Put("{id}")
  @Security("jwt", ["ADM"])
  async atualizarAgendamento(
    @Path() id: number,
    @Body() agendamento: UpdateAgendamento,
    @Request() request: express.Request,
  ): Promise<Agendamento> {
    return this.controller.atualizarAgendamento(id, agendamento);
  }
  
  @Post("{id}/solicitar-alteracao")
  @Security("jwt", ["DOCENTE"])
  async solicitarAlteracao(
    @Path() id: number,
    @Body() alteracao: UpdateAgendamento,
  ): Promise<Agendamento> {
    return this.controller.solicitarAlteracao(id, alteracao);
  }

  @Post("{id}/aprovar")
  @Security("jwt", ["ADM"])
  async aprovarAgendamento(
    @Path() id: number,
    @Request() request: express.Request,
  ): Promise<Agendamento> {
    return this.controller.aprovarAgendamento(id);
  }

  @Post("{id}/cancelar")
  @Security("jwt", ["ADM"])
  async cancelarAgendamento(
    @Path() id: number,
    @Request() request: express.Request,
  ): Promise<Agendamento> {
    return this.controller.cancelarAgendamento(id);
  }

  @Post("{id}/cancelar-docente")
  @Security("jwt", ["DOCENTE"])
  async cancelarAgendamentoDocente(
    @Path() id: number,
    @Request() request: express.Request
  ): Promise<Agendamento> {
    // Passamos o ID do usuário logado (via token) para garantir segurança
    const usuarioId = (request as any).user.sub;
    return this.controller.cancelarAgendamentoDocente(id, usuarioId);
  }

  @Delete("{id}")
  @Security("jwt", ["ADM"])
  async deletarAgendamento(
    @Path() id: number,
    @Request() request: express.Request,
  ): Promise<void> {
    return this.controller.deletarAgendamento(id);
  }

 
}
