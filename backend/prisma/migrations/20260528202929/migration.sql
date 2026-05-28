/*
  Warnings:

  - You are about to drop the column `destino` on the `Corrida` table. All the data in the column will be lost.
  - You are about to drop the column `origem` on the `Corrida` table. All the data in the column will be lost.
  - Added the required column `destinoId` to the `Corrida` table without a default value. This is not possible if the table is not empty.
  - Added the required column `origemId` to the `Corrida` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Corrida" DROP COLUMN "destino",
DROP COLUMN "origem",
ADD COLUMN     "destinoId" INTEGER NOT NULL,
ADD COLUMN     "origemId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Corrida" ADD CONSTRAINT "Corrida_origemId_fkey" FOREIGN KEY ("origemId") REFERENCES "Bairro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Corrida" ADD CONSTRAINT "Corrida_destinoId_fkey" FOREIGN KEY ("destinoId") REFERENCES "Bairro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
