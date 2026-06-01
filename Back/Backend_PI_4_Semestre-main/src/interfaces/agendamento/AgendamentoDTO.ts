export interface Agendamento {
  idAgendamento: number;
  salaId: number;
  salaNome?: string;
  usuarioId?: number;
  dataAgendamento: Date;
  horaInicio: string;
  horaFim: string;
  descricao?: string;
  statusAgendamento: string;
  criadoEm: Date;
  atualizadoEm: Date;
}

export interface CreateAgendamento {
  salaId: number;
  usuarioId?: number;
  dataAgendamento: Date;
  horaInicio: string;
  horaFim: string;
  descricao?: string;
}

export interface UpdateAgendamento {
  salaId?:number
  dataAgendamento?: Date;
  horaInicio?: string;
  horaFim?: string;
  descricao?: string;
  statusAgendamento?: string;
}

export interface ListarAgendamentoQuery {
  pagina?: number;
  limite?: number;
  salaId?: number;
  status?: string;
  dataInicio?: Date;
  dataFim?: Date;
}

export interface SolicitarReserva {
  salaId: number;
  usuarioId: number;
  dataAgendamento: Date;
  horaInicio: string;
  horaFim: string;
  descricao?: string;
}