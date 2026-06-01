import { AgendamentoService } from "../services/agendamento/agendamentoService.js";
import type {
  Agendamento,
  CreateAgendamento,
  UpdateAgendamento,
  ListarAgendamentoQuery,
  SolicitarReserva,
} from "../interfaces/agendamento/AgendamentoDTO.js";
import { PrismaService } from "../database/database.js";

export class AgendamentoController {
  private agendamentoService: AgendamentoService;

  constructor() {
    const prismaService = new PrismaService();
    this.agendamentoService = new AgendamentoService(prismaService);
  }

  async criarAgendamento(agendamento: CreateAgendamento): Promise<Agendamento> {
    return await this.agendamentoService.create(agendamento);
  }

  async listarMinhasReservas(usuarioId: number): Promise<Agendamento[]> {
    return await this.agendamentoService.findByUsuarioId(usuarioId);
  }
  async solicitarReserva(reserva: SolicitarReserva): Promise<Agendamento> {
    try{
      return await this.agendamentoService.create({
      salaId: reserva.salaId,
      usuarioId: reserva.usuarioId,
      dataAgendamento: reserva.dataAgendamento,
      horaInicio: reserva.horaInicio,
      horaFim: reserva.horaFim,
      descricao: reserva.descricao,
    });
    } catch (error: any) {
      if (error.message.includes("Conflito de horário")) {
        throw { status: 400, message: error.message }; 
      }
      throw error;
    }
  }

  async listarAgendamentos(
    pagina?: number,
    limite?: number,
    salaId?: number,
    status?: string,
    dataInicio?: string,
    dataFim?: string,
  ): Promise<{ data: Agendamento[]; total: number }> {
    return await this.agendamentoService.findAll({
      pagina,
      limite,
      salaId,
      status: status as any,
      dataInicio: dataInicio ? new Date(dataInicio) : undefined,
      dataFim: dataFim ? new Date(dataFim) : undefined,
    });
  }

  async listarAgendamentosPorSala(
    salaId: number,
    dataInicio?: string,
    dataFim?: string,
  ): Promise<Agendamento[]> {
    return await this.agendamentoService.findBySalaId(salaId, {
      dataInicio: dataInicio ? new Date(dataInicio) : undefined,
      dataFim: dataFim ? new Date(dataFim) : undefined,
    });
  }

  async obterAgendamento(id: number): Promise<Agendamento | null> {
    return await this.agendamentoService.findById(id);
  }

  async atualizarAgendamento(
    id: number,
    agendamento: UpdateAgendamento,
  ): Promise<Agendamento> {
    return await this.agendamentoService.update(id, agendamento);
  }
  async solicitarAlteracao(id: number, agendamento: UpdateAgendamento): Promise<Agendamento> {
    return await this.agendamentoService.solicitarAlteracao(id, agendamento);
  }
  async aprovarAgendamento(id: number): Promise<Agendamento> {
    return await this.agendamentoService.aprovarAgendamento(id);
  }

  async cancelarAgendamento(id: number): Promise<Agendamento> {
    return await this.agendamentoService.cancelarAgendamento(id);
  }
  async cancelarAgendamentoDocente(id: number, usuarioId: number): Promise<Agendamento> {
    return await this.agendamentoService.cancelarAgendamentoDocente(id, usuarioId);
  }

  async deletarAgendamento(id: number): Promise<void> {
    return await this.agendamentoService.delete(id);
  }
  async getFrequencia(): Promise<{ salaNome: string, total: number }[]> {
  return await this.agendamentoService.getFrequenciaSalas();
}
}