/*
  Warnings:

  - A unique constraint covering the columns `[nomeSala]` on the table `Sala` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "chamadas_tecnicas" ADD COLUMN     "dispositivoNome" TEXT,
ADD COLUMN     "patrimonio" TEXT;

-- CreateTable
CREATE TABLE "TecnologiaSolicitada" (
    "idTecnologia" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "versao" TEXT NOT NULL,
    "chamadoId" INTEGER NOT NULL,

    CONSTRAINT "TecnologiaSolicitada_pkey" PRIMARY KEY ("idTecnologia")
);

-- CreateIndex
CREATE UNIQUE INDEX "Sala_nomeSala_key" ON "Sala"("nomeSala");

-- AddForeignKey
ALTER TABLE "TecnologiaSolicitada" ADD CONSTRAINT "TecnologiaSolicitada_chamadoId_fkey" FOREIGN KEY ("chamadoId") REFERENCES "chamadas_tecnicas"("idChamada") ON DELETE RESTRICT ON UPDATE CASCADE;
