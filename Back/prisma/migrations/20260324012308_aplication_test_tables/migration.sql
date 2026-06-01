-- CreateEnum
CREATE TYPE "TipoSala" AS ENUM ('COMUN', 'LAB', 'ARMAZEM');

-- CreateEnum
CREATE TYPE "AgendamentoStatus" AS ENUM ('AGENDADO', 'CANCELADO', 'EM_ESPERA');

-- CreateEnum
CREATE TYPE "TipoUser" AS ENUM ('DOCENTE', 'TI', 'ADM');

-- CreateEnum
CREATE TYPE "ChamadaStatus" AS ENUM ('ABERTO', 'EM_ATENDIMENTO', 'RESOLVIDO');

-- CreateEnum
CREATE TYPE "DispositvoTipo" AS ENUM ('TV', 'NOTEBOOK', 'DESKTOP', 'PROJETOR');

-- CreateTable
CREATE TABLE "Usuario" (
    "userID" SERIAL NOT NULL,
    "microsoft_sub" TEXT NOT NULL,
    "userNome" VARCHAR(255) NOT NULL,
    "userEmail" VARCHAR(255) NOT NULL,
    "userSenha" VARCHAR(255) NOT NULL,
    "criadoDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("userID")
);

-- CreateTable
CREATE TABLE "TI" (
    "tiID" SERIAL NOT NULL,
    "fk_userID" INTEGER NOT NULL,

    CONSTRAINT "TI_pkey" PRIMARY KEY ("tiID")
);

-- CreateTable
CREATE TABLE "Docente" (
    "decenteID" SERIAL NOT NULL,
    "fk_userID" INTEGER NOT NULL,

    CONSTRAINT "Docente_pkey" PRIMARY KEY ("decenteID")
);

-- CreateTable
CREATE TABLE "ADM" (
    "admID" SERIAL NOT NULL,
    "fk_userID" INTEGER NOT NULL,

    CONSTRAINT "ADM_pkey" PRIMARY KEY ("admID")
);

-- CreateTable
CREATE TABLE "Sala" (
    "idSala" SERIAL NOT NULL,
    "nomeSala" VARCHAR(255) NOT NULL,
    "tipoSala" "TipoSala" NOT NULL DEFAULT 'COMUN',
    "disponibilidadeSala" BOOLEAN NOT NULL,
    "fotoSala" VARCHAR(255) NOT NULL,
    "qtdeSala" INTEGER NOT NULL,

    CONSTRAINT "Sala_pkey" PRIMARY KEY ("idSala")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_microsoft_sub_key" ON "Usuario"("microsoft_sub");

-- CreateIndex
CREATE UNIQUE INDEX "TI_fk_userID_key" ON "TI"("fk_userID");

-- CreateIndex
CREATE UNIQUE INDEX "Docente_fk_userID_key" ON "Docente"("fk_userID");

-- CreateIndex
CREATE UNIQUE INDEX "ADM_fk_userID_key" ON "ADM"("fk_userID");

-- AddForeignKey
ALTER TABLE "TI" ADD CONSTRAINT "TI_fk_userID_fkey" FOREIGN KEY ("fk_userID") REFERENCES "Usuario"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Docente" ADD CONSTRAINT "Docente_fk_userID_fkey" FOREIGN KEY ("fk_userID") REFERENCES "Usuario"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ADM" ADD CONSTRAINT "ADM_fk_userID_fkey" FOREIGN KEY ("fk_userID") REFERENCES "Usuario"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;
