-- CreateTable
CREATE TABLE "Passageiro" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "celular" TEXT NOT NULL,

    CONSTRAINT "Passageiro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Motorista" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "celular" TEXT NOT NULL,
    "cnh" TEXT NOT NULL,
    "veiculo" TEXT NOT NULL,
    "placa" TEXT NOT NULL,

    CONSTRAINT "Motorista_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Passageiro_email_key" ON "Passageiro"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Motorista_email_key" ON "Motorista"("email");
