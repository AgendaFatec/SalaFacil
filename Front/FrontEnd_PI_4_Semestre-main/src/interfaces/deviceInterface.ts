export type DispositvoTipo = 'TV' | 'NOTEBOOK' | 'DESKTOP' | 'PROJETOR';

export type StatusDispositivo = 'ATIVO' | 'INATIVO' | 'DANIFICADO' | 'MANUTENCAO';

export interface Dispositivo {
  idDispositivo: number;
  nomeDispositivo: string;
  tipoDispositivo: DispositvoTipo;
  patrimonio?: string;
  statusDispositivo: StatusDispositivo;
  dataCriacao: string;
  dataAtualizacao: string;
}

// DTOs para o FrontEnd (Úteis para formulários de criação/edição)
export interface CreateDispositivo {
  nomeDispositivo: string;
  tipoDispositivo: DispositvoTipo;
  patrimonio?: string;
  statusDispositivo?: StatusDispositivo;
}