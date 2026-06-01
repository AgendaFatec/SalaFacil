import { ChamadaStatus } from "@prisma/client";

export interface TecnologiaSolicitadaPayload {
  nome: string;
  versao: string;
}

export interface CreateChamadaRequest {
  salaId: number;
  usuarioId: number;
  dispositivoId?: number;
  dispositivo?: string;
  patrimonio?: string;
  tipoProblema: "Hardware" | "Software";
  descricao?: string;
  anexos?: string;
  tecnologias?: TecnologiaSolicitadaPayload[];
}

export interface UpdateStatusRequest {
  status: ChamadaStatus;
  tecnicoId: number;
  acoesRealizadas?: string;
}

export interface ChamadaResponse {
  idChamada: number;
  dataChamada: Date;
  status: ChamadaStatus;
  tipoProblema: "Hardware" | "Software";
  descricao: string;
  salaNome: string;
  usuarioNome: string;
  dispositivoNome?: string;
  dispositivo?: string;
  patrimonio?: string;
}
