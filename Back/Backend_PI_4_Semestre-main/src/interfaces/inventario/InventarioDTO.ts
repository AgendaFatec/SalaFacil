export interface DispositivoUpdateDTO {
  id?: number;
  nome?: string;
  quantidade: number;
}

export interface TecnologiaUpdateDTO {
  id?: number;
  nome?: string;
}

export interface Inventario {
  idInventario: number;
  salaId: number;
  salaNome?: string;
  capacidadeAlunos?: number;
  fotoSala?: string[];
  statusInventario: string;
  dispositivos: {
    idDispositivo: number;
    nomeDispositivo: string;
    tipoDispositivo: string; 
    patrimonio?: string; 
    statusDispositivo: string;
    quantidade: number;
  }[];
  tecnologias: {
    idTecnologia: number;
    nomeTecnologia: string;
    descricao?: string;
  }[];
  criadoEm: Date;
  atualizadoEm: Date;
}

export interface CreateInventario {
  salaId: number;
  dispositivoIds?: number[];
  tecnologiaIds?: number[];
  statusInventario?: string;
}

export interface UpdateInventario {
  statusInventario?: string;
  dispositivos?: DispositivoUpdateDTO[];
  tecnologias?: TecnologiaUpdateDTO[];
  tecnologiaIds?: number[];
  capacidadeAlunos?: number;
  fotoSala?: string[];
}

export interface AtualizarInventarioPayload {
  dispositivo: {
    idDispositivo?: number;
    nomeDispositivo: string;
    tipoDispositivo: string;
    patrimonio?: string;
    statusDispositivo?: string;
  };
  inventario: {
    type: "create" | "update";
    data: {
      id?: number;
      salaId: number;
      tecnologiaIds?: number[]; 
    };
    // data:
    //   | CreateInventario
    //   | (UpdateInventario & { id?: number; salaId?: number }),
    //   tecnologiaIds?: number[];
  };
}

export interface ListarInventarioQuery {
  pagina?: number;
  limite?: number;
  status?: string;
  Search_Sala?: string;
}

export interface ListarInventarioComBusca {
  pagina?: number;
  limite?: number;
  busca?: string;
}

export interface SalasComInventario {
  idSala: number;
  nomeSala: string;
  tipoSala: string;
  capacidadeAlunos?: number;
  fotoSala?: string[];
  disponibilidadeSala: boolean;
  inventario: {
    idInventario: number;
    dispositivos: {
      tipoDispositivo: string;
      quantidade: number;
      nomes: string[];
      patrimonios?: string[]; 
      status?: string[];
    }[];
    tecnologias: {
      idTecnologia: number;
      nomeTecnologia: string;
    }[];
  };
}
