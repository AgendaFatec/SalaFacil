export interface Tecnologia {
  idTecnologia: number;
  nomeTecnologia: string;
  descricao?: string;
  dataCriacao: Date;
}

export interface CreateTecnologia {
  nomeTecnologia: string;
  descricao?: string;
}

export interface UpdateTecnologia {
  nomeTecnologia?: string;
  descricao?: string;
}

export interface ListarTecnologiaQuery {
  pagina?: number;
  limite?: number;
  busca?: string; // busca por nome
}
