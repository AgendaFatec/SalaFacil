export type TipoUser = 'DOCENTE' | 'TI' | 'ADM';
export type StatusConta = 'CONVIDADA' | 'ATIVA' | 'DESATIVADA';


export interface IUserDetailResponse {
    userID: number;
    userEmail: string;
    userNome: string | null;
    criadoDate: string; 
    statusUser: StatusConta; 
    tipoUser: TipoUser; 
    fotoUrl: string | null;
    adm?: { admID: number; fk_userID: number } | null;
    docente?: { docenteID: number; fk_userID: number } | null; 
    ti?: { tiID: number; fk_userID: number }  | null;
}


export interface CreateUserData {
    email: string;
    tipoUser: TipoUser;
}