/*
  Warnings:

  - Added the required column `valor` to the `Corrida` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Corrida" ADD COLUMN     "valor" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Pagamento" ALTER COLUMN "metodo" DROP NOT NULL;
