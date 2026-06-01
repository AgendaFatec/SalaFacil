/*
  Warnings:

  - The primary key for the `Docente` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `decenteID` on the `Docente` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Docente" DROP CONSTRAINT "Docente_pkey",
DROP COLUMN "decenteID",
ADD COLUMN     "docenteID" SERIAL NOT NULL,
ADD CONSTRAINT "Docente_pkey" PRIMARY KEY ("docenteID");
