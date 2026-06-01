import { TecnologiaService } from "../services/tecnologia/tecnologiaService.js";
import * as TecnologiaDTOs from "../interfaces/tecnologia/TecnologiaDTO.js";
import { PrismaService } from "../database/database.js";

export class TecnologiaController {
  private tecnologiaService: TecnologiaService;

  constructor() {
    const prismaService = new PrismaService();
    this.tecnologiaService = new TecnologiaService(prismaService);
  }

  async criarTecnologia(
    tecnologia: TecnologiaDTOs.CreateTecnologia,
  ): Promise<TecnologiaDTOs.Tecnologia> {
    return await this.tecnologiaService.create(tecnologia);
  }

  async listarTecnologias(
    pagina?: number,
    limite?: number,
    busca?: string,
  ): Promise<{ data: TecnologiaDTOs.Tecnologia[]; total: number }> {
    return await this.tecnologiaService.findAll({
      pagina,
      limite,
      busca,
    });
  }

  async obterTecnologia(id: number): Promise<TecnologiaDTOs.Tecnologia | null> {
    return await this.tecnologiaService.findById(id);
  }

  async atualizarTecnologia(
    id: number,
    tecnologia: TecnologiaDTOs.UpdateTecnologia,
  ): Promise<TecnologiaDTOs.Tecnologia> {
    return await this.tecnologiaService.update(id, tecnologia);
  }

  async deletarTecnologia(id: number): Promise<void> {
    return await this.tecnologiaService.delete(id);
  }
}
