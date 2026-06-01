import { PrismaService } from "@/database/database.js";
import {
  Agendamento,
  CreateAgendamento,
  UpdateAgendamento,
  ListarAgendamentoQuery,
  SolicitarReserva,
} from "@/interfaces/agendamento/AgendamentoDTO.js";
import { Prisma } from "@prisma/client";

export class AgendamentoService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateAgendamento): Promise<Agendamento> {
    // Validar se sala existe
    const sala = await this.prisma.sala.findUnique({
      where: { idSala: data.salaId },
    });

    if (!sala) {
      throw new Error("Sala não encontrada");
    }

    // Validar se há conflito de horários
    await this.validarConflitosHorarios(
      data.salaId,
      data.dataAgendamento,
      data.horaInicio,
      data.horaFim,
    );

    const agendamento = await this.prisma.agendamento.create({
      data: {
        salaId: data.salaId,
        usuarioId: data.usuarioId,
        dataAgendamento: new Date(data.dataAgendamento),
        horaInicio: data.horaInicio,
        horaFim: data.horaFim,
        descricao: data.descricao,
        statusAgendamento: "EM_ESPERA",
      },
      include: {
        sala: true,
      },
    });

    return await this.mapToDTO(agendamento);
  }

  async findAll(
    query?: ListarAgendamentoQuery,
  ): Promise<{ data: Agendamento[]; total: number }> {
    const {
      pagina = 1,
      limite = 10,
      salaId,
      status,
      dataInicio,
      dataFim,
    } = query || {};
    const skip = (pagina - 1) * limite;

    const where: any = {};

    if (salaId) where.salaId = salaId;
    if (status) where.statusAgendamento = status as any;

    if (dataInicio || dataFim) {
      where.dataAgendamento = {};
      if (dataInicio) {
        (where.dataAgendamento as any).gte = new Date(dataInicio);
      }
      if (dataFim) {
        (where.dataAgendamento as any).lte = new Date(dataFim);
      }
    }

    const [agendamentos, total] = await Promise.all([
      this.prisma.agendamento.findMany({
        where,
        skip,
        take: limite,
        include: {
          sala: true,
        },
        orderBy: { dataAgendamento: "asc" as any },
      }),
      this.prisma.agendamento.count({ where }),
    ]);

    const mappedData = await Promise.all(agendamentos.map((a: any) => this.mapToDTO(a)));

    return {
      data: mappedData,
      total,
    };
  }

  async findById(id: number): Promise<Agendamento | null> {
    const agendamento = await this.prisma.agendamento.findUnique({
      where: { idAgendamento: id },
      include: {
        sala: true,
      },
    });

    return agendamento ? await this.mapToDTO(agendamento) : null;
  }
  async findByUsuarioId(usuarioId: number): Promise<Agendamento[]> {
    const agendamentos = await this.prisma.agendamento.findMany({
      where: { 
        usuarioId: usuarioId 
      },
      include: { 
        sala: true 
      },
      orderBy: { dataAgendamento: "asc" },
    });

    return await Promise.all(agendamentos.map((a) => this.mapToDTO(a)));
  }

  async findBySalaId(
    salaId: number,
    query?: ListarAgendamentoQuery,
  ): Promise<Agendamento[]> {
    const { dataInicio, dataFim } = query || {};

    const where: Prisma.AgendamentoWhereInput = {
      salaId,
      statusAgendamento: {
        in: ["AGENDADO", "EM_ESPERA"],
      },
    };

    if (dataInicio || dataFim) {
      where.dataAgendamento = {};
      if (dataInicio) {
        (where.dataAgendamento as any).gte = new Date(dataInicio);
      }
      if (dataFim) {
        (where.dataAgendamento as any).lte = new Date(dataFim);
      }
    }

    const agendamentos = await this.prisma.agendamento.findMany({
      where,
      include: {
        sala: true,
      },
      orderBy: { dataAgendamento: "asc" },
    });

    return await Promise.all(agendamentos.map((a) => this.mapToDTO(a)));
  }

  async update(id: number, data: UpdateAgendamento): Promise<Agendamento> {
    const agendamento = await this.prisma.agendamento.findUnique({
      where: { idAgendamento: id },
    });

    if (!agendamento) {
      throw new Error("Agendamento não encontrado");
    }

    // Se houver mudança de data/hora, validar conflitos
    if (data.dataAgendamento || data.horaInicio || data.horaFim) {
      const novaData = data.dataAgendamento || agendamento.dataAgendamento;
      const novaHoraInicio = data.horaInicio || agendamento.horaInicio;
      const novaHoraFim = data.horaFim || agendamento.horaFim;

      await this.validarConflitosHorarios(
        agendamento.salaId,
        novaData,
        novaHoraInicio,
        novaHoraFim,
        id,
      );
    }

    const updateData: any = {};
    if (data.dataAgendamento) updateData.dataAgendamento = data.dataAgendamento;
    if (data.horaInicio) updateData.horaInicio = data.horaInicio;
    if (data.horaFim) updateData.horaFim = data.horaFim;
    if (data.descricao !== undefined) updateData.descricao = data.descricao;
    if (data.statusAgendamento)
      updateData.statusAgendamento = data.statusAgendamento as any;

    const updated = await this.prisma.agendamento.update({
      where: { idAgendamento: id },
      data: updateData,
      include: {
        sala: true,
      },
    });

    return await this.mapToDTO(updated);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.agendamento.delete({
      where: { idAgendamento: id },
    });
  }

  async solicitarAlteracao(id: number, data: UpdateAgendamento): Promise<Agendamento> {
    const agendamento = await this.prisma.agendamento.findUnique({
      where: { idAgendamento: id },
    });

    if (!agendamento) throw new Error("Agendamento não encontrado");

    if (data.dataAgendamento || data.horaInicio || data.horaFim) {
      await this.validarConflitosHorarios(
        data.salaId || agendamento.salaId,
        data.dataAgendamento || agendamento.dataAgendamento,
        data.horaInicio || agendamento.horaInicio,
        data.horaFim || agendamento.horaFim,
        id 
      );
    }

    const updated = await this.prisma.agendamento.update({
      where: { idAgendamento: id },
      data: {
        salaId: data.salaId || agendamento.salaId,
        dataAgendamento: data.dataAgendamento ? new Date(data.dataAgendamento) : agendamento.dataAgendamento,
        horaInicio: data.horaInicio || agendamento.horaInicio,
        horaFim: data.horaFim || agendamento.horaFim,
        descricao: data.descricao || agendamento.descricao,
        statusAgendamento: "EM_ESPERA" 
      },
      include: { sala: true }
    });

    return await this.mapToDTO(updated);
  }


  async aprovarAgendamento(id: number): Promise<Agendamento> {
    const agendamento = await this.prisma.agendamento.update({
      where: { idAgendamento: id },
      data: { statusAgendamento: "AGENDADO" },
      include: {
        sala: true,
      },
    });

    return await this.mapToDTO(agendamento);
  }

  async cancelarAgendamento(id: number): Promise<Agendamento> {
    const agendamento = await this.prisma.agendamento.update({
      where: { idAgendamento: id },
      data: { statusAgendamento: "CANCELADO" },
      include: {
        sala: true,
      },
    });

    return await this.mapToDTO(agendamento);
  }


  async cancelarAgendamentoDocente(id: number, usuarioId: number): Promise<Agendamento> {
    const agendamento = await this.prisma.agendamento.findUnique({
      where: { idAgendamento: id }
    });
    if (!agendamento) throw new Error("Agendamento não encontrado");
    
    if (agendamento.usuarioId !== usuarioId) {
      throw new Error("Acesso negado: Você não pode cancelar uma reserva que não é sua.");
    }

    const atualizado = await this.prisma.agendamento.update({
      where: { idAgendamento: id },
      data: { statusAgendamento: "CANCELADO" },
      include: { sala: true }
    });

    return await this.mapToDTO(atualizado);
  }

  async getFrequenciaSalas(): Promise<{ salaNome: string, total: number }[]> {
  const contagem = await this.prisma.agendamento.groupBy({
    by: ['salaId'],
    _count: {
      idAgendamento: true, 
    },
    where: {
      statusAgendamento: 'AGENDADO' 
    }
  });

  const resultado = await Promise.all(contagem.map(async (c) => {
    const sala = await this.prisma.sala.findUnique({ where: { idSala: c.salaId } });
    return {
      salaNome: sala?.nomeSala || "Sala Desconhecida",
      total: c._count.idAgendamento
    };
  }));

  return resultado;
}

  private async validarConflitosHorarios(
    salaId: number,
    data: Date,
    horaInicio: string,
    horaFim: string,
    excludeId?: number,
  ): Promise<void> {
    const where: any = {
      salaId,
      dataAgendamento: {
        gte: new Date(data),
        lt: new Date(new Date(data).getTime() + 24 * 60 * 60 * 1000),
      },
      statusAgendamento: {
        in: ["AGENDADO", "EM_ESPERA"],
      },
    };

    if (excludeId) {
      where.idAgendamento = { not: excludeId };
    }

    const conflitos = await this.prisma.agendamento.findMany({
      where,
    });

    const partes = horaInicio.split(":").map(Number);
    const inicioHoras = partes[0] ?? 0;
    const inicioMinutos = partes[1] ?? 0;
    const partesF = horaFim.split(":").map(Number);
    const fimHoras = partesF[0] ?? 0;
    const fimMinutos = partesF[1] ?? 0;

    const inicioTempo = inicioHoras * 60 + inicioMinutos;
    const fimTempo = fimHoras * 60 + fimMinutos;

    for (const conflito of conflitos) {
      const partesConf = conflito.horaInicio.split(":").map(Number);
      const confInicioHoras = partesConf[0] ?? 0;
      const confInicioMinutos = partesConf[1] ?? 0;
      const partesConfF = conflito.horaFim.split(":").map(Number);
      const confFimHoras = partesConfF[0] ?? 0;
      const confFimMinutos = partesConfF[1] ?? 0;

      const confInicioTempo = confInicioHoras * 60 + confInicioMinutos;
      const confFimTempo = confFimHoras * 60 + confFimMinutos;

      // Verificar sobreposição
      if (inicioTempo < confFimTempo && fimTempo > confInicioTempo) {
        throw new Error(
          "Conflito de horário: Esta sala já está reservada neste horário",
        );
      }
    }
  }

private async mapToDTO(agendamento: any): Promise<any> {
    let docenteNome = "Professor não identificado";

    const targetUserId = agendamento.usuarioId || agendamento.docenteId;

    if (targetUserId) {
      try {
        const usuario = await this.prisma.usuario.findUnique({
          where: { 
            userID: targetUserId
          },
          select: { userNome: true, userEmail: true }
        });

        if (usuario) {
          docenteNome = usuario.userNome || usuario.userEmail || "Professor sem nome";
        }
      } catch (err) {
        console.error("Erro ao buscar nome do usuário no banco:", err);
      }
    }

    return {
      idAgendamento: agendamento.idAgendamento,
      salaId: agendamento.salaId,
      salaNome: agendamento.sala?.nomeSala,
      usuarioId: targetUserId,
      docenteNome: docenteNome, 
      dataAgendamento: agendamento.dataAgendamento,
      horaInicio: agendamento.horaInicio,
      horaFim: agendamento.horaFim,
      descricao: agendamento.descricao,
      statusAgendamento: agendamento.statusAgendamento,
      criadoEm: agendamento.criadoEm,
      atualizadoEm: agendamento.atualizadoEm,
    } as any;
  }



}