import { TipoSala } from "@prisma/client"




export interface newSala{
    nomeSala:string,
    tipoSala:TipoSala,
    disponibilidadeSala: boolean,
    fotoSala?: string,
    qtdeSala:number
}


