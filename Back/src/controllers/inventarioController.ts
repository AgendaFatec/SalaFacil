import { InventarioService } from "../services/inventario/inventarioService.js";
import type {
  Inventario,
  CreateInventario,
  UpdateInventario,
  ListarInventarioQuery,
  ListarInventarioComBusca,
  SalasComInventario,
} from "../interfaces/inventario/InventarioDTO.js";
import { PrismaService } from "../database/database.js";
import { CloudinaryService } from "@/services/storage/cloudinaryService.js";


export class InventarioController {
  private inventarioService: InventarioService;

  private cloudinaryService: CloudinaryService;

  constructor() {
    const prismaService = new PrismaService();
    this.inventarioService = new InventarioService(prismaService);
    this.cloudinaryService = new CloudinaryService()
  }

  async criarInventario(inventario: CreateInventario): Promise<Inventario> {
    return await this.inventarioService.create(inventario);
  }

  async listarInventarios(
    pagina?: number,
    limite?: number,
    status?: string,
    Search_Sala?: string,
  ): Promise<{ data: Inventario[]; total: number }> {
    return await this.inventarioService.findAll({
      pagina,
      limite,
      status: status as any,
      Search_Sala,
    });
  }

  async buscaPorPalavraChave(
    busca: string,
    pagina?: number,
    limite?: number,
  ): Promise<{ data: SalasComInventario[]; total: number }> {
    return await this.inventarioService.buscarPorPalavraChave(busca, {
      pagina,
      limite,
    });
  }

  async obterInventarioPorSala(salaId: number): Promise<Inventario | null> {
    return await this.inventarioService.findBySalaId(salaId);
  }

  async obterInventario(id: number): Promise<Inventario | null> {
    return await this.inventarioService.findById(id);
  }

  async atualizarInventario(
    id: number,
    inventario: UpdateInventario,
  ): Promise<Inventario> {
    return await this.inventarioService.update(id, inventario);
  }

  async deletarInventario(id: number): Promise<void> {
    return await this.inventarioService.delete(id);
  }



  async uploadFoto(file: Express.Multer.File): Promise<{ url: string }> {
    const url = await this.cloudinaryService.uploadImage(file.buffer);
    return { url };
  }
}
