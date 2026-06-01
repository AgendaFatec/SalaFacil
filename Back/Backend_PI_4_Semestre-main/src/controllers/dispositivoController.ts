import { DispositivoService } from "../services/dispositivo/dispositivoService.js";
import { InventarioService } from "../services/inventario/inventarioService.js";
import type {
  CreateDispositivo,
  UpdateDispositivo,
  Dispositivo,
  ListarDispositivoQuery,
} from "../interfaces/dispositivo/DispositivoDTO.js";
import type {
  Inventario,
  AtualizarInventarioPayload,
} from "../interfaces/inventario/InventarioDTO.js";
import { PrismaService } from "../database/database.js";

export class DispositivoController {
  private dispositivoService: DispositivoService;
  private inventarioService: InventarioService;

  constructor() {
    const prismaService = new PrismaService();
    this.dispositivoService = new DispositivoService(prismaService);
    this.inventarioService = new InventarioService(prismaService);
  }

  async criarDispositivo(dispositivo: CreateDispositivo): Promise<Dispositivo> {
    return await this.dispositivoService.create(dispositivo);
  }

  async listarDispositivos(
    pagina?: number,
    limite?: number,
    tipo?: string,
    status?: string,
    busca?: string,
  ): Promise<{ data: Dispositivo[]; total: number }> {
    return await this.dispositivoService.findAll({
      pagina,
      limite,
      tipo: tipo as any,
      status: status as any,
      busca,
    });
  }

  async obterDispositivo(id: number): Promise<Dispositivo | null> {
    return await this.dispositivoService.findById(id);
  }

  async atualizarDispositivo(
    id: number,
    dispositivo: UpdateDispositivo,
  ): Promise<Dispositivo> {
    return await this.dispositivoService.update(id, dispositivo);
  }

  async deletarDispositivo(id: number): Promise<void> {
    return await this.dispositivoService.delete(id);
  }

  async atualizarInventarioCompleto(
    payload: AtualizarInventarioPayload,
  ): Promise<Inventario> {
    return await this.inventarioService.atualizarInventarioCompleto(payload);
  }
}
