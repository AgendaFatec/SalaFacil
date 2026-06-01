export interface Dispositivo {
  idDispositivo: number;
  nomeDispositivo: string;
  tipoDispositivo: string;
  patrimonio?: string;
  statusDispositivo: string;
  dataCriacao: Date;
  dataAtualizacao: Date;
}

export interface CreateDispositivo {
  nomeDispositivo: string;
  tipoDispositivo: string;
  patrimonio?: string;
  statusDispositivo?: string;
}

export interface UpdateDispositivo {
  nomeDispositivo?: string;
  tipoDispositivo?: string;
  patrimonio?: string;
  statusDispositivo?: string;
}

export interface ListarDispositivoQuery {
  pagina?: number;
  limite?: number;
  tipo?: string;
  status?: string;
  busca?: string; // busca por nome
}
