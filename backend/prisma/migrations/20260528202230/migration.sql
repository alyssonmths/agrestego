/*
  Warnings:

  - Changed the type of `status` on the `Corrida` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "StatusCorrida" AS ENUM ('SOLICITADA', 'CANCELADA', 'INICIADA', 'FINALIZADA');

-- DropForeignKey
ALTER TABLE "Corrida" DROP CONSTRAINT "Corrida_motoristaId_fkey";

-- AlterTable
ALTER TABLE "Corrida" ALTER COLUMN "motoristaId" DROP NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "StatusCorrida" NOT NULL;

-- CreateTable
CREATE TABLE "Bairro" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "Bairro_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Corrida" ADD CONSTRAINT "Corrida_motoristaId_fkey" FOREIGN KEY ("motoristaId") REFERENCES "Motorista"("id") ON DELETE SET NULL ON UPDATE CASCADE;
