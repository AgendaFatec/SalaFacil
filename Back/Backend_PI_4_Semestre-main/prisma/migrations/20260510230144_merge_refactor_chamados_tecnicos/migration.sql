CREATE TYPE "TipoProblema" AS ENUM ('Hardware', 'Software');

-- CreateTable
CREATE TABLE "chamadas_tecnicas" (
    "idChamada" SERIAL NOT NULL,
    "dataChamada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataResposta" TIMESTAMP(3),
    "anexos" VARCHAR(255),
    "tipoProblema" "TipoProblema" NOT NULL,
    "descricao" VARCHAR(255) NOT NULL,
    "status" "ChamadaStatus" NOT NULL DEFAULT 'ABERTO',
    "acoesRealizadas" TEXT,
    "salaId" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "tecnicoId" INTEGER,
    "dispositivoId" INTEGER,

    CONSTRAINT "chamadas_tecnicas_pkey" PRIMARY KEY ("idChamada")
);

-- AddForeignKey
ALTER TABLE "chamadas_tecnicas" ADD CONSTRAINT "chamadas_tecnicas_salaId_fkey" FOREIGN KEY ("salaId") REFERENCES "Sala"("idSala") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chamadas_tecnicas" ADD CONSTRAINT "chamadas_tecnicas_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chamadas_tecnicas" ADD CONSTRAINT "chamadas_tecnicas_tecnicoId_fkey" FOREIGN KEY ("tecnicoId") REFERENCES "Usuario"("userID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chamadas_tecnicas" ADD CONSTRAINT "chamadas_tecnicas_dispositivoId_fkey" FOREIGN KEY ("dispositivoId") REFERENCES "Dispositivo"("idDispositivo") ON DELETE SET NULL ON UPDATE CASCADE;
