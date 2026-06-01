import { PrismaService } from "@/database/database.js";
import {
  CreateDispositivo,
  UpdateDispositivo,
  Dispositivo,
  ListarDispositivoQuery,
} from "@/interfaces/dispositivo/DispositivoDTO.js";

export class DispositivoService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateDispositivo): Promise<Dispositivo> {
    const dispositivo = await this.prisma.dispositivo.create({
      data: {
        nomeDispositivo: data.nomeDispositivo,
        tipoDispositivo: data.tipoDispositivo as any,
        patrimonio: data.patrimonio,
        statusDispositivo: (data.statusDispositivo as any) || "ATIVO",
      },
    });

    return this.mapToDTO(dispositivo);
  }

  async findAll(
    query?: ListarDispositivoQuery,
  ): Promise<{ data: Dispositivo[]; total: number }> {
    const { pagina = 1, limite = 10, tipo, status, busca } = query || {};
    const skip = (pagina - 1) * limite;

    const where: any = {};

    if (tipo) where.tipoDispositivo = tipo;
    if (status) where.statusDispositivo = status;
    if (busca) {
      where.nomeDispositivo = {
        contains: busca,
        mode: "insensitive",
      };
    }

    const [dispositivos, total] = await Promise.all([
      this.prisma.dispositivo.findMany({
        where,
        skip,
        take: limite,
        orderBy: { dataCriacao: "desc" as any },
      }),
      this.prisma.dispositivo.count({ where }),
    ]);

    return {
      data: dispositivos.map((d: any) => this.mapToDTO(d)),
      total,
    };
  }

  async findById(id: number): Promise<Dispositivo | null> {
    const dispositivo = await this.prisma.dispositivo.findUnique({
      where: { idDispositivo: id },
    });

    return dispositivo ? this.mapToDTO(dispositivo) : null;
  }

  async update(id: number, data: UpdateDispositivo): Promise<Dispositivo> {
    const updateData: any = {};
    if (data.nomeDispositivo) updateData.nomeDispositivo = data.nomeDispositivo;
    if (data.tipoDispositivo) updateData.tipoDispositivo = data.tipoDispositivo;
    if (data.patrimonio) updateData.patrimonio = data.patrimonio;
    if (data.statusDispositivo)
      updateData.statusDispositivo = data.statusDispositivo;

    const dispositivo = await this.prisma.dispositivo.update({
      where: { idDispositivo: id },
      data: updateData,
    });

    return this.mapToDTO(dispositivo);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.dispositivo.delete({
      where: { idDispositivo: id },
    });
  }

  async findByType(tipo: string): Promise<Dispositivo[]> {
    const dispositivos = await this.prisma.dispositivo.findMany({
      where: { tipoDispositivo: tipo as any },
    });

    return dispositivos.map((d: any) => this.mapToDTO(d));
  }

  private mapToDTO(dispositivo: any): Dispositivo {
    return {
      idDispositivo: dispositivo.idDispositivo,
      nomeDispositivo: dispositivo.nomeDispositivo,
      tipoDispositivo: dispositivo.tipoDispositivo,
      patrimonio: dispositivo.patrimonio,
      statusDispositivo: dispositivo.statusDispositivo,
      dataCriacao: dispositivo.dataCriacao,
      dataAtualizacao: dispositivo.dataAtualizacao,
    };
  }
}
