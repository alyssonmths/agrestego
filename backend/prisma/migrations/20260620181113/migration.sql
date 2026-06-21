-- CreateTable
CREATE TABLE "Imagem" (
    "id" SERIAL NOT NULL,
    "passageiroId" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "arquivo" BYTEA NOT NULL,

    CONSTRAINT "Imagem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Imagem_passageiroId_key" ON "Imagem"("passageiroId");

-- AddForeignKey
ALTER TABLE "Imagem" ADD CONSTRAINT "Imagem_passageiroId_fkey" FOREIGN KEY ("passageiroId") REFERENCES "Passageiro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
