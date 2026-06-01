import { PrismaService } from "@/database/database.js";
import type { TipoUser } from "@prisma/client";


export class UsuariosService {
    constructor(private prisma: PrismaService) {}

    async getInfoCompleta(userId: number) {
        return await this.prisma.usuario.findUnique({
            where: { userID: userId },
            select: {
                userID: true,
                userNome: true,
                userEmail: true,
                tipoUser: true,
                statusUser: true,
                criadoDate: true,
            }
        });
    }

    async getUserPhoto(userId: number): Promise<Buffer | null> {
        const user = await this.prisma.usuario.findUnique({
            where: { userID: userId },
            select: { fotoUrl: true }
        });

        if (!user || !user.fotoUrl) return null;

        const base64Data = user.fotoUrl.replace(/^data:image\/\w+;base64,/, "");
        return Buffer.from(base64Data, 'base64');
    }

    async listAll() {
    return await this.prisma.usuario.findMany({
      select: {
        userID: true,
        userNome: true,
        userEmail: true,
        tipoUser: true,
        statusUser: true,
      },
      orderBy: { userNome: 'asc' }
    });
  }

  async findById(id: number) {
    return await this.prisma.usuario.findUnique({
      where: { userID: id },
      include: {
        docente: true,
        ti: true,
        adm: true
      }
    });
  }

  async findByName(nome: string) {
    return await this.prisma.usuario.findMany({
      where: {
        userNome: { contains: nome, mode: 'insensitive' }
      }
    });
  }
  async deleteUser(userId: number) {
    await this.prisma.docente.deleteMany({ where: { fk_userID: userId } });
    await this.prisma.tI.deleteMany({ where: { fk_userID: userId } });
    await this.prisma.aDM.deleteMany({ where: { fk_userID: userId } });
    
  return await this.prisma.usuario.delete({ where: { userID: userId } });
}

}