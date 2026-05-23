-- CreateTable
CREATE TABLE "Corrida" (
    "id" SERIAL NOT NULL,
    "passageiroId" INTEGER NOT NULL,
    "motoristaId" INTEGER NOT NULL,
    "origem" TEXT NOT NULL,
    "destino" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "inicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fim" TIMESTAMP(3),
    "valor" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Corrida_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Corrida" ADD CONSTRAINT "Corrida_passageiroId_fkey" FOREIGN KEY ("passageiroId") REFERENCES "Passageiro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Corrida" ADD CONSTRAINT "Corrida_motoristaId_fkey" FOREIGN KEY ("motoristaId") REFERENCES "Motorista"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
