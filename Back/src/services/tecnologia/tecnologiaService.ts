import { PrismaService } from "@/database/database.js";
import {
  CreateTecnologia,
  UpdateTecnologia,
  Tecnologia,
  ListarTecnologiaQuery,
} from "@/interfaces/tecnologia/TecnologiaDTO.js";

export class TecnologiaService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateTecnologia): Promise<Tecnologia> {
    const tecnologia = await this.prisma.tecnologia.create({
      data: {
        nomeTecnologia: data.nomeTecnologia,
        descricao: data.descricao,
      },
    });

    return this.mapToDTO(tecnologia);
  }

  async findAll(
    query?: ListarTecnologiaQuery,
  ): Promise<{ data: Tecnologia[]; total: number }> {
    const { pagina = 1, limite = 10, busca } = query || {};
    const skip = (pagina - 1) * limite;

    const where: any = {};

    if (busca) {
      where.nomeTecnologia = {
        contains: busca,
        mode: "insensitive",
      };
    }

    const [tecnologias, total] = await Promise.all([
      this.prisma.tecnologia.findMany({
        where,
        skip,
        take: limite,
        orderBy: { dataCriacao: "desc" as any },
      }),
      this.prisma.tecnologia.count({ where }),
    ]);

    return {
      data: tecnologias.map((t: any) => this.mapToDTO(t)),
      total,
    };
  }

  async findById(id: number): Promise<Tecnologia | null> {
    const tecnologia = await this.prisma.tecnologia.findUnique({
      where: { idTecnologia: id },
    });

    return tecnologia ? this.mapToDTO(tecnologia) : null;
  }

  async findByName(nome: string): Promise<Tecnologia | null> {
    const tecnologia = await this.prisma.tecnologia.findUnique({
      where: { nomeTecnologia: nome },
    });

    return tecnologia ? this.mapToDTO(tecnologia) : null;
  }

  async update(id: number, data: UpdateTecnologia): Promise<Tecnologia> {
    const updateData: any = {};
    if (data.nomeTecnologia) updateData.nomeTecnologia = data.nomeTecnologia;
    if (data.descricao) updateData.descricao = data.descricao;

    const tecnologia = await this.prisma.tecnologia.update({
      where: { idTecnologia: id },
      data: updateData,
    });

    return this.mapToDTO(tecnologia);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.tecnologia.delete({
      where: { idTecnologia: id },
    });
  }

  private mapToDTO(tecnologia: any): Tecnologia {
    return {
      idTecnologia: tecnologia.idTecnologia,
      nomeTecnologia: tecnologia.nomeTecnologia,
      descricao: tecnologia.descricao,
      dataCriacao: tecnologia.dataCriacao,
    };
  }
}
