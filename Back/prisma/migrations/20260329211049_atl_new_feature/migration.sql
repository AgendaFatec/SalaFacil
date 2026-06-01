-- CreateEnum
CREATE TYPE "StatusConta" AS ENUM ('DESATIVADA', 'ATIVA', 'CONVIDADA');

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "statusUser" "StatusConta" NOT NULL DEFAULT 'CONVIDADA';
