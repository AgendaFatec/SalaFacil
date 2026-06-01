import { PrismaService } from "../src/database/database.js"
import { TipoUser, StatusConta, TipoSala, DispositvoTipo } from '@prisma/client'
import 'dotenv/config' 
import {CloudinaryService} from "../src/services/storage/cloudinaryService.js"
import { migrateLocalImages } from "../src/utils/migrateImages.js";
// import { string } from "zod";

const prisma = new PrismaService()
const cloudinaryService = new CloudinaryService();
async function main() {
  const urlsCloudinary = await migrateLocalImages();
  const emailAdmin = process.env.EMAIL_ADM_SEED;
  const emailTi = process.env.EMAIL_TI_SEED;
  const emailDocente = process.env.EMAIL_DOCENTE_SEED;

  if (!emailAdmin) {
    console.error("ERRO: Variável EMAIL_ADM_SEED não definida no .env");
    return;
  }
  if (!emailTi) {
    console.error("ERRO: Variável EMAIL_TI_SEED não definida no .env");
    return;
  }
  if (!emailDocente) {
    console.error("ERRO: Variável EMAIL_DOCENTE_SEED não definida no .env");
    return;
  }

  const admin = await prisma.usuario.upsert({
    where: { userEmail: emailAdmin },
    update: {
      tipoUser: TipoUser.ADM,
      statusUser: StatusConta.CONVIDADA
    },
    create: {
      userEmail: emailAdmin,
      tipoUser: TipoUser.ADM,
      statusUser: StatusConta.CONVIDADA,
      criadoDate: new Date(),
      adm: { create: {} }
    },
  })
  
  const ti = await prisma.usuario.upsert({
    where: { userEmail: emailTi },
    update: {
      tipoUser: TipoUser.TI,
      statusUser: StatusConta.CONVIDADA,
    },
    create: {
      userEmail: emailTi,
      tipoUser: TipoUser.TI,
      statusUser: StatusConta.CONVIDADA,
      criadoDate: new Date(),
      ti: { create: {} }
    }
  })

  const docente = await prisma.usuario.upsert({
    where: { userEmail: emailDocente },
    update: {
      tipoUser: TipoUser.DOCENTE,
      statusUser: StatusConta.CONVIDADA,
    },
    create: {
      userEmail: emailDocente,
      tipoUser: TipoUser.DOCENTE,
      statusUser: StatusConta.CONVIDADA,
      criadoDate: new Date(),
      docente: { create: {} }
    }
  })

  console.log(`✅ Seed finalizado! Admin configurado: ${admin.userEmail}`)
  console.log(`✅ Seed finalizado! Ti configurado: ${ti.userEmail}`)
  console.log(`✅ Seed finalizado! Docente configurado: ${docente.userEmail}`)



  console.log("🛠️ Gerando dados da Sala 30 para testes de Frontend...");


  const urlsMap = await migrateLocalImages(); 

  const salasData = [
    { nome: "Sala 11", cap: 30, tipo: TipoSala.COMUN, folder: "sala11", pcQtd: 30, tech: "Excel" },
    { nome: "Sala 19", cap: 30, tipo: TipoSala.COMUN, folder: "sala19", pcQtd: 30, tech: "VS Code" },
    { nome: "Sala 33", cap: 30, tipo: TipoSala.COMUN, folder: "sala33", pcQtd: 30, tech: "Office" },
    { nome: "Sala 38", cap: 30, tipo: TipoSala.COMUN, folder: "sala38", pcQtd: 30, tech: "AutoCAD" },
    { nome: "Cad I", cap: 40, tipo: TipoSala.LAB, folder: "cad1", pcQtd: 40, tech: "VS Code" },
  ];

  for (const s of salasData) {
    const foto = urlsMap[s.folder] || cloudinaryService.getPlaceholderUrl('sala_exemplo');

    const sala = await prisma.sala.upsert({
      where: { nomeSala: s.nome },
      update: { fotoSala: foto },
      create: {
        nomeSala: s.nome,
        tipoSala: s.tipo,
        disponibilidadeSala: true,
        qtdeSala: 1,
        capacidadeAlunos: s.cap,
        fotoSala: foto
      }
    });

    const inventario = await prisma.inventario.upsert({
      where: { salaId: sala.idSala },
      update: {},
      create: { salaId: sala.idSala }
    });

    const tech = await prisma.tecnologia.upsert({
      where: { nomeTecnologia: s.tech },
      update: {},
      create: { nomeTecnologia: s.tech, descricao: `Software ${s.tech}` }
    });

    await prisma.inventarioTecnologia.upsert({
      where: { inventarioId_tecnologiaId: { inventarioId: inventario.idInventario, tecnologiaId: tech.idTecnologia } },
      update: {},
      create: { inventarioId: inventario.idInventario, tecnologiaId: tech.idTecnologia }
    });

    let pc = await prisma.dispositivo.findFirst({ where: { nomeDispositivo: 'Computador Positivo' } });
    if (!pc) {
      pc = await prisma.dispositivo.create({
        data: { nomeDispositivo: 'Computador Positivo', tipoDispositivo: DispositvoTipo.DESKTOP }
      });
    }

    await prisma.inventarioDispositivo.upsert({
      where: { inventarioId_dispositivoId: { inventarioId: inventario.idInventario, dispositivoId: pc.idDispositivo } },
      update: { quantidade: s.pcQtd },
      create: { inventarioId: inventario.idInventario, dispositivoId: pc.idDispositivo, quantidade: s.pcQtd }
    });

    console.log(`\n\n\ ${s.nome} configurada e vinculada com sucesso!`);
  }
}

main()
.then(async () => {
  await prisma.$disconnect();
})
.catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});