export type ChamadaStatus = 'ABERTO' | 'EM_ATENDIMENTO' | 'RESOLVIDO';
export type TipoProblema = 'Hardware' | 'Software';

export interface Chamado {
  idChamada: number;
  dataChamada: string;
  dataResposta?: string;
  anexos?: string;
  tipoProblema: TipoProblema;
  descricao: string;
  status: ChamadaStatus;
  acoesRealizadas: string;
  sala: {
    nomeSala: string;
  };
  usuario: {
    userNome: string;
  };
  dispositivo?: {
    nomeDispositivo: string;
    patrimonio?: string;
  };
}

export interface UpdateStatusRequest {
  status: ChamadaStatus;
  tecnicoId: number;
  acoesRealizadas?: string;
}


export interface CreateChamadaRequest {
  salaId: number;
  usuarioId: number;
  dispositivoId?: number; // Opcional, caso o problema seja na sala em geral
  tipoProblema: 'Hardware' | 'Software';
  descricao: string;
}