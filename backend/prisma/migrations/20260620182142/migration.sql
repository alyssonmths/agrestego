/*
  Warnings:

  - You are about to drop the column `passageiroId` on the `Imagem` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[imagemId]` on the table `Motorista` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[imagemId]` on the table `Passageiro` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Imagem" DROP CONSTRAINT "Imagem_passageiroId_fkey";

-- DropIndex
DROP INDEX "Imagem_passageiroId_key";

-- AlterTable
ALTER TABLE "Imagem" DROP COLUMN "passageiroId";

-- AlterTable
ALTER TABLE "Motorista" ADD COLUMN     "imagemId" INTEGER;

-- AlterTable
ALTER TABLE "Passageiro" ADD COLUMN     "imagemId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Motorista_imagemId_key" ON "Motorista"("imagemId");

-- CreateIndex
CREATE UNIQUE INDEX "Passageiro_imagemId_key" ON "Passageiro"("imagemId");

-- AddForeignKey
ALTER TABLE "Passageiro" ADD CONSTRAINT "Passageiro_imagemId_fkey" FOREIGN KEY ("imagemId") REFERENCES "Imagem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Motorista" ADD CONSTRAINT "Motorista_imagemId_fkey" FOREIGN KEY ("imagemId") REFERENCES "Imagem"("id") ON DELETE SET NULL ON UPDATE CASCADE;
