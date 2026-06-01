-- CreateEnum
CREATE TYPE "StatusInventario" AS ENUM ('ATIVO', 'INATIVO', 'MANUTENCAO');

-- CreateEnum
CREATE TYPE "StatusDispositivo" AS ENUM ('ATIVO', 'INATIVO', 'DANIFICADO', 'MANUTENCAO');

-- CreateEnum
CREATE TYPE "TipoAlteracao" AS ENUM ('CRIACAO', 'EDICAO', 'DELECAO', 'ADICIONAR_DISPOSITIVO', 'REMOVER_DISPOSITIVO', 'ADICIONAR_TECNOLOGIA', 'REMOVER_TECNOLOGIA', 'ALTERACAO_STATUS');

-- AlterTable
ALTER TABLE "Sala" ADD COLUMN     "capacidadeAlunos" INTEGER;

-- CreateTable
CREATE TABLE "Inventario" (
    "idInventario" SERIAL NOT NULL,
    "salaId" INTEGER NOT NULL,
    "statusInventario" "StatusInventario" NOT NULL DEFAULT 'ATIVO',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Inventario_pkey" PRIMARY KEY ("idInventario")
);

-- CreateTable
CREATE TABLE "Dispositivo" (
    "idDispositivo" SERIAL NOT NULL,
    "nomeDispositivo" VARCHAR(255) NOT NULL,
    "tipoDispositivo" "DispositvoTipo" NOT NULL,
    "patrimonio" VARCHAR(7),
    "statusDispositivo" "StatusDispositivo" NOT NULL DEFAULT 'ATIVO',
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dispositivo_pkey" PRIMARY KEY ("idDispositivo")
);

-- CreateTable
CREATE TABLE "InventarioDispositivo" (
    "id" SERIAL NOT NULL,
    "inventarioId" INTEGER NOT NULL,
    "dispositivoId" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "InventarioDispositivo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tecnologia" (
    "idTecnologia" SERIAL NOT NULL,
    "nomeTecnologia" VARCHAR(255) NOT NULL,
    "descricao" VARCHAR(500),
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tecnologia_pkey" PRIMARY KEY ("idTecnologia")
);

-- CreateTable
CREATE TABLE "InventarioTecnologia" (
    "id" SERIAL NOT NULL,
    "inventarioId" INTEGER NOT NULL,
    "tecnologiaId" INTEGER NOT NULL,

    CONSTRAINT "InventarioTecnologia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistoricoInventario" (
    "idHistorico" SERIAL NOT NULL,
    "inventarioId" INTEGER NOT NULL,
    "salaId" INTEGER NOT NULL,
    "tipoAlteracao" "TipoAlteracao" NOT NULL,
    "descricaoAlteracao" VARCHAR(500),
    "usuarioId" INTEGER,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HistoricoInventario_pkey" PRIMARY KEY ("idHistorico")
);

-- CreateTable
CREATE TABLE "DispositivoHistorico" (
    "idHistorico" SERIAL NOT NULL,
    "dispositivoId" INTEGER NOT NULL,
    "tipoAlteracao" "TipoAlteracao" NOT NULL,
    "descricaoAlteracao" VARCHAR(500),
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DispositivoHistorico_pkey" PRIMARY KEY ("idHistorico")
);

-- CreateTable
CREATE TABLE "Agendamento" (
    "idAgendamento" SERIAL NOT NULL,
    "salaId" INTEGER NOT NULL,
    "usuarioId" INTEGER,
    "dataAgendamento" TIMESTAMP(3) NOT NULL,
    "horaInicio" VARCHAR(5) NOT NULL,
    "horaFim" VARCHAR(5) NOT NULL,
    "descricao" VARCHAR(500),
    "statusAgendamento" "AgendamentoStatus" NOT NULL DEFAULT 'EM_ESPERA',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Agendamento_pkey" PRIMARY KEY ("idAgendamento")
);

-- CreateIndex
CREATE UNIQUE INDEX "Inventario_salaId_key" ON "Inventario"("salaId");

-- CreateIndex
CREATE INDEX "Inventario_salaId_idx" ON "Inventario"("salaId");

-- CreateIndex
CREATE INDEX "Inventario_statusInventario_idx" ON "Inventario"("statusInventario");

-- CreateIndex
CREATE UNIQUE INDEX "Dispositivo_patrimonio_key" ON "Dispositivo"("patrimonio");

-- CreateIndex
CREATE INDEX "Dispositivo_tipoDispositivo_idx" ON "Dispositivo"("tipoDispositivo");

-- CreateIndex
CREATE INDEX "Dispositivo_statusDispositivo_idx" ON "Dispositivo"("statusDispositivo");

-- CreateIndex
CREATE INDEX "InventarioDispositivo_inventarioId_idx" ON "InventarioDispositivo"("inventarioId");

-- CreateIndex
CREATE INDEX "InventarioDispositivo_dispositivoId_idx" ON "InventarioDispositivo"("dispositivoId");

-- CreateIndex
CREATE UNIQUE INDEX "InventarioDispositivo_inventarioId_dispositivoId_key" ON "InventarioDispositivo"("inventarioId", "dispositivoId");

-- CreateIndex
CREATE UNIQUE INDEX "Tecnologia_nomeTecnologia_key" ON "Tecnologia"("nomeTecnologia");

-- CreateIndex
CREATE INDEX "Tecnologia_nomeTecnologia_idx" ON "Tecnologia"("nomeTecnologia");

-- CreateIndex
CREATE INDEX "InventarioTecnologia_inventarioId_idx" ON "InventarioTecnologia"("inventarioId");

-- CreateIndex
CREATE INDEX "InventarioTecnologia_tecnologiaId_idx" ON "InventarioTecnologia"("tecnologiaId");

-- CreateIndex
CREATE UNIQUE INDEX "InventarioTecnologia_inventarioId_tecnologiaId_key" ON "InventarioTecnologia"("inventarioId", "tecnologiaId");

-- CreateIndex
CREATE INDEX "HistoricoInventario_inventarioId_idx" ON "HistoricoInventario"("inventarioId");

-- CreateIndex
CREATE INDEX "HistoricoInventario_salaId_idx" ON "HistoricoInventario"("salaId");

-- CreateIndex
CREATE INDEX "HistoricoInventario_tipoAlteracao_idx" ON "HistoricoInventario"("tipoAlteracao");

-- CreateIndex
CREATE INDEX "HistoricoInventario_dataCriacao_idx" ON "HistoricoInventario"("dataCriacao");

-- CreateIndex
CREATE INDEX "DispositivoHistorico_dispositivoId_idx" ON "DispositivoHistorico"("dispositivoId");

-- CreateIndex
CREATE INDEX "DispositivoHistorico_tipoAlteracao_idx" ON "DispositivoHistorico"("tipoAlteracao");

-- CreateIndex
CREATE INDEX "DispositivoHistorico_dataCriacao_idx" ON "DispositivoHistorico"("dataCriacao");

-- CreateIndex
CREATE INDEX "Agendamento_salaId_idx" ON "Agendamento"("salaId");

-- CreateIndex
CREATE INDEX "Agendamento_dataAgendamento_idx" ON "Agendamento"("dataAgendamento");

-- CreateIndex
CREATE INDEX "Agendamento_statusAgendamento_idx" ON "Agendamento"("statusAgendamento");

-- AddForeignKey
ALTER TABLE "Inventario" ADD CONSTRAINT "Inventario_salaId_fkey" FOREIGN KEY ("salaId") REFERENCES "Sala"("idSala") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventarioDispositivo" ADD CONSTRAINT "InventarioDispositivo_inventarioId_fkey" FOREIGN KEY ("inventarioId") REFERENCES "Inventario"("idInventario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventarioDispositivo" ADD CONSTRAINT "InventarioDispositivo_dispositivoId_fkey" FOREIGN KEY ("dispositivoId") REFERENCES "Dispositivo"("idDispositivo") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventarioTecnologia" ADD CONSTRAINT "InventarioTecnologia_inventarioId_fkey" FOREIGN KEY ("inventarioId") REFERENCES "Inventario"("idInventario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventarioTecnologia" ADD CONSTRAINT "InventarioTecnologia_tecnologiaId_fkey" FOREIGN KEY ("tecnologiaId") REFERENCES "Tecnologia"("idTecnologia") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricoInventario" ADD CONSTRAINT "HistoricoInventario_inventarioId_fkey" FOREIGN KEY ("inventarioId") REFERENCES "Inventario"("idInventario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricoInventario" ADD CONSTRAINT "HistoricoInventario_salaId_fkey" FOREIGN KEY ("salaId") REFERENCES "Sala"("idSala") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DispositivoHistorico" ADD CONSTRAINT "DispositivoHistorico_dispositivoId_fkey" FOREIGN KEY ("dispositivoId") REFERENCES "Dispositivo"("idDispositivo") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agendamento" ADD CONSTRAINT "Agendamento_salaId_fkey" FOREIGN KEY ("salaId") REFERENCES "Sala"("idSala") ON DELETE CASCADE ON UPDATE CASCADE;
