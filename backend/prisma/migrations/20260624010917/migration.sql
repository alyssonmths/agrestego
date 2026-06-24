-- CreateEnum
CREATE TYPE "MetodoPagamento" AS ENUM ('CARTAO', 'PIX', 'DINHEIRO');

-- CreateEnum
CREATE TYPE "StatusPagamento" AS ENUM ('PENDENTE', 'PAGO', 'FALHOU', 'REEMBOLSADO');

-- CreateTable
CREATE TABLE "Pagamento" (
    "id" SERIAL NOT NULL,
    "corridaId" INTEGER NOT NULL,
    "metodo" "MetodoPagamento" NOT NULL,
    "status" "StatusPagamento" NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "transacaoId" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pagamento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pagamento_corridaId_key" ON "Pagamento"("corridaId");

-- AddForeignKey
ALTER TABLE "Pagamento" ADD CONSTRAINT "Pagamento_corridaId_fkey" FOREIGN KEY ("corridaId") REFERENCES "Corrida"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
