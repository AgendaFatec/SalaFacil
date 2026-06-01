import { ChamadaService } from "@/services/chamadaTecnica/ChamadaService.js";
import { PrismaService } from "../database/database.js";
import type {
  UpdateStatusRequest,
  CreateChamadaRequest,
} from "@/interfaces/chamada/ChamadaDTO.js";

export class ChamadaController {
  private service: ChamadaService;
  constructor() {
    this.service = new ChamadaService(new PrismaService());
  }
  async abrirChamado(body: CreateChamadaRequest) {
    const {
      salaId,
      usuarioId,
      dispositivoId,
      dispositivo,
      tipoProblema,
      descricao,
      anexos,
      tecnologias,
      patrimonio,
    } = body;

    return await this.service.create({
      salaId,
      usuarioId,
      dispositivoId,
      dispositivo,
      tipoProblema,
      descricao,
      anexos,
      tecnologias,
      patrimonio,
    });
  }

  async listar(status?: string) {
    return await this.service.listAll(status);
  }

  async listarChamadosDoUsuario(usuarioId: number, status?: string) {
    return await this.service.listByUsuario(usuarioId, status);
  }

  async atualizar(id: number, body: UpdateStatusRequest, usuarioLogadoId: number) {
    return await this.service.updateStatus(id, body, usuarioLogadoId);
  }
}
