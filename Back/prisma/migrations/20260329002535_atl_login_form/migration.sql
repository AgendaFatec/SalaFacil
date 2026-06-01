/*
  Warnings:

  - A unique constraint covering the columns `[userEmail]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Sala" ALTER COLUMN "fotoSala" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "tipoUser" "TipoUser" NOT NULL DEFAULT 'DOCENTE';

-- CreateIndex
CREATE INDEX "Sala_tipoSala_idx" ON "Sala"("tipoSala");

-- CreateIndex
CREATE INDEX "Sala_idSala_idx" ON "Sala"("idSala");

-- CreateIndex
CREATE INDEX "Sala_disponibilidadeSala_idx" ON "Sala"("disponibilidadeSala");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_userEmail_key" ON "Usuario"("userEmail");

-- CreateIndex
CREATE INDEX "Usuario_userID_idx" ON "Usuario"("userID");

-- CreateIndex
CREATE INDEX "Usuario_userNome_idx" ON "Usuario"("userNome");

-- CreateIndex
CREATE INDEX "Usuario_tipoUser_idx" ON "Usuario"("tipoUser");
