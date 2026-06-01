import { PrismaService } from "@/database/database.js";
import { newSala } from "@/interfaces/salas/Salas.js";
import { email } from "zod";







export class SalasService{
    constructor(private prisma:PrismaService){}


    async createNewSala(dataValues: newSala){
        const salaData= await this.prisma.sala.create({
            data:{
                nomeSala: dataValues.nomeSala,
                tipoSala: dataValues.tipoSala,
                qtdeSala:dataValues.qtdeSala,
                fotoSala: dataValues.fotoSala,
                disponibilidadeSala: dataValues.disponibilidadeSala
            }
            //continuar ao adicionar tabelas no banco de dados
        })
        const newSala:newSala = {
            nomeSala:salaData.nomeSala,
            tipoSala: salaData.tipoSala,
            disponibilidadeSala:salaData.disponibilidadeSala,
            fotoSala:salaData.fotoSala||"FotoSala.jpeg",
            qtdeSala:salaData.qtdeSala
        }
        return newSala
    }

    async updateSala(id: number, dataValues: any) {
        const salaAtualizada = await this.prisma.sala.update({
            where: { idSala: id },
            data: {
                capacidadeAlunos: dataValues.capacidadeAlunos,
                nomeSala: dataValues.nomeSala,
            }
        });
        return salaAtualizada;
    }

    //demais funçãoes
}