import { PrismaService } from "@/database/database.js";
import {
  CreateChamadaRequest,
  UpdateStatusRequest,
} from "@/interfaces/chamada/ChamadaDTO.js";

export class ChamadaService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateChamadaRequest) {
    const {
      salaId,
      usuarioId,
      dispositivoId,
      dispositivo,
      tipoProblema,
      descricao = "",
      anexos,
      tecnologias,
      patrimonio,
    } = data;

    const createData: any = {
      salaId,
      usuarioId,
      dispositivoId,
      tipoProblema,
      descricao,
      anexos,
      dispositivoNome: dispositivo ?? null,
      patrimonio: patrimonio ?? null,
    };

    if (tipoProblema === "Software" && tecnologias?.length) {
      createData.tecnologias = {
        create: tecnologias.map((tecnologia) => ({
          nome: tecnologia.nome,
          versao: tecnologia.versao,
        })),
      };
    }

    return await this.prisma.chamadaTecnica.create({
      data: createData,
    });
  }

  async listAll(status?: any) {
    return await this.prisma.chamadaTecnica.findMany({
      where: status ? { status } : {},
      include: {
        sala: true,
        usuario: true,
        dispositivo: true,
      },
      orderBy: { dataChamada: "desc" },
    });
  }

  async listByUsuario(usuarioId: number, status?: any) {
    return await this.prisma.chamadaTecnica.findMany({
      where: Object.assign({ usuarioId }, status ? { status } : {}),
      include: {
        sala: true,
        usuario: true,
        dispositivo: true,
        tecnologias: true,
      },
      orderBy: { dataChamada: "desc" },
    });
  }

  async updateStatus(id: number, data: UpdateStatusRequest,usuarioLogadoId: number) {

    const perfilTI = await this.prisma.tI.findFirst({
      where: { fk_userID: usuarioLogadoId } 
    });

    if (!perfilTI) {
      throw new Error("Acesso negado: O usuário fornecido não possui perfil técnico (TI).");
    }

    return await this.prisma.chamadaTecnica.update({
      where: { idChamada: id },
      data: {
        status: data.status,
        acoesRealizadas: data.acoesRealizadas,
        // tecnicoId: data.tecnicoId,
        tecnicoId: usuarioLogadoId,
        dataResposta: data.status === "RESOLVIDO" ? new Date() : null,
      },
    });
  }
}
